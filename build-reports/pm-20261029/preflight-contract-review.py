#!/usr/bin/env python3
"""Local synthetic parser/CLI contract review; no APK build, signature or device."""
import sys,struct,json,tempfile,subprocess,hashlib
from pathlib import Path
tool=Path(sys.argv[1]).resolve()
def lp(x): return struct.pack("<I",len(x))+x
def fixture(cert,extra=b"",conflict=False):
    def pair(ident,c):
        signed=lp(b"")+lp(lp(c))
        value=lp(lp(lp(signed)))
        body=struct.pack("<I",ident)+value
        return struct.pack("<Q",len(body))+body
    pairs=pair(0x7109871a,cert)
    if conflict: pairs+=pair(0xf05368c0,b"DIFFERENT_SYNTHETIC_LEAF")
    size=len(pairs)+24
    block=struct.pack("<Q",size)+pairs+struct.pack("<Q",size)+b"APK Sig Block 42"
    prefix=b"NOT_A_REAL_APK"+extra
    cd=len(prefix)+len(block)
    eocd=b"PK\x05\x06"+b"\0"*12+struct.pack("<I",cd)+b"\0\0"
    return prefix+block+eocd
rows=[]
with tempfile.TemporaryDirectory(prefix="asdh-preflight-contract-") as td:
    d=Path(td)
    for name,data in {"one.bin":fixture(b"SYNTHETIC_NOT_DER"),"same-leaf.bin":fixture(b"SYNTHETIC_NOT_DER",b"CHANGED"),"other.bin":fixture(b"OTHER_NOT_DER"),"bad.bin":b"malformed","conflict.bin":fixture(b"SYNTHETIC_NOT_DER",conflict=True)}.items(): (d/name).write_bytes(data)
    base=["--installed-apk",str(d/"one.bin")]
    cases=[
      ("same-input",base+["--candidate-apk",str(d/"one.bin")],0,"CERTIFICATES_MATCH_NOT_INSTALL_APPROVAL"),
      ("different-bytes-same-leaf",base+["--candidate-apk",str(d/"same-leaf.bin")],0,"CERTIFICATES_MATCH_NOT_INSTALL_APPROVAL"),
      ("different-leaf",base+["--candidate-apk",str(d/"other.bin")],2,"CERTIFICATE_MISMATCH"),
      ("malformed-input",base+["--candidate-apk",str(d/"bad.bin")],3,"UNREADABLE_OR_UNSUPPORTED_APK"),
      ("missing-input",base+["--candidate-apk",str(d/"missing.bin")],3,"UNREADABLE_OR_UNSUPPORTED_APK"),
      ("conflicting-schemes",base+["--candidate-apk",str(d/"conflict.bin")],3,"UNREADABLE_OR_UNSUPPORTED_APK"),
      ("missing-cli-arguments",[],2,None),
      ("output-is-directory",base+["--candidate-apk",str(d/"one.bin"),"--output",str(d)],1,None)]
    for name,args,expected,status in cases:
        p=subprocess.run([sys.executable,str(tool),*args],capture_output=True,text=True)
        try: result=json.loads(p.stdout)
        except json.JSONDecodeError: result=None
        no_authorization=(all(result.get(k) is False for k in ["signature_verified","package_version_lineage_verified","installation_authorized"]) and result.get("device_actions")=="none") if result else None
        ok=p.returncode==expected and (result.get("status") if result else None)==status and (no_authorization is True if status else result is None)
        rows.append({"name":name,"expectedExit":expected,"actualExit":p.returncode,"status":result.get("status") if result else None,"structuredJson":result is not None,"authorizationFlagsRemainFalse":no_authorization,"stderrPresent":bool(p.stderr),"pass":ok})
report={"environment":"local Linux Python subprocess; synthetic invalid non-DER/non-APK containers only","toolSha256":hashlib.sha256(tool.read_bytes()).hexdigest(),"cases":rows,"passed":sum(r["pass"] for r in rows),"failed":sum(not r["pass"] for r in rows),"freshRealApkTests":0,"deviceActions":0,"signatureValidation":False,"scope":"Parser/CLI behavior only. exit2 can be argument error; output write failure is exit1/no JSON. Never use exit0 as installation approval."}
Path(sys.argv[2]).write_text(json.dumps(report,indent=2)+"\n")
print(json.dumps(report,indent=2))
sys.exit(0 if report["failed"]==0 else 1)
