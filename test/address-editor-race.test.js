'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const H=require('../web/core'),C=require('../web/config'),U=require('../web/ui');
function fixture(){
 const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};};
 const window={Handoff:H,VisitConfig:C,HandoffUI:U,ANSIM_STANDALONE:true,addEventListener(){}};
 const context=vm.createContext({window,localStorage:memory(),sessionStorage:memory(),crypto:globalThis.crypto,
  location:{protocol:'http:',hostname:'127.0.0.1',pathname:'/'},
  document:{addEventListener(){},getElementById(){return null;},querySelector(){return null;},querySelectorAll(){return [];}},
  setTimeout(){return 1;},clearTimeout(){},setInterval(){return 1;},console});
 let source=fs.readFileSync(path.join(__dirname,'../web/app.js'),'utf8');
 const anchor='  init();';assert.equal(source.split(anchor).length,2);
 source=source.replace(anchor,`  render=()=>{};
  state=H.createTrip('kindergarten',Date.now(),'race-fixture');
  window.testEditor={setRole,openPanel,closePanel,
   begin(ticket){panel='editor';draft={...state.info,address:'Original fixture'};searchTicket=ticket;},
   setDispose(fn){addressDispose=fn;},
   snapshot(){return JSON.parse(JSON.stringify({panel,draft,searchTicket,role:role(),state}));}
  };`);
 vm.runInContext(source,context);
 return {api:window.testEditor,reply:(ticket,address)=>window.onPostcodeResult(ticket,{address,postcode:'04524'},''),window};
}
test('role switch invalidates native address response before another role editor opens',async()=>{
 const f=fixture();f.api.begin('old-role');await f.api.setRole('facility');f.api.openPanel('editor');
 const before=f.api.snapshot();f.reply('old-role','Stale other-role fixture');
 assert.deepEqual(f.api.snapshot(),before);
});
test('replacing an editor invalidates its outstanding address request',()=>{
 const f=fixture();f.api.begin('old-editor');f.api.openPanel('editor');
 const before=f.api.snapshot();f.reply('old-editor','Stale replaced-editor fixture');
 assert.deepEqual(f.api.snapshot(),before);
});
test('role switch disposes an active address widget',async()=>{
 const f=fixture();let disposed=0;f.api.begin('old-widget');f.api.setDispose(()=>disposed++);
 await f.api.setRole('guardian');assert.equal(disposed,1);assert.equal(f.api.snapshot().searchTicket,null);
});
test('closing and reopening an editor ignores an earlier native response',()=>{
 const f=fixture();f.api.begin('closed');f.api.closePanel();f.api.openPanel('editor');
 const before=f.api.snapshot();f.reply('closed','Stale closed fixture');assert.deepEqual(f.api.snapshot(),before);
});
test('current response updates draft only and consumes the request token',()=>{
 const f=fixture();f.api.begin('current');const state=f.api.snapshot().state;f.reply('current','Current fixture');
 const after=f.api.snapshot();assert.equal(after.draft.address,'Current fixture');assert.equal(after.draft.postcode,'04524');
 assert.equal(after.searchTicket,null);assert.deepEqual(after.state,state);
});
test('mismatched response never changes the current draft',()=>{
 const f=fixture();f.api.begin('current');const before=f.api.snapshot();f.reply('wrong','Wrong fixture');
 assert.deepEqual(f.api.snapshot(),before);
});

