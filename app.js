/***************
 * Tawjihi 2009 Pro (No build tools)
 * Features:
 * - SPA routes: Home/Subjects/Plan/Questions/Stats/Settings
 * - Subjects CRUD + weekly goals + priority
 * - Study sessions tracking (Pomodoro-like + manual sessions)
 * - Task list
 * - Question bank + attempts (correct/total) + weak topics
 * - Charts (Chart.js)
 * - Weekly plan grid
 * - Global search
 * - Theme toggle (dark/light), RTL ready
 * - Export/Import JSON
 * - PWA (service worker)
 ***************/

// ---------- Helpers ----------
const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));
const uid = () => Math.random().toString(36).slice(2, 10);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const fmtH = (mins) => (Math.round((mins/60)*10)/10).toString(); // hours with 1 decimal
const esc = (s) => String(s).replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m]));
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
const weekKey = (d=new Date()) => {
  // ISO-ish week start (Mon). Keep simple: YYYY-Wxx using Thursday trick
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2,"0")}`;
};
const downloadText = (filename, text) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], {type:"application/json"}));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
};

// ---------- Storage ----------
const KEY = "tawjihi09_pro_v1";
const loadState = () => {
  try{
    const raw = localStorage.getItem(KEY);
    if(!raw) return null;
    return JSON.parse(raw);
  }catch{ return null; }
};
const saveState = () => localStorage.setItem(KEY, JSON.stringify(state));

// ---------- Default State ----------
const defaultState = () => ({
  meta: { createdAt: Date.now(), version: "1.0" },
  ui: { theme: "dark" },
  streak: { days: 0, lastDone: "" },
  subjects: [
    { id: uid(), name: "رياضيات", priority: "hi", weeklyGoalMins: 600 },
    { id: uid(), name: "عربي", priority: "med", weeklyGoalMins: 360 },
    { id: uid(), name: "إنجليزي", priority: "med", weeklyGoalMins: 360 },
  ],
  tasks: {
    date: todayKey(),
    items: [
      { id: uid(), text: "حل 30 سؤال", done: false },
      { id: uid(), text: "مراجعة درس", done: false },
    ]
  },
  sessions: [], // {id, subjectId, start, end, mins}
  plan: {
    week: weekKey(),
    // grid[dayIndex 0..6][slot 0..3] = subjectId or ""
    grid: Array.from({length:7}, () => Array.from({length:4}, () => "")),
    slots: ["صباح", "ظهر", "عصر", "ليل"]
  },
  questions: {
    // subjectId -> array of questions
    // question: {id, topic, q, a, tags[], createdAt}
    bank: {}
  },
  attempts: [
    // {id, subjectId, topic, correct, total, date}
  ]
});

let state = loadState() || defaultState();

// Daily tasks reset (keeps history-free as "Tasks of the day")
if(state.tasks?.date !== todayKey()){
  state.tasks = { date: todayKey(), items: [] };
  saveState();
}

// ---------- Theme ----------
function applyTheme(){
  document.documentElement.dataset.theme = state.ui.theme === "light" ? "light" : "dark";
}
applyTheme();

// ---------- Service worker ----------
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("./sw.js").catch(()=>{});
}

// ---------- UI refs ----------
const routes = {
  "/": $("#routeHome"),
  "/subjects": $("#routeSubjects"),
  "/plan": $("#routePlan"),
  "/questions": $("#routeQuestions"),
  "/stats": $("#routeStats"),
  "/settings": $("#routeSettings")
};
const navItems = $$(".navItem");
const modal = $("#modal");
const modalTitle = $("#modalTitle");
const modalBody = $("#modalBody");
const modalClose = $("#modalClose");

function openModal(title, html){
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  modal.classList.remove("hidden");
}
function closeModal(){
  modal.classList.add("hidden");
  modalBody.innerHTML = "";
}
modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e)=>{ if(e.target === modal) closeModal(); });

// ---------- Sidebar KPIs ----------
function calcWeekMinutes(){
  const wk = weekKey();
  const startOfWeek = (key) => {
    // get Monday UTC-ish from key
    const [y, w] = key.split("-W");
    const year = Number(y), week = Number(w);
    const simple = new Date(Date.UTC(year,0,1 + (week-1)*7));
    const dow = simple.getUTCDay();
    const ISOweekStart = simple;
    if(dow <= 4) ISOweekStart.setUTCDate(simple.getUTCDate() - simple.getUTCDay() + 1);
    else ISOweekStart.setUTCDate(simple.getUTCDate() + 8 - simple.getUTCDay());
    return ISOweekStart;
  };
  const start = startOfWeek(wk).getTime();
  const end = start + 7*86400000;
  const mins = state.sessions
    .filter(s => s.end && s.start >= start && s.start < end)
    .reduce((a,s)=>a + (s.mins||0), 0);
  return mins;
}
function renderKPIs(){
  $("#streakDays").textContent = state.streak.days || 0;
  $("#weekHours").textContent = fmtH(calcWeekMinutes());
}
renderKPIs();

// ---------- Router ----------
function setActiveRoute(path){
  Object.values(routes).forEach(r => r.classList.add("hidden"));
  (routes[path] || routes["/"]).classList.remove("hidden");
  navItems.forEach(a => a.classList.toggle("active", a.dataset.route === path));
}
function route(){
  const hash = location.hash.replace("#","") || "/";
  setActiveRoute(hash);
  renderAll();
}
window.addEventListener("hashchange", route);

// ---------- Global Search ----------
const searchInput = $("#globalSearch");
const searchResults = $("#searchResults");

function buildSearchIndex(){
  const items = [];

  // subjects
  state.subjects.forEach(s => items.push({
    type:"مادة", title:s.name, sub:`أولوية: ${s.priority} • هدف أسبوعي: ${Math.round(s.weeklyGoalMins/60)}س`,
    action: () => { location.hash = "#/subjects"; highlightSubject(s.id); }
  }));

  // questions
  for(const [subjectId, arr] of Object.entries(state.questions.bank || {})){
    const subj = state.subjects.find(x => x.id === subjectId);
    arr.forEach(q => items.push({
      type:"سؤال", title:q.q, sub:`${subj?.name || "مادة"} • ${q.topic || "بدون درس"}`,
      action: () => { location.hash = "#/questions"; setTimeout(()=>scrollToQuestion(q.id), 60); }
    }));
  }

  // attempts topics
  state.attempts.forEach(a => {
    const subj = state.subjects.find(x => x.id === a.subjectId);
    items.push({
      type:"نتيجة", title:`${subj?.name || "مادة"} • ${a.topic}`,
      sub:`${a.correct}/${a.total} بتاريخ ${a.date}`,
      action: () => { location.hash = "#/stats"; }
    });
  });

  return items;
}

let searchIndex = buildSearchIndex();

function renderSearchResults(list){
  if(!list.length){
    searchResults.innerHTML = `<div class="item muted">لا نتائج</div>`;
    searchResults.classList.remove("hidden");
    return;
  }
  searchResults.innerHTML = list.slice(0,12).map((it,i)=>`
    <div class="item" data-i="${i}">
      <div><span class="pill">${it.type}</span> <strong>${esc(it.title)}</strong></div>
      <div class="muted tiny">${esc(it.sub || "")}</div>
    </div>
  `).join("");
  searchResults.classList.remove("hidden");
  $$(".item", searchResults).forEach(el=>{
    el.addEventListener("click", ()=>{
      const it = list[Number(el.dataset.i)];
      searchResults.classList.add("hidden");
      it.action?.();
    });
  });
}

searchInput.addEventListener("input", ()=>{
  const q = searchInput.value.trim().toLowerCase();
  if(!q){ searchResults.classList.add("hidden"); return; }
  searchIndex = buildSearchIndex();
  const res = searchIndex.filter(it =>
    (it.title || "").toLowerCase().includes(q) || (it.sub || "").toLowerCase().includes(q)
  );
  renderSearchResults(res);
});
document.addEventListener("click", (e)=>{
  if(!e.target.closest(".search")) searchResults.classList.add("hidden");
});

// ---------- Quick Add Task ----------
$("#quickAdd").addEventListener("click", ()=>{
  openModal("إضافة مهمة سريعة", `
    <label>المهمة</label>
    <input class="input" id="qaText" placeholder="مثال: حل نموذج رياضيات" maxlength="80" />
    <div class="row gap" style="margin-top:10px">
      <button class="btn primary" id="qaSave">حفظ</button>
      <button class="btn" id="qaCancel">إلغاء</button>
    </div>
  `);
  $("#qaCancel").addEventListener("click", closeModal);
  $("#qaSave").addEventListener("click", ()=>{
    const t = $("#qaText").value.trim();
    if(!t) return;
    state.tasks.items.unshift({ id: uid(), text: t, done:false });
    saveState();
    closeModal();
    renderHome(); // refresh
  });
});

// ---------- Finish Day (streak) ----------
$("#finishDay").addEventListener("click", ()=>{
  const today = todayKey();
  if(state.streak.lastDone === today){
    alert("أنت مُسجّل اليوم بالفعل ✅");
    return;
  }
  const last = state.streak.lastDone;
  let nextDay = false;
  if(last){
    const diff = Math.round((new Date(today) - new Date(last)) / 86400000);
    nextDay = diff === 1;
  }
  state.streak.days = nextDay ? (state.streak.days + 1) : 1;
  state.streak.lastDone = today;
  saveState();
  renderKPIs();
  alert(`ممتاز! ستريكك صار ${state.streak.days} يوم ⭐`);
});

// ---------- Theme Toggle ----------
$("#themeToggle").addEventListener("click", ()=>{
  state.ui.theme = (state.ui.theme === "light") ? "dark" : "light";
  saveState();
  applyTheme();
});

// ---------- Home (Dashboard) ----------
let pomodoroTimer = null;
let pomodoroRemaining = 25*60;
let pomodoroMode = "focus";
const DUR = { focus: 25*60, short: 5*60, long: 15*60 };

function renderHome(){
  const el = routes["/"];
  const done = state.tasks.items.filter(t=>t.done).length;
  const total = state.tasks.items.length;
  const pct = total ? Math.round((done/total)*100) : 0;

  el.innerHTML = `
    <div class="grid3">
      <div class="card span4">
        <h2>⏱️ مؤقت المذاكرة</h2>
        <div class="row between">
          <div class="pill">الوضع: <strong>${pomodoroMode === "focus" ? "تركيز" : (pomodoroMode==="short"?"راحة":"راحة طويلة")}</strong></div>
          <div class="pill">جلسات الأسبوع: <strong>${state.sessions.length}</strong></div>
        </div>
        <div style="font-size:44px; text-align:center; padding:14px; margin:10px 0;
          border:1px solid rgba(38,49,89,.55); border-radius:14px; background: rgba(6,10,25,.18);" id="pomoTime">${fmt(pomodoroRemaining)}</div>

        <label>المادة</label>
        <select id="pomoSubject">
          ${state.subjects.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join("")}
        </select>

        <div class="row gap" style="margin-top:10px; flex-wrap:wrap">
          <button class="btn primary" id="pomoStart">${pomodoroTimer ? "إيقاف" : "ابدأ"}</button>
          <button class="btn" id="pomoReset">إعادة</button>
          <button class="btn" id="pomoFocus">تركيز 25</button>
          <button class="btn" id="pomoShort">راحة 5</button>
          <button class="btn" id="pomoLong">راحة 15</button>
        </div>
        <p class="muted tiny" style="margin:10px 0 0">عند انتهاء التركيز يتم تسجيل جلسة تلقائيًا.</p>
      </div>

      <div class="card span4">
        <h2>✅ مهام اليوم</h2>
        <div class="row gap">
          <input class="input" id="taskInput" placeholder="مثال: مراجعة وحدة" maxlength="80" />
          <button class="btn primary" id="taskAdd">إضافة</button>
        </div>

        <div style="margin-top:10px; display:grid; gap:8px" id="taskList"></div>

        <div style="margin-top:10px">
          <div class="row between">
            <span class="pill">منجز: <strong>${done}</strong></span>
            <span class="pill">المجموع: <strong>${total}</strong></span>
            <span class="pill">النسبة: <strong>${pct}%</strong></span>
          </div>
          <div class="progress" style="margin-top:10px"><div style="width:${pct}%"></div></div>
        </div>
      </div>

      <div class="card span4">
        <h2>🎯 أهداف الأسبوع</h2>
        <table class="table">
          <thead><tr><th>المادة</th><th>الهدف</th><th>المُنجز</th></tr></thead>
          <tbody>
            ${state.subjects.map(s=>{
              const weekMins = calcSubjectWeekMins(s.id);
              const pct = s.weeklyGoalMins ? Math.round((weekMins/s.weeklyGoalMins)*100) : 0;
              return `<tr>
                <td>${esc(s.name)}</td>
                <td>${Math.round(s.weeklyGoalMins/60)}س</td>
                <td>${fmtH(weekMins)}س <span class="muted tiny">(${clamp(pct,0,999)}%)</span></td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
        <p class="muted tiny" style="margin:10px 0 0">تتحدث تلقائيًا من جلسات الدراسة.</p>
      </div>

      <div class="card span8">
        <h2>📌 آخر الجلسات</h2>
        ${renderRecentSessions()}
      </div>

      <div class="card span4">
        <h2>⚡ نقاط ضعف سريعة</h2>
        ${renderWeakTopics()}
      </div>
    </div>
  `;

  // tasks render
  const list = $("#taskList", el);
  list.innerHTML = state.tasks.items.map(t=>`
    <div class="row between" style="padding:10px 12px; border:1px solid rgba(38,49,89,.35); border-radius:14px; background: rgba(6,10,25,.12);">
      <label class="row gap" style="margin:0; cursor:pointer">
        <input type="checkbox" ${t.done?"checked":""} data-id="${t.id}" />
        <span style="${t.done?"text-decoration:line-through; opacity:.75":""}">${esc(t.text)}</span>
      </label>
      <button class="btn" data-del="${t.id}">✕</button>
    </div>
  `).join("");

  $$("input[type=checkbox]", list).forEach(ch=>{
    ch.addEventListener("change", ()=>{
      const id = ch.dataset.id;
      const item = state.tasks.items.find(x=>x.id===id);
      item.done = ch.checked;
      saveState();
      renderHome();
    });
  });
  $$("button[data-del]", list).forEach(btn=>{
    btn.addEventListener("click", ()=>{
      state.tasks.items = state.tasks.items.filter(x=>x.id !== btn.dataset.del);
      saveState();
      renderHome();
    });
  });

  $("#taskAdd", el).addEventListener("click", ()=>{
    const input = $("#taskInput", el);
    const t = input.value.trim();
    if(!t) return;
    state.tasks.items.unshift({id:uid(), text:t, done:false});
    input.value="";
    saveState();
    renderHome();
  });

  // pomodoro handlers
  $("#pomoStart", el).addEventListener("click", ()=> pomodoroTimer ? stopPomo(el) : startPomo(el));
  $("#pomoReset", el).addEventListener("click", ()=> { stopPomo(el); setPomoMode(pomodoroMode, el); });
  $("#pomoFocus", el).addEventListener("click", ()=> { stopPomo(el); setPomoMode("focus", el); });
  $("#pomoShort", el).addEventListener("click", ()=> { stopPomo(el); setPomoMode("short", el); });
  $("#pomoLong", el).addEventListener("click", ()=> { stopPomo(el); setPomoMode("long", el); });

  renderKPIs();
}

function fmt(sec){
  const m = Math.floor(sec/60);
  const s = sec%60;
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}
function setPomoMode(m, el){
  pomodoroMode = m;
  pomodoroRemaining = DUR[m];
  $("#pomoTime", el).textContent = fmt(pomodoroRemaining);
}
function startPomo(el){
  const subjId = $("#pomoSubject", el).value || state.subjects[0]?.id;
  const focusStart = Date.now();
  pomodoroTimer = setInterval(()=>{
    pomodoroRemaining--;
    $("#pomoTime", el).textContent = fmt(pomodoroRemaining);
    if(pomodoroRemaining <= 0){
      stopPomo(el);
      // إذا تركيز => سجّل جلسة
      if(pomodoroMode === "focus"){
        const end = Date.now();
        const mins = 25;
        state.sessions.unshift({ id: uid(), subjectId: subjId, start: focusStart, end, mins });
        saveState();
      }
      alert(pomodoroMode === "focus" ? "خلص التركيز ✅" : "خلصت الراحة 💪");
      setPomoMode(pomodoroMode === "focus" ? "short" : "focus", el);
      renderKPIs();
      renderHome();
    }
  }, 1000);
  $("#pomoStart", el).textContent = "إيقاف";
}
function stopPomo(el){
  clearInterval(pomodoroTimer);
  pomodoroTimer = null;
  const btn = $("#pomoStart", el);
  if(btn) btn.textContent = "ابدأ";
}

function calcSubjectWeekMins(subjectId){
  const wk = weekKey();
  // reuse week window from calcWeekMinutes but for subject
  const d = new Date();
  const key = wk;
  const [y, w] = key.split("-W");
  const year = Number(y), week = Number(w);
  const simple = new Date(Date.UTC(year,0,1 + (week-1)*7));
  const dow = simple.getUTCDay();
  const ISOweekStart = simple;
  if(dow <= 4) ISOweekStart.setUTCDate(simple.getUTCDate() - simple.getUTCDay() + 1);
  else ISOweekStart.setUTCDate(simple.getUTCDate() + 8 - simple.getUTCDay());
  const start = ISOweekStart.getTime();
  const end = start + 7*86400000;

  return state.sessions
    .filter(s => s.subjectId === subjectId && s.end && s.start >= start && s.start < end)
    .reduce((a,s)=>a + (s.mins||0), 0);
}

function renderRecentSessions(){
  if(!state.sessions.length) return `<p class="muted">لا يوجد جلسات بعد.</p>`;
  const rows = state.sessions.slice(0,8).map(s=>{
    const subj = state.subjects.find(x=>x.id===s.subjectId);
    const d = new Date(s.start);
    const when = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
    return `<tr>
      <td>${esc(subj?.name || "—")}</td>
      <td>${when}</td>
      <td>${s.mins} دقيقة</td>
    </tr>`;
  }).join("");
  return `
    <table class="table">
      <thead><tr><th>المادة</th><th>الوقت</th><th>المدة</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}
function weakTopics(){
  // aggregate attempts by subject+topic, sort by lowest accuracy, enough samples
  const agg = new Map();
  for(const a of state.attempts){
    const k = `${a.subjectId}||${a.topic}`;
    const cur = agg.get(k) || {subjectId:a.subjectId, topic:a.topic, correct:0, total:0};
    cur.correct += a.correct;
    cur.total += a.total;
    agg.set(k, cur);
  }
  const list = Array.from(agg.values())
    .filter(x => x.total >= 10)
    .map(x => ({...x, acc: x.total ? (x.correct/x.total) : 0}))
    .sort((a,b)=>a.acc-b.acc)
    .slice(0,6);
  return list;
}
function renderWeakTopics(){
  const list = weakTopics();
  if(!list.length) return `<p class="muted">أضف نتائج من “بنك الأسئلة” حتى تظهر نقاط الضعف.</p>`;
  return `
    <div style="display:grid; gap:8px">
      ${list.map(x=>{
        const subj = state.subjects.find(s=>s.id===x.subjectId);
        const pct = Math.round(x.acc*100);
        return `<div style="padding:10px 12px; border:1px solid rgba(38,49,89,.35); border-radius:14px; background: rgba(6,10,25,.12);">
          <div class="row between">
            <strong>${esc(subj?.name || "")} • ${esc(x.topic)}</strong>
            <span class="pill">${pct}%</span>
          </div>
          <div class="muted tiny">${x.correct}/${x.total}</div>
        </div>`;
      }).join("")}
    </div>
  `;
}

// ---------- Subjects ----------
let subjectHighlight = "";
function highlightSubject(id){ subjectHighlight = id; }

function renderSubjects(){
  const el = routes["/subjects"];
  el.innerHTML = `
    <div class="grid3">
      <div class="card span4">
        <h2>➕ إضافة/تعديل مادة</h2>
        <label>اسم المادة</label>
        <input class="input" id="subName" placeholder="مثال: فيزياء" />
        <label>الأولوية</label>
        <select id="subPriority">
          <option value="hi">عالية</option>
          <option value="med" selected>متوسطة</option>
          <option value="low">منخفضة</option>
        </select>
        <label>الهدف الأسبوعي (بالدقائق)</label>
        <input class="input" id="subGoal" type="number" min="0" step="30" value="360" />
        <div class="row gap" style="margin-top:10px; flex-wrap:wrap">
          <button class="btn primary" id="subAdd">حفظ</button>
          <button class="btn" id="subReset">مسح الحقول</button>
        </div>
        <p class="muted tiny" style="margin:10px 0 0">ملاحظة: الجلسات تتسجل من الرئيسية، أو تقدر تضيف جلسة من هنا.</p>
      </div>

      <div class="card span8">
        <h2>📚 المواد</h2>
        <table class="table">
          <thead><tr><th>المادة</th><th>الأولوية</th><th>الهدف</th><th>منجز هذا الأسبوع</th><th>إجراءات</th></tr></thead>
          <tbody>
            ${state.subjects.map(s=>{
              const weekMins = calcSubjectWeekMins(s.id);
              const pct = s.weeklyGoalMins ? Math.round((weekMins/s.weeklyGoalMins)*100) : 0;
              const badge = s.priority === "hi" ? "hi" : (s.priority==="med" ? "med" : "low");
              const badgeText = s.priority === "hi" ? "عالية" : (s.priority==="med" ? "متوسطة" : "منخفضة");
              const hl = (subjectHighlight === s.id) ? `style="outline:3px solid rgba(124,92,255,.25)"` : "";
              return `<tr ${hl}>
                <td><strong>${esc(s.name)}</strong></td>
                <td><span class="badge ${badge}">${badgeText}</span></td>
                <td>${Math.round(s.weeklyGoalMins/60)}س</td>
                <td>${fmtH(weekMins)}س <span class="muted tiny">(${pct}%)</span></td>
                <td class="row gap" style="justify-content:flex-start; flex-wrap:wrap">
                  <button class="btn" data-edit="${s.id}">تعديل</button>
                  <button class="btn" data-session="${s.id}">+ جلسة</button>
                  <button class="btn danger" data-del="${s.id}">حذف</button>
                </td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  subjectHighlight = "";

  $("#subReset", el).addEventListener("click", ()=>{
    $("#subName", el).value = "";
    $("#subPriority", el).value = "med";
    $("#subGoal", el).value = 360;
  });

  $("#subAdd", el).addEventListener("click", ()=>{
    const name = $("#subName", el).value.trim();
    const priority = $("#subPriority", el).value;
    const goal = Number($("#subGoal", el).value || 0);
    if(!name) return alert("اكتب اسم المادة");
    state.subjects.unshift({ id: uid(), name, priority, weeklyGoalMins: Math.max(0, goal) });
    saveState();
    renderSubjects();
    searchIndex = buildSearchIndex();
  });

  $$("button[data-del]", el).forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.dataset.del;
      if(!confirm("حذف المادة؟")) return;
      state.subjects = state.subjects.filter(s=>s.id !== id);
      // remove questions & attempts & plan references
      delete state.questions.bank[id];
      state.attempts = state.attempts.filter(a=>a.subjectId !== id);
      state.sessions = state.sessions.filter(s=>s.subjectId !== id);
      state.plan.grid = state.plan.grid.map(day => day.map(slot => slot === id ? "" : slot));
      saveState();
      renderSubjects();
      renderKPIs();
      searchIndex = buildSearchIndex();
    });
  });

  $$("button[data-edit]", el).forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.dataset.edit;
      const s = state.subjects.find(x=>x.id===id);
      openModal("تعديل مادة", `
        <label>اسم المادة</label>
        <input class="input" id="eName" value="${esc(s.name)}" />
        <label>الأولوية</label>
        <select id="ePri">
          <option value="hi" ${s.priority==="hi"?"selected":""}>عالية</option>
          <option value="med" ${s.priority==="med"?"selected":""}>متوسطة</option>
          <option value="low" ${s.priority==="low"?"selected":""}>منخفضة</option>
        </select>
        <label>الهدف الأسبوعي (بالدقائق)</label>
        <input class="input" id="eGoal" type="number" min="0" step="30" value="${s.weeklyGoalMins}" />
        <div class="row gap" style="margin-top:10px">
          <button class="btn primary" id="eSave">حفظ</button>
          <button class="btn" id="eCancel">إلغاء</button>
        </div>
      `);
      $("#eCancel").addEventListener("click", closeModal);
      $("#eSave").addEventListener("click", ()=>{
        s.name = $("#eName").value.trim() || s.name;
        s.priority = $("#ePri").value;
        s.weeklyGoalMins = Math.max(0, Number($("#eGoal").value || 0));
        saveState();
        closeModal();
        renderSubjects();
        renderHome();
        searchIndex = buildSearchIndex();
      });
    });
  });

  $$("button[data-session]", el).forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const subjectId = btn.dataset.session;
      openModal("إضافة جلسة يدويًا", `
        <label>المدة (بالدقائق)</label>
        <input class="input" id="sMins" type="number" min="1" step="5" value="30" />
        <label>التاريخ</label>
        <input class="input" id="sDate" type="date" value="${todayKey()}" />
        <div class="row gap" style="margin-top:10px">
          <button class="btn primary" id="sSave">حفظ</button>
          <button class="btn" id="sCancel">إلغاء</button>
        </div>
      `);
      $("#sCancel").addEventListener("click", closeModal);
      $("#sSave").addEventListener("click", ()=>{
        const mins = Math.max(1, Number($("#sMins").value || 30));
        const date = $("#sDate").value || todayKey();
        const start = new Date(date + "T12:00:00").getTime();
        const end = start + mins*60000;
        state.sessions.unshift({ id: uid(), subjectId, start, end, mins });
        saveState();
        closeModal();
        renderSubjects();
        renderHome();
        renderKPIs();
      });
    });
  });
}

// ---------- Plan (Weekly grid) ----------
const days = ["الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت","الأحد"];

function renderPlan(){
  const el = routes["/plan"];
  // ensure week matches current
  if(state.plan.week !== weekKey()){
    state.plan.week = weekKey();
    state.plan.grid = Array.from({length:7}, () => Array.from({length:4}, () => ""));
    saveState();
  }

  const subjectOptions = `<option value="">—</option>` + state.subjects.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join("");

  el.innerHTML = `
    <div class="grid3">
      <div class="card span12">
        <h2>🗓️ خطة الأسبوع (${state.plan.week})</h2>
        <p class="muted tiny">اختر مادة لكل خانة. الهدف: “شو أدرس اليوم” يكون واضح.</p>
        <div style="overflow:auto">
          <table class="table">
            <thead>
              <tr>
                <th>اليوم</th>
                ${state.plan.slots.map(s=>`<th>${s}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${state.plan.grid.map((row, di)=>`
                <tr>
                  <td><strong>${days[di]}</strong></td>
                  ${row.map((cell, si)=>`
                    <td>
                      <select data-di="${di}" data-si="${si}">
                        ${subjectOptions.replace(`value="${cell}"`, `value="${cell}" selected`)}
                      </select>
                    </td>
                  `).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <hr class="sep" />

        <h2>📌 شو عليّ اليوم؟</h2>
        <div id="todayPlan"></div>
      </div>
    </div>
  `;

  $$("select[data-di]", el).forEach(sel=>{
    sel.addEventListener("change", ()=>{
      const di = Number(sel.dataset.di);
      const si = Number(sel.dataset.si);
      state.plan.grid[di][si] = sel.value;
      saveState();
      renderPlanToday(el);
    });
  });

  renderPlanToday(el);
}

function renderPlanToday(el){
  // map today -> index (Mon=0..Sun=6)
  const jsDay = new Date().getDay(); // Sun=0
  const idx = (jsDay === 0) ? 6 : (jsDay - 1);
  const slots = state.plan.grid[idx];
  const html = slots.map((sid, i)=>{
    const subj = state.subjects.find(s=>s.id===sid);
    return `<div style="padding:10px 12px; border:1px solid rgba(38,49,89,.35); border-radius:14px; background: rgba(6,10,25,.12); margin:8px 0">
      <div class="row between">
        <strong>${state.plan.slots[i]}</strong>
        <span class="pill">${esc(subj?.name || "—")}</span>
      </div>
    </div>`;
  }).join("");
  $("#todayPlan", el).innerHTML = html || `<p class="muted">لا شيء محدد لليوم.</p>`;
}

// ---------- Questions Bank ----------
function ensureBank(subjectId){
  state.questions.bank ||= {};
  state.questions.bank[subjectId] ||= [];
}

function renderQuestions(){
  const el = routes["/questions"];
  const subjId = state.subjects[0]?.id || "";
  if(subjId) ensureBank(subjId);

  el.innerHTML = `
    <div class="grid3">
      <div class="card span4">
        <h2>➕ إضافة سؤال</h2>
        <label>المادة</label>
        <select id="qSubject">
          ${state.subjects.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join("")}
        </select>
        <label>الدرس/الموضوع</label>
        <input class="input" id="qTopic" placeholder="مثال: اشتقاق" />
        <label>السؤال</label>
        <input class="input" id="qText" placeholder="اكتب السؤال هنا" maxlength="160" />
        <label>الإجابة المختصرة (اختياري)</label>
        <input class="input" id="qAnswer" placeholder="مثال: x=2" maxlength="120" />
        <div class="row gap" style="margin-top:10px; flex-wrap:wrap">
          <button class="btn primary" id="qAdd">حفظ</button>
          <button class="btn" id="qGen">اقتراح سريع</button>
        </div>
        <p class="muted tiny" style="margin:10px 0 0">“اقتراح سريع” يضيف قالب سؤال لتعبئته بسرعة.</p>

        <hr class="sep" />

        <h2>🧾 تسجيل نتيجة</h2>
        <label>المادة</label>
        <select id="aSubject">
          ${state.subjects.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join("")}
        </select>
        <label>الدرس/الموضوع</label>
        <input class="input" id="aTopic" placeholder="مثال: قوانين نيوتن" />
        <div class="row gap">
          <div style="flex:1">
            <label>صح</label>
            <input class="input" id="aCorrect" type="number" min="0" value="10" />
          </div>
          <div style="flex:1">
            <label>المجموع</label>
            <input class="input" id="aTotal" type="number" min="1" value="20" />
          </div>
        </div>
        <label>التاريخ</label>
        <input class="input" id="aDate" type="date" value="${todayKey()}" />
        <div class="row gap" style="margin-top:10px">
          <button class="btn primary" id="aSave">حفظ النتيجة</button>
        </div>
      </div>

      <div class="card span8">
        <h2>🧠 بنك الأسئلة</h2>
        <div class="row gap" style="flex-wrap:wrap">
          <select id="bankSubject">
            ${state.subjects.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join("")}
          </select>
          <input class="input" id="bankFilter" placeholder="فلتر حسب الدرس/كلمة..." style="max-width: 340px" />
          <button class="btn" id="bankExport">تصدير أسئلة المادة</button>
        </div>

        <div id="bankList" style="margin-top:10px; display:grid; gap:8px"></div>
      </div>
    </div>
  `;

  // add question
  $("#qAdd", el).addEventListener("click", ()=>{
    const subjectId = $("#qSubject", el).value;
    const topic = $("#qTopic", el).value.trim();
    const q = $("#qText", el).value.trim();
    const a = $("#qAnswer", el).value.trim();
    if(!subjectId) return alert("اختر مادة");
    if(!q) return alert("اكتب السؤال");
    ensureBank(subjectId);
    state.questions.bank[subjectId].unshift({ id: uid(), topic, q, a, tags: [], createdAt: Date.now() });
    saveState();
    $("#qText", el).value = "";
    $("#qAnswer", el).value = "";
    renderBankList(el);
    searchIndex = buildSearchIndex();
  });

  $("#qGen", el).addEventListener("click", ()=>{
    $("#qTopic", el).value = $("#qTopic", el).value || "موضوع";
    $("#qText", el).value = $("#qText", el).value || "اكتب سؤال من كتابك هنا…";
    $("#qAnswer", el).value = $("#qAnswer", el).value || "اكتب الإجابة المختصرة…";
  });

  // save attempt
  $("#aSave", el).addEventListener("click", ()=>{
    const subjectId = $("#aSubject", el).value;
    const topic = $("#aTopic", el).value.trim() || "بدون موضوع";
    const correct = Number($("#aCorrect", el).value || 0);
    const total = Math.max(1, Number($("#aTotal", el).value || 1));
    const date = $("#aDate", el).value || todayKey();
    state.attempts.unshift({ id: uid(), subjectId, topic, correct: clamp(correct,0,total), total, date });
    saveState();
    renderHome();
    renderKPIs();
    alert("تم حفظ النتيجة ✅");
    searchIndex = buildSearchIndex();
  });

  // bank interactions
  $("#bankSubject", el).addEventListener("change", ()=> renderBankList(el));
  $("#bankFilter", el).addEventListener("input", ()=> renderBankList(el));
  $("#bankExport", el).addEventListener("click", ()=>{
    const sid = $("#bankSubject", el).value;
    ensureBank(sid);
    const subj = state.subjects.find(s=>s.id===sid);
    downloadText(`questions-${(subj?.name||"subject")}.json`, JSON.stringify(state.questions.bank[sid], null, 2));
  });

  renderBankList(el);
}

function renderBankList(el){
  const sid = $("#bankSubject", el).value;
  ensureBank(sid);
  const filter = ($("#bankFilter", el).value || "").trim().toLowerCase();
  const arr = state.questions.bank[sid] || [];
  const list = arr.filter(q=>{
    if(!filter) return true;
    return (q.q||"").toLowerCase().includes(filter) || (q.topic||"").toLowerCase().includes(filter);
  });

  const container = $("#bankList", el);
  if(!list.length){
    container.innerHTML = `<p class="muted">لا أسئلة بعد… أضف أول سؤال.</p>`;
    return;
  }
  container.innerHTML = list.map(q=>`
    <div class="qItem" id="q-${q.id}" style="padding:10px 12px; border:1px solid rgba(38,49,89,.35); border-radius:14px; background: rgba(6,10,25,.12);">
      <div class="row between" style="gap:10px; flex-wrap:wrap">
        <div>
          <div class="pill">درس: <strong>${esc(q.topic || "—")}</strong></div>
          <div style="margin-top:8px"><strong>${esc(q.q)}</strong></div>
          ${q.a ? `<div class="muted tiny" style="margin-top:6px">الإجابة: ${esc(q.a)}</div>` : ``}
        </div>
        <div class="row gap" style="justify-content:flex-start; flex-wrap:wrap">
          <button class="btn" data-editq="${q.id}">تعديل</button>
          <button class="btn danger" data-delq="${q.id}">حذف</button>
        </div>
      </div>
    </div>
  `).join("");

  $$("button[data-delq]", container).forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.dataset.delq;
      if(!confirm("حذف السؤال؟")) return;
      state.questions.bank[sid] = state.questions.bank[sid].filter(x=>x.id !== id);
      saveState();
      renderBankList(el);
      searchIndex = buildSearchIndex();
    });
  });

  $$("button[data-editq]", container).forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.dataset.editq;
      const q = state.questions.bank[sid].find(x=>x.id===id);
      openModal("تعديل سؤال", `
        <label>الدرس/الموضوع</label>
        <input class="input" id="eqTopic" value="${esc(q.topic||"")}" />
        <label>السؤال</label>
        <input class="input" id="eqText" value="${esc(q.q||"")}" />
        <label>الإجابة</label>
        <input class="input" id="eqAns" value="${esc(q.a||"")}" />
        <div class="row gap" style="margin-top:10px">
          <button class="btn primary" id="eqSave">حفظ</button>
          <button class="btn" id="eqCancel">إلغاء</button>
        </div>
      `);
      $("#eqCancel").addEventListener("click", closeModal);
      $("#eqSave").addEventListener("click", ()=>{
        q.topic = $("#eqTopic").value.trim();
        q.q = $("#eqText").value.trim();
        q.a = $("#eqAns").value.trim();
        saveState();
        closeModal();
        renderBankList(el);
        searchIndex = buildSearchIndex();
      });
    });
  });
}

function scrollToQuestion(id){
  const el = document.getElementById(`q-${id}`);
  if(el) el.scrollIntoView({behavior:"smooth", block:"center"});
}

// ---------- Stats (Charts) ----------
let chart1=null, chart2=null;

function renderStats(){
  const el = routes["/stats"];

  el.innerHTML = `
    <div class="grid3">
      <div class="card span6">
        <h2>📈 ساعات الدراسة هذا الأسبوع (بالدقائق حسب المادة)</h2>
        <canvas id="chartSubjects"></canvas>
      </div>
      <div class="card span6">
        <h2>✅ أداء بنك الأسئلة (آخر 14 يوم)</h2>
        <canvas id="chartAccuracy"></canvas>
      </div>

      <div class="card span12">
        <h2>📋 آخر النتائج</h2>
        ${renderAttemptsTable()}
      </div>
    </div>
  `;

  // build charts
  const labels = state.subjects.map(s=>s.name);
  const dataMins = state.subjects.map(s=>calcSubjectWeekMins(s.id));

  // destroy if exists
  if(chart1) chart1.destroy();
  if(chart2) chart2.destroy();

  chart1 = new Chart($("#chartSubjects", el), {
    type: "bar",
    data: { labels, datasets: [{ label: "دقائق", data: dataMins }] },
    options: {
      responsive:true,
      plugins:{ legend:{ display:false } },
      scales:{ y:{ beginAtZero:true } }
    }
  });

  const lastDays = 14;
  const series = buildAccuracySeries(lastDays);
  chart2 = new Chart($("#chartAccuracy", el), {
    type: "line",
    data: { labels: series.labels, datasets: [{ label: "الدقة %", data: series.values }] },
    options: {
      responsive:true,
      scales:{ y:{ beginAtZero:true, max:100 } }
    }
  });
}

function renderAttemptsTable(){
  if(!state.attempts.length) return `<p class="muted">لا نتائج بعد.</p>`;
  const rows = state.attempts.slice(0,20).map(a=>{
    const subj = state.subjects.find(s=>s.id===a.subjectId);
    const pct = Math.round((a.correct/a.total)*100);
    return `<tr>
      <td>${esc(a.date)}</td>
      <td>${esc(subj?.name || "")}</td>
      <td>${esc(a.topic)}</td>
      <td>${a.correct}/${a.total}</td>
      <td>${pct}%</td>
    </tr>`;
  }).join("");
  return `
    <table class="table">
      <thead><tr><th>التاريخ</th><th>المادة</th><th>الموضوع</th><th>النتيجة</th><th>الدقة</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function buildAccuracySeries(nDays){
  const byDay = new Map(); // date -> {c,t}
  const today = new Date(todayKey());
  for(let i=nDays-1; i>=0; i--){
    const d = new Date(today);
    d.setDate(d.getDate()-i);
    const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    byDay.set(k, {c:0, t:0});
  }
  for(const a of state.attempts){
    if(byDay.has(a.date)){
      const cur = byDay.get(a.date);
      cur.c += a.correct;
      cur.t += a.total;
    }
  }
  const labels = Array.from(byDay.keys());
  const values = labels.map(k=>{
    const {c,t} = byDay.get(k);
    return t ? Math.round((c/t)*100) : 0;
  });
  return { labels, values };
}

// ---------- Settings ----------
function renderSettings(){
  const el = routes["/settings"];
  el.innerHTML = `
    <div class="grid3">
      <div class="card span6">
        <h2>🧰 النسخ الاحتياطي</h2>
        <p class="muted tiny">تصدير/استيراد بياناتك (مواد، خطة، جلسات، أسئلة، نتائج...)</p>
        <div class="row gap" style="flex-wrap:wrap">
          <button class="btn primary" id="exportAll">تصدير الكل</button>
          <label class="btn" style="cursor:pointer">
            استيراد ملف
            <input type="file" id="importFile" accept="application/json" style="display:none" />
          </label>
        </div>
        <hr class="sep" />
        <h2>🧹 صيانة</h2>
        <div class="row gap" style="flex-wrap:wrap">
          <button class="btn danger" id="resetAll">مسح كل البيانات</button>
        </div>
      </div>

      <div class="card span6">
        <h2>🎨 المظهر</h2>
        <p class="muted tiny">تغيير الثيم وحفظه</p>
        <div class="row gap" style="flex-wrap:wrap">
          <button class="btn" id="setDark">ثيم داكن</button>
          <button class="btn" id="setLight">ثيم فاتح</button>
        </div>

        <hr class="sep" />

        <h2>📲 PWA</h2>
        <p class="muted tiny">إذا فتحت الموقع من الموبايل، اختر “إضافة إلى الشاشة الرئيسية”.</p>
        <div class="row gap" style="flex-wrap:wrap">
          <button class="btn" id="swRefresh">تحديث الكاش</button>
        </div>

        <hr class="sep" />

        <h2>ℹ️ ملاحظة حول “المزامنة”</h2>
        <p class="muted tiny">
          هالنسخة تحفظ على جهازك (LocalStorage). للمزامنة بين الأجهزة تحتاج Firebase/Supabase بمفاتيح خاصة.
          إذا بدك، بكتب لك ملف sync جاهز بس تحط المفاتيح.
        </p>
      </div>
    </div>
  `;

  $("#exportAll", el).addEventListener("click", ()=>{
    downloadText(`tawjihi09-backup-${todayKey()}.json`, JSON.stringify(state, null, 2));
  });

  $("#importFile", el).addEventListener("change", async (e)=>{
    const file = e.target.files?.[0];
    if(!file) return;
    const text = await file.text();
    try{
      const obj = JSON.parse(text);
      // basic sanity
      if(!obj.subjects || !obj.tasks || !obj.plan) throw new Error("Invalid backup");
      state = obj;
      saveState();
      applyTheme();
      renderAll();
      renderKPIs();
      alert("تم الاستيراد ✅");
    }catch{
      alert("الملف غير صالح.");
    }
  });

  $("#resetAll", el).addEventListener("click", ()=>{
    if(!confirm("متأكد؟ سيتم حذف كل شيء.")) return;
    localStorage.removeItem(KEY);
    state = defaultState();
    saveState();
    applyTheme();
    renderAll();
    renderKPIs();
  });

  $("#setDark", el).addEventListener("click", ()=>{
    state.ui.theme = "dark"; saveState(); applyTheme();
  });
  $("#setLight", el).addEventListener("click", ()=>{
    state.ui.theme = "light"; saveState(); applyTheme();
  });

  $("#swRefresh", el).addEventListener("click", async ()=>{
    try{
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r=>r.unregister()));
      location.reload();
    }catch{
      alert("إذا ما اشتغل، اعمل تحديث للصفحة.");
    }
  });
}

// ---------- Render All ----------
function renderAll(){
  const hash = location.hash.replace("#","") || "/";
  if(hash === "/") renderHome();
  if(hash === "/subjects") renderSubjects();
  if(hash === "/plan") renderPlan();
  if(hash === "/questions") renderQuestions();
  if(hash === "/stats") renderStats();
  if(hash === "/settings") renderSettings();
  renderKPIs();
}

// ---------- utils for search actions ----------
function scrollIntoViewSafe(sel){
  const el = document.querySelector(sel);
  if(el) el.scrollIntoView({behavior:"smooth", block:"center"});
}

// ---------- Initial ----------
route();
