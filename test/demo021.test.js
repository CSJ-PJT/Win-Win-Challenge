'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const H=require('../web/core'),U=require('../web/ui');
const now=1800000000000;
function seed(s){for(const [type,payload,role] of U.initialPresentationEvents(s))s=H.apply(s,{type,payload},{role,id:role==='facility'?'staff-001':role},{now,code:'123456'}).state;return s;}
test('presentation prepares departure without changing fail-closed domain defaults',()=>{
 const raw=H.createTrip('kindergarten',now);assert.equal(H.safeVehicle(raw,now),false);assert.equal(raw.ready,false);
 const s=seed(raw);assert.equal(H.safeVehicle(s,now),true);assert.equal(H.readyNow(s,now),true);assert.equal(s.senderConfirmed,false);assert.equal(s.receiverConfirmed,false);assert.equal(s.state,'PLANNED');
 assert.equal(H.apply(s,{type:'DEPART'},{role:'vehicle'},{now}).state.state,'EN_ROUTE');
});
test('demo preparation never grants adult consent',()=>{for(const key of ['senior','community']){const s=seed(H.createTrip(key,now));assert.equal(s.consent,false);assert.throws(()=>H.apply(s,{type:'NOTIFY_ARRIVAL'},{role:'visitor'},{now}),e=>e.code==='CONSENT');}});
test('presentation does not overwrite an intentional unknown or driving state',()=>{
 let s=seed(H.createTrip('kindergarten',now));
 s=H.apply(s,{type:'VEHICLE',payload:{known:false,restricted:true,gear:'UNKNOWN',speed:null}},{role:'simulator'},{now}).state;
 assert.deepEqual(U.initialPresentationEvents(s),[]);assert.equal(H.safeVehicle(s,now),false);
});
test('presentation preparation is idempotent and leaves closed visits alone',()=>{
 const s=seed(H.createTrip('kindergarten',now));assert.deepEqual(U.initialPresentationEvents(s),[]);
 for(const state of ['COMPLETED','CANCELLED','ARRIVED','VERIFYING'])assert.deepEqual(U.initialPresentationEvents({...s,state}),[]);
});
test('return to arrival zone is simulator-only and never confirms either person',()=>{
 let s=seed(H.createTrip('kindergarten',now));s=H.apply(s,{type:'DEPART'},{role:'vehicle'},{now}).state;
 s=H.apply(s,{type:'ARRIVE'},{role:'simulator'},{now}).state;s=H.apply(s,{type:'LEAVE_AREA'},{role:'simulator'},{now}).state;
 assert.throws(()=>H.apply(s,{type:'RETURN_AREA'},{role:'facility'},{now}),e=>e.code==='FORBIDDEN');
 s=H.apply(s,{type:'RETURN_AREA'},{role:'simulator'},{now}).state;assert.equal(s.locationInside,true);assert.equal(s.state,'ARRIVED');assert.equal(s.senderConfirmed,false);assert.equal(s.receiverConfirmed,false);
});
test('standalone bundle explicitly opts out of the HTTP API on loopback origins',()=>{
 const fs=require('node:fs');assert.match(fs.readFileSync('tools/bundle.js','utf8'),/window\.ANSIM_STANDALONE=true/);
 assert.match(fs.readFileSync('web/app.js','utf8'),/!window\.ANSIM_STANDALONE/);
});
