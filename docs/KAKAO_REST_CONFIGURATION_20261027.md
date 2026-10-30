# Kakao REST configuration and call paths — 2026-10-27 23시 KST

Existing PM inspected current source at `8cae9091eee6e336085b5bffb5ab9a409d7ad1e2`, exact environment configuration and one isolated loopback missing-key gate. Authenticated Kakao search success remains unverified; this work does not require phone UI, another build or an upstream request.

| Path | Current implementation | Current evidence/limit |
|---|---|---|
| Local REST | Authenticated GET /api/places -> dapi.kakao.com/v2/local/search/keyword.json, size5; options.mapKey or KAKAO_REST_API_KEY, KakaoAK header,5s timeout | Actual local role-authenticated request503 MAP_NOT_CONFIGURED; upstream requests0 |
| PC launcher | PC 실행.cmd -> tools/serve-demo.cjs -> standalone HTML on loopback18420 | Static server has no /api/places route; not REST availability |
| Address button | web/app.js searchAddress -> Android openAddressSearch; otherwise AddressPicker.mount | Official postcode SDK, not Local REST or a coordinate-search success |
| Android picker | AddressPickerDialog -> packaged postcode.html/address.js with official allowed hosts | Separate from Geocoder and server REST |
| Native search bridge | MainActivity.searchAddress -> Android Geocoder.getFromLocationName(query,5) | Historical physical evidence belongs to its recorded APK; not a new23시 bridge call |

Current web/app.js has no /api/places call. The onAddressResults callback/searchResults rendering is not evidence that the current address button calls REST. No claim that the server REST endpoint is absent; it is implemented but not the current primary picker route.

## Scoped configuration and actual requests

At22:58:43 and23:00:42, exact KAKAO_REST_API_KEY presence was false in this process/User/Machine scopes; values were not output. Owned PM workspace AnsimBuildTools/checks/live-save-2026102515 has no .env/.env.local file. server.js itself and package/start commands do not load dotenv; an arbitrary .env file alone would not configure the existing start path. This does not prove absence of credentials in other files, names, running-process environments or accounts. Unrelated settings/key files were not opened.

The owned workspace's actual Git blob hashes match current source:
- server.js7933942c06dc5287b982a22b5296fba3430a5040
- web/core.js267601ac7c59e2c6e11ab1afd3f0eaea64fc1101
- web/config.js180907d23bf4fe7f08e0a3e339e27aac963be995

At23:00:14 KST, Windows Node24.18.0 executed actual current server on a new loopback ephemeral port and unused own data-file path. Health200, bootstrap200 (token retained in memory only), role-authenticated places503 MAP_NOT_CONFIGURED. Real fetch wrapper counted dapi.kakao.com requests0; no mapFetch fixture or fabricated upstream response. Server closed, own data file never created; no reset/events or existing store access. This is3 configuration-gate HTTP requests, not3 new features or valid external-service tests.

Official Kakao Local guide requires REST API key in KakaoAK header for keyword search; it is different from the official postcode picker. Current quota guide describes account/app eligibility conditions and paid additional quota; account quota/cost status was not inspected. No authenticated upstream call, account login, key acquisition/change, permission expansion or cost was performed.

References (read2026-10-27): [Local guide](https://developers.kakao.com/docs/ko/local/dev-guide), [quota](https://developers.kakao.com/docs/ko/getting-started/quota). No numeric quota is treated as this project's remaining allowance.

## Preservation and remaining work

At23:00:42 five installed package SHA256 values match22시 baseline, QA lock absent. No phone UI, instrumentation/JUnit, install, build or new CI request. Formal DOCX/PDFv4 and sealed candidate unchanged. PR2 private Draft/open/unmerged, CI40436119702/sourcef1164b0 successful/publish skipped; publishedv0.3.0-preview only.

Evidence IT13 AS-M1-PM-20261027T2256/rest-probe.json, preservation.json and rest-probe23.cjs at QA root. Encoded slash GitHub contents URL failed for Java files; raw-slash follow-up succeeded. No source fix was needed for the observed missing-key gate.

Valid authenticated REST200/places, release75b5 physical execution, independent QA/human usability, institution/Pleos/AAOS/real-car/cloud, judge access, signed-document attachment and actual submission remain separately unverified. Postcode/Geocoder/verifyqa self-QA successes do not close them.

Next single existing PM: re-read official submission/briefing notices for changed access links and attachment/signature requirements, preserving formal-document identities and sealed candidate. Slack23 not sent under09–18 policy; prior18 post read only. No new agent/recipient/schedule.
