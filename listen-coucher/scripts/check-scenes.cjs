const {chromium}=require('playwright');const BASE=process.argv[2]||'http://localhost:8765';const MAP=JSON.parse(process.argv[3]||'{"p1":"p1-canape","p2":"p2-reveil","p3":"p3-journee","p4":"p4-lit","p5":"p5-listen","p6":"p6-et-toi"}');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
p.on('console',m=>{if(m.text().startsWith('NULL'))console.log(m.text())});p.on('pageerror',e=>console.log('PAGEERR',e.message));
await p.goto(BASE+'/kit/kit.css');
await p.setContent('<html><head><link rel="stylesheet" href="'+BASE+'/kit/kit.css"></head><body></body></html>');
for(const f of ['assets/vendor/gsap.min.js','timeline.js','kit/kit.js']) await p.addScriptTag({url:BASE+'/'+f});
const res=await p.evaluate(async(MAP)=>{ const os=LS.stage; LS.stage=function(){const S=os.apply(this,arguments); const o=S.$; S.$=(n)=>{const e=o(n); if(!e) console.log('NULL '+n); return e;}; return S;};
 window.__timelines={}; const out={};
 for(const id of ['p1','p2','p3','p4','p5','p6']){
  const file=MAP[id];
  const txt=await (await fetch('/compositions/'+file+'.html')).text();
  const m=txt.match(/<template>([\s\S]*)<\/template>/)[1];
  const div=document.createElement('div');div.innerHTML=m.replace(/<script>[\s\S]*<\/script>/,'');
  document.body.appendChild(div);
  const code=m.match(/<script>([\s\S]*)<\/script>/)[1];
  try{ new Function(code)(); out[id]='ok dur='+window.__timelines[id].duration().toFixed(2);}catch(e){out[id]='ERR '+e.message+' | '+(e.stack||'').split('\n')[1];}
 }
 return out;},MAP);
console.log(res);await b.close()})()
