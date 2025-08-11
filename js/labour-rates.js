// Labour/trade categories and reference rates (Checkatrade)
// NOTE: LABOUR_RATES is intentionally empty by default. You can populate it
// from your scraper/export. The UI will still function and show a placeholder.

window.TRADE_CATEGORIES = [
  { id: 'painting',   name: 'Painter & Decorator' },
  { id: 'plastering', name: 'Plasterer' },
  { id: 'tiling',     name: 'Tiler' },
  { id: 'electrical', name: 'Electrician' },
  { id: 'plumbing',   name: 'Plumber' },
  { id: 'roofing',    name: 'Roofer' },
  { id: 'bricklaying',name: 'Bricklayer' },
  { id: 'labour',     name: 'Labourer' }
];

window.LABOUR_RATES = window.LABOUR_RATES || [];

// Example structure (leave commented until you have real data)
// window.LABOUR_RATES = [
//   { trade: 'Painter & Decorator', avg_day_rate: '£180 - £250', avg_hour_rate: '£20 - £35', source_url: 'https://www.checkatrade.com/blog/cost-guides/how-much-do-tradespeople-cost/', last_checked: new Date().toISOString() },
// ];

// Lightweight runtime loader to populate rates from Checkatrade using a CORS-friendly mirror.
// It parses plain text and matches known trade names from TRADE_CATEGORIES, then finds nearby £ ranges.
(function runtimeLoadRates() {
  if ((window.LABOUR_RATES||[]).length > 0) return; // already populated
  const SOURCE = 'https://www.checkatrade.com/blog/cost-guides/how-much-do-tradespeople-cost/';
  const MIRROR = 'https://r.jina.ai/http://www.checkatrade.com/blog/cost-guides/how-much-do-tradespeople-cost/';
  const nowIso = new Date().toISOString();
  const names = (window.TRADE_CATEGORIES||[]).map(t => t.name);
  const moneyRe = /£\s?([\d,]+)(?:\s?-\s?£\s?([\d,]+))?/;
  function norm(s){ return (s||'').replace(/[\u2013\u2014]/g,'-').replace(/\s+/g,' ').trim(); }

  fetch(MIRROR, { mode: 'cors' }).then(r => r.text()).then(text => {
    const lines = text.split(/\n+/).map(norm).filter(Boolean);
    const results = [];
    names.forEach(tradeName => {
      const idx = lines.findIndex(l => l.toLowerCase().includes(tradeName.toLowerCase()));
      if (idx === -1) return;
      // Scan a window of lines after the trade name to find day/hour ranges
      const windowLines = lines.slice(idx, idx + 30);
      let day = null, hour = null;
      for (const ln of windowLines) {
        if (!day && /day/i.test(ln)) {
          const m = ln.match(moneyRe);
          if (m) day = m[2] ? `£${m[1]} - £${m[2]}` : `£${m[1]}`;
        }
        if (!hour && /(hour|hr)/i.test(ln)) {
          const m2 = ln.match(moneyRe);
          if (m2) hour = m2[2] ? `£${m2[1]} - £${m2[2]}` : `£${m2[1]}`;
        }
        if (day && hour) break;
      }
      if (day || hour) {
        results.push({ trade: tradeName, avg_day_rate: day, avg_hour_rate: hour, source_url: SOURCE, last_checked: nowIso });
      }
    });
    if (results.length) {
      window.LABOUR_RATES = results;
      // If a rates table container is visible, re-render it
      try {
        if (document.getElementById('ratesTable') && typeof window.quoteWizard?.renderRatesTable === 'function') {
          window.quoteWizard.renderRatesTable();
        }
      } catch {}
    }
  }).catch(() => {
    // Silent fallback; user can fill later
  });
})();


