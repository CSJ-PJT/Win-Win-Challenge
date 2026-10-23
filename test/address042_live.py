"""LIVE official network. No mocked scripts, coordinates or provider responses."""
import argparse,json,os,shutil,subprocess,time,re
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
R=Path(__file__).resolve().parents[1]
a=argparse.ArgumentParser();a.add_argument('--output',default='build-reports/v042/live-address');args=a.parse_args();O=R/args.output;O.mkdir(parents=True,exist_ok=True)
checks=[];traffic=[];failures=[];maps=[]
servers=[subprocess.Popen(['node','server.js'],cwd=R,env={**os.environ,'PORT':'18842','DATA_FILE':str(O/'private.json')},stdout=subprocess.DEVNULL),subprocess.Popen(['node','tools/serve-demo.cjs'],cwd=R,env={**os.environ,'PORT':'18843','ANSIM_NO_OPEN':'1'},stdout=subprocess.DEVNULL)]
def passed(s):checks.append(s);print('PASS',s,flush=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=shutil.which('chromium') or shutil.which('google-chrome'),headless=True,args=['--no-sandbox'])
 try:
  for mode,url,query,expected in [('pc-launcher','http://127.0.0.1:18843/','세종대로 110','세종대로 110'),('http-server','http://127.0.0.1:18842/vehicle','판교역로 166','판교역로 166')]:
   c=b.new_context(viewport={'width':430,'height':900});p=c.new_page();p.set_default_timeout(15000)
   p.on('response',lambda r:traffic.append({'url':r.url.split('?')[0],'status':r.status}) if 'postcode' in r.url or 'kakaocdn' in r.url else None)
   p.on('requestfailed',lambda r:failures.append({'url':r.url.split('?')[0],'failure':r.failure}))
   p.goto(url);p.locator('[data-action="edit-destination"]').first.click();p.fill('#field-address',query);p.locator('[data-action="search-address"]').click()
   frame=None;result=None
   for _ in range(80):
    frame=next((f for f in p.frames if 'postcode.map.kakao.com' in f.url or 'postcode.map.daum.net' in f.url),None)
    if frame:
     result=frame.locator('button.link_post:has(.txt_addr)').filter(has_text=expected).first
     if result.count() and result.is_visible():break
    p.wait_for_timeout(250)
   if not frame or result is None:raise AssertionError('Official postcode frame did not load: '+p.locator('body').inner_text())
   (O/(mode+'-provider-text.txt')).write_text(frame.locator('body').inner_text(),encoding='utf-8')
   p.screenshot(path=str(O/(mode+'-01-live-results.png')),full_page=True)
   result.click()
   expect(p.locator('#field-address')).to_have_value(re.compile('.*'+expected+'.*'))
   expect(p.locator('.postcode-tag')).to_be_visible()
   selected=p.locator('#field-address').input_value();p.fill('#field-detailAddress','정문')
   p.locator('#visitForm button[type=submit]').click();expect(p.locator('.dialog')).to_have_count(0)
   expect(p.locator('.address')).to_contain_text(expected);passed(mode+': real search result selected, address and postcode returned and saved')
   p.reload();expect(p.locator('.address')).to_contain_text(expected);passed(mode+': saved live result survives reload')
   p.screenshot(path=str(O/(mode+'-02-selected.png')),full_page=True)
   link=p.locator('[data-map-link]').first
   assert 'map.kakao.com/link/search/' in link.get_attribute('href')
   with p.expect_popup() as opened:link.click()
   mp=opened.value
   try:
    mp.wait_for_url(re.compile(r'^https://[^/]*(?:kakao\.com|daum\.net)/'),timeout=25000,wait_until='domcontentloaded')
    expect(mp.locator('body')).to_contain_text(expected,timeout=20000)
    text=mp.locator('body').inner_text(timeout=7000)
    maps.append({'mode':mode,'url':mp.url,'body':text[:800],'selectedAddress':selected})
    mp.screenshot(path=str(O/(mode+'-03-map.png')),timeout=10000)
    passed(mode+': Kakao map displays the actual saved address')
   except Exception:
    try:mp.screenshot(path=str(O/(mode+'-map-failure.png')),timeout=5000)
    except Exception:pass
    raise
   finally:mp.close()
   c.close()
  c=b.new_context();p=c.new_page();p.goto((R/'dist/handoff-demo.html').as_uri())
  p.locator('[data-action="edit-destination"]').first.click();p.locator('[data-action="search-address"]').click()
  expect(p.get_by_text(re.compile('주소 검색은 PC 실행'))).to_be_visible();passed('direct file opening shows the supported launcher rather than an unusable search result');c.close()
 except Exception as e:
  failures.append({'error':str(e)})
  try:p.screenshot(path=str(O/'failure.png'),full_page=True)
  except Exception:pass
  raise
 finally:
  b.close()
  for server in servers:server.terminate();server.wait(timeout=8)
  (O/'private.json').unlink(missing_ok=True)
  (O/'results.json').write_text(json.dumps({'mode':'live-official-network','passed':checks,'traffic':traffic,'networkFailures':failures,'maps':maps},ensure_ascii=False,indent=2))
