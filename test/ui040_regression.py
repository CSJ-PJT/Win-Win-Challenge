"""Settings, mapping and mobile UI regression checks, without external API credentials."""
from pathlib import Path
import json,shutil,argparse
from playwright.sync_api import sync_playwright,expect
root=Path(__file__).resolve().parents[1]
a=argparse.ArgumentParser();a.add_argument('--output',default='build-reports/v040/settings');args=a.parse_args();out=root/args.output;out.mkdir(parents=True,exist_ok=True)
checks=[];events=[]
def passed(s):checks.append(s);print('PASS',s,flush=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=shutil.which('chromium'),headless=True,args=['--no-sandbox'])
 p=b.new_page(viewport={'width':375,'height':812});p.set_default_timeout(6000);p.on('pageerror',lambda e:events.append(str(e)))
 p.evaluate("""() => {for(const k of ['localStorage','sessionStorage']){const m=new Map();Object.defineProperty(window,k,{configurable:true,value:{getItem:a=>m.get(a)||null,setItem:(a,v)=>m.set(a,String(v)),removeItem:a=>m.delete(a)}})}}""")
 p.set_content((root/'dist/handoff-demo.html').read_text(),wait_until='load')
 def click(a):p.locator(f'[data-action="{a}"]').first.click()
 def state():return p.evaluate("JSON.parse(localStorage.getItem('ansim-synthetic-demo-v1'))")
 try:
  click('edit-destination')
  expect(p.locator('#field-address')).to_be_visible();assert p.locator('#field-subject').count()==0
  passed('quick destination editor asks only for destination details')
  p.fill('#field-address','서울 중구 세종대로 110');click('search-address')
  expect(p.locator('#lookupStatus')).to_contain_text('입력한 주소를 저장');assert p.locator('[data-search-link]').get_attribute('href').startswith('https://www.google.com/maps/')
  passed('no API key produces a useful search fallback instead of a dead button')
  p.locator('[data-search-link]').evaluate("el => el.addEventListener('click', ev=>ev.preventDefault())")
  p.locator('[data-search-link]').click();assert '%EC%84%B8%EC%A2%85%EB%8C%80%EB%A1%9C' in p.locator('[data-search-link]').get_attribute('href')
  passed('external map search includes the typed address')
  p.fill('#field-address','서울 중구 세종대로 110');
  p.evaluate("window.VehicleBridge={searchAddress:(q,id)=>window.onAddressResults(id,[{name:'시청 앞',address:'서울시 중구 세종대로 110',latitude:37.5663,longitude:126.9779}],''),openMap:u=>window.lastOpenedMap=u}")
  click('search-address');expect(p.locator('[data-action="choose-address"]')).to_be_visible();click('choose-address')
  assert p.locator('#field-address').input_value()=='서울시 중구 세종대로 110';p.locator('#visitForm button[type="submit"]').click()
  s=state();assert s['info']['latitude']==37.5663 and s['info']['longitude']==126.9779
  passed('real geocoder response is selectable and saves correct coordinates')
  click('open-editor');p.locator('#mapProvider').select_option('kakao');p.locator('#visitForm button[type="submit"]').click()
  p.locator('[data-map-link]').first.click();assert '/link/to/' in p.evaluate('window.lastOpenedMap')
  passed('Kakao map opens actual routing only when coordinates exist')
  click('open-editor');p.fill('#field-address','서울 강남구 테헤란로 1');p.locator('#visitForm button[type="submit"]').click()
  assert state()['info']['latitude'] is None
  p.locator('[data-map-link]').first.click();assert 'www.google.com/maps/dir/' in p.evaluate('window.lastOpenedMap')
  passed('changing the address invalidates old coordinates and uses real directions fallback')
  click('open-editor');p.fill('#field-senderPhone','*123#');p.locator('#visitForm button[type="submit"]').click()
  expect(p.locator('#editorError')).to_be_visible();assert p.locator('#field-address').input_value()=='서울 강남구 테헤란로 1'
  passed('invalid phone is rejected while preserving all form fields')
  p.fill('#field-senderPhone','010-1111-2222');p.fill('#field-facilityPhone','02-333-4444');p.locator('#textSize').select_option('200');p.locator('#visitForm button[type="submit"]').click()
  assert state()['info']['senderPhone']=='01011112222';assert state()['info']['facilityPhone']=='023334444'
  p.set_viewport_size({'width':320,'height':740});assert p.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
  click('open-editor');assert p.evaluate('document.documentElement.scrollWidth<=innerWidth+1');p.screenshot(path=str(out/'01-large-settings.png'),full_page=True)
  passed('200 percent text at 320 px has no horizontal overflow and stores phone edits')
  click('close');p.locator('.demo-role-tab[data-role="facility"]').click();click('open-editor')
  assert p.locator('#field-subject').count()==0;assert p.locator('#field-facility').count()==1
  passed('facility cannot edit private person and guardian fields')
  click('close');assert not events,events;passed('no JavaScript errors')
 except Exception:
  p.screenshot(path=str(out/'failure.png'),full_page=True);raise
 finally:
  (out/'results.json').write_text(json.dumps({'checks':checks,'errors':events},ensure_ascii=False,indent=2),'utf8');b.close()