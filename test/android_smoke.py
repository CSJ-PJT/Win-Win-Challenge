"""Android 15 installation, text input, map intent, and independent handoff smoke test."""
import json,re,subprocess,time,xml.etree.ElementTree as ET,argparse
from pathlib import Path
P=argparse.ArgumentParser();P.add_argument('apk');P.add_argument('--output',default='native-results');args=P.parse_args()
O=Path(args.output);O.mkdir(parents=True,exist_ok=True);results=[]
def adb(*parts,raw=False):
    r=subprocess.run(['adb',*parts],stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=True,timeout=50)
    return r.stdout if raw else r.stdout.decode('utf-8','replace')
def ui():
    adb('shell','uiautomator','dump','/sdcard/ansim-window.xml');s=adb('shell','cat','/sdcard/ansim-window.xml');(O/'window.xml').write_text(s);return ET.fromstring(s)
def coord(node):
    a=list(map(int,re.findall(r'\d+',node.get('bounds',''))));assert len(a)==4
    return str((a[0]+a[2])//2),str((a[1]+a[3])//2)
def shot(n):(O/(n+'.png')).write_bytes(adb('exec-out','screencap','-p',raw=True))
def find(text,click=False):
    for i in range(15):
        root=ui();hits=[n for n in root.iter('node') if text in (n.get('text','')+' '+n.get('content-desc',''))]
        hits.sort(key=lambda n:n.get('clickable')!='true')
        for n in hits:
            if not n.get('bounds'):continue
            if click:
                assert n.get('enabled')!='false',f'{text} disabled'
                adb('shell','input','tap',*coord(n));time.sleep(.7)
            return n
        # WebView form and footer may be scrollable on phone screens.
        adb('shell','input','swipe','520','1510','520','460','250')
        if i%5==4:adb('shell','input','swipe','520','460','520','1500','250')
        time.sleep(.45)
    raise AssertionError('missing accessibility label: '+text)
def tap(t):find(t,True)
def passed(s):results.append(s);print('PASS',s,flush=True)
try:
    adb('install','-r',str(Path(args.apk).resolve()))
    adb('shell','am','force-stop','kr.co.ansimdonghaeng');adb('shell','am','start','-n','kr.co.ansimdonghaeng/.MainActivity');time.sleep(4)
    find('안심동행');shot('01-launch');tap('방문 준비와 인계 확인');find('도착지 입력하기');passed('role onboarding and first screen work')
    tap('도착지 입력하기');find('도착지 주소')
    inputs=[n for n in ui().iter('node') if n.get('class')=='android.widget.EditText'];assert len(inputs)>=2,'destination address EditText missing'
    adb('shell','input','tap',*coord(inputs[1]));adb('shell','input','text','Seoul%sCity%sHall');time.sleep(.6)
    txt=' '.join(n.get('text','') for n in ui().iter('node') if n.get('class')=='android.widget.EditText')
    assert 'Seoul' in txt, 'Android keyboard did not enter address text'
    adb('shell','input','keyevent','4');shot('02-edit');tap('도착지 저장');find('방문 시작하기');passed('real Android keyboard input saves a destination')
    tap('길안내 열기');time.sleep(1)
    logs=adb('logcat','-d','-s','HandoffMap:I')
    assert 'MAP_INTENT_OPENED' in logs,'external map intent was not launched'
    passed('maps intent opens from a saved address without an API key')
    adb('shell','am','start','-n','kr.co.ansimdonghaeng/.MainActivity');time.sleep(.8)
    tap('방문 시작하기');tap('도착했어요');tap('연결번호 받기');tap('직접 인계했어요')
    find('인계자가 확인했어요');passed('sender confirmation is independently recorded');shot('03-sender')
    tap('화면 전환');tap('시설 담당자');find('연결번호 6자리');passed('facility has its own reception screen')
    tap('화면 전환');tap('연결번호 입력하기');tap('직접 인수했어요');find('인수를 완료했어요');passed('receiver finishes the handoff');shot('04-received')
    tap('화면 전환');tap('보호자 · 진행 조회');find('인계를 마쳤어요');passed('guardian sees completed status')
    tap('화면 전환');tap('쉬운 화면');tap('주야간보호센터');tap('동의하고 계속');tap('도착 알리기');find('도착 소식을');passed('large-button arrival flow works');shot('05-easy')
finally:
    try:(O/'logcat.txt').write_text(adb('logcat','-d','-t','1000'))
    except Exception:pass
    (O/'results.json').write_text(json.dumps({'checks':results,'passed':len(results)},ensure_ascii=False,indent=2))
