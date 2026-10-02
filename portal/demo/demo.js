"use strict";

const KEY="sb_client_demo_r1";
const fresh=()=>({support:0});
let state=JSON.parse(sessionStorage.getItem(KEY)||"null")||fresh();
const main=document.querySelector("main.content");
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
    const n=a.textContent.trim();
    a.classList.toggle("active",n===name||(name==="Dashboard"&&n==="Home"));
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
    const n=a.textContent.trim();
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
bar.innerHTML='MODE DEMO — Data simulasi • Perubahan tidak disimpan &nbsp; <button id="demoReset">Reset Demo</button> &nbsp; <a href="/portal/lead/">Keluar Demo</a>';
document.body.prepend(bar);

document.getElementById("demoReset").onclick=()=>{
  sessionStorage.removeItem(KEY);
  state=fresh();save();openView("Dashboard");
  msg("Demo berhasil direset.");
};

document.querySelector(".sidebar-footer").innerHTML="Mode Demo &bull; Data simulasi";
save();
