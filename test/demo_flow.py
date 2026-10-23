"""End-to-end demonstration using only visible controls, not the demo settings panel."""
import argparse, json, shutil, threading, functools, http.server
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
R=Path(__file__).resolve().parents[1]
a=argparse.ArgumentParser();a.add_argument('--fixture',action='store_true');a.add_argument('--output',default='build-reports/v021/direct-flow');args=a.parse_args()
O=Path(args.output);O.mkdir(parents=True,exist_ok=True)
results=[];errors=[];api_requests=[]
server=None
if not args.fixture:
    class Handler(http.server.SimpleHTTPRequestHandler):
        def log_message(self,*_):pass
    server=http.server.ThreadingHTTPServer(('127.0.0.1',8140),functools.partial(Handler,directory=str(R/'dist')))
    threading.Thread(target=server.serve_forever,daemon=True).start()
def passed(s):results.append(s);print('PASS',s,flush=True)
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path=shutil.which('chromium') or shutil.which('google-chrome'),headless=True,args=['--no-sandbox'])
    c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=1)
    p=c.new_page();p.set_default_timeout(6000);p.on('pageerror',lambda e:errors.append(str(e)))
    p.on('request',lambda r:api_requests.append(r.url) if '/api/' in r.url else None)
    def click(action):p.locator('[data-action="'+action+'"]').first.click()
    def state():return p.evaluate("JSON.parse(localStorage.getItem('ansim-synthetic-demo-v1'))")
    def save(name):p.screenshot(path=str(O/(name+'.png')),full_page=True)
    def role(name):p.locator('.role-tabs [data-role="'+name+'"]').click()
    def next_visit(name):click('visit-picker');p.locator('[data-action="select-visit"][data-scenario="'+name+'"]').click();expect(p.locator('.modal')).to_have_count(0)
    try:
        if args.fixture:
            p.evaluate("""() => {for(const name of ['localStorage','sessionStorage']){const m=new Map();Object.defineProperty(window,name,{value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)},configurable:true})}}""")
            p.set_content((R/'dist/handoff-demo.html').read_text())
        else:p.goto('http://127.0.0.1:8140/handoff-demo.html')
        expect(p.locator('[data-action="depart"]')).to_be_enabled()
        assert p.evaluate('window.ANSIM_STANDALONE') is True
        assert not api_requests,api_requests
        passed('standalone startup is enabled without a server, setup menu, or API request')
        text=p.locator('body').inner_text()
        assert '체험용 가상 방문' not in text and '실제 시설로 전송되지 않아요' not in text
        assert '체험 기록' not in text
        passed('repetitive demonstration disclaimers are absent')
        save('01-start')
        click('depart');click('arrive');click('issue');click('sender')
        assert state()['senderConfirmed'] and not state()['receiverConfirmed'] and state()['state']=='VERIFYING'
        passed('vehicle handoff remains incomplete until the facility confirms')
        click('show-facility');click('receiver')
        expect(p.locator('#inlineError')).to_contain_text('6자리');assert state()['receiverConfirmed'] is False
        passed('empty verification number gives a usable validation message')
        click('load-code');assert len(p.locator('#codeInput').input_value())==6
        save('02-facility');click('receiver');assert state()['state']=='COMPLETED'
        click('show-guardian');expect(p.locator('h1')).to_contain_text('양쪽 확인')
        save('03-complete');passed('complete handoff uses visible next-step buttons only')
        click('restart');expect(p.locator('[data-action="depart"]')).to_be_enabled();assert state()['state']=='PLANNED'
        passed('restart restores an immediately usable departure')
        click('mode-easy');click('start-easy-demo');click('consent-yes');save('04-easy')
        click('easy-arrive');click('easy-send');expect(p.locator('.receipt-card')).to_be_visible()
        assert state()['state']=='PLANNED' and not state()['senderConfirmed']
        click('show-facility');click('ack');click('mode-easy')
        expect(p.locator('.read-status')).to_contain_text('읽었어요');passed('easy arrival and facility read confirmation work without hidden controls')
        click('phone');expect(p.locator('#contactPhone')).to_be_visible()
        p.evaluate("window.VehicleBridge={openDialer:n=>window.dialedNumber=n}")
        p.fill('#contactPhone','010-0000-0000');click('save-contact')
        assert p.evaluate('window.dialedNumber')=='01000000000';passed('contact can be saved and passed to the dialer from the contact screen')
        click('close-panel');click('settings');p.locator('[data-size="200"]').click();click('close-panel');p.set_viewport_size({'width':320,'height':740})
        assert p.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
        save('05-large-text');passed('320px screen with 200 percent text remains within the viewport')
        click('settings');p.locator('[data-size="100"]').click();click('close-panel');p.set_viewport_size({'width':390,'height':844})
        next_visit('community');click('consent-yes');click('easy-arrive');click('easy-send');click('show-facility');click('ack')
        assert state()['info']['mode']=='ARRIVAL_ONLY' and not state()['senderConfirmed']
        passed('community visit has arrival/read actions, not a fabricated handoff')
        next_visit('daycare');expect(p.locator('[data-action="depart"]')).to_be_enabled();passed('daycare scenario is also ready on selection')
        click('demo');p.locator('.modal [data-action="unknown"]').click();click('close-panel')
        expect(p.locator('[data-action="depart"]')).to_be_disabled();expect(p.locator('[data-action="park"]')).to_be_enabled()
        click('park');expect(p.locator('[data-action="depart"]')).to_be_enabled();passed('unsafe simulation stays blocked with an explicit visible recovery action')
        assert not errors,errors;passed('no uncaught JavaScript errors')
    except Exception as e:
        results.append('FAIL: '+str(e));save('failure');raise
    finally:
        (O/'results.json').write_text(json.dumps({'fixture':args.fixture,'passed':len([r for r in results if not r.startswith('FAIL')]),'results':results,'errors':errors,'apiRequests':api_requests},ensure_ascii=False,indent=2))
        b.close()
        if server:server.shutdown();server.server_close()
