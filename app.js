/* ===========================
   T09 Tawjihi Dashboard (No Question Bank)
   Plan = Finish Plan based on checklist groups (History/Islamic/English/Arabic)
   =========================== */

const LS = {
  lang: "t09_lang",
  mute: "t09_mute",
  durations: "t09_durations",
  metrics: "t09_metrics",
  timerState: "t09_timer_state",
  planState: "t09_finish_plan_state",
  dailyLog: "t09_daily_log"
};

// ---------- i18n ----------
const i18n = {
  ar: {
    appTitle: "لوحة توجيهي 2009",
    appSub: "جلسات • خطة ختمة • إحصائيات • Offline",
    tabHome: "الرئيسية",
    tabSessions: "جلسات",
    tabPlan: "خطة الختمة",
    tabStats: "الإحصائيات",
    footerNote: "حفظ تلقائي • Offline • تثبيت كتطبيق",

    homeKicker: "جاهز تختم الفصل الثاني؟",
    homeTitle: "خطة توجيهي الأردن (2009) — ختمة منظمة",
    homeDesc: "اختار موعد الختمة (1 أيار أو 15 أيار) وخلي الخطة تتقسم أيامياً حسب وقتك.",
    homeChip: "نمط وزاري + مراجعة أخطاء",
    todayFocus: "تركيز اليوم",
    todayHint: "مأخوذ تلقائياً من خطة الختمة.",
    goPlan: "افتح خطة الختمة",
    goSessions: "ابدأ جلسة دراسة",
    goStats: "شوف التقدم",

    quickTipsTitle: "نصائح سريعة (توجيهي)",
    tip1: "بعد كل مهمة: 10–15 دقيقة “تحليل أخطاء”",
    tip2: "خصص كل 3 أيام “مراجعة سريعة” قبل النوم",
    tip3: "التزام بسيط يومياً أحسن من ضغط يومين وترك أسبوع",
    miniSessions: "جلسات",
    miniMinutes: "دقائق دراسة",
    miniPlan: "الخطة",

    sessionsTitle: "جلسات (بومودورو توجيهي)",
    sessionsDesc: "جلسة دراسة + استراحة. احفظ إعداداتك وتابع تقدمك.",
    resetStats: "تصفير الإحصائيات",

    modeStudy: "دراسة",
    modeBreak: "استراحة",
    cycle: "دورة",
    hintStudy: "ركز: هدف اليوم من الخطة",
    hintBreak: "استراحة قصيرة — رجّع تركيزك",
    start: "ابدأ",
    pause: "إيقاف",
    next: "التالي",
    reset: "إعادة",
    autoSwitch: "تبديل تلقائي (دراسة/استراحة)",
    soundOn: "صوت تنبيه",

    settings: "الإعدادات",
    studyMin: "دقائق الدراسة",
    breakMin: "دقائق الاستراحة",
    studyHint: "مقترح: 25–40 دقيقة حسب تركيزك",
    breakHint: "مقترح: 5–10 دقائق",
    save: "حفظ",

    sessionMetrics: "مؤشرات",
    mStudySessions: "جلسات دراسة",
    mStudyMinutes: "دقائق دراسة",
    mBreaks: "استراحات",
    mBreakMinutes: "دقائق استراحة",
    noteLocal: "كل شي محفوظ تلقائياً على جهازك (LocalStorage).",

    planTitle: "خطة الختمة (حسب الورقة)",
    planDesc: "اختار موعد الختمة وطريقة تقسيم المهام. كل يوم مهام واضحة + تفعيل “تم” للتتبع.",
    copyPlan: "نسخ الخطة",
    regenPlan: "إعادة توليد",
    planOptions: "خيارات الخطة",
    targetDate: "موعد الختمة",
    may1: "1 أيار",
    may15: "15 أيار",
    dailyMode: "تقسيم اليوم",
    twoTasks: "مهمتين/يوم",
    oneEach: "مهمة من كل مادة",
    reviewDays: "أيام مراجعة/تحليل أخطاء أسبوعياً",
    lightDay: "يوم خفيف أسبوعياً (تخفيف ضغط)",
    todayFromPlan: "مهام اليوم من الخطة",
    noPlanYet: "اختار الخيارات واضغط “إعادة توليد”.",
    calendarTitle: "تقسيم الأيام",
    planProgress: "تقدم الخطة",
    planCompletion: "نسبة إنجاز الخطة",
    planHint: "ملاحظة: المحتوى هنا مبني على مجموعات من البنود الظاهرة بالورقة (وحدات/مراجعات/نمط وزاري).",

    statsTitle: "الإحصائيات والتقدم",
    statsDesc: "جلساتك + تقدم الخطة + ستريك + أفضل يوم.",
    resetAll: "تصفير الكل",
    streakTitle: "الستريك",
    currentStreak: "الحالي",
    bestDay: "أفضل يوم",
    streakRule: "اليوم محسوب إذا أنهيت ≥1 جلسة دراسة أو ≥1 مهمة من الخطة.",
    chartTitle: "مخطط الدراسة للأسبوع",
    chartHint: "يعرض دقائق الدراسة اليومية (آخر 7 أيام).",

    toastCopied: "تم النسخ ✅",
    toastSaved: "تم الحفظ ✅",
    toastRegenerated: "تم توليد الخطة ✅",
    toastReset: "تم تصفير البيانات ✅",
    confirmReset: "متأكد بدك تصفر كل شي؟ ما بترجع.",
    invalidNumber: "أدخل رقم صحيح ضمن الحدود.",
    done: "تم",
    notDone: "غير مكتمل",
    subjectHistory: "تاريخ",
    subjectIslamic: "دين",
    subjectEnglish: "إنجليزي",
    subjectArabic: "عربي",
    reviewLabel: "مراجعة/تحليل أخطاء",
    lightLabel: "يوم خفيف",
    minutes: "دقيقة",
    tasks: "مهام",
    until: "حتى"
  },

  en: {
    appTitle: "Tawjihi 2009 Dashboard",
    appSub: "Sessions • Finish Plan • Stats • Offline",
    tabHome: "Home",
    tabSessions: "Sessions",
    tabPlan: "Finish Plan",
    tabStats: "Statistics",
    footerNote: "Auto-save • Offline • Installable",

    homeKicker: "Ready to finish the semester?",
    homeTitle: "Jordan Tawjihi (2009) — A structured finish plan",
    homeDesc: "Pick a target finish date (May 1 or May 15) and get a daily split that fits your pace.",
    homeChip: "Ministerial-style + error review",
    todayFocus: "Today’s Focus",
    todayHint: "Auto-generated from your finish plan.",
    goPlan: "Open Finish Plan",
    goSessions: "Start a Study Session",
    goStats: "View Progress",

    quickTipsTitle: "Quick tips (Tawjihi)",
    tip1: "After each task: 10–15 min “error review”",
    tip2: "Every 3 days: a quick recap before sleep",
    tip3: "Small daily consistency beats 2-day bursts then a week off",
    miniSessions: "Sessions",
    miniMinutes: "Study minutes",
    miniPlan: "Plan",

    sessionsTitle: "Sessions (Tawjihi Pomodoro)",
    sessionsDesc: "Study + break. Save your durations and track progress.",
    resetStats: "Reset stats",

    modeStudy: "Study",
    modeBreak: "Break",
    cycle: "Cycle",
    hintStudy: "Focus: today’s plan goal",
    hintBreak: "Short break — reset your focus",
    start: "Start",
    pause: "Pause",
    next: "Next",
    reset: "Reset",
    autoSwitch: "Auto switch (Study/Break)",
    soundOn: "Sound alerts",

    settings: "Settings",
    studyMin: "Study minutes",
    breakMin: "Break minutes",
    studyHint: "Suggested: 25–40 minutes",
    breakHint: "Suggested: 5–10 minutes",
    save: "Save",

    sessionMetrics: "Metrics",
    mStudySessions: "Study sessions",
    mStudyMinutes: "Study minutes",
    mBreaks: "Breaks",
    mBreakMinutes: "Break minutes",
    noteLocal: "Everything is saved locally on your device (LocalStorage).",

    planTitle: "Finish Plan (based on checklist)",
    planDesc: "Choose a finish date and daily split. Mark tasks done to track progress.",
    copyPlan: "Copy plan",
    regenPlan: "Regenerate",
    planOptions: "Plan options",
    targetDate: "Finish by",
    may1: "May 1",
    may15: "May 15",
    dailyMode: "Daily split",
    twoTasks: "2 tasks/day",
    oneEach: "1 task per subject",
    reviewDays: "Weekly review/error-analysis days",
    lightDay: "One lighter day per week",
    todayFromPlan: "Today’s tasks",
    noPlanYet: "Pick options and press “Regenerate”.",
    calendarTitle: "Daily schedule",
    planProgress: "Plan progress",
    planCompletion: "Plan completion",
    planHint: "Note: tasks are grouped to match the checklist structure (units/reviews/ministerial practice).",

    statsTitle: "Statistics & progress",
    statsDesc: "Sessions + plan progress + streak + best day.",
    resetAll: "Reset everything",
    streakTitle: "Streak",
    currentStreak: "Current",
    bestDay: "Best day",
    streakRule: "A day counts if you completed ≥1 study session OR ≥1 plan task.",
    chartTitle: "Weekly study chart",
    chartHint: "Shows daily study minutes (last 7 days).",

    toastCopied: "Copied ✅",
    toastSaved: "Saved ✅",
    toastRegenerated: "Plan generated ✅",
    toastReset: "Data reset ✅",
    confirmReset: "Are you sure you want to reset everything? This cannot be undone.",
    invalidNumber: "Enter a valid number within limits.",
    done: "Done",
    notDone: "Not done",
    subjectHistory: "History",
    subjectIslamic: "Religion",
    subjectEnglish: "English",
    subjectArabic: "Arabic",
    reviewLabel: "Review / Error analysis",
    lightLabel: "Light day",
    minutes: "min",
    tasks: "tasks",
    until: "until"
  }
};

// ---------- Finish plan content (grouped from your checklist) ----------
/*
  This is intentionally structured so you can easily edit/expand it.
  If you later want the exact 1..227 entries verbatim, we can replace each group with precise items.
*/
const syllabusGroups = {
  history: [
    { key:"hist-1", ar:"تاريخ الأردن: تأسيس الإمارة الأردنية (ملخص + أسئلة وزاري)", en:"Jordan History: Establishment of the Emirate (summary + ministerial practice)" , estMin: 70 },
    { key:"hist-2", ar:"تاريخ الأردن: استقلال المملكة الأردنية الهاشمية (مراجعة + نمط امتحان)", en:"Independence of Jordan (review + exam-style)" , estMin: 70 },
    { key:"hist-3", ar:"الحياة السياسية (1948–1957): فهم + تدريب وزاري", en:"Political life (1948–1957): learn + practice", estMin: 75 },
    { key:"hist-4", ar:"الحياة السياسية (1957–1999): نقاط وزارية + تدريب", en:"Political life (1957–1999): key points + practice", estMin: 75 },
    { key:"hist-5", ar:"الحياة السياسية منذ 1999: مراجعة + أسئلة", en:"Political life since 1999: review + questions", estMin: 65 },
    { key:"hist-6", ar:"العلاقات العربية والدولية: حفظ نقاط + تطبيق", en:"Arab & international relations: key points + practice", estMin: 65 },
    { key:"hist-7", ar:"القوات المسلحة والأمنية: مفاهيم + أسئلة", en:"Armed & security forces: concepts + questions", estMin: 60 },
    { key:"hist-8", ar:"الحياة الاقتصادية (1921–1950): تلخيص + تدريب", en:"Economic life (1921–1950): summary + practice", estMin: 70 },
    { key:"hist-9", ar:"الحياة الاقتصادية (1951–1967): مراجعة + تدريب", en:"Economic life (1951–1967): review + practice", estMin: 70 },
    { key:"hist-10", ar:"الحياة الاقتصادية (1968–1999): نقاط + نمط وزاري", en:"Economic life (1968–1999): points + exam style", estMin: 70 },
    { key:"hist-11", ar:"الحياة الاجتماعية (1921–1950): فهم + أسئلة", en:"Social life (1921–1950): learn + questions", estMin: 65 },
    { key:"hist-12", ar:"الحياة الاجتماعية (1951–1999 + منذ 1999): تدريب وزاري", en:"Social life (1951–1999 + since 1999): practice", estMin: 70 },
    { key:"hist-13", ar:"التعليم والثقافة (1921–2024): مراجعة + أسئلة", en:"Education & culture (1921–2024): review + questions", estMin: 75 },
    { key:"hist-14", ar:"القضية الفلسطينية + الوصاية الهاشمية على المقدسات: نمط وزاري", en:"Palestine + Hashemite custodianship: exam style", estMin: 75 },
    { key:"hist-15", ar:"مراجعة وحدات: (4–8) + تحليل أخطاء", en:"Units review (4–8) + error analysis", estMin: 60 }
  ],

  islamic: [
    { key:"isl-1", ar:"التربية الإسلامية: سورة البقرة (آيات مختارة) — حفظ/فهم + أسئلة", en:"Islamic: Al-Baqarah selected verses — memorize/understand + Qs", estMin: 75 },
    { key:"isl-2", ar:"دلائل وجود الله تعالى (مراجعة) + أسئلة قصيرة", en:"Proofs of God's existence (review) + short Qs", estMin: 55 },
    { key:"isl-3", ar:"الاجتهاد في الإسلام + تطبيق وزاري", en:"Ijtihad in Islam + exam practice", estMin: 60 },
    { key:"isl-4", ar:"مراجعة الوحدة الأولى كاملة + حل بنك أسئلة", en:"Unit 1 full review + question bank", estMin: 70 },
    { key:"isl-5", ar:"سورة الأعراف (31–34): حفظ/تفسير + أسئلة", en:"Al-A'raf (31–34): memorize/tafsir + Qs", estMin: 70 },
    { key:"isl-6", ar:"مراعاة المصالح في الشريعة الإسلامية + أمثلة", en:"Maslahah in Sharia + examples", estMin: 55 },
    { key:"isl-7", ar:"جهود علماء المسلمين في الحفاظ على السنة النبوية + أسئلة", en:"Scholars' efforts preserving Sunnah + Qs", estMin: 60 },
    { key:"isl-8", ar:"منهج الحديث الشريف + تطبيقات", en:"Hadith methodology + practice", estMin: 60 },
    { key:"isl-9", ar:"منهج الإسلام في الحياة (1–2) + أسئلة", en:"Islamic way of life (1–2) + Qs", estMin: 60 },
    { key:"isl-10", ar:"رسائل النبي (إلى الملوك والزعماء) + نقاط وزارية", en:"Prophetic letters + key points", estMin: 55 },
    { key:"isl-11", ar:"فقه الأسرة: الحقوق المتبادلة للمرأة + أسئلة", en:"Family fiqh: women's rights + Qs", estMin: 55 },
    { key:"isl-12", ar:"الوقف ودوره في التنمية (1–2) + أمثلة", en:"Waqf & development (1–2) + examples", estMin: 55 },
    { key:"isl-13", ar:"مفاهيم: الإيمان/الدنيا/الآخرة + مراجعة الوحدة الثالثة", en:"Concepts: faith/dunya/akhirah + unit 3 review", estMin: 65 }
  ],

  english: [
    { key:"eng-1", ar:"English: Living Small (Reading) + أسئلة", en:"Living Small (Reading) + questions", estMin: 55 },
    { key:"eng-2", ar:"Modals & related verbs (1–2) + تطبيق وزاري", en:"Modals & related verbs (1–2) + practice", estMin: 60 },
    { key:"eng-3", ar:"Articles (1–2) + أسئلة", en:"Articles (1–2) + questions", estMin: 55 },
    { key:"eng-4", ar:"Writing: Report + تدريب كتابي", en:"Writing: Report + writing practice", estMin: 60 },
    { key:"eng-5", ar:"Reporting Speech (1–2) + أسئلة", en:"Reporting Speech (1–2) + questions", estMin: 60 },
    { key:"eng-6", ar:"Reporting Verbs + أمثلة وزارية", en:"Reporting Verbs + exam examples", estMin: 55 },
    { key:"eng-7", ar:"Getting your message across + أسئلة", en:"Getting your message across + questions", estMin: 55 },
    { key:"eng-8", ar:"Kindness (Reading) + مفردات", en:"Kindness (Reading) + vocab", estMin: 55 },
    { key:"eng-9", ar:"Writing: Article + تدريب", en:"Writing: Article + practice", estMin: 60 },
    { key:"eng-10", ar:"Passive Voice (1–2) + تمارين", en:"Passive Voice (1–2) + drills", estMin: 60 },
    { key:"eng-11", ar:"Impersonal Passive (1–2) + تطبيق", en:"Impersonal Passive (1–2) + practice", estMin: 55 },
    { key:"eng-12", ar:"Virtual reality (Reading) + أسئلة", en:"Virtual reality (Reading) + questions", estMin: 55 },
    { key:"eng-13", ar:"Writing: For-and-against essay + نموذج", en:"For-and-against essay + model", estMin: 65 },
    { key:"eng-14", ar:"If clauses (1–3) + أسئلة وزارية", en:"If clauses (1–3) + exam Qs", estMin: 70 },
    { key:"eng-15", ar:"Wish & If only (1–2) + تمارين", en:"Wish & If only (1–2) + drills", estMin: 60 },
    { key:"eng-16", ar:"Past modals (1–2) + تطبيق", en:"Past modals (1–2) + practice", estMin: 55 },
    { key:"eng-17", ar:"Participle clauses (1–2) + أسئلة", en:"Participle clauses (1–2) + Qs", estMin: 55 },
    { key:"eng-18", ar:"Spoilers: Love ’em or hate ’em (Reading) + أسئلة", en:"Spoilers: Love ’em or hate ’em + questions", estMin: 55 },
    { key:"eng-19", ar:"مراجعة وحدات إنجليزي + نموذج امتحان تجريبي", en:"English review + mini mock test", estMin: 75 }
  ],

  arabic: [
    { key:"ar-1", ar:"العربية: قصيدة فتح عمورية (1–3) + أسئلة", en:"Arabic: Poem (Fath Amuriyah) + questions", estMin: 70 },
    { key:"ar-2", ar:"تثبيت/مراجعة وحدة فتح عمورية كاملة + حل أسئلة", en:"Unit review + question solving", estMin: 60 },
    { key:"ar-3", ar:"من معاني حروف الجر + تطبيق وزاري", en:"Meanings of prepositions + practice", estMin: 55 },
    { key:"ar-4", ar:"قصة حقد النمر (1–3) + فهم + أسئلة", en:"Story: Hatred of the Tiger + Qs", estMin: 65 },
    { key:"ar-5", ar:"مراجعة معاني حروف الجر + حل أسئلة", en:"Prepositions review + Qs", estMin: 55 },
    { key:"ar-6", ar:"اسم الفاعل واسم المفعول (1–2) + تدريبات", en:"Active/Passive participles + drills", estMin: 60 },
    { key:"ar-7", ar:"الطباق والمقابلة + أمثلة وزارية", en:"Antithesis & contrast + exam examples", estMin: 55 },
    { key:"ar-8", ar:"قصيدة الأسلحة والأطفال (1–4) + تحليل", en:"Poem: Weapons & Children + analysis", estMin: 70 },
    { key:"ar-9", ar:"اسم الزمان واسم المكان (1–2) + تطبيق", en:"Nouns of time/place + practice", estMin: 60 },
    { key:"ar-10", ar:"جمع التكسير + أسئلة", en:"Broken plural + questions", estMin: 55 },
    { key:"ar-11", ar:"مفاعيل/متممات + تطبيق وزاري", en:"Objects/complements + practice", estMin: 60 },
    { key:"ar-12", ar:"العروض: البحر المتدارك (1–2) + تدريبات", en:"Prosody: Al-Mutadarik + drills", estMin: 60 },
    { key:"ar-13", ar:"نص: الذكاء الاصطناعي (أفكار/قيم/أسئلة) + كتابة", en:"Text: AI (ideas/values/Qs) + writing", estMin: 70 },
    { key:"ar-14", ar:"اسم الآلة (1–2) + تطبيق", en:"Instrument noun + practice", estMin: 55 },
    { key:"ar-15", ar:"العوض (بحر الرمل) + تدريبات", en:"Prosody: Ramal + drills", estMin: 55 },
    { key:"ar-16", ar:"التعبير: خطة كتابة + موضوع تدريبي", en:"Writing: outline + practice topic", estMin: 65 },
    { key:"ar-17", ar:"مراجعة عربية شاملة + نموذج امتحان تجريبي", en:"Arabic full review + mini mock", estMin: 80 }
  ]
};

const SUBJECTS = [
  { id: "history", badge: "hist", ar: "تاريخ", en: "History" },
  { id: "islamic", badge: "isl", ar: "دين", en: "Religion" },
  { id: "english", badge: "eng", ar: "إنجليزي", en: "English" },
  { id: "arabic", badge: "ar", ar: "عربي", en: "Arabic" }
];

function t(key){
  const lang = getLang();
  return (i18n[lang] && i18n[lang][key]) ? i18n[lang][key] : key;
}

function getLang(){
  return localStorage.getItem(LS.lang) || "ar";
}

function setLang(lang){
  localStorage.setItem(LS.lang, lang);
  document.documentElement.lang = lang === "ar" ? "ar" : "en";
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.body.classList.toggle("ltr", lang === "en");

  // Activate pill
  document.getElementById("langAR").classList.toggle("is-active", lang === "ar");
  document.getElementById("langEN").classList.toggle("is-active", lang === "en");

  // Translate
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const k = el.getAttribute("data-i18n");
    el.textContent = t(k);
  });

  // Update placeholders
  const ps = document.getElementById("planSearch");
  if(ps) ps.placeholder = (lang === "ar") ? "بحث..." : "Search...";

  // Rerender UI pieces dependent on language
  renderAll();
}

// ---------- Toast ----------
let toastTimer = null;
function toast(msg){
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ el.hidden = true; }, 1800);
}

// ---------- Tabs ----------
function setActiveTab(tabId){
  document.querySelectorAll(".tab").forEach(s=>s.classList.remove("is-active"));
  document.getElementById(`tab-${tabId}`).classList.add("is-active");

  document.querySelectorAll(".nav-item").forEach(b=>{
    b.classList.toggle("is-active", b.dataset.tab === tabId);
  });
  document.querySelectorAll(".bnav").forEach(b=>{
    b.classList.toggle("is-active", b.dataset.tab === tabId);
  });

  // close drawer
  closeDrawer();
}

// ---------- Drawer ----------
const drawer = ()=>document.getElementById("drawer");
const drawerBackdrop = ()=>document.getElementById("drawerBackdrop");

function openDrawer(){
  drawer().hidden = false;
  drawerBackdrop().hidden = false;
  document.body.style.overflow = "hidden";
}
function closeDrawer(){
  drawer().hidden = true;
  drawerBackdrop().hidden = true;
  document.body.style.overflow = "";
}

// ---------- Metrics ----------
function defaultMetrics(){
  return {
    studySessions: 0,
    studyMinutes: 0,
    breaks: 0,
    breakMinutes: 0
  };
}
function loadMetrics(){
  try{
    return JSON.parse(localStorage.getItem(LS.metrics)) || defaultMetrics();
  }catch{
    return defaultMetrics();
  }
}
function saveMetrics(m){
  localStorage.setItem(LS.metrics, JSON.stringify(m));
}
function loadDailyLog(){
  try{
    return JSON.parse(localStorage.getItem(LS.dailyLog)) || {};
  }catch{
    return {};
  }
}
function saveDailyLog(log){
  localStorage.setItem(LS.dailyLog, JSON.stringify(log));
}
function isoDate(d){
  const x = new Date(d);
  x.setHours(0,0,0,0);
  return x.toISOString().slice(0,10);
}

// ---------- Timer ----------
const audioCtx = (window.AudioContext || window.webkitAudioContext) ? new (window.AudioContext || window.webkitAudioContext)() : null;
function beep(){
  if(isMuted()) return;
  const soundOn = document.getElementById("soundOn");
  if(soundOn && !soundOn.checked) return;
  if(!audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = "sine";
  o.frequency.value = 880;
  o.connect(g);
  g.connect(audioCtx.destination);
  g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
  o.start();
  o.stop(audioCtx.currentTime + 0.4);
}

function isMuted(){
  return localStorage.getItem(LS.mute) === "1";
}
function setMuted(val){
  localStorage.setItem(LS.mute, val ? "1" : "0");
  const btn = document.getElementById("btnMute");
  const icon = btn.querySelector("i");
  icon.className = val ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high";
}

function defaultDurations(){
  return { studyMin: 25, breakMin: 5 };
}
function loadDurations(){
  try{
    return JSON.parse(localStorage.getItem(LS.durations)) || defaultDurations();
  }catch{
    return defaultDurations();
  }
}
function saveDurations(d){
  localStorage.setItem(LS.durations, JSON.stringify(d));
}

let timer = {
  mode: "study", // study|break
  running: false,
  cycle: 1,
  totalSec: 25*60,
  leftSec: 25*60,
  tickHandle: null
};

function loadTimerState(){
  try{
    const s = JSON.parse(localStorage.getItem(LS.timerState));
    if(!s) return;
    timer = { ...timer, ...s };
  }catch{}
}
function saveTimerState(){
  localStorage.setItem(LS.timerState, JSON.stringify({
    mode: timer.mode,
    running: timer.running,
    cycle: timer.cycle,
    totalSec: timer.totalSec,
    leftSec: timer.leftSec
  }));
}

function setTimerMode(mode){
  const d = loadDurations();
  timer.mode = mode;
  timer.totalSec = (mode === "study" ? d.studyMin : d.breakMin) * 60;
  timer.leftSec = timer.totalSec;
  timer.running = false;
  stopTick();

  document.getElementById("timerMode").textContent = t(mode === "study" ? "modeStudy" : "modeBreak");
  document.getElementById("timerHint").textContent = t(mode === "study" ? "hintStudy" : "hintBreak");
  document.getElementById("cycleTag").textContent = String(timer.cycle);
  updateTimeText();
  drawRing();
  saveTimerState();
}

function stopTick(){
  if(timer.tickHandle){
    clearInterval(timer.tickHandle);
    timer.tickHandle = null;
  }
}

function startTick(){
  if(timer.running) return;
  timer.running = true;
  timer.tickHandle = setInterval(()=>{
    timer.leftSec = Math.max(0, timer.leftSec - 1);
    updateTimeText();
    drawRing();
    saveTimerState();

    if(timer.leftSec <= 0){
      stopTick();
      timer.running = false;
      beep();
      flashTitle();

      // metrics
      const m = loadMetrics();
      const durs = loadDurations();
      const today = isoDate(new Date());
      const log = loadDailyLog();
      log[today] = log[today] || { studyMin:0, planDone:0 };

      if(timer.mode === "study"){
        m.studySessions += 1;
        m.studyMinutes += durs.studyMin;
        log[today].studyMin += durs.studyMin;
      }else{
        m.breaks += 1;
        m.breakMinutes += durs.breakMin;
      }
      saveMetrics(m);
      saveDailyLog(log);

      const auto = document.getElementById("autoSwitch");
      if(auto && auto.checked){
        nextMode();
      }else{
        // stay but show reset
      }
      renderStats();
      renderHomeMini();
    }
  }, 1000);
}

function flashTitle(){
  const original = document.title;
  let n = 0;
  const id = setInterval(()=>{
    document.title = (n % 2 === 0) ? "⏰ T09" : original;
    n++;
    if(n > 6){
      clearInterval(id);
      document.title = original;
    }
  }, 400);
}

function updateTimeText(){
  const m = Math.floor(timer.leftSec / 60);
  const s = timer.leftSec % 60;
  const txt = `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  document.getElementById("timeText").textContent = txt;
}

function nextMode(){
  if(timer.mode === "study"){
    setTimerMode("break");
  }else{
    timer.cycle += 1;
    setTimerMode("study");
  }
}

function resetTimer(){
  setTimerMode(timer.mode);
}

function drawRing(){
  const canvas = document.getElementById("ring");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const cx = W/2, cy = H/2;
  const r = 90;

  ctx.clearRect(0,0,W,H);

  // bg ring
  ctx.beginPath();
  ctx.lineWidth = 14;
  ctx.strokeStyle = "rgba(255,255,255,.10)";
  ctx.arc(cx, cy, r, 0, Math.PI*2);
  ctx.stroke();

  const progress = (timer.totalSec === 0) ? 0 : (timer.totalSec - timer.leftSec) / timer.totalSec;
  const start = -Math.PI/2;
  const end = start + progress * Math.PI*2;

  ctx.beginPath();
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.strokeStyle = (timer.mode === "study") ? "rgba(139,92,246,.95)" : "rgba(34,197,94,.95)";
  ctx.arc(cx, cy, r, start, end);
  ctx.stroke();

  // subtle inner glow
  ctx.beginPath();
  ctx.fillStyle = "rgba(109,40,217,.08)";
  ctx.arc(cx, cy, 68, 0, Math.PI*2);
  ctx.fill();
}

// ---------- Finish Plan Generator ----------
function defaultPlanState(){
  return {
    target: "may1",       // may1|may15
    dailyMode: "two",     // two|four
    includeReviewDays: true,
    lightDay: true,
    plan: null            // generated days
  };
}

function loadPlanState(){
  try{
    return JSON.parse(localStorage.getItem(LS.planState)) || defaultPlanState();
  }catch{
    return defaultPlanState();
  }
}
function savePlanState(s){
  localStorage.setItem(LS.planState, JSON.stringify(s));
}

function dateForTarget(target){
  const now = new Date();
  const year = now.getFullYear();
  // target: May 1 / May 15 of current year (if already passed, next year)
  let d = new Date(year, 4, target === "may1" ? 1 : 15);
  if(d < now){
    d = new Date(year + 1, 4, target === "may1" ? 1 : 15);
  }
  d.setHours(0,0,0,0);
  return d;
}

function daysBetween(a,b){
  const ms = 24*60*60*1000;
  const A = new Date(a); A.setHours(0,0,0,0);
  const B = new Date(b); B.setHours(0,0,0,0);
  return Math.max(1, Math.ceil((B - A)/ms) + 1); // include today
}

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

function buildTaskPool(){
  const pool = [];
  for(const s of SUBJECTS){
    const g = syllabusGroups[s.id];
    for(const item of g){
      pool.push({
        id: `${s.id}:${item.key}`,
        subject: s.id,
        ar: item.ar,
        en: item.en,
        estMin: item.estMin
      });
    }
  }
  return pool;
}

function generateFinishPlan(state){
  const now = new Date();
  const target = dateForTarget(state.target);
  const totalDays = daysBetween(now, target);

  // build shuffled pool per subject
  const pools = {};
  SUBJECTS.forEach(s=>{
    pools[s.id] = shuffle(syllabusGroups[s.id].map(it=>({
      id:`${s.id}:${it.key}`,
      subject:s.id,
      ar:it.ar,
      en:it.en,
      estMin:it.estMin
    })));
  });

  // Determine daily slots
  const slotsPerDay = (state.dailyMode === "four") ? 4 : 2;

  // Weekly pattern: optional review day + optional light day
  // We'll treat: Friday as review day if enabled; Tuesday as light day if enabled (Jordan week: Sun..Sat)
  const planDays = [];
  const start = new Date(now); start.setHours(0,0,0,0);

  let counters = { history:0, islamic:0, english:0, arabic:0 };

  function nextFromSubject(sub){
    const arr = pools[sub];
    const idx = counters[sub] % arr.length;
    counters[sub] += 1;
    return arr[idx];
  }

  for(let i=0;i<totalDays;i++){
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    const dow = d.getDay(); // 0 Sun ... 6 Sat
    const isReview = state.includeReviewDays && (dow === 5); // Fri
    const isLight = state.lightDay && (dow === 2); // Tue

    let tasks = [];

    if(isReview){
      tasks = [{
        id:`review:${isoDate(d)}`,
        subject:"review",
        ar: "مراجعة أسبوعية: تحليل أخطاء + أسئلة نمط وزاري (مختلط)",
        en: "Weekly review: error analysis + mixed ministerial-style questions",
        estMin: 70
      }];
      // optionally add one subject task if dailyMode is four
      if(slotsPerDay === 4){
        tasks.push(nextFromSubject("history"));
        tasks.push(nextFromSubject("english"));
        tasks.push(nextFromSubject("arabic"));
      }
    } else if(isLight){
      // light day: fewer/shorter tasks
      if(state.dailyMode === "four"){
        tasks = [
          nextFromSubject("english"),
          nextFromSubject("arabic"),
          {
            id:`light:${isoDate(d)}`,
            subject:"light",
            ar:"يوم خفيف: مراجعة سريعة/بطاقات + ترتيب ملاحظات",
            en:"Light day: quick recap/flashcards + organize notes",
            estMin: 35
          },
          nextFromSubject("islamic")
        ];
      } else {
        tasks = [
          nextFromSubject("english"),
          {
            id:`light:${isoDate(d)}`,
            subject:"light",
            ar:"يوم خفيف: مراجعة سريعة/تصحيح أخطاء",
            en:"Light day: quick recap / fix mistakes",
            estMin: 35
          }
        ];
      }
    } else {
      if(state.dailyMode === "four"){
        tasks = [
          nextFromSubject("history"),
          nextFromSubject("islamic"),
          nextFromSubject("english"),
          nextFromSubject("arabic")
        ];
      } else {
        // 2 tasks/day: rotate subjects evenly
        const order = ["history","islamic","english","arabic"];
        const base = i % 4;
        tasks = [
          nextFromSubject(order[base]),
          nextFromSubject(order[(base+1)%4])
        ];
      }
    }

    planDays.push({
      date: isoDate(d),
      dow,
      tasks: tasks.map(x=>({
        ...x,
        done:false
      }))
    });
  }

  return planDays;
}

function computePlanProgress(planDays){
  let total = 0, done = 0;
  for(const day of planDays){
    for(const task of day.tasks){
      total++;
      if(task.done) done++;
    }
  }
  return { total, done, pct: total ? Math.round((done/total)*100) : 0 };
}

// ---------- UI Render ----------
function renderHomeMini(){
  const m = loadMetrics();
  document.getElementById("miniSessions").textContent = String(m.studySessions);
  document.getElementById("miniMinutes").textContent = String(m.studyMinutes);

  const st = loadPlanState();
  const pct = st.plan ? computePlanProgress(st.plan).pct : 0;
  document.getElementById("miniPlanPct").textContent = `${pct}%`;
}

function renderTodayFocus(){
  const st = loadPlanState();
  const txt = document.getElementById("todayFocusText");
  if(!st.plan){
    txt.textContent = (getLang()==="ar") ? "ابدأ بتوليد خطة الختمة" : "Generate your finish plan";
    return;
  }
  const today = isoDate(new Date());
  const day = st.plan.find(x=>x.date===today) || st.plan[0];
  const lang = getLang();
  const first = day.tasks.find(tk=>!tk.done) || day.tasks[0];
  txt.textContent = first ? (lang==="ar" ? first.ar : first.en) : "—";
}

function renderPlanOptions(){
  const st = loadPlanState();

  document.getElementById("targetMay1").classList.toggle("is-active", st.target === "may1");
  document.getElementById("targetMay15").classList.toggle("is-active", st.target === "may15");
  document.getElementById("dailyTwo").classList.toggle("is-active", st.dailyMode === "two");
  document.getElementById("dailyFour").classList.toggle("is-active", st.dailyMode === "four");

  document.getElementById("includeReviewDays").checked = !!st.includeReviewDays;
  document.getElementById("lightDay").checked = !!st.lightDay;

  const targetDate = dateForTarget(st.target);
  const days = daysBetween(new Date(), targetDate);

  const slots = st.dailyMode === "four" ? 4 : 2;
  const sum = document.getElementById("planSummary");
  const lang = getLang();
  sum.textContent =
    (lang==="ar")
      ? `الخطة: ${slots} مهام/يوم • ${days} يوم ${t("until")} ${st.target==="may1" ? "1 أيار" : "15 أيار"}`
      : `Plan: ${slots} tasks/day • ${days} days until ${st.target==="may1" ? "May 1" : "May 15"}`;
}

function dowLabel(dow){
  const lang = getLang();
  const ar = ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
  const en = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  return (lang==="ar") ? ar[dow] : en[dow];
}

function badgeForSubject(sub){
  const s = SUBJECTS.find(x=>x.id===sub);
  if(!s) return { cls:"", name:"" };
  return { cls: s.badge, name: (getLang()==="ar") ? s.ar : s.en };
}

function renderTodayTasksBox(){
  const st = loadPlanState();
  const box = document.getElementById("todayTasks");
  box.innerHTML = "";

  if(!st.plan){
    const div = document.createElement("div");
    div.className = "muted";
    div.textContent = t("noPlanYet");
    box.appendChild(div);
    return;
  }
  const today = isoDate(new Date());
  const day = st.plan.find(x=>x.date===today) || st.plan[0];
  const lang = getLang();

  day.tasks.forEach(task=>{
    const row = document.createElement("div");
    row.className = "todo";
    const left = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = (lang==="ar") ? task.ar : task.en;
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `${dowLabel(day.dow)} • ${task.estMin} ${t("minutes")}`;
    left.appendChild(title);
    left.appendChild(meta);

    const badge = document.createElement("span");
    badge.className = "badge";
    if(task.subject==="review"){
      badge.textContent = t("reviewLabel");
    }else if(task.subject==="light"){
      badge.textContent = t("lightLabel");
    }else{
      const b = badgeForSubject(task.subject);
      badge.classList.add(b.cls);
      badge.textContent = b.name;
    }

    row.appendChild(left);
    row.appendChild(badge);
    box.appendChild(row);
  });
}

function renderDayList(){
  const st = loadPlanState();
  const wrap = document.getElementById("dayList");
  wrap.innerHTML = "";

  if(!st.plan){
    return;
  }

  const q = (document.getElementById("planSearch").value || "").trim().toLowerCase();
  const lang = getLang();

  const prog = computePlanProgress(st.plan);
  document.getElementById("planProgressText").textContent = `${prog.pct}%`;

  for(const day of st.plan){
    // filter
    if(q){
      const hit = day.tasks.some(task=>{
        const text = (lang==="ar" ? task.ar : task.en).toLowerCase();
        return text.includes(q);
      });
      if(!hit) continue;
    }

    const card = document.createElement("div");
    card.className = "day-card";

    const head = document.createElement("div");
    head.className = "day-head";

    const title = document.createElement("div");
    title.className = "day-title";
    title.textContent = `${dowLabel(day.dow)} — ${day.date}`;

    const date = document.createElement("div");
    date.className = "day-date";
    const dayDone = day.tasks.filter(tk=>tk.done).length;
    date.textContent = `${dayDone}/${day.tasks.length} ${t("tasks")}`;

    head.appendChild(title);
    head.appendChild(date);

    const tasks = document.createElement("div");
    tasks.className = "tasks";

    day.tasks.forEach((task, idx)=>{
      const row = document.createElement("div");
      row.className = "task";

      const left = document.createElement("div");
      left.className = "task-left";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!task.done;
      cb.addEventListener("change", ()=>{
        const st2 = loadPlanState();
        const d2 = st2.plan.find(x=>x.date===day.date);
        d2.tasks[idx].done = cb.checked;
        savePlanState(st2);

        // streak log update
        const log = loadDailyLog();
        log[day.date] = log[day.date] || { studyMin:0, planDone:0 };
        // recalc planDone for this day
        log[day.date].planDone = d2.tasks.filter(x=>x.done).length;
        saveDailyLog(log);

        renderDayList();
        renderTodayTasksBox();
        renderTodayFocus();
        renderStats();
        renderHomeMini();
      });

      const textWrap = document.createElement("div");
      const tt = document.createElement("div");
      tt.className = "task-title";
      tt.textContent = (lang==="ar") ? task.ar : task.en;
      const sub = document.createElement("div");
      sub.className = "task-sub";
      sub.textContent = `${task.estMin} ${t("minutes")}`;
      textWrap.appendChild(tt);
      textWrap.appendChild(sub);

      left.appendChild(cb);
      left.appendChild(textWrap);

      const badge = document.createElement("span");
      badge.className = "badge";
      if(task.subject==="review"){
        badge.textContent = t("reviewLabel");
      }else if(task.subject==="light"){
        badge.textContent = t("lightLabel");
      }else{
        const b = badgeForSubject(task.subject);
        badge.classList.add(b.cls);
        badge.textContent = b.name;
      }

      row.appendChild(left);
      row.appendChild(badge);
      tasks.appendChild(row);
    });

    card.appendChild(head);
    card.appendChild(tasks);
    wrap.appendChild(card);
  }
}

function regeneratePlan(){
  const st = loadPlanState();
  st.plan = generateFinishPlan(st);
  savePlanState(st);

  // initialize daily log planDone
  const log = loadDailyLog();
  st.plan.forEach(d=>{
    log[d.date] = log[d.date] || { studyMin:0, planDone:0 };
    log[d.date].planDone = d.tasks.filter(x=>x.done).length;
  });
  saveDailyLog(log);

  toast(t("toastRegenerated"));
  renderAll();
}

function copyPlan(){
  const st = loadPlanState();
  if(!st.plan){
    toast((getLang()==="ar") ? "ما في خطة لنسخها" : "No plan to copy");
    return;
  }
  const lang = getLang();
  const lines = [];
  lines.push(lang==="ar" ? "خطة الختمة (T09)" : "Finish Plan (T09)");
  lines.push(lang==="ar" ? `الموعد: ${st.target==="may1"?"1 أيار":"15 أيار"}` : `Target: ${st.target==="may1"?"May 1":"May 15"}`);
  lines.push("");

  for(const d of st.plan){
    lines.push(`${dowLabel(d.dow)} — ${d.date}`);
    d.tasks.forEach(task=>{
      const name = (lang==="ar") ? task.ar : task.en;
      lines.push(`- [${task.done?"x":" "}] ${name} (${task.estMin} ${t("minutes")})`);
    });
    lines.push("");
  }

  navigator.clipboard.writeText(lines.join("\n"))
    .then(()=>toast(t("toastCopied")))
    .catch(()=>toast((getLang()==="ar") ? "فشل النسخ" : "Copy failed"));
}

function renderStats(){
  const m = loadMetrics();
  document.getElementById("sStudySessions").textContent = String(m.studySessions);
  document.getElementById("sStudyMinutes").textContent = String(m.studyMinutes);

  document.getElementById("mStudySessions").textContent = String(m.studySessions);
  document.getElementById("mStudyMinutes").textContent = String(m.studyMinutes);
  document.getElementById("mBreaks").textContent = String(m.breaks);
  document.getElementById("mBreakMinutes").textContent = String(m.breakMinutes);

  const st = loadPlanState();
  const planPct = st.plan ? computePlanProgress(st.plan).pct : 0;
  document.getElementById("sPlanPct").textContent = `${planPct}%`;

  // streak + best day
  const log = loadDailyLog();
  const today = new Date(); today.setHours(0,0,0,0);

  // last 120 days scan for streak
  let streak = 0;
  for(let i=0;i<365;i++){
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = isoDate(d);
    const entry = log[key];
    const qualifies = entry && ((entry.studyMin||0) > 0 || (entry.planDone||0) > 0);
    if(i===0){
      if(qualifies) streak = 1;
      else streak = 0;
    }else{
      if(qualifies && streak>0) streak++;
      else break;
    }
  }
  document.getElementById("streakNow").textContent = String(streak);

  let bestKey = null;
  let bestMin = -1;
  for(const k of Object.keys(log)){
    const sm = (log[k].studyMin||0);
    if(sm > bestMin){
      bestMin = sm;
      bestKey = k;
    }
  }
  document.getElementById("bestDay").textContent = bestKey ? `${bestKey} (${bestMin} ${t("minutes")})` : "—";

  drawWeeklyChart(log);
}

function drawWeeklyChart(log){
  const canvas = document.getElementById("weekChart");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  // device scale for crispness
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(320 * dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);

  const w = rect.width;
  const h = 320;

  ctx.clearRect(0,0,w,h);

  // background grid
  ctx.strokeStyle = "rgba(255,255,255,.08)";
  ctx.lineWidth = 1;
  for(let i=0;i<=4;i++){
    const y = 26 + i * ((h-52)/4);
    ctx.beginPath();
    ctx.moveTo(16,y);
    ctx.lineTo(w-16,y);
    ctx.stroke();
  }

  // last 7 days
  const days = [];
  const base = new Date(); base.setHours(0,0,0,0);
  for(let i=6;i>=0;i--){
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    const key = isoDate(d);
    const val = (log[key]?.studyMin || 0);
    days.push({ key, val, dow: d.getDay() });
  }

  const maxVal = Math.max(30, ...days.map(x=>x.val));
  const left = 18, right = 18, top = 22, bottom = 36;
  const plotW = w - left - right;
  const plotH = h - top - bottom;

  const pts = days.map((d, idx)=>{
    const x = left + (idx * (plotW / 6));
    const y = top + (1 - (d.val / maxVal)) * plotH;
    return {x,y, ...d};
  });

  // line
  ctx.strokeStyle = "rgba(139,92,246,.95)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  pts.forEach((p,i)=>{
    if(i===0) ctx.moveTo(p.x,p.y);
    else ctx.lineTo(p.x,p.y);
  });
  ctx.stroke();

  // points
  ctx.fillStyle = "rgba(234,240,255,.95)";
  pts.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,3.5,0,Math.PI*2);
    ctx.fill();
  });

  // labels
  ctx.fillStyle = "rgba(234,240,255,.70)";
  ctx.font = "12px system-ui";
  pts.forEach(p=>{
    const label = dowLabel(p.dow);
    ctx.fillText(label, p.x - 12, h - 14);
  });

  // y axis hint
  ctx.fillStyle = "rgba(234,240,255,.55)";
  ctx.fillText(`0`, 18, top + plotH + 12);
  ctx.fillText(`${maxVal}`, 18, top + 6);
}

function renderAll(){
  renderHomeMini();
  renderTodayFocus();
  renderPlanOptions();
  renderTodayTasksBox();
  renderDayList();
  renderStats();
}

// ---------- Setup ----------
function initNav(){
  document.querySelectorAll("[data-tab]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      setActiveTab(btn.dataset.tab);
    });
  });

  document.querySelectorAll("[data-go]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      setActiveTab(btn.getAttribute("data-go"));
    });
  });
}

function initDrawer(){
  document.getElementById("btnMenu").addEventListener("click", openDrawer);
  document.getElementById("btnCloseDrawer").addEventListener("click", closeDrawer);
  document.getElementById("drawerBackdrop").addEventListener("click", closeDrawer);
}

function initLang(){
  document.getElementById("langAR").addEventListener("click", ()=>setLang("ar"));
  document.getElementById("langEN").addEventListener("click", ()=>setLang("en"));
}

function initMute(){
  setMuted(isMuted());
  document.getElementById("btnMute").addEventListener("click", ()=>{
    setMuted(!isMuted());
  });
  const soundOn = document.getElementById("soundOn");
  if(soundOn) soundOn.checked = true;
}

function initDurationsUI(){
  const d = loadDurations();
  const studyMin = document.getElementById("studyMin");
  const breakMin = document.getElementById("breakMin");
  studyMin.value = d.studyMin;
  breakMin.value = d.breakMin;

  document.getElementById("btnSaveDurations").addEventListener("click", ()=>{
    const s = Number(studyMin.value);
    const b = Number(breakMin.value);
    if(!Number.isFinite(s) || !Number.isFinite(b) || s<10 || s>90 || b<3 || b>30){
      toast(t("invalidNumber"));
      return;
    }
    saveDurations({ studyMin:s, breakMin:b });
    // reset timer with new durations
    setTimerMode(timer.mode);
    toast(t("toastSaved"));
  });
}

function initTimer(){
  loadTimerState();
  const d = loadDurations();
  document.getElementById("studyMin").value = d.studyMin;
  document.getElementById("breakMin").value = d.breakMin;

  // restore mode/time
  if(!timer.totalSec || !timer.leftSec){
    setTimerMode("study");
  }else{
    document.getElementById("timerMode").textContent = t(timer.mode === "study" ? "modeStudy" : "modeBreak");
    document.getElementById("timerHint").textContent = t(timer.mode === "study" ? "hintStudy" : "hintBreak");
    document.getElementById("cycleTag").textContent = String(timer.cycle);
    updateTimeText();
    drawRing();
  }

  document.getElementById("btnStart").addEventListener("click", ()=>{
    // resume audio context on interaction
    if(audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    startTick();
  });
  document.getElementById("btnPause").addEventListener("click", ()=>{
    timer.running = false;
    stopTick();
    saveTimerState();
  });
  document.getElementById("btnNext").addEventListener("click", ()=>{
    timer.running = false;
    stopTick();
    nextMode();
  });
  document.getElementById("btnReset").addEventListener("click", ()=>{
    timer.running = false;
    stopTick();
    resetTimer();
  });
}

function initPlanControls(){
  const st = loadPlanState();

  document.getElementById("targetMay1").addEventListener("click", ()=>{
    const s = loadPlanState();
    s.target = "may1";
    savePlanState(s);
    renderPlanOptions();
  });
  document.getElementById("targetMay15").addEventListener("click", ()=>{
    const s = loadPlanState();
    s.target = "may15";
    savePlanState(s);
    renderPlanOptions();
  });

  document.getElementById("dailyTwo").addEventListener("click", ()=>{
    const s = loadPlanState();
    s.dailyMode = "two";
    savePlanState(s);
    renderPlanOptions();
  });
  document.getElementById("dailyFour").addEventListener("click", ()=>{
    const s = loadPlanState();
    s.dailyMode = "four";
    savePlanState(s);
    renderPlanOptions();
  });

  document.getElementById("includeReviewDays").addEventListener("change", (e)=>{
    const s = loadPlanState();
    s.includeReviewDays = e.target.checked;
    savePlanState(s);
    renderPlanOptions();
  });
  document.getElementById("lightDay").addEventListener("change", (e)=>{
    const s = loadPlanState();
    s.lightDay = e.target.checked;
    savePlanState(s);
    renderPlanOptions();
  });

  document.getElementById("btnRegeneratePlan").addEventListener("click", regeneratePlan);
  document.getElementById("btnCopyPlan").addEventListener("click", copyPlan);

  document.getElementById("planSearch").addEventListener("input", ()=>{
    renderDayList();
  });
}

function initResets(){
  document.getElementById("btnResetAll").addEventListener("click", ()=>{
    if(!confirm(t("confirmReset"))) return;
    localStorage.removeItem(LS.metrics);
    localStorage.removeItem(LS.timerState);
    localStorage.removeItem(LS.dailyLog);
    localStorage.removeItem(LS.planState);
    toast(t("toastReset"));
    // reload defaults
    timer = { mode:"study", running:false, cycle:1, totalSec:25*60, leftSec:25*60, tickHandle:null };
    saveTimerState();
    renderAll();
    setTimerMode("study");
  });

  document.getElementById("btnResetStatsFromSessions").addEventListener("click", ()=>{
    if(!confirm(t("confirmReset"))) return;
    localStorage.removeItem(LS.metrics);
    localStorage.removeItem(LS.dailyLog);
    toast(t("toastReset"));
    renderAll();
  });
}

// ---------- PWA install ----------
let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById("btnInstall");
  btn.hidden = false;
});
function initInstall(){
  const btn = document.getElementById("btnInstall");
  btn.addEventListener("click", async (e)=>{
    e.preventDefault();
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    btn.hidden = true;
  });
}

// ---------- Service Worker ----------
function initSW(){
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js").catch(()=>{});
  }
}

function boot(){
  initNav();
  initDrawer();
  initLang();
  initMute();
  initInstall();

  loadTimerState();
  initDurationsUI();
  initTimer();

  initPlanControls();
  initResets();
  initSW();

  // apply language after DOM ready
  setLang(getLang());

  // if plan exists: ensure options reflect it
  const st = loadPlanState();
  if(st.plan){
    // update dailyLog planDone
    const log = loadDailyLog();
    st.plan.forEach(d=>{
      log[d.date] = log[d.date] || { studyMin:0, planDone:0 };
      log[d.date].planDone = d.tasks.filter(x=>x.done).length;
    });
    saveDailyLog(log);
  }

  // initial render
  renderAll();

  // ring
  drawRing();
}

document.addEventListener("DOMContentLoaded", boot);
