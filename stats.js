const STATS_API =
  "https://srilexbuditra-visitors-api.srilexbuditra.workers.dev/stats";

const apiKeyInput = document.getElementById("apiKey");
const loadBtn = document.getElementById("loadBtn");
const refreshBtn = document.getElementById("refreshBtn");
const exportBtn = document.getElementById("exportBtn");
const statusBox = document.getElementById("status");
const dashboard = document.getElementById("dashboard");
const updatedAt = document.getElementById("updatedAt");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const applyFilterBtn = document.getElementById("applyFilterBtn");
const resetFilterBtn = document.getElementById("resetFilterBtn");
const periodLabel = document.getElementById("periodLabel");

let lastStatsData = null;
let selectedTrendDays = 7;
let activeStart = "";
let activeEnd = "";
const AUTO_REFRESH_MS = 15 * 1000;
let autoRefreshTimer = null;

const COUNTRY_NAMES = {
  ID: "🇮🇩 Indonesia",
  US: "🇺🇸 United States",
  SG: "🇸🇬 Singapore",
  MY: "🇲🇾 Malaysia",
  AU: "🇦🇺 Australia",
  GB: "🇬🇧 United Kingdom",
  JP: "🇯🇵 Japan",
  CN: "🇨🇳 China",
  IN: "🇮🇳 India",
  DE: "🇩🇪 Germany",
  FR: "🇫🇷 France",
  NL: "🇳🇱 Netherlands",
  CA: "🇨🇦 Canada",
  TH: "🇹🇭 Thailand",
  PH: "🇵🇭 Philippines",
  VN: "🇻🇳 Vietnam",
  KR: "🇰🇷 South Korea",
  AE: "🇦🇪 United Arab Emirates"
};


function jakartaDate(offsetDays = 0) {
  const d = new Date(); d.setDate(d.getDate() + offsetDays);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone:"Asia/Jakarta", year:"numeric", month:"2-digit", day:"2-digit"
  }).formatToParts(d);
  const v=Object.fromEntries(parts.map(p=>[p.type,p.value]));
  return `${v.year}-${v.month}-${v.day}`;
}
function updatePeriodLabel() {
  periodLabel.textContent = !activeStart && !activeEnd ? "Periode: Semua data"
    : activeStart===activeEnd ? `Periode: ${activeStart}`
    : `Periode: ${activeStart || "awal"} s/d ${activeEnd || "akhir"}`;
}
function setPreset(range) {
  const today=jakartaDate();
  if(range==="today"){activeStart=today;activeEnd=today;}
  else if(range==="7"){activeStart=jakartaDate(-6);activeEnd=today;}
  else if(range==="30"){activeStart=jakartaDate(-29);activeEnd=today;}
  else {activeStart="";activeEnd="";}
  startDateInput.value=activeStart; endDateInput.value=activeEnd;
  document.querySelectorAll(".preset-btn").forEach(b=>b.classList.toggle("active",b.dataset.range===range));
  updatePeriodLabel();
}
function statsUrl() {
  const u=new URL(STATS_API); u.searchParams.set("t",Date.now());
  if(activeStart) u.searchParams.set("start",activeStart);
  if(activeEnd) u.searchParams.set("end",activeEnd);
  return u.toString();
}

function formatLabel(value) {
  if (!value) return "Unknown";
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatPage(value) {
  if (!value || value === "unknown") return "Unknown";
  try {
    const url = new URL(value);
    return url.hostname + (url.pathname || "/") + url.search;
  } catch {
    return String(value);
  }
}

function formatReferrer(value) {
  if (!value || value === "direct") return "Direct";
  if (value === "manual-test") return "Manual Test";
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return formatLabel(value);
  }
}

function formatDateTime(value) {
  if (!value) return "Unknown";
  const normalized = String(value).includes("T")
    ? String(value)
    : String(value).replace(" ", "T") + "Z";
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

function setNumber(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = String(value ?? 0);
}

function renderList(elementId, rows, labelGetter) {
  const container = document.getElementById(elementId);
  if (!container) return;
  container.innerHTML = "";

  if (!Array.isArray(rows) || rows.length === 0) {
    const empty = document.createElement("div");
    empty.className = "stats-empty";
    empty.textContent = "Belum ada data.";
    container.appendChild(empty);
    return;
  }

  rows.forEach((row) => {
    const item = document.createElement("div");
    item.className = "stats-row";

    const label = document.createElement("span");
    label.textContent = labelGetter(row);

    const total = document.createElement("strong");
    total.textContent = String(row.total ?? 0);

    item.append(label, total);
    container.appendChild(item);
  });
}

function renderRecentVisits(rows) {
  const tbody = document.getElementById("recentVisits");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (!Array.isArray(rows) || rows.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 6;
    td.className = "recent-empty";
    td.textContent = "Belum ada event kunjungan V4.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    const code = String(row.country || "").toUpperCase();
    const values = [
      formatDateTime(row.visited_at),
      COUNTRY_NAMES[code] || (code || "Unknown"),
      formatLabel(row.device_type),
      formatLabel(row.browser),
      formatPage(row.page),
      formatReferrer(row.referrer)
    ];

    values.forEach((value, index) => {
      const td = document.createElement("td");
      td.textContent = value;
      if (index === 4) td.className = "recent-page";
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

function localDateKey(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(d);
  const values = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function renderTrend(rows, days = 7) {
  const chart = document.getElementById("trendChart");
  if (!chart) return;
  chart.innerHTML = "";

  const map = new Map(
    (Array.isArray(rows) ? rows : []).map((row) => [
      String(row.day),
      Number(row.total || 0)
    ])
  );

  const data = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const day = localDateKey(-i);
    data.push({ day, total: map.get(day) || 0 });
  }

  const max = Math.max(1, ...data.map((item) => item.total));

  data.forEach((item) => {
    const column = document.createElement("div");
    column.className = "chart-column";

    const value = document.createElement("div");
    value.className = "chart-value";
    value.textContent = item.total;

    const barWrap = document.createElement("div");
    barWrap.className = "chart-bar-wrap";

    const bar = document.createElement("div");
    bar.className = "chart-bar";
    bar.style.height = `${Math.max(4, (item.total / max) * 100)}%`;
    bar.title = `${item.day}: ${item.total} visits`;

    const label = document.createElement("div");
    label.className = "chart-label";
    const [year, month, day] = item.day.split("-");
    label.textContent = `${day}/${month}`;

    barWrap.appendChild(bar);
    column.append(value, barWrap, label);
    chart.appendChild(column);
  });
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function exportCsv() {
  if (!lastStatsData) return;

  const rows = [
    ["Metric", "Value"],
    ["Total Visitors", lastStatsData.total_visitors ?? 0],
    ["Total Visits", lastStatsData.total_visits ?? 0],
    ["Visitors Today", lastStatsData.visitors_today ?? 0],
    ["Visits Today", lastStatsData.visits_today ?? 0],
    ["Visitors 7 Days", lastStatsData.visitors_7_days ?? 0],
    ["Visits 7 Days", lastStatsData.visits_7_days ?? 0],
    ["Visitors 30 Days", lastStatsData.visitors_30_days ?? 0],
    ["Visits 30 Days", lastStatsData.visits_30_days ?? 0],
    ["Returning Visitors", lastStatsData.returning_visitors ?? 0],
    ["Average Visits per Visitor", lastStatsData.avg_visits_per_visitor ?? 0],
    [],
    ["Recent Visit Time", "Country", "Device", "Browser", "Page", "Referrer"]
  ];

  (lastStatsData.recent_visits || []).forEach((row) => {
    rows.push([
      row.visited_at,
      row.country,
      row.device_type,
      row.browser,
      row.page,
      row.referrer
    ]);
  });

  const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const suffix = activeStart || activeEnd ? `${activeStart || "awal"}_${activeEnd || "akhir"}` : "semua";
  a.download = `srilexbuditra-analytics-${suffix}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function renderDashboard(data) {
  lastStatsData = data;

  setNumber("onlineNow", data.online_now ?? 0);
  renderOnlinePages(data.online_pages || []);
  renderOnlineDetails(data.online_details || []);
  setNumber("totalVisitors", data.total_visitors);
  setNumber("totalVisits", data.total_visits);
  setNumber("visitorsToday", data.visitors_today);
  setNumber("visitsToday", data.visits_today);
  setNumber("visitors7Days", data.visitors_7_days);
  setNumber("visits7Days", data.visits_7_days);
  setNumber("visitors30Days", data.visitors_30_days);
  setNumber("visits30Days", data.visits_30_days);
  setNumber("returningVisitors", data.returning_visitors);
  setNumber("avgVisits", data.avg_visits_per_visitor);

  renderList("deviceStats", data.devices, (row) =>
    formatLabel(row.device_type)
  );

  renderList("browserStats", data.browsers, (row) =>
    formatLabel(row.browser)
  );

  renderList("countryStats", data.countries, (row) => {
    const code = String(row.country || "").toUpperCase();
    return COUNTRY_NAMES[code] || (code || "Unknown");
  });

  renderList(
    "visitorTypeStats",
    [
      { label: "New / One-time", total: data.new_visitors ?? 0 },
      { label: "Returning", total: data.returning_visitors ?? 0 }
    ],
    (row) => row.label
  );

  renderList("topPagesStats", data.top_pages, (row) =>
    formatPage(row.page)
  );

  renderList("referrerStats", data.referrers, (row) =>
    formatReferrer(row.referrer)
  );

  renderRecentVisits(data.recent_visits);
  renderTrend(data.daily_trend, selectedTrendDays);

  const trackingNote = document.getElementById("trackingNote");
  if (trackingNote) {
    trackingNote.textContent = data.event_tracking_since
      ? `Event-level tracking aktif sejak ${formatDateTime(data.event_tracking_since)}. Total Visits tetap mempertahankan histori lama.`
      : "Event-level tracking akan mulai tercatat setelah Analytics V4 menerima kunjungan pertama.";
  }

  updatedAt.textContent =
    "Diperbarui " +
    new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(new Date());

  dashboard.style.display = "block";
}



function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderOnlinePages(items = []) {
  const box = document.getElementById("onlinePages");
  if (!box) return;

  if (!items.length) {
    box.innerHTML = '<div class="empty-state">Belum ada pengunjung online.</div>';
    return;
  }

  box.innerHTML = items.map((item) => {
    let label = item.page || "unknown";
    try {
      const u = new URL(label);
      label = u.pathname + u.search + u.hash;
    } catch (_) {}
    const total = Number(item.total || 0);
    return `<div class="online-page-row">
      <span class="online-dot">●</span>
      <span class="online-page-name">${escapeHtml(label)}</span>
      <strong>${total} online</strong>
    </div>`;
  }).join("");
}


function countryLabel(code) {
  const map = { ID:"🇮🇩 Indonesia", US:"🇺🇸 United States", SG:"🇸🇬 Singapore", MY:"🇲🇾 Malaysia", AU:"🇦🇺 Australia", GB:"🇬🇧 United Kingdom" };
  return map[code] || (code || "Unknown");
}
function relativeActive(value) {
  if (!value) return "baru saja";
  const d = new Date(String(value).replace(" ", "T") + "Z");
  const sec = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
  return sec < 60 ? `${sec} detik lalu` : `${Math.floor(sec/60)} menit lalu`;
}
function renderOnlineDetails(items = []) {
  const box = document.getElementById("onlineDetails");
  if (!box) return;
  if (!items.length) {
    box.innerHTML = '<div class="empty-state">Belum ada pengunjung online.</div>';
    return;
  }
  box.innerHTML = items.map(item => {
    let page = item.page || "unknown";
    try { const u = new URL(page); page = u.pathname + u.search + u.hash; } catch (_) {}
    return `<div class="online-detail-row">
      <span class="online-dot">●</span><strong>${escapeHtml(page)}</strong>
      <span>${escapeHtml(countryLabel(item.country))}</span>
      <span>${escapeHtml(item.device_type || "unknown")}</span>
      <span>${escapeHtml(item.browser || "unknown")}</span>
      <span>${escapeHtml(relativeActive(item.last_active))}</span>
    </div>`;
  }).join("");
}
async function loadStats() {
  const key = apiKeyInput.value.trim();

  if (!key) {
    statusBox.textContent = "Masukkan API Key terlebih dahulu.";
    return;
  }

  statusBox.textContent = "Mengambil data statistik...";
  loadBtn.disabled = true;
  if (refreshBtn) refreshBtn.disabled = true;

  try {
    const response = await fetch(statsUrl(), {
      method: "GET",
      headers: {
        Authorization: "Bearer " + key
      },
      cache: "no-store"
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("API Key tidak valid.");
      }
      throw new Error("Gagal mengambil statistik. HTTP " + response.status);
    }

    const data = await response.json();
    renderDashboard(data);
    statusBox.textContent = "Statistik berhasil dimuat.";
  } catch (error) {
    console.error(error);
    statusBox.textContent = error.message;
  } finally {
    loadBtn.disabled = false;
    if (refreshBtn) refreshBtn.disabled = false;
  }
}

loadBtn.addEventListener("click", loadStats);
refreshBtn?.addEventListener("click", loadStats);
exportBtn?.addEventListener("click", exportCsv);

apiKeyInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") loadStats();
});

document.querySelectorAll(".range-btn").forEach((button) => {
  button.addEventListener("click", () => {
    selectedTrendDays = Number(button.dataset.days || 7);
    document.querySelectorAll(".range-btn").forEach((item) => {
      item.classList.toggle("active", item === button);
    });
    if (lastStatsData) renderTrend(lastStatsData.daily_trend, selectedTrendDays);
  });
});

document.querySelectorAll(".preset-btn").forEach(button => button.addEventListener("click", () => {
  setPreset(button.dataset.range); loadStats();
}));
applyFilterBtn?.addEventListener("click", () => {
  activeStart=startDateInput.value; activeEnd=endDateInput.value;
  if(activeStart && activeEnd && activeStart>activeEnd){statusBox.textContent="Tanggal mulai tidak boleh setelah tanggal akhir.";return;}
  document.querySelectorAll(".preset-btn").forEach(b=>b.classList.remove("active"));
  updatePeriodLabel(); loadStats();
});
resetFilterBtn?.addEventListener("click",()=>{setPreset("today");loadStats();});
setPreset("today");


/* =========================================================
   Analytics V5.1 — robust period filter fix
   Uses capture phase so preset clicks always update period.
   ========================================================= */
const v51PresetContainer = document.querySelector(".preset-buttons");

v51PresetContainer?.addEventListener(
  "click",
  (event) => {
    const button = event.target.closest(".preset-btn");
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();

    const range = button.dataset.range;
    setPreset(range);
    statusBox.textContent = "Mengubah periode...";
    loadStats();
  },
  true
);

applyFilterBtn?.addEventListener(
  "click",
  (event) => {
    event.preventDefault();
    event.stopPropagation();

    activeStart = startDateInput.value;
    activeEnd = endDateInput.value;

    if (activeStart && activeEnd && activeStart > activeEnd) {
      statusBox.textContent =
        "Tanggal mulai tidak boleh setelah tanggal akhir.";
      return;
    }

    document.querySelectorAll(".preset-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    updatePeriodLabel();
    statusBox.textContent = "Menerapkan filter tanggal...";
    loadStats();
  },
  true
);

resetFilterBtn?.addEventListener(
  "click",
  (event) => {
    event.preventDefault();
    event.stopPropagation();
    setPreset("today");
    loadStats();
  },
  true
);

// Analytics V6.4 — realtime dashboard auto refresh.
// GET /stats only; this does not create visit events.
function startAutoRefresh() {
  if (autoRefreshTimer) clearInterval(autoRefreshTimer);
  autoRefreshTimer = setInterval(() => {
    if (document.visibilityState === "visible") loadStats();
  }, AUTO_REFRESH_MS);
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") loadStats();
});
startAutoRefresh();
