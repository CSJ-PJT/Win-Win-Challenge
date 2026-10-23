from pathlib import Path
import json
R=Path(__file__).resolve().parents[1]
if json.loads((R/'package.json').read_text())['version']=='0.2.1':
    raise SystemExit(0)
p=R/'web/app.js'; s=p.read_text()
def rep(a,b):
    global s
    assert a in s, a[:100]
    s=s.replace(a,b)
def function(name,next_name,new):
    global s
    start=s.index('  '+name); end=s.index('  '+next_name,start)
    s=s[:start]+new.rstrip()+'\n'+s[end:]
rep("const serverMode = /^https?:$/.test(location.protocol)","const serverMode = !window.ANSIM_STANDALONE && /^https?:$/.test(location.protocol)")
rep("let senderCheck = false, receiverCheck = false, codeInput = '', heartbeat = true, lastBeat = 0;", "let codeInput = '', heartbeat = true, lastBeat = 0;")
rep("senderCheck=false; receiverCheck=false; ","")
rep("    busy=true; render();\n    try {\n      if(serverMode) {\n        await request('/api/reset'", "    offline=false; busy=true; render();\n    try {\n      if(serverMode) {\n        if(!connected) await connect();\n        await request('/api/reset'")
rep("savePrefs(); panel=null; render(true); notify('새 체험을 시작했어요.');", "savePrefs(); panel=null; render(true); notify('새 방문을 시작했어요.');")
rep("체험을 새로 시작하지 못했어요. 연결을 확인해 주세요.","새 방문을 열지 못했어요. 다시 연결해 주세요.")
rep("    finally { busy=false; render(); }\n  }\n  function button", "    finally { busy=false; }\n    await prepareNewVisit(); render(true);\n  }\n  async function prepareNewVisit() {\n    if(!state || !connected || offline || pending) return;\n    // Demo fixtures only: do not change domain guards or overwrite deliberate failures.\n    for(const [type,payload,asRole] of U.initialPresentationEvents(state)) {\n      if(!await send(type,payload,asRole,true)) break;\n    }\n  }\n  function button")
rep("function button(action,label,kind='primary',allow=true,extra='') { return `<button type=\"button\" class=\"${kind}\" data-action=\"${action}\" ${blocked(allow)} ${extra}>${label}</button>`; }", "function button(action,label,kind='primary',allow=true,extra='') {\n    const local=['resolve-pending','reset','restart','visit-picker','show-facility','show-vehicle','show-guardian','phone','start-easy-demo','start-community'].includes(action);\n    return `<button type=\"button\" class=\"${kind}\" data-action=\"${action}\" ${local?(!allow||busy?'disabled':''):blocked(allow)} ${extra}>${label}</button>`;\n  }")
function('function easyView()', 'function handoffProgress()', '''  function easyView() {
    const notice=state.arrivalNotice;
    if(!state.info.adult) return `<main id="main" tabindex="-1" class="easy-main"><p class="eyebrow">오늘의 방문</p><h1>어디로 가시나요?</h1><div class="action-stack">${button('start-easy-demo',icon('building')+'<span>돌봄센터 방문</span>','primary large')}${button('start-community',icon('person')+'<span>경로당 방문</span>','secondary large')}</div></main>`;
    if(done() && !notice) return `<main id="main" tabindex="-1" class="easy-main"><h1>${state.state==='CANCELLED'?'취소된 방문이에요':'방문을 마쳤어요'}</h1>${destination()}${button('restart','새 방문 시작하기','primary large')}${contact()}</main>`;
    if(!state.consent) return `<main id="main" tabindex="-1" class="easy-main"><p class="eyebrow">도착 알림</p><h1>도착 소식을<br>공유할까요?</h1>${destination()}<p class="lead">도착 시각을 담당자에게 알려요.</p><div class="action-stack">${button('consent-yes','동의하고 계속','primary large')}<button type="button" class="secondary large" data-action="phone">전화로 연락하기</button></div></main>`;
    if(notice && !pending) return `<main id="main" tabindex="-1" class="easy-main"><div class="result-mark">${icon('check')}</div><h1>도착 알림을<br>남겼어요</h1><section class="receipt-card"><dl><div><dt>방문 장소</dt><dd>${esc(U.facility(state))}</dd></div><div><dt>받는 사람</dt><dd>${esc(notice.recipient)}</dd></div><div><dt>알림 시각</dt><dd>${time(notice.at)}</dd></div></dl><p class="read-status">${notice.acknowledgedAt?'담당자가 '+time(notice.acknowledgedAt)+'에 읽었어요.':'담당자 확인 전'}</p></section><div class="action-stack">${contact()}${button('show-facility','담당자 화면 보기','secondary large')}${button('restart','다시 시작하기','text-button')}</div></main>`;
    if(easyStep==='confirm' || easyStep==='error' || pending) return `<main id="main" tabindex="-1" class="easy-main"><button class="back-button" data-action="easy-back">${icon('back')}이전 화면</button><h1>${easyStep==='error'?'아직 보내지<br>못했어요':'이곳에 도착했다고<br>알릴까요?'}</h1>${destination()}<div class="action-stack">${pending?button('resolve-pending','전송 결과 확인하기','primary large'):button('easy-send',busy?'보내고 있어요…':'도착 소식 보내기','primary large')}${contact()}</div></main>`;
    return `<main id="main" tabindex="-1" class="easy-main"><p class="eyebrow">오늘의 동행</p><h1>${esc(U.facility(state))}에<br>도착하셨나요?</h1>${destination()}<div class="action-stack">${button('easy-arrive',icon('pin')+'<span>도착 알리기</span>','primary large')}${contact()}</div></main>`;
  }
''')
function('function vehicleActions()', 'function guardianActions()', '''  function vehicleActions() {
    const safe=H.safeVehicle(state,Date.now()), ready=H.readyNow(state,Date.now());
    if(done())return `<section class="action-card"><div class="receipt-inline">${icon('check')}<span>${state.state==='CANCELLED'?'방문을 취소했어요':time(state.completedAt)+'에 확인을 마쳤어요'}</span></div>${button('show-guardian','보호자 화면 보기','secondary')}${button('restart','다시 시작하기')}</section>`;
    if(state.state==='PLANNED')return `<section class="action-card"><h2>이동을 준비해요</h2><div class="status-row"><span>차량 정차</span><strong>${safe?'확인됨':'확인 전'}</strong></div><div class="status-row"><span>담당자 준비</span><strong>${ready?'준비됨':state.info.mode==='ARRIVAL_ONLY'?'도착 알림':'확인 전'}</strong></div>${!safe?button('park','정차 상태 확인','secondary'):''}${!state.consent?button('mode-easy','본인 동의 확인하기','secondary'):button('depart','이 목적지로 출발하기','primary',safe)}</section>`;
    if(state.state==='EN_ROUTE')return `<section class="action-card travel"><span class="travel-icon">${icon('car')}</span><h2>목적지로 이동 중이에요</h2><p>${esc(state.info.place)}</p>${button('arrive','도착·정차하기')}</section>`;
    if(state.info.mode==='ARRIVAL_ONLY')return `<section class="action-card"><h2>도착을 알려주세요</h2>${!safe?button('park','정차 상태 확인','secondary'):''}${button('report','도착 소식 남기기','primary',safe&&state.consent&&state.locationInside)}</section>`;
    const reasons=H.handoffReasons(state,Date.now());
    const recovery=(!safe?button('park','정차 상태 확인','secondary'):'')+(!ready?button('ready','담당자 준비 확인','secondary'):'')+(!state.consent?button('mode-easy','본인 동의 확인하기','secondary'):'')+(!state.locationInside?button('return-area','지정 구역 도착 확인','secondary'):'');
    return `<section class="action-card"><h2>직접 만나 확인해요</h2>${recovery}${state.challenge?`<div class="connection-code"><span>담당자에게 보여줄 번호</span><strong aria-label="연결번호 ${esc((state.challenge.code||'').split('').join(' '))}">${esc(state.challenge.code||'••••••')}</strong><span id="codeSeconds"></span></div>${state.senderConfirmed?'<p class="read-status">인계자 확인 완료</p>'+button('show-facility','시설 화면에서 확인하기'):button('sender','직접 인계했어요','primary',reasons.length===0)}${button('issue','연결번호 새로 받기','text-button',reasons.length===0)}`:button('issue','연결번호 받기','primary',reasons.length===0)}</section>`;
  }
  function facilityActions() {
    const ready=H.readyNow(state,Date.now()), canConfirm=state.state==='VERIFYING'&&!state.receiverConfirmed;
    const notice=state.arrivalNotice?`<section class="arrival-card"><p class="eyebrow">도착 소식</p><h2>${esc(U.subject(state))}님이 도착을 알렸어요</h2><p>${time(state.arrivalNotice.at)}</p>${state.arrivalNotice.acknowledgedAt?'<p class="read-status">확인한 소식이에요.</p>':button('ack','도착 소식 확인했어요','secondary',!done())}</section>`:'';
    if(state.info.mode==='ARRIVAL_ONLY')return notice+`<section class="action-card"><h2>경로당 방문</h2>${button('mode-easy','이용자 화면 보기','secondary')}${button('restart','다시 시작하기','text-button')}</section>`;
    if(done())return notice+`<section class="action-card"><h2>${state.state==='COMPLETED'?'인수 확인을 마쳤어요':'방문이 종료됐어요'}</h2><p>${state.completedAt?time(state.completedAt):''}</p>${button('show-guardian','보호자 화면 보기','secondary')}${button('restart','다시 시작하기')}</section>`;
    return notice+`<section class="action-card"><p class="eyebrow">방문 예정</p><h2>${esc(U.subject(state))}</h2><p>${esc(state.info.receiver)}</p><div class="button-row">${button('ready',ready?'준비 상태 갱신':'맞이할 준비가 됐어요','secondary')}${button('absent','지금은 인수 어려움','text-button')}</div>${state.state==='VERIFYING'?`<div class="input-section"><label for="codeInput">연결번호</label><div class="code-entry"><input id="codeInput" type="text" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="6자리 번호" value="${esc(codeInput)}">${button('load-code','번호 불러오기','secondary')}</div>${state.receiverConfirmed?'<p class="read-status">담당자 확인 완료 · 인계자 확인 대기</p>':button('receiver','직접 인수했어요','primary',canConfirm)}${button('show-vehicle','차량 화면 보기','text-button')}</div>`:button('show-vehicle','차량 화면으로 이동','primary')}</section>`;
  }
''')
rep("${timeline()}</main>`;", "${prefs.role==='guardian'&&done()?button('restart','다시 시작하기'):''}${timeline()}</main>`;")
rep('<span class="visit-tag">${esc(state.info.title)}</span>','')
rep('<p class="help">선택한 화면과 글씨 크기를 다음에도 유지해요.</p>','')
rep('<p class="help">아래 선택은 가상 방문에만 적용됩니다.</p>','')
rep('새 방문 체험','방문 선택')
rep('본인 동의가 있는 상황을 모의 입력','본인 동의')
rep('<legend>전화 화면 시험</legend>','<legend>담당자 연락처</legend>')
rep('이 기기에 저장할 담당자 번호','전화번호')
rep('시험할 전화번호 직접 입력','전화번호 입력')
rep('자동 발신하지 않고 전화 앱만 엽니다. 비우면 연락처를 지웁니다.','')
rep("function phonePanel() {\n    return", "function visitPanel() {\n    return `<h2 id=\"panelTitle\">방문 선택</h2><div class=\"visit-choices\">${Object.entries(H.SCENARIOS).map(([key,v])=>`<button class=\"visit-choice\" data-action=\"select-visit\" data-scenario=\"${key}\"><span>${icon(v.adult?'person':'building')}</span><span><strong>${esc(v.title)}</strong><small>${esc(v.facility.split(' · ')[0])}</small></span>${icon('arrow')}</button>`).join('')}</div>`;\n  }\n  function phonePanel() {\n    return")
function('function phonePanel()', 'function render(', '''  function phonePanel() {
    return `<h2 id="panelTitle">담당자에게 전화</h2><p class="lead">${esc(U.recipient(state))}</p>${prefs.phone?`<p class="phone-number">${esc(prefs.phone)}</p><button class="primary large" data-action="open-dialer">전화 화면 열기</button>`:''}<fieldset><legend>${prefs.phone?'연락처 변경':'담당자 연락처'}</legend><label for="contactPhone">전화번호</label><input id="contactPhone" type="tel" inputmode="tel" autocomplete="off" placeholder="전화번호 입력" value="${esc(prefs.phone)}"><button class="${prefs.phone?'secondary':'primary'}" data-action="save-contact">${prefs.phone?'번호 저장':'저장하고 전화 화면 열기'}</button></fieldset>`;
  }
''')
rep("panel==='phone'?phonePanel():''", "panel==='phone'?phonePanel():panel==='visits'?visitPanel():''")
rep("<div class=\"demo-note\">체험용 가상 방문 · ${serverMode?'같은 서버의 화면끼리 연결돼요':'실제 시설로 전송되지 않아요'}</div>", "<div class=\"visit-switch\"><span>${esc(state.info.title)}</span><button data-action=\"visit-picker\">방문 변경</button></div>${prefs.mode==='standard'?`<nav class=\"role-tabs\" aria-label=\"역할 선택\">${[['vehicle','차량'],['facility','시설'],['guardian','보호자']].map(([r,label])=>`<button data-action=\"role\" data-role=\"${r}\" aria-pressed=\"${prefs.role===r}\">${icon(r==='vehicle'?'car':r==='facility'?'building':'person')}<span>${label}</span></button>`).join('')}</nav>`:''}")
rep('<span>오늘도, 안심하고 함께.</span>','<span>v${H.VERSION}</span>')
rep("      const b=document.querySelector('[data-action=\"receiver\"]'); if(b)b.disabled=!(connected&&!offline&&!busy&&receiverCheck&&codeInput.length===6&&state.state==='VERIFYING'&&!state.receiverConfirmed);",'')
rep("    if(e.target.id==='senderCheck') { senderCheck=e.target.checked;render(); }\n",'')
rep("    if(e.target.id==='receiverCheck') { receiverCheck=e.target.checked;render(); }\n",'')
rep("if(action==='close-panel'){closePanel();return;}", "if(action==='close-panel'){closePanel();return;}\n    if(action==='visit-picker'){openPanel('visits');return;}\n    if(action==='select-visit'){prefs.role='vehicle';await reset(b.dataset.scenario,prefs.mode==='easy'&&H.SCENARIOS[b.dataset.scenario].adult?'easy':'standard');return;}\n    if(action==='restart'){prefs.role='vehicle';await reset(state.scenario);return;}\n    if(action==='show-facility'||action==='show-vehicle'||action==='show-guardian'){prefs.role=action.slice(5);switchMode('standard');return;}")
rep("if(action==='start-easy-demo'){await reset('senior','easy');return;}", "if(action==='start-easy-demo'){await reset('senior','easy');return;}\n    if(action==='start-community'){await reset('community','easy');return;}")
rep("    if(action==='open-dialer'){", "    if(action==='save-contact'){\n      const phone=U.normalizePhone($('contactPhone').value);\n      if(!phone){notify('전화번호를 확인해 주세요.');$('contactPhone').focus();return;}\n      const first=!prefs.phone; prefs.phone=phone;savePrefs();render();\n      if(first)document.querySelector('[data-action=\"open-dialer\"]').click();\n      else notify('연락처를 저장했어요.');return;\n    }\n    if(action==='load-code'){\n      try {\n        const source=serverMode?(await request('/api/state',{headers:{Authorization:'Bearer '+tokens.vehicle}})).state:state;\n        if(!source.challenge?.code)throw new Error('NO_CODE');\n        codeInput=source.challenge.code;errorText='';render();$('codeInput')?.focus();\n      } catch {errorText='차량 화면에서 새 연결번호를 받아주세요.';render();}return;\n    }\n    if(action==='receiver' && !/^\\d{6}$/.test(codeInput)){errorText='6자리 연결번호를 입력해 주세요.';render();$('codeInput')?.focus();return;}\n    if(action==='open-dialer'){")
rep("sender:['SENDER_CONFIRM',{inPerson:senderCheck},'vehicle']", "sender:['SENDER_CONFIRM',{inPerson:true},'vehicle']")
rep("receiver:['RECEIVER_CONFIRM',{inPerson:receiverCheck,code:codeInput},'facility']", "receiver:['RECEIVER_CONFIRM',{inPerson:true,code:codeInput},'facility']")
rep('{senderCheck=false;receiverCheck=false;render();}','{render();}')
rep('    const commands={', "    if(action==='return-area'){await send('RETURN_AREA',{},'simulator');return;}\n    const commands={")
rep('    setInterval(async()=>{', "    await prepareNewVisit();\n    if(state.vehicle.known&&!done()&&connected&&!offline&&!pending)await send('VEHICLE',{known:state.vehicle.known,restricted:state.vehicle.restricted,gear:state.vehicle.gear,speed:state.vehicle.speed},'simulator',true);\n    render();\n    setInterval(async()=>{")
rep("prefs.mode==='standard'&&prefs.role==='vehicle'&&state.vehicle.known",'state.vehicle.known')
rep("{lastBeat=Date.now();await send('VEHICLE',{known:state.vehicle.known,restricted:state.vehicle.restricted,gear:state.vehicle.gear,speed:state.vehicle.speed},'simulator',true);}", "{const wasSafe=H.safeVehicle(state,Date.now());lastBeat=Date.now();const ok=await send('VEHICLE',{known:state.vehicle.known,restricted:state.vehicle.restricted,gear:state.vehicle.gear,speed:state.vehicle.speed},'simulator',true);if(ok&&!wasSafe)render();}")
rep("      if(e.status) { setPending(null); errorText=U.publicError", "      if(quiet && type==='VEHICLE' && e.data?.error==='VERSION') {setPending(null);return false;}\n      if(e.status) { setPending(null); errorText=U.publicError")
p.write_text(s)
p=R/'web/ui.js';s=p.read_text();s=s.replace('  function normalizePhone(value)', '''  function initialPresentationEvents(s) {
    if (!s || s.state !== 'PLANNED' || s.events.some(e => e.type !== 'CREATED')) return [];
    const events=[['VEHICLE',{known:true,restricted:false,gear:'P',speed:0},'simulator']];
    if(s.info.mode==='HANDOFF')events.push(['READY',{ready:true},'facility']);
    return events;
  }
  function normalizePhone(value)''')
s=s.replace('return { SETTINGS_KEY, settings,','return { SETTINGS_KEY, settings, initialPresentationEvents,')
s=s.replace("'출발 전에 확인해 주세요', '오늘 방문할 곳과 담당자를 확인하세요.'", "'오늘의 동행을 시작해요', '방문할 곳과 담당자를 확인해 주세요.'")
s=s.replace("'운전 중에는 화면을 조작하지 마세요.'", "'도착하면 다음 단계를 이어갈 수 있어요.'")
p.write_text(s)
p=R/'web/core.js';s=p.read_text().replace("const VERSION = '0.2.0'","const VERSION = '0.2.1'")
s=s.replace("      case 'LEAVE_AREA':", """      case 'RETURN_AREA':
        assertActor(actor, ['simulator']);
        requireThat(['ARRIVED','VERIFYING'].includes(s.state), 'STATE', '도착 단계에서만 구역을 확인할 수 있습니다.');
        s.locationInside = true; message = '지정 구역 도착을 확인했습니다.';
        break;
      case 'LEAVE_AREA':""")
for a,b in {
'가상 이동 건을 만들었습니다. 실제 시설·이용자 데이터가 아닙니다.':'방문을 등록했습니다.',
'이용자 동의 확인을 모의 입력했습니다.':'이용자 동의를 확인했습니다.',
'정차·UX 허용 신호를 모의 입력했습니다.':'정차 상태를 확인했습니다.',
'이동을 시작했습니다. 도착은 아직 인계 완료가 아닙니다.':'목적지로 출발했습니다.',
'지정 구역 도착을 모의 입력했습니다. 사람의 인수는 별도 확인합니다.':'지정 승하차 구역에 도착했습니다.',
'2분간 유효한 대면 연결번호를 발급했습니다. 번호만으로 인수 자격이 생기지 않습니다.':'연결번호를 발급했습니다.',
'담당자 부재 상태입니다. 인계 완료로 처리하지 않습니다.':'담당자가 인수 어려움을 알렸습니다.',
'본인 선택에 따라 도착을 기록했습니다. 인계 완료를 의미하지 않습니다.':'도착 알림을 남겼습니다.',
'이동을 취소했습니다. 인계 완료로 처리하지 않습니다.':'방문을 취소했습니다.'}.items():s=s.replace(a,b)
p.write_text(s)
p=R/'tools/bundle.js';p.write_text(p.read_text().replace('const compatibility="','const compatibility="window.ANSIM_STANDALONE=true;'))
p=R/'package.json';p.write_text(p.read_text().replace('"0.2.0"','"0.2.1"'))
p=R/'android/app/build.gradle';p.write_text(p.read_text().replace("versionCode 3; versionName '0.2.0'","versionCode 4; versionName '0.2.1'"))
p=R/'android/app/src/main/java/kr/co/ansimdonghaeng/MainActivity.java';p.write_text(p.read_text().replace('AAOS 환경: CarUxRestrictions 확인 중. 경로·위치·인계는 별도 검증이 필요합니다.','AAOS · 차량 상태 확인 중').replace('일반 Android 로컬 시연. 실제 차량 신호·Pleos 내비게이션은 연결되지 않았습니다.','Android · 로컬 연결'))
p=R/'web/style.css';p.write_text(p.read_text()+'''
/* Direct presentation controls, 0.2.1 */
.visit-switch{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:4px 0 14px;color:var(--muted);font-size:.9rem}
.visit-switch button{background:transparent;color:var(--green);padding:.4rem .1rem;min-height:44px;text-decoration:underline;text-underline-offset:4px}
.role-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));padding:5px;gap:5px;border-radius:17px;border:1px solid var(--line);background:var(--soft);margin:0 0 24px}
.role-tabs button{display:flex;align-items:center;justify-content:center;gap:8px;min-width:0;min-height:48px;padding:10px 4px;background:transparent;color:var(--muted);border-radius:12px}
.role-tabs button[aria-pressed=true]{background:white;color:var(--green);box-shadow:0 2px 8px #183b2e15}
.role-tabs svg{width:20px;height:20px;flex:none}
.action-card>.secondary{width:100%;margin-top:14px}
.code-entry{display:flex;gap:10px;align-items:stretch;margin:8px 0 16px}
.code-entry input{min-width:0;flex:1;font-size:1.4rem;letter-spacing:.12em}
.code-entry button{flex:none;padding:12px;font-size:.85rem}
.visit-choices{display:flex;flex-direction:column;gap:12px}
.visit-choice{display:flex;gap:14px;align-items:center;text-align:left;background:var(--soft);border:1px solid var(--line);padding:20px;color:var(--green);width:100%}
.visit-choice>span:nth-child(2){flex:1;min-width:0}
.visit-choice strong,.visit-choice small{display:block}
.visit-choice small{color:var(--muted);font-weight:400;margin-top:5px}
:root.text-200 .role-tabs button{flex-direction:column;font-size:.85rem}
:root.text-200 .code-entry{flex-direction:column}
:root.text-200 .visit-switch{flex-wrap:wrap}
:root.text-200 .visit-choice{flex-wrap:wrap}
.toast{pointer-events:none}
@media(max-width:700px){.standard-main .main-grid>div:first-child{order:2}.standard-main .main-grid>div:last-child{order:1}}
''')
p=R/'test/browser_smoke.py';s=p.read_text()
s=s.replace("    def click(page,a):page.locator('[data-action=\"'+a+'\"]').first.click()", "    def click(page,a):\n        modal=page.locator('.modal [data-action=\"'+a+'\"]')\n        (modal if modal.count() else page.locator('[data-action=\"'+a+'\"]')).first.click()")
s=s.replace("page.locator('[data-action=\"role\"][data-role=\"'+r+'\"]').click()", "page.locator('.modal [data-action=\"role\"][data-role=\"'+r+'\"]').click()")
s=s.replace("click(p,'phone');expect(p.locator('.modal')).to_contain_text('등록된 연락처가 없어요');assert p.locator('[data-action=\"open-dialer\"]').count()==0", "click(p,'phone');expect(p.locator('#contactPhone')).to_be_visible();assert p.locator('[data-action=\"open-dialer\"]').count()==0")
s=s.replace('missing contact gives clear feedback without opening a dialer','contact can be entered directly without opening a dialer first')
s=s.replace("p.check('#senderCheck');",'').replace("p.check('#receiverCheck');",'')
p.write_text(s)
# Remove an unused transfer staging file; it is never decoded or executed.
(R/'tools/updates/demo021.1.b64').unlink(missing_ok=True)
print('Applied demo 0.2.1 source changes')
