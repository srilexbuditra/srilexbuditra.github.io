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

// V10: robust client signature capture for desktop/mobile + print/PDF.
function setupClientSignaturePad(id){
  const canvas=document.getElementById(id);
  if(!canvas) return null;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  const pad={canvas,ctx,drawing:false,hasSignature:false,lastX:0,lastY:0,dpr:1,dataUrl:'',version:0,strokes:[],currentStroke:null};

  const snapshot=()=>{
    if(!pad.hasSignature) return '';
    pad.dataUrl=canvas.toDataURL('image/png');
    pad.version++;
    return pad.dataUrl;
  };
  const resize=()=>{
    const rect=canvas.getBoundingClientRect();
    const cssW=Math.max(1,Math.round(rect.width));
    const cssH=Math.max(1,Math.round(rect.height));
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const old=pad.hasSignature ? (pad.dataUrl || canvas.toDataURL('image/png')) : '';
    canvas.width=Math.max(1,Math.round(cssW*dpr));
    canvas.height=Math.max(1,Math.round(cssH*dpr));
    pad.dpr=dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.lineWidth=2.6; ctx.strokeStyle='#17384b';
    if(old){
      const img=new Image();
      img.onload=()=>{ctx.drawImage(img,0,0,cssW,cssH); pad.dataUrl=canvas.toDataURL('image/png');};
      img.src=old;
    }
  };
  const pos=e=>{const r=canvas.getBoundingClientRect(); const x=e.clientX-r.left, y=e.clientY-r.top; return {x,y,nx:Math.max(0,Math.min(1,x/Math.max(1,r.width))),ny:Math.max(0,Math.min(1,y/Math.max(1,r.height)))};};
  const start=e=>{
    e.preventDefault();
    canvas.setPointerCapture?.(e.pointerId);
    const q=pos(e); pad.drawing=true; pad.hasSignature=true; pad.lastX=q.x; pad.lastY=q.y; pad.currentStroke=[{x:q.nx,y:q.ny}]; pad.strokes.push(pad.currentStroke);
    ctx.beginPath(); ctx.arc(q.x,q.y,Math.max(1.4,ctx.lineWidth/2),0,Math.PI*2); ctx.fillStyle='#17384b'; ctx.fill();
    canvas.classList.add('has-ink'); canvas.closest('.signature-canvas-wrap')?.classList.add('signed');
    updateAgreementState();
  };
  const move=e=>{
    if(!pad.drawing) return;
    e.preventDefault();
    const q=pos(e); ctx.beginPath(); ctx.moveTo(pad.lastX,pad.lastY); ctx.lineTo(q.x,q.y); ctx.stroke(); pad.lastX=q.x; pad.lastY=q.y; if(pad.currentStroke) pad.currentStroke.push({x:q.nx,y:q.ny});
  };
  const end=e=>{
    if(!pad.drawing) return;
    e.preventDefault(); pad.drawing=false;
    try{canvas.releasePointerCapture?.(e.pointerId);}catch(_){ }
    snapshot(); updateAgreementState();
  };
  canvas.addEventListener('pointerdown',start,{passive:false});
  canvas.addEventListener('pointermove',move,{passive:false});
  canvas.addEventListener('pointerup',end,{passive:false});
  canvas.addEventListener('pointercancel',end,{passive:false});
  new ResizeObserver(resize).observe(canvas);
  window.addEventListener('resize',resize,{passive:true});
  requestAnimationFrame(resize);
  return pad;
}
signaturePads.client=setupClientSignaturePad('clientSignature');

function clearSignature(key){
  const pad=signaturePads[key]; if(!pad)return;
  pad.ctx.clearRect(0,0,pad.canvas.width,pad.canvas.height); pad.hasSignature=false; pad.dataUrl=''; pad.strokes=[]; pad.currentStroke=null;
  pad.canvas.classList.remove('has-ink'); pad.canvas.closest('.signature-canvas-wrap')?.classList.remove('signed');
  updateAgreementState();
}
$$('[data-clear-signature]').forEach(btn=>btn.addEventListener('click',()=>clearSignature(btn.dataset.clearSignature==='clientSignature'?'client':btn.dataset.clearSignature)));

function isPrivacyReady(){ return Boolean(privacyConsentCheckbox?.checked); }
function isAgreementReady(){ return isPrivacyReady() && Boolean(agreementCheckbox?.checked) && Boolean(signaturePads.client?.hasSignature); }
function updateAgreementState(){
  const ready=isAgreementReady();
  if(waBtn){waBtn.disabled=!isPrivacyReady();waBtn.setAttribute('aria-disabled',isPrivacyReady()?'false':'true');}
  if(pdfBtn){pdfBtn.disabled=!isPrivacyReady();pdfBtn.setAttribute('aria-disabled',isPrivacyReady()?'false':'true');}
  if(agreementStatus){agreementStatus.textContent=ready?'Lengkap • siap dibuat':!isPrivacyReady()?'Menunggu persetujuan privasi':!agreementCheckbox?.checked?'Menunggu persetujuan kerja sama':'Menunggu tanda tangan Pihak Kedua';agreementStatus.classList.toggle('complete',ready);}
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
function renderClientSignatureForPrint(dataUrl){
  const img=$('#printClientSignature');
  const svg=$('#printClientSignatureSvg');
  if(!svg) return false;
  if(img && dataUrl){ img.src=dataUrl; img.style.display='none'; }
  svg.setAttribute('viewBox','0 0 1000 320');
  svg.setAttribute('preserveAspectRatio','xMidYMid meet');
  svg.setAttribute('role','img');
  svg.style.display='block'; svg.style.visibility='visible'; svg.style.opacity='1';
  let path=svg.querySelector('path[data-signature-path]');
  if(!path){ path=document.createElementNS('http://www.w3.org/2000/svg','path'); path.setAttribute('data-signature-path','1'); svg.appendChild(path); }
  const pad=signaturePads.client;
  const strokes=pad?.strokes||[];
  const d=[];
  for(const stroke of strokes){
    if(!stroke.length) continue;
    d.push(`M ${(stroke[0].x*1000).toFixed(2)} ${(stroke[0].y*320).toFixed(2)}`);
    for(let i=1;i<stroke.length;i++) d.push(`L ${(stroke[i].x*1000).toFixed(2)} ${(stroke[i].y*320).toFixed(2)}`);
  }
  path.setAttribute('d',d.join(' '));
  path.setAttribute('fill','none'); path.setAttribute('stroke','#17384b'); path.setAttribute('stroke-width','7');
  path.setAttribute('stroke-linecap','round'); path.setAttribute('stroke-linejoin','round');
  path.setAttribute('vector-effect','non-scaling-stroke');
  return Boolean(d.length);
}

async function snapshotClientSignature(){
  const pad=signaturePads.client;
  if(!pad || !pad.hasSignature) return '';
  // Force a fresh PNG snapshot immediately before print. This avoids stale data after resize.
  const data=pad.canvas.toDataURL('image/png');
  pad.dataUrl=data;
  pad.version++;
  return data;
}

async function populatePrintReport(){
  const value = id => document.getElementById(id)?.value?.trim() || '-';
  const text = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val || '-'; };
  const extraText = $('#extra')?.selectedOptions?.[0]?.text?.replace(/\s*\(\+.*\)/,'') || '-';
  const total = updateEstimate();
  const now = new Date();
  currentDocumentRef=`SB-EST-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;

  text('printName', value('name')); text('printCompany', value('company')); text('printEmail', value('email')); text('printWhatsapp', value('whatsapp'));
  text('printProject', $('#project')?.value || '-'); text('printExtra', extraText); text('printDescription', value('description')); text('printTotal', formatIDR(total));
  text('printDate', now.toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'}));
  text('printRef', currentDocumentRef); text('printRefTop',currentDocumentRef); text('printRefVerify',currentDocumentRef);
  const dateText=now.toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'});
  text('printProviderDate',dateText); text('printClientDate',dateText); text('printClientSigner',value('name'));

  const providerImg=$('#printProviderSignature'), clientImg=$('#printClientSignature');
  if(providerImg){
    providerImg.src='assets/signature-provider.svg';
    providerImg.style.display='block';
  }
  if(clientImg && signaturePads.client){
    const clientData=await snapshotClientSignature();
    if(clientData){
      renderClientSignatureForPrint(clientData);
      clientImg.alt='Tanda tangan digital Pihak Kedua';
      if(clientImg.decode){ try{ await clientImg.decode(); }catch(e){} }
    }
  }

  const fingerprintSource=[currentDocumentRef,value('name'),value('company'),value('email'),value('whatsapp'),$('#project')?.value||'',extraText,value('description'),String(total),signaturePads.client?.dataUrl||''].join('|');
  currentFingerprint=await sha256Hex(fingerprintSource);
  renderCode39(currentDocumentRef);
  text('printFingerprint',currentFingerprint ? currentFingerprint.slice(0,24) : 'Browser fingerprint unavailable');
}

async function prepareClientSignatureForPrint(){
  const pad=signaturePads.client;
  const img=$('#printClientSignature');
  if(!pad || !img || !pad.hasSignature) return false;
  const data=await snapshotClientSignature();
  if(!data) return false;
  renderClientSignatureForPrint(data);
  img.style.display='block';
  img.style.visibility='visible';
  if(img.decode){ try{ await img.decode(); }catch(_){ } }
  // Force layout and give the inline SVG a synchronous render opportunity.
  void img.offsetWidth;
  void $('#printClientSignatureSvg')?.getBoundingClientRect();
  return true;
}

pdfBtn?.addEventListener('click',()=>{ if(isPrivacyReady()) openAgreementModal(); });
confirmAgreementBtn?.addEventListener('click',async()=>{
  if(!isAgreementReady()){updateAgreementState();return;}
  confirmAgreementBtn.disabled=true;
  try{
    await prepareClientSignatureForPrint();
    await populatePrintReport();
    await prepareClientSignatureForPrint();
    closeAgreementModal();
    // Two frames + a short delay makes the data URL image available to mobile print engines.
    requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(()=>window.print(),120)));
  }finally{
    setTimeout(()=>{confirmAgreementBtn.disabled=false;},1000);
  }
});

window.addEventListener('beforeprint',()=>{
  if(isAgreementReady()){
    const pad=signaturePads.client;
    if(pad?.hasSignature){
      const data=pad.dataUrl || pad.canvas.toDataURL('image/png');
      pad.dataUrl=data;
      renderClientSignatureForPrint(data);
    }
  }
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
