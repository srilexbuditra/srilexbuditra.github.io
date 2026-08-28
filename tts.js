(()=>{
"use strict";

/*
 * Srilex Buditra — V5.2 IP Smart Language / Left Floating TTS
 * UI is injected independently so the main website structure is untouched.
 */
const synth = ("speechSynthesis" in window) ? window.speechSynthesis : null;
let voices=[], selectedVoice=null, activeUtterance=null, readTimer=null, menuOpen=false;
let detected={country:"", countryCode:"", language:"", locale:"", source:"browser"};

const $=id=>document.getElementById(id);
const cleanCode=v=>String(v||"").replace("_","-");

/* Dominant/default locale by IP country. IP is the primary signal; browser
   language and available voices are fallbacks. This covers common locales
   globally while avoiding a hard-coded id-ID lock. */
const COUNTRY_LOCALE={
  ID:"id-ID",MY:"ms-MY",SG:"en-SG",BN:"ms-BN",TH:"th-TH",VN:"vi-VN",PH:"en-PH",KH:"km-KH",LA:"lo-LA",MM:"my-MM",
  US:"en-US",CA:"en-CA",GB:"en-GB",IE:"en-IE",AU:"en-AU",NZ:"en-NZ",ZA:"en-ZA",NG:"en-NG",KE:"en-KE",GH:"en-GH",TZ:"sw-TZ",UG:"en-UG",
  IN:"hi-IN",PK:"ur-PK",BD:"bn-BD",LK:"si-LK",NP:"ne-NP",BT:"dz-BT",MV:"dv-MV",
  JP:"ja-JP",KR:"ko-KR",CN:"zh-CN",TW:"zh-TW",HK:"zh-HK",MO:"zh-MO",
  FR:"fr-FR",BE:"fr-BE",CH:"fr-CH",LU:"fr-LU",MC:"fr-MC",DE:"de-DE",AT:"de-AT",LI:"de-LI",NL:"nl-NL",SE:"sv-SE",NO:"nb-NO",DK:"da-DK",FI:"fi-FI",IS:"is-IS",
  ES:"es-ES",MX:"es-MX",AR:"es-AR",CL:"es-CL",CO:"es-CO",PE:"es-PE",VE:"es-VE",EC:"es-EC",BO:"es-BO",PY:"es-PY",UY:"es-UY",CR:"es-CR",PA:"es-PA",DO:"es-DO",GT:"es-GT",HN:"es-HN",NI:"es-NI",SV:"es-SV",CU:"es-CU",
  IT:"it-IT",SM:"it-SM",VA:"it-IT",PT:"pt-PT",BR:"pt-BR",AO:"pt-AO",MZ:"pt-MZ",CV:"pt-CV",
  RU:"ru-RU",UA:"uk-UA",BY:"be-BY",PL:"pl-PL",CZ:"cs-CZ",SK:"sk-SK",HU:"hu-HU",RO:"ro-RO",BG:"bg-BG",HR:"hr-HR",RS:"sr-RS",SI:"sl-SI",BA:"bs-BA",MK:"mk-MK",LT:"lt-LT",LV:"lv-LV",EE:"et-EE",GR:"el-GR",AL:"sq-AL",
  TR:"tr-TR",IL:"he-IL",SA:"ar-SA",AE:"ar-AE",QA:"ar-QA",KW:"ar-KW",BH:"ar-BH",OM:"ar-OM",JO:"ar-JO",LB:"ar-LB",EG:"ar-EG",MA:"ar-MA",DZ:"ar-DZ",TN:"ar-TN",
  IR:"fa-IR",AF:"ps-AF",AM:"hy-AM",GE:"ka-GE",AZ:"az-AZ",KZ:"kk-KZ",UZ:"uz-UZ",
  MN:"mn-MN",KH:"km-KH",ET:"am-ET",RW:"rw-RW",SN:"fr-SN",CI:"fr-CI",CM:"fr-CM",CD:"fr-CD",CG:"fr-CG",MG:"mg-MG",
  FJ:"en-FJ",PG:"en-PG",WS:"sm-WS",TO:"to-TO",VU:"fr-VU"
};

const LANG_NAMES={
  id:"Indonesia",en:"English",ms:"Melayu",th:"ไทย",vi:"Tiếng Việt",ja:"日本語",ko:"한국어",zh:"中文",hi:"हिन्दी",bn:"বাংলা",ur:"اردو",fr:"Français",de:"Deutsch",es:"Español",it:"Italiano",pt:"Português",ru:"Русский",uk:"Українська",pl:"Polski",nl:"Nederlands",sv:"Svenska",da:"Dansk",no:"Norsk",fi:"Suomi",tr:"Türkçe",ar:"العربية",he:"עברית",fa:"فارسی",el:"Ελληνικά",cs:"Čeština",sk:"Slovenčina",hu:"Magyar",ro:"Română",bg:"Български",hr:"Hrvatski",sr:"Srpski",sl:"Slovenščina",lt:"Lietuvių",lv:"Latviešu",et:"Eesti",sw:"Kiswahili",ta:"தமிழ்",te:"తెలుగు",mr:"मराठी",ne:"नेपाली",si:"සිංහල",km:"ខ្មែរ",lo:"ລາວ",my:"မြန်မာ",am:"አማርኛ",az:"Azərbaycan",ka:"ქართული",kk:"Қазақша",uz:"O‘zbekcha",ps:"پښتو",hy:"Հայերեն",mn:"Монгол"
};

function status(text){const e=$("sbTtsStatus");if(e)e.textContent=text}
function isLang(v,locale){
  const want=String(locale||"").toLowerCase().split("-")[0];
  const got=String(v?.lang||"").toLowerCase().split("-")[0];
  return want && got===want;
}
function voiceScore(v,locale){
  if(!v)return -1;
  const want=cleanCode(locale).toLowerCase();
  const vl=cleanCode(v.lang).toLowerCase();
  let score=0;
  if(vl===want)score+=100;
  if(vl.split("-")[0]===want.split("-")[0])score+=60;
  if(v.default)score+=8;
  if(/online|natural|neural|premium|enhanced/i.test(v.name))score+=4;
  return score;
}
function pickVoice(){
  if(!synth)return;
  voices=synth.getVoices()||[];
  const locale=detected.locale||navigator.language||"id-ID";
  selectedVoice=voices.slice().sort((a,b)=>voiceScore(b,locale)-voiceScore(a,locale))[0]||null;
  const langName=LANG_NAMES[String(locale).split("-")[0]]||locale;
  if(selectedVoice){
    status(`${langName} • ${selectedVoice.lang}${detected.source==="ip"?" • IP location":" • browser fallback"}`);
  }else{
    status(`Menunggu voice: ${langName} (${locale})…`);
  }
}

async function detectIP(){
  const controllers=[];
  const endpoints=[
    "https://ipapi.co/json/",
    "https://ipwho.is/"
  ];
  for(const url of endpoints){
    const controller=new AbortController(); controllers.push(controller);
    const timer=setTimeout(()=>controller.abort(),3500);
    try{
      const r=await fetch(url,{cache:"no-store",signal:controller.signal,headers:{"Accept":"application/json"}});
      if(!r.ok)throw new Error("HTTP "+r.status);
      const d=await r.json();
      const cc=String(d.country_code||d.countryCode||"").toUpperCase();
      if(!cc)throw new Error("country unavailable");
      const locale=COUNTRY_LOCALE[cc]||navigator.language||"en-US";
      detected={country:d.country_name||d.country||cc,countryCode:cc,language:locale.split("-")[0],locale,source:"ip"};
      updateLocation(); pickVoice(); return;
    }catch(e){/* try next provider */}
    finally{clearTimeout(timer)}
  }
  const browser=cleanCode(navigator.language||"en-US");
  detected={country:"",countryCode:"",language:browser.split("-")[0],locale:browser,source:"browser"};
  updateLocation(); pickVoice();
}

function updateLocation(){
  const e=$("sbTtsLocation");
  if(!e)return;
  const lang=LANG_NAMES[detected.language]||detected.language||"Auto";
  e.textContent=detected.source==="ip"
    ? `${detected.country||detected.countryCode} • ${lang} • ${detected.locale}`
    : `Browser language • ${lang} • ${detected.locale}`;
  const head=$("sbTtsTitle"); if(head)head.textContent=`🔊 TTS ${lang}`;
}

function getText(){
  const c=(document.querySelector("main")||document.body).cloneNode(true);
  c.querySelectorAll("script,style,button,input,select,textarea,nav,.sb-tts-wrap,.sb-tts-fab,.sb-tts-menu").forEach(e=>e.remove());
  return (c.innerText||"").replace(/\s+/g," ").trim().slice(0,12000);
}
function updateFab(state){
  const b=$("sbTtsFab"),icon=$("sbTtsIcon"),label=$("sbTtsLabel"); if(!b)return;
  b.classList.toggle("is-speaking",state==="speaking");
  b.classList.toggle("is-paused",state==="paused");
  b.setAttribute("aria-pressed",state!=="idle");
  if(state==="speaking"){icon.textContent="Ⅱ";label.textContent="Jeda pembacaan";b.title="Jeda pembacaan"}
  else if(state==="paused"){icon.textContent="▶";label.textContent="Lanjutkan pembacaan";b.title="Lanjutkan pembacaan"}
  else{icon.textContent="🔊";label.textContent="Bacakan halaman";b.title="Bacakan halaman"}
}
function speak(text){
  if(!synth){status("Browser tidak mendukung Speech Synthesis.");return}
  if(!text){status("Tidak ada teks untuk dibacakan.");return}
  synth.cancel();clearTimeout(readTimer);
  const u=new SpeechSynthesisUtterance(text);
  activeUtterance=u;
  u.lang=detected.locale||navigator.language||"en-US";
  if(selectedVoice)u.voice=selectedVoice;
  u.rate=1;u.volume=1;
  u.onstart=()=>{updateFab("speaking");status(`Sedang membacakan • ${u.lang}`)};
  u.onpause=()=>{updateFab("paused");status("Pembacaan dijeda.")};
  u.onresume=()=>{updateFab("speaking");status(`Melanjutkan • ${u.lang}`)};
  u.onend=()=>{updateFab("idle");status("Selesai.");activeUtterance=null};
  u.onerror=e=>{updateFab("idle");status("TTS gagal: "+(e.error||"unknown"));activeUtterance=null};
  readTimer=setTimeout(()=>synth.speak(u),80);
}
function toggleSpeech(){
  if(!synth)return;
  if(synth.speaking&&!synth.paused){synth.pause();return}
  if(synth.paused){synth.resume();return}
  speak(getText());
}
function stopSpeech(){
  if(synth)synth.cancel();clearTimeout(readTimer);activeUtterance=null;updateFab("idle");status("Pembacaan dihentikan.");
}
function toggleMenu(force){
  menuOpen=typeof force==="boolean"?force:!menuOpen;
  const menu=$("sbTtsMenu"),fab=$("sbTtsFab");
  if(menu)menu.classList.toggle("open",menuOpen);
  if(fab)fab.setAttribute("aria-expanded",String(menuOpen));
}

function injectStyle(){
  if($("sbTtsStyle"))return;
  const style=document.createElement("style");style.id="sbTtsStyle";
  style.textContent=`
.sb-tts-wrap{position:fixed!important;left:18px!important;bottom:18px!important;z-index:2147483000!important;font-family:inherit;isolation:isolate}
.sb-tts-fab{box-sizing:border-box!important;width:58px!important;height:58px!important;padding:0!important;margin:0!important;border:1px solid rgba(255,211,84,.95)!important;border-radius:50%!important;background:linear-gradient(145deg,#ffd85e,#d99a14)!important;color:#06131d!important;display:grid!important;place-items:center!important;cursor:pointer!important;box-shadow:0 14px 35px rgba(0,0,0,.58),0 0 0 0 rgba(255,181,27,.32)!important;transition:transform .22s ease,box-shadow .22s ease,filter .22s ease!important;position:relative!important;outline:none!important}
.sb-tts-fab:hover,.sb-tts-fab:focus-visible{transform:translateY(-4px) scale(1.05)!important;filter:brightness(1.07)!important;box-shadow:0 20px 42px rgba(0,0,0,.65),0 0 0 6px rgba(255,181,27,.13)!important}
.sb-tts-fab:active{transform:translateY(-1px) scale(.96)!important}
.sb-tts-fab.is-speaking{animation:sbTtsPulse 1.5s infinite}
.sb-tts-fab.is-paused{box-shadow:0 16px 38px rgba(0,0,0,.58),0 0 0 5px rgba(255,181,27,.14)!important}
.sb-tts-fab-icon{font-size:21px;line-height:1;font-weight:900;pointer-events:none}.sb-tts-fab-label{position:absolute;left:calc(100% + 12px);white-space:nowrap;background:#031a2d;color:#dceaf2;border:1px solid #1c5c7b;border-radius:10px;padding:8px 10px;font-size:10px;font-weight:800;opacity:0;pointer-events:none;transform:translateX(-5px);transition:.2s;box-shadow:0 10px 25px rgba(0,0,0,.45)}
.sb-tts-fab:hover .sb-tts-fab-label,.sb-tts-fab:focus-visible .sb-tts-fab-label{opacity:1;transform:translateX(0)}
.sb-tts-menu{position:absolute!important;left:0!important;bottom:72px!important;width:286px!important;box-sizing:border-box;padding:14px!important;background:linear-gradient(145deg,rgba(7,43,69,.97),rgba(3,26,42,.97))!important;color:#dceaf2;border:1px solid #24617e!important;border-radius:15px!important;box-shadow:0 18px 45px rgba(0,0,0,.58),inset 0 1px 0 rgba(255,255,255,.04)!important;opacity:0;visibility:hidden;transform:translateY(8px) scale(.97);transform-origin:bottom left;pointer-events:none;transition:.2s ease;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.sb-tts-menu.open{opacity:1;visibility:visible;transform:none;pointer-events:auto}.sb-tts-menu-head{display:flex;align-items:center;justify-content:space-between;gap:10px;color:#ffd45c}.sb-tts-menu-head button{width:27px;height:27px;border:1px solid #245f7f;border-radius:50%;background:#061e30;color:#c7dce8;cursor:pointer;font-size:17px;line-height:1}.sb-tts-menu small{display:block;margin-top:7px;color:#9eb4c6;font-size:10px}.sb-tts-location{display:block;margin-top:5px;color:#6f96ad;font-size:9px;line-height:1.4}.sb-tts-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:12px}.sb-tts-actions button{border:1px solid #245f7f;border-radius:9px;background:#06243a;color:#dceaf2;padding:9px 8px;font:inherit;font-size:10px;font-weight:800;cursor:pointer;transition:.2s}.sb-tts-actions button:hover,.sb-tts-actions button:focus-visible{border-color:#ffcc45;color:#ffd45c;outline:0;transform:translateY(-1px)}.sb-tts-hint{margin-top:11px;padding-top:10px;border-top:1px solid #174762;color:#6f96ad;font-size:9px;line-height:1.55}
@keyframes sbTtsPulse{0%,100%{box-shadow:0 14px 35px rgba(0,0,0,.58),0 0 0 0 rgba(255,181,27,.32)}50%{box-shadow:0 14px 35px rgba(0,0,0,.58),0 0 0 10px rgba(255,181,27,0)}}
@media(max-width:760px){.sb-tts-wrap{left:12px!important;bottom:12px!important}.sb-tts-fab{width:52px!important;height:52px!important}.sb-tts-fab-label{display:none}.sb-tts-menu{bottom:64px!important;width:min(286px,calc(100vw - 24px))!important}}
@media(prefers-reduced-motion:reduce){.sb-tts-fab,.sb-tts-menu,.sb-tts-fab-label{transition:none!important}.sb-tts-fab.is-speaking{animation:none!important}}
`;
  document.head.appendChild(style);
}

function buildUI(){
  if($("sbTtsFab"))return;
  injectStyle();
  const wrap=document.createElement("div");wrap.className="sb-tts-wrap";wrap.setAttribute("aria-label","Website Text to Speech");
  wrap.innerHTML=`
    <button class="sb-tts-fab" id="sbTtsFab" type="button" aria-label="Bacakan halaman" aria-pressed="false" aria-expanded="false" aria-controls="sbTtsMenu" title="Bacakan halaman">
      <span class="sb-tts-fab-icon" id="sbTtsIcon" aria-hidden="true">🔊</span><span class="sb-tts-fab-label" id="sbTtsLabel">Bacakan halaman</span>
    </button>
    <div class="sb-tts-menu" id="sbTtsMenu" role="menu" aria-label="Kontrol pembaca">
      <div class="sb-tts-menu-head"><strong id="sbTtsTitle">🔊 TTS Auto</strong><button id="sbTtsClose" type="button" aria-label="Tutup kontrol">×</button></div>
      <small id="sbTtsStatus">Mendeteksi bahasa &amp; voice…</small><small class="sb-tts-location" id="sbTtsLocation">Mendeteksi lokasi IP…</small>
      <div class="sb-tts-actions"><button id="sbTtsTest" type="button" role="menuitem">▶ Uji suara</button><button id="sbTtsStop" type="button" role="menuitem">■ Stop</button></div>
      <div class="sb-tts-hint">Klik FAB: mulai / jeda / lanjutkan<br>Double-click: buka kontrol tambahan</div>
    </div>`;
  document.body.appendChild(wrap);

  const fab=$("sbTtsFab");let clickTimer=null;
  fab.addEventListener("click",()=>{clearTimeout(clickTimer);clickTimer=setTimeout(()=>toggleSpeech(),250)});
  fab.addEventListener("dblclick",e=>{e.preventDefault();clearTimeout(clickTimer);toggleMenu()});
  $("sbTtsClose").onclick=()=>toggleMenu(false);
  $("sbTtsTest").onclick=()=>{if(!synth){status("Browser tidak mendukung TTS.");return} speak("Halo. Sistem pembaca website otomatis telah aktif. Bahasa dan suara dipilih berdasarkan lokasi IP perangkat, dengan fallback ke bahasa browser dan voice yang tersedia.")};
  $("sbTtsStop").onclick=()=>{stopSpeech();toggleMenu(false)};
  document.addEventListener("click",e=>{if(!wrap.contains(e.target)&&menuOpen)toggleMenu(false)});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&menuOpen)toggleMenu(false)});
  updateFab("idle");
  if(!synth){status("Speech Synthesis tidak tersedia di browser ini.");fab.disabled=true;fab.setAttribute("aria-disabled","true");return}
  pickVoice();
  [250,1000,2500].forEach(ms=>setTimeout(pickVoice,ms));
  detectIP();
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",buildUI,{once:true});else buildUI();
if(synth&&"onvoiceschanged" in synth)synth.addEventListener("voiceschanged",pickVoice);
})();
