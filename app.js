/* ==========================================================
   سراج - app.js (Compatible 100% مع index.html + style.css)
   - بدون مكتبات
   - LocalStorage only
   - Coins + Store + Subjects + Timer + Notebooks (3D) + Error books
   - Import / Export كامل
   ========================================================== */

(() => {
  "use strict";

  /* =========================
     Helpers
     ========================= */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
  const nowISO = () => new Date().toISOString();
  const todayKey = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
  };
  const safeJSON = (str, fallback = null) => {
    try { return JSON.parse(str); } catch { return fallback; }
  };

  function toast(msg) {
    let el = $(".siraj-toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "siraj-toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 2200);
  }

  function formatMin(m) {
    const mm = Math.max(0, Math.round(m));
    return `${mm}د`;
  }

  function minutesToCoins(mins) {
    // 0.2 coin per minute focus
    return mins * 0.2;
  }

  function round1(n) {
    return Math.round(n * 10) / 10;
  }

  function round0(n) {
    return Math.round(n);
  }

  function playBeep() {
    // small web-audio beep (no external file)
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.value = 0.0001;
      o.connect(g); g.connect(ctx.destination);
      o.start();
      const t = ctx.currentTime;
      g.gain.exponentialRampToValueAtTime(0.08, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
      o.stop(t + 0.27);
      setTimeout(() => ctx.close && ctx.close(), 400);
    } catch {}
  }

  /* =========================
     Storage
     ========================= */
  const LS_KEY = "siraj_state_v2";

  /* =========================
     Store catalog (internal)
     - لا يعتمد على HTML إضافي
     ========================= */
  const CATALOG = {
    wallpapers: [
      { id: "wp_01", name: "سماوي بنفسجي", css: "linear-gradient(135deg,#0ea5e9,#a855f7,#22c55e)", price: 0, free: true },
      { id: "wp_02", name: "ليل أزرق", css: "linear-gradient(135deg,#0b1020,#1d2b64,#f8cdda)", price: 0, free: true },
      { id: "wp_03", name: "نيازك", css: "linear-gradient(135deg,#111b35,#7c5cff,#22d3ee)", price: 0, free: true },

      { id: "wp_04", name: "غروب", css: "linear-gradient(135deg,#fb7185,#f59e0b,#22d3ee)", price: 80 },
      { id: "wp_05", name: "مجرة", css: "radial-gradient(900px 500px at 30% 20%, rgba(124,92,255,.42), transparent 55%), linear-gradient(135deg,#0b1020,#111b35)", price: 80 },
      { id: "wp_06", name: "نعناع", css: "linear-gradient(135deg,#22c55e,#22d3ee,#7c5cff)", price: 80 },
      { id: "wp_07", name: "رمادي أنيق", css: "linear-gradient(135deg,#0f172a,#1f2937,#111827)", price: 80 },
      { id: "wp_08", name: "كرز", css: "linear-gradient(135deg,#be123c,#fb7185,#7c5cff)", price: 80 },
      { id: "wp_09", name: "بحر", css: "linear-gradient(135deg,#0ea5e9,#22d3ee,#0b1020)", price: 80 },
      { id: "wp_10", name: "ذهب", css: "linear-gradient(135deg,#f59e0b,#fde68a,#7c5cff)", price: 80 },
    ],
    timerSkins: (() => {
      // 20 skins paid 60 coins - cannot activate unless owned
      const names = [
        ["ts_ring", "Ring"],
        ["ts_3d_cube", "3D Cube"],
        ["ts_neon", "Neon"],
        ["ts_holo", "Holo"],
        ["ts_dual_ring", "Dual Ring"],
        ["ts_bar", "Bar"],
        ["ts_glass", "Glass"],
        ["ts_pulse", "Pulse"],
        ["ts_arc", "Arc"],
        ["ts_orbit", "Orbit"],
        ["ts_prism", "Prism"],
        ["ts_wave", "Wave"],
        ["ts_spark", "Spark"],
        ["ts_dots", "Dots"],
        ["ts_sun", "Sun"],
        ["ts_moon", "Moon"],
        ["ts_grid", "Grid"],
        ["ts_metal", "Metal"],
        ["ts_frost", "Frost"],
        ["ts_zen", "Zen"],
      ];
      return names.map(([id, n]) => ({ id, name: n, price: 60 }));
    })(),
    notebookCovers: [
      { id: "nbc_01", name: "بنفسجي", css: "linear-gradient(135deg,#7c5cff,#22d3ee)", price: 0, free: true },
      { id: "nbc_02", name: "أخضر", css: "linear-gradient(135deg,#22c55e,#0ea5e9)", price: 0, free: true },
      { id: "nbc_03", name: "وردي", css: "linear-gradient(135deg,#fb7185,#a855f7)", price: 0, free: true },

      { id: "nbc_04", name: "كحلي", css: "linear-gradient(135deg,#0b1020,#1d2b64)", price: 55 },
      { id: "nbc_05", name: "ذهبي", css: "linear-gradient(135deg,#f59e0b,#fde68a)", price: 55 },
      { id: "nbc_06", name: "ثلجي", css: "linear-gradient(135deg,#22d3ee,#eef2ff)", price: 55 },
      { id: "nbc_07", name: "فحمي", css: "linear-gradient(135deg,#0f172a,#111827)", price: 55 },
      { id: "nbc_08", name: "نعناع", css: "linear-gradient(135deg,#22c55e,#a7f3d0)", price: 55 },
      { id: "nbc_09", name: "بنفسجي عميق", css: "linear-gradient(135deg,#4c1d95,#7c3aed)", price: 55 },
      { id: "nbc_10", name: "سماوي داكن", css: "linear-gradient(135deg,#0ea5e9,#0b1020)", price: 55 },
    ],
    errorBookCovers: [
      { id: "ebc_01", name: "تحسين", css: "linear-gradient(135deg,#7c5cff,#22c55e)", price: 0, free: true },
      { id: "ebc_02", name: "مراجعة", css: "linear-gradient(135deg,#22d3ee,#a855f7)", price: 0, free: true },
      { id: "ebc_03", name: "تصحيح", css: "linear-gradient(135deg,#fb7185,#f59e0b)", price: 0, free: true },

      { id: "ebc_04", name: "ليل", css: "linear-gradient(135deg,#0b1020,#111b35)", price: 55 },
      { id: "ebc_05", name: "بحر", css: "linear-gradient(135deg,#0ea5e9,#22d3ee)", price: 55 },
      { id: "ebc_06", name: "ورق", css: "linear-gradient(135deg,#eef2ff,#aab3d6)", price: 55 },
      { id: "ebc_07", name: "فحم", css: "linear-gradient(135deg,#111827,#0f172a)", price: 55 },
      { id: "ebc_08", name: "أخضر", css: "linear-gradient(135deg,#22c55e,#14532d)", price: 55 },
      { id: "ebc_09", name: "بنفسجي", css: "linear-gradient(135deg,#a855f7,#7c5cff)", price: 55 },
      { id: "ebc_10", name: "ثلجي", css: "linear-gradient(135deg,#22d3ee,#eef2ff)", price: 55 },
    ],
  };

  /* =========================
     Default state
     ========================= */
  function defaultState() {
    const t = todayKey();
    // first 3 wallpapers + first 3 notebook covers + first 3 error covers are owned
    const ownedWallpapers = Object.fromEntries(CATALOG.wallpapers.map((w, i) => [w.id, i < 3 ? true : false]));
    const ownedNotebookCovers = Object.fromEntries(CATALOG.notebookCovers.map((c, i) => [c.id, i < 3 ? true : false]));
    const ownedErrorCovers = Object.fromEntries(CATALOG.errorBookCovers.map((c, i) => [c.id, i < 3 ? true : false]));
    const ownedTimerSkins = Object.fromEntries(CATALOG.timerSkins.map((s) => [s.id, false])); // none owned initially

    return {
      version: 2,
      createdAt: nowISO(),
      coins: 240,
      prefs: {
        fxEnabled: true,
        tiltEnabled: true,
        tiltSensitivity: 10,
        reduceMotion: false,
        soundEnabled: true,
      },
      store: {
        wallpapers: { owned: ownedWallpapers, active: "wp_01" },
        timers: { owned: ownedTimerSkins, active: "none" }, // data-skin on #timer-stage
        notebookCovers: { owned: ownedNotebookCovers },
        errorBookCovers: { owned: ownedErrorCovers },
      },
      ui: {
        activeTab: "tab-home",
        activeSubjectId: null,
        openNotebookId: null,
      },
      subjects: [], // up to 8
      // notebooks (general study notebooks) + error books (multi)
      notebooks: [], // {id,title,coverId,pages:[{id,txt,ts}]}
      errorBooks: [], // {id,title,coverId,errors:[{id,text,ts,fixed,fixedAt}]}
      stats: {
        total: {
          sessions: 0,
          focusMin: 0,
          breakMin: 0,
          tasksDone: 0,
          tasksTotal: 0,
          fixes: 0,
          coinsEarned: 0,
          coinsSpent: 0,
        },
        daily: {
          // [YYYY-MM-DD]: {sessions, focusMin, breakMin, tasksDone, tasksTotal, fixes, coinsEarned}
        }
      },
      today: {
        key: t,
        // daily resets: tasks baseline per subject (we count tasks due "daily" tasks list per subject)
        // no server - just computed
      },
      timer: {
        running: false,
        mode: "FOCUS", // FOCUS/BREAK
        // duration (per active subject if exists, else default)
        startTs: null,
        remainingSec: 25 * 60,
        lastTickTs: null,
      },
      quickNotes: {
        // by subjectId: {text, updatedAt}
      }
    };
  }

  function loadState() {
    const raw = localStorage.getItem(LS_KEY);
    const s = raw ? safeJSON(raw, null) : null;
    if (!s || typeof s !== "object") return defaultState();

    // basic migrations / patching
    const d = defaultState();
    const merged = deepMerge(d, s);
    // ensure today key exists
    merged.today = merged.today || { key: todayKey() };
    merged.today.key = merged.today.key || todayKey();

    // if day changed, keep stats daily map but update today key
    if (merged.today.key !== todayKey()) {
      merged.today.key = todayKey();
    }
    // cap subjects
    if (Array.isArray(merged.subjects) && merged.subjects.length > 8) merged.subjects = merged.subjects.slice(0, 8);

    return merged;
  }

  function saveState() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch (e) {
      console.error(e);
      toast("تعذّر الحفظ. مساحة التخزين ممتلئة؟");
    }
  }

  function deepMerge(base, extra) {
    if (Array.isArray(base)) return Array.isArray(extra) ? extra : base;
    if (base && typeof base === "object") {
      const out = { ...base };
      if (extra && typeof extra === "object") {
        for (const k of Object.keys(extra)) {
          if (k in base) out[k] = deepMerge(base[k], extra[k]);
          else out[k] = extra[k];
        }
      }
      return out;
    }
    return (extra === undefined ? base : extra);
  }

  let state = loadState();

  /* =========================
     Daily stats helpers
     ========================= */
  function ensureDaily() {
    const k = todayKey();
    if (!state.stats.daily[k]) {
      state.stats.daily[k] = {
        sessions: 0,
        focusMin: 0,
        breakMin: 0,
        tasksDone: 0,
        tasksTotal: 0,
        fixes: 0,
        coinsEarned: 0,
      };
    }
    return state.stats.daily[k];
  }

  function bumpCoins(delta, reason = "") {
    state.coins = Math.max(0, round1(state.coins + delta));
    if (delta > 0) {
      state.stats.total.coinsEarned = round1(state.stats.total.coinsEarned + delta);
      ensureDaily().coinsEarned = round1(ensureDaily().coinsEarned + delta);
    } else if (delta < 0) {
      state.stats.total.coinsSpent = round1(state.stats.total.coinsSpent + Math.abs(delta));
    }
    saveState();
    renderCoins();
    if (reason) toast(reason);
  }

  /* =========================
     DOM refs
     ========================= */
  const els = {
    // topbar
    coinBalance: $("#coin-balance"),
    exportBtn: $("#btn-export"),
    importFile: $("#import-file"),
    importBtn: $("#btn-import"),

    // nav / tabs
    navBtns: $$(".navBtn"),
    tabs: $$(".tab"),

    // home
    kpiSessions: $("#kpi-sessions"),
    kpiTodayFocus: $("#kpi-today-focus"),
    kpiTodayTasks: $("#kpi-today-tasks"),
    kpiFixes: $("#kpi-fixes"),
    progressVal: $("#progress-val"),
    progressFill: $("#progress-fill"),
    progressHint: $("#progress-hint"),
    homeGoSubjects: $("#home-go-subjects"),
    homeGoTimer: $("#home-go-timer"),
    homeGoStore: $("#home-go-store"),
    btnPickActive: $("#btn-pick-active"),
    activeSubjectName: $("#active-subject-name"),
    activeSubjectMeta: $("#active-subject-meta"),
    btnAddTaskQuick: $("#btn-add-task-quick"),
    homeTasks: $("#home-tasks"),
    homeResetToday: $("#home-reset-today"),
    homeOpenNotebooks: $("#home-open-notebooks"),

    // subjects
    btnAddSubject: $("#btn-add-subject"),
    btnOpenActiveFromList: $("#btn-open-active-from-list"),
    subjectsList: $("#subjects-list"),
    subjectEditor: $("#subject-editor"),
    subjectBadge: $("#subject-badge"),

    // timer
    timerPickActive: $("#timer-pick-active"),
    timerActiveLine: $("#timer-active-line"),
    timerStage: $("#timer-stage"),
    timerMode: $("#timer-mode"),
    timerTime: $("#timer-time"),
    timerProg: $("#timer-prog"),
    timerToggle: $("#timer-toggle"),
    timerReset: $("#timer-reset"),
    timerSwitch: $("#timer-switch"),
    timerFocusMin: $("#timer-focus-min"),
    timerBreakMin: $("#timer-break-min"),
    timerSound: $("#timer-sound"),
    timerOpenStore: $("#timer-open-store"),
    timerNotes: $("#timer-notes"),
    notesSave: $("#notes-save"),
    notesClear: $("#notes-clear"),
    timerKpiSessions: $("#timer-kpi-sessions"),
    timerKpiFocus: $("#timer-kpi-focus"),
    timerKpiBreaks: $("#timer-kpi-breaks"),
    timerKpiCoins: $("#timer-kpi-coins"),

    // notebooks
    btnAddNotebook: $("#btn-add-notebook"),
    btnNotebookStore: $("#btn-notebook-store"),
    notebooksGrid: $("#notebooks-grid"),
    bookViewer: $("#book-viewer"),
    btnCloseNotebook: $("#btn-close-notebook"),

    // store
    storeWallpapers: $("#store-wallpapers"),
    storeTimers: $("#store-timers"),
    storeNotebookCovers: $("#store-notebook-covers"),
    storeErrorBooks: $("#store-error-books"),

    // stats
    overallStats: $("#overall-stats"),
    subjectsStats: $("#subjects-stats"),

    // settings
    fxToggle: $("#fx-toggle"),
    tiltToggle: $("#tilt-toggle"),
    tiltSensitivity: $("#tilt-sensitivity"),
    reduceMotion: $("#reduce-motion"),
    btnResetSoft: $("#btn-reset-soft"),
    btnResetHard: $("#btn-reset-hard"),

    // modal
    modal: $("#modal"),
    modalCard: $("#modal-card"),
    modalTitle: $("#modal-title"),
    modalBody: $("#modal-body"),
    modalClose: $("#modal-close"),

    // canvas fx
    fxCanvas: $("#fx"),
  };

  /* =========================
     Modal
     ========================= */
  function openModal(title, html) {
    els.modalTitle.textContent = title || "—";
    els.modalBody.innerHTML = html || "";
    els.modal.classList.remove("hidden");
  }
  function closeModal() {
    els.modal.classList.add("hidden");
    els.modalBody.innerHTML = "";
  }
  els.modalClose?.addEventListener("click", closeModal);
  els.modal?.addEventListener("click", (e) => {
    if (e.target === els.modal) closeModal();
  });

  /* =========================
     Tabs / Navigation
     ========================= */
  function setTab(tabId) {
    state.ui.activeTab = tabId;
    els.tabs.forEach(t => t.classList.toggle("active", t.id === tabId));
    els.navBtns.forEach(b => b.classList.toggle("active", b.dataset.tab === tabId));
    saveState();
    // on enter: render-specific
    if (tabId === "tab-home") renderHome();
    if (tabId === "tab-subjects") renderSubjects();
    if (tabId === "tab-timer") renderTimerUI();
    if (tabId === "tab-notebooks") renderNotebooks();
    if (tabId === "tab-store") renderStore();
    if (tabId === "tab-stats") renderStats();
    if (tabId === "tab-settings") renderSettings();
  }

  els.navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const t = btn.dataset.tab;
      if (t) setTab(t);
    });
  });

  // quick nav buttons in home
  els.homeGoSubjects?.addEventListener("click", () => setTab("tab-subjects"));
  els.homeGoTimer?.addEventListener("click", () => setTab("tab-timer"));
  els.homeGoStore?.addEventListener("click", () => setTab("tab-store"));
  els.homeOpenNotebooks?.addEventListener("click", () => setTab("tab-notebooks"));

  /* =========================
     Theme apply (wallpaper + timer skin)
     ========================= */
  function applyWallpaper() {
    const id = state.store.wallpapers.active || "wp_01";
    const item = CATALOG.wallpapers.find(w => w.id === id) || CATALOG.wallpapers[0];
    document.documentElement.style.setProperty("--siraj-wallpaper", item.css);
  }
  function applyTimerSkin() {
    const skin = state.store.timers.active || "none";
    if (els.timerStage) els.timerStage.setAttribute("data-skin", skin);
  }

  /* =========================
     Coins UI
     ========================= */
  function renderCoins() {
    if (els.coinBalance) els.coinBalance.textContent = String(round1(state.coins));
  }

  /* =========================
     Subjects + Tasks
     Each subject:
       {id,name,createdAt,taskTemplates:[{id,text,active}], dailyTasks: {dateKey: [{id,text,done,doneAt}]},
        timer: {focusMin, breakMin},
        stats: {sessions, focusMin, breakMin, tasksDone, tasksTotal}
       }
     ========================= */
  function subjectById(id) {
    return state.subjects.find(s => s.id === id) || null;
  }
  function getActiveSubject() {
    const s = subjectById(state.ui.activeSubjectId);
    return s || null;
  }

  function ensureSubjectDailyTasks(subject, dateK) {
    subject.dailyTasks = subject.dailyTasks || {};
    if (!subject.dailyTasks[dateK]) {
      const tasks = (subject.taskTemplates || [])
        .filter(t => t.active !== false)
        .map(t => ({ id: uid(), text: t.text, done: false, doneAt: null }));
      subject.dailyTasks[dateK] = tasks;
    }
    return subject.dailyTasks[dateK];
  }

  function computeTodayTasks() {
    const dk = todayKey();
    let total = 0;
    let done = 0;
    state.subjects.forEach(s => {
      const list = ensureSubjectDailyTasks(s, dk);
      total += list.length;
      done += list.filter(x => x.done).length;
    });
    return { total, done };
  }

  function updateProgressBar() {
    const { total, done } = computeTodayTasks();
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    if (els.progressVal) els.progressVal.textContent = `${pct}%`;
    if (els.progressFill) els.progressFill.style.width = `${pct}%`;
    if (els.progressHint) {
      els.progressHint.textContent = total === 0
        ? "ابدأ بإضافة مادة ومهامها اليومية."
        : (done === total ? "ممتاز! أنهيت مهام اليوم." : "كمّل! اقتربت من هدفك اليومي.");
    }
    // KPI today tasks
    if (els.kpiTodayTasks) els.kpiTodayTasks.textContent = `${done}/${total}`;
    // keep daily stats counts for info
    ensureDaily().tasksDone = done;
    ensureDaily().tasksTotal = total;
    state.stats.total.tasksDone = (state.stats.total.tasksDone || 0); // cumulative already updated on completion
    state.stats.total.tasksTotal = (state.stats.total.tasksTotal || 0);
    saveState();
  }

  function setActiveSubject(id) {
    state.ui.activeSubjectId = id;
    saveState();
    renderHome();
    renderSubjects();
    renderTimerUI();
    toast("تم تفعيل المادة.");
  }

  function addSubjectFlow() {
    openModal("إضافة مادة", `
      <div class="row" style="margin-top:8px">
        <label class="field" style="flex:1">
          <span>اسم المادة</span>
          <input id="m-subject-name" type="text" placeholder="مثال: رياضيات" />
        </label>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn primary" id="m-create-subject">إضافة</button>
        <button class="btn ghost" id="m-cancel">إلغاء</button>
      </div>
    `);

    $("#m-cancel")?.addEventListener("click", closeModal);
    $("#m-create-subject")?.addEventListener("click", () => {
      const name = ($("#m-subject-name")?.value || "").trim();
      if (!name) return toast("اكتب اسم المادة.");
      if (state.subjects.length >= 8) return toast("وصلت للحد الأقصى (8 مواد).");

      const s = {
        id: uid(),
        name,
        createdAt: nowISO(),
        taskTemplates: [],
        dailyTasks: {},
        timer: { focusMin: 25, breakMin: 5 },
        stats: { sessions: 0, focusMin: 0, breakMin: 0, tasksDone: 0, tasksTotal: 0 }
      };
      state.subjects.push(s);
      if (!state.ui.activeSubjectId) state.ui.activeSubjectId = s.id;
      saveState();
      closeModal();
      renderSubjects();
      renderHome();
      toast("تمت إضافة المادة.");
    });
  }

  function renderSubjectsList() {
    if (!els.subjectsList) return;
    els.subjectsList.innerHTML = "";
    if (state.subjects.length === 0) {
      const div = document.createElement("div");
      div.className = "emptyState";
      div.textContent = "لا توجد مواد بعد. اضغط (إضافة مادة).";
      els.subjectsList.appendChild(div);
      return;
    }

    state.subjects.forEach(s => {
      const item = document.createElement("div");
      item.className = "subject-item";
      item.dataset.id = s.id;

      const left = document.createElement("div");
      left.innerHTML = `
        <div class="subject-title">${escapeHTML(s.name)}</div>
        <div class="subject-meta">جلسات: ${s.stats?.sessions || 0} • تركيز: ${formatMin(s.stats?.focusMin || 0)}</div>
      `;

      const btnOpen = document.createElement("button");
      btnOpen.className = "btn tiny";
      btnOpen.textContent = "فتح";
      btnOpen.addEventListener("click", () => openSubjectEditor(s.id));

      const btnActive = document.createElement("button");
      btnActive.className = "btn tiny primary";
      btnActive.textContent = (state.ui.activeSubjectId === s.id) ? "مفعّلة" : "تفعيل";
      btnActive.addEventListener("click", () => setActiveSubject(s.id));

      item.appendChild(left);
      item.appendChild(btnOpen);
      item.appendChild(btnActive);
      els.subjectsList.appendChild(item);
    });
  }

  function openSubjectEditor(subjectId) {
    const s = subjectById(subjectId);
    if (!s || !els.subjectEditor) return;
    state.ui.lastSubjectEditorId = subjectId;
    saveState();

    // badge
    if (els.subjectBadge) els.subjectBadge.textContent = s.name;

    const dk = todayKey();
    const todayTasks = ensureSubjectDailyTasks(s, dk);

    els.subjectEditor.innerHTML = `
      <div class="row between" style="margin-bottom:8px">
        <h3>المهام اليومية (قوالب)</h3>
        <button class="btn tiny primary" id="sub-add-template">إضافة مهمة</button>
      </div>

      <div id="sub-templates" class="tasks"></div>

      <div class="divider"></div>

      <div class="row between" style="margin-bottom:8px">
        <h3>مهام اليوم (${dk})</h3>
        <button class="btn tiny" id="sub-regenerate-today">تحديث من القوالب</button>
      </div>
      <div id="sub-today" class="tasks"></div>

      <div class="divider"></div>

      <div class="row" style="align-items:flex-end">
        <label class="field" style="flex:1">
          <span>Focus (دقيقة)</span>
          <input type="number" id="sub-focus" min="1" max="180" value="${s.timer?.focusMin ?? 25}">
        </label>
        <label class="field" style="flex:1">
          <span>Break (دقيقة)</span>
          <input type="number" id="sub-break" min="1" max="60" value="${s.timer?.breakMin ?? 5}">
        </label>
        <button class="btn" id="sub-save-timer">حفظ مؤقت المادة</button>
      </div>

      <div class="divider"></div>

      <div class="row between">
        <div>
          <h3>إحصائيات المادة</h3>
          <div class="muted" style="font-size:12px; margin-top:4px">
            جلسات: ${s.stats?.sessions || 0} • تركيز: ${formatMin(s.stats?.focusMin || 0)} • استراحات: ${formatMin(s.stats?.breakMin || 0)}
          </div>
        </div>
        <button class="btn danger" id="sub-delete">حذف المادة</button>
      </div>
    `;

    // render templates + today tasks
    renderSubjectTemplates(s);
    renderSubjectTodayTasks(s);

    $("#sub-add-template")?.addEventListener("click", () => addTemplateFlow(s.id));
    $("#sub-regenerate-today")?.addEventListener("click", () => {
      // regenerate today's list from templates (keeps done tasks if same text? simpler: overwrite if none done)
      const list = ensureSubjectDailyTasks(s, dk);
      const hasAnyDone = list.some(t => t.done);
      if (hasAnyDone) {
        toast("يوجد مهام مكتملة اليوم. لن يتم الاستبدال.");
        return;
      }
      s.dailyTasks[dk] = (s.taskTemplates || []).filter(t => t.active !== false).map(t => ({
        id: uid(), text: t.text, done: false, doneAt: null
      }));
      saveState();
      renderSubjectTodayTasks(s);
      renderHome();
      toast("تم تحديث مهام اليوم.");
    });

    $("#sub-save-timer")?.addEventListener("click", () => {
      const f = clamp(parseInt($("#sub-focus")?.value || "25", 10) || 25, 1, 180);
      const b = clamp(parseInt($("#sub-break")?.value || "5", 10) || 5, 1, 60);
      s.timer = { focusMin: f, breakMin: b };
      saveState();
      renderTimerUI();
      toast("تم حفظ مؤقت المادة.");
    });

    $("#sub-delete")?.addEventListener("click", () => {
      openModal("تأكيد الحذف", `
        <p class="p">هل أنت متأكد من حذف مادة: <b>${escapeHTML(s.name)}</b>؟</p>
        <div class="row" style="margin-top:12px">
          <button class="btn danger" id="m-del-yes">حذف</button>
          <button class="btn ghost" id="m-del-no">إلغاء</button>
        </div>
      `);
      $("#m-del-no")?.addEventListener("click", closeModal);
      $("#m-del-yes")?.addEventListener("click", () => {
        // stop timer if on this subject
        if (state.ui.activeSubjectId === s.id) state.ui.activeSubjectId = null;
        state.subjects = state.subjects.filter(x => x.id !== s.id);
        if (!state.ui.activeSubjectId && state.subjects[0]) state.ui.activeSubjectId = state.subjects[0].id;
        saveState();
        closeModal();
        renderSubjects();
        renderHome();
        renderTimerUI();
        toast("تم حذف المادة.");
      });
    });
  }

  function renderSubjectTemplates(subject) {
    const box = $("#sub-templates");
    if (!box) return;
    box.innerHTML = "";
    const arr = subject.taskTemplates || [];
    if (arr.length === 0) {
      const e = document.createElement("div");
      e.className = "emptyState";
      e.textContent = "لا توجد مهام يومية. أضف قوالب مهام لتظهر كل يوم.";
      box.appendChild(e);
      return;
    }
    arr.forEach(t => {
      const row = document.createElement("div");
      row.className = "task-row";
      row.dataset.done = "0";
      row.innerHTML = `
        <button class="task-check" title="تفعيل/تعطيل">${t.active === false ? "—" : "✓"}</button>
        <div class="task-text">${escapeHTML(t.text)}</div>
        <button class="btn tiny" title="تعديل">تعديل</button>
        <button class="btn tiny danger" title="حذف">حذف</button>
      `;
      const [btnToggle, , btnEdit, btnDel] = row.children;
      btnToggle.addEventListener("click", () => {
        t.active = (t.active === false) ? true : false;
        saveState();
        renderSubjectTemplates(subject);
        toast(t.active ? "تم تفعيل المهمة." : "تم تعطيل المهمة.");
      });
      btnEdit.addEventListener("click", () => editTemplateFlow(subject.id, t.id));
      btnDel.addEventListener("click", () => {
        subject.taskTemplates = subject.taskTemplates.filter(x => x.id !== t.id);
        saveState();
        renderSubjectTemplates(subject);
        toast("تم حذف المهمة.");
      });
      box.appendChild(row);
    });
  }

  function renderSubjectTodayTasks(subject) {
    const box = $("#sub-today");
    if (!box) return;
    box.innerHTML = "";
    const dk = todayKey();
    const list = ensureSubjectDailyTasks(subject, dk);
    if (list.length === 0) {
      const e = document.createElement("div");
      e.className = "emptyState";
      e.textContent = "لا توجد مهام اليوم لهذه المادة. أضف قوالب ثم حدث.";
      box.appendChild(e);
      return;
    }

    list.forEach(task => {
      const row = document.createElement("div");
      row.className = "task-row";
      row.dataset.done = task.done ? "1" : "0";
      row.innerHTML = `
        <button class="task-check">${task.done ? "✓" : ""}</button>
        <div class="task-text">${escapeHTML(task.text)}</div>
        <button class="btn tiny ghost">حذف</button>
      `;
      const btnCheck = row.querySelector(".task-check");
      const btnDel = row.querySelector(".btn.tiny.ghost");
      btnCheck.addEventListener("click", () => toggleTodayTask(subject.id, task.id, row));
      btnDel.addEventListener("click", () => {
        subject.dailyTasks[dk] = subject.dailyTasks[dk].filter(x => x.id !== task.id);
        saveState();
        renderSubjectTodayTasks(subject);
        renderHome();
        toast("تم حذف مهمة اليوم.");
      });
      box.appendChild(row);
    });
  }

  function toggleTodayTask(subjectId, taskId, rowEl) {
    const s = subjectById(subjectId);
    if (!s) return;
    const dk = todayKey();
    const list = ensureSubjectDailyTasks(s, dk);
    const t = list.find(x => x.id === taskId);
    if (!t) return;

    const wasDone = !!t.done;
    t.done = !t.done;
    t.doneAt = t.done ? nowISO() : null;

    rowEl.dataset.done = t.done ? "1" : "0";
    const btn = rowEl.querySelector(".task-check");
    if (btn) btn.textContent = t.done ? "✓" : "";

    // if completed -> +6 coins, animate
    if (!wasDone && t.done) {
      rowEl.classList.add("done-pop");
      setTimeout(() => rowEl.classList.remove("done-pop"), 650);

      bumpCoins(6, "+6 كوينز لإنهاء مهمة");
      state.stats.total.tasksDone += 1;
      ensureDaily().tasksDone += 1;
      s.stats.tasksDone = (s.stats.tasksDone || 0) + 1;
    }
    // total tasks cumulative: add when created? We'll count templates as daily; keep simple on completion only
    saveState();
    renderHome();
    updateProgressBar();
  }

  function addTemplateFlow(subjectId) {
    const s = subjectById(subjectId);
    if (!s) return;
    openModal("إضافة مهمة يومية", `
      <label class="field">
        <span>نص المهمة</span>
        <input id="m-task-text" type="text" placeholder="مثال: حل 20 سؤال" />
      </label>
      <div class="row" style="margin-top:12px">
        <button class="btn primary" id="m-task-add">إضافة</button>
        <button class="btn ghost" id="m-task-cancel">إلغاء</button>
      </div>
    `);
    $("#m-task-cancel")?.addEventListener("click", closeModal);
    $("#m-task-add")?.addEventListener("click", () => {
      const text = ($("#m-task-text")?.value || "").trim();
      if (!text) return toast("اكتب نص المهمة.");
      s.taskTemplates = s.taskTemplates || [];
      s.taskTemplates.push({ id: uid(), text, active: true });
      saveState();
      closeModal();
      renderSubjectTemplates(s);
      toast("تمت إضافة مهمة يومية.");
    });
  }

  function editTemplateFlow(subjectId, templateId) {
    const s = subjectById(subjectId);
    if (!s) return;
    const t = (s.taskTemplates || []).find(x => x.id === templateId);
    if (!t) return;

    openModal("تعديل المهمة", `
      <label class="field">
        <span>نص المهمة</span>
        <input id="m-task-text" type="text" value="${escapeAttr(t.text)}" />
      </label>
      <div class="row" style="margin-top:12px">
        <button class="btn primary" id="m-task-save">حفظ</button>
        <button class="btn ghost" id="m-task-cancel">إلغاء</button>
      </div>
    `);
    $("#m-task-cancel")?.addEventListener("click", closeModal);
    $("#m-task-save")?.addEventListener("click", () => {
      const text = ($("#m-task-text")?.value || "").trim();
      if (!text) return toast("اكتب نص المهمة.");
      t.text = text;
      saveState();
      closeModal();
      renderSubjectTemplates(s);
      toast("تم حفظ التعديل.");
    });
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }
  function escapeAttr(s) { return escapeHTML(s).replace(/"/g, "&quot;"); }

  /* =========================
     HOME render
     ========================= */
  function renderHome() {
    ensureDaily();
    renderCoins();
    updateProgressBar();

    // KPIs
    const d = ensureDaily();
    if (els.kpiSessions) els.kpiSessions.textContent = String(d.sessions || 0);
    if (els.kpiTodayFocus) els.kpiTodayFocus.textContent = formatMin(d.focusMin || 0);
    if (els.kpiFixes) els.kpiFixes.textContent = String(d.fixes || 0);

    // active subject line
    const s = getActiveSubject();
    if (els.activeSubjectName) els.activeSubjectName.textContent = s ? s.name : "—";
    if (els.activeSubjectMeta) {
      els.activeSubjectMeta.textContent = s
        ? `Focus: ${s.timer?.focusMin ?? 25}د • Break: ${s.timer?.breakMin ?? 5}د`
        : "اختر مادة لتفعيل المؤقت والمهام.";
    }

    // home tasks = tasks for active subject (today)
    if (els.homeTasks) {
      els.homeTasks.innerHTML = "";
      if (!s) {
        const e = document.createElement("div");
        e.className = "emptyState";
        e.textContent = "لا توجد مادة نشطة. اختر مادة أولاً.";
        els.homeTasks.appendChild(e);
      } else {
        const dk = todayKey();
        const list = ensureSubjectDailyTasks(s, dk);
        if (list.length === 0) {
          const e = document.createElement("div");
          e.className = "emptyState";
          e.textContent = "لا توجد مهام اليوم لهذه المادة. أضف قوالب مهام من تبويب المواد.";
          els.homeTasks.appendChild(e);
        } else {
          list.forEach(task => {
            const row = document.createElement("div");
            row.className = "task-row";
            row.dataset.done = task.done ? "1" : "0";
            row.innerHTML = `
              <button class="task-check">${task.done ? "✓" : ""}</button>
              <div class="task-text">${escapeHTML(task.text)}</div>
            `;
            row.querySelector(".task-check").addEventListener("click", () => {
              toggleTodayTask(s.id, task.id, row);
            });
            els.homeTasks.appendChild(row);
          });
        }
      }
    }
  }

  // Home actions
  els.btnPickActive?.addEventListener("click", () => {
    if (state.subjects.length === 0) return toast("أضف مادة أولاً.");
    openModal("اختيار مادة نشطة", `
      <div class="list">
        ${state.subjects.map(s => `
          <div class="subject-item" style="grid-template-columns: 1fr auto;">
            <div>
              <div class="subject-title">${escapeHTML(s.name)}</div>
              <div class="subject-meta">Focus: ${s.timer?.focusMin ?? 25}د • Break: ${s.timer?.breakMin ?? 5}د</div>
            </div>
            <button class="btn tiny primary" data-pick="${s.id}">تفعيل</button>
          </div>
        `).join("")}
      </div>
      <div class="row" style="margin-top:12px">
        <button class="btn ghost" id="m-close">إغلاق</button>
      </div>
    `);
    $("#m-close")?.addEventListener("click", closeModal);
    $$("[data-pick]").forEach(b => {
      b.addEventListener("click", () => {
        setActiveSubject(b.getAttribute("data-pick"));
        closeModal();
      });
    });
  });

  els.btnAddTaskQuick?.addEventListener("click", () => {
    const s = getActiveSubject();
    if (!s) return toast("اختر مادة نشطة أولاً.");
    openModal("إضافة مهمة لليوم", `
      <label class="field">
        <span>نص المهمة</span>
        <input id="m-today-task" type="text" placeholder="مثال: مراجعة ملخص الدرس" />
      </label>
      <div class="row" style="margin-top:12px">
        <button class="btn primary" id="m-add">إضافة</button>
        <button class="btn ghost" id="m-cancel">إلغاء</button>
      </div>
    `);
    $("#m-cancel")?.addEventListener("click", closeModal);
    $("#m-add")?.addEventListener("click", () => {
      const text = ($("#m-today-task")?.value || "").trim();
      if (!text) return toast("اكتب نص المهمة.");
      const dk = todayKey();
      const list = ensureSubjectDailyTasks(s, dk);
      list.push({ id: uid(), text, done: false, doneAt: null });
      saveState();
      closeModal();
      renderHome();
      updateProgressBar();
      toast("تمت إضافة مهمة اليوم.");
    });
  });

  els.homeResetToday?.addEventListener("click", () => {
    openModal("تصفير اليوم", `
      <p class="p">سيتم إلغاء إنجاز مهام اليوم فقط (لن تُحذف القوالب).</p>
      <div class="row" style="margin-top:12px">
        <button class="btn danger" id="m-reset-yes">تصفير</button>
        <button class="btn ghost" id="m-reset-no">إلغاء</button>
      </div>
    `);
    $("#m-reset-no")?.addEventListener("click", closeModal);
    $("#m-reset-yes")?.addEventListener("click", () => {
      const dk = todayKey();
      state.subjects.forEach(s => {
        const list = ensureSubjectDailyTasks(s, dk);
        list.forEach(t => { t.done = false; t.doneAt = null; });
      });
      // daily stats reset (sessions/focus/break maybe not; requirement says "تصفير اليوم" on home -> likely tasks; keep focus stats)
      ensureDaily().tasksDone = 0;
      ensureDaily().tasksTotal = computeTodayTasks().total;
      saveState();
      closeModal();
      renderHome();
      toast("تم تصفير مهام اليوم.");
    });
  });

  /* =========================
     Subjects tab render
     ========================= */
  function renderSubjects() {
    renderCoins();
    renderSubjectsList();

    // open last subject editor if exists
    const lastId = state.ui.lastSubjectEditorId;
    if (lastId && subjectById(lastId)) openSubjectEditor(lastId);
    else {
      if (els.subjectEditor) {
        els.subjectEditor.innerHTML = `
          <div class="emptyState">
            اختر مادة من القائمة لعرض المهام، المؤقت، والإحصائيات.
          </div>
        `;
      }
      if (els.subjectBadge) els.subjectBadge.textContent = "—";
    }
  }

  els.btnAddSubject?.addEventListener("click", addSubjectFlow);
  els.btnOpenActiveFromList?.addEventListener("click", () => {
    const s = getActiveSubject();
    if (!s) return toast("لا توجد مادة نشطة.");
    openSubjectEditor(s.id);
  });

  /* =========================
     Timer
     ========================= */
  function getTimerDurations() {
    const s = getActiveSubject();
    if (s) return { focusMin: s.timer?.focusMin ?? 25, breakMin: s.timer?.breakMin ?? 5 };
    return { focusMin: 25, breakMin: 5 };
  }

  function setTimerFromDurations() {
    const d = getTimerDurations();
    const mins = state.timer.mode === "FOCUS" ? d.focusMin : d.breakMin;
    state.timer.remainingSec = Math.max(1, Math.round(mins * 60));
  }

  function formatTime(sec) {
    const s = Math.max(0, Math.floor(sec));
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  function renderTimerUI() {
    applyTimerSkin();
    renderCoins();

    const s = getActiveSubject();
    if (els.timerActiveLine) {
      els.timerActiveLine.textContent = s
        ? `المادة: ${s.name} • Focus ${s.timer?.focusMin ?? 25}د / Break ${s.timer?.breakMin ?? 5}د`
        : "—";
    }

    // inputs reflect subject timer if exists
    const d = getTimerDurations();
    if (els.timerFocusMin) els.timerFocusMin.value = String(d.focusMin);
    if (els.timerBreakMin) els.timerBreakMin.value = String(d.breakMin);

    // sound toggle
    if (els.timerSound) els.timerSound.checked = !!state.prefs.soundEnabled;

    // stage values
    if (els.timerMode) els.timerMode.textContent = state.timer.mode;
    if (els.timerTime) els.timerTime.textContent = formatTime(state.timer.remainingSec);
    renderTimerProgress();

    // quick KPIs (today)
    const dy = ensureDaily();
    if (els.timerKpiSessions) els.timerKpiSessions.textContent = String(dy.sessions || 0);
    if (els.timerKpiFocus) els.timerKpiFocus.textContent = formatMin(dy.focusMin || 0);
    if (els.timerKpiBreaks) els.timerKpiBreaks.textContent = String(dy.breakMin ? Math.round((dy.breakMin) / (d.breakMin || 5)) : 0);
    if (els.timerKpiCoins) els.timerKpiCoins.textContent = String(round1(dy.coinsEarned || 0));
    // notes load
    if (els.timerNotes) {
      const sid = state.ui.activeSubjectId || "global";
      els.timerNotes.value = (state.quickNotes[sid]?.text || "");
    }

    if (els.timerToggle) els.timerToggle.textContent = state.timer.running ? "إيقاف" : "بدء";
  }

  function renderTimerProgress() {
    const d = getTimerDurations();
    const totalSec = (state.timer.mode === "FOCUS" ? d.focusMin : d.breakMin) * 60;
    const remain = state.timer.remainingSec;
    const done = Math.max(0, totalSec - remain);
    const pct = totalSec <= 0 ? 0 : clamp((done / totalSec) * 100, 0, 100);
    document.documentElement.style.setProperty("--tprog", `${pct}%`);
    if (els.timerProg) els.timerProg.style.width = `${pct}%`;
  }

  function timerStart() {
    // require active subject for full features? allow global too
    state.timer.running = true;
    state.timer.startTs = Date.now();
    state.timer.lastTickTs = Date.now();
    saveState();
    renderTimerUI();
  }

  function timerStop() {
    state.timer.running = false;
    state.timer.startTs = null;
    state.timer.lastTickTs = null;
    saveState();
    renderTimerUI();
  }

  function timerReset() {
    state.timer.running = false;
    state.timer.startTs = null;
    state.timer.lastTickTs = null;
    // reset to full duration of current mode
    setTimerFromDurations();
    saveState();
    renderTimerUI();
    toast("تمت إعادة ضبط المؤقت.");
  }

  function timerSwitchMode() {
    state.timer.mode = (state.timer.mode === "FOCUS") ? "BREAK" : "FOCUS";
    state.timer.running = false;
    state.timer.startTs = null;
    state.timer.lastTickTs = null;
    setTimerFromDurations();
    saveState();
    renderTimerUI();
    toast("تم تبديل الوضع.");
  }

  function timerComplete(modeJustFinished, minutesSpent) {
    // Update stats + coins
    ensureDaily();
    const s = getActiveSubject();

    if (modeJustFinished === "FOCUS") {
      const mins = minutesSpent;
      // coins: 0.2 per minute focus
      const earned = round1(minutesToCoins(mins));
      bumpCoins(earned, `+${earned} كوينز تركيز`);
      // stats
      state.stats.total.focusMin += mins;
      ensureDaily().focusMin += mins;
      if (s) s.stats.focusMin = (s.stats.focusMin || 0) + mins;

      state.stats.total.sessions += 1;
      ensureDaily().sessions += 1;
      if (s) s.stats.sessions = (s.stats.sessions || 0) + 1;
    } else {
      const mins = minutesSpent;
      state.stats.total.breakMin += mins;
      ensureDaily().breakMin += mins;
      if (s) s.stats.breakMin = (s.stats.breakMin || 0) + mins;
    }

    saveState();
    renderHome();
    renderStats();
    renderTimerUI();

    if (state.prefs.soundEnabled) playBeep();
  }

  // Timer tick loop
  setInterval(() => {
    if (!state.timer.running) return;
    const now = Date.now();
    const last = state.timer.lastTickTs || now;
    const dt = Math.max(0, Math.floor((now - last) / 1000));
    if (dt <= 0) return;

    state.timer.lastTickTs = now;
    state.timer.remainingSec -= dt;

    if (state.timer.remainingSec <= 0) {
      // compute minutes spent in this cycle (based on configured duration)
      const d = getTimerDurations();
      const totalMin = state.timer.mode === "FOCUS" ? d.focusMin : d.breakMin;
      const mode = state.timer.mode;

      // stop and complete
      state.timer.running = false;
      state.timer.remainingSec = 0;
      saveState();

      timerComplete(mode, totalMin);

      // auto switch to other mode (nice UX)
      state.timer.mode = (mode === "FOCUS") ? "BREAK" : "FOCUS";
      setTimerFromDurations();
      saveState();
      renderTimerUI();
      toast(mode === "FOCUS" ? "انتهى التركيز! وقت الاستراحة." : "انتهت الاستراحة! ارجع للتركيز.");
      return;
    }

    saveState();
    if (els.timerTime) els.timerTime.textContent = formatTime(state.timer.remainingSec);
    if (els.timerMode) els.timerMode.textContent = state.timer.mode;
    renderTimerProgress();
  }, 300);

  els.timerToggle?.addEventListener("click", () => {
    if (state.timer.running) timerStop();
    else timerStart();
  });
  els.timerReset?.addEventListener("click", timerReset);
  els.timerSwitch?.addEventListener("click", timerSwitchMode);

  els.timerPickActive?.addEventListener("click", () => {
    // same as home pick
    els.btnPickActive?.click();
  });

  els.timerFocusMin?.addEventListener("change", () => {
    const s = getActiveSubject();
    const v = clamp(parseInt(els.timerFocusMin.value || "25", 10) || 25, 1, 180);
    if (s) {
      s.timer.focusMin = v;
      saveState();
    }
    if (!state.timer.running && state.timer.mode === "FOCUS") {
      setTimerFromDurations();
      saveState();
      renderTimerUI();
    }
  });
  els.timerBreakMin?.addEventListener("change", () => {
    const s = getActiveSubject();
    const v = clamp(parseInt(els.timerBreakMin.value || "5", 10) || 5, 1, 60);
    if (s) {
      s.timer.breakMin = v;
      saveState();
    }
    if (!state.timer.running && state.timer.mode === "BREAK") {
      setTimerFromDurations();
      saveState();
      renderTimerUI();
    }
  });

  els.timerSound?.addEventListener("change", () => {
    state.prefs.soundEnabled = !!els.timerSound.checked;
    saveState();
  });

  els.timerOpenStore?.addEventListener("click", () => setTab("tab-store"));

  els.notesSave?.addEventListener("click", () => {
    const sid = state.ui.activeSubjectId || "global";
    state.quickNotes[sid] = { text: els.timerNotes?.value || "", updatedAt: nowISO() };
    saveState();
    toast("تم حفظ الملاحظات.");
  });
  els.notesClear?.addEventListener("click", () => {
    if (els.timerNotes) els.timerNotes.value = "";
    const sid = state.ui.activeSubjectId || "global";
    state.quickNotes[sid] = { text: "", updatedAt: nowISO() };
    saveState();
    toast("تم مسح الملاحظات.");
  });

  /* =========================
     Store (purchase + activate)
     ========================= */
  function canAfford(price) {
    return round1(state.coins) >= price;
  }

  function purchase(price, label) {
    if (price <= 0) return true;
    if (!canAfford(price)) {
      toast("كوينز غير كافية.");
      return false;
    }
    bumpCoins(-price, `تم شراء: ${label}`);
    return true;
  }

  function renderStore() {
    renderCoins();
    renderWallpapersStore();
    renderTimersStore();
    renderNotebookCoversStore();
    renderErrorBookCoversStore();
  }

  function storeCard({ title, meta, previewStyle, owned, active, ctaText }) {
    const ownedAttr = owned ? "1" : "0";
    const activeAttr = active ? "1" : "0";
    return `
      <div class="store-card" data-owned="${ownedAttr}" data-active="${activeAttr}">
        <div class="wallpaper-preview" style="${previewStyle || ""}"></div>
        <div class="store-title">${escapeHTML(title)}</div>
        <div class="store-meta">${escapeHTML(meta)}</div>
        <div class="store-actions">
          <button class="btn primary">${escapeHTML(ctaText)}</button>
        </div>
      </div>
    `;
  }

  function renderWallpapersStore() {
    const root = els.storeWallpapers;
    if (!root) return;
    root.innerHTML = "";

    CATALOG.wallpapers.forEach((w, idx) => {
      const owned = !!state.store.wallpapers.owned[w.id];
      const active = state.store.wallpapers.active === w.id;

      const price = (idx < 3) ? 0 : 80;
      const meta = (idx < 3)
        ? "مجاني للتجربة"
        : `السعر: ${price} كوينز`;

      const html = storeCard({
        title: `خلفية: ${w.name}`,
        meta,
        previewStyle: `background:${w.css}`,
        owned,
        active,
        ctaText: active ? "مفعّلة" : (owned ? "تفعيل" : "شراء")
      });

      const wrap = document.createElement("div");
      wrap.innerHTML = html.trim();
      const card = wrap.firstElementChild;
      const btn = card.querySelector("button");

      btn.addEventListener("click", () => {
        if (!owned) {
          if (!purchase(price, `خلفية ${w.name}`)) return;
          state.store.wallpapers.owned[w.id] = true;
          saveState();
        }
        state.store.wallpapers.active = w.id;
        saveState();
        applyWallpaper();
        renderStore();
        toast("تم تفعيل الخلفية.");
      });

      root.appendChild(card);
    });
  }

  function renderTimersStore() {
    const root = els.storeTimers;
    if (!root) return;
    root.innerHTML = "";

    CATALOG.timerSkins.forEach((s) => {
      const owned = !!state.store.timers.owned[s.id];
      const active = state.store.timers.active === s.id;
      const meta = `السعر: 60 كوينز`;

      const html = `
        <div class="store-card" data-owned="${owned ? "1" : "0"}" data-active="${active ? "1" : "0"}">
          <div class="timer-preview">
            <div class="timer-mini" data-skin="${miniSkinFromId(s.id)}">
              <div class="timer-mini-face"></div>
              <div class="timer-mini-label">${escapeHTML(s.name)}</div>
            </div>
          </div>
          <div class="store-title">تايمر: ${escapeHTML(s.name)}</div>
          <div class="store-meta">${meta}</div>
          <div class="store-actions">
            <button class="btn primary">${active ? "مفعّل" : (owned ? "تفعيل" : "شراء")}</button>
          </div>
        </div>
      `;
      const wrap = document.createElement("div");
      wrap.innerHTML = html.trim();
      const card = wrap.firstElementChild;
      const btn = card.querySelector("button");

      btn.addEventListener("click", () => {
        if (!owned) {
          if (!purchase(60, `تايمر ${s.name}`)) return;
          state.store.timers.owned[s.id] = true;
          saveState();
        }
        // لا يتم تفعيل إلا إذا مشتَرى (الآن مملوك)
        state.store.timers.active = s.id;
        saveState();
        applyTimerSkin();
        renderStore();
        renderTimerUI();
        toast("تم تفعيل شكل التايمر.");
      });

      root.appendChild(card);
    });

    // extra: allow "none"
    const noneCard = document.createElement("div");
    noneCard.innerHTML = `
      <div class="store-card" data-owned="1" data-active="${state.store.timers.active === "none" ? "1" : "0"}">
        <div class="timer-preview">
          <div class="timer-mini" data-skin="bar">
            <div class="timer-mini-face"></div>
            <div class="timer-mini-label">Default</div>
          </div>
        </div>
        <div class="store-title">تايمر: Default</div>
        <div class="store-meta">مجاني • الشكل الافتراضي</div>
        <div class="store-actions">
          <button class="btn primary">${state.store.timers.active === "none" ? "مفعّل" : "تفعيل"}</button>
        </div>
      </div>
    `.trim();
    const card = noneCard.firstElementChild;
    card.querySelector("button").addEventListener("click", () => {
      state.store.timers.active = "none";
      saveState();
      applyTimerSkin();
      renderStore();
      renderTimerUI();
      toast("تم تفعيل الشكل الافتراضي.");
    });
    root.appendChild(card);
  }

  function miniSkinFromId(id) {
    // map to CSS mini data-skin variants available in style.css
    if (id.includes("ring")) return "ring";
    if (id.includes("dual")) return "dualRing";
    if (id.includes("bar")) return "bar";
    if (id.includes("cube")) return "cube";
    if (id.includes("holo")) return "holo";
    // fallback
    return "bar";
  }

  function renderNotebookCoversStore() {
    const root = els.storeNotebookCovers;
    if (!root) return;
    root.innerHTML = "";

    CATALOG.notebookCovers.forEach((c, idx) => {
      const owned = !!state.store.notebookCovers.owned[c.id];
      const price = (idx < 3) ? 0 : 55;

      const html = `
        <div class="store-card" data-owned="${owned ? "1" : "0"}" data-active="0">
          <div class="wallpaper-preview" style="background:${c.css}"></div>
          <div class="store-title">غلاف دفاتر: ${escapeHTML(c.name)}</div>
          <div class="store-meta">${idx < 3 ? "مجاني للتجربة" : `السعر: ${price} كوينز`}</div>
          <div class="store-actions">
            <button class="btn primary">${owned ? "مملوك" : "شراء"}</button>
          </div>
        </div>
      `;
      const wrap = document.createElement("div");
      wrap.innerHTML = html.trim();
      const card = wrap.firstElementChild;
      const btn = card.querySelector("button");

      btn.addEventListener("click", () => {
        if (owned) return toast("الغلاف مملوك.");
        if (!purchase(price, `غلاف دفاتر ${c.name}`)) return;
        state.store.notebookCovers.owned[c.id] = true;
        saveState();
        renderStore();
      });

      root.appendChild(card);
    });
  }

  function renderErrorBookCoversStore() {
    const root = els.storeErrorBooks;
    if (!root) return;
    root.innerHTML = "";

    CATALOG.errorBookCovers.forEach((c, idx) => {
      const owned = !!state.store.errorBookCovers.owned[c.id];
      const price = (idx < 3) ? 0 : 55;

      const html = `
        <div class="store-card" data-owned="${owned ? "1" : "0"}" data-active="0">
          <div class="wallpaper-preview" style="background:${c.css}"></div>
          <div class="store-title">غلاف دفتر الأخطاء: ${escapeHTML(c.name)}</div>
          <div class="store-meta">${idx < 3 ? "مجاني للتجربة" : `السعر: ${price} كوينز`}</div>
          <div class="store-actions">
            <button class="btn primary">${owned ? "مملوك" : "شراء"}</button>
          </div>
        </div>
      `;
      const wrap = document.createElement("div");
      wrap.innerHTML = html.trim();
      const card = wrap.firstElementChild;
      const btn = card.querySelector("button");

      btn.addEventListener("click", () => {
        if (owned) return toast("الغلاف مملوك.");
        if (!purchase(price, `غلاف أخطاء ${c.name}`)) return;
        state.store.errorBookCovers.owned[c.id] = true;
        saveState();
        renderStore();
      });

      root.appendChild(card);
    });
  }

  /* =========================
     Notebooks (3D) + Error books (multi)
     - تبويب الدفاتر: نعرض نوعين:
       1) دفاتر عامة (ملاحظات)
       2) دفاتر أخطاء (متعددة)
     - نفس grid موجود: notebooks-grid
     - viewer: book-viewer
     ========================= */
  function ensureDefaultBooks() {
    // create at least one notebook and one error book if empty? requirement: "لازم يكون عندي أكثر من دفتر (3D)"
    // but not "افتراضي" إجباري؛ مع ذلك تبويب الدفاتر يحتاج "أكثر من دفتر".
    // سننشئ دفترين عامّين + دفتر أخطاء واحد أول مرة فقط إذا لا يوجد أي شيء.
    if ((state.notebooks?.length || 0) === 0 && (state.errorBooks?.length || 0) === 0) {
      state.notebooks = [
        { id: uid(), title: "دفتر 1", coverId: "nbc_01", pages: [{ id: uid(), txt: "اكتب ملاحظاتك هنا…", ts: nowISO() }] },
        { id: uid(), title: "دفتر 2", coverId: "nbc_02", pages: [{ id: uid(), txt: "صفحة 1", ts: nowISO() }] },
      ];
      state.errorBooks = [
        { id: uid(), title: "دفتر أخطاء 1", coverId: "ebc_01", errors: [] },
      ];
      saveState();
    } else {
      state.notebooks = state.notebooks || [];
      state.errorBooks = state.errorBooks || [];
    }
  }

  function notebookCoverCSS(coverId) {
    const item = CATALOG.notebookCovers.find(x => x.id === coverId) || CATALOG.notebookCovers[0];
    return item?.css || "linear-gradient(135deg,#7c5cff,#22d3ee)";
  }
  function errorCoverCSS(coverId) {
    const item = CATALOG.errorBookCovers.find(x => x.id === coverId) || CATALOG.errorBookCovers[0];
    return item?.css || "linear-gradient(135deg,#7c5cff,#22c55e)";
  }

  function renderNotebooks() {
    ensureDefaultBooks();
    renderCoins();

    if (!els.notebooksGrid) return;
    els.notebooksGrid.innerHTML = "";

    // section header cards inside grid (as notebooks)
    // We'll render general notebooks first then error books.
    const allCards = [];

    state.notebooks.forEach(nb => {
      allCards.push(makeNotebookCard(nb, "normal"));
    });
    state.errorBooks.forEach(eb => {
      allCards.push(makeNotebookCard(eb, "error"));
    });

    if (allCards.length === 0) {
      const e = document.createElement("div");
      e.className = "emptyState";
      e.textContent = "لا توجد دفاتر بعد.";
      els.notebooksGrid.appendChild(e);
    } else {
      allCards.forEach(card => els.notebooksGrid.appendChild(card));
    }

    // viewer render
    renderBookViewer();
  }

  function makeNotebookCard(obj, type) {
    const card = document.createElement("div");
    card.className = "nbCard";
    card.dataset.type = type;
    card.dataset.id = obj.id;

    const css = type === "error" ? errorCoverCSS(obj.coverId) : notebookCoverCSS(obj.coverId);
    const meta = type === "error"
      ? `أخطاء: ${(obj.errors || []).length} • مصححة: ${(obj.errors || []).filter(e => e.fixed).length}`
      : `صفحات: ${(obj.pages || []).length}`;

    card.innerHTML = `
      <div class="nbCover" style="background:${css}">
        <div class="nbSpine"></div>
      </div>
      <div class="nbTitle">${escapeHTML(obj.title)}</div>
      <div class="nbMeta">${escapeHTML(meta)}${type === "error" ? " • (+20 عند التصحيح)" : ""}</div>
    `;
    card.addEventListener("click", () => openNotebook(type, obj.id));
    return card;
  }

  function openNotebook(type, id) {
    state.ui.openNotebookId = `${type}:${id}`;
    saveState();
    renderBookViewer();
  }

  function closeNotebook() {
    state.ui.openNotebookId = null;
    saveState();
    renderBookViewer();
  }
  els.btnCloseNotebook?.addEventListener("click", closeNotebook);

  function renderBookViewer() {
    if (!els.bookViewer) return;

    const open = state.ui.openNotebookId;
    if (!open) {
      els.bookViewer.innerHTML = `
        <div class="emptyState">
          اختر دفتر من اليسار لفتحه. سيظهر أنيميشن صفحات.
        </div>
      `;
      return;
    }
    const [type, id] = open.split(":");
    if (type === "normal") {
      const nb = state.notebooks.find(x => x.id === id);
      if (!nb) return closeNotebook();
      renderNormalNotebookViewer(nb);
    } else {
      const eb = state.errorBooks.find(x => x.id === id);
      if (!eb) return closeNotebook();
      renderErrorBookViewer(eb);
    }
  }

  // Normal notebook viewer with pages flip
  function renderNormalNotebookViewer(nb) {
    const pages = nb.pages || [];
    const pageIndex = clamp(state.ui.pageIndex || 0, 0, Math.max(0, pages.length - 1));
    state.ui.pageIndex = pageIndex;

    const current = pages[pageIndex] || { txt: "" };

    els.bookViewer.innerHTML = `
      <div class="row between" style="margin-bottom:10px">
        <div>
          <h3>${escapeHTML(nb.title)}</h3>
          <div class="muted" style="font-size:12px">غلاف: ${escapeHTML(coverName("notebook", nb.coverId))}</div>
        </div>
        <div class="row">
          <button class="btn tiny" id="nb-change-cover">تغيير الغلاف</button>
          <button class="btn tiny primary" id="nb-add-page">صفحة جديدة</button>
        </div>
      </div>

      <div class="book3d">
        <div class="book">
          <div class="page" id="page-el">
            <div class="pageContent">
              <textarea id="nb-page-text" class="notes" style="min-height:210px">${escapeHTML(current.txt || "")}</textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="bookControls">
        <button class="btn" id="nb-prev">السابق</button>
        <button class="btn" id="nb-save">حفظ الصفحة</button>
        <button class="btn" id="nb-next">التالي</button>
      </div>

      <div class="row" style="margin-top:12px; justify-content:space-between">
        <div class="muted" style="font-size:12px">صفحة ${pageIndex + 1} / ${Math.max(1, pages.length)}</div>
        <button class="btn danger tiny" id="nb-delete">حذف الدفتر</button>
      </div>
    `;

    $("#nb-save")?.addEventListener("click", () => {
      const txt = $("#nb-page-text")?.value || "";
      pages[pageIndex].txt = txt;
      pages[pageIndex].ts = nowISO();
      nb.pages = pages;
      saveState();
      toast("تم حفظ الصفحة.");
    });

    $("#nb-add-page")?.addEventListener("click", () => {
      nb.pages = nb.pages || [];
      nb.pages.push({ id: uid(), txt: "", ts: nowISO() });
      state.ui.pageIndex = nb.pages.length - 1;
      saveState();
      flipPageAnim();
      renderNormalNotebookViewer(nb);
      toast("تمت إضافة صفحة.");
    });

    $("#nb-prev")?.addEventListener("click", () => {
      if (pageIndex <= 0) return;
      state.ui.pageIndex = pageIndex - 1;
      saveState();
      flipPageAnim();
      renderNormalNotebookViewer(nb);
    });
    $("#nb-next")?.addEventListener("click", () => {
      if (pageIndex >= pages.length - 1) return;
      state.ui.pageIndex = pageIndex + 1;
      saveState();
      flipPageAnim();
      renderNormalNotebookViewer(nb);
    });

    $("#nb-delete")?.addEventListener("click", () => {
      openModal("حذف الدفتر", `
        <p class="p">حذف: <b>${escapeHTML(nb.title)}</b>؟</p>
        <div class="row" style="margin-top:12px">
          <button class="btn danger" id="m-yes">حذف</button>
          <button class="btn ghost" id="m-no">إلغاء</button>
        </div>
      `);
      $("#m-no")?.addEventListener("click", closeModal);
      $("#m-yes")?.addEventListener("click", () => {
        state.notebooks = state.notebooks.filter(x => x.id !== nb.id);
        closeModal();
        closeNotebook();
        saveState();
        renderNotebooks();
        toast("تم حذف الدفتر.");
      });
    });

    $("#nb-change-cover")?.addEventListener("click", () => changeCoverFlow("notebook", nb.id));

    function flipPageAnim() {
      const p = $("#page-el");
      p?.classList.add("flip");
      setTimeout(() => p?.classList.remove("flip"), 620);
    }
  }

  // Error book viewer
  function renderErrorBookViewer(eb) {
    els.bookViewer.innerHTML = `
      <div class="row between" style="margin-bottom:10px">
        <div>
          <h3>${escapeHTML(eb.title)}</h3>
          <div class="muted" style="font-size:12px">غلاف: ${escapeHTML(coverName("error", eb.coverId))} • (+20 عند التصحيح)</div>
        </div>
        <div class="row">
          <button class="btn tiny" id="eb-change-cover">تغيير الغلاف</button>
          <button class="btn tiny primary" id="eb-add-error">إضافة خطأ</button>
        </div>
      </div>

      <div class="book3d">
        <div class="book">
          <div class="page" id="page-el">
            <div class="pageContent">
              <div id="eb-errors"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bookControls">
        <button class="btn danger tiny" id="eb-delete">حذف الدفتر</button>
      </div>
    `;

    // render errors list inside page
    const listEl = $("#eb-errors");
    const errors = eb.errors || [];
    if (!listEl) return;

    if (errors.length === 0) {
      listEl.innerHTML = `<div class="emptyState">لا توجد أخطاء بعد. أضف خطأ لتتبع التصحيح.</div>`;
    } else {
      listEl.innerHTML = errors.map(er => `
        <div class="error-row" data-id="${er.id}" data-fixed="${er.fixed ? "1" : "0"}">
          <div class="error-text">${escapeHTML(er.text)}</div>
          <div class="error-meta">${escapeHTML(er.ts.slice(0,16).replace("T"," "))}${er.fixed ? ` • مصحح: ${escapeHTML(er.fixedAt?.slice(0,16).replace("T"," ") || "")}` : ""}</div>
          <div class="error-actions">
            ${er.fixed ? `<span class="pill">تم التصحيح</span>` : `<button class="btn tiny primary" data-fix="${er.id}">تصحيح</button>`}
            <button class="btn tiny ghost" data-del="${er.id}">حذف</button>
          </div>
        </div>
      `).join("");
    }

    // bind actions
    $$("[data-fix]").forEach(b => {
      b.addEventListener("click", () => {
        const id = b.getAttribute("data-fix");
        const er = errors.find(x => x.id === id);
        if (!er || er.fixed) return;
        er.fixed = true;
        er.fixedAt = nowISO();

        // reward
        bumpCoins(20, "+20 كوينز لتصحيح خطأ");
        state.stats.total.fixes += 1;
        ensureDaily().fixes += 1;

        saveState();
        // flip animation for delight
        $("#page-el")?.classList.add("flip");
        setTimeout(() => $("#page-el")?.classList.remove("flip"), 620);

        renderErrorBookViewer(eb);
        renderHome();
        renderStats();
      });
    });

    $$("[data-del]").forEach(b => {
      b.addEventListener("click", () => {
        const id = b.getAttribute("data-del");
        eb.errors = (eb.errors || []).filter(x => x.id !== id);
        saveState();
        renderErrorBookViewer(eb);
        toast("تم حذف الخطأ.");
      });
    });

    $("#eb-add-error")?.addEventListener("click", () => {
      openModal("إضافة خطأ", `
        <label class="field">
          <span>وصف الخطأ</span>
          <textarea id="m-err-text" class="notes" placeholder="اكتب الخطأ، السبب، وكيف ستتجنبه…"></textarea>
        </label>
        <div class="row" style="margin-top:12px">
          <button class="btn primary" id="m-err-add">إضافة</button>
          <button class="btn ghost" id="m-err-cancel">إلغاء</button>
        </div>
      `);
      $("#m-err-cancel")?.addEventListener("click", closeModal);
      $("#m-err-add")?.addEventListener("click", () => {
        const text = ($("#m-err-text")?.value || "").trim();
        if (!text) return toast("اكتب وصف الخطأ.");
        eb.errors = eb.errors || [];
        eb.errors.unshift({ id: uid(), text, ts: nowISO(), fixed: false, fixedAt: null });
        saveState();
        closeModal();
        $("#page-el")?.classList.add("flip");
        setTimeout(() => $("#page-el")?.classList.remove("flip"), 620);
        renderErrorBookViewer(eb);
        toast("تمت إضافة الخطأ.");
      });
    });

    $("#eb-change-cover")?.addEventListener("click", () => changeCoverFlow("error", eb.id));

    $("#eb-delete")?.addEventListener("click", () => {
      openModal("حذف دفتر الأخطاء", `
        <p class="p">حذف: <b>${escapeHTML(eb.title)}</b>؟</p>
        <div class="row" style="margin-top:12px">
          <button class="btn danger" id="m-yes">حذف</button>
          <button class="btn ghost" id="m-no">إلغاء</button>
        </div>
      `);
      $("#m-no")?.addEventListener("click", closeModal);
      $("#m-yes")?.addEventListener("click", () => {
        state.errorBooks = state.errorBooks.filter(x => x.id !== eb.id);
        closeModal();
        closeNotebook();
        saveState();
        renderNotebooks();
        toast("تم حذف دفتر الأخطاء.");
      });
    });
  }

  function coverName(type, coverId) {
    const arr = type === "error" ? CATALOG.errorBookCovers : CATALOG.notebookCovers;
    const item = arr.find(x => x.id === coverId);
    return item ? item.name : "—";
  }

  function changeCoverFlow(type, bookId) {
    const isError = type === "error";
    const ownedMap = isError ? state.store.errorBookCovers.owned : state.store.notebookCovers.owned;
    const catalog = isError ? CATALOG.errorBookCovers : CATALOG.notebookCovers;

    const book = isError
      ? state.errorBooks.find(x => x.id === bookId)
      : state.notebooks.find(x => x.id === bookId);

    if (!book) return;

    openModal("تغيير الغلاف", `
      <div class="storeGrid">
        ${catalog.map(c => {
          const owned = !!ownedMap[c.id];
          const active = book.coverId === c.id;
          return `
            <div class="store-card" data-owned="${owned ? "1" : "0"}" data-active="${active ? "1" : "0"}" data-cover="${c.id}">
              <div class="wallpaper-preview" style="background:${c.css}"></div>
              <div class="store-title">${escapeHTML(c.name)}</div>
              <div class="store-meta">${owned ? "مملوك" : "غير مملوك (اذهب للمتجر)"}</div>
              <div class="store-actions">
                <button class="btn primary">${active ? "مفعّل" : (owned ? "تفعيل" : "مقفول")}</button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
      <div class="row" style="margin-top:12px">
        <button class="btn ghost" id="m-close">إغلاق</button>
      </div>
    `);
    $("#m-close")?.addEventListener("click", closeModal);

    $$("[data-cover]").forEach(card => {
      card.querySelector("button")?.addEventListener("click", () => {
        const cid = card.getAttribute("data-cover");
        if (!ownedMap[cid]) return toast("الغلاف غير مملوك. اشتريه من المتجر.");
        book.coverId = cid;
        saveState();
        closeModal();
        renderNotebooks();
        toast("تم تغيير الغلاف.");
      });
    });
  }

  // add notebook button
  els.btnAddNotebook?.addEventListener("click", () => {
    ensureDefaultBooks();
    openModal("دفتر جديد", `
      <div class="row" style="margin-top:8px">
        <label class="field" style="flex:1">
          <span>اسم الدفتر</span>
          <input id="m-nb-name" type="text" placeholder="مثال: ملخصات الفيزياء" />
        </label>
        <label class="field" style="flex:1">
          <span>النوع</span>
          <select id="m-nb-type" style="width:100%; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.05); color:var(--text); border-radius:14px; padding:10px 12px;">
            <option value="normal">دفتر عادي</option>
            <option value="error">دفتر أخطاء</option>
          </select>
        </label>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn primary" id="m-nb-create">إضافة</button>
        <button class="btn ghost" id="m-nb-cancel">إلغاء</button>
      </div>
    `);
    $("#m-nb-cancel")?.addEventListener("click", closeModal);
    $("#m-nb-create")?.addEventListener("click", () => {
      const name = ($("#m-nb-name")?.value || "").trim() || "دفتر جديد";
      const type = $("#m-nb-type")?.value || "normal";
      if (type === "error") {
        state.errorBooks.push({ id: uid(), title: name, coverId: "ebc_01", errors: [] });
      } else {
        state.notebooks.push({ id: uid(), title: name, coverId: "nbc_01", pages: [{ id: uid(), txt: "", ts: nowISO() }] });
      }
      saveState();
      closeModal();
      renderNotebooks();
      toast("تم إضافة دفتر.");
    });
  });

  els.btnNotebookStore?.addEventListener("click", () => setTab("tab-store"));

  /* =========================
     Stats
     ========================= */
  function renderStats() {
    renderCoins();
    const t = state.stats.total;
    const d = ensureDaily();

    if (els.overallStats) {
      els.overallStats.innerHTML = [
        statCard("إجمالي الجلسات", t.sessions || 0),
        statCard("إجمالي التركيز", formatMin(t.focusMin || 0)),
        statCard("إجمالي الاستراحات", formatMin(t.breakMin || 0)),
        statCard("إجمالي الأخطاء المصححة", t.fixes || 0),
        statCard("كوينز مكتسبة", round1(t.coinsEarned || 0)),
        statCard("كوينز مصروفة", round1(t.coinsSpent || 0)),
        statCard("جلسات اليوم", d.sessions || 0),
        statCard("تركيز اليوم", formatMin(d.focusMin || 0)),
      ].join("");
    }

    if (els.subjectsStats) {
      els.subjectsStats.innerHTML = "";
      if (state.subjects.length === 0) {
        const e = document.createElement("div");
        e.className = "emptyState";
        e.textContent = "أضف مواد لتظهر إحصائيات التوزيع.";
        els.subjectsStats.appendChild(e);
      } else {
        state.subjects.forEach(s => {
          const div = document.createElement("div");
          div.className = "subject-item";
          div.style.gridTemplateColumns = "1fr auto";
          div.innerHTML = `
            <div>
              <div class="subject-title">${escapeHTML(s.name)}</div>
              <div class="subject-meta">
                جلسات: ${s.stats?.sessions || 0}
                • تركيز: ${formatMin(s.stats?.focusMin || 0)}
                • استراحات: ${formatMin(s.stats?.breakMin || 0)}
                • مهام منجزة: ${s.stats?.tasksDone || 0}
              </div>
            </div>
            <button class="btn tiny" data-open-sub="${s.id}">فتح</button>
          `;
          div.querySelector("[data-open-sub]")?.addEventListener("click", () => {
            setTab("tab-subjects");
            setTimeout(() => openSubjectEditor(s.id), 0);
          });
          els.subjectsStats.appendChild(div);
        });
      }
    }
  }

  function statCard(k, v) {
    return `
      <div class="stat-card">
        <div class="stat-k">${escapeHTML(k)}</div>
        <div class="stat-v">${escapeHTML(String(v))}</div>
      </div>
    `;
  }

  /* =========================
     Settings
     ========================= */
  function renderSettings() {
    renderCoins();
    if (els.fxToggle) els.fxToggle.checked = !!state.prefs.fxEnabled;
    if (els.tiltToggle) els.tiltToggle.checked = !!state.prefs.tiltEnabled;
    if (els.tiltSensitivity) els.tiltSensitivity.value = String(state.prefs.tiltSensitivity ?? 10);
    if (els.reduceMotion) els.reduceMotion.checked = !!state.prefs.reduceMotion;
  }

  els.fxToggle?.addEventListener("change", () => {
    state.prefs.fxEnabled = !!els.fxToggle.checked;
    saveState();
    if (state.prefs.fxEnabled) fxStart();
    else fxStop();
  });
  els.tiltToggle?.addEventListener("change", () => {
    state.prefs.tiltEnabled = !!els.tiltToggle.checked;
    saveState();
    toast(state.prefs.tiltEnabled ? "تم تفعيل 3D." : "تم تعطيل 3D.");
  });
  els.tiltSensitivity?.addEventListener("input", () => {
    state.prefs.tiltSensitivity = clamp(parseInt(els.tiltSensitivity.value || "10", 10) || 10, 6, 18);
    saveState();
  });
  els.reduceMotion?.addEventListener("change", () => {
    state.prefs.reduceMotion = !!els.reduceMotion.checked;
    saveState();
    toast(state.prefs.reduceMotion ? "تم تفعيل تقليل الحركة." : "تم إلغاء تقليل الحركة.");
  });

  els.btnResetSoft?.addEventListener("click", () => {
    openModal("تصفير الإحصائيات", `
      <p class="p">سيتم تصفير الإحصائيات (Total + Daily) بدون حذف المواد/الدفاتر/المتجر.</p>
      <div class="row" style="margin-top:12px">
        <button class="btn danger" id="m-yes">تصفير</button>
        <button class="btn ghost" id="m-no">إلغاء</button>
      </div>
    `);
    $("#m-no")?.addEventListener("click", closeModal);
    $("#m-yes")?.addEventListener("click", () => {
      state.stats = defaultState().stats;
      saveState();
      closeModal();
      renderHome();
      renderStats();
      toast("تم تصفير الإحصائيات.");
    });
  });

  els.btnResetHard?.addEventListener("click", () => {
    openModal("حذف كل شيء", `
      <p class="p"><b>تحذير:</b> سيتم حذف كل بياناتك محليًا (مواد/دفاتر/متجر/إحصائيات/كوينز).</p>
      <div class="row" style="margin-top:12px">
        <button class="btn danger" id="m-yes">حذف</button>
        <button class="btn ghost" id="m-no">إلغاء</button>
      </div>
    `);
    $("#m-no")?.addEventListener("click", closeModal);
    $("#m-yes")?.addEventListener("click", () => {
      state = defaultState();
      saveState();
      closeModal();
      applyWallpaper();
      applyTimerSkin();
      setTimerFromDurations();
      renderAll();
      toast("تم حذف كل شيء.");
    });
  });

  /* =========================
     Import / Export
     ========================= */
  els.exportBtn?.addEventListener("click", () => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `siraj-backup-${todayKey()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast("تم التصدير.");
  });

  els.importBtn?.addEventListener("click", async () => {
    const f = els.importFile?.files?.[0];
    if (!f) return toast("اختر ملف JSON أولاً.");
    const txt = await f.text();
    const obj = safeJSON(txt, null);
    if (!obj || typeof obj !== "object") return toast("ملف غير صالح.");

    // Merge with defaults to keep new fields
    const merged = deepMerge(defaultState(), obj);

    // sanity rules:
    merged.subjects = Array.isArray(merged.subjects) ? merged.subjects.slice(0, 8) : [];
    merged.coins = round1(Number(merged.coins ?? 240) || 240);

    state = merged;
    saveState();
    applyWallpaper();
    applyTimerSkin();
    // stop running timers on import (safe)
    state.timer.running = false;
    state.timer.startTs = null;
    state.timer.lastTickTs = null;
    if (!state.timer.remainingSec || state.timer.remainingSec < 1) setTimerFromDurations();
    saveState();

    renderAll();
    toast("تم الاستيراد بنجاح.");
  });

  /* =========================
     3D Tilt (Pointer-based)
     ========================= */
  function attachTilt() {
    const cards = $$(".tilt");
    cards.forEach(card => {
      // avoid multiple
      if (card._tiltBound) return;
      card._tiltBound = true;

      card.addEventListener("pointermove", (e) => {
        if (!state.prefs.tiltEnabled) return;
        if (state.prefs.reduceMotion) return;

        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width; // 0..1
        const y = (e.clientY - rect.top) / rect.height; // 0..1
        const sens = clamp(state.prefs.tiltSensitivity ?? 10, 6, 18);
        const rx = (0.5 - y) * sens;
        const ry = (x - 0.5) * sens;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      }, { passive: true });

      const reset = () => {
        card.style.transform = "";
      };
      card.addEventListener("pointerleave", reset);
      card.addEventListener("pointerdown", () => {
        if (!state.prefs.tiltEnabled) return;
        card.style.transform += " scale(0.995)";
      });
      card.addEventListener("pointerup", reset);
      card.addEventListener("pointercancel", reset);
    });
  }

  /* =========================
     Canvas FX (dots + lines)
     ========================= */
  let fxRAF = null;
  let fxCtx = null;
  let fxW = 0, fxH = 0;
  let fxPts = [];

  function fxResize() {
    if (!els.fxCanvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    fxW = Math.floor(window.innerWidth);
    fxH = Math.floor(window.innerHeight);
    els.fxCanvas.width = Math.floor(fxW * dpr);
    els.fxCanvas.height = Math.floor(fxH * dpr);
    els.fxCanvas.style.width = fxW + "px";
    els.fxCanvas.style.height = fxH + "px";
    fxCtx = els.fxCanvas.getContext("2d");
    fxCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function fxInitPoints() {
    fxPts = [];
    const count = clamp(Math.floor((fxW * fxH) / 28000), 24, 95);
    for (let i = 0; i < count; i++) {
      fxPts.push({
        x: Math.random() * fxW,
        y: Math.random() * fxH,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.2 + Math.random() * 1.8,
      });
    }
  }

  function fxDraw() {
    if (!state.prefs.fxEnabled || !fxCtx) return;
    fxCtx.clearRect(0, 0, fxW, fxH);

    // update
    for (const p of fxPts) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20) p.x = fxW + 20;
      if (p.x > fxW + 20) p.x = -20;
      if (p.y < -20) p.y = fxH + 20;
      if (p.y > fxH + 20) p.y = -20;
    }

    // lines
    fxCtx.globalAlpha = 0.6;
    for (let i = 0; i < fxPts.length; i++) {
      for (let j = i + 1; j < fxPts.length; j++) {
        const a = fxPts[i], b = fxPts[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          fxCtx.globalAlpha = (1 - dist / 140) * 0.25;
          fxCtx.beginPath();
          fxCtx.moveTo(a.x, a.y);
          fxCtx.lineTo(b.x, b.y);
          fxCtx.strokeStyle = "rgba(255,255,255,1)";
          fxCtx.lineWidth = 1;
          fxCtx.stroke();
        }
      }
    }

    // dots
    fxCtx.globalAlpha = 0.65;
    for (const p of fxPts) {
      fxCtx.beginPath();
      fxCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      fxCtx.fillStyle = "rgba(255,255,255,1)";
      fxCtx.fill();
    }

    fxRAF = requestAnimationFrame(fxDraw);
  }

  function fxStart() {
    if (!els.fxCanvas) return;
    fxResize();
    fxInitPoints();
    cancelAnimationFrame(fxRAF);
    fxRAF = requestAnimationFrame(fxDraw);
  }

  function fxStop() {
    cancelAnimationFrame(fxRAF);
    fxRAF = null;
    if (fxCtx) fxCtx.clearRect(0, 0, fxW, fxH);
  }

  window.addEventListener("resize", () => {
    fxResize();
    fxInitPoints();
  }, { passive: true });

  /* =========================
     Init
     ========================= */
  function renderAll() {
    applyWallpaper();
    applyTimerSkin();
    renderCoins();
    renderHome();
    renderSubjects();
    renderTimerUI();
    renderNotebooks();
    renderStore();
    renderStats();
    renderSettings();
    attachTilt();

    // open last tab
    const tab = state.ui.activeTab || "tab-home";
    setTab(tab);
  }

  // Bind store / stats / settings to reattach tilt after renders
  const _renderStore = renderStore;
  renderStore = function() {
    _renderStore();
    attachTilt();
  };
  const _renderNotebooks = renderNotebooks;
  renderNotebooks = function() {
    _renderNotebooks();
    attachTilt();
  };
  const _renderHome = renderHome;
  renderHome = function() {
    _renderHome();
    attachTilt();
  };
  const _renderSubjects = renderSubjects;
  renderSubjects = function() {
    _renderSubjects();
    attachTilt();
  };

  // start
  ensureDaily();
  applyWallpaper();
  applyTimerSkin();

  // initialize timer remaining sec if missing
  if (!state.timer.remainingSec || state.timer.remainingSec < 1) {
    setTimerFromDurations();
    saveState();
  }

  // FX
  if (state.prefs.fxEnabled) fxStart();
  else fxStop();

  // initial render
  renderAll();

})();
