/* Synthetic-data presentation. Self-reported arrival never completes a handoff. */
(function() {
  'use strict';
  const H = window.Handoff, U = window.HandoffUI;
  const STATE_KEY = 'ansim-synthetic-demo-v1', PENDING_KEY = 'ansim-pending-v2';
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pathRole = location.pathname.split('/').filter(Boolean)[0];
  const serverMode = /^https?:$/.test(location.protocol) && ['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname);
  let state, tokens, prefs = U.settings(read(localStorage, U.SETTINGS_KEY));
  let connected = !serverMode, offline = false, busy = false, refreshing = false;
  let pending = read(sessionStorage, PENDING_KEY), panel = null, easyStep = 'home', errorText = '';
  let senderCheck = false, receiverCheck = false, codeInput = '', heartbeat = true, lastBeat = 0;
  let nativeStatus = '일반 기기 체험', toastTimer, lastFocused;
  if (['vehicle', 'facility', 'guardian'].includes(pathRole)) { prefs.mode = 'standard'; prefs.role = pathRole; }
  if (pathRole === 'visitor') prefs.mode = 'easy';
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
      const changed=!state || state.id!==data.state.id || state.version!==data.state.version || !connected;
      if(state && state.id!==data.state.id) { codeInput=''; senderCheck=false; receiverCheck=false; easyStep='home'; }
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
      if(e.status) { setPending(null); errorText=U.publicError(e.data?.code || e.data?.error || e.code); }
      else if(serverMode) { connected=false; errorText='전송 결과를 확인하지 못했어요. 연결 후 결과를 확인해 주세요.'; }
      else errorText=e.message==='STORAGE_UNAVAILABLE'?'이 기기에 저장하지 못했어요. 저장 공간과 브라우저 설정을 확인해 주세요.':U.publicError(e.code);
      if(e.data?.state)state=e.data.state;
      return false;
    } finally { busy=false; if(!quiet || errorText)render(); }
  }
  async function reset(scenario, mode=prefs.mode) {
    if(busy) return;
    try {
      if(serverMode) {
        await request('/api/reset',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tokens.simulator},body:JSON.stringify({scenario})});
        prefs.mode=mode; await connect();
      } else {
        const next=H.createTrip(scenario,Date.now(),uid());
        if(!write(localStorage,STATE_KEY,next)) throw new Error('저장 실패');
        state=next; prefs.mode=mode;
      }
      setPending(null); easyStep='home'; codeInput=''; senderCheck=false; receiverCheck=false; errorText=''; heartbeat=true; lastBeat=0;
      savePrefs(); panel=null; render(true); notify('새 체험을 시작했어요.');
    } catch { errorText='체험을 새로 시작하지 못했어요. 연결을 확인해 주세요.'; render(); }
  }
  function button(action,label,kind='primary',allow=true,extra='') { return `<button type="button" class="${kind}" data-action="${action}" ${blocked(allow)} ${extra}>${label}</button>`; }
  function contact() { return `<button type="button" class="contact-button" data-action="phone">${icon('phone')}<span>담당자에게 전화</span>${icon('arrow')}</button>`; }
  function destination(compact=false) {
    return `<section class="destination-card ${compact?'compact':''}" aria-label="방문 정보"><span class="place-icon">${icon('building')}</span><div><p class="eyebrow">오늘 방문할 곳</p><h2>${esc(U.facility(state))}</h2><p>${esc(state.info.place)}</p><p class="recipient">${icon('person')}<span>${esc(U.recipient(state))}</span></p></div></section>`;
  }
  function easyView() {
    const notice=state.arrivalNotice;
    if(!state.info.adult) return `<main id="main" tabindex="-1" class="easy-main"><h1>어르신 방문 화면을<br>체험해 보세요</h1><p class="lead">큰 글씨로 도착 소식을 남기고 담당자에게 전화할 수 있어요.</p>${button('start-easy-demo','쉬운 화면 체험 시작')}<p class="subtle">온유돌봄센터의 새 가상 방문으로 바뀝니다.</p></main>`;
    if(done() && !notice) return `<main id="main" tabindex="-1" class="easy-main"><h1>${state.state==='CANCELLED'?'취소된 방문이에요':'이미 마친 방문이에요'}</h1>${destination()}${contact()}<p class="subtle">담당자와 다음 방문을 확인해 주세요.</p></main>`;
    if(!state.consent) return `<main id="main" tabindex="-1" class="easy-main"><p class="eyebrow">내가 선택하는 도착 알림</p><h1>도착 소식을<br>공유할까요?</h1>${destination()}<p class="lead">도착했다고 누른 시각을 담당자가 볼 수 있어요.</p><div class="action-stack">${button('consent-yes','동의하고 계속', 'primary large')}<button type="button" class="secondary large" data-action="phone">공유하지 않고 전화하기</button></div><p class="subtle">설정에서 공유를 중단할 수 있어요.</p></main>`;
    if(notice && !pending) return `<main id="main" tabindex="-1" class="easy-main"><div class="result-mark">${icon('check')}</div><h1>${serverMode?'도착 소식을<br>보냈어요':'도착 소식을<br>기록했어요'}</h1><p class="lead">${serverMode?'담당자 화면에 소식이 남았어요.':'이 기기에 체험 기록을 남겼어요.'}</p><section class="receipt-card"><dl><div><dt>방문 장소</dt><dd>${esc(U.facility(state))}</dd></div><div><dt>받는 사람</dt><dd>${esc(notice.recipient)}</dd></div><div><dt>남긴 시각</dt><dd>${time(notice.at)}</dd></div></dl><p class="read-status">${notice.acknowledgedAt?'담당자가 '+time(notice.acknowledgedAt)+'에 읽었어요.':'담당자가 읽기 전이에요.'}</p></section>${contact()}<p class="subtle">${state.info.mode==='HANDOFF'?'대면 인계 확인은 따로 진행해요.':'이 방문은 도착 소식만 알려요.'}</p></main>`;
    if(easyStep==='confirm' || easyStep==='error' || pending) return `<main id="main" tabindex="-1" class="easy-main"><button class="back-button" data-action="easy-back">${icon('back')}이전 화면</button><h1>${easyStep==='error'?'아직 보내지<br>못했어요':'이곳에 도착했다고<br>알릴까요?'}</h1>${destination()}<p class="lead">${esc(U.recipient(state))}에게 도착 소식을 남겨요.</p><div class="action-stack">${pending?button('resolve-pending','전송 결과 확인하기','primary large',true):button('easy-send',busy?'보내고 있어요…':'도착 소식 보내기','primary large',true)}${contact()}</div></main>`;
    return `<main id="main" tabindex="-1" class="easy-main"><p class="eyebrow">오늘의 동행</p><h1>${esc(U.facility(state))}에<br>도착하셨나요?</h1><p class="lead">아래 버튼으로 도착을 알려주세요.</p>${destination()}<div class="action-stack">${button('easy-arrive',icon('pin')+'<span>도착 알리기</span>','primary large')}${contact()}</div><p class="subtle">연결번호를 입력하지 않아도 돼요.</p></main>`;
  }
  function handoffProgress() {
    const current={PLANNED:0,EN_ROUTE:1,ARRIVED:2,VERIFYING:2,COMPLETED:3,ARRIVAL_REPORTED:3,CANCELLED:-1}[state.state];
    const labels=['출발 준비','이동','도착·확인',state.info.mode==='HANDOFF'?'인계 완료':'알림 완료'];
    return `<ol class="progress" aria-label="방문 진행 상태">${labels.map((label,i)=>`<li class="${i<=current?'reached':''} ${i===current?'current':''}" ${i===current?'aria-current="step"':''}><span>${i<current?'✓':i+1}</span>${label}</li>`).join('')}</ol>`;
  }
  function vehicleActions() {
    const safe=H.safeVehicle(state,Date.now()), ready=H.readyNow(state,Date.now());
    if(done())return `<div class="receipt-inline">${icon('check')}<span>${state.state==='CANCELLED'?'방문을 취소했어요':time(state.completedAt)+'에 확인을 마쳤어요'}</span></div>`;
    if(state.state==='PLANNED')return `<section class="action-card"><h2>이동을 준비해요</h2><div class="status-row"><span>차량 정차</span><strong>${safe?'확인됨':'확인 전'}</strong></div><div class="status-row"><span>담당자 준비</span><strong>${ready?'준비됨':state.info.mode==='ARRIVAL_ONLY'?'도착 알림만 제공':'확인 전'}</strong></div>${button('depart','이 목적지로 출발하기','primary',safe&&state.consent)}${!state.consent?'<p class="help">이용자 본인의 공유 동의가 필요해요.</p>':''}${!safe?'<p class="help">시연 도구에서 정차 상태를 먼저 선택해 주세요.</p>':''}</section>`;
    if(state.state==='EN_ROUTE')return `<section class="action-card travel"><span class="travel-icon">${icon('car')}</span><h2>도착 후 다시 만나요</h2><p>정차한 뒤 다음 단계를 확인할 수 있어요.</p></section>`;
    if(state.info.mode==='ARRIVAL_ONLY')return `<section class="action-card"><h2>도착을 알려주세요</h2>${button('report','도착 소식 남기기','primary',safe&&state.consent&&state.locationInside)}</section>`;
    const reasons=H.handoffReasons(state,Date.now());
    return `<section class="action-card"><h2>직접 만나 확인해요</h2>${state.challenge?`<div class="connection-code"><span>담당자에게 보여줄 번호</span><strong aria-label="연결번호 ${esc((state.challenge.code||'').split('').join(' '))}">${esc(state.challenge.code||'••••••')}</strong><span id="codeSeconds"></span></div><label class="checkline"><input id="senderCheck" type="checkbox" ${senderCheck?'checked':''} ${blocked(safe&&!state.senderConfirmed)}><span>대상자와 지정 담당자를 직접 만나 인계했어요.</span></label>${button('sender',state.senderConfirmed?'내 확인을 저장했어요':'직접 인계했어요','primary',!state.senderConfirmed&&senderCheck&&reasons.length===0)}${button('issue','연결번호 새로 받기','text-button',reasons.length===0)}`:button('issue','연결번호 받기','primary',reasons.length===0)}${reasons.length?'<p class="help">정차와 지정 구역 도착, 담당자 준비를 먼저 확인해 주세요.</p>':''}</section>`;
  }
  function facilityActions() {
    const ready=H.readyNow(state,Date.now()), canConfirm=state.state==='VERIFYING'&&!state.receiverConfirmed&&receiverCheck&&codeInput.length===6;
    const notice=state.arrivalNotice?`<section class="arrival-card"><p class="eyebrow">새 도착 소식</p><h2>${esc(U.subject(state))}님이 도착을 알렸어요</h2><p>${time(state.arrivalNotice.at)} · 본인이 남긴 소식</p>${state.arrivalNotice.acknowledgedAt?'<p class="read-status">소식을 읽었다고 알렸어요.</p>':button('ack','도착 소식 확인했어요','secondary',!done())}</section>`:'';
    if(state.info.mode==='ARRIVAL_ONLY')return notice+`<section class="action-card"><h2>자율 방문이에요</h2><p>도착 소식만 확인해 주세요.</p></section>`;
    if(done())return notice+`<section class="action-card"><h2>${state.state==='COMPLETED'?'인수 확인을 마쳤어요':'방문이 종료됐어요'}</h2><p>${state.completedAt?time(state.completedAt):''}</p></section>`;
    return notice+`<section class="action-card"><p class="eyebrow">방문 예정</p><h2>${esc(U.subject(state))}</h2><p>${esc(state.info.receiver)}</p><div class="button-row">${button('ready',ready?'준비 상태 갱신':'맞이할 준비가 됐어요','primary')}${button('absent','지금은 인수 어려움','secondary')}</div>${state.state==='VERIFYING'?`<div class="input-section"><label for="codeInput">현장에서 전달받은 연결번호</label><input id="codeInput" type="text" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="6자리 번호" value="${esc(codeInput)}"><label class="checkline"><input id="receiverCheck" type="checkbox" ${receiverCheck?'checked':''}><span>대상자와 인계자를 직접 만나 인수했어요.</span></label>${button('receiver',state.receiverConfirmed?'담당자 확인을 저장했어요':'직접 인수했어요','primary',canConfirm)}</div>`:'<p class="help">이용자 도착 후 대면 확인을 진행해 주세요.</p>'}</section>`;
  }
  function guardianActions() {
    const checks=[[state.locationInside,'지정 구역 도착'],[state.senderConfirmed,'인계자 대면 확인'],[state.receiverConfirmed,'담당자 대면 확인']];
    return `<section class="action-card"><h2>${esc(U.subject(state))}님의 이동</h2><ul class="checklist">${checks.map(([ok,text])=>`<li><span class="check-symbol ${ok?'done':''}">${ok?'✓':'·'}</span><span>${text}</span><strong>${ok?'확인됨':'대기 중'}</strong></li>`).join('')}</ul>${state.arrivalNotice?`<p class="notice">${time(state.arrivalNotice.at)}에 본인이 도착 소식을 남겼어요.</p>`:''}</section>`;
  }
  function timeline() {
    const visible=state.events.filter(e=>!['VEHICLE','CREATED'].includes(e.type));
    return `<details class="history"><summary>${icon('clock')}방문 기록 보기</summary><ol>${visible.slice(-8).reverse().map(e=>`<li><time>${time(e.at)}</time><span>${esc(e.message)}</span></li>`).join('') || '<li>아직 방문 기록이 없어요.</li>'}</ol></details>`;
  }
  function standardView() {
    const [title,desc]=U.nextStep(state,prefs.role);
    const action=prefs.role==='facility'?facilityActions():prefs.role==='guardian'?guardianActions():vehicleActions();
    return `<main id="main" tabindex="-1" class="standard-main"><section class="intro"><p class="eyebrow">${prefs.role==='vehicle'?'차량 · 인계자':prefs.role==='facility'?'시설 · 담당자':'보호자'}<span class="visit-tag">${esc(state.info.title)}</span></p><h1>${esc(title)}</h1><p class="lead">${esc(desc)}</p></section>${handoffProgress()}<div class="main-grid"><div>${destination()}${contact()}</div><div>${action}</div></div>${timeline()}</main>`;
  }
  function settingsPanel() {
    return `<h2 id="panelTitle">화면 설정</h2><fieldset><legend>화면 방식</legend><div class="choice-row"><button data-action="mode-standard" aria-pressed="${prefs.mode==='standard'}">기본 화면</button><button data-action="mode-easy" aria-pressed="${prefs.mode==='easy'}">쉬운 화면</button></div></fieldset><fieldset><legend>글씨 크기</legend><div class="choice-row wrap">${[100,125,150,200].map(n=>`<button data-action="text-size" data-size="${n}" aria-pressed="${prefs.text===n}">${n}%</button>`).join('')}</div></fieldset><p class="help">선택한 화면과 글씨 크기를 다음에도 유지해요.</p>${state.info.adult&&state.consent&&!done()?button('consent-no','방문 상태 공유 중단','secondary'):''}`;
  }
  function demoPanel() {
    return `<h2 id="panelTitle">시연 도구</h2><p class="help">아래 선택은 가상 방문에만 적용됩니다.</p><fieldset><legend>이 기기의 역할</legend><div class="choice-row wrap">${[['vehicle','차량'],['facility','시설'],['guardian','보호자']].map(([r,label])=>`<button data-action="role" data-role="${r}" aria-pressed="${prefs.role===r&&prefs.mode==='standard'}">${label}</button>`).join('')}<button data-action="mode-easy">쉬운 화면</button></div></fieldset><fieldset><legend>새 방문 체험</legend><label class="sr-only" for="scenario">방문 종류</label><select id="scenario">${Object.entries(H.SCENARIOS).map(([key,s])=>`<option value="${key}" ${state.scenario===key?'selected':''}>${esc(s.title)}</option>`).join('')}</select>${button('reset','선택한 방문으로 새로 시작','secondary')}</fieldset><fieldset><legend>차량과 연결 상태</legend><div class="demo-grid">${button('park','P · 정차','secondary',!done())}${button('drive','D · 주행','secondary',!done())}${button('arrive','도착·정차','secondary',state.state==='EN_ROUTE')}${button('ready','담당자 준비','secondary',!done()&&state.info.mode==='HANDOFF')}<button class="secondary" data-action="offline">${offline?'연결 복구':'통신 끊김'}</button>${button('unknown','차량 신호 없음','secondary',!done())}${button('leave','구역 이탈','secondary',!done())}<button class="secondary" data-action="heartbeat">${heartbeat?'신호 갱신 중단':'신호 갱신 재개'}</button>${button('cancel','방문 취소','secondary',!done())}</div></fieldset>${state.info.adult&&!done()?`<label class="checkline"><input id="consentCheck" type="checkbox" ${state.consent?'checked':''}><span>본인 동의가 있는 상황을 모의 입력</span></label>`:''}<fieldset><legend>전화 화면 시험</legend><label for="demoPhone">이 기기에 저장할 담당자 번호</label><input id="demoPhone" type="tel" autocomplete="off" placeholder="시험할 전화번호 직접 입력" value="${esc(prefs.phone)}"><button class="secondary" data-action="save-phone">연락처 저장</button><p class="help">자동 발신하지 않고 전화 앱만 엽니다. 비우면 연락처를 지웁니다.</p></fieldset><details><summary>개발 연결 상태</summary><p>${serverMode?'로컬 서버 동기화':'이 기기 내 체험'}</p><p>${esc(nativeStatus)}</p>${window.VehicleBridge?'<button class="secondary" data-action="navi">NaviHelper 연결 확인</button><button class="secondary" data-action="route">공식 예제 경로 시험</button>':''}<p>화면 버전 ${H.VERSION}</p></details>`;
  }
  function phonePanel() {
    return `<h2 id="panelTitle">담당자에게 전화</h2><p class="lead">${esc(U.recipient(state))}</p>${prefs.phone?`<p class="phone-number">${esc(prefs.phone)}</p><p>전화 앱에서 번호를 확인한 뒤 통화 버튼을 눌러주세요.</p><button class="primary large" data-action="open-dialer">전화 화면 열기</button>`:'<div class="notice"><strong>등록된 연락처가 없어요</strong><p>담당자에게 받은 번호를 확인해 주세요.</p></div>'}`;
  }
  function render(focusMain=false) {
    if(!state) return;
    const active=document.activeElement;
    const focused=active?.id ? '#'+active.id : active?.dataset?.action ? `[data-action="${active.dataset.action}"]${active.dataset.size?`[data-size="${active.dataset.size}"]`:active.dataset.role?`[data-role="${active.dataset.role}"]`:''}` : null;
    const selection=typeof active?.selectionStart==='number'?active.selectionStart:null;
    const detailsOpen=!!document.querySelector('.history[open]');
    document.documentElement.className='text-'+prefs.text;
    document.body.className=prefs.mode==='easy'?'easy-mode':'standard-mode';
    const body=panel==='settings'?settingsPanel():panel==='demo'?demoPanel():panel==='phone'?phonePanel():'';
    $('app').innerHTML=`<div class="app-shell" ${panel?'inert aria-hidden="true"':''}><header class="app-header"><div class="brand"><span class="brand-mark">${icon('shield')}</span><div class="brand-name">안심동행 <span>플랫폼</span></div></div><button class="settings-button" data-action="settings" aria-label="화면 설정">${icon('settings')}<span>설정</span></button></header><div class="mode-bar"><span>${prefs.mode==='easy'?'쉬운 화면':'기본 화면'}</span><button class="mode-toggle" data-action="${prefs.mode==='easy'?'mode-standard':'mode-easy'}">${prefs.mode==='easy'?'기본 화면으로':'큰 글씨 · 쉬운 화면'}</button></div><div class="demo-note">체험용 가상 방문 · ${serverMode?'같은 서버의 화면끼리 연결돼요':'실제 시설로 전송되지 않아요'}</div>${!connected||offline?`<div class="connection-warning" role="status"><strong>연결을 확인해 주세요</strong><p>마지막으로 확인한 내용만 보여드려요.</p><button class="secondary" data-action="reconnect">다시 연결하기</button></div>`:''}${errorText?`<div id="inlineError" class="inline-error" role="alert">${esc(errorText)}${pending?'<button class="secondary" data-action="resolve-pending">전송 결과 확인하기</button>':''}</div>`:''}${prefs.mode==='easy'?easyView():standardView()}<footer class="app-footer"><span>오늘도, 안심하고 함께.</span><button data-action="demo">시연 도구</button></footer></div>${panel?`<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="panelTitle" tabindex="-1"><header><span>안심동행</span><button data-action="close-panel" aria-label="닫기">닫기</button></header>${body}</section></div>`:''}`;
    if(detailsOpen) document.querySelector('.history')?.setAttribute('open','');
    if(focusMain) { (panel?document.querySelector('.modal'):$('main'))?.focus({preventScroll:true}); window.scrollTo(0,0); }
    else if(focused) { const el=document.querySelector(focused); if(el && !el.closest('[inert]')) { el.focus({preventScroll:true}); if(selection!==null && el.setSelectionRange)try{el.setSelectionRange(selection,selection);}catch{} } }
    countdown();
  }
  function countdown() { const el=$('codeSeconds'); if(el&&state?.challenge) { const n=Math.max(0,Math.ceil((state.challenge.expiresAt-Date.now())/1000)); el.textContent=n?'유효 시간 '+n+'초':'시간이 지났어요. 새 번호를 받아주세요.'; } }
  function openPanel(kind) { lastFocused=document.activeElement?.dataset?.action; panel=kind; render(true); }
  function closePanel() { panel=null; render(); const el=lastFocused?document.querySelector(`[data-action="${lastFocused}"]`):null; (el||$('main'))?.focus({preventScroll:true}); }
  function switchMode(mode) { prefs.mode=mode; savePrefs(); panel=null; errorText=''; easyStep='home'; render(true); if(serverMode)refresh(); }
  async function retryPending() {
    if(!pending) { await refresh(); return; }
    const intent=pending;
    if(!connected && !offline) try { await connect(); } catch { errorText='연결되지 않았어요. 담당자에게 전화해 주세요.';render();return; }
    if(!pending || !state || intent.tripId!==state.id) return;
    const ok=await send(intent.event.type,intent.event.payload,intent.role);
    if(ok) { easyStep='home'; render(true); }
    else await refresh();
  }
  document.addEventListener('input',e=>{
    if(e.target.id==='codeInput') {
      codeInput=e.target.value.replace(/\D/g,'').slice(0,6); e.target.value=codeInput;
      const b=document.querySelector('[data-action="receiver"]'); if(b)b.disabled=!(connected&&!offline&&!busy&&receiverCheck&&codeInput.length===6&&state.state==='VERIFYING'&&!state.receiverConfirmed);
    }
  });
  document.addEventListener('change',async e=>{
    if(e.target.id==='senderCheck') { senderCheck=e.target.checked;render(); }
    if(e.target.id==='receiverCheck') { receiverCheck=e.target.checked;render(); }
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
    if(['settings','demo','phone'].includes(action)){openPanel(action);return;}
    if(action==='close-panel'){closePanel();return;}
    if(action==='mode-easy'){switchMode('easy');return;}
    if(action==='mode-standard'){switchMode('standard');return;}
    if(action==='role'){prefs.role=b.dataset.role;switchMode('standard');return;}
    if(action==='text-size'){prefs.text=Number(b.dataset.size);savePrefs();render();return;}
    if(action==='start-easy-demo'){await reset('senior','easy');return;}
    if(action==='easy-arrive'){easyStep='confirm';errorText='';render(true);return;}
    if(action==='easy-back'){easyStep='home';errorText='';render(true);return;}
    if(action==='easy-send'){const ok=await send('NOTIFY_ARRIVAL',{},'visitor');easyStep=ok?'home':'error';render(true);return;}
    if(action==='consent-yes'){await send('SELF_CONSENT',{accepted:true},'visitor');render(true);return;}
    if(action==='consent-no'){await send('SELF_CONSENT',{accepted:false},'visitor');panel=null;render(true);return;}
    if(action==='resolve-pending'){await retryPending();return;}
    if(action==='reset'){await reset($('scenario').value);return;}
    if(action==='save-phone'){const value=$('demoPhone').value; const phone=U.normalizePhone(value); if(value.trim()&&!phone){notify('전화번호를 다시 확인해 주세요.');return;}prefs.phone=phone;savePrefs();notify(phone?'이 기기에 연락처를 저장했어요.':'이 기기의 연락처를 지웠어요.');return;}
    if(action==='open-dialer'){
      const phone=U.normalizePhone(prefs.phone);if(!phone){notify('등록된 연락처가 없어요.');return;}
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
    const commands={ready:['READY',{ready:true},'facility'],absent:['READY',{ready:false},'facility'],park:['VEHICLE',{known:true,restricted:false,gear:'P',speed:0},'simulator'],drive:['VEHICLE',{known:true,restricted:true,gear:'D',speed:25},'simulator'],unknown:['VEHICLE',{known:false,restricted:true,gear:'UNKNOWN',speed:null},'simulator'],depart:['DEPART',{},'vehicle'],issue:['ISSUE_CODE',{},'vehicle'],sender:['SENDER_CONFIRM',{inPerson:senderCheck},'vehicle'],receiver:['RECEIVER_CONFIRM',{inPerson:receiverCheck,code:codeInput},'facility'],report:['REPORT_ARRIVAL',{},'vehicle'],ack:['ACK_ARRIVAL_NOTICE',{},'facility'],leave:['LEAVE_AREA',{},'simulator'],cancel:['CANCEL',{},'vehicle']};
    if(commands[action]){const ok=await send(...commands[action]);if(ok&&['sender','receiver'].includes(action)){senderCheck=false;receiverCheck=false;render();}if(!ok&&serverMode)await refresh();}
  });
  window.handleAppBack=function(){if(panel){closePanel();return true;}if(prefs.mode==='easy'&&easyStep!=='home'){easyStep='home';render(true);return true;}return false;};
  window.onNativeNavigationStatus=function(value){nativeStatus=String(value);if(panel==='demo')render();};
  window.onNativeDialerStatus=function(value){notify(String(value));};
  window.addEventListener('storage',e=>{if(!serverMode&&e.key===STATE_KEY&&e.newValue){try{state=JSON.parse(e.newValue);reconcileTrip();render();}catch{}}});
  async function init() {
    if(serverMode){try{await connect();}catch{connected=false;state=H.createTrip('kindergarten',Date.now(),uid());render();}}
    else {state=read(localStorage,STATE_KEY);if(!state||state.schema!==1)state=H.createTrip('kindergarten',Date.now(),uid());render();}
    setInterval(async()=>{
      if(document.hidden)return;
      countdown();if(serverMode)await refresh();
      if(state&&heartbeat&&prefs.mode==='standard'&&prefs.role==='vehicle'&&state.vehicle.known&&!done()&&!busy&&!pending&&connected&&!offline&&Date.now()-lastBeat>10000){lastBeat=Date.now();await send('VEHICLE',{known:state.vehicle.known,restricted:state.vehicle.restricted,gear:state.vehicle.gear,speed:state.vehicle.speed},'simulator',true);}
    },2000);
  }
  init();
})();
