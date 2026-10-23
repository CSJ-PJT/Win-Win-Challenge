'use strict';
// No dependencies, no public listener and no filesystem browsing.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const file=process.argv[2]?path.resolve(process.argv[2]):path.resolve(__dirname,'../dist/handoff-demo.html');
const port=Number(process.env.PORT||18420);
if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('Invalid local port');
if(!fs.existsSync(file))throw new Error('HTML file not found: '+file);
const html=fs.readFileSync(file);
const server=http.createServer((req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  if(!['127.0.0.1:'+port,'localhost:'+port].includes(req.headers.host)){res.writeHead(403);res.end();return;}
  const route=(req.url||'/').split('?')[0];
  if(route==='/favicon.ico'){res.writeHead(204);res.end();return;}
  if(!['/','/index.html','/handoff-demo.html'].includes(route)){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'strict-origin-when-cross-origin'});
  res.end(req.method==='HEAD'?undefined:html);
});
server.on('error',e=>{console.error(e.code==='EADDRINUSE'?'이미 실행 중인 창을 확인해 주세요: http://127.0.0.1:'+port:e.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>{
  const url='http://127.0.0.1:'+port;
  console.log('안심동행 플랫폼\n'+url+'\n종료: Ctrl+C');
  if(process.env.ANSIM_NO_OPEN==='1')return;
  const command=process.platform==='win32'?['rundll32.exe',['url.dll,FileProtocolHandler',url]]:process.platform==='darwin'?['open',[url]]:['xdg-open',[url]];
  const child=spawn(command[0],command[1],{stdio:'ignore'});child.on('error',()=>console.log('브라우저에서 위 주소를 열어 주세요.'));child.unref();
});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
