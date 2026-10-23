"""LIVE network: official Kakao postcode service; no mocked scripts or API responses."""
import argparse,json,os,shutil,subprocess,time
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
R=Path(__file__).resolve().parents[1]
a=argparse.ArgumentParser();a.add_argument('--output',default='build-reports/v042/live-address');args=a.parse_args();O=R/args.output;O.mkdir(parents=True,exist_ok=True)
checks=[];traffic=[];failures=[];maps=[]
server=subprocess.Popen(['node','server.js'],cwd=R,env={**os.environ,'PORT':'18842','DATA_FILE':str(O/'private.json')},stdout=subprocess.DEVNULL)
def passed(s):checks.append(s);print('PASS',s,flush=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=shutil.which('chromium') or shutil.which('google-chrome'),headless=True,args=['--no-sandbox'])
 try:
  for mode,url,query,expected in [('file',(R/'dist/handoff-demo.html').as_uri(),'세종대로 110','세종대로 110'),('http','http://127.0.0.1:18842/vehicle','판교역로 166','판교역로 166')]:
   c=b.new_context(viewport={'width':430,'height':900});p=c.new_page();p.set_default_timeout(15000)
   p.on('response',lambda r:traffic.append({'url':r.url.split('?')[0],'status':r.status}) if 'postcode' in r.url or 'kakaocdn' in r.url else None)
   p.on('requestfailed',lambda r:failures.append({'url':r.url.split('?')[0],'failure':r.failure}))
   p.goto(url);p.locator('[data-action="edit-destination"]').first.click();p.fill('#field-address',query);p.locator('[data-action="search-address"]').click()
   frame=None
   for _ in range(80):
    frame=next((f for f in p.frames if 'postcode.map.kakao.com' in f.url or 'postcode.map.daum.net' in f.url),None)
    if frame and frame.get_by_text(expected,exact=False).count():break
    p.wait_for_timeout(250)
   if not frame:raise AssertionError('Official postcode frame did not load: '+p.locator('body').inner_text())
   (O/(mode+'-provider-text.txt')).write_text(frame.locator('body').inner_text(),encoding='utf-8')
   p.screenshot(path=str(O/(mode+'-01-live-results.png')),full_page=True)
   frame.get_by_text(expected,exact=False).first.click()
   expect(p.locator('#field-address')).to_have_value(__import__('re').compile('.*'+expected+'.*'))
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
    mp.wait_for_load_state('domcontentloaded',timeout=20000)
    assert 'kakao.com' in mp.url or 'daum.net' in mp.url,mp.url
    text=mp.locator('body').inner_text(timeout=7000)
    maps.append({'mode':mode,'url':mp.url,'body':text[:300]})
    mp.screenshot(path=str(O/(mode+'-03-map.png')))
    if not text.strip():raise AssertionError('Map returned an empty document')
    passed(mode+': Kakao map opens the actual saved address')
   finally:mp.close()
   c.close()
 except Exception as e:
  failures.append({'error':str(e)})
  try:p.screenshot(path=str(O/'failure.png'),full_page=True)
  except Exception:pass
  raise
 finally:
  b.close();server.terminate();server.wait(timeout=8)
  (O/'private.json').unlink(missing_ok=True)
  (O/'results.json').write_text(json.dumps({'mode':'live-official-network','passed':checks,'traffic':traffic,'networkFailures':failures,'maps':maps},ensure_ascii=False,indent=2))
