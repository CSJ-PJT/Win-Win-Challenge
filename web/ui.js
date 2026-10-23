/* Pure presentation helpers shared with UI tests. No network or vehicle authority. */
(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HandoffUI = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  const SETTINGS_KEY = 'ansim-view-settings-v2';
  function settings(value) {
    const v = value && typeof value === 'object' ? value : {};
    return {
      mode: v.mode === 'easy' ? 'easy' : 'standard',
      role: ['vehicle', 'facility', 'guardian'].includes(v.role) ? v.role : 'vehicle',
      text: [100, 125, 150, 200].includes(v.text) ? v.text : 100,
      phone: normalizePhone(v.phone),
      theme: 'light'
    };
  }
  function initialPresentationEvents(s) {
    if (!s || s.state !== 'PLANNED' || s.events.some(e => e.type !== 'CREATED')) return [];
    const events=[['VEHICLE',{known:true,restricted:false,gear:'P',speed:0},'simulator']];
    if(s.info.mode==='HANDOFF')events.push(['READY',{ready:true},'facility']);
    return events;
  }
  function normalizePhone(value) {
    if (typeof value !== 'string' || !/^[+\d][\d ()-]{5,24}$/.test(value.trim())) return '';
    const n = value.replace(/[ ()-]/g, '');
    return /^\+?\d{7,15}$/.test(n) ? n : '';
  }
  function facility(s) { return (s.info.facility || '').split(' · ')[0]; }
  function subject(s) { return (s.info.subject || '').split(' · ')[0]; }
  function recipient(s) { return s.info.notificationRecipient || s.info.receiver; }
  function nextStep(s, role) {
    if (s.state === 'CANCELLED') return ['방문이 취소됐어요', '새 방문을 시작하려면 담당자와 연락해 주세요.'];
    if (s.state === 'COMPLETED') return ['양쪽 확인이 끝났어요', '인계자와 담당자의 확인이 모두 저장됐어요.'];
    if (s.state === 'ARRIVAL_REPORTED') return ['도착 소식을 남겼어요', '이번 방문은 도착 알림만 제공해요.'];
    if (role === 'facility') {
      if (s.receiverConfirmed) return ['인계자의 확인을 기다려요', '담당자의 인수 확인은 저장됐어요.'];
      if (s.state === 'VERIFYING') return ['직접 만난 뒤 확인해 주세요', '연결번호와 이용자를 확인해 주세요.'];
      if (s.ready) return ['방문을 기다리고 있어요', '도착하면 직접 만나 인수해 주세요.'];
      return ['맞이할 준비가 되셨나요?', '담당자가 준비 상태를 알려주세요.'];
    }
    if (role === 'guardian') {
      if (s.state === 'VERIFYING') return ['대면 확인 중이에요', '양쪽 확인이 끝나면 완료 시각을 보여드려요.'];
      if (s.state === 'ARRIVED') return ['목적지에 도착했어요', '아직 담당자 인수 확인 전이에요.'];
      if (s.state === 'EN_ROUTE') return ['목적지로 가고 있어요', '도착 후 확인 과정을 여기에서 볼 수 있어요.'];
      return ['출발을 준비하고 있어요', '이동과 인계 상태를 함께 확인하세요.'];
    }
    if (s.state === 'PLANNED') return ['오늘의 동행을 시작해요', '방문할 곳과 담당자를 확인해 주세요.'];
    if (s.state === 'EN_ROUTE') return ['목적지로 가고 있어요', '도착하면 다음 단계를 이어갈 수 있어요.'];
    if (s.senderConfirmed) return ['담당자의 확인을 기다려요', '인계자 확인은 저장됐어요.'];
    if (s.state === 'VERIFYING') return ['담당자를 직접 만나셨나요?', '대상자와 담당자를 확인한 뒤 눌러주세요.'];
    return ['목적지에 도착했어요', '정차 후 담당자와 만나 확인해 주세요.'];
  }
  function publicError(code) {
    const map = {
      WRONG_CODE: '연결번호가 맞지 않아요. 상대방에게 다시 확인해 주세요.',
      EXPIRED: '연결번호 시간이 지났어요. 차량 화면에서 새 번호를 받아주세요.',
      NO_CHALLENGE: '차량 화면에서 연결번호를 먼저 받아주세요.',
      VERSION: '다른 화면에서 내용이 바뀌었어요. 최신 내용을 확인한 뒤 다시 눌러주세요.',
      CONSENT: '도착 소식을 공유할지 먼저 선택해 주세요.',
      ALREADY_NOTIFIED: '도착 소식이 이미 저장됐어요. 현재 상태를 확인해 주세요.',
      TERMINAL: '이미 마친 방문이에요. 현재 상태를 확인해 주세요.',
      UNAUTHORIZED: '연결을 다시 확인하고 있어요. 잠시 후 다시 눌러주세요.',
      VEHICLE_UNSAFE: '주차 상태를 확인한 뒤 진행할 수 있어요.',
      NOT_READY: '차량 정차와 담당자 준비를 먼저 확인해 주세요.'
    };
    return map[code] || '지금은 처리하지 못했어요. 연결과 현재 상태를 확인한 뒤 다시 눌러주세요.';
  }
  return { SETTINGS_KEY, settings, initialPresentationEvents, normalizePhone, facility, subject, recipient, nextStep, publicError };
});
