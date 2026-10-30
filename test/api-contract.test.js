'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');const os=require('node:os');const path=require('node:path');
const {createApp}=require('../server');
async function fixture(t){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ansim-api-'));
  const server=createApp({dataFile:path.join(dir,'state.json')});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  t.after(async()=>{await new Promise(r=>server.close(r));fs.rmSync(dir,{recursive:true,force:true});});
  const base='http://127.0.0.1:'+server.address().port;
  let boot=await (await fetch(base+'/api/bootstrap')).json();
  async function request(url,role,body){
    const headers=role?{Authorization:'Bearer '+boot.tokens[role]}:{};
    const res=await fetch(base+url,{method:body===undefined?'GET':'POST',headers,body:body===undefined?undefined:JSON.stringify(body)});
    const data=await res.json();
    t.diagnostic(JSON.stringify({url,status:res.status,error:data.error,state:data.state?.state}));
    return {status:res.status,data};
  }
  return {request,async reset(scenario){const old=boot.tokens.vehicle;const r=await request('/api/reset','simulator',{scenario});assert.equal(r.status,200);assert.equal((await fetch(base+'/api/state',{headers:{Authorization:'Bearer '+old}})).status,401);boot=await (await fetch(base+'/api/bootstrap')).json();},async event(type,payload={},role='vehicle'){
    const {data:{state}}=await request('/api/state',role);
    return request('/api/events',role,{tripId:state.id,expectedVersion:state.version,key:crypto.randomUUID(),event:{type,payload}});
  }};
}
test('HTTP API rejects non-object JSON bodies without changing state',async t=>{
  const f=await fixture(t);
  for(const url of ['/api/events','/api/reset'])for(const value of [null,[],true,42,'invalid']){
    const r=await f.request(url,'simulator',value);assert.equal(r.status,400);assert.equal(r.data.error,'JSON_OBJECT');
    assert.equal((await f.request('/api/state','vehicle')).data.state.version,0);
  }
  for(const url of ['/api/events','/api/reset']){
    const r=await f.request(url,'simulator',{note:'x'.repeat(9000)});
    assert.equal(r.status,413);assert.equal(r.data.error,'SIZE');
    assert.equal((await f.request('/api/state','vehicle')).data.state.version,0);
  }
});
test('HTTP routes and independent roles complete a real local-server handoff',async t=>{
  const f=await fixture(t);
  assert.equal((await f.request('/api/health')).data.status,'ok');
  assert.equal((await f.request('/api/state')).status,401);
  assert.equal((await f.request('/api/places?query=a','vehicle')).status,400);
  assert.equal((await f.request('/api/places?query=서울','vehicle')).status,503);
  assert.equal((await f.request('/api/unknown')).status,404);
  assert.equal((await f.request('/api/reset','guardian',{})).status,403);
  await f.reset('kindergarten');
  const ok=async(type,payload,role)=>{const r=await f.event(type,payload,role);assert.equal(r.status,200);return r.data.state;};
  await ok('VEHICLE',{known:true,restricted:false,gear:'P',speed:0},'simulator');
  await ok('READY',{ready:true},'facility');
  await ok('DEPART');await ok('ARRIVE',{},'simulator');
  const issued=await ok('ISSUE_CODE');assert.match(issued.challenge.code,/^\d{6}$/);
  assert.equal((await f.request('/api/state','guardian')).data.state.challenge.code,undefined);
  assert.equal((await ok('SENDER_CONFIRM',{inPerson:true})).state,'VERIFYING');
  const received=await ok('RECEIVER_CONFIRM',{inPerson:true,code:issued.challenge.code},'facility');
  assert.equal(received.state,'COMPLETED');
  assert.equal((await f.request('/api/state','guardian')).data.state.state,'COMPLETED');
});
test('HTTP easy arrival is acknowledged independently of handoff completion',async t=>{
  const f=await fixture(t);await f.reset('senior');
  assert.equal((await f.event('NOTIFY_ARRIVAL',{},'visitor')).data.error,'CONSENT');
  assert.equal((await f.event('SELF_CONSENT',{accepted:true},'visitor')).status,200);
  assert.equal((await f.event('NOTIFY_ARRIVAL',{},'visitor')).status,200);
  const ack=await f.event('ACK_ARRIVAL_NOTICE',{},'facility');
  assert.equal(ack.status,200);assert.ok(ack.data.state.arrivalNotice.acknowledgedAt);
  assert.equal(ack.data.state.state,'PLANNED');assert.equal(ack.data.state.completedAt,null);
});
