# 안심동행 플랫폼

차량 이용자, 보호자, 시설 담당자가 방문 준비와 대면 인계 상태를 확인하는 앱입니다.

## 주소 입력부터 인계까지

1. **인계자** 화면에서 **도착지 입력하기 → 주소 검색**을 누릅니다.
2. 공식 카카오 우편번호 검색 결과에서 도로명 주소를 고르고, 필요하면 상세주소를 적어 **도착지 저장**을 누릅니다.
3. 저장한 **주소와 상세주소가 방문 준비 화면에 표시**됩니다. 주소를 다시 고르려면 **도착지 변경**을 누릅니다.
4. **카카오맵에서 위치 보기**를 누르면 저장한 주소의 실제 검색 결과로 이동합니다. 위도·경도가 있는 주소라면 **카카오맵 길찾기**로 열립니다. Google 지도도 설정에서 선택할 수 있습니다.
5. **방문 시작하기 → 도착했어요 → 연결번호 받기 → 직접 인계했어요** 순서로 진행합니다.
6. **시설** 탭에서 연결번호를 입력한 다음 **직접 인수했어요**를 누르면 완료됩니다. **보호자** 탭은 진행 조회 전용입니다.

네 개 역할 탭은 시연 중에 바로 전환할 수 있습니다. 역할 변경은 방문 내용이나 인계 확인을 초기화하지 않습니다. 어르신 **쉬운 화면**은 도착 알림과 담당자 연락을 큰 버튼으로 제공합니다.

## 기획서와 화면설계

[화면설계서](docs/SCREEN_DESIGN.md)는 역할별 주요 화면, 화면 이동, 버튼·입력·오류 상태와 연결 API를 정리합니다. [API 검증표](docs/API_VERIFICATION.md)에서 실제 HTTP 시험과 Android·외부 연계의 남은 검증을 확인할 수 있습니다.

## 실행

- **Android / Windows:** 최신 게시 릴리스는 [v0.3.0-preview](https://github.com/CSJ-PJT/Win-Win-Challenge/releases/tag/v0.3.0-preview)입니다. 0.4.3은 개발·검증 중이며 아직 게시되지 않았습니다. 이 비공개 PM 브랜치의 0.4.3 검증 후보는 [지정 release APK](apk/안심동행_안심동행플랫폼_release.apk)입니다. SHA256 `f3b8c7012f243161a1acd9c1394b29f9849839c0219eb4ad24722ad90e87df3f`, 5,171,400바이트입니다. 같은 바이트의 Android15 CI 결과와 별도 검증 앱의 휴대전화 자체 QA를 구분하며, 이 release 자체 실기기 실행·독립 QA·실제 제출은 아직 완료되지 않았습니다. 이전 지정 APK 75b53185는 [10월 28일 이전 바이트](apk/history/안심동행_안심동행플랫폼_release-before-20261028-75b53185.apk)로, 그보다 앞선 fd64e80도 [기존 이력](apk/history/안심동행_안심동행플랫폼_release-before-20261027-fd64e80.apk)으로 보존합니다. 공개 릴리스 게시 상태는 바꾸지 않았습니다.
- **개발자:** `npm test && npm run bundle && node tools/serve-demo.cjs` 명령으로 `http://127.0.0.1:18420`에서 체험합니다.
- 여러 웹 화면을 실제 서버 상태로 연결하려면 `npm start`를 실행합니다(`http://127.0.0.1:8080`).

PC의 HTML 파일을 `file://`로 직접 열면 주소 검색 결과를 돌려받을 수 없습니다. **PC 실행.cmd**로 열어주세요. 주소 검색 자체에는 카카오 API 키가 필요하지 않지만 인터넷 연결이 필요합니다.

## 지도 연동 범위

우편번호 검색은 실제 주소와 우편번호를 반환하지만 위도·경도를 반환하지 않습니다. 따라서 주소만 저장한 카카오맵 링크는 **위치 검색**이며, 좌표가 있는 경우에만 목적지를 지정한 **길찾기**를 요청합니다. 좌표를 임의로 만들어 넣지 않습니다. Google 지도 URL은 도로명 주소로 경로를 요청할 수 있지만, 한국 내 자동차 안내 지원은 제한될 수 있습니다.

## 검증

```sh
npm test
npm run bundle
python3 test/flow040.py
python3 test/role_tabs041.py
python3 test/address042_mock.py --fixture
python3 test/flow040_http.py
python3 test/address042_live.py
```

GitHub Actions는 Android 15 에뮬레이터에서 공식 주소 검색·선택·저장과 지도 열기, 양측 인계, 쉬운 화면까지 시험하도록 구성되어 있습니다. 현재 후보의 제품·빌드 소스는 `99d5da02f20d3523d55897795d1f4a6b1fb1690a`, [CI40592432776](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40592432776)는 2026-10-28 07:17 KST에 빌드·공식 주소·Android 검사를 완료했습니다. 공개 게시 단계는 건너뛰었습니다. Node112, PC주소7, Android15 release 주소JUnit1·DOM1·UI7은 [CI·산출물 근거](docs/CI_NAVIGATION_ADDRESS_VERIFICATION_20261028.md)를 따릅니다. 실제 Android16 verifyqa930/testdac의 [주소17.637초·주소 콜드 복원](docs/CURRENT_QA_OFFICIAL_PHYSICAL_20261028.md)과 [DOM9.678초·쉬운알림 콜드 복원](docs/CURRENT_QA_DOM_COLD_PHYSICAL_20261028.md)은 다른 APK의 개발자 자체 QA입니다. 검증용 PM 브랜치는 릴리스를 게시하지 않습니다. 자동화 테스트의 장소 정보는 시연 데이터이며 실제 기관 계정 인증 및 Pleos 차량 연동과는 별도입니다.


저장소는 현재 비공개입니다. 게시 릴리스·APK 링크는 접근 권한이 있는 계정에서 확인해야 합니다. 제출할 소스와 APK 경로는 [현재 v5 문서·비공개 후보 r4 기록](docs/SUBMISSION_CANDIDATE_R4_20261028.md) 및 [공식 접수 요건 대조](docs/OFFICIAL_SUBMISSION_PREFLIGHT_20261027.md)에서 확인합니다.
