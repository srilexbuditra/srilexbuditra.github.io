(() => {
  'use strict';

  const STORAGE_KEY = 'kp_registration_success_v1';
  const successCard = document.getElementById('successCard');
  const unavailableCard = document.getElementById('unavailableCard');
  const registrationId = document.getElementById('registrationId');
  const copyButton = document.getElementById('copyRegistration');
  const copyStatus = document.getElementById('copyStatus');

  const readSuccess = () => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const id = String(parsed?.registration_id || '').trim();
      if (!id || id.length > 100) return null;
      return { registration_id: id, created_at: Number(parsed?.created_at || 0) };
    } catch (_) {
      return null;
    }
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

  const data = readSuccess();
  if (!data) {
    successCard.hidden = true;
    unavailableCard.hidden = false;
    return;
  }

  registrationId.textContent = data.registration_id;
  copyButton.hidden = false;

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
