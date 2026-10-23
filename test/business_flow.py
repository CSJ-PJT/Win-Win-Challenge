"""Role-specific visit configuration, mapping and end-to-end handoff regression."""
import argparse, json, os, shutil, subprocess, time
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
R=Path(__file__).resolve().parents[1]
a=argparse.ArgumentParser();a.add_argument('--fixture',action='store_true');a.add_argument('--output',default='build-reports/v030/browser');args=a.parse_args();O=Path(args.output);O.mkdir(parents=True,exist_ok=True)
results=[];errors=[];server=None
STORAGE="""values => {for(const name of ['localStorage','sessionStorage']){const m=new Map(Object.entries(values[name]||{}));Object.defineProperty(window,name,{value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)},configurable:true})}}"""
if not args.fixture:
 env={**os.environ,'PORT':'8139','DATA_FILE':str(O/'private-state.json')};server=subprocess.Popen(['node','server.js'],cwd=R,env=env,stdout=subprocess.DEVNULL);time.sleep(.4)
def passed(s):results.append(s);print('PASS',s,flush=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=shutil.which('chromium') or shutil.which('google-chrome'),headless=True,args=['--no-sandbox'])
 c=b.new_context(viewport={'width':390,'height':844})
 def page_new(values=None):
  p=c.new_page();p.set_default_timeout(7000);p.on('pageerror',lambda e:errors.append(str(e)))
  if args.fixture:p.evaluate(STORAGE,values or {});p.set_content((R/'dist/handoff-demo.html').read_text())
  else:p.goto('http://127.0.0.1:8139/')
  return p
 p=page_new()
 def click(a):
  el=p.locator('.modal [data-action="'+a+'"]');(el if el.count() else p.locator('[data-action="'+a+'"]').first).click()
 def role(r):
  if p.locator('.modal').count():click('close-panel')
  click('demo');p.locator('.modal [data-action="role"][data-role="'+r+'"]').click()
 def state():
  if args.fixture:return p.evaluate("JSON.parse(localStorage.getItem('ansim-synthetic-demo-v1'))")
  return p.evaluate("async()=>{const d=await(await fetch('/api/bootstrap')).json();return(await(await fetch('/api/state',{headers:{Authorization:'Bearer '+d.tokens.vehicle}})).json()).state}")
 def shot(n):p.screenshot(path=str(O/(n+'.png')),full_page=True)
 try:
  expect(p.locator('[data-action="choose-role"][data-role="vehicle"]')).to_be_visible()
  p.locator('[data-action="choose-role"][data-role="vehicle"]').click()
  assert p.locator('.role-tabs').count()==0;expect(p.locator('.progress')).to_be_visible()
  passed('chosen role persists; normal screen has no role-switch tabs');shot('01-user')
  click('depart');expect(p.locator('#field-address')).to_be_visible();assert state()['state']=='PLANNED'
  passed('departure without a destination opens address setup rather than fake routing')
  p.fill('#field-address','서울특별시 중구 세종대로 110')
  p.evaluate("window.VehicleBridge={searchAddress:(q,id)=>{window.lastQuery=q;window.onAddressResults(id,[{name:'서울시청',address:'서울특별시 중구 세종대로 110',latitude:37.5663,longitude:126.9779}],'')},openMap:u=>window.lastMap=u}")
  click('search-address');expect(p.locator('[data-action="select-address"]')).to_be_visible();click('select-address');shot('02-address')
  # Close without saving to test cancellation and new drafts.
  click('close-panel');assert state()['info']['address']==''
  passed('address results are selectable and cancellation does not persist them')
  click('settings');p.fill('#field-subject','이용자 테스트');p.fill('#field-senderName','인계자 테스트');p.fill('#field-senderPhone','010-1234-5678');p.fill('#field-guardianName','보호자 테스트');p.fill('#field-guardianPhone','010-8765-4321');p.fill('#field-facilityPhone','02-123-4567');p.fill('#field-supportNote','정문에서 만나기');p.select_option('#mapProvider','google');click('save-settings');expect(p.locator('.modal')).to_have_count(0)
  s=state();assert s['info']['subject']=='이용자 테스트' and s['info']['senderPhone']=='01012345678'
  passed('subject, handoff contact, guardian contact, facility phone and support request save')
  click('navigate');p.fill('#field-address','서울특별시 중구 세종대로 110');click('search-address');click('select-address');click('save-destination');click('navigate')
  url=p.evaluate('window.lastMap');assert 'google.com/maps/dir/' in url and '37.5663' in url and '01012345678' not in url and '이용자' not in url
  passed('saved destination is passed to mapping without personal names or phone numbers')
  click('phone');expect(p.locator('.phone-number')).to_have_text('021234567');click('close-panel')
  passed('saved facility phone is used by the main contact action')
  click('settings');p.locator('[data-size="200"]').click();p.set_viewport_size({'width':320,'height':740});assert p.evaluate('document.documentElement.scrollWidth<=innerWidth+1');shot('03-settings-large');p.locator('[data-size="100"]').click();click('close-panel');p.set_viewport_size({'width':390,'height':844})
  passed('settings remain usable at 320px width and 200 percent text')
  click('depart');click('arrive');click('issue');code=state()['challenge']['code'];click('sender');assert state()['senderConfirmed'] and state()['state']=='VERIFYING'
  passed('sender action changes only sender confirmation, not completion')
  role('guardian');expect(p.locator('.checklist')).to_contain_text('확인됨');assert p.locator('[data-action="sender"]').count()==0
  passed('guardian can inspect the whole process but cannot confirm on behalf of the sender')
  role('facility');assert p.locator('.progress').count()==0 and p.locator('.history').count()==0 and p.locator('[data-action="depart"]').count()==0 and p.locator('[data-action="sender"]').count()==0 and p.locator('[data-action="visit-picker"]').count()==0
  shot('04-facility');passed('facility sees its reception task without driving controls or full journey history')
  # Verify handler protection, not just visibility.
  p.evaluate("document.body.insertAdjacentHTML('beforeend','<button id=\"forged\" data-action=\"sender\">forged</button>')");before=state()['version'];p.locator('#forged').click();assert state()['version']==before;p.locator('#forged').evaluate('(e)=>e.remove()')
  passed('injected foreign-role action is rejected by the UI capability guard')
  click('settings');assert p.locator('#field-subject').count()==0;expect(p.locator('#field-facility')).to_be_disabled();click('close-panel')
  passed('facility settings exclude visitor identity and lock an already started visit')
  p.fill('#codeInput','000000' if code!='000000' else '111111');click('receiver');expect(p.locator('#inlineError')).to_contain_text('연결번호가 맞지');assert not state()['receiverConfirmed']
  p.fill('#codeInput',code);click('receiver');assert state()['state']=='COMPLETED';shot('05-received')
  passed('incorrect code fails and correct facility confirmation completes the handoff')
  role('vehicle');click('restart');expect(p.locator('[data-action="depart"]')).to_have_text('이 목적지로 출발하기');expect(p.locator('[data-action="depart"]')).to_be_enabled();assert state()['info']['address']=='서울특별시 중구 세종대로 110';assert state()['info']['senderPhone']=='01012345678'
  passed('next visit restores the configured destination and contacts')
  click('settings');click('destination');p.fill('#field-address','서울 종로구 세종대로 175');click('save-destination');expect(p.locator('.modal')).to_have_count(0);assert state()['info']['latitude'] is None and state()['info']['longitude'] is None
  passed('editing an address clears stale coordinates')
  click('settings');p.fill('#field-facilityPhone','*123#');click('save-settings');expect(p.locator('#settingsError')).to_contain_text('전화번호');assert state()['info']['facilityPhone']=='021234567';click('close-panel')
  passed('invalid telephone input cannot overwrite a saved contact')
  click('mode-easy');click('start-easy-demo');click('consent-yes');click('easy-arrive');click('easy-send');assert state()['arrivalNotice'] and not state()['senderConfirmed'];shot('06-easy')
  role('facility');click('ack');assert state()['arrivalNotice']['acknowledgedAt'];assert state()['state']=='PLANNED'
  passed('easy arrival and facility read confirmation remain separate from handoff')
  if not args.fixture:
   # Distinct browser profile: receiver page has no driver's UI state.
   other=b.new_context(viewport={'width':390,'height':844});q=other.new_page();q.goto('http://127.0.0.1:8139/visitor');expect(q.locator('.receipt-card')).to_be_visible();expect(q.locator('.read-status')).to_contain_text('읽었어요');assert q.locator('#codeInput').count()==0;other.close();passed('independent browser role observes server-side read confirmation')
  assert not errors,errors;passed('no uncaught JavaScript errors')
 except Exception as e:
  results.append('FAIL: '+str(e));shot('failure');raise
 finally:
  (O/'results.json').write_text(json.dumps({'mode':'fixture' if args.fixture else 'HTTP','passed':len([x for x in results if not x.startswith('FAIL')]),'cases':results,'errors':errors},ensure_ascii=False,indent=2));b.close()
  if server:server.terminate();server.wait(timeout=10)
