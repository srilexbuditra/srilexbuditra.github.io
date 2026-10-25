/* DPN Super Admin separate login v1: frontend only. Never enables login without independent backend readiness. */
(() => {
  'use strict';
  const BASE = '/network/api/dpn/v1/super-admin/auth';
  const DASHBOARD = '/network/admin/';
  const $ = (id) => document.getElementById(id);
  const form = $('loginForm');
  const email = $('email');
  const password = $('password');
  const toggle = $('passwordToggle');
  const submit = $('submitButton');
  const notice = $('serviceNotice');
  const serviceTitle = $('serviceTitle');
  const serviceDescription = $('serviceDescription');
  const message = $('formMessage');
  let ready = false;
  let busy = false;

  function error(text) {
    message.textContent = text;
    message.hidden = false;
  }
  function clearError() {
    message.textContent = '';
    message.hidden = true;
  }
  function setReady(value) {
    ready = Boolean(value);
    email.disabled = !ready;
    password.disabled = !ready;
    toggle.disabled = !ready;
    submit.disabled = !ready;
    notice.classList.toggle('ready', ready);
    serviceTitle.textContent = ready ? 'Layanan autentikasi siap' : 'Login belum diaktifkan';
    serviceDescription.textContent = ready
      ? 'Silakan masuk dengan akun Super Admin yang telah aktif dan terverifikasi.'
      : 'Formulir menunggu layanan autentikasi independen dan perlindungan dashboard selesai diaktifkan.';
    if (ready) email.focus({preventScroll: true});
  }

  // Readiness is only a UX gate. Real security MUST be enforced in the Worker/DO backend
  // and in the edge guard protecting /network/admin/* and all administrative APIs.
  async function checkReadiness() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    try {
      const res = await fetch(`${BASE}/ready`, {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: {Accept: 'application/json'},
        signal: controller.signal,
      });
      if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) return;
      const info = await res.json();
      if (info && info.service === 'dpn-super-admin-independent-auth' &&
          info.ready === true && info.dashboardProtected === true &&
          info.roleGuard === 'super_admin' && info.credentialStore === 'independent') {
        setReady(true);
      }
    } catch (_) {
      // Fail closed: no credentials are accepted when readiness is missing or untrusted.
    } finally {
      clearTimeout(timeout);
    }
  }

  toggle.addEventListener('click', () => {
    if (!ready) return;
    const showing = password.type === 'text';
    password.type = showing ? 'password' : 'text';
    toggle.textContent = showing ? 'Tampilkan' : 'Sembunyikan';
    toggle.setAttribute('aria-pressed', String(!showing));
    toggle.setAttribute('aria-label', showing ? 'Tampilkan password' : 'Sembunyikan password');
    password.focus({preventScroll:true});
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!ready || busy) return;
    clearError();
    const identity = email.value.trim().toLowerCase();
    const secret = password.value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity) || identity.length > 254) {
      error('Periksa kembali alamat email Anda.');
      return;
    }
    if (secret.length < 6 || secret.length > 35) {
      error('Password harus terdiri dari 6–35 karakter.');
      return;
    }
    busy = true;
    submit.disabled = true;
    submit.querySelector('span').textContent = 'Memeriksa akses…';
    try {
      const response = await fetch(`${BASE}/login`, {
        method: 'POST',
        credentials: 'same-origin',
        redirect: 'error',
        cache: 'no-store',
        headers: {'Content-Type':'application/json', Accept:'application/json'},
        body: JSON.stringify({email:identity,password:secret}),
      });
      const ct = response.headers.get('content-type') || '';
      let data = null;
      if (ct.includes('application/json')) data = await response.json();
      if (response.ok && data?.ok === true && data?.role === 'super_admin' && data?.session === 'active') {
        password.value = '';
        window.location.assign(DASHBOARD);
        return;
      }
      error(response.status === 429 ? 'Terlalu banyak percobaan. Coba kembali beberapa saat lagi.' :
        'Login tidak berhasil. Periksa akun atau status aktivasi Anda.');
    } catch (_) {
      error('Layanan belum dapat dihubungi. Coba kembali setelah layanan diaktifkan.');
    } finally {
      password.value = '';
      busy = false;
      submit.disabled = !ready;
      submit.querySelector('span').textContent = 'Masuk Dashboard';
    }
  });

  setReady(false);
  void checkReadiness();
})();
