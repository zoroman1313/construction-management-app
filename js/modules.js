(function () {
  const registry = [
    {
      id: 'accounting',
      title: 'Accounting',
      icon: 'fas fa-calculator',
      path: 'pages/accounting.html',
      sections: ['home','contractors','projects'],
      contexts: {
        contractors: { query: { ctx: 'contractors' } },
        'projects:finished': { query: { ctx: 'projects', status: 'finished' } },
        'projects:ongoing': { query: { ctx: 'projects', status: 'ongoing' } },
        'projects:estimate': { query: { ctx: 'projects', tab: 'estimate' } }
      }
    },
    {
      id: 'gallery',
      title: 'Gallery',
      icon: 'fas fa-images',
      path: 'pages/gallery.html',
      sections: ['home','contractors','projects'],
      contexts: { contractors: { query: { ctx: 'contractors' } } }
    }
  ];

  function buildUrl(mod, contextOrTarget) {
    let query = {};
    if (typeof contextOrTarget === 'string') {
      const preset = (mod.contexts || {})[contextOrTarget];
      if (preset?.query) query = preset.query;
    } else if (contextOrTarget && typeof contextOrTarget === 'object') {
      query = contextOrTarget;
    }
    const qs = new URLSearchParams(query).toString();
    return qs ? `${mod.path}?${qs}` : mod.path;
  }

  function open(id, contextOrTarget) {
    const mod = registry.find(m => m.id === id);
    if (!mod) return;
    window.location.href = buildUrl(mod, contextOrTarget);
  }

  function renderTiles(targetSelector, opts = {}) {
    const container = typeof targetSelector === 'string' ? document.querySelector(targetSelector) : targetSelector;
    if (!container) return;
    const { section } = opts;
    const items = section ? registry.filter(m => (m.sections || []).includes(section)) : registry;

    container.innerHTML = items.map(m => `
      <div class="menu-item module-tile" data-id="${m.id}">
        <div class="menu-icon"><i class="${m.icon}"></i></div>
        <h3 class="menu-title">${m.title}</h3>
      </div>
    `).join('');

    container.querySelectorAll('.module-tile').forEach(tile => {
      tile.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        open(id);
      }, { passive: true });
    });
  }

  function renderShortcuts(targetSelector, shortcuts = []) {
    const container = typeof targetSelector === 'string' ? document.querySelector(targetSelector) : targetSelector;
    if (!container) return;
    container.innerHTML = shortcuts.map(s => {
      const mod = registry.find(m => m.id === s.id);
      const icon = s.icon || mod?.icon || 'fas fa-square';
      const title = s.title || mod?.title || s.id;
      const href = mod ? buildUrl(mod, s.target || s.context) : '#';
      return `
        <div class="menu-item module-shortcut" data-href="${href}">
          <div class="menu-icon"><i class="${icon}"></i></div>
          <h3 class="menu-title">${title}</h3>
        </div>
      `;
    }).join('');
    container.querySelectorAll('.module-shortcut').forEach(el => {
      el.addEventListener('click', (e) => {
        const url = e.currentTarget.dataset.href;
        if (url && url !== '#') window.location.href = url;
      }, { passive: true });
    });
  }

  function getContext() {
    const url = new URL(window.location.href);
    const params = Object.fromEntries(url.searchParams.entries());
    return params;
  }

  window.Modules = {
    list: () => registry.slice(),
    get: (id) => registry.find(m => m.id === id),
    register: (mod) => { if (!registry.find(m => m.id === mod.id)) registry.push(mod); },
    renderTiles,
    renderShortcuts,
    open,
    getContext,
  };
})();


