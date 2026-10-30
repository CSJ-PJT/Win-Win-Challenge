# b227 CI artifacts and physical verification — 2026-10-25 16시 KST

Source b227ca2409eae9ae1f71ff1a5d1b64ef42d7ebab / CI40167658701,15:02:05–15:11:48: verify-build/live-address/native-smoke success,publish skipped. Original logs directly read: Node112/0, save-busy regression saveClosedDialog/persistedAfterReload true, both PC/HTTP official selection/save/reload/maps, emulator official/APK/DOM passed. Five native exitcodes0.
Old518/CI40163763754 liveHTTP failure remains historical, not currentfailure. Original failure timing still unknown; confirmed local busy reproduction and correction are distinct evidence.

## Actual artifact download
BuildZIP12589370004:5,595,356bytes/SHA755ee8b257afb5c20cb793b7450706801fe9c0fc116e4629a36af59d355803ae.
NativeZIP12589300550:1,409,023bytes/SHA7303d278fbd4b8dff3514c7d5c77d66551804761801a88079e8139a83abd51b2.
Actual downloaded ZIPs match recorded digest. APK payload hashes and actual embedded signing certificate bytes matched CI manifest (not a separate cloud apksigner cryptographic verification).
CI release5,170,796bytes/SHAcead7829eb2679d06560e743a101b89df4f5afaa0148b5300404087142362335.
CI QA5,170,820bytes/SHA677cf6d0e4ce30e8a14e5855159764b7509e48b5dfb25e1ef1450e7b0cdbc2af.
CI QA test817,224bytes/SHAa2f79c58707efc3ccbf02c263572d17fc99f59d206cc249dba8493064bfca6f4.
CI certificate8cfec1db2e42517817fede8d9efdafd0dc7d91d3558c252fc3cde28ee170a152, distinct from persistent local QA key. These exact CI APKs were NOT installed on physical phone or publicly released.

## Data-preserving local verifyQa update
Existing owned isolated workspace prepared same8webassets; all8 actual local APK assets matched downloadedCIrelease. No main/easy/address or originalPC source overwrite.
Local app0.4.3-verifyqa/package.verifyqa:5,170,840bytes/SHAc5aad9eecc70bf0cac07450e414c582720582ee8286f0b255af5ff46e69eda4b.
Testbb17d224…b7fd5/source518 unchanged. Build33s/exit0/73tasks(6executed67uptodate). Both installed-old and newly built actual apksigner verification succeeded, identical persistent323cea98…e08e certificate. Package/version9/non-debuggable, staged deviceSHA checked. Only then pm install-r Success, no clear/uninstall/key regeneration.
Before any new tests, launched app and settled accessibility confirmed previous address/postcode04524 retained. Initial immediateWebView snapshot incomplete; reread aftersettling only, no extra restart counted.
Single standing-authorized PM claim, oneunlockedphone/nootherinstrumentation; originalreleasec09449f8/oldQA2903bc14/testc73efa79 hashes unchanged. NewverifyQa appc5aad9ee, testbb17 installed hashes match. Claim released.

## Actual physical flow after update
SamsungAndroid16,16:00:22–16:00:48: official address JUnitOK1/16.281s,DOM JUnitOK1/9.410s; LIVE_POSTCODE_ROUNDTRIP_OK/PRIMARY_HANDOFF_OK/EASY_ARRIVAL_ACK_OK.
This verifies officialaddress and bothroles/guardian/easynotice on the exact local b227app with existing518test. Controlled HTTP telemetry delay race was verified in browser/CI, not separately induced as nativephone delay. No new processCOLD test; older18c273ms result is not relabeled as c5cold.
Private IT13 QAroot AS-Q1-PM-20261025T1556 has previous/new APK, actualcert receipts, manifest/badging,8asset comparison, retained-stateXML, build/JUnit/marker/result. Sanitized mapping build-reports/pm-20261025/b227-final-check.json.

PMselfQA is not independentQA/audit/humanusability/publicreleasebinary approval. Public0.4.3 and competition submission remain unperformed. Next priority finalDOCX/PDF evidence mapping and remaining externalREST/Geocoder/dialer/Pleos/AAOS/vehicle/institutionauth/cloud. Do not repeat successful build/flow without a new reason.
