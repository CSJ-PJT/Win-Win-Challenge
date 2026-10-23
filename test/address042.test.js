const {test}=require('node:test');const assert=require('node:assert/strict');
const A=require('../web/address'),C=require('../web/config'),H=require('../web/core');
test('postcode maps an explicitly selected road address without inventing coordinates',()=>{
 const r=A.normalize({userSelectedType:'R',roadAddress:'서울 중구 세종대로 110',jibunAddress:'서울 중구 태평로1가 31',zonecode:'04524',buildingName:'서울특별시청'});
 assert.equal(r.address,'서울 중구 세종대로 110');assert.equal(r.postcode,'04524');assert.equal(r.latitude,null);assert.equal(r.longitude,null);
});
test('postcode honours explicit lot selection instead of an inferred road address',()=>{
 assert.equal(A.normalize({userSelectedType:'J',roadAddress:'ROAD',jibunAddress:'LOT'}).address,'LOT');
 assert.throws(()=>A.normalize({autoRoadAddress:'unconfirmed guess'}));
});
test('postcode data is limited to the selected address, postcode and building name',()=>{
 const r=A.normalize({address:' A\u0000B ',zonecode:'<script>',buildingName:'x'.repeat(200),phone:'secret'});
 assert.equal(r.address,'AB');assert.equal(r.postcode,'');assert.equal(r.buildingName.length,80);assert.ok(!Object.hasOwn(r,'phone'));
});
test('address postcode and details survive a real configure event',()=>{
 let s=H.createTrip('kindergarten',Date.now());
 s=H.apply(s,{type:'CONFIGURE_VISIT',payload:{address:'서울 중구 세종대로 110',postcode:'04524',detailAddress:'1층 정문'}},{role:'vehicle',id:'sender-001'},{now:Date.now()}).state;
 assert.equal(s.info.postcode,'04524');assert.equal(s.info.detailAddress,'1층 정문');assert.equal(s.senderConfirmed,false);
});
test('bad postcode is rejected and map links never include private visit fields',()=>{
 assert.throws(()=>C.cleanPatch({postcode:'123'},'vehicle'));
 const url=C.navigation({address:'서울 중구 세종대로 110',subject:'private_child',detailAddress:'private_room',senderPhone:'01099999999'},'kakao');
 assert.equal(new URL(url).host,'map.kakao.com');assert.ok(!url.includes('private'));assert.ok(!url.includes('99999999'));
});
test('Kakao selection never silently opens Google when coordinates are missing',()=>{
 assert.match(C.navigation({address:'한국 주소'},'kakao'),/^https:\/\/map\.kakao\.com\/link\/search\//);
 assert.match(C.navigation({address:'한국 주소',latitude:37,longitude:127},'kakao'),/\/link\/to\//);
 assert.match(C.navigation({address:'한국 주소'},'google'),/google\.com\/maps\/dir\//);
});
