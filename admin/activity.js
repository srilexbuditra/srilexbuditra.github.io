(() => {
  "use strict";

  const API = "/api/admin/activity?limit=50";

  const content = document.querySelector("main.content");
  if (!content) return;

  let activity = [];
  let loadedOnce = false;
  let loading = false;

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatTime(value) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
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

  function actionLabel(value = "") {
    return String(value)
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(
        /\b\w/g,
        char => char.toUpperCase()
      );
  }

  function shortId(value = "") {
    const text = String(value || "");
    if (!text) return "-";

    return text.length > 18
      ? `${text.slice(0, 8)}...${text.slice(-6)}`
      : text;
  }

  function addStyles() {
    if (
      document.getElementById(
        "sb-activity-r1-styles"
      )
    ) return;

    const style =
      document.createElement("style");

    style.id = "sb-activity-r1-styles";

    style.textContent = `
      .sb-activity-view[hidden] {
        display: none !important;
      }

      .sb-activity-view {
        display: grid;
        gap: 22px;
      }

      .sb-activity-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 18px;
        flex-wrap: wrap;
      }

      .sb-activity-head h1 {
        margin: 6px 0;
      }

      .sb-activity-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .sb-activity-summary {
        display: grid;
        grid-template-columns:
          repeat(3, minmax(0, 1fr));
        gap: 14px;
      }

      .sb-activity-tools {
        display: grid;
        grid-template-columns:
          minmax(220px, 1fr)
          minmax(180px, 260px);
        gap: 12px;
        margin-bottom: 16px;
      }

      .sb-activity-tools input,
      .sb-activity-tools select {
        width: 100%;
        box-sizing: border-box;
        min-height: 42px;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        background: #fff;
        padding: 9px 12px;
        font: inherit;
        color: #0f172a;
        outline: none;
      }

      .sb-activity-tools input:focus,
      .sb-activity-tools select:focus {
        border-color: #16a34a;
        box-shadow:
          0 0 0 3px rgba(22,163,74,.12);
      }

      .sb-activity-table td,
      .sb-activity-table th {
        vertical-align: top;
      }

      .sb-activity-main {
        display: grid;
        gap: 4px;
        min-width: 210px;
      }

      .sb-activity-main span,
      .sb-activity-muted {
        color: #64748b;
        font-size: 12px;
      }

      .sb-activity-code {
        font-family:
          ui-monospace,
          SFMono-Regular,
          Menlo,
          Consolas,
          monospace;
        font-size: 11px;
        color: #64748b;
      }

      .sb-activity-empty {
        text-align: center;
        color: #64748b;
        padding: 32px 18px !important;
      }

      @media (max-width: 760px) {
        .sb-activity-summary,
        .sb-activity-tools {
          grid-template-columns: 1fr;
        }

        .sb-activity-actions {
          width: 100%;
        }

        .sb-activity-actions button {
          flex: 1;
        }
      }
    `;

    document.head.appendChild(style);
  }

  addStyles();

  const view =
    document.createElement("section");

  view.className = "sb-activity-view";
  view.hidden = true;
  view.dataset.sbView = "activity";

  view.innerHTML = `
    <div class="sb-activity-head">
      <div>
        <div class="eyebrow">
          <span class="pulse"></span>
          System Audit • R1
        </div>

        <h1>Activity Logs</h1>

        <p>
          Riwayat aktivitas penting pada Management
          Console. Data dimuat hanya saat modul ini dibuka.
        </p>
      </div>

      <div class="sb-activity-actions">
        <button
          class="secondary"
          type="button"
          data-activity-refresh
        >
          Refresh
        </button>
      </div>
    </div>

    <section
      class="stats sb-activity-summary"
      aria-label="Ringkasan Activity Logs"
    >
      <article class="stat">
        <div class="meta">Loaded activity</div>
        <div
          class="value"
          data-activity-count
        >0</div>
        <div class="sub">
          Maksimum 50 per pemuatan
        </div>
      </article>

      <article class="stat">
        <div class="meta">Actors</div>
        <div
          class="value"
          data-activity-actors
        >0</div>
        <div class="sub">
          Pengguna pada hasil saat ini
        </div>
      </article>

      <article class="stat">
        <div class="meta">Entity types</div>
        <div
          class="value"
          data-activity-entities
        >0</div>
        <div class="sub">
          Jenis objek yang tercatat
        </div>
      </article>
    </section>

    <article class="card">
      <div class="card-head">
        <div>
          <h2>System activity</h2>
          <p>
            Aktivitas terbaru ditampilkan lebih dahulu
          </p>
        </div>
      </div>

      <div class="card-body">
        <div class="sb-activity-tools">
          <input
            type="search"
            placeholder="Cari action, pengguna, entity..."
            data-activity-search
          >

          <select data-activity-filter>
            <option value="">
              Semua aktivitas
            </option>
          </select>
        </div>

        <div class="table-wrap">
          <table
            class="sb-activity-table"
            aria-label="Activity Logs"
          >
            <thead>
              <tr>
                <th>Activity</th>
                <th>Actor</th>
                <th>Entity</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody data-activity-rows>
              <tr>
                <td
                  colspan="4"
                  class="sb-activity-empty"
                >
                  Buka Activity Logs untuk memuat data.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </article>
  `;

  content.appendChild(view);

  const rows =
    view.querySelector(
      "[data-activity-rows]"
    );

  const search =
    view.querySelector(
      "[data-activity-search]"
    );

  const filter =
    view.querySelector(
      "[data-activity-filter]"
    );

  const countEl =
    view.querySelector(
      "[data-activity-count]"
    );

  const actorEl =
    view.querySelector(
      "[data-activity-actors]"
    );

  const entityEl =
    view.querySelector(
      "[data-activity-entities]"
    );

  function updateSummary() {
    countEl.textContent =
      String(activity.length);

    actorEl.textContent =
      String(
        new Set(
          activity
            .map(item => item.user_id)
            .filter(Boolean)
        ).size
      );

    entityEl.textContent =
      String(
        new Set(
          activity
            .map(item => item.entity_type)
            .filter(Boolean)
        ).size
      );
  }

  function buildActionFilter() {
    const current = filter.value;

    const actions =
      [...new Set(
        activity
          .map(item => item.action)
          .filter(Boolean)
      )]
        .sort();

    filter.innerHTML =
      '<option value="">Semua aktivitas</option>' +
      actions
        .map(
          action =>
            `<option value="${escapeHtml(action)}">` +
            `${escapeHtml(actionLabel(action))}` +
            `</option>`
        )
        .join("");

    if (actions.includes(current)) {
      filter.value = current;
    }
  }

  function visibleRows() {
    const q =
      String(search.value || "")
        .trim()
        .toLowerCase();

    const selected =
      String(filter.value || "");

    return activity.filter(item => {
      if (
        selected &&
        item.action !== selected
      ) {
        return false;
      }

      if (!q) return true;

      const haystack = [
        item.action,
        item.description,
        item.user_full_name,
        item.user_email,
        item.user_role,
        item.entity_type,
        item.entity_id
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }

  function renderRows() {
    const items = visibleRows();

    if (!items.length) {
      rows.innerHTML = `
        <tr>
          <td
            colspan="4"
            class="sb-activity-empty"
          >
            Tidak ada Activity Log yang sesuai.
          </td>
        </tr>
      `;
      return;
    }

    rows.innerHTML =
      items
        .map(item => {
          const actor =
            item.user_full_name ||
            item.user_email ||
            "System";

          const actorMeta =
            [
              item.user_email,
              item.user_role
            ]
              .filter(
                value =>
                  value &&
                  value !== actor
              )
              .join(" • ");

          const entity =
            item.entity_type
              ? actionLabel(item.entity_type)
              : "-";

          return `
            <tr>
              <td>
                <div class="sb-activity-main">
                  <strong>
                    ${escapeHtml(
                      actionLabel(item.action)
                    )}
                  </strong>

                  <span>
                    ${escapeHtml(
                      item.description || "-"
                    )}
                  </span>

                  <span class="sb-activity-code">
                    ${escapeHtml(item.action || "-")}
                  </span>
                </div>
              </td>

              <td>
                <strong>
                  ${escapeHtml(actor)}
                </strong>

                ${
                  actorMeta
                    ? `<div class="sb-activity-muted">${escapeHtml(actorMeta)}</div>`
                    : ""
                }
              </td>

              <td>
                <strong>
                  ${escapeHtml(entity)}
                </strong>

                <div class="sb-activity-code">
                  ${escapeHtml(
                    shortId(item.entity_id)
                  )}
                </div>
              </td>

              <td>
                ${escapeHtml(
                  formatTime(item.created_at)
                )}
              </td>
            </tr>
          `;
        })
        .join("");
  }

  function updateDashboardRecent() {
    const heading =
      [...document.querySelectorAll(
        "article.card h2"
      )]
        .find(
          element =>
            element.textContent
              .trim()
              .toLowerCase() ===
            "recent activity"
        );

    if (!heading) return;

    const card =
      heading.closest("article.card");

    const body =
      card?.querySelector(
        ".card-body.activity"
      );

    if (!body) return;

    const latest =
      activity.slice(0, 4);

    if (!latest.length) {
      body.innerHTML = `
        <div class="activity-item">
          <span class="activity-icon">-</span>
          <div>
            <strong>
              Belum ada aktivitas
            </strong>
            <span>
              Belum ada Activity Log untuk ditampilkan.
            </span>
          </div>
        </div>
      `;
      return;
    }

    body.innerHTML =
      latest
        .map(item => {
          const actor =
            item.user_full_name ||
            item.user_email ||
            "System";

          return `
            <div class="activity-item">
              <span class="activity-icon">
                &#10003;
              </span>

              <div>
                <strong>
                  ${escapeHtml(
                    actionLabel(item.action)
                  )}
                </strong>

                <span>
                  ${escapeHtml(actor)}
                  &bull;
                  ${escapeHtml(
                    formatTime(item.created_at)
                  )}
                </span>
              </div>
            </div>
          `;
        })
        .join("");
  }

  async function loadActivity(
    silent = false
  ) {
    if (loading) return;

    loading = true;

    if (!silent) {
      rows.innerHTML = `
        <tr>
          <td
            colspan="4"
            class="sb-activity-empty"
          >
            Memuat Activity Logs...
          </td>
        </tr>
      `;
    }

    try {
      const response =
        await fetch(
          API,
          {
            credentials: "same-origin",
            headers: {
              Accept: "application/json"
            },
            cache: "no-store"
          }
        );

      const data =
        await response.json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ||
          `HTTP ${response.status}`
        );
      }

      activity =
        Array.isArray(data.activity)
          ? data.activity
          : [];

      loadedOnce = true;

      buildActionFilter();
      updateSummary();
      renderRows();
      updateDashboardRecent();

    } catch (error) {
      rows.innerHTML = `
        <tr>
          <td
            colspan="4"
            class="sb-activity-empty"
          >
            Gagal memuat Activity Logs:
            ${escapeHtml(
              error.message || "Unknown error"
            )}
          </td>
        </tr>
      `;
    } finally {
      loading = false;
    }
  }

  view
    .querySelector(
      "[data-activity-refresh]"
    )
    .addEventListener(
      "click",
      () => loadActivity()
    );

  search.addEventListener(
    "input",
    renderRows
  );

  filter.addEventListener(
    "change",
    renderRows
  );

  /*
   * D1 READ OPTIMIZATION:
   * Fetch hanya saat Activity Logs benar-benar dibuka.
   * Membuka Dashboard tidak menjalankan request ini.
   */
  const observer =
    new MutationObserver(() => {
      if (
        !view.hidden &&
        !loadedOnce
      ) {
        loadActivity();
      }
    });

  observer.observe(
    view,
    {
      attributes: true,
      attributeFilter: ["hidden"]
    }
  );
})();