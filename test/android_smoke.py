"""Android 15 installation, text input, map intent, and independent handoff smoke test."""
import json,re,subprocess,time,xml.etree.ElementTree as ET,argparse
from pathlib import Path
P=argparse.ArgumentParser();P.add_argument('apk');P.add_argument('--output',default='native-results');P.add_argument('--reuse-address',action='store_true');args=P.parse_args()
O=Path(args.output);O.mkdir(parents=True,exist_ok=True);results=[]
def adb(*parts,raw=False):
    r=subprocess.run(['adb',*parts],stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=True,timeout=50)
    return r.stdout if raw else r.stdout.decode('utf-8','replace')
def ui():
    # An emulator can report boot-complete before the UiAutomator service and
    # emulated shared storage are usable. Do not mistake this startup race for
    # an application failure, but fail with real diagnostics if it persists.
    last=''
    for attempt in range(12):
        for target in ('/sdcard/ansim-window.xml','/data/local/tmp/ansim-window.xml'):
            try:
                output=adb('shell','uiautomator','dump',target)
                text=adb('shell','cat',target)
                if '<hierarchy' not in text:
                    last=(output+' / '+text)[:500]
                    continue
                root=ET.fromstring(text)
                if not list(root.iter('node')):
                    last='The accessibility tree is empty'
                    continue
                (O/'window.xml').write_text(text)
                return root
            except (subprocess.CalledProcessError, subprocess.TimeoutExpired, ET.ParseError) as exc:
                last=repr(exc)
        time.sleep(1)
    (O/'uiautomator-error.txt').write_text(last)
    raise RuntimeError('Android accessibility dump unavailable after retries: '+last)
def rect(node):
    a=list(map(int,re.findall(r'\d+',node.get('bounds',''))))
    if len(a)!=4 or a[2]<=a[0] or a[3]<=a[1]:return None
    return a

def coord(node):
    a=rect(node)
    assert a is not None, 'Cannot tap an off-screen or zero-sized accessibility element'
    return str((a[0]+a[2])//2),str((a[1]+a[3])//2)
def shot(n):(O/(n+'.png')).write_bytes(adb('exec-out','screencap','-p',raw=True))
def safe_tap_rect(node,root):
    a=rect(node)
    if a is None or a[3]-a[1]<64:return False
    # UIAutomator clips WebView controls at the viewport boundary. A nonzero
    # sliver is not a usable button (and can be covered by the status toast).
    view=next((rect(n) for n in root.iter('node') if n.get('class')=='android.webkit.WebView' and rect(n)),None)
    return view is None or (a[1]>=view[1]+16 and a[3]<=view[3]-32)

def find(text,click=False,exact=False):
    for i in range(15):
        root=ui();hits=[n for n in root.iter('node') if (n.get('text','')==text or n.get('content-desc','')==text) if exact] if exact else [n for n in root.iter('node') if text in (n.get('text','')+' '+n.get('content-desc',''))]
        hits.sort(key=lambda n:n.get('clickable')!='true')
        for n in hits:
            if rect(n) is None or (click and not safe_tap_rect(n,root)):continue
            if click:
                assert n.get('enabled')!='false',f'{text} disabled'
                adb('shell','input','tap',*coord(n));time.sleep(.7)
            return n
        # WebView form and footer may be scrollable on phone screens.
        adb('shell','input','swipe','520','1510','520','460','250')
        if i%5==4:adb('shell','input','swipe','520','460','520','1500','250')
        time.sleep(.45)
    raise AssertionError('missing accessibility label: '+text)
def tap(t,exact=False):find(t,True,exact)
def passed(s):results.append(s);print('PASS',s,flush=True)
try:
    adb('install','-r',str(Path(args.apk).resolve()))
    adb('wait-for-device')
    adb('shell','input','keyevent','KEYCODE_WAKEUP')
    adb('shell','wm','dismiss-keyguard')
    adb('shell','am','force-stop','kr.co.ansimdonghaeng');adb('shell','am','start','-n','kr.co.ansimdonghaeng/.MainActivity');time.sleep(7)
    shot('00-before-accessibility')
    find('안심동행');find('인계자',exact=True);shot('01-launch')
    if args.reuse_address:
        find('세종대로 110')
        passed('selected official Korean address remains saved on the device')
    else:
        find('도착지 입력하기');passed('role tabs and first screen work')
        tap('도착지 입력하기');find('도착지 저장',exact=True)
        inputs=[n for n in ui().iter('node') if n.get('class')=='android.widget.EditText' and rect(n)]
        assert inputs,'destination address input not accessible in the open editor'
        address=next((n for n in inputs if not n.get('text','').strip()),inputs[-1])
        adb('shell','input','tap',*coord(address));adb('shell','input','text','Seoul%sCity%sHall');time.sleep(1.4)
        txt=' '.join(n.get('text','') for n in ui().iter('node') if n.get('class')=='android.widget.EditText')
        assert 'Seoul' in txt,'Android keyboard did not enter address text'
        adb('shell','input','keyevent','4');shot('02-edit');tap('도착지 저장');find('Seoul City Hall')
        passed('real Android keyboard input saves a destination')
    shot('02-before-map')
    tap('카카오맵에서 위치 보기');time.sleep(1)
    shot('02-after-map')
    logs=adb('logcat','-d','-s','HandoffMap:I')
    (O/'map-intent-logcat.txt').write_text(logs)
    assert 'MAP_INTENT_OPENED' in logs,'external map intent was not launched'
    passed('maps intent opens from a saved address without an API key')
    adb('shell','am','start','-n','kr.co.ansimdonghaeng/.MainActivity');time.sleep(.8)
    tap('방문 시작하기');tap('도착했어요')
    # Readiness may have expired while the official address picker was open.
    # Only an independent facility confirmation can renew it.
    tap('시설',exact=True)
    if any(n.get('text','')=='맞이할 준비 완료' or n.get('content-desc','')=='맞이할 준비 완료' for n in ui().iter('node')):
        tap('맞이할 준비 완료')
        passed('facility renewed an expired reception-ready status')
    tap('인계자',exact=True)
    tap('연결번호 받기')
    code_nodes=[n for n in ui().iter('node') if re.fullmatch(r'\d{6}',n.get('text','').strip()) and rect(n)]
    assert len(code_nodes)==1,'displayed connection number not uniquely readable'
    displayed_code=code_nodes[0].get('text').strip()
    tap('직접 인계했어요')
    find('인계자가 확인했어요');passed('sender confirmation is independently recorded');shot('03-sender')
    tap('시설',exact=True);find('연결번호 6자리');passed('facility tab displays its independent reception screen')
    code_fields=[n for n in ui().iter('node') if n.get('class')=='android.widget.EditText' and rect(n)]
    assert len(code_fields)==1,'facility connection input not uniquely available'
    adb('shell','input','tap',*coord(code_fields[0]));adb('shell','input','text',displayed_code)
    adb('shell','input','keyevent','4');tap('직접 인수했어요');find('인수를 완료했어요');passed('receiver finishes the handoff');shot('04-received')
    tap('보호자',exact=True);find('인계를 마쳤어요');passed('guardian sees completed status')
    tap('쉬운 화면',exact=True);tap('주야간보호센터');tap('동의하고 계속');tap('도착 알리기');find('도착 소식을');passed('large-button arrival flow works');shot('05-easy')
finally:
    try:(O/'logcat.txt').write_text(adb('logcat','-d','-t','1000'))
    except Exception:pass
    (O/'results.json').write_text(json.dumps({'checks':results,'passed':len(results)},ensure_ascii=False,indent=2))