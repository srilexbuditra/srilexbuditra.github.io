const API = "https://admin-api.srilexbuditra.work";

const form = document.getElementById("bootstrapForm");
const statusBox = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

document.querySelectorAll(".toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    btn.textContent = show ? "Sembunyi" : "Lihat";
  });
});

function showStatus(kind, message) {
  statusBox.className = "status " + kind;
  statusBox.textContent = message;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusBox.className = "status";

  const display_name = document.getElementById("displayName").value.trim();
  const username = document.getElementById("username").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    showStatus("err", "Konfirmasi password tidak sama.");
    return;
  }
  if (password.length < 12) {
    showStatus("err", "Password minimal 12 karakter.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Membuat akun...";

  try {
    const response = await fetch(API + "/auth/bootstrap", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ display_name, username, password })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Bootstrap gagal.");

    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
    showStatus("ok", "Super Administrator berhasil dibuat. Selanjutnya gunakan halaman Login Admin.");
    submitBtn.textContent = "Bootstrap Selesai";
  } catch (error) {
    showStatus("err", error.message || "Tidak dapat menghubungi Admin API.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Buat Super Administrator";
  }
});
