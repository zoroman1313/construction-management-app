class QuoteWizard {
  constructor() {
    this.step = 1;
    this.state = {
      lead: {}, media: { photos:[], videos:[], drawings:[] },
      measures: [], checklist: {}, boq: [], terms: '',
      trades: [], language: 'en', status: 'estimate'
    };
    this.bindUI();
  }

  open() { const m = document.getElementById('quoteModal'); if (m) { m.style.display = 'flex'; this.updateStep(); } }
  close() { const m = document.getElementById('quoteModal'); if (m) m.style.display = 'none'; }

  bindUI() {
    document.querySelector('.contractor-service[data-service="quick-quote"]')?.addEventListener('click', (e)=>{ e.stopPropagation(); this.open(); });
    document.getElementById('quoteCloseBtn')?.addEventListener('click', ()=>this.close());
    document.getElementById('nextStep')?.addEventListener('click', ()=>this.next());
    document.getElementById('prevStep')?.addEventListener('click', ()=>this.prev());
    document.getElementById('photos')?.addEventListener('change', (e)=>this.collectFiles(e,'photos'));
    document.getElementById('videos')?.addEventListener('change', (e)=>this.collectFiles(e,'videos'));
    document.getElementById('drawings')?.addEventListener('change', (e)=>this.collectFiles(e,'drawings'));
    document.getElementById('addMeasure')?.addEventListener('click', ()=>this.addMeasureRow());
    this.renderChecklist();
    document.getElementById('aiSuggestBtn')?.addEventListener('click', ()=>this.aiSuggest());
    document.getElementById('generatePdf')?.addEventListener('click', ()=>this.generatePdf());
    this.ensureTradeUI();
    this.ensureLangAndActivate();
  }

  updateStep() {
    document.querySelectorAll('.wizard-step').forEach((el,i)=>el.style.display = (i+1===this.step)?'':'none');
    document.querySelectorAll('.step-badge').forEach(b=>{
      const s = Number(b.getAttribute('data-step'));
      b.style.background = s===this.step ? '#ff6b35' : '#e9ecef';
      b.style.color = s===this.step ? '#fff' : '#333';
      b.style.padding = '.25rem .5rem'; b.style.borderRadius = '8px';
    });
    const prev = document.getElementById('prevStep'); if (prev) prev.style.visibility = this.step===1?'hidden':'visible';
    const next = document.getElementById('nextStep'); if (next) next.textContent = this.step===6?'Finish':'Next';
  }

  next() {
    if (this.step===1) this.collectLead();
    if (this.step===2) this.collectTrades();
    if (this.step===5) this.updateTotals();
    if (this.step<6) { this.step++; this.updateStep(); }
    else this.close();
  }
  prev() { if (this.step>1) { this.step--; this.updateStep(); } }

  collectLead() {
    this.state.lead = {
      source: document.getElementById('leadSource').value,
      code: (document.getElementById('leadCode').value||'').trim(),
      client: (document.getElementById('clientName').value||'').trim(),
      phone: (document.getElementById('clientPhone').value||'').trim(),
      address: (document.getElementById('siteAddress').value||'').trim(),
      brief: (document.getElementById('brief').value||'').trim()
    };
  }

  async collectFiles(e, key) {
    const files = Array.from(e.target.files||[]);
    this.state.media[key] = files;
    const prev = document.getElementById('mediaPreview');
    if (prev) {
      const counts = Object.entries(this.state.media).map(([k,v])=>`${k}:${v.length}`).join(' | ');
      prev.textContent = `Files → ${counts}`;
    }
  }

  addMeasureRow() {
    const id = Date.now();
    this.state.measures.push({
      id,
      title:'Space/Room',
      length:0, width:0, height:0, qty:1, area:0, volume:0,
      tags: { floor:false, walls:false, ceiling:false },
      photos: []
    });
    this.renderMeasures();
  }

  renderMeasures() {
    const host = document.getElementById('measureList'); if (!host) return; host.innerHTML = '';
    this.state.measures.forEach(m=>{
      const row = document.createElement('div'); row.className = 'form-group';
      row.innerHTML = `
        <input value="${m.title}" data-id="${m.id}" data-k="title" placeholder="Space name">
        <div style="display:flex;gap:.5rem;">
          <input type="number" step="0.01" value="${m.length}" data-id="${m.id}" data-k="length" placeholder="Length (m)">
          <input type="number" step="0.01" value="${m.width}" data-id="${m.id}" data-k="width" placeholder="Width (m)">
          <input type="number" step="0.01" value="${m.height}" data-id="${m.id}" data-k="height" placeholder="Height (m)">
          <input type="number" step="1" value="${m.qty}" data-id="${m.id}" data-k="qty" placeholder="Qty">
        </div>
        <small>Area: <span id="area-${m.id}">${m.area}</span> • Volume: <span id="vol-${m.id}">${m.volume}</span></small>
        <div style="display:flex;gap:1rem;margin-top:.5rem;align-items:center;">
          <label><input type="checkbox" data-id="${m.id}" data-tag="floor" ${m.tags?.floor?'checked':''}> Floor</label>
          <label><input type="checkbox" data-id="${m.id}" data-tag="walls" ${m.tags?.walls?'checked':''}> Walls</label>
          <label><input type="checkbox" data-id="${m.id}" data-tag="ceiling" ${m.tags?.ceiling?'checked':''}> Ceiling</label>
        </div>
        <div class="form-group" style="margin-top:.5rem;">
          <label>Photos for this space</label>
          <input type="file" accept="image/*" capture="environment" multiple data-id="${m.id}" data-role="space-photos">
          <div id="gallery-${m.id}" style="display:flex;gap:.25rem;flex-wrap:wrap;margin-top:.5rem;">${(m.photos||[]).map(p=>`<span style='font-size:12px;background:#f1f1f1;border-radius:6px;padding:2px 6px;'>${p.name}</span>`).join('')}</div>
        </div>
      `;
      host.appendChild(row);
    });
    host.querySelectorAll('input').forEach(inp=>inp.addEventListener('input',(e)=>{
      const id = Number(e.target.getAttribute('data-id'));
      const k = e.target.getAttribute('data-k');
      const role = e.target.getAttribute('data-role');
      const tagKey = e.target.getAttribute('data-tag');
      const m = this.state.measures.find(x=>x.id===id);
      if (role === 'space-photos') return; // handled below in change handler
      if (tagKey) {
        m.tags = m.tags || { floor:false, walls:false, ceiling:false };
        m.tags[tagKey] = e.target.checked;
        return;
      }
      if (k) {
        m[k] = isNaN(+e.target.value)? e.target.value : +e.target.value;
        m.area = +(m.length*m.width*m.qty).toFixed(2);
        m.volume = +(m.length*m.width*m.height*m.qty).toFixed(2);
        const a = document.getElementById(`area-${id}`); if (a) a.textContent = m.area;
        const v = document.getElementById(`vol-${id}`); if (v) v.textContent = m.volume;
      }
    }));
    // Handle photos per space
    host.querySelectorAll('input[data-role="space-photos"]').forEach(inp=>inp.addEventListener('change',(e)=>{
      const id = Number(e.target.getAttribute('data-id'));
      const m = this.state.measures.find(x=>x.id===id);
      const files = Array.from(e.target.files||[]);
      m.photos = [...(m.photos||[]), ...files.map(f=>({ name: f.name }))];
      const gal = document.getElementById(`gallery-${id}`);
      if (gal) {
        gal.innerHTML = (m.photos||[]).map(p=>`<span style='font-size:12px;background:#f1f1f1;border-radius:6px;padding:2px 6px;'>${p.name}</span>`).join('');
      }
    }));
  }

  renderChecklist() {
    const base = [
      { key:'prep', label:'Preparation / clearance' }
    ];
    const byTrade = {
      painting:   [{ key:'paint_prep', label:'Surface preparation' }, { key:'two_coats', label:'Two coats of paint' }],
      plastering: [{ key:'skim', label:'Skim / smoothing' }],
      tiling:     [{ key:'adhesive', label:'Suitable adhesive' }],
      electrical: [{ key:'points', label:'Number of points' }],
      plumbing:   [{ key:'isolation', label:'Isolation/shut-off' }],
    };
    const activeTrades = this.state.trades || [];
    const tpl = [...base, ...activeTrades.flatMap(t => byTrade[t] || [])];
    const host = document.getElementById('checklistContainer'); if (!host) return; host.innerHTML = '';
    tpl.forEach(i=>{
      const id = `chk-${i.key}`;
      const div = document.createElement('div'); div.className='form-group';
      div.innerHTML = `<label><input type="checkbox" id="${id}"> ${i.label}</label>`;
      host.appendChild(div);
      document.getElementById(id).addEventListener('change',(e)=>{ this.state.checklist[i.key]=e.target.checked; });
    });
    const add = document.createElement('div'); add.className = 'form-group';
    add.innerHTML = `<div style="display:flex;gap:.5rem;"><input id="newChecklistItem" placeholder="Add item"><button id="addChecklistItem" class="btn-secondary">Add</button></div>`;
    host.appendChild(add);
    document.getElementById('addChecklistItem').addEventListener('click', ()=>{
      const val = (document.getElementById('newChecklistItem').value||'').trim();
      if (!val) return;
      const k = 'u_'+Date.now();
      this.state.checklist[k] = true;
      try {
        const q = JSON.parse(localStorage.getItem('checklist_suggestions')||'[]');
        q.push({ id:k, label: val, trades: activeTrades, ts: new Date().toISOString() });
        localStorage.setItem('checklist_suggestions', JSON.stringify(q));
      } catch {}
      this.renderChecklist();
    });
  }

  updateTotals() {
    const sum = this.state.boq.reduce((t,x)=>t+(x.total||0),0);
    const el = document.getElementById('grandTotal'); if (el) el.textContent = new Intl.NumberFormat('en-GB').format(sum);
  }

  priceFromCatalog(suggested=[]) {
    const items = [];
    const cat = window.PRICE_CATALOG||[];
    const add = (code, qty)=>{
      const it = cat.find(c=>c.code===code); if(!it) return;
      items.push({ code: it.code, title: it.title, unit: it.unit, qty, unitPrice: it.unitPrice, mgmt_pct: 0, contingency_pct: 0, time_hours: 0, total: qty*it.unitPrice });
    };
    const totalArea = this.state.measures.reduce((t,m)=>t+(m.area||0),0);
    if (this.state.checklist.plaster) add('PL-001', totalArea);
    if (this.state.checklist.paint) add('PT-001', totalArea);
    if (this.state.checklist.tile) add('TL-001', totalArea*0.5);
    if (this.state.checklist.electric) add('EL-001', 5);
    if (this.state.checklist.plumbing) add('PLM-001', 3);
    add('CF-001', 1);
    suggested.forEach(s=>{
       items.push({ code: s.code||'AI', title: s.title, unit: s.unit||'item', qty: s.qty||1, unitPrice: s.unitPrice||0, total: (s.qty||1)*(s.unitPrice||0) });
    });
    this.state.boq = items;
    const host = document.getElementById('boqTable'); if (!host) return;
    host.innerHTML = `
      <div style="display:grid;grid-template-columns:2fr .8fr .8fr .8fr .8fr .8fr 1fr;gap:.5rem;align-items:center;margin:.5rem 0;font-weight:bold;">
        <div>Description</div><div>Qty</div><div>Rate</div><div>Mgmt %</div><div>Cont. %</div><div>Time (h)</div><div>Total</div>
      </div>
      ${items.map((x,i)=>`
        <div style=\"display:grid;grid-template-columns:2fr .8fr .8fr .8fr .8fr .8fr 1fr;gap:.5rem;align-items:center;margin:.25rem 0;\">
          <input value=\"${x.title}\" data-i=\"${i}\" data-k=\"title\">
          <input type=\"number\" step=\"0.01\" value=\"${x.qty}\" data-i=\"${i}\" data-k=\"qty\">
          <input type=\"number\" step=\"1\" value=\"${x.unitPrice}\" data-i=\"${i}\" data-k=\"unitPrice\">
          <input type=\"number\" step=\"1\" value=\"${x.mgmt_pct||0}\" data-i=\"${i}\" data-k=\"mgmt_pct\">
          <input type=\"number\" step=\"1\" value=\"${x.contingency_pct||0}\" data-i=\"${i}\" data-k=\"contingency_pct\">
          <input type=\"number\" step=\"0.5\" value=\"${x.time_hours||0}\" data-i=\"${i}\" data-k=\"time_hours\">
           <div>${new Intl.NumberFormat('en-GB').format(x.total)}</div>
        </div>`).join('')}
    `;
    host.querySelectorAll('input').forEach(inp=>inp.addEventListener('input',(e)=>{
      const i = Number(e.target.getAttribute('data-i'));
      const k = e.target.getAttribute('data-k');
      const row = this.state.boq[i];
      row[k] = (k==='title')? e.target.value : +e.target.value;
      const base = (row.qty||0) * (row.unitPrice||0);
      const withMgmt = base * (1 + (row.mgmt_pct||0)/100);
      const withCont = withMgmt * (1 + (row.contingency_pct||0)/100);
      row.total = +withCont.toFixed(0);
      this.priceFromCatalog([]);
      this.updateTotals();
    }));
    this.updateTotals();
  }

  async aiSuggest() {
    const hasAI = !!(window.aiAssistant && window.aiAssistant.key);
    try {
      if (hasAI) {
        const prompt = `
Brief: ${this.state.lead.brief}
Checklist: ${JSON.stringify(this.state.checklist)}
Measurements: ${JSON.stringify(this.state.measures)}
Trades: ${JSON.stringify(this.state.trades)}
Sample catalog: ${JSON.stringify((window.PRICE_CATALOG||[]).slice(0,5))}
Reference rates: ${JSON.stringify((window.LABOUR_RATES||[]).slice(0,5))}
Based on the above, provide a suggested Bill of Quantities (BoQ) in JSON array format:
[{ "title":"...", "unit":"...", "qty":..., "unitPrice":..., "mgmt_pct":..., "contingency_pct":..., "time_hours":... }]`;
        const txt = await window.aiAssistant.chat(prompt, 'gpt-4o-mini');
        const json = (txt && txt.trim().startsWith('[')) ? JSON.parse(txt) : [];
        this.priceFromCatalog(json);
      } else {
        this.priceFromCatalog([]);
      }
    } catch {
      this.priceFromCatalog([]);
    }
  }

  async generatePdf() {
    const { jsPDF } = window.jspdf || {};
    const st = document.getElementById('pdfStatus');
    if (!jsPDF) { if (st) st.textContent = 'Error: jsPDF is not available.'; return; }
    try {
      const s = this.state;
      const doc = new jsPDF({ unit:'pt', format:'a4' });
      let y = 40;
      const isEn = s.language === 'en';
      doc.setFontSize(14); doc.text(isEn ? 'Quotation' : 'Quotation', 40, y); y+=24;
      doc.setFontSize(10);
      doc.text(`Source: ${s.lead.source||'-'} | Code: ${s.lead.code||'-'}`, 40, y); y+=16;
      doc.text(`Client: ${s.lead.client||'-'} | Phone: ${s.lead.phone||'-'}`, 40, y); y+=16;
      doc.text(`Address: ${s.lead.address||'-'}`, 40, y); y+=16;
      doc.text(`Brief: ${s.lead.brief||'-'}`, 40, y); y+=24;

      doc.text('Bill of Quantities / Prices:', 40, y); y+=16;
      doc.text('Item', 40, y); doc.text('Qty', 260, y); doc.text('Unit', 300, y); doc.text('Rate', 360, y); doc.text('Total', 460, y);
      y+=12;
      s.boq.forEach(r=>{
        doc.text(String(r.title||'-'), 40, y);
        doc.text(String(r.qty||0), 260, y, { align:'right' });
        if (isEn) doc.text(String(r.unit||'m2'), 300, y, { align:'right' });
        doc.text(String(r.unitPrice||0), 360, y, { align:'right' });
        doc.text(String(r.total||0), 460, y, { align:'right' });
        y+=14; if (y>760) { doc.addPage(); y=40; }
      });
      const grand = s.boq.reduce((t,x)=>t+(x.total||0),0);
      y+=10; doc.setFontSize(12); doc.text('Grand total: £'+ grand.toLocaleString('en-GB'), 40, y); y+=20;
      doc.setFontSize(10);
      doc.text('Terms:', 40, y); y+=14;
      doc.text((s.terms|| 'According to standard contract terms.'), 40, y, { maxWidth: 520 }); y+=40;
      doc.text('Attachments:', 40, y); y+=14;
      const list = [
        ...s.media.photos.map(f=>'Photo: '+f.name),
        ...s.media.videos.map(f=>'Video: '+f.name),
        ...s.media.drawings.map(f=>'Drawing: '+f.name)
      ];
      list.slice(0,8).forEach(t=>{ doc.text(t, 50, y); y+=12; });
      const fileName = `Quote_${s.lead.code||Date.now()}.pdf`;
      doc.save(fileName);
      if (st) st.textContent = 'PDF generated and downloaded.';
    } catch (e) { if (st) st.textContent = 'Error generating PDF'; }
  }
  ensureTradeUI() {
    const multi = document.getElementById('tradeMulti');
    if (multi && window.TRADE_CATEGORIES) {
      if (!multi.options.length) {
        window.TRADE_CATEGORIES.forEach(t => {
          const opt = document.createElement('option'); opt.value = t.id; opt.textContent = t.name; multi.appendChild(opt);
        });
      }
    }
    const showRates = document.getElementById('showRates');
    if (showRates) {
      showRates.addEventListener('change', e => {
        const host = document.getElementById('ratesTable');
        if (!host) return;
        host.style.display = e.target.checked ? '' : 'none';
        if (e.target.checked) this.renderRatesTable();
      });
    }
  }
  renderRatesTable() {
    const host = document.getElementById('ratesTable'); if (!host) return;
    const rates = window.LABOUR_RATES||[];
    if (!rates.length) { host.innerHTML = '<div class="message" style="position:static;">No reference rates loaded</div>'; return; }
    const rows = rates.map(r => `<tr><td>${r.trade}</td><td>${r.avg_day_rate}</td><td>${r.avg_hour_rate}</td></tr>`).join('');
    host.innerHTML = `<table><thead><tr><th>Trade</th><th>Avg day</th><th>Avg hour</th></tr></thead><tbody>${rows}</tbody></table>`;
  }
  ensureLangAndActivate() {
    // Language select
    const sel = document.getElementById('langSelect');
    if (sel) {
      this.state.language = sel.value || 'en';
      sel.addEventListener('change', () => { this.state.language = sel.value; });
    }
    // Activate project button
    const act = document.getElementById('activateProjectBtn');
    if (act) {
      act.addEventListener('click', () => {
        const s = this.state;
        const projects = JSON.parse(localStorage.getItem('active_projects')||'[]');
        const project = {
          id: 'prj_'+Date.now(),
          title: s.lead?.brief || 'Project',
          client: { name: s.lead?.client, phone: s.lead?.phone, address: s.lead?.address },
          trades: s.trades, spaces: s.measures, media: s.media,
          checklist: s.checklist, boq: s.boq, terms: s.terms,
          meta: { source: s.lead?.source, code: s.lead?.code, createdAt: new Date().toISOString() },
          status: 'active'
        };
        projects.push(project);
        localStorage.setItem('active_projects', JSON.stringify(projects));
         alert('Project activated and saved in your projects list.');
      });
    }
  }
  collectTrades() {
    const multi = document.getElementById('tradeMulti');
    if (!multi) return;
    const picked = Array.from(multi.selectedOptions).map(o => o.value);
    this.state.trades = picked;
    this.renderChecklist();
  }
}

document.addEventListener('DOMContentLoaded', ()=>{ window.quoteWizard = new QuoteWizard(); });


