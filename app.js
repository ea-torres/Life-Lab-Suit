// Lógica de CURIOSITY EVA. Los datos se editan en config.js
const $=id=>document.getElementById(id),cv=$("c"),cx=cv.getContext("2d"),st=$("stage");
const RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
let W=0,H=0,hd=SCENE.heading,ar=true,key="nominal",sc=SCEN.nominal,gs=-1,dl=0,tdl=0,sp=0,tsp=0,tm=[],on={},raf=0,T=0,done=false;
const R=Array.from({length:SCENE.rocks},(_,i)=>({b:(i*137.5)%360,z:((i*47)%100)/100})).sort((a,b)=>a.z-b.z);
const P=Array.from({length:110},(_,i)=>({x:((i*97)%1000)/1000,y:((i*53)%1000)/1000,s:.5+((i*29)%10)/10}));
const SP=Array.from({length:70},(_,i)=>({x:((i*131)%100)/100,y:((i*71)%100)/100,r:1+(i%4)}));
const tr=(d,f,s)=>Math.sin(d*f+s)+.5*Math.sin(d*f*2.3+s*1.7)+.25*Math.sin(d*f*5.1+s*3.1);
const dx=b=>((b-hd)%360+540)%360-180;

function ridge(c,a,f,par,s,off){const p=W/90;cx.beginPath();cx.moveTo(0,H);for(let x=0;x<=W+4;x+=4){const d=(hd+(x-W/2)/p)*par;cx.lineTo(x,H*.5+off-a*H*(1+tr(d,f,s))/2.75)}cx.lineTo(W,H);cx.closePath();cx.fillStyle=c;cx.fill()}
function draw(){
  const hz=H*.5,p=W/90;
  let g=cx.createLinearGradient(0,0,0,hz);g.addColorStop(0,SCENE.sky[0]);g.addColorStop(.6,SCENE.sky[1]);g.addColorStop(1,SCENE.sky[2]);
  cx.fillStyle=g;cx.fillRect(0,0,W,H);
  const sx=dx(SCENE.sun)*p+W/2,sy=hz*.5,sg=cx.createRadialGradient(sx,sy,0,sx,sy,W*.3);
  sg.addColorStop(0,"rgba(255,248,236,1)");sg.addColorStop(.04,"rgba(255,236,210,.7)");sg.addColorStop(1,"rgba(255,222,185,0)");
  cx.fillStyle=sg;cx.fillRect(0,0,W,hz);
  SCENE.ridges.forEach(r=>ridge(r[0],r[1],r[2],r[3],r[4],r[5]*H));
  g=cx.createLinearGradient(0,hz+H*.06,0,H);g.addColorStop(0,SCENE.ground[0]);g.addColorStop(1,SCENE.ground[1]);
  cx.fillStyle=g;cx.fillRect(0,hz+H*.06,W,H);
  g=cx.createLinearGradient(0,hz-H*.04,0,hz+H*.16);g.addColorStop(0,"rgba(236,191,143,0)");g.addColorStop(.35,"rgba(236,191,143,.4)");g.addColorStop(1,"rgba(236,191,143,0)");
  cx.fillStyle=g;cx.fillRect(0,hz-H*.04,W,H*.2);
  R.forEach(r=>{const o=dx(r.b);if(Math.abs(o)>52)return;
    const x=W/2+o*p,y=hz+H*.08+(H*.5-H*.08)*Math.pow(r.z,1.5),s=3+r.z*r.z*H*.09;
    cx.fillStyle=SCENE.rock[0];cx.beginPath();cx.ellipse(x,y,s*1.3,s*.6,0,0,7);cx.fill();
    cx.fillStyle=SCENE.rock[1];cx.beginPath();cx.ellipse(x-s*.2,y-s*.18,s*.9,s*.35,0,0,7);cx.fill()});
  if(dl>.01){
    const fx=dx(70)*p+W/2,g2=cx.createRadialGradient(fx,hz,0,fx,hz,W*.55);
    g2.addColorStop(0,`rgba(105,52,28,${.8*dl})`);g2.addColorStop(1,"rgba(105,52,28,0)");cx.fillStyle=g2;cx.fillRect(0,0,W,H);
    cx.fillStyle=`rgba(190,110,65,${.34*dl})`;cx.fillRect(0,0,W,H);
    cx.strokeStyle=`rgba(245,205,165,${.5*dl})`;cx.lineWidth=1.2;cx.beginPath();
    P.forEach(q=>{const x=(q.x*W+T*140*q.s)%W,y=q.y*H;cx.moveTo(x,y);cx.lineTo(x-22*q.s,y+4)});cx.stroke();
  }
  if(sp>.01){cx.fillStyle=`rgba(150,85,50,${.75*sp})`;SP.forEach(s=>{cx.beginPath();cx.ellipse(s.x*W,s.y*H,s.r*1.6,s.r,0,0,7);cx.fill()})}
}
function upd(){
  draw();const p=W/90;let h="";
  for(let d=0;d<360;d+=15){const o=dx(d);if(Math.abs(o)<46){const c=d%90===0?"NESW"[d/90]:d%45===0?["NE","SE","SW","NW"][(d-45)/90]:"|";h+=`<span style="left:${W/2+o*p}px">${c}</span>`}}
  $("tape").innerHTML=h;$("hdg").textContent=String(Math.round((hd%360+360)%360)).padStart(3,"0")+"°";
  M.forEach(m=>{if(!m.e){m.e=document.createElement("div");m.e.className="mk "+m.k;m.e.innerHTML=`<span class="lb">${m.n}</span><i></i>`;$("ar").appendChild(m.e)}
    const o=dx(m.b);if(!ar||m.s!==key||done||Math.abs(o)>46){m.e.style.display="none";return}
    m.e.style.display="";m.e.style.left=(W/2+o*p)+"px";m.e.style.top=(H*.62)+"px"});
}
function loop(t){T=RM?0:t/1000;dl+=(tdl-dl)*.03;sp+=(tsp-sp)*.04;
  if(tdl>.01||Math.abs(tdl-dl)>.004||Math.abs(tsp-sp)>.004){draw();raf=requestAnimationFrame(loop)}else{dl=tdl;sp=tsp;raf=0;draw()}}
function kick(){if(!raf)raf=requestAnimationFrame(loop)}
function size(){const r=st.getBoundingClientRect(),q=Math.min(devicePixelRatio||1,1.5);W=r.width;H=r.height;cv.width=W*q;cv.height=H*q;cx.setTransform(q,0,0,q,0,0);upd()}
let drag=false;
st.addEventListener("pointerdown",e=>{if(e.target.closest("button"))return;drag=true;st.setPointerCapture(e.pointerId)});
st.addEventListener("pointerup",()=>drag=false);
st.addEventListener("pointermove",e=>{if(!drag)return;hd=(hd-e.movementX/(W/90)*.9+360)%360;upd()});
st.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"){hd=(hd-5+360)%360;upd()}if(e.key==="ArrowRight"){hd=(hd+5)%360;upd()}});
addEventListener("resize",size);

function renderProt(){
  const a=$("auto");if(!a)return;
  const all=PROT.map((p,i)=>[p,i]).filter(([p])=>p[1].split(",").includes(key));
  const names=all.filter(([p,i])=>on[i]).map(([p])=>p[0]);
  a.textContent=all.length?"Auto-protection: "+(names.length?names.join(" · "):"starting…"):"";
}
function setProt(){
  tm.forEach(clearTimeout);tm=[];on={};let j=0;
  PROT.forEach((p,i)=>{if(p[1]!==key)return;tm.push(setTimeout(()=>{on[i]=true;if(p[2]==="shield")tsp=.05;renderProt();kick()},700+(j++)*800))});
}
function fat(v){
  let mx=0,ws=0,sw=0,drv="",st={};
  for(const k in FAT){const q=FAT[k],x=Math.min(1,Math.max(0,(v[k]-q.ok)/(q.bad-q.ok)));st[k]=x;ws+=x*q.w;sw+=q.w;if(x>mx){mx=x;drv=k}}
  const idx=Math.round(100*(.5*mx+.5*ws/sw)),L=LEVELS.find(l=>idx<l[0]);
  return {idx,name:L[1],cls:L[2],st,drv:mx>0?drv:""};
}
function render(){
  const F=fat(sc.v),al=$("al"),title=sc.calc?F.name+" fatigue":sc.title,cls=sc.calc?F.cls:sc.lvl;
  al.className="pl ai "+(gs>=0?"crit":cls);
  $("vit").innerHTML=`<small style="color:#8fd3c9">Fatigue · from 4 readings</small><div class="fi"><b>${F.idx}</b> /100 · ${F.name}</div><div class="fb"><i style="left:${F.idx}%"></i></div>`
    +Object.keys(LABELS).map(k=>{const l=LABELS[k],x=F.st[k];return `<div class="fr ${x>=.7?"c":x>=.3?"w":""}"><span>${l[0]}</span><b>${sc.v[k]} <small>${l[1]}</small></b></div>`}).join("")
    +`<small style="color:#8fd3c9">${F.drv?"Main driver: "+LABELS[F.drv][0]:"All readings in range"}</small>`;
  $("holo").classList.toggle("on",gs>=0);
  $("doctxt").innerHTML=(sc.doc||"Flight surgeon")+" · Mission Control<br><span style='color:#8fd3c9'>Live hologram, simulated 12 min delay. HoloConnect AI already sent your sensor summary.</span>";
  if(gs>=0){
    const G=GUIDES[sc.guide],q=G.steps[gs];$("hbase").innerHTML=G.base;$("hov").innerHTML=q[2];
    al.innerHTML=`<h3>Step ${gs+1} of ${G.steps.length} · ${q[0]}</h3><p>${q[1]}</p><div class="acts"><button id="nx">${gs===G.steps.length-1?"Finish guide":"Next step"}</button></div>`;
    $("nx").onclick=nx;renderProt();return;
  }
  al.innerHTML=`<h3>${title}</h3><p>${sc.msg}</p><div class="acts"></div>${sc.acts.length?"<small id='auto'></small>":""}`;
  const box=al.querySelector(".acts");
  sc.acts.forEach(a=>{const b=document.createElement("button");b.textContent=a[0];b.onclick=()=>{if(a[1]==="guide"){gs=0;render()}else $("doc").classList.toggle("on")};box.appendChild(b)});
  renderProt();
}
function nx(){
  const G=GUIDES[sc.guide];
  if(gs<G.steps.length-1){gs++;render();return}
  gs=-1;done=true;tm.forEach(clearTimeout);on={};tdl=0;tsp=0;
  sc={...SCEN.nominal,calc:false,title:G.doneTitle,msg:G.doneMsg};kick();render();upd();
}
function pick(k){
  key=k;sc=SCEN[k];gs=-1;done=false;$("doc").classList.remove("on");
  tdl=sc.dust||0;tsp=k==="dust"?.9:0;setProt();render();upd();kick();
}
document.querySelectorAll(".sc button").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".sc button").forEach(x=>x.classList.remove("sel"));b.classList.add("sel");pick(b.dataset.s)});
$("artog").onclick=e=>{ar=!ar;st.classList.toggle("noar",!ar);e.target.setAttribute("aria-pressed",ar);e.target.textContent="Augmented reality: "+(ar?"on":"off");upd()};
const hm=m=>Math.floor(m/60)+":"+String(m%60).padStart(2,"0");
function res(){const t=+$("t").value,o=Math.round(100-t/480*88),p=Math.round(100-t/480*92);
  $("tt").textContent="T+"+hm(t);$("tr").textContent=hm(480-t);$("o2v").textContent=o+"%";$("pwv").textContent=p+"%";$("o2b").style.width=o+"%";$("pwb").style.width=p+"%";
  $("lat").textContent=480-t<=60?"Return to habitat: under 1 h of reserve":"Earth link: 3–22 min delay"}
$("t").oninput=res;
render();res();size();
