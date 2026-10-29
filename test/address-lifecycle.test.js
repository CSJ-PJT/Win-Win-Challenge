'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function fixture(protocol='http:'){
 const scripts=[],timers=new Map(),widgets=[];let id=0;
 const root={isConnected:true,replaceChildren(){this.cleared=(this.cleared||0)+1;}};
 const window={};const context=vm.createContext({window,location:{protocol},queueMicrotask,Error,
  setTimeout(fn,ms){timers.set(++id,{fn,ms});return id;},clearTimeout(id){timers.delete(id);},
  document:{createElement(){return {remove(){this.removed=true;}};},head:{appendChild(s){scripts.push(s);}}}});
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../web/address.js'),'utf8'),context);
 window.AddressPicker=context.AddressPicker;
 const callbacks=[];
 const mount=()=>({dispose:window.AddressPicker.mount(root,{query:'Public fixture',onerror:e=>callbacks.push(['error',e.message]),onready:()=>callbacks.push(['ready']),onselect:r=>callbacks.push(['select',JSON.parse(JSON.stringify(r))])})});
 return {window,scripts,timers,widgets,root,callbacks,mount,async flush(){await new Promise(r=>setImmediate(r));},
  expire(ms){const found=[...timers].find(([,t])=>t.ms===ms);assert.ok(found);timers.delete(found[0]);found[1].fn();},
  load(){window.daum={Postcode:class{constructor(options){this.options=options;widgets.push(this);}embed(element,options){this.element=element;this.query=options.q;}}};scripts.at(-1).onload();}};
}
test('address SDK network failure permits a fresh successful retry',async()=>{
 const f=fixture();f.mount();assert.equal(f.scripts.length,1);f.scripts[0].onerror();await f.flush();
 assert.match(f.callbacks[0][1],/연결하지 못/);assert.equal(f.scripts[0].removed,true);
 f.mount();assert.equal(f.scripts.length,2);f.load();await f.flush();f.widgets[0].options.onresize();
 assert.deepEqual(f.callbacks.at(-1),['ready']);assert.equal(f.widgets[0].query,'Public fixture');
});
test('address SDK timeout removes failed script and clears cached failure',async()=>{
 const f=fixture();f.mount();f.expire(12000);await f.flush();assert.match(f.callbacks[0][1],/지연/);
 assert.equal(f.scripts[0].removed,true);f.mount();assert.equal(f.scripts.length,2);
 f.load();await f.flush();assert.equal(f.widgets.length,1);
});
test('address widget timeout can retry with cached SDK and disposed callbacks stay silent',async()=>{
 const f=fixture(),first=f.mount();f.load();await f.flush();f.expire(18000);
 assert.match(f.callbacks[0][1],/응답하지/);first.dispose();f.mount();await f.flush();
 assert.equal(f.scripts.length,1);assert.equal(f.widgets.length,2);
 const count=f.callbacks.length;f.widgets[0].options.onresize();assert.equal(f.callbacks.length,count);
 f.widgets[1].options.onsearch();assert.deepEqual(f.callbacks.at(-1),['ready']);
});
test('disposing while SDK loads prevents embedding and error callbacks',async()=>{
 const f=fixture(),m=f.mount();m.dispose();f.load();await f.flush();
 assert.equal(f.widgets.length,0);assert.deepEqual(f.callbacks,[]);
});
test('disposed widget cannot select an address or report readiness',async()=>{
 const f=fixture(),m=f.mount();f.load();await f.flush();m.dispose();
 const w=f.widgets[0].options;w.onresize();w.onsearch();w.oncomplete({address:'Public fixture'});
 assert.deepEqual(f.callbacks,[]);assert.equal(f.timers.size,0);
});
test('selected official-format address returns postcode without inventing coordinates',async()=>{
 const f=fixture();f.mount();f.load();await f.flush();
 f.widgets[0].options.oncomplete({userSelectedType:'R',roadAddress:'Public fixture road',zonecode:'04524'});
 assert.deepEqual(f.callbacks[0],['select',{address:'Public fixture road',postcode:'04524',buildingName:'',latitude:null,longitude:null}]);
});
test('invalid selection reports a recoverable error instead of selecting an empty address',async()=>{
 const f=fixture();f.mount();f.load();await f.flush();f.widgets[0].options.oncomplete({});
 assert.equal(f.callbacks[0][0],'error');assert.match(f.callbacks[0][1],/다시 선택/);
});
test('file URL reports launcher guidance without injecting a remote SDK',async()=>{
 const f=fixture('file:');f.mount();await f.flush();assert.equal(f.scripts.length,0);
 assert.equal(f.callbacks[0][0],'error');assert.match(f.callbacks[0][1],/PC 실행/);
});

