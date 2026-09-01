const params=new URLSearchParams(location.search);
const id=(params.get('id')||'').trim();
const $=s=>document.querySelector(s);
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function setStatus(cls,title,msg,note){
  const status=$('#status'); if(status) status.className='status '+cls;
  const st=$('#statusText'); if(st) st.textContent=title;
  const vm=$('#verifyMessage'); if(vm) vm.textContent=msg;
  const noteEl=$('#invalidNote'); if(noteEl){noteEl.hidden=!note; noteEl.textContent=note||'';}
}
function renderRecord(doc){
  const rows={id:doc.id,status:doc.status||'Verified',issued:doc.issued_at||'-',client:doc.client_name||'Terdaftar pada dokumen',project:doc.project||'-',fingerprint:doc.fingerprint||'-'};
  Object.entries(rows).forEach(([k,v])=>{const el=$('#v-'+k);if(el)el.textContent=v});
}
function showValid(doc,source='database penerbit'){
  renderRecord(doc);
  setStatus('valid','DOKUMEN TERVERIFIKASI','Document ID ditemukan dan tercatat pada '+source+'.','');
}
function showInvalid(msg){
  setStatus('invalid','DOKUMEN BELUM TERVERIFIKASI',msg,'Jangan menjadikan dokumen ini sebagai bukti penerbitan resmi sebelum Document ID terdaftar dan berstatus Verified.');
}
async function fetchJson(url,opts={}){
  const res=await fetch(url,{cache:'no-store',...opts});
  if(!res.ok) throw new Error('HTTP '+res.status);
  return res.json();
}
async function load(){
  if(!id){showInvalid('Document ID tidak ditemukan pada URL verifikasi.');return;}
  const u=location.origin+'/verify/?id='+encodeURIComponent(id);
  const qrLink=$('#qrLink');
  if(qrLink) qrLink.href=u;
  const qr=$('#verifyQr');
  if(qr){
    // Self-contained QR on the verification page too; no external QR service.
    try{
      const C=window.LocalQRCode, E=window.LocalQRErrorCorrectLevel;
      if(C&&E){
        const q=new C(0,E.M); q.addData(u); q.make(); const n=q.getModuleCount(), quiet=4, size=n+quiet*2;
        const c=document.createElement('canvas'); c.width=c.height=512; const x=c.getContext('2d'); x.fillStyle='#fff';x.fillRect(0,0,512,512);x.fillStyle='#000';
        const cell=512/size; for(let r=0;r<n;r++)for(let col=0;col<n;col++)if(q.isDark(r,col))x.fillRect((col+quiet)*cell,(r+quiet)*cell,Math.ceil(cell),Math.ceil(cell));
        qr.src=c.toDataURL('image/png'); qr.alt='QR verifikasi '+id;
      }
    }catch(_){ }
  }
  const api=(window.SB_VERIFY_API||'').replace(/\/$/,'');
  if(api){
    try{
      const doc=await fetchJson(api+'/documents/'+encodeURIComponent(id));
      if(doc && (doc.status||'').toLowerCase()==='verified'){showValid(doc,'API database penerbit');return;}
      showInvalid('Document ID tidak ditemukan atau belum berstatus Verified pada database penerbit.');return;
    }catch(_){ /* fallback to static registry */ }
  }
  try{
    const db=await fetchJson('./data/documents.json');
    const doc=(db.documents||[]).find(x=>String(x.id).toUpperCase()===id.toUpperCase() && String(x.status||'').toLowerCase()==='verified');
    if(!doc){showInvalid('Document ID tidak ditemukan atau belum berstatus Verified pada database penerbit.');return;}
    showValid(doc,'database penerbit');
  }catch(_){showInvalid('Database verifikasi tidak dapat diakses saat ini.');}
}
load();
