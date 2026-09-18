(() => {
  'use strict';

  const REGISTRY_URL = '/program/umroh-semi-private-bengkulu/platform-version.json';
  const FALLBACK_VERSION = '3.6.2';
  const FALLBACK_LABEL = `Platform V${FALLBACK_VERSION}`;

  const state = {
    version: FALLBACK_VERSION,
    label: FALLBACK_LABEL,
    registry: null
  };

  const apply = () => {
    document.documentElement.dataset.platformVersion = state.version;
    document.querySelectorAll('[data-platform-version]').forEach((node) => {
      node.textContent = state.label;
    });
    document.querySelectorAll('[data-platform-version-number]').forEach((node) => {
      node.textContent = state.version;
    });
    window.UMROH_PLATFORM_VERSION = Object.freeze({
      version: state.version,
      label: state.label,
      registry: state.registry ? { ...state.registry } : null
    });
  };

  const load = async () => {
    apply();
    try {
      const response = await fetch(REGISTRY_URL, {
        cache: 'no-store',
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) return;
      const data = await response.json();
      const version = String(data?.platform_version || '').trim();
      if (!/^\d+\.\d+\.\d+$/.test(version)) return;
      state.version = version;
      state.label = `Platform V${version}`;
      state.registry = data;
      apply();
    } catch (_) {
      // Static fallback remains visible when the registry cannot be loaded.
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load, { once: true });
  } else {
    load();
  }
})();
