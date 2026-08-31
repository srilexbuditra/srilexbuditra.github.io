
const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

const state = { data:null };

async function loadData(){
  try{
    const res = await fetch('data/project.json');
    state.data = await res.json();
    renderFeatures();
    renderProcess();
    renderTech();
  }catch(err){
    console.warn('Data JSON tidak bisa dimuat. Konten HTML tetap tersedia.', err);
  }
}

function renderFeatures(){
  const grid = $('#featureGrid');
  if(!grid || !state.data) return;
  grid.innerHTML = state.data.features.map(f => `
    <article class="feature reveal">
      <img src="assets/icons/${f[0]}.svg" alt="">
      <h3>${f[1]}</h3>
      <p>${f[2]}</p>
    </article>
  `).join('');
}

function renderProcess(){
  const grid = $('#processGrid');
  if(!grid || !state.data) return;
  grid.innerHTML = state.data.process.map(p => `
    <article class="step reveal">
      <div class="num">${p[0]}</div>
      <h3>${p[1]}</h3>
      <p>${p[2]}</p>
    </article>
  `).join('');
}

function renderTech(){
  const chips = $('#techChips');
  if(!chips || !state.data) return;
  chips.innerHTML = state.data.tech.map(t => `<span class="chip">${t}</span>`).join('');
}

function setupNav(){
  const nav = $('#nav');
  const menu = $('#menuBtn');
  const links = $$('.navlinks a');
  const sections = $$('main section[id]');

  addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 20);
    const y = scrollY + 150;
    let current = sections[0]?.id;
    sections.forEach(s => { if(y >= s.offsetTop) current = s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#'+current));
  }, {passive:true});

  menu?.addEventListener('click', () => {
    const navlinks = $('.navlinks');
    const open = navlinks.dataset.open === '1';
    navlinks.dataset.open = open ? '0' : '1';
    navlinks.style.display = open ? '' : 'flex';
    navlinks.style.position = 'absolute';
    navlinks.style.right = '4vw';
    navlinks.style.top = '68px';
    navlinks.style.flexDirection = 'column';
    navlinks.style.background = '#0c121a';
    navlinks.style.padding = '18px';
    navlinks.style.borderRadius = '16px';
    navlinks.style.boxShadow = '0 20px 50px #0006';
  });

  links.forEach(a => a.addEventListener('click', () => {
    if(innerWidth < 950) $('.navlinks').style.display = '';
  }));
}

function setupReveal(){
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('show'); });
  }, {threshold:.12});
  $$('.reveal').forEach(el => io.observe(el));
}

function setupModal(){
  const modal = $('#modal');
  const close = $('.modal-close', modal);
  $$('.open-case').forEach(btn => btn.addEventListener('click', () => {
    modal.classList.add('open');
    document.body.classList.add('lock');
  }));
  close.addEventListener('click', () => {
    modal.classList.remove('open'); document.body.classList.remove('lock');
  });
  modal.addEventListener('click', e => {
    if(e.target === modal){ modal.classList.remove('open'); document.body.classList.remove('lock'); }
  });
  addEventListener('keydown', e => {
    if(e.key === 'Escape'){ modal.classList.remove('open'); document.body.classList.remove('lock'); }
  });
}

function setupYear(){ $$('.year').forEach(el => el.textContent = new Date().getFullYear()); }

document.addEventListener('DOMContentLoaded', () => {
  setupNav(); setupReveal(); setupModal(); setupYear(); loadData();
});
