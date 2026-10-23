'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const H=require('../web/core');
const U=require('../web/ui');
const visitor={role:'visitor',id:'visitor-001'}, staff={role:'facility',id:'staff-001'};
function apply(s,type,payload={},actor=visitor){return H.apply(s,{type,payload},actor,{now:1001,code:'123456'}).state;}
function agreed(scenario='senior'){return apply(H.createTrip(scenario,1000,'easy-test'),'SELF_CONSENT',{accepted:true});}
test('easy mode requires explicit adult consent',()=>{const s=H.createTrip('senior',1000);assert.throws(()=>apply(s,'NOTIFY_ARRIVAL'),e=>e.code==='CONSENT');});
test('self reported arrival does not change vehicle, location or handoff state',()=>{const s=agreed();const next=apply(s,'NOTIFY_ARRIVAL');assert.equal(next.state,'PLANNED');assert.equal(next.locationInside,false);assert.equal(next.senderConfirmed,false);assert.equal(next.receiverConfirmed,false);assert.equal(next.completedAt,null);assert.deepEqual(next.vehicle,s.vehicle);assert.equal(next.arrivalNotice.source,'SELF_REPORTED');});
test('a second arrival notification is rejected',()=>{const s=apply(agreed(),'NOTIFY_ARRIVAL');assert.throws(()=>apply(s,'NOTIFY_ARRIVAL'),e=>e.code==='ALREADY_NOTIFIED');});
test('staff acknowledgment is not handoff confirmation',()=>{const s=apply(agreed(),'NOTIFY_ARRIVAL');const next=apply(s,'ACK_ARRIVAL_NOTICE',{},staff);assert.equal(next.arrivalNotice.acknowledgedAt,1001);assert.equal(next.state,'PLANNED');assert.equal(next.receiverConfirmed,false);});
test('only the assigned staff may acknowledge an arrival notice',()=>{const s=apply(agreed(),'NOTIFY_ARRIVAL');assert.throws(()=>apply(s,'ACK_ARRIVAL_NOTICE',{}, {role:'facility',id:'other'}),e=>e.code==='RECEIVER');});
test('visitor cannot issue handoff codes or confirm receipt',()=>{const s=agreed();for(const type of ['READY','ISSUE_CODE','RECEIVER_CONFIRM','SENDER_CONFIRM'])assert.throws(()=>apply(s,type),e=>e.code==='FORBIDDEN');});
test('guardian cannot report arrival as the visitor',()=>{assert.throws(()=>apply(agreed(),'NOTIFY_ARRIVAL',{}, {role:'guardian',id:'observer-001'}),e=>e.code==='FORBIDDEN');});
test('child trips cannot use adult self consent',()=>{assert.throws(()=>apply(H.createTrip('kindergarten',1000),'SELF_CONSENT',{accepted:true}),e=>e.code==='ADULT_ONLY');});
test('community arrival notice does not claim designated handoff',()=>{const s=apply(agreed('community'),'NOTIFY_ARRIVAL');assert.equal(s.info.mode,'ARRIVAL_ONLY');assert.equal(s.arrivalNotice.recipient,'함께경로당 연락 담당자');assert.equal(s.completedAt,null);});
test('sharing withdrawal blocks a new notice',()=>{const s=apply(agreed(),'SELF_CONSENT',{accepted:false});assert.throws(()=>apply(s,'NOTIFY_ARRIVAL'),e=>e.code==='CONSENT');});
test('cancelled visit cannot be reported',()=>{const s=apply(agreed(),'CANCEL',{}, {role:'vehicle',id:'sender-001'});assert.throws(()=>apply(s,'NOTIFY_ARRIVAL'),e=>e.code==='TERMINAL');});
test('acknowledgment requires a notice',()=>{assert.throws(()=>apply(agreed(),'ACK_ARRIVAL_NOTICE',{},staff),e=>e.code==='NO_NOTICE');});
test('phone normalization rejects USSD, scripts and invalid punctuation',()=>{for(const v of ['*123#','javascript:alert(1)','tel:01000000000','010;1234','123',null,{}])assert.equal(U.normalizePhone(v),'');});
test('phone normalization permits a dialable number only',()=>{assert.equal(U.normalizePhone('02-123-4567'),'021234567');assert.equal(U.normalizePhone('+82 10 0000 0000'),'+821000000000');});
test('settings only retain supported text sizes and roles',()=>{assert.deepEqual(U.settings({mode:'invalid',role:'administrator',text:1000,phone:'*123#'}),{mode:'standard',role:'vehicle',text:100,phone:'',theme:'light'});});
test('easy view settings survive serialization',()=>{const s=U.settings({mode:'easy',text:200,role:'guardian'});assert.deepEqual(U.settings(JSON.parse(JSON.stringify(s))),s);});
test('completion copy follows actual two-party state',()=>{const s=agreed();s.state='VERIFYING';s.senderConfirmed=true;assert.equal(U.nextStep(s,'vehicle')[0],'담당자의 확인을 기다려요');});
test('error messages never expose raw exceptions',()=>{assert.equal(U.publicError('internal stack trace with secrets'),'지금은 처리하지 못했어요. 연결과 현재 상태를 확인한 뒤 다시 눌러주세요.');});
