// Accounting module: local storage data, context filtering, tabbed UI, simple tables and stats
(function(){
  const STORAGE_KEY = 'acc.records.v1';

  /**
   * A record has shape:
   * { id, kind: 'expense'|'invoice'|'payment', ctx: { scope, status?, tab? }, data: {...}, createdAt }
   * scope in {'all'|'contractors'|'projects'}; status/tab optional for projects
   */
  function readAll(){
    try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
  }
  function writeAll(arr){ localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }
  function uid(){ return 'r_' + Math.random().toString(36).slice(2) + Date.now().toString(36); }

  function deriveContextFromPage(){
    const params = (window.Modules && Modules.getContext()) || {};
    if (params.ctx === 'contractors') return { scope: 'contractors' };
    if (params.ctx === 'projects') {
      const c = { scope: 'projects' };
      if (params.status) c.status = params.status;
      if (params.tab) c.tab = params.tab;
      return c;
    }
    return { scope: 'all' };
  }

  function parseCtxSelect(value){
    if (value === 'auto') return deriveContextFromPage();
    if (value === 'all') return { scope: 'all' };
    if (value === 'contractors') return { scope: 'contractors' };
    if (value.startsWith('projects:')){
      const [, sub] = value.split(':');
      const c = { scope: 'projects' };
      if (sub === 'ongoing' || sub === 'finished') c.status = sub;
      if (sub === 'estimate') c.tab = 'estimate';
      return c;
    }
    return { scope: 'all' };
  }

  function sameContext(a, b){
    return a.scope === b.scope && a.status === b.status && a.tab === b.tab;
  }

  function filterByContext(records, ctx){
    if (ctx.scope === 'all') return records;
    return records.filter(r => sameContext(r.ctx || { scope:'all' }, ctx));
  }

  function currentCtx(){
    const sel = document.getElementById('accCtxSelect');
    const value = sel?.value || 'auto';
    return parseCtxSelect(value);
  }

  function setDefaultDates(){
    const today = new Date().toISOString().slice(0,10);
    const ids = ['expDate','invDate','payDate'];
    ids.forEach(id => { const el = document.getElementById(id); if (el && !el.value) el.value = today; });
  }

  function onTabClick(id){
    document.querySelectorAll('.acc-tab').forEach(el => el.style.display='none');
    document.getElementById(`tab-${id}`).style.display='block';
  }

  function bindTabs(){
    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', ()=> onTabClick(btn.dataset.tab));
    }, { passive: true });
  }

  function renderTable(targetId, rows, columns){
    const host = document.getElementById(targetId);
    if (!host) return;
    if (!rows.length){ host.innerHTML = '<div class="empty-state"><div class="empty-icon"><i class="fas fa-inbox"></i></div><h3>No items yet</h3><p>Use the form above to add one.</p></div>'; return; }
    const thead = '<tr>' + columns.map(c=>`<th style="text-align:left;padding:.5rem;border-bottom:1px solid #eee;">${c.label}</th>`).join('') + '<th></th></tr>';
    const trs = rows.map(r => {
      const tds = columns.map(c => `<td style="padding:.5rem;border-bottom:1px solid #f5f5f5;">${(c.render? c.render(r): r.data[c.key] ?? '')}</td>`).join('');
      return `<tr>${tds}<td style="text-align:right;padding:.5rem;border-bottom:1px solid #f5f5f5;"><button class="btn-secondary" data-del="${r.id}">Delete</button></td></tr>`;
    }).join('');
    host.innerHTML = `<div style="overflow:auto;"><table style="width:100%;border-collapse:collapse;">${thead}${trs}</table></div>`;
    host.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', ()=> removeRecord(btn.dataset.del)));
  }

  function removeRecord(id){
    const all = readAll();
    const next = all.filter(r => r.id !== id);
    writeAll(next);
    refreshAll();
  }

  function addExpense(e){
    e.preventDefault();
    const ctx = currentCtx();
    const rec = {
      id: uid(), kind: 'expense', ctx,
      data: {
        title: byId('expTitle').value.trim(),
        category: byId('expCategory').value,
        amount: Number(byId('expAmount').value || 0),
        date: byId('expDate').value,
        notes: byId('expNotes').value.trim(),
      },
      createdAt: new Date().toISOString(),
    };
    if (!rec.data.title || !rec.data.amount || !rec.data.date) return;
    const all = readAll(); all.unshift(rec); writeAll(all);
    e.target.reset(); setDefaultDates(); refreshAll();
  }

  function addInvoice(e){
    e.preventDefault();
    const ctx = currentCtx();
    const rec = {
      id: uid(), kind: 'invoice', ctx,
      data: {
        number: byId('invNumber').value.trim(),
        party: byId('invParty').value.trim(),
        amount: Number(byId('invAmount').value || 0),
        date: byId('invDate').value,
        status: byId('invStatus').value,
      },
      createdAt: new Date().toISOString(),
    };
    if (!rec.data.number || !rec.data.amount || !rec.data.date) return;
    const all = readAll(); all.unshift(rec); writeAll(all);
    e.target.reset(); setDefaultDates(); refreshAll();
  }

  function addPayment(e){
    e.preventDefault();
    const ctx = currentCtx();
    const rec = {
      id: uid(), kind: 'payment', ctx,
      data: {
        ref: byId('payRef').value.trim(),
        type: byId('payType').value,
        amount: Number(byId('payAmount').value || 0),
        date: byId('payDate').value,
      },
      createdAt: new Date().toISOString(),
    };
    if (!rec.data.ref || !rec.data.amount || !rec.data.date) return;
    const all = readAll(); all.unshift(rec); writeAll(all);
    e.target.reset(); setDefaultDates(); refreshAll();
  }

  function renderExpenses(ctx){
    const rows = filterByContext(readAll(), ctx).filter(r => r.kind==='expense');
    renderTable('expensesTableWrap', rows, [
      { key:'title', label:'Title' },
      { key:'category', label:'Category' },
      { key:'amount', label:'Amount (£)', render:r=> r.data.amount.toFixed(2) },
      { key:'date', label:'Date' },
    ]);
  }

  function renderInvoices(ctx){
    const rows = filterByContext(readAll(), ctx).filter(r => r.kind==='invoice');
    renderTable('invoicesTableWrap', rows, [
      { key:'number', label:'Invoice No.' },
      { key:'party', label:'Client/Supplier' },
      { key:'amount', label:'Amount (£)', render:r=> r.data.amount.toFixed(2) },
      { key:'date', label:'Date' },
      { key:'status', label:'Status' },
    ]);
  }

  function renderPayments(ctx){
    const rows = filterByContext(readAll(), ctx).filter(r => r.kind==='payment');
    renderTable('paymentsTableWrap', rows, [
      { key:'ref', label:'Reference' },
      { key:'type', label:'Type' },
      { key:'amount', label:'Amount (£)', render:r=> r.data.amount.toFixed(2) },
      { key:'date', label:'Date' },
    ]);
  }

  function renderSummary(ctx){
    const host = document.getElementById('summaryStats'); if (!host) return;
    const rows = filterByContext(readAll(), ctx);
    const totalExpenses = rows.filter(r=>r.kind==='expense').reduce((s,r)=> s + (r.data.amount||0), 0);
    const totalInvoices = rows.filter(r=>r.kind==='invoice').reduce((s,r)=> s + (r.data.amount||0), 0);
    const totalIncoming = rows.filter(r=>r.kind==='payment' && r.data.type==='Incoming').reduce((s,r)=> s + (r.data.amount||0), 0);
    const totalOutgoing = rows.filter(r=>r.kind==='payment' && r.data.type==='Outgoing').reduce((s,r)=> s + (r.data.amount||0), 0);
    const balance = (totalInvoices + totalIncoming) - (totalExpenses + totalOutgoing);
    host.innerHTML = `
      <div class="category-stats">
        <div class="stat-card"><i class="fas fa-receipt"></i><span class="stat-number">£${totalExpenses.toFixed(2)}</span><div class="stat-label">Expenses</div></div>
      </div>
      <div class="category-stats">
        <div class="stat-card"><i class="fas fa-file-invoice-dollar"></i><span class="stat-number">£${totalInvoices.toFixed(2)}</span><div class="stat-label">Invoices</div></div>
      </div>
      <div class="category-stats">
        <div class="stat-card"><i class="fas fa-arrow-down"></i><span class="stat-number">£${totalOutgoing.toFixed(2)}</span><div class="stat-label">Payments Out</div></div>
      </div>
      <div class="category-stats">
        <div class="stat-card"><i class="fas fa-arrow-up"></i><span class="stat-number">£${totalIncoming.toFixed(2)}</span><div class="stat-label">Payments In</div></div>
      </div>
      <div class="category-stats">
        <div class="stat-card" style="background:linear-gradient(135deg,#32cd32 0%,#28a745 100%);box-shadow:0 4px 15px rgba(50,205,50,.3)"><i class="fas fa-scale-balanced"></i><span class="stat-number">£${balance.toFixed(2)}</span><div class="stat-label">Balance</div></div>
      </div>`;
  }

  function refreshAll(){
    const ctx = currentCtx();
    renderExpenses(ctx);
    renderInvoices(ctx);
    renderPayments(ctx);
    renderSummary(ctx);
  }

  function byId(id){ return document.getElementById(id); }

  function bindForms(){
    byId('expenseForm')?.addEventListener('submit', addExpense);
    byId('invoiceForm')?.addEventListener('submit', addInvoice);
    byId('paymentForm')?.addEventListener('submit', addPayment);
  }

  function initCtxSelector(){
    const sel = byId('accCtxSelect'); if (!sel) return;
    sel.value = 'auto';
    sel.addEventListener('change', refreshAll);
  }

  document.addEventListener('DOMContentLoaded', function(){
    bindTabs();
    bindForms();
    initCtxSelector();
    setDefaultDates();
    refreshAll();
  });
})();


