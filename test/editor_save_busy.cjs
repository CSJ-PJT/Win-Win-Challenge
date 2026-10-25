'use strict';
const {chromium}=require('playwright'),{spawn}=require('node:child_process'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,'build-reports','v043','save-busy');
fs.mkdirSync(out,{recursive:true});
const baseline=process.argv.includes('--baseline');
const data=path.join(out,'private.json');try{fs.unlinkSync(data)}catch{}
const server=spawn(process.execPath,['server.js'],{cwd:root,env:{...process.env,PORT:'19155',DATA_FILE:data},stdio:'ignore'});
(async()=>{
 let browser;
 try{
  for(let n=0;n<60;n++){try{await fetch('http://127.0.0.1:19155/');break}catch{await new Promise(r=>setTimeout(r,100))}}
  browser=await chromium.launch({executablePath:process.env.ANSIM_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  const page=await browser.newPage({viewport:{width:430,height:900}});
  let armed=false,delayed=false,resolveWrite;
  const pending=new Promise(r=>resolveWrite=r);
  await page.route('**/api/events',async route=>{
   const body=route.request().postDataJSON();
   if(armed&&!delayed&&body.event?.type==='VEHICLE'){
    delayed=true;resolveWrite();
    // Delay only local telemetry transport; forward its actual server response.
    await new Promise(r=>setTimeout(r,3000));
   }
   await route.continue();
  });
  await page.goto('http://127.0.0.1:19155/vehicle');
  await page.locator('[data-action="edit-destination"]').first().click();
  await page.locator('#field-address').fill('서울 중구 세종대로 110');
  await page.locator('#field-detailAddress').fill('정문');
  armed=true;
  await Promise.race([pending,new Promise((_,reject)=>setTimeout(()=>reject(Error('No pending telemetry write')),18000))]);
  await page.locator('#visitForm button[type=submit]').click();
  if(baseline){
   await page.waitForTimeout(500);
   assert.equal(await page.locator('.dialog').count(),1);
   const error=await page.locator('#editorError').innerText();
   assert.match(error,/저장하지 못/);
   const result={baseline:true,telemetryDelayed:delayed,dialogStillOpen:true,error};
   fs.writeFileSync(path.join(out,'baseline.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
  }else{
   await page.locator('.dialog').waitFor({state:'detached',timeout:8000});
   await page.reload();
   await page.locator('.address').filter({hasText:'세종대로 110'}).first().waitFor();
   const result={baseline:false,telemetryDelayed:delayed,saveClosedDialog:true,persistedAfterReload:true};
   fs.writeFileSync(path.join(out,'fixed.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
  }
 }finally{if(browser)await browser.close();server.kill();try{fs.unlinkSync(data)}catch{}}
})().catch(e=>{console.error(e.stack);process.exitCode=1});
