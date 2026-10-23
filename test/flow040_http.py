"""Real local HTTP server + three independent role views, exercised with Chromium."""
import argparse, json, os, shutil, subprocess, time, urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
R=Path(__file__).resolve().parents[1]
a=argparse.ArgumentParser();a.add_argument('--output',default='build-reports/v040/http');args=a.parse_args();out=R/args.output;out.mkdir(parents=True,exist_ok=True)
PORT=18744;env={**os.environ,'PORT':str(PORT),'DATA_FILE':str(out/'server-private.json')}
proc=subprocess.Popen(['node','server.js'],cwd=R,env=env,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
base=f'http://127.0.0.1:{PORT}'
checks=[];errors=[]
def api(path,token=None):
 r=urllib.request.Request(base+path,headers={'Authorization':'Bearer '+token} if token else {})
 return json.load(urllib.request.urlopen(r,timeout=7))
def passed(s):checks.append(s);print('PASS',s,flush=True)
try:
 for _ in range(40):
  try:boot=api('/api/bootstrap');break
  except Exception:time.sleep(.2)
 else:raise AssertionError('HTTP service could not start')
 assert 'vehicle' in boot['tokens']
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=shutil.which('chromium'),headless=True,args=['--no-sandbox'])
  ctx=browser.new_context(viewport={'width':390,'height':844})
  v=ctx.new_page();v.set_default_timeout(10000);v.on('pageerror',lambda e:errors.append(str(e)))
  v.goto(base+'/vehicle');expect(v.get_by_role('button',name='도착지 입력하기')).to_be_visible()
  v.get_by_role('button',name='도착지 입력하기').click()
  v.fill('#field-address','서울특별시 중구 세종대로 110');v.locator('#visitForm button[type="submit"]').click()
  expect(v.get_by_role('button',name='방문 시작하기')).to_be_enabled()
  v.reload();expect(v.get_by_text('서울특별시 중구 세종대로 110')).to_be_visible()
  passed('HTTP server saves configured destination across a browser reload')
  v.locator('[data-action="depart"]').click();expect(v.get_by_role('button',name='도착했어요')).to_be_enabled()
  passed('vehicle departure works through the real API')
  f=ctx.new_page();f.set_default_timeout(10000);f.on('pageerror',lambda e:errors.append(str(e)));f.goto(base+'/facility')
  expect(f.get_by_text('맞이할 준비가 됐어요.')).to_be_visible();passed('independent facility page opens only reception actions')
  v.locator('[data-action="arrive"]').click();v.locator('[data-action="issue"]').click()
  code=api('/api/state',boot['tokens']['vehicle'])['state']['challenge']['code']
  v.locator('[data-action="sender"]').click()
  expect(f.get_by_text('연결번호 6자리')).to_be_visible(timeout=10000)
  f.fill('#codeInput','000000' if code!='000000' else '111111');f.locator('[data-action="receiver"]').click();expect(f.locator('#inlineError')).to_be_visible()
  passed('facility rejects wrong codes through HTTP service')
  f.fill('#codeInput',code);f.locator('[data-action="receiver"]').click()
  expect(f.get_by_text('인수를 완료했어요')).to_be_visible();passed('independent actor confirmation completes via HTTP')
  g=ctx.new_page();g.goto(base+'/guardian');expect(g.get_by_text('인계를 마쳤어요')).to_be_visible()
  assert g.locator('[data-action="sender"]').count()==0;passed('read-only guardian page shows the completed status')
  assert not errors,errors;passed('no client-side JavaScript exceptions')
  v.screenshot(path=str(out/'vehicle.png'),full_page=True)
  f.screenshot(path=str(out/'facility.png'),full_page=True)
  browser.close()
finally:
 try:proc.terminate();proc.wait(timeout=8)
 except Exception:proc.kill()
 (out/'results.json').write_text(json.dumps({'passed':checks,'errors':errors},ensure_ascii=False,indent=2),'utf-8')
 try:(out/'server-private.json').unlink()
 except FileNotFoundError:pass
