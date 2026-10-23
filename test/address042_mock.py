"""Deterministic UI regressions with a mocked postcode SDK; live tests are separate."""
import json,shutil,argparse
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
R=Path(__file__).resolve().parents[1]
a=argparse.ArgumentParser();a.add_argument('--fixture',action='store_true');a.add_argument('--output',default='build-reports/v042/address-ui');args=a.parse_args();O=R/args.output;O.mkdir(parents=True,exist_ok=True)
checks=[];errors=[]
INIT="""() => {for(const k of ['localStorage','sessionStorage']){let m={};Object.defineProperty(window,k,{configurable:true,value:{getItem:key=>m[key]??null,setItem:(key,v)=>m[key]=String(v),removeItem:key=>delete m[key]}})}}"""
SDK="""window.kakao={Postcode:function(options){window.pickerOptions=options;this.embed=function(el,args){window.pickerQuery=args.q;el.innerHTML='<button id="sdkChoose">도로명 주소 선택</button>';options.onresize({width:350,height:450});el.querySelector('button').onclick=()=>options.oncomplete({userSelectedType:'R',roadAddress:'서울 중구 세종대로 110',jibunAddress:'서울 중구 태평로1가 31',zonecode:'04524',buildingName:'서울특별시청'});}}};"""
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=shutil.which('chromium') or shutil.which('google-chrome'),headless=True,args=['--no-sandbox']);c=b.new_context(viewport={'width':390,'height':844});p=c.new_page();p.set_default_timeout(6000);p.on('pageerror',lambda e:errors.append(str(e)))
 p.route('https://t1.kakaocdn.net/**',lambda r:r.fulfill(status=200,content_type='text/javascript',body=SDK))
 def passed(s):checks.append(s);print('PASS',s,flush=True)
 def click(action):p.locator(f'[data-action="{action}"]').first.click()
 def state():return p.evaluate("JSON.parse(localStorage.getItem('ansim-synthetic-demo-v1'))")
 try:
  if args.fixture:p.evaluate(INIT);p.set_content((R/'dist/handoff-demo.html').read_text());p.evaluate(SDK)
  else:p.goto((R/'dist/handoff-demo.html').as_uri())
  click('open-editor')
  p.fill('#field-senderName','입력 유지');p.fill('#field-senderPhone','01012345678');p.fill('#field-supportNote','정문에서 만나요');p.select_option('#mapProvider','google');p.select_option('#textSize','125')
  click('search-address');expect(p.locator('#sdkChoose')).to_be_visible();passed('search opens inside the app even when no address was entered')
  p.wait_for_timeout(2300);click('back-address');expect(p.locator('#field-senderName')).to_have_value('입력 유지');expect(p.locator('#mapProvider')).to_have_value('google');expect(p.locator('#textSize')).to_have_value('125');passed('cancel preserves unsaved contact, request, map and font preferences')
  click('search-address');p.locator('#sdkChoose').click();expect(p.locator('#field-address')).to_have_value('서울 중구 세종대로 110');expect(p.locator('#field-supportNote')).to_have_value('정문에서 만나요');assert state()['info']['address']=='';passed('selected result populates the draft but does not silently save')
  p.fill('#field-detailAddress','1층 정문');p.select_option('#mapProvider','kakao');p.locator('#visitForm button[type=submit]').click();expect(p.locator('.dialog')).to_have_count(0);assert state()['info']['postcode']=='04524';assert state()['info']['detailAddress']=='1층 정문';expect(p.locator('.prepared-address')).to_contain_text('서울 중구 세종대로 110');expect(p.locator('.prepared-address')).to_contain_text('1층 정문');passed('postcode, detail address and pre-existing contacts persist together and appear before departure')
  link=p.locator('[data-map-link]').first;assert '/link/search/' in link.get_attribute('href');expect(link).to_contain_text('위치 보기');passed('address-only Kakao link is labelled accurately and uses the selected map')
  if not args.fixture:p.reload()
  expect(p.locator('.address')).to_contain_text('세종대로 110');expect(p.locator('.postcode-tag')).to_contain_text('04524');passed('saved address restores after reload' if not args.fixture else 'saved address is reflected in rendered state')
  click('open-editor');p.fill('#field-address','서울 종로구 세종대로 175');p.locator('#visitForm button[type=submit]').click();assert state()['info']['postcode']=='';assert state()['info']['latitude'] is None;passed('editing an address discards the previous postcode and coordinates')
  click('open-editor');p.select_option('#textSize','200');p.locator('#visitForm button[type=submit]').click();p.set_viewport_size({'width':320,'height':740});click('open-editor');click('search-address');assert p.evaluate('document.documentElement.scrollWidth<=innerWidth+1');p.screenshot(path=str(O/'address-320.png'));click('back-address');click('close');passed('embedded address sheet remains usable with enlarged text on narrow screens')
  # Start a genuinely blocked network load in a fresh page to verify failure recovery.
  c2=b.new_context(viewport={'width':390,'height':844});q=c2.new_page();q.route('https://t1.kakaocdn.net/**',lambda r:r.abort());
  if args.fixture:q.evaluate(INIT);q.set_content((R/'dist/handoff-demo.html').read_text())
  else:q.goto((R/'dist/handoff-demo.html').as_uri())
  q.locator('[data-action="edit-destination"]').first.click();q.fill('#field-address','지우면 안 되는 주소');q.locator('[data-action="search-address"]').click();expect(q.locator('#addressRetry')).to_be_visible();q.locator('[data-action="back-address"]').click();expect(q.locator('#field-address')).to_have_value('지우면 안 되는 주소');passed('offline SDK failure offers retry and returns to the unchanged draft');c2.close()
  assert not errors,errors;passed('no application JavaScript errors')
 except Exception:
  p.screenshot(path=str(O/'failure.png'),full_page=True);raise
 finally:
  (O/'results.json').write_text(json.dumps({'type':'mocked-sdk-regression','passed':checks,'errors':errors},ensure_ascii=False,indent=2));b.close()
