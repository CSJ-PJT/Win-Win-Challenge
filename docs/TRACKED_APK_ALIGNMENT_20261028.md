# 2026-10-28 지정 APK 최신 후보 정합화

16시 기존 PM이 비공개 PM 브랜치의 지정 APK를 source99d5da0/CI40592432776/후보r4의 검증된 release로 맞췄다. 이전 75b53185는 history 경로에 동일 Git blob70e9c773로 보존하고 fd64e80의 기존 이력도 유지한다. 공개 게시·실제 제출과 구분한다.

## 바이트 근거

IT13 후보 release5171400B SHA256 `f3b8c7012f243161a1acd9c1394b29f9849839c0219eb4ad24722ad90e87df3f`를 다시 계산했다. 전체 바이트에 Git blob header를 붙여 로컬 SHA1 `80cf1a71a50ad5fa2551db1a99171dbcb5c80109`를 계산했고, 동일base64를 GitHub create_blob에 넣어 반환한SHA가 정확히 일치했다. 바이너리독립회수 SHA256검사는 이번 수행하지 않았으며 Git객체주소 검증과 구분한다. base64첫읽기 응답파싱실패는 파일/제품결함이 아니며 최신완전응답 길이6895200자확인 후 업로드했다. 원격Git PATH·두기본경로 부재를 확인했고 별도설치/인증추가/키탐색 없이 기존GitHub 연결을 사용했다.

- 지정경로 apk/안심동행_안심동행플랫폼_release.apk → blob80cf1a71/5171400B.
- 보존경로 apk/history/안심동행_안심동행플랫폼_release-before-20261028-75b53185.apk → 기존blob70e9c773/5170860B.
- README의 APK해시·크기/소스·CI·폰QA·문서v5/r4링크를 현재기준으로 갱신. 역사로그와 봉인후보의 manifest를 소급수정하지 않는다.

후보r4 20체크섬오류0·SUMS419f736a 유지. 공식DOCX/PDFv5는미편집, 원래앱/사용자데이터·main/easy/address미커밋·r1/r2/r3/r4·검토메일초안보존. 새제품코드/빌드/설치/폰UI/CI요청0. 03시원본실패/11시최신JUnit범위통과·양원장/standing/배정·지정PR댓글/최신후속을읽었고 lock/관련writer/진행instrumentation없음. CI40592432776 success·publishskipped,PR2PrivateDraft미병합·게시v0.3.0-preview만재확인.

제품완료·release물리·독립QA/사람사용성·실차·유효REST/기관클라우드·서명허용·심사접근·실제제출은 미완료유지. 설치release는다른서명으로교체하지않는다. 다음 단일 기존PM: 현재releasef3b8와verifyqa930의manifest/DEX/8자산을 비교해 현재native차이와실물미검증범위를확정한다. 설치·빌드반복없이수행.
