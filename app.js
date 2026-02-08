/* =========================================================
   T09 — Tawjihi Jordan (2009) Static Web App
   Vanilla JS / RTL+LTR / LocalStorage / PWA
   ========================================================= */

/* -----------------------------
   Storage Keys
----------------------------- */
const LS = {
  lang: "t09.lang",
  timer: "t09.timer",
  stats: "t09.stats",
  plan: "t09.plan",
  sources: "t09.sources",
  mute: "t09.mute",
};

/* -----------------------------
   i18n (All UI strings)
----------------------------- */
const i18n = {
  ar: {
    "app.name": "لوحة التوجيهي",
    "app.subtitle": "مصممة لتوجيهي الأردن — نظام 2009",
    "app.headerTitle": "لوحة التوجيهي 2009",
    "app.headerSubtitle": "عربي • إنجليزي • تاريخ • دين",
    "app.footerNote": "حفظ تلقائي + Offline + تثبيت كتطبيق.",
    "pwa.ready": "جاهز للأوفلاين",

    "tabs.home": "الرئيسية",
    "tabs.sessions": "جلسات",
    "tabs.plan": "الخطة الأسبوعية",
    "tabs.stats": "الإحصائيات",
    "tabs.bank": "بنك الأسئلة",

    "common.start": "ابدأ",
    "common.pause": "إيقاف",
    "common.reset": "إعادة",
    "common.next": "التالي",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.confirm": "تأكيد",
    "common.sound": "الصوت",

    "home.title": "جاهز ترفع معدلك بالتوجيهي؟",
    "home.subtitle": "هاي لوحة دراسة لتوجيهي الأردن (2009): جلسات منضبطة + خطة أسبوعية + بنك أسئلة بنمط وزاري + إحصائيات واضحة.",
    "home.badge": "نمط توجيهي • وزاري • مراجعة",
    "home.todayDone": "أنهيت اليوم ✅",
    "home.planCompletion": "من الخطة",
    "home.todayFocus": "تركيز اليوم",
    "home.startSession": "ابدأ جلسة",
    "home.openPlan": "افتح الخطة",
    "home.focusHint": "ملاحظة: “تركيز اليوم” يتولد تلقائياً من أول بلوك غير منجز بالخطة.",
    "home.quickActions": "إجراءات سريعة",
    "home.qa.sessions": "جلسة توجيهي",
    "home.qa.sessionsSub": "مؤقت + تتبع دقائق",
    "home.qa.plan": "خطة أسبوعية",
    "home.qa.planSub": "مراجعة + وزاري",
    "home.qa.bank": "بنك الأسئلة",
    "home.qa.bankSub": "MCQ + قصير",
    "home.qa.stats": "تقدمك",
    "home.qa.statsSub": "ستريك + مخطط",

    "sessions.title": "جلسات توجيهي (Pomodoro)",
    "sessions.subtitle": "نمط 25/5 — عدّل المدة حسبك، وخليها جلسات وزاري/مراجعة.",
    "sessions.mode": "الوضع:",
    "sessions.hintStudy": "جلسة دراسة: ركّز على نمط الأسئلة",
    "sessions.hintBreak": "استراحة: اشرب مي وتحرك شوي",
    "sessions.autoSwitch": "تبديل تلقائي بين دراسة/استراحة",
    "sessions.studyMin": "دقائق الدراسة",
    "sessions.breakMin": "دقائق الاستراحة",
    "sessions.studyHint": "مقترح توجيهي: 25–45 دقيقة حسب المادة.",
    "sessions.breakHint": "استراحة قصيرة لتجنب الإرهاق.",
    "sessions.metricsTitle": "مقاييس الجلسات",
    "sessions.metricsSub": "بتساعدك تشوف التزامك وتوازن بين المواد.",
    "sessions.completedStudy": "جلسات دراسة منجزة",
    "sessions.totalStudyMin": "مجموع دقائق الدراسة",
    "sessions.completedBreaks": "استراحات منجزة",
    "sessions.totalBreakMin": "مجموع دقائق الاستراحة",
    "sessions.metricsHint": "نصيحة توجيهي: خلي آخر جلسة باليوم “تحليل أخطاء” من الوزاري اللي حلّيته.",

    "plan.title": "الخطة الأسبوعية — توجيهي الأردن 2009",
    "plan.subtitle": "خطة متوازنة لـ (إنجليزي / عربي / تاريخ / دين) — تعلم + مراجعة + نمط أسئلة وزاري + يوم مراجعة أسبوعي.",
    "plan.regen": "إعادة توليد الخطة",
    "plan.copy": "نسخ الخطة",
    "plan.types.learn": "تعلم",
    "plan.types.revise": "مراجعة",
    "plan.types.practice": "نمط وزاري",
    "plan.types.review": "مراجعة أسبوعية",
    "plan.markDone": "تم ✅",
    "plan.undo": "تراجع",
    "plan.min": "دقيقة",
    "plan.goal": "الهدف",
    "plan.break": "استراحة قصيرة",
    "plan.lightDay": "يوم أخف لتجنب الاحتراق",
    "plan.reviewDay": "مراجعة أسبوعية + تجريبي",

    "stats.title": "الإحصائيات والتقدم",
    "stats.subtitle": "ملخص توجيهي واضح: دقائق، ستريك، أفضل يوم، وتوزيع مواد.",
    "stats.reset": "تصفير الإحصائيات",
    "stats.totalStudyTime": "إجمالي وقت الدراسة",
    "stats.planCompletion": "إنجاز الخطة",
    "stats.streak": "ستريك",
    "stats.weekHours": "ساعات هذا الأسبوع",
    "stats.days": "يوم",
    "stats.hours": "ساعة",
    "stats.bestDay": "أفضل يوم",
    "stats.subjectMix": "توزيع المواد",
    "stats.note": "الستريك: يوم فيه ≥ جلسة دراسة واحدة أو ≥ بلوك منجز من الخطة.",
    "stats.chartTitle": "مخطط تقدم الأسبوع",
    "stats.chartSub": "دقائق الدراسة اليومية (أو ما يقابلها من إنجاز الخطة).",
    "stats.chartLegend": "دقائق الدراسة",

    "bank.title.en": "Question Bank",
    "bank.title.ar": "بنك الأسئلة",
    "bank.subtitle": "أسئلة “Sample Tawjihi-style” فقط (للتجربة). ضع روابط المصادر الرسمية لاحقاً داخل قسم “المصادر”.",
    "bank.search": "بحث",
    "bank.difficulty": "الصعوبة",
    "bank.type": "النوع",
    "bank.all": "الكل",
    "bank.sourcesTitle": "المصادر (Sources)",
    "bank.sourcesSub": "أضف لاحقاً روابط الوزارة/الأسئلة الوزارية الرسمية. لا يوجد ادعاء بجلب “2026” حالياً.",
    "bank.srcTitle": "العنوان",
    "bank.srcYear": "السنة",
    "bank.srcLink": "الرابط",
    "bank.addSource": "إضافة مصدر",
    "bank.sourcesHint": "بإمكانك تعديل الأسئلة بسهولة من ملف app.js عبر JSON واحد: questionBank.",
    "bank.showAnswer": "عرض الإجابة",
    "bank.hideAnswer": "إخفاء الإجابة",
    "bank.noResults": "ما في نتائج حسب الفلاتر الحالية.",

    "difficulty.easy": "سهل",
    "difficulty.medium": "متوسط",
    "difficulty.hard": "صعب",
    "qtype.mcq": "اختيار من متعدد",
    "qtype.short": "سؤال قصير",

    "subjects.english": "إنجليزي",
    "subjects.arabic": "عربي",
    "subjects.history": "تاريخ",
    "subjects.religion": "دين",

    "modal.confirmTitle": "تأكيد",
    "modal.resetStats": "هل أنت متأكد بدك تصفّر الإحصائيات؟ هذا الإجراء ما بنرجع.",
    "toast.copied": "تم النسخ ✅",
    "toast.saved": "تم الحفظ ✅",
    "toast.invalid": "تأكد من المدخلات (أرقام ضمن الحدود).",
    "toast.done": "تم تسجيل الإنجاز ✅",
    "toast.undone": "تم التراجع.",
    "toast.planCopied": "الخطة اننسخت ✅",
    "toast.exportCopied": "تم نسخ بيانات التطبيق (JSON) ✅",
  },

  en: {
    "app.name": "Tawjihi Dashboard",
    "app.subtitle": "Built for Jordan Tawjihi — 2009 track",
    "app.headerTitle": "Tawjihi 2009 Dashboard",
    "app.headerSubtitle": "Arabic • English • History • Religion",
    "app.footerNote": "Auto-save + Offline + Installable.",
    "pwa.ready": "Offline-ready",

    "tabs.home": "Home",
    "tabs.sessions": "Sessions",
    "tabs.plan": "Weekly Plan",
    "tabs.stats": "Statistics",
    "tabs.bank": "Question Bank",

    "common.start": "Start",
    "common.pause": "Pause",
    "common.reset": "Reset",
    "common.next": "Next",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.sound": "Sound",

    "home.title": "Ready to boost your Tawjihi score?",
    "home.subtitle": "A Jordan Tawjihi (2009) study dashboard: focused sessions + weekly plan + ministerial-style question bank + clear stats.",
    "home.badge": "Tawjihi style • Wazari • Revision",
    "home.todayDone": "Done today ✅",
    "home.planCompletion": "from the plan",
    "home.todayFocus": "Today’s Focus",
    "home.startSession": "Start session",
    "home.openPlan": "Open plan",
    "home.focusHint": "Note: “Today’s Focus” is generated from the first unfinished block in your plan.",
    "home.quickActions": "Quick actions",
    "home.qa.sessions": "Tawjihi Session",
    "home.qa.sessionsSub": "Timer + tracking",
    "home.qa.plan": "Weekly Plan",
    "home.qa.planSub": "Revision + Wazari practice",
    "home.qa.bank": "Question Bank",
    "home.qa.bankSub": "MCQ + Short answer",
    "home.qa.stats": "Your progress",
    "home.qa.statsSub": "Streak + chart",

    "sessions.title": "Tawjihi Sessions (Pomodoro)",
    "sessions.subtitle": "25/5 by default — customize for each subject and Wazari practice.",
    "sessions.mode": "Mode:",
    "sessions.hintStudy": "Study: focus on exam-style practice",
    "sessions.hintBreak": "Break: hydrate and reset",
    "sessions.autoSwitch": "Auto-switch between Study/Break",
    "sessions.studyMin": "Study minutes",
    "sessions.breakMin": "Break minutes",
    "sessions.studyHint": "Tawjihi tip: 25–45 minutes per block.",
    "sessions.breakHint": "Short breaks prevent burnout.",
    "sessions.metricsTitle": "Session metrics",
    "sessions.metricsSub": "See consistency and balance across subjects.",
    "sessions.completedStudy": "Completed study sessions",
    "sessions.totalStudyMin": "Total study minutes",
    "sessions.completedBreaks": "Completed breaks",
    "sessions.totalBreakMin": "Total break minutes",
    "sessions.metricsHint": "Tawjihi tip: end your day with “error analysis” from past-paper practice.",

    "plan.title": "Weekly Plan — Jordan Tawjihi 2009",
    "plan.subtitle": "Balanced plan for (English / Arabic / History / Religion) — Learn + Revise + Wazari-style practice + weekly review day.",
    "plan.regen": "Regenerate plan",
    "plan.copy": "Copy plan",
    "plan.types.learn": "Learn",
    "plan.types.revise": "Revise",
    "plan.types.practice": "Wazari practice",
    "plan.types.review": "Weekly review",
    "plan.markDone": "Done ✅",
    "plan.undo": "Undo",
    "plan.min": "min",
    "plan.goal": "Goal",
    "plan.break": "Short break",
    "plan.lightDay": "Lighter day (avoid burnout)",
    "plan.reviewDay": "Weekly review + mini mock",

    "stats.title": "Statistics & Progress",
    "stats.subtitle": "A clear Tawjihi summary: minutes, streak, best day, and subject mix.",
    "stats.reset": "Reset stats",
    "stats.totalStudyTime": "Total study time",
    "stats.planCompletion": "Plan completion",
    "stats.streak": "Streak",
    "stats.weekHours": "This week hours",
    "stats.days": "days",
    "stats.hours": "hours",
    "stats.bestDay": "Best day",
    "stats.subjectMix": "Subject mix",
    "stats.note": "Streak: a day with ≥1 study session OR ≥1 completed plan block.",
    "stats.chartTitle": "Weekly progress chart",
    "stats.chartSub": "Daily study minutes (and plan completion impact).",
    "stats.chartLegend": "Study minutes",

    "bank.title.en": "Question Bank",
    "bank.title.ar": "بنك الأسئلة",
    "bank.subtitle": "These are “Sample Tawjihi-style” placeholders only. Add official ministry links later in “Sources”.",
    "bank.search": "Search",
    "bank.difficulty": "Difficulty",
    "bank.type": "Type",
    "bank.all": "All",
    "bank.sourcesTitle": "Sources",
    "bank.sourcesSub": "Add official ministry/past-paper links later. No claims of fetching “2026”.",
    "bank.srcTitle": "Title",
    "bank.srcYear": "Year",
    "bank.srcLink": "Link",
    "bank.addSource": "Add source",
    "bank.sourcesHint": "Replace samples easily by editing one JSON object in app.js: questionBank.",
    "bank.showAnswer": "Show answer",
    "bank.hideAnswer": "Hide answer",
    "bank.noResults": "No results for current filters.",

    "difficulty.easy": "Easy",
    "difficulty.medium": "Medium",
    "difficulty.hard": "Hard",
    "qtype.mcq": "MCQ",
    "qtype.short": "Short Answer",

    "subjects.english": "English",
    "subjects.arabic": "Arabic",
    "subjects.history": "History",
    "subjects.religion": "Religion",

    "modal.confirmTitle": "Confirm",
    "modal.resetStats": "Are you sure you want to reset stats? This can’t be undone.",
    "toast.copied": "Copied ✅",
    "toast.saved": "Saved ✅",
    "toast.invalid": "Check inputs (numbers within limits).",
    "toast.done": "Logged ✅",
    "toast.undone": "Undone.",
    "toast.planCopied": "Plan copied ✅",
    "toast.exportCopied": "App data copied (JSON) ✅",
  }
};

/* -----------------------------
   Question Bank (Single JSON)
   Replace sample questions later with real ministerial questions + sources.
----------------------------- */
const questionBank = {
  subjects: {
    english: {
      name: { ar: "إنجليزي", en: "English" },
      questions: [
        // 20 SAMPLE Tawjihi-style (EN)
        q("en1","mcq","easy","Sample Tawjihi-style: Choose the correct word: I ______ to school every day.","go","english"),
        q("en2","mcq","easy","Sample Tawjihi-style: Choose the correct form: She ______ TV الآن.","is watching","english"),
        q("en3","mcq","easy","Sample Tawjihi-style: Pick the synonym of “important”.","significant","english"),
        q("en4","mcq","easy","Sample Tawjihi-style: Choose the correct preposition: interested ____ science.","in","english"),
        q("en5","mcq","medium","Sample Tawjihi-style: Identify the error: “He don’t like coffee.”","don’t → doesn’t","english"),
        q("en6","short","easy","Sample Tawjihi-style: Write ONE sentence using (because).","Example: I studied because I have a Wazari exam.","english"),
        q("en7","mcq","medium","Sample Tawjihi-style: Choose the best connector: I was tired; ______, I finished my homework.","however / nevertheless","english"),
        q("en8","short","medium","Sample Tawjihi-style: Write a 25–30 word paragraph about a study plan.","Key idea: routine + revision + past papers.","english"),
        q("en9","mcq","medium","Sample Tawjihi-style: Choose the correct passive: They built the bridge in 2010.","The bridge was built in 2010.","english"),
        q("en10","mcq","medium","Sample Tawjihi-style: Choose the correct reported speech: He said, “I am ready.”","He said that he was ready.","english"),
        q("en11","mcq","hard","Sample Tawjihi-style: Choose the correct meaning of “sustainable”.","able to continue without harm","english"),
        q("en12","short","medium","Sample Tawjihi-style: Give two advantages of time management for Tawjihi students.","Focus + less stress (any two valid).","english"),
        q("en13","mcq","hard","Sample Tawjihi-style: Choose the correct relative clause: The student ____ scored highest studied daily.","who","english"),
        q("en14","mcq","medium","Sample Tawjihi-style: Choose the correct word: This exam was ______ than I expected.","easier","english"),
        q("en15","short","hard","Sample Tawjihi-style: Summarize (in 1–2 sentences) why practice tests help.","They simulate timing and reveal weak points.","english"),
        q("en16","mcq","easy","Sample Tawjihi-style: Choose the correct article: ____ honest student helps others.","An","english"),
        q("en17","mcq","medium","Sample Tawjihi-style: Choose the correct modal: You ______ review mistakes after each mock.","should","english"),
        q("en18","short","easy","Sample Tawjihi-style: Write one question using “How often…?”","Example: How often do you revise vocabulary?","english"),
        q("en19","mcq","hard","Sample Tawjihi-style: Choose the correct conditional: If I ______ earlier, I would have revised more.","had started","english"),
        q("en20","short","medium","Sample Tawjihi-style: Suggest two ways to improve reading comprehension.","Skim + scan / annotate / summarize (any two).","english"),
      ]
    },

    arabic: {
      name: { ar: "عربي", en: "Arabic" },
      questions: [
        // 20 SAMPLE Tawjihi-style (AR)
        q("ar1","mcq","easy","عينة بنمط توجيهي: اختر الكلمة التي تُكتب همزتها على الألف: (سؤال/سئل/مسؤول/مئذنة)","مسؤول","arabic"),
        q("ar2","mcq","easy","عينة بنمط توجيهي: اختر جمع كلمة (كتاب): (كتابات/كتب/كتابون/كتابي)","كتب","arabic"),
        q("ar3","short","easy","عينة بنمط توجيهي: اكتب جملة فعلية وحدد الفاعل.","مثال: حضرَ الطالبُ؛ الفاعل: الطالب.","arabic"),
        q("ar4","mcq","medium","عينة بنمط توجيهي: حدّد نوع الأسلوب: (ما أجملَ الصدقَ!).","تعجب","arabic"),
        q("ar5","mcq","medium","عينة بنمط توجيهي: اختر الإعراب الصحيح لكلمة (المجتهدُ) في: (المجتهدُ ناجحٌ).","مبتدأ مرفوع","arabic"),
        q("ar6","short","medium","عينة بنمط توجيهي: بيّن الفكرة الرئيسة من نص قصير عن تنظيم الوقت (بجملة).","الفكرة: تنظيم الوقت يرفع الإنجاز ويقلل التوتر.","arabic"),
        q("ar7","mcq","easy","عينة بنمط توجيهي: اختر المضاد لكلمة (شجاع).","جبان","arabic"),
        q("ar8","mcq","hard","عينة بنمط توجيهي: حدّد الصورة البيانية في: (العلم نور).","استعارة","arabic"),
        q("ar9","short","medium","عينة بنمط توجيهي: اذكر فائدتين للمراجعة الدورية قبل الوزاري.","تثبيت المعلومات + كشف نقاط الضعف.","arabic"),
        q("ar10","mcq","medium","عينة بنمط توجيهي: حدّد نوع (لا) في: (لا تهملْ دروسك).","ناهية","arabic"),
        q("ar11","mcq","medium","عينة بنمط توجيهي: اختر الصواب: (هؤلاءِ الطلابُ/هؤلاءُ الطلابُ).","هؤلاءِ الطلابُ","arabic"),
        q("ar12","short","easy","عينة بنمط توجيهي: استخرج مفعولاً به من جملة: (قرأ الطالبُ الكتابَ).","الكتابَ","arabic"),
        q("ar13","mcq","hard","عينة بنمط توجيهي: حدّد المحسن البديعي: (سالمٌ في السلم، صامدٌ في الحرب).","طباق","arabic"),
        q("ar14","mcq","easy","عينة بنمط توجيهي: اختر التمييز الصحيح: (اشتريتُ ____ تفاحاً).","كيلوغراماً","arabic"),
        q("ar15","short","hard","عينة بنمط توجيهي: اكتب فقرة قصيرة (40–50 كلمة) عن خطة دراسة توجيهي.","نقاط: أهداف + جدول + وزاري + تحليل أخطاء.","arabic"),
        q("ar16","mcq","medium","عينة بنمط توجيهي: حدّد نوع الخبر: (الطالبُ مجتهدٌ).","مفرد","arabic"),
        q("ar17","short","medium","عينة بنمط توجيهي: علّل: لماذا نحل أسئلة نمط وزاري بوقت محدد؟","لتعويد النفس على زمن الامتحان وتقليل الأخطاء.","arabic"),
        q("ar18","mcq","easy","عينة بنمط توجيهي: اختر اسم الفاعل من (كتب).","كاتب","arabic"),
        q("ar19","mcq","hard","عينة بنمط توجيهي: حدّد سبب منع الصرف في: (مساجدَ).","صيغة منتهى الجموع","arabic"),
        q("ar20","short","easy","عينة بنمط توجيهي: حوّل الجملة إلى نهي: (تهملُ واجبك).","لا تهملْ واجبك.","arabic"),
      ]
    },

    history: {
      name: { ar: "تاريخ", en: "History" },
      questions: [
        // 20 SAMPLE Tawjihi-style (History — neutral Jordan-focused wording)
        q("his1","mcq","easy","عينة بنمط توجيهي: ما الهدف من حل أسئلة سنوات سابقة في التاريخ؟","معرفة نمط الأسئلة وتثبيت الأحداث","history"),
        q("his2","short","easy","عينة بنمط توجيهي: اذكر سببين لأهمية ترتيب الأحداث زمنياً.","يساعد الفهم + يمنع الخلط (أي إجابتين).","history"),
        q("his3","mcq","medium","عينة بنمط توجيهي: عند قراءة وثيقة تاريخية، أول خطوة؟","تحديد المصدر والزمن والسياق","history"),
        q("his4","mcq","easy","عينة بنمط توجيهي: أفضل طريقة لمراجعة التاريخ قبل الوزاري؟","تلخيص + خرائط ذهنية + أسئلة نمط","history"),
        q("his5","short","medium","عينة بنمط توجيهي: كيف يفيدك “تحليل الأخطاء” بعد امتحان تجريبي؟","يكشف نقاط الضعف ويثبت التصحيح.","history"),
        q("his6","mcq","medium","عينة بنمط توجيهي: أسئلة “اختيار من متعدد” تقيس غالباً؟","فهم المصطلحات وربط السبب بالنتيجة","history"),
        q("his7","short","easy","عينة بنمط توجيهي: عرّف مفهوم (السبب والنتيجة) في دراسة التاريخ.","ترابط حدث يؤدي لنتائج لاحقة.","history"),
        q("his8","mcq","hard","عينة بنمط توجيهي: ما أفضل أسلوب لتثبيت أسماء الشخصيات والأماكن؟","بطاقات + تكرار متباعد + اختبار ذاتي","history"),
        q("his9","short","medium","عينة بنمط توجيهي: اكتب سؤالين مراجعة لنفسك عن درس تاريخ.","مثال: ما الأسباب؟ ما النتائج؟","history"),
        q("his10","mcq","easy","عينة بنمط توجيهي: عند الإجابة الوزارية، الأفضل؟","إجابة مباشرة مع كلمات مفتاحية","history"),
        q("his11","mcq","medium","عينة بنمط توجيهي: “المقارنة” في التاريخ تعني؟","إبراز أوجه التشابه والاختلاف","history"),
        q("his12","short","hard","عينة بنمط توجيهي: صِف خطة مراجعة 3 أيام قبل امتحان تاريخ.","ملخصات + نمط + اختبار 60 دقيقة + تحليل أخطاء.","history"),
        q("his13","mcq","medium","عينة بنمط توجيهي: أي التالي يساعد على فهم الأحداث؟","ربط الحدث بخلفيته الاقتصادية/السياسية","history"),
        q("his14","short","easy","عينة بنمط توجيهي: ما المقصود بالمصطلح التاريخي؟","كلمة لها معنى محدد في سياق تاريخي.","history"),
        q("his15","mcq","hard","عينة بنمط توجيهي: أفضل طريقة لتقليل النسيان؟","مراجعات قصيرة متكررة (Spaced)","history"),
        q("his16","short","medium","عينة بنمط توجيهي: لماذا نستخدم خرائط ذهنية في التاريخ؟","لتجميع المحاور وربط الأفكار.","history"),
        q("his17","mcq","easy","عينة بنمط توجيهي: سؤال “رتّب الأحداث” يقيس؟","التسلسل الزمني","history"),
        q("his18","mcq","medium","عينة بنمط توجيهي: في الامتحان، لو محتار بين خيارين؟","ارجع للكلمة المفتاحية في السؤال","history"),
        q("his19","short","medium","عينة بنمط توجيهي: اذكر طريقتين لمراجعة درس طويل.","تلخيص + أسئلة ذاتية/نمط.","history"),
        q("his20","mcq","easy","عينة بنمط توجيهي: وقت الحصة التجريبية الأفضل يكون؟","نفس وقت الامتحان لتعويد النفس","history"),
      ]
    },

    religion: {
      name: { ar: "دين", en: "Religion" },
      questions: [
        // 20 SAMPLE Tawjihi-style (Religion — general, non-sectarian)
        q("rel1","mcq","easy","عينة بنمط توجيهي: الهدف من المراجعة قبل امتحان الدين؟","تثبيت المفاهيم والأدلة","religion"),
        q("rel2","short","easy","عينة بنمط توجيهي: اذكر فائدتين لحسن الخلق في المجتمع.","تماسك + ثقة (أي إجابتين).","religion"),
        q("rel3","mcq","medium","عينة بنمط توجيهي: أفضل أسلوب لحفظ التعاريف؟","فهم المعنى ثم تكرار واختبار ذاتي","religion"),
        q("rel4","mcq","easy","عينة بنمط توجيهي: أسئلة “صح/خطأ” تعتمد على؟","الدقة في المفهوم والكلمة","religion"),
        q("rel5","short","medium","عينة بنمط توجيهي: لماذا نحل أسئلة نمط وزاري بوقت محدد؟","لتعويد النفس على زمن الامتحان وتقليل التردد.","religion"),
        q("rel6","mcq","hard","عينة بنمط توجيهي: أي التالي يساعد على فهم الدرس؟","تلخيص + أمثلة تطبيقية + مراجعة متباعدة","religion"),
        q("rel7","short","easy","عينة بنمط توجيهي: اكتب تعريفاً مختصراً لمفهوم “النية”.","القصد بالقلب قبل العمل.","religion"),
        q("rel8","mcq","medium","عينة بنمط توجيهي: عند سؤال دليل/تعليل، الأفضل؟","ذكر الفكرة + دليل مختصر + تطبيق","religion"),
        q("rel9","short","medium","عينة بنمط توجيهي: اذكر طريقتين لتجنب الغلو والتطرف.","الوسطية + الرجوع للمصادر الموثوقة.","religion"),
        q("rel10","mcq","easy","عينة بنمط توجيهي: “تحليل الأخطاء” بعد التجريبي يفيد لأنه؟","يمنع تكرار الخطأ ويقوي الفهم","religion"),
        q("rel11","mcq","medium","عينة بنمط توجيهي: سؤال “اختر الإجابة الأدق” يقيس؟","الفهم العميق للمصطلح","religion"),
        q("rel12","short","hard","عينة بنمط توجيهي: صِف خطة مراجعة أسبوعية لمادة الدين.","جلسات قصيرة + أسئلة نمط + مراجعة أدلة.","religion"),
        q("rel13","mcq","easy","عينة بنمط توجيهي: أفضل وقت لمراجعة الحفظ؟","مراجعة سريعة يومياً","religion"),
        q("rel14","short","easy","عينة بنمط توجيهي: أعط مثالاً واحداً على الصدق في الحياة.","أي مثال مناسب.","religion"),
        q("rel15","mcq","hard","عينة بنمط توجيهي: لتثبيت أدلة الدرس، استخدم؟","بطاقات + اختبار ذاتي + تكرار متباعد","religion"),
        q("rel16","mcq","medium","عينة بنمط توجيهي: عند سؤال “علّل”، الأفضل؟","جملة سبب مباشرة ثم توضيح مختصر","religion"),
        q("rel17","short","medium","عينة بنمط توجيهي: اكتب سؤالين لمراجعة درس في الأخلاق.","مثال: عرف… اذكر أثر…","religion"),
        q("rel18","mcq","easy","عينة بنمط توجيهي: من مهارات الامتحان؟","قراءة السؤال مرتين وتحديد الكلمات المفتاحية","religion"),
        q("rel19","short","medium","عينة بنمط توجيهي: ما فائدة حل نماذج الوزاري؟","تعرف النمط + تثبيت المفاهيم.","religion"),
        q("rel20","mcq","easy","عينة بنمط توجيهي: للاستفادة من المراجعة، الأفضل؟","مراجعة منتظمة بدل ليلة الامتحان فقط","religion"),
      ]
    }
  },

  // Sources UI: editable + stored to LocalStorage
  sources: [
    // Start empty-ish (placeholders); user can add official ministry links later
    { title: "Placeholder — Official links can be added here", year: 2026, link: "https://example.com" }
  ]
};

/* Helper to create a question object (all samples are marked) */
function q(id, type, difficulty, text, answer, subject){
  return { id, subject, type, difficulty, text, answer, sample: true };
}

/* -----------------------------
   App State
----------------------------- */
const state = {
  lang: loadLS(LS.lang, "ar"),
  mute: loadLS(LS.mute, false),
  timer: loadLS(LS.timer, {
    studyMinutes: 25,
    breakMinutes: 5,
    autoSwitch: true,
  }),
  stats: loadLS(LS.stats, {
    studySessions: 0,
    studyMinutes: 0,
    breakSessions: 0,
    breakMinutes: 0,
    dailyMinutes: {}, // { "YYYY-MM-DD": number }
    subjectMinutes: { english: 0, arabic: 0, history: 0, religion: 0 },
    lastActivityDate: null
  }),
  plan: loadLS(LS.plan, null),
  sources: loadLS(LS.sources, questionBank.sources),
  ui: {
    activeTab: "home",
    bankSubject: "english",
    bankSearch: "",
    bankDifficulty: "all",
    bankType: "all"
  }
};

/* -----------------------------
   DOM
----------------------------- */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

/* Top toggles */
const langToggle = $("#langToggle");
const langToggleText = $("#langToggleText");
const muteToggle = $("#muteToggle");
const muteIcon = $("#muteIcon");
const copyAppStateBtn = $("#copyAppStateBtn");

/* Tabs */
const tabButtons = [...$$(".nav-item[data-tab]"), ...$$(".bn-item[data-tab]"), ...$$(".drawer .nav-item[data-tab]")];
const tabs = {
  home: $("#tab-home"),
  sessions: $("#tab-sessions"),
  plan: $("#tab-plan"),
  stats: $("#tab-stats"),
  bank: $("#tab-bank"),
};

/* Home KPIs */
const kpiStreak = $("#kpiStreak");
const kpiWeekHours = $("#kpiWeekHours");
const kpiTodayDone = $("#kpiTodayDone");
const todayLabel = $("#todayLabel");
const focusTitle = $("#focusTitle");
const focusMeta = $("#focusMeta");

/* Drawer */
const mobileMenuBtn = $("#mobileMenuBtn");
const drawer = $("#drawer");
const drawerBackdrop = $("#drawerBackdrop");
const drawerCloseBtn = $("#drawerCloseBtn");

/* Modal */
const modalBackdrop = $("#modalBackdrop");
const confirmModal = $("#confirmModal");
const modalCloseBtn = $("#modalCloseBtn");
const confirmText = $("#confirmText");
const confirmCancel = $("#confirmCancel");
const confirmOk = $("#confirmOk");

/* Timer */
const timerModeLabel = $("#timerModeLabel");
const timerTime = $("#timerTime");
const timerHint = $("#timerHint");
const progressRing = $("#progressRing");

const btnStart = $("#btnStart");
const btnPause = $("#btnPause");
const btnReset = $("#btnReset");
const btnNext = $("#btnNext");

const autoSwitch = $("#autoSwitch");
const studyMinutesInput = $("#studyMinutes");
const breakMinutesInput = $("#breakMinutes");
const saveDurationsBtn = $("#saveDurationsBtn");

/* Session metrics */
const mStudySessions = $("#mStudySessions");
const mStudyMinutes = $("#mStudyMinutes");
const mBreakSessions = $("#mBreakSessions");
const mBreakMinutes = $("#mBreakMinutes");

/* Plan */
const weeklyGrid = $("#weeklyGrid");
const regenPlanBtn = $("#regenPlanBtn");
const copyPlanBtn = $("#copyPlanBtn");

/* Stats */
const resetStatsBtn = $("#resetStatsBtn");
const sStudySessions = $("#sStudySessions");
const sStudyTime = $("#sStudyTime");
const sPlanCompletion = $("#sPlanCompletion");
const sStreak = $("#sStreak");
const sBestDay = $("#sBestDay");
const sSubjectMix = $("#sSubjectMix");
const progressChart = $("#progressChart");

/* Bank */
const bankSearch = $("#bankSearch");
const difficultyFilter = $("#difficultyFilter");
const typeFilter = $("#typeFilter");
const bankList = $("#bankList");
const subjectSegs = $$(".segmented .seg");
const sourcesList = $("#sourcesList");
const addSourceForm = $("#addSourceForm");
const srcTitle = $("#srcTitle");
const srcYear = $("#srcYear");
const srcLink = $("#srcLink");

/* Buttons that jump tabs */
$$("[data-jump]").forEach(btn => {
  btn.addEventListener("click", () => setActiveTab(btn.dataset.jump));
});

/* -----------------------------
   Timer Engine
----------------------------- */
const timerEngine = {
  mode: "study", // "study" | "break"
  running: false,
  remainingSec: 25 * 60,
  totalSec: 25 * 60,
  tickId: null,

  setMode(mode){
    this.mode = mode;
    const mins = mode === "study" ? state.timer.studyMinutes : state.timer.breakMinutes;
    this.remainingSec = mins * 60;
    this.totalSec = mins * 60;
    updateTimerUI();
  },

  start(){
    if (this.running) return;
    this.running = true;
    this.tickId = setInterval(() => this.tick(), 1000);
    updateTimerUI();
  },

  pause(){
    this.running = false;
    if (this.tickId) clearInterval(this.tickId);
    this.tickId = null;
    updateTimerUI();
  },

  reset(){
    this.pause();
    const mins = this.mode === "study" ? state.timer.studyMinutes : state.timer.breakMinutes;
    this.remainingSec = mins * 60;
    this.totalSec = mins * 60;
    updateTimerUI();
  },

  next(){
    this.pause();
    this.setMode(this.mode === "study" ? "break" : "study");
  },

  finish(){
    // Add metrics
    const mins = this.mode === "study" ? state.timer.studyMinutes : state.timer.breakMinutes;

    if (this.mode === "study"){
      state.stats.studySessions += 1;
      state.stats.studyMinutes += mins;
      addDailyMinutes(todayKey(), mins);
      // For subject minutes, we attribute study sessions to today's focus subject if available:
      const subj = inferFocusSubject() || "english";
      state.stats.subjectMinutes[subj] = (state.stats.subjectMinutes[subj] || 0) + mins;
    } else {
      state.stats.breakSessions += 1;
      state.stats.breakMinutes += mins;
    }

    markActivity();
    saveStats();
    renderAllKPIs();
    renderSessionMetrics();
    renderStats();
    drawChart();

    // Alert
    alertPulse();
    playBeep();

    // Auto switch
    if (state.timer.autoSwitch){
      this.setMode(this.mode === "study" ? "break" : "study");
      this.start();
    } else {
      this.pause();
    }
  },

  tick(){
    if (!this.running) return;
    this.remainingSec -= 1;
    if (this.remainingSec <= 0){
      this.remainingSec = 0;
      updateTimerUI();
      this.finish();
      return;
    }
    updateTimerUI();
  }
};

/* -----------------------------
   Weekly Plan Generator
----------------------------- */
const DAYS_SUN_SAT = [
  { key: "sun", ar: "الأحد", en: "Sun" },
  { key: "mon", ar: "الإثنين", en: "Mon" },
  { key: "tue", ar: "الثلاثاء", en: "Tue" },
  { key: "wed", ar: "الأربعاء", en: "Wed" },
  { key: "thu", ar: "الخميس", en: "Thu" },
  { key: "fri", ar: "الجمعة", en: "Fri" },
  { key: "sat", ar: "السبت", en: "Sat" },
];

const SUBJECTS = ["english","arabic","history","religion"];

const TASK_TYPES = {
  learn: { ar: "تعلم", en: "Learn", css: "learn" },
  revise: { ar: "مراجعة", en: "Revise", css: "revise" },
  practice: { ar: "نمط وزاري", en: "Wazari practice", css: "practice" },
  review: { ar: "مراجعة أسبوعية", en: "Weekly review", css: "review" },
};

function generateWeeklyPlan(seed = Date.now()){
  // deterministic-ish using seeded pseudo-random
  const rand = mulberry32(hashSeed(String(seed)));
  const plan = {
    createdAt: new Date().toISOString(),
    seed,
    days: {}
  };

  // Choose light day and review day (Jordan rhythm: Fri lighter, Sat weekly review)
  const lightDayKey = "fri";
  const reviewDayKey = "sat";

  // Subject rotation with bias so each appears daily across the week
  let rotation = SUBJECTS.slice();
  shuffle(rotation, rand);

  for (const d of DAYS_SUN_SAT){
    const blocks = [];
    const isLight = d.key === lightDayKey;
    const isReview = d.key === reviewDayKey;

    if (isReview){
      // Weekly review: mini mock + error review + quick revise
      const mockSubject = rotation[Math.floor(rand() * rotation.length)];
      blocks.push(blockObj(d.key, mockSubject, "practice", 60, goalText(mockSubject, "practice", rand, true), rand));
      blocks.push(blockObj(d.key, mockSubject, "review", 35, goalText(mockSubject, "review", rand, true), rand));
      blocks.push(blockObj(d.key, pickAnother(mockSubject, rotation, rand), "revise", 30, goalText(pickAnother(mockSubject, rotation, rand), "revise", rand), rand));
    } else {
      // Normal day: 2–4 blocks, include at least 1 practice block
      const blockCount = isLight ? 2 : (rand() < 0.45 ? 3 : 4);

      // Ensure practice exists
      const practiceIndex = Math.floor(rand() * blockCount);

      for (let i=0;i<blockCount;i++){
        const subj = rotation[(i + DAYS_SUN_SAT.indexOf(d)) % rotation.length];
        let type;
        if (i === practiceIndex) type = "practice";
        else type = rand() < 0.55 ? "revise" : "learn";

        const minutes = minutesFor(type, isLight, rand);
        blocks.push(blockObj(d.key, subj, type, minutes, goalText(subj, type, rand), rand));
      }
    }

    // Add a short break note between blocks (UI hint only)
    plan.days[d.key] = {
      dayKey: d.key,
      isLight,
      isReview,
      blocks
    };
  }

  return plan;
}

function blockObj(dayKey, subject, type, minutes, goal, rand){
  const id = `${dayKey}-${subject}-${type}-${Math.floor(rand()*1e9)}`;
  return {
    id,
    subject,
    type,
    minutes,
    goal,
    done: false,
    createdAt: new Date().toISOString()
  };
}

function minutesFor(type, isLight, rand){
  if (type === "practice") return isLight ? 35 : (rand() < 0.5 ? 45 : 50);
  if (type === "learn") return isLight ? 30 : (rand() < 0.5 ? 35 : 40);
  if (type === "revise") return isLight ? 25 : (rand() < 0.5 ? 30 : 35);
  if (type === "review") return 35;
  return 30;
}

function goalText(subject, type, rand, isReviewDay=false){
  const s = subject;
  const goalSets = {
    english: {
      learn: [
        "Vocabulary set + examples",
        "Reading: main idea + details",
        "Grammar rule + 10 mini drills"
      ],
      revise: [
        "Review mistakes from last quiz",
        "Flashcards (10–15) + self-test",
        "Rewrite weak grammar notes"
      ],
      practice: [
        "Wazari-style MCQ timed set",
        "Past-paper passage (timed) + corrections",
        "Timed writing outline + checklist"
      ],
      review: [
        "Mini mock + error log (weak points)",
        "Summarize top 5 recurring mistakes"
      ]
    },
    arabic: {
      learn: [
        "نحو: قاعدة + أمثلة",
        "بلاغة: مصطلحات + تطبيق سريع",
        "قراءة: فكرة عامة + مفردات"
      ],
      revise: [
        "مراجعة إعراب + تدريبات قصيرة",
        "بطاقات مصطلحات + اختبار ذاتي",
        "تلخيص درس بصياغتك"
      ],
      practice: [
        "نمط وزاري: إعراب/بلاغة بوقت محدد",
        "أسئلة سنوات + تصحيح فوري",
        "فقرة قصيرة + تدقيق"
      ],
      review: [
        "امتحان تجريبي قصير + تحليل أخطاء",
        "قائمة أخطاء متكررة + حلها"
      ]
    },
    history: {
      learn: [
        "خريطة ذهنية للدرس",
        "مصطلحات + تسلسل زمني",
        "سبب/نتيجة: 3 نقاط لكل محور"
      ],
      revise: [
        "مراجعة ملخص + كلمات مفتاحية",
        "بطاقات تواريخ وأسماء + اختبار",
        "تلخيص أحداث بترتيب زمني"
      ],
      practice: [
        "نمط وزاري: اختيار/علّل بوقت محدد",
        "أسئلة شاملة للدرس + تصحيح",
        "خريطة أحداث + أسئلة ذاتية"
      ],
      review: [
        "ميني موك 60 دقيقة + تحليل أخطاء",
        "مراجعة نقاط الخلط"
      ]
    },
    religion: {
      learn: [
        "تعريفات + أمثلة تطبيقية",
        "مفاهيم الدرس + ربط بالحياة",
        "حفظ نقاط أساسية + اختبار"
      ],
      revise: [
        "مراجعة أدلة/تعليلات + أسئلة قصيرة",
        "تلخيص صفحة واحدة",
        "اختبار ذاتي (10 أسئلة)"
      ],
      practice: [
        "نمط وزاري: صح/خطأ + علّل بوقت محدد",
        "امتحان تجريبي قصير + تصحيح",
        "تحليل أخطاء + إعادة حل"
      ],
      review: [
        "ميني موك + مراجعة التعليلات",
        "ورقة أخطاء ثابتة"
      ]
    }
  };

  const set = goalSets[s]?.[type] || ["Focus + practice"];
  const pick = set[Math.floor(rand()*set.length)];
  // Keep it bilingual-ready by returning Arabic if app in Arabic, otherwise English (handled in render)
  // We'll store raw goal text, can be bilingual mix; that's okay for Tawjihi student audience.
  return isReviewDay ? pick : pick;
}

function pickAnother(subject, list, rand){
  const others = list.filter(x => x !== subject);
  return others[Math.floor(rand()*others.length)] || subject;
}

/* -----------------------------
   Rendering
----------------------------- */
function setLang(lang){
  state.lang = lang;
  saveLS(LS.lang, lang);

  const isAr = lang === "ar";
  document.documentElement.setAttribute("dir", isAr ? "rtl" : "ltr");
  document.documentElement.setAttribute("lang", isAr ? "ar" : "en");

  // Update all i18n nodes
  $$("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const str = i18n[lang][key];
    if (typeof str === "string") el.textContent = str;
  });

  // Toggle label
  langToggleText.textContent = isAr ? "AR" : "EN";

  // Update placeholders that are not data-i18n
  bankSearch.placeholder = isAr ? "اكتب كلمة… (مثلاً: وزاري / إعراب / grammar)" : "Type a keyword… (e.g., wazari / grammar)";
  srcTitle.placeholder = isAr ? "مثال: وزارة التربية — أسئلة سابقة" : "e.g., MoE — Past papers";
  srcLink.placeholder = "https://...";

  renderAll();
}

function setActiveTab(tabKey){
  state.ui.activeTab = tabKey;

  // Update tab buttons active states
  tabButtons.forEach(btn => btn.classList.toggle("is-active", btn.dataset.tab === tabKey));
  tabButtons.forEach(btn => {
    if (btn.dataset.tab === tabKey) btn.setAttribute("aria-current","page");
    else btn.removeAttribute("aria-current");
  });

  Object.entries(tabs).forEach(([k, el]) => el.classList.toggle("is-active", k === tabKey));

  // Close drawer on mobile
  closeDrawer();

  // If navigating to stats, redraw chart for correct sizing
  if (tabKey === "stats") requestAnimationFrame(() => drawChart());
}

function renderAll(){
  renderTimerSettingsInputs();
  renderSessionMetrics();
  ensurePlan();
  renderPlan();
  renderAllKPIs();
  renderStats();
  drawChart();
  renderQuestionBank();
  renderSources();
  renderMuteUI();
}

function renderAllKPIs(){
  // streak
  const streak = computeStreak();
  kpiStreak.textContent = String(streak);

  // week hours
  const weekMinutes = getWeekMinutesSum();
  const weekHours = Math.floor(weekMinutes / 60);
  kpiWeekHours.textContent = String(weekHours);

  // today's plan completion
  const todayKeyName = dayKeyFromDate(new Date());
  const todayPlan = state.plan?.days?.[todayKeyName];
  const todayPct = todayPlan ? Math.round(computeDayCompletion(todayPlan) * 100) : 0;
  kpiTodayDone.textContent = `${todayPct}%`;

  // Today's label and focus
  todayLabel.textContent = friendlyDateLabel(new Date());
  const focus = getTodaysFocus();
  if (focus){
    const subjName = subjectLabel(focus.subject);
    const typeName = taskTypeLabel(focus.type);
    focusTitle.textContent = `${subjName} — ${typeName}`;
    focusMeta.textContent = `${focus.minutes} ${t("plan.min")} • ${t("plan.goal")}: ${focus.goal}`;
  } else {
    focusTitle.textContent = state.lang === "ar" ? "ممتاز! خلصت بلوكات اليوم 👏" : "Nice! You finished today’s blocks 👏";
    focusMeta.textContent = state.lang === "ar"
      ? "إذا بدك، اعمل جلسة قصيرة تحليل أخطاء أو مراجعة خفيفة."
      : "Optional: do a short error-analysis session or light revision.";
  }
}

function renderTimerSettingsInputs(){
  studyMinutesInput.value = state.timer.studyMinutes;
  breakMinutesInput.value = state.timer.breakMinutes;
  autoSwitch.checked = !!state.timer.autoSwitch;

  // Sync timer engine to settings (only if not running)
  if (!timerEngine.running){
    timerEngine.setMode(timerEngine.mode);
  }
}

function updateTimerUI(){
  timerModeLabel.textContent = timerEngine.mode === "study" ? "Study" : "Break";
  if (state.lang === "ar"){
    timerModeLabel.textContent = timerEngine.mode === "study" ? "دراسة" : "استراحة";
  }

  const m = Math.floor(timerEngine.remainingSec / 60);
  const s = timerEngine.remainingSec % 60;
  timerTime.textContent = `${pad2(m)}:${pad2(s)}`;

  timerHint.textContent = timerEngine.mode === "study" ? t("sessions.hintStudy") : t("sessions.hintBreak");

  const ratio = timerEngine.totalSec > 0 ? (1 - (timerEngine.remainingSec / timerEngine.totalSec)) : 0;
  const deg = Math.max(0, Math.min(1, ratio)) * 360;
  progressRing.style.background = `conic-gradient(rgba(109,40,217,.95) ${deg}deg, rgba(255,255,255,.08) 0deg)`;
}

function renderSessionMetrics(){
  mStudySessions.textContent = state.stats.studySessions;
  mStudyMinutes.textContent = state.stats.studyMinutes;
  mBreakSessions.textContent = state.stats.breakSessions;
  mBreakMinutes.textContent = state.stats.breakMinutes;
}

/* Plan */
function ensurePlan(){
  if (!state.plan || !state.plan.days){
    state.plan = generateWeeklyPlan();
    savePlan();
  }
}

function renderPlan(){
  weeklyGrid.innerHTML = "";

  for (const d of DAYS_SUN_SAT){
    const day = state.plan.days[d.key];
    const col = document.createElement("div");
    col.className = "day-col";

    const head = document.createElement("div");
    head.className = "day-head";

    const name = document.createElement("div");
    name.className = "day-name";
    name.textContent = state.lang === "ar" ? d.ar : d.en;

    const meta = document.createElement("div");
    meta.className = "day-meta";
    const pct = Math.round(computeDayCompletion(day) * 100);
    meta.textContent = `${pct}%`;

    head.appendChild(name);
    head.appendChild(meta);
    col.appendChild(head);

    if (day.isLight){
      const badge = document.createElement("div");
      badge.className = "note";
      badge.style.marginTop = "6px";
      badge.textContent = t("plan.lightDay");
      col.appendChild(badge);
    }
    if (day.isReview){
      const badge = document.createElement("div");
      badge.className = "note";
      badge.style.marginTop = "6px";
      badge.textContent = t("plan.reviewDay");
      col.appendChild(badge);
    }

    day.blocks.forEach((b, idx) => {
      const block = document.createElement("div");
      block.className = "block" + (b.done ? " is-done" : "");

      const top = document.createElement("div");
      top.className = "block-top";

      const title = document.createElement("div");
      title.className = "block-title";
      title.textContent = `${subjectLabel(b.subject)} — ${tTypeShort(b.type)}`;

      const badges = document.createElement("div");
      badges.className = "badges";

      const tagType = document.createElement("span");
      tagType.className = `badge ${TASK_TYPES[b.type]?.css || ""}`;
      tagType.textContent = taskTypeLabel(b.type);

      const tagDur = document.createElement("span");
      tagDur.className = "badge";
      tagDur.textContent = `${b.minutes} ${t("plan.min")}`;

      badges.appendChild(tagType);
      badges.appendChild(tagDur);

      top.appendChild(title);
      top.appendChild(badges);

      const meta2 = document.createElement("div");
      meta2.className = "block-meta";
      meta2.textContent = `${t("plan.goal")}: ${b.goal}`;

      const actions = document.createElement("div");
      actions.className = "block-actions";

      const breakHint = document.createElement("div");
      breakHint.className = "badge";
      breakHint.textContent = t("plan.break");

      const btn = document.createElement("button");
      btn.className = "btn" + (b.done ? " ghost" : " primary");
      btn.innerHTML = b.done
        ? `<i class="fa-solid fa-rotate-left"></i><span>${t("plan.undo")}</span>`
        : `<i class="fa-solid fa-check"></i><span>${t("plan.markDone")}</span>`;

      btn.addEventListener("click", () => toggleBlockDone(d.key, b.id));

      actions.appendChild(breakHint);
      actions.appendChild(btn);

      block.appendChild(top);
      block.appendChild(meta2);
      block.appendChild(actions);

      col.appendChild(block);
    });

    weeklyGrid.appendChild(col);
  }

  // Refresh related sections
  renderAllKPIs();
  renderStats();
  drawChart();
}

function toggleBlockDone(dayKey, blockId){
  const day = state.plan.days[dayKey];
  const block = day.blocks.find(b => b.id === blockId);
  if (!block) return;

  block.done = !block.done;

  // Tie plan completion to stats: count minutes as study minutes when marking done (study-oriented)
  if (block.done){
    const mins = block.minutes;
    state.stats.studyMinutes += mins;
    addDailyMinutes(todayKeyFromDayKey(dayKey), mins);
    state.stats.subjectMinutes[block.subject] = (state.stats.subjectMinutes[block.subject] || 0) + mins;
    markActivity();
    saveStats();
    toast(t("toast.done"));
  } else {
    // Undo: remove minutes (clamp at 0)
    const mins = block.minutes;
    state.stats.studyMinutes = Math.max(0, state.stats.studyMinutes - mins);
    addDailyMinutes(todayKeyFromDayKey(dayKey), -mins);
    state.stats.subjectMinutes[block.subject] = Math.max(0, (state.stats.subjectMinutes[block.subject] || 0) - mins);
    markActivity();
    saveStats();
    toast(t("toast.undone"));
  }

  savePlan();
  renderPlan();
}

/* Stats */
function renderStats(){
  sStudySessions.textContent = String(state.stats.studySessions);

  const totalMin = state.stats.studyMinutes;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  sStudyTime.textContent = state.lang === "ar" ? `${h}س ${m}د` : `${h}h ${m}m`;

  const pct = Math.round(computePlanCompletion() * 100);
  sPlanCompletion.textContent = `${pct}%`;

  sStreak.textContent = String(computeStreak());

  const best = bestDayFromDailyMinutes();
  sBestDay.textContent = best ? `${best.label} • ${best.minutes} ${state.lang === "ar" ? "د" : "min"}` : "—";

  const mix = subjectMixSummary();
  sSubjectMix.textContent = mix || "—";
}

/* Chart */
function drawChart(){
  const canvas = progressChart;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  // match internal size for crispness
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(640, Math.floor(rect.width * dpr));
  canvas.height = Math.floor((rect.width * 0.45) * dpr);

  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);

  // Background
  ctx.fillStyle = "rgba(0,0,0,0.10)";
  roundRect(ctx, 0, 0, W, H, 18 * dpr);
  ctx.fill();

  const pad = 22 * dpr;
  const chartW = W - pad*2;
  const chartH = H - pad*2;

  const weekKeys = weekDateKeysSunSat();
  const values = weekKeys.map(k => Math.max(0, Number(state.stats.dailyMinutes[k] || 0)));
  const maxV = Math.max(60, ...values); // at least 60 for scale

  // Grid lines
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 1 * dpr;
  for (let i=0;i<=4;i++){
    const y = pad + (chartH * (i/4));
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(pad + chartW, y);
    ctx.stroke();
  }

  // Axes labels
  ctx.fillStyle = "rgba(238,242,255,0.75)";
  ctx.font = `${12 * dpr}px ${getFontFamily()}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const dayLabels = DAYS_SUN_SAT.map(d => state.lang === "ar" ? d.ar : d.en);
  const stepX = chartW / (weekKeys.length - 1 || 1);

  // Line
  ctx.strokeStyle = "rgba(109,40,217,0.95)";
  ctx.lineWidth = 3 * dpr;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.beginPath();
  values.forEach((v, i) => {
    const x = pad + stepX * i;
    const y = pad + chartH - (v / maxV) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Points
  ctx.fillStyle = "rgba(109,40,217,0.95)";
  values.forEach((v, i) => {
    const x = pad + stepX * i;
    const y = pad + chartH - (v / maxV) * chartH;
    ctx.beginPath();
    ctx.arc(x, y, 4.5 * dpr, 0, Math.PI*2);
    ctx.fill();
  });

  // Day labels
  values.forEach((v, i) => {
    const x = pad + stepX * i;
    ctx.fillText(dayLabels[i], x, pad + chartH + 8 * dpr);
  });

  // Min markers
  ctx.textAlign = "end";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(183,192,255,0.6)";
  for (let i=0;i<=4;i++){
    const v = Math.round(maxV * (1 - i/4));
    const y = pad + (chartH * (i/4));
    ctx.fillText(`${v}`, pad - 8 * dpr, y);
  }
}

/* Bank */
function renderQuestionBank(){
  const subject = state.ui.bankSubject;
  const search = (state.ui.bankSearch || "").trim().toLowerCase();
  const diff = state.ui.bankDifficulty;
  const type = state.ui.bankType;

  // Update segmented
  subjectSegs.forEach(btn => btn.classList.toggle("is-active", btn.dataset.subject === subject));
  subjectSegs.forEach(btn => btn.setAttribute("aria-selected", btn.dataset.subject === subject ? "true" : "false"));

  const list = questionBank.subjects[subject]?.questions || [];

  const filtered = list.filter(q => {
    if (diff !== "all" && q.difficulty !== diff) return false;
    if (type !== "all" && q.type !== type) return false;
    if (search){
      const hay = `${q.text} ${q.answer}`.toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });

  bankList.innerHTML = "";

  if (!filtered.length){
    const empty = document.createElement("div");
    empty.className = "note";
    empty.textContent = t("bank.noResults");
    bankList.appendChild(empty);
    return;
  }

  filtered.forEach(qx => {
    const card = document.createElement("div");
    card.className = "q";

    const head = document.createElement("div");
    head.className = "q-head";

    const title = document.createElement("div");
    title.className = "q-title";
    title.textContent = subjectLabel(qx.subject);

    const tags = document.createElement("div");
    tags.className = "q-tags";

    const sample = document.createElement("span");
    sample.className = "tag sample";
    sample.textContent = "Sample";

    const d = document.createElement("span");
    d.className = `tag ${qx.difficulty}`;
    d.textContent = t(`difficulty.${qx.difficulty}`);

    const ty = document.createElement("span");
    ty.className = `tag ${qx.type}`;
    ty.textContent = t(qx.type === "mcq" ? "qtype.mcq" : "qtype.short");

    tags.appendChild(sample);
    tags.appendChild(d);
    tags.appendChild(ty);

    head.appendChild(title);
    head.appendChild(tags);

    const text = document.createElement("div");
    text.className = "q-text";
    text.textContent = qx.text;

    const ans = document.createElement("div");
    ans.className = "q-answer";
    ans.textContent = qx.answer;

    const actions = document.createElement("div");
    actions.className = "q-actions";

    const left = document.createElement("div");
    left.className = "badge";
    left.textContent = `#${qx.id}`;

    const toggle = document.createElement("button");
    toggle.className = "btn";
    toggle.innerHTML = `<i class="fa-solid fa-eye"></i><span>${t("bank.showAnswer")}</span>`;
    toggle.addEventListener("click", () => {
      const open = ans.classList.toggle("is-open");
      toggle.innerHTML = open
        ? `<i class="fa-solid fa-eye-slash"></i><span>${t("bank.hideAnswer")}</span>`
        : `<i class="fa-solid fa-eye"></i><span>${t("bank.showAnswer")}</span>`;
    });

    actions.appendChild(left);
    actions.appendChild(toggle);

    card.appendChild(head);
    card.appendChild(text);
    card.appendChild(ans);
    card.appendChild(actions);

    bankList.appendChild(card);
  });
}

function renderSources(){
  sourcesList.innerHTML = "";
  const items = Array.isArray(state.sources) ? state.sources : [];

  items.forEach((s, idx) => {
    const item = document.createElement("div");
    item.className = "source-item";

    const title = document.createElement("div");
    title.className = "source-title";
    title.textContent = s.title || `Source ${idx+1}`;

    const meta = document.createElement("div");
    meta.className = "source-meta";

    const y = document.createElement("span");
    y.textContent = `${s.year || "—"} • `;

    const a = document.createElement("a");
    a.href = s.link || "#";
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = state.lang === "ar" ? "فتح الرابط" : "Open link";

    meta.appendChild(y);
    meta.appendChild(a);

    item.appendChild(title);
    item.appendChild(meta);
    sourcesList.appendChild(item);
  });
}

/* -----------------------------
   Events
----------------------------- */
function bindEvents(){
  // Tabs
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
  });

  // Language toggle
  langToggle.addEventListener("click", () => {
    setLang(state.lang === "ar" ? "en" : "ar");
  });

  // Mute
  muteToggle.addEventListener("click", () => {
    state.mute = !state.mute;
    saveLS(LS.mute, state.mute);
    renderMuteUI();
  });

  // Copy debug export
  copyAppStateBtn.addEventListener("click", async () => {
    const exportObj = {
      lang: state.lang,
      mute: state.mute,
      timer: state.timer,
      stats: state.stats,
      plan: state.plan,
      sources: state.sources,
    };
    await copyToClipboard(JSON.stringify(exportObj, null, 2));
    toast(t("toast.exportCopied"));
  });

  // Drawer
  mobileMenuBtn.addEventListener("click", openDrawer);
  drawerBackdrop.addEventListener("click", closeDrawer);
  drawerCloseBtn.addEventListener("click", closeDrawer);

  // Timer buttons
  btnStart.addEventListener("click", () => timerEngine.start());
  btnPause.addEventListener("click", () => timerEngine.pause());
  btnReset.addEventListener("click", () => timerEngine.reset());
  btnNext.addEventListener("click", () => timerEngine.next());

  autoSwitch.addEventListener("change", () => {
    state.timer.autoSwitch = !!autoSwitch.checked;
    saveLS(LS.timer, state.timer);
  });

  saveDurationsBtn.addEventListener("click", () => {
    const study = Number(studyMinutesInput.value);
    const brk = Number(breakMinutesInput.value);

    const ok = Number.isFinite(study) && Number.isFinite(brk)
      && study >= 10 && study <= 90
      && brk >= 3 && brk <= 30;

    if (!ok){
      toast(t("toast.invalid"));
      return;
    }

    state.timer.studyMinutes = Math.floor(study);
    state.timer.breakMinutes = Math.floor(brk);
    state.timer.autoSwitch = !!autoSwitch.checked;

    saveLS(LS.timer, state.timer);

    if (!timerEngine.running){
      timerEngine.setMode(timerEngine.mode);
    }
    toast(t("toast.saved"));
  });

  // Plan actions
  regenPlanBtn.addEventListener("click", () => {
    state.plan = generateWeeklyPlan(Date.now());
    savePlan();
    renderPlan();
  });

  copyPlanBtn.addEventListener("click", async () => {
    const text = planToText(state.plan);
    await copyToClipboard(text);
    toast(t("toast.planCopied"));
  });

  // Reset stats
  resetStatsBtn.addEventListener("click", () => {
    openConfirm(t("modal.resetStats"), () => {
      state.stats = {
        studySessions: 0,
        studyMinutes: 0,
        breakSessions: 0,
        breakMinutes: 0,
        dailyMinutes: {},
        subjectMinutes: { english: 0, arabic: 0, history: 0, religion: 0 },
        lastActivityDate: null
      };
      saveStats();

      // Also reset plan completion? keep plan but set done to false
      if (state.plan?.days){
        Object.values(state.plan.days).forEach(day => day.blocks.forEach(b => b.done = false));
        savePlan();
      }

      renderAll();
    });
  });

  // Bank subject switch
  subjectSegs.forEach(btn => {
    btn.addEventListener("click", () => {
      state.ui.bankSubject = btn.dataset.subject;
      renderQuestionBank();
    });
  });

  // Bank filters
  bankSearch.addEventListener("input", () => {
    state.ui.bankSearch = bankSearch.value;
    renderQuestionBank();
  });
  difficultyFilter.addEventListener("change", () => {
    state.ui.bankDifficulty = difficultyFilter.value;
    renderQuestionBank();
  });
  typeFilter.addEventListener("change", () => {
    state.ui.bankType = typeFilter.value;
    renderQuestionBank();
  });

  // Add source
  addSourceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = srcTitle.value.trim();
    const year = Number(srcYear.value);
    const link = srcLink.value.trim();

    if (!title || !Number.isFinite(year) || year < 2000 || year > 2100 || !isValidHttpUrl(link)){
      toast(t("toast.invalid"));
      return;
    }

    const newItem = { title, year, link };
    state.sources = Array.isArray(state.sources) ? state.sources : [];
    // Remove placeholder if still present
    state.sources = state.sources.filter(x => x.link !== "https://example.com");
    state.sources.unshift(newItem);
    saveLS(LS.sources, state.sources);

    srcTitle.value = "";
    srcYear.value = "";
    srcLink.value = "";

    renderSources();
    toast(t("toast.saved"));
  });

  // Resize chart
  window.addEventListener("resize", () => {
    if (state.ui.activeTab === "stats") drawChart();
  });
}

function renderMuteUI(){
  if (state.mute){
    muteIcon.className = "fa-solid fa-volume-xmark";
  } else {
    muteIcon.className = "fa-solid fa-volume-high";
  }
}

/* -----------------------------
   Utilities
----------------------------- */
function t(key){ return i18n[state.lang]?.[key] ?? key; }

function subjectLabel(subj){
  const s = questionBank.subjects[subj]?.name;
  if (s) return state.lang === "ar" ? s.ar : s.en;

  const map = {
    english: { ar: "إنجليزي", en: "English" },
    arabic: { ar: "عربي", en: "Arabic" },
    history: { ar: "تاريخ", en: "History" },
    religion: { ar: "دين", en: "Religion" },
  };
  return state.lang === "ar" ? map[subj]?.ar : map[subj]?.en;
}

function taskTypeLabel(type){
  return state.lang === "ar" ? (TASK_TYPES[type]?.ar || type) : (TASK_TYPES[type]?.en || type);
}
function tTypeShort(type){
  // Short label for compact block title
  if (state.lang === "ar"){
    if (type === "practice") return "وزاري";
    if (type === "revise") return "مراجعة";
    if (type === "learn") return "تعلم";
    if (type === "review") return "أسبوعي";
  } else {
    if (type === "practice") return "Practice";
    if (type === "revise") return "Revise";
    if (type === "learn") return "Learn";
    if (type === "review") return "Review";
  }
  return type;
}

function pad2(n){ return String(n).padStart(2,"0"); }

function toast(msg){
  // Lightweight toast
  const el = document.createElement("div");
  el.textContent = msg;
  el.style.position = "fixed";
  el.style.bottom = "92px";
  el.style.left = "50%";
  el.style.transform = "translateX(-50%)";
  el.style.zIndex = "120";
  el.style.padding = "10px 12px";
  el.style.border = "1px solid rgba(255,255,255,0.14)";
  el.style.borderRadius = "14px";
  el.style.background = "rgba(15,23,48,0.88)";
  el.style.backdropFilter = "blur(10px)";
  el.style.color = "rgba(238,242,255,0.95)";
  el.style.boxShadow = "0 18px 40px rgba(0,0,0,.35)";
  el.style.fontSize = "12px";
  el.style.maxWidth = "calc(100% - 24px)";
  el.style.textAlign = "center";
  el.style.opacity = "0";
  el.style.transition = "opacity .18s ease, transform .18s ease";
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "translateX(-50%) translateY(-2px)";
  });
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateX(-50%) translateY(2px)";
    setTimeout(() => el.remove(), 220);
  }, 1400);
}

/* Confirm modal */
let confirmCallback = null;
function openConfirm(text, onOk){
  confirmText.textContent = text;
  confirmCallback = onOk;

  modalBackdrop.hidden = false;
  confirmModal.hidden = false;

  const close = () => closeConfirm();
  modalBackdrop.onclick = close;
  modalCloseBtn.onclick = close;
  confirmCancel.onclick = close;
  confirmOk.onclick = () => {
    if (typeof confirmCallback === "function") confirmCallback();
    closeConfirm();
  };
}
function closeConfirm(){
  confirmCallback = null;
  modalBackdrop.hidden = true;
  confirmModal.hidden = true;
}

/* Drawer */
function openDrawer(){
  drawer.hidden = false;
  drawerBackdrop.hidden = false;
}
function closeDrawer(){
  drawer.hidden = true;
  drawerBackdrop.hidden = true;
}

/* LocalStorage */
function loadLS(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function saveLS(key, val){
  try{ localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

function saveStats(){ saveLS(LS.stats, state.stats); }
function savePlan(){ saveLS(LS.plan, state.plan); }

/* Date helpers */
function todayKey(date = new Date()){
  return toISODate(date);
}
function toISODate(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const da = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${da}`;
}
function dayKeyFromDate(d){
  // JS: 0 Sun ... 6 Sat
  const idx = d.getDay();
  return DAYS_SUN_SAT[idx].key;
}
function todayKeyFromDayKey(dayKey){
  // Map current week (Sun-Sat) to ISO keys for charting
  const weekKeys = weekDateKeysSunSat();
  const idx = DAYS_SUN_SAT.findIndex(x => x.key === dayKey);
  return weekKeys[Math.max(0, idx)];
}
function friendlyDateLabel(d){
  // Simple label (no Intl dependency)
  const dayIdx = d.getDay();
  const dayName = state.lang === "ar" ? DAYS_SUN_SAT[dayIdx].ar : DAYS_SUN_SAT[dayIdx].en;
  return `${dayName} • ${toISODate(d)}`;
}

function weekDateKeysSunSat(baseDate = new Date()){
  // find Sunday of current week
  const d = new Date(baseDate);
  const day = d.getDay(); // 0 Sun
  const sunday = new Date(d);
  sunday.setDate(d.getDate() - day);

  const keys = [];
  for (let i=0;i<7;i++){
    const x = new Date(sunday);
    x.setDate(sunday.getDate() + i);
    keys.push(toISODate(x));
  }
  return keys;
}

function getWeekMinutesSum(){
  const keys = weekDateKeysSunSat();
  return keys.reduce((sum,k) => sum + Number(state.stats.dailyMinutes[k] || 0), 0);
}

/* Daily minutes */
function addDailyMinutes(key, delta){
  if (!key) return;
  const cur = Number(state.stats.dailyMinutes[key] || 0);
  const next = Math.max(0, cur + Number(delta || 0));
  state.stats.dailyMinutes[key] = next;
}

/* Streak logic */
function markActivity(){
  state.stats.lastActivityDate = todayKey();
}
function computeStreak(){
  // streak counts consecutive days ending today where activity (minutes>0) OR plan blocks done in that day key
  const today = new Date();
  let streak = 0;

  for (let back=0; back<365; back++){
    const d = new Date(today);
    d.setDate(today.getDate() - back);
    const iso = toISODate(d);

    const minutes = Number(state.stats.dailyMinutes[iso] || 0);
    const planDone = hasPlanActivityOnISO(iso);

    if (minutes > 0 || planDone){
      streak += 1;
    } else {
      // stop when first gap found
      break;
    }
  }

  return streak;
}

function hasPlanActivityOnISO(iso){
  // We only have plan for current week by dayKey, so infer:
  // If iso within current week, map to dayKey and check any done block.
  const keys = weekDateKeysSunSat();
  const idx = keys.indexOf(iso);
  if (idx === -1) return false;
  const dayKey = DAYS_SUN_SAT[idx].key;
  const day = state.plan?.days?.[dayKey];
  if (!day) return false;
  return day.blocks.some(b => b.done);
}

/* Plan completion */
function computeDayCompletion(day){
  if (!day?.blocks?.length) return 0;
  const done = day.blocks.filter(b => b.done).length;
  return done / day.blocks.length;
}
function computePlanCompletion(){
  const days = state.plan?.days ? Object.values(state.plan.days) : [];
  const blocks = days.flatMap(d => d.blocks || []);
  if (!blocks.length) return 0;
  const done = blocks.filter(b => b.done).length;
  return done / blocks.length;
}

/* Best day */
function bestDayFromDailyMinutes(){
  const keys = weekDateKeysSunSat();
  let best = null;
  for (let i=0;i<keys.length;i++){
    const k = keys[i];
    const v = Number(state.stats.dailyMinutes[k] || 0);
    if (!best || v > best.minutes){
      best = { key: k, minutes: v, label: state.lang === "ar" ? DAYS_SUN_SAT[i].ar : DAYS_SUN_SAT[i].en };
    }
  }
  if (best && best.minutes > 0) return best;
  return null;
}

/* Subject distribution */
function subjectMixSummary(){
  const sm = state.stats.subjectMinutes || {};
  const total = Object.values(sm).reduce((a,b) => a + Number(b||0), 0);
  if (!total) return "";

  const entries = Object.entries(sm)
    .map(([k,v]) => ({ k, v: Number(v||0) }))
    .sort((a,b) => b.v - a.v)
    .filter(x => x.v > 0)
    .slice(0, 3);

  const parts = entries.map(e => {
    const pct = Math.round((e.v / total) * 100);
    return `${subjectLabel(e.k)} ${pct}%`;
  });

  return parts.join(state.lang === "ar" ? " • " : " • ");
}

/* Today's focus from plan */
function getTodaysFocus(){
  const dk = dayKeyFromDate(new Date());
  const day = state.plan?.days?.[dk];
  if (!day) return null;
  const firstUndone = day.blocks.find(b => !b.done);
  return firstUndone || null;
}
function inferFocusSubject(){
  const f = getTodaysFocus();
  return f?.subject || null;
}

/* Copy plan text */
function planToText(plan){
  const lines = [];
  const isAr = state.lang === "ar";
  lines.push(isAr ? "خطة أسبوعية (توجيهي 2009)" : "Weekly Plan (Tawjihi 2009)");
  lines.push("—");

  for (const d of DAYS_SUN_SAT){
    const day = plan.days[d.key];
    lines.push(isAr ? `\n${d.ar}` : `\n${d.en}`);
    day.blocks.forEach((b, idx) => {
      const done = b.done ? (isAr ? "✅" : "✅") : (isAr ? "⬜" : "⬜");
      lines.push(`${done} ${subjectLabel(b.subject)} — ${taskTypeLabel(b.type)} — ${b.minutes}${isAr ? "د" : "m"} | ${isAr ? "هدف" : "Goal"}: ${b.goal}`);
    });
  }
  return lines.join("\n");
}

/* Clipboard */
async function copyToClipboard(text){
  try{
    await navigator.clipboard.writeText(text);
  } catch {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

/* URL validation */
function isValidHttpUrl(str){
  try{
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch { return false; }
}

/* Random helpers (seeded) */
function hashSeed(str){
  let h = 2166136261;
  for (let i=0;i<str.length;i++){
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a){
  return function(){
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle(arr, rand){
  for (let i=arr.length-1;i>0;i--){
    const j = Math.floor(rand() * (i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/* Canvas helpers */
function roundRect(ctx, x, y, w, h, r){
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr, y);
  ctx.arcTo(x+w, y, x+w, y+h, rr);
  ctx.arcTo(x+w, y+h, x, y+h, rr);
  ctx.arcTo(x, y+h, x, y, rr);
  ctx.arcTo(x, y, x+w, y, rr);
  ctx.closePath();
}
function getFontFamily(){
  return state.lang === "ar" ? "Cairo" : "Inter";
}

/* Alerts */
function alertPulse(){
  // flash ring briefly
  progressRing.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.03)" }, { transform: "scale(1)" }],
    { duration: 420, easing: "ease-out" }
  );
  // also vibrate if available
  if (navigator.vibrate) navigator.vibrate(120);
}

function playBeep(){
  if (state.mute) return;
  try{
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.value = 0.07;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.stop();
      ctx.close();
    }, 180);
  } catch {
    // ignore
  }
}

/* -----------------------------
   PWA / SW
----------------------------- */
function registerSW(){
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

/* -----------------------------
   Init
----------------------------- */
function init(){
  bindEvents();

  // Default active tab
  setActiveTab(state.ui.activeTab || "home");

  // Apply language
  setLang(state.lang === "en" ? "en" : "ar");

  // Setup timer
  timerEngine.setMode("study");
  updateTimerUI();

  // Load sources and render
  renderSources();

  // Render bank
  difficultyFilter.value = state.ui.bankDifficulty;
  typeFilter.value = state.ui.bankType;
  bankSearch.value = state.ui.bankSearch;
  renderQuestionBank();

  // Offline badge
  updateOfflineBadge();
  window.addEventListener("online", updateOfflineBadge);
  window.addEventListener("offline", updateOfflineBadge);

  // Register SW
  registerSW();
}

function updateOfflineBadge(){
  const badge = $("#offlineBadge");
  if (!badge) return;
  const online = navigator.onLine;
  badge.textContent = online ? t("pwa.ready") : (state.lang === "ar" ? "أوفلاين الآن" : "Offline now");
}

init();
