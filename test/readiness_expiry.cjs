'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const out=path.resolve(process.argv[2]||'build-reports/v043/readiness-expiry');fs.mkdirSync(out,{recursive:true});const html=fs.readFileSync(path.resolve('dist/handoff-demo.html'),'utf8');
const report={task_id:'AS-Q1-PM-20261026T0656',owner:'existing PM selfQA',source:process.env.GITHUB_SHA||'local readiness UI fix',reference_candidate_apk_sha256:'7801e8ffc7e393662ad73c57c3cfb385261b6dcc63405b737359a326504fe8a5',environment:'Windows Chrome headless isolated browser / candidate HTML with isolated app.js readiness render fix / synthetic visit',clock:'Playwright virtual clock601000ms for readiness expiry; not actual10minute or phone timing',started_at:new Date().toISOString(),html_sha256:crypto.createHash('sha256').update(html).digest('hex'),cases:[],page_errors:[],external_requests:[],phone_actions:false,new_build:false,product_modified:true};
(async()=>{let browser;try{
assert.ok(html.includes('renderedReady!==H.readyNow(state,Date.now())'));
browser=await chromium.launch({...(process.env.ANSIM_CHROME?{executablePath:process.env.ANSIM_CHROME}:{}),headless:true});report.browser_version=browser.version();
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
 const x=await setup();const before=await x.state();await x.p.clock.fastForward(601000);await x.p.getByText('시설 담당자의 맞이할 준비 확인이 필요해요.',{exact:true}).waitFor();report.pre_click_issue_enabled=await x.p.locator('[data-action=issue]').isEnabled();assert.equal(report.pre_click_issue_enabled,false);let s=await x.state();assert.equal(s.challenge,null);assert.equal(s.senderConfirmed,false);assert.equal(s.receiverConfirmed,false);assert.equal(s.readyAt,before.readyAt);
 await x.p.screenshot({path:path.join(out,'fixed-ready-expired.png'),fullPage:true});await x.role('facility');await x.act('ready');s=await x.state();assert.ok(s.readyAt>before.readyAt);await x.role('vehicle');assert.equal(await x.p.locator('[data-action=issue]').isEnabled(),true);
 await complete(x);await x.p.screenshot({path:path.join(out,'fixed-ready-complete.png'),fullPage:true});await x.c.close();
 report.cases.push({name:'fixed readiness expiry refreshes disabled issue UI without a refused click; facility renewal and both confirmations recover',pass:true});console.log('PASS fixed readiness expiry renders automatically and recovers');
}
assert.deepEqual(report.page_errors,[]);assert.deepEqual(report.external_requests,[]);report.success=true;
}catch(e){report.success=false;report.failure=e.message;console.error('FAILED '+e.message);process.exitCode=1}
finally{if(browser)await browser.close();report.finished_at=new Date().toISOString();fs.writeFileSync(path.join(out,'fixed-result.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({success:report.success,scenarios:report.cases.length,page_errors:report.page_errors.length,external_requests:report.external_requests.length}));}})();