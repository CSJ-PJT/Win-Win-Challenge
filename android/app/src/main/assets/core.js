/* Shared domain model. No UI, network, GPS or identity inference lives here. */
(function (root, factory) {
  const api = factory(typeof module === 'object' && module.exports ? require('./config') : root.VisitConfig);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Handoff = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (C) {
  'use strict';
  const VERSION = '0.4.1';
  const TELEMETRY_TTL = 30000, READY_TTL = 600000, CODE_TTL = 120000;
  const SCENARIOS = {
    kindergarten: { title: '유치원 등원', facility: '햇살유치원', subject: '도담', receiver: '햇살반 담당 교사', place: '시설 내 지정 승하차 구역 A', mode: 'HANDOFF', adult: false },
    daycare: { title: '어린이집 등원', facility: '새봄어린이집', subject: '하늘', receiver: '새봄반 담당 교사', place: '시설 내 지정 승하차 구역 B', mode: 'HANDOFF', adult: false },
    senior: { title: '주야간보호센터 방문', facility: '온유돌봄센터', subject: '이용자 A', receiver: '지정 돌봄 담당자', place: '시설 내 이동 지원 구역', mode: 'HANDOFF', adult: true, notificationRecipient: '온유돌봄센터 담당자' },
    community: { title: '경로당 자율 방문', facility: '함께경로당', subject: '이용자 B', receiver: '지정 인수자 없음', place: '방문지 도착 확인 구역', mode: 'ARRIVAL_ONLY', adult: true, notificationRecipient: '함께경로당 연락 담당자' }
  };
  const LABELS = { PLANNED: '출발 준비', EN_ROUTE: '이동 중', ARRIVED: '도착 · 인계 전', VERIFYING: '대면 확인 중', COMPLETED: '양측 인계 확인 완료', ARRIVAL_REPORTED: '도착 알림 · 인계 아님', CANCELLED: '이동 취소' };
  class DomainError extends Error {
    constructor(code, message, status) { super(message); this.name = 'DomainError'; this.code = code; this.status = status || 409; }
  }
  function requireThat(condition, code, message, status) { if (!condition) throw new DomainError(code, message, status); }
  function copy(value) { return JSON.parse(JSON.stringify(value)); }
  function createTrip(scenario, now, id) {
    requireThat(Object.hasOwn(SCENARIOS, scenario), 'SCENARIO', '지원하지 않는 시연입니다.', 400);
    return {
      schema: 1, id: id || 'local-demo', version: 0, scenario, info: { ...C.defaults(), ...copy(SCENARIOS[scenario]) },
      state: 'PLANNED', consent: !SCENARIOS[scenario].adult, assignedReceiver: 'staff-001',
      readyAt: null, ready: false, locationInside: false,
      vehicle: { source: 'SIMULATOR', known: false, restricted: true, gear: 'UNKNOWN', speed: null, at: null },
      challenge: null, senderConfirmed: false, receiverConfirmed: false, blockReason: null,
      arrivalNotice: null, completedAt: null, createdAt: now, events: [{ seq: 0, at: now, type: 'CREATED', actor: 'simulator', message: '방문을 등록했습니다.' }]
    };
  }
  function safeVehicle(s, now) {
    const v = s.vehicle;
    return v.known === true && v.restricted === false && v.gear === 'P' && v.speed === 0 &&
      Number.isFinite(v.at) && now >= v.at && now - v.at <= TELEMETRY_TTL;
  }
  function readyNow(s, now) {
    return s.ready === true && Number.isFinite(s.readyAt) && now >= s.readyAt && now - s.readyAt <= READY_TTL;
  }
  function handoffReasons(s, now) {
    const reasons = [];
    if (s.info.mode !== 'HANDOFF') reasons.push('이 이동은 도착 알림 전용입니다.');
    if (!s.consent) reasons.push('이용자 본인의 동의가 확인되지 않았습니다.');
    if (!s.locationInside) reasons.push('지정 구역 도착이 확인되지 않았습니다.');
    if (!safeVehicle(s, now)) reasons.push('최신 정차·주행 제한 상태를 확인해야 합니다.');
    if (!readyNow(s, now)) reasons.push('지정 담당자가 인수 준비를 확인해야 합니다.');
    if (!['ARRIVED', 'VERIFYING'].includes(s.state)) reasons.push('도착 확인 후 인계를 시작할 수 있습니다.');
    return reasons;
  }
  function invalidate(s, reason) {
    s.challenge = null; s.senderConfirmed = false; s.receiverConfirmed = false;
    if (s.state === 'VERIFYING') s.state = 'ARRIVED';
    s.blockReason = reason;
  }
  function assertActor(actor, roles) {
    requireThat(actor && roles.includes(actor.role), 'FORBIDDEN', '이 역할에는 해당 작업 권한이 없습니다.', 403);
  }
  function apply(original, event, actor, ctx) {
    const now = ctx.now;
    requireThat(event && typeof event.type === 'string', 'EVENT', '작업 형식이 올바르지 않습니다.', 400);
    requireThat(Number.isFinite(now), 'CLOCK', '서버 시각을 확인할 수 없습니다.', 500);
    requireThat(!['COMPLETED', 'ARRIVAL_REPORTED', 'CANCELLED'].includes(original.state), 'TERMINAL', '종료된 이동 건은 변경할 수 없습니다.');
    const s = copy(original);
    let message = '', rejected = null;
    const p = event.payload || {};
    switch (event.type) {
      case 'CONFIGURE_VISIT': {
        assertActor(actor, ['vehicle','facility','guardian','visitor']);
        if(actor.role==='facility')requireThat(actor.id===s.assignedReceiver,'RECEIVER','담당 시설의 정보만 변경할 수 있습니다.',403);
        requireThat(s.state==='PLANNED'&&!s.arrivalNotice,'VISIT_STARTED','시작한 방문의 정보는 바꿀 수 없습니다. 새 방문에서 변경해 주세요.');
        let patch;try{patch=C.cleanPatch(p,actor.role,s.info);}catch(e){throw new DomainError('SETTINGS',e.message,400);}
        const personChanged=Object.hasOwn(patch,'subject')&&patch.subject!==s.info.subject;
        const facilityChanged=['facility','receiver'].some(k=>Object.hasOwn(patch,k)&&patch[k]!==s.info[k]);
        if(facilityChanged){s.ready=false;s.readyAt=null;}
        s.info={...s.info,...patch};
        if(Object.hasOwn(patch,'receiver'))s.info.notificationRecipient=patch.receiver;
        if(personChanged&&s.info.adult)s.consent=false;
        message='방문 정보를 저장했습니다.';break;
      }
      case 'CONSENT':
        assertActor(actor, ['simulator']);
        requireThat(typeof p.accepted === 'boolean', 'INPUT', '동의 여부가 필요합니다.', 400);
        s.consent = p.accepted;
        if (!s.consent) invalidate(s, '이용자가 동의를 철회했습니다.');
        message = s.consent ? '이용자 동의를 확인했습니다.' : '동의 철회로 진행 중인 인계 확인을 취소했습니다.';
        break;
      case 'SELF_CONSENT':
        assertActor(actor, ['visitor']);
        requireThat(s.info.adult, 'ADULT_ONLY', '본인이 이용하는 방문에서 선택할 수 있습니다.', 403);
        requireThat(typeof p.accepted === 'boolean', 'INPUT', '동의 여부를 선택해 주세요.', 400);
        s.consent = p.accepted;
        if (!s.consent) invalidate(s, '이용자가 도착 정보 공유를 중단했습니다.');
        message = s.consent ? '이용자가 방문 상태 공유에 동의했습니다.' : '이용자가 방문 상태 공유를 중단했습니다.';
        break;
      case 'NOTIFY_ARRIVAL':
        assertActor(actor, ['visitor']);
        requireThat(s.info.adult, 'ADULT_ONLY', '본인이 이용하는 방문에서 선택할 수 있습니다.', 403);
        requireThat(s.consent, 'CONSENT', '도착 소식 공유에 먼저 동의해 주세요.');
        // Self-reported arrival is deliberately separate from location, vehicle and handoff state.
        requireThat(!s.arrivalNotice, 'ALREADY_NOTIFIED', '이번 방문의 도착 소식은 이미 남겼어요.');
        s.arrivalNotice = { at: now, recipient: s.info.notificationRecipient, source: 'SELF_REPORTED', acknowledgedAt: null };
        message = '이용자가 도착 소식을 남겼습니다.';
        break;
      case 'ACK_ARRIVAL_NOTICE':
        assertActor(actor, ['facility']);
        requireThat(actor.id === s.assignedReceiver, 'RECEIVER', '지정된 담당자만 확인할 수 있습니다.', 403);
        requireThat(s.arrivalNotice, 'NO_NOTICE', '확인할 도착 소식이 없습니다.');
        requireThat(!s.arrivalNotice.acknowledgedAt, 'ALREADY_ACKNOWLEDGED', '이미 확인한 도착 소식입니다.');
        s.arrivalNotice.acknowledgedAt = now;
        message = '담당자가 도착 소식을 읽었습니다.';
        break;
      case 'READY':
        assertActor(actor, ['facility']);
        requireThat(actor.id === s.assignedReceiver, 'RECEIVER', '지정된 인수 담당자가 아닙니다.', 403);
        requireThat(s.info.mode === 'HANDOFF', 'ARRIVAL_ONLY', '도착 알림 전용 이동에는 인수 절차가 없습니다.');
        requireThat(typeof p.ready === 'boolean', 'INPUT', '준비 상태가 필요합니다.', 400);
        s.ready = p.ready; s.readyAt = p.ready ? now : null;
        if (!p.ready) invalidate(s, '인수 담당자가 준비 상태를 해제했습니다.');
        else s.blockReason = null;
        message = p.ready ? '지정 담당자가 인수 준비를 확인했습니다.' : '담당자가 인수 어려움을 알렸습니다.';
        break;
      case 'VEHICLE':
        assertActor(actor, ['simulator']);
        requireThat(['P', 'D', 'UNKNOWN'].includes(p.gear) && typeof p.known === 'boolean' && typeof p.restricted === 'boolean' &&
          (p.speed === null || (Number.isFinite(p.speed) && p.speed >= 0)), 'INPUT', '차량 모의 신호 형식이 올바르지 않습니다.', 400);
        s.vehicle = { source: 'SIMULATOR', known: p.known, restricted: p.restricted, gear: p.gear, speed: p.speed, at: now };
        if (!safeVehicle(s, now) && s.challenge) invalidate(s, '차량 조건이 변경되어 재확인이 필요합니다.');
        message = safeVehicle(s, now) ? '정차 상태를 확인했습니다.' : '주행 중이거나 차량 신호가 불명확합니다.';
        break;
      case 'DEPART':
        assertActor(actor, ['vehicle']);
        requireThat(s.state === 'PLANNED', 'STATE', '출발 준비 단계에서만 시작할 수 있습니다.');
        requireThat(s.consent, 'CONSENT', '이용자 동의를 먼저 확인해 주세요.');
        requireThat(safeVehicle(s, now), 'VEHICLE_UNSAFE', '정차 상태에서 출발 계획을 선택해 주세요.');
        s.state = 'EN_ROUTE'; message = '목적지로 출발했습니다.';
        break;
      case 'ARRIVE':
        assertActor(actor, ['simulator']);
        requireThat(s.state === 'EN_ROUTE', 'STATE', '이동 중에만 도착을 입력할 수 있습니다.');
        s.state = 'ARRIVED'; s.locationInside = true;
        message = '지정 승하차 구역에 도착했습니다.';
        break;
      case 'RETURN_AREA':
        assertActor(actor, ['simulator']);
        requireThat(['ARRIVED','VERIFYING'].includes(s.state), 'STATE', '도착 단계에서만 구역을 확인할 수 있습니다.');
        s.locationInside = true; message = '지정 구역 도착을 확인했습니다.';
        break;
      case 'LEAVE_AREA':
        assertActor(actor, ['simulator']);
        s.locationInside = false; invalidate(s, '지정 구역을 벗어났습니다.'); message = '지정 구역 이탈로 인계 확인을 취소했습니다.';
        break;
      case 'ISSUE_CODE':
        assertActor(actor, ['vehicle']);
        requireThat(s.info.mode === 'HANDOFF', 'ARRIVAL_ONLY', '인계 확인을 제공하지 않는 이동입니다.');
        { const reasons = handoffReasons(s, now); requireThat(reasons.length === 0, 'NOT_READY', reasons.join(' ')); }
        requireThat(/^\d{6}$/.test(ctx.code || ''), 'CODE_SOURCE', '확인번호 생성에 실패했습니다.', 500);
        s.challenge = { code: ctx.code, expiresAt: now + CODE_TTL, attempts: 0 };
        s.senderConfirmed = false; s.receiverConfirmed = false; s.state = 'VERIFYING'; s.blockReason = null;
        message = '연결번호를 발급했습니다.';
        break;
      case 'SENDER_CONFIRM':
      case 'RECEIVER_CONFIRM': {
        const sender = event.type === 'SENDER_CONFIRM';
        assertActor(actor, [sender ? 'vehicle' : 'facility']);
        if (!sender) requireThat(actor.id === s.assignedReceiver, 'RECEIVER', '지정된 인수 담당자가 아닙니다.', 403);
        requireThat(p.inPerson === true, 'IN_PERSON', '상대방과 대상자를 직접 확인한 뒤 선택해 주세요.');
        requireThat(s.state === 'VERIFYING' && s.challenge, 'NO_CHALLENGE', '유효한 연결번호를 먼저 발급해 주세요.');
        if (now >= s.challenge.expiresAt) {
          invalidate(s, '연결번호가 만료되었습니다.'); rejected = { code: 'EXPIRED', message: '연결번호가 만료되었습니다. 양측이 다시 확인해 주세요.' }; message = rejected.message; break;
        }
        { const reasons = handoffReasons(s, now); if (reasons.length) { invalidate(s, reasons.join(' ')); rejected = { code: 'NOT_READY', message: reasons.join(' ') }; message = rejected.message; break; } }
        if (!sender && String(p.code || '') !== s.challenge.code) {
          s.challenge.attempts += 1;
          if (s.challenge.attempts >= 5) invalidate(s, '연결번호 5회 불일치로 번호를 폐기했습니다.');
          rejected = { code: 'WRONG_CODE', message: s.blockReason || '연결번호가 일치하지 않습니다.' }; message = rejected.message; break;
        }
        if (sender) s.senderConfirmed = true; else s.receiverConfirmed = true;
        message = sender ? '인계자가 직접 전달했음을 확인했습니다.' : '지정 인수자가 직접 인수했음을 확인했습니다.';
        if (s.senderConfirmed && s.receiverConfirmed) {
          s.state = 'COMPLETED'; s.completedAt = now; s.challenge = null; s.blockReason = null;
          message = '인계자와 지정 인수자의 확인을 모두 기록했습니다.';
        }
        break;
      }
      case 'REPORT_ARRIVAL':
        assertActor(actor, ['vehicle']);
        requireThat(s.info.mode === 'ARRIVAL_ONLY', 'MODE', '이 이동에는 양측 인계 확인이 필요합니다.');
        requireThat(s.state === 'ARRIVED' && s.locationInside && s.consent && safeVehicle(s, now), 'NOT_READY', '동의·도착·최신 정차 상태를 확인해 주세요.');
        s.state = 'ARRIVAL_REPORTED'; s.completedAt = now; message = '도착 알림을 남겼습니다.';
        break;
      case 'CANCEL':
        assertActor(actor, ['vehicle', 'facility']);
        if (actor.role === 'facility') requireThat(actor.id === s.assignedReceiver, 'RECEIVER', '지정된 담당자가 아닙니다.', 403);
        invalidate(s, '이동이 취소되었습니다.'); s.state = 'CANCELLED'; message = '방문을 취소했습니다.';
        break;
      default: throw new DomainError('UNKNOWN_EVENT', '지원하지 않는 작업입니다.', 400);
    }
    s.version += 1;
    s.events.push({ seq: s.version, at: now, type: event.type, actor: actor.role, message });
    return { state: s, rejected };
  }
  function project(state, role) {
    const s = copy(state);
    if(role==='facility'){s.events=s.events.filter(e=>['CREATED','CONFIGURE_VISIT','DEPART','ARRIVE','READY','ISSUE_CODE','SENDER_CONFIRM','RECEIVER_CONFIRM','NOTIFY_ARRIVAL','ACK_ARRIVAL_NOTICE','CANCEL'].includes(e.type));}
    if (s.challenge && role !== 'vehicle' && role !== 'simulator') delete s.challenge.code;
    return s;
  }
  return { VERSION, TELEMETRY_TTL, READY_TTL, CODE_TTL, SCENARIOS, LABELS, DomainError, createTrip, apply, project, safeVehicle, readyNow, handoffReasons };
});