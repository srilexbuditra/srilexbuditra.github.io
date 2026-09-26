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
  return new Intl.NumberFormat(
    'id-ID',
    {
      style:'currency',
      currency:'IDR',
      maximumFractionDigits:0
    }
  ).format(n);
}

function estimateDisplay(total){
  return selectedPackageName === 'Custom'
    ? 'Konsultasi setelah scope dibahas'
    : formatIDR(total);
}

function syncSelectedPackageUI(){
  const isCustom =
    selectedPackageName === 'Custom';

  const label =
    $('#selectedPackageLabel');

  const price =
    $('#selectedPackagePrice');

  const preview =
    $('#previewPackage');

  if(label){
    label.textContent =
      selectedPackageName;
  }

  if(price){
    price.textContent =
      isCustom
        ? 'Harga disusun setelah scope kebutuhan dibahas'
        : `Mulai dari ${formatIDR(selectedPackage)}`;
  }

  if(preview){
    preview.textContent =
      selectedPackageName;
  }

  $$('.package').forEach(card => {
    const active =
      card.dataset.package ===
      selectedPackageName;

    card.classList.toggle(
      'selected',
      active
    );

    card.setAttribute(
      'aria-pressed',
      active ? 'true' : 'false'
    );

    const action =
      card.querySelector(
        '[data-package-action]'
      );

    if(action){
      if(active){
        action.textContent =
          selectedPackageName === 'Custom'
            ? '✓ Custom Dipilih'
            : `✓ ${selectedPackageName} Dipilih`;
      } else {
        action.textContent =
          card.dataset.package === 'Custom'
            ? 'Konsultasi Custom →'
            : `Pilih ${card.dataset.package} →`;
      }
    }
  });
}

const domainState = {
  mode: 'none',
  selectedDomain: '',
  checkedDomain: '',
  status: 'none'
};

let domainCheckSequence = 0;

function normalizeDomainCandidateInput(value){
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split(/[/?#]/)[0]
    .replace(/\.$/, '');
}

function composeRequestedDomain(){
  const input =
    normalizeDomainCandidateInput(
      $('#domainName')?.value
    );

  if(!input){
    return '';
  }

  if(input.includes('.')){
    return input;
  }

  const tld =
    $('#domainTld')?.value ||
    '.com';

  return `${input}${tld}`;
}

function currentDomainMode(){
  return (
    document.querySelector(
      'input[name="domainMode"]:checked'
    )?.value ||
    'none'
  );
}

function domainStatusLabel(){
  if(domainState.mode === 'none'){
    return 'Belum ditentukan';
  }

  if(domainState.mode === 'owned'){
    return domainState.selectedDomain
      ? 'Domain milik Anda'
      : 'Masukkan domain yang dimiliki';
  }

  if(
    domainState.selectedDomain &&
    domainState.status === 'unregistered'
  ){
    return 'Kandidat tersedia';
  }

  if(domainState.status === 'registered'){
    return 'Sudah terdaftar';
  }

  if(domainState.status === 'unregistered'){
    return 'Belum dipilih';
  }

  if(domainState.status === 'checking'){
    return 'Sedang diperiksa';
  }

  if(domainState.status === 'unknown'){
    return 'Belum dapat dikonfirmasi';
  }

  return 'Belum diperiksa';
}

function syncDomainPreview(){
  const domainElement =
    $('#previewDomain');

  const statusElement =
    $('#previewDomainStatus');

  if(!domainElement || !statusElement){
    return;
  }

  if(domainState.mode === 'none'){
    domainElement.textContent =
      'Belum dipilih';

    statusElement.textContent =
      'Belum ditentukan';

    return;
  }

  if(domainState.mode === 'owned'){
    domainElement.textContent =
      domainState.selectedDomain ||
      'Belum diisi';

    statusElement.textContent =
      domainStatusLabel();

    return;
  }

  domainElement.textContent =
    domainState.selectedDomain ||
    domainState.checkedDomain ||
    'Belum dipilih';

  statusElement.textContent =
    domainStatusLabel();
}

function setDomainResult(
  type,
  title,
  detail = ''
){
  const result =
    $('#domainResult');

  if(!result){
    return;
  }

  result.hidden = false;

  result.className =
    `domain-result is-${type}`;

  result.textContent = '';

  const strong =
    document.createElement('strong');

  strong.textContent =
    title;

  result.appendChild(strong);

  if(detail){
    const small =
      document.createElement('small');

    small.textContent =
      detail;

    result.appendChild(small);
  }
}

function hideDomainResult(){
  const result =
    $('#domainResult');

  if(!result){
    return;
  }

  result.hidden = true;
  result.className = 'domain-result';
  result.textContent = '';
}

function resetDomainLookup(){
  domainCheckSequence += 1;

  domainState.checkedDomain = '';
  domainState.selectedDomain = '';
  domainState.status = 'none';

  const useButton =
    $('#domainUseButton');

  if(useButton){
    useButton.hidden = true;
    useButton.textContent =
      'Gunakan Domain Ini';
  }

  hideDomainResult();
  syncDomainPreview();
}

function syncDomainModeUI(){
  domainState.mode =
    currentDomainMode();

  const ownedPanel =
    $('#ownedDomainPanel');

  const newPanel =
    $('#newDomainPanel');

  if(ownedPanel){
    ownedPanel.hidden =
      domainState.mode !== 'owned';
  }

  if(newPanel){
    newPanel.hidden =
      domainState.mode !== 'new';
  }

  if(domainState.mode === 'none'){
    domainState.selectedDomain = '';
    domainState.checkedDomain = '';
    domainState.status = 'none';
    hideDomainResult();
  }

  if(domainState.mode === 'owned'){
    domainState.checkedDomain = '';
    domainState.status = 'owned';

    domainState.selectedDomain =
      normalizeDomainCandidateInput(
        $('#ownedDomain')?.value
      );

    hideDomainResult();
  }

  if(domainState.mode === 'new'){
    resetDomainLookup();
  }

  syncDomainPreview();
}

async function checkDomainAvailability(){
  if(currentDomainMode() !== 'new'){
    return;
  }

  const domain =
    composeRequestedDomain();

  if(!domain){
    domainState.status = 'unknown';

    setDomainResult(
      'warning',
      'Masukkan nama domain terlebih dahulu.',
      'Contoh: namabisnis lalu pilih .com'
    );

    syncDomainPreview();
    return;
  }

  const requestNumber =
    ++domainCheckSequence;

  domainState.checkedDomain =
    domain;

  domainState.selectedDomain =
    '';

  domainState.status =
    'checking';

  const checkButton =
    $('#domainCheckButton');

  const useButton =
    $('#domainUseButton');

  if(checkButton){
    checkButton.disabled = true;
    checkButton.textContent =
      'Memeriksa...';
  }

  if(useButton){
    useButton.hidden = true;
  }

  setDomainResult(
    'loading',
    `Memeriksa ${domain}...`,
    'Menghubungi registry domain.'
  );

  syncDomainPreview();

  try {
    const response =
      await fetch(
        '/api/public/domain-check?domain=' +
        encodeURIComponent(domain),
        {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          }
        }
      );

    const data =
      await response
        .json()
        .catch(() => null);

    if(
      requestNumber !==
      domainCheckSequence
    ){
      return;
    }

    if(
      !response.ok ||
      !data?.ok
    ){
      domainState.status =
        'unknown';

      setDomainResult(
        'error',
        'Nama domain tidak dapat diperiksa.',
        data?.error ||
        'Periksa kembali nama domain.'
      );

      syncDomainPreview();
      return;
    }

    domainState.checkedDomain =
      data.domain ||
      domain;

    domainState.status =
      data.status ||
      'unknown';

    if(data.status === 'unregistered'){
      setDomainResult(
        'success',
        `${domainState.checkedDomain} belum terdaftar`,
        'Kandidat tersedia. Ketersediaan final dikonfirmasi saat registrasi.'
      );

      if(useButton){
        useButton.hidden = false;
        useButton.textContent =
          'Gunakan Domain Ini';
      }
    } else if(data.status === 'registered'){
      setDomainResult(
        'error',
        `${domainState.checkedDomain} sudah terdaftar`,
        'Silakan coba nama atau ekstensi domain lain.'
      );
    } else {
      setDomainResult(
        'warning',
        'Status domain belum dapat dikonfirmasi.',
        'Silakan coba kembali atau pilih domain lain.'
      );
    }

    syncDomainPreview();
  } catch(error){
    if(
      requestNumber !==
      domainCheckSequence
    ){
      return;
    }

    domainState.status =
      'unknown';

    setDomainResult(
      'error',
      'Pengecekan domain gagal.',
      'Periksa koneksi dan coba kembali.'
    );

    syncDomainPreview();
  } finally {
    if(
      requestNumber ===
      domainCheckSequence &&
      checkButton
    ){
      checkButton.disabled = false;
      checkButton.textContent =
        'Cek Ketersediaan';
    }
  }
}

function initDomainSearchUI(){
  const radios =
    document.querySelectorAll(
      'input[name="domainMode"]'
    );

  radios.forEach(radio => {
    radio.addEventListener(
      'change',
      syncDomainModeUI
    );
  });

  $('#ownedDomain')
    ?.addEventListener(
      'input',
      () => {
        if(
          currentDomainMode() !==
          'owned'
        ){
          return;
        }

        domainState.mode =
          'owned';

        domainState.status =
          'owned';

        domainState.selectedDomain =
          normalizeDomainCandidateInput(
            $('#ownedDomain')?.value
          );

        syncDomainPreview();
      }
    );

  $('#domainName')
    ?.addEventListener(
      'input',
      () => {
        if(
          currentDomainMode() ===
          'new'
        ){
          resetDomainLookup();
        }
      }
    );

  $('#domainName')
    ?.addEventListener(
      'keydown',
      event => {
        if(event.key === 'Enter'){
          event.preventDefault();
          checkDomainAvailability();
        }
      }
    );

  $('#domainTld')
    ?.addEventListener(
      'change',
      () => {
        if(
          currentDomainMode() ===
          'new'
        ){
          resetDomainLookup();
        }
      }
    );

  $('#domainCheckButton')
    ?.addEventListener(
      'click',
      checkDomainAvailability
    );

  $('#domainUseButton')
    ?.addEventListener(
      'click',
      () => {
        const current =
          composeRequestedDomain();

        if(
          domainState.status !==
            'unregistered' ||
          !domainState.checkedDomain ||
          current !==
            domainState.checkedDomain
        ){
          setDomainResult(
            'warning',
            'Periksa ulang domain terlebih dahulu.',
            'Nama domain berubah setelah pengecekan.'
          );

          return;
        }

        domainState.selectedDomain =
          domainState.checkedDomain;

        setDomainResult(
          'success',
          `${domainState.selectedDomain} dipilih`,
          'Domain akan dikonfirmasi kembali saat proses registrasi.'
        );

        const button =
          $('#domainUseButton');

        if(button){
          button.textContent =
            '✓ Domain Dipilih';
        }

        syncDomainPreview();
      }
    );

  syncDomainModeUI();
}
const extraFeatureCatalog = Object.freeze({
  '500000': {
    label: 'Form / WhatsApp',
    amount: 500000
  },

  '1000000': {
    label: 'Dashboard Admin',
    amount: 1000000
  },

  '1500000': {
    label: 'Login & Role',
    amount: 1500000
  },

  '2500000': {
    label: 'Integrasi API',
    amount: 2500000
  }
});

function getSelectedExtraValues(){
  return [
    ...document.querySelectorAll(
      'input[name="extraFeature"]:checked'
    )
  ]
    .map(input =>
      String(input.value || '').trim()
    )
    .filter(value =>
      Object.prototype.hasOwnProperty.call(
        extraFeatureCatalog,
        value
      )
    );
}

function getSelectedExtraItems(){
  return getSelectedExtraValues()
    .map(value => ({
      value,
      ...extraFeatureCatalog[value]
    }));
}

function getSelectedExtraTotal(){
  return getSelectedExtraItems()
    .reduce(
      (total, item) =>
        total + item.amount,
      0
    );
}

function getSelectedExtraLabel(){
  const items =
    getSelectedExtraItems();

  return items.length
    ? items
        .map(item => item.label)
        .join(', ')
    : 'Tidak ada';
}

function syncExtraFeatureUI(){
  const total =
    getSelectedExtraTotal();

  if($('#extraTotal')){
    $('#extraTotal').textContent =
      formatIDR(total);
  }

  if($('#extraText')){
    $('#extraText').textContent =
      getSelectedExtraLabel();
  }

  $('.extra-feature-card')
    .forEach(card => {
      const input =
        card.querySelector(
          'input[name="extraFeature"]'
        );

      card.classList.toggle(
        'selected',
        Boolean(input?.checked)
      );
    });
}

function updateEstimate(){
  const project =
    $('#project')?.value ||
    'Website Company Profile';

  const extra =
    getSelectedExtraTotal();

  const isCustom =
    selectedPackageName === 'Custom';

  const total =
    isCustom
      ? 0
      : Math.max(
          selectedPackage,
          basePrices[project] || 0
        ) + extra;

  const totalElement =
    $('#total');

  if(totalElement){
    totalElement.textContent =
      isCustom
        ? 'Konsultasi'
        : formatIDR(total);
  }

  if($('#chosen')){
    $('#chosen').textContent =
      project;
  }

  syncExtraFeatureUI();

  const note =
    $('#estimateModeNote');

  if(note){
    note.textContent =
      isCustom
        ? 'Paket Custom tidak menggunakan harga otomatis. Nilai final disusun setelah kebutuhan, kompleksitas, dan scope project dibahas.'
        : 'Estimasi awal akan dikonfirmasi kembali setelah kebutuhan dan scope project dibahas.';
  }

  const meter =
    document.querySelector(
      '.estimate-meter span'
    );

  if(meter){
    const pct =
      isCustom
        ? 18
        : Math.min(
            100,
            Math.max(
              18,
              Math.round(
                (total / 15000000) * 100
              )
            )
          );

    meter.style.width =
      pct + '%';
  }

  syncSelectedPackageUI();

  return total;
}

$$('.package').forEach(btn => {
  btn.addEventListener(
    'click',
    () => {
      selectedPackage =
        Number(
          btn.dataset.price || 0
        );

      selectedPackageName =
        btn.dataset.package;

      updateEstimate();

      $('#estimasi')
        ?.scrollIntoView({
          behavior:'smooth',
          block:'start'
        });
    }
  );
});

syncSelectedPackageUI();
updateEstimate();
$('#project')?.addEventListener('change', updateEstimate);
$$('input[name="extraFeature"]')
  .forEach(input => {
    input.addEventListener(
      'change',
      updateEstimate
    );
  });

initDomainSearchUI();

$('#estimateForm')?.addEventListener('submit', e => {
  e.preventDefault();
  updateEstimate();
  $('#result').classList.add('pulse-result');
  setTimeout(()=>$('#result').classList.remove('pulse-result'),700);
  $('#result').scrollIntoView({behavior:'smooth',block:'center'});
});

let calculatorLeadRequestRef = '';
let calculatorLeadRequestKey = '';

function createCalculatorLeadRequestRef(){
  const randomPart =
    window.crypto?.randomUUID
      ? crypto.randomUUID()
          .replaceAll('-', '')
          .slice(0, 12)
      : Math.random()
          .toString(36)
          .slice(2, 14);

  return `CALC-${Date.now()}-${randomPart}`;
}

waBtn?.addEventListener('click', async () => {
  if (!isPrivacyReady()) return;

  const form = $('#estimateForm');

  if (
    form &&
    typeof form.reportValidity === 'function' &&
    !form.reportValidity()
  ) {
    return;
  }

  const total = updateEstimate();

  const selectedExtraValues =
    getSelectedExtraValues();

  const selectedDomainMode =
    currentDomainMode();

  if (
    selectedDomainMode === 'new' &&
    (
      !domainState.selectedDomain ||
      domainState.status !== 'unregistered'
    )
  ) {
    alert(
      'Silakan cek ketersediaan domain dan klik "Gunakan Domain Ini" sebelum mengirim estimasi.'
    );

    return;
  }

  if (
    selectedDomainMode === 'owned' &&
    !domainState.selectedDomain
  ) {
    alert(
      'Masukkan domain yang sudah Anda miliki terlebih dahulu.'
    );

    return;
  }
  const payload = {
    full_name:
      $('#name').value.trim(),

    company_name:
      $('#company').value.trim(),

    email:
      $('#email').value.trim(),

    phone:
      $('#whatsapp').value.trim(),

    project:
      $('#project').value,

    package_name:
      selectedPackageName,
    extra_values:
      selectedExtraValues.length
        ? selectedExtraValues
        : ['0'],

    domain_mode:
      selectedDomainMode,

    domain_name:
      selectedDomainMode === 'none'
        ? null
        : (
            domainState.selectedDomain ||
            null
          ),

    description:
      $('#description').value.trim(),

    privacy_consent:
      true
  };

  /*
   * Satu kombinasi data Calculator menggunakan
   * request_ref yang sama.
   *
   * Jika pengguna klik ulang / browser retry,
   * backend mengembalikan Lead yang sama,
   * bukan membuat duplikat.
   */
  const payloadKey =
    JSON.stringify(payload);

  if (
    !calculatorLeadRequestRef ||
    calculatorLeadRequestKey !== payloadKey
  ) {
    calculatorLeadRequestKey =
      payloadKey;

    calculatorLeadRequestRef =
      createCalculatorLeadRequestRef();
  }

  payload.request_ref =
    calculatorLeadRequestRef;

  const originalHtml =
    waBtn.innerHTML;

  waBtn.disabled = true;

  waBtn.setAttribute(
    'aria-busy',
    'true'
  );

  waBtn.textContent =
    'Menyimpan...';

  /*
   * Buka tab lebih dahulu saat masih berada
   * dalam user gesture.
   *
   * Setelah API selesai, tab diarahkan ke WhatsApp.
   * Ini mencegah popup diblokir browser akibat
   * window.open dipanggil setelah await.
   */
  const waWindow =
    window.open('', '_blank');

  if (waWindow) {
    try {
      waWindow.opener = null;
    } catch {}
  }

  try {
    const response =
      await fetch(
        '/api/public/estimate-request',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Accept:
              'application/json'
          },

          credentials:
            'same-origin',

          cache:
            'no-store',

          body:
            JSON.stringify(payload)
        }
      );

    const data =
      await response
        .json()
        .catch(() => ({}));

    if (
      !response.ok ||
      data?.ok !== true
    ) {
      throw new Error(
        data?.error ||
        `HTTP ${response.status}`
      );
    }

    const leadCode =
      data?.lead?.lead_code ||
      '';

    const requestRef =
      data?.lead?.request_ref ||
      payload.request_ref;

    const msg = [
      'Halo Srilex Buditra, saya tertarik konsultasi project.',
      '',
      `Referensi Lead: ${leadCode || '-'}`,
      `Request Ref: ${requestRef}`,
      '',
      `Nama: ${payload.full_name}`,
      `Perusahaan: ${payload.company_name || '-'}`,
      `Email: ${payload.email}`,
      `WhatsApp: ${payload.phone || '-'}`,
      `Jenis Project: ${payload.project}`,
      `Paket: ${payload.package_name}`,
      `Fitur Tambahan: ${getSelectedExtraLabel()}`,
      `Domain: ${payload.domain_name || 'Belum ditentukan'}`,
      `Status Domain: ${selectedDomainMode === 'none' ? 'Belum ditentukan' : domainStatusLabel()}`,
      `Estimasi Awal: ${estimateDisplay(total)}`,
      `Deskripsi: ${payload.description || '-'}`
    ].join('\n');

    /*
     * Analytics hanya dicatat setelah Lead
     * berhasil tersimpan.
     */
    if (
      typeof window.gtag ===
      'function'
    ) {
      window.gtag(
        'event',
        'whatsapp_click',
        {
          event_category:
            'engagement',

          event_label:
            'Homepage - Konsultasi WhatsApp',

          lead_code:
            leadCode || undefined
        }
      );
    }

    const waUrl =
      'https://wa.me/6282136238350?text=' +
      encodeURIComponent(msg);

    if (
      waWindow &&
      !waWindow.closed
    ) {
      waWindow.location.replace(
        waUrl
      );
    } else {
      /*
       * Fallback jika browser benar-benar
       * memblokir tab baru.
       */
      window.location.href =
        waUrl;
    }

  } catch (error) {
    if (
      waWindow &&
      !waWindow.closed
    ) {
      waWindow.close();
    }

    console.error(
      '[Calculator Lead Sync]',
      error
    );

    window.alert(
      'Permintaan belum dapat disimpan. ' +
      'Silakan coba kembali sebelum membuka WhatsApp.'
    );

  } finally {
    waBtn.innerHTML =
      originalHtml;

    waBtn.removeAttribute(
      'aria-busy'
    );

    /*
     * Kembalikan status tombol berdasarkan
     * persetujuan privasi yang berlaku.
     */
    updateAgreementState();
  }
});async function sha256Hex(input){
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
function renderVerificationQr(documentRef){
  const svgEl=$('#printVerifyQr');
  const link=$('#printVerifyQrLink');
  if(!svgEl || !documentRef) return Promise.resolve(false);
  const verifyUrl='https://srilexbuditra.work/verify/?id='+encodeURIComponent(documentRef);
  if(link){ link.href=verifyUrl; link.setAttribute('aria-label','Buka verifikasi '+documentRef); }

  // V29: fully local inline SVG QR. No external image/API is used, so the QR
  // remains available in Chrome, mobile browsers, in-app browsers and print
  // engines even when external image hosts are blocked.
  try{
    if(!window.LocalQRCode || !window.LocalQRErrorCorrectLevel) throw new Error('Local QR engine unavailable');
    const qr=new window.LocalQRCode(0, window.LocalQRErrorCorrectLevel.M);
    qr.addData(verifyUrl);
    qr.make();
    const count=qr.getModuleCount();
    const quiet=4;
    const size=count + quiet*2;
    let rects='';
    for(let row=0;row<count;row++){
      for(let col=0;col<count;col++){
        if(qr.isDark(row,col)) rects+=`<rect x="${col+quiet}" y="${row+quiet}" width="1" height="1"/>`;
      }
    }
    svgEl.setAttribute('viewBox',`0 0 ${size} ${size}`);
    svgEl.setAttribute('preserveAspectRatio','xMidYMid meet');
    svgEl.setAttribute('aria-label','QR verifikasi dokumen '+documentRef);
    svgEl.innerHTML=`<rect x="0" y="0" width="${size}" height="${size}" fill="#fff"/><g fill="#000" shape-rendering="crispEdges">${rects}</g>`;
    svgEl.style.display='block';
    svgEl.style.visibility='visible';
    svgEl.style.opacity='1';
    void svgEl.getBoundingClientRect();
    return Promise.resolve(true);
  }catch(err){
    console.warn('Local QR generation failed',err);
    svgEl.innerHTML='';
    return Promise.resolve(false);
  }
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
  // V13: match the lighter visual weight used by the provider signature.
  path.setAttribute('fill','none'); path.setAttribute('stroke','#17384b'); path.setAttribute('stroke-width','1');
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
  const extraText =
    getSelectedExtraLabel();

  const domainText =
    domainState.mode === 'none'
      ? 'Belum ditentukan'
      : (
          domainState.selectedDomain ||
          'Belum dipilih'
        );

  const domainStatusText =
    domainState.mode === 'none'
      ? 'Belum ditentukan'
      : domainStatusLabel();
  const total = updateEstimate();
  const now = new Date();
  currentDocumentRef=`SB-EST-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;

  text('printName', value('name')); text('printCompany', value('company')); text('printEmail', value('email')); text('printWhatsapp', value('whatsapp'));
  text(
    'printProject',
    $('#project')?.value || '-'
  );

  text(
    'printExtra',
    extraText
  );

  text(
    'printDomain',
    domainText
  );

  text(
    'printDomainStatus',
    domainStatusText
  );

  text(
    'printDescription',
    value('description')
  );

  text(
    'printTotal',
    formatIDR(total)
  );
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

  const fingerprintSource=[currentDocumentRef,value('name'),value('company'),value('email'),value('whatsapp'),$('#project')?.value||'',extraText,domainText,domainStatusText,value('description'),String(total),signaturePads.client?.dataUrl||''].join('|');
  currentFingerprint=await sha256Hex(fingerprintSource);
  renderCode39(currentDocumentRef);
  await renderVerificationQr(currentDocumentRef);
  text('printFingerprint',currentFingerprint ? currentFingerprint.slice(0,24) : 'Browser fingerprint unavailable');
  // V32: publish the verification record before opening print preview.
  // The existing API endpoint and session-only Publisher Token model are preserved.
  const api=(window.SB_VERIFY_API||'').replace(/\/$/,'');
  if(api){
    const publisherToken=window.SB_VERIFY_PUBLISHER_TOKEN||'';
    if(!publisherToken){
      throw new Error('PUBLISHER_SESSION_REQUIRED');
    }

    const record={id:currentDocumentRef,status:'Verified',issued_at:now.toISOString().slice(0,10),client_name:value('name'),project:$('#project')?.value||'-',fingerprint:currentFingerprint||'-'};
    const publishResponse=await fetch(api+'/documents',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+publisherToken},
      body:JSON.stringify(record),
      keepalive:true
    });

    if(!publishResponse.ok){
      throw new Error('PUBLISH_FAILED_'+publishResponse.status);
    }
  }
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
let printReportParent=null;
let printReportNextSibling=null;
function mountPrintReportForPrint(){
  const report=$('.print-report');
  if(!report || report.parentElement===document.body) return;
  printReportParent=report.parentElement;
  printReportNextSibling=report.nextSibling;
  document.body.appendChild(report);
  report.classList.add('print-host');
  report.setAttribute('aria-hidden','false');
}
function fitPrintReportToA4Portrait(){
  const report=$('.print-report');
  if(!report || report.parentElement!==document.body) return;
  // V21: measure the real unscaled report, then apply only the minimum
  // scale required to fit the printable A4 height. This preserves readability.
  report.style.setProperty('--print-zoom','1');
  report.style.zoom='1';
  report.style.width='100%';
  void report.offsetHeight;

  const mm=document.createElement('div');
  mm.style.cssText='position:absolute;left:-99999px;top:-99999px;width:100mm;height:100mm;visibility:hidden;pointer-events:none;';
  document.body.appendChild(mm);
  const mmPx=mm.getBoundingClientRect().height/100 || 3.7795;
  mm.remove();

  const targetHeight=257*mmPx;
  const rawHeight=report.getBoundingClientRect().height || report.scrollHeight;
  let scale=Math.min(1, targetHeight/rawHeight);

  // Never make the document unnecessarily tiny. If content is taller than A4,
  // the compact V21 print rules reduce spacing first; this scale is only the
  // final safety fit.
  scale=Math.max(.72,Math.min(1,scale));
  report.style.setProperty('--print-zoom',String(scale));
  report.style.zoom=String(scale);
  report.style.width=(100/scale)+'%';
  void report.offsetHeight;

  // A final measurement corrects rounding differences between Chromium,
  // Firefox and mobile print engines.
  const finalHeight=report.getBoundingClientRect().height;
  if(finalHeight>targetHeight){
    const finalScale=Math.max(.70,scale*(targetHeight/finalHeight)*.995);
    report.style.setProperty('--print-zoom',String(finalScale));
    report.style.zoom=String(finalScale);
    report.style.width=(100/finalScale)+'%';
  }
}

function restorePrintReportAfterPrint(){
  const report=$('.print-report');
  if(!report || !printReportParent) return;
  report.classList.remove('print-host');
  report.setAttribute('aria-hidden','true');
  if(printReportNextSibling && printReportNextSibling.parentNode===printReportParent) printReportParent.insertBefore(report,printReportNextSibling);
  else printReportParent.appendChild(report);
  report.style.removeProperty('--print-zoom');
  report.style.removeProperty('zoom');
  report.style.removeProperty('width');
  printReportParent=null; printReportNextSibling=null;
}
confirmAgreementBtn?.addEventListener('click',async()=>{
  if(!isAgreementReady()){updateAgreementState();return;}
  confirmAgreementBtn.disabled=true;
  try{
    await populatePrintReport();
    await prepareClientSignatureForPrint();
    mountPrintReportForPrint();
    fitPrintReportToA4Portrait();
    // Force the browser to lay out the now top-level print document before print preview.
    void document.body.offsetHeight;
    void $('.print-report')?.getBoundingClientRect();
    closeAgreementModal();
    requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(()=>window.print(),180)));
  }catch(err){
    console.error('Document publishing failed:',err);
    const code=String(err?.message||'');
    if(code==='PUBLISHER_SESSION_REQUIRED'){
      alert('Sesi Publisher belum aktif. Buka /verify/publisher.html, simpan konfigurasi Publisher, lalu gunakan tombol “Buka Formulir Utama” sebelum membuat PDF.');
    }else if(code.startsWith('PUBLISH_FAILED_401') || code.startsWith('PUBLISH_FAILED_403')){
      alert('Publisher Token ditolak oleh API. Aktifkan ulang sesi Publisher sebelum membuat PDF.');
    }else{
      alert('Dokumen belum berhasil didaftarkan ke database verifikasi. PDF tidak dibuat agar QR tidak menghasilkan dokumen yang belum terverifikasi. Silakan coba kembali.');
    }
  }finally{
    setTimeout(()=>{confirmAgreementBtn.disabled=false;},1000);
  }
});
window.addEventListener('afterprint',restorePrintReportAfterPrint);

window.addEventListener('beforeprint',()=>{
  mountPrintReportForPrint();
  fitPrintReportToA4Portrait();
  if(isAgreementReady()){
    const pad=signaturePads.client;
    if(pad?.hasSignature) renderClientSignatureForPrint(pad.dataUrl || pad.canvas.toDataURL('image/png'));
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
