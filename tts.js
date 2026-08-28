(function(){
  'use strict';
  var fab=document.getElementById('ttsFab'), stop=document.getElementById('ttsStop'), wrap=document.getElementById('ttsFabWrap'), label=document.getElementById('ttsFabLabel');
  if(!fab||!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){ if(wrap) wrap.style.display='none'; return; }
  var synth=window.speechSynthesis, utter=null, speaking=false, paused=false;
  function getText(){
    var root=document.querySelector('main')||document.body;
    var clone=root.cloneNode(true);
    clone.querySelectorAll('script,style,noscript,[hidden],.site-search,.tts-fab-wrap').forEach(function(n){n.remove();});
    return clone.innerText.replace(/\s+/g,' ').trim();
  }
  function setState(state){
    speaking=state==='speaking'; paused=state==='paused';
    fab.classList.toggle('is-speaking',speaking);
    fab.setAttribute('aria-pressed',speaking||paused?'true':'false');
    wrap.classList.toggle('is-active',speaking||paused);
    if(state==='speaking'){label.textContent='Jeda pembacaan';fab.setAttribute('aria-label','Jeda pembacaan');}
    else if(state==='paused'){label.textContent='Lanjutkan pembacaan';fab.setAttribute('aria-label','Lanjutkan pembacaan');}
    else{label.textContent='Bacakan halaman';fab.setAttribute('aria-label','Bacakan halaman');}
  }
  function chooseVoice(){var vs=synth.getVoices();return vs.find(function(v){return /^id(-|_)/i.test(v.lang);})||vs.find(function(v){return /^en/i.test(v.lang);})||null;}
  function speak(){
    synth.cancel();
    var text=getText(); if(!text) return;
    utter=new SpeechSynthesisUtterance(text); utter.lang=document.documentElement.lang||'id-ID'; utter.rate=.95; utter.pitch=1;
    var voice=chooseVoice(); if(voice) utter.voice=voice;
    utter.onstart=function(){setState('speaking');};
    utter.onend=function(){setState('idle');};
    utter.onerror=function(){setState('idle');};
    synth.speak(utter); setState('speaking');
  }
  fab.addEventListener('click',function(){
    if(synth.speaking){ if(synth.paused){synth.resume();setState('speaking');}else{synth.pause();setState('paused');} }
    else speak();
  });
  stop.addEventListener('click',function(){synth.cancel();setState('idle');});
  window.addEventListener('beforeunload',function(){synth.cancel();});
  document.addEventListener('visibilitychange',function(){if(document.hidden&&synth.speaking&&!synth.paused){synth.pause();setState('paused');}});
  synth.getVoices(); if('onvoiceschanged' in synth) synth.onvoiceschanged=function(){synth.getVoices();};
  setState('idle');
})();