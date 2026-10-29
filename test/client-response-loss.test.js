'use strict';
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),assert=require('node:assert/strict');
const {createApp}=require('../server'),H=require('../web/core'),C=require('../web/config'),U=require('../web/ui');
delete process.env.KAKAO_REST_API_KEY;
let assertions=0;const checks=[],httpTrace=[],expectedErrors=[];const eq=(a,b,label)=>{assert.deepEqual(normalize(a),normalize(b),label);assertions++;};
const normalize=x=>x===undefined?undefined:JSON.parse(JSON.stringify(x));
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),snapshot:()=>Object.fromEntries(m)};};
async function run(name,reconnect=false,newerState=false,changedDraft=false){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'asdh-client-')),dataFile=path.join(dir,'synthetic.json');let app;const oldError=console.error;console.error=(...args)=>expectedErrors.push({errno:args.join(' ').match(/EISDIR/)?.[0]||'OTHER'});
try{app=createApp({dataFile});await new Promise(r=>app.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+app.address().port;
 let dropReply=false;const realFetch=async(url,opts={})=>{const r=await fetch(new URL(url,base),{...opts,signal:opts.signal||AbortSignal.timeout(3000)});httpTrace.push({path:String(url),method:opts.method||'GET',status:r.status});if(dropReply&&url==='/api/events'){dropReply=false;await r.arrayBuffer();throw new TypeError('synthetic response lost after durable commit');}return r;};
 const boot=await(await realFetch('/api/bootstrap')).json();const initial=await(await realFetch('/api/state',{headers:{Authorization:'Bearer '+boot.tokens.facility}})).json();
 await realFetch('/api/events',{method:'POST',headers:{Authorization:'Bearer '+boot.tokens.facility,'Content-Type':'application/json'},body:JSON.stringify({tripId:boot.tripId,expectedVersion:initial.state.version,key:crypto.randomUUID(),event:{type:'READY',payload:{ready:true}}})});
 const fields=[{name:'address',value:'서울 중구 세종대로 110'},{name:'detailAddress',value:'합성 검증 정문'},{name:'facility',value:'합성 검증 시설'}];const button={disabled:false},errorEl={textContent:'',hidden:true,scrollIntoView(){}},toastEl={textContent:'',classList:{add(){},remove(){}}},mapEl={value:'google'},textEl={value:'150'};
 const form={querySelector:q=>q==='button[type=submit]'?button:q==='#mapProvider'?mapEl:q==='#textSize'?textEl:null};
 const localStorage=memory(),sessionStorage=memory(),window={Handoff:H,VisitConfig:C,HandoffUI:U,addEventListener(){}};
 const context=vm.createContext({window,localStorage,sessionStorage,crypto:globalThis.crypto,location:{protocol:'http:',hostname:'127.0.0.1',pathname:'/'},document:{addEventListener(){},getElementById:id=>({visitForm:form,editorError:errorEl,toast:toastEl,mapProvider:mapEl,textSize:textEl}[id]||null),querySelector(){return null;},querySelectorAll:q=>q==='#visitForm [name]'?fields:[]},fetch:realFetch,AbortController,setTimeout,clearTimeout,setInterval(){return 1;},console});
 let source=fs.readFileSync(path.join(__dirname,'../web/app.js'),'utf8');const anchor='  init();';eq(source.split(anchor).length,2,'single boot seam');
 source=source.replace(anchor,`  render=()=>{};
 window.qa={connect:()=>connect(false),open:()=>openPanel('editor',null),saveEditor,html:()=>editor(),snapshot:()=>JSON.parse(JSON.stringify({state,panel,draft,draftPreferences,prefs,profiles,error,editorError,busy,editorSaving,pending}))};`);
 vm.runInContext(source,context);await window.qa.connect();window.qa.open();const baseline=window.qa.snapshot(),diskBefore=fs.readFileSync(dataFile),storageBefore=localStorage.snapshot();
 dropReply=true;await window.qa.saveEditor();const lost=window.qa.snapshot();
 eq(httpTrace.at(-1).status,200,'server committed before losing response');eq(lost.state.version,baseline.state.version,'client remains uncertain');eq(lost.pending!==null,true,'uncertain intent retained');eq(lost.panel,'editor','draft remains open');for(const f of fields)eq(lost.draft[f.name],f.value,'draft retained');eq(toastEl.textContent.includes('저장했어요'),false,'no premature success');
 const committed=JSON.parse(fs.readFileSync(dataFile));eq(committed.state.version,baseline.state.version+1,'one initial server commit');eq(Object.keys(committed.receipts).length,2,'one save receipt plus seed');
 if(newerState){const latest=await(await realFetch('/api/state',{headers:{Authorization:'Bearer '+boot.tokens.facility}})).json();await realFetch('/api/events',{method:'POST',headers:{Authorization:'Bearer '+boot.tokens.facility,'Content-Type':'application/json'},body:JSON.stringify({tripId:boot.tripId,key:crypto.randomUUID(),expectedVersion:latest.state.version,event:{type:'READY',payload:{ready:false}}})});}
 if(reconnect)await window.qa.connect();
 if(changedDraft)fields[1].value='합성 검증 후문';
 await window.qa.saveEditor();const recovered=window.qa.snapshot(),final=JSON.parse(fs.readFileSync(dataFile));
 eq(final.state.version,baseline.state.version+1+(newerState||changedDraft?1:0),'retry must not duplicate durable event');eq(Object.keys(final.receipts).length,2+(newerState||changedDraft?1:0),'retry must reuse original receipt');eq(recovered.state.version,final.state.version,'client adopts result');eq(recovered.pending,null,'resolved intent cleared');eq(recovered.panel,null,'editor closes after acknowledgement');for(const f of fields)eq(recovered.state.info[f.name],f.value,'saved values agree');checks.push({name,status:'PASS',durable_save_count:changedDraft?2:1,pending_replayed:true,reconnect,newerState,changedDraft,actual_render_or_phone:false});
}catch(e){checks.push({name,status:'FAIL',message:e.message});}finally{console.error=oldError;if(app)await new Promise(r=>app.close(r));fs.rmSync(dir,{recursive:true,force:true});}}

const {test}=require('node:test');
for(const [name,reconnect,newer,changed] of [['direct retry',false,false,false],['reconnect',true,false,false],['newer authoritative state',true,true,false],['changed draft',false,false,true]])test('lost save response resolves original intent: '+name,async()=>{const i=checks.length;await run(name,reconnect,newer,changed);assert.equal(checks[i].status,'PASS',checks[i].message);});
