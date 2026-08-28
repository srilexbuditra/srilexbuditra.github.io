(()=>{"use strict";
if(!("speechSynthesis"in window))return;
const s=window.speechSynthesis;
let voices=[],voice=null,activeUtterance=null,readTimer=null,open=false;

const $=id=>document.getElementById(id);
function status(text){const e=$("sbTtsStatus");if(e)e.textContent=text}
function isIndonesian(v){return /^id(?:-|_)/i.test(v.lang)||/indones|bahasa indonesia/i.test(v.name)}
function pickVoice(){
  voices=s.getVoices()||[];
  voice=voices.find(v=>isIndonesian(v))||
         voices.find(v=>v.default&&/^id/i.test(v.lang))||
         voices.find(v=>/^id/i.test(v.lang))||
         voices.find(v=>v.default)||voices[0]||null;
  status(voice?(isIndonesian(voice)?"Suara Indonesia siap.":"Fallback voice aktif (id-ID)."):"Menunggu voice browser…");
}
function getText(){
  const c=(document.querySelector("main")||document.body).cloneNode(true);
  c.querySelectorAll("script,style,button,input,select,textarea,nav,.sb-tts-fab,.sb-tts-menu").forEach(e=>e.remove());
  return (c.innerText||"").replace(/\s+/g," ").trim().slice(0,12000);
}
function updateFab(state){
  const b=$("sbTtsFab"), icon=$("sbTtsIcon"), label=$("sbTtsLabel");
  if(!b)return;
  b.classList.toggle("is-speaking",state==="speaking");
  b.classList.toggle("is-paused",state==="paused");
  b.setAttribute("aria-pressed",state!=="idle");
  if(state==="speaking"){icon.textContent="Ⅱ";label.textContent="Jeda pembacaan"}
  else if(state==="paused"){icon.textContent="▶";label.textContent="Lanjutkan pembacaan"}
  else{icon.textContent="🔊";label.textContent="Bacakan halaman"}
}
function speak(text){
  if(!text){status("Tidak ada teks untuk dibacakan.");return}
  s.cancel(); clearTimeout(readTimer);
  const u=new SpeechSynthesisUtterance(text);
  activeUtterance=u;u.lang="id-ID";if(voice)u.voice=voice;u.rate=1;u.volume=1;
  u.onstart=()=>{updateFab("speaking");status("Sedang membacakan…")};
  u.onpause=()=>{updateFab("paused");status("Pembacaan dijeda.")};
  u.onresume=()=>{updateFab("speaking");status("Melanjutkan pembacaan…")};
  u.onend=()=>{updateFab("idle");status("Selesai.");activeUtterance=null};
  u.onerror=e=>{updateFab("idle");status("TTS gagal: "+e.error);activeUtterance=null};
  readTimer=setTimeout(()=>s.speak(u),80);
}
function toggleSpeech(){
  if(s.speaking&&!s.paused){s.pause();return}
  if(s.paused){s.resume();return}
  speak(getText());
}
function stopSpeech(){
  s.cancel();clearTimeout(readTimer);activeUtterance=null;updateFab("idle");status("Pembacaan dihentikan.");
}
function toggleMenu(force){
  open=typeof force==="boolean"?force:!open;
  const menu=$("sbTtsMenu"),fab=$("sbTtsFab");
  if(menu)menu.classList.toggle("open",open);
  if(fab)fab.setAttribute("aria-expanded",String(open));
}
function init(){
  if($("sbTtsFab"))return;
  const wrap=document.createElement("div");
  wrap.className="sb-tts-wrap";
  wrap.innerHTML=`
    <button class="sb-tts-fab" id="sbTtsFab" type="button" aria-label="Bacakan halaman" aria-pressed="false" aria-expanded="false" aria-controls="sbTtsMenu" title="Bacakan halaman">
      <span class="sb-tts-fab-icon" id="sbTtsIcon" aria-hidden="true">🔊</span>
      <span class="sb-tts-fab-label" id="sbTtsLabel">Bacakan halaman</span>
    </button>
    <div class="sb-tts-menu" id="sbTtsMenu" role="menu" aria-label="Kontrol pembaca">
      <div class="sb-tts-menu-head"><strong>🔊 TTS Indonesia</strong><button id="sbTtsClose" type="button" aria-label="Tutup kontrol">×</button></div>
      <small id="sbTtsStatus">Mendeteksi voice…</small>
      <div class="sb-tts-actions">
        <button id="sbTtsTest" type="button" role="menuitem">▶ Uji suara</button>
        <button id="sbTtsStop" type="button" role="menuitem">■ Stop</button>
      </div>
      <div class="sb-tts-hint">Klik FAB: mulai / jeda / lanjutkan<br>Double-click: buka kontrol tambahan</div>
    </div>`;
  document.body.appendChild(wrap);

  const fab=$("sbTtsFab");
  let clickTimer=null;
  fab.addEventListener("click",()=>{
    clearTimeout(clickTimer);
    clickTimer=setTimeout(()=>{if(!open)toggleSpeech();else toggleSpeech()},260);
  });
  fab.addEventListener("dblclick",e=>{
    e.preventDefault();clearTimeout(clickTimer);toggleMenu();
  });
  $("sbTtsClose").onclick=()=>toggleMenu(false);
  $("sbTtsTest").onclick=()=>{s.cancel();speak("Halo. Sistem pembaca website Bahasa Indonesia telah aktif.");};
  $("sbTtsStop").onclick=()=>{stopSpeech();toggleMenu(false)};
  document.addEventListener("click",e=>{if(!wrap.contains(e.target)&&open)toggleMenu(false)});
  pickVoice();
  [500,1500,3000].forEach(ms=>setTimeout(pickVoice,ms));
}
if("onvoiceschanged"in s)s.addEventListener("voiceschanged",pickVoice);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();

const style=document.createElement("style");
style.textContent=`
.sb-tts-wrap{position:fixed;left:22px;bottom:22px;z-index:99999;font-family:inherit}
.sb-tts-fab{width:58px;height:58px;border:1px solid #ffcc45;border-radius:50%;background:linear-gradient(145deg,#ffd75a,#e7a313);color:#07131c;display:grid;place-items:center;cursor:pointer;box-shadow:0 14px 35px #0009,0 0 0 0 #ffb51b55;transition:transform .22s ease,box-shadow .22s ease,filter .22s ease;position:relative}
.sb-tts-fab:hover,.sb-tts-fab:focus-visible{transform:translateY(-4px) scale(1.05);filter:brightness(1.06);box-shadow:0 20px 42px #000a,0 0 0 6px #ffb51b18;outline:0}
.sb-tts-fab:active{transform:translateY(-1px) scale(.96)}
.sb-tts-fab.is-speaking{animation:sbTtsPulse 1.5s infinite}
.sb-tts-fab.is-paused{box-shadow:0 16px 38px #0009,0 0 0 5px #ffb51b22}
.sb-tts-fab-icon{font-size:21px;line-height:1;font-weight:900}
.sb-tts-fab-label{position:absolute;left:calc(100% + 12px);white-space:nowrap;background:#031a2d;color:#dceaf2;border:1px solid #1c5c7b;border-radius:10px;padding:8px 10px;font-size:10px;font-weight:800;opacity:0;pointer-events:none;transform:translateX(-5px);transition:.2s;box-shadow:0 10px 25px #0007}
.sb-tts-fab:hover .sb-tts-fab-label,.sb-tts-fab:focus-visible .sb-tts-fab-label{opacity:1;transform:translateX(0)}
.sb-tts-menu{position:absolute;left:0;bottom:72px;width:270px;padding:14px;background:linear-gradient(145deg,#072b45f5,#031a2af5);color:#dceaf2;border:1px solid #24617e;border-radius:15px;box-shadow:0 18px 45px #0009, inset 0 1px 0 #ffffff0b;opacity:0;visibility:hidden;transform:translateY(8px) scale(.97);transform-origin:bottom left;pointer-events:none;transition:.2s ease}
.sb-tts-menu.open{opacity:1;visibility:visible;transform:none;pointer-events:auto}
.sb-tts-menu-head{display:flex;align-items:center;justify-content:space-between;gap:10px;color:#ffd45c}
.sb-tts-menu-head button{width:27px;height:27px;border:1px solid #245f7f;border-radius:50%;background:#061e30;color:#c7dce8;cursor:pointer;font-size:17px;line-height:1}
.sb-tts-menu small{display:block;margin-top:7px;color:#9eb4c6;font-size:10px}
.sb-tts-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:12px}
.sb-tts-actions button{border:1px solid #245f7f;border-radius:9px;background:#06243a;color:#dceaf2;padding:9px 8px;font:inherit;font-size:10px;font-weight:800;cursor:pointer;transition:.2s}
.sb-tts-actions button:hover,.sb-tts-actions button:focus-visible{border-color:#ffcc45;color:#ffd45c;outline:0;transform:translateY(-1px)}
.sb-tts-hint{margin-top:11px;padding-top:10px;border-top:1px solid #174762;color:#6f96ad;font-size:9px;line-height:1.55}
@keyframes sbTtsPulse{0%,100%{box-shadow:0 14px 35px #0009,0 0 0 0 #ffb51b55}50%{box-shadow:0 14px 35px #0009,0 0 0 10px #ffb51b00}}
@media(max-width:760px){.sb-tts-wrap{left:14px;bottom:14px}.sb-tts-fab{width:52px;height:52px}.sb-tts-fab-label{display:none}.sb-tts-menu{bottom:64px;width:min(270px,calc(100vw - 28px))}}
@media(prefers-reduced-motion:reduce){.sb-tts-fab,.sb-tts-menu,.sb-tts-fab-label{transition:none}.sb-tts-fab.is-speaking{animation:none}}
`;
document.head.appendChild(style);
})();