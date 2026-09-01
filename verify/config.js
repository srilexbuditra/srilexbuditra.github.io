/* V30 verification configuration. Publisher setup stores API/token locally. */
window.SB_VERIFY_API = localStorage.getItem('SB_VERIFY_API') || '';
window.SB_VERIFY_PUBLISHER_TOKEN = localStorage.getItem('SB_VERIFY_PUBLISHER_TOKEN') || '';
