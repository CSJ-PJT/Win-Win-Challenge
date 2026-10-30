'use strict';
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {createApp}=require('./server');
delete process.env.KAKAO_REST_API_KEY;
let assertions=0,requests=0;const cases=[],errors=[];const originalError=console.error;
console.error=(...args)=>errors.push({type:'server persistence rejection',errno:args.join(' ').match(/EISDIR|ENOTDIR|EEXIST|EACCES/)?.[0]||'OTHER'});
const eq=(a,b,label)=>{assert.deepEqual(a,b,label);assertions++;};
async function scenario(label,mode,finalHandoff=false,reset=false){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'asdh-persist-')),dataFile=path.join(dir,'synthetic.json');let server,base,boot;
 async function start(){server=createApp({dataFile});await new Promise(r=>server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+server.address().port;}
 async function stop(){if(server){await new Promise(r=>server.close(r));server=null;}}
 async function req(url,role,body){const r=await fetch(base+url,{method:body===undefined?'GET':'POST',headers:role?{Authorization:'Bearer '+boot.tokens[role],'Content-Type':'application/json'}:{},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(3000)});const d=await r.json();requests++;return {status:r.status,data:d};}
 async function state(){return (await req('/api/state','vehicle')).data.state;}
 async function post(type,payload={},role='vehicle'){const s=await state(),body={tripId:s.id,key:crypto.randomUUID(),expectedVersion:s.version,event:{type,payload}};const r=await req('/api/events',role,body);eq(r.status,200,'setup event '+type);return r.data.state;}
 try{await start();boot=(await req('/api/bootstrap')).data;
  await post('READY',{ready:true},'facility');
  let role='facility',type='READY',payload={ready:false};
  if(finalHandoff){await post('VEHICLE',{known:true,restricted:false,gear:'P',speed:0},'simulator');await post('DEPART');await post('ARRIVE',{},'simulator');const issued=await post('ISSUE_CODE');await post('SENDER_CONFIRM',{inPerson:true});type='RECEIVER_CONFIRM';payload={inPerson:true,code:issued.challenge.code};}
  const before=await state(),diskBefore=fs.readFileSync(dataFile),recordBefore=JSON.parse(diskBefore);const bootBefore=(await req('/api/bootstrap')).data;
  const endpoint=reset?'/api/reset':'/api/events';if(reset)role='simulator';
  const body=reset?{scenario:'senior'}:{tripId:before.id,key:crypto.randomUUID(),expectedVersion:before.version,event:{type,payload}};
  const backup=path.join(dir,'preserved.json');
  if(mode==='open'){fs.mkdirSync(dataFile+'.tmp');}else{fs.renameSync(dataFile,backup);fs.mkdirSync(dataFile);}
  const failed=await req(endpoint,role,body);
  eq(failed.status,500,'failed persistence must not succeed');eq(failed.data.error,'EISDIR','actual filesystem error code');eq(failed.data.message,'저장 또는 처리에 실패했습니다. 완료로 처리하지 않았습니다.','generic message hides file path');eq(failed.data.state,undefined,'failure response has no completed state');eq(await state(),before,'in-memory state/version/challenge unchanged');eq((await req('/api/bootstrap')).data,bootBefore,'session tokens and trip unchanged');
  if(mode==='open'){eq(fs.readFileSync(dataFile),diskBefore,'original store bytes unchanged');fs.rmdirSync(dataFile+'.tmp');}
  else {eq(fs.readFileSync(backup),diskBefore,'original preserved store bytes unchanged');eq(fs.statSync(dataFile+'.tmp').mode&0o777,0o600,'provisional temp stays private');fs.rmdirSync(dataFile);fs.renameSync(backup,dataFile);}
  eq(JSON.parse(fs.readFileSync(dataFile)).receipts,recordBefore.receipts,'no receipt committed on failure');
  const retry=await req(endpoint,role,body);eq(retry.status,200,'same request works after storage recovery');
  if(reset){eq(retry.data.reset,true,'reset applied');eq((await req('/api/state','vehicle')).status,401,'old session invalid only after successful reset');boot=(await req('/api/bootstrap')).data;eq((await state()).version,0,'fresh reset version');eq((await state()).scenario,'senior','reset scenario');}
  else {eq(retry.data.state.version,before.version+1,'one transition after retry');eq(retry.data.replayed,undefined,'failed write did not create replay receipt');if(finalHandoff)eq(retry.data.state.state,'COMPLETED','completion only after durable retry');const replay=await req(endpoint,role,body);eq(replay.data.replayed,true,'duplicate suppressed');eq(replay.data.state.version,retry.data.state.version,'duplicate does not advance version');eq(Object.keys(JSON.parse(fs.readFileSync(dataFile)).receipts).length,Object.keys(recordBefore.receipts).length+1,'one durable receipt');}
  const after=await state();await stop();await start();eq(await state(),after,'recovered state survives actual server restart');
  if(!reset){const replay=await req(endpoint,role,body);eq(replay.data.replayed,true,'receipt survives server restart');eq(replay.data.state.version,after.version,'restart replay stays at same version');}
  cases.push({name:label,filesystem_failure:mode==='open'?'real EISDIR opening temporary file':'real EISDIR renaming over directory',status:'PASS',failed_status:500,retry_status:200,original_store_and_receipts_preserved:true,completion_after_recovery_only:finalHandoff,reset});
 }catch(e){cases.push({name:label,status:'FAIL',message:e.message});throw e;}
 finally{await stop();fs.rmSync(dir,{recursive:true,force:true});}
}
(async()=>{let failure;try{await scenario('ordinary event temporary-file open failure','open');await scenario('final handoff temporary-file open failure','open',true);await scenario('final handoff atomic rename failure','rename',true);await scenario('reset temporary-file open failure','open',false,true);}catch(e){failure={name:e.name,message:e.message};}finally{console.error=originalError;const result={observed_at:new Date().toISOString(),source:'b37287ef63a164c6eeedd41e6aeb3be9170b2882',node:process.version,transport:'real HTTP bound only to 127.0.0.1',filesystem:'real temporary synthetic stores; no fs monkeypatch',cases,passed:cases.filter(x=>x.status==='PASS').length,total:4,http_requests:requests,assertions,expected_server_errors:errors,temporary_stores_removed:true,external_calls:0,phone_tests:0,builds:0,installs:0,...(failure?{failure}:{})};fs.writeFileSync(path.join(__dirname,'result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));if(failure)process.exitCode=1;}})();
