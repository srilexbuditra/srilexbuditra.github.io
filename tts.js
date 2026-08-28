(function(){
"use strict";
var w=document.getElementById("ttsFabWrap"),b=document.getElementById("ttsFab"),s=document.getElementById("ttsStop");
if(!w||!b||!s||!("speechSynthesis"in window)||!("SpeechSynthesisUtterance"in window)){if(w)w.style.display="none";return}
var st=document.createElement("style");st.id="srilex-tts-v6-style";st.textContent=`
.tts-fab-wrap{position:fixed;left:max(14px,env(safe-area-inset-left));right:auto;bottom:max(18px,env(safe-area-inset-bottom));z-index:2147483000;display:flex;align-items:flex-end;gap:8px;font-family:inherit;direction:ltr}
.tts-panel{width:0;overflow:hidden;opacity:0;transform:translateX(-8px);transition:.28s;pointer-events:none}
.tts-fab-wrap.is-open .tts-panel,.tts-fab-wrap.is-active .tts-panel{width:210px;opacity:1;transform:none;pointer-events:auto}
.tts-panel-inner{background:rgba(3,18,31,.94);backdrop-filter:blur(14px);border:1px solid rgba(255,204,69,.25);border-radius:15px;box-shadow:0 16px 40px #0007;padding:10px 12px;color:#dceaf2;min-width:186px}
.tts-status{display:flex;align-items:center;justify-content:space-between;gap:8px}.tts-status-main{font-size:11px;font-weight:800}.tts-language{font-size:9px;color:#ffcc45;margin-top:2px;font-weight:700}.tts-percent{font-size:10px;font-weight:900}
.tts-progress{height:4px;border-radius:99px;background:#17384b;overflow:hidden;margin-top:9px}.tts-progress-bar{height:100%;width:0;background:linear-gradient(90deg,#ffd04d,#eaa400);border-radius:99px;transition:width .25s}
.tts-actions{display:flex;gap:6px;margin-top:9px}.tts-action{border:1px solid #245f7f;background:#06243a;color:#c7dce8;border-radius:8px;padding:6px 9px;font-size:9px;font-weight:800;cursor:pointer}.tts-action:hover,.tts-action:focus-visible{border-color:#ffcc45;color:#ffcc45;outline:0}
.tts-fab{width:54px;height:54px;flex:0 0 54px;border:1px solid #ffcc45;border-radius:50%;background:linear-gradient(180deg,#ffd04d,#eaa400);color:#07131c;display:grid;place-items:center;cursor:pointer;box-shadow:0 14px 32px #0008;transition:.2s;padding:0}.tts-fab:hover,.tts-fab:focus-visible{transform:translateY(-3px) scale(1.04);outline:0}.tts-fab.is-speaking{animation:ttsPulse 1.45s infinite}.tts-fab svg{width:23px;height:23px;fill:currentColor}
.tts-stop{position:absolute;left:7px;bottom:7px;width:18px;height:18px;border:0;border-radius:50%;background:#07131c;color:#ffd04d;display:grid;place-items:center;cursor:pointer;opacity:0;transform:scale(.6);pointer-events:none;transition:.2s;z-index:2;padding:0}.tts-fab-wrap.is-active .tts-stop,.tts-fab-wrap:hover .tts-stop,.tts-fab-wrap:focus-within .tts-stop{opacity:1;transform:scale(1);pointer-events:auto}.tts-stop svg{width:8px;height:8px;fill:currentColor}
.tts-read-highlight{background:linear-gradient(90deg,rgba(255,204,69,.38),rgba(255,204,69,.16))!important;color:inherit!important;border-radius:5px;box-shadow:inset 3px 0 0 #ffcc45,0 2px 10px rgba(255,204,69,.08);padding:1px 3px;margin:0 -3px}
@keyframes ttsPulse{0%,100%{box-shadow:0 14px 32px #0008,0 0 0 0 #ffb51b55}50%{box-shadow:0 14px 32px #0008,0 0 0 10px #ffb51b00}}
@media(max-width:760px){.tts-fab-wrap{left:max(10px,env(safe-area-inset-left));bottom:max(12px,env(safe-area-inset-bottom))}.tts-fab{width:50px;height:50px;flex-basis:50px}.tts-fab-wrap.is-open .tts-panel,.tts-fab-wrap.is-active .tts-panel{width:min(205px,calc(100vw - 78px))}.tts-panel-inner{min-width:0}}
@media(prefers-reduced-motion:reduce){.tts-fab,.tts-stop,.tts-panel,.tts-read-highlight{transition:none}.tts-fab.is-speaking{animation:none}}`;
document.head.appendChild(st);

var sy=speechSynthesis,q=[],i=-1,u=null,state="idle",cfg=null,ip=null,prepared=false;
var countries={ID:"id-ID",MY:"ms-MY",SG:"en-SG",BN:"ms-BN",PH:"en-PH",US:"en-US",CA:"en-CA",GB:"en-GB",AU:"en-AU",NZ:"en-NZ",IN:"hi-IN",PK:"ur-PK",BD:"bn-BD",CN:"zh-CN",TW:"zh-TW",JP:"ja-JP",KR:"ko-KR",VN:"vi-VN",TH:"th-TH",DE:"de-DE",FR:"fr-FR",ES:"es-ES",MX:"es-MX",BR:"pt-BR",PT:"pt-PT",IT:"it-IT",NL:"nl-NL",RU:"ru-RU",UA:"uk-UA",SA:"ar-SA",AE:"ar-AE",ZA:"en-ZA",NG:"en-NG"};

var status=document.getElementById("ttsStatus"),lang=document.getElementById("ttsLanguage"),pct=document.getElementById("ttsPercent"),bar=document.getElementById("ttsProgressBar"),pause=document.getElementById("ttsPause"),restart=document.getElementById("ttsRestart");

function update(){var p=q.length?Math.min(100,Math.round(Math.max(0,i)/q.length*100)):0;if(bar)bar.style.width=p+"%";if(pct)pct.textContent=p+"%"}
function setState(x){state=x;w.classList.toggle("is-active",x==="speaking"||x==="paused");b.classList.toggle("is-speaking",x==="speaking");if(status)status.textContent=x==="speaking"?"Sedang membaca":x==="paused"?"Pembacaan dijeda":"Pembaca halaman";if(pause)pause.textContent=x==="paused"?"Lanjutkan":"Jeda";update()}
function clear(){document.querySelectorAll(".tts-read-highlight").forEach(function(e){e.classList.remove("tts-read-highlight")})}

function prepare(){
 if(prepared)return q; prepared=true;
 var root=document.querySelector("main")||document.body,walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){
  var p=n.parentElement;if(!p||!n.nodeValue.trim())return NodeFilter.FILTER_REJECT;
  if(p.closest("script,style,noscript,textarea,input,button,select,option,pre,code,[hidden],.tts-fab-wrap,[aria-hidden='true']"))return NodeFilter.FILTER_REJECT;
  return NodeFilter.FILTER_ACCEPT;
 }}),nodes=[];
 while(walk.nextNode())nodes.push(walk.currentNode);
 nodes.forEach(function(n){var f=document.createDocumentFragment(),parts=n.nodeValue.split(/(?<=[.!?。！？])(?=\s)/);
  parts.forEach(function(x){if(!x.trim())return;var z=document.createElement("span");z.className="tts-read-segment";z.textContent=x;f.appendChild(z);q.push(z)});n.parentNode.replaceChild(f,n)});
 return q;
}
function highlight(){
 clear();var e=q[i];if(!e)return;e.classList.add("tts-read-highlight");var r=e.getBoundingClientRect();if(r.bottom<80||r.top>innerHeight-100)e.scrollIntoView({behavior:"smooth",block:"center",inline:"nearest"});update()
}
function locale(v){if(!v)return null;v=String(v).split(",")[0].trim().replace("_","-");return /^[a-z]{2,3}(-[A-Z]{2,3})?$/i.test(v)?v:null}
function browserLang(){return((navigator.languages&&navigator.languages[0])||navigator.language||document.documentElement.lang||"en-US").replace("_","-")}
function ipLang(){
 if(ip)return ip;ip=fetch("https://ipapi.co/json/",{headers:{Accept:"application/json"}}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){return locale(d.languages)||countries[String(d.country_code||"").toUpperCase()]||null}).catch(function(){return null});return ip
}
function voices(){
 var v=sy.getVoices();if(v.length||!("onvoiceschanged"in sy))return Promise.resolve(v);
 return new Promise(function(resolve){var done=false,t=setTimeout(f,900);function f(){if(done)return;done=true;clearTimeout(t);sy.removeEventListener("voiceschanged",f);resolve(sy.getVoices())}sy.addEventListener("voiceschanged",f)})
}
function find(l,v){if(!l)return null;var e=v.find(function(x){return String(x.lang||"").toLowerCase()===l.toLowerCase()});if(e)return e;var base=l.split("-")[0].toLowerCase();return v.find(function(x){return String(x.lang||"").toLowerCase().split("-")[0]===base})||null}
async function choose(){
 var v=await voices(),id=find("id-ID",v);if(id)return{locale:id.lang||"id-ID",voice:id,label:"Bahasa Indonesia"};
 var il=await ipLang(),iv=find(il,v);if(iv)return{locale:iv.lang||il,voice:iv,label:"Bahasa terdeteksi"};
 if(il)return{locale:il,voice:null,label:"Bahasa terdeteksi"};
 var bl=browserLang(),bv=find(bl,v);return{locale:bv?(bv.lang||bl):bl,voice:bv,label:"Bahasa perangkat"}
}
function next(){
 if(state!=="speaking")return;if(i>=q.length){finish();return}var e=q[i];if(!e||!e.textContent.trim()){i++;next();return}
 highlight();u=new SpeechSynthesisUtterance(e.textContent.trim());u.lang=(cfg&&cfg.locale)||"id-ID";if(cfg&&cfg.voice)u.voice=cfg.voice;u.rate=.95;u.pitch=1;u.volume=1;
 u.onend=function(){i++;if(state==="speaking")next()};u.onerror=function(){i++;if(state==="speaking")next()};sy.speak(u)
}
async function start(){if(!prepare().length)return;sy.cancel();i=0;setState("speaking");cfg=await choose();if(lang)lang.textContent=cfg.label+" · "+cfg.locale;if(state==="speaking")next()}
function finish(){sy.cancel();u=null;i=-1;clear();if(bar)bar.style.width="0%";if(pct)pct.textContent="0%";setState("idle")}
b.addEventListener("click",function(){if(state==="speaking"){sy.pause();setState("paused")}else if(state==="paused"){sy.resume();setState("speaking")}else{w.classList.add("is-open");start()}});
s.addEventListener("click",finish);
if(pause)pause.addEventListener("click",function(){if(state==="speaking"){sy.pause();setState("paused")}else if(state==="paused"){sy.resume();setState("speaking")}});
if(restart)restart.addEventListener("click",function(){sy.cancel();i=0;setState("speaking");next()});
document.addEventListener("visibilitychange",function(){if(document.hidden&&state==="speaking"){sy.pause();setState("paused")}});
addEventListener("beforeunload",function(){sy.cancel()});setState("idle");sy.getVoices()
})();