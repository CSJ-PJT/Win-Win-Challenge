"""Browser regression for the physical QA easy-completion issue.
Uses the real standalone bundle and button events, with synthetic local state.
No Android, live institution delivery or external service success is claimed.
"""
import argparse, json, shutil
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
p = argparse.ArgumentParser()
p.add_argument('--output', default='build-reports/easy-completion')
a = p.parse_args()
out = Path(a.output); out.mkdir(parents=True, exist_ok=True)
report = {'environment': 'Chromium standalone synthetic browser UI', 'cases': []}
with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path=shutil.which('chromium') or shutil.which('google-chrome'), headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 390, 'height': 844})
    page.set_default_timeout(7000)
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.route('**/*', lambda r: r.fulfill(status=200, content_type='text/html', body=(ROOT/'dist/handoff-demo.html').read_text()))
    page.goto('http://127.0.0.1:18420/')
    def click(action):
        page.locator('[data-action="'+action+'"]').first.click()
    def role(name):
        page.locator('[data-action="select-role"][data-role="'+name+'"]').click()
    def clean_summary():
        expect(page.locator('#main')).to_contain_text('도착 소식을')
        for action in ['open-editor', 'edit-destination']:
            expect(page.locator('#main [data-action="'+action+'"]')).to_have_count(0)
        expect(page.locator('#main .empty-address')).to_have_count(0)
        expect(page.locator('#main')).not_to_contain_text('도착지를 지정해 주세요.')
        expect(page.locator('#main [data-action="new-visit"]')).to_be_enabled()
    def passed(name):
        report['cases'].append({'name':name, 'passed':True})
        print('PASS',name,flush=True)
    role('visitor'); click('easy-senior'); click('consent'); click('notify')
    clean_summary()
    expect(page.locator('#main')).to_contain_text('담당자가 확인하면 알려드려요.')
    passed('unacknowledged notice without address has summary and usable next visit')
    role('facility'); click('ack'); role('visitor')
    clean_summary()
    expect(page.locator('#main')).to_contain_text('담당자가 확인했어요.')
    passed('facility acknowledgement and role round trip keep clean summary')
    page.reload(); clean_summary()
    expect(page.locator('#main')).to_contain_text('담당자가 확인했어요.')
    page.screenshot(path=str(out/'ack-empty.png'),full_page=True)
    passed('browser reload retains acknowledged clean summary')
    # Rendering fixture for optional supplied address/contact, not a live phone call.
    page.evaluate("""() => {
      const key='ansim-synthetic-demo-v1', s=JSON.parse(localStorage.getItem(key));
      s.info.address='서울 중구 세종대로 110'; s.info.postcode='04524'; s.info.facilityPhone='021234567';
      localStorage.setItem(key,JSON.stringify(s));
    }""")
    page.reload(); clean_summary()
    expect(page.locator('#main')).to_contain_text('서울 중구 세종대로 110')
    expect(page.locator('#main a[href="tel:021234567"]')).to_have_count(1)
    passed('configured destination and dialer link survive summary rendering fixture')
    click('new-visit')
    role('vehicle')
    expect(page.locator('#main [data-action="edit-destination"]').first).to_be_enabled()
    passed('new visit keeps editable destination setup')
    assert not errors, errors
    report['page_errors'] = errors
    report['result'] = 'success'
    (out/'result.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    browser.close()
