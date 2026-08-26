(() => {
  const q = document.getElementById("q");
  const form = document.getElementById("searchForm");
  const results = document.getElementById("results");
  const count = document.getElementById("count");
  let index = [];

  const esc = s => String(s || "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));

  function score(item, term) {
    const t = term.toLowerCase();
    const title = (item.title || "").toLowerCase();
    const desc = (item.description || "").toLowerCase();
    const content = (item.content || "").toLowerCase();
    let s = 0;
    if (title.includes(t)) s += 100;
    if (desc.includes(t)) s += 40;
    if (content.includes(t)) s += 10;
    return s;
  }

  function render(term) {
    term = term.trim();
    if (!term) { count.textContent = ""; results.innerHTML = ""; return; }
    const found = index.map(x => ({x, s: score(x, term)}))
      .filter(x => x.s > 0).sort((a,b) => b.s-a.s).slice(0, 50);
    count.textContent = `${found.length} hasil ditemukan`;
    results.innerHTML = found.length ? found.map(({x}) => `
      <article class="result">
        <h2><a href="${esc(x.url)}">${esc(x.title)}</a></h2>
        <p>${esc(x.description || (x.content || "").slice(0,220))}</p>
      </article>`).join("") : '<div class="empty">Tidak ditemukan hasil untuk pencarian tersebut.</div>';
  }

  fetch("/search-index.json")
    .then(r => r.json()).then(data => {
      index = Array.isArray(data) ? data : [];
      const params = new URLSearchParams(location.search);
      q.value = params.get("q") || "";
      render(q.value);
    }).catch(() => {
      count.textContent = "";
      results.innerHTML = '<div class="empty">Indeks pencarian belum dapat dimuat.</div>';
    });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const term = q.value.trim();
    history.replaceState(null, "", term ? `?q=${encodeURIComponent(term)}` : "search.html");
    render(term);
  });
})();
