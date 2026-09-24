(() => {
  "use strict";

  /*
   * SRILEX BUDITRA - Navigation R1
   * ---------------------------------------------------------
   * Beberapa module view menyembunyikan sibling dengan:
   *     node.style.display = "none"
   *
   * Jika module berikutnya hanya menjalankan:
   *     view.hidden = false
   *
   * inline display:none dari module sebelumnya dapat tertinggal.
   *
   * Global navigation normalizer ini membersihkan state display
   * sebelum handler module tujuan dijalankan.
   */

  const NAV_SELECTOR = ".nav a, .mobile-nav a";

  function resetStaleDisplayState() {
    const content = document.querySelector("main.content");
    if (!content) return;

    [...content.children].forEach(node => {
      node.style.removeProperty("display");
    });
  }

  /*
   * Capture phase dipakai supaya normalisasi dilakukan SEBELUM
   * click handler dari Documents, Projects, Support, Invoices,
   * Estimates, dan module lainnya.
   */
  document.addEventListener(
    "click",
    event => {
      const link = event.target.closest(NAV_SELECTOR);
      if (!link) return;

      resetStaleDisplayState();
    },
    true
  );

  /*
   * Menangani browser back/forward cache.
   */
  window.addEventListener("pageshow", event => {
    if (event.persisted) {
      resetStaleDisplayState();
    }
  });
})();