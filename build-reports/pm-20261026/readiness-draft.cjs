'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require(path.join(process.env.LOCALAPPDATA,'AnsimBuildTools/checks/live-save-2026102515/node_modules/playwright'));
const out=__dirname,html=fs.readFileSync(path.join(out,'fixed-index.html'),'utf8');
const report={task_id:'AS-Q1-PM-20261026T0656',owner:'existing PM selfQA',source:'isolated modification atop82d7978; not an APK build',apk_sha256:'7801e8ffc7e393662ad73c57c3cfb385261b6dcc63405b737359a326504fe8a5',environment:'Windows Chrome headless isolated browser / candidate HTML with isolated app.js readiness render fix / synthetic visit',clock:'Playwright virtual clock601000ms for readiness expiry; not actual10minute or phone timing',started_at:new Date().toISOString(),html_sha256:crypto.createHash('sha256').update(html).digest('hex'),cases:[],page_errors:[],external_requests:[],phone_actions:false,new_build:false,product_modified:false};
(async()=>{let browser;try{
assert.ok(html.includes('renderedReady!==H.readyNow(state,Date.now())'));
browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});report.browser_version=browser.version();
async function setup(){
 const c=await browser.newContext({viewport:{width:430,height:900}}),p=await c.newPage();p.setDefaultTimeout(7000);
 p.on('pageerror',e=>report.page_errors.push(e.message));await p.clock.install();
 await p.route('**/*',r=>{if(r.request().isNavigationRequest()&&r.request().url()==='http://127.0.0.1:18656/')return r.fulfill({status:200,contentType:'text/html',body:html});report.external_requests.push(new URL(r.request().url()).origin);return r.abort()});await p.goto('http://127.0.0.1:18656/');
 const act=n=>p.locator('[data-action="'+n+'"]').first().click(),role=n=>p.locator('.demo-role-tab[data-role="'+n+'"]').click(),state=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('ansim-synthetic-demo-v1')));
 await act('edit-destination');await p.locator('#field-address').fill('서울 중구 세종대로 110');await p.locator('#visitForm button[type=submit]').click();await p.locator('.dialog').waitFor({state:'detached'});
 return {c,p,act,role,state};
}
async function complete(x){
 await x.act('issue');let pin=await x.p.locator('.pin-code strong').innerText();await x.act('sender');await x.role('facility');await x.p.locator('#codeInput').fill(pin);await x.act('receiver');await x.p.getByText('인수를 완료했어요',{exact:true}).waitFor();let s=await x.state();assert.equal(s.state,'COMPLETED');assert.equal(s.senderConfirmed,true);assert.equal(s.receiverConfirmed,true);
 await x.p.reload();await x.p.getByText('인수를 완료했어요',{exact:true}).waitFor();assert.equal((await x.state()).state,'COMPLETED');
}
{
 const x=await setup();await x.act('open-editor');await x.p.locator('#field-detailAddress').fill('정문');await x.p.evaluate(()=>window.__originalDraftNode=document.querySelector('#field-detailAddress'));
 await x.p.clock.fastForward(601000);assert.equal(await x.p.locator('#field-detailAddress').inputValue(),'정문');assert.equal(await x.p.evaluate(()=>window.__originalDraftNode===document.querySelector('#field-detailAddress')),true);assert.equal(await x.p.locator('#field-detailAddress').evaluate(e=>e===document.activeElement),true);await x.act('close');await x.c.close();
 report.cases.push({name:'readiness expiry does not replace active editor node, focus, or unsaved draft input',pass:true});console.log('PASS focused draft preserved across expiry');
}
assert.deepEqual(report.page_errors,[]);assert.deepEqual(report.external_requests,[]);report.success=true;
}catch(e){report.success=false;report.failure=e.message;console.error('FAILED '+e.message);process.exitCode=1}
finally{if(browser)await browser.close();report.finished_at=new Date().toISOString();fs.writeFileSync(path.join(out,'draft-result.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({success:report.success,scenarios:report.cases.length,page_errors:report.page_errors.length,external_requests:report.external_requests.length}));}})();