// ============================================================
//  app.js — YourApron
//  FONTS global is loaded from fonts-data.js — never declared here
// ============================================================

const PAGE_SIZE = 12;

let selectedFont  = null;
let selectedIcon  = null;   // { type:'symbol'|'upload', label, svg?, src? }
let vinylColor    = CONFIG.defaultVinylColor || '#ffffff';
let activeCat     = 'all';
let searchQuery   = '';
let visibleCount  = PAGE_SIZE;
let filteredAll   = [];
let activeTab     = 'all';

const loadedFonts = new Set();

// ── DOM ──────────────────────────────────────────────────────
const inpName     = document.getElementById('inp-name');
const inpTitle    = document.getElementById('inp-title');
const btnSend     = document.getElementById('btn-send');
const btnCopy     = document.getElementById('btn-copy');
const modal       = document.getElementById('modal');

// ── SYMBOL LIBRARY ───────────────────────────────────────────
const SYMBOLS = [
  { label:'Star',      svg:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' },
  { label:'Heart',     svg:'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' },
  { label:'Wrench',    svg:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>' },
  { label:'Home',      svg:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
  { label:'Bolt',      svg:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>' },
  { label:'Smile',     svg:'<circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>' },
  { label:'Award',     svg:'<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>' },
  { label:'Sun',       svg:'<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>' },
  { label:'Shield',    svg:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
  { label:'Truck',     svg:'<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>' },
  { label:'Crown',     svg:'<path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M5 20h14"/>' },
  { label:'Leaf',      svg:'<path d="M2 22 16 8"/><path d="M16 8c0 0 2-6 6-6s-6 6-6 6c0 0-6 2-6 6"/>' },
  { label:'Scissors',  svg:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>' },
  { label:'Paint',     svg:'<path d="M19 3H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h3l4 12 4-12h3a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/>' },
  { label:'Hammer',    svg:'<path d="M13 2l-2 2.5h3L12 7"/><path d="M10 2v2.5"/><path d="M11.5 4.5L3 13l4 4 8.5-8.5"/><path d="M15 13l2 2"/>' },
  { label:'Tool',      svg:'<circle cx="7" cy="17" r="3"/><path d="M10.827 9.173A4 4 0 1 1 5.172 14.83l7.656-7.656A4 4 0 1 1 18.484 12.828l-7.657-7.655"/>' },
  { label:'Example',   svg:'<path d="m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9"/><path d="m18 15 4-4"/><path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5"/>' },

];

// ── ICON GRID ────────────────────────────────────────────────
function buildIconGrid() {
  const grid = document.getElementById('icon-grid');
  if (!grid) return;
  SYMBOLS.forEach((sym, i) => {
    const btn = document.createElement('button');
    btn.className = 'icon-btn';
    btn.title     = sym.label;
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${sym.svg}</svg>`;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedIcon = { type: 'symbol', label: sym.label, svg: sym.svg };
      document.getElementById('btn-clear-icon').style.display = '';
      refreshPricePills();
      refreshAllCards();
    });
    grid.appendChild(btn);
  });
}

// Icon tab switching
document.querySelectorAll('.icon-tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.icon-tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    document.getElementById('ipanel-pick').style.display   = t.dataset.itab === 'pick'   ? '' : 'none';
    document.getElementById('ipanel-upload').style.display = t.dataset.itab === 'upload' ? '' : 'none';
  });
});

// Upload
document.getElementById('icon-upload').addEventListener('change', e => {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    selectedIcon = { type: 'upload', label: file.name, src: ev.target.result };
    document.getElementById('btn-clear-icon').style.display = '';
    document.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('active'));
    refreshPricePills(); refreshAllCards();
  };
  reader.readAsDataURL(file);
});

// Drag & drop
const dropZone = document.getElementById('upload-drop');
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => {
  e.preventDefault(); dropZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = ev => {
    selectedIcon = { type: 'upload', label: file.name, src: ev.target.result };
    document.getElementById('btn-clear-icon').style.display = '';
    refreshPricePills(); refreshAllCards();
  };
  reader.readAsDataURL(file);
});

// Clear icon
document.getElementById('btn-clear-icon').addEventListener('click', () => {
  selectedIcon = null;
  document.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('btn-clear-icon').style.display = 'none';
  document.getElementById('icon-upload').value = '';
  refreshPricePills(); refreshAllCards();
});

// ── FONT LOADING ─────────────────────────────────────────────
function loadGoogleFont(name) {
  if (loadedFonts.has(name)) return;
  loadedFonts.add(name);
  const link = document.createElement('link');
  link.rel  = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${name.replace(/ /g,'+')}:wght@400;700&display=swap`;
  document.head.appendChild(link);
}

function loadLocalFont(name, file) {
  if (loadedFonts.has(name)) return;
  loadedFonts.add(name);
  const s = document.createElement('style');
  s.textContent = `@font-face{font-family:'${name}';src:url('fonts/${file}');font-display:swap;}`;
  document.head.appendChild(s);
}

// ── HELPERS ──────────────────────────────────────────────────
function getName()  { return inpName.value.trim()  || 'Your Name'; }
function getTitle() { return inpTitle.value.trim() || ''; }

function calcFontSize(name) {
  if (name.length > 22) return 11;
  if (name.length > 16) return 13;
  if (name.length > 10) return 15;
  return 18;
}

function iconSVG(size) {
  if (!selectedIcon) return '';
  if (selectedIcon.type === 'symbol')
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${selectedIcon.svg}</svg>`;
  return `<img src="${selectedIcon.src}" width="${size}" height="${size}" style="object-fit:contain;display:block">`;
}

// ── PRICING ───────────────────────────────────────────────────
function calcPrice() {
  const p   = CONFIG.pricing || {};
  const def = (CONFIG.defaultVinylColor || '#ffffff').toLowerCase();
  let total = p.base || 0;
  const items = [{ label: 'Name', price: 0, free: true }];

  if (getTitle())    { const v = p.title || 0; items.push({ label:'Title',  price: v }); total += v; }
  if (selectedIcon)  { const v = p.icon  || 0; items.push({ label:'Icon',   price: v }); total += v; }
  if (vinylColor.toLowerCase() !== def)
                     { const v = p.color || 0; items.push({ label:'Color',  price: v }); total += v; }
  return { items, total };
}

function refreshPricePills() {
  const p   = CONFIG.pricing || {};
  const def = (CONFIG.defaultVinylColor || '#ffffff').toLowerCase();

  // Title pill
  const tp = document.getElementById('ptag-title');
  if (tp) {
    if (getTitle()) { tp.textContent = `+$${(p.title||0).toFixed(2)} ✓`; tp.className = 'price-pill active-pill'; }
    else            { tp.textContent = `+$${(p.title||0).toFixed(2)}`;   tp.className = 'price-pill'; }
  }

  // Icon pill
  const ip = document.getElementById('ptag-icon');
  if (ip) {
    if (selectedIcon) { ip.textContent = `+$${(p.icon||0).toFixed(2)} ✓`; ip.className = 'price-pill active-pill'; }
    else              { ip.textContent = `+$${(p.icon||0).toFixed(2)}`;    ip.className = 'price-pill'; }
  }

  // Color pill
  const cp = document.getElementById('ptag-color');
  if (cp) {
    if (vinylColor.toLowerCase() === def) { cp.textContent = 'FREE if white'; cp.className = 'price-pill free-pill'; }
    else { cp.textContent = `+$${(p.color||0).toFixed(2)} ✓`; cp.className = 'price-pill active-pill'; }
  }

  refreshResultBar();
}

// ── PREVIEW HTML ──────────────────────────────────────────────
function previewHTML(fontName) {
  const name  = getName();
  const title = getTitle();
  const fs    = calcFontSize(name);
  const ic    = iconSVG(18);

  if (CONFIG.apronMode === 'image') {
    const cfg = CONFIG.apronImage;
    const ar  = cfg.aspectRatio || 1.59;
    return `
      <div class="apron-preview img-mode" style="padding-top:${(1/ar*100).toFixed(1)}%">
        <img class="apron-bg" src="${cfg.file}" alt="">
        <div class="apron-overlay" style="top:${cfg.textArea.top};left:${cfg.textArea.left};width:${cfg.textArea.width}">
          ${ic ? `<div class="prev-icon" style="color:${vinylColor}">${ic}</div>` : ''}
          <span class="prev-name" style="font-family:'${fontName}',sans-serif;font-size:${fs}px;color:${cfg.nameColor}">${name}</span>
          ${title ? `<span class="prev-title" style="color:${cfg.titleColor}">${title}</span>` : ''}
        </div>
      </div>`;
  }

  return `
    <div class="apron-preview">
      <div class="apron-content">
        ${ic ? `<div class="prev-icon" style="color:${vinylColor}">${ic}</div>` : ''}
        <span class="prev-name" style="font-family:'${fontName}',sans-serif;font-size:${fs}px;color:${vinylColor}">${name}</span>
        ${title ? `<span class="prev-title" style="color:${vinylColor};opacity:.75">${title}</span>` : ''}
      </div>
    </div>`;
}

// ── CARD ─────────────────────────────────────────────────────
function makeCard(f) {
  const el = document.createElement('div');
  el.className    = 'font-card' + (selectedFont === f.name ? ' selected' : '');
  el.dataset.font = f.name;
  el.innerHTML    = `
    ${previewHTML(f.name)}
    <div class="card-footer">
      <span class="card-name">${f.name}</span>
      <span class="card-cat">${f.cat}</span>
    </div>`;
  el.addEventListener('click', () => selectFont(f.name));
  return el;
}

function refreshAllCards() {
  const name  = getName();
  const title = getTitle();
  const fs    = calcFontSize(name);
  const ic    = iconSVG(18);

  document.querySelectorAll('.font-card').forEach(card => {
    const fn = card.dataset.font;
    const pn = card.querySelector('.prev-name');
    const pt = card.querySelector('.prev-title');
    const pi = card.querySelector('.prev-icon');

    if (pn) { pn.textContent = name; pn.style.fontSize = fs + 'px'; pn.style.color = vinylColor; }

    if (pt) {
      pt.textContent   = title;
      pt.style.display = title ? '' : 'none';
      pt.style.color   = vinylColor;
      pt.style.opacity = '.75';
    } else if (title) {
      // Element doesn't exist yet — card was initially rendered without a title, insert it now
      const apronContent = card.querySelector('.apron-content');
      if (apronContent) {
        const titleEl = document.createElement('span');
        titleEl.className   = 'prev-title';
        titleEl.textContent = title;
        titleEl.style.color   = vinylColor;
        titleEl.style.opacity = '.75';
        apronContent.appendChild(titleEl);
      }
    }

    if (ic) {
      if (pi) { pi.innerHTML = ic; pi.style.color = vinylColor; pi.style.display = ''; }
      else {
        // need to insert icon
        const apronContent = card.querySelector('.apron-content');
        if (apronContent) {
          const iconEl = document.createElement('div');
          iconEl.className = 'prev-icon';
          iconEl.style.color = vinylColor;
          iconEl.innerHTML = ic;
          apronContent.insertBefore(iconEl, apronContent.firstChild);
        }
      }
    } else if (pi) {
      pi.style.display = 'none';
    }
  });

  refreshResultBar();
}

// ── SELECT FONT ───────────────────────────────────────────────
function selectFont(name) {
  selectedFont = name;
  document.querySelectorAll('.font-card').forEach(c =>
    c.classList.toggle('selected', c.dataset.font === name)
  );
  refreshResultBar();
}

// ── RESULT BAR ────────────────────────────────────────────────
function refreshResultBar() {
  const preview   = document.getElementById('rb-preview');
  const fontEl    = document.getElementById('rb-font');
  const breakEl   = document.getElementById('rb-breakdown');
  const priceEl   = document.getElementById('rb-price');
  const { items, total } = calcPrice();
  const name  = getName();
  const title = getTitle();
  const fs    = Math.round(calcFontSize(name) * 0.62);
  const ic    = iconSVG(11);

  // Mini preview
  if (preview) {
    preview.innerHTML = `
      <div class="rb-mini" style="background:var(--orange)">
        ${ic ? `<span style="color:${vinylColor};display:flex;align-items:center">${ic}</span>` : ''}
        <span style="font-family:${selectedFont ? `'${selectedFont}',` : ''}sans-serif;font-size:${fs}px;color:${vinylColor};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%">${name}</span>
        ${title ? `<span style="font-size:7px;text-transform:uppercase;letter-spacing:.4px;color:${vinylColor};opacity:.7;white-space:nowrap">${title}</span>` : ''}
      </div>`;
  }

  if (fontEl)  fontEl.textContent  = selectedFont || 'Select a font above';
  if (priceEl) priceEl.textContent = '$' + total.toFixed(2);

  if (breakEl) {
    breakEl.innerHTML = items.map((item, i) =>
      `<span class="rb-item">${item.label}${item.free
        ? ' <span class="rb-free">FREE</span>'
        : ' <span class="rb-cost">+$' + item.price.toFixed(2) + '</span>'}${i < items.length-1 ? '' : ''}</span>`
    ).join('<span class="rb-dot">·</span>');
  }

  btnSend.disabled = !selectedFont;
  btnCopy.disabled = !selectedFont;
}

// ── COLOR PICKER ──────────────────────────────────────────────
function buildColorPicker() {
  const chips  = document.getElementById('color-chips');
  const custom = document.getElementById('color-custom');
  const nameEl = document.getElementById('color-name');
  if (!chips) return;

  function setColor(val, label) {
    vinylColor = val;
    if (nameEl)  nameEl.textContent = label;
    if (custom)  custom.value       = val;
    refreshPricePills();
    refreshAllCards();
  }

  (CONFIG.vinylColors || []).forEach(c => {
    const btn = document.createElement('button');
    btn.className        = 'color-chip';
    btn.title            = c.label;
    btn.dataset.value    = c.value;
    btn.style.background = c.value;
    if (c.value === '#ffffff') btn.style.border = '1.5px solid #ccc';

    const check = document.createElement('span');
    check.className = 'chip-check';
    check.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    btn.appendChild(check);

    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-chip').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      setColor(c.value, c.label);
    });
    chips.appendChild(btn);
  });

  if (custom) {
    custom.addEventListener('input', e => {
      document.querySelectorAll('.color-chip').forEach(x => x.classList.remove('active'));
      setColor(e.target.value, 'Custom');
    });
  }

  // Select default
  const def = CONFIG.defaultVinylColor || '#ffffff';
  const defChip = chips.querySelector(`[data-value="${def}"]`);
  if (defChip) defChip.click();
  else if (chips.firstChild) chips.firstChild.click();
}

// ── TABS ──────────────────────────────────────────────────────
function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  ['all','picks','top','custom'].forEach(id => {
    document.getElementById(`tab-${id}`).style.display = tab === id ? '' : 'none';
  });
  document.getElementById('filters').style.display = tab === 'all' ? '' : 'none';
  if (tab === 'picks')  renderPicks();
  if (tab === 'top')    renderTop();
  if (tab === 'custom') renderCustom();
}

// ── RENDER ────────────────────────────────────────────────────
function isOff(name) { return (CONFIG.disabledFonts || []).includes(name); }

function getFiltered() {
  return FONTS.filter(f => {
    if (isOff(f.name)) return false;
    if (activeCat !== 'all' && f.cat !== activeCat) return false;
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery)) return false;
    return true;
  });
}

function renderAll() {
  const grid = document.getElementById('grid-all');
  grid.innerHTML = '';
  const all = getFiltered();
  filteredAll = all;
  const cnt = document.getElementById('font-count');
  if (cnt) cnt.textContent = all.length + ' fonts';
  all.slice(0, visibleCount).forEach(f => { loadGoogleFont(f.name); grid.appendChild(makeCard(f)); });
  document.getElementById('btn-more').style.display = all.length > visibleCount ? '' : 'none';
}

function renderPicks() {
  const grid = document.getElementById('grid-picks'); grid.innerHTML = '';
  (CONFIG.companyFavourites || []).filter(n => !isOff(n))
    .map(n => FONTS.find(f => f.name === n)).filter(Boolean)
    .forEach(f => { loadGoogleFont(f.name); grid.appendChild(makeCard(f)); });
}

function renderTop() {
  const grid = document.getElementById('grid-top'); grid.innerHTML = '';
  FONTS.filter(f => !isOff(f.name)).slice(0, 24)
    .forEach(f => { loadGoogleFont(f.name); grid.appendChild(makeCard(f)); });
}

function renderCustom() {
  const grid  = document.getElementById('grid-custom'); grid.innerHTML = '';
  const empty = document.getElementById('empty-custom');
  const fonts = typeof CUSTOM_FONTS !== 'undefined' ? CUSTOM_FONTS : [];
  if (!fonts.length) { empty.style.display = ''; return; }
  empty.style.display = 'none';
  fonts.forEach(f => { loadLocalFont(f.name, f.file); grid.appendChild(makeCard({ name: f.name, cat: 'custom' })); });
}

// ── SEND / COPY ───────────────────────────────────────────────
function buildSummary() {
  const colorEntry = (CONFIG.vinylColors||[]).find(c => c.value === vinylColor);
  const colorLabel = colorEntry ? colorEntry.label : vinylColor;
  const { items, total } = calcPrice();
  const tag      = CONFIG.cashAppTag;
  const cashMail = CONFIG.cashAppEmail;
  const lines = [
    'YourApron — Design Request',
    '─────────────────────────',
    'Name:  ' + getName(),
  ];
  if (getTitle())    lines.push('Title: ' + getTitle());
  lines.push('Font:  ' + (selectedFont || '—'));
  lines.push('Color: ' + colorLabel);
  if (selectedIcon)  lines.push('Icon:  ' + selectedIcon.label);
  lines.push('');
  lines.push('── Pricing ──────────────');
  items.forEach(i => lines.push(i.label.padEnd(10) + (i.free ? 'FREE' : '$' + i.price.toFixed(2))));
  lines.push('Total:    $' + total.toFixed(2));
  if (total > 0) {
    lines.push('');
    lines.push('── Payment ──────────────');
    if (tag && tag !== 'YourCashtag')
      lines.push('Cash App:  https://cash.app/$' + tag + '/' + total.toFixed(2));
    if (cashMail && cashMail !== 'YourCashAppEmail@example.com')
      lines.push('Send to:   ' + cashMail + ' (Cash App)');
    if ((!tag || tag === 'YourCashtag') && (!cashMail || cashMail === 'YourCashAppEmail@example.com'))
      lines.push('Please arrange payment via Cash App.');
  }
  return lines.join('\n');
}

function openModal() {
  const name  = getName();
  const title = getTitle();
  const fs    = calcFontSize(name);
  const { items, total } = calcPrice();
  const colorEntry = (CONFIG.vinylColors||[]).find(c => c.value === vinylColor);
  const colorLabel = colorEntry ? colorEntry.label : vinylColor;
  const tag      = CONFIG.cashAppTag;
  const cashMail = CONFIG.cashAppEmail;
  const ic  = iconSVG(26);

  // Modal preview
  const mp = document.getElementById('modal-preview');
  mp.innerHTML = `
    <div class="modal-apron-inner">
      ${ic ? `<div style="color:${vinylColor};display:flex;align-items:center;justify-content:center;margin-bottom:4px">${ic}</div>` : ''}
      <span style="font-family:'${selectedFont}',sans-serif;font-size:${fs+5}px;color:${vinylColor}">${name}</span>
      ${title ? `<span style="color:${vinylColor};opacity:.75;font-size:11px;text-transform:uppercase;letter-spacing:.5px;margin-top:2px">${title}</span>` : ''}
    </div>`;

  // Modal rows — Cash App row (tag link + email, whichever are configured)
  let cashRow = '';
  if (total > 0) {
    const hasTag  = tag && tag !== 'YourCashtag';
    const hasMail = cashMail && cashMail !== 'YourCashAppEmail@example.com';
    if (hasTag || hasMail) {
      const tagPart  = hasTag  ? `<a href="https://cash.app/$${tag}/${total.toFixed(2)}" target="_blank" class="cashapp-link">Cash App → $${tag}</a>` : '';
      const mailPart = hasMail ? `<span>${hasTag ? ' or send to ' : 'Send to '}<strong>${cashMail}</strong> via Cash App</span>` : '';
      cashRow = `<div class="modal-cashapp">Please pay <strong>$${total.toFixed(2)}</strong> via Cash App: ${tagPart}${mailPart}</div>`;
    }
  }

  document.getElementById('modal-rows').innerHTML = `
    <div class="mrow"><span>Name</span><strong>${name}</strong></div>
    ${title ? `<div class="mrow"><span>Title</span><strong>${title}</strong></div>` : ''}
    <div class="mrow"><span>Font</span><strong style="font-family:'${selectedFont}',sans-serif">${selectedFont}</strong></div>
    <div class="mrow"><span>Color</span><strong><span class="color-dot" style="background:${vinylColor}"></span>${colorLabel}</strong></div>
    ${selectedIcon ? `<div class="mrow"><span>Icon</span><strong>${selectedIcon.label}</strong></div>` : ''}
    ${items.filter(i => !i.free).map(i => `<div class="mrow mrow-price"><span>${i.label}</span><strong>$${i.price.toFixed(2)}</strong></div>`).join('')}
    <div class="mrow mrow-total"><span>Total</span><strong class="total-val">$${total.toFixed(2)}</strong></div>
    ${cashRow}
  `;

  const subj = encodeURIComponent('Apron Design — ' + name);
  const body = encodeURIComponent(buildSummary());
  document.getElementById('btn-mailto').href = `mailto:${CONFIG.recipientEmail}?subject=${subj}&body=${body}`;
  modal.style.display = 'flex';
}

// ── EVENTS ────────────────────────────────────────────────────
btnSend.addEventListener('click', openModal);
document.getElementById('modal-close').addEventListener('click', () => modal.style.display = 'none');
modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

document.getElementById('btn-clipboard').addEventListener('click', () => {
  navigator.clipboard.writeText(buildSummary()).then(() => {
    const btn = document.getElementById('btn-clipboard'), orig = btn.innerHTML;
    btn.textContent = '✓ Copied!';
    setTimeout(() => btn.innerHTML = orig, 2000);
  });
});

btnCopy.addEventListener('click', () => {
  navigator.clipboard.writeText(buildSummary()).then(() => {
    const orig = btnCopy.innerHTML;
    btnCopy.textContent = '✓';
    setTimeout(() => btnCopy.innerHTML = orig, 1500);
  });
});

inpName.addEventListener('input', () => { refreshAllCards(); });
inpTitle.addEventListener('input', () => { refreshPricePills(); refreshAllCards(); });

document.getElementById('search-input').addEventListener('input', e => {
  searchQuery = e.target.value.toLowerCase().trim();
  visibleCount = PAGE_SIZE;
  renderAll();
});

document.getElementById('cat-chips').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  activeCat = chip.dataset.cat;
  visibleCount = PAGE_SIZE;
  renderAll();
});

document.getElementById('btn-more').addEventListener('click', () => {
  const grid = document.getElementById('grid-all');
  filteredAll.slice(grid.children.length, grid.children.length + PAGE_SIZE)
    .forEach(f => { loadGoogleFont(f.name); grid.appendChild(makeCard(f)); });
  visibleCount += PAGE_SIZE;
  if (filteredAll.length <= grid.children.length) document.getElementById('btn-more').style.display = 'none';
});

document.querySelector('.tabs').addEventListener('click', e => {
  const tab = e.target.closest('.tab');
  if (tab) switchTab(tab.dataset.tab);
});

// ── INIT ──────────────────────────────────────────────────────
function init() {
  const ls = document.getElementById('loading-screen');
  const es = document.getElementById('error-screen');

  if (typeof FONTS === 'undefined' || !Array.isArray(FONTS) || !FONTS.length) {
    ls.style.display = 'none';
    es.style.display = '';
    document.getElementById('error-message').textContent = 'fonts-data.js not found. Run generate-fonts.bat first.';
    return;
  }

  ls.style.display = 'none';
  buildIconGrid();
  buildColorPicker();
  refreshPricePills();
  (CONFIG.companyFavourites || []).forEach(loadGoogleFont);
  renderAll();
  refreshResultBar();
}

init();