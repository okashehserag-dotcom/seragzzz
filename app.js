/* =========================================================
   سراج | Serag — app.js
   كل شي شغال محلياً LocalStorage (بدون سيرفر)
   ========================================================= */

(function () {
  "use strict";

  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const nowISO = () => new Date().toISOString();
  const todayKey = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const uid = () => Math.random().toString(36).slice(2, 10) + "-" + Date.now().toString(36);

  const fmt2 = (n) => String(n).padStart(2, "0");
  const msToClock = (ms) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${fmt2(m)}:${fmt2(r)}`;
  };

  const safeJSON = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
      } catch {
        return fallback;
      }
    },
    set(key, val) {
      localStorage.setItem(key, JSON.stringify(val));
    },
    del(key) {
      localStorage.removeItem(key);
    },
  };

  const toast = (msg) => {
    const el = $("#timerToast");
    if (!el) return;
    el.textContent = msg;
    el.style.opacity = "1";
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      el.style.opacity = "0";
    }, 2200);
  };

  // ---------- i18n ----------
  const I18N = {
    ar: {
      appName: "سراج",
      appTagline: "رفيق الدراسه",
      tabHome: "الرئيسية",
      tabSessions: "جلسات",
      tabMaterials: "المواد",
      tabStats: "الإحصائيات",
      tabMistakes: "دفتر الأخطاء",
      tabSettings: "الإعدادات",
      headerHint: "  — ركّز على ستريكك اليوم",
      offlineReady: "جاهز للعمل دون إنترنت (PWA)",
      editNote: "يمكن تعديل البنود بسهولة من ملف app.js",

      heroBadge: "نمط وزاري + مراجعة + تحليل أخطاء",
      heroTitle1: "سراج",
      heroTitle2: "رتّب ختمتك… واثبت على الستريك.",
      heroDesc: " جلسات تركيز، خطة ختمة يومية، دفتر أخطاء، وإحصائيات تساعدك تمشي بثبات.",
      ctaStartSession: "ابدأ جلسة",
      ctaOpenMaterials: "افتح المواد",
      todaysFocus: "تركيز اليوم",
      fromPlan: "من خطة الختمة",
      miniSessions: "جلسات مكتملة",
      miniMinutes: "دقائق دراسة",
      miniPlan: "إنجاز الخطة",
      miniStreak: "ستريك",

      quickSessionsTitle: "جلسة تركيز",
      quickSessionsSub: "اوقت دراستك",
      quickMistakesTitle: "دفتر الأخطاء",
      quickMistakesSub: "ثبت المفاهيم ونقاط الضعف",
      quickStatsTitle: "إحصائياتك",
      quickStatsSub: "ترند أسبوعي + تركيز",
      quickMaterialsTitle: "المواد",
      quickMaterialsSub: "أهداف + مهام يومية",

      homeGuidanceTitle: "إرشاد سريع",
      homeGuidanceHint: "ثلاث خطوات بسيطة",
      step1Title: "ثبّت زمن الجلسة",
      step1Text: "ابدأ بـ 25 دقيقة + 5 راحة، وعدّلها حسب قدرتك.",
      step2Title: "اتبع خطة الختمة",
      step2Text: "كل يوم مهام واضحة + بلوك مراجعة/تحليل أخطاء.",
      step3Title: "سجّل أخطاءك",
      step3Text: "دفتر الأخطاء أهم من كثرة التكرار بدون فهم.",

      homeFocusModeTitle: "وضع التركيز",
      homeFocusModeHint: "أقل تشتيت، نفس الإنجاز",
      focusCalloutTitle: "إخفاء المشتتات أثناء الدراسة",
      focusCalloutDesc: "فعّل وضع التركيز من أعلى الشاشة خلال الجلسات أو أثناء تنفيذ مهام الخطة.",
      toggleFocus: "تبديل وضع التركيز",

      sessionsTitle: "جلسات التركيز",
      sessionsDesc: "جولات دراسية.",
      timeInsightLoading: "جاري حساب أفضل وقت دراسة…",
      ministerialLabel: "تسمية: نمط وزاري للممارسة",
      modeStudy: "دراسة",
      modeBreak: "راحة",
      timerHint: "جاهز — اضغط ابدأ",
      start: "ابدأ",
      pause: "إيقاف مؤقت",
      reset: "إعادة",
      next: "التالي",
      studyMinutes: "دقائق الدراسة",
      breakMinutes: "دقائق الراحة",
      studyHint: "10–90 دقيقة",
      breakHint: "3–30 دقيقة",
      autoSwitch: "تبديل تلقائي بين دراسة/راحة",
      sessionNotesTitle: "ملاحظات الجلسة",
      sessionNotesHint: "اكتب نقاط سريعة…",
      sessionNotesPh: "مثال: نقاط ضعف اليوم — قاعدة if only + تلخيص فتح عمورية",
      saveNotes: "حفظ",
      clear: "مسح",
      notesAutosave: "يتم الحفظ محليًا",
      mStudySessions: "جلسات دراسة مكتملة",
      mStudyMinutes: "مجموع دقائق الدراسة",
      mBreaks: "استراحات مكتملة",
      mBreakMinutes: "مجموع دقائق الراحة",
      alertsTitle: "تنبيه صوتي + بصري",
      alertsDesc: "عند انتهاء المؤقت راح يظهر تنبيه، وتقدر تكتم الصوت من أعلى.",

      materialsTitle: "المواد",
      materialsDesc: "نظّم موادك وأهدافك، وأضفها للمهام اليومية بضغطة.",
      materialsLimit: "0/12 مادة",
      materialsYourList: "قائمة المواد",
      materialsHint: "حد أقصى 12",
      materialsNamePh: "اسم المادة (مثال: رياضيات)",
      addSubject: "إضافة",
      materialsNote: "الأهداف داخل كل مادة، وتقدر تضيف هدف للمهام اليومية.",
      materialsDetails: "تفاصيل المادة",
      materialsPickOne: "اختر مادة من القائمة لعرض أهدافها.",
      materialsProgress: "التقدم",
      goalPh: "أضف هدف (درس/مراجعة/أسئلة...)",
      addGoal: "إضافة هدف",

      statsTitle: "الإحصائيات",
      statsDesc: "ملخص إنجازك: جلسات + خطة + دفتر أخطاء، مع ترند أسبوعي بسيط.",
      resetStats: "تصفير الإحصائيات",
      resetAll: "تصفير كل شيء",
      statsOverview: "نظرة عامة",
      liveUpdate: "يتحدّث مباشرة",
      sCompletedSessions: "جلسات مكتملة",
      sTotalMinutes: "مجموع دقائق الدراسة",
      sPlanCompletion: "إنجاز الخطة",
      sStreak: "الستريك الحالي",
      trendLoading: "جاري حساب الترند…",
      consistencyLoading: "جاري حساب الاتساق…",
      focusScoreLoading: "جاري حساب نقاط التركيز…",
      weeklyChartTitle: "آخر 7 أيام",
      weeklyChartHint: "دقائق الدراسة اليومية",
      subjectDistTitle: "توزيع المواد",

      mistakesTitle: "دفتر الأخطاء",
      mistakesDesc: "سجّل أخطاءك أنت فقط — ثم راجعها بتكرار متباعد (1/3/7/14 يوم).",
      reviewToday: "مراجعة اليوم",
      exportJson: "تصدير JSON",
      importJson: "استيراد JSON",
      addMistakeTitle: "إضافة خطأ",
      addMistakeHint: "اختصره وخليه واضح",
      subject: "المادة",
      title: "العنوان",
      titleHint: "قصير (حتى 60 حرف)",
      whatWentWrong: "شو اللي غلط؟",
      correctConcept: "التصحيح/المفهوم الصحيح",
      fixAction: "إجراء تصحيح",
      tags: "وسوم (اختياري)",
      mastered: "متقن",
      add: "إضافة",
      libraryTitle: "مكتبتك",
      libraryHint: "بحث + فلترة",
      searchPh: "ابحث…",
      allSubjects: "كل المواد",
      subHistory: "تاريخ",
      subReligion: "دين",
      subEnglish: "إنجليزي",
      subArabic: "عربي",
      notQuestionBank: "هذا دفتر أخطاء شخصي.",
      reviewModalTitle: "مراجعة اليوم",
      close: "إغلاق",

      settingsTitle: "الإعدادات",
      settingsDesc: "عدّل الزمن، الصوت، وضع التركيز، وأدوات النسخ الاحتياطي.",
      durationsTitle: "إعدادات الزمن",
      durationsHint: "تنطبق على المؤقت",
      save: "حفظ",
      soundOn: "الصوت مفعّل",
      focusDefault: "وضع التركيز افتراضيًا",
      lighterDay: "يوم أسبوعي أخف",
      reviewEvery: "بلوك مراجعة كل",
      days: "أيام",
      appearanceTitle: "المظهر",
      appearanceHint: "لمسات لون (Accent)",
      backupTitle: "نسخ احتياطي",
      backupHint: "خطة + إحصائيات + أخطاء",
      exportAll: "تصدير كل البيانات",
      importAll: "استيراد",
      cacheHelp: "إ Service Worker .",

      // Shop
      shopTitle: "المتجر (Coins)",
      shopDesc: "اجمع نقاط من الدراسة واشتري ثيمات وخلفيات.",
      coins: "Coins",
      buy: "شراء",
      owned: "مملوك",
      apply: "تطبيق",
      notEnough: "النقاط غير كافية",
      earnedToday: "اليوم ربحت",
    },
    en: {
      appName: "Serag",
      appTagline: "Tawjihi Buddy — Plan + Sessions + Mistakes",
      tabHome: "Home",
      tabSessions: "Sessions",
      tabMaterials: "Materials",
      tabStats: "Stats",
      tabMistakes: "Mistakes",
      tabSettings: "Settings",
      headerHint: "  — keep your streak today",
      offlineReady: "Offline-ready (PWA)",
      editNote: "You can tweak items in app.js",

      heroBadge: "Ministerial vibe + review + mistake analysis",
      heroTitle1: "Serag",
      heroTitle2: "Stay consistent. Keep the streak.",
      heroDesc: "A simple app: focus sessions, daily plan, a mistake notebook, and stats to keep you moving.",
      ctaStartSession: "Start a session",
      ctaOpenMaterials: "Open Materials",
      todaysFocus: "Today's focus",
      fromPlan: "From the plan",
      miniSessions: "Sessions",
      miniMinutes: "Study minutes",
      miniPlan: "Plan progress",
      miniStreak: "Streak",

      quickSessionsTitle: "Focus session",
      quickSessionsSub: "Pomodoro for study",
      quickMistakesTitle: "Mistake notebook",
      quickMistakesSub: "Fix weak points",
      quickStatsTitle: "Your stats",
      quickStatsSub: "7-day trend",
      quickMaterialsTitle: "Materials",
      quickMaterialsSub: "Goals + tasks",

      homeGuidanceTitle: "Quick guide",
      homeGuidanceHint: "3 simple steps",
      step1Title: "Set a timer",
      step1Text: "Start with 25/5 and adjust as needed.",
      step2Title: "Follow the plan",
      step2Text: "Daily tasks + review block.",
      step3Title: "Write your mistakes",
      step3Text: "It beats repeating without understanding.",

      homeFocusModeTitle: "Focus mode",
      homeFocusModeHint: "Less distraction",
      focusCalloutTitle: "Hide distractions while studying",
      focusCalloutDesc: "Toggle focus mode from the top bar during sessions or tasks.",
      toggleFocus: "Toggle focus",

      sessionsTitle: "Focus Sessions",
      sessionsDesc: "Pomodoro-style sessions (label only).",
      timeInsightLoading: "Calculating best study time…",
      ministerialLabel: "Label: ministerial vibe",
      modeStudy: "Study",
      modeBreak: "Break",
      timerHint: "Ready — press Start",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      next: "Next",
      studyMinutes: "Study minutes",
      breakMinutes: "Break minutes",
      studyHint: "10–90 min",
      breakHint: "3–30 min",
      autoSwitch: "Auto switch Study/Break",
      sessionNotesTitle: "Session notes",
      sessionNotesHint: "Write quick notes…",
      sessionNotesPh: "Example: weak points — grammar rule + summary",
      saveNotes: "Save",
      clear: "Clear",
      notesAutosave: "Saved locally",
      mStudySessions: "Completed study sessions",
      mStudyMinutes: "Total study minutes",
      mBreaks: "Completed breaks",
      mBreakMinutes: "Total break minutes",
      alertsTitle: "Audio + visual alert",
      alertsDesc: "When timer ends, you’ll see an alert; mute from top.",

      materialsTitle: "Materials",
      materialsDesc: "Organize subjects and goals; add goals to daily tasks.",
      materialsLimit: "0/12 subjects",
      materialsYourList: "Your subjects",
      materialsHint: "Max 12",
      materialsNamePh: "Subject name (e.g., Math)",
      addSubject: "Add",
      materialsNote: "Goals live inside each subject; you can add a goal to daily tasks.",
      materialsDetails: "Subject details",
      materialsPickOne: "Pick a subject to view its goals.",
      materialsProgress: "Progress",
      goalPh: "Add a goal (lesson/review/questions...)",
      addGoal: "Add goal",

      statsTitle: "Stats",
      statsDesc: "Sessions + plan + mistakes, with a simple 7-day trend.",
      resetStats: "Reset stats",
      resetAll: "Reset everything",
      statsOverview: "Overview",
      liveUpdate: "Live",
      sCompletedSessions: "Sessions",
      sTotalMinutes: "Study minutes",
      sPlanCompletion: "Plan progress",
      sStreak: "Current streak",
      trendLoading: "Calculating trend…",
      consistencyLoading: "Calculating consistency…",
      focusScoreLoading: "Calculating focus score…",
      weeklyChartTitle: "Last 7 days",
      weeklyChartHint: "Daily study minutes",
      subjectDistTitle: "Subject distribution",

      mistakesTitle: "Mistakes",
      mistakesDesc: "Log your own mistakes and review with spaced repetition (1/3/7/14 days).",
      reviewToday: "Review today",
      exportJson: "Export JSON",
      importJson: "Import JSON",
      addMistakeTitle: "Add a mistake",
      addMistakeHint: "Make it clear & short",
      subject: "Subject",
      title: "Title",
      titleHint: "Up to 60 chars",
      whatWentWrong: "What went wrong?",
      correctConcept: "Correct concept",
      fixAction: "Fix action",
      tags: "Tags (optional)",
      mastered: "Mastered",
      add: "Add",
      libraryTitle: "Library",
      libraryHint: "Search + filter",
      searchPh: "Search…",
      allSubjects: "All subjects",
      subHistory: "History",
      subReligion: "Religion",
      subEnglish: "English",
      subArabic: "Arabic",
      notQuestionBank: "Personal notebook — not a question bank.",
      reviewModalTitle: "Today's review",
      close: "Close",

      settingsTitle: "Settings",
      settingsDesc: "Timer, sound, focus mode, and backups.",
      durationsTitle: "Durations",
      durationsHint: "Applied to the timer",
      save: "Save",
      soundOn: "Sound enabled",
      focusDefault: "Focus mode by default",
      lighterDay: "One lighter day per week",
      reviewEvery: "Review block every",
      days: "days",
      appearanceTitle: "Appearance",
      appearanceHint: "Accent color",
      backupTitle: "Backup",
      backupHint: "Plan + Stats + Mistakes",
      exportAll: "Export all data",
      importAll: "Import",
      cacheHelp: "If cache conflicts while developing, remove the Service Worker.",

      // Shop
      shopTitle: "Shop (Coins)",
      shopDesc: "Earn coins by studying, buy timer styles & backgrounds.",
      coins: "Coins",
      buy: "Buy",
      owned: "Owned",
      apply: "Apply",
      notEnough: "Not enough coins",
      earnedToday: "Earned today",
    },
  };

  const LS = {
    SETTINGS: "serag.settings.v1",
    STATS: "serag.stats.v1",
    NOTES: "serag.notes.v1",
    MATERIALS: "serag.materials.v1",
    MISTAKES: "serag.mistakes.v1",
    SHOP: "serag.shop.v1",
    DAILY: "serag.daily.v1",
  };

  // ---------- Default Data ----------
  const DEFAULT_SETTINGS = {
    lang: "ar",
    accent: "iris",
    bg: "default",
    timerStyle: "classic",
    studyMin: 25,
    breakMin: 5,
    autoSwitch: true,
    soundOn: true,
    focusDefault: false,
    lighterDay: false,
    reviewFreqDays: 3,
  };

  const DEFAULT_STATS = {
    completedSessions: 0,
    totalStudyMinutes: 0,
    completedBreaks: 0,
    totalBreakMinutes: 0,
    streak: 0,
    lastActiveDay: null, // YYYY-MM-DD
    dailyMinutes: {}, // { 'YYYY-MM-DD': minutes }
    subjectMinutes: {}, // { subjectKey: minutes }
  };

  const DEFAULT_SHOP = {
    coins: 0,
    owned: {
      timerStyles: ["classic"],
      bgs: ["default"],
    },
    active: {
      timerStyle: "classic",
      bg: "default",
    },
    earnedToday: {}, // { 'YYYY-MM-DD': coins }
  };

  // ---------- State ----------
  let settings = safeJSON.get(LS.SETTINGS, DEFAULT_SETTINGS);
  let stats = safeJSON.get(LS.STATS, DEFAULT_STATS);
  let materials = safeJSON.get(LS.MATERIALS, []); // [{id,name,goals:[{id,text,done,createdAt}]}]
  let mistakes = safeJSON.get(LS.MISTAKES, []); // custom objects
  let shop = safeJSON.get(LS.SHOP, DEFAULT_SHOP);
  let notes = safeJSON.get(LS.NOTES, { sessionNotes: "" });
  let daily = safeJSON.get(LS.DAILY, { planDone: {}, focusPick: null }); // planDone: {goalId:true}

  // ---------- DOM ----------
  const dom = {
    backdrop: $("#backdrop"),
    drawer: $("#drawer"),
    drawerClose: $("#drawerClose"),
    menuBtn: $("#menuBtn"),
    pageTitle: $("#pageTitle"),

    langAR: $("#langAR"),
    langEN: $("#langEN"),
    muteBtn: $("#muteBtn"),
    focusBtn: $("#focusBtn"),
    focusCalloutBtn: $("#focusCalloutBtn"),

    // Tabs buttons
    navBtns: $$('[data-tab]'),

    // Home
    todayFocus: $("#todayFocus"),
    miniSessions: $("#miniSessions"),
    miniMinutes: $("#miniMinutes"),
    miniPlan: $("#miniPlan"),
    miniStreak: $("#miniStreak"),

    // Timer
    ring: $("#ring"),
    timerClock: $("#timerClock"),
    timerModePill: $("#timerModePill"),
    timerModeLabel: $("#timerModeLabel"),
    timerHint: $("#timerHint"),
    btnStart: $("#btnStart"),
    btnPause: $("#btnPause"),
    btnReset: $("#btnReset"),
    btnNext: $("#btnNext"),
    studyMin: $("#studyMin"),
    breakMin: $("#breakMin"),
    autoSwitch: $("#autoSwitch"),

    // Notes
    sessionNotes: $("#sessionNotes"),
    saveNotes: $("#saveNotes"),
    clearNotes: $("#clearNotes"),
    notesStatus: $("#notesStatus"),

    // Metrics in sessions
    mStudySessions: $("#mStudySessions"),
    mStudyMinutes: $("#mStudyMinutes"),
    mBreaks: $("#mBreaks"),
    mBreakMinutes: $("#mBreakMinutes"),

    // Materials
    materialsCountText: $("#materialsCountText"),
    matName: $("#matName"),
    addMaterial: $("#addMaterial"),
    materialsList: $("#materialsList"),
    matEmpty: $("#matEmpty"),
    matPanel: $("#matPanel"),
    matActiveHint: $("#matActiveHint"),
    matProgressText: $("#matProgressText"),
    matProgressBar: $("#matProgressBar"),
    goalText: $("#goalText"),
    addGoal: $("#addGoal"),
    goalsList: $("#goalsList"),

    // Stats
    sCompletedSessions: $("#sCompletedSessions"),
    sTotalMinutes: $("#sTotalMinutes"),
    sPlanCompletion: $("#sPlanCompletion"),
    sStreak: $("#sStreak"),
    trendText: $("#trendText"),
    consistencyText: $("#consistencyText"),
    focusScoreText: $("#focusScoreText"),
    weeklyChart: $("#weeklyChart"),
    subjectBars: $("#subjectBars"),
    resetStats: $("#resetStats"),
    resetAll: $("#resetAll"),
    timeInsightChip: $("#timeInsightChip"),

    // Mistakes
    mistakeForm: $("#mistakeForm"),
    mSubject: $("#mSubject"),
    mTitle: $("#mTitle"),
    mWrong: $("#mWrong"),
    mCorrect: $("#mCorrect"),
    mFix: $("#mFix"),
    mTags: $("#mTags"),
    mMastered: $("#mMastered"),
    mSearch: $("#mSearch"),
    mFilter: $("#mFilter"),
    mistakeList: $("#mistakeList"),
    reviewToday: $("#reviewToday"),
    exportMistakes: $("#exportMistakes"),
    importMistakes: $("#importMistakes"),
    reviewModal: $("#reviewModal"),
    reviewBody: $("#reviewBody"),
    closeReview: $("#closeReview"),
    closeReview2: $("#closeReview2"),

    // Settings
    setStudyMin: $("#setStudyMin"),
    setBreakMin: $("#setBreakMin"),
    setAutoSwitch: $("#setAutoSwitch"),
    setSound: $("#setSound"),
    setFocusDefault: $("#setFocusDefault"),
    setLighterDay: $("#setLighterDay"),
    setReviewFreq: $("#setReviewFreq"),
    saveDurations: $("#saveDurations"),

    accentBtns: $$(".accent"),
    exportAll: $("#exportAll"),
    importAllFile: $("#importAllFile"),

    // Shop mount
    shopMount: $("#shopMount"),
  };

  // ---------- Apply settings to UI ----------
  function applyRootSettings() {
    document.documentElement.setAttribute("dir", settings.lang === "ar" ? "rtl" : "ltr");
    document.body.dataset.accent = settings.accent;
    document.body.dataset.bg = shop.active.bg || settings.bg;
    document.body.dataset.timerstyle = shop.active.timerStyle || settings.timerStyle;

    // active seg buttons
    dom.langAR?.classList.toggle("is-active", settings.lang === "ar");
    dom.langEN?.classList.toggle("is-active", settings.lang === "en");

    // focus default
    document.body.classList.toggle("is-focus", !!settings.focusDefault);
    dom.focusBtn?.setAttribute("aria-pressed", settings.focusDefault ? "true" : "false");

    // mute icon
    setMuteIcon();
  }

  function setMuteIcon() {
    const i = dom.muteBtn?.querySelector("i");
    if (!i) return;
    i.setAttribute("data-lucide", settings.soundOn ? "volume-2" : "volume-x");
    refreshIcons();
  }

  function t(key) {
    const lang = settings.lang || "ar";
    return (I18N[lang] && I18N[lang][key]) || key;
  }

  function applyI18n() {
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });

    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      el.setAttribute("placeholder", t(key));
    });
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  // ---------- Tabs ----------
  function setActiveTab(tab) {
    // panels
    $$(".tab").forEach((p) => p.classList.remove("is-active"));
    const panel = $(`#tab-${tab}`);
    if (panel) panel.classList.add("is-active");

    // buttons
    dom.navBtns.forEach((b) => b.classList.toggle("is-active", b.dataset.tab === tab));

    // title
    const titleKey = tab === "home" ? "tabHome"
      : tab === "sessions" ? "tabSessions"
      : tab === "materials" ? "tabMaterials"
      : tab === "stats" ? "tabStats"
      : tab === "mistakes" ? "tabMistakes"
      : tab === "settings" ? "tabSettings"
      : "tabHome";
    if (dom.pageTitle) dom.pageTitle.textContent = t(titleKey);

    // close drawer on mobile
    closeDrawer();
    // focus content for accessibility
    $("#content")?.focus();

    // per-tab updates
    if (tab === "home") renderHome();
    if (tab === "materials") renderMaterials();
    if (tab === "stats") renderStats();
    if (tab === "mistakes") renderMistakes();
  }

  function openDrawer() {
    if (!dom.drawer || !dom.backdrop) return;
    dom.drawer.classList.add("is-open");
    dom.drawer.setAttribute("aria-hidden", "false");
    dom.backdrop.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (!dom.drawer || !dom.backdrop) return;
    dom.drawer.classList.remove("is-open");
    dom.drawer.setAttribute("aria-hidden", "true");
    dom.backdrop.hidden = true;
    document.body.style.overflow = "";
  }

  // ---------- Timer ----------
  const timer = {
    mode: "study", // 'study' | 'break'
    running: false,
    startedAt: null,
    remainingMs: 25 * 60 * 1000,
    tickId: null,
  };

  function initTimerFromSettings() {
    const s = clamp(Number(settings.studyMin || 25), 10, 90);
    const b = clamp(Number(settings.breakMin || 5), 3, 30);
    timer.mode = "study";
    timer.running = false;
    timer.startedAt = null;
    timer.remainingMs = s * 60 * 1000;

    if (dom.studyMin) dom.studyMin.value = s;
    if (dom.breakMin) dom.breakMin.value = b;
    if (dom.autoSwitch) dom.autoSwitch.checked = !!settings.autoSwitch;

    if (dom.setStudyMin) dom.setStudyMin.value = s;
    if (dom.setBreakMin) dom.setBreakMin.value = b;
    if (dom.setAutoSwitch) dom.setAutoSwitch.checked = !!settings.autoSwitch;
    if (dom.setSound) dom.setSound.checked = !!settings.soundOn;
    if (dom.setFocusDefault) dom.setFocusDefault.checked = !!settings.focusDefault;
    if (dom.setLighterDay) dom.setLighterDay.checked = !!settings.lighterDay;
    if (dom.setReviewFreq) dom.setReviewFreq.value = String(settings.reviewFreqDays || 3);

    updateTimerUI();
    drawRing(0);
  }

  function updateTimerUI() {
    if (dom.timerClock) dom.timerClock.textContent = msToClock(timer.remainingMs);
    if (dom.timerModeLabel) dom.timerModeLabel.textContent = timer.mode === "study" ? t("modeStudy") : t("modeBreak");

    // mode dot color via inline style
    const dot = dom.timerModePill?.querySelector(".dot");
    if (dot) {
      dot.style.background = timer.mode === "study" ? "var(--ok)" : "var(--warn)";
      dot.style.boxShadow = timer.mode === "study"
        ? "0 0 0 4px rgba(57,229,140,.12)"
        : "0 0 0 4px rgba(255,209,102,.14)";
    }

    if (dom.timerHint) {
      dom.timerHint.textContent = timer.running ? (timer.mode === "study" ? t("modeStudy") : t("modeBreak")) : t("timerHint");
    }
  }

  function drawRing(progress01) {
    const c = dom.ring;
    if (!c) return;
    const ctx = c.getContext("2d");
    const w = c.width, h = c.height;
    const cx = w / 2, cy = h / 2;
    const r = Math.min(w, h) / 2 - 14;

    ctx.clearRect(0, 0, w, h);

    // base ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,.10)";
    ctx.lineWidth = 12;
    ctx.stroke();

    // progress ring
    const start = -Math.PI / 2;
    const end = start + Math.PI * 2 * clamp(progress01, 0, 1);

    // gradient (reads CSS vars)
    const s = getComputedStyle(document.body);
    const a1 = s.getPropertyValue("--accent1").trim() || "#7c5cff";
    const a2 = s.getPropertyValue("--accent2").trim() || "#37d7ff";

    const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    grad.addColorStop(0, a1);
    grad.addColorStop(1, a2);

    ctx.beginPath();
    ctx.arc(cx, cy, r, start, end);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.shadowColor = a1;
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function beep() {
    if (!settings.soundOn) return;
    // quick WebAudio beep
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.value = 0.06;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, 160);
    } catch {}
  }

  function addStudyMinutes(minutes, subjectKey = null) {
    stats.totalStudyMinutes += minutes;
    const day = todayKey();
    stats.dailyMinutes[day] = (stats.dailyMinutes[day] || 0) + minutes;
    if (subjectKey) {
      stats.subjectMinutes[subjectKey] = (stats.subjectMinutes[subjectKey] || 0) + minutes;
    }
  }

  function addBreakMinutes(minutes) {
    stats.totalBreakMinutes += minutes;
  }

  function bumpStreak() {
    const day = todayKey();
    if (stats.lastActiveDay === day) return; // already counted today

    if (!stats.lastActiveDay) {
      stats.streak = 1;
      stats.lastActiveDay = day;
      return;
    }

    // compare with yesterday
    const last = new Date(stats.lastActiveDay + "T00:00:00");
    const cur = new Date(day + "T00:00:00");
    const diffDays = Math.round((cur - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      stats.streak += 1;
    } else if (diffDays > 1) {
      stats.streak = 1;
    }
    stats.lastActiveDay = day;
  }

  function timerStart() {
    if (timer.running) return;
    timer.running = true;
    timer.startedAt = Date.now();
    const totalMs = (timer.mode === "study" ? settings.studyMin : settings.breakMin) * 60 * 1000;
    // keep remainingMs if resumed, else clamp
    timer.remainingMs = clamp(timer.remainingMs, 0, totalMs);

    tick();
    timer.tickId = setInterval(tick, 250);
    updateTimerUI();
    toast(timer.mode === "study" ? "ابدأ…" : "راحة…");
  }

  function timerPause() {
    if (!timer.running) return;
    timer.running = false;
    clearInterval(timer.tickId);
    timer.tickId = null;
    updateTimerUI();
    toast("تم الإيقاف");
  }

  function timerReset() {
    timerPause();
    timer.mode = "study";
    timer.remainingMs = clamp(settings.studyMin, 10, 90) * 60 * 1000;
    updateTimerUI();
    drawRing(0);
    toast("إعادة ضبط");
  }

  function timerNext() {
    timerPause();
    timer.mode = timer.mode === "study" ? "break" : "study";
    timer.remainingMs = (timer.mode === "study" ? settings.studyMin : settings.breakMin) * 60 * 1000;
    updateTimerUI();
    drawRing(0);
    toast("التالي");
  }

  function tick() {
    if (!timer.running) return;
    const totalMs = (timer.mode === "study" ? settings.studyMin : settings.breakMin) * 60 * 1000;
    timer.remainingMs -= 250;

    const progress = 1 - (timer.remainingMs / totalMs);
    drawRing(progress);
    updateTimerUI();

    if (timer.remainingMs <= 0) {
      timerComplete();
    }
  }

  function timerComplete() {
    timerPause();
    drawRing(1);
    beep();

    const mins = timer.mode === "study" ? clamp(settings.studyMin, 10, 90) : clamp(settings.breakMin, 3, 30);

    if (timer.mode === "study") {
      stats.completedSessions += 1;
      addStudyMinutes(mins);
      bumpStreak();
      awardCoins(mins);
    } else {
      stats.completedBreaks += 1;
      addBreakMinutes(mins);
    }

    safeJSON.set(LS.STATS, stats);
    renderHome();
    renderSessionsMetrics();
    renderStats();
    renderTimeInsight();

    if (settings.autoSwitch) {
      timerNext();
      setTimeout(() => timerStart(), 450);
    }
  }

  // ---------- Coins + Shop ----------
  const SHOP_ITEMS = {
    timerStyles: [
      { id: "classic", nameAr: "كلاسيك", nameEn: "Classic", price: 0, descAr: "الأساس", descEn: "Default" },
      { id: "neon", nameAr: "نيون", nameEn: "Neon", price: 60, descAr: "إضاءة قوية", descEn: "Bright glow" },
      { id: "ice", nameAr: "ثلجي", nameEn: "Ice", price: 90, descAr: "بارد ونظيف", descEn: "Cold clean" },
      { id: "emberGlow", nameAr: "جمري", nameEn: "Ember", price: 90, descAr: "دافئ", descEn: "Warm" },
      { id: "mintPulse", nameAr: "نعناعي", nameEn: "Mint", price: 120, descAr: "هدوء", descEn: "Calm" },
      { id: "rose", nameAr: "وردي", nameEn: "Rose", price: 120, descAr: "لمسة وردية", descEn: "Rose vibe" },
      { id: "golden", nameAr: "ذهبي", nameEn: "Golden", price: 150, descAr: "فخم", descEn: "Premium" },
    ],
    bgs: [
      { id: "default", nameAr: "افتراضي", nameEn: "Default", price: 0, descAr: "الخلفية الأساسية", descEn: "Base background" },
      { id: "crimson", nameAr: "قرمزي", nameEn: "Crimson", price: 80, descAr: "نبض قوي", descEn: "Pulse" },
      { id: "violet", nameAr: "بنفسجي", nameEn: "Violet", price: 80, descAr: "هادئ", descEn: "Soft" },
      { id: "emerald", nameAr: "زمردي", nameEn: "Emerald", price: 100, descAr: "منعش", descEn: "Fresh" },
      { id: "gold", nameAr: "ذهبي", nameEn: "Gold", price: 120, descAr: "لمعة", descEn: "Shine" },
      { id: "cyber", nameAr: "سايبر", nameEn: "Cyber", price: 150, descAr: "مسح ضوئي", descEn: "Scan" },
    ],
  };

  function awardCoins(studyMinutes) {
    // 1 coin per 5 minutes, minimum 1, with daily cap
    const day = todayKey();
    const earned = shop.earnedToday[day] || 0;
    const cap = 80; // cap per day
    const add = clamp(Math.floor(studyMinutes / 5), 1, 20);

    if (earned >= cap) return;

    const canAdd = Math.min(add, cap - earned);
    shop.coins += canAdd;
    shop.earnedToday[day] = earned + canAdd;
    safeJSON.set(LS.SHOP, shop);
    renderShop();
    renderHome();
  }

  function hasOwned(type, id) {
    return (shop.owned[type] || []).includes(id);
  }

  function buyItem(type, id, price) {
    if (hasOwned(type, id)) return;
    if (shop.coins < price) {
      toast(t("notEnough"));
      return;
    }
    shop.coins -= price;
    shop.owned[type] = shop.owned[type] || [];
    shop.owned[type].push(id);
    safeJSON.set(LS.SHOP, shop);
    renderShop();
    toast("تم الشراء");
  }

  function applyItem(type, id) {
    if (!hasOwned(type, id)) return;
    if (type === "timerStyles") shop.active.timerStyle = id;
    if (type === "bgs") shop.active.bg = id;
    safeJSON.set(LS.SHOP, shop);

    // Apply instantly
    document.body.dataset.bg = shop.active.bg;
    document.body.dataset.timerstyle = shop.active.timerStyle;

    renderShop();
    toast("تم التطبيق");
  }

  function renderShop() {
    if (!dom.shopMount) return;

    const lang = settings.lang || "ar";
    const day = todayKey();
    const earned = shop.earnedToday[day] || 0;

    const title = t("shopTitle");
    const desc = t("shopDesc");

    dom.shopMount.innerHTML = `
      <div class="shopTop">
        <div>
          <div class="shopTop__title">${title}</div>
          <div class="muted">${desc}</div>
        </div>
        <div class="shopCoins">
          <i data-lucide="coins"></i>
          <span>${t("coins")}: <b>${shop.coins}</b></span>
        </div>
      </div>

      <div class="chip">
        <i data-lucide="sparkles"></i>
        <span>${t("earnedToday")}: <b>${earned}</b></span>
      </div>

      <div class="shopGrid" aria-label="Shop items">
        ${renderShopGroup("timerStyles", SHOP_ITEMS.timerStyles, lang)}
        ${renderShopGroup("bgs", SHOP_ITEMS.bgs, lang)}
      </div>
    `;
    refreshIcons();
  }

  function renderShopGroup(type, items, lang) {
    const groupTitle = type === "timerStyles"
      ? (lang === "ar" ? "ستايلات المؤقت" : "Timer styles")
      : (lang === "ar" ? "الخلفيات" : "Backgrounds");

    return `
      <div class="shopItem">
        <div class="shopItem__head">
          <div>
            <div class="shopItem__title">${groupTitle}</div>
            <div class="shopItem__meta">${lang === "ar" ? "اختَر واشترِ" : "Pick & buy"}</div>
          </div>
        </div>

        ${items.map(it => renderShopCard(type, it, lang)).join("")}
      </div>
    `;
  }

  function renderShopCard(type, it, lang) {
    const owned = hasOwned(type, it.id);
    const active = (type === "timerStyles" && shop.active.timerStyle === it.id) ||
                   (type === "bgs" && shop.active.bg === it.id);

    const name = lang === "ar" ? it.nameAr : it.nameEn;
    const desc = lang === "ar" ? it.descAr : it.descEn;

    const buyLabel = t("buy");
    const applyLabel = t("apply");
    const ownedLabel = t("owned");

    const pricePart = owned ? `<span class="ownedTag">${ownedLabel}</span>` : `<span class="priceTag">${it.price} ${t("coins")}</span>`;

    const canBuy = !owned && shop.coins >= it.price;

    // Preview bar
    const previewStyle =
      type === "bgs"
        ? `data-bg="${it.id}"`
        : `data-timerstyle="${it.id}"`;

    const activeBadge = active ? `<span class="badge"><i data-lucide="check-circle-2"></i>${lang === "ar" ? "مفعّل" : "Active"}</span>` : "";

    return `
      <div class="mRow">
        <div class="mRow__main">
          <div class="mRow__title">${name} ${activeBadge}</div>
          <div class="mRow__meta">${desc} • ${pricePart}</div>
          <div class="shopItem__preview" ${previewStyle}></div>
        </div>
        <div class="mRow__actions">
          ${owned ? `
            <button class="btn btn--soft" data-action="apply" data-type="${type}" data-id="${it.id}" type="button" ${active ? "disabled" : ""}>
              <i data-lucide="wand-2"></i><span>${applyLabel}</span>
            </button>
          ` : `
            <button class="btn btn--primary" data-action="buy" data-type="${type}" data-id="${it.id}" data-price="${it.price}" type="button" ${canBuy ? "" : "disabled"}>
              <i data-lucide="shopping-bag"></i><span>${buyLabel}</span>
            </button>
          `}
        </div>
      </div>
    `;
  }

  // ---------- Materials ----------
  let activeMaterialId = null;

  function materialById(id) {
    return materials.find((m) => m.id === id);
  }

  function renderMaterials() {
    if (!dom.materialsList || !dom.materialsCountText) return;

    dom.materialsCountText.textContent =
      settings.lang === "ar"
        ? `${materials.length}/12 مادة`
        : `${materials.length}/12 subjects`;

    dom.materialsList.innerHTML = materials
      .map((m) => {
        const total = m.goals?.length || 0;
        const done = (m.goals || []).filter((g) => g.done).length;
        const pct = total ? Math.round((done / total) * 100) : 0;

        const isActive = activeMaterialId === m.id;
        return `
          <div class="mRow" data-mid="${m.id}" style="border-color:${isActive ? "rgba(124,92,255,.35)" : "rgba(255,255,255,.08)"}">
            <div class="mRow__main">
              <div class="mRow__title">${escapeHTML(m.name)}</div>
              <div class="mRow__meta">${settings.lang === "ar" ? "أهداف" : "Goals"}: ${done}/${total} • ${pct}%</div>
            </div>
            <div class="mRow__actions">
              <button class="btn btn--soft smallBtn" data-action="open" data-mid="${m.id}" type="button">
                <i data-lucide="folder-open"></i><span>${settings.lang === "ar" ? "فتح" : "Open"}</span>
              </button>
              <button class="btn btn--ghost smallBtn" data-action="del" data-mid="${m.id}" type="button">
                <i data-lucide="trash-2"></i><span>${settings.lang === "ar" ? "حذف" : "Delete"}</span>
              </button>
            </div>
          </div>
        `;
      })
      .join("");

    // Right panel
    const m = activeMaterialId ? materialById(activeMaterialId) : null;

    if (!m) {
      if (dom.matEmpty) dom.matEmpty.hidden = false;
      if (dom.matPanel) dom.matPanel.hidden = true;
      if (dom.matActiveHint) dom.matActiveHint.textContent = "—";
    } else {
      if (dom.matEmpty) dom.matEmpty.hidden = true;
      if (dom.matPanel) dom.matPanel.hidden = false;
      if (dom.matActiveHint) dom.matActiveHint.textContent = m.name;

      const total = m.goals?.length || 0;
      const done = (m.goals || []).filter((g) => g.done).length;
      const pct = total ? Math.round((done / total) * 100) : 0;

      if (dom.matProgressText) dom.matProgressText.textContent = `${pct}%`;
      if (dom.matProgressBar) dom.matProgressBar.style.width = `${pct}%`;

      if (dom.goalsList) {
        dom.goalsList.innerHTML = (m.goals || [])
          .slice()
          .sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1))
          .map((g) => `
            <div class="mRow">
              <div class="mRow__main">
                <div class="mRow__title ${g.done ? "goalDone" : ""}">${escapeHTML(g.text)}</div>
                <div class="mRow__meta">${new Date(g.createdAt).toLocaleDateString()}</div>
              </div>
              <div class="mRow__actions">
                <button class="btn btn--soft smallBtn" data-action="toggleGoal" data-mid="${m.id}" data-gid="${g.id}" type="button">
                  <i data-lucide="${g.done ? "undo-2" : "check"}"></i>
                  <span>${settings.lang === "ar" ? (g.done ? "إرجاع" : "تم") : (g.done ? "Undo" : "Done")}</span>
                </button>
                <button class="btn btn--ghost smallBtn" data-action="delGoal" data-mid="${m.id}" data-gid="${g.id}" type="button">
                  <i data-lucide="trash-2"></i><span>${settings.lang === "ar" ? "حذف" : "Delete"}</span>
                </button>
              </div>
            </div>
          `)
          .join("");
      }
    }

    refreshIcons();
  }

  function addMaterial(name) {
    const trimmed = (name || "").trim();
    if (!trimmed) return;
    if (materials.length >= 12) {
      toast("وصلت الحد");
      return;
    }
    materials.push({ id: uid(), name: trimmed, goals: [] });
    safeJSON.set(LS.MATERIALS, materials);
    renderMaterials();
  }

  function deleteMaterial(id) {
    materials = materials.filter((m) => m.id !== id);
    if (activeMaterialId === id) activeMaterialId = null;
    safeJSON.set(LS.MATERIALS, materials);
    renderMaterials();
    renderStats();
  }

  function addGoalToActive(text) {
    const m = activeMaterialId ? materialById(activeMaterialId) : null;
    if (!m) return;
    const trimmed = (text || "").trim();
    if (!trimmed) return;
    m.goals = m.goals || [];
    m.goals.push({ id: uid(), text: trimmed, done: false, createdAt: nowISO() });
    safeJSON.set(LS.MATERIALS, materials);
    renderMaterials();
  }

  function toggleGoal(mid, gid) {
    const m = materialById(mid);
    if (!m) return;
    const g = (m.goals || []).find((x) => x.id === gid);
    if (!g) return;
    g.done = !g.done;
    safeJSON.set(LS.MATERIALS, materials);
    renderMaterials();
    renderHome();
    renderStats();
  }

  function deleteGoal(mid, gid) {
    const m = materialById(mid);
    if (!m) return;
    m.goals = (m.goals || []).filter((x) => x.id !== gid);
    safeJSON.set(LS.MATERIALS, materials);
    renderMaterials();
    renderHome();
    renderStats();
  }

  // ---------- Mistakes ----------
  function buildMistake(obj) {
    const base = {
      id: uid(),
      createdAt: nowISO(),
      subject: obj.subject || "history",
      title: obj.title || "",
      wrong: obj.wrong || "",
      correct: obj.correct || "",
      fix: obj.fix || "",
      tags: obj.tags || [],
      mastered: !!obj.mastered,
      lastReviewed: null,
      nextReviewAt: null, // ISO
      reviews: 0,
    };
    // schedule next review (tomorrow)
    base.nextReviewAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    return base;
  }

  function dueForReview(m) {
    if (!m.nextReviewAt) return true;
    return new Date(m.nextReviewAt).getTime() <= Date.now();
  }

  function scheduleNext(m) {
    // 1/3/7/14 days spaced repetition
    const steps = [1, 3, 7, 14];
    const idx = clamp(m.reviews, 0, steps.length - 1);
    const days = steps[idx];
    m.lastReviewed = nowISO();
    m.nextReviewAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    m.reviews += 1;
  }

  function renderMistakes() {
    if (!dom.mistakeList) return;
    const q = (dom.mSearch?.value || "").trim().toLowerCase();
    const f = dom.mFilter?.value || "all";

    const list = mistakes
      .filter((m) => (f === "all" ? true : m.subject === f))
      .filter((m) => {
        if (!q) return true;
        const hay = `${m.title} ${m.wrong} ${m.correct} ${m.fix} ${(m.tags || []).join(" ")}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => {
        // due first
        const ad = dueForReview(a) ? 0 : 1;
        const bd = dueForReview(b) ? 0 : 1;
        if (ad !== bd) return ad - bd;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

    dom.mistakeList.innerHTML = list.map(renderMistakeCard).join("");
    refreshIcons();
  }

  function renderMistakeCard(m) {
    const due = dueForReview(m);
    const lang = settings.lang;

    const subjName = lang === "ar"
      ? (m.subject === "history" ? "تاريخ" : m.subject === "religion" ? "دين" : m.subject === "english" ? "إنجليزي" : "عربي")
      : (m.subject === "history" ? "History" : m.subject === "religion" ? "Religion" : m.subject === "english" ? "English" : "Arabic");

    const dueLabel = due ? (lang === "ar" ? "مستحق للمراجعة" : "Due") : (lang === "ar" ? "ليس الآن" : "Not due");
    const mastered = m.mastered ? (lang === "ar" ? "متقن" : "Mastered") : (lang === "ar" ? "غير متقن" : "Not mastered");

    const next = m.nextReviewAt ? new Date(m.nextReviewAt).toLocaleDateString() : "—";
    const tags = (m.tags || []).length ? (m.tags || []).map((x) => `<span class="badge">#${escapeHTML(x)}</span>`).join(" ") : "";

    return `
      <div class="mCard" data-mid="${m.id}">
        <div class="mCard__top">
          <div>
            <div class="mCard__title">${escapeHTML(m.title)}</div>
            <div class="mCard__meta">${subjName} • ${dueLabel} • ${mastered} • ${lang === "ar" ? "المراجعة القادمة" : "Next"}: ${next}</div>
          </div>
          <div class="mCard__actions">
            <button class="btn btn--soft smallBtn" data-action="reviewOne" data-id="${m.id}" type="button">
              <i data-lucide="repeat"></i><span>${lang === "ar" ? "راجِع" : "Review"}</span>
            </button>
            <button class="btn btn--ghost smallBtn" data-action="toggleMastered" data-id="${m.id}" type="button">
              <i data-lucide="${m.mastered ? "badge-check" : "badge"}"></i><span>${lang === "ar" ? "تبديل الإتقان" : "Toggle"}</span>
            </button>
            <button class="btn btn--ghost smallBtn" data-action="delMistake" data-id="${m.id}" type="button">
              <i data-lucide="trash-2"></i><span>${lang === "ar" ? "حذف" : "Delete"}</span>
            </button>
          </div>
        </div>
        <div class="mCard__body">
          <div><b>${lang === "ar" ? "الغلط:" : "Wrong:"}</b> ${escapeHTML(m.wrong)}</div>
          <div style="margin-top:6px"><b>${lang === "ar" ? "الصحيح:" : "Correct:"}</b> ${escapeHTML(m.correct)}</div>
          <div style="margin-top:6px"><b>${lang === "ar" ? "الإجراء:" : "Action:"}</b> ${escapeHTML(m.fix)}</div>
          ${tags ? `<div style="margin-top:8px">${tags}</div>` : ""}
        </div>
      </div>
    `;
  }

  function addMistakeFromForm() {
    const subject = dom.mSubject?.value || "history";
    const title = (dom.mTitle?.value || "").trim();
    const wrong = (dom.mWrong?.value || "").trim();
    const correct = (dom.mCorrect?.value || "").trim();
    const fix = (dom.mFix?.value || "").trim();
    const tags = (dom.mTags?.value || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    const mastered = !!dom.mMastered?.checked;

    if (!title || !wrong || !correct || !fix) return;

    mistakes.push(buildMistake({ subject, title, wrong, correct, fix, tags, mastered }));
    safeJSON.set(LS.MISTAKES, mistakes);

    // clear
    dom.mTitle.value = "";
    dom.mWrong.value = "";
    dom.mCorrect.value = "";
    dom.mFix.value = "";
    dom.mTags.value = "";
    dom.mMastered.checked = false;

    renderMistakes();
    renderHome();
    renderStats();
  }

  function deleteMistake(id) {
    mistakes = mistakes.filter((m) => m.id !== id);
    safeJSON.set(LS.MISTAKES, mistakes);
    renderMistakes();
    renderStats();
  }

  function toggleMastered(id) {
    const m = mistakes.find((x) => x.id === id);
    if (!m) return;
    m.mastered = !m.mastered;
    safeJSON.set(LS.MISTAKES, mistakes);
    renderMistakes();
  }

  function reviewOne(id) {
    const m = mistakes.find((x) => x.id === id);
    if (!m) return;
    scheduleNext(m);
    safeJSON.set(LS.MISTAKES, mistakes);
    toast(settings.lang === "ar" ? "تمت المراجعة" : "Reviewed");
    renderMistakes();
  }

  function reviewToday() {
    const due = mistakes.filter(dueForReview);
    const lang = settings.lang;

    if (!dom.reviewModal || !dom.reviewBody) return;

    if (!due.length) {
      dom.reviewBody.innerHTML = `<div class="muted">${lang === "ar" ? "لا يوجد عناصر للمراجعة اليوم." : "No items due today."}</div>`;
    } else {
      dom.reviewBody.innerHTML = due
        .map((m) => `
          <div class="mCard" style="margin-bottom:10px">
            <div class="mCard__title">${escapeHTML(m.title)}</div>
            <div class="mCard__body">
              <div><b>${lang === "ar" ? "الغلط:" : "Wrong:"}</b> ${escapeHTML(m.wrong)}</div>
              <div style="margin-top:6px"><b>${lang === "ar" ? "الصحيح:" : "Correct:"}</b> ${escapeHTML(m.correct)}</div>
              <div style="margin-top:6px"><b>${lang === "ar" ? "الإجراء:" : "Action:"}</b> ${escapeHTML(m.fix)}</div>
              <div style="margin-top:10px">
                <button class="btn btn--soft smallBtn" data-action="reviewDue" data-id="${m.id}" type="button">
                  <i data-lucide="check-circle-2"></i><span>${lang === "ar" ? "تمت المراجعة" : "Mark reviewed"}</span>
                </button>
              </div>
            </div>
          </div>
        `)
        .join("");
    }

    dom.reviewModal.showModal();
    refreshIcons();
  }

  // ---------- Home + Stats ----------
  function planProgress() {
    // progress based on materials goals done (today) OR overall
    const allGoals = materials.flatMap((m) => (m.goals || []).map((g) => ({ ...g, mat: m.name })));
    const total = allGoals.length;
    const done = allGoals.filter((g) => g.done).length;
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function pickTodayFocus() {
    // choose first undone goal from any material
    const all = [];
    for (const m of materials) {
      for (const g of (m.goals || [])) {
        if (!g.done) all.push({ mid: m.id, mat: m.name, gid: g.id, text: g.text });
      }
    }
    return all[0] || null;
  }

  function renderHome() {
    const p = planProgress();

    if (dom.miniSessions) dom.miniSessions.textContent = String(stats.completedSessions || 0);
    if (dom.miniMinutes) dom.miniMinutes.textContent = String(stats.totalStudyMinutes || 0);
    if (dom.miniPlan) dom.miniPlan.textContent = `${p.pct || 0}%`;
    if (dom.miniStreak) dom.miniStreak.textContent = String(stats.streak || 0);

    if (dom.todayFocus) {
      const focus = pickTodayFocus();
      if (!focus) {
        dom.todayFocus.innerHTML = `<div class="muted">${settings.lang === "ar" ? "اعمل خطتك لليوم    ." : "Add goals to subjects to show here."}</div>`;
      } else {
        dom.todayFocus.innerHTML = `
          <div style="font-weight:950">${escapeHTML(focus.mat)}</div>
          <div class="muted" style="margin-top:6px; line-height:1.6">${escapeHTML(focus.text)}</div>
        `;
      }
    }
  }

  function renderSessionsMetrics() {
    if (dom.mStudySessions) dom.mStudySessions.textContent = String(stats.completedSessions || 0);
    if (dom.mStudyMinutes) dom.mStudyMinutes.textContent = String(stats.totalStudyMinutes || 0);
    if (dom.mBreaks) dom.mBreaks.textContent = String(stats.completedBreaks || 0);
    if (dom.mBreakMinutes) dom.mBreakMinutes.textContent = String(stats.totalBreakMinutes || 0);
  }

  function renderStats() {
    if (!dom.weeklyChart) return;

    const p = planProgress();
    if (dom.sCompletedSessions) dom.sCompletedSessions.textContent = String(stats.completedSessions || 0);
    if (dom.sTotalMinutes) dom.sTotalMinutes.textContent = String(stats.totalStudyMinutes || 0);
    if (dom.sPlanCompletion) dom.sPlanCompletion.textContent = `${p.pct || 0}%`;
    if (dom.sStreak) dom.sStreak.textContent = String(stats.streak || 0);

    // insights
    const { trend, consistency, focusScore } = calcInsights();
    if (dom.trendText) dom.trendText.textContent = trend;
    if (dom.consistencyText) dom.consistencyText.textContent = consistency;
    if (dom.focusScoreText) dom.focusScoreText.textContent = focusScore;

    drawWeeklyChart();
    renderSubjectBars();
  }

  function calcInsights() {
    const lang = settings.lang;

    // trend: compare last 3 days vs previous 3 days
    const days = lastNDays(7);
    const mins = days.map((d) => stats.dailyMinutes[d] || 0);
    const a = (mins[6] + mins[5] + mins[4]) || 0;
    const b = (mins[3] + mins[2] + mins[1]) || 0;

    let trend = "";
    if (a === 0 && b === 0) {
      trend = lang === "ar" ? "لا يوجد بيانات كافية للترند." : "Not enough data for trend.";
    } else if (a >= b) {
      trend = lang === "ar" ? "ترندك صاعد ✅" : "Trend: up ✅";
    } else {
      trend = lang === "ar" ? "ترندك نازل — شد حيلك." : "Trend: down — push.";
    }

    // consistency: days with >= 25 minutes in last 7 days
    const good = mins.filter((x) => x >= 25).length;
    const consistency = lang === "ar"
      ? `اتساق الأسبوع: ${good}/7 أيام`
      : `Consistency: ${good}/7 days`;

    // focus score: based on streak + avg minutes
    const avg = Math.round(mins.reduce((s, x) => s + x, 0) / 7);
    const score = clamp(Math.round(avg / 2 + (stats.streak || 0) * 2), 0, 100);
    const focusScore = lang === "ar"
      ? `نقاط التركيز: ${score}/100`
      : `Focus score: ${score}/100`;

    return { trend, consistency, focusScore };
  }

  function lastNDays(n) {
    const out = [];
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    for (let i = n - 1; i >= 0; i--) {
      const x = new Date(d);
      x.setDate(d.getDate() - i);
      out.push(x.toISOString().slice(0, 10));
    }
    return out;
  }

  function drawWeeklyChart() {
    const c = dom.weeklyChart;
    const ctx = c.getContext("2d");
    const w = c.width, h = c.height;
    ctx.clearRect(0, 0, w, h);

    const days = lastNDays(7);
    const vals = days.map((d) => stats.dailyMinutes[d] || 0);
    const max = Math.max(60, ...vals);

    // axes padding
    const padX = 28;
    const padY = 20;
    const baseY = h - padY;

    // grid
    ctx.strokeStyle = "rgba(255,255,255,.07)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padY + (i * (h - padY * 2)) / 4;
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(w - padX, y);
      ctx.stroke();
    }

    // bars
    const gap = 12;
    const barW = (w - padX * 2 - gap * 6) / 7;

    // gradient from CSS vars
    const s = getComputedStyle(document.body);
    const a1 = s.getPropertyValue("--accent1").trim() || "#7c5cff";
    const a2 = s.getPropertyValue("--accent2").trim() || "#37d7ff";
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, a1);
    grad.addColorStop(1, a2);

    ctx.fillStyle = grad;

    vals.forEach((v, i) => {
      const x = padX + i * (barW + gap);
      const bh = (v / max) * (h - padY * 2);
      const y = baseY - bh;
      roundRect(ctx, x, y, barW, bh, 10);
      ctx.fill();

      // label
      ctx.fillStyle = "rgba(234,240,255,.65)";
      ctx.font = "12px system-ui";
      const label = settings.lang === "ar" ? String(i + 1) : String(i + 1);
      ctx.fillText(label, x + barW / 2 - 3, h - 6);
      ctx.fillStyle = grad;
    });
  }

  function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function renderSubjectBars() {
    if (!dom.subjectBars) return;

    // If user uses materials, distribute based on goals counts as proxy
    const totals = {};
    for (const m of materials) {
      const totalGoals = (m.goals || []).length;
      if (!totalGoals) continue;
      totals[m.name] = totalGoals;
    }
    const entries = Object.entries(totals);
    if (!entries.length) {
      dom.subjectBars.innerHTML = `<div class="muted">${settings.lang === "ar" ? "أضف مواد/أهداف لرؤية التوزيع." : "Add subjects/goals to see distribution."}</div>`;
      return;
    }

    const sum = entries.reduce((s, [, v]) => s + v, 0);
    dom.subjectBars.innerHTML = entries
      .sort((a, b) => b[1] - a[1])
      .map(([name, v]) => {
        const pct = Math.round((v / sum) * 100);
        return `
          <div class="mRow">
            <div class="mRow__main">
              <div class="mRow__title">${escapeHTML(name)}</div>
              <div class="mRow__meta">${pct}%</div>
              <div class="mProg__bar" style="margin-top:10px"><span style="width:${pct}%"></span></div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function renderTimeInsight() {
    if (!dom.timeInsightChip) return;

    const day = todayKey();
    const minsToday = stats.dailyMinutes[day] || 0;
    const msg = settings.lang === "ar"
      ? (minsToday >= 60 ? "اليوم ممتاز 🔥" : minsToday >= 25 ? "اليوم جيد ✅" : "ابدأ 25 دقيقة اليوم")
      : (minsToday >= 60 ? "Great day 🔥" : minsToday >= 25 ? "Good ✅" : "Start 25 min today");

    dom.timeInsightChip.querySelector("span").textContent = msg;
  }

  // ---------- Notes ----------
  function initNotes() {
    if (dom.sessionNotes) dom.sessionNotes.value = notes.sessionNotes || "";
  }

  function saveNotes() {
    notes.sessionNotes = dom.sessionNotes?.value || "";
    safeJSON.set(LS.NOTES, notes);
    toast(settings.lang === "ar" ? "تم الحفظ" : "Saved");
  }

  function clearNotes() {
    if (dom.sessionNotes) dom.sessionNotes.value = "";
    notes.sessionNotes = "";
    safeJSON.set(LS.NOTES, notes);
    toast(settings.lang === "ar" ? "تم المسح" : "Cleared");
  }

  // ---------- Settings actions ----------
  function saveDurationsFromSettingsPanel() {
    const s = clamp(Number(dom.setStudyMin?.value || 25), 10, 90);
    const b = clamp(Number(dom.setBreakMin?.value || 5), 3, 30);
    settings.studyMin = s;
    settings.breakMin = b;
    settings.autoSwitch = !!dom.setAutoSwitch?.checked;
    settings.soundOn = !!dom.setSound?.checked;
    settings.focusDefault = !!dom.setFocusDefault?.checked;
    settings.lighterDay = !!dom.setLighterDay?.checked;
    settings.reviewFreqDays = clamp(Number(dom.setReviewFreq?.value || 3), 2, 4);

    safeJSON.set(LS.SETTINGS, settings);

    // apply to timer UI
    if (dom.studyMin) dom.studyMin.value = s;
    if (dom.breakMin) dom.breakMin.value = b;
    if (dom.autoSwitch) dom.autoSwitch.checked = settings.autoSwitch;

    initTimerFromSettings();
    applyRootSettings();
    applyI18n();
    renderShop();
    toast(settings.lang === "ar" ? "تم الحفظ" : "Saved");
  }

  // ---------- Export/Import ----------
  function downloadJSON(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function exportAll() {
    const pack = {
      settings,
      stats,
      materials,
      mistakes,
      shop,
      notes,
      daily,
      exportedAt: nowISO(),
      version: 1,
    };
    downloadJSON("serag-backup.json", pack);
  }

  function importAll(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.settings) settings = data.settings;
        if (data.stats) stats = data.stats;
        if (data.materials) materials = data.materials;
        if (data.mistakes) mistakes = data.mistakes;
        if (data.shop) shop = data.shop;
        if (data.notes) notes = data.notes;
        if (data.daily) daily = data.daily;

        safeJSON.set(LS.SETTINGS, settings);
        safeJSON.set(LS.STATS, stats);
        safeJSON.set(LS.MATERIALS, materials);
        safeJSON.set(LS.MISTAKES, mistakes);
        safeJSON.set(LS.SHOP, shop);
        safeJSON.set(LS.NOTES, notes);
        safeJSON.set(LS.DAILY, daily);

        boot();
        toast(settings.lang === "ar" ? "تم الاستيراد" : "Imported");
      } catch {
        toast(settings.lang === "ar" ? "ملف غير صالح" : "Invalid file");
      }
    };
    reader.readAsText(file);
  }

  function exportMistakes() {
    downloadJSON("serag-mistakes.json", { mistakes, exportedAt: nowISO(), version: 1 });
  }

  function importMistakes(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (Array.isArray(data.mistakes)) {
          mistakes = data.mistakes;
          safeJSON.set(LS.MISTAKES, mistakes);
          renderMistakes();
          toast(settings.lang === "ar" ? "تم الاستيراد" : "Imported");
        }
      } catch {
        toast(settings.lang === "ar" ? "ملف غير صالح" : "Invalid file");
      }
    };
    reader.readAsText(file);
  }

  // ---------- Reset ----------
  function resetStats() {
    stats = JSON.parse(JSON.stringify(DEFAULT_STATS));
    safeJSON.set(LS.STATS, stats);
    renderHome();
    renderSessionsMetrics();
    renderStats();
    renderTimeInsight();
    toast(settings.lang === "ar" ? "تم تصفير الإحصائيات" : "Stats reset");
  }

  function resetAll() {
    settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    stats = JSON.parse(JSON.stringify(DEFAULT_STATS));
    materials = [];
    mistakes = [];
    shop = JSON.parse(JSON.stringify(DEFAULT_SHOP));
    notes = { sessionNotes: "" };
    daily = { planDone: {}, focusPick: null };

    safeJSON.set(LS.SETTINGS, settings);
    safeJSON.set(LS.STATS, stats);
    safeJSON.set(LS.MATERIALS, materials);
    safeJSON.set(LS.MISTAKES, mistakes);
    safeJSON.set(LS.SHOP, shop);
    safeJSON.set(LS.NOTES, notes);
    safeJSON.set(LS.DAILY, daily);

    boot();
    toast(settings.lang === "ar" ? "تم التصفير الكامل" : "Reset done");
  }

  // ---------- Events ----------
  function bindEvents() {
    // Tabs
    dom.navBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        if (tab) setActiveTab(tab);
      });
    });

    // Quick goto buttons
    $$("[data-goto]").forEach((b) => {
      b.addEventListener("click", () => {
        const tab = b.getAttribute("data-goto");
        if (tab) setActiveTab(tab);
      });
    });

    // Drawer
    dom.menuBtn?.addEventListener("click", openDrawer);
    dom.drawerClose?.addEventListener("click", closeDrawer);
    dom.backdrop?.addEventListener("click", closeDrawer);

    // Language
    dom.langAR?.addEventListener("click", () => {
      settings.lang = "ar";
      safeJSON.set(LS.SETTINGS, settings);
      applyRootSettings();
      applyI18n();
      renderAll();
    });
    dom.langEN?.addEventListener("click", () => {
      settings.lang = "en";
      safeJSON.set(LS.SETTINGS, settings);
      applyRootSettings();
      applyI18n();
      renderAll();
    });

    // Mute
    dom.muteBtn?.addEventListener("click", () => {
      settings.soundOn = !settings.soundOn;
      safeJSON.set(LS.SETTINGS, settings);
      setMuteIcon();
      toast(settings.soundOn ? (settings.lang === "ar" ? "الصوت شغال" : "Sound on") : (settings.lang === "ar" ? "تم كتم الصوت" : "Muted"));
    });

    // Focus mode toggle
    const toggleFocus = () => {
      const on = !document.body.classList.contains("is-focus");
      document.body.classList.toggle("is-focus", on);
      settings.focusDefault = on;
      safeJSON.set(LS.SETTINGS, settings);
      dom.focusBtn?.setAttribute("aria-pressed", on ? "true" : "false");
    };
    dom.focusBtn?.addEventListener("click", toggleFocus);
    dom.focusCalloutBtn?.addEventListener("click", toggleFocus);

    // Timer actions
    dom.btnStart?.addEventListener("click", timerStart);
    dom.btnPause?.addEventListener("click", timerPause);
    dom.btnReset?.addEventListener("click", timerReset);
    dom.btnNext?.addEventListener("click", timerNext);

    dom.studyMin?.addEventListener("change", () => {
      const v = clamp(Number(dom.studyMin.value || 25), 10, 90);
      settings.studyMin = v;
      safeJSON.set(LS.SETTINGS, settings);
      if (timer.mode === "study" && !timer.running) {
        timer.remainingMs = v * 60 * 1000;
        updateTimerUI();
        drawRing(0);
      }
    });

    dom.breakMin?.addEventListener("change", () => {
      const v = clamp(Number(dom.breakMin.value || 5), 3, 30);
      settings.breakMin = v;
      safeJSON.set(LS.SETTINGS, settings);
      if (timer.mode === "break" && !timer.running) {
        timer.remainingMs = v * 60 * 1000;
        updateTimerUI();
        drawRing(0);
      }
    });

    dom.autoSwitch?.addEventListener("change", () => {
      settings.autoSwitch = !!dom.autoSwitch.checked;
      safeJSON.set(LS.SETTINGS, settings);
    });

    // Notes
    dom.saveNotes?.addEventListener("click", saveNotes);
    dom.clearNotes?.addEventListener("click", clearNotes);

    // Materials add
    dom.addMaterial?.addEventListener("click", () => {
      addMaterial(dom.matName?.value || "");
      if (dom.matName) dom.matName.value = "";
    });

    // Materials list clicks (delegate)
    dom.materialsList?.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      const row = e.target.closest("[data-mid]");
      if (btn) {
        const act = btn.dataset.action;
        const mid = btn.dataset.mid;
        if (!mid) return;
        if (act === "open") {
          activeMaterialId = mid;
          renderMaterials();
        }
        if (act === "del") deleteMaterial(mid);
      } else if (row) {
        activeMaterialId = row.dataset.mid;
        renderMaterials();
      }
    });

    // Goals list clicks
    dom.goalsList?.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const act = btn.dataset.action;
      const mid = btn.dataset.mid;
      const gid = btn.dataset.gid;
      if (!mid || !gid) return;
      if (act === "toggleGoal") toggleGoal(mid, gid);
      if (act === "delGoal") deleteGoal(mid, gid);
    });

    // Add goal
    dom.addGoal?.addEventListener("click", () => {
      addGoalToActive(dom.goalText?.value || "");
      if (dom.goalText) dom.goalText.value = "";
    });

    // Mistake form
    dom.mistakeForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      addMistakeFromForm();
    });

    // Mistake list actions (delegate)
    dom.mistakeList?.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const act = btn.dataset.action;
      const id = btn.dataset.id;
      if (!id) return;
      if (act === "delMistake") deleteMistake(id);
      if (act === "toggleMastered") toggleMastered(id);
      if (act === "reviewOne") reviewOne(id);
    });

    dom.mSearch?.addEventListener("input", renderMistakes);
    dom.mFilter?.addEventListener("change", renderMistakes);

    // Review today modal
    dom.reviewToday?.addEventListener("click", reviewToday);
    dom.closeReview?.addEventListener("click", () => dom.reviewModal?.close());
    dom.closeReview2?.addEventListener("click", () => dom.reviewModal?.close());
    dom.reviewBody?.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      if (btn.dataset.action === "reviewDue") {
        reviewOne(btn.dataset.id);
        // update modal UI (optional)
        btn.disabled = true;
        btn.querySelector("span").textContent = settings.lang === "ar" ? "تم" : "Done";
      }
    });

    // Mistakes export/import
    dom.exportMistakes?.addEventListener("click", exportMistakes);
    dom.importMistakes?.addEventListener("change", () => {
      const f = dom.importMistakes.files?.[0];
      if (f) importMistakes(f);
      dom.importMistakes.value = "";
    });

    // Settings save
    dom.saveDurations?.addEventListener("click", saveDurationsFromSettingsPanel);

    // Accent buttons
    dom.accentBtns.forEach((b) => {
      b.addEventListener("click", () => {
        const a = b.dataset.accent;
        if (!a) return;
        settings.accent = a;
        safeJSON.set(LS.SETTINGS, settings);
        applyRootSettings();
        toast(settings.lang === "ar" ? "تم تغيير اللون" : "Accent changed");
      });
    });

    // Backup export/import
    dom.exportAll?.addEventListener("click", exportAll);
    dom.importAllFile?.addEventListener("change", () => {
      const f = dom.importAllFile.files?.[0];
      if (f) importAll(f);
      dom.importAllFile.value = "";
    });

    // Reset stats / all
    dom.resetStats?.addEventListener("click", resetStats);
    dom.resetAll?.addEventListener("click", resetAll);

    // Shop clicks (delegate)
    dom.shopMount?.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const action = btn.dataset.action;
      const type = btn.dataset.type;
      const id = btn.dataset.id;
      const price = Number(btn.dataset.price || 0);
      if (!action || !type || !id) return;

      if (action === "buy") buyItem(type, id, price);
      if (action === "apply") applyItem(type, id);
    });

    // ESC closes drawer
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });
  }

  // ---------- Utilities ----------
  function escapeHTML(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // ---------- Render All ----------
  function renderAll() {
    renderHome();
    renderSessionsMetrics();
    renderMaterials();
    renderMistakes();
    renderStats();
    renderShop();
    renderTimeInsight();
  }

  // ---------- Boot ----------
  function boot() {
    applyRootSettings();
    applyI18n();
    refreshIcons();

    initTimerFromSettings();
    initNotes();

    renderShop();
    renderAll();

    // default tab
    setActiveTab("home");
  }

  // ---------- Start ----------
  document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    boot();
  });

})();
