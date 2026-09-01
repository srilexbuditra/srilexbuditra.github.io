const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

// Privacy + agreement gate: action buttons remain locked until consent and both signatures are complete.
const privacyConsentCheckbox = $('#privacyConsentCheckbox');
const agreementCheckbox = $('#agreementCheckbox');
const waBtn = $('#waBtn');
const pdfBtn = $('#pdfBtn');
const agreementModal = $('#agreementModal');
const confirmAgreementBtn = $('#confirmAgreementBtn');
const agreementStatus = $('#agreementStatus');
const clientSignerName = $('#clientSignerName');
const modalClientName = $('#modalClientName');
let currentDocumentRef = '';
let currentFingerprint = '';

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

function isPrivacyReady(){ return Boolean(privacyConsentCheckbox?.checked); }
function isAgreementReady(){ return isPrivacyReady() && Boolean(agreementCheckbox?.checked) && Boolean(signaturePads.provider?.hasSignature && signaturePads.client?.hasSignature); }
function updateAgreementState(){
  const ready=isAgreementReady();
  if(waBtn){waBtn.disabled=!isPrivacyReady();waBtn.setAttribute('aria-disabled',isPrivacyReady()?'false':'true');}
  if(pdfBtn){pdfBtn.disabled=!isPrivacyReady();pdfBtn.setAttribute('aria-disabled',isPrivacyReady()?'false':'true');}
  if(agreementStatus){agreementStatus.textContent=ready?'Lengkap • siap dibuat':!isPrivacyReady()?'Menunggu persetujuan privasi':!agreementCheckbox?.checked?'Menunggu persetujuan kerja sama':'Menunggu kedua tanda tangan';agreementStatus.classList.toggle('complete',ready);}
  const name=$('#name')?.value?.trim()||'Nama Pemesan';
  if(clientSignerName) clientSignerName.textContent=name;
  if(modalClientName) modalClientName.textContent=name;
}
privacyConsentCheckbox?.addEventListener('change',updateAgreementState);
$('#name')?.addEventListener('input',updateAgreementState);
agreementCheckbox?.addEventListener('change',updateAgreementState);
updateAgreementState();

function openAgreementModal(){
  if(!isPrivacyReady()) return;
  updateAgreementState();
  agreementModal?.classList.add('open'); agreementModal?.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  setTimeout(()=>document.querySelector('#agreementModal .modal-close')?.focus(),30);
}
function closeAgreementModal(){
  agreementModal?.classList.remove('open'); agreementModal?.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}
$$('[data-close-agreement]').forEach(el=>el.addEventListener('click',closeAgreementModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape' && agreementModal?.classList.contains('open')) closeAgreementModal();});

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
  if (!isPrivacyReady()) return;
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
async function sha256Hex(input){
  if(!window.crypto?.subtle) return '';
  const data=new TextEncoder().encode(input); const hash=await crypto.subtle.digest('SHA-256',data);
  return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();
}
const CODE39={
 '0':'101001101101','1':'110100101011','2':'101100101011','3':'110110010101','4':'101001101011','5':'110100110101','6':'101100110101','7':'101001011011','8':'110100101101','9':'101100101101','A':'110101001011','B':'101101001011','C':'110110100101','D':'101011001011','E':'110101100101','F':'101101100101','G':'101010011011','H':'110101001101','I':'101101001101','J':'101011001101','K':'110101010011','L':'101101010011','M':'110110101001','N':'101011010011','O':'110101101001','P':'101101101001','Q':'101010110011','R':'110101011001','S':'101101011001','T':'101011011001','U':'110010101011','V':'100110101011','W':'110011010101','X':'100101101011','Y':'110010110101','Z':'100110110101','-':'100101011011','.':'110010101101',' ':'100110101101','*':'100101101101','/':'100101100101','+':'100100101001','%':'101001001001','$':'100100100101'};
function renderCode39(text){
 const svg=$('#printBarcode'); if(!svg)return; const val=('*'+text.toUpperCase().replace(/[^0-9A-Z.\- $/+%]/g,'').slice(0,24)+'*'); let x=4, bars=[];
 [...val].forEach(ch=>{const pat=CODE39[ch]||CODE39['-']; for(let i=0;i<pat.length;i++){if(pat[i]==='1')bars.push(`<rect x="${x}" y="2" width="2" height="44"/>`);x+=2;}x+=2;});
 svg.setAttribute('viewBox',`0 0 ${x+4} 48`);svg.innerHTML=bars.join('');
}
async function populatePrintReport(){
  const value = id => document.getElementById(id)?.value?.trim() || '-';
  const text = (id, value) => { const el = document.getElementById(id); if(el) el.textContent = value || '-'; };
  const extraText = $('#extra')?.selectedOptions?.[0]?.text?.replace(/\s*\(\+.*\)/,'') || '-';
  const total = updateEstimate(); const now = new Date();
  currentDocumentRef=`SB-EST-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;
  const fingerprintSource=[currentDocumentRef,value('name'),value('company'),value('email'),value('whatsapp'),$('#project')?.value||'',extraText,value('description'),String(total)].join('|');
  currentFingerprint=await sha256Hex(fingerprintSource);
  text('printName', value('name')); text('printCompany', value('company')); text('printEmail', value('email')); text('printWhatsapp', value('whatsapp')); text('printProject', $('#project')?.value || '-'); text('printExtra', extraText); text('printDescription', value('description')); text('printTotal', formatIDR(total));
  text('printDate', now.toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'})); text('printRef', currentDocumentRef); text('printRefTop',currentDocumentRef); text('printRefVerify',currentDocumentRef);
  const dateText=now.toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'}); text('printProviderDate',dateText); text('printClientDate',dateText); text('printClientSigner',value('name'));
  const providerImg=$('#printProviderSignature'), clientImg=$('#printClientSignature');
  if(providerImg) providerImg.src=signaturePads.provider.canvas.toDataURL('image/png'); if(clientImg) clientImg.src=signaturePads.client.canvas.toDataURL('image/png');
  renderCode39(currentDocumentRef); text('printFingerprint',currentFingerprint ? currentFingerprint.slice(0,24) : 'Browser fingerprint unavailable');
}

pdfBtn?.addEventListener('click', () => { if(isPrivacyReady()) openAgreementModal(); });
confirmAgreementBtn?.addEventListener('click', async () => {
  if(!isAgreementReady()){ updateAgreementState(); return; }
  await populatePrintReport();
  closeAgreementModal();
  setTimeout(()=>window.print(),80);
});

window.addEventListener('beforeprint', () => { if(isAgreementReady()) populatePrintReport(); });

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
