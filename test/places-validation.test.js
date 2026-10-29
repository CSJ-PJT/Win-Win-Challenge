'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {createApp}=require('../server');

async function fixture(t,documents){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ansim-place-validation-'));
  let upstreamCalls=0;
  const app=createApp({dataFile:path.join(dir,'state.json'),mapKey:'synthetic-test-key',
    mapFetch:async()=>{upstreamCalls++;return {ok:true,json:async()=>({documents})};}});
  await new Promise(resolve=>app.listen(0,'127.0.0.1',resolve));
  t.after(async()=>{await new Promise(resolve=>app.close(resolve));fs.rmSync(dir,{recursive:true,force:true});});
  const base='http://127.0.0.1:'+app.address().port;
  const boot=await(await fetch(base+'/api/bootstrap')).json();
  const headers={Authorization:'Bearer '+boot.tokens.vehicle};
  return {async places(){const r=await fetch(base+'/api/places?query=Seoul',{headers});return {status:r.status,data:await r.json()};},
    async state(){return (await(await fetch(base+'/api/state',{headers})).json()).state;},
    calls:()=>upstreamCalls};
}
const place=(y,x)=>({place_name:'Public fixture',road_address_name:'Public fixture address',y,x});
test('places rejects missing, coercible and out-of-range coordinates without changing visit state',async t=>{
  const invalid=[{},place(null,'127'),place('','127'),place('  ','127'),place(false,'127'),
    place(true,'127'),place([],127),place('37',{}),place('91','127'),place('-91','127'),
    place('37','181'),place('37','-181'),place('Infinity','127'),place('NaN','127')];
  const f=await fixture(t,invalid),before=await f.state();
  const r=await f.places();assert.equal(r.status,200);assert.deepEqual(r.data,{places:[]});
  assert.deepEqual(await f.state(),before);assert.equal(f.calls(),1);
});
test('places retains real zeroes, numeric strings and boundary coordinates',async t=>{
  const f=await fixture(t,[place('37.5663','126.9779'),place(0,0),place('-90','180')]);
  const r=await f.places();assert.equal(r.status,200);
  assert.deepEqual(r.data.places.map(p=>[p.latitude,p.longitude]),[[37.5663,126.9779],[0,0],[-90,180]]);
});
test('places selects at most five valid results after filtering invalid entries',async t=>{
  const f=await fixture(t,[...Array.from({length:5},()=>place('','')), ...Array.from({length:7},(_,i)=>place(30+i,120+i))]);
  const r=await f.places();assert.equal(r.status,200);
  assert.deepEqual(r.data.places.map(p=>[p.latitude,p.longitude]),[[30,120],[31,121],[32,122],[33,123],[34,124]]);
});
test('places returns a recoverable upstream error for a malformed documents container',async t=>{
  const f=await fixture(t,{unexpected:'object'}),before=await f.state();
  const r=await f.places();assert.equal(r.status,502);assert.deepEqual(r.data,{error:'MAP_UNAVAILABLE'});
  assert.deepEqual(await f.state(),before);
});

test('places ignores null documents without discarding valid siblings',async t=>{
  const f=await fixture(t,[null,place('37','127'),null]);
  const r=await f.places();assert.equal(r.status,200);
  assert.deepEqual(r.data.places.map(p=>[p.latitude,p.longitude]),[[37,127]]);
});

