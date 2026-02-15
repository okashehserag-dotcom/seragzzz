/* =========================
   Serag | سراج — Vanilla SPA
   - RTL Tabs (sidebar right) + Drawer mobile
   - Scroll fix handled by CSS (panels in flow)
   - No store, no AI, no coins
   - LocalStorage only
   - Micro interactions + rAF background + tilt
   ========================= */

const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

const LS_KEY = "serag_v1";

const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);

function loadState(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(!raw) return {
      theme: "dark",
      subjects: [], // {id,name,createdAt}
      notebooks: [], // {id,name,subjectId:null,notes:"",createdAt,rotX,rotY}
      tasks: [], // {id,subjectId,text,done,createdAt}
      sessions: [] // {id,mode:"study"|"break",subjectId:null,minutes,endedAt}
    };
    const s = JSON.parse(raw);
    // minimal sanitize
    s.subjects ??= [];
    s.notebooks ??= [];
    s.tasks ??= [];
    s.sessions ??= [];
    s.theme ??= "dark";
    return s;
  }catch{
    return {
      theme:"dark",
      subjects:[],
      notebooks:[],
      tasks:[],
      sessions:[]
    };
  }
}
function saveState(){
  localStorage.setItem(LS_KEY, JSON.stringify(state));
  renderMeta();
  renderStats();
}

let state = loadState();

/* ---------- Theme ---------- */
function applyTheme(){
  const isLight = state.theme === "light";
  document.documentElement.dataset.theme = isLight ? "light" : "";
  // toggle UI
  const toggle = $("#themeToggle");
  if(toggle){
    toggle.classList.toggle("on", isLight);
    toggle.setAttribute("aria-pressed", String(isLight));
  }
}
function toggleTheme(){
  state.theme = (state.theme === "light") ? "dark" : "light";
  applyTheme();
  saveState();
  toast("🌓", "المظهر", state.theme === "light" ? "تم تفعيل الفاتح" : "تم تفعيل الداكن");
}

/* ---------- Toast ---------- */
function toast(icon, title, text){
  const wrap = $("#toasts");
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = `
    <div class="toastIcon" aria-hidden="true">${icon}</div>
    <div>
      <div class="toastTitle">${title}</div>
      <div class="toastText">${text}</div>
    </div>
  `;
  wrap.appendChild(t);
  setTimeout(()=>{ t.style.opacity="0"; t.style.transform="translateY(10px)"; }, 2800);
  setTimeout(()=>{ t.remove(); }, 3200);
}

/* ---------- Navigation (Tabs + Drawer) ---------- */
function setActiveTab(id){
  $$(".tab-btn").forEach(b=>{
    const on = b.dataset.tab === id;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", String(on));
  });
  $$(".tab-panel").forEach(p=>{
    p.classList.toggle("active", p.id === id);
  });

  // close drawer on mobile
  closeDrawer();

  // small entrance
  if(!prefersReduced){
    const panel = document.getElementById(id);
    panel?.scrollIntoView({block:"start", behavior:"smooth"});
  }
}

function openDrawer(){
  const d = $("#drawer");
  const overlay = $("#overlay");
  d.classList.add("open");
  overlay.hidden = false;
  $("#menuBtn")?.setAttribute("aria-expanded","true");
}
function closeDrawer(){
  const d = $("#drawer");
  const overlay = $("#overlay");
  d.classList.remove("open");
  overlay.hidden = true;
  $("#menuBtn")?.setAttribute("aria-expanded","false");
}

/* ---------- Micro tilt (cards) ---------- */
function initTilt(){
  const tiltEls = $$("[data-tilt]");
  tiltEls.forEach(el=>{
    let rect = null;
    const strength = 10;

    function onMove(e){
      if(prefersReduced) return;
      rect = rect || el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (y - 0.5) * -strength;
      const ry = (x - 0.5) * strength;
      el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-1px)`;
      el.style.setProperty("--mx", `${x*100}%`);
      el.style.setProperty("--my", `${y*100}%`);
    }
    function onLeave(){
      rect = null;
      el.style.transform = "";
      el.style.setProperty("--mx", `50%`);
      el.style.setProperty("--my", `50%`);
    }
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
  });
}

/* ---------- Background canvas ---------- */
function initBackground(){
  const c = $("#bgCanvas");
  const ctx = c.getContext("2d", { alpha:true });
  let w=0,h=0,dpr=1;

  const blobs = [];
  const blobCount = prefersReduced ? 8 : 14;

  function resize(){
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = c.width = Math.floor(innerWidth*dpr);
    h = c.height = Math.floor(innerHeight*dpr);
    c.style.width = innerWidth + "px";
    c.style.height = innerHeight + "px";
  }
  resize();
  addEventListener("resize", resize);

  function rand(min,max){ return Math.random()*(max-min)+min; }

  for(let i=0;i<blobCount;i++){
    blobs.push({
      x: rand(0,w), y: rand(0,h),
      r: rand(140, 320)*dpr,
      vx: rand(-.25,.25)*dpr,
      vy: rand(-.25,.25)*dpr,
      hue: rand(210, 320)
    });
  }

  let last = performance.now();
  function tick(now){
    const dt = Math.min(33, now-last); last = now;

    ctx.clearRect(0,0,w,h);

    // subtle vignette
    const vg = ctx.createRadialGradient(w*.5,h*.5, 0, w*.5,h*.5, Math.max(w,h)*.65);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.28)");
    ctx.fillStyle = vg;
    ctx.fillRect(0,0,w,h);

    // blobs
    ctx.globalCompositeOperation = "lighter";
    blobs.forEach(b=>{
      b.x += b.vx*dt;
      b.y += b.vy*dt;
      if(b.x < -b.r) b.x = w + b.r;
      if(b.x > w + b.r) b.x = -b.r;
      if(b.y < -b.r) b.y = h + b.r;
      if(b.y > h + b.r) b.y = -b.r;

      const g = ctx.createRadialGradient(b.x,b.y, 0, b.x,b.y, b.r);
      g.addColorStop(0, `hsla(${b.hue}, 90%, 60%, 0.12)`);
      g.addColorStop(1, `hsla(${b.hue}, 90%, 60%, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
      ctx.fill();
    });
    ctx.globalCompositeOperation = "source-over";

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------- Subjects ---------- */
function renderSubjects(){
  const list = $("#subjectList");
  const empty = $("#subjectsEmpty");
  list.innerHTML = "";

  if(state.subjects.length === 0){
    empty.style.display = "flex";
  }else{
    empty.style.display = "none";
    state.subjects.forEach(s=>{
      const item = document.createElement("div");
      item.className = "subjectItem";
      item.dataset.subjectId = s.id;
      item.innerHTML = `
        <div class="subDot" aria-hidden="true"></div>
        <div class="subTxt">
          <div class="subName">${escapeHtml(s.name)}</div>
          <div class="subMeta">Drop دفتر هنا لربطه</div>
        </div>
        <div class="subDrop" aria-hidden="true">Drop</div>
        <button class="iconMini" title="حذف" aria-label="حذف المادة">🗑</button>
      `;

      // Delete
      item.querySelector(".iconMini").addEventListener("click", ()=>{
        // remove subject + unlink notebooks + remove tasks subject mapping
        state.subjects = state.subjects.filter(x=>x.id!==s.id);
        state.notebooks.forEach(nb=>{ if(nb.subjectId===s.id) nb.subjectId = null; });
        state.tasks = state.tasks.filter(t=>t.subjectId!==s.id);
        saveState();
        renderAll();
        toast("🗑","تم الحذف","تم حذف المادة وتنظيف الروابط");
      });

      // Drop zone for notebook
      item.addEventListener("dragover",(e)=>{
        e.preventDefault();
        item.classList.add("dragOver");
      });
      item.addEventListener("dragleave",()=> item.classList.remove("dragOver"));
      item.addEventListener("drop",(e)=>{
        e.preventDefault();
        item.classList.remove("dragOver");
        const nbId = e.dataTransfer.getData("text/notebook");
        if(!nbId) return;
        const nb = state.notebooks.find(n=>n.id===nbId);
        if(!nb) return;
        nb.subjectId = s.id;
        saveState();
        renderNotebooks();
        toast("🧷","تم الربط", `تم ربط "${nb.name}" بـ "${s.name}"`);
      });

      list.appendChild(item);
    });
  }

  renderSubjectSelects();
  renderHomeChips();
}

function addSubject(){
  const name = ($("#subjectName").value || "").trim();
  if(!name) return toast("⚠","تنبيه","اكتب اسم المادة أولًا");
  if(state.subjects.length >= 8) return toast("⚠","الحد الأقصى","8 مواد فقط");
  if(state.subjects.some(s=>s.name === name)) return toast("⚠","مكرر","اسم المادة موجود");
  state.subjects.push({id:uid(), name, createdAt: Date.now()});
  $("#subjectName").value = "";
  saveState();
  renderAll();
  toast("📚","تمت الإضافة", name);
}

/* ---------- Notebooks ---------- */
let editorOpenId = null;
let saveTimer = null;

function renderNotebooks(){
  const grid = $("#notebookGrid");
  const empty = $("#notebooksEmpty");
  const editor = $("#editorCard");
  grid.innerHTML = "";

  if(state.notebooks.length === 0){
    empty.style.display = "flex";
    editor.hidden = true;
    return;
  }
  empty.style.display = "none";

  state.notebooks.forEach(nb=>{
    const sName = nb.subjectId ? (state.subjects.find(s=>s.id===nb.subjectId)?.name || "—") : "غير مرتبط";
    const el = document.createElement("div");
    el.className = "book";
    el.draggable = true;
    el.dataset.nbId = nb.id;

    const rx = nb.rotX ?? 0;
    const ry = nb.rotY ?? 0;
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;

    el.innerHTML = `
      <div class="bookCover"></div>
      <div class="bookSpine"></div>
      <div class="bookPages"></div>
      <div class="bookTitle">${escapeHtml(nb.name)}</div>
      <div class="bookLink">${escapeHtml(sName)}</div>
      <div class="bookBadge">Drag</div>
    `;

    // Drag & drop
    el.addEventListener("dragstart",(e)=>{
      e.dataTransfer.setData("text/notebook", nb.id);
      e.dataTransfer.effectAllowed = "move";
    });

    // Click to open editor
    el.addEventListener("click", ()=>{
      openEditor(nb.id);
    });

    // Rotate (pointer drag)
    init3DRotate(el, nb);

    grid.appendChild(el);
  });

  renderSubjectSelects();
}

function addNotebook(){
  const name = ($("#notebookName").value || "").trim();
  if(!name) return toast("⚠","تنبيه","اكتب اسم الدفتر أولًا");
  if(state.notebooks.length >= 8) return toast("⚠","الحد الأقصى","8 دفاتر فقط");
  state.notebooks.push({
    id: uid(),
    name,
    subjectId: null,
    notes: "",
    createdAt: Date.now(),
    rotX: 0,
    rotY: 0
  });
  $("#notebookName").value = "";
  saveState();
  renderAll();
  toast("📓","تمت الإضافة", name);
}

/* 3D rotate with inertia */
function init3DRotate(el, nb){
  let dragging = false;
  let startX=0,startY=0;
  let vx=0, vy=0;
  let lastX=0,lastY=0;
  let lastT=0;
  let raf = null;

  const clamp = (v,min,max)=> Math.max(min, Math.min(max, v));

  function apply(){
    nb.rotX = clamp(nb.rotX, -18, 18);
    nb.rotY = clamp(nb.rotY, -22, 22);
    el.style.transform = `rotateX(${nb.rotX}deg) rotateY(${nb.rotY}deg)`;
  }

  function onDown(e){
    // don't interfere with drag&drop; right-click etc.
    if(e.button !== undefined && e.button !== 0) return;
    dragging = true;
    el.setPointerCapture(e.pointerId);
    startX = lastX = e.clientX;
    startY = lastY = e.clientY;
    lastT = performance.now();
    vx = vy = 0;
    cancelAnimationFrame(raf);
  }

  function onMove(e){
    if(!dragging) return;
    const now = performance.now();
    const dt = Math.max(1, now-lastT);
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    lastT = now;

    vx = dx / dt;
    vy = dy / dt;

    nb.rotY += dx * 0.08;
    nb.rotX += dy * -0.08;
    apply();
  }

  function inertia(){
    // mild inertia
    nb.rotY += vx * 14;
    nb.rotX += vy * -14;
    vx *= 0.92;
    vy *= 0.92;
    apply();

    if(Math.abs(vx) + Math.abs(vy) > 0.02){
      raf = requestAnimationFrame(inertia);
    }else{
      saveState();
    }
  }

  function onUp(e){
    if(!dragging) return;
    dragging = false;
    try{ el.releasePointerCapture(e.pointerId); }catch{}
    if(prefersReduced){ saveState(); return; }
    raf = requestAnimationFrame(inertia);
  }

  el.addEventListener("pointerdown", onDown);
  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerup", onUp);
  el.addEventListener("pointercancel", onUp);
}

/* Editor */
function openEditor(id){
  editorOpenId = id;
  const nb = state.notebooks.find(n=>n.id===id);
  if(!nb) return;

  $("#editorCard").hidden = false;
  $("#editorTitle").textContent = nb.name;
  $("#editorText").value = nb.notes || "";

  const sName = nb.subjectId ? (state.subjects.find(s=>s.id===nb.subjectId)?.name || "—") : "غير مرتبط";
  $("#editorLinked").textContent = sName;

  // subject select
  const sel = $("#editorSubjectSelect");
  buildSubjectSelect(sel, true);
  sel.value = nb.subjectId || "";
  sel.onchange = ()=>{
    nb.subjectId = sel.value || null;
    $("#editorLinked").textContent = nb.subjectId ? (state.subjects.find(s=>s.id===nb.subjectId)?.name || "—") : "غير مرتبط";
    saveState();
    renderNotebooks();
    toast("🧷","تم تحديث الربط","تم تغيير مادة الدفتر");
  };

  $("#saveState").textContent = "جاهز";

  $("#editorText").oninput = ()=>{
    $("#saveState").textContent = "جار الحفظ…";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(()=>{
      nb.notes = $("#editorText").value;
      saveState();
      $("#saveState").textContent = "تم الحفظ ✓";
    }, 400);
  };

  $("#closeEditor").onclick = ()=>{
    $("#editorCard").hidden = true;
    editorOpenId = null;
  };
}

/* ---------- Tasks ---------- */
function renderTasks(){
  const list = $("#taskList");
  const empty = $("#tasksEmpty");
  const subjectId = $("#tasksSubjectSelect").value || "";

  list.innerHTML = "";

  const tasks = state.tasks.filter(t=> t.subjectId === subjectId);
  if(!subjectId || tasks.length === 0){
    empty.style.display = "flex";
    return;
  }
  empty.style.display = "none";

  tasks.forEach(t=>{
    const el = document.createElement("div");
    el.className = "task" + (t.done ? " done" : "");
    el.innerHTML = `
      <div class="chk" role="button" tabindex="0" aria-label="إنهاء المهمة">${t.done ? "✓" : ""}</div>
      <div class="taskText">${escapeHtml(t.text)}</div>
      <div class="taskActions">
        <button class="iconMini" aria-label="حذف المهمة" title="حذف">🗑</button>
      </div>
    `;

    const chk = el.querySelector(".chk");
    const toggleDone = ()=>{
      t.done = !t.done;
      saveState();
      renderTasks();
      toast("✅","تم التحديث", t.done ? "مهمة مكتملة" : "تم إلغاء الإكمال");
    };
    chk.addEventListener("click", toggleDone);
    chk.addEventListener("keydown",(e)=>{
      if(e.key==="Enter" || e.key===" "){ e.preventDefault(); toggleDone(); }
    });

    el.querySelector(".iconMini").addEventListener("click", ()=>{
      state.tasks = state.tasks.filter(x=>x.id!==t.id);
      saveState();
      renderTasks();
      toast("🗑","حذف","تم حذف المهمة");
    });

    list.appendChild(el);
  });
}

function addTask(){
  const subjectId = $("#tasksSubjectSelect").value || "";
  const text = ($("#taskText").value || "").trim();
  if(!subjectId) return toast("⚠","تنبيه","اختر مادة أولًا");
  if(!text) return toast("⚠","تنبيه","اكتب نص المهمة");
  state.tasks.push({id:uid(), subjectId, text, done:false, createdAt: Date.now()});
  $("#taskText").value = "";
  saveState();
  renderTasks();
  toast("✅","تمت الإضافة", text);
}

/* ---------- Timer (Dial) ---------- */
const timer = {
  mode: "study",
  totalSec: 25*60,
  remainingSec: 25*60,
  running: false,
  paused: false,
  tickId: null,
  last: 0,
  angle: 0, // -150..150 maps to 5..120 min
  v: 0
};

function setTimerMode(mode){
  timer.mode = mode;
  $$(".seg").forEach(b=> b.classList.toggle("active", b.dataset.mode===mode));
  $("#dialSub").textContent = mode === "study" ? "دراسة" : "استراحة";
  // default durations
  const mins = mode === "study" ? 25 : 5;
  setDialMinutes(mins);
  toast("⏱","الوضع", mode === "study" ? "دراسة" : "استراحة");
}

function formatTime(sec){
  const m = Math.floor(sec/60);
  const s = sec%60;
  return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
}

function setDialMinutes(mins){
  const clamped = Math.max(1, Math.min(180, mins));
  timer.totalSec = clamped*60;
  if(!timer.running) timer.remainingSec = timer.totalSec;
  $("#dialTime").textContent = formatTime(timer.remainingSec);
  // update needle by mapping minutes->angle
  // map 5..120 -> -150..150
  const a = map(clamped, 5, 120, -150, 150);
  timer.angle = clamp(a, -150, 150);
  renderDial();
}

function renderDial(){
  const needle = $("#dialNeedle");
  needle.style.transform = `translateX(-50%) rotate(${timer.angle}deg)`;
  // ring subtle rotation
  $("#dialRing").style.transform = `rotate(${timer.angle*0.25}deg)`;
}

function initDialDrag(){
  const dial = $("#dial");
  let dragging = false;
  let lastX=0, lastT=0;

  function angleToMins(a){
    // inverse map -150..150 -> 5..120
    return Math.round(map(a, -150, 150, 5, 120));
  }

  function onDown(e){
    if(timer.running) return; // lock during run
    dragging = true;
    dial.setPointerCapture(e.pointerId);
    lastX = e.clientX;
    lastT = performance.now();
    timer.v = 0;
  }

  function onMove(e){
    if(!dragging) return;
    const now = performance.now();
    const dt = Math.max(1, now-lastT);
    lastT = now;
    const dx = e.clientX - lastX;
    lastX = e.clientX;

    // horizontal drag -> angle
    timer.angle = clamp(timer.angle + dx*0.55, -150, 150);
    timer.v = dx/dt;
    renderDial();
    const mins = angleToMins(timer.angle);
    timer.totalSec = mins*60;
    timer.remainingSec = timer.totalSec;
    $("#dialTime").textContent = formatTime(timer.remainingSec);
  }

  function inertia(){
    if(prefersReduced) return;
    timer.angle = clamp(timer.angle + timer.v*18, -150, 150);
    timer.v *= 0.90;
    renderDial();
    const mins = angleToMins(timer.angle);
    timer.totalSec = mins*60;
    timer.remainingSec = timer.totalSec;
    $("#dialTime").textContent = formatTime(timer.remainingSec);

    if(Math.abs(timer.v) > 0.02){
      requestAnimationFrame(inertia);
    }
  }

  function onUp(e){
    if(!dragging) return;
    dragging = false;
    try{ dial.releasePointerCapture(e.pointerId); }catch{}
    requestAnimationFrame(inertia);
  }

  dial.addEventListener("pointerdown", onDown);
  dial.addEventListener("pointermove", onMove);
  dial.addEventListener("pointerup", onUp);
  dial.addEventListener("pointercancel", onUp);
}

function startTimer(){
  if(timer.running) return;
  timer.running = true;
  timer.paused = false;
  $("#startTimer").disabled = true;
  $("#pauseTimer").disabled = false;
  $("#timerState").textContent = "يعمل…";
  toast("⏱","بدء","بدأت الجلسة");

  timer.last = performance.now();
  timer.tickId = requestAnimationFrame(tickTimer);
}

function pauseTimer(){
  if(!timer.running) return;
  timer.paused = !timer.paused;
  $("#pauseTimer").textContent = timer.paused ? "متابعة" : "إيقاف مؤقت";
  $("#timerState").textContent = timer.paused ? "متوقف مؤقتًا" : "يعمل…";
}

function resetTimer(){
  if(timer.tickId) cancelAnimationFrame(timer.tickId);
  timer.running = false;
  timer.paused = false;
  $("#pauseTimer").textContent = "إيقاف مؤقت";
  $("#startTimer").disabled = false;
  $("#pauseTimer").disabled = true;
  $("#timerState").textContent = "جاهز";
  timer.remainingSec = timer.totalSec;
  $("#dialTime").textContent = formatTime(timer.remainingSec);
  toast("🔄","إعادة","تمت إعادة التايمر");
}

function tickTimer(now){
  if(!timer.running) return;

  if(!timer.paused){
    const dt = (now - timer.last) / 1000;
    timer.last = now;
    timer.remainingSec = Math.max(0, timer.remainingSec - dt);
    $("#dialTime").textContent = formatTime(Math.ceil(timer.remainingSec));

    if(timer.remainingSec <= 0){
      finishTimer();
      return;
    }
  }else{
    timer.last = now;
  }

  timer.tickId = requestAnimationFrame(tickTimer);
}

function finishTimer(){
  timer.running = false;
  $("#startTimer").disabled = false;
  $("#pauseTimer").disabled = true;
  $("#pauseTimer").textContent = "إيقاف مؤقت";
  $("#timerState").textContent = "انتهت";

  // log session ONLY if study
  const mins = Math.round(timer.totalSec/60);
  const mode = timer.mode;
  const subjectId = $("#timerSubjectSelect").value || null;

  state.sessions.push({
    id: uid(),
    mode,
    subjectId,
    minutes: mins,
    endedAt: Date.now()
  });

  saveState();
  toast("🎉","انتهى", mode==="study" ? `سجلنا ${mins} دقيقة` : "استراحة انتهت");
  // reset remaining
  timer.remainingSec = timer.totalSec;
  $("#dialTime").textContent = formatTime(timer.remainingSec);
}

/* ---------- Stats (Canvas) ---------- */
function minutesToday(){
  const start = new Date();
  start.setHours(0,0,0,0);
  const t0 = start.getTime();
  return state.sessions
    .filter(s=>s.mode==="study" && s.endedAt >= t0)
    .reduce((a,b)=>a + (b.minutes||0), 0);
}

function minutesBetween(startMs, endMs){
  return state.sessions
    .filter(s=>s.mode==="study" && s.endedAt >= startMs && s.endedAt < endMs)
    .reduce((a,b)=>a + (b.minutes||0), 0);
}

function renderStats(){
  // totals
  const total = state.sessions.filter(s=>s.mode==="study").reduce((a,b)=>a+(b.minutes||0),0);

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - ((now.getDay()+6)%7)); // Mon
  weekStart.setHours(0,0,0,0);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  monthStart.setHours(0,0,0,0);

  $("#statTotal") && ($("#statTotal").textContent = total);
  $("#statWeek") && ($("#statWeek").textContent = minutesBetween(weekStart.getTime(), Date.now()+1));
  $("#statMonth") && ($("#statMonth").textContent = minutesBetween(monthStart.getTime(), Date.now()+1));

  // overall chart: last 7 days
  drawOverallChart();

  // subject chart
  drawSubjectChart();
}

function drawOverallChart(){
  const c = $("#overallChart");
  if(!c) return;
  const ctx = c.getContext("2d");
  const W = c.width, H = c.height;

  ctx.clearRect(0,0,W,H);

  // build last 7 days data
  const days = [];
  const now = new Date();
  for(let i=6;i>=0;i--){
    const d = new Date(now);
    d.setDate(now.getDate()-i);
    d.setHours(0,0,0,0);
    const start = d.getTime();
    const end = start + 86400000;
    const val = minutesBetween(start,end);
    days.push({label: d.toLocaleDateString("ar", {weekday:"short"}), val});
  }

  const maxV = Math.max(30, ...days.map(x=>x.val));
  // axes
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  roundRect(ctx, 0,0,W,H, 18); ctx.fill();

  // grid
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 1;
  for(let i=1;i<=3;i++){
    const y = 30 + (H-70)*(i/4);
    ctx.beginPath(); ctx.moveTo(18,y); ctx.lineTo(W-18,y); ctx.stroke();
  }

  const padX = 40, padYTop=26, padYBot=42;
  const chartW = W - padX*2;
  const chartH = H - padYTop - padYBot;

  // bars
  const barW = chartW / days.length * 0.55;
  days.forEach((d, i)=>{
    const x = padX + (chartW/days.length)*i + (chartW/days.length - barW)/2;
    const h = (d.val / maxV) * chartH;
    const y = padYTop + (chartH - h);

    const grad = ctx.createLinearGradient(0,y,0,y+h);
    grad.addColorStop(0,"rgba(168,85,247,0.85)");
    grad.addColorStop(1,"rgba(34,211,238,0.40)");

    ctx.fillStyle = grad;
    roundRect(ctx, x, y, barW, h, 10); ctx.fill();

    // label
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "700 18px ui-sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(d.val.toString(), x + barW/2, y - 6);

    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.font = "700 16px ui-sans-serif";
    ctx.fillText(d.label, x + barW/2, H - 18);
  });
}

function drawSubjectChart(){
  const c = $("#subjectChart");
  if(!c) return;
  const ctx = c.getContext("2d");
  const W = c.width, H = c.height;
  ctx.clearRect(0,0,W,H);

  const per = new Map();
  state.sessions.filter(s=>s.mode==="study").forEach(s=>{
    const key = s.subjectId || "none";
    per.set(key, (per.get(key)||0) + (s.minutes||0));
  });

  // Only show if there's data
  const hasData = Array.from(per.values()).some(v=>v>0);
  const empty = $("#perSubjectEmpty");
  if(empty) empty.style.display = hasData ? "none" : "flex";
  if(!hasData) return;

  ctx.fillStyle = "rgba(255,255,255,0.04)";
  roundRect(ctx, 0,0,W,H, 18); ctx.fill();

  const entries = Array.from(per.entries())
    .filter(([k,v])=>v>0)
    .map(([k,v])=>({
      name: k==="none" ? "بدون مادة" : (state.subjects.find(s=>s.id===k)?.name || "مادة محذوفة"),
      val: v
    }))
    .sort((a,b)=>b.val-a.val)
    .slice(0, 6);

  const maxV = Math.max(...entries.map(e=>e.val), 10);

  const padX=36, padYTop=30, padYBot=40;
  const chartW=W-padX*2, chartH=H-padYTop-padYBot;

  // horizontal bars
  ctx.textAlign="right";
  entries.forEach((e, i)=>{
    const rowH = chartH/entries.length;
    const y = padYTop + i*rowH + rowH*0.22;
    const h = rowH*0.56;
    const w = (e.val/maxV) * chartW;

    const g = ctx.createLinearGradient(W-padX-w, 0, W-padX, 0);
    g.addColorStop(0,"rgba(34,211,238,0.35)");
    g.addColorStop(1,"rgba(168,85,247,0.85)");

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    roundRect(ctx, padX, y, chartW, h, 12); ctx.fill();

    ctx.fillStyle = g;
    roundRect(ctx, W-padX-w, y, w, h, 12); ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.82)";
    ctx.font = "900 18px ui-sans-serif";
    ctx.fillText(e.name, W-padX, y-6);

    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "900 16px ui-sans-serif";
    ctx.fillText(e.val + " د", W-padX, y+h+18);
  });
}

function roundRect(ctx, x,y,w,h,r){
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr, y);
  ctx.arcTo(x+w, y, x+w, y+h, rr);
  ctx.arcTo(x+w, y+h, x, y+h, rr);
  ctx.arcTo(x, y+h, x, y, rr);
  ctx.arcTo(x, y, x+w, y, rr);
  ctx.closePath();
}

/* ---------- Select builders ---------- */
function buildSubjectSelect(selectEl, allowEmpty){
  selectEl.innerHTML = "";
  if(allowEmpty){
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "غير مرتبط";
    selectEl.appendChild(opt);
  }
  state.subjects.forEach(s=>{
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.name;
    selectEl.appendChild(opt);
  });
}

function renderSubjectSelects(){
  const timerSel = $("#timerSubjectSelect");
  const tasksSel = $("#tasksSubjectSelect");
  const editorSel = $("#editorSubjectSelect");

  if(timerSel){
    buildSubjectSelect(timerSel, true);
    // keep selection if exists
    if(timerSel.value && !state.subjects.find(s=>s.id===timerSel.value)) timerSel.value = "";
  }

  if(tasksSel){
    buildSubjectSelect(tasksSel, false);
    // if no subjects, make empty
    if(state.subjects.length === 0){
      tasksSel.innerHTML = "";
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "لا توجد مواد";
      tasksSel.appendChild(opt);
      tasksSel.disabled = true;
    }else{
      tasksSel.disabled = false;
      if(!tasksSel.value) tasksSel.value = state.subjects[0].id;
    }
  }

  if(editorSel){
    buildSubjectSelect(editorSel, true);
  }

  // home chips
  renderHomeChips();
}

function renderHomeChips(){
  const chips = $("#homeSubjectsChips");
  const empty = $("#homeSubjectsEmpty");
  if(!chips || !empty) return;

  chips.innerHTML = "";
  if(state.subjects.length === 0){
    empty.style.display = "block";
  }else{
    empty.style.display = "none";
    state.subjects.slice(0,6).forEach(s=>{
      const c = document.createElement("div");
      c.className = "chip";
      c.textContent = s.name;
      chips.appendChild(c);
    });
  }
}

/* ---------- Meta ---------- */
function renderMeta(){
  const today = minutesToday();
  const done = state.tasks.filter(t=>t.done).length;

  $("#todayMinutes") && ($("#todayMinutes").textContent = String(today));
  $("#tasksDone") && ($("#tasksDone").textContent = String(done));
  $("#homeToday") && ($("#homeToday").textContent = String(today));

  // streak (very simple: consecutive days with >=1 minute study)
  const daysWith = new Set();
  state.sessions.filter(s=>s.mode==="study").forEach(s=>{
    const d = new Date(s.endedAt);
    d.setHours(0,0,0,0);
    daysWith.add(d.getTime());
  });
  let streak=0;
  const d0 = new Date(); d0.setHours(0,0,0,0);
  let cur = d0.getTime();
  while(daysWith.has(cur)){
    streak++;
    cur -= 86400000;
  }
  $("#homeStreak") && ($("#homeStreak").textContent = String(streak));
}

/* ---------- Export/Import/Reset ---------- */
function exportJSON(){
  const blob = new Blob([JSON.stringify(state,null,2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "serag-data.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast("🗃","تصدير","تم تنزيل ملف JSON");
}

function importJSON(file){
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const next = JSON.parse(reader.result);
      // basic validate
      if(!next || typeof next !== "object") throw new Error("bad");
      state = {
        theme: next.theme === "light" ? "light" : "dark",
        subjects: Array.isArray(next.subjects) ? next.subjects : [],
        notebooks: Array.isArray(next.notebooks) ? next.notebooks : [],
        tasks: Array.isArray(next.tasks) ? next.tasks : [],
        sessions: Array.isArray(next.sessions) ? next.sessions : []
      };
      applyTheme();
      saveState();
      renderAll();
      toast("✅","استيراد","تم استيراد البيانات");
    }catch{
      toast("⚠","خطأ","ملف JSON غير صالح");
    }
  };
  reader.readAsText(file);
}

function resetAll(){
  if(!confirm("متأكد بدك حذف كل البيانات؟")) return;
  localStorage.removeItem(LS_KEY);
  state = loadState(); // fresh
  applyTheme();
  saveState();
  renderAll();
  toast("🗑","تم الحذف","تمت إعادة ضبط كل شيء");
}

/* ---------- Utilities ---------- */
function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }
function map(v, inMin, inMax, outMin, outMax){
  const t = (v - inMin) / (inMax - inMin);
  return outMin + t*(outMax - outMin);
}

/* ---------- Render all ---------- */
function renderAll(){
  renderSubjects();
  renderNotebooks();
  renderTasks();
  renderMeta();
  renderStats();
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  // Apply theme
  applyTheme();

  // Skeleton
  const sk = $("#skeleton");
  sk.classList.add("on");
  setTimeout(()=>{
    sk.classList.remove("on");
  }, 450);

  // Tabs
  $$(".tab-btn").forEach(btn=>{
    btn.addEventListener("click", ()=> setActiveTab(btn.dataset.tab));
  });

  // Home quick nav
  $$("[data-go]").forEach(b=>{
    b.addEventListener("click", ()=> setActiveTab(b.dataset.go));
  });

  // Drawer hooks
  $("#menuBtn")?.addEventListener("click", openDrawer);
  $("#closeDrawer")?.addEventListener("click", closeDrawer);
  $("#overlay")?.addEventListener("click", closeDrawer);
  document.addEventListener("keydown",(e)=>{
    if(e.key==="Escape") closeDrawer();
  });

  // Theme buttons
  $("#themeBtn")?.addEventListener("click", toggleTheme);
  $("#themeBtn2")?.addEventListener("click", toggleTheme);
  $("#themeToggle")?.addEventListener("click", toggleTheme);

  // Subjects actions
  $("#addSubject")?.addEventListener("click", addSubject);
  $("#subjectName")?.addEventListener("keydown",(e)=>{ if(e.key==="Enter") addSubject(); });

  // Notebooks actions
  $("#addNotebook")?.addEventListener("click", addNotebook);
  $("#notebookName")?.addEventListener("keydown",(e)=>{ if(e.key==="Enter") addNotebook(); });

  // Tasks actions
  $("#addTask")?.addEventListener("click", addTask);
  $("#taskText")?.addEventListener("keydown",(e)=>{ if(e.key==="Enter") addTask(); });
  $("#tasksSubjectSelect")?.addEventListener("change", renderTasks);

  // Settings
  $("#exportBtn")?.addEventListener("click", exportJSON);
  $("#importFile")?.addEventListener("change", (e)=>{
    const f = e.target.files?.[0];
    if(f) importJSON(f);
    e.target.value = "";
  });
  $("#resetBtn")?.addEventListener("click", resetAll);

  // Timer
  $$(".seg").forEach(b=>{
    b.addEventListener("click", ()=> setTimerMode(b.dataset.mode));
  });
  $("#startTimer")?.addEventListener("click", startTimer);
  $("#pauseTimer")?.addEventListener("click", pauseTimer);
  $("#resetTimer")?.addEventListener("click", resetTimer);

  initDialDrag();
  setTimerMode("study"); // default

  // Init visuals
  initBackground();
  initTilt();

  // Initial render
  renderAll();
});
