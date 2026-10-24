# 최신 AS-P1 후속 · 2026-10-24 18:25 KST

소스 `5232b81544b4214c14048c7c020d8eac7e639861`, [CI40081102580](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40081102580)(18:13:29–18:23:15 KST)의 verify-build/live-address/native-smoke 모두 성공, publish skipped. Node112/실패0·공식주소 Android instrumentation1·APK조작7·DOM instrumentation1. 실제 MAP_INTENT_OPENED, PRIMARY_HANDOFF_OK, EASY_ARRIVAL_ACK_OK 및 종료코드5개 모두0을 원본 아티팩트에서 확인했다. 시설 양측 확인 완료와 쉬운 도착 알림 화면의 한글·큰 글씨를 직접 확인했다. Android15 에뮬레이터 범위다.

release APK5,170,048바이트 / SHA256 `faf6562113d58c2d4cdc6aadc094eb4fadf8666caf47c5045d8893bc99d4140b`와 QA 앱/테스트의 실제 바이트·해시를 CI manifest에 대조했다. [최신 실행 근거](../build-reports/qa-20261024/map-runtime-5232b81.json), [QA manifest](../build-reports/qa-20261024/qa-package-manifest-5232b81.json). QA variant는 빌드/metadata 검사만이며 이 실행의 native 대상은 release 패키지다.

341bc88/CI40076247150의 잘린 지도 탭 실패, 150cd5f/CI40080392976의 과도한 상단여유로 인한 시설 탭 실패는 수정 전 이력이다. 최신5232b81 전체 성공과 구분한다. 실물 AS-Q1 인계용은 기존341bc88/QA2903bc14·테스트c73efa79 그대로이며 수신/점유/실행 미확인. 신규 APK·QA의 실기기 성공, 외부 API 전체 정상, 공개 릴리스·제출 완료로 합산하지 않는다.


AS-P1 공존 QA variant 구현/빌드/패키지검사/파일 준비 완료. AS-Q1 수신·단독 점유·실기기 판정, AS-A1 독립 감사는 미확인이다. 원본 앱/데이터와 IT13 인계용341bc88 파일을 보존했고 USB를 조작하지 않았다. 아래17시 빌드 기록은 당시 이력이다.

# AS-P1 공존형 QA 패키지

release applicationId는 kr.co.ansimdonghaeng 그대로이며 QA는 kr.co.ansimdonghaeng.qa, instrumentation은 kr.co.ansimdonghaeng.qa.test다. namespace/Activity 클래스는 기존 kr.co.ansimdonghaeng이며 시작 컴포넌트는 kr.co.ansimdonghaeng.qa/kr.co.ansimdonghaeng.MainActivity다.

QA 표시명은 안심동행 QA, 버전 접미사는 -qa이며 release와 QA 모두 debuggable=false다. WebView 원격 디버깅은 기존 BuildConfig.DEBUG 정책을 유지한다. 공통 main Java/Kotlin·웹 소스는 바꾸지 않았다. main manifest에는 provider/sharedUserId가 없으며 빌드 후 실제 manifest authorities 충돌도 검사한다. QA는 별도 앱 저장소를 사용하며 release의 localStorage나 외부 files를 공유하지 않는다.

기존 release 검증 빌드 다음에 같은 워크플로에서 QA 두 APK를 만든다. 별도 에이전트·중복 워크플로·외부 배포를 생성하지 않는다. 기본 testBuildType은 release, QA invocation만 -PansimTestBuildType=deviceQa다. tools/qa_package_manifest.py가 실제 APK의 패키지·instrumentation 대상·표시명·디버깅·인증서·해시·바이트·assets 일치를 검사해 qa-package/qa-package-manifest.json을 만든다. 인증서 지문은 공개 정보이며 서명 키는 아티팩트에 포함하지 않는다.

## AS-Q1 인계 조건

AS-P1은 빌드/패키징 담당이며 USB 조작을 하지 않는다. AS-Q1이 실제 수신·기기 점유를 확인한 후 manifest의 바이트·해시·패키지·서명을 확인하고 QA APK 두 개만 설치한다. 기존 앱 uninstall/data clear 또는 인증서 강제 교체는 하지 않는다. release용 test/native043.sh와 android_smoke.py는 release 패키지를 대상으로 하므로 실물 QA 패키지에 사용하지 않는다.

기본 DOM 실행 명령은 adb shell am instrument -w -r -e class kr.co.ansimdonghaeng.DomFlowTest kr.co.ansimdonghaeng.qa.test/androidx.test.runner.AndroidJUnitRunner다. 공식 주소 검색 검사 클래스는 LiveAddressTest이며 DOM 수동 주소 흐름과 별개다. 한 번에 한 담당자만 기기를 사용한다. 주소/저장/콜드복원·출발/도착·양측 인계·보호자·쉬운알림/시설 확인의 실제 화면·로그가 필요하다. QA 통과를 release 바이너리 자체 실기기 성공으로 바꾸지 않는다.

17시 당시 상태(최신은 맨 위18시 후속을 따른다): AS-Q1 수신·실행은 대기다.

## AS-P1 빌드 확인 · 2026-10-24 17:04 KST

검증 소스341bc88ce9c86ea3c88b82bba281f0e21da50258 / CI40076247150의 verify-build 성공. 같은 CI의 release/QA 앱과 instrumentation을 빌드했고 tools/qa_package_manifest.py의 실제 산출물 검사가 통과했다. 이전 c7d979d 실행40076218053은 메타데이터 파서 후속 수정으로 대체·취소됐으며 현재 실패로 계산하지 않는다.

- QA 앱: 5170072바이트 / SHA256 2903bc1490f5e53c805bcc1f64a08c3a3e44e709d59c8dd011845f01890a2d0d
- QA instrumentation: 816844바이트 / SHA256 c73efa7945d514e3df3154e1f99a77f6eb45713a98c7d0e7745cb0118985cf84
- 두 QA APK 인증서 SHA256: faa3357362277ea4e13d7fe0d97e889b67c1610915ecf018b201921bfbd6f133
- 실제 package/target/label/debuggable/authorities와 release의 웹 assets8개 동일성을 검사했다. release의 ID·label·debuggable도 원래 값이다. BuildConfig applicationId/buildType 및 앱 설치 UID 차이가 있어 바이너리 동등성·실기기 동일 성공을 주장하지 않는다.

독립 다운로드 바이트와 GitHub artifact12553586822의 ZIP digest cf7a993e80c96a85aa25fc1279cff63e5dba451c6be7192ee01bf0d29d614bf7를 대조했다. IT13 기존 QA 폴더 하위 AS-P1-341bc88에 APK2개·manifest를 준비했고 PC에서 다시 두 파일의 바이트·해시 일치를 확인했다. USB/앱 설치/삭제/초기화는 수행하지 않았다.

AS-P1 작성·빌드·패키지 검사·파일 준비 완료. AS-Q1 수신·기기 점유·실행·실기기 판정은 미확인, 인계 수신 대기. AS-A1은 배정만 확인했으며 독립 감사 완료로 표시하지 않는다. 최신 release E2E 전체 성공 기준은 아직 4a671e0/CI40068462730/9a0c311a다. 새 CI40076247150의 live/native 작업과 QA 실기기 결과는 각각 별도 확인한다.
