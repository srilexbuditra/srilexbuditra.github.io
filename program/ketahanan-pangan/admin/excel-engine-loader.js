(function () {
  'use strict';

  if (window.XLSX && window.XLSX.utils) {
    window.KP_EXCEL_ENGINE_READY = Promise.resolve(window.XLSX);
    return;
  }

  const sources = [
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
    'https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js',
    'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js'
  ];

  function loadScript(src, timeoutMs) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      let settled = false;
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        script.remove();
        reject(new Error('timeout'));
      }, timeoutMs || 7000);

      script.src = src;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.referrerPolicy = 'no-referrer';
      script.onload = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (window.XLSX && window.XLSX.utils) resolve(window.XLSX);
        else reject(new Error('XLSX tidak tersedia setelah script dimuat'));
      };
      script.onerror = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        script.remove();
        reject(new Error('gagal memuat ' + src));
      };
      document.head.appendChild(script);
    });
  }

  window.KP_EXCEL_ENGINE_READY = (async () => {
    for (const src of sources) {
      try {
        const engine = await loadScript(src, 7000);
        console.info('Ketahanan Pangan Admin: mesin Excel aktif.', src);
        return engine;
      } catch (error) {
        console.warn('Ketahanan Pangan Admin: sumber mesin Excel gagal.', src, error && error.message);
      }
    }
    throw new Error('Semua sumber mesin Excel gagal dimuat.');
  })();
})();
