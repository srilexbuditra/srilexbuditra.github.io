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
