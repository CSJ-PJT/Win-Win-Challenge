"""Idempotent release naming and reviewed client repair; contains no participant PII."""
from pathlib import Path
import json
ROOT = Path(__file__).resolve().parents[1]

def edit(name, pairs):
    p = ROOT / name
    text = p.read_text(encoding='utf-8')
    for old, new in pairs:
        if old in text:
            text = text.replace(old, new)
        elif new not in text and name != 'README.md':
            raise RuntimeError(f'Release patch does not match {name}: {old[:45]}')
    p.write_text(text, encoding='utf-8')

edit('web/index.html', [('도착완성 · 안심동행','안심동행 플랫폼')])
edit('web/app.js', [
    ('도착완성 <span class="ok">안심동행</span>', '안심동행 <span class="ok">플랫폼</span>'),
    ('PROTOTYPE 0.1</span>', 'PROTOTYPE 0.1.1</span>'),
    ('error.data=data; throw error;', 'error.data=data; error.status=res.status; throw error;'),
    ("} catch(e) { if(connected){connected=false;render();} }", """} catch(e) {
      // A different demo window may rotate synthetic role tokens during reset.
      // Rebootstrap only after a 401; never fall back to local completion.
      if(e.status===401 && !pretendOffline){
        try {
          const boot=await request('/api/bootstrap'); tokens=boot.tokens;
          const role=currentRole==='all'?'vehicle':currentRole;
          const fresh=await request('/api/state',{headers:{Authorization:'Bearer '+tokens[role]}});
          state=fresh.state; connected=true; codeInput=''; senderCheck=false; receiverCheck=false; render(); return;
        } catch(_) { /* Remain explicitly disconnected when recovery fails. */ }
      }
      if(connected){connected=false;render();}
    }"""),
    ("codeInput='';senderCheck=false;receiverCheck=false;render();notify('가상 시연을 초기화했습니다.');", "codeInput='';senderCheck=false;receiverCheck=false;heartbeat=true;lastHeartbeat=0;render();notify('가상 시연을 초기화했습니다.');")
])
edit('web/core.js', [("const VERSION = '0.1.0';", "const VERSION = '0.1.1';")])
edit('android/app/src/main/AndroidManifest.xml', [('android:label="안심동행 · 시연"', 'android:label="안심동행 플랫폼"')])
edit('android/app/build.gradle', [("versionCode 1; versionName '0.1.0'", "versionCode 2; versionName '0.1.1'")])
p=ROOT/'package.json'; pkg=json.loads(p.read_text()); pkg['version']='0.1.1'; p.write_text(json.dumps(pkg,ensure_ascii=False,indent=2)+'\n')
edit('README.md', [('# 도착완성: 안심동행', '# 안심동행 플랫폼'), ('apk/WinWin_안심동행_release.apk','apk/안심동행_안심동행플랫폼_release.apk'), ('APK 파일명은 최종 참가명에 맞게 조정하세요.', '공개 출품 식별명은 안심동행입니다. 개인 참가자의 법적 성명과 연락처는 운영용 접수양식에만 기재합니다. 심사 계정 초대 절차는 docs/REVIEWER_ACCESS.md를 확인하세요.'), ('참가명이 정해지면 APK 파일명과 접수양식의 경로를 맞춥니다.', '공개 출품 식별명은 안심동행입니다. APK 경로는 접수양식과 일치시킵니다. 심사 계정 초대 절차는 docs/REVIEWER_ACCESS.md를 확인하세요.'), ('도메인 35개 + HTTP/API 13개 자동 테스트','도메인 35개 + HTTP/API 18개 + 명칭 1개, 총 54개 자동 테스트'), ('## 최종 확인 기록 (2026-10-23)', '## 이전 빌드 확인 기록 (0.1.0 / 2026-10-23)')])
p=ROOT/'README.md'; text=p.read_text(); marker='## 제출용 개정 (0.1.1 / 2026-10-23)'
if marker not in text:
 text+='\n\n'+marker+'\n\n출품명·웹 제목·Android 앱 이름을 안심동행 플랫폼으로 통일했습니다. 다중 창 시연에서 다른 창이 초기화한 후 가상 세션을 다시 연결하며, 서버 장애 시 로컬 완료로 전환하지 않습니다. 초기화 시 모의 차량 신호 갱신도 기본값으로 복구합니다.\n\n동의·연락처·기명된 접수양식은 이 저장소에 포함하지 않습니다. 심사 계정은 공식 안내에서 확인한 계정만 초대하며, 저장소를 임의로 공개하지 않습니다. 0.1.1 빌드 결과는 해당 Actions 실행과 build-reports/를 기준으로 확인합니다.\n'
 p.write_text(text)
p=ROOT/'.gitignore'; text=p.read_text()
if '/submission-private/' not in text: p.write_text(text+'\n# Operational application/consent forms must never enter the review repository.\n/submission-private/\n*공식접수양식*\n*서명*\n')
print('Release branding and client recovery repair applied.')
