'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {createApp}=require('../server');
async function fixture(t){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'handoff-release-'));
 const app=createApp({dataFile:path.join(dir,'store.json')});
 await new Promise(r=>app.listen(0,'127.0.0.1',r));
 t.after(async()=>{await new Promise(r=>app.close(r));fs.rmSync(dir,{recursive:true,force:true});});
 const base='http://127.0.0.1:'+app.address().port;
 const boot=await(await fetch(base+'/api/bootstrap')).json();
 return {base,boot,headers(role){return {Authorization:'Bearer '+boot.tokens[role],'Content-Type':'application/json'};}};
}
test('release uses one public product name',()=>{
 const root=path.join(__dirname,'..');
 assert.match(fs.readFileSync(path.join(root,'web/index.html'),'utf8'),/<title>안심동행 플랫폼<\/title>/);
 assert.match(fs.readFileSync(path.join(root,'android/app/src/main/AndroidManifest.xml'),'utf8'),/android:label="안심동행 플랫폼"/);
});
test('reset invalidates old synthetic sessions and provides new sessions',async t=>{
 const a=await fixture(t);
 assert.equal((await fetch(a.base+'/api/reset',{method:'POST',headers:a.headers('simulator'),body:JSON.stringify({scenario:'senior'})})).status,200);
 assert.equal((await fetch(a.base+'/api/state',{headers:a.headers('vehicle')})).status,401);
 const boot=await(await fetch(a.base+'/api/bootstrap')).json();
 assert.notEqual(boot.tokens.vehicle,a.boot.tokens.vehicle);
 const res=await fetch(a.base+'/api/state',{headers:{Authorization:'Bearer '+boot.tokens.vehicle}});
 assert.equal(res.status,200); assert.equal((await res.json()).state.scenario,'senior');
});
test('oversized mutation is rejected without a state change',async t=>{
 const a=await fixture(t);
 const res=await fetch(a.base+'/api/events',{method:'POST',headers:a.headers('vehicle'),body:JSON.stringify({padding:'x'.repeat(9000)})});
 assert.equal(res.status,413);
 const state=await(await fetch(a.base+'/api/state',{headers:a.headers('vehicle')})).json();
 assert.equal(state.state.version,0);
});
test('unsupported scenario is rejected during reset',async t=>{
 const a=await fixture(t);
 const res=await fetch(a.base+'/api/reset',{method:'POST',headers:a.headers('simulator'),body:JSON.stringify({scenario:'unknown'})});
 assert.equal(res.status,400);
 assert.equal((await fetch(a.base+'/api/state',{headers:a.headers('vehicle')})).status,200);
});
test('private data store cannot be fetched from the web server',async t=>{
 const a=await fixture(t);
 for(const p of ['/.data/demo.json','/docs/official/application-consent.docx','/.env']) assert.equal((await fetch(a.base+p)).status,404);
});
test('HTML responses prevent embedding and caching',async t=>{
 const a=await fixture(t); const res=await fetch(a.base+'/vehicle');
 assert.match(res.headers.get('content-security-policy'),/frame-ancestors 'none'/);
 assert.equal(res.headers.get('cache-control'),'no-store');
});
