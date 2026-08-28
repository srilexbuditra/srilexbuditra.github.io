/* Srilex Buditra — TTS V5 Hybrid Indonesia */
(function () {
  'use strict';
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;

  const synth = window.speechSynthesis;
  const STORAGE_KEY = 'sb_tts_voice_id_v5';
  const RATE_KEY = 'sb_tts_rate_v5';
  let voices = [];
  let selectedVoice = null;
  let currentUtterance = null;
  let panel = null;
  let button = null;

  function getIndonesianVoices() {
    return voices.filter(v => /^id(?:-|_)/i.test(v.lang) || /^id$/i.test(v.lang));
  }

  function scoreVoice(v) {
    const name = (v.name || '').toLowerCase();
    const lang = (v.lang || '').toLowerCase();
    let score = 0;
    if (lang === 'id-id') score += 100;
    else if (lang.startsWith('id')) score += 80;
    if (/indonesia|indonesian|bahasa indonesia/.test(name)) score += 40;
    if (v.localService) score += 8;
    if (v.default) score += 4;
    return score;
  }

  function refreshVoices() {
    voices = synth.getVoices() || [];
    const idVoices = getIndonesianVoices().sort((a,b) => scoreVoice(b)-scoreVoice(a));
    const saved = localStorage.getItem(STORAGE_KEY);
    selectedVoice = idVoices.find(v => v.voiceURI === saved) || idVoices[0] || null;
    updateUI();
  }

  function updateUI() {
    const select = document.getElementById('sbTtsVoiceSelect');
    const status = document.getElementById('sbTtsStatus');
    if (!select || !status) return;
    const list = getIndonesianVoices().sort((a,b) => scoreVoice(b)-scoreVoice(a));
    select.innerHTML = '';
    if (!list.length) {
      const o = document.createElement('option');
      o.value = ''; o.textContent = 'Suara Indonesia tidak tersedia di perangkat';
      select.appendChild(o); select.disabled = true;
      status.textContent = 'Mode fallback: browser akan mencoba bahasa Indonesia.';
      return;
    }
    select.disabled = false;
    list.forEach(v => {
      const o = document.createElement('option');
      o.value = v.voiceURI;
      o.textContent = `${v.name} — ${v.lang}${v.default ? ' (Default)' : ''}`;
      if (selectedVoice && v.voiceURI === selectedVoice.voiceURI) o.selected = true;
      select.appendChild(o);
    });
    status.textContent = `${list.length} suara Bahasa Indonesia terdeteksi.`;
  }

  function getReadableText() {
    const main = document.querySelector('main') || document.body;
    const clone = main.cloneNode(true);
    clone.querySelectorAll('script,style,noscript,nav,button,input,select,textarea,[aria-hidden="true"],.sb-tts-fab,.sb-tts-panel').forEach(el=>el.remove());
    return (clone.innerText || clone.textContent || '').replace(/\s+/g,' ').trim();
  }

  function speak(text) {
    if (!text) return;
    synth.cancel();
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = 'id-ID';
    if (selectedVoice) currentUtterance.voice = selectedVoice;
    currentUtterance.rate = parseFloat(localStorage.getItem(RATE_KEY) || '1');
    currentUtterance.pitch = 1;
    currentUtterance.onstart = () => { if(button) button.setAttribute('aria-label','Jeda pembacaan'); };
    currentUtterance.onend = () => { if(button) button.setAttribute('aria-label','Bacakan halaman'); };
    synth.speak(currentUtterance);
  }

  function toggleSpeak() {
    if (synth.speaking && !synth.paused) { synth.pause(); return; }
    if (synth.paused) { synth.resume(); return; }
    speak(getReadableText());
  }

  function injectUI() {
    if (document.querySelector('.sb-tts-fab')) return;
    button = document.createElement('button');
    button.className='sb-tts-fab';
    button.type='button';
    button.setAttribute('aria-label','Bacakan halaman');
    button.setAttribute('title','Dengarkan halaman');
    button.innerHTML='🔊';
    button.addEventListener('click', toggleSpeak);

    panel=document.createElement('div');
    panel.className='sb-tts-panel';
    panel.setAttribute('aria-label','Pengaturan suara Bahasa Indonesia');
    panel.innerHTML = `
      <button type="button" class="sb-tts-close" aria-label="Tutup pengaturan">×</button>
      <strong>🔊 Suara Bahasa Indonesia</strong>
      <small id="sbTtsStatus">Mendeteksi suara...</small>
      <label>Voice<select id="sbTtsVoiceSelect"></select></label>
      <label>Kecepatan <select id="sbTtsRate">
        <option value="0.8">Lambat</option><option value="1">Normal</option><option value="1.2">Cepat</option>
      </select></label>
      <div class="sb-tts-actions"><button type="button" id="sbTtsTest">Uji suara</button><button type="button" id="sbTtsStop">Stop</button></div>
    `;
    document.body.append(button,panel);

    const rate=document.getElementById('sbTtsRate');
    rate.value=localStorage.getItem(RATE_KEY)||'1';
    rate.addEventListener('change',()=>localStorage.setItem(RATE_KEY,rate.value));
    document.getElementById('sbTtsVoiceSelect').addEventListener('change',e=>{
      selectedVoice=getIndonesianVoices().find(v=>v.voiceURI===e.target.value)||null;
      if(selectedVoice) localStorage.setItem(STORAGE_KEY,selectedVoice.voiceURI);
    });
    document.getElementById('sbTtsTest').addEventListener('click',()=>speak('Halo, ini adalah suara Bahasa Indonesia untuk website Srilex Buditra.'));
    document.getElementById('sbTtsStop').addEventListener('click',()=>synth.cancel());
    panel.querySelector('.sb-tts-close').addEventListener('click',()=>panel.classList.remove('open'));
    button.addEventListener('contextmenu',e=>{e.preventDefault(); panel.classList.toggle('open');});
    button.addEventListener('dblclick',()=>panel.classList.toggle('open'));
  }

  function injectStyle() {
    const s=document.createElement('style');
    s.textContent=`.sb-tts-fab{position:fixed;right:22px;bottom:22px;z-index:9999;width:54px;height:54px;border-radius:50%;border:1px solid rgba(255,215,120,.55);background:rgba(20,20,24,.96);color:#f5cf7a;font-size:22px;box-shadow:0 12px 30px rgba(0,0,0,.35);cursor:pointer;transition:transform .2s ease,box-shadow .2s ease}.sb-tts-fab:hover,.sb-tts-fab:focus-visible{transform:translateY(-3px) scale(1.04);box-shadow:0 18px 38px rgba(0,0,0,.5);outline:none}.sb-tts-panel{position:fixed;right:22px;bottom:86px;z-index:10000;width:min(310px,calc(100vw - 32px));padding:16px;border:1px solid rgba(255,215,120,.28);border-radius:16px;background:rgba(18,18,22,.98);color:#fff;box-shadow:0 20px 55px rgba(0,0,0,.5);display:none}.sb-tts-panel.open{display:block}.sb-tts-panel strong,.sb-tts-panel small,.sb-tts-panel label{display:block;margin-bottom:10px}.sb-tts-panel small{opacity:.72}.sb-tts-panel select{width:100%;margin-top:5px;padding:9px;border-radius:9px;background:#101014;color:#fff;border:1px solid rgba(255,255,255,.16)}.sb-tts-actions{display:flex;gap:8px}.sb-tts-actions button{flex:1;padding:9px;border-radius:9px;border:1px solid rgba(255,215,120,.35);background:transparent;color:#f5cf7a;cursor:pointer}.sb-tts-close{position:absolute;right:10px;top:7px;background:none;border:0;color:#fff;font-size:24px;cursor:pointer}@media(max-width:600px){.sb-tts-fab{right:16px;bottom:16px;width:50px;height:50px}.sb-tts-panel{right:16px;bottom:76px}}`;
    document.head.appendChild(s);
  }

  document.addEventListener('DOMContentLoaded',()=>{injectStyle();injectUI();refreshVoices();});
  synth.addEventListener('voiceschanged', refreshVoices);
  setTimeout(refreshVoices, 500);
  setTimeout(refreshVoices, 1500);
})();
