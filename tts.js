(function () {
  'use strict';

  var wrap = document.getElementById('ttsFabWrap');
  var fab = document.getElementById('ttsFab');
  var stop = document.getElementById('ttsStop');
  var label = document.getElementById('ttsFabLabel');

  if (!wrap || !fab || !stop || !('speechSynthesis' in window) ||
      !('SpeechSynthesisUtterance' in window)) {
    if (wrap) wrap.style.display = 'none';
    return;
  }

  /* Injected here so portfolio sub-pages keep their original visual CSS. */
  var style = document.createElement('style');
  style.id = 'srilex-tts-style';
  style.textContent = `
    .tts-fab-wrap{
      position:fixed;left:max(14px,env(safe-area-inset-left));right:auto;
      bottom:max(18px,env(safe-area-inset-bottom));z-index:2147483000;
      display:flex;align-items:center;gap:8px;direction:ltr;font-family:inherit;
    }
    .tts-fab{
      width:54px;height:54px;border:1px solid #ffcc45;border-radius:50%;
      background:linear-gradient(180deg,#ffd04d,#eaa400);color:#07131c;
      display:grid;place-items:center;cursor:pointer;
      box-shadow:0 14px 32px #0008,0 0 0 0 #ffb51b55;
      transition:transform .2s ease,box-shadow .2s ease,filter .2s ease;
      position:relative;padding:0;
    }
    .tts-fab:hover,.tts-fab:focus-visible{
      transform:translateY(-3px) scale(1.04);filter:brightness(1.05);
      box-shadow:0 18px 38px #0009,0 0 0 5px #ffb51b18;outline:0;
    }
    .tts-fab:active{transform:translateY(0) scale(.96)}
    .tts-fab.is-speaking{animation:ttsPulse 1.45s infinite}
    .tts-fab svg{width:23px;height:23px;fill:currentColor}
    .tts-fab-label{
      position:absolute;left:calc(100% + 11px);right:auto;white-space:nowrap;
      background:#031a2d;color:#dceaf2;border:1px solid #1c5c7b;
      border-radius:10px;padding:8px 10px;font-size:10px;font-weight:800;
      letter-spacing:.2px;opacity:0;pointer-events:none;transform:translateX(-6px);
      transition:.2s;box-shadow:0 10px 25px #0007;
    }
    .tts-fab:hover .tts-fab-label,.tts-fab:focus-visible .tts-fab-label{
      opacity:1;transform:translateX(0)
    }
    .tts-stop{
      width:34px;height:34px;border:1px solid #245f7f;border-radius:50%;
      background:#06243a;color:#c7dce8;display:grid;place-items:center;
      cursor:pointer;opacity:0;transform:scale(.75);pointer-events:none;
      transition:.2s;padding:0;
    }
    .tts-fab-wrap:hover .tts-stop,.tts-fab-wrap:focus-within .tts-stop,
    .tts-fab-wrap.is-active .tts-stop{
      opacity:1;transform:scale(1);pointer-events:auto
    }
    .tts-stop:hover,.tts-stop:focus-visible{border-color:#ffcc45;color:#ffcc45;outline:0}
    .tts-stop svg{width:13px;height:13px;fill:currentColor}
    .tts-read-highlight{
      background:rgba(255,204,69,.34)!important;color:inherit!important;
      border-radius:4px;box-shadow:0 0 0 2px rgba(255,204,69,.14);
      transition:background .18s ease,box-shadow .18s ease;
    }
    @keyframes ttsPulse{
      0%,100%{box-shadow:0 14px 32px #0008,0 0 0 0 #ffb51b55}
      50%{box-shadow:0 14px 32px #0008,0 0 0 10px #ffb51b00}
    }
    @media(max-width:760px){
      .tts-fab-wrap{
        left:max(10px,env(safe-area-inset-left));
        bottom:max(12px,env(safe-area-inset-bottom))
      }
      .tts-fab{width:50px;height:50px}
      .tts-fab-label{display:none}
      .tts-stop{opacity:1;transform:scale(1);pointer-events:auto;width:32px;height:32px}
    }
    @media(prefers-reduced-motion:reduce){
      .tts-fab,.tts-stop,.tts-fab-label,.tts-read-highlight{transition:none}
      .tts-fab.is-speaking{animation:none}
    }
  `;
  document.head.appendChild(style);

  var synth = window.speechSynthesis;
  var queue = [];
  var currentIndex = -1;
  var currentUtterance = null;
  var state = 'idle';
  var prepared = false;
  var ipLocalePromise = null;
  var ttsSettings = null;

  var countryFallback = {
    ID:'id-ID', MY:'ms-MY', SG:'en-SG', BN:'ms-BN', PH:'en-PH',
    US:'en-US', CA:'en-CA', GB:'en-GB', AU:'en-AU', NZ:'en-NZ', IE:'en-IE',
    IN:'hi-IN', PK:'ur-PK', BD:'bn-BD', LK:'si-LK', NP:'ne-NP',
    CN:'zh-CN', TW:'zh-TW', HK:'zh-HK', MO:'zh-MO', JP:'ja-JP', KR:'ko-KR',
    VN:'vi-VN', TH:'th-TH', KH:'km-KH', LA:'lo-LA', MM:'my-MM',
    DE:'de-DE', AT:'de-AT', CH:'de-CH', FR:'fr-FR', BE:'fr-BE', LU:'fr-LU',
    ES:'es-ES', MX:'es-MX', AR:'es-AR', CL:'es-CL', CO:'es-CO', PE:'es-PE',
    BR:'pt-BR', PT:'pt-PT', IT:'it-IT', NL:'nl-NL', SE:'sv-SE', NO:'nb-NO',
    DK:'da-DK', FI:'fi-FI', PL:'pl-PL', CZ:'cs-CZ', SK:'sk-SK', HU:'hu-HU',
    RO:'ro-RO', BG:'bg-BG', GR:'el-GR', TR:'tr-TR', RU:'ru-RU', UA:'uk-UA',
    IL:'he-IL', SA:'ar-SA', AE:'ar-AE', EG:'ar-EG',
    ZA:'en-ZA', NG:'en-NG', KE:'en-KE', GH:'en-GH'
  };

  function setState(next) {
    state = next;
    var active = next === 'speaking' || next === 'paused';
    fab.classList.toggle('is-speaking', next === 'speaking');
    fab.setAttribute('aria-pressed', active ? 'true' : 'false');
    wrap.classList.toggle('is-active', active);

    if (next === 'speaking') {
      label.textContent = 'Jeda pembacaan';
      fab.setAttribute('aria-label', 'Jeda pembacaan');
    } else if (next === 'paused') {
      label.textContent = 'Lanjutkan pembacaan';
      fab.setAttribute('aria-label', 'Lanjutkan pembacaan');
    } else {
      label.textContent = 'Bacakan halaman';
      fab.setAttribute('aria-label', 'Bacakan halaman');
    }
  }

  function clearHighlight() {
    document.querySelectorAll('.tts-read-highlight').forEach(function (el) {
      el.classList.remove('tts-read-highlight');
    });
  }

  function prepareText() {
    if (prepared) return queue;
    prepared = true;
    queue = [];

    var root = document.querySelector('main') || document.body;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var p = node.parentElement;
        if (!p || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (p.closest('script,style,noscript,textarea,input,button,select,option,pre,code,[hidden],.tts-fab-wrap')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(function (node) {
      var parts = node.nodeValue.split(/(?<=[.!?。！？])(?=\s)/);
      var frag = document.createDocumentFragment();

      parts.forEach(function (part) {
        if (!part) return;
        var span = document.createElement('span');
        span.className = 'tts-read-segment';
        span.textContent = part;
        frag.appendChild(span);
        queue.push(span);
      });

      node.parentNode.replaceChild(frag, node);
    });

    return queue;
  }

  function visible(el) {
    var r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  }

  function highlight(index) {
    clearHighlight();
    var el = queue[index];
    if (!el) return;
    el.classList.add('tts-read-highlight');
    if (!visible(el)) {
      el.scrollIntoView({behavior:'smooth', block:'center', inline:'nearest'});
    }
  }

  function getBrowserLocale() {
    var lang = (navigator.languages && navigator.languages[0]) ||
      navigator.language || document.documentElement.lang || 'en-US';
    return lang.replace('_', '-');
  }

  function parseLocale(value) {
    if (!value) return null;
    var first = String(value).split(',')[0].trim().replace('_', '-');
    return /^[a-z]{2,3}(-[A-Z]{2,3})?$/i.test(first) ? first : null;
  }

  function detectLocaleByIP() {
    if (ipLocalePromise) return ipLocalePromise;

    ipLocalePromise = fetch('https://ipapi.co/json/', {
      headers: {'Accept':'application/json'},
      signal: ('AbortController' in window) ? (function () {
        var c = new AbortController();
        setTimeout(function () { c.abort(); }, 2800);
        return c.signal;
      })() : undefined
    }).then(function (r) {
      if (!r.ok) throw new Error('IP lookup failed');
      return r.json();
    }).then(function (data) {
      var fromLanguages = parseLocale(data.languages);
      if (fromLanguages) return fromLanguages;
      var country = String(data.country_code || '').toUpperCase();
      return countryFallback[country] || null;
    }).catch(function () {
      return null;
    });

    return ipLocalePromise;
  }

  function voiceFor(locale, voices) {
    if (!locale) return null;
    var base = locale.split('-')[0].toLowerCase();

    var exact = voices.find(function (v) {
      return String(v.lang || '').toLowerCase() === locale.toLowerCase();
    });
    if (exact) return exact;

    return voices.find(function (v) {
      return String(v.lang || '').toLowerCase().split('-')[0] === base;
    }) || null;
  }

  function waitForVoices() {
    var voices = synth.getVoices();
    if (voices.length || !('onvoiceschanged' in synth)) return Promise.resolve(voices);

    return new Promise(function (resolve) {
      var done = false;

      function finish() {
        if (done) return;
        done = true;
        clearTimeout(timer);
        synth.removeEventListener('voiceschanged', onChange);
        resolve(synth.getVoices());
      }

      function onChange() { finish(); }

      var timer = setTimeout(finish, 900);
      synth.addEventListener('voiceschanged', onChange);
    });
  }

  async function chooseLanguageAndVoice() {
    var voices = await waitForVoices();

    /* 1) Indonesian is always the first preference. */
    var idVoice = voiceFor('id-ID', voices);
    if (idVoice) return {locale:idVoice.lang || 'id-ID', voice:idVoice};

    /* 2) If Indonesian is unavailable, determine the visitor language from IP/country. */
    var ipLocale = await detectLocaleByIP();
    var ipVoice = voiceFor(ipLocale, voices);
    if (ipVoice) return {locale:ipVoice.lang || ipLocale, voice:ipVoice};

    /* If the platform can synthesize the IP language without an installed voice. */
    if (ipLocale) return {locale:ipLocale, voice:null};

    /* 3) Final fallback: browser/device language. */
    var browserLocale = getBrowserLocale();
    var browserVoice = voiceFor(browserLocale, voices);

    return {
      locale: browserVoice ? (browserVoice.lang || browserLocale) : browserLocale,
      voice: browserVoice || null
    };
  }

  function speakNext() {
    if (state !== 'speaking' || currentIndex >= queue.length) {
      if (currentIndex >= queue.length) finish();
      return;
    }

    var el = queue[currentIndex];
    if (!el || !el.textContent.trim()) {
      currentIndex++;
      speakNext();
      return;
    }

    highlight(currentIndex);

    currentUtterance = new SpeechSynthesisUtterance(el.textContent.trim());
    currentUtterance.rate = 0.95;
    currentUtterance.pitch = 1;
    currentUtterance.volume = 1;

    var settings = ttsSettings || {locale:'id-ID', voice:null};
    currentUtterance.lang = settings.locale || 'id-ID';
    if (settings.voice) currentUtterance.voice = settings.voice;

    currentUtterance.onend = function () {
      currentIndex++;
      if (state === 'speaking') speakNext();
    };

    currentUtterance.onerror = function () {
      currentIndex++;
      if (state === 'speaking') speakNext();
    };

    synth.speak(currentUtterance);
  }

  function finish() {
    synth.cancel();
    currentUtterance = null;
    currentIndex = -1;
    clearHighlight();
    setState('idle');
  }

  async function start() {
    var textQueue = prepareText();
    if (!textQueue.length) return;

    synth.cancel();
    currentIndex = 0;
    setState('speaking');
    ttsSettings = await chooseLanguageAndVoice();

    if (state === 'speaking') speakNext();
  }

  fab.addEventListener('click', function () {
    if (state === 'speaking') {
      synth.pause();
      setState('paused');
    } else if (state === 'paused') {
      setState('speaking');
      if (synth.speaking) synth.resume();
      else speakNext();
    } else {
      start();
    }
  });

  stop.addEventListener('click', finish);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden && state === 'speaking') {
      synth.pause();
      setState('paused');
    }
  });

  window.addEventListener('beforeunload', function () {
    synth.cancel();
  });

  if ('onvoiceschanged' in synth) {
    synth.onvoiceschanged = function () { synth.getVoices(); };
  }

  synth.getVoices();
  setState('idle');
})();
