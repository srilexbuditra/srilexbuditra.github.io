const API = 'https://peserta-api.srilexbuditra.work';
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const securityView = document.getElementById('securityView');
const sessionList = document.getElementById('sessionList');
const eventList = document.getElementById('eventList');
const revokeOthersBtn = document.getElementById('revokeOthersBtn');
const toast = document.getElementById('toast');
let securityData = null;

async function api(path, options = {}) {
  const response = await fetch(API + path, {
    ...options,
    credentials: 'include',
    cache: 'no-store',
    headers: { Accept: 'application/json', ...(options.body ? {'Content-Type':'application/json'} : {}), ...(options.headers || {}) }
  });
  let data = {};
  try { data = await response.json(); } catch (_) {}
  if (!response.ok || data.ok === false) throw Object.assign(new Error(data.message || 'Layanan keamanan belum dapat diakses.'), {status: response.status});
  return data;
}

function text(id, value, fallback='-') { const el=document.getElementById(id); if(el) el.textContent=value==null||value===''?fallback:String(value); }
function formatDate(value) {
  if (!value) return '-';
  const normalized=String(value).includes('T')?String(value):String(value).replace(' ','T')+'Z';
  const d=new Date(normalized); if(Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat('id-ID',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Jakarta'}).format(d);
}
function relative(value) {
  if(!value) return '-'; const t=new Date(String(value).includes('T')?value:String(value).replace(' ','T')+'Z').getTime(); if(!Number.isFinite(t)) return formatDate(value);
  const mins=Math.max(0,Math.floor((Date.now()-t)/60000)); if(mins<1)return 'Baru saja'; if(mins<60)return `${mins} menit lalu`; const h=Math.floor(mins/60); if(h<24)return `${h} jam lalu`; const d=Math.floor(h/24); if(d<7)return `${d} hari lalu`; return formatDate(value);
}
function showToast(message){toast.textContent=message;toast.hidden=false;clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.hidden=true,3500)}
function status(message,type=''){const el=document.getElementById('sessionStatus');el.textContent=message||'';el.className=`form-status${type?' is-'+type:''}`}
function country(code){return code?`Negara: ${String(code).toUpperCase()}`:'Lokasi negara tidak tersedia'}

function renderSessions(rows){
  sessionList.innerHTML=''; const items=Array.isArray(rows)?rows:[]; document.getElementById('sessionEmpty').hidden=items.length>0;
  const current=items.find(x=>x.is_current); text('currentDeviceText',current?.device||'-'); text('currentBrowserText',current?`${current.browser} · ${current.os}`:'-');
  items.forEach(row=>{
    const card=document.createElement('article'); card.className=`session-item${row.is_current?' is-current':''}`;
    const icon=document.createElement('span'); icon.className='session-icon'; icon.textContent=row.is_current?'✓':'▣';
    const copy=document.createElement('div'); copy.className='session-copy';
    const head=document.createElement('div'); head.className='session-title-row';
    const strong=document.createElement('strong'); strong.textContent=row.device||'Perangkat'; head.appendChild(strong);
    if(row.is_current){const badge=document.createElement('span');badge.className='current-badge';badge.textContent='PERANGKAT INI';head.appendChild(badge)}
    const meta=document.createElement('p'); meta.textContent=`${row.browser||'Browser'} · ${row.os||'Sistem'} · ${country(row.country_code)}`;
    const dates=document.createElement('small'); dates.textContent=`Aktif ${relative(row.last_seen_at)} · Login ${formatDate(row.created_at)} · Berakhir ${formatDate(row.expires_at)}`;
    copy.append(head,meta,dates); card.append(icon,copy);
    if(!row.is_current){const btn=document.createElement('button');btn.type='button';btn.className='btn danger-outline compact';btn.textContent='Keluar';btn.addEventListener('click',()=>revokeSession(row.session_id,btn));card.appendChild(btn)}
    sessionList.appendChild(card);
  });
  revokeOthersBtn.disabled=items.filter(x=>!x.is_current).length===0;
}

function renderEvents(rows){
  eventList.innerHTML=''; const items=Array.isArray(rows)?rows:[]; document.getElementById('eventEmpty').hidden=items.length>0;
  const icons={LOGIN_SUCCESS:'↗',LOGIN_LOCKED:'!',PASSWORD_CHANGED:'◆',SESSION_REVOKED:'×',OTHER_SESSIONS_REVOKED:'×',LOGOUT:'←'};
  items.forEach(row=>{const item=document.createElement('div');item.className='event-item';const icon=document.createElement('span');icon.className='event-icon';icon.textContent=icons[row.type]||'•';const copy=document.createElement('div');const strong=document.createElement('strong');strong.textContent=row.title||'Aktivitas keamanan';const p=document.createElement('p');p.textContent=row.description||'';const small=document.createElement('small');small.textContent=`${formatDate(row.created_at)}${row.device?' · '+row.device:''}${row.country_code?' · '+row.country_code:''}`;copy.append(strong,p,small);item.append(icon,copy);eventList.appendChild(item)});
}

function render(security){
  securityData=security||{}; const sessions=securityData.active_sessions||[]; const account=securityData.account||{};
  text('activeSessionCount',sessions.length); text('lastLoginText',formatDate(account.last_login_at)); text('accountStatus',account.is_active?'Aktif':'Tidak Aktif');
  text('lockStatus',account.locked_until && new Date(account.locked_until).getTime()>Date.now()?`Terkunci sampai ${formatDate(account.locked_until)}`:'Tidak terkunci');
  renderSessions(sessions); renderEvents(securityData.recent_events||[]);
}
async function load(){const data=await api('/security/sessions');render(data.security);loadingState.hidden=true;errorState.hidden=true;securityView.hidden=false}
async function revokeSession(id,button){if(!confirm('Keluarkan perangkat ini dari akun?'))return;button.disabled=true;status('Mengakhiri sesi…');try{const data=await api('/security/sessions/revoke',{method:'POST',body:JSON.stringify({session_id:id})});render(data.security);status(data.message||'Sesi berhasil diakhiri.','success');showToast('Sesi perangkat berhasil diakhiri.')}catch(e){status(e.message||'Sesi belum dapat diakhiri.','error')}finally{button.disabled=false}}
revokeOthersBtn.addEventListener('click',async()=>{if(!confirm('Keluar dari semua perangkat lain dan pertahankan perangkat ini?'))return;revokeOthersBtn.disabled=true;status('Mengakhiri sesi perangkat lain…');try{const data=await api('/security/sessions/revoke-others',{method:'POST',body:'{}'});render(data.security);status(data.message||'Sesi perangkat lain diperbarui.','success');showToast(data.message||'Perangkat lain berhasil dikeluarkan.')}catch(e){status(e.message||'Belum dapat mengakhiri sesi perangkat lain.','error')}finally{revokeOthersBtn.disabled=(securityData?.active_sessions||[]).filter(x=>!x.is_current).length===0}});
(async()=>{try{await load()}catch(e){loadingState.hidden=true;securityView.hidden=true;errorState.hidden=false;text('errorTitle',e.status===401?'Sesi login diperlukan':'Keamanan akun belum dapat ditampilkan');text('errorText',e.message||'Periksa koneksi internet lalu coba kembali.')}})();
