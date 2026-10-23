/* Visit settings, role capabilities and navigation links. No credentials live here. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.VisitConfig=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const TEXT={facility:80,subject:50,receiver:60,place:120,address:180,senderName:50,guardianName:50,supportNote:200,scheduledAt:30};
const PHONES=['facilityPhone','senderPhone','guardianPhone'];
const CONTACT=['senderName','senderPhone','guardianName','guardianPhone'];
const PERSONAL=['subject',...CONTACT,'scheduledAt','supportNote'];
const PLACE=['facility','receiver','place','address','latitude','longitude','facilityPhone'];
const FIELDS=[...Object.keys(TEXT),...PHONES,'latitude','longitude'];
const ROLE_FIELDS={vehicle:FIELDS,facility:PLACE,guardian:['subject','guardianName','guardianPhone','scheduledAt','supportNote'],visitor:PERSONAL.concat(PLACE)};
const ACTION_ROLES={depart:['vehicle'],arrive:['vehicle'],issue:['vehicle'],sender:['vehicle'],receiver:['facility'],ready:['facility'],absent:['facility'],ack:['facility'],report:['vehicle'],park:['vehicle'], 'return-area':['vehicle']};
function phone(v){const s=String(v||'').trim();if(!s)return '';if(!/^[+\d][\d ()-]{5,24}$/.test(s))throw new Error('전화번호를 확인해 주세요.');const n=s.replace(/[ ()-]/g,'');if(!/^\+?\d{7,15}$/.test(n))throw new Error('전화번호를 확인해 주세요.');return n;}
function coordinate(v,limit){if(v===null||v===undefined||String(v).trim()==='')return null;const n=Number(v);if(!Number.isFinite(n)||Math.abs(n)>limit)throw new Error('지도 좌표를 확인해 주세요.');return n;}
function cleanPatch(input,role,base={}){if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('설정값을 확인해 주세요.');const allowed=ROLE_FIELDS[role]||[];const patch={};for(const [k,v] of Object.entries(input)){
 if(!allowed.includes(k))throw new Error('변경할 수 없는 항목이에요.');
 if(TEXT[k]){if(typeof v!=='string')throw new Error('입력 내용을 확인해 주세요.');const s=v.trim();if(s.length>TEXT[k]||/[\u0000-\u001f\u007f]/.test(s))throw new Error('입력 길이와 내용을 확인해 주세요.');if(k==='scheduledAt'&&s&&(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)||!Number.isFinite(Date.parse(s))))throw new Error('방문 일시를 확인해 주세요.');patch[k]=s;}
 else if(PHONES.includes(k))patch[k]=phone(v);else patch[k]=coordinate(v,k==='latitude'?90:180);
 }
 // Address changes must not silently reuse coordinates from a different address.
 if(Object.hasOwn(patch,'address')&&patch.address!==base.address&&!Object.hasOwn(patch,'latitude')&&!Object.hasOwn(patch,'longitude')){patch.latitude=null;patch.longitude=null;}
 const next={...base,...patch};if((next.latitude==null)!==(next.longitude==null))throw new Error('위도와 경도를 함께 입력해 주세요.');
 return patch;
}
function fieldsFor(role){return [...(ROLE_FIELDS[role]||[])];}
function can(action,role){return !ACTION_ROLES[action]||ACTION_ROLES[action].includes(role);}
function hasCoordinates(info){return typeof info.latitude==='number'&&typeof info.longitude==='number'&&Number.isFinite(info.latitude)&&Number.isFinite(info.longitude)&&Math.abs(info.latitude)<=90&&Math.abs(info.longitude)<=180;}
function hasDestination(info){return !!String(info.address||'').trim()||hasCoordinates(info);}
function navigation(info,provider='google',search=false){
 const coord=hasCoordinates(info), label=String(info.facility||'목적지').split(' · ')[0], query=String(info.address||'').trim()||label;
 const encode=encodeURIComponent;
 if(!search&&!hasDestination(info))return null;
 // An address-only Kakao link is search, not turn-by-turn directions. Use Maps URLs for directions instead.
 if(provider==='google'||!coord)return search?'https://www.google.com/maps/search/?api=1&query='+encode(query):'https://www.google.com/maps/dir/?api=1&destination='+encode(coord?`${info.latitude},${info.longitude}`:query)+'&travelmode=driving';
 if(search)return 'https://map.kakao.com/link/search/'+encode(query);
 return 'https://map.kakao.com/link/to/'+encode(label)+','+info.latitude+','+info.longitude;
}
function defaults(){return {address:'',latitude:null,longitude:null,facilityPhone:'',senderName:'',senderPhone:'',guardianName:'',guardianPhone:'',scheduledAt:'',supportNote:''};}
return {TEXT,PHONES,PERSONAL,PLACE,FIELDS,fieldsFor,cleanPatch,phone,can,hasCoordinates,hasDestination,navigation,defaults};
});
