/* Serag Dashboard — Clean SPA Tabs + Subjects + Notebooks + Tasks + Timer + Stats
   - No coins / No shop / No AI
   - LocalStorage persistence
   - Glitch-free modal (X + ESC + backdrop)
*/

(() => {
  "use strict";

  // ---------- Helpers ----------
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));
  const uid = (p="id") => `${p}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
  const clamp = (v,a,b) => Math.min(b, Math.max(a, v));
  const pad2 = (n) => String(n).padStart(2,"0");
  const escapeHtml = (s) => String(s)
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");

  // ---------- Storage ----------
  const KEY = "serag_dash_v2";
  const defaults = () => ({
    theme: "dark",
    subjects: [], // {id,name}
    notebooks: [], // {id,title,subjectId,notes,createdAt}
    tasks: [], // {id,subjectId,text,done,createdAt,doneAt?}
    sessions: [], // study sessions only: {id,subjectId,minutes,ts}
  });

  let state = load();
  function load(){
    try{
      const raw = localStorage.getItem(KEY);
      if(!raw) return defaults();
      const parsed = JSON.parse(raw);
      return { ...defaults(), ...parsed };
    }catch{
      return defaults();
    }
  }
  function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }

  // ---------- Tabs ----------
  const tabButtons = qsa(".tab-btn");
  const tabPanels  = qsa(".tab-panel");

  function switchTab(tabId){
    tabButtons.forEach(b => {
      const on = b.dataset.tab === tabId;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    tabPanels.forEach(p => p.classList.toggle("active", p.id === tabId));

    // on enter render
    renderAll();
  }

  // delegation for tabs
  qs(".tabs-nav")?.addEventListener("click", (e) => {
    const btn = e.target.closest?.(".tab-btn");
    if(!btn) return;
    switchTab(btn.dataset.tab);
  });

  // quick actions
  qs("#dashboard")?.addEventListener("click", (e) => {
    const b = e.target.closest?.("[data-go]");
    if(!b) return;
    switchTab(b.dataset.go);
  });

  // ---------- Toast ----------
  const toastsEl = qs("#toasts");
  function toast(msg, type="info", ms=2500){
    if(!toastsEl) return;
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.innerHTML = `<span class="dot"></span><div class="msg"></div><button class="x" type="button" aria-label="إغلاق">✕</button>`;
    qs(".msg", el).textContent = msg;

    const close = () => {
      el.style.transition = "opacity .18s ease, transform .18s ease";
      el.style.opacity = "0";
      el.style.transform = "translateY(10px)";
      setTimeout(() => el.remove(), 190);
    };
    qs(".x", el).addEventListener("click", close);

    toastsEl.appendChild(el);
    setTimeout(close, ms);
  }

  // ---------- Modal (glitch-free) ----------
  const modalBackdrop = qs("#modalBackdrop");
  const modal = qs("#modal");
  const modalTitle = qs("#modalTitle");
  const modalBody = qs("#modalBody");
  const modalFooter = qs("#modalFooter");
  const modalClose = qs("#modalClose");

  let modalOnClose = null;

  function openModal({title="", bodyHTML="", footerHTML="", onClose=null}){
    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHTML;
    modalFooter.innerHTML = footerHTML;

    modalOnClose = onClose;

    modalBackdrop.hidden = false;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");

    // focus close
    setTimeout(() => modalClose.focus(), 0);
  }

  function closeModal(){
    modalBackdrop.hidden = true;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    if(typeof modalOnClose === "function") modalOnClose();
    modalOnClose = null;
  }

  modalClose?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && !modal.hidden) closeModal();
  });

  // ---------- Theme ----------
  function applyTheme(){
    document.documentElement.setAttribute("data-theme", state.theme === "light" ? "light" : "dark");
  }
  qs("#btnTheme")?.addEventListener("click", () => {
    state.theme = (state.theme === "light") ? "dark" : "light";
    save();
    applyTheme();
    toast(state.theme === "light" ? "تم تفعيل الثيم الفاتح" : "تم تفعيل الثيم الداكن", "ok");
  });

  // ---------- Subjects ----------
  const subjectName = qs("#subjectName");
  const btnAddSubject = qs("#btnAddSubject");
  const subjectsGrid = qs("#subjectsGrid");
  const subjectsEmpty = qs("#subjectsEmpty");
  const subjectsLeft = qs("#subjectsLeft");

  function addSubject(name){
    name = (name || "").trim();
    if(!name) return toast("اكتب اسم المادة.", "warn");
    if(state.subjects.length >= 8) return toast("وصلت للحد الأقصى: 8 مواد.", "warn");
    if(state.subjects.some(s => s.name.toLowerCase() === name.toLowerCase()))
      return toast("هذه المادة موجودة مسبقًا.", "warn");

    state.subjects.push({ id: uid("sub"), name });
    save();
    subjectName.value = "";
    toast("تمت إضافة المادة.", "ok");
    renderAll();
  }

  function deleteSubject(id){
    // unlink notebooks/tasks/sessions keep sessions (for history) but subject may disappear gracefully
    state.subjects = state.subjects.filter(s => s.id !== id);
    state.notebooks = state.notebooks.map(n => n.subjectId === id ? ({...n, subjectId:""}) : n);
    state.tasks = state.tasks.map(t => t.subjectId === id ? ({...t, subjectId:""}) : t);
    save();
    toast("تم حذف المادة.", "ok");
    renderAll();
  }

  btnAddSubject?.addEventListener("click", () => addSubject(subjectName.value));
  subjectName?.addEventListener("keydown", (e) => {
    if(e.key === "Enter") addSubject(subjectName.value);
  });

  function renderSubjects(){
    if(!subjectsGrid) return;

    const left = Math.max(0, 8 - state.subjects.length);
    subjectsLeft.textContent = `${left} left`;
    subjectsEmpty.hidden = state.subjects.length !== 0;

    subjectsGrid.innerHTML = state.subjects.map(s => `
      <div class="content-card subject-card" data-sid="${s.id}">
        <div class="subject-actions">
          <button class="icon-btn danger" type="button" data-action="del-subject" aria-label="حذف">🗑️</button>
        </div>
        <div class="subject-name">${escapeHtml(s.name)}</div>
        <div class="subject-meta">دفاتر: ${countNotebooks(s.id)} • مهام: ${countTasks(s.id)}</div>
      </div>
    `).join("");
  }

  function countNotebooks(subjectId){
    return state.notebooks.filter(n => n.subjectId === subjectId).length;
  }
  function countTasks(subjectId){
    return state.tasks.filter(t => t.subjectId === subjectId).length;
  }

  // ---------- Notebooks ----------
  const nbTitle = qs("#nbTitle");
  const nbSubject = qs("#nbSubject");
  const btnAddNotebook = qs("#btnAddNotebook");
  const notebooksGrid = qs("#notebooksGrid");
  const notebooksEmpty = qs("#notebooksEmpty");
  const notebooksLeft = qs("#notebooksLeft");

  const editorTitle = qs("#editorTitle");
  const editorSubject = qs("#editorSubject");
  const editorText = qs("#editorText");
  const saveIndicator = qs("#saveIndicator");

  let activeNotebookId = "";
  let saveTimer = 0;

  function addNotebook(title, subjectId){
    title = (title || "").trim();
    if(!title) return toast("اكتب عنوان الدفتر.", "warn");
    if(state.notebooks.length >= 8) return toast("وصلت للحد الأقصى: 8 دفاتر.", "warn");

    state.notebooks.push({
      id: uid("nb"),
      title,
      subjectId: subjectId || "",
      notes: "",
      createdAt: Date.now()
    });
    save();
    nbTitle.value = "";
    toast("تمت إضافة الدفتر.", "ok");
    renderAll();
  }

  function deleteNotebook(id){
    state.notebooks = state.notebooks.filter(n => n.id !== id);
    if(activeNotebookId === id){
      activeNotebookId = "";
      setEditor(null);
    }
    save();
    toast("تم حذف الدفتر.", "ok");
    renderAll();
  }

  btnAddNotebook?.addEventListener("click", () => addNotebook(nbTitle.value, nbSubject.value));
  nbTitle?.addEventListener("keydown", (e) => {
    if(e.key === "Enter") addNotebook(nbTitle.value, nbSubject.value);
  });

  function setSaveIndicator(mode, text){
    if(!saveIndicator) return;
    saveIndicator.dataset.mode = mode;
    qs(".txt", saveIndicator).textContent = text;
  }

  function setEditor(nb){
    if(!nb){
      editorTitle.textContent = "Editor";
      editorText.value = "";
      editorText.disabled = true;
      editorSubject.value = "";
      editorSubject.disabled = true;
      setSaveIndicator("idle", "اختر دفترًا");
      return;
    }
    activeNotebookId = nb.id;
    editorTitle.textContent = `Notebook: ${nb.title}`;
    editorText.disabled = false;
    editorSubject.disabled = false;
    editorText.value = nb.notes || "";
    editorSubject.value = nb.subjectId || "";
    setSaveIndicator("saved", "تم الحفظ");
  }

  editorText?.addEventListener("input", () => {
    if(!activeNotebookId) return;
    clearTimeout(saveTimer);
    setSaveIndicator("saving", "جار الحفظ...");
    saveTimer = setTimeout(() => {
      const nb = state.notebooks.find(n => n.id === activeNotebookId);
      if(!nb) return;
      nb.notes = editorText.value;
      save();
      setSaveIndicator("saved", "تم الحفظ");
    }, 450);
  });

  editorSubject?.addEventListener("change", () => {
    const nb = state.notebooks.find(n => n.id === activeNotebookId);
    if(!nb) return;
    nb.subjectId = editorSubject.value || "";
    save();
    setSaveIndicator("saving", "جار الحفظ...");
    setTimeout(() => setSaveIndicator("saved", "تم الحفظ"), 180);
    renderAll();
  });

  function renderNotebooks(){
    if(!notebooksGrid) return;

    const left = Math.max(0, 8 - state.notebooks.length);
    notebooksLeft.textContent = `${left} left`;
    notebooksEmpty.hidden = state.notebooks.length !== 0;

    notebooksGrid.innerHTML = state.notebooks.map(n => {
      const subj = state.subjects.find(s => s.id === n.subjectId)?.name || "—";
      return `
        <div class="notebook" data-nid="${n.id}">
          <div class="row-between">
            <div class="nb-title">${escapeHtml(n.title)}</div>
            <button class="icon-btn danger" type="button" data-action="del-notebook" aria-label="حذف">🗑️</button>
          </div>
          <div class="nb-badge">${escapeHtml(subj)}</div>
        </div>
      `;
    }).join("");

    // keep editor consistent
    if(activeNotebookId && !state.notebooks.some(n => n.id === activeNotebookId)){
      activeNotebookId = "";
      setEditor(null);
    }
    if(activeNotebookId){
      const nb = state.notebooks.find(n => n.id === activeNotebookId);
      if(nb) setEditor(nb);
    }
  }

  // ---------- Tasks ----------
  const taskSubject = qs("#taskSubject");
  const taskText = qs("#taskText");
  const btnAddTask = qs("#btnAddTask");
  const tasksList = qs("#tasksList");
  const tasksEmpty = qs("#tasksEmpty");
  const tasksFilter = qs("#tasksFilter");
  const tasksHint = qs("#tasksHint");
  const tasksMeta = qs("#tasksMeta");

  function addTask(subjectId, text){
    if(state.subjects.length === 0){
      tasksHint.hidden = false;
      return toast("أضف مادة أولاً.", "warn");
    }
    text = (text || "").trim();
    if(!text) return toast("اكتب نص المهمة.", "warn");

    state.tasks.push({
      id: uid("task"),
      subjectId: subjectId || "",
      text,
      done: false,
      createdAt: Date.now()
    });
    save();
    taskText.value = "";
    toast("تمت إضافة المهمة.", "ok");
    renderAll();
  }

  function toggleTask(id){
    const t = state.tasks.find(x => x.id === id);
    if(!t) return;
    t.done = !t.done;
    t.doneAt = t.done ? Date.now() : null;
    save();
    renderAll();
  }

  function deleteTask(id){
    state.tasks = state.tasks.filter(t => t.id !== id);
    save();
    toast("تم حذف المهمة.", "ok");
    renderAll();
  }

  btnAddTask?.addEventListener("click", () => addTask(taskSubject.value, taskText.value));
  taskText?.addEventListener("keydown", (e) => {
    if(e.key === "Enter") addTask(taskSubject.value, taskText.value);
  });
  tasksFilter?.addEventListener("change", renderTasks);

  function renderTasks(){
    if(!tasksList) return;

    tasksHint.hidden = state.subjects.length !== 0;

    const filterSid = tasksFilter.value || "";
    const list = state.tasks.filter(t => filterSid ? t.subjectId === filterSid : true);

    const doneCount = state.tasks.filter(t => t.done).length;
    tasksMeta.textContent = `${doneCount}/${state.tasks.length}`;

    tasksEmpty.hidden = list.length !== 0;

    tasksList.innerHTML = list.map(t => {
      const subj = state.subjects.find(s => s.id === t.subjectId)?.name || "—";
      return `
        <div class="task ${t.done ? "done" : ""}" data-tid="${t.id}">
          <div class="task-left">
            <button class="task-check" type="button" data-action="toggle-task">${t.done ? "✓" : ""}</button>
            <div>
              <div class="task-title">${escapeHtml(t.text)}</div>
              <div class="task-meta">${escapeHtml(subj)}</div>
            </div>
          </div>
          <button class="icon-btn danger" type="button" data-action="del-task" aria-label="حذف">🗑️</button>
        </div>
      `;
    }).join("");
  }

  // ---------- Timer ----------
  const studyMin = qs("#studyMin");
  const breakMin = qs("#breakMin");
  const timerSubject = qs("#timerSubject");
  const timerHint = qs("#timerHint");

  const timer3d = qs("#timer3d");
  const timerRing = qs("#timerRing");
  const timerMode = qs("#timerMode");
  const timerTextEl = qs("#timerText");
  const timerSub = qs("#timerSub");

  const btnStartPause = qs("#btnStartPause");
  const btnReset = qs("#btnReset");
  const btnSwitchMode = qs("#btnSwitchMode");

  const timer = {
    mode: "study",   // study | break
    running: false,
    total: 25*60,
    remaining: 25*60,
    last: 0,
    raf: 0,
    sessionId: "",
    rot: {x:-8, y:12},
    vel: {x:0, y:0},
    drag: null,
  };

  function formatTime(sec){
    sec = Math.max(0, Math.floor(sec));
    const m = Math.floor(sec/60);
    const s = sec % 60;
    return `${pad2(m)}:${pad2(s)}`;
  }

  function setTimerFromInputs(){
    const sm = clamp(parseInt(studyMin.value || "25",10) || 25, 1, 180);
    const bm = clamp(parseInt(breakMin.value || "5",10) || 5, 1, 60);
    const mins = timer.mode === "study" ? sm : bm;
    timer.total = mins * 60;
    timer.remaining = timer.total;
    timer.sessionId = "";
    refreshTimerUI();
  }

  function refreshTimerUI(){
    const p = timer.total ? 1 - (timer.remaining/timer.total) : 0;
    timerRing.style.setProperty("--p", String(clamp(p,0,1)));

    timerMode.textContent = timer.mode === "study" ? "Study" : "Break";
    timerTextEl.textContent = formatTime(timer.remaining);

    const sid = timerSubject.value || "";
    const subj = state.subjects.find(s => s.id === sid)?.name || "—";
    timerSub.textContent = subj;

    btnStartPause.textContent = timer.running ? "إيقاف مؤقت" : "بدء";

    timerHint.hidden = state.subjects.length !== 0;
  }

  function start(){
    if(timer.running) return;
    timer.running = true;
    timer.last = performance.now();
    if(!timer.sessionId) timer.sessionId = uid("sess");
    loop();
    refreshTimerUI();
  }

  function pause(){
    timer.running = false;
    cancelAnimationFrame(timer.raf);
    timer.raf = 0;
    refreshTimerUI();
  }

  function reset(){
    pause();
    setTimerFromInputs();
    toast("تمت إعادة ضبط التايمر.", "info");
  }

  function complete(){
    pause();

    if(timer.mode === "study"){
      // save session
      const mins = Math.round(timer.total/60);
      const sid = timerSubject.value || "";
      state.sessions.push({
        id: timer.sessionId,
        subjectId: sid || "",
        minutes: mins,
        ts: Date.now()
      });
      save();
      toast("انتهت جلسة الدراسة ✅", "ok");

      // auto to break
      timer.mode = "break";
      setTimerFromInputs();
    }else{
      toast("انتهت الاستراحة. جاهز للدراسة؟", "ok");
      timer.mode = "study";
      setTimerFromInputs();
    }

    renderAll();
  }

  function loop(){
    if(!timer.running) return;
    const now = performance.now();
    const dt = (now - timer.last)/1000;
    timer.last = now;

    timer.remaining -= dt;
    if(timer.remaining <= 0){
      timer.remaining = 0;
      refreshTimerUI();
      return complete();
    }
    refreshTimerUI();
    timer.raf = requestAnimationFrame(loop);
  }

  btnStartPause?.addEventListener("click", () => timer.running ? pause() : start());
  btnReset?.addEventListener("click", reset);
  btnSwitchMode?.addEventListener("click", () => {
    pause();
    timer.mode = timer.mode === "study" ? "break" : "study";
    setTimerFromInputs();
  });

  studyMin?.addEventListener("input", () => !timer.running && setTimerFromInputs());
  breakMin?.addEventListener("input", () => !timer.running && setTimerFromInputs());
  timerSubject?.addEventListener("change", refreshTimerUI);

  // 3D drag + inertia (smooth, no glitches)
  function mountTimer3D(){
    if(!timer3d) return;
    const applyRot = () => {
      timer3d.style.transform = `rotateX(${timer.rot.x}deg) rotateY(${timer.rot.y}deg)`;
    };
    applyRot();

    const onDown = (e) => {
      timer.drag = { id:e.pointerId, x:e.clientX, y:e.clientY, t:performance.now() };
      timer.vel.x = 0; timer.vel.y = 0;
      timer3d.setPointerCapture?.(e.pointerId);
      timer3d.style.cursor = "grabbing";
    };

    const onMove = (e) => {
      if(!timer.drag || e.pointerId !== timer.drag.id) return;
      const dx = e.clientX - timer.drag.x;
      const dy = e.clientY - timer.drag.y;
      timer.drag.x = e.clientX;
      timer.drag.y = e.clientY;

      const now = performance.now();
      const dt = Math.max(8, now - timer.drag.t);
      timer.drag.t = now;

      timer.rot.y += dx * 0.16;
      timer.rot.x -= dy * 0.14;

      timer.rot.x = clamp(timer.rot.x, -26, 18);
      timer.rot.y = clamp(timer.rot.y, -40, 40);

      timer.vel.y = (dx/dt) * 22;
      timer.vel.x = (-dy/dt) * 22;

      applyRot();
    };

    const inertia = () => {
      timer.vel.x *= 0.92;
      timer.vel.y *= 0.92;

      timer.rot.x = clamp(timer.rot.x + timer.vel.x, -26, 18);
      timer.rot.y = clamp(timer.rot.y + timer.vel.y, -40, 40);

      applyRot();
      if(Math.abs(timer.vel.x) + Math.abs(timer.vel.y) > 0.06){
        requestAnimationFrame(inertia);
      }
    };

    const onUp = (e) => {
      if(!timer.drag || e.pointerId !== timer.drag.id) return;
      timer.drag = null;
      timer3d.style.cursor = "grab";
      requestAnimationFrame(inertia);
    };

    timer3d.addEventListener("pointerdown", onDown);
    timer3d.addEventListener("pointermove", onMove);
    timer3d.addEventListener("pointerup", onUp);
    timer3d.addEventListener("pointercancel", onUp);
  }

  // ---------- Stats / Dashboard ----------
  const dashWeekMinutes = qs("#dashWeekMinutes");
  const dashTasksDone = qs("#dashTasksDone");
  const dashSubjects = qs("#dashSubjects");
  const weekChart = qs("#weekChart");

  function rangeStart(days){
    const d = new Date();
    d.setHours(0,0,0,0);
    return d.getTime() - (days*24*60*60*1000);
  }

  function getWeekBuckets(){
    const dayMs = 24*60*60*1000;
    const start = rangeStart(6); // last 7 days including today
    const buckets = new Array(7).fill(0);

    for(const s of state.sessions){
      const day = new Date(s.ts);
      day.setHours(0,0,0,0);
      const idx = Math.floor((day.getTime() - start)/dayMs);
      if(idx >= 0 && idx < 7) buckets[idx] += s.minutes;
    }
    return buckets;
  }

  function tasksDoneRate(){
    const total = state.tasks.length;
    if(!total) return 0;
    const done = state.tasks.filter(t => t.done).length;
    return Math.round((done/total)*100);
  }

  function weekTotalMinutes(){
    const from = rangeStart(6);
    return state.sessions.filter(s => s.ts >= from).reduce((a,b)=>a+b.minutes,0);
  }

  function drawWeekChart(){
    if(!weekChart) return;
    const ctx = weekChart.getContext("2d");
    const cssW = weekChart.clientWidth || 920;
    const cssH = 260;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    weekChart.width = Math.floor(cssW * dpr);
    weekChart.height = Math.floor(cssH * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);

    const W = cssW, H = cssH;
    ctx.clearRect(0,0,W,H);

    const data = getWeekBuckets();
    const max = Math.max(10, ...data);
    const pad = 18;
    const gap = (W - pad*2) / data.length;
    const barW = gap * 0.62;

    // grid lines
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    for(let i=1;i<=4;i++){
      const y = (H*i)/5;
      ctx.beginPath();
      ctx.moveTo(0,y);
      ctx.lineTo(W,y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    for(let i=0;i<data.length;i++){
      const v = data[i];
      const h = (v/max) * (H - pad*2);
      const x = pad + i*gap + (gap-barW)/2;
      const y = H - pad - h;

      const g = ctx.createLinearGradient(x,y,x,y+h);
      g.addColorStop(0,"rgba(99,102,241,0.88)");
      g.addColorStop(1,"rgba(168,85,247,0.55)");
      ctx.fillStyle = g;

      roundRect(ctx, x, y, barW, h, 12);
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.08)";
      roundRect(ctx, x, y, barW, 10, 12);
      ctx.fill();
    }

    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("Study minutes (last 7 days)", 12, 18);
  }

  function roundRect(ctx,x,y,w,h,r){
    r = Math.min(r, w/2, h/2);
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    ctx.closePath();
  }

  // ---------- Selects refresh ----------
  function refreshSubjectSelects(){
    const opts = [`<option value="">— بدون مادة —</option>`]
      .concat(state.subjects.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`))
      .join("");

    if(timerSubject){
      timerSubject.innerHTML = opts;
    }
    if(nbSubject){
      nbSubject.innerHTML = opts;
    }
    if(editorSubject){
      editorSubject.innerHTML = opts;
      editorSubject.disabled = !activeNotebookId;
    }
    if(taskSubject){
      taskSubject.innerHTML = opts;
    }

    // filter (tasks)
    if(tasksFilter){
      const prev = tasksFilter.value || "";
      tasksFilter.innerHTML = `<option value="">كل المواد</option>` +
        state.subjects.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join("");
      tasksFilter.value = prev;
    }
  }

  // ---------- Delegated actions (no glitch) ----------
  document.addEventListener("click", (e) => {
    const el = e.target.closest?.("[data-action]");
    if(!el) return;
    const action = el.dataset.action;

    // subjects
    if(action === "del-subject"){
      const card = el.closest(".subject-card");
      const id = card?.dataset.sid;
      if(!id) return;

      openModal({
        title: "حذف مادة",
        bodyHTML: `<p>هل أنت متأكد؟ سيتم فك الربط من الدفاتر والمهام.</p>`,
        footerHTML: `
          <button class="btn-ghost" type="button" data-m="cancel">إلغاء</button>
          <button class="btn-danger" type="button" data-m="ok">حذف</button>
        `,
        onClose: null
      });

      modalFooter.onclick = (ev) => {
        const b = ev.target.closest?.("button");
        if(!b) return;
        const m = b.getAttribute("data-m");
        if(m === "cancel") return closeModal();
        if(m === "ok"){
          deleteSubject(id);
          closeModal();
        }
      };
    }

    // notebooks
    if(action === "del-notebook"){
      const wrap = el.closest(".notebook");
      const id = wrap?.dataset.nid;
      if(!id) return;

      openModal({
        title: "حذف دفتر",
        bodyHTML: `<p>حذف الدفتر سيحذف الملاحظات داخله.</p>`,
        footerHTML: `
          <button class="btn-ghost" type="button" data-m="cancel">إلغاء</button>
          <button class="btn-danger" type="button" data-m="ok">حذف</button>
        `
      });

      modalFooter.onclick = (ev) => {
        const b = ev.target.closest?.("button");
        if(!b) return;
        const m = b.getAttribute("data-m");
        if(m === "cancel") return closeModal();
        if(m === "ok"){
          deleteNotebook(id);
          closeModal();
        }
      };
    }

    // tasks
    if(action === "toggle-task"){
      const row = el.closest(".task");
      const id = row?.dataset.tid;
      if(id) toggleTask(id);
    }
    if(action === "del-task"){
      const row = el.closest(".task");
      const id = row?.dataset.tid;
      if(!id) return;

      openModal({
        title: "حذف مهمة",
        bodyHTML: `<p>هل تريد حذف المهمة؟</p>`,
        footerHTML: `
          <button class="btn-ghost" type="button" data-m="cancel">إلغاء</button>
          <button class="btn-danger" type="button" data-m="ok">حذف</button>
        `
      });

      modalFooter.onclick = (ev) => {
        const b = ev.target.closest?.("button");
        if(!b) return;
        const m = b.getAttribute("data-m");
        if(m === "cancel") return closeModal();
        if(m === "ok"){
          deleteTask(id);
          closeModal();
        }
      };
    }

    // open notebook editor
    const nb = e.target.closest?.(".notebook");
    if(nb && !e.target.closest?.("[data-action='del-notebook']")){
      const id = nb.dataset.nid;
      const n = state.notebooks.find(x => x.id === id);
      if(n) setEditor(n);
    }
  });

  // ---------- Backup / Reset ----------
  qs("#btnExport")?.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type:"application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "serag-backup.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast("تم التصدير.", "ok");
  });

  qs("#importFile")?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if(!file) return;
    try{
      const txt = await file.text();
      const data = JSON.parse(txt);
      // minimal validation
      state = { ...defaults(), ...data };
      save();
      applyTheme();
      toast("تم الاستيراد بنجاح.", "ok");
      renderAll();
    }catch{
      toast("ملف JSON غير صالح.", "warn");
    }finally{
      e.target.value = "";
    }
  });

  qs("#btnResetAll")?.addEventListener("click", () => {
    openModal({
      title: "Reset All",
      bodyHTML: `<p>سيتم حذف كل البيانات (مواد/دفاتر/مهام/جلسات). هل أنت متأكد؟</p>`,
      footerHTML: `
        <button class="btn-ghost" type="button" data-m="cancel">إلغاء</button>
        <button class="btn-danger" type="button" data-m="ok">حذف</button>
      `
    });

    modalFooter.onclick = (ev) => {
      const b = ev.target.closest?.("button");
      if(!b) return;
      const m = b.getAttribute("data-m");
      if(m === "cancel") return closeModal();
      if(m === "ok"){
        state = defaults();
        save();
        applyTheme();
        activeNotebookId = "";
        setEditor(null);
        setTimerFromInputs();
        toast("تمت إعادة الضبط.", "ok");
        closeModal();
        renderAll();
      }
    };
  });

  // ---------- Render All ----------
  function renderDashboard(){
    dashWeekMinutes.textContent = String(weekTotalMinutes());
    dashTasksDone.textContent = `${tasksDoneRate()}%`;
    dashSubjects.textContent = String(state.subjects.length);
    drawWeekChart();
  }

  function renderAll(){
    refreshSubjectSelects();
    renderSubjects();
    renderNotebooks();
    renderTasks();
    renderDashboard();
    refreshTimerUI();
  }

  // ---------- Init ----------
  function init(){
    applyTheme();

    // init selects
    refreshSubjectSelects();

    // timer
    setTimerFromInputs();
    mountTimer3D();

    // initial editor
    setEditor(null);

    // initial tab already active in HTML
    renderAll();

    // resize chart
    window.addEventListener("resize", () => drawWeekChart());
  }

  document.addEventListener("DOMContentLoaded", init);
})();
