const API = "https://admin-api.srilexbuditra.work";

const form = document.getElementById("bootstrapForm");
const statusBox = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");
const passwordInput = document.getElementById("password");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

document.querySelectorAll(".toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    btn.textContent = show ? "Sembunyi" : "Lihat";
  });
});

passwordInput.addEventListener("input", () => {
  const p = passwordInput.value;
  let score = 0;
  if (p.length >= 12) score++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  const widths = ["0%","28%","52%","76%","100%"];
  const labels = ["Belum diisi","Lemah","Cukup","Baik","Kuat"];
  strengthBar.style.width = widths[score];
  strengthText.textContent = labels[score];
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
  const password = passwordInput.value;
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
  submitBtn.querySelector(".btn-label").textContent = "Membuat akun...";

  try {
    const response = await fetch(API + "/auth/bootstrap", {
      method: "POST",
      credentials: "include",
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      body: JSON.stringify({display_name, username, password})
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Bootstrap gagal.");

    passwordInput.value = "";
    document.getElementById("confirmPassword").value = "";
    strengthBar.style.width = "0%";
    strengthText.textContent = "Belum diisi";
    showStatus("ok", "Super Administrator berhasil dibuat. Selanjutnya gunakan halaman Login Admin.");
    submitBtn.querySelector(".btn-label").textContent = "Bootstrap Selesai";
  } catch (error) {
    showStatus("err", error.message || "Tidak dapat menghubungi Admin API.");
    submitBtn.disabled = false;
    submitBtn.querySelector(".btn-label").textContent = "Aktifkan Super Administrator";
  }
});
