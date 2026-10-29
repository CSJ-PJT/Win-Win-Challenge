import json,hashlib,zipfile,struct,io,datetime
from pathlib import Path
R=Path(__file__).parent;B=R/'ansim-0.4.3-build'
sha=lambda b:hashlib.sha256(b).hexdigest()
def lp(b,p=0):
 n=struct.unpack_from('<I',b,p)[0];return b[p+4:p+4+n],p+4+n
def cert_digest(b):
 e=b.rfind(b'PK\x05\x06');cd=struct.unpack_from('<I',b,e+16)[0]
 assert b[cd-16:cd]==b'APK Sig Block 42'
 size=struct.unpack_from('<Q',b,cd-24)[0];p=cd-size
 while p<cd-24:
  n=struct.unpack_from('<Q',b,p)[0];key=struct.unpack_from('<I',b,p+8)[0];value=b[p+12:p+8+n];p+=8+n
  if key==0x7109871a:
   signers,_=lp(value);signer,_=lp(signers);signed,_=lp(signer);_,q=lp(signed);certs,_=lp(signed,q);cert,_=lp(certs)
   return sha(cert)
 raise ValueError('No v2 signer')
def manifest(b):
 strings=[];result={};p=8
 while p<len(b):
  kind,header,size=struct.unpack_from('<HHI',b,p);assert size>0
  if kind==1:
   count,_,flags,start,_=struct.unpack_from('<IIIII',b,p+8)
   offsets=struct.unpack_from('<'+'I'*count,b,p+header)
   for offset in offsets:
    q=p+start+offset
    if flags&0x100:
     def length(q):
      n=b[q];return (((n&0x7f)<<8)|b[q+1],q+2) if n&0x80 else (n,q+1)
     _,q=length(q);n,q=length(q);strings.append(b[q:q+n].decode('utf8'))
    else:
     n=struct.unpack_from('<H',b,q)[0];q+=2
     if n&0x8000:n=((n&0x7fff)<<16)|struct.unpack_from('<H',b,q)[0];q+=2
     strings.append(b[q:q+n*2].decode('utf-16le'))
  if kind==0x102:
   name=struct.unpack_from('<I',b,p+20)[0];attrstart,attrsize,count=struct.unpack_from('<HHH',b,p+24)
   tag=strings[name]
   if tag in ['manifest','application','instrumentation']:
    values={}
    for i in range(count):
     a=p+16+attrstart+i*attrsize;_,key,raw=struct.unpack_from('<III',b,a);typ=b[a+15];data=struct.unpack_from('<I',b,a+16)[0]
     values[strings[key]]=strings[raw] if raw!=0xffffffff else strings[data] if typ==3 else bool(data) if typ==0x12 else data
    result[tag]=values
  p+=size
 return result
paths=[B/'apk/ansim-platform-0.4.3-preview.apk',B/'apk/ansim-address-tests.apk',B/'qa-package/ansim-platform-0.4.3-qa.apk',B/'qa-package/ansim-qa-tests.apk']
out={'observed_at':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(),'apks':[]}
for path in paths:
 b=path.read_bytes()
 with zipfile.ZipFile(io.BytesIO(b)) as z:
  assets={n:sha(z.read(n)) for n in z.namelist() if n.startswith('assets/') and not n.endswith('/')}
  m=manifest(z.read('AndroidManifest.xml'))
  item={'file':str(path.relative_to(B)),'bytes':len(b),'sha256':sha(b),'v2_certificate_sha256_extracted':cert_digest(b),'manifest':m,'assets':assets}
  if assets:item['cancellation_present']=b'function discardAddressSearch()' in z.read('assets/app.js') and b'function discardAddressSearch()' in z.read('assets/index.html')
  out['apks'].append(item)
assert out['apks'][0]['assets']==out['apks'][2]['assets'];assert len(out['apks'][0]['assets'])==8
assert out['apks'][0]['manifest']['manifest']['package']=='kr.co.ansimdonghaeng'
assert out['apks'][1]['manifest']['instrumentation']['targetPackage']=='kr.co.ansimdonghaeng'
assert out['apks'][3]['manifest']['instrumentation']['targetPackage']=='kr.co.ansimdonghaeng.qa'
assert len({v['v2_certificate_sha256_extracted'] for v in out['apks']})==1
meta=json.loads((B/'qa-package/qa-package-manifest.json').read_text())
for i,k in [(0,'release'),(2,'qa'),(3,'instrumentation')]:
 assert out['apks'][i]['sha256']==meta[k]['sha256'];assert out['apks'][i]['v2_certificate_sha256_extracted']==meta[k]['certificate_sha256']
with zipfile.ZipFile(B/'ansim-platform-0.4.3-source.zip') as z:
 app=z.read('web/app.js');out['source_app_sha256']=sha(app)
 assert b'function discardAddressSearch()' in app;assert b'coordinate(d.y,90)' in z.read('server.js')
 with zipfile.ZipFile(paths[0]) as a:assert a.read('assets/app.js')==app
 out['source_contains_both_fixes']=True
out['assets_identical']=True;out['asset_count']=8
out['local_signature_verification']='certificate extracted only, no cryptographic verifier locally; CI apksigner results are separate'
(R/'inspection.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(out,ensure_ascii=False,indent=2))
