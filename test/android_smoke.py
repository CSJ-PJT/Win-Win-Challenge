"""Touch the signed release APK through Android's accessibility tree; never invoke a call."""
import argparse, json, re, subprocess, time, xml.etree.ElementTree as ET
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('apk');p.add_argument('--output',default='native-results');args=p.parse_args()
O=Path(args.output);O.mkdir(parents=True,exist_ok=True)
results=[]
def adb(*cmd,raw=False):
    r=subprocess.run(['adb',*cmd],stdout=subprocess.PIPE,stderr=subprocess.PIPE,timeout=45,check=True)
    return r.stdout if raw else r.stdout.decode('utf-8',errors='replace')
def tree():
    adb('shell','uiautomator','dump','/sdcard/ansim-window.xml')
    text=adb('shell','cat','/sdcard/ansim-window.xml');(O/'latest-window.xml').write_text(text)
    return ET.fromstring(text)
def shot(name):
    (O/(name+'.png')).write_bytes(adb('exec-out','screencap','-p',raw=True))
def find(text,tap=False):
    for attempt in range(12):
        root=tree()
        matches=[n for n in root.iter('node') if text in (n.get('text','')+' '+n.get('content-desc',''))]
        for n in sorted(matches,key=lambda n:n.get('clickable')!='true'):
            b=list(map(int,re.findall(r'\d+',n.get('bounds',''))))
            if len(b)!=4 or b[2]<=b[0] or b[3]<=b[1]:continue
            if tap:
                assert n.get('enabled')=='true',f'disabled: {text}'
                adb('shell','input','tap',str((b[0]+b[2])//2),str((b[1]+b[3])//2));time.sleep(.6)
            return n
        if attempt==0:time.sleep(.8)
        elif attempt<6:adb('shell','input','swipe','540','1510','540','500','240')
        else:adb('shell','input','swipe','540','500','540','1510','240')
        time.sleep(.3)
    raise AssertionError('Not found: '+text)
def tap(text):find(text,True)
def passed(text):results.append(text);print('PASS',text,flush=True)
try:
    adb('install','-r',str(Path(args.apk).resolve()))
    adb('shell','am','force-stop','kr.co.ansimdonghaeng')
    adb('shell','am','start','-n','kr.co.ansimdonghaeng/.MainActivity')
    time.sleep(4)
    find('안심동행');shot('01-open')
    n=find('이 목적지로 출발하기');assert n.get('enabled')=='true';passed('release opens with enabled departure')
    tap('이 목적지로 출발하기');tap('도착·정차하기');tap('연결번호 받기');tap('직접 인계했어요')
    find('인계자 확인 완료');passed('vehicle departure, arrival and first confirmation')
    tap('시설 화면에서 확인하기');tap('번호 불러오기');tap('직접 인수했어요')
    find('양쪽 확인이 끝났어요');shot('02-complete');passed('facility confirmation completes handoff on release APK')
    tap('다시 시작하기');find('이 목적지로 출발하기');passed('restart makes departure usable again')
    tap('큰 글씨');tap('돌봄센터 방문');tap('동의하고 계속');tap('도착 알리기');tap('도착 소식 보내기')
    find('도착 알림을');shot('03-easy-result');passed('easy arrival workflow on release APK')
except Exception as e:
    results.append('FAIL: '+str(e))
    try:shot('failure')
    except Exception:pass
    raise
finally:
    try:(O/'logcat.txt').write_text(adb('logcat','-d','-t','1500'))
    except Exception:pass
    (O/'results.json').write_text(json.dumps({'apk':Path(args.apk).name,'checks':results,'passed':len([s for s in results if not s.startswith('FAIL')])},ensure_ascii=False,indent=2))
