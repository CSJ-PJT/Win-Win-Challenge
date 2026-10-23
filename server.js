'use strict';
/** Local-only contest demonstration server. Not a production identity provider. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const H = require('./web/core');
const WEB = path.join(__dirname, 'web');
const ROLES = { vehicle: 'sender-001', facility: 'staff-001', guardian: 'observer-001', visitor: 'visitor-001', simulator: 'demo-controller' };
function createApp(options = {}) {
  const dataFile = options.dataFile || path.join(__dirname, '.data', 'demo.json');
  const now = options.clock || Date.now;
  let record;
  const fresh = scenario => ({ state: H.createTrip(scenario, now(), crypto.randomUUID()), tokens: Object.fromEntries(Object.keys(ROLES).map(r => [r, crypto.randomBytes(24).toString('hex')])), receipts: {} });
  if (fs.existsSync(dataFile)) {
    record = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    if (record.state?.schema !== 1 || !record.tokens || !record.receipts) throw new Error('Unsupported or damaged demo store; preserve it and choose another DATA_FILE.');
  } else record = fresh('kindergarten');
  function persist(next) {
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    const temp = dataFile + '.tmp';
    const fd = fs.openSync(temp, 'w', 0o600);
    try { fs.writeFileSync(fd, JSON.stringify(next)); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
    fs.renameSync(temp, dataFile); record = next;
  }
  // Preserve existing synthetic visits when upgrading from 0.1.x.
  if (!record.tokens.visitor) {
    persist({ ...record, tokens: { ...record.tokens, visitor: crypto.randomBytes(24).toString('hex') } });
  }
  function json(res, status, obj) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(JSON.stringify(obj));
  }
  function actor(req) {
    const token = (req.headers.authorization || '').replace(/^Bearer /, '');
    const role = Object.keys(record.tokens).find(r => record.tokens[r] === token);
    if (!role) throw new H.DomainError('UNAUTHORIZED', '시연 역할 세션을 다시 연결해 주세요.', 401);
    return { role, id: ROLES[role] };
  }
  async function body(req) {
    let raw = '';
    for await (const chunk of req) {
      raw += chunk;
      if (Buffer.byteLength(raw) > 8192) throw new H.DomainError('SIZE', '요청이 너무 큽니다.', 413);
    }
    try { return JSON.parse(raw); } catch { throw new H.DomainError('JSON', 'JSON 요청이 필요합니다.', 400); }
  }
  const server = http.createServer(async (req, res) => {
    try {
      const host = req.headers.host || '';
      if (!/^(127\.0\.0\.1|localhost|\[::1\])(?::\d+)?$/.test(host)) return json(res, 403, { error: 'LOCAL_ONLY' });
      const url = new URL(req.url, 'http://' + host);
      if (req.headers.origin && req.headers.origin !== 'http://' + host) return json(res, 403, { error: 'ORIGIN' });
      if (req.method === 'GET' && url.pathname === '/api/health') return json(res, 200, { status: 'ok', mode: 'LOCAL_SYNTHETIC_DEMO', version: H.VERSION });
      if (req.method === 'GET' && url.pathname === '/api/bootstrap') {
        // Local synthetic-data demo only; this is NOT real-person authentication.
        return json(res, 200, { demo: true, tokens: record.tokens, tripId: record.state.id, version: H.VERSION });
      }
      if (req.method === 'GET' && url.pathname === '/api/state') {
        const a = actor(req); return json(res, 200, { state: H.project(record.state, a.role), serverNow: now() });
      }
      if (req.method === 'POST' && url.pathname === '/api/reset') {
        const a = actor(req); if (a.role !== 'simulator') throw new H.DomainError('FORBIDDEN', '시연 제어 권한이 필요합니다.', 403);
        const p = await body(req); const next = fresh(p.scenario || 'kindergarten'); persist(next);
        return json(res, 200, { reset: true });
      }
      if (req.method === 'POST' && url.pathname === '/api/events') {
        const a = actor(req), p = await body(req);
        if (typeof p.key !== 'string' || !/^[A-Za-z0-9-]{8,80}$/.test(p.key)) throw new H.DomainError('KEY', '요청 식별자가 필요합니다.', 400);
        if (p.tripId !== record.state.id) throw new H.DomainError('TRIP', '다른 이동 건의 요청입니다.', 409);
        const fingerprint = crypto.createHash('sha256').update(JSON.stringify({ tripId: p.tripId, event: p.event })).digest('hex');
        const receiptKey = a.role + ':' + p.key;
        const previous = record.receipts[receiptKey];
        if (previous) {
          if (previous.fingerprint !== fingerprint) throw new H.DomainError('KEY_REUSE', '같은 요청 식별자를 다른 작업에 사용할 수 없습니다.', 409);
          return json(res, previous.status, { ...previous.response, replayed: true });
        }
        if (p.expectedVersion !== record.state.version) throw new H.DomainError('VERSION', '다른 화면에서 상태가 변경되었습니다. 최신 상태를 확인하고 다시 눌러 주세요.', 409);
        const result = H.apply(record.state, p.event, a, { now: now(), code: String(crypto.randomInt(0, 1000000)).padStart(6, '0') });
        const status = result.rejected ? 409 : 200;
        const response = { state: H.project(result.state, a.role), error: result.rejected?.code, message: result.rejected?.message, serverNow: now() };
        const receipts = { ...record.receipts, [receiptKey]: { fingerprint, status, response } };
        const keys = Object.keys(receipts); if (keys.length > 1000) delete receipts[keys[0]];
        persist({ ...record, state: result.state, receipts });
        return json(res, status, response);
      }
      if (url.pathname.startsWith('/api/')) return json(res, 404, { error: 'NOT_FOUND' });
      if (!['GET', 'HEAD'].includes(req.method)) return json(res, 405, { error: 'METHOD' });
      const names = { '/': 'index.html', '/index.html': 'index.html', '/vehicle': 'index.html', '/facility': 'index.html', '/guardian': 'index.html', '/visitor': 'index.html', '/style.css': 'style.css', '/core.js': 'core.js', '/app.js': 'app.js', '/ui.js': 'ui.js' };
      const filename = names[url.pathname];
      if (!filename) return json(res, 404, { error: 'NOT_FOUND' });
      const contents = fs.readFileSync(path.join(WEB, filename));
      const type = filename.endsWith('.js') ? 'text/javascript' : filename.endsWith('.css') ? 'text/css' : 'text/html';
      res.writeHead(200, { 'Content-Type': type + '; charset=utf-8', 'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'", 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Cache-Control': 'no-store' });
      res.end(req.method === 'HEAD' ? undefined : contents);
    } catch (e) {
      if (!(e instanceof H.DomainError)) console.error('Request failed:', e.message);
      json(res, e.status || 500, { error: e.code || 'INTERNAL', message: e.status ? e.message : '저장 또는 처리에 실패했습니다. 완료로 처리하지 않았습니다.' });
    }
  });
  return server;
}
if (require.main === module) {
  const port = Number(process.env.PORT || 8080);
  const app = createApp({ dataFile: process.env.DATA_FILE });
  app.listen(port, '127.0.0.1', () => console.log(`안심동행 로컬 합성 데이터 시연: http://127.0.0.1:${port}\n실제 개인정보를 입력하거나 인터넷에 공개하지 마세요.`));
}
module.exports = { createApp };
