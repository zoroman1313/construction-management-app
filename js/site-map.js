// Site Map (Sitemap) with cascading columns and caret indicators
(function(){
  const isFinePointer = matchMedia('(pointer: fine)').matches;

  function injectStyles(){
    if (document.getElementById('sitemap-cascade-styles')) return;
    const css = `
      .sm-overlay{position:fixed;inset:0;background:rgba(0,0,0,.35);display:none;align-items:flex-start;justify-content:center;z-index:9999}
      .sm-panel{margin-top:64px;background:#fff;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.18);width:min(1080px,94vw);padding:0;overflow:hidden}
      .sm-header{display:flex;align-items:center;justify-content:space-between;padding:.75rem 1rem;border-bottom:1px solid #eee}
      .sm-title{font-size:16px;font-weight:700;margin:0}
      .sm-close{background:none;border:none;font-size:22px;cursor:pointer}
      .sm-body{display:grid;grid-template-columns:1fr 1fr 1fr}
      .sm-col{min-height:320px;max-height:70vh;overflow:auto;border-inline-start:1px solid #f1f1f1}
      .sm-col:first-child{border-inline-start:none}
      .sm-list{list-style:none;margin:0;padding:.5rem}
      .sm-item{display:flex;align-items:center;justify-content:space-between;gap:.5rem;padding:.5rem .6rem;border-radius:10px;cursor:pointer}
      .sm-item:hover{background:#f8f9fa}
      .sm-left{display:flex;align-items:center;gap:.5rem}
      .sm-icon{width:22px;text-align:center;color:#ff6b35}
      .sm-caret{color:#adb5bd}
      .sm-item.has-children .sm-caret{visibility:visible}
      .sm-item:not(.has-children) .sm-caret{visibility:hidden}
      @media (max-width: 767px){ .sm-body{grid-template-columns:1fr} .sm-col{max-height:72vh} }
    `;
    const st = document.createElement('style'); st.id='sitemap-cascade-styles'; st.textContent = css; document.head.appendChild(st);
  }

  function buildUrl(path){
    const base = window.location.pathname.includes('/pages/') ? '../' : '';
    return base + path.replace(/^\/?/, '');
  }

  function data(){
    const itemsProjects = [
      { label:'Ongoing', icon:'fas fa-briefcase', action:()=> location.href = buildUrl('pages/projects.html?status=ongoing') },
      { label:'Finished', icon:'fas fa-check-circle', action:()=> location.href = buildUrl('pages/projects.html?status=finished') },
      { label:'Estimated', icon:'fas fa-list-ol', action:()=> location.href = buildUrl('pages/projects.html?status=estimated') },
    ];
    const accChildren = [
      { label:'Contractors', icon:'fas fa-calculator', action:()=> location.href = buildUrl('pages/accounting.html?ctx=contractors') },
      { label:'Projects / Ongoing', icon:'fas fa-calculator', action:()=> location.href = buildUrl('pages/accounting.html?ctx=projects&status=ongoing') },
      { label:'Projects / Finished', icon:'fas fa-calculator', action:()=> location.href = buildUrl('pages/accounting.html?ctx=projects&status=finished') },
      { label:'Projects / Estimate', icon:'fas fa-calculator', action:()=> location.href = buildUrl('pages/accounting.html?ctx=projects&tab=estimate') },
    ];
    return [
      { label:'Home', icon:'fas fa-home', action:()=> location.href = buildUrl('index.html') },
      { label:'Contractors', icon:'fas fa-hard-hat', children:[
        { label:'Projects', icon:'fas fa-project-diagram', children: itemsProjects },
        { label:'Quick quote', icon:'fas fa-file-invoice-dollar', action:()=> location.href = buildUrl('pages/contractors.html?open=quote') },
        { label:'Gallery', icon:'fas fa-images', action:()=> location.href = buildUrl('pages/gallery.html') },
        { label:'Accounting', icon:'fas fa-calculator', children: accChildren },
      ]},
      { label:'Users', icon:'fas fa-users', action:()=> location.href = buildUrl('pages/users.html') },
      { label:'Providers', icon:'fas fa-handshake', action:()=> location.href = buildUrl('pages/providers.html') },
      { label:'Sign in', icon:'fas fa-right-to-bracket', action:()=> location.href = buildUrl('pages/login.html') },
    ];
  }

  function createOverlay(){
    if (document.getElementById('smOverlay')) return document.getElementById('smOverlay');
    injectStyles();
    const ov = document.createElement('div'); ov.id='smOverlay'; ov.className='sm-overlay';
    ov.innerHTML = `
      <div class="sm-panel" role="dialog" aria-modal="true">
        <div class="sm-header">
          <h3 class="sm-title">Sitemap</h3>
          <button class="sm-close" aria-label="Close">×</button>
        </div>
        <div class="sm-body">
          <div class="sm-col"><ul id="sm-col-0" class="sm-list"></ul></div>
          <div class="sm-col"><ul id="sm-col-1" class="sm-list"></ul></div>
          <div class="sm-col"><ul id="sm-col-2" class="sm-list"></ul></div>
        </div>
      </div>`;
    document.body.appendChild(ov);
    ov.addEventListener('click', (e)=>{ if (e.target === ov) hide(); });
    ov.querySelector('.sm-close').addEventListener('click', hide);
    document.addEventListener('keydown', (e)=>{ if (e.key==='Escape') hide(); });
    return ov;
  }

  function itemTemplate(n){
    const hasChildren = Array.isArray(n.children) && n.children.length>0;
    return `<li class="sm-item ${hasChildren?'has-children':''}">
      <span class="sm-left"><span class="sm-icon"><i class="${n.icon||'fas fa-circle'}"></i></span><span>${n.label}</span></span>
      <span class="sm-caret"><i class="fas fa-chevron-right"></i></span>
    </li>`;
  }

  function fill(ul, nodes){
    ul.innerHTML = nodes.map(itemTemplate).join('');
  }

  function bindColumn(colEl, nodes, onPick){
    const items = Array.from(colEl.children);
    items.forEach((li, idx)=>{
      const node = nodes[idx];
      const activate = ()=>{
        if (node.children && node.children.length){ onPick(node, true); }
        else if (typeof node.action === 'function'){ hide(); node.action(); }
      };
      if (isFinePointer){ li.addEventListener('mouseenter', ()=> onPick(node, true)); }
      li.addEventListener('click', activate, { passive: true });
      li.addEventListener('keydown', (e)=>{ if (e.key==='Enter' || e.key===' ') activate(); });
      li.tabIndex = 0;
    });
  }

  function show(){
    const ov = createOverlay();
    const root = data();
    const c0 = ov.querySelector('#sm-col-0');
    const c1 = ov.querySelector('#sm-col-1');
    const c2 = ov.querySelector('#sm-col-2');

    fill(c0, root);
    c1.innerHTML = ''; c2.innerHTML='';

    bindColumn(c0, root, (node)=>{
      const a = node.children||[]; fill(c1, a); c2.innerHTML='';
      bindColumn(c1, a, (node2)=>{
        const b = node2.children||[]; fill(c2, b);
        bindColumn(c2, b, (leaf)=>{});
      });
    });

    ov.style.display='flex';
  }

  function hide(){
    const ov = document.getElementById('smOverlay'); if (ov) ov.style.display='none';
  }

  function injectTrigger(){
    try{
      const navList = document.querySelector('.header .nav .nav-list');
      if (!navList || navList.querySelector('[data-role="sitemap-btn"]')) return;
      const li = document.createElement('li');
      li.innerHTML = `<a href="#" class="nav-link" data-role="sitemap-btn" title="Sitemap"><i class="fas fa-sitemap"></i></a>`;
      navList.appendChild(li);
      li.querySelector('a').addEventListener('click', (e)=>{ e.preventDefault(); show(); });
    }catch{}
  }

  document.addEventListener('DOMContentLoaded', injectTrigger);

  window.SiteMap = { show, hide };
})();

