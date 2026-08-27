const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const menuToggle = $('#menuToggle');
const nav = $('#mainNav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
});
$$('#mainNav a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded','false');
  menuToggle?.setAttribute('aria-label','Buka menu');
}));
document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && nav.classList.contains('open')){
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded','false');
    menuToggle?.setAttribute('aria-label','Buka menu');
    menuToggle?.focus();
  }
});
document.addEventListener('click', e => {
  if(window.innerWidth <= 760 && nav.classList.contains('open') && !nav.contains(e.target) && !menuToggle.contains(e.target)){
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded','false');
    menuToggle?.setAttribute('aria-label','Buka menu');
  }
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:.12});
$$('.reveal').forEach(el => revealObserver.observe(el));

const basePrices = {
  'Website Company Profile': 2500000,
  'Web Application': 5000000,
  'REST API / Backend': 4500000,
  'Sistem Informasi Custom': 7500000,
  'Database Development': 3500000,
  'Deployment & Cloud': 2500000
};

let selectedPackage = 5000000;
let selectedPackageName = 'Professional';

function formatIDR(n){
  return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
}
function updateEstimate(){
  const project = $('#project').value;
  const extra = Number($('#extra').value || 0);
  const total = selectedPackage ? Math.max(selectedPackage, basePrices[project] || 0) + extra : (basePrices[project] || 0) + extra;
  $('#total').textContent = formatIDR(total);
  $('#chosen').textContent = project;
  $('#extraText').textContent = $('#extra').selectedOptions[0].text.replace(/\s*\(\+.*\)/,'');
  const pct = Math.min(100, Math.max(18, Math.round((total / 15000000) * 100)));
  document.querySelector('.estimate-meter span').style.width = pct + '%';
  return total;
}
$$('.package').forEach(btn => btn.addEventListener('click', () => {
  $$('.package').forEach(x => x.classList.remove('selected'));
  btn.classList.add('selected');
  selectedPackage = Number(btn.dataset.price || 0);
  selectedPackageName = btn.dataset.package;
  if(btn.dataset.price === '0'){
    $('#estimasi').scrollIntoView({behavior:'smooth'});
  } else {
    updateEstimate();
    $('#estimasi').scrollIntoView({behavior:'smooth'});
  }
}));
$('#project')?.addEventListener('change', updateEstimate);
$('#extra')?.addEventListener('change', updateEstimate);

$('#estimateForm')?.addEventListener('submit', e => {
  e.preventDefault();
  updateEstimate();
  $('#result').classList.add('pulse-result');
  setTimeout(()=>$('#result').classList.remove('pulse-result'),700);
  $('#result').scrollIntoView({behavior:'smooth',block:'center'});
});

$('#waBtn')?.addEventListener('click', () => {
  const total = updateEstimate();
  const msg = [
    'Halo Srilex Buditra, saya tertarik konsultasi project.',
    '',
    `Nama: ${$('#name').value}`,
    `Perusahaan: ${$('#company').value || '-'}`,
    `Email: ${$('#email').value}`,
    `WhatsApp: ${$('#whatsapp').value || '-'}`,
    `Jenis Project: ${$('#project').value}`,
    `Fitur Tambahan: ${$('#extra').selectedOptions[0].text}`,
    `Estimasi Awal: ${formatIDR(total)}`,
    `Deskripsi: ${$('#description').value || '-'}`
  ].join('\n');
  window.open('https://wa.me/6282136238350?text=' + encodeURIComponent(msg),'_blank','noopener');
});
$('#pdfBtn')?.addEventListener('click', () => window.print());

const sections = $$('main section[id], main section.hero');
const navLinks = $$('#mainNav a[href^="#"]');
const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const id = entry.target.id || 'beranda';
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#'+id));
    }
  });
},{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(s => activeObserver.observe(s));

updateEstimate();
