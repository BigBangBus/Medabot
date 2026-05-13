/* =========================================================
   Medabot — App shell: navigation + state + dynamic rendering
   (architecture ported from lowfi prototype, adapted to highfi)
   ========================================================= */

let cur = 'welcome';
const navStack = [];

/* ---- Navigation ----------------------------------------- */
function go(id, dir = 'r', isBack = false, options = {}) {
  if (id === cur) return;
  const from = document.getElementById(cur);
  const to   = document.getElementById(id);
  if (!from || !to) {
    console.warn('go: missing screen', id);
    return;
  }
  if (!isBack && navStack[navStack.length - 1] !== cur) {
    navStack.push(cur);
  }
  from.classList.remove('active', 'slide-in-r', 'slide-in-l');
  to.classList.remove('slide-in-r', 'slide-in-l');
  // force reflow so animation restarts
  void to.offsetWidth;
  to.classList.add('active', dir === 'r' ? 'slide-in-r' : 'slide-in-l');
  cur = id;

  // Optional flags
  if (options.guest !== undefined) STATE.guestMode = options.guest;

  // Lifecycle hooks
  if (typeof onEnter[id] === 'function') onEnter[id]();

  // Sync URL hash so refresh lands on the same screen
  if (location.hash.slice(1) !== id) {
    history.replaceState(null, '', '#' + id);
  }
}

function goBack(dir = 'l') {
  const prev = navStack.pop();
  if (prev) go(prev, dir, true);
  else go('welcome', dir, true);
}

/* ---- Screen lifecycle hooks (called when navigating into a screen) */
const onEnter = {
  dashboard() {
    renderDashboardMeds();
    const greet = document.getElementById('dash-greet-name');
    if (greet) {
      const p = getProfile();
      greet.firstChild.nodeValue = p.greeting + ' ';
    }
  },
  arquivo() { /* renderArquivoMeds(); — phase 2 */ },
  alertas() { /* renderAlerts(); — phase 2 */ },
  search()  { /* — phase 2 */ },
  chat()    { /* setup chat sim — phase 2 */ },
  'med-detail'() {
    // Populate header from the medication user just clicked (we store it on a data attribute)
    const md = document.getElementById('med-detail');
    const medId = md && md.dataset.medId;
    const meds = getMeds();
    const med = meds.find(m => m.id === medId) || meds[0];
    if (med) {
      const name = document.getElementById('md-name');
      const meta = document.getElementById('md-meta');
      if (name) name.textContent = med.name.split(' ')[0];
      if (meta) meta.textContent = (med.name.match(/\b\d+(\.\d+)?\s*\w+\b/) || [''])[0] + ' | ' + formLabel(med.form);
    }
  }
};

/* ---- Dashboard medication cards ------------------------- */
function renderDashboardMeds() {
  const wrap = document.getElementById('dash-meds');
  if (!wrap) return;
  const meds = getMeds();
  wrap.innerHTML = meds.map(m => {
    const completed = m.dosesToday >= m.dosesTotal;
    const ratio = `${m.dosesToday}/${m.dosesTotal}`;
    const pct   = Math.min(100, (m.dosesToday / m.dosesTotal) * 100);
    const ring = completed
      ? `<svg viewBox="0 0 40 40">
           <circle cx="20" cy="20" r="16" fill="var(--c-primary)"/>
           <path d="M14 20 l4 4 l8-9" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
         </svg>`
      : `<svg viewBox="0 0 40 40">
           <circle cx="20" cy="20" r="16" fill="none" stroke="#E0E0E0" stroke-width="3"/>
           <circle cx="20" cy="20" r="16" fill="none" stroke="var(--c-primary)" stroke-width="3"
                   stroke-dasharray="${(pct/100) * 100.5} 100.5" stroke-linecap="round" transform="rotate(-90 20 20)"/>
           <circle cx="20" cy="20" r="4" fill="var(--c-primary)"/>
         </svg>`;
    return `
      <article class="dose-progress${completed ? ' complete' : ''}" onclick="openMed('${m.id}')">
        <div class="top">
          <div class="pill-ico"><img src="assets/Pill-aspirine-3.png" alt="" class="pill-photo"></div>
          <div style="flex:1;min-width:0">
            <div class="name">${m.name}</div>
            <div class="form">${formLabel(m.form)}</div>
          </div>
          <div class="ring">${ring}</div>
        </div>
        <div class="meta-row"><span>Doses of the day</span><span>${completed ? 'Completed' : ratio}</span></div>
        <div class="bar"><span style="width:${pct}%"></span></div>
      </article>
    `;
  }).join('');
}

function openMed(id) {
  const md = document.getElementById('med-detail');
  if (md) md.dataset.medId = id;
  go('med-detail', 'r');
}

/* ---- Boot ----------------------------------------------- */
function boot() {
  // Run onEnter hook for initial screen
  const initialHash = location.hash.slice(1);
  if (initialHash && document.getElementById(initialHash)) {
    // direct-land on the hash screen
    const initial = document.getElementById(cur);
    if (initial) initial.classList.remove('active');
    cur = initialHash;
    const target = document.getElementById(cur);
    if (target) target.classList.add('active');
  }
  if (typeof onEnter[cur] === 'function') onEnter[cur]();
}

// Run boot once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

// Expose for inline handlers
window.go = go;
window.goBack = goBack;
window.openMed = openMed;
