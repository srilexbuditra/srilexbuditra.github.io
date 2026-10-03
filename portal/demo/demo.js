"use strict";

const KEY="sb_client_demo_r1";
const JOURNEY_KEY="sb_demo_journey_r1";

const fresh=()=>({support:0});

let state=JSON.parse(
  sessionStorage.getItem(KEY)||"null"
)||fresh();

function readJourney(){
  try{
    return JSON.parse(
      sessionStorage.getItem(JOURNEY_KEY)||"null"
    )||{};
  }catch{
    return {};
  }
}

function safeHtml(value){
  return String(value||"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#39;");
}

function identityInitials(value){
  const parts=String(value||"")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0,2);

  const initials=parts
    .map(part=>part.charAt(0))
    .join("")
    .toUpperCase();

  return initials||"CL";
}

const journey=readJourney();

const demoIdentity={
  fullName:
    String(journey.full_name||"Client Demo").trim()||
    "Client Demo",

  companyName:
    String(journey.company_name||"Client").trim()||
    "Client",

  email:
    String(journey.email||"").trim()
};

const main=document.querySelector("main.content");

function syncJourneyIdentity(){
  const profile=document.querySelector(
    ".top-actions .profile"
  );

  const avatar=profile?.querySelector(".avatar");
  const name=profile?.querySelector(
    ".profile-copy strong"
  );
  const company=profile?.querySelector(
    ".profile-copy span"
  );

  if(avatar){
    avatar.textContent=
      identityInitials(demoIdentity.fullName);
  }

  if(name){
    name.textContent=demoIdentity.fullName;
  }

  if(company){
    company.textContent=demoIdentity.companyName;
  }

  if(profile){
    profile.setAttribute(
      "aria-label",
      "Profil Demo " + demoIdentity.fullName
    );
  }

  const welcome=main?.querySelector(
    ".page-head h1"
  );

  if(welcome){
    welcome.textContent=
      "Selamat datang, " +
      demoIdentity.fullName;
  }
}

syncJourneyIdentity();

const home=main.innerHTML;

function save(){sessionStorage.setItem(KEY,JSON.stringify(state))}
function msg(t){alert(t)}

const views={
Projects:`
<div class="page-head"><div><div class="eyebrow">MODE DEMO</div><h1>Projects</h1><p>Contoh project yang akan terlihat setelah menjadi Client.</p></div></div>
<section class="grid">
<article class="card"><div class="card-head"><div><h2>Company Website</h2><p>PRJ-2026-0001 • Website Development</p></div><span class="badge green">Development</span></div>
<div class="card-body"><p>Progress: <strong>82%</strong></p><p>Milestone berikutnya: Final UI Review</p><button class="secondary" data-demo="project">Lihat Detail</button></div></article>
</section>`,

Documents:`
<div class="page-head"><div><div class="eyebrow">MODE DEMO</div><h1>Documents</h1><p>Dokumen simulasi Client.</p></div></div>
<section class="grid">
<article class="card"><div class="card-head"><div><h2>Proposal Final</h2><p>DOC-2026-0012 • PDF</p></div></div><div class="card-body"><button class="secondary" data-demo="document">Buka Dokumen Demo</button></div></article>
<article class="card"><div class="card-head"><div><h2>Project Agreement</h2><p>DOC-2026-0013 • PDF</p></div></div><div class="card-body"><button class="secondary" data-demo="document">Buka Dokumen Demo</button></div></article>
</section>`,

Invoices:`
<div class="page-head"><div><div class="eyebrow">MODE DEMO</div><h1>Invoices</h1><p>Contoh informasi invoice Client.</p></div></div>
<section class="grid">
<article class="card"><div class="card-head"><div><h2>INV-2026-0001</h2><p>Website Development</p></div><span class="badge">Menunggu</span></div>
<div class="card-body"><p>Total: <strong>Rp 5.300.000</strong></p><button class="secondary" data-demo="invoice">Lihat Invoice Demo</button></div></article>
</section>`,

Support:()=>`
<div class="page-head"><div><div class="eyebrow">MODE DEMO</div><h1>Support</h1><p>Coba membuat tiket tanpa mengirim data ke sistem nyata.</p></div></div>
<section class="grid">
<article class="card"><div class="card-head"><div><h2>Bantuan Client</h2><p>${state.support ? "1 tiket demo terbuka" : "Belum ada tiket demo"}</p></div></div>
<div class="card-body"><button class="primary" data-demo="ticket">Buat Tiket Demo</button></div></article>
</section>`
};

function active(name){
  document.querySelectorAll(".sidebar .nav a,.mobile-nav a").forEach(a=>{
    const n=a.dataset.view||a.textContent.trim();
    a.classList.toggle("active",n===name);
  });
}

function openView(name){
  main.innerHTML=name==="Dashboard"?home:
    name==="Support"?views.Support():views[name];
  active(name);
}

document.querySelectorAll(".sidebar .nav a,.mobile-nav a").forEach(a=>{
  a.onclick=e=>{
    e.preventDefault();
    const n=a.dataset.view||a.textContent.trim();
    openView(n==="Home"?"Dashboard":n);
  };
});

document.body.addEventListener("click",e=>{
  const b=e.target.closest("button");
  if(!b)return;

  if(b.textContent.trim()==="Lihat Project"){openView("Projects");return}
  if(b.textContent.trim()==="Lihat invoice"){openView("Invoices");return}
  if(b.textContent.trim()==="Dokumen"){openView("Documents");return}

  if(b.dataset.demo==="ticket"){
    state.support=1;save();openView("Support");
    msg("Tiket demo berhasil dibuat. Tidak dikirim ke sistem.");
  }

  if(["project","document","invoice"].includes(b.dataset.demo))
    msg("Ini hanya simulasi. Tidak ada data produksi yang dibuka.");
});

const bar=document.createElement("div");
bar.style.cssText="padding:10px;text-align:center;background:#dff7e9;color:#123b2e;font:600 13px system-ui";
bar.innerHTML='MODE DEMO — Data simulasi • Perubahan tidak disimpan &nbsp; <button id="demoReset">Reset Demo</button>';
document.body.prepend(bar);

document.getElementById("demoReset").onclick=()=>{
  sessionStorage.removeItem(KEY);
  state=fresh();save();openView("Dashboard");
  msg("Demo berhasil direset.");
};

document.querySelector(".sidebar-footer").innerHTML="Mode Demo &bull; Data simulasi";
save();

/* DEMO MOBILE SIDEBAR R1 */
const menuButton=document.querySelector("[data-menu]");
const sidebar=document.querySelector(".sidebar");

function closeDemoNav(){
  document.body.classList.remove("nav-open");
}

menuButton?.addEventListener("click",e=>{
  e.stopPropagation();
  document.body.classList.toggle("nav-open");
});

sidebar?.addEventListener("click",e=>{
  e.stopPropagation();
});

document.addEventListener("click",()=>{
  closeDemoNav();
});

document.querySelectorAll(".sidebar .nav a").forEach(a=>{
  a.addEventListener("click",()=>{
    closeDemoNav();
  });
});

document.addEventListener("keydown",e=>{
  if(e.key==="Escape") closeDemoNav();
});

/* DEMO MOBILE CLOSE R1 */
const demoCloseButton=document.createElement("button");
demoCloseButton.type="button";
demoCloseButton.className="sb-mobile-sidebar-close";
demoCloseButton.setAttribute("aria-label","Tutup navigasi");
demoCloseButton.innerHTML="&#10005;";

if(sidebar){
  sidebar.insertBefore(demoCloseButton,sidebar.firstChild);

  demoCloseButton.addEventListener("click",e=>{
    e.stopPropagation();
    closeDemoNav();
  });
}

/* DEMO EXIT BUTTON R1 */
const demoProject=document.createElement("a");
demoProject.href="https://srilexbuditra.work/#harga";
demoProject.target="_blank";
demoProject.rel="noopener";
demoProject.className="demo-project-cta";
demoProject.textContent="Mulai Project Nyata";
demoProject.setAttribute(
  "aria-label",
  "Mulai Project Nyata bersama Srilex Buditra"
);

const demoExit=document.createElement("a");
demoExit.href="/portal/lead/";
demoExit.className="demo-exit-button";
demoExit.textContent="Keluar Demo";

const demoProfile=document.querySelector(".top-actions .profile");
if(demoProfile){
  demoProfile.parentNode.insertBefore(demoProject,demoProfile);
  demoProfile.parentNode.insertBefore(demoExit,demoProfile);
}

const demoExitStyle=document.createElement("style");
demoExitStyle.textContent=`
.demo-project-cta{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-height:42px;
  padding:0 16px;
  border:1px solid #168a63;
  border-radius:12px;
  background:#168a63;
  color:#fff;
  font-size:13px;
  font-weight:850;
  text-decoration:none;
  white-space:nowrap;
  box-shadow:0 8px 18px rgba(22,138,99,.18);
}
.demo-project-cta:hover{
  background:#107653;
  border-color:#107653;
}
.demo-exit-button{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-height:42px;
  padding:0 16px;
  border:1px solid #cbd8d3;
  border-radius:12px;
  background:#fff;
  color:#173c32;
  font-weight:700;
  text-decoration:none;
  white-space:nowrap;
}
.demo-exit-button:hover{
  background:#eef8f3;
}
@media(max-width:700px){
  .top-actions{
    gap:6px;
  }
  .top-actions .profile{
    padding:5px;
    gap:0;
  }
  .top-actions .profile .profile-copy{
    display:none;
  }
  .demo-project-cta{
    padding:0 11px;
    font-size:12px;
  }
  .demo-exit-button{
    padding:0 10px;
    font-size:12px;
  }
}
@media(max-width:560px){
  .demo-project-cta{
    min-width:88px;
    padding:0 8px;
    font-size:0;
  }
  .demo-project-cta::after{
    content:"Mulai Project";
    font-size:11px;
    font-weight:850;
  }
  .demo-exit-button{
    min-width:52px;
    padding:0 7px;
    font-size:0;
  }
  .demo-exit-button::after{
    content:"Keluar";
    font-size:11px;
    font-weight:700;
  }
}
`;
document.head.appendChild(demoExitStyle);

const demoMobileNavStyle=document.createElement("style");
demoMobileNavStyle.textContent=`
@media(max-width:820px){
  .mobile-nav{
    gap:6px;
    padding:8px 10px max(9px,env(safe-area-inset-bottom));
    background:rgba(255,255,255,.98);
    border-top:1px solid #dfe8e4;
    box-shadow:0 -10px 30px rgba(15,44,38,.08);
  }

  .mobile-nav a{
    min-height:52px;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:4px;
    padding:6px 4px;
    border-radius:14px;
    color:#6f7d77;
    font-size:10px;
    font-weight:700;
    line-height:1;
    transition:background .18s ease,color .18s ease,transform .18s ease;
  }

  .mobile-nav-icon{
    width:21px;
    height:21px;
    fill:none;
    stroke:currentColor;
    stroke-width:1.8;
    stroke-linecap:round;
    stroke-linejoin:round;
  }

  .mobile-nav-label{
    display:block;
    font-size:10px;
    line-height:1;
  }

  .mobile-nav a.active{
    background:#e8f7f1;
    color:#12694f;
    font-weight:850;
    box-shadow:inset 0 0 0 1px rgba(22,138,99,.10);
  }

  .mobile-nav a.active .mobile-nav-icon{
    transform:translateY(-1px);
  }

  .content{
    padding-bottom:108px;
  }
}
`;
document.head.appendChild(demoMobileNavStyle);

/* DEMO DASHBOARD INTERACTION R1 */
function demoPanel(title,body){
  document.getElementById("demoPanelOverlay")?.remove();

  const o=document.createElement("div");
  o.id="demoPanelOverlay";
  o.style.cssText="position:fixed;inset:0;z-index:10020;background:#061d18aa;display:grid;place-items:center;padding:20px";

  o.innerHTML=`
    <section style="width:min(520px,100%);background:#fff;color:#173c32;border-radius:18px;padding:22px;box-shadow:0 24px 70px #0005">
      <div style="display:flex;justify-content:space-between;gap:16px;align-items:center">
        <h2 style="margin:0">${title}</h2>
        <button type="button" data-demo-panel-close style="font-size:20px">✕</button>
      </div>
      <div style="margin-top:18px;line-height:1.6">${body}</div>
    </section>`;

  document.body.appendChild(o);

  o.addEventListener("click",e=>{
    if(e.target===o || e.target.closest("[data-demo-panel-close]")) o.remove();
  });
}

document.addEventListener("click",e=>{
  const b=e.target.closest("button");
  if(!b)return;

  const text=b.textContent.trim();

  if(text==="Detail"){
    demoPanel("Detail Project",`
      <p><strong>Company Website</strong></p>
      <p>PRJ-2026-0001 • Website Development</p>
      <p>Progress: <strong>82%</strong></p>
      <p>Milestone berikutnya: <strong>Final UI Review</strong></p>
      <p>Status: <strong>On Track</strong></p>
    `);
    return;
  }

  if(text==="Semua"){
    demoPanel("Aktivitas Terbaru",`
      <p>✓ Homepage UI disetujui — Hari ini</p>
      <p>↑ Proposal final tersedia — Kemarin</p>
      <p>✓ Development milestone diperbarui — 20 Sep</p>
      <p>✓ Requirement selesai — 18 Sep</p>
    `);
    return;
  }

  if(text==="Buat tiket"){
    openView("Support");
    return;
  }

  if(text==="Keamanan"){
    demoPanel("Keamanan Akun Demo",`
      <p><strong>Mode Demo</strong></p>
      <p>Password, autentikasi, dan perubahan akun tidak menggunakan data produksi.</p>
      <p>Semua perubahan simulasi berakhir ketika sesi Demo direset.</p>
    `);
    return;
  }

  if(b.classList.contains("icon-btn")){
    demoPanel("Notifikasi Demo",`
      <p>● Project Company Website diperbarui.</p>
      <p>● Proposal final tersedia.</p>
      <p>● Milestone Development mencapai 82%.</p>
    `);
    return;
  }

  if(b.classList.contains("profile")){
    const emailRow=demoIdentity.email
      ? `<p>${safeHtml(demoIdentity.email)}</p>`
      : "";

    demoPanel("Profil Client Demo",`
      <p><strong>${safeHtml(demoIdentity.fullName)}</strong></p>
      <p>${safeHtml(demoIdentity.companyName)}</p>
      ${emailRow}
      <p>Role: Client Demo</p>
      <p>Status: Mode Demo</p>
      <p>Data yang Anda lihat adalah data simulasi dan tidak tersimpan ke sistem produksi.</p>
    `);
  }
});
