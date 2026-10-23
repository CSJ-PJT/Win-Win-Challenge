"""Interactive role switching regression for the single-device demo."""
from pathlib import Path
import argparse, json, shutil
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--output', default='build-reports/v041/role-tabs')
args = parser.parse_args()
out = ROOT / args.output
out.mkdir(parents=True, exist_ok=True)
checks, errors = [], []

def passed(label):
    checks.append(label)
    print('PASS', label, flush=True)

with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path=shutil.which('chromium'), headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 390, 'height': 844})
    page.set_default_timeout(7000)
    page.on('pageerror', lambda err: errors.append(str(err)))
    page.evaluate("""() => {for (const name of ['localStorage','sessionStorage']){
      const data=new Map();Object.defineProperty(window,name,{configurable:true,value:{
      getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)
    }});}}""")
    page.set_content((ROOT / 'dist/handoff-demo.html').read_text(encoding='utf-8'), wait_until='load')

    def tab(role):
        return page.locator(f'.demo-role-tab[data-role="{role}"]')

    def choose(role):
        tab(role).click()
        expect(tab(role)).to_have_attribute('aria-selected', 'true')

    def trip():
        return page.evaluate("JSON.parse(localStorage.getItem('ansim-synthetic-demo-v1'))")

    def shot(name):
        page.screenshot(path=str(out / f'{name}.png'), full_page=True)

    try:
        assert page.locator('.demo-role-tab').count() == 4
        expect(tab('vehicle')).to_have_attribute('aria-selected', 'true')
        assert page.locator('.choice-list .role-option').count() == 0
        passed('opens directly with four role tabs and no onboarding dialog')
        initial = trip()
        shot('01-vehicle')

        choose('facility')
        expect(page.locator('h1')).to_contain_text('방문자를 맞이할 준비를 해요')
        assert page.locator('[data-action="sender"]').count() == 0
        assert page.locator('[data-action="depart"]').count() == 0
        assert page.locator('.history').count() == 0
        shot('02-facility')
        passed('facility tab shows only reception controls and assigned visit')

        choose('guardian')
        expect(page.locator('.checklist')).to_be_visible()
        assert page.locator('[data-action="sender"]').count() == 0
        assert page.locator('[data-action="receiver"]').count() == 0
        shot('03-guardian')
        passed('guardian tab is read-only and shows full progress')

        choose('visitor')
        expect(page.get_by_role('button', name='주야간보호센터')).to_be_visible()
        assert page.locator('[data-action="depart"]').count() == 0
        shot('04-easy')
        passed('large-button easy view is one tab away')

        choose('vehicle')
        assert trip()['id'] == initial['id']
        # Background vehicle heartbeats may increment the optimistic version.
        # Role changes themselves must not create business events.
        assert [e['type'] for e in trip()['events'] if e['type'] != 'VEHICLE'] == [e['type'] for e in initial['events'] if e['type'] != 'VEHICLE']
        assert trip()['state'] == initial['state']
        passed('tab switching preserves the exact same trip and does not write events')

        tab('vehicle').focus()
        page.keyboard.press('ArrowRight')
        expect(tab('guardian')).to_have_attribute('aria-selected', 'true')
        assert tab('guardian').evaluate('(el) => document.activeElement === el')
        page.keyboard.press('End')
        expect(tab('visitor')).to_have_attribute('aria-selected', 'true')
        page.keyboard.press('Home')
        expect(tab('vehicle')).to_have_attribute('aria-selected', 'true')
        passed('arrow and Home/End keys change the focused role accessibly')

        page.locator('[data-action="open-editor"]').first.click()
        page.locator('#textSize').select_option('200')
        page.locator('#visitForm button[type="submit"]').click()
        page.set_viewport_size({'width': 320, 'height': 740})
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
        choose('facility')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
        shot('05-zoomed-facility')
        passed('role tabs remain usable at 320 px width with 200 percent text')
        page.evaluate('window.scrollTo(0, document.documentElement.scrollHeight)')
        page.wait_for_timeout(150)
        coords=tab('facility').evaluate('(el)=>({top:el.getBoundingClientRect().top,bottom:el.getBoundingClientRect().bottom})')
        assert coords['top'] >= -1 and coords['bottom'] <= 740, coords
        passed('role navigation stays on screen while scrolling long visitor details')
        assert not errors, errors
        passed('no uncaught JavaScript errors')
    except Exception:
        shot('failure')
        raise
    finally:
        (out / 'results.json').write_text(json.dumps({'passed': len(checks), 'checks': checks, 'errors': errors}, ensure_ascii=False, indent=2), encoding='utf-8')
        browser.close()