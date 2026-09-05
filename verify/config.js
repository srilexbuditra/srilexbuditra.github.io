// V31: API endpoint may persist; Publisher Token is session-only.
window.SB_VERIFY_API =
  localStorage.getItem('SB_VERIFY_API') ||
  'https://srilexbuditra-verification-api.srilexbuditra.workers.dev';

// Purge the legacy V30 persistent token if it still exists.
localStorage.removeItem('SB_VERIFY_PUBLISHER_TOKEN');
window.SB_VERIFY_PUBLISHER_TOKEN =
  sessionStorage.getItem('SB_VERIFY_PUBLISHER_TOKEN') || '';
