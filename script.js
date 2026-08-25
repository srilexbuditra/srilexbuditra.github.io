// ==============================
// PENGATURAN WEBSITE
// Ganti nomor WhatsApp di bawah ini dengan nomor Anda.
// Format internasional tanpa +, spasi, atau tanda -.
// Contoh Indonesia: 6282136238350
// ==============================
const WHATSAPP_NUMBER = "6282136238350";

const formatIDR = value => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(value);
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('mainNav');
menuToggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',open)});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

document.querySelectorAll('.package').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.package').forEach(x=>x.classList.remove('selected'));
  btn.classList.add('selected');
  const price=Number(btn.dataset.price||0);
  document.getElementById('chosen').textContent=btn.dataset.package;
  if(price>0){document.getElementById('total').textContent=formatIDR(price)}
  document.getElementById('estimasi').scrollIntoView({behavior:'smooth',block:'center'});
}));

const form=document.getElementById('estimateForm');
const state={package:'Professional',base:500000,extra:0,project:'Website Company Profile'};
function calculate(){
  const extra=Number(document.getElementById('extra').value||0);
  const project=document.getElementById('project').value;
  let base=state.base;
  const map={'Website Company Profile':2500000,'Web Application':5000000,'REST API / Backend':4000000,'Sistem Informasi Custom':7500000,'Database Development':3500000,'Deployment & Cloud':2500000};
  base=map[project]||2500000;
  const total=base+extra;
  document.getElementById('total').textContent=formatIDR(total);
  document.getElementById('chosen').textContent=project;
  document.getElementById('extraText').textContent=extra?formatIDR(extra):'-';
  state.base=base;state.extra=extra;state.project=project;state.total=total;
  return total;
}
document.getElementById('extra')?.addEventListener('change',calculate);
document.getElementById('project')?.addEventListener('change',calculate);
form?.addEventListener('submit',e=>{e.preventDefault();calculate();document.getElementById('result').scrollIntoView({behavior:'smooth',block:'center'})});

document.getElementById('waBtn')?.addEventListener('click',()=>{
  if(WHATSAPP_NUMBER.includes('x')){alert('Silakan buka file script.js lalu ganti WHATSAPP_NUMBER dengan nomor WhatsApp Anda.');return}
  const name=document.getElementById('name').value||'-';
  const company=document.getElementById('company').value||'-';
  const email=document.getElementById('email').value||'-';
  const wa=document.getElementById('whatsapp').value||'-';
  const desc=document.getElementById('description').value||'-';
  const total=calculate();
  const msg=`Halo Srilex Buditra, saya ingin konsultasi proyek.\n\nNama: ${name}\nPerusahaan: ${company}\nEmail: ${email}\nWhatsApp: ${wa}\nJenis proyek: ${state.project}\nFitur tambahan: ${state.extra?formatIDR(state.extra):'-'}\nEstimasi: ${formatIDR(total)}\nDeskripsi: ${desc}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank','noopener');
});

document.getElementById('pdfBtn')?.addEventListener('click',()=>{
  calculate();
  window.print();
});
calculate();
