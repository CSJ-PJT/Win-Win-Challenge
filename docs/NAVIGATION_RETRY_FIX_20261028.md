# NaviHelper 초기 실패 후 수동 재시도 수정 — 2026-10-28 04시 KST

초기 서비스 연결 최종 실패 뒤 다시 연결을 눌러도 initialize가 다시 호출되지 않는 문제를 재현했습니다. 기존 NavigationAdapter는 onFailed에서 connected=false만 처리하고 initialized=true를 유지하여 이후 connect가 대기 분기로 끝났습니다.

IT13 JDK17에서 수정 전 실제소스32b22462를 Android/SDK 제어 대역과 컴파일: javac exit0/JVM exit1, AssertionError "Retry after terminal failure must initialize again; actual=1". 실제 SDK 서비스를 쓰지 않고 최종실패 콜백·수동재시도를 제어한 어댑터 계약 시험입니다.

수정은 NavigationAdapter에 한정합니다. 최종 실패/동기 초기화예외에서 상태를 해제하고 listener 제거/release, 다음 수동 요청은 새 SDK 객체를 생성합니다. 진행 중 중복 초기화와 자동재시도 루프는 만들지 않습니다. 시도 객체 동일성으로 이전/종료 시도의 늦은 초기화 콜백을 무시하며 상태 접근을 동기화합니다. 차량 UX 조건·예제경로·권한·주소·인계상태는 변경하지 않습니다.

수정 후 같은 JVM 계약시험 javac exit0/JVM exit0/OK. 미연결 경로 차단, 중복 초기화 방지, 최종실패후 새객체 재시도/실패객체 해제, 이전시도 callback 무시, 연결후 중복 요청, 연결후 예제전달, close해제/늦은callback 무시, 동기 초기화예외후 재시도를 확인했습니다. 제어 대역은 실제차량/네트워크/공식SDK 서비스 내부/AAOS 상태 검증이 아닙니다. 실제 SDK API 호환성은 별도 Android CI빌드가 필요합니다.

test/navigation_adapter_retry.py는 현재 어댑터를 직접 읽어 임시폴더에서 컴파일·실행하는 회귀검사입니다. 기존 release043 workflow Java17 설정 뒤 추가합니다. 필요한 기존CI 한 번에서 검사하며 별도workflow_dispatch/병렬빌드/공개runner신설0.

수정 소스는 제품f1164b0/CI40436119702·release75b5/설치bd와 구분합니다. 후보r2·공식문서v4·제출초안은 변경하지 않습니다. 새APK/설치/실차·독립QA 성공으로 합산하지 않고 새CI 최종결과를 따로 확인해야 합니다.

[공식 초기화/실패callback/해제후 새객체](https://document.pleos.ai/docs/pleos-only/connect-sdk-pleos/NaviHelper/initialization-and-release), [초기연결실패와경로오류구분](https://document.pleos.ai/docs/pleos-only/connect-sdk-pleos/NaviHelper/error-handling)은2026-10-28 재조회했습니다. 실제차량 재시도·서비스단절후 자동재접속 전체는이번범위아닙니다.

다음 단일 책임자 기존PM: 수정 커밋의 기존 CI JVM회귀·Android빌드/주소/native 결과를 확인하고 새 APK 버전·서명·해시를 기존후보/설치앱과 분리 검수합니다. CI중복요청/기존앱교체는 하지 않습니다.
