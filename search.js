(() => {
  const q = document.getElementById('q');
  const form = document.getElementById('searchForm');
  const results = document.getElementById('results');
  const count = document.getElementById('count');
  const panel = document.getElementById('searchPanel');
  const suggestions = document.getElementById('suggestions');
  const historyBox = document.getElementById('history');
  const trendingBox = document.getElementById('trending');
  const clear = document.getElementById('clearHistory');
  const filters = document.getElementById('searchFilters');
  if (!q || !form || !results) return;

  const KEY = 'srilex-search-history-v1';
  const trending = ['Website Company Profile','Web Application','REST API','Sistem Informasi','Database Development','Deployment Cloud','Portfolio','Harga Website','SEO'];
  let index = [];
  let activeCategory = new URLSearchParams(location.search).get('category') || 'All';
  let activeSuggestion = -1;

  const esc = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const regexEscape = s => String(s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const highlight = (text, term) => {
    const safe = esc(text);
    const words = String(term || '').trim().split(/\s+/).filter(Boolean).sort((a,b)=>b.length-a.length);
    if (!words.length) return safe;
    return safe.replace(new RegExp('(' + words.map(regexEscape).join('|') + ')', 'gi'), '<mark>$1</mark>');
  };
  const history = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch(e) { return []; } };
  const saveHistory = term => {
    term = String(term || '').trim(); if (!term) return;
    const h = history().filter(x => x.toLowerCase() !== term.toLowerCase());
    h.unshift(term); localStorage.setItem(KEY, JSON.stringify(h.slice(0,8)));
  };
  function score(x, term) {
    const words = String(term).toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return 0;
    const title = (x.title || '').toLowerCase(), desc = (x.description || '').toLowerCase(), content = (x.content || '').toLowerCase();
    let n = 0;
    words.forEach(w => { if(title.includes(w)) n += 100; if(desc.includes(w)) n += 45; if(content.includes(w)) n += 20; });
    return n;
  }
  function matchesFor(term) {
    return index.map(x => ({x, s:score(x, term)})).filter(v => v.s > 0).sort((a,b)=>b.s-a.s);
  }
  function renderFilters() {
    if (!filters) return;
    filters.querySelectorAll('.search-filter').forEach(b => {
      const active = b.dataset.category === activeCategory;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }
  function run(term, replace=true) {
    term = String(term || '').trim(); q.value = term;
    renderFilters();
    if (!term) {
      count.textContent = 'Cari berdasarkan kata kunci atau pilih topik di bawah.';
      results.innerHTML = '<div class="empty">Gunakan pencarian di atas untuk menemukan layanan, portfolio, dan jawaban FAQ.</div>';
      return;
    }
    saveHistory(term);
    const allFound = matchesFor(term);
    const found = activeCategory === 'All' ? allFound : allFound.filter(v => (v.x.category || 'Info') === activeCategory);
    const suffix = activeCategory === 'All' ? '' : ' di kategori ' + activeCategory;
    count.textContent = `${found.length} hasil untuk “${term}”${suffix}`;
    results.innerHTML = found.length ? found.map(({x}) => {
      const cat = x.category || 'Info';
      return `<article class="result" data-category="${esc(cat)}">
        <div class="result-meta"><span class="mini-label">${esc(cat)}</span><span class="result-key">Ditemukan</span></div>
        <h3><a href="${esc(x.url)}">${highlight(x.title, term)}</a></h3>
        <p>${highlight(x.description, term)}</p>
        <a class="btn outline" href="${esc(x.url)}">Buka bagian →</a>
      </article>`;
    }).join('') : `<div class="empty">Tidak ada hasil${activeCategory === 'All' ? '' : ' pada kategori ' + esc(activeCategory)}. Coba filter lain atau kata kunci seperti “website”, “API”, “harga”, atau “portfolio”.</div>`;
    if (replace) {
      const params = new URLSearchParams(); params.set('q', term); if(activeCategory !== 'All') params.set('category', activeCategory);
      history.replaceState(null, '', `/search.html?${params.toString()}`);
    }
    renderHistory();
  }
  function chip(text, target, clock=false) {
    const b = document.createElement('button'); b.type='button'; b.className='search-chip';
    b.textContent = (clock ? '◷ ' : '') + text;
    b.onclick = () => { q.value = text; panel.hidden = true; run(text); };
    target.appendChild(b);
  }
  function renderHistory() {
    if(!historyBox) return; historyBox.innerHTML=''; const h=history();
    if(h.length) h.forEach(x=>chip(x,historyBox,true));
    else historyBox.innerHTML='<span style="color:#638095;font-size:10px">Belum ada riwayat di perangkat ini.</span>';
  }
  function renderTrending() { if(!trendingBox) return; trendingBox.innerHTML=''; trending.forEach(x=>chip(x,trendingBox)); }
  function suggestionItems() { return Array.from(suggestions ? suggestions.querySelectorAll('.search-suggestion') : []); }
  function setActiveSuggestion(next) {
    const items=suggestionItems(); if(!items.length){activeSuggestion=-1;return;}
    activeSuggestion=((next%items.length)+items.length)%items.length;
    items.forEach((el,i)=>{const on=i===activeSuggestion;el.classList.toggle('is-active',on);el.setAttribute('aria-selected',on?'true':'false');});
    items[activeSuggestion].scrollIntoView({block:'nearest'});
  }
  function chooseSuggestion(i=activeSuggestion) {
    const items=suggestionItems(); if(i<0 || !items[i]) return false;
    const value=items[i].dataset.value || q.value; q.value=value; panel.hidden=true; run(value); return true;
  }
  function updateSuggest() {
    const term=q.value.trim(); const lower=term.toLowerCase();
    panel.hidden=false; activeSuggestion=-1; if(suggestions) suggestions.innerHTML='';
    const found=lower ? index.filter(x => [x.title,x.description,x.content].join(' ').toLowerCase().includes(lower)).slice(0,6) : index.slice(0,5);
    const list=found.length ? found : (term ? [{title:`Cari “${term}”`,description:'Gunakan kata kunci ini untuk pencarian lengkap.'}] : []);
    list.forEach(x=>{
      const value=x.title.startsWith('Cari “') ? term : x.title;
      const b=document.createElement('button'); b.type='button'; b.className='search-suggestion'; b.dataset.value=value; b.setAttribute('role','option');
      b.innerHTML=`<strong>⌕</strong><span class="suggestion-copy"><b>${highlight(x.title, term)}</b><small>${highlight(x.description||'', term)}</small></span><span class="suggestion-enter">↵</span>`;
      b.onclick=()=>{q.value=value;panel.hidden=true;run(value)}; suggestions.appendChild(b);
    });
    renderHistory(); renderTrending();
  }
  q.addEventListener('focus', updateSuggest);
  q.addEventListener('input', updateSuggest);
  q.addEventListener('keydown', e => {
    if(e.key==='ArrowDown'){e.preventDefault(); if(panel.hidden) updateSuggest(); setActiveSuggestion(activeSuggestion+1);}
    else if(e.key==='ArrowUp'){e.preventDefault(); setActiveSuggestion(activeSuggestion-1);}
    else if(e.key==='Enter' && activeSuggestion>=0){e.preventDefault(); chooseSuggestion();}
    else if(e.key==='Escape'){panel.hidden=true;activeSuggestion=-1;q.blur();}
  });
  form.addEventListener('submit', e=>{e.preventDefault(); if(activeSuggestion>=0 && chooseSuggestion()) return; panel.hidden=true; run(q.value);});
  clear && clear.addEventListener('click',()=>{localStorage.removeItem(KEY);renderHistory()});
  filters && filters.addEventListener('click', e=>{
    const b=e.target.closest('.search-filter'); if(!b) return;
    activeCategory=b.dataset.category || 'All'; renderFilters(); run(q.value || new URLSearchParams(location.search).get('q') || '', true);
  });
  document.addEventListener('click', e=>{if(!form.contains(e.target)) panel.hidden=true});
  fetch('/search-index.json').then(r=>r.json()).then(d=>{
    index=Array.isArray(d)?d:[];
    const params=new URLSearchParams(location.search); activeCategory=params.get('category') || 'All';
    const allowed=['All','Layanan','Portfolio','FAQ']; if(!allowed.includes(activeCategory)) activeCategory='All';
    renderFilters(); run(params.get('q')||'', false); renderHistory(); renderTrending();
  }).catch(()=>{results.innerHTML='<div class="empty">Indeks pencarian belum dapat dimuat.</div>';});
})();
