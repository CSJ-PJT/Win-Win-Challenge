'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require(path.join(process.env.LOCALAPPDATA,'AnsimBuildTools/checks/live-save-2026102515/node_modules/playwright'));
const out=__dirname,html=fs.readFileSync(path.join(out,'candidate-index.html'),'utf8');
const report={task_id:'AS-Q1-PM-20261026T0656',owner:'existing PM selfQA',source:'41c1812013d395b90d9c6ae7a35ccdcee8b377f4',apk_sha256:'7801e8ffc7e393662ad73c57c3cfb385261b6dcc63405b737359a326504fe8a5',environment:'Windows Chrome headless isolated browser / exact candidate APK bundled HTML / synthetic visit',clock:'Playwright virtual clock601000ms for readiness expiry; not actual10minute or phone timing',started_at:new Date().toISOString(),html_sha256:crypto.createHash('sha256').update(html).digest('hex'),cases:[],page_errors:[],external_requests:[],phone_actions:false,new_build:false,product_modified:false};
(async()=>{let browser;try{
assert.equal(report.html_sha256,'c2004a65d27ffc601cad796f22c539105ced3db9b58b0d02e68bd5fa36e893d1');
browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});report.browser_version=browser.version();
async function setup(){
 const c=await browser.newContext({viewport:{width:430,height:900}}),p=await c.newPage();p.setDefaultTimeout(7000);
 p.on('pageerror',e=>report.page_errors.push(e.message));await p.clock.install();
 await p.route('**/*',r=>{if(r.request().isNavigationRequest()&&r.request().url()==='http://127.0.0.1:18656/')return r.fulfill({status:200,contentType:'text/html',body:html});report.external_requests.push(new URL(r.request().url()).origin);return r.abort()});await p.goto('http://127.0.0.1:18656/');
 const act=n=>p.locator('[data-action="'+n+'"]').first().click(),role=n=>p.locator('.demo-role-tab[data-role="'+n+'"]').click(),state=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('ansim-synthetic-demo-v1')));
 await act('edit-destination');await p.locator('#field-address').fill('서울 중구 세종대로 110');await p.locator('#visitForm button[type=submit]').click();await p.locator('.dialog').waitFor({state:'detached'});await act('depart');await act('arrive');await role('facility');if(await p.locator('[data-action=ready]').count())await act('ready');await role('vehicle');
 return {c,p,act,role,state};
}
async function complete(x){
 await x.act('issue');let pin=await x.p.locator('.pin-code strong').innerText();await x.act('sender');await x.role('facility');await x.p.locator('#codeInput').fill(pin);await x.act('receiver');await x.p.getByText('인수를 완료했어요',{exact:true}).waitFor();let s=await x.state();assert.equal(s.state,'COMPLETED');assert.equal(s.senderConfirmed,true);assert.equal(s.receiverConfirmed,true);
 await x.p.reload();await x.p.getByText('인수를 완료했어요',{exact:true}).waitFor();assert.equal((await x.state()).state,'COMPLETED');
}
{
 const x=await setup();const before=await x.state();await x.p.clock.fastForward(601000);report.pre_click_issue_enabled=await x.p.locator('[data-action=issue]').isEnabled();assert.equal(report.pre_click_issue_enabled,true);await x.act('issue');await x.p.locator('#inlineError').filter({hasText:'준비'}).waitFor();assert.equal(await x.p.locator('[data-action=issue]').isDisabled(),true);let s=await x.state();assert.equal(s.challenge,null);assert.equal(s.senderConfirmed,false);assert.equal(s.receiverConfirmed,false);assert.equal(s.readyAt,before.readyAt);
 await x.p.screenshot({path:path.join(out,'ready-expired-blocked.png'),fullPage:true});await x.role('facility');await x.act('ready');s=await x.state();assert.ok(s.readyAt>before.readyAt);await x.role('vehicle');assert.equal(await x.p.locator('[data-action=issue]').isEnabled(),true);
 await complete(x);await x.p.screenshot({path:path.join(out,'ready-renewed-complete.png'),fullPage:true});await x.c.close();
 report.cases.push({name:'virtual-clock readiness expiry leaves stale enabled issue button; actual click refuses issuance and refreshes disabled UI; facility renewal and both confirmations recover',pass:true});console.log('PASS readiness-expiry stale UI identified; issuance refused; facility recovery');
}
assert.deepEqual(report.page_errors,[]);assert.deepEqual(report.external_requests,[]);report.success=true;
}catch(e){report.success=false;report.failure=e.message;console.error('FAILED '+e.message);process.exitCode=1}
finally{if(browser)await browser.close();report.finished_at=new Date().toISOString();fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({success:report.success,scenarios:report.cases.length,page_errors:report.page_errors.length,external_requests:report.external_requests.length}));}})();