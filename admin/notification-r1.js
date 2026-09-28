(() => {
  "use strict";

  /*
   * ==========================================================
   * TOPBAR NOTIFICATION UX R1
   * ==========================================================
   *
   * Sumber:
   * /api/admin/activity
   *
   * Backend menentukan scope:
   * system_admin = seluruh activity
   * staff        = activity user Staff sendiri
   */

  const API =
    "/api/admin/activity?limit=6";

  const INDICATOR_API =
    "/api/admin/activity?limit=1";
  const button =
    document.querySelector(
      '.top-actions [aria-label="Notifikasi"]'
    );

  const topActions =
    document.querySelector(
      ".top-actions"
    );

  const profile =
    document.querySelector(
      ".profile"
    );

  if (!button || !topActions) {
    return;
  }


  function formatAction(value) {
    const text =
      String(value || "")
        .replaceAll("_", " ")
        .toLowerCase();

    if (!text) {
      return "Aktivitas sistem";
    }

    return text.replace(
      /\b\w/g,
      char => char.toUpperCase()
    );
  }


  function formatTime(value) {
    if (!value) {
      return "-";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return String(value);
    }

    return new Intl.DateTimeFormat(
      "id-ID",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    ).format(date);
  }


  function userKey() {
    const user =
      window.SB_AUTH_USER;

    if (!user) {
      return "";
    }

    return [
      user.id || "",
      user.role || "",
      user.email || ""
    ].join(":");
  }


  function activityNavLink() {
    return [
      ...document.querySelectorAll(
        ".nav a, .mobile-nav a"
      )
    ].find(link =>
      String(
        link.textContent || ""
      )
        .trim()
        .toLowerCase() ===
      "activity logs"
    );
  }


  function closeAccountMenu() {
    const accountMenu =
      document.getElementById(
        "sb-auth-user"
      );

    if (accountMenu) {
      accountMenu.hidden = true;
    }

    profile?.setAttribute(
      "aria-expanded",
      "false"
    );
  }


  function addStyles() {
    if (
      document.getElementById(
        "sb-notification-r1-styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "sb-notification-r1-styles";

    style.textContent = `
      .sb-notification-panel[hidden] {
        display: none !important;
      }

      .sb-notification-panel {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        z-index: 82;

        width: min(370px, calc(100vw - 28px));
        max-height: min(520px, calc(100vh - 90px));

        display: flex;
        flex-direction: column;

        overflow: hidden;

        border: 1px solid rgba(15,23,42,.10);
        border-radius: 14px;

        background: #fff;
        color: #0f172a;

        box-shadow:
          0 18px 45px rgba(15,23,42,.14);
      }

      .sb-notification-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;

        padding: 14px;

        border-bottom:
          1px solid rgba(15,23,42,.08);
      }

      .sb-notification-head strong {
        display: block;
        font-size: 14px;
      }

      .sb-notification-head span {
        display: block;
        margin-top: 3px;

        color: #64748b;
        font-size: 11px;
      }

      .sb-notification-refresh {
        border: 1px solid rgba(15,23,42,.10);
        border-radius: 9px;

        padding: 7px 9px;

        background: #fff;
        color: #334155;

        font: inherit;
        font-size: 11px;
        font-weight: 750;

        cursor: pointer;
      }

      .sb-notification-refresh:disabled {
        opacity: .6;
        cursor: wait;
      }

      .sb-notification-list {
        min-height: 70px;
        overflow-y: auto;
      }

      .sb-notification-item {
        display: grid;
        grid-template-columns: 9px 1fr;
        gap: 10px;

        padding: 12px 14px;

        border-bottom:
          1px solid rgba(15,23,42,.06);
      }

      .sb-notification-dot {
        width: 8px;
        height: 8px;

        margin-top: 5px;

        border-radius: 50%;
        background: #168a63;
      }

      .sb-notification-copy {
        min-width: 0;
      }

      .sb-notification-title {
        display: block;

        color: #0f172a;

        font-size: 12px;
        font-weight: 800;
        line-height: 1.4;
      }

      .sb-notification-description {
        display: block;

        margin-top: 3px;

        color: #475569;

        font-size: 11px;
        line-height: 1.45;
      }

      .sb-notification-meta {
        display: block;

        margin-top: 5px;

        color: #94a3b8;

        font-size: 10px;
        line-height: 1.4;
      }

      .sb-notification-state {
        padding: 22px 16px;

        color: #64748b;

        font-size: 12px;
        line-height: 1.5;
        text-align: center;
      }

      .sb-notification-footer {
        padding: 10px;

        border-top:
          1px solid rgba(15,23,42,.08);

        background: #fbfdfc;
      }

      .sb-notification-open-activity {
        width: 100%;

        border: 0;
        border-radius: 9px;

        padding: 10px;

        background: transparent;
        color: #137153;

        font: inherit;
        font-size: 12px;
        font-weight: 800;

        cursor: pointer;
      }

      .sb-notification-open-activity:hover {
        background: rgba(22,138,99,.07);
      }

      .icon-btn[aria-expanded="true"] {
        border-color: rgba(22,138,99,.35);

        box-shadow:
          0 0 0 3px rgba(22,138,99,.08);
      }

      /*
       * SB_TOPBAR_NOTIFICATION_INDICATOR_R1_1
       */

      .top-actions .icon-btn[aria-label="Notifikasi"] {
        position: relative;
      }

      .icon-btn.sb-notification-has-new::after {
        content: "";

        position: absolute;
        top: 6px;
        right: 6px;

        width: 8px;
        height: 8px;

        border: 2px solid #fff;
        border-radius: 50%;

        background: #16a34a;

        box-sizing: content-box;

        box-shadow:
          0 0 0 1px rgba(22,163,74,.10);
      }

      @media(max-width:820px) {
        .sb-notification-panel {
          right: -2px;

          width:
            min(
              340px,
              calc(100vw - 20px)
            );
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }


  addStyles();


  button.type =
    "button";

  button.innerHTML =
    "&#128276;";

  button.setAttribute(
    "aria-haspopup",
    "dialog"
  );

  button.setAttribute(
    "aria-expanded",
    "false"
  );

  button.setAttribute(
    "aria-controls",
    "sb-notification-panel"
  );


  const panel =
    document.createElement("div");

  panel.id =
    "sb-notification-panel";

  panel.className =
    "sb-notification-panel";

  panel.hidden = true;

  panel.setAttribute(
    "role",
    "dialog"
  );

  panel.setAttribute(
    "aria-label",
    "Notifikasi aktivitas"
  );


  panel.innerHTML = `
    <div class="sb-notification-head">
      <div>
        <strong>Notifikasi</strong>
        <span>Aktivitas terbaru Management Console</span>
      </div>

      <button
        class="sb-notification-refresh"
        type="button"
        data-notification-refresh
      >
        Refresh
      </button>
    </div>

    <div
      class="sb-notification-list"
      data-notification-list
    >
      <div class="sb-notification-state">
        Buka Notifikasi untuk memuat aktivitas terbaru.
      </div>
    </div>

    <div class="sb-notification-footer">
      <button
        class="sb-notification-open-activity"
        type="button"
        data-notification-activity
      >
        Buka Activity Logs
      </button>
    </div>
  `;

  topActions.appendChild(
    panel
  );


  const list =
    panel.querySelector(
      "[data-notification-list]"
    );

  const refreshButton =
    panel.querySelector(
      "[data-notification-refresh]"
    );

  const activityButton =
    panel.querySelector(
      "[data-notification-activity]"
    );


  let loading = false;
  let loadedUserKey = "";


  /*
   * ==========================================================
   * TOPBAR NOTIFICATION INDICATOR R1.1
   * ==========================================================
   *
   * First baseline:
   * history yang sudah ada tidak langsung dianggap baru.
   *
   * Seen marker:
   * disimpan per user agar System Admin dan Staff
   * tidak saling berbagi status indikator.
   */

  const INDICATOR_EMPTY_MARKER =
    "__none__";

  const INDICATOR_STORAGE_PREFIX =
    "sb.notification.seen.r1.1.";

  const indicatorSeenFallback =
    new Map();

  let indicatorChecking = false;
  let indicatorAuthAttempts = 0;
  let indicatorOwnerKey = "";
  let lastIndicatorCheckAt = 0;


  function indicatorStorageKey() {
    const key =
      userKey();

    if (!key) {
      return "";
    }

    return (
      INDICATOR_STORAGE_PREFIX +
      key
    );
  }


  function indicatorMarker(items) {
    const first =
      Array.isArray(items)
        ? items[0]
        : null;

    if (!first) {
      return INDICATOR_EMPTY_MARKER;
    }

    return [
      String(
        first.created_at || ""
      ),
      String(
        first.id || ""
      )
    ].join("|");
  }


  function readIndicatorSeen() {
    const key =
      indicatorStorageKey();

    if (!key) {
      return null;
    }

    try {
      return window.localStorage.getItem(
        key
      );

    } catch {
      return indicatorSeenFallback.has(
        key
      )
        ? indicatorSeenFallback.get(
            key
          )
        : null;
    }
  }


  function writeIndicatorSeen(marker) {
    const key =
      indicatorStorageKey();

    if (!key) {
      return;
    }

    indicatorSeenFallback.set(
      key,
      marker
    );

    try {
      window.localStorage.setItem(
        key,
        marker
      );
    } catch {
      /*
       * localStorage dapat diblokir browser.
       * Fallback memory tetap menjaga sesi aktif.
       */
    }
  }


  function setNewIndicator(hasNew) {
    const active =
      Boolean(hasNew);

    button.classList.toggle(
      "sb-notification-has-new",
      active
    );

    button.dataset.notificationNew =
      active
        ? "1"
        : "0";

    button.title =
      active
        ? "Ada aktivitas baru"
        : "Notifikasi";
  }


  function hasNewIndicator() {
    return button.classList.contains(
      "sb-notification-has-new"
    );
  }


  function markItemsSeen(items) {
    writeIndicatorSeen(
      indicatorMarker(items)
    );

    setNewIndicator(false);
  }


  async function checkNotificationIndicator(
    force = false
  ) {
    if (
      indicatorChecking ||
      !panel.hidden
    ) {
      return;
    }

    const user =
      window.SB_AUTH_USER;

    const currentKey =
      userKey();

    if (
      !currentKey ||
      ![
        "system_admin",
        "staff"
      ].includes(
        user?.role
      )
    ) {
      return;
    }


    if (
      indicatorOwnerKey !==
      currentKey
    ) {
      indicatorOwnerKey =
        currentKey;

      setNewIndicator(false);
    }


    const now =
      Date.now();

    if (
      !force &&
      now - lastIndicatorCheckAt <
        15000
    ) {
      return;
    }

    lastIndicatorCheckAt =
      now;

    indicatorChecking =
      true;


    try {
      const response =
        await fetch(
          INDICATOR_API,
          {
            credentials:
              "same-origin",

            headers: {
              Accept:
                "application/json"
            },

            cache:
              "no-store"
          }
        );

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ||
          `HTTP ${response.status}`
        );
      }


      const items =
        Array.isArray(
          data.activity
        )
          ? data.activity
          : [];

      const latest =
        indicatorMarker(items);

      const seen =
        readIndicatorSeen();


      /*
       * Baseline pertama:
       * aktivitas lama tidak diberi tanda "baru".
       */
      if (seen === null) {
        writeIndicatorSeen(
          latest
        );

        setNewIndicator(false);

        return;
      }


      if (
        latest ===
        INDICATOR_EMPTY_MARKER
      ) {
        setNewIndicator(false);

        return;
      }


      setNewIndicator(
        latest !== seen
      );

    } catch {
      /*
       * Indicator bersifat enhancement.
       * Kegagalan check tidak boleh merusak
       * Notification Panel R1 yang sudah LOCKED.
       */

    } finally {
      indicatorChecking =
        false;
    }
  }

  function showState(message) {
    list.innerHTML = "";

    const state =
      document.createElement("div");

    state.className =
      "sb-notification-state";

    state.textContent =
      String(message || "");

    list.appendChild(
      state
    );
  }


  function render(items) {
    list.innerHTML = "";

    if (!items.length) {
      showState(
        "Belum ada aktivitas terbaru."
      );

      return;
    }

    for (const item of items) {
      const row =
        document.createElement("div");

      row.className =
        "sb-notification-item";


      const dot =
        document.createElement("span");

      dot.className =
        "sb-notification-dot";


      const copy =
        document.createElement("div");

      copy.className =
        "sb-notification-copy";


      const title =
        document.createElement("strong");

      title.className =
        "sb-notification-title";

      title.textContent =
        item.description ||
        formatAction(
          item.action
        );


      const description =
        document.createElement("span");

      description.className =
        "sb-notification-description";

      description.textContent =
        item.description
          ? formatAction(
              item.action
            )
          : (
              item.entity_type
                ? `Entity: ${item.entity_type}`
                : "Aktivitas sistem"
            );


      const meta =
        document.createElement("span");

      meta.className =
        "sb-notification-meta";

      const actor =
        item.user_full_name ||
        item.user_email ||
        "System";

      meta.textContent =
        `${actor} • ${formatTime(
          item.created_at
        )}`;


      copy.append(
        title,
        description,
        meta
      );

      row.append(
        dot,
        copy
      );

      list.appendChild(
        row
      );
    }
  }


  async function loadNotifications(
    force = false
  ) {
    if (loading) {
      return;
    }

    const currentKey =
      userKey();

    if (!currentKey) {
      showState(
        "Sesi pengguna belum siap."
      );

      return;
    }

    if (
      !force &&
      loadedUserKey === currentKey
    ) {
      return;
    }

    const user =
      window.SB_AUTH_USER;

    if (
      ![
        "system_admin",
        "staff"
      ].includes(
        user?.role
      )
    ) {
      showState(
        "Akses notifikasi tidak tersedia."
      );

      return;
    }


    loading = true;

    refreshButton.disabled =
      true;

    refreshButton.textContent =
      "Memuat...";

    showState(
      "Memuat aktivitas terbaru..."
    );


    try {
      const response =
        await fetch(
          API,
          {
            credentials:
              "same-origin",

            headers: {
              Accept:
                "application/json"
            },

            cache:
              "no-store"
          }
        );

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ||
          `HTTP ${response.status}`
        );
      }

      const items =
        Array.isArray(
          data.activity
        )
          ? data.activity
          : [];

      loadedUserKey =
        currentKey;

      render(items);

      markItemsSeen(items);

    } catch (error) {
      loadedUserKey = "";

      showState(
        `Notifikasi belum dapat dimuat: ${
          error?.message ||
          "Unknown error"
        }`
      );

    } finally {
      loading = false;

      refreshButton.disabled =
        false;

      refreshButton.textContent =
        "Refresh";
    }
  }


  function closePanel() {
    panel.hidden = true;

    button.setAttribute(
      "aria-expanded",
      "false"
    );
  }


  button.addEventListener(
    "click",
    event => {
      event.preventDefault();
      event.stopPropagation();

      const opening =
        panel.hidden;

      if (opening) {
        closeAccountMenu();
      }

      panel.hidden =
        !opening;

      button.setAttribute(
        "aria-expanded",
        opening
          ? "true"
          : "false"
      );

      if (opening) {
        loadNotifications(hasNewIndicator());
      }
    }
  );


  refreshButton.addEventListener(
    "click",
    event => {
      event.stopPropagation();

      loadNotifications(true);
    }
  );


  activityButton.addEventListener(
    "click",
    event => {
      event.preventDefault();
      event.stopPropagation();

      const link =
        activityNavLink();

      if (!link) {
        return;
      }

      closePanel();
      link.click();
    }
  );


  profile?.addEventListener(
    "click",
    () => {
      closePanel();
    }
  );


  document.addEventListener(
    "click",
    event => {
      if (
        panel.hidden ||
        panel.contains(
          event.target
        ) ||
        button.contains(
          event.target
        )
      ) {
        return;
      }

      closePanel();
    }
  );


  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key !== "Escape" ||
        panel.hidden
      ) {
        return;
      }

      closePanel();
      button.focus();
    }
  );
  /*
   * ==========================================================
   * INDICATOR STARTUP R1.1
   * ==========================================================
   */

  function startIndicatorWhenAuthenticated() {
    const user =
      window.SB_AUTH_USER;

    if (
      !user ||
      ![
        "system_admin",
        "staff"
      ].includes(
        user.role
      )
    ) {
      indicatorAuthAttempts += 1;

      if (
        indicatorAuthAttempts <=
        120
      ) {
        window.setTimeout(
          startIndicatorWhenAuthenticated,
          250
        );
      }

      return;
    }

    indicatorAuthAttempts = 0;

    checkNotificationIndicator(true);
  }


  startIndicatorWhenAuthenticated();


  window.addEventListener(
    "focus",
    () => {
      checkNotificationIndicator();
    }
  );


  document.addEventListener(
    "visibilitychange",
    () => {
      if (!document.hidden) {
        checkNotificationIndicator();
      }
    }
  );


  /*
   * Check ringan setiap 2 menit hanya ketika
   * tab sedang terlihat.
   */
  window.setInterval(
    () => {
      if (!document.hidden) {
        checkNotificationIndicator();
      }
    },
    120000
  );
})();
