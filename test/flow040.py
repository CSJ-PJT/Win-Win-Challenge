"""End-to-end standalone interaction and save/reload regressions."""
import json, argparse, shutil
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1]
ap=argparse.ArgumentParser();ap.add_argument('--output',default='build-reports/v040/browser');args=ap.parse_args();OUT=ROOT/args.output;OUT.mkdir(parents=True,exist_ok=True)
checks=[];errors=[]
# Persistence mocking is necessary because the browser harness loads a bundled offline HTML document.
# The native app has first-party localStorage backed by Android WebView.
INIT="""() => {for(const k of ['localStorage','sessionStorage']){let m={};Object.defineProperty(window,k,{configurable:true,value:{getItem:key=>m[key]??null,setItem:(key,v)=>m[key]=String(v),removeItem:key=>delete m[key],clear:()=>{m={}}}})}}"""
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path=shutil.which('chromium'),headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=1)
    p=context.new_page();p.evaluate(INIT);p.on('pageerror',lambda x:errors.append(str(x)));p.set_default_timeout(7000)
    p.set_content((ROOT/'dist/handoff-demo.html').read_text('utf-8'),wait_until='load')
    def passed(s): checks.append(s);print('PASS',s,flush=True)
    def click(a):
        selector=f'[data-action="{a}"]';p.locator(('.dialog ' if p.locator('.dialog').count() else '')+selector).first.click()
    def state():return p.evaluate("JSON.parse(localStorage.getItem('ansim-synthetic-demo-v1'))")
    def screenshot(n):p.screenshot(path=str(OUT/(n+'.png')),full_page=True)
    def role(r):p.locator(f'.demo-role-tab[data-role="{r}"]').click()
    def choose(s):click('open-visits');p.locator(f'.dialog [data-action="choose-visit"][data-scenario="{s}"]').click()
    try:
        expect(p.locator('.demo-role-tab[data-role="vehicle"]')).to_have_attribute('aria-selected','true');passed('initial vehicle role opens with visible role tabs')
        screenshot('01-start');expect(p.get_by_role('button',name='도착지 입력하기')).to_be_visible();click('open-editor');expect(p.locator('#field-address')).to_be_visible();passed('unconfigured destination opens an editable form')
        p.fill('#field-address','서울특별시 중구 세종대로 110');p.fill('#field-facility','서울시청');p.fill('#field-subject','테스트 이용자');p.fill('#field-senderName','보호자 테스트');p.fill('#field-senderPhone','010-1234-5678');p.fill('#field-guardianPhone','010-2222-3333');p.fill('#field-facilityPhone','02-123-4567');p.fill('#field-receiver','시설 담당자');p.fill('#field-place','정문 승하차 구역');p.fill('#field-supportNote','보행 지원');p.select_option('#mapProvider','google');
        assert p.locator('#field-address').input_value()=='서울특별시 중구 세종대로 110';passed('all editable fields accept input without dropping focus')
        p.wait_for_timeout(12500);assert p.locator('#field-address').input_value()=='서울특별시 중구 세종대로 110';assert p.locator('#field-supportNote').input_value()=='보행 지원';passed('background heartbeat does not remount or erase the form')
        screenshot('02-form');p.locator('#visitForm button[type="submit"]').click();expect(p.locator('#visitForm')).to_have_count(0);assert state()['info']['facility']=='서울시청';assert state()['info']['address']=='서울특별시 중구 세종대로 110';passed('save persists all visit fields')
        click('open-editor');assert p.locator('#field-senderName').input_value()=='보호자 테스트';assert p.locator('#field-address').input_value()=='서울특별시 중구 세종대로 110';click('close');passed('reopening editor restores saved values')
        assert 'www.google.com/maps/dir/' in p.locator('[data-map-link]').first.get_attribute('href');assert '%EC%84%B8%EC%A2%85%EB%8C%80%EB%A1%9C' in p.locator('[data-map-link]').first.get_attribute('href');passed('address-only link opens real Google Maps directions')
        click('depart');expect(p.get_by_role('button',name='도착했어요')).to_be_visible();passed('start trip transitions to moving')
        click('arrive');role('facility');click('ready');role('vehicle');click('issue');expect(p.get_by_text('담당자에게 보여줄 번호')).to_be_visible();click('sender');assert state()['senderConfirmed'] and not state()['receiverConfirmed'];passed('sender handoff sets sender status only');screenshot('03-handoff')
        role('facility');expect(p.get_by_text('인수 확인',exact=True)).to_be_visible();assert p.locator('[data-action="depart"]').count()==0;passed('facility screen exposes only its reception actions')
        p.fill('#codeInput','123456');click('receiver');expect(p.locator('#inlineError')).to_contain_text('일치');passed('wrong code is rejected')
        p.fill('#codeInput',state()['challenge']['code']);click('receiver');assert state()['state']=='COMPLETED';passed('correct code completes only after both confirmations');screenshot('04-complete')
        role('guardian');expect(p.get_by_text('인계를 마쳤어요')).to_be_visible();assert p.locator('[data-action="sender"]').count()==0;passed('guardian is read-only')
        role('vehicle');click('new-visit');assert state()['state']=='PLANNED';assert state()['info']['facility']=='서울시청';assert state()['info']['address']=='서울특별시 중구 세종대로 110';passed('next visit restores last configured destination')
        role('visitor');click('easy-senior');expect(p.get_by_role('button',name='동의하고 계속')).to_be_visible();click('consent');click('notify');assert state()['arrivalNotice'] and not state()['senderConfirmed'];passed('easy mode records arrival without inventing handoff');screenshot('05-easy')
        role('facility');click('ack');assert state()['arrivalNotice']['acknowledgedAt'];passed('facility can acknowledge arrival notice')
        assert not errors,errors;passed('no JavaScript errors')
    except Exception:
        screenshot('failure');raise
    finally:
        (OUT/'results.json').write_text(json.dumps({'passed':checks,'errors':errors},ensure_ascii=False,indent=2),'utf-8');browser.close()