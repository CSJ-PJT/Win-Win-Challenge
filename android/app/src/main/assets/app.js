/* Synthetic-data presentation. Self-reported arrival never completes a handoff. */
(function() {
  'use strict';
  const H = window.Handoff, U = window.HandoffUI, C=window.VisitConfig;
  const STATE_KEY = 'ansim-synthetic-demo-v1', PENDING_KEY = 'ansim-pending-v2';
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pathRole = location.pathname.split('/').filter(Boolean)[0];
  const serverMode = !window.ANSIM_STANDALONE && /^https?:$/.test(location.protocol) && ['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname);
  let state, tokens, prefs = U.settings(read(localStorage, U.SETTINGS_KEY));
  let connected = !serverMode, offline = false, busy = false, refreshing = false;
  let pending = read(sessionStorage, PENDING_KEY), panel = null, easyStep = 'home', errorText = '';
  let codeInput = '', heartbeat = true, lastBeat = 0;
  let draft=null, searchResults=[], searchMessage='', searchId=null, searchTimer=null, afterDestination=null;
  const PROFILE_KEY='ansim-visit-profiles-v3';
  let profiles=read(localStorage,PROFILE_KEY)||{};
  let nativeStatus = '일반 기기 체험', toastTimer, lastFocused;
  if (['vehicle', 'facility', 'guardian'].includes(pathRole)) { prefs.mode = 'standard'; prefs.role = pathRole; prefs.roleChosen=true; }
  if (pathRole === 'visitor') {prefs.mode = 'easy';prefs.roleChosen=true;}
  const icons = {
    shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
    pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
    phone: '<path d="m5 3 4 5-2 3c2 3 3 4 6 6l3-2 5 4c-2 4-5 3-9 1C7 17 3 13 2 8c-1-3 1-5 3-5Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
    back: '<path d="M20 12H5m6-6-6 6 6 6"/>',
    person: '<circle cx="12" cy="7" r="4"/><path d="M4 21v-3a8 8 0 0 1 16 0v3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    settings: '<path d="M4 7h16M4 17h16"/><circle cx="8" cy="7" r="3"/><circle cx="16" cy="17" r="3"/>',
    car: '<path d="m4 9 3-5h10l3 5 1 3v6H3v-6l1-3Z"/><path d="M5 9h14M6 14h2m8 0h2M6 18v3m12-3v3"/>',
    building: '<path d="M4 21V5l8-3 8 3v16M2 21h20M9 21v-6h6v6M8 7h1m6 0h1M8 11h1m6 0h1"/>'
  };
  function icon(name) { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.check}</svg>`; }
  function read(storage, key) { try { return JSON.parse(storage.getItem(key)); } catch { return null; } }
  function write(storage, key, value) { try { if (value === null) storage.removeItem(key); else storage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } }
  function savePrefs() { write(localStorage, U.SETTINGS_KEY, prefs); }
  function setPending(value) { pending = value; write(sessionStorage, PENDING_KEY, value); }
  function uid() { if (crypto.randomUUID) return crypto.randomUUID(); const a = new Uint8Array(16); crypto.getRandomValues(a); return Array.from(a,x=>x.toString(16).padStart(2,'0')).join(''); }
  function newCode() { let n; const a = new Uint32Array(1); do { crypto.getRandomValues(a); n=a[0]; } while(n>=4294000000); return String(n%1000000).padStart(6,'0'); }
  function role() { return prefs.mode === 'easy' ? 'visitor' : prefs.role; }
  function time(at) { return new Date(at).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit',hour12:false}); }
  function done() { return ['COMPLETED','ARRIVAL_REPORTED','CANCELLED'].includes(state?.state); }
  function blocked(allow=true) { return !allow || busy || !connected || offline ? 'disabled' : ''; }
  function notify(text) { $('toast').textContent=text; $('toast').className='toast show'; clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('toast').className='toast',5500); }
  async function request(path, options={}) {
    if (offline) throw new Error('OFFLINE');
    const controller = new AbortController(), timer = setTimeout(()=>controller.abort(),6000);
    try {
      const res=await fetch(path,{...options,signal:controller.signal});
      const data=await res.json();
      if(!res.ok) { const e=new Error(data.message || data.error); e.status=res.status; e.data=data; throw e; }
      return data;
    } finally { clearTimeout(timer); }
  }
  async function connect() {
    const data = await request('/api/bootstrap'); tokens=data.tokens;
    // An older local demo store may not yet have the visitor role token.
    if (!tokens.visitor) throw new Error('SERVER_UPDATE_REQUIRED');
    const latest=await request('/api/state',{headers:{Authorization:'Bearer '+tokens[role()]}});
    state=latest.state; connected=true; reconcileTrip(); render();
  }
  function reconcileTrip() {
    if(pending && state && pending.tripId!==state.id) { setPending(null); easyStep='home'; errorText='방문이 바뀌었어요. 새 방문 정보를 확인해 주세요.'; }
  }
  async function refresh() {
    if(!serverMode || offline || busy || refreshing || !tokens) return;
    refreshing=true;
    try {
      const data=await request('/api/state',{headers:{Authorization:'Bearer '+tokens[role()]}});
      // Never replace a newer write with an older poll that was already in flight.
      if(busy || (state?.id===data.state.id && state.version>data.state.version)) return;
      const changed=!state || state.id!==data.state.id || state.version!==data.state.version || !connected;
      if(state && state.id!==data.state.id) { codeInput=''; easyStep='home'; }
      state=data.state; connected=true; reconcileTrip();
      if(changed) render();
    } catch(e) {
      if(e.status===401) { try { await connect(); return; } catch {} }
      if(connected) { connected=false; render(); }
    } finally { refreshing=false; }
  }
  async function send(type, payload={}, asRole=role(), quiet=false) {
    if(busy) return false;
    if(!connected || offline) { errorText='아직 보내지 못했어요. 연결을 확인하거나 담당자에게 전화해 주세요.'; if(!quiet)render(); return false; }
    const event={type,payload};
    if(pending && (pending.tripId!==state.id || JSON.stringify(pending.event)!==JSON.stringify(event) || pending.role!==asRole)) {
      errorText='앞서 보낸 요청의 결과를 먼저 확인해 주세요.'; if(!quiet)render(); return false;
    }
    busy=true; errorText=''; if(!quiet)render();
    try {
      if(serverMode) {
        const intent=pending || {key:uid(),tripId:state.id,expectedVersion:state.version,event,role:asRole};
        setPending(intent);
        const data=await request('/api/events',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tokens[asRole]},body:JSON.stringify(intent)});
        state=data.state; setPending(null);
      } else {
        const result=H.apply(state,event,{role:asRole,id:asRole==='facility'?'staff-001':asRole==='vehicle'?'sender-001':asRole==='visitor'?'visitor-001':asRole},{now:Date.now(),code:newCode()});
        // Local storage must succeed before showing the write as saved.
        if(!write(localStorage,STATE_KEY,result.state)) throw new Error('STORAGE_UNAVAILABLE');
        state=result.state;
        if(result.rejected) { const e=new Error(result.rejected.message);e.data=result.rejected;e.status=409;throw e; }
      }
      return true;
    } catch(e) {
      if(quiet && type==='VEHICLE' && e.data?.error==='VERSION') {setPending(null);return false;}
      if(e.status) { setPending(null); errorText=U.publicError(e.data?.code || e.data?.error || e.code); }
      else if(serverMode) { connected=false; errorText='전송 결과를 확인하지 못했어요. 연결 후 결과를 확인해 주세요.'; }
      else errorText=e.message==='STORAGE_UNAVAILABLE'?'이 기기에 저장하지 못했어요. 저장 공간과 브라우저 설정을 확인해 주세요.':U.publicError(e.code);
      if(e.data?.state)state=e.data.state;
      return false;
    } finally { busy=false; if(!quiet || errorText)render(); }
  }
  async function reset(scenario, mode=prefs.mode) {
    if(busy) return;
    offline=false; busy=true; render();
    try {
      if(serverMode) {
        if(!connected) await connect();
        await request('/api/reset',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tokens.simulator},body:JSON.stringify({scenario})});
        prefs.mode=mode; await connect();
      } else {
        const next=H.createTrip(scenario,Date.now(),uid());
        if(!write(localStorage,STATE_KEY,next)) throw new Error('저장 실패');
        state=next; prefs.mode=mode;
      }
      setPending(null); easyStep='home'; codeInput=''; errorText=''; heartbeat=true; lastBeat=0;
      savePrefs(); panel=null; render(true); notify('새 방문을 시작했어요.');
    } catch { errorText='새 방문을 열지 못했어요. 다시 연결해 주세요.'; render(); }
    finally { busy=false; }
    await prepareNewVisit();
    if(profiles[state.scenario]) {
      const patch=Object.fromEntries(Object.entries(profiles[state.scenario]).filter(([k])=>C.fieldsFor(role()).includes(k)));
      if(Object.keys(patch).length)await send('CONFIGURE_VISIT',patch,role(),true);
    }
    render(true);
  }
  async function prepareNewVisit() {
    if(!state || !connected || offline || pending) return;
    // Demo fixtures only: do not change domain guards or overwrite deliberate failures.
    for(const [type,payload,asRole] of U.initialPresentationEvents(state)) {
      if(!await send(type,payload,asRole,true)) break;
    }
  }
  function button(action,label,kind='primary',allow=true,extra='') {
    if(!C.can(action,role()))return '';
    const local=['resolve-pending','reset','restart','visit-picker','show-facility','show-vehicle','show-guardian','phone','start-easy-demo','start-community','navigate','destination','settings','save-settings','search-address','external-search'].includes(action);
    return `<button type="button" class="${kind}" data-action="${action}" ${local?(!allow||busy?'disabled':''):blocked(allow)} ${extra}>${label}</button>`;
  }
  function contactValue(){return prefs.role==='facility'&&prefs.mode!=='easy'?(state.info.senderPhone||state.info.guardianPhone||''):(state.info.facilityPhone||'');}
  function contact() { return `<button type="button" class="contact-button" data-action="phone">${icon('phone')}<span>${role()==='facility'?'인계자에게 전화':'담당자에게 전화'}</span>${icon('arrow')}</button>`; }
  function destination(compact=false) {
    return `<section class="destination-card ${compact?'compact':''}" aria-label="방문 정보"><span class="place-icon">${icon('building')}</span><div><p class="eyebrow">${role()==='facility'?'우리 시설':'오늘 방문할 곳'}</p><h2>${esc(U.facility(state))}</h2>${state.info.address?`<p>${esc(state.info.address)}</p>`:''}<p>${esc(state.info.place)}</p><p class="recipient">${icon('person')}<span>${esc(U.recipient(state))}</span></p>${role()!=='facility'?`<button class="map-link" data-action="navigate">${icon('pin')}${C.hasDestination(state.info)?'길 안내':'도착지 정하기'}</button>`:''}${state.info.scheduledAt?`<p>${esc(state.info.scheduledAt.replace('T',' '))}</p>`:''}</div></section>`;
  }
  function easyView() {
    const notice=state.arrivalNotice;
    if(!state.info.adult) return `<main id="main" tabindex="-1" class="easy-main"><p class="eyebrow">오늘의 방문</p><h1>어디로 가시나요?</h1><div class="action-stack">${button('start-easy-demo',icon('building')+'<span>돌봄센터 방문</span>','primary large')}${button('start-community',icon('person')+'<span>경로당 방문</span>','secondary large')}</div></main>`;
    if(done() && !notice) return `<main id="main" tabindex="-1" class="easy-main"><h1>${state.state==='CANCELLED'?'취소된 방문이에요':'방문을 마쳤어요'}</h1>${destination()}${button('restart','새 방문 시작하기','primary large')}${contact()}</main>`;
    if(!state.consent) return `<main id="main" tabindex="-1" class="easy-main"><p class="eyebrow">도착 알림</p><h1>도착 소식을<br>공유할까요?</h1>${destination()}<p class="lead">도착 시각을 담당자에게 알려요.</p><div class="action-stack">${button('consent-yes','동의하고 계속','primary large')}<button type="button" class="secondary large" data-action="phone">전화로 연락하기</button></div></main>`;
    if(notice && !pending) return `<main id="main" tabindex="-1" class="easy-main"><div class="result-mark">${icon('check')}</div><h1>도착 알림을<br>남겼어요</h1><section class="receipt-card"><dl><div><dt>방문 장소</dt><dd>${esc(U.facility(state))}</dd></div><div><dt>받는 사람</dt><dd>${esc(notice.recipient)}</dd></div><div><dt>알림 시각</dt><dd>${time(notice.at)}</dd></div></dl><p class="read-status">${notice.acknowledgedAt?'담당자가 '+time(notice.acknowledgedAt)+'에 읽었어요.':'담당자 확인 전'}</p></section><div class="action-stack">${contact()}${button('restart','다시 시작하기','text-button')}</div></main>`;
    if(easyStep==='confirm' || easyStep==='error' || pending) return `<main id="main" tabindex="-1" class="easy-main"><button class="back-button" data-action="easy-back">${icon('back')}이전 화면</button><h1>${easyStep==='error'?'아직 보내지<br>못했어요':'이곳에 도착했다고<br>알릴까요?'}</h1>${destination()}<div class="action-stack">${pending?button('resolve-pending','전송 결과 확인하기','primary large'):button('easy-send',busy?'보내고 있어요…':'도착 소식 보내기','primary large')}${contact()}</div></main>`;
    return `<main id="main" tabindex="-1" class="easy-main"><p class="eyebrow">오늘의 동행</p><h1>${esc(U.facility(state))}에<br>도착하셨나요?</h1>${destination()}<div class="action-stack">${button('easy-arrive',icon('pin')+'<span>도착 알리기</span>','primary large')}${contact()}</div></main>`;
  }
  function handoffProgress() {
    const current={PLANNED:0,EN_ROUTE:1,ARRIVED:2,VERIFYING:2,COMPLETED:3,ARRIVAL_REPORTED:3,CANCELLED:-1}[state.state];
    const labels=['출발 준비','이동','도착·확인',state.info.mode==='HANDOFF'?'인계 완료':'알림 완료'];
    return `<ol class="progress" aria-label="방문 진행 상태">${labels.map((label,i)=>`<li class="${i<=current?'reached':''} ${i===current?'current':''}" ${i===current?'aria-current="step"':''}><span>${i<current?'✓':i+1}</span>${label}</li>`).join('')}</ol>`;
  }
  function vehicleActions() {
    const safe=H.safeVehicle(state,Date.now()), ready=H.readyNow(state,Date.now());
    if(done())return `<section class="action-card"><div class="receipt-inline">${icon('check')}<span>${state.state==='CANCELLED'?'방문을 취소했어요':time(state.completedAt)+'에 확인을 마쳤어요'}</span></div>${button('restart','다시 시작하기')}</section>`;
    if(state.state==='PLANNED')return `<section class="action-card"><h2>이동을 준비해요</h2><div class="status-row"><span>차량 정차</span><strong>${safe?'확인됨':'확인 전'}</strong></div><div class="status-row"><span>담당자 준비</span><strong>${ready?'준비됨':state.info.mode==='ARRIVAL_ONLY'?'도착 알림':'확인 전'}</strong></div>${!safe?button('park','정차 상태 확인','secondary'):''}${!state.consent?button('mode-easy','본인 동의 확인하기','secondary'):button('depart',C.hasDestination(state.info)?'이 목적지로 출발하기':'도착지 정하고 출발','primary',safe)}</section>`;
    if(state.state==='EN_ROUTE')return `<section class="action-card travel"><span class="travel-icon">${icon('car')}</span><h2>목적지로 이동 중이에요</h2><p>${esc(state.info.place)}</p>${button('navigate','길 안내','secondary')}${button('arrive','도착·정차하기')}</section>`;
    if(state.info.mode==='ARRIVAL_ONLY')return `<section class="action-card"><h2>도착을 알려주세요</h2>${!safe?button('park','정차 상태 확인','secondary'):''}${button('report','도착 소식 남기기','primary',safe&&state.consent&&state.locationInside)}</section>`;
    const reasons=H.handoffReasons(state,Date.now());
    const recovery=(!safe?button('park','정차 상태 확인','secondary'):'')+(!ready?'<p class="read-status">담당자의 준비 확인을 기다리고 있어요.</p>':'')+(!state.consent?button('mode-easy','본인 동의 확인하기','secondary'):'')+(!state.locationInside?button('return-area','지정 구역 도착 확인','secondary'):'');
    return `<section class="action-card"><h2>직접 만나 확인해요</h2>${recovery}${state.challenge?`<div class="connection-code"><span>담당자에게 보여줄 번호</span><strong aria-label="연결번호 ${esc((state.challenge.code||'').split('').join(' '))}">${esc(state.challenge.code||'••••••')}</strong><span id="codeSeconds"></span></div>${state.senderConfirmed?'<p class="read-status">직접 인계 확인 완료 · 담당자 확인을 기다려요</p>':button('sender','직접 인계했어요','primary',reasons.length===0)}${button('issue','연결번호 새로 받기','text-button',reasons.length===0)}`:button('issue','연결번호 받기','primary',reasons.length===0)}</section>`;
  }
  function facilityActions() {
    const ready=H.readyNow(state,Date.now());
    const notice=state.arrivalNotice?`<section class="arrival-card"><p class="eyebrow">도착 소식</p><h2>${esc(U.subject(state))}님이 도착했어요</h2><p>${time(state.arrivalNotice.at)}</p>${state.arrivalNotice.acknowledgedAt?'<p class="read-status">읽음 확인 완료</p>':button('ack','도착 소식 확인','secondary',!done())}</section>`:'';
    if(done())return notice+`<section class="action-card"><h2>${state.state==='COMPLETED'?'인수 확인 완료':'방문 종료'}</h2>${state.completedAt?`<p>${time(state.completedAt)}</p>`:''}</section>`;
    if(state.info.mode==='ARRIVAL_ONLY')return notice+`<section class="action-card"><h2>${esc(U.subject(state))}님의 방문</h2><p>${state.arrivalNotice?'도착 소식을 확인해 주세요.':'도착 소식을 기다리고 있어요.'}</p></section>`;
    return notice+`<section class="action-card"><p class="eyebrow">${state.state==='PLANNED'?'방문 예정':state.state==='EN_ROUTE'?'방문자 이동 중':'도착 · 인수 대기'}</p><h2>${esc(U.subject(state))}</h2><p>${esc(state.info.receiver)}</p>${state.info.supportNote?`<p class="support-note">${esc(state.info.supportNote)}</p>`:''}<div class="button-row">${button('ready',ready?'준비 상태 갱신':'맞이할 준비가 됐어요','secondary')}${button('absent','지금은 인수 어려움','text-button')}</div>${state.state==='VERIFYING'?`<div class="input-section"><p class="read-status">${state.senderConfirmed?'인계자가 직접 인계했음을 확인했어요.':'인계자의 대면 확인을 기다리고 있어요.'}</p><label for="codeInput">인계자가 보여주는 연결번호</label><div class="code-entry"><input id="codeInput" type="text" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="6자리 번호" value="${esc(codeInput)}"></div>${state.receiverConfirmed?'<p class="read-status">담당자 확인 완료</p>':button('receiver','직접 인수했어요','primary',!state.receiverConfirmed)}</div>`:'<p class="help">도착 후 인계자와 연결번호를 확인해 주세요.</p>'}</section>`;
  }
  function guardianActions() {
    const checks=[[state.locationInside,'지정 구역 도착'],[state.senderConfirmed,'인계자 대면 확인'],[state.receiverConfirmed,'담당자 대면 확인']];
    return `<section class="action-card"><h2>${esc(U.subject(state))}님의 이동</h2><ul class="checklist">${checks.map(([ok,text])=>`<li><span class="check-symbol ${ok?'done':''}">${ok?'✓':'·'}</span><span>${text}</span><strong>${ok?'확인됨':'대기 중'}</strong></li>`).join('')}</ul>${!state.senderConfirmed&&state.info.mode==='HANDOFF'?'<p class="help">인계자가 본인 화면에서 ‘직접 인계했어요’를 누르면 확인돼요.</p>':''}${state.arrivalNotice?`<p class="notice">${time(state.arrivalNotice.at)}에 본인이 도착 소식을 남겼어요.</p>`:''}</section>`;
  }
  function timeline() {
    const visible=state.events.filter(e=>!['VEHICLE','CREATED'].includes(e.type));
    return `<details class="history"><summary>${icon('clock')}방문 기록 보기</summary><ol>${visible.slice(-8).reverse().map(e=>`<li><time>${time(e.at)}</time><span>${esc(e.message)}</span></li>`).join('') || '<li>아직 방문 기록이 없어요.</li>'}</ol></details>`;
  }
  function standardView() {
    const [title,desc]=U.nextStep(state,prefs.role), facility=prefs.role==='facility';
    const action=facility?facilityActions():prefs.role==='guardian'?guardianActions():vehicleActions();
    return `<main id="main" tabindex="-1" class="standard-main"><section class="intro"><p class="eyebrow">${facility?'시설 · 담당자':prefs.role==='guardian'?'보호자 · 진행 조회':'보호자 · 인계자'}</p><h1>${esc(title)}</h1><p class="lead">${esc(desc)}</p></section>${facility?'':handoffProgress()}<div class="main-grid"><div>${destination()}${contact()}</div><div>${action}</div></div>${!facility?timeline():''}</main>`;
  }
  const FIELD_LABELS={facility:'시설 이름',subject:'이용자 이름',receiver:'인수 담당자',place:'승하차 장소',address:'도착지 주소',latitude:'위도',longitude:'경도',facilityPhone:'시설 연락처',senderName:'인계자 이름',senderPhone:'인계자 연락처',guardianName:'보호자 이름',guardianPhone:'보호자 연락처',scheduledAt:'방문 예정 일시',supportNote:'이동 도움 요청'};
  function captureDraft(){if(!draft)return;document.querySelectorAll('[data-field]').forEach(el=>{draft[el.dataset.field]=el.value;});}
  function field(key){const type=key.endsWith('Phone')?'tel':key==='scheduledAt'?'datetime-local':'text';const v=draft?.[key]??state.info[key]??'';return `<label class="field" for="field-${key}"><span>${FIELD_LABELS[key]}</span><input id="field-${key}" data-field="${key}" type="${type}" ${['latitude','longitude'].includes(key)?'inputmode="decimal"':''} maxlength="${C.TEXT[key]||25}" autocomplete="off" value="${esc(v)}" ${state.state!=='PLANNED'||state.arrivalNotice?'disabled':''}></label>`;}
  function settingsFields(keys){return keys.filter(k=>C.fieldsFor(role()).includes(k)).map(field).join('');}
  function settingsPanel() {
    const locked=state.state!=='PLANNED'||!!state.arrivalNotice;
    return `<h2 id="panelTitle">설정</h2><div id="settingsError" class="inline-error" role="alert" ${errorText?'':'hidden'}>${esc(errorText)}</div>${locked?'<p class="notice">진행 중인 방문 정보는 유지돼요. 새 방문에서 변경해 주세요.</p>':''}${role()!=='facility'?`<fieldset><legend>이용자와 연락처</legend><div class="settings-grid">${settingsFields(C.PERSONAL)}</div></fieldset>`:''}${role()!=='guardian'?`<fieldset><legend>${role()==='facility'?'우리 시설':'방문 시설'}</legend><div class="settings-grid">${settingsFields(['facility','receiver','facilityPhone','place'])}</div><button class="secondary" data-action="destination" ${locked?'disabled':''}>도착지 설정</button></fieldset>`:''}<fieldset><legend>길 안내</legend><label class="field" for="mapProvider"><span>사용할 지도</span><select id="mapProvider"><option value="kakao" ${prefs.mapProvider==='kakao'?'selected':''}>카카오맵</option><option value="google" ${prefs.mapProvider==='google'?'selected':''}>Google 지도</option></select></label></fieldset><fieldset><legend>글씨 크기</legend><div class="choice-row wrap">${[100,125,150,200].map(n=>`<button data-action="text-size" data-size="${n}" aria-pressed="${prefs.text===n}">${n}%</button>`).join('')}</div></fieldset><div class="settings-save"><button class="primary" data-action="save-settings">저장</button></div>${role()==='visitor'&&state.consent&&!done()?button('consent-no','방문 상태 공유 중단','text-button'):''}`;
  }
  function destinationPanel(){return `<h2 id="panelTitle">도착지 설정</h2><div id="settingsError" class="inline-error" role="alert" ${errorText?'':'hidden'}>${esc(errorText)}</div>${settingsFields(['facility','address','place'])}<div class="button-row"><button class="secondary" data-action="search-address">주소 찾기</button><button class="text-button" data-action="external-search">지도에서 검색</button></div><p id="searchStatus" role="status">${esc(searchMessage)}</p><div class="search-results">${searchResults.map((r,i)=>`<button class="visit-choice" data-action="select-address" data-index="${i}"><span><strong>${esc(r.name||r.address)}</strong><small>${esc(r.address)}</small></span>${icon('arrow')}</button>`).join('')}</div><details><summary>좌표 직접 입력</summary><div class="settings-grid">${settingsFields(['latitude','longitude'])}</div></details><div class="settings-save"><button class="primary" data-action="save-destination">${afterDestination==='depart'?'저장하고 출발':'도착지 저장'}</button></div>`;}
  function rolePicker(){return `<main id="main" tabindex="-1" class="easy-main"><p class="eyebrow">안심동행 시작하기</p><h1>어떻게<br>이용하시나요?</h1><div class="visit-choices">${[['vehicle','보호자 · 인계자','방문 준비부터 인계 확인까지'],['guardian','보호자 · 진행 조회','이동과 인계 결과 확인'],['facility','시설 담당자','방문자 맞이와 인수 확인'],['visitor','쉬운 화면','도착 알림과 전화']].map(([r,t,d])=>`<button class="visit-choice" data-action="choose-role" data-role="${r}"><span><strong>${t}</strong><small>${d}</small></span>${icon('arrow')}</button>`).join('')}</div></main>`;}
  function demoPanel() {
    return `<h2 id="panelTitle">시연 도구</h2>${role()==='facility'&&state.challenge?button('load-code','연결번호 채우기','secondary'):''}<fieldset><legend>다른 역할로 보기</legend><div class="choice-row wrap">${[['vehicle','차량'],['facility','시설'],['guardian','보호자']].map(([r,label])=>`<button data-action="role" data-role="${r}" aria-pressed="${prefs.role===r&&prefs.mode==='standard'}">${label}</button>`).join('')}<button data-action="mode-easy">쉬운 화면</button></div></fieldset><fieldset><legend>방문 선택</legend><label class="sr-only" for="scenario">방문 종류</label><select id="scenario">${Object.entries(H.SCENARIOS).map(([key,s])=>`<option value="${key}" ${state.scenario===key?'selected':''}>${esc(s.title)}</option>`).join('')}</select>${button('reset','선택한 방문으로 새로 시작','secondary')}</fieldset><fieldset><legend>차량과 연결 상태</legend><div class="demo-grid">${button('park','P · 정차','secondary',!done())}${button('drive','D · 주행','secondary',!done())}${button('arrive','도착·정차','secondary',state.state==='EN_ROUTE')}${button('ready','담당자 준비','secondary',!done()&&state.info.mode==='HANDOFF')}<button class="secondary" data-action="offline">${offline?'연결 복구':'통신 끊김'}</button>${button('unknown','차량 신호 없음','secondary',!done())}${button('leave','구역 이탈','secondary',!done())}<button class="secondary" data-action="heartbeat">${heartbeat?'신호 갱신 중단':'신호 갱신 재개'}</button>${button('cancel','방문 취소','secondary',!done())}</div></fieldset>${state.info.adult&&!done()?`<label class="checkline"><input id="consentCheck" type="checkbox" ${state.consent?'checked':''}><span>본인 동의</span></label>`:''}<fieldset><legend>담당자 연락처</legend><label for="demoPhone">전화번호</label><input id="demoPhone" type="tel" autocomplete="off" placeholder="전화번호 입력" value="${esc(prefs.phone)}"><button class="secondary" data-action="save-phone">연락처 저장</button><p class="help"></p></fieldset><details><summary>개발 연결 상태</summary><p>${serverMode?'로컬 서버 동기화':'이 기기 내 체험'}</p><p>${esc(nativeStatus)}</p>${window.VehicleBridge?'<button class="secondary" data-action="navi">NaviHelper 연결 확인</button><button class="secondary" data-action="route">공식 예제 경로 시험</button>':''}<p>화면 버전 ${H.VERSION}</p></details>`;
  }
  function visitPanel() {
    return `<h2 id="panelTitle">방문 선택</h2><div class="visit-choices">${Object.entries(H.SCENARIOS).map(([key,v])=>`<button class="visit-choice" data-action="select-visit" data-scenario="${key}"><span>${icon(v.adult?'person':'building')}</span><span><strong>${esc(v.title)}</strong><small>${esc(v.facility.split(' · ')[0])}</small></span>${icon('arrow')}</button>`).join('')}</div>`;
  }
  function phonePanel() {
    const number=contactValue(), facility=role()==='facility';
    return `<h2 id="panelTitle">${facility?'인계자에게 전화':'담당자에게 전화'}</h2><p class="lead">${esc(facility?(state.info.senderName||state.info.guardianName||'인계자'):U.recipient(state))}</p>${number?`<p class="phone-number">${esc(number)}</p><button class="primary large" data-action="open-dialer">전화 화면 열기</button>`:`<p>연락처를 등록해 주세요.</p><button class="primary" data-action="settings">설정 열기</button>`}`;
  }
  function render(focusMain=false) {
    if(!state) return;
    if(panel==='settings'||panel==='destination')captureDraft();
    const active=document.activeElement;
    const focused=active?.id ? '#'+active.id : active?.dataset?.action ? `[data-action="${active.dataset.action}"]${active.dataset.size?`[data-size="${active.dataset.size}"]`:active.dataset.role?`[data-role="${active.dataset.role}"]`:''}` : null;
    const selection=typeof active?.selectionStart==='number'?active.selectionStart:null;
    const detailsOpen=!!document.querySelector('.history[open]');
    document.documentElement.className='text-'+prefs.text;
    document.body.className=prefs.mode==='easy'?'easy-mode':'standard-mode';
    const body=panel==='settings'?settingsPanel():panel==='demo'?demoPanel():panel==='phone'?phonePanel():panel==='visits'?visitPanel():panel==='destination'?destinationPanel():'';
    $('app').innerHTML=`<div class="app-shell" ${panel?'inert aria-hidden="true"':''}><header class="app-header"><div class="brand"><span class="brand-mark">${icon('shield')}</span><div class="brand-name">안심동행 <span>플랫폼</span></div></div><button class="settings-button" data-action="settings" aria-label="화면 설정">${icon('settings')}<span>설정</span></button></header><div class="mode-bar"><span>${role()==='facility'?'시설 담당자':role()==='visitor'?'쉬운 화면':role()==='guardian'?'보호자 · 조회':'보호자 · 인계자'}</span>${role()!=='facility'?`<button class="mode-toggle" data-action="${prefs.mode==='easy'?'mode-standard':'mode-easy'}">${prefs.mode==='easy'?'기본 화면으로':'큰 글씨 · 쉬운 화면'}</button>`:''}</div><div class="visit-switch"><span>${esc(state.info.title)}</span>${role()!=='facility'?'<button data-action="visit-picker">방문 변경</button>':''}</div>${!connected||offline?`<div class="connection-warning" role="status"><strong>연결을 확인해 주세요</strong><p>마지막으로 확인한 내용만 보여드려요.</p><button class="secondary" data-action="reconnect">다시 연결하기</button></div>`:''}${errorText?`<div id="inlineError" class="inline-error" role="alert">${esc(errorText)}${pending?'<button class="secondary" data-action="resolve-pending">전송 결과 확인하기</button>':''}</div>`:''}${!prefs.roleChosen?rolePicker():prefs.mode==='easy'?easyView():standardView()}<footer class="app-footer"><span>v${H.VERSION}</span><button data-action="demo">시연 도구</button></footer></div>${panel?`<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="panelTitle" tabindex="-1"><header><span>안심동행</span><button data-action="close-panel" aria-label="닫기">닫기</button></header>${body}</section></div>`:''}`;
    if(detailsOpen) document.querySelector('.history')?.setAttribute('open','');
    if(focusMain) { (panel?document.querySelector('.modal'):$('main'))?.focus({preventScroll:true}); window.scrollTo(0,0); }
    else if(focused) { const el=document.querySelector(focused); if(el && !el.closest('[inert]')) { el.focus({preventScroll:true}); if(selection!==null && el.setSelectionRange)try{el.setSelectionRange(selection,selection);}catch{} } }
    countdown();
  }
  function countdown() { const el=$('codeSeconds'); if(el&&state?.challenge) { const n=Math.max(0,Math.ceil((state.challenge.expiresAt-Date.now())/1000)); el.textContent=n?'유효 시간 '+n+'초':'시간이 지났어요. 새 번호를 받아주세요.'; } }
  function openPanel(kind) { if(['settings','destination'].includes(panel))captureDraft(); if(['settings','destination'].includes(kind)&&!draft)draft={...C.defaults(),...state.info}; if(!['settings','destination'].includes(kind))draft=null; errorText=''; lastFocused=document.activeElement?.dataset?.action; panel=kind; render(true); }
  function closePanel() { panel=null;draft=null;afterDestination=null;searchId=null;clearTimeout(searchTimer); render(); const el=lastFocused?document.querySelector(`[data-action="${lastFocused}"]`):null; (el||$('main'))?.focus({preventScroll:true}); }
  function switchMode(mode) { prefs.mode=mode;prefs.roleChosen=true; savePrefs(); panel=null; errorText=''; easyStep='home'; render(true); if(serverMode)refresh(); }
  async function retryPending() {
    if(!pending) { await refresh(); return; }
    const intent=pending;
    if(!connected && !offline) try { await connect(); } catch { errorText='연결되지 않았어요. 담당자에게 전화해 주세요.';render();return; }
    if(!pending || !state || intent.tripId!==state.id) return;
    const ok=await send(intent.event.type,intent.event.payload,intent.role);
    if(ok) { easyStep='home'; render(true); }
    else await refresh();
  }
  async function saveSettings(destinationOnly=false){
    captureDraft();const chosenMap=$('mapProvider')?.value;const info={...draft};const fields=destinationOnly?C.PLACE:C.fieldsFor(role());
    const raw=Object.fromEntries(fields.filter(k=>C.fieldsFor(role()).includes(k)).map(k=>[k,info[k]??'']));
    try {
      if(state.state==='PLANNED'&&!state.arrivalNotice){
        const patch=C.cleanPatch(raw,role(),state.info);
        if(destinationOnly&&!C.hasDestination({...state.info,...patch}))throw new Error('도착지 주소를 입력하거나 검색 결과를 선택해 주세요.');
        if(!await send('CONFIGURE_VISIT',patch,role()))return;
        profiles[state.scenario]={...(profiles[state.scenario]||{}),...patch};write(localStorage,PROFILE_KEY,profiles);
      }
      if(chosenMap)prefs.mapProvider=chosenMap==='google'?'google':'kakao';savePrefs();
      const next=afterDestination;afterDestination=null;closePanel();notify('저장했어요.');
      if(next==='depart')await send('DEPART',{},'vehicle');
    } catch(e){errorText=e.message;render();}
  }
  function openMap(info,search=false){
    const url=C.navigation(info,prefs.mapProvider,search);if(!url){openPanel('destination');return;}
    if(window.VehicleBridge?.openMap)window.VehicleBridge.openMap(url);
    else {const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.click();}
  }
  async function searchAddress(){
    captureDraft();const q=String(draft.address||draft.facility||'').trim();
    if(q.length<2){errorText='주소나 시설 이름을 두 글자 이상 입력해 주세요.';render();return;}
    const id=uid();searchId=id;searchResults=[];searchMessage='주소를 찾고 있어요.';render();
    clearTimeout(searchTimer);searchTimer=setTimeout(()=>{if(searchId===id){searchId=null;searchMessage='지도에서 검색하거나 주소를 직접 입력해 주세요.';render();}},8000);
    if(window.VehicleBridge?.searchAddress){window.VehicleBridge.searchAddress(q,id);return;}
    if(serverMode){try{const d=await request('/api/places?query='+encodeURIComponent(q),{headers:{Authorization:'Bearer '+tokens[role()]}});window.onAddressResults(id,d.places,'');return;}catch{}}
    window.onAddressResults(id,[],'지도에서 검색하거나 주소를 직접 입력해 주세요.');
  }
  window.onAddressResults=function(id,places,message){if(id!==searchId||panel!=='destination')return;clearTimeout(searchTimer);searchId=null;searchResults=(Array.isArray(places)?places:[]).slice(0,5).filter(r=>C.hasCoordinates(r));searchMessage=searchResults.length?'방문할 주소를 선택해 주세요.':message||'주소를 찾지 못했어요. 지도에서 검색해 주세요.';render();};
  document.addEventListener('input',e=>{
    if(e.target.dataset.field&&draft){draft[e.target.dataset.field]=e.target.value;if(e.target.dataset.field==='address'){draft.latitude=null;draft.longitude=null;const lat=$('field-latitude'),lng=$('field-longitude');if(lat)lat.value='';if(lng)lng.value='';searchId=null;}}
    if(e.target.id==='codeInput') {
      codeInput=e.target.value.replace(/\D/g,'').slice(0,6); e.target.value=codeInput;

    }
  });
  document.addEventListener('change',async e=>{
    if(e.target.id==='consentCheck') { await send('CONSENT',{accepted:e.target.checked},'simulator'); }
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape' && panel) { e.preventDefault(); closePanel(); }
    if(e.key==='Tab' && panel) {
      const nodes=[...document.querySelectorAll('.modal button:not([disabled]), .modal input:not([disabled]), .modal select, .modal summary')];
      if(!nodes.length)return;const first=nodes[0],last=nodes[nodes.length-1];
      if(e.shiftKey&&(document.activeElement===first||document.activeElement===document.querySelector('.modal'))) {e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  document.addEventListener('click',async e=>{
    const b=e.target.closest('[data-action]');if(!b||b.disabled)return;const action=b.dataset.action;
    if(!C.can(action,role())){notify('현재 역할에서 할 수 없는 작업이에요.');return;}
    if(action==='choose-role'){prefs.roleChosen=true;if(b.dataset.role==='visitor'){prefs.mode='easy';prefs.role='vehicle';}else{prefs.mode='standard';prefs.role=b.dataset.role;}savePrefs();render(true);if(serverMode)await refresh();return;}
    if(action==='destination'){openPanel('destination');return;}
    if(action==='navigate'){if(!C.hasDestination(state.info)){afterDestination=null;openPanel('destination');}else openMap(state.info);return;}
    if(action==='depart'&&!C.hasDestination(state.info)){afterDestination='depart';openPanel('destination');return;}
    if(action==='save-settings'){await saveSettings();return;}
    if(action==='save-destination'){await saveSettings(true);return;}
    if(action==='search-address'){await searchAddress();return;}
    if(action==='external-search'){captureDraft();openMap({...draft},true);return;}
    if(action==='select-address'){const result=searchResults[Number(b.dataset.index)];if(result){captureDraft();draft={...draft,address:result.address,latitude:result.latitude,longitude:result.longitude};document.querySelectorAll('[data-field]').forEach(el=>{el.value=draft[el.dataset.field]??'';});searchResults=[];searchMessage='선택한 주소를 저장해 주세요.';render();}return;}
    if(['settings','demo','phone'].includes(action)){openPanel(action);return;}
    if(action==='close-panel'){closePanel();return;}
    if(action==='visit-picker'){openPanel('visits');return;}
    if(action==='select-visit'){prefs.role='vehicle';await reset(b.dataset.scenario,prefs.mode==='easy'&&H.SCENARIOS[b.dataset.scenario].adult?'easy':'standard');return;}
    if(action==='restart'){prefs.role='vehicle';await reset(state.scenario);return;}
    if(action==='show-facility'||action==='show-vehicle'||action==='show-guardian'){prefs.role=action.slice(5);switchMode('standard');return;}
    if(action==='mode-easy'){switchMode('easy');return;}
    if(action==='mode-standard'){switchMode('standard');return;}
    if(action==='role'){prefs.role=b.dataset.role;switchMode('standard');return;}
    if(action==='text-size'){prefs.text=Number(b.dataset.size);savePrefs();render();return;}
    if(action==='start-easy-demo'){await reset('senior','easy');return;}
    if(action==='start-community'){await reset('community','easy');return;}
    if(action==='easy-arrive'){easyStep='confirm';errorText='';render(true);return;}
    if(action==='easy-back'){easyStep='home';errorText='';render(true);return;}
    if(action==='easy-send'){const ok=await send('NOTIFY_ARRIVAL',{},'visitor');easyStep=ok?'home':'error';render(true);return;}
    if(action==='consent-yes'){await send('SELF_CONSENT',{accepted:true},'visitor');render(true);return;}
    if(action==='consent-no'){await send('SELF_CONSENT',{accepted:false},'visitor');panel=null;render(true);return;}
    if(action==='resolve-pending'){await retryPending();return;}
    if(action==='reset'){await reset($('scenario').value);return;}
    if(action==='save-phone'){const value=$('demoPhone').value; const phone=U.normalizePhone(value); if(value.trim()&&!phone){notify('전화번호를 다시 확인해 주세요.');return;}prefs.phone=phone;savePrefs();notify(phone?'이 기기에 연락처를 저장했어요.':'이 기기의 연락처를 지웠어요.');return;}
    if(action==='save-contact'){
      const phone=U.normalizePhone($('contactPhone').value);
      if(!phone){notify('전화번호를 확인해 주세요.');$('contactPhone').focus();return;}
      const first=!prefs.phone; prefs.phone=phone;savePrefs();render();
      if(first)document.querySelector('[data-action="open-dialer"]').click();
      else notify('연락처를 저장했어요.');return;
    }
    if(action==='load-code'){
      try {
        const source=serverMode?(await request('/api/state',{headers:{Authorization:'Bearer '+tokens.vehicle}})).state:state;
        if(!source.challenge?.code)throw new Error('NO_CODE');
        codeInput=source.challenge.code;errorText='';panel=null;render();$('codeInput')?.focus();
      } catch {errorText='차량 화면에서 새 연결번호를 받아주세요.';render();}return;
    }
    if(action==='receiver' && !/^\d{6}$/.test(codeInput)){errorText='6자리 연결번호를 입력해 주세요.';render();$('codeInput')?.focus();return;}
    if(action==='open-dialer'){
      const phone=U.normalizePhone(contactValue());if(!phone){notify('등록된 연락처가 없어요.');return;}
      if(window.VehicleBridge?.openDialer)window.VehicleBridge.openDialer(phone);
      else { const a=document.createElement('a');a.href='tel:'+phone;a.click(); }
      return;
    }
    if(action==='offline'){offline=!offline;if(!offline&&serverMode)try{await connect();}catch{connected=false;}render();return;}
    if(action==='reconnect'){offline=false;if(serverMode)try{await connect();}catch{connected=false;}else connected=true;render();return;}
    if(action==='heartbeat'){heartbeat=!heartbeat;render();return;}
    if(action==='navi'){window.VehicleBridge?.checkNavigation();return;}
    if(action==='route'){window.VehicleBridge?.requestSampleRoute();return;}
    if(action==='arrive'){if(await send('VEHICLE',{known:true,restricted:false,gear:'P',speed:0},'simulator'))await send('ARRIVE',{},'simulator');return;}
    if(action==='return-area'){await send('RETURN_AREA',{},'simulator');return;}
    const commands={ready:['READY',{ready:true},'facility'],absent:['READY',{ready:false},'facility'],park:['VEHICLE',{known:true,restricted:false,gear:'P',speed:0},'simulator'],drive:['VEHICLE',{known:true,restricted:true,gear:'D',speed:25},'simulator'],unknown:['VEHICLE',{known:false,restricted:true,gear:'UNKNOWN',speed:null},'simulator'],depart:['DEPART',{},'vehicle'],issue:['ISSUE_CODE',{},'vehicle'],sender:['SENDER_CONFIRM',{inPerson:true},'vehicle'],receiver:['RECEIVER_CONFIRM',{inPerson:true,code:codeInput},'facility'],report:['REPORT_ARRIVAL',{},'vehicle'],ack:['ACK_ARRIVAL_NOTICE',{},'facility'],leave:['LEAVE_AREA',{},'simulator'],cancel:['CANCEL',{},'vehicle']};
    if(commands[action]){const ok=await send(...commands[action]);if(ok&&['sender','receiver'].includes(action)){render();}if(!ok&&serverMode)await refresh();}
  });
  window.handleAppBack=function(){if(panel){closePanel();return true;}if(prefs.mode==='easy'&&easyStep!=='home'){easyStep='home';render(true);return true;}return false;};
  window.onNativeNavigationStatus=function(value){nativeStatus=String(value);if(panel==='demo')render();};
  window.onNativeDialerStatus=function(value){notify(String(value));};
  window.addEventListener('storage',e=>{if(!serverMode&&e.key===STATE_KEY&&e.newValue){try{state=JSON.parse(e.newValue);reconcileTrip();render();}catch{}}});
  async function init() {
    if(serverMode){try{await connect();}catch{connected=false;state=H.createTrip('kindergarten',Date.now(),uid());render();}}
    else {state=read(localStorage,STATE_KEY);if(!state||state.schema!==1)state=H.createTrip('kindergarten',Date.now(),uid());state.info={...C.defaults(),...state.info};render();}
    await prepareNewVisit();
    if(state.vehicle.known&&!done()&&connected&&!offline&&!pending)await send('VEHICLE',{known:state.vehicle.known,restricted:state.vehicle.restricted,gear:state.vehicle.gear,speed:state.vehicle.speed},'simulator',true);
    render();
    setInterval(async()=>{
      if(document.hidden)return;
      countdown();if(serverMode)await refresh();
      if(state&&heartbeat&&state.vehicle.known&&!done()&&!busy&&!pending&&connected&&!offline&&Date.now()-lastBeat>10000){const wasSafe=H.safeVehicle(state,Date.now());lastBeat=Date.now();const ok=await send('VEHICLE',{known:state.vehicle.known,restricted:state.vehicle.restricted,gear:state.vehicle.gear,speed:state.vehicle.speed},'simulator',true);if(ok&&!wasSafe)render();}
    },2000);
  }
  init();
})();
