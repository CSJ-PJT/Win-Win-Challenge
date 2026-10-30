'use strict';
// Reproducible PoC service journey. Real loopback HTTP, synthetic people/vehicle.
// Does not drive a browser, Android, a phone push service, or an institution.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { createApp } = require('../server');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ansim-poc-'));
const dataFile = path.join(dir, 'synthetic.json');
const report = { scope: 'real loopback HTTP / synthetic data / PM self QA', cases: [], http: [], assertions: 0, browser: false, android: false, externalCalls: 0, phonePushVerified: false };
let app, base, boot;
function check(ok, label) { assert.ok(ok, label); report.assertions++; }
async function start() {
  app = createApp({ dataFile });
  await new Promise(resolve => app.listen(0, '127.0.0.1', resolve));
  base = 'http://127.0.0.1:' + app.address().port;
}
async function stop() { if (app) { await new Promise(resolve => app.close(resolve)); app = null; } }
async function request(route, role, body, expected = 200) {
  const response = await fetch(base + route, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { ...(role ? { Authorization: 'Bearer ' + boot.tokens[role] } : {}), ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(5000)
  });
  const result = await response.json();
  report.http.push({ route, role: role || 'none', status: response.status });
  check(response.status === expected, route + ' expected ' + expected);
  return result;
}
async function state(role = 'vehicle') { return (await request('/api/state', role)).state; }
async function event(role, type, payload = {}, expected = 200) {
  const latest = await state(role);
  return request('/api/events', role, { tripId: boot.tripId, expectedVersion: latest.version, key: crypto.randomUUID(), event: { type, payload } }, expected);
}
async function restart() { await stop(); await start(); boot = await request('/api/bootstrap'); }
(async () => {
  try {
    await start(); boot = await request('/api/bootstrap');
    await request('/api/health');
    await event('vehicle', 'CONFIGURE_VISIT', { address: '서울 중구 세종대로 110', detailAddress: '합성 시연 정문', facility: '합성 시연 시설' });
    await event('simulator', 'VEHICLE', { known: true, restricted: false, gear: 'P', speed: 0 });
    await event('facility', 'READY', { ready: true });
    check((await event('vehicle', 'DEPART')).state.state === 'EN_ROUTE', 'departure');
    check((await event('simulator', 'ARRIVE')).state.state === 'ARRIVED', 'arrival');
    const issued = (await event('vehicle', 'ISSUE_CODE')).state;
    const code = issued.challenge.code;
    check(/^\d{6}$/.test(code), 'six digit code');
    const guardian = await state('guardian');
    check(!Object.hasOwn(guardian.challenge, 'code'), 'guardian cannot read connecting code');
    await event('guardian', 'SENDER_CONFIRM', { inPerson: true }, 403);
    const sender = (await event('vehicle', 'SENDER_CONFIRM', { inPerson: true })).state;
    check(sender.senderConfirmed && sender.state !== 'COMPLETED', 'sender alone cannot complete');
    await event('facility', 'RECEIVER_CONFIRM', { inPerson: true, code: code === '000000' ? '111111' : '000000' }, 409);
    check(!(await state()).receiverConfirmed, 'incorrect number cannot confirm receiver');
    const done = (await event('facility', 'RECEIVER_CONFIRM', { inPerson: true, code })).state;
    check(done.state === 'COMPLETED' && done.senderConfirmed && done.receiverConfirmed, 'both actors complete');
    check((await state('guardian')).completedAt === done.completedAt, 'guardian observes same completion; no push claim');
    await restart();
    const restored = await state('guardian');
    check(restored.state === 'COMPLETED' && restored.completedAt === done.completedAt, 'completion survives server restart');
    check(restored.info.address === '서울 중구 세종대로 110', 'address survives server restart');
    report.cases.push({ name: 'handoff and guardian readback with durable restore', status: 'PASS' });
    await request('/api/reset', 'simulator', { scenario: 'senior' });
    boot = await request('/api/bootstrap');
    await event('visitor', 'NOTIFY_ARRIVAL', {}, 409);
    await event('visitor', 'SELF_CONSENT', { accepted: true });
    const notified = (await event('visitor', 'NOTIFY_ARRIVAL')).state;
    check(notified.arrivalNotice.source === 'SELF_REPORTED' && !notified.arrivalNotice.acknowledgedAt, 'self report waits for staff');
    check(notified.state === 'PLANNED' && !notified.senderConfirmed && !notified.receiverConfirmed, 'notice is separate from handoff');
    const ack = (await event('facility', 'ACK_ARRIVAL_NOTICE')).state;
    check(Number.isFinite(ack.arrivalNotice.acknowledgedAt), 'staff acknowledgement is saved');
    await restart();
    const easy = await state('visitor');
    check(easy.arrivalNotice.acknowledgedAt === ack.arrivalNotice.acknowledgedAt, 'easy acknowledgement survives restart');
    check(easy.state === 'PLANNED' && !easy.completedAt, 'acknowledgement does not fabricate handoff completion');
    report.cases.push({ name: 'easy arrival consent and staff acknowledgement with durable restore', status: 'PASS' });
    report.result = 'PASS';
  } catch (e) {
    report.result = 'FAIL'; report.failure = e.message; process.exitCode = 1;
  } finally {
    await stop(); fs.rmSync(dir, { recursive: true, force: true });
    report.completedAt = new Date().toISOString();
    report.node = process.version;
    const text = JSON.stringify(report, null, 2) + '\n';
    const i = process.argv.indexOf('--output');
    if (i >= 0) { if (!process.argv[i + 1]) throw new Error('--output requires a path'); const target = path.resolve(process.argv[i + 1]); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, text); }
    process.stdout.write(text);
  }
})();

