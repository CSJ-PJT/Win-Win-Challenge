'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {createApp}=require('../server');
test('HTTP demo upgrades official postcode requests without allowing arbitrary scripts or frames',async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ansim-address-'));
  const app=createApp({dataFile:path.join(dir,'state.json')});
  await new Promise(resolve=>app.listen(0,'127.0.0.1',resolve));
  try {
    const base='http://127.0.0.1:'+app.address().port;
    const response=await fetch(base+'/vehicle');
    assert.equal(response.status,200);
    const policy=response.headers.get('content-security-policy');
    assert.match(policy,/upgrade-insecure-requests/);
    assert.match(policy,/script-src 'self' https:\/\/t1\.kakaocdn\.net;/);
    assert.match(policy,/frame-src https:\/\/postcode\.map\.kakao\.com https:\/\/postcode\.map\.daum\.net;/);
    assert.equal((await fetch(base+'/api/health')).status,200);
  } finally {
    await new Promise(resolve=>app.close(resolve));
    fs.rmSync(dir,{recursive:true,force:true});
  }
});
