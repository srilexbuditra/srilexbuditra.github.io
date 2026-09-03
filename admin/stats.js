const STATS_API =
  "https://srilexbuditra-visitors-api.srilexbuditra.workers.dev/stats";

const apiKeyInput = document.getElementById("apiKey");
const loadBtn = document.getElementById("loadBtn");
const statusBox = document.getElementById("status");
const dashboard = document.getElementById("dashboard");

async function loadStats() {
  const key = apiKeyInput.value.trim();

  if (!key) {
    statusBox.textContent = "Masukkan API Key terlebih dahulu.";
    return;
  }

  statusBox.textContent = "Mengambil data statistik...";
  dashboard.style.display = "none";

  try {
    const response = await fetch(STATS_API, {
      method: "GET",
      headers: {
  "Authorization": "Bearer " + key
}
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("API Key tidak valid.");
      }

      throw new Error(
        "Gagal mengambil statistik. HTTP " + response.status
      );
    }

    const data = await response.json();

    document.getElementById("totalVisitors").textContent =
      data.total_visitors ?? 0;

    document.getElementById("totalVisits").textContent =
      data.total_visits ?? 0;

    dashboard.style.display = "block";
    statusBox.textContent = "Statistik berhasil dimuat.";
  } catch (error) {
    console.error(error);
    statusBox.textContent = error.message;
  }
}

loadBtn.addEventListener("click", loadStats);

apiKeyInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    loadStats();
  }
});
