// ============================================================
//  app.js — Name Tag Font Picker
// ============================================================

const PAGE_SIZE = 12;

let selectedFont    = null;
let activeCat       = 'all';
let searchQuery     = '';
let visibleCount    = PAGE_SIZE;
let filteredAll     = [];
let activeTab       = 'all';

const loadedFonts = new Set();

// ── DOM ──────────────────────────────────────────────────────
const inpName      = document.getElementById('inp-name');
const inpTitle     = document.getElementById('inp-title');
const searchInput  = document.getElementById('search');
const gridAll      = document.getElementById('grid-all');
const gridPicks    = document.getElementById('grid-picks');
const gridGoogle   = document.getElementById('grid-google');
const btnMore      = document.getElementById('btn-more');
const btnSend      = document.getElementById('btn-send');
const btnCopy      = document.getElementById('btn-copy');
const resultsMeta  = document.getElementById('results-meta');
const filterSec    = document.getElementById('filter-section');
const modal        = document.getElementById('modal');

// ── FONT LOADING ─────────────────────────────────────────────
function loadGoogleFont(name) {
  if (loadedFonts.has(name)) return;
  loadedFonts.add(name);
  const link = document.createElement('link');
  link.rel   = 'stylesheet';
  link.href  = `https://fonts.googleapis.com/css2?family=${name.replace(/ /g,'+')}:wght@400;700&display=swap`;
  document.head.appendChild(link);
}

// ── HELPERS ──────────────────────────────────────────────────
function getName()  { return inpName.value.trim()  || 'Your Name'; }
function getTitle() { return inpTitle.value.trim() || 'Position';  }

function calcFontSize(name) {
  if (name.length > 22) return 12;
  if (name.length > 16) return 14;
  if (name.length > 10) return 16;
  return 19;
}

// ── NAMETAG PREVIEW BUILDER ───────────────────────────────────
// Returns an HTML string for the nametag preview inside a card.
// Handles both 'css' mode and 'image' mode from CONFIG.
function buildPreviewHTML(fontName) {
  const name  = getName();
  const title = getTitle();
  const fs    = calcFontSize(name);
  const cfg   = CONFIG.nametagImage;

  if (CONFIG.nametagMode === 'image') {
    // Image mode: real photo/scan as background, text positioned on top
    const ar = cfg.aspectRatio || 1.59;
    return `
      <div class="nametag-preview nametag-image-mode" style="padding-top:${(1/ar*100).toFixed(2)}%">
        <img class="nametag-bg-img" src="${cfg.file}" alt="Name tag">
        <div class="nametag-text-overlay" style="top:${cfg.textArea.top};left:${cfg.textArea.left};width:${cfg.textArea.width}">
          <span class="prev-name" style="font-family:'${fontName}',sans-serif;font-size:${fs}px;color:${cfg.nameColor}">${name}</span>
          <span class="prev-pos"  style="color:${cfg.titleColor}">${title}</span>
        </div>
      </div>`;
  }

  // CSS mode: styled badge
  return `
    <div class="nametag-preview">
      <div class="nametag-inner">
        <span class="prev-name" style="font-family:'${fontName}',sans-serif;font-size:${fs}px">${name}</span>
        <span class="prev-pos">${title}</span>
      </div>
    </div>`;
}

// ── CARD ─────────────────────────────────────────────────────
function makeCard(f) {
  const isSelected = selectedFont === f.name;
  const card = document.createElement('div');
  card.className    = 'font-card' + (isSelected ? ' selected' : '');
  card.dataset.font = f.name;

  card.innerHTML = `
    ${buildPreviewHTML(f.name)}
    <div class="card-footer">
      <span class="card-font-name">${f.name}</span>
      <span class="card-cat">${f.cat}</span>
    </div>
  `;

  card.addEventListener('click', () => selectFont(f.name));
  return card;
}

// ── SELECT ────────────────────────────────────────────────────
function selectFont(name) {
  selectedFont = name;
  document.querySelectorAll('.font-card').forEach(c =>
    c.classList.toggle('selected', c.dataset.font === name)
  );
  updateResultBar();
}

// ── RESULT BAR ────────────────────────────────────────────────
function buildResultNametag(container) {
  const name  = getName();
  const title = getTitle();
  const fs    = calcFontSize(name);
  const cfg   = CONFIG.nametagImage;

  if (CONFIG.nametagMode === 'image') {
    const ar = cfg.aspectRatio || 1.59;
    container.innerHTML = `
      <div class="nametag-mini-image" style="padding-top:${(1/ar*100).toFixed(2)}%">
        <img src="${cfg.file}" alt="Name tag">
        <div class="nametag-mini-overlay" style="top:${cfg.textArea.top};left:${cfg.textArea.left};width:${cfg.textArea.width}">
          <span class="mini-name" id="result-mini-name" style="font-family:'${selectedFont||''}',sans-serif;font-size:${Math.round(fs*0.6)}px;color:${cfg.nameColor}">${name}</span>
          <span class="mini-title" id="result-mini-title" style="color:${cfg.titleColor}">${title}</span>
        </div>
      </div>`;
  } else {
    container.innerHTML = `
      <div class="nametag-mini" style="${selectedFont ? `font-family:'${selectedFont}',sans-serif` : ''}">
        <span class="mini-name" id="result-mini-name" style="font-size:${Math.round(fs*0.65)}px">${name}</span>
        <span class="mini-title" id="result-mini-title">${title}</span>
      </div>`;
  }
}

function updateResultBar() {
  const container = document.querySelector('.result-preview');
  const fontLbl   = document.getElementById('result-font-name');
  const details   = document.getElementById('result-details');

  buildResultNametag(container);

  if (selectedFont) {
    fontLbl.textContent  = selectedFont;
    details.textContent  = `${getName()} · ${getTitle()}`;
    btnSend.disabled     = false;
    btnCopy.disabled     = false;
  } else {
    fontLbl.textContent  = 'Select a font above';
    details.textContent  = '';
    btnSend.disabled     = true;
    btnCopy.disabled     = true;
  }
}

// ── TABS ──────────────────────────────────────────────────────
function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.getElementById('tab-all').style.display    = tab === 'all'    ? '' : 'none';
  document.getElementById('tab-picks').style.display  = tab === 'picks'  ? '' : 'none';
  document.getElementById('tab-google').style.display = tab === 'google' ? '' : 'none';
  filterSec.style.display = tab === 'all' ? '' : 'none';

  if (tab === 'picks')  renderPicks();
  if (tab === 'google') renderGoogleTop();
}

// ── RENDER: ALL ───────────────────────────────────────────────
function getFiltered() {
  return FONTS.filter(f => {
    if (activeCat !== 'all' && f.cat !== activeCat) return false;
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery)) return false;
    return true;
  });
}

function renderAllTab() {
  gridAll.innerHTML = '';
  const all = getFiltered();
  filteredAll = all;
  resultsMeta.textContent = all.length + ' fonts';

  all.slice(0, visibleCount).forEach(f => {
    loadGoogleFont(f.name);
    gridAll.appendChild(makeCard(f));
  });

  btnMore.style.display = all.length > visibleCount ? '' : 'none';
}

// ── RENDER: COMPANY PICKS ─────────────────────────────────────
function renderPicks() {
  gridPicks.innerHTML = '';
  const names  = CONFIG.companyFavourites || [];
  const picked = names.map(n => FONTS.find(f => f.name === n)).filter(Boolean);
  picked.forEach(f => { loadGoogleFont(f.name); gridPicks.appendChild(makeCard(f)); });
}

// ── RENDER: GOOGLE TOP ────────────────────────────────────────
function renderGoogleTop() {
  gridGoogle.innerHTML = '';
  // Top 24 by popularity rank (index 0 = most popular)
  FONTS.slice(0, 24).forEach(f => { loadGoogleFont(f.name); gridGoogle.appendChild(makeCard(f)); });
}

// ── UPDATE ALL PREVIEWS ───────────────────────────────────────
function updateAllPreviews() {
  const name  = getName();
  const title = getTitle();
  const fs    = calcFontSize(name);

  document.querySelectorAll('.font-card').forEach(card => {
    const fn = card.dataset.font;

    // CSS mode
    const n = card.querySelector('.prev-name');
    const t = card.querySelector('.prev-pos');
    if (n) { n.textContent = name; n.style.fontSize = fs + 'px'; }
    if (t) t.textContent = title;

    // Image mode overlay
    const overlay = card.querySelector('.nametag-text-overlay');
    if (overlay) {
      const cfg = CONFIG.nametagImage;
      const on  = overlay.querySelector('.prev-name');
      const ot  = overlay.querySelector('.prev-pos');
      if (on) { on.textContent = name; on.style.fontSize = fs + 'px'; on.style.color = cfg.nameColor; }
      if (ot) { ot.textContent = title; ot.style.color = cfg.titleColor; }
    }
  });

  updateResultBar();
}

// ── SEND ──────────────────────────────────────────────────────
function buildSummary() {
  return [
    'Name Tag Font Request',
    '──────────────────────',
    'Name:  ' + getName(),
    'Title: ' + getTitle(),
    'Font:  ' + (selectedFont || '—'),
  ].join('\n');
}

function openModal() {
  const name = getName();
  const fs   = calcFontSize(name);
  const cfg  = CONFIG.nametagImage;

  // Modal nametag preview
  const mn = document.getElementById('modal-nametag');
  if (CONFIG.nametagMode === 'image') {
    const ar = cfg.aspectRatio || 1.59;
    mn.innerHTML = `
      <div class="nametag-preview nametag-image-mode" style="padding-top:${(1/ar*100).toFixed(2)}%;max-width:320px;margin:0 auto">
        <img class="nametag-bg-img" src="${cfg.file}" alt="Name tag">
        <div class="nametag-text-overlay" style="top:${cfg.textArea.top};left:${cfg.textArea.left};width:${cfg.textArea.width}">
          <span class="prev-name" style="font-family:'${selectedFont}',sans-serif;font-size:${fs+2}px;color:${cfg.nameColor}">${name}</span>
          <span class="prev-pos" style="color:${cfg.titleColor}">${getTitle()}</span>
        </div>
      </div>`;
  } else {
    const nameEl  = document.getElementById('modal-name-preview');
    const titleEl = document.getElementById('modal-title-preview');
    if (nameEl) {
      nameEl.textContent      = name;
      nameEl.style.fontFamily = `'${selectedFont}', sans-serif`;
      nameEl.style.fontSize   = (fs + 4) + 'px';
    }
    if (titleEl) titleEl.textContent = getTitle();
  }

  document.getElementById('modal-details').innerHTML = `
    <div class="detail-row"><span>Name</span><strong>${name}</strong></div>
    <div class="detail-row"><span>Title</span><strong>${getTitle()}</strong></div>
    <div class="detail-row"><span>Font</span><strong style="font-family:'${selectedFont}',sans-serif">${selectedFont}</strong></div>
  `;

  const subject = encodeURIComponent('Name Tag Request — ' + name);
  const body    = encodeURIComponent(buildSummary());
  document.getElementById('btn-mailto').href = `mailto:${CONFIG.recipientEmail}?subject=${subject}&body=${body}`;
  modal.style.display = 'flex';
}

// ── EVENTS ────────────────────────────────────────────────────
btnSend.addEventListener('click', openModal);
document.getElementById('modal-close').addEventListener('click', () => modal.style.display = 'none');
modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

document.getElementById('btn-clipboard').addEventListener('click', () => {
  navigator.clipboard.writeText(buildSummary()).then(() => {
    const btn  = document.getElementById('btn-clipboard');
    const orig = btn.innerHTML;
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

inpName.addEventListener('input',  updateAllPreviews);
inpTitle.addEventListener('input', updateAllPreviews);

searchInput.addEventListener('input', e => {
  searchQuery  = e.target.value.toLowerCase().trim();
  visibleCount = PAGE_SIZE;
  renderAllTab();
});

document.getElementById('cat-chips').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  activeCat    = chip.dataset.cat;
  visibleCount = PAGE_SIZE;
  renderAllTab();
});

btnMore.addEventListener('click', () => {
  const current = gridAll.children.length;
  filteredAll.slice(current, current + PAGE_SIZE).forEach(f => {
    loadGoogleFont(f.name);
    gridAll.appendChild(makeCard(f));
  });
  visibleCount += PAGE_SIZE;
  if (filteredAll.length <= gridAll.children.length) btnMore.style.display = 'none';
});

document.querySelector('.tabs').addEventListener('click', e => {
  const tab = e.target.closest('.tab');
  if (!tab) return;
  switchTab(tab.dataset.tab);
});

// ── INIT ──────────────────────────────────────────────────────
function init() {
  const loadingScreen = document.getElementById('loading-screen');
  const errorScreen   = document.getElementById('error-screen');

  if (typeof FONTS === 'undefined' || !Array.isArray(FONTS) || !FONTS.length) {
    loadingScreen.style.display = 'none';
    errorScreen.style.display   = '';
    document.getElementById('error-message').textContent =
      'fonts-data.js not found. Run: node generate-fonts.js YOUR_API_KEY';
    return;
  }

  // Preload company picks immediately
  (CONFIG.companyFavourites || []).forEach(loadGoogleFont);

  loadingScreen.style.display = 'none';
  renderAllTab();
  updateResultBar();
}

init();
