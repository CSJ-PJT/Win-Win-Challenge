"""UI regression tests. --content-fixture renders the bundle without browser navigation.
The fixture uses in-memory storage. Default mode uses real loopback HTTP and storage.
"""
import argparse, json, os, shutil, subprocess, time
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--content-fixture', action='store_true')
parser.add_argument('--output', default=str(ROOT / 'build-reports' / 'ux020'))
args = parser.parse_args()
OUT = Path(args.output); OUT.mkdir(parents=True, exist_ok=True)
report = {'mode':'content-fixture (memory storage)' if args.content_fixture else 'real loopback HTTP / browser storage', 'cases':[]}
errors=[]
STORAGE = """values => { for(const name of ['localStorage','sessionStorage']) {
const m=new Map(Object.entries(values[name]||{})); Object.defineProperty(window,name,{value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)},configurable:true}); }}"""
server=None
if not args.content_fixture:
    env={**os.environ,'PORT':'8139','DATA_FILE':str(OUT/'private-demo-state.json')}
    server=subprocess.Popen(['node','server.js'],cwd=ROOT,env=env,stdout=subprocess.DEVNULL)
    time.sleep(.5)

def passed(name):
    report['cases'].append({'name':name,'passed':True}); print('PASS',name,flush=True)

with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path=shutil.which('chromium') or shutil.which('google-chrome'),headless=True,args=['--no-sandbox'])
    ctx=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=1)
    def new_page(stored=None):
        page=ctx.new_page();page.set_default_timeout(7000);page.on('pageerror',lambda e:errors.append(str(e)))
        if args.content_fixture:
            page.evaluate(STORAGE,stored or {})
            page.set_content((ROOT/'dist/handoff-demo.html').read_text(),wait_until='load')
        else:
            page.goto('http://127.0.0.1:8139/')
        expect(page.locator('.brand-name')).to_be_visible()
        return page
    def click(page,a):
        modal=page.locator('.modal [data-action="'+a+'"]')
        (modal if modal.count() else page.locator('[data-action="'+a+'"]')).first.click()
    def demo(page,a=None):
        click(page,'demo')
        if a: click(page,a);click(page,'close-panel')
    def role(page,r):
        demo(page);page.locator('.modal [data-action="role"][data-role="'+r+'"]').click()
    def current(page):
        if args.content_fixture:return page.evaluate("JSON.parse(localStorage.getItem('ansim-synthetic-demo-v1'))")
        return page.evaluate("async () => {const b=await (await fetch('/api/bootstrap')).json(); return (await (await fetch('/api/state',{headers:{Authorization:'Bearer '+b.tokens.vehicle}})).json()).state;}")
    def fresh(page,scenario,mode='standard'):
        demo(page);page.select_option('#scenario',scenario);click(page,'reset')
        expect(page.locator('.modal')).to_have_count(0)
        if mode=='standard':
            if page.locator('[data-action="mode-standard"]').count():click(page,'mode-standard')
        else:
            if page.locator('[data-action="mode-easy"]').count():click(page,'mode-easy')
    try:
        p=new_page()
        assert p.locator('#scenario').count()==0 and p.locator('#codeInput').count()==0
        passed('home hides developer controls and unnecessary inputs')
        click(p,'mode-easy');click(p,'start-easy-demo')
        expect(p.locator('[data-action="consent-yes"]')).to_be_visible()
        assert current(p)['consent'] is False
        click(p,'consent-yes')
        expect(p.locator('[data-action="easy-arrive"]')).to_be_visible()
        passed('adult sharing consent is explicit')
        p.wait_for_timeout(100);p.evaluate("document.getElementById('toast').className='toast'")
        p.screenshot(path=str(OUT/'easy-home.png'),full_page=True)
        sizes=p.locator('[data-action="easy-arrive"]').evaluate('(e)=>({height:e.getBoundingClientRect().height,font:parseFloat(getComputedStyle(e).fontSize)})')
        assert sizes['height']>=72 and sizes['font']>=22, sizes
        passed('easy primary control is at least 72 CSS pixels high with 22px text')
        click(p,'easy-arrive');expect(p.locator('h1')).to_contain_text('알릴까요')
        assert p.locator('#codeInput').count()==0
        expect(p.locator('.destination-card')).to_contain_text('온유돌봄센터 담당자')
        p.screenshot(path=str(OUT/'easy-confirm.png'),full_page=True)
        passed('arrival confirmation shows recipient without a code input')
        click(p,'easy-send');expect(p.locator('.receipt-card')).to_be_visible()
        s=current(p);assert s['state']=='PLANNED' and not s['senderConfirmed'] and not s['receiverConfirmed']
        assert len([e for e in s['events'] if e['type']=='NOTIFY_ARRIVAL'])==1
        p.screenshot(path=str(OUT/'easy-result.png'),full_page=True)
        passed('arrival record leaves handoff incomplete')
        click(p,'settings');p.locator('[data-action="text-size"][data-size="200"]').click();click(p,'close-panel')
        p.set_viewport_size({'width':320,'height':740})
        assert p.evaluate('document.documentElement.scrollWidth <= innerWidth+1')
        p.screenshot(path=str(OUT/'easy-200-percent.png'),full_page=True)
        passed('320px viewport and 200 percent text has no page overflow')
        saved=p.evaluate("({localStorage:{'ansim-view-settings-v2':localStorage.getItem('ansim-view-settings-v2'),'ansim-synthetic-demo-v1':localStorage.getItem('ansim-synthetic-demo-v1')}})")
        if args.content_fixture:
            q=new_page(saved)
        else:
            q=ctx.new_page();q.goto('http://127.0.0.1:8139/');q.reload()
        expect(q.locator('html')).to_have_class('text-200');expect(q.locator('.receipt-card')).to_be_visible()
        passed('view settings and arrival record restored on a new app instance')
        q.close();p.set_viewport_size({'width':390,'height':844});click(p,'settings');p.locator('[data-action="text-size"][data-size="100"]').click();click(p,'close-panel')
        click(p,'phone');expect(p.locator('#contactPhone')).to_be_visible();assert p.locator('[data-action="open-dialer"]').count()==0
        p.keyboard.press('Escape');assert p.locator('.modal').count()==0
        passed('contact can be entered directly without opening a dialer first')
        fresh(p,'senior','easy');click(p,'consent-yes');demo(p,'offline')
        assert p.locator('[data-action="easy-arrive"]').is_disabled()
        click(p,'phone');expect(p.locator('.modal')).to_be_visible();click(p,'close-panel');click(p,'reconnect')
        assert current(p)['arrivalNotice'] is None
        passed('offline arrival is not saved and contact stays reachable')
        click(p,'settings')
        assert p.locator('.app-shell').get_attribute('inert') is not None
        p.keyboard.press('Shift+Tab');assert p.locator('.modal').evaluate('(e)=>e.contains(document.activeElement)')
        p.keyboard.press('Escape');passed('settings modal traps focus and Escape closes it')
        # Fresh normal handoff, now through individually selected roles.
        fresh(p,'kindergarten','standard');demo(p,'park');demo(p,'ready');click(p,'depart');demo(p,'arrive');click(p,'issue')
        number=p.locator('.connection-code strong').inner_text();click(p,'sender');assert current(p)['state']=='VERIFYING'
        role(p,'facility');p.fill('#codeInput',number);click(p,'receiver');expect(p.locator('h1')).to_contain_text('양쪽 확인')
        assert current(p)['state']=='COMPLETED'
        p.screenshot(path=str(OUT/'facility-complete.png'),full_page=True)
        passed('normal handoff still requires both in-person confirmations')
        # Failed code cannot complete handoff.
        fresh(p,'kindergarten','standard');role(p,'vehicle');demo(p,'park');demo(p,'ready');click(p,'depart');demo(p,'arrive');click(p,'issue')
        role(p,'facility');p.fill('#codeInput','000000' if current(p)['challenge']['code']!='000000' else '111111');click(p,'receiver')
        expect(p.locator('#inlineError')).to_contain_text('연결번호가 맞지');assert current(p)['receiverConfirmed'] is False
        passed('wrong verification number cannot complete handoff')
        if not args.content_fixture:
            # Two real browser tabs observe the same server; receiver ACK stays separate.
            fresh(p,'senior','easy');click(p,'consent-yes');click(p,'easy-arrive');click(p,'easy-send')
            facility=ctx.new_page();facility.goto('http://127.0.0.1:8139/facility')
            expect(facility.locator('.arrival-card')).to_contain_text('도착을 알렸어요');click(facility,'ack')
            expect(p.locator('.read-status')).to_contain_text('읽었어요',timeout=7000)
            assert current(p)['state']=='PLANNED';facility.close()
            passed('real two-tab arrival delivery and read acknowledgment')
            # Commit a POST on the server, then discard its response once.
            fresh(p,'senior','easy');click(p,'consent-yes');click(p,'easy-arrive')
            dropped={'once':False}
            def drop(route):
                data=route.request.post_data_json
                if data.get('event',{}).get('type')=='NOTIFY_ARRIVAL' and not dropped['once']:
                    dropped['once']=True;route.fetch();route.abort('failed')
                else:route.continue_()
            p.route('**/api/events',drop);click(p,'easy-send')
            expect(p.locator('[data-action="resolve-pending"]').first).to_be_visible()
            click(p,'resolve-pending');expect(p.locator('.receipt-card')).to_be_visible()
            assert len([e for e in current(p)['events'] if e['type']=='NOTIFY_ARRIVAL'])==1
            p.unroute('**/api/events',drop)
            passed('lost response is retried with the same idempotency key')
        assert not errors, errors
        passed('no unhandled browser JavaScript exceptions')
    except Exception as e:
        report['error']=str(e)
        try:p.screenshot(path=str(OUT/'failure.png'),full_page=True)
        except:pass
        raise
    finally:
        report['jsErrors']=errors
        report['passed']=len(report['cases'])
        (OUT/'browser-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
        browser.close()
        if server:server.terminate();server.wait(timeout=5)
        (OUT/'private-demo-state.json').unlink(missing_ok=True)
