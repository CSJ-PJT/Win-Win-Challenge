/* 안심동행 플랫폼 · responsive presentation client. Domain rules are in core.js. */
(function () {
  'use strict';
  const H = window.Handoff, C = window.VisitConfig, U = window.HandoffUI;
  const STATE_KEY='ansim-synthetic-demo-v1', PROFILE_KEY='ansim-visit-profiles-v3';
  const SETTINGS_KEY=U.SETTINGS_KEY, PENDING_KEY='ansim-pending-v2';
  const $=id=>document.getElementById(id);
  const escapeHTML=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const storageRead=(store,key)=>{try{return JSON.parse(store.getItem(key));}catch{return null;}};
  const storageWrite=(store,key,v)=>{try{if(v===null)store.removeItem(key);else store.setItem(key,JSON.stringify(v));return true;}catch{return false;}};
  const uid=()=>crypto.randomUUID?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint8Array(16)),v=>v.toString(16).padStart(2,'0')).join('');
  const code=()=>String(crypto.getRandomValues(new Uint32Array(1))[0]%1000000).padStart(6,'0');
  const time=n=>n?new Date(n).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'}):'';
  const serverMode=!window.ANSIM_STANDALONE && /^https?:$/.test(location.protocol) && ['localhost','127.0.0.1','[::1]'].includes(location.hostname);
  const pathRole=location.pathname.split('/').filter(Boolean)[0];
  const ROLE_LABELS={vehicle:'보호자 · 인계자',guardian:'보호자 · 조회',facility:'시설 담당자',visitor:'쉬운 화면'};
  const ROLE_TABS={vehicle:'인계자',guardian:'보호자',facility:'시설',visitor:'쉬운 화면'};
  const VISIT_FIELDS={subject:'이용자 이름',senderName:'인계자 이름',senderPhone:'인계자 연락처',guardianName:'보호자 이름',guardianPhone:'보호자 연락처',facility:'시설 이름',receiver:'인수 담당자',facilityPhone:'시설 전화번호',address:'도착지 주소',postcode:'우편번호',detailAddress:'상세주소',place:'승하차 장소',scheduledAt:'방문 예정 일시',supportNote:'이동 도움 요청',latitude:'위도',longitude:'경도'};
  const groups=[{name:'이용자 · 보호자',keys:['subject','senderName','senderPhone','guardianName','guardianPhone']},{name:'방문 시설',keys:['facility','receiver','facilityPhone','address','detailAddress','place']},{name:'방문 일정',keys:['scheduledAt','supportNote']}];
  let prefs={...U.settings(storageRead(localStorage,SETTINGS_KEY))},profiles=storageRead(localStorage,PROFILE_KEY)||{};
  prefs.mapProvider=['google','kakao'].includes(prefs.mapProvider)?prefs.mapProvider:'kakao';
  if(['vehicle','guardian','facility'].includes(pathRole)){prefs.role=pathRole;prefs.mode='standard';prefs.roleChosen=true;}
  if(pathRole==='visitor'){prefs.role='vehicle';prefs.mode='easy';prefs.roleChosen=true;}
  // The preview opens directly into a usable screen; role changes remain available above it.
  if(!prefs.roleChosen){prefs.role='vehicle';prefs.mode='standard';prefs.roleChosen=true;}
  let state=null,tokens=null,connected=!serverMode,busy=false,offline=false,pending=storageRead(sessionStorage,PENDING_KEY);
  let panel=null,draft=null,editorFrom=null,editorError='',searchResults=[],searchMessage='',searchTicket=null,editorSaving=false;
  let error='',notice='',noticeTimer=null,codeInput='',heartbeatAt=0,refreshing=false,activeVisit=null;
  let changingRole=false,roleRevision=0;
  let addressDispose=null,addressSavedScroll=0;
  let draftPreferences=null;
  const role=()=>prefs.mode==='easy'?'visitor':prefs.role;
  const terminal=()=>['COMPLETED','ARRIVAL_REPORTED','CANCELLED'].includes(state?.state);
  const canWrite=()=>state?.state==='PLANNED'&&!state?.arrivalNotice;
  const safe=()=>H.safeVehicle(state,Date.now());
  const btn=(a,t,kind='primary',enabled=true,attrs='')=>`<button type="button" class="button ${kind}" data-action="${a}" ${!enabled?'disabled':''} ${attrs}>${t}</button>`;
  const icon=(name)=>{
    const svg={shield:'<path d="M12 2 20 5v7c0 5-8 10-8 10S4 17 4 12V5l8-3Z"/><path d="m8 12 3 3 5-6"/>',pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',check:'<path d="m5 12 4 4L19 6"/>',arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',person:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 3-8 8-8s8 3 8 8"/>',phone:'<path d="m5 3 4 5-2 3c2 3 3 4 6 6l3-2 5 4c-2 4-5 3-9 1C7 17 3 13 2 8c-1-3 1-5 3-5Z"/>',car:'<path d="M4 10 6 5h12l2 5 1 3v6H3v-6l1-3Z"/><path d="M4 10h16M7 15h2m6 0h2"/>',building:'<path d="M4 21V5l8-3 8 3v16M2 21h20M9 21v-6h6v6M8 7h1m6 0h1"/>',settings:'<path d="M4 7h16M4 17h16"/><circle cx="8" cy="7" r="3"/><circle cx="16" cy="17" r="3"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',route:'<circle cx="6" cy="19" r="2"/><path d="M7 17V7a4 4 0 0 1 4-4h4m-3-2 3 2-3 2"/><circle cx="17" cy="5" r="2"/>',edit:'<path d="m4 20 4-.7L20 7l-3-3L5 16Z"/>',close:'<path d="M18 6 6 18M6 6l12 12"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/'};
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${svg[name]||svg.check}</svg>`;
  };
  const savePrefs=()=>storageWrite(localStorage,SETTINGS_KEY,prefs);
  function toast(msg){notice=msg;const n=$('toast');if(!n)return;n.textContent=msg;n.classList.add('show');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>{n.classList.remove('show');notice='';},3500);}
  function showError(msg){error=msg;if(panel==='editor')editorError=msg;render(true);}
  function clearError(){error='';editorError='';}
  function recordState(next){if(!storageWrite(localStorage,STATE_KEY,next))throw new Error('기기에 저장하지 못했어요. 저장 공간을 확인해 주세요.');state=next;}
  async function api(path,opts={}){if(offline)throw new Error('연결되지 않았어요.');const c=new AbortController(),t=setTimeout(()=>c.abort(),8000);try{const res=await fetch(path,{...opts,signal:c.signal});const d=await res.json();if(!res.ok){const e=new Error(d.message||'서버 응답을 확인해 주세요.');e.code=d.code||d.error;e.status=res.status;e.data=d;throw e;}return d;}finally{clearTimeout(t);}}
  async function connect(renderNow=true){const b=await api('/api/bootstrap');tokens=b.tokens;const d=await api('/api/state',{headers:{Authorization:'Bearer '+tokens[role()]}});state=d.state;state.info={...C.defaults(),...state.info};connected=true;if(renderNow)render();}
  function setPending(x){pending=x;storageWrite(sessionStorage,PENDING_KEY,x);}
  async function send(type,payload={},asRole=role(),quiet=false){
    if(busy)return false;
    if(!connected||offline){if(!quiet)showError('연결 상태를 확인해 주세요.');return false;}
    busy=true;clearError();
    try{
      if(serverMode){const intent={key:uid(),tripId:state.id,expectedVersion:state.version,event:{type,payload},role:asRole};setPending(intent);
        const submit=()=>api('/api/events',{method:'POST',headers:{Authorization:'Bearer '+tokens[asRole],'Content-Type':'application/json'},body:JSON.stringify(intent)});
        let data;
        try {data=await submit();}
        catch(e){
          // Vehicle telemetry and a human confirmation can arrive at the same state version.
          // A rejected VERSION write has not been applied. Refresh and retry once.
          if(e.code!=='VERSION')throw e;
          const latest=await api('/api/state',{headers:{Authorization:'Bearer '+tokens[asRole]}});
          state=latest.state;
          if(state.id!==intent.tripId)throw e;
          intent.expectedVersion=state.version;
          setPending(intent);
          data=await submit();
        }
        state=data.state;setPending(null);
      }else{
        const result=H.apply(state,{type,payload},{role:asRole,id:asRole==='facility'?'staff-001':asRole==='vehicle'?'sender-001':asRole==='visitor'?'visitor-001':asRole},{now:Date.now(),code:code()});
        recordState(result.state);
        if(result.rejected){const e=new Error(result.rejected.message);e.code=result.rejected.code;throw e;}
      }
      return true;
    }catch(e){
      // A rejected verification may still advance the server version (wrong-code attempts).
      // Adopt the returned authoritative state before the next confirmation.
      if(e.data?.state)state=e.data.state;
      if(e.status)setPending(null);
      if(!quiet||type!=='VEHICLE')error=e.message||U.publicError(e.code);
      return false;
    }finally{busy=false;if(!quiet)render(true);}
  }
  async function renewVehicle(){if(!state||terminal()||!state.vehicle.known||busy||offline||!connected||serverMode&&role()!=='vehicle')return;
    if(Date.now()-heartbeatAt<10000)return;heartbeatAt=Date.now();await send('VEHICLE',{known:state.vehicle.known,restricted:state.vehicle.restricted,gear:state.vehicle.gear,speed:state.vehicle.speed},'simulator',true);
  }
  async function initialConditions(){if(!state||!connected)return;for(const [type,payload,by] of U.initialPresentationEvents(state)){await send(type,payload,by,true);}}
  async function newVisit(scenario=state.scenario){
    if(busy)return;clearError();
    if(serverMode){try{await api('/api/reset',{method:'POST',headers:{Authorization:'Bearer '+tokens.simulator,'Content-Type':'application/json'},body:JSON.stringify({scenario})});await connect(false);}catch(e){showError(e.message);return;}}
    else recordState(H.createTrip(scenario,Date.now(),uid()));
    await initialConditions();const cfg=profiles[scenario];if(cfg){const allowed=C.fieldsFor(role()),patch=Object.fromEntries(Object.entries(cfg).filter(([k])=>allowed.includes(k)));if(Object.keys(patch).length)await send('CONFIGURE_VISIT',patch,role(),true);}
    panel=null;draft=null;codeInput='';savePrefs();render();toast('새 방문을 시작했어요.');
  }
  async function refresh(){
    if(!serverMode||offline||busy||refreshing||changingRole||!tokens)return;
    const requestedRole=role(),revision=roleRevision;
    refreshing=true;
    try{
      const result=await api('/api/state',{headers:{Authorization:'Bearer '+tokens[requestedRole]}});
      if(busy||changingRole||revision!==roleRevision||requestedRole!==role())return;
      if(state?.id!==result.state.id||result.state.version>state.version){state=result.state;render();}
      connected=true;
    }catch(e){
      if(changingRole||revision!==roleRevision)return;
      if(e.status===401){try{await connect();}catch{connected=false;render();}}
      else{connected=false;render();}
    }finally{refreshing=false;}
  }
  async function setRole(v){
    if(!Object.hasOwn(ROLE_LABELS,v))return;
    if(v==='visitor'){prefs.role='vehicle';prefs.mode='easy';}
    else{prefs.role=v;prefs.mode='standard';}
    prefs.roleChosen=true;savePrefs();panel=null;draft=null;clearError();
    const nextRole=role(),revision=++roleRevision;
    if(!serverMode){render(true);return;}
    // Server states are role-scoped projections, so never paint the previous
    // person's private state while fetching the new role's permitted view.
    changingRole=true;state=null;
    $('app').innerHTML='<div class="shell"><div class="loading" role="status">화면을 불러오고 있어요.</div></div>';
    if(location.pathname!==`/${nextRole}`)window.history.replaceState({},'',`/${nextRole}`);
    try{
      const d=await api('/api/state',{headers:{Authorization:'Bearer '+tokens[nextRole]}});
      if(revision!==roleRevision)return;
      state=d.state;state.info={...C.defaults(),...state.info};connected=true;
    }catch{
      if(revision!==roleRevision)return;
      connected=false;
      $('app').innerHTML='<div class="shell"><div class="error-banner" role="alert">화면을 불러오지 못했어요.</div><button class="button outlined" data-action="reconnect">다시 연결</button></div>';
      return;
    }finally{
      if(revision===roleRevision)changingRole=false;
    }
    if(revision===roleRevision)render(true);
  }
  function roleTabs(){
    return `<nav class="demo-role-tabs" role="tablist" aria-label="역할별 화면 전환">${Object.entries(ROLE_TABS).map(([r,label])=>`<button type="button" class="demo-role-tab" role="tab" data-action="select-role" data-role="${r}" aria-selected="${role()===r}" aria-controls="main" tabindex="${role()===r?'0':'-1'}">${icon(r==='vehicle'?'car':r==='guardian'?'shield':r==='facility'?'building':'person')}<span>${label}</span></button>`).join('')}</nav>`;
  }
  function locationCard(summaryOnly=false){const info=state.info,loc=info.address||(summaryOnly?'':'도착지를 지정해 주세요.');
    return `<section class="panel place-panel"><div class="panel-heading"><span class="panel-icon">${icon('pin')}</span><div><div class="eyebrow">도착지</div><h2>${escapeHTML(info.facility)}</h2></div></div>${loc?`<p class="address ${info.address?'':'empty-address'}">${escapeHTML(loc)}</p>`:''}${info.detailAddress?`<p class="hint">${escapeHTML(info.detailAddress)}</p>`:''}${info.postcode?`<p class="postcode-tag">우편번호 ${escapeHTML(info.postcode)}</p>`:''}${info.place?`<p class="hint">${escapeHTML(info.place)}</p>`:''}${summaryOnly?'':`<div class="inline-actions">${role()!=='facility'&&role()!=='guardian'?btn('open-editor',icon('edit')+' 정보 수정','light',canWrite()):''}${C.hasDestination(info)?mapLink('길안내 열기'):btn('edit-destination','도착지 설정','outlined',canWrite())}</div>`}</section>`;
  }
  function mapLink(label='지도 길안내'){
    if(!C.hasDestination(state.info))return '';
    const url=C.navigation(state.info,prefs.mapProvider||'kakao',false);
    if(prefs.mapProvider==='kakao')label=C.hasCoordinates(state.info)?'카카오맵 길찾기':'카카오맵에서 위치 보기';
    return `<a class="button outlined" data-map-link="true" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${icon('route')} ${escapeHTML(label)} ${icon('arrow')}</a>`;
  }
  function contactBtn(){const phone=role()==='facility'?(state.info.senderPhone||state.info.guardianPhone):state.info.facilityPhone;
    return phone?`<a class="button light" data-phone-link="true" href="tel:${escapeHTML(phone)}">${icon('phone')} 전화하기</a>`:btn('open-editor',icon('phone')+' 연락처 등록','light',canWrite());
  }
  function steps(){const current={PLANNED:0,EN_ROUTE:1,ARRIVED:2,VERIFYING:2,COMPLETED:3,ARRIVAL_REPORTED:3,CANCELLED:0}[state.state]||0;const titles=['준비','이동','도착·인계','완료'];return `<ol class="steps" aria-label="방문 진행 단계">${titles.map((s,i)=>`<li class="${i<current?'passed':i===current?'active':''}"><span>${i<current?'✓':i+1}</span><strong>${s}</strong></li>`).join('')}</ol>`;}
  function mainActions(){
    const info=state.info,st=state.state;
    if(terminal())return `<section class="panel action-panel"><span class="success-mark">${icon('check')}</span><h2>${st==='COMPLETED'?'인계 확인 완료':st==='ARRIVAL_REPORTED'?'도착 알림 완료':'방문이 취소됐어요'}</h2><p class="hint">${time(state.completedAt)||'새 방문을 준비할 수 있어요.'}</p>${btn('new-visit','다음 방문 준비하기')}</section>`;
    if(st==='PLANNED')return `<section class="panel action-panel"><div class="eyebrow">01 · 방문 준비</div><h2>방문을 시작할까요?</h2><p class="hint">${C.hasDestination(info)?'도착지 주소가 저장됐어요.':'먼저 도착지 주소를 등록해 주세요.'}</p>${C.hasDestination(info)?`<p class="prepared-address">${escapeHTML(info.address||info.facility)}${info.detailAddress?`<small>${escapeHTML(info.detailAddress)}</small>`:''}</p>${mapLink('지도에서 확인하기')}${btn('edit-destination','도착지 변경','light',canWrite())}`:''}${!state.consent?btn('easy-screen','본인 동의 확인하기','outlined'):C.hasDestination(info)?btn('depart','방문 시작하기','primary',safe()):btn('edit-destination','도착지 입력하기','primary')}${!safe()?btn('park','정차 상태 확인','light'):''}</section>`;
    if(st==='EN_ROUTE')return `<section class="panel action-panel"><div class="eyebrow">02 · 이동 중</div><h2>목적지로 이동 중이에요</h2><p class="hint">도착 후 안전하게 정차한 다음 확인해 주세요.</p>${mapLink('지도 길안내')}${btn('arrive','도착했어요','primary')}</section>`;
    if(info.mode==='ARRIVAL_ONLY')return `<section class="panel action-panel"><h2>도착 소식을 남겨주세요</h2>${btn('report','도착 알림 남기기','primary',safe()&&state.consent)}</section>`;
    const reasons=H.handoffReasons(state,Date.now());
    return `<section class="panel action-panel"><div class="eyebrow">03 · 대면 인계</div><h2>담당자에게 직접 인계해 주세요</h2>${reasons.length?`<p class="hint">${escapeHTML(reasons[0])}</p>`:''}${state.challenge?`<div class="pin-code"><span>담당자에게 보여줄 번호</span><strong>${escapeHTML(state.challenge.code||'••••••')}</strong><small id="codeSeconds"></small></div>`:''}${state.senderConfirmed?'<div class="confirmed">✓ 인계자가 확인했어요. 시설 담당자의 확인을 기다려요.</div>':state.challenge?btn('sender','직접 인계했어요','primary',!reasons.length):btn('issue','연결번호 받기','primary',!reasons.length)}${state.challenge?btn('issue','번호 다시 받기','light',!reasons.length):''}${!safe()?btn('park','정차 상태 다시 확인','light'):''}${!H.readyNow(state,Date.now())?`<p class="hint">시설 담당자의 맞이할 준비 확인이 필요해요.</p>${btn('select-role','시설에서 준비 확인하기','outlined',true,'data-role="facility"')}`:''}</section>`;
  }
  function vehicleView(){return `<section class="hero"><span class="eyebrow">보호자 · 인계자</span><h1>${state.state==='PLANNED'?'오늘의 동행을 준비해요':state.state==='COMPLETED'?'잘 인계했어요':state.state==='EN_ROUTE'?'목적지로 이동 중이에요':'안전하게 인계해요'}</h1><p>${escapeHTML(state.info.subject||'이용자')}님의 ${escapeHTML(state.info.title)}</p></section>${steps()}<div class="main-grid"><div>${mainActions()}</div><div>${locationCard()}<section class="panel compact"><h3>연락하기</h3><p class="hint">${escapeHTML(state.info.receiver||'시설 담당자')}</p>${contactBtn()}</section></div></div>${history()}`;}
  function facilityView(){const s=state,info=s.info,ready=H.readyNow(s,Date.now());
    return `<section class="hero"><span class="eyebrow">시설 담당자</span><h1>${s.state==='COMPLETED'?'인수를 완료했어요':s.state==='ARRIVED'||s.state==='VERIFYING'?'방문자가 도착했어요':'방문자를 맞이할 준비를 해요'}</h1><p>${escapeHTML(info.facility)}</p></section><section class="panel"><div class="eyebrow">방문 정보</div><h2>${escapeHTML(info.subject)}님</h2><div class="facility-details"><div><span>방문 목적</span><strong>${escapeHTML(info.title)}</strong></div><div><span>승하차 장소</span><strong>${escapeHTML(info.place||'-')}</strong></div><div><span>담당자</span><strong>${escapeHTML(info.receiver)}</strong></div></div>${info.supportNote?`<div class="hint support-note">${escapeHTML(info.supportNote)}</div>`:''}</section>${s.arrivalNotice?`<section class="panel"><h2>도착 알림</h2><p>${time(s.arrivalNotice.at)} 도착 소식이 등록됐어요.</p>${s.arrivalNotice.acknowledgedAt?'<p class="confirmed">✓ 알림 확인 완료</p>':btn('ack','도착 알림 확인','primary')}</section>`:''}${s.state==='COMPLETED'?`<section class="panel"><p class="confirmed">✓ 양쪽 확인 완료</p><p class="hint">${time(s.completedAt)}</p></section>`:info.mode==='ARRIVAL_ONLY'?'<section class="panel"><p class="hint">도착 알림을 확인할 수 있어요.</p></section>':`<section class="panel action-panel"><h2>인수 확인</h2><p class="hint">${ready?'맞이할 준비가 됐어요.':'준비가 됐으면 아래 버튼을 눌러주세요.'}</p>${!ready?btn('ready','맞이할 준비 완료','primary'):btn('absent','지금은 인수하기 어려워요','light')}${s.state==='VERIFYING'?`<div class="code-input"><label for="codeInput">연결번호 6자리</label><input id="codeInput" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" type="text" placeholder="000000" value="${escapeHTML(codeInput)}"></div><p class="hint">${s.senderConfirmed?'인계자가 직접 인계를 확인했어요.':'인계자의 확인을 기다리고 있어요.'}</p>${btn('receiver','직접 인수했어요','primary',!s.receiverConfirmed)}`:'<p class="hint">방문자가 도착하면 연결번호를 입력할 수 있어요.</p>'}</section>`}<section class="panel compact"><h3>인계자에게 연락</h3>${contactBtn()}</section>`;
  }
  function guardianView(){const items=[['방문 준비',state.state!=='PLANNED'],['출발',!['PLANNED'].includes(state.state)],['도착',state.locationInside],['인계자 확인',state.senderConfirmed],['시설 담당자 확인',state.receiverConfirmed]];
    return `<section class="hero"><span class="eyebrow">보호자 · 진행 조회</span><h1>${state.state==='COMPLETED'?'인계를 마쳤어요':state.state==='EN_ROUTE'?'이동하고 있어요':state.state==='PLANNED'?'방문을 준비하고 있어요':'인계 상황을 확인해요'}</h1><p>${escapeHTML(state.info.subject)}님 · ${escapeHTML(state.info.title)}</p></section><section class="panel"><h2>방문 진행 현황</h2><ul class="checklist">${items.map(([name,yes])=>`<li><span class="state-dot ${yes?'done':''}">${yes?'✓':''}</span><span>${name}</span><strong>${yes?'확인됨':'대기 중'}</strong></li>`).join('')}</ul><p class="hint">상태는 인계자와 시설 담당자의 확인 결과로 변경돼요.</p></section>${locationCard()}${history()}`;
  }
  function easyView(){const s=state;if(!s.info.adult)return `<section class="hero large-hero"><span class="eyebrow">쉬운 화면</span><h1>방문할 곳을<br>선택해 주세요</h1></section><div class="choice-list">${btn('easy-senior','주야간보호센터','primary big')}${btn('easy-community','경로당','outlined big')}</div>`;
    if(s.arrivalNotice)return `<section class="hero large-hero"><span class="success-mark">${icon('check')}</span><h1>도착 소식을<br>남겼어요</h1><p>${s.arrivalNotice.acknowledgedAt?'담당자가 확인했어요.':'담당자가 확인하면 알려드려요.'}</p></section><section class="panel">${locationCard(true)}${s.info.facilityPhone?contactBtn():''}</section>${btn('new-visit','다른 방문 시작하기','outlined big')}`;
    if(!s.consent)return `<section class="hero large-hero"><span class="eyebrow">도착 소식 공유</span><h1>${escapeHTML(s.info.facility)}에<br>방문하시나요?</h1><p>도착 알림을 보내려면 동의가 필요해요.</p></section>${btn('consent','동의하고 계속','primary big')}${contactBtn()}`;
    return `<section class="hero large-hero"><span class="eyebrow">오늘의 방문</span><h1>${escapeHTML(s.info.facility)}에<br>도착하셨나요?</h1></section>${locationCard()}<div class="action-stack">${btn('notify','도착 알리기','primary big')}${contactBtn()}</div>`;
  }
  function history(){if(role()==='facility')return '';return `<details class="history"><summary>${icon('clock')} 방문 기록</summary><ul>${state.events.filter(e=>!['VEHICLE','CREATED'].includes(e.type)).slice(-10).reverse().map(e=>`<li><time>${time(e.at)}</time><span>${escapeHTML(e.message)}</span></li>`).join('')||'<li>방문 기록이 없어요.</li>'}</ul></details>`;}
  function rolePicker(){return `<section class="hero large-hero"><span class="eyebrow">안심동행 플랫폼</span><h1>어떻게<br>이용하시나요?</h1><p>이용할 화면을 선택해 주세요.</p></section><div class="choice-list">${[['vehicle','보호자 · 인계자','방문 준비와 인계 확인'],['guardian','보호자 · 진행 조회','진행 상황 확인'],['facility','시설 담당자','방문자 맞이와 인수'],['visitor','쉬운 화면','큰 글씨로 도착 알리기']].map(([key,label,desc])=>`<button class="role-option" data-action="select-role" data-role="${key}"><span class="role-symbol">${icon(key==='facility'?'building':key==='visitor'?'person':'shield')}</span><span><strong>${label}</strong><small>${desc}</small></span>${icon('arrow')}</button>`).join('')}</div>`;}
  function visitPicker(){return `<div class="modal-title"><span class="eyebrow">새 방문</span><h2>방문 유형 선택</h2></div><div class="choice-list">${Object.entries(H.SCENARIOS).map(([key,s])=>`<button data-action="choose-visit" data-scenario="${key}" class="role-option"><span>${icon(s.adult?'person':'building')}</span><span><strong>${escapeHTML(s.title)}</strong><small>${escapeHTML(s.facility)}</small></span>${icon('arrow')}</button>`).join('')}</div>`;}
  function textField(key){if(!C.fieldsFor(role()).includes(key))return '';const type=key==='scheduledAt'?'datetime-local':key.endsWith('Phone')?'tel':'text',v=draft?.[key]??'';const readonly=!canWrite();const optional=['senderPhone','guardianPhone','facilityPhone','scheduledAt','supportNote','place'].includes(key);
    if(key==='address')return `<div class="edit-field address-field"><div class="address-field-heading"><label for="field-address">도착지 주소</label>${btn('search-address','주소 검색','outlined',canWrite())}</div><input name="address" id="field-address" type="text" maxlength="180" autocomplete="off" value="${escapeHTML(v)}" placeholder="도로명 주소 또는 건물 이름" ${readonly?'disabled':''}></div>`;
    return `<label class="edit-field"><span>${VISIT_FIELDS[key]}${optional?'':' <i>·</i>'}</span>${key==='supportNote'?`<textarea name="${key}" id="field-${key}" rows="2" maxlength="${C.TEXT[key]}" ${readonly?'disabled':''}>${escapeHTML(v)}</textarea>`:`<input name="${key}" id="field-${key}" type="${type}" ${type==='tel'?'inputmode="tel"':''} maxlength="${C.TEXT[key]||180}" autocomplete="off" value="${escapeHTML(v)}" placeholder="${key==='address'?'방문할 곳의 도로명 주소':key==='facilityPhone'?'예: 02-1234-5678':''}" ${readonly?'disabled':''}>`}</label>`;
  }
  function editor(){const locked=!canWrite();return `<div class="modal-title"><span class="eyebrow">방문 정보</span><h2>${editorFrom==='destination'?'도착지 설정':'방문 정보 수정'}</h2></div>${locked?'<p class="hint">진행 중인 방문은 정보를 바꿀 수 없어요. 다음 방문에서 수정해 주세요.</p>':''}<form id="visitForm" novalidate><div id="editorError" class="inline-error" role="alert" ${editorError?'':'hidden'}>${escapeHTML(editorError)}</div>${(editorFrom==='destination'?[{name:'방문 장소',keys:['facility','address','detailAddress','place']}]:groups).map(g=>{const fields=g.keys.map(textField).filter(Boolean).join('');return fields?`<fieldset><legend>${g.name}</legend><div class="fields">${fields}</div>${g.keys.includes('address')?addressLookup():''}</fieldset>`:''}).join('')}<fieldset><legend>이용 설정</legend><label class="edit-field"><span>길 안내 지도</span><select id="mapProvider" name="mapProvider"><option value="google" ${(draftPreferences?.mapProvider||prefs.mapProvider)==='google'?'selected':''}>Google 지도</option><option value="kakao" ${(draftPreferences?.mapProvider||prefs.mapProvider)==='kakao'?'selected':''}>카카오맵</option></select></label><label class="edit-field"><span>글씨 크기</span><select name="textSize" id="textSize">${[100,125,150,200].map(n=>`<option value="${n}" ${Number(draftPreferences?.text||prefs.text)===n?'selected':''}>${n}%</option>`).join('')}</select></label></fieldset><div class="sticky-action"><button class="button primary" type="submit">${locked?'화면 설정 저장':editorFrom==='destination'?'도착지 저장':'방문 정보 저장'}</button></div></form>`;}
  function addressLookup(){return `<div class="lookup-actions"><a class="text-link" data-search-link="true" href="https://map.kakao.com/" target="_blank" rel="noopener noreferrer">지도에서 직접 검색</a></div><div id="lookupStatus" class="lookup-status" role="status">${escapeHTML(searchMessage)}</div><div id="lookupResults" class="lookup-results">${searchResults.map((it,i)=>`<button type="button" class="search-result" data-action="choose-address" data-index="${i}"><strong>${escapeHTML(it.name||it.address)}</strong><small>${escapeHTML(it.address)}</small></button>`).join('')}</div>${draft?.postcode?`<p class="postcode-tag">우편번호 ${escapeHTML(draft.postcode)}</p>`:''}${C.fieldsFor(role()).includes('latitude')?`<details class="coordinate"><summary>좌표 직접 입력</summary><div class="fields">${['latitude','longitude'].map(key=>`<label class="edit-field"><span>${VISIT_FIELDS[key]}</span><input type="number" step="any" name="${key}" id="field-${key}" value="${escapeHTML(draft?.[key]??'')}" ${canWrite()?'':'disabled'}></label>`).join('')}</div></details>`:''}`;}
  function demoMenu(){return `<div class="modal-title"><span class="eyebrow">방문 관리</span><h2>시연 도구</h2></div><div class="demo-actions">${state.challenge&&role()==='facility'?btn('use-demo-code','연결번호 입력하기','outlined'):''}${btn('new-visit','새 방문 시작','light')}${btn('open-visits','방문 종류 바꾸기','light')}</div>`;}
  function render(force=false){if(!state)return;
    // Never unmount an active form because of a background poll or heartbeat.
    if(!force&&(panel==='editor'||panel==='address'||document.activeElement?.id==='codeInput'))return;
    document.documentElement.className='text-'+prefs.text;
    const body=!prefs.roleChosen?rolePicker():prefs.mode==='easy'?easyView():role()==='facility'?facilityView():role()==='guardian'?guardianView():vehicleView();
    const overlays=panel==='address'?addressPanel():panel==='editor'?editor():panel==='demo'?demoMenu():panel==='visits'?visitPicker():'';
    $('app').innerHTML=`<div class="shell" ${panel?'inert aria-hidden="true"':''}><header class="topbar"><div class="branding"><span class="mark">${icon('shield')}</span><span>안심동행 <small>플랫폼</small></span></div><button class="icon-button" aria-label="방문 정보 설정" data-action="open-editor">${icon('settings')}</button></header>${prefs.roleChosen?`${roleTabs()}<div class="role-line"><span class="role-label">${escapeHTML(ROLE_LABELS[role()])}</span>${role()!=='facility'?`<button class="text-link" data-action="open-visits">방문 변경</button>`:''}</div>`:''}${!connected||offline?`<div class="error-banner">연결을 확인해 주세요. ${btn('reconnect','다시 연결','outlined')}</div>`:''}${error?`<div id="inlineError" class="error-banner" role="alert">${escapeHTML(error)}</div>`:''}<main id="main">${body}</main><footer class="foot"><span>안심동행 v${H.VERSION}</span><button class="text-link" data-action="open-demo">시연 도구</button></footer></div>${panel?`<div class="overlay"><section class="dialog ${panel==='address'?'address-dialog':''}" role="dialog" aria-modal="true" aria-labelledby="dialogTitle"><header><span>안심동행</span><button class="icon-button" aria-label="닫기" data-action="close">${icon('close')}</button></header><div class="dialog-body" id="dialogTitle">${overlays}</div></section></div>`:''}`;
    countdown();
    if(panel==='editor'){document.querySelector('.dialog>header .icon-button')?.focus({preventScroll:true});}
  }
  function countdown(){const el=$('codeSeconds');if(el&&state.challenge){const n=Math.max(0,Math.ceil((state.challenge.expiresAt-Date.now())/1000));el.textContent=n?`남은 시간 ${n}초`:'번호가 만료됐어요.';}}
  function openPanel(name,section=null){panel=name;editorFrom=section;editorError='';searchMessage='';searchResults=[];draft=name==='editor'?{...C.defaults(),...state.info}:null;draftPreferences=name==='editor'?{mapProvider:prefs.mapProvider,text:prefs.text}:null;render(true);}
  function closePanel(){if(panel==='address'){returnFromAddress();return;}addressDispose?.();addressDispose=null;panel=null;draft=null;draftPreferences=null;searchTicket=null;editorFrom=null;editorError='';render(true);}
  function captureEditor(){if(!draft)return;if($('mapProvider'))draftPreferences={mapProvider:$('mapProvider').value,text:Number($('textSize').value)};document.querySelectorAll('#visitForm [name]').forEach(el=>{if(C.fieldsFor(role()).includes(el.name))draft[el.name]=el.value;});}
  function fieldError(msg){editorError=msg;const el=$('editorError');if(el){el.textContent=msg;el.hidden=false;el.scrollIntoView({block:'nearest'});}else toast(msg);}
  async function saveEditor(){
    if(editorSaving)return;
    editorSaving=true;
    const savedDraft=draft,savedTrip=state.id,savedRole=role();
    const submitButton=$('visitForm')?.querySelector('button[type=submit]');
    if(submitButton)submitButton.disabled=true;
    captureEditor();const form=$('visitForm'),map=form?.querySelector('#mapProvider')?.value,txt=form?.querySelector('#textSize')?.value;
    const allowed=C.fieldsFor(role());let patch={};
    try{
      // A quiet telemetry write can overlap the user's submit. Keep the intent
      // until that write finishes rather than turning busy into a save error.
      const deadline=Date.now()+10000;
      while(busy&&Date.now()<deadline)await new Promise(resolve=>setTimeout(resolve,50));
      if(panel!=='editor'||draft!==savedDraft)return;
      if(state.id!==savedTrip||role()!==savedRole)throw new Error('방문 정보가 변경됐어요. 다시 확인해 주세요.');
      if(busy)throw new Error('다른 작업을 처리 중이에요. 잠시 후 다시 저장해 주세요.');
      if(canWrite()){const keys=editorFrom==='destination'?['facility','address','postcode','detailAddress','place','latitude','longitude']:allowed;
      patch=C.cleanPatch(Object.fromEntries(keys.filter(k=>allowed.includes(k)).map(k=>[k,draft[k]??''])),role(),state.info);
      if(editorFrom==='destination'&&!C.hasDestination({...state.info,...patch}))throw new Error('주소를 입력하거나 검색 결과를 선택해 주세요.');
      if(!await send('CONFIGURE_VISIT',patch,role(),true))throw new Error(error||'정보를 저장하지 못했어요.');
      profiles[state.scenario]={...(profiles[state.scenario]||{}),...patch};storageWrite(localStorage,PROFILE_KEY,profiles);
    }
    if(['google','kakao'].includes(map))prefs.mapProvider=map;
    if([100,125,150,200].includes(Number(txt)))prefs.text=Number(txt);
    savePrefs();closePanel();toast('저장했어요.');
    }catch(e){fieldError(e.message||'입력을 확인해 주세요.');}
    finally{editorSaving=false;const button=$('visitForm')?.querySelector('button[type=submit]');if(button)button.disabled=false;}
  }
  function updateSearchUI(){const e=$('lookupStatus');if(e)e.textContent=searchMessage;const b=$('lookupResults');if(b)b.innerHTML=searchResults.map((it,i)=>`<button type="button" class="search-result" data-action="choose-address" data-index="${i}"><strong>${escapeHTML(it.name||it.address)}</strong><small>${escapeHTML(it.address)}</small></button>`).join('');}
  function addressPanel(){return `<div class="modal-title"><h2>주소 검색</h2><p class="hint">도로명이나 건물 이름으로 검색해 주세요.</p></div><div id="addressLoadStatus" role="status">검색창을 불러오고 있어요.</div><div id="addressWidget" class="address-widget"></div><div id="addressRetry" hidden>${btn('retry-address','다시 연결하기','outlined')}</div>${btn('back-address','직접 입력으로 돌아가기','light')}`;}
  function returnFromAddress(){addressDispose?.();addressDispose=null;searchTicket=null;panel='editor';render(true);const el=document.querySelector('.dialog-body');if(el)el.scrollTop=addressSavedScroll;}
  function acceptAddress(result){
    if(!draft||!result||typeof result.address!=='string'||!result.address.trim())return;
    draft.address=result.address.trim().slice(0,180);draft.postcode=/^\d{5}$/.test(result.postcode||'')?result.postcode:'';
    draft.latitude=null;draft.longitude=null;draft.detailAddress='';
    // A location search cannot change which facility is responsible for the handoff.
    // Facility identity is edited deliberately in Visit Settings.
    searchMessage='주소를 불러왔어요.';searchResults=[];
    returnFromAddress();$('field-detailAddress')?.focus();toast('주소를 불러왔어요.');
  }
  async function searchAddress(){
    if(!canWrite()){fieldError('새 방문에서 주소를 변경해 주세요.');return;}
    captureEditor();addressSavedScroll=document.querySelector('.dialog-body')?.scrollTop||0;
    const query=String(draft.address||'').trim();searchTicket=uid();
    if(window.VehicleBridge?.openAddressSearch){
      searchMessage='주소 검색을 열고 있어요.';updateSearchUI();
      try{window.VehicleBridge.openAddressSearch(query,searchTicket);}catch{searchMessage='주소 검색을 열지 못했어요. 다시 시도해 주세요.';updateSearchUI();}
      return;
    }
    panel='address';render(true);mountAddress(query);
  }
  function mountAddress(query){
    addressDispose?.();
    const target=$('addressWidget');if(!target)return;
    $('addressLoadStatus').hidden=false;$('addressLoadStatus').textContent='검색창을 불러오고 있어요.';$('addressRetry').hidden=true;
    addressDispose=window.AddressPicker.mount(target,{query,
      onselect:acceptAddress,
      onready:()=>{const el=$('addressLoadStatus');if(el)el.hidden=true;},
      onerror:e=>{const el=$('addressLoadStatus');if(el){el.hidden=false;el.textContent=e.message;}$('addressRetry')?.removeAttribute('hidden');}
    });
  }
  window.onPostcodeResult=(ticket,result,message)=>{
    if(ticket!==searchTicket||panel!=='editor')return;
    if(result){acceptAddress(result);return;}
    searchTicket=null;searchMessage=message||'';updateSearchUI();
  };
  window.onAddressResults=(ticket,places,message)=>{if(ticket!==searchTicket||panel!=='editor')return;searchResults=(Array.isArray(places)?places:[]).filter(p=>C.hasCoordinates(p)).slice(0,5);searchMessage=searchResults.length?'검색 결과에서 주소를 선택해 주세요.':message||'검색 결과가 없어요. 주소를 직접 입력할 수 있어요.';updateSearchUI();};
  function mapNavigate(url){if(window.VehicleBridge?.openMap){window.VehicleBridge.openMap(url);return;}window.open(url,'_blank','noopener,noreferrer');}
  document.addEventListener('input',e=>{
    if(panel==='editor'&&e.target.name&&draft&&C.fieldsFor(role()).includes(e.target.name)){
      draft[e.target.name]=e.target.value;
      if(e.target.name==='address'){
        draft.latitude=null;draft.longitude=null;draft.postcode='';
        searchTicket=null;
        for(const f of ['latitude','longitude']){const x=$('field-'+f);if(x)x.value='';}
        searchResults=[];searchMessage='';updateSearchUI();
      }
    }
    if(e.target.id==='codeInput'){codeInput=e.target.value.replace(/\D/g,'').slice(0,6);e.target.value=codeInput;}
  });
  document.addEventListener('submit',async e=>{if(e.target.id==='visitForm'){e.preventDefault();await saveEditor();}});
  document.addEventListener('click',async e=>{
    const a=e.target.closest('[data-map-link],[data-search-link],[data-phone-link]');
    if(a){if(a.hasAttribute('data-map-link')||a.hasAttribute('data-search-link')){if(a.hasAttribute('data-search-link')){const q=$('field-address')?.value||$('field-facility')?.value||'';a.href=C.navigation({address:q.trim()},prefs.mapProvider,true);}
      if(window.VehicleBridge?.openMap){e.preventDefault();mapNavigate(a.href);} }
      else if(a.hasAttribute('data-phone-link')&&window.VehicleBridge?.openDialer){e.preventDefault();window.VehicleBridge.openDialer(a.href.slice(4));}
      return;
    }
    const button=e.target.closest('[data-action]');if(!button||button.disabled||busy)return;const action=button.dataset.action;
    if(!C.can(action,role())){toast('현재 화면에서는 사용할 수 없는 기능이에요.');return;}
    if(action==='select-role'){setRole(button.dataset.role);return;}
    if(action==='open-editor'){openPanel('editor');return;}
    if(action==='edit-destination'){openPanel('editor','destination');return;}
    if(action==='open-visits'){openPanel('visits');return;}
    if(action==='open-demo'){openPanel('demo');return;}
    if(action==='close'){closePanel();return;}
    if(action==='choose-visit'){closePanel();await newVisit(button.dataset.scenario);return;}
    if(action==='new-visit'){closePanel();await newVisit();return;}
    if(action==='search-address'){await searchAddress();return;}
    if(action==='back-address'){returnFromAddress();return;}
    if(action==='retry-address'){mountAddress(draft?.address||'');return;}
    if(action==='choose-address'){
      const p=searchResults[Number(button.dataset.index)];if(!p)return;
      draft.address=p.address;draft.latitude=p.latitude;draft.longitude=p.longitude;
      $('field-address').value=p.address;for(const k of ['latitude','longitude']){const x=$('field-'+k);if(x)x.value=p[k];}
      searchMessage='주소를 선택했어요.';searchResults=[];updateSearchUI();return;
    }
    if(action==='use-demo-code'){
      try{const source=serverMode?(await api('/api/state',{headers:{Authorization:'Bearer '+tokens.vehicle}})).state:state;
        if(source.id!==state.id||!source.challenge?.code){toast('인계자 화면에서 새 번호를 받아주세요.');return;}
        codeInput=source.challenge.code;closePanel();render(true);
      }catch{toast('연결번호를 불러오지 못했어요.');}return;
    }
    if(action==='easy-screen'){setRole('visitor');return;}
    if(action==='easy-senior'){await newVisit('senior');return;}
    if(action==='easy-community'){await newVisit('community');return;}
    if(action==='consent'){await send('SELF_CONSENT',{accepted:true},'visitor');return;}
    if(action==='notify'){await send('NOTIFY_ARRIVAL',{},'visitor');return;}
    if(action==='ready'){await send('READY',{ready:true},'facility');return;}
    if(action==='absent'){await send('READY',{ready:false},'facility');return;}
    if(action==='park'){await send('VEHICLE',{known:true,restricted:false,gear:'P',speed:0},'simulator');return;}
    if(action==='depart'){
      if(!C.hasDestination(state.info)){openPanel('editor','destination');return;}
      await send('DEPART',{},'vehicle');return;
    }
    if(action==='arrive'){
      if(await send('VEHICLE',{known:true,restricted:false,gear:'P',speed:0},'simulator',true))await send('ARRIVE',{},'simulator');return;
    }
    if(action==='issue'){await send('ISSUE_CODE',{},'vehicle');return;}
    if(action==='sender'){await send('SENDER_CONFIRM',{inPerson:true},'vehicle');return;}
    if(action==='receiver'){
      if(codeInput.length!==6){showError('연결번호 6자리를 입력해 주세요.');$('codeInput')?.focus();return;}
      await send('RECEIVER_CONFIRM',{inPerson:true,code:codeInput},'facility');return;
    }
    if(action==='report'){await send('REPORT_ARRIVAL',{},'vehicle');return;}
    if(action==='ack'){await send('ACK_ARRIVAL_NOTICE',{},'facility');return;}
    if(action==='reconnect'){offline=false;try{if(serverMode)await connect();else connected=true;error='';render();}catch{showError('연결할 수 없어요.');}return;}
  });
  document.addEventListener('keydown',e=>{
    const tab=e.target.closest?.('.demo-role-tab');
    if(tab&&['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){
      e.preventDefault();
      const keys=Object.keys(ROLE_TABS),idx=keys.indexOf(tab.dataset.role);
      const target=e.key==='Home'?0:e.key==='End'?keys.length-1:(idx+(e.key==='ArrowRight'?1:-1)+keys.length)%keys.length;
      const next=keys[target];
      Promise.resolve(setRole(next)).then(()=>document.querySelector(`.demo-role-tab[data-role="${next}"]`)?.focus());
      return;
    }
    if(e.key==='Escape'&&panel){e.preventDefault();closePanel();}
  });
  window.handleAppBack=()=>{if(panel){closePanel();return true;}return false;};
  window.onNativeNavigationStatus=msg=>toast(String(msg));
  window.onNativeDialerStatus=msg=>toast(String(msg));
  window.onMapStatus=msg=>toast(String(msg));
  window.addEventListener('storage',e=>{if(!serverMode&&e.key===STATE_KEY&&e.newValue){try{state=JSON.parse(e.newValue);render();}catch{}}});
  async function init(){
    if(serverMode){try{await connect(false);}catch{connected=false;state=H.createTrip('kindergarten',Date.now(),uid());}}
    else{state=storageRead(localStorage,STATE_KEY);if(!state||state.schema!==1){state=H.createTrip('kindergarten',Date.now(),uid());storageWrite(localStorage,STATE_KEY,state);}state.info={...C.defaults(),...state.info};}
    await initialConditions();savePrefs();render();
    setInterval(()=>{countdown();if(serverMode)refresh();renewVehicle();},2000);
  }
  init();
})();
