(() => {
  const input=document.getElementById('siteSearchInput');
  const form=document.getElementById('siteSearchForm');
  const panel=document.getElementById('siteSearchPanel');
  const suggestions=document.getElementById('siteSearchSuggestions');
  const historyBox=document.getElementById('siteSearchHistory');
  const trendingBox=document.getElementById('siteSearchTrending');
  const clearBtn=document.getElementById('clearSearchHistory');
  if(!input||!form||!panel)return;
  const KEY='srilex-search-history-v1'; let active=-1;
  const trending=['Website Company Profile','Web Application','REST API','Sistem Informasi','Database Development','Deployment Cloud','Portfolio','Harga Website','SEO','Full Stack Developer Bengkulu'];
  const phrases=[['website','Website Company Profile'],['aplikasi','Web Application'],['api','REST API / Backend'],['backend','Backend Development'],['database','Database Development'],['cloud','Deployment & Cloud'],['portfolio','Featured Projects'],['harga','Paket & Harga'],['estimasi','Hitung Estimasi Project'],['seo','Technical SEO'],['sekolah','Website Sekolah'],['pos','Aplikasi POS'],['administrasi','Sistem Administrasi'],['react','Frontend React'],['node','Node.js Backend']];
  const getHistory=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}};
  const setHistory=v=>localStorage.setItem(KEY,JSON.stringify(v.slice(0,8)));
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const reEsc=s=>String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const hi=(text,term)=>{let safe=esc(text),w=String(term||'').trim().split(/\s+/).filter(Boolean);return w.length?safe.replace(new RegExp('('+w.map(reEsc).join('|')+')','gi'),'<mark>$1</mark>'):safe};
  function chip(text,target,type='history'){const b=document.createElement('button');b.type='button';b.className='search-chip';b.textContent=(type==='history'?'◷ ':'')+text;b.addEventListener('click',()=>go(text));target.appendChild(b)}
  function renderHistory(){historyBox.innerHTML='';const h=getHistory();if(h.length)h.forEach(x=>chip(x,historyBox));else historyBox.innerHTML='<span style="color:#638095;font-size:10px">Belum ada riwayat di perangkat ini.</span>'}
  function renderTrending(){trendingBox.innerHTML='';trending.forEach(x=>chip(x,trendingBox,'trend'))}
  function go(term){term=String(term||'').trim();if(!term)return;const h=getHistory().filter(x=>x.toLowerCase()!==term.toLowerCase());h.unshift(term);setHistory(h);location.href='/search.html?q='+encodeURIComponent(term)}
  function items(){return Array.from(suggestions.querySelectorAll('.search-suggestion'))}
  function activate(i){const a=items();if(!a.length){active=-1;return;}active=((i%a.length)+a.length)%a.length;a.forEach((b,n)=>b.classList.toggle('is-active',n===active));a[active].scrollIntoView({block:'nearest'})}
  function update(){const raw=input.value.trim(),q=raw.toLowerCase();panel.hidden=false;input.setAttribute('aria-expanded','true');renderHistory();renderTrending();suggestions.innerHTML='';active=-1;if(q){const matches=phrases.filter(([k,v])=>k.includes(q)||v.toLowerCase().includes(q)).slice(0,6);if(!matches.length)matches.push([q,'Cari "'+raw+'"']);matches.forEach(([k,v])=>{const b=document.createElement('button');b.type='button';b.className='search-suggestion';b.dataset.value=v.startsWith('Cari "')?raw:v;b.innerHTML='<strong>⌕</strong><span class="suggestion-copy"><b>'+hi(v,raw)+'</b><small>Tekan Enter untuk mencari</small></span><span class="suggestion-enter">↵</span>';b.addEventListener('click',()=>go(b.dataset.value));suggestions.appendChild(b)})}else suggestions.innerHTML='<span style="color:#638095;font-size:10px;padding:3px 1px">Mulai mengetik untuk melihat saran dan autocomplete.</span>'}
  input.addEventListener('focus',update);input.addEventListener('input',update);
  input.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();if(panel.hidden)update();activate(active+1)}else if(e.key==='ArrowUp'){e.preventDefault();activate(active-1)}else if(e.key==='Enter'&&active>=0){e.preventDefault();const a=items()[active];if(a)go(a.dataset.value)}else if(e.key==='Escape'){panel.hidden=true;active=-1;input.setAttribute('aria-expanded','false')}});
  form.addEventListener('submit',e=>{e.preventDefault();if(active>=0){const a=items()[active];if(a){go(a.dataset.value);return}}go(input.value)});
  clearBtn&&clearBtn.addEventListener('click',()=>{localStorage.removeItem(KEY);renderHistory()});document.addEventListener('click',e=>{if(!form.contains(e.target)){panel.hidden=true;active=-1;input.setAttribute('aria-expanded','false')}});
})();
