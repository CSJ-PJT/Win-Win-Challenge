/* Official Korean address picker. It returns addresses, never invented coordinates. */
(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.AddressPicker=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SDK='https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  let loading=null;
  function clean(value,limit){return String(value||'').replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,limit);}
  function normalize(data){
    if(!data||typeof data!=='object')throw new Error('선택한 주소를 확인하지 못했어요.');
    const address=clean(data.userSelectedType==='J'?(data.jibunAddress||data.address):(data.roadAddress||data.address||data.jibunAddress),180);
    if(!address)throw new Error('주소를 다시 선택해 주세요.');
    const postcode=/^\d{5}$/.test(String(data.zonecode||''))?String(data.zonecode):'';
    return {address,postcode,buildingName:clean(data.buildingName,80),latitude:null,longitude:null};
  }
  function constructor(){return window.kakao?.Postcode||window.daum?.Postcode;}
  function load(){
    if(constructor())return Promise.resolve(constructor());
    if(loading)return loading;
    loading=new Promise((resolve,reject)=>{
      const s=document.createElement('script');s.src=SDK;s.async=true;
      let ended=false;
      const finish=(error)=>{if(ended)return;ended=true;clearTimeout(timer);s.onload=null;s.onerror=null;if(error){s.remove();loading=null;reject(error);}else resolve(constructor());};
      const timer=setTimeout(()=>finish(new Error('주소 검색 연결이 지연되고 있어요. 다시 시도해 주세요.')),12000);
      s.onerror=()=>finish(new Error('주소 검색에 연결하지 못했어요. 인터넷 연결을 확인해 주세요.'));
      s.onload=()=>finish(constructor()?null:new Error('주소 검색을 불러오지 못했어요. 다시 시도해 주세요.'));
      document.head.appendChild(s);
    });
    return loading;
  }
  function mount(element,{query='',onselect,onerror,onready}={}){
    let disposed=false,timer=null;
    const fail=e=>{if(!disposed){clearTimeout(timer);onerror?.(e instanceof Error?e:new Error(String(e)));}};
    if(location.protocol==='file:'){
      queueMicrotask(()=>fail(new Error('주소 검색은 PC 실행.cmd로 열면 사용할 수 있어요. 휴대전화에서는 APK를 실행해 주세요.')));
      return ()=>{disposed=true;};
    }
    load().then(Postcode=>{
      if(disposed||!element.isConnected)return;
      element.replaceChildren();
      timer=setTimeout(()=>fail(new Error('주소 검색 화면이 응답하지 않아요. 다시 시도해 주세요.')),18000);
      const widget=new Postcode({width:'100%',height:'100%',animation:false,focusInput:true,minWidth:220,hideMapBtn:true,useBannerLink:false,
        onresize:()=>{if(!disposed){clearTimeout(timer);onready?.();}},
        oncomplete:data=>{if(disposed)return;try{const result=normalize(data);onselect?.(result);}catch(e){fail(e);}},
        onsearch:()=>{if(!disposed){clearTimeout(timer);onready?.();}}
      });
      widget.embed(element,{q:clean(query,180),autoClose:false});
    }).catch(fail);
    return ()=>{disposed=true;clearTimeout(timer);element.replaceChildren();};
  }
  return {SDK,normalize,mount};
});