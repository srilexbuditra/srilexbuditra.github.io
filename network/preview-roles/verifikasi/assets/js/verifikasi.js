/* DPN Gate 3C-12B-C | Admin Verifikasi V1 | CANDIDATE / REVIEW ONLY
 * All records are fictional. No fetch, XHR, authentication, storage, biometrics or financial action.
 * This script illustrates assigned-only presentation, not real authorization enforcement.
 */
(() => {
  'use strict';

  const ACTOR = 'PEMERIKSA-DEMO-01';
  const TITLES = Object.freeze({
    beranda: ['Beranda Verifikasi', 'Ringkasan antrean dan pekerjaan pemeriksaan untuk petugas ilustrasi.'],
    identitas: ['Verifikasi Identitas', 'Tinjau data identitas sintetis dalam antrean milik petugas DEMO.'],
    'foto-wajah': ['Pemeriksaan Foto Wajah', 'Checklist manual dengan grafis ilustrasi — tidak ada pemrosesan biometrik.'],
    rekening: ['Verifikasi Rekening', 'Tinjau label bank fiktif dan rekening yang seluruhnya termasking.'],
    penugasan: ['Penugasan & Antrean', 'Lihat kasus yang ditugaskan dan batas akses ilustratif.'],
    keputusan: ['Keputusan & Perbaikan', 'Simulasikan keputusan dengan alasan wajib, tanpa mengubah status akun nyata.'],
    aktivitas: ['Aktivitas & Audit', 'Aktivitas yang hanya berada di memori halaman dan hilang saat refresh.']
  });

  const SEED = Object.freeze([
    {id:'VER-DEMO-001', member:'Mitra Ilustrasi A', category:'IDENTITAS', assignedTo:ACTOR, status:'MENUNGGU', document:'IDENTITAS-ILUSTRASI-A', bank:'Bank Contoh Alfa', masked:'**** 4821', priority:'TINGGI', sla:'SIMULASI 4 JAM', note:''},
    {id:'VER-DEMO-002', member:'Mitra Ilustrasi B', category:'REKENING', assignedTo:ACTOR, status:'DITINJAU', document:'IDENTITAS-ILUSTRASI-B', bank:'Bank Contoh Beta', masked:'**** 6274', priority:'NORMAL', sla:'SIMULASI 1 HARI', note:''},
    {id:'VER-DEMO-003', member:'Mitra Ilustrasi C', category:'IDENTITAS', assignedTo:ACTOR, status:'PERBAIKAN DEMO', document:'IDENTITAS-ILUSTRASI-C', bank:'Bank Contoh Gamma', masked:'**** 1953', priority:'NORMAL', sla:'SIMULASI 2 HARI', note:'Label dokumen ilustrasi perlu dilengkapi.'},
    {id:'VER-DEMO-004', member:'Mitra Ilustrasi D', category:'REKENING', assignedTo:ACTOR, status:'MENUNGGU', document:'IDENTITAS-ILUSTRASI-D', bank:'Bank Contoh Delta', masked:'**** 7316', priority:'TINGGI', sla:'SIMULASI 6 JAM', note:''},
    {id:'VER-DEMO-005', member:'Mitra Ilustrasi E', category:'IDENTITAS', assignedTo:ACTOR, status:'SETUJU DEMO', document:'IDENTITAS-ILUSTRASI-E', bank:'Bank Contoh Epsilon', masked:'**** 5842', priority:'NORMAL', sla:'SIMULASI SELESAI', note:'Label ilustrasi sudah cukup untuk skenario DEMO.'},
    {id:'VER-DEMO-006', member:'Mitra Ilustrasi F', category:'REKENING', assignedTo:ACTOR, status:'TOLAK DEMO', document:'IDENTITAS-ILUSTRASI-F', bank:'Bank Contoh Zeta', masked:'**** 2095', priority:'NORMAL', sla:'SIMULASI SELESAI', note:'Contoh dokumen bank ilustrasi tidak konsisten.'},
    {id:'VER-DEMO-999', member:'Mitra Ilustrasi Tak Ditugaskan', category:'IDENTITAS', assignedTo:'PEMERIKSA-DEMO-02', status:'MENUNGGU', document:'ILUSTRASI-TERBATAS', bank:'Bank Contoh Khusus', masked:'**** 0000', priority:'NORMAL', sla:'SIMULASI 1 HARI', note:''}
  ]);

  const cases = SEED.map(record => ({...record}));
  const activity = [];
  let activeView = 'beranda';
  let detailCaseId = null;
  let pendingDecision = null;
  let toastTimer = null;

  const el = id => document.getElementById(id);
  const assigned = () => cases.filter(item => item.assignedTo === ACTOR);
  const clear = node => { while (node.firstChild) node.removeChild(node.firstChild); };
  const textNode = (tag, className, value) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = String(value);
    return node;
  };
  const appendText = (parent, tag, className, value) => parent.appendChild(textNode(tag, className, value));
  const chipClass = status => ({
    'MENUNGGU':'ver-chip-wait','DITINJAU':'ver-chip-review',
    'PERBAIKAN DEMO':'ver-chip-fix','SETUJU DEMO':'ver-chip-yes','TOLAK DEMO':'ver-chip-no'
  }[status] || 'ver-chip-wait');
  const chip = status => textNode('span', `ver-chip ${chipClass(status)}`, status);

  function noteActivity(kind, message) {
    activity.unshift({kind, message, time: new Date().toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit', second:'2-digit'})});
    if (activity.length > 35) activity.length = 35;
    renderActivity();
  }

  function toast(message, kind='info') {
    const bar = el('ver-toast');
    bar.textContent = message;
    bar.dataset.kind = kind;
    bar.hidden = false;
    if (toastTimer !== null) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {bar.hidden = true;}, 4300);
  }

  const verSidebar = el('ver-sidebar');
const verScrim = el('ver-mobile-scrim');
const verOpenButton = el('ver-open-sidebar');
const verCloseButton = el('ver-close-sidebar');
const verMoreButton = el('ver-more-button');
let verLastSidebarTrigger = verOpenButton;
verMoreButton.setAttribute('aria-expanded','false');
const verIsMobile = () => window.matchMedia('(max-width:900px)').matches;
function closeVerSidebar(restoreFocus = false) {
    verSidebar.classList.remove('is-open');
    verScrim.hidden = true;
    verOpenButton.setAttribute('aria-expanded','false');
    verMoreButton.setAttribute('aria-expanded','false');
    verSidebar.inert = verIsMobile();
    if (restoreFocus && verIsMobile()) verLastSidebarTrigger.focus();
}
function openVerSidebar(trigger = verOpenButton) {
    if (!verIsMobile()) return;
    verLastSidebarTrigger = trigger;
    closeDialogs();
    verSidebar.inert = false;
    verSidebar.classList.add('is-open');
    verScrim.hidden = false;
    verOpenButton.setAttribute('aria-expanded','true');
    verMoreButton.setAttribute('aria-expanded','true');
    verSidebar.querySelector('.ver-nav').focus();
}
verSidebar.inert = verIsMobile();
function closeDialogs() {
    document.querySelectorAll('dialog.ver-dialog').forEach(dialog => {
      if (dialog.open) dialog.close();
    });
  }

  function navigate(target) {
    if (!Object.prototype.hasOwnProperty.call(TITLES, target)) return;
    closeDialogs(); closeVerSidebar(false); activeView = target;
    document.querySelectorAll('.ver-view').forEach(panel => {panel.hidden = panel.dataset.view !== target;});
    el('ver-current-title').textContent = TITLES[target][0];
    el('ver-current-description').textContent = TITLES[target][1];
    document.querySelectorAll('.ver-nav,.ver-bottom-button[data-target]').forEach(button => {
      const on = button.dataset.target === target;
      button.classList.toggle('is-active', on);
      if (on) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    const more = el('ver-more-button');
    const inMore = ['foto-wajah','keputusan','aktivitas'].includes(target);
    more.classList.toggle('is-active', inMore);
    if (inMore) more.setAttribute('aria-current', 'page');
    else more.removeAttribute('aria-current');
    renderAll();
    el('ver-main').focus({preventScroll:true});
    window.scrollTo({top:0, behavior:'instant'});
  }

  function renderStats() {
    const rows = assigned();
    const data = [
      ['Kasus ditugaskan', rows.length, 'ASSIGNED-ONLY'],
      ['Menunggu', rows.filter(c => c.status === 'MENUNGGU').length, 'ANTREAN DEMO'],
      ['Dalam tinjauan', rows.filter(c => c.status === 'DITINJAU').length, 'TINDAKAN SIMULASI'],
      ['Butuh perbaikan', rows.filter(c => c.status === 'PERBAIKAN DEMO').length, 'ILUSTRASI SAJA']
    ];
    const box = el('ver-stats'); clear(box);
    data.forEach(([label,value,desc]) => {
      const card = document.createElement('div'); card.className='ver-stat';
      appendText(card,'small','',label);
      appendText(card,'strong','',value);
      appendText(card,'span','',desc);
      box.appendChild(card);
    });
  }

  function caseCard(record) {
    const row = textNode('div','ver-case-card','');
    const meta = textNode('div','ver-case-meta','');
    appendText(meta,'strong','',record.id + ' · ' + record.member);
    appendText(meta,'small','',record.category + ' · ' + record.priority + ' · ' + record.sla);
    const actions = textNode('div','ver-case-actions','');
    actions.appendChild(chip(record.status));
    const action = textNode('button','ver-secondary','Detail DEMO');
    action.type = 'button'; action.dataset.caseId = record.id;
    actions.appendChild(action);
    row.append(meta,actions);
    return row;
  }

  function renderHomeAndAssignments() {
    const mine = assigned();
    const home = el('ver-home-queue'); clear(home);
    const queue = mine.filter(c => !['SETUJU DEMO','TOLAK DEMO'].includes(c.status)).slice(0,4);
    if (!queue.length) appendText(home,'p','ver-muted','Tidak ada antrean aktif pada dataset DEMO ini.');
    queue.forEach(c => home.appendChild(caseCard(c)));
    const listing = el('ver-assignments'); clear(listing);
    mine.forEach(c => listing.appendChild(caseCard(c)));
  }

  function matchesFilter(c, searchId, statusId) {
    const term = el(searchId).value.trim().toLocaleLowerCase('id-ID');
    const status = el(statusId).value;
    const searchable = [c.id,c.member,c.bank,c.document].join(' ').toLocaleLowerCase('id-ID');
    return (status === 'ALL' || c.status === status) && (!term || searchable.includes(term));
  }

  function tableCell(label, value) {
    const td = document.createElement('td');td.dataset.label = label;
    if (value instanceof Node) td.appendChild(value);
    else td.textContent=String(value);
    return td;
  }

  function renderTable(category, tbodyId, emptyId, searchId, statusId) {
    const body = el(tbodyId); clear(body);
    const list = assigned().filter(c => c.category === category && matchesFilter(c,searchId,statusId));
    for (const c of list) {
      const row = document.createElement('tr');
      const identifier = textNode('strong','ver-id-strong',c.id);
      const action = textNode('button','ver-secondary','Tinjau DEMO');
      action.type='button';action.dataset.caseId=c.id;
      row.appendChild(tableCell('Kasus',identifier));
      if(category==='IDENTITAS') {
        row.appendChild(tableCell('Mitra',c.member));
        row.appendChild(tableCell('Dokumen',c.document));
      } else {
        row.appendChild(tableCell('Bank',c.bank));
        row.appendChild(tableCell('Rekening',c.masked));
      }
      row.appendChild(tableCell('Status',chip(c.status)));
      row.appendChild(tableCell('Tindakan',action));
      body.appendChild(row);
    }
    el(emptyId).hidden = list.length !== 0;
  }

  function renderDecisionOptions() {
    const select = el('ver-decision-case');
    const previous = select.value;
    clear(select);
    assigned().forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.id} · ${c.member} (${c.category})`;
      select.appendChild(opt);
    });
    if (assigned().some(c => c.id === previous)) select.value = previous;
  }

  function renderActivity() {
    const list = el('ver-activity-list'); clear(list);
    const chosen = el('ver-log-filter').value;
    const visible = activity.filter(item => chosen === 'ALL' || item.kind === chosen);
    for (const record of visible) {
      const li = document.createElement('li');
      appendText(li,'strong','',record.message);
      appendText(li,'small','',record.kind + ' · ' + record.time + ' · sementara di DOM');
      list.appendChild(li);
    }
    el('ver-activity-empty').hidden = visible.length !== 0;
  }

  function renderAll() {
    renderStats();renderHomeAndAssignments();
    renderTable('IDENTITAS','ver-id-rows','ver-id-empty','ver-id-search','ver-id-status');
    renderTable('REKENING','ver-bank-rows','ver-bank-empty','ver-bank-search','ver-bank-status');
    renderDecisionOptions();renderActivity();
  }

  function getAssignedCase(id) {
    const found = cases.find(c => c.id === id);
    if (!found || found.assignedTo !== ACTOR) {
      noteActivity('SECURITY','Simulasi menolak akses kasus di luar penugasan.');
      toast('DITOLAK DEMO: kasus tidak ditugaskan ke petugas ini.','warning');
      return null;
    }
    return found;
  }

  function openCase(id) {
    const c = getAssignedCase(id);
    if (!c) return;
    detailCaseId = c.id;
    const box = el('ver-case-details');clear(box);
    const intro=textNode('p','ver-muted','Semua label berikut menggunakan data fiktif, tidak membuka dokumen asli.');
    const dl=document.createElement('dl');dl.className='ver-detail-list';
    const entries=[['ID kasus',c.id],['Mitra',c.member],['Jenis',c.category],['Assigned',c.assignedTo],['Label dokumen',c.document],['Bank',c.bank],['Rekening',c.masked],['Status',c.status],['Prioritas',c.priority],['SLA',c.sla]];
    entries.forEach(([name,value]) => {appendText(dl,'dt','',name);appendText(dl,'dd','',value);});
    box.append(intro,dl);
    closeDialogs();el('ver-case-dialog').showModal();
    noteActivity('REVIEW',`Membuka detail ilustrasi ${c.id}.`);
  }

  function decisionError(message) {
    const box=el('ver-decision-error');
    box.textContent=message;box.hidden=!message;
    el('ver-decision-notes').setAttribute('aria-invalid',message ? 'true' : 'false');
  }

  function submitDecision(event) {
    event.preventDefault();
    const id=el('ver-decision-case').value;
    const status=el('ver-decision-status').value;
    const reason=el('ver-decision-notes').value.trim();
    const c=getAssignedCase(id);
    if (!c) {decisionError('Kasus tidak tersedia pada penugasan DEMO.');return;}
    if (!['SETUJU DEMO','PERBAIKAN DEMO','TOLAK DEMO'].includes(status)) {
      decisionError('Pilih salah satu keputusan simulasi.');return;
    }
    if (reason.length < 10 || reason.length > 320) {
      decisionError('Alasan wajib antara 10–320 karakter.');return;
    }
    decisionError('');
    pendingDecision={id:c.id,status,reason};
    const body=el('ver-confirm-body');clear(body);
    appendText(body,'p','',`Kasus ${c.id} akan ditandai sebagai ${status} pada tampilan DEMO.`);
    appendText(body,'p','ver-muted',`Alasan: ${reason}`);
    appendText(body,'p','ver-small-note','Tidak ada mutasi server, verifikasi KYC, rekening atau pembayaran nyata.');
    closeDialogs();el('ver-confirm-dialog').showModal();
  }

  function confirmDecision() {
    if (!pendingDecision) return;
    const {id,status,reason}=pendingDecision;
    const c=getAssignedCase(id);
    pendingDecision=null;
    closeDialogs();
    if (!c) return;
    c.status=status;
    c.note=reason;
    el('ver-decision-status').value='';
    el('ver-decision-notes').value='';
    decisionError('');
    noteActivity('DECISION',`${id}: ${status} (keputusan DEMO lokal).`);
    renderAll();
    toast(`${status}: perubahan hanya untuk sesi browser.`,status === 'TOLAK DEMO' ? 'warning' : 'info');
  }

  document.addEventListener('click', event => {
    const targetButton=event.target.closest('button[data-target]');
    if (targetButton) {navigate(targetButton.dataset.target);return;}
    const caseButton=event.target.closest('button[data-case-id]');
    if (caseButton) {openCase(caseButton.dataset.caseId);return;}
    if (event.target.closest('[data-close-dialog]')) {
      pendingDecision=null;closeDialogs();return;
    }
  });

  document.querySelectorAll('.ver-dialog').forEach(dialog => {
    dialog.addEventListener('close', () => {
      if (dialog.id === 'ver-confirm-dialog') pendingDecision=null;
    });
  });
  verOpenButton.addEventListener('click', () => verSidebar.classList.contains('is-open') ? closeVerSidebar(true) : openVerSidebar());
verCloseButton.addEventListener('click', () => closeVerSidebar(true));
verScrim.addEventListener('click', () => closeVerSidebar(true));
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && verSidebar.classList.contains('is-open') && !document.querySelector('dialog.ver-dialog[open]')) closeVerSidebar(true);
});
window.addEventListener('resize', () => {
    if (!verIsMobile()) closeVerSidebar(false);
    else if (!verSidebar.classList.contains('is-open')) verSidebar.inert = true;
});
verMoreButton.addEventListener('click', () => verSidebar.classList.contains('is-open') ? closeVerSidebar(true) : openVerSidebar(verMoreButton));
  el('ver-case-to-decision').addEventListener('click', () => {
    const id=detailCaseId;
    navigate('keputusan');
    if (id && assigned().some(c => c.id === id)) el('ver-decision-case').value=id;
    el('ver-decision-status').focus();
  });
  el('ver-decision-form').addEventListener('submit', submitDecision);
  el('ver-confirm-yes').addEventListener('click', confirmDecision);
  el('ver-photo-reset').addEventListener('click', () => {
    document.querySelectorAll('.ver-photo-check').forEach(box => {box.checked=false;});
    toast('Checklist ilustrasi direset. Tidak ada data yang disimpan.');
  });
  el('ver-test-unassigned').addEventListener('click', () => {openCase('VER-DEMO-999');});
  el('ver-export-preview').addEventListener('click', () => {closeDialogs();el('ver-export-dialog').showModal();});
  ['ver-id-search','ver-bank-search'].forEach(id => {
    el(id).addEventListener('input',() => renderAll());
  });
  ['ver-id-status','ver-bank-status'].forEach(id => {
    el(id).addEventListener('change',() => renderAll());
  });
  el('ver-log-filter').addEventListener('change',renderActivity);
  noteActivity('REVIEW','Sesi pratinjau Admin Verifikasi V1 dimulai.');
  navigate('beranda');
})();
