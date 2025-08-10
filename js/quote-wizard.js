class QuoteWizard {
  constructor() {
    this.step = 1;
    this.state = {
      lead: {}, media: { photos:[], videos:[], drawings:[] },
      measures: [], checklist: {}, boq: [], terms: ''
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
    const next = document.getElementById('nextStep'); if (next) next.textContent = this.step===6?'پایان':'بعدی';
  }

  next() {
    if (this.step===1) this.collectLead();
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
      prev.textContent = `فایل‌ها → ${counts}`;
    }
  }

  addMeasureRow() {
    const id = Date.now();
    this.state.measures.push({ id, title:'فضا/اتاق', length:0, width:0, height:0, qty:1, area:0, volume:0 });
    this.renderMeasures();
  }

  renderMeasures() {
    const host = document.getElementById('measureList'); if (!host) return; host.innerHTML = '';
    this.state.measures.forEach(m=>{
      const row = document.createElement('div'); row.className = 'form-group';
      row.innerHTML = `
        <input value="${m.title}" data-id="${m.id}" data-k="title" placeholder="نام فضا">
        <div style="display:flex;gap:.5rem;">
          <input type="number" step="0.01" value="${m.length}" data-id="${m.id}" data-k="length" placeholder="طول (م)">
          <input type="number" step="0.01" value="${m.width}" data-id="${m.id}" data-k="width" placeholder="عرض (م)">
          <input type="number" step="0.01" value="${m.height}" data-id="${m.id}" data-k="height" placeholder="ارتفاع (م)">
          <input type="number" step="1" value="${m.qty}" data-id="${m.id}" data-k="qty" placeholder="تعداد">
        </div>
        <small>مساحت: <span id="area-${m.id}">${m.area}</span> • حجم: <span id="vol-${m.id}">${m.volume}</span></small>
      `;
      host.appendChild(row);
    });
    host.querySelectorAll('input').forEach(inp=>inp.addEventListener('input',(e)=>{
      const id = Number(e.target.getAttribute('data-id'));
      const k = e.target.getAttribute('data-k');
      const m = this.state.measures.find(x=>x.id===id); m[k] = isNaN(+e.target.value)? e.target.value : +e.target.value;
      m.area = +(m.length*m.width*m.qty).toFixed(2);
      m.volume = +(m.length*m.width*m.height*m.qty).toFixed(2);
      const a = document.getElementById(`area-${id}`); if (a) a.textContent = m.area;
      const v = document.getElementById(`vol-${id}`); if (v) v.textContent = m.volume;
    }));
  }

  renderChecklist() {
    const tpl = [
      { key:'prep', label:'آماده‌سازی/جمع‌آوری' },
      { key:'plaster', label:'گچ‌کاری/صاف‌کاری' },
      { key:'paint', label:'رنگ‌آمیزی' },
      { key:'tile', label:'کاشی/سرامیک' },
      { key:'electric', label:'برق‌کاری' },
      { key:'plumbing', label:'لوله‌کشی' }
    ];
    const host = document.getElementById('checklistContainer'); if (!host) return; host.innerHTML = '';
    tpl.forEach(i=>{
      const id = `chk-${i.key}`;
      const div = document.createElement('div'); div.className='form-group';
      div.innerHTML = `<label><input type="checkbox" id="${id}"> ${i.label}</label>`;
      host.appendChild(div);
      document.getElementById(id).addEventListener('change',(e)=>{ this.state.checklist[i.key]=e.target.checked; });
    });
  }

  updateTotals() {
    const sum = this.state.boq.reduce((t,x)=>t+(x.total||0),0);
    const el = document.getElementById('grandTotal'); if (el) el.textContent = new Intl.NumberFormat('fa-IR').format(sum);
  }

  priceFromCatalog(suggested=[]) {
    const items = [];
    const cat = window.PRICE_CATALOG||[];
    const add = (code, qty)=>{
      const it = cat.find(c=>c.code===code); if(!it) return;
      items.push({ code: it.code, title: it.title, unit: it.unit, qty, unitPrice: it.unitPrice, total: qty*it.unitPrice });
    };
    const totalArea = this.state.measures.reduce((t,m)=>t+(m.area||0),0);
    if (this.state.checklist.plaster) add('PL-001', totalArea);
    if (this.state.checklist.paint) add('PT-001', totalArea);
    if (this.state.checklist.tile) add('TL-001', totalArea*0.5);
    if (this.state.checklist.electric) add('EL-001', 5);
    if (this.state.checklist.plumbing) add('PLM-001', 3);
    add('CF-001', 1);
    suggested.forEach(s=>{
      items.push({ code: s.code||'AI', title: s.title, unit: s.unit||'مورد', qty: s.qty||1, unitPrice: s.unitPrice||0, total: (s.qty||1)*(s.unitPrice||0) });
    });
    this.state.boq = items;
    const host = document.getElementById('boqTable'); if (!host) return;
    host.innerHTML = `
      <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:.5rem;align-items:center;margin:.5rem 0;font-weight:bold;">
        <div>شرح</div><div>تعداد/متراژ</div><div>فی</div><div>جمع</div>
      </div>
      ${items.map((x,i)=>`
        <div style=\"display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:.5rem;align-items:center;margin:.25rem 0;\">
          <input value=\"${x.title}\" data-i=\"${i}\" data-k=\"title\">
          <input type=\"number\" step=\"0.01\" value=\"${x.qty}\" data-i=\"${i}\" data-k=\"qty\">
          <input type=\"number\" step=\"1\" value=\"${x.unitPrice}\" data-i=\"${i}\" data-k=\"unitPrice\">
          <div>${new Intl.NumberFormat('fa-IR').format(x.total)}</div>
        </div>`).join('')}
    `;
    host.querySelectorAll('input').forEach(inp=>inp.addEventListener('input',(e)=>{
      const i = Number(e.target.getAttribute('data-i'));
      const k = e.target.getAttribute('data-k');
      const row = this.state.boq[i];
      row[k] = (k==='title')? e.target.value : +e.target.value;
      row.total = +(row.qty*row.unitPrice).toFixed(0);
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
شرح کار: ${this.state.lead.brief}
چک‌لیست: ${JSON.stringify(this.state.checklist)}
اندازه‌برداری: ${JSON.stringify(this.state.measures)}
کاتالوگ نمونه: ${JSON.stringify((window.PRICE_CATALOG||[]).slice(0,5))}
بر اساس اطلاعات فوق، فهرست مقادیر و کار (BoQ) پیشنهادی با ساختار JSON بده:
[{ "title":"...", "unit":"...", "qty":..., "unitPrice":... }]`;
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
    if (!jsPDF) { if (st) st.textContent = 'خطا: jsPDF در دسترس نیست.'; return; }
    try {
      const s = this.state;
      const doc = new jsPDF({ unit:'pt', format:'a4' });
      let y = 40;
      doc.setFontSize(14); doc.text('پیشنهاد قیمت', 40, y); y+=24;
      doc.setFontSize(10);
      doc.text(`منبع: ${s.lead.source} | کد: ${s.lead.code||'-'}`, 40, y); y+=16;
      doc.text(`کارفرما: ${s.lead.client||'-'} | تلفن: ${s.lead.phone||'-'}`, 40, y); y+=16;
      doc.text(`نشانی: ${s.lead.address||'-'}`, 40, y); y+=16;
      doc.text(`شرح: ${s.lead.brief||'-'}`, 40, y); y+=24;

      doc.text('فهرست کار/قیمت:', 40, y); y+=16;
      doc.text('شرح', 40, y); doc.text('تعداد', 260, y); doc.text('فی', 340, y); doc.text('جمع', 420, y); y+=12;
      s.boq.forEach(r=>{
        doc.text(String(r.title||'-'), 40, y);
        doc.text(String(r.qty||0), 260, y, { align:'right' });
        doc.text(String(r.unitPrice||0), 360, y, { align:'right' });
        doc.text(String(r.total||0), 460, y, { align:'right' });
        y+=14; if (y>760) { doc.addPage(); y=40; }
      });
      const grand = s.boq.reduce((t,x)=>t+(x.total||0),0);
      y+=10; doc.setFontSize(12); doc.text(`جمع کل: ${grand.toLocaleString('fa-IR')} تومان`, 40, y); y+=20;
      doc.setFontSize(10);
      doc.text('شرایط:', 40, y); y+=14;
      doc.text((s.terms||'مطابق عرف قرارداد و قوانین کشور.'), 40, y, { maxWidth: 520 }); y+=40;
      doc.text('پیوست‌ها:', 40, y); y+=14;
      const list = [
        ...s.media.photos.map(f=>'عکس: '+f.name),
        ...s.media.videos.map(f=>'ویدیو: '+f.name),
        ...s.media.drawings.map(f=>'نقشه: '+f.name)
      ];
      list.slice(0,8).forEach(t=>{ doc.text(t, 50, y); y+=12; });
      const fileName = `Quote_${s.lead.code||Date.now()}.pdf`;
      doc.save(fileName);
      if (st) st.textContent = 'PDF ساخته شد و دانلود شد.';
    } catch (e) { if (st) st.textContent = 'خطا در ساخت PDF'; }
  }
}

document.addEventListener('DOMContentLoaded', ()=>{ window.quoteWizard = new QuoteWizard(); });


