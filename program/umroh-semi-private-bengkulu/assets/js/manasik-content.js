(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const escText = (value) => String(value ?? '');

  const api = async (path) => {
    const response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      cache: 'no-store',
      headers: { Accept: 'application/json' }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data?.ok) {
      const error = new Error(data?.error || `http_${response.status}`);
      error.status = response.status;
      error.code = data?.error || '';
      throw error;
    }
    return data;
  };

  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = escText(text);
    return el;
  };

  const renderSectionBody = (section, body) => {
    const lines = String(body || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const bulletLines = lines.filter((line) => line.startsWith('- '));
    if (bulletLines.length && bulletLines.length === lines.length) {
      const ul = make('ul', 'lesson-list');
      bulletLines.forEach((line) => ul.appendChild(make('li', '', line.slice(2))));
      section.appendChild(ul);
      return;
    }

    String(body || '').split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean).forEach((part) => {
      section.appendChild(make('p', '', part.replace(/\s*\n\s*/g, ' ')));
    });
  };

  const renderBlocks = (container, blocks) => {
    container.replaceChildren();

    (Array.isArray(blocks) ? blocks : []).forEach((block) => {
      if (!block || typeof block !== 'object') return;

      if (block.type === 'section') {
        const section = make('section', 'lesson-section');
        section.appendChild(make('h2', '', block.heading || 'Bagian'));
        renderSectionBody(section, block.body || '');
        container.appendChild(section);
        return;
      }

      if (block.type === 'arabic') {
        const section = make('section', 'lesson-section');
        section.appendChild(make('h2', '', block.heading || 'Bacaan'));
        const arabic = make('div', 'arabic-block arabic-lines', block.arabic || '');
        arabic.dir = 'rtl';
        section.appendChild(arabic);
        if (block.body) section.appendChild(make('p', 'latin-reading', block.body));
        container.appendChild(section);
        return;
      }

      if (block.type === 'note') {
        const section = make('section', 'lesson-section lesson-note');
        section.appendChild(make('p', '', block.body || ''));
        container.appendChild(section);
        return;
      }

      if (block.type === 'steps' || block.type === 'tips') {
        const wrap = make('div', block.type === 'steps' ? 'ritual-steps' : 'tips-grid');
        (block.items || []).forEach((item, index) => {
          if (block.type === 'steps') {
            const card = make('article', 'ritual-step');
            card.appendChild(make('span', '', item.number || String(index + 1).padStart(2, '0')));
            const copy = make('div');
            copy.appendChild(make('strong', '', item.title || 'Langkah'));
            if (item.detail) copy.appendChild(make('p', '', item.detail));
            card.appendChild(copy);
            wrap.appendChild(card);
          } else {
            const card = make('article', 'tip-card');
            card.appendChild(make('span', '', item.number || String(index + 1).padStart(2, '0')));
            card.appendChild(make('strong', '', item.title || 'Tips'));
            if (item.detail) card.appendChild(make('p', '', item.detail));
            wrap.appendChild(card);
          }
        });
        container.appendChild(wrap);
      }
    });
  };

  const renderCatalog = async () => {
    const grid = document.querySelector('.module-grid');
    if (!grid || document.querySelector('[data-lesson-slug]')) return;

    try {
      const data = await api('/manasik/materials');
      const materials = data.materials || [];
      if (!materials.length) {
        grid.innerHTML = '<div class="manasik-sync-note" data-state="local">Belum ada materi Manasik yang dipublikasikan.</div>';
        return;
      }

      grid.replaceChildren();
      materials.forEach((material, index) => {
        const card = make('a', 'module-card');
        card.dataset.moduleSlug = material.material_key;
        card.href = `./${encodeURIComponent(material.material_key)}/index.html`;

        card.appendChild(make('div', 'module-number', String(index + 1).padStart(2, '0')));

        const visual = make('div', 'module-visual');
        const icon = make('span', `ui-icon icon-${material.icon_key || 'book'}`);
        icon.setAttribute('aria-hidden', 'true');
        visual.appendChild(icon);
        card.appendChild(visual);

        card.appendChild(make('h3', '', material.title));
        card.appendChild(make('p', '', material.summary));

        const footer = make('div', 'module-card-footer');
        const status = make('span', 'module-status', 'Belum selesai');
        status.dataset.moduleStatus = '';
        footer.appendChild(status);
        footer.appendChild(make('span', 'module-arrow', '→'));
        card.appendChild(footer);
        grid.appendChild(card);
      });

      const sectionLabel = document.querySelector('.manasik-section-head span');
      if (sectionLabel) sectionLabel.textContent = `${materials.length} Materi`;
      const count = document.querySelector('[data-progress-count]');
      if (count && count.textContent === '0 / 11') count.textContent = `0 / ${materials.length}`;

      window.dispatchEvent(new CustomEvent('umroh:manasik-catalog-ready', {
        detail: { materials }
      }));
    } catch (error) {
      console.warn('Manasik catalog:', error);
      // Static content remains as a safe fallback when API/network is temporarily unavailable.
    }
  };

  const setNavLink = (anchor, material, direction) => {
    if (!anchor) return;
    if (!material) {
      anchor.href = '../index.html';
      const small = anchor.querySelector('small');
      const strong = anchor.querySelector('strong');
      if (small) small.textContent = direction === 'previous' ? 'Kembali' : 'Semua Materi';
      if (strong) strong.textContent = 'Daftar Manasik';
      return;
    }
    anchor.href = `../${encodeURIComponent(material.material_key)}/index.html`;
    const strong = anchor.querySelector('strong');
    if (strong) strong.textContent = material.title;
  };

  const renderUnavailable = () => {
    const content = document.querySelector('.lesson-content');
    if (content) {
      content.replaceChildren();
      const note = make('section', 'lesson-section lesson-note');
      note.appendChild(make('p', '', 'Materi ini belum dipublikasikan oleh pengelola.'));
      content.appendChild(note);
    }
    const button = document.querySelector('[data-complete-button]');
    if (button) {
      button.disabled = true;
      button.textContent = 'Materi belum tersedia';
    }
  };

  const renderLesson = async () => {
    const page = document.querySelector('[data-lesson-slug]');
    if (!page) return;
    const slug = String(page.dataset.lessonSlug || '').trim();
    if (!slug) return;

    try {
      const data = await api(`/manasik/materials/${encodeURIComponent(slug)}`);
      const material = data.material;
      if (!material) return;

      const title = document.querySelector('.lesson-hero h1');
      const summary = document.querySelector('.lesson-hero p');
      const number = document.querySelector('.lesson-num');
      const crumb = document.querySelector('.lesson-crumbs b');
      const icon = document.querySelector('.lesson-hero-icon .ui-icon');
      const content = document.querySelector('.lesson-content');

      if (title) title.textContent = material.title;
      if (summary) summary.textContent = material.summary;
      if (number) number.textContent = `Materi ${String(material.position || material.sort_order).padStart(2, '0')} dari ${material.total}`;
      if (crumb) crumb.textContent = material.title;
      if (icon) icon.className = `ui-icon icon-${material.icon_key || 'book'}`;
      if (content) renderBlocks(content, material.content || []);

      document.title = `${material.title} | Manasik Digital Umroh Semi Private Bengkulu`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) metaDescription.setAttribute('content', material.summary);

      const links = [...document.querySelectorAll('.lesson-nav > a')];
      if (links.length >= 1) setNavLink(links[0], material.previous, 'previous');
      if (links.length >= 2) setNavLink(links[1], material.next, 'next');

      window.dispatchEvent(new CustomEvent('umroh:manasik-material-ready', {
        detail: { material }
      }));
    } catch (error) {
      if (error.status === 404) renderUnavailable();
      else console.warn('Manasik material:', error);
    }
  };

  renderCatalog();
  renderLesson();
})();
