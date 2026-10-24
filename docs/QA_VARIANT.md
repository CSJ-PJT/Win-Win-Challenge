# AS-P1 공존형 QA 패키지

release applicationId는 kr.co.ansimdonghaeng 그대로이며 QA는 kr.co.ansimdonghaeng.qa, instrumentation은 kr.co.ansimdonghaeng.qa.test다. namespace/Activity 클래스는 기존 kr.co.ansimdonghaeng이며 시작 컴포넌트는 kr.co.ansimdonghaeng.qa/kr.co.ansimdonghaeng.MainActivity다.

QA 표시명은 안심동행 QA, 버전 접미사는 -qa이며 release와 QA 모두 debuggable=false다. WebView 원격 디버깅은 기존 BuildConfig.DEBUG 정책을 유지한다. 공통 main Java/Kotlin·웹 소스는 바꾸지 않았다. main manifest에는 provider/sharedUserId가 없으며 빌드 후 실제 manifest authorities 충돌도 검사한다. QA는 별도 앱 저장소를 사용하며 release의 localStorage나 외부 files를 공유하지 않는다.

기존 release 검증 빌드 다음에 같은 워크플로에서 QA 두 APK를 만든다. 별도 에이전트·중복 워크플로·외부 배포를 생성하지 않는다. 기본 testBuildType은 release, QA invocation만 -PansimTestBuildType=deviceQa다. tools/qa_package_manifest.py가 실제 APK의 패키지·instrumentation 대상·표시명·디버깅·인증서·해시·바이트·assets 일치를 검사해 qa-package/qa-package-manifest.json을 만든다. 인증서 지문은 공개 정보이며 서명 키는 아티팩트에 포함하지 않는다.

## AS-Q1 인계 조건

AS-P1은 빌드/패키징 담당이며 USB 조작을 하지 않는다. AS-Q1이 실제 수신·기기 점유를 확인한 후 manifest의 바이트·해시·패키지·서명을 확인하고 QA APK 두 개만 설치한다. 기존 앱 uninstall/data clear 또는 인증서 강제 교체는 하지 않는다. release용 test/native043.sh와 android_smoke.py는 release 패키지를 대상으로 하므로 실물 QA 패키지에 사용하지 않는다.

기본 DOM 실행 명령은 adb shell am instrument -w -r -e class kr.co.ansimdonghaeng.DomFlowTest kr.co.ansimdonghaeng.qa.test/androidx.test.runner.AndroidJUnitRunner다. 공식 주소 검색 검사 클래스는 LiveAddressTest이며 DOM 수동 주소 흐름과 별개다. 한 번에 한 담당자만 기기를 사용한다. 주소/저장/콜드복원·출발/도착·양측 인계·보호자·쉬운알림/시설 확인의 실제 화면·로그가 필요하다. QA 통과를 release 바이너리 자체 실기기 성공으로 바꾸지 않는다.

현재 상태: 구현 작성, 빌드 검증 대기, AS-Q1 전달/수신/실행 미확인. 빌드 manifest·로그·APK가 확인된 후 인계 상태를 갱신한다.
