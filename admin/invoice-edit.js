(() => {
  "use strict";

  const API = "/api/admin/invoices";
  const PROJECTS_API = "/api/admin/projects";

  let invoices = [];
  let current = null;
  let syncing = false;

  function esc(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  const style = window.document.createElement("style");

  style.textContent = `
    .sb-invoice-edit-modal[hidden] {
      display:none !important;
    }

    .sb-invoice-edit-modal {
      position:fixed;
      inset:0;
      z-index:100040;
      display:grid;
      place-items:center;
      padding:22px;
      background:rgba(2,8,6,.72);
      backdrop-filter:blur(6px);
    }

    .sb-invoice-edit-card {
      width:min(100%,760px);
      max-height:calc(100vh - 44px);
      overflow:auto;
      background:#fff;
      color:#0f172a;
      border-radius:20px;
      box-shadow:0 24px 80px rgba(0,0,0,.35);
    }

    .sb-invoice-edit-head {
      display:flex;
      justify-content:space-between;
      gap:16px;
      padding:22px 24px 16px;
      border-bottom:1px solid #e2e8f0;
    }

    .sb-invoice-edit-head h2 {
      margin:0 0 5px;
    }

    .sb-invoice-edit-head p {
      margin:0;
      color:#64748b;
      font-size:13px;
    }

    .sb-invoice-edit-close {
      width:38px;
      height:38px;
      border:0;
      border-radius:10px;
      background:#f1f5f9;
      cursor:pointer;
      font-size:20px;
    }

    .sb-invoice-edit-form {
      padding:22px 24px 24px;
    }

    .sb-invoice-edit-info {
      margin-bottom:16px;
      padding:12px 14px;
      background:#f8fafc;
      border-radius:10px;
      font-size:13px;
      line-height:1.5;
    }

    .sb-invoice-edit-grid {
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:16px;
    }

    .sb-invoice-edit-field {
      display:grid;
      gap:7px;
    }

    .sb-invoice-edit-field.full {
      grid-column:1 / -1;
    }

    .sb-invoice-edit-field label {
      font-size:13px;
      font-weight:800;
    }

    .sb-invoice-edit-field input,
    .sb-invoice-edit-field select,
    .sb-invoice-edit-field textarea {
      width:100%;
      box-sizing:border-box;
      padding:12px 13px;
      border:1px solid #cbd5e1;
      border-radius:10px;
      background:#fff;
      font:inherit;
    }

    .sb-invoice-edit-field textarea {
      min-height:75px;
      resize:vertical;
    }

    .sb-invoice-edit-items {
      display:grid;
      gap:10px;
      margin-top:18px;
    }

    .sb-invoice-edit-item {
      display:grid;
      grid-template-columns:minmax(0,1fr) 110px 180px 42px;
      gap:10px;
      align-items:end;
      padding:12px;
      border:1px solid #e2e8f0;
      border-radius:12px;
      background:#f8fafc;
    }

    .sb-invoice-edit-item label {
      display:grid;
      gap:6px;
      font-size:12px;
      font-weight:700;
    }

    .sb-invoice-edit-item input {
      width:100%;
      box-sizing:border-box;
      padding:10px;
      border:1px solid #cbd5e1;
      border-radius:9px;
    }

    .sb-invoice-edit-remove {
      width:42px;
      height:42px;
      border:1px solid #fecaca;
      border-radius:9px;
      background:#fff;
      color:#b91c1c;
      cursor:pointer;
    }

    .sb-invoice-edit-error {
      min-height:20px;
      margin:12px 0;
      color:#b91c1c;
      font-size:13px;
      font-weight:700;
    }

    .sb-invoice-edit-actions {
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:10px;
      flex-wrap:wrap;
      margin-top:16px;
    }

    .sb-invoice-edit-actions > div {
      display:flex;
      gap:10px;
    }

    @media(max-width:800px) {
      .sb-invoice-edit-grid,
      .sb-invoice-edit-item {
        grid-template-columns:1fr;
      }

      .sb-invoice-edit-field.full {
        grid-column:auto;
      }
    }
  `;

  window.document.head.appendChild(style);

  const modal =
    window.document.createElement("div");

  modal.className = "sb-invoice-edit-modal";
  modal.hidden = true;

  modal.innerHTML = `
    <div class="sb-invoice-edit-card">

      <div class="sb-invoice-edit-head">
        <div>
          <h2>Edit Draft Invoice</h2>
          <p>Data finansial terkunci setelah invoice dikirim.</p>
        </div>

        <button
          class="sb-invoice-edit-close"
          type="button"
          data-ie-close
        >
          &times;
        </button>
      </div>

      <form class="sb-invoice-edit-form" data-ie-form>

        <div class="sb-invoice-edit-info" data-ie-info></div>

        <div class="sb-invoice-edit-grid">

          <div class="sb-invoice-edit-field full">
            <label>Judul invoice *</label>
            <input name="title" maxlength="180" required>
          </div>

          <div class="sb-invoice-edit-field full">
            <label>Project</label>
            <select name="project_id" data-ie-project>
              <option value="">Tanpa project khusus</option>
            </select>
          </div>

          <div class="sb-invoice-edit-field">
            <label>Jatuh tempo</label>
            <input name="due_date" type="date">
          </div>

          <div class="sb-invoice-edit-field">
            <label>Pajak / tambahan (Rp)</label>
            <input
              name="tax_amount"
              type="number"
              min="0"
              step="1"
              required
            >
          </div>

          <div class="sb-invoice-edit-field full">
            <label>Catatan</label>
            <textarea name="notes" maxlength="2000"></textarea>
          </div>

        </div>

        <div class="sb-invoice-edit-items" data-ie-items></div>

        <button
          class="secondary"
          type="button"
          data-ie-add
        >
          + Tambah Item
        </button>

        <div class="sb-invoice-edit-error" data-ie-error></div>

        <div class="sb-invoice-edit-actions">
          <span>Hanya invoice Draft yang dapat diedit.</span>

          <div>
            <button
              class="secondary"
              type="button"
              data-ie-cancel
            >
              Batal
            </button>

            <button
              class="primary"
              type="submit"
              data-ie-submit
            >
              Simpan Perubahan
            </button>
          </div>
        </div>

      </form>
    </div>
  `;

  window.document.body.appendChild(modal);

  const form = modal.querySelector("[data-ie-form]");
  const info = modal.querySelector("[data-ie-info]");
  const projectSelect =
    modal.querySelector("[data-ie-project]");
  const itemsEl =
    modal.querySelector("[data-ie-items]");
  const errorEl =
    modal.querySelector("[data-ie-error]");
  const submit =
    modal.querySelector("[data-ie-submit]");

  function addItem(
    description = "",
    quantity = 1,
    unitPrice = 0
  ) {
    const item =
      window.document.createElement("div");

    item.className = "sb-invoice-edit-item";
    item.dataset.ieItem = "1";

    item.innerHTML = `
      <label>
        Deskripsi *
        <input
          data-ie-description
          required
          value="${esc(description)}"
        >
      </label>

      <label>
        Qty *
        <input
          data-ie-quantity
          type="number"
          min="0.01"
          step="0.01"
          required
          value="${esc(quantity)}"
        >
      </label>

      <label>
        Harga satuan (Rp) *
        <input
          data-ie-price
          type="number"
          min="0"
          step="1"
          required
          value="${esc(unitPrice)}"
        >
      </label>

      <button
        class="sb-invoice-edit-remove"
        type="button"
        data-ie-remove
      >
        ×
      </button>
    `;

    item.querySelector("[data-ie-remove]")
      .addEventListener("click", () => {
        if (itemsEl.children.length > 1) {
          item.remove();
        }
      });

    itemsEl.appendChild(item);
  }

  function closeModal() {
    modal.hidden = true;
    current = null;
    errorEl.textContent = "";
  }

  async function openModal(invoiceId) {
    errorEl.textContent = "";
    modal.hidden = false;
    info.textContent = "Memuat invoice...";
    itemsEl.innerHTML = "";

    try {
      const [detailResponse, projectsResponse] =
        await Promise.all([
          fetch(`${API}/${encodeURIComponent(invoiceId)}`, {
            credentials: "same-origin",
            headers: { Accept: "application/json" },
            cache: "no-store"
          }),
          fetch(PROJECTS_API, {
            credentials: "same-origin",
            headers: { Accept: "application/json" },
            cache: "no-store"
          })
        ]);

      const detail =
        await detailResponse.json().catch(() => ({}));

      const projectData =
        await projectsResponse.json().catch(() => ({}));

      if (
        !detailResponse.ok ||
        !detail.invoice
      ) {
        throw new Error(
          detail.error || `HTTP ${detailResponse.status}`
        );
      }

      if (detail.invoice.status !== "draft") {
        throw new Error(
          "Invoice ini bukan Draft dan tidak dapat diedit."
        );
      }

      current = detail.invoice;

      info.innerHTML = `
        <strong>${esc(current.invoice_code)}</strong><br>
        Client:
        ${esc(
          current.company_name ||
          current.full_name ||
          current.client_code ||
          "-"
        )}
      `;

      form.elements.title.value =
        current.title || "";

      form.elements.due_date.value =
        current.due_date
          ? String(current.due_date).slice(0,10)
          : "";

      form.elements.tax_amount.value =
        Number(current.tax_amount || 0);

      form.elements.notes.value =
        current.notes || "";

      projectSelect.innerHTML =
        '<option value="">Tanpa project khusus</option>';

      const projects =
        Array.isArray(projectData.projects)
          ? projectData.projects
          : [];

      projects
        .filter(project =>
          project.client_id === current.client_id
        )
        .forEach(project => {
          const option =
            window.document.createElement("option");

          option.value = project.id;
          option.textContent =
            `${project.project_name} — ${project.project_code}`;

          projectSelect.appendChild(option);
        });

      projectSelect.value =
        current.project_id || "";

      const items =
        Array.isArray(detail.items)
          ? detail.items
          : [];

      items.forEach(item => {
        addItem(
          item.description,
          item.quantity,
          item.unit_price
        );
      });

      if (!items.length) {
        addItem();
      }
    } catch (error) {
      errorEl.textContent =
        error instanceof Error
          ? error.message
          : "Invoice belum dapat dimuat.";
    }
  }

  async function fetchInvoices() {
    const response = await fetch(API, {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
      cache: "no-store"
    });

    const data =
      await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.error || `HTTP ${response.status}`
      );
    }

    invoices =
      Array.isArray(data.invoices)
        ? data.invoices
        : [];
  }

  function decorateRows() {
    const tbody =
      window.document.querySelector(
        "[data-invoice-rows]"
      );

    if (!tbody) return;

    [...tbody.querySelectorAll("tr")]
      .forEach(row => {

        const code =
          row.querySelector(
            ".sb-invoice-name span"
          )?.textContent.trim();

        if (!code) return;

        const invoice =
          invoices.find(
            item => item.invoice_code === code
          );

        if (
          !invoice ||
          invoice.status !== "draft"
        ) {
          return;
        }

        const actions =
          row.querySelector(
            ".sb-invoice-row-actions"
          );

        if (
          !actions ||
          actions.querySelector("[data-ie-open]")
        ) {
          return;
        }

        const button =
          window.document.createElement("button");

        button.type = "button";
        button.className = "secondary";
        button.textContent = "Edit";
        button.dataset.ieOpen = invoice.id;

        actions.prepend(button);
      });
  }

  async function syncRows() {
    if (syncing) return;

    syncing = true;

    try {
      await fetchInvoices();
      decorateRows();
    } catch (error) {
      console.error(
        "Invoice draft edit sync failed.",
        error
      );
    } finally {
      syncing = false;
    }
  }

  window.document.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest("[data-ie-open]");

      if (!button) return;

      openModal(button.dataset.ieOpen);
    }
  );

  form.addEventListener(
    "submit",
    async event => {
      event.preventDefault();

      if (!current) return;

      const items =
        [...itemsEl.querySelectorAll("[data-ie-item]")]
          .map(item => ({
            description:
              item.querySelector(
                "[data-ie-description]"
              ).value.trim(),

            quantity:
              Number(
                item.querySelector(
                  "[data-ie-quantity]"
                ).value
              ),

            unit_price:
              Number(
                item.querySelector(
                  "[data-ie-price]"
                ).value
              )
          }));

      const payload = {
        title:
          form.elements.title.value.trim(),

        project_id:
          projectSelect.value || null,

        due_date:
          form.elements.due_date.value || null,

        tax_amount:
          Number(
            form.elements.tax_amount.value || 0
          ),

        notes:
          form.elements.notes.value.trim() || null,

        items
      };

      errorEl.textContent = "";
      submit.disabled = true;
      submit.textContent = "Menyimpan...";

      try {
        const response = await fetch(
          `${API}/${encodeURIComponent(current.id)}`,
          {
            method: "PATCH",
            credentials: "same-origin",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          }
        );

        const data =
          await response.json().catch(() => ({}));

        if (
          !response.ok ||
          !data.invoice
        ) {
          throw new Error(
            data.error ||
            `HTTP ${response.status}`
          );
        }

        closeModal();

        window.document
          .querySelector("[data-invoice-refresh]")
          ?.click();

        setTimeout(syncRows, 400);

        const notice =
          window.document.querySelector(
            "[data-invoice-notice]"
          );

        if (notice) {
          notice.textContent =
            `Draft ${data.invoice.invoice_code} berhasil diperbarui.`;

          notice.classList.add("show");

          setTimeout(() => {
            notice.classList.remove("show");
          }, 4500);
        }
      } catch (error) {
        errorEl.textContent =
          error instanceof Error
            ? error.message
            : "Draft belum dapat diperbarui.";
      } finally {
        submit.disabled = false;
        submit.textContent = "Simpan Perubahan";
      }
    }
  );

  modal.querySelector("[data-ie-add]")
    .addEventListener(
      "click",
      () => addItem()
    );

  modal.querySelector("[data-ie-close]")
    .addEventListener(
      "click",
      closeModal
    );

  modal.querySelector("[data-ie-cancel]")
    .addEventListener(
      "click",
      closeModal
    );

  modal.addEventListener(
    "click",
    event => {
      if (event.target === modal) {
        closeModal();
      }
    }
  );

  window.document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape" &&
        !modal.hidden
      ) {
        closeModal();
      }
    }
  );

  const tbody =
    window.document.querySelector(
      "[data-invoice-rows]"
    );

  if (tbody) {
    new MutationObserver(() => {
      setTimeout(syncRows, 60);
    }).observe(
      tbody,
      { childList: true }
    );
  }

  setTimeout(syncRows, 400);
})();