const API_ENDPOINT='/api/pupuk-registration';
const form=document.getElementById('regForm');
const panels=[...document.querySelectorAll('.panel')];
const progress=[...document.querySelectorAll('.progress-step')];
const prevBtn=document.getElementById('prevBtn');
const nextBtn=document.getElementById('nextBtn');
const submitBtn=document.getElementById('submitBtn');
const statusBox=document.getElementById('status');
let current=0;
function setStatus(type,html){statusBox.className='status '+type;statusBox.innerHTML=html;}
function showStep(index,scroll=true){current=Math.max(0,Math.min(index,panels.length-1));panels.forEach((p,i)=>p.classList.toggle('active',i===current));progress.forEach((p,i)=>{p.classList.toggle('active',i===current);p.classList.toggle('done',i<current)});prevBtn.hidden=current===0;nextBtn.hidden=current===panels.length-1;submitBtn.hidden=current!==panels.length-1;if(scroll){document.querySelector('.wizard').scrollIntoView({behavior:'smooth',block:'start'})}}
function validatePanel(){const fields=[...panels[current].querySelectorAll('input,select,textarea')];for(const el of fields){if(!el.checkValidity()){el.reportValidity();el.focus({preventScroll:true});el.scrollIntoView({behavior:'smooth',block:'center'});return false}}return true}
nextBtn.addEventListener('click',()=>{if(validatePanel())showStep(current+1)});prevBtn.addEventListener('click',()=>showStep(current-1));
function normalizeWA(v){return v.replace(/[^0-9+]/g,'')}
form.addEventListener('submit',async e=>{e.preventDefault();statusBox.className='status';if(!validatePanel())return;const fd=new FormData(form);if(fd.get('website'))return;const data=Object.fromEntries(fd.entries());data.whatsapp=normalizeWA(data.whatsapp);data.source=location.href;data.submitted_at=new Date().toISOString();submitBtn.disabled=true;submitBtn.textContent='Mengirim…';try{const res=await fetch(API_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)});const out=await res.json().catch(()=>({}));if(!res.ok)throw new Error(out.message||'Registrasi belum dapat diproses.');const id=out.registration_id||out.id||'-';setStatus('ok','✓ Registrasi berhasil. Nomor registrasi: <span class="result-id">'+String(id).replace(/[<>]/g,'')+'</span>. Simpan nomor ini untuk verifikasi.');form.reset();document.getElementById('provinsi').value='Bengkulu';showStep(0,false)}catch(err){setStatus('err','Registrasi belum terkirim: '+err.message+' Pastikan endpoint Cloudflare Worker sudah dipasang.')}finally{submitBtn.disabled=false;submitBtn.textContent='Kirim Registrasi →'}});
