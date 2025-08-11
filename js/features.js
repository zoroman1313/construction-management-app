(function () {
  const features = new Map();

  function register(id, initFn) {
    if (!features.has(id)) features.set(id, { id, initFn, enabled: true });
  }

  function enable(id, flag = true) {
    const f = features.get(id);
    if (f) f.enabled = flag;
  }

  function init(root = document) {
    features.forEach(f => {
      try { if (f.enabled) f.initFn(root); } catch (e) { console.warn('Feature init error:', f.id, e); }
    });
  }

  // Example: extract cost from a receipt image
  register('aiCostFromImage', (root) => {
    const zones = root.querySelectorAll('[data-feature="ai-cost"]');
    zones.forEach(zone => {
      const input = zone.querySelector('input[type="file"]');
      const out = zone.querySelector('[data-ai-cost-output]');
      const btn = zone.querySelector('[data-ai-extract]');
      if (!input || !out || !btn) return;

      btn.addEventListener('click', async () => {
        out.textContent = 'Analysing image...';
        try {
          if (!window.AIAddon || !AIAddon.extractCostFromImage) {
            out.textContent = 'AI module is not available.';
            return;
          }
          const file = input.files?.[0];
          if (!file) { out.textContent = 'Please choose an image.'; return; }
          const result = await AIAddon.extractCostFromImage(file);
          out.textContent = result?.text || 'No result.';
        } catch (e) {
          out.textContent = 'Error while analysing the image.';
        }
      }, { passive: true });
    });
  });

  window.Features = { register, enable, init };
})();


