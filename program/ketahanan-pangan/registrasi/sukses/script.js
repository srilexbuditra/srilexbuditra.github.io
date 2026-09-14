(() => {
  'use strict';

  const STORAGE_KEY = 'kp_registration_success_v1';
  const WINDOW_NAME_PREFIX = STORAGE_KEY + ':';
  const successCard = document.getElementById('successCard');
  const unavailableCard = document.getElementById('unavailableCard');
  const registrationId = document.getElementById('registrationId');
  const copyButton = document.getElementById('copyRegistration');
  const copyStatus = document.getElementById('copyStatus');
  const publicSourcePanel = document.getElementById('publicSourcePanel');
  const publicReference = document.getElementById('publicReference');
  const copyPublicReference = document.getElementById('copyPublicReference');
  const publicSourceLink = document.getElementById('publicSourceLink');
  const publicSourceStatus = document.getElementById('publicSourceStatus');
  const PUBLIC_SOURCE_ISSUE_ENDPOINT = '/program/ketahanan-pangan/sumber/issue';

  const parseSuccessPayload = (raw) => {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      const id = String(parsed?.registration_id || '').trim();
      if (!id || id.length > 100) return null;
      return { registration_id: id, created_at: Number(parsed?.created_at || 0) };
    } catch (_) {
      return null;
    }
  };

  const readSuccess = () => {
    let data = null;
    try {
      data = parseSuccessPayload(sessionStorage.getItem(STORAGE_KEY));
    } catch (_) {
      data = null;
    }

    if (!data) {
      try {
        if (typeof window.name === 'string' && window.name.startsWith(WINDOW_NAME_PREFIX)) {
          data = parseSuccessPayload(window.name.slice(WINDOW_NAME_PREFIX.length));
        }
      } catch (_) {
        data = null;
      }
    }

    // Jangan biarkan fallback window.name membawa nomor registrasi ke navigasi berikutnya.
    try {
      if (typeof window.name === 'string' && window.name.startsWith(WINDOW_NAME_PREFIX)) window.name = '';
    } catch (_) {}

    return data;
  };

  const copyText = async (value) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  };

  const issuePublicSource = async (registrationIdValue) => {
    if (!publicSourcePanel || !publicReference || !publicSourceLink) return;
    try {
      const response = await fetch(PUBLIC_SOURCE_ISSUE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ registration_id: registrationIdValue }),
        cache: 'no-store',
        credentials: 'same-origin'
      });
      let result = {};
      try { result = await response.json(); } catch (_) {}
      if (!response.ok || !result.ok || !result.public_ref || !result.source_url) return;

      publicReference.textContent = result.public_ref;
      publicSourceLink.href = result.source_url;
      publicSourcePanel.hidden = false;

      copyPublicReference?.addEventListener('click', async () => {
        if (publicSourceStatus) publicSourceStatus.textContent = '';
        try {
          await copyText(result.public_ref);
          if (publicSourceStatus) publicSourceStatus.textContent = 'Kode referensi publik berhasil disalin.';
          copyPublicReference.textContent = 'Tersalin ✓';
          window.setTimeout(() => { copyPublicReference.textContent = 'Salin Kode Publik'; }, 1800);
        } catch (_) {
          if (publicSourceStatus) publicSourceStatus.textContent = 'Tidak dapat menyalin otomatis.';
        }
      });
    } catch (_) {
      // Fitur sumber publik bersifat tambahan. Registrasi dan nomor KTPG tetap valid
      // walaupun layanan sumber publik sedang tidak tersedia.
    }
  };

  const data = readSuccess();
  if (!data) {
    successCard.hidden = true;
    unavailableCard.hidden = false;
    return;
  }

  registrationId.textContent = data.registration_id;
  copyButton.hidden = false;
  issuePublicSource(data.registration_id);

  copyButton.addEventListener('click', async () => {
    copyStatus.textContent = '';
    try {
      await copyText(data.registration_id);
      copyStatus.textContent = 'Nomor registrasi berhasil disalin.';
      copyButton.textContent = 'Tersalin ✓';
      window.setTimeout(() => { copyButton.textContent = 'Salin Nomor Registrasi'; }, 1800);
    } catch (_) {
      copyStatus.textContent = 'Tidak dapat menyalin otomatis. Tekan dan tahan nomor registrasi untuk menyalin.';
    }
  });
})();
