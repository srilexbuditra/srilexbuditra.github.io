(() => {
  const input = document.getElementById('siteSearchInput');
  const form = document.getElementById('siteSearchForm');
  const panel = document.getElementById('siteSearchPanel');
  const suggestions = document.getElementById('siteSearchSuggestions');
  const historyBox = document.getElementById('siteSearchHistory');
  const trendingBox = document.getElementById('siteSearchTrending');
  const clearBtn = document.getElementById('clearSearchHistory');

  if (!input || !form || !panel || !suggestions) return;

  const KEY = 'srilex-search-history-v1';
  let active = -1;

  const trending = [
    'Website Company Profile',
    'Web Application',
    'REST API',
    'Sistem Informasi',
    'Database Development',
    'Deployment Cloud',
    'Portfolio',
    'Harga Website',
    'SEO',
    'Full Stack Developer Bengkulu'
  ];

  const phrases = [
    ['website', 'Website Company Profile'],
    ['aplikasi', 'Web Application'],
    ['api', 'REST API / Backend'],
    ['backend', 'Backend Development'],
    ['database', 'Database Development'],
    ['cloud', 'Deployment & Cloud'],
    ['portfolio', 'Featured Projects'],
    ['harga', 'Paket & Harga'],
    ['estimasi', 'Hitung Estimasi Project'],
    ['seo', 'Technical SEO'],
    ['sekolah', 'Website Sekolah'],
    ['pos', 'Aplikasi POS'],
    ['administrasi', 'Sistem Administrasi'],
    ['react', 'Frontend React'],
    ['node', 'Node.js Backend']
  ];

  const getHistory = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch (e) {
      return [];
    }
  };

  const setHistory = (value) => {
    localStorage.setItem(KEY, JSON.stringify(value.slice(0, 8)));
  };

  const esc = (text) =>
    String(text).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[char]));

  const reEsc = (text) =>
    String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const hi = (text, term) => {
    const safe = esc(text);

    const words = String(term || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return words.length
      ? safe.replace(
          new RegExp('(' + words.map(reEsc).join('|') + ')', 'gi'),
          '<mark>$1</mark>'
        )
      : safe;
  };

  function chip(text, target, type = 'history') {
    if (!target) return;

    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'search-chip';
    button.textContent =
      (type === 'history' ? '◷ ' : '') + text;

    button.addEventListener('click', () => go(text));

    target.appendChild(button);
  }

  function renderHistory() {
    if (!historyBox) return;

    historyBox.innerHTML = '';

    const history = getHistory();

    if (history.length) {
      history.forEach((item) => chip(item, historyBox));
    } else {
      historyBox.innerHTML =
        '<span style="color:#638095;font-size:10px">' +
        'Belum ada riwayat di perangkat ini.' +
        '</span>';
    }
  }

  function renderTrending() {
    if (!trendingBox) return;

    trendingBox.innerHTML = '';

    trending.forEach((item) =>
      chip(item, trendingBox, 'trend')
    );
  }

  function go(term) {
    term = String(term || '').trim();

    if (!term) return;

    const history = getHistory().filter(
      (item) =>
        item.toLowerCase() !== term.toLowerCase()
    );

    history.unshift(term);

    setHistory(history);

    location.href =
      '/search.html?q=' + encodeURIComponent(term);
  }

  function items() {
    return Array.from(
      suggestions.querySelectorAll(
        '[role="option"]'
      )
    );
  }

  function clearActive() {
    active = -1;

    input.removeAttribute('aria-activedescendant');

    items().forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('aria-selected', 'false');
    });
  }

  function activate(index) {
    const options = items();

    if (!options.length) {
      clearActive();
      return;
    }

    active =
      ((index % options.length) + options.length) %
      options.length;

    options.forEach((option, position) => {
      const selected = position === active;

      option.classList.toggle(
        'is-active',
        selected
      );

      option.setAttribute(
        'aria-selected',
        selected ? 'true' : 'false'
      );
    });

    const selectedOption = options[active];

    input.setAttribute(
      'aria-activedescendant',
      selectedOption.id
    );

    selectedOption.scrollIntoView({
      block: 'nearest'
    });
  }

  function openPanel() {
  panel.hidden = false;
}

  function closePanel() {
    panel.hidden = true;

    input.setAttribute(
      'aria-expanded',
      'false'
    );

    clearActive();
  }

  function createSuggestion(value, raw, index) {
    const option =
      document.createElement('div');

    option.id =
      'site-search-option-' + index;

    option.className =
      'search-suggestion';

    option.setAttribute(
      'role',
      'option'
    );

    option.setAttribute(
      'aria-selected',
      'false'
    );

    option.dataset.value =
      value.startsWith('Cari "')
        ? raw
        : value;

    option.innerHTML =
      '<strong aria-hidden="true">⌕</strong>' +
      '<span class="suggestion-copy">' +
      '<b>' + hi(value, raw) + '</b>' +
      '<small>Tekan Enter untuk mencari</small>' +
      '</span>' +
      '<span class="suggestion-enter" aria-hidden="true">↵</span>';

    option.addEventListener(
      'mousedown',
      (event) => {
        /*
         * Menjaga fokus tetap pada combobox
         * sehingga pola ARIA tidak terputus.
         */
        event.preventDefault();
      }
    );

    option.addEventListener(
      'click',
      () => go(option.dataset.value)
    );

    return option;
  }

  function update() {
    const raw = input.value.trim();
    const query = raw.toLowerCase();

    openPanel();

    renderHistory();
    renderTrending();

    suggestions.innerHTML = '';

    clearActive();

    /*
     * Jangan menaruh <span> biasa
     * di dalam role="listbox".
     *
     * Listbox sebaiknya hanya berisi
     * elemen role="option".
     */
    if (!query) {
  input.setAttribute('aria-expanded', 'false');
  return;
}

    const matches = phrases
      .filter(
        ([key, value]) =>
          key.includes(query) ||
          value.toLowerCase().includes(query)
      )
      .slice(0, 6);

    if (!matches.length) {
      matches.push([
        query,
        'Cari "' + raw + '"'
      ]);
    }

    matches.forEach(
      ([key, value], index) => {
        suggestions.appendChild(
          createSuggestion(
            value,
            raw,
            index
          )
        );
      }
    );
    input.setAttribute('aria-expanded', 'true');
  }

  input.addEventListener(
    'focus',
    update
  );

  input.addEventListener(
    'input',
    update
  );

  input.addEventListener(
    'keydown',
    (event) => {

      if (event.key === 'ArrowDown') {
        event.preventDefault();

        if (panel.hidden) {
          update();
        }

        activate(active + 1);
      }

      else if (event.key === 'ArrowUp') {
        event.preventDefault();

        if (panel.hidden) {
          update();
        }

        activate(active - 1);
      }

      else if (
        event.key === 'Enter' &&
        active >= 0
      ) {
        event.preventDefault();

        const option =
          items()[active];

        if (option) {
          go(option.dataset.value);
        }
      }

      else if (event.key === 'Escape') {
        event.preventDefault();

        closePanel();
      }
    }
  );

  form.addEventListener(
    'submit',
    (event) => {
      event.preventDefault();

      if (active >= 0) {
        const option =
          items()[active];

        if (option) {
          go(option.dataset.value);
          return;
        }
      }

      go(input.value);
    }
  );

  if (clearBtn) {
    clearBtn.addEventListener(
      'click',
      () => {
        localStorage.removeItem(KEY);
        renderHistory();

        input.focus();
      }
    );
  }

  document.addEventListener(
    'click',
    (event) => {
      if (!form.contains(event.target)) {
        closePanel();
      }
    }
  );

  /*
   * Kondisi awal ARIA.
   */
  input.setAttribute(
    'aria-expanded',
    'false'
  );

  input.removeAttribute(
    'aria-activedescendant'
  );
})();
