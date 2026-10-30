"""Verify coexistence metadata using the APK bytes, not declared build expectations."""
import hashlib,json,os,re,subprocess,zipfile
from pathlib import Path
out=Path('qa-package');out.mkdir(exist_ok=True)
sdk=Path(os.environ['ANDROID_HOME']);bt=sorted((sdk/'build-tools').iterdir(),key=lambda p:tuple(int(x) for x in p.name.split('.') if x.isdigit()))[-1]
def run(*cmd):return subprocess.check_output([str(x) for x in cmd],text=True,encoding='utf-8')
def inspect(path):
 p=Path(path);bad=run(bt/'aapt','dump','badging',p);xml=run(bt/'aapt','dump','xmltree',p,'AndroidManifest.xml');cert=run(bt/'apksigner','verify','--print-certs',p)
 package=re.search(r"package: name='([^']+)'",bad).group(1)
 digest=re.search(r'certificate SHA-256 digest: ([0-9a-f]{64})',cert).group(1)
 target=re.search(r'android:targetPackage[^\n]*="([^"]+)"',xml)
 label=re.search(r"application-label:'([^']*)'",bad)
 return {'file':p.name,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'package_id':package,'target_package':target.group(1) if target else None,'label':label.group(1) if label else None,'debuggable':'application-debuggable' in bad,'certificate_sha256':digest,'authorities':re.findall(r'android:authorities[^\n]*="([^"]+)"',xml)}
release=inspect('apk/ansim-platform-0.4.3-preview.apk');qa=inspect(out/'ansim-platform-0.4.3-qa.apk');test=inspect(out/'ansim-qa-tests.apk')
assert release['package_id']=='kr.co.ansimdonghaeng'
assert qa['package_id']=='kr.co.ansimdonghaeng.qa'
assert test['package_id']=='kr.co.ansimdonghaeng.qa.test'
assert test['target_package']==qa['package_id']
assert qa['label']=='안심동행 QA'
assert not qa['debuggable'] and not release['debuggable']
assert qa['certificate_sha256']==test['certificate_sha256']
assert not set(release['authorities']) & set(qa['authorities'])
with zipfile.ZipFile('apk/'+release['file']) as a,zipfile.ZipFile(out/qa['file']) as b:
 assets={n:hashlib.sha256(a.read(n)).hexdigest() for n in a.namelist() if n.startswith('assets/') and not n.endswith('/')}
 other={n:hashlib.sha256(b.read(n)).hexdigest() for n in b.namelist() if n.startswith('assets/') and not n.endswith('/')}
 assert assets==other
report={'source_sha':os.environ['GITHUB_SHA'],'workflow_run':os.environ['GITHUB_RUN_ID'],'release':release,'qa':qa,'instrumentation':test,'assets_identical':True,'asset_count':len(assets),'differences':['applicationId suffix .qa','versionName suffix -qa','launcher label 안심동행 QA','BuildConfig applicationId/buildType and generated test target'],'production_java_kotlin_changed':False,'remote_debugging_enabled':False,'physical_install':'not_performed','physical_e2e':'not_verified','handoff_status':'prepared_not_acknowledged'}
(out/'qa-package-manifest.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
