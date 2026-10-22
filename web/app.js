/* Presentation client. Local demonstration and authoritative-server modes are explicit. */
(function () {
  'use strict';
  const H = window.Handoff;
  const KEY = 'ansim-synthetic-demo-v1';
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icons = {
    mark: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 3 27 8v8c0 7-11 13-11 13S5 23 5 16V8L16 3Z"/><path d="m10 16 4 4 8-8"/></svg>',
    car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m5 8 2-4h10l2 4 2 3v7H3v-7l2-3Z"/><path d="M5 9h14M6 18v3m12-3v3M6 13h3m6 0h3"/></svg>',
    building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 21V6l8-3 8 3v15M2 21h20M9 21v-6h6v6M8 8h2m4 0h2m-8 3h2m4 0h2"/></svg>',
    person: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="7" r="4"/><path d="M4 21v-3a8 8 0 0 1 16 0v3"/></svg>'
  };
  let state, tokens, connected = true, pretendOffline = false, busy = false, currentRole = 'all', nativeStatus = '브라우저 · 차량 SDK 미연결';
  let codeInput = '', senderCheck = false, receiverCheck = false, toastTimer, guide = false;
  let serverMode = /^https?:$/.test(location.protocol) && ['127.0.0.1','localhost','[::1]'].includes(location.hostname);
  let heartbeat = true, lastHeartbeat = 0;
  const urlRole = location.pathname.split('/').filter(Boolean)[0] || new URLSearchParams(location.search).get('role');
  if (['vehicle','facility','guardian'].includes(urlRole)) currentRole = urlRole;
  function uid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const a = new Uint8Array(16); crypto.getRandomValues(a); return Array.from(a,x=>x.toString(16).padStart(2,'0')).join('');
  }
  function code() { const a = new Uint32Array(1); let n; do { crypto.getRandomValues(a); n=a[0]; } while(n >= 4294000000); return String(n % 1000000).padStart(6,'0'); }
  function notify(text) { const el = document.getElementById('toast'); el.textContent=text; el.className='toast show'; clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.className='toast',4500); }
  function store() { try { localStorage.setItem(KEY,JSON.stringify(state)); } catch { } }
  async function request(path, options={}) {
    if (pretendOffline) throw new Error('통신 끊김을 모의 중입니다. 확인을 저장하거나 자동 전송하지 않습니다.');
    const res=await fetch(path,{...options,signal:AbortSignal.timeout(5000)});
    const data=await res.json();
    if (!res.ok) { const error=new Error(data.message || data.error); error.data=data; throw error; }
    return data;
  }
  async function connect() {
    const data=await request('/api/bootstrap'); tokens=data.tokens; connected=true; await refresh(true);
  }
  async function refresh(force=false) {
    if (!serverMode || pretendOffline || busy) return;
    try {
      const role=currentRole==='all'?'vehicle':currentRole;
      const data=await request('/api/state',{headers:{Authorization:'Bearer '+tokens[role]}});
      const changed=!state || data.state.id!==state.id || data.state.version!==state.version || !connected;
      state=data.state; connected=true; if(changed || force) render();
    } catch(e) { if(connected){connected=false;render();} }
  }
  async function send(type, payload={}, role='vehicle', quiet=false) {
    if(busy) return;
    if(pretendOffline || !connected){notify('현재 연결을 확인할 수 없습니다. 인계를 완료하거나 확인을 예약하지 않습니다.');return;}
    busy=true;
    try {
      if(serverMode){
        const latest=await request('/api/state',{headers:{Authorization:'Bearer '+tokens[role]}});
        await request('/api/events',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tokens[role]},body:JSON.stringify({key:uid(),tripId:latest.state.id,expectedVersion:latest.state.version,event:{type,payload}})});
        const display=currentRole==='all'?'vehicle':currentRole;
        const data=await request('/api/state',{headers:{Authorization:'Bearer '+tokens[display]}}); state=data.state;
      } else {
        const result=H.apply(state,{type,payload},{role,id:role==='facility'?'staff-001':role==='vehicle'?'sender-001':role},{now:Date.now(),code:code()});
        state=result.state;store();if(result.rejected) throw new Error(result.rejected.message);
      }
      if(!quiet && type==='ISSUE_CODE') notify('현장에서 상대방을 직접 확인한 뒤 연결번호를 전달해 주세요.');
    } catch(e){
      if(!quiet) notify(e.message);
      if(e.data?.state) state=e.data.state;
      else if(serverMode && !e.data) connected=false;
    } finally {busy=false;render();}
  }
  function canAct(){return connected && !pretendOffline && !busy;}
  function disabled(allow){return allow && canAct()?'':'disabled';}
  function finished(){return ['COMPLETED','ARRIVAL_REPORTED','CANCELLED'].includes(state.state);}
  function time(v){return new Date(v).toLocaleTimeString('ko-KR',{hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'});}
  function map(){return `<div class="schematic" aria-label="실제 지도와 무관한 도착 과정 개념도"><svg viewBox="0 0 430 135" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><pattern id="g" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#21364a" stroke-width=".7"/></pattern></defs><rect width="430" height="135" fill="url(#g)"/><path d="M-20 92H110Q155 92 155 60V42Q155 24 180 24H300" fill="none" stroke="#2f4356" stroke-width="24"/><path d="M-20 92H110Q155 92 155 60V42Q155 24 180 24H300" fill="none" stroke="#78e1c3" stroke-width="3" stroke-dasharray="7 6"/><rect x="303" y="20" width="75" height="63" rx="9" fill="#244c48" stroke="#72b9a4"/><path d="M327 83V60h26v23" fill="#183230" stroke="#72b9a4"/><path d="M315 34h10m9 0h10m9 0h10m-48 11h10m9 0h10m9 0h10" stroke="#72b9a4" stroke-width="4"/><circle cx="265" cy="24" r="8" fill="#78e1c3"/><circle cx="${state.state==='EN_ROUTE'?145:state.locationInside?265:60}" cy="${state.state==='EN_ROUTE'?68:state.locationInside?24:92}" r="11" fill="#d7f5ea" stroke="#38665e" stroke-width="4"/></svg><span class="map-tag">경로·위치 모의</span><span class="map-label">개념도입니다. 실제 지도·허용 승하차 장소가 아닙니다.</span></div>`;}
  function vehicleCard(){
    const now=Date.now(),safe=H.safeVehicle(state,now),ready=H.readyNow(state,now),reasons=H.handoffReasons(state,now),terminal=finished();
    let action='';
    if(state.state==='PLANNED') action=`<button class="primary" data-action="depart" ${disabled(safe&&state.consent)}>출발 계획 시작</button>`;
    else if(state.state==='EN_ROUTE') action=`<div class="notice muted">이동 중에는 인계 확인을 진행하지 않습니다.<br>도착·정차 후 다음 단계를 확인하세요.</div>`;
    else if(state.state==='ARRIVED' && state.info.mode==='ARRIVAL_ONLY') action=`<button class="primary" data-action="report" ${disabled(safe&&state.consent&&state.locationInside)}>본인 선택으로 도착 알림</button><p class="caption">담당자 인수 확인을 제공하지 않는 방문입니다.</p>`;
    else if(['ARRIVED','VERIFYING'].includes(state.state)) action=`${state.challenge?`<div class="code"><div><small>대면 연결번호 · 남은 시간 <span id="codeSeconds"></span></small><strong>${esc(state.challenge.code || '••••••')}</strong></div><span class="badge green">1회용</span></div>`:''}${state.state==='VERIFYING'?`<label class="checkline"><input id="senderCheck" type="checkbox" ${senderCheck?'checked':''} ${disabled(safe)}><span>대상자와 지정 담당자를 직접 확인하고 인계했습니다.</span></label><button class="primary" data-action="sender" ${disabled(!state.senderConfirmed&&senderCheck&&reasons.length===0)}>${state.senderConfirmed?'인계자 확인 기록됨':'인계자 대면 확인'}</button>`:''}<button class="${state.challenge?'ghost':'primary'}" data-action="issue" ${disabled(reasons.length===0)}>${state.challenge?'번호 재발급 · 양측 재확인':'대면 연결번호 발급'}</button>`;
    if(terminal) action=`<div class="receipt">${esc(H.LABELS[state.state])}</div><p class="caption">${state.state==='COMPLETED'?'두 사람의 확인을 기록했습니다. 안전 보장이나 자동 인수 판정이 아닙니다.':'인계 완료와 구분하여 기록했습니다.'}</p>`;
    return `<section class="card vehicle-card"><div class="card-head"><div class="card-title"><span class="role-icon">${icons.car}</span>차량 · 인계자</div><span class="card-sub">PARKED EXPERIENCE</span></div><div class="card-body"><div class="destination"><div class="label">오늘의 목적지</div><div class="name">${esc(state.info.facility.split(' · ')[0])}</div><div class="place">${esc(state.info.place)} · 가상</div></div>${map()}<div class="status-grid"><div class="stat"><div class="label">차량 조건 · 모의 신호</div><div class="value ${safe?'ok':'warn'}">${safe?'P · 정차 / UX 허용':'주행·신호 확인 필요'}</div></div><div class="stat"><div class="label">시설 인수 준비</div><div class="value ${ready?'ok':'warn'}">${state.info.mode==='ARRIVAL_ONLY'?'인계 절차 없음':ready?'지정 담당자 준비됨':'담당자 확인 전'}</div></div></div>${state.blockReason?`<div class="notice">${esc(state.blockReason)}</div>`:''}${action}${!terminal&&state.state==='ARRIVED'&&state.info.mode==='HANDOFF'&&reasons.length?`<div class="notice">${reasons.map(esc).join('<br>')}</div>`:''}<p class="caption">위치·정차 신호만으로 인계를 완료하지 않습니다.</p></div></section>`;
  }
  function facilityCard(){
    const ready=H.readyNow(state,Date.now()),canConfirm=state.state==='VERIFYING'&&!state.receiverConfirmed&&receiverCheck&&codeInput.length===6;
    return `<section class="card facility-card"><div class="card-head"><div class="card-title"><span class="role-icon">${icons.building}</span>시설 · 지정 인수자</div><span class="card-sub">STAFF-001</span></div><div class="card-body"><div class="person"><div class="avatar">${state.info.adult?'온':'해'}</div><div><strong>${esc(state.info.receiver)}</strong><small>기관 배정 계정 · 가상 역할</small></div></div><div class="destination"><div class="label">예정된 이용자</div><div class="name">${esc(state.info.subject.split(' · ')[0])}</div><div class="place">${esc(state.info.subject.split(' · ')[1])} · ${esc(state.info.title)}</div></div>${state.info.mode==='ARRIVAL_ONLY'?'<div class="notice muted">지정 담당자가 없는 방문입니다. 인계 완료 기능을 제공하지 않습니다.</div>':`<div class="button-row"><button class="${ready?'secondary':'primary'}" data-action="ready" ${disabled(!finished())}>${ready?'준비 상태 갱신':'인수 준비 완료'}</button><button class="ghost" data-action="absent" ${disabled(!finished())}>담당자 부재</button></div><p class="caption">준비 확인은 10분간 유효합니다. 역할은 미리 배정된 담당자에게만 부여합니다.</p><div class="divider"></div><label class="field-label" for="codeInput">현장에서 전달받은 연결번호</label><input id="codeInput" class="code-input" placeholder="6자리 번호" maxlength="6" inputmode="numeric" autocomplete="off" value="${esc(codeInput)}" ${finished()?'disabled':''}><label class="checkline"><input id="receiverCheck" type="checkbox" ${receiverCheck?'checked':''}><span>대상자와 인계자를 직접 만나 확인하고 인수했습니다.</span></label><button class="primary" data-action="receiver" ${disabled(canConfirm)}>${state.receiverConfirmed?'인수자 확인 기록됨':'지정 인수자 대면 확인'}</button><p class="caption">번호를 아는 것만으로 인수 자격이 생기지 않습니다.</p>`}${state.state==='COMPLETED'?'<div class="notice success">양측 확인을 모두 기록했습니다.</div>':''}</div></section>`;
  }
  function guardianCard(){
    const s=state,rows=[[s.locationInside,'지정 구역 도착'],[H.readyNow(s,Date.now()),'지정 담당자 준비'],[s.senderConfirmed,'인계자 대면 확인'],[s.receiverConfirmed,'인수자 대면 확인']];
    return `<section class="card guardian-card"><div class="card-head"><div class="card-title"><span class="role-icon">${icons.person}</span>보호자 · 상태 조회</div><span class="badge ${s.state==='COMPLETED'?'green':'amber'}">${s.state==='COMPLETED'?'양측 확인':s.state==='ARRIVAL_REPORTED'?'도착만 확인':'아직 인계 전'}</span></div><div class="card-body"><div><div class="person"><div class="avatar">${s.info.adult?'A':'도'}</div><div><strong>${esc(s.info.subject.split(' · ')[0])}</strong><small>합성 데이터 · 보호자 조회 화면</small></div></div><div class="scenario-title">현재 이동 상태</div><div class="strong">${esc(H.LABELS[s.state])}</div><ul class="checks">${rows.map(([ok,label])=>`<li><span class="check-symbol ${ok?'done':''}">${ok?'✓':'·'}</span>${label}</li>`).join('')}</ul><div class="notice ${s.state==='COMPLETED'?'success':'muted'}">${s.state==='COMPLETED'?'양측의 직접 확인이 모두 기록되었습니다.':s.state==='ARRIVAL_REPORTED'?'이용자가 도착을 알렸습니다. 담당자에게 인계되었다는 뜻은 아닙니다.':'도착 알림과 인계 완료는 다릅니다. 양측의 확인을 기다립니다.'}</div><p class="caption">이 화면은 상태 조회입니다. SMS·카카오톡·푸시 전송을 구현한 것은 아닙니다.</p></div><div class="timeline" aria-label="이동 상태 기록">${s.events.slice(-7).reverse().map(e=>`<div class="event"><time>${time(e.at)}</time><div>${esc(e.message)}</div></div>`).join('')}</div></div></section>`;
  }
  function consolePanel(){return `<section class="console"><div class="console-head"><strong>시연 제어실 <span class="badge amber">모의 입력</span></strong><small>가상 차량·가상 시설만 제어합니다.</small></div><div class="console-controls"><label class="sr-only" for="scenario">시연 대상</label><select id="scenario">${Object.entries(H.SCENARIOS).map(([key,v])=>`<option value="${key}" ${key===state.scenario?'selected':''}>${v.title}</option>`).join('')}</select><button class="secondary" data-action="reset">새 시연 시작</button><button class="secondary" data-action="park" ${disabled(!finished())}>P · 정차 신호</button><button class="secondary" data-action="drive" ${disabled(!finished())}>D · 주행 신호</button><button class="secondary" data-action="arrive" ${disabled(state.state==='EN_ROUTE')}>도착·정차 모의</button><button class="${pretendOffline?'danger':'ghost'}" data-action="offline">${pretendOffline?'연결 복구':'통신 끊김 모의'}</button></div>${state.info.adult?`<label class="checkline"><input id="consentCheck" type="checkbox" ${state.consent?'checked':''}><span>이용자 본인의 동의를 확인한 상황을 모의합니다. 실제 동의서는 수집하지 않습니다.</span></label>`:''}<details><summary>예외 상황 · 검증 도구</summary><div class="console-controls"><button class="ghost" data-action="unknown" ${disabled(!finished())}>차량 신호 불명</button><button class="ghost" data-action="heartbeat">${heartbeat?'신호 갱신 중단':'신호 갱신 재개'}</button><button class="ghost" data-action="leave" ${disabled(!finished())}>지정 구역 이탈</button><button class="ghost" data-action="cancel" ${disabled(!finished())}>이동 취소</button><button class="ghost" data-action="export">모의 기록 내보내기</button><button class="ghost" data-action="guide">시연 순서</button>${window.VehicleBridge?'<button class="ghost" data-action="navi">NaviHelper 연결 확인</button><button class="ghost" data-action="route">공식 예제 경로 시험</button>':''}</div><div class="sdk" id="nativeStatus">${esc(nativeStatus)}</div></details><p class="hint">모의 차량 신호는 ${heartbeat?'10초마다 갱신됩니다':'갱신이 중단되어 30초 뒤 유효하지 않습니다'}. 실제 차량 위치·정차·인수 여부를 판별하지 않습니다.</p></section>`;}
  function render(){
    if(!state)return;
    const phase={PLANNED:1,EN_ROUTE:2,ARRIVED:3,VERIFYING:4,COMPLETED:5,ARRIVAL_REPORTED:3,CANCELLED:0}[state.state];
    const cards=currentRole==='all'?vehicleCard()+facilityCard()+guardianCard():currentRole==='vehicle'?vehicleCard():currentRole==='facility'?facilityCard():guardianCard();
    const focused=document.activeElement?.id,selection=document.activeElement?.selectionStart;
    document.getElementById('app').innerHTML=`<div class="shell"><header class="header"><div class="brand"><div class="mark">${icons.mark}</div><div><div class="brand-name">도착완성 <span class="ok">안심동행</span></div><div class="brand-sub">ARRIVAL IS NOT HANDOFF</div></div></div><div class="header-right"><span class="badge ${connected&&!pretendOffline?'green':'amber'}"><i class="dot"></i>${serverMode?'로컬 서버 연동':'단일 기기 로컬 시연'}</span><span class="version">PROTOTYPE 0.1</span></div></header><nav class="nav" aria-label="시연 역할">${[['all','통합 시연'],['vehicle','차량'],['facility','시설'],['guardian','보호자']].map(([v,l])=>`<button data-action="view" data-role="${v}" class="${currentRole===v?'active':''}">${l}</button>`).join('')}</nav><div class="banner"><span><strong>합성 데이터 시연</strong> · 실제 이용자·시설·차량 위치를 사용하지 않습니다. 안전 보장 서비스가 아닙니다.</span><span class="badge">${serverMode?'서버 저장·역할 검사':'오프라인 체험'}</span></div>${!connected||pretendOffline?'<div class="offline-overlay" role="alert">연결을 확인할 수 없습니다. 마지막 상태만 표시하며, 확인을 자동 저장·예약하거나 완료로 바꾸지 않습니다.</div>':''}<section class="hero"><div><div class="eyebrow">${esc(state.info.title)} · CARE HANDOFF</div><h1>도착했다고,<br><span>인계된 것은 아니니까.</span></h1><p>차량의 도착과 사람의 직접 확인을 나누어 기록합니다.</p></div><div class="hero-right"><span class="badge ${state.state==='COMPLETED'?'green':'amber'}">${esc(H.LABELS[state.state])}</span><div class="trip">이동 건 ${esc(state.id.slice(0,8))} · 상태 버전 ${state.version}</div><div class="progress" aria-label="진행 단계 ${phase}/5">${[1,2,3,4,5].map(i=>`<span class="${i<=phase?'on':''}"></span>`).join('')}</div></div></section>${guide?'<div class="guide">① 시설 인수 준비 → ② P·정차 신호 → ③ 출발 계획 시작 → ④ 도착·정차 모의 → ⑤ 연결번호 발급 → ⑥ 인계자 직접 확인 → ⑦ 시설에서 번호 입력·인수 확인. 담당자 부재나 통신 끊김도 함께 시험하세요.</div>':''}<main class="${currentRole==='all'?'grid':'single-grid'}">${cards}</main>${consolePanel()}<footer class="footer"><span>공모전 개발 시연 · 모의 신호와 실제 SDK 연결 상태를 구분합니다.</span><span>사람의 판단·현장 인수 절차를 대신하지 않습니다.</span></footer></div>`;
    if(focused){const el=document.getElementById(focused);if(el){el.focus({preventScroll:true});if(typeof selection==='number'&&el.setSelectionRange){try{el.setSelectionRange(selection,selection);}catch{}}}}
    updateCountdown();
  }
  function updateCountdown(){const el=document.getElementById('codeSeconds');if(el&&state?.challenge)el.textContent=Math.max(0,Math.ceil((state.challenge.expiresAt-Date.now())/1000))+'초';}
  async function reset(){
    const scenario=document.getElementById('scenario').value;
    if(serverMode){try{await request('/api/reset',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tokens.simulator},body:JSON.stringify({scenario})});await connect();}catch(e){notify(e.message);return;}}
    else{state=H.createTrip(scenario,Date.now(),uid());store();}
    codeInput='';senderCheck=false;receiverCheck=false;render();notify('가상 시연을 초기화했습니다.');
  }
  document.addEventListener('input',e=>{if(e.target.id==='codeInput'){codeInput=e.target.value.replace(/\D/g,'').slice(0,6);e.target.value=codeInput; const button=document.querySelector('[data-action="receiver"]'); if(button)button.disabled=!(canAct()&&receiverCheck&&codeInput.length===6&&state.state==='VERIFYING'&&!state.receiverConfirmed);}});
  document.addEventListener('change',async e=>{
    if(e.target.id==='senderCheck'){senderCheck=e.target.checked;render();}
    if(e.target.id==='receiverCheck'){receiverCheck=e.target.checked;render();}
    if(e.target.id==='consentCheck')await send('CONSENT',{accepted:e.target.checked},'simulator');
  });
  document.addEventListener('click',async e=>{
    const b=e.target.closest('[data-action]');if(!b||b.disabled)return;
    const action=b.dataset.action;
    if(action==='view'){currentRole=b.dataset.role;render();if(serverMode)await refresh(true);return;}
    if(action==='reset'){await reset();return;}
    if(action==='guide'){guide=!guide;render();return;}
    if(action==='offline'){pretendOffline=!pretendOffline;if(!pretendOffline&&serverMode){try{await connect();}catch{connected=false;}}render();return;}
    if(action==='heartbeat'){heartbeat=!heartbeat;render();return;}
    if(action==='export'){const data=H.project(state,'guardian');const blob=new Blob([JSON.stringify({notice:'합성 데이터 시연 기록. 실제 인계 증명이 아닙니다.',...data},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='handoff-synthetic-log.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);return;}
    if(action==='navi'){window.VehicleBridge?.checkNavigation();return;}
    if(action==='route'){window.VehicleBridge?.requestSampleRoute();return;}
    const commands={ready:['READY',{ready:true},'facility'],absent:['READY',{ready:false},'facility'],park:['VEHICLE',{known:true,restricted:false,gear:'P',speed:0},'simulator'],drive:['VEHICLE',{known:true,restricted:true,gear:'D',speed:25},'simulator'],unknown:['VEHICLE',{known:false,restricted:true,gear:'UNKNOWN',speed:null},'simulator'],depart:['DEPART',{},'vehicle'],issue:['ISSUE_CODE',{},'vehicle'],sender:['SENDER_CONFIRM',{inPerson:senderCheck},'vehicle'],receiver:['RECEIVER_CONFIRM',{inPerson:receiverCheck,code:codeInput},'facility'],report:['REPORT_ARRIVAL',{},'vehicle'],leave:['LEAVE_AREA',{},'simulator'],cancel:['CANCEL',{},'vehicle']};
    if(action==='arrive'){await send('VEHICLE',{known:true,restricted:false,gear:'P',speed:0},'simulator');await send('ARRIVE',{},'simulator');return;}
    if(commands[action])await send(...commands[action]);
  });
  window.onNativeNavigationStatus=function(value){nativeStatus=String(value);const el=document.getElementById('nativeStatus');if(el)el.textContent=nativeStatus;notify(nativeStatus);};
  window.addEventListener('storage',e=>{if(!serverMode&&e.key===KEY&&e.newValue){try{state=JSON.parse(e.newValue);render();}catch{}}});
  async function init(){
    if(serverMode){try{await connect();}catch(e){connected=false;state=H.createTrip('kindergarten',Date.now(),uid());render();notify('서버에 연결하지 못했습니다. 자동으로 로컬 완료 처리하지 않습니다.');}}
    else{try{state=JSON.parse(localStorage.getItem(KEY));}catch{}if(!state||state.schema!==1)state=H.createTrip('kindergarten',Date.now(),uid());render();}
    setInterval(async()=>{
      updateCountdown();
      if(serverMode)await refresh();
      if(state&&heartbeat&&state.vehicle.known&&!finished()&&!busy&&connected&&!pretendOffline&&Date.now()-lastHeartbeat>10000&&['all','vehicle'].includes(currentRole)){
        lastHeartbeat=Date.now();await send('VEHICLE',{known:state.vehicle.known,restricted:state.vehicle.restricted,gear:state.vehicle.gear,speed:state.vehicle.speed},'simulator',true);
      }
    },1000);
  }
  init();
})();
