// V6: peserta yang sudah login tetap diarahkan ke Dashboard Peserta.
// Fail-open: jika pemeriksaan sesi gagal, halaman registrasi tetap dapat digunakan.
const PARTICIPANT_API='https://peserta-api.srilexbuditra.work';

(async function redirectAuthenticatedParticipant(){
  try {
    const response=await fetch(PARTICIPANT_API + '/me',{
      method:'GET',
      credentials:'include',
      headers:{Accept:'application/json'},
      cache:'no-store'
    });
    if(!response.ok) return;
    const data=await response.json();
    if(data && data.authenticated===true && data.participant){
      window.location.replace('../peserta/');
    }
  } catch (_) {
    // Fail-open: jangan blokir registrasi bila API peserta tidak tersedia.
  }
})();

const API_ENDPOINT='https://ketahanan-pangan-registration-api.srilexbuditra.workers.dev';
const MAX_FILE_SIZE=5*1024*1024;
const ALLOWED_TYPES=new Set(['image/jpeg','image/png','image/webp','image/avif','application/pdf']);
const form=document.getElementById('regForm');
const panels=[...document.querySelectorAll('.panel')];
const progress=[...document.querySelectorAll('.progress-step')];
const prevBtn=document.getElementById('prevBtn');
const nextBtn=document.getElementById('nextBtn');
const submitBtn=document.getElementById('submitBtn');
const statusBox=document.getElementById('status');
const documentError=document.getElementById('documentError');
const uploadInputs=[...document.querySelectorAll('input[type="file"]')];
const objectUrls=new Map();
const wizardStatus=document.getElementById('wizardStatus');
const reviewSummary=document.getElementById('reviewSummary');
const submitOverlay=document.getElementById('submitOverlay');
const submitSpinner=document.getElementById('submitSpinner');
const submitSuccessIcon=document.getElementById('submitSuccessIcon');
const submitKicker=document.getElementById('submitKicker');
const submitOverlayTitle=document.getElementById('submitOverlayTitle');
const submitOverlayText=document.getElementById('submitOverlayText');
const submitCountdown=document.getElementById('submitCountdown');
const countdownSeconds=document.getElementById('countdownSeconds');
const openSuccessNow=document.getElementById('openSuccessNow');
let current=0;
let successTimer=null;

function setStatus(type,html){statusBox.className='status '+type;statusBox.innerHTML=html;}
const STEP_COPY=[
  ['Identitas Pemohon','Lengkapi data identitas dan dokumen sebelum melanjutkan.'],
  ['Data Usaha Tani','Isi informasi usaha tani sesuai kondisi sebenarnya.'],
  ['Kebutuhan Pupuk','Masukkan kebutuhan pupuk secara wajar sesuai lahan dan komoditas.'],
  ['Konfirmasi & Persetujuan','Periksa ringkasan lalu kirim registrasi jika semua data sudah benar.']
];
function updateReviewSummary(){
  if(!reviewSummary)return;
  const checks={
    identity: Boolean(form.nama?.value.trim()&&form.nik?.value.length===16&&form.nomor_kk?.value.length===16&&form.whatsapp?.value.trim()&&form.alamat?.value.trim()),
    documents: uploadInputs.every(i=>Boolean(i.files?.[0])&&!validateFile(i.files?.[0])),
    farm: Boolean(form.status_pemohon?.value&&form.luas_lahan?.value&&form.status_lahan?.value&&form.komoditas?.value&&form.tahap?.value),
    needs: Boolean(form.jenis_pupuk?.value&&form.kebutuhan_kg?.value)
  };
  const labels={identity:'Identitas siap',documents:'KTP & KK siap',farm:'Data usaha tani siap',needs:'Kebutuhan pupuk siap'};
  for(const [key,ok] of Object.entries(checks)){const el=reviewSummary.querySelector(`[data-review="${key}"]`);if(el){el.textContent=(ok?'✓ ':'○ ')+labels[key];el.classList.toggle('ok',ok)}}
}
function showStep(index,scroll=true){
  current=Math.max(0,Math.min(index,panels.length-1));
  panels.forEach((p,i)=>p.classList.toggle('active',i===current));
  progress.forEach((p,i)=>{p.classList.toggle('active',i===current);p.classList.toggle('done',i<current);p.setAttribute('aria-current',i===current?'step':'false')});
  prevBtn.hidden=current===0;nextBtn.hidden=current===panels.length-1;submitBtn.hidden=current!==panels.length-1;
  if(wizardStatus){const [title,copy]=STEP_COPY[current];wizardStatus.innerHTML=`<strong>Langkah ${current+1} dari ${panels.length} — ${title}</strong><span>${copy}</span>`}
  if(current===panels.length-1)updateReviewSummary();
  if(scroll){document.querySelector('.wizard').scrollIntoView({behavior:'smooth',block:'start'})}
}
function humanSize(bytes){if(bytes<1024)return bytes+' B';if(bytes<1024*1024)return (bytes/1024).toFixed(1)+' KB';return (bytes/(1024*1024)).toFixed(1)+' MB'}
function setUploadState(name,state,text,percent){const card=document.querySelector(`[data-upload-card="${name}"]`);const status=document.querySelector(`[data-upload-status="${name}"]`);const bar=document.querySelector(`[data-progressbar="${name}"] span`);card?.classList.toggle('is-ready',state==='ready'||state==='uploading'||state==='done');card?.classList.toggle('is-error',state==='error');if(status){status.className='upload-status'+(state==='error'?' error':(state==='ready'||state==='done'?' ready':''));status.textContent=text}if(bar)bar.style.width=Math.max(0,Math.min(100,percent||0))+'%'}
function clearPreview(input){const name=input.name;const preview=document.querySelector(`[data-preview="${name}"]`);if(objectUrls.has(name)){URL.revokeObjectURL(objectUrls.get(name));objectUrls.delete(name)}if(preview){preview.hidden=true;preview.querySelector('.preview-media').innerHTML='';preview.querySelector('.preview-name').textContent='';preview.querySelector('.preview-size').textContent=''}input.value='';setUploadState(name,'empty','Belum ada berkas dipilih.',0)}
function validateFile(file){if(!file)return 'Pilih berkas terlebih dahulu.';if(!ALLOWED_TYPES.has(file.type))return 'Format tidak didukung. Gunakan JPG, PNG, WEBP, AVIF, atau PDF.';if(file.size>MAX_FILE_SIZE)return 'Ukuran berkas melebihi 5 MB.';if(file.size===0)return 'Berkas kosong atau rusak.';return ''}
function renderPreview(input){const file=input.files?.[0];const name=input.name;const preview=document.querySelector(`[data-preview="${name}"]`);const card=document.querySelector(`[data-upload-card="${name}"]`);if(!file){clearPreview(input);return true}const error=validateFile(file);if(error){clearPreview(input);card?.classList.add('is-error');setUploadState(name,'error',error,0);documentError.textContent=error;documentError.classList.add('show');return false}documentError.classList.remove('show');if(objectUrls.has(name))URL.revokeObjectURL(objectUrls.get(name));const media=preview.querySelector('.preview-media');media.innerHTML='';if(file.type.startsWith('image/')){const url=URL.createObjectURL(file);objectUrls.set(name,url);const img=document.createElement('img');img.src=url;img.alt='Preview '+(name==='ktp_file'?'KTP':'Kartu Keluarga');media.appendChild(img)}else{media.textContent='PDF'}preview.querySelector('.preview-name').textContent=file.name;preview.querySelector('.preview-size').textContent=humanSize(file.size);preview.hidden=false;card?.classList.remove('is-error');setUploadState(name,'ready','Berkas siap diunggah.',100);return true}
uploadInputs.forEach(input=>{input.addEventListener('change',()=>renderPreview(input));});
document.querySelectorAll('[data-remove]').forEach(btn=>btn.addEventListener('click',()=>{const input=document.getElementById(btn.dataset.remove);if(input)clearPreview(input)}));
function validateUploads(){for(const input of uploadInputs){const file=input.files?.[0];const error=validateFile(file);if(error){setUploadState(input.name,'error',error,0);documentError.textContent=(input.name==='ktp_file'?'KTP: ':'KK: ')+error;documentError.classList.add('show');input.focus();input.scrollIntoView({behavior:'smooth',block:'center'});return false}}documentError.classList.remove('show');return true}
function validatePanel(){const fields=[...panels[current].querySelectorAll('input,select,textarea')];for(const el of fields){if(el.type==='file')continue;if(!el.checkValidity()){el.reportValidity();el.focus({preventScroll:true});el.scrollIntoView({behavior:'smooth',block:'center'});return false}}if(current===0&&!validateUploads())return false;return true}
function setFieldValidation(el){if(!el||el.type==='file'||el.type==='hidden')return;const field=el.closest('.field')||el.closest('.check');if(!field)return;field.classList.toggle('field-invalid',!el.checkValidity()&&Boolean(el.value||el.checked));field.classList.toggle('field-valid',el.checkValidity()&&Boolean(el.value||el.checked))}
form.querySelectorAll('input,select,textarea').forEach(el=>{if(el.type==='file'||el.classList.contains('trap'))return;el.addEventListener('blur',()=>setFieldValidation(el));el.addEventListener('input',()=>{if(el.closest('.field')?.classList.contains('field-invalid'))setFieldValidation(el)});el.addEventListener('change',()=>setFieldValidation(el))});
nextBtn.addEventListener('click',()=>{if(validatePanel())showStep(current+1)});prevBtn.addEventListener('click',()=>showStep(current-1));
function normalizeWA(v){return String(v||'').replace(/[^0-9+]/g,'')}
function resetUploads(){uploadInputs.forEach(clearPreview)}
function submitMultipart(fd){return new Promise((resolve,reject)=>{const xhr=new XMLHttpRequest();xhr.open('POST',API_ENDPOINT,true);xhr.setRequestHeader('Accept','application/json');xhr.upload.addEventListener('progress',e=>{if(!e.lengthComputable)return;const pct=Math.round((e.loaded/e.total)*100);uploadInputs.forEach(i=>setUploadState(i.name,'uploading',pct<100?`Mengunggah… ${pct}%`:'Memproses berkas…',pct))});xhr.addEventListener('load',()=>{let out={};try{out=JSON.parse(xhr.responseText||'{}')}catch{}if(xhr.status>=200&&xhr.status<300)resolve(out);else reject(new Error(out.message||'Registrasi belum dapat diproses.'))});xhr.addEventListener('error',()=>reject(new Error('Koneksi terputus saat mengunggah dokumen.')));xhr.addEventListener('timeout',()=>reject(new Error('Waktu unggah habis. Silakan coba lagi.')));xhr.timeout=120000;xhr.send(fd)})}
const REGISTRATION_SUCCESS_KEY='kp_registration_success_v1';
const REGISTRATION_SUCCESS_WINDOW_PREFIX=REGISTRATION_SUCCESS_KEY+':';
function showSubmittingOverlay(){
  if(!submitOverlay)return;
  submitOverlay.hidden=false;document.body.classList.add('submission-locked');
  if(submitSpinner)submitSpinner.hidden=false;if(submitSuccessIcon)submitSuccessIcon.hidden=true;if(submitCountdown)submitCountdown.hidden=true;if(openSuccessNow)openSuccessNow.hidden=true;
  if(submitKicker)submitKicker.textContent='Mengirim registrasi';if(submitOverlayTitle)submitOverlayTitle.textContent='Data dan dokumen sedang dikirim';if(submitOverlayText)submitOverlayText.textContent='Jangan tutup atau memuat ulang halaman sampai proses selesai.';
}
function hideSubmittingOverlay(){if(submitOverlay){submitOverlay.hidden=true;document.body.classList.remove('submission-locked')}}
function startSuccessCountdown(successUrl,registrationId){
  let left=7;
  if(submitSpinner)submitSpinner.hidden=true;if(submitSuccessIcon)submitSuccessIcon.hidden=false;if(submitKicker)submitKicker.textContent='Registrasi berhasil';
  if(submitOverlayTitle)submitOverlayTitle.textContent='Registrasi berhasil dikirim';
  if(submitOverlayText)submitOverlayText.textContent=`Nomor Registrasi ${registrationId} berhasil dibuat. Simpan nomor tersebut pada halaman hasil.`;
  if(submitCountdown)submitCountdown.hidden=false;if(openSuccessNow)openSuccessNow.hidden=false;if(countdownSeconds)countdownSeconds.textContent=String(left);
  const go=()=>{if(successTimer){clearInterval(successTimer);successTimer=null}window.location.replace(successUrl)};
  if(openSuccessNow)openSuccessNow.onclick=go;
  successTimer=setInterval(()=>{left-=1;if(countdownSeconds)countdownSeconds.textContent=String(Math.max(0,left));if(left<=0)go()},1000);
}
function storeRegistrationSuccess(registrationId){
  const payload=JSON.stringify({registration_id:registrationId,created_at:Date.now()});
  let stored=false;
  try{
    sessionStorage.setItem(REGISTRATION_SUCCESS_KEY,payload);
    stored=true;
  }catch(_){
    // Beberapa mode privasi/browser dapat menolak sessionStorage.
  }
  try{
    // Fallback hanya untuk tab yang sama. Halaman sukses akan langsung membersihkannya.
    window.name=REGISTRATION_SUCCESS_WINDOW_PREFIX+payload;
    stored=true;
  }catch(_){
    // Redirect tetap dilakukan; halaman sukses akan menangani jika data tidak tersedia.
  }
  return stored;
}
form.addEventListener('submit',async e=>{
  e.preventDefault();
  statusBox.className='status';
  if(!validatePanel())return;
  if(!validateUploads())return;
  const fd=new FormData(form);
  if(fd.get('website'))return;
  fd.set('whatsapp',normalizeWA(fd.get('whatsapp')));
  fd.set('source',location.href);
  fd.set('submitted_at',new Date().toISOString());
  submitBtn.disabled=true;
  submitBtn.textContent='Mengirim…';
  showSubmittingOverlay();
  let redirecting=false;
  try{
    const out=await submitMultipart(fd);
    uploadInputs.forEach(i=>setUploadState(i.name,'done','Berkas berhasil dikirim.',100));
    const id=String(out.registration_id||out.id||'').trim().replace(/[<>]/g,'');
    if(typeof window.gtag==='function'){window.gtag('event','registration_success',{event_category:'ketahanan_pangan',event_label:'Registrasi Berhasil',transport_type:'beacon'})}
    if(id){
      storeRegistrationSuccess(id);
      setStatus('ok','✓ Registrasi dan dokumen berhasil dikirim. Nomor registrasi: <span class="result-id">'+id+'</span>. Menyiapkan halaman hasil…');
      const successUrl=new URL('./sukses/',window.location.href).href;
      redirecting=true;
      submitBtn.textContent='Registrasi berhasil';
      // Data sensitif dibersihkan dari form setelah server mengonfirmasi sukses.
      form.reset();document.getElementById('provinsi').value='Bengkulu';resetUploads();showStep(0,false);
      startSuccessCountdown(successUrl,id);
      return;
    }
    hideSubmittingOverlay();
    setStatus('ok','✓ Registrasi dan dokumen berhasil dikirim, tetapi Nomor Registrasi belum diterima dari server. Jangan kirim ulang sebelum menghubungi pengelola.');
  }catch(err){
    hideSubmittingOverlay();
    uploadInputs.forEach(i=>{if(i.files?.[0])setUploadState(i.name,'ready','Berkas tetap dipilih. Siap dicoba kembali.',100)});
    setStatus('err','Registrasi belum terkirim: '+err.message+' Data pada formulir tetap dipertahankan. Periksa koneksi lalu tekan Kirim Registrasi kembali.');
  }finally{
    if(!redirecting){submitBtn.disabled=false;submitBtn.textContent='Kirim Registrasi →'}
  }
});
window.addEventListener('beforeunload',()=>{for(const url of objectUrls.values())URL.revokeObjectURL(url)});
