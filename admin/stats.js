const STATS_API =
  "https://srilexbuditra-visitors-api.srilexbuditra.workers.dev/stats";

const apiKeyInput = document.getElementById("apiKey");
const loadBtn = document.getElementById("loadBtn");
const statusBox = document.getElementById("status");
const dashboard = document.getElementById("dashboard");

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
  CA: "🇨🇦 Canada"
};

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


function formatDateTime(value) {
  if (!value) return "Unknown";
  const normalized = String(value).includes("T")
    ? String(value)
    : String(value).replace(" ", "T") + "Z";
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false
  }).format(date);
}

function renderRecentVisitors(rows) {
  const tbody = document.getElementById("recentVisitors");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (!Array.isArray(rows) || rows.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 6;
    td.className = "recent-empty";
    td.textContent = "Belum ada data visitor terbaru.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    const code = String(row.country || "").toUpperCase();
    const values = [
      formatDateTime(row.last_seen),
      COUNTRY_NAMES[code] || (code || "Unknown"),
      formatLabel(row.device_type),
      formatLabel(row.browser),
      formatPage(row.last_page),
      String(row.visit_count ?? 0)
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

async function loadStats() {
  const key = apiKeyInput.value.trim();

  if (!key) {
    statusBox.textContent = "Masukkan API Key terlebih dahulu.";
    return;
  }

  statusBox.textContent = "Mengambil data statistik...";
  dashboard.style.display = "none";
  loadBtn.disabled = true;

  try {
    const response = await fetch(STATS_API, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + key
      }
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("API Key tidak valid.");
      }

      throw new Error("Gagal mengambil statistik. HTTP " + response.status);
    }

    const data = await response.json();

    document.getElementById("totalVisitors").textContent =
      data.total_visitors ?? 0;

    document.getElementById("totalVisits").textContent =
      data.total_visits ?? 0;

    document.getElementById("visitorsToday").textContent =
      data.visitors_today ?? 0;

    renderList("deviceStats", data.devices, (device) =>
      formatLabel(device.device_type)
    );

    renderList("browserStats", data.browsers, (browser) =>
      formatLabel(browser.browser)
    );

    renderList("countryStats", data.countries, (country) => {
      const code = String(country.country || "").toUpperCase();
      return COUNTRY_NAMES[code] || (code || "Unknown");
    });

    renderList("topPagesStats", data.top_pages, (row) =>
      formatPage(row.page)
    );

    renderList("referrerStats", data.referrers, (row) =>
      formatReferrer(row.referrer)
    );

    renderRecentVisitors(data.recent_visitors);

    dashboard.style.display = "block";
    statusBox.textContent = "Statistik berhasil dimuat.";
  } catch (error) {
    console.error(error);
    statusBox.textContent = error.message;
  } finally {
    loadBtn.disabled = false;
  }
}

loadBtn.addEventListener("click", loadStats);

apiKeyInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    loadStats();
  }
});
