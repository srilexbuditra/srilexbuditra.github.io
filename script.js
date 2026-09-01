const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

// Privacy + agreement gate: action buttons remain locked until consent and both signatures are complete.
const privacyConsentCheckbox = $('#privacyConsentCheckbox');
const agreementCheckbox = $('#agreementCheckbox');
const waBtn = $('#waBtn');
const pdfBtn = $('#pdfBtn');
const agreementStatus = $('#agreementStatus');
const clientSignerName = $('#clientSignerName');

const signaturePads = {};
function setupSignaturePad(id){
  const canvas = document.getElementById(id);
  if(!canvas) return null;
  const ctx = canvas.getContext('2d');
  ctx.lineCap='round'; ctx.lineJoin='round'; ctx.lineWidth=3; ctx.strokeStyle='#17384b';
  const pad={canvas,ctx,drawing:false,hasSignature:false,lastX:0,lastY:0};
  const pos=e=>{const r=canvas.getBoundingClientRect(); const src=e.touches?.[0]||e; return {x:(src.clientX-r.left)*(canvas.width/r.width),y:(src.clientY-r.top)*(canvas.height/r.height)};};
  const start=e=>{e.preventDefault(); const q=pos(e); pad.drawing=true; pad.hasSignature=true; pad.lastX=q.x; pad.lastY=q.y; updateAgreementState();};
  const move=e=>{if(!pad.drawing)return; e.preventDefault(); const q=pos(e); ctx.beginPath();ctx.moveTo(pad.lastX,pad.lastY);ctx.lineTo(q.x,q.y);ctx.stroke();pad.lastX=q.x;pad.lastY=q.y;};
  const end=e=>{if(!pad.drawing)return; e.preventDefault();pad.drawing=false;updateAgreementState();};
  canvas.addEventListener('pointerdown',start); canvas.addEventListener('pointermove',move); canvas.addEventListener('pointerup',end); canvas.addEventListener('pointercancel',end); canvas.addEventListener('pointerleave',end);
  return pad;
}
signaturePads.provider=setupSignaturePad('providerSignature');
signaturePads.client=setupSignaturePad('clientSignature');

function clearSignature(key){
  const pad=signaturePads[key]; if(!pad)return; pad.ctx.clearRect(0,0,pad.canvas.width,pad.canvas.height);pad.hasSignature=false;updateAgreementState();
}
$$('[data-clear-signature]').forEach(btn=>btn.addEventListener('click',()=>clearSignature(btn.dataset.clearSignature==='providerSignature'?'provider':'client')));

function updateAgreementState(){
  const consented=Boolean(privacyConsentCheckbox?.checked);
  const agreed=Boolean(agreementCheckbox?.checked);
  const signed=Boolean(signaturePads.provider?.hasSignature && signaturePads.client?.hasSignature);
  const ready=consented && agreed && signed;
  [waBtn,pdfBtn].forEach(btn=>{if(!btn)return;btn.disabled=!ready;btn.setAttribute('aria-disabled',ready?'false':'true');});
  if(agreementStatus){agreementStatus.textContent=ready?'Siap diproses':!consented?'Menunggu persetujuan privasi':!agreed?'Menunggu persetujuan kerja sama':!signed?'Menunggu kedua tanda tangan':'Belum lengkap';agreementStatus.classList.toggle('complete',ready);}
  if(clientSignerName){clientSignerName.textContent=$('#name')?.value?.trim()||'Nama klien';}
}
[privacyConsentCheckbox,agreementCheckbox].forEach(el=>{el?.addEventListener('change',updateAgreementState);el?.addEventListener('input',updateAgreementState);});
$('#name')?.addEventListener('input',updateAgreementState);
updateAgreementState();

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

waBtn?.addEventListener('click', () => {
  if (!privacyConsentCheckbox?.checked || !agreementCheckbox?.checked || !signaturePads.provider?.hasSignature || !signaturePads.client?.hasSignature) return;
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
function populatePrintReport(){
  const value = id => document.getElementById(id)?.value?.trim() || '-';
  const text = (id, value) => { const el = document.getElementById(id); if(el) el.textContent = value || '-'; };
  const extraText = $('#extra')?.selectedOptions?.[0]?.text?.replace(/\s*\(\+.*\)/,'') || '-';
  const total = updateEstimate();
  text('printName', value('name'));
  text('printCompany', value('company'));
  text('printEmail', value('email'));
  text('printWhatsapp', value('whatsapp'));
  text('printProject', $('#project')?.value || '-');
  text('printExtra', extraText);
  text('printDescription', value('description'));
  text('printTotal', formatIDR(total));
  const now = new Date();
  text('printDate', now.toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'}));
  text('printRef', `SB-EST-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`);
  const dateText=now.toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'});
  text('printProviderDate',dateText); text('printClientDate',dateText);
  text('printClientSigner',value('name'));
  const providerImg=$('#printProviderSignature'), clientImg=$('#printClientSignature');
  if(providerImg && signaturePads.provider?.hasSignature) providerImg.src=signaturePads.provider.canvas.toDataURL('image/png');
  if(clientImg && signaturePads.client?.hasSignature) clientImg.src=signaturePads.client.canvas.toDataURL('image/png');
}

pdfBtn?.addEventListener('click', () => {
  if (!privacyConsentCheckbox?.checked || !agreementCheckbox?.checked || !signaturePads.provider?.hasSignature || !signaturePads.client?.hasSignature) return;
  populatePrintReport();
  window.print();
});

window.addEventListener('beforeprint', () => {
  if (privacyConsentCheckbox?.checked && agreementCheckbox?.checked && signaturePads.provider?.hasSignature && signaturePads.client?.hasSignature) populatePrintReport();
});

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
