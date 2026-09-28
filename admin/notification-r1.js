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
        loadNotifications();
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
})();
