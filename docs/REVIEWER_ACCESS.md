# 심사 접근 권한 준비

확인일: 2026-10-23. 저장소: CSJ-PJT/Win-Win-Challenge (개인 소유, 비공개).

공식 제출 안내와 FAQ는 공지된 심사용 GitHub 계정을 초대하라고 안내합니다. 확인한 공지 3건과 제출 안내에서는 실제 계정명을 찾지 못했습니다. 임의로 계정을 추측하거나 이메일 주소만으로 초대하지 않습니다. 초대는 아직 발송하지 않았습니다.

## 모바일에서 설정

1. 공식 운영사무국(appdevchallenge@hyundai-partners.com)에서 심사용 GitHub 사용자명을 확인합니다.
2. https://github.com/CSJ-PJT/Win-Win-Challenge/settings/access 에서 Add people을 선택합니다.
3. 확인한 사용자명을 정확히 선택해 초대합니다. 개인 비공개 저장소의 Collaborator는 읽기와 쓰기가 모두 가능합니다. 저장소를 공개할 필요는 없습니다.
4. 상대가 초대를 수락했는지 확인하고, 심사 계정에서 README와 apk/안심동행_안심동행플랫폼_release.apk에 접근 가능한지 회신받습니다. 초대 전송만으로 접근 확인이 완료되지는 않습니다.

## CLI 준비 도구

GitHub CLI로 저장소 관리자 계정에 로그인한 뒤:

```bash
node tools/reviewer-access.js OFFICIAL_USERNAME
```

기본 명령은 대상·권한을 확인하는 조회만 합니다. 공식 계정 확인과 쓰기 권한 허용을 마친 경우에만:

```bash
node tools/reviewer-access.js OFFICIAL_USERNAME --invite --official-account-confirmed --ack-write-access
```

이 스크립트는 토큰을 출력하거나 저장하지 않습니다. 저장소 공개 전환, 임의 계정 초대, 개인 접수양식 업로드는 하지 않습니다.

## 운영사무국 확인 문안

비공개 GitHub 저장소 제출을 준비 중입니다. 초대할 심사용 GitHub 사용자명과 접근 확인 방법을 안내 부탁드립니다. 개인정보 동의서의 본인 서명란에 참가자 본인이 승인한 이름 입력(기명)도 인정되는지 함께 확인 부탁드립니다. 불가한 경우 허용되는 전자서명 또는 서명 제출 방법을 안내 부탁드립니다.

공식 안내: https://appdevchallenge.auto-hmg.io/guide/submission
