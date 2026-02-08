// ============= إعداد مهم =============
// ضع رابط Cloudflare Worker هنا:
const AI_API = "PUT_YOUR_WORKER_URL_HERE"; // مثال: https://tawjihi-ai.yourname.workers.dev
// ====================================

const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));
const uid = () => Math.random().toString(36).slice(2, 10);
const esc = (s) => String(s).replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m]));
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
const weekKey = (d=new Date()) => {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2,"0")}`;
};
const fmt = (sec) => {
  const m = Math.floor(sec/60), s = sec%60;
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
};
const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));
const fmtH = (mins)=> (Math.round((mins/60)*10)/10).toString();

// ---------- Toast ----------
const toastEl = $("#toast");
let toastTimer=null;
function toast(msg){
  toastEl.textContent = msg;
  toastEl.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toastEl.classList.add("hidden"), 2200);
}

// ---------- Modal ----------
const modal = $("#modal");
const modalTitle = $("#modalTitle");
const modalBody = $("#modalBody");
$("#modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", (e)=>{ if(e.target === modal) closeModal(); });

function openModal(title, html){
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  modal.classList.remove("hidden");
}
function closeModal(){
  modal.classList.add("hidden");
  modalBody.innerHTML = "";
}

// ---------- Storage ----------
const KEY="tawjihi09_smooth_v1";
const load = () => {
  try{ return JSON.parse(localStorage.getItem(KEY) || "null"); }catch{ return null; }
};
const save = () => localStorage.setItem(KEY, JSON.stringify(state));

// ---------- Default State (موادك) ----------
const defaultState = () => ({
  ui:{ theme:"dark" },
  streak:{ days:0, lastDone:"" },

  subjects:[
    {id:uid(), name:"عربي", weeklyGoalMins:480},
    {id:uid(), name:"إنجليزي", weeklyGoalMins:480},
    {id:uid(), name:"تاريخ الأردن", weeklyGoalMins:360},
    {id:uid(), name:"دين", weeklyGoalMins:360},
  ],

  tasks:{ date: todayKey(), items:[] },

  sessions: [], // {id, subjectId, start, end, mins}

  plan:{
    week: weekKey(),
    slots:["صباح","ظهر","عصر","ليل"],
    grid: Array.from({length:7}, ()=> Array.from({length:4}, ()=>""))
  },

  questions:{ bank:{} }, // subjectId -> [{id, topic, q, a, createdAt}]
  attempts: [] // {id, subjectId, topic, correct, total, date}
});

let state = load() || defaultState();

// Daily reset tasks
if(state.tasks.date !== todayKey()){
  state.tasks = { date: todayKey(), items: [] };
  save();
}

// ---------- Theme ----------
function applyTheme(){
  document.documentElement.dataset.theme = state.ui.theme === "light" ? "light" : "dark";
}
applyTheme();
$("#themeToggle").addEventListener("click", ()=>{
  state.ui.theme = (state.ui.theme==="light") ? "dark" : "light";
  save(); applyTheme();
});

// ---------- Service Worker ----------
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("./sw.js").catch(()=>{});
}

// ---------- Router ----------
const routes = {
  "/": $("#routeHome"),
  "/plan": $("#routePlan"),
  "/questions": $("#routeQuestions"),
  "/stats": $("#routeStats"),
  "/settings": $("#routeSettings")
};
const navItems = $$(".navItem");

function setRoute(path){
  Object.values(routes).forEach(r=>r.classList.add("hidden"));
  (routes[path] || routes["/"]).classList.remove("hidden");
  navItems.forEach(a=>a.classList.toggle("active", a.dataset.route===path));
  renderAll();
}
function route(){
  const hash = location.hash.replace("#","") || "/";
  setRoute(hash);
}
window.addEventListener("hashchange", route);

// ---------- KPIs ----------
function weekWindow(){
  const key = weekKey();
  const [y,w] = key.split("-W");
  const year = +y, week = +w;
  const simple = new Date(Date.UTC(year,0,1 + (week-1)*7));
  const dow = simple.getUTCDay();
  const start = simple;
  if(dow <= 4) start.setUTCDate(simple.getUTCDate() - simple.getUTCDay() + 1);
  else start.setUTCDate(simple.getUTCDate() + 8 - simple.getUTCDay());
  const s = start.getTime();
  return {start:s, end:s + 7*86400000};
}
function weekMinutes(){
  const {start,end} = weekWindow();
  return state.sessions.filter(x=>x.end && x.start>=start && x.start<end).reduce((a,x)=>a+(x.mins||0),0);
}
function subjectWeekMins(subjectId){
  const {start,end} = weekWindow();
  return state.sessions
    .filter(x=>x.subjectId===subjectId && x.end && x.start>=start && x.start<end)
    .reduce((a,x)=>a+(x.mins||0),0);
}
function renderKPIs(){
  $("#streakDays").textContent = state.streak.days;
  $("#weekHours").textContent = fmtH(weekMinutes());
}
renderKPIs();

// ---------- Streak ----------
$("#finishDay").addEventListener("click", ()=>{
  const t = todayKey();
  if(state.streak.lastDone === t) return toast("مسجّل اليوم ✅");
  const last = state.streak.lastDone;
  let next = false;
  if(last){
    const diff = Math.round((new Date(t)-new Date(last))/86400000);
    next = diff===1;
  }
  state.streak.days = next ? state.streak.days+1 : 1;
  state.streak.lastDone = t;
  save(); renderKPIs();
  toast(`ستريك: ${state.streak.days} ⭐`);
});

// ---------- Quick Add Task ----------
$("#quickAdd").addEventListener("click", ()=>{
  openModal("مهمة سريعة", `
    <label>اكتب المهمة</label>
    <input class="input" id="qaText" placeholder="مثال: حل نموذج دين" maxlength="80" />
    <div class="row gap" style="margin-top:10px">
      <button class="btn primary" id="qaSave">حفظ</button>
      <button class="btn" id="qaCancel">إلغاء</button>
    </div>
  `);
  $("#qaCancel").addEventListener("click", closeModal);
  $("#qaSave").addEventListener("click", ()=>{
    const t = $("#qaText").value.trim();
    if(!t) return;
    state.tasks.items.unshift({id:uid(), text:t, done:false});
    save(); closeModal(); renderHome();
    toast("تمت الإضافة ✅");
  });
});

// ---------- Search ----------
const searchInput = $("#globalSearch");
const searchResults = $("#searchResults");

function ensureBank(sid){
  state.questions.bank ||= {};
  state.questions.bank[sid] ||= [];
}

function buildSearchIndex(){
  const items = [];
  state.subjects.forEach(s=>items.push({
    type:"مادة",
    title:s.name,
    sub:`هدف أسبوعي: ${Math.round(s.weeklyGoalMins/60)}س`,
    action:()=>{ location.hash="#/questions"; toast("اختر المادة من بنك الأسئلة"); }
  }));
  for(const [sid, arr] of Object.entries(state.questions.bank||{})){
    const subj = state.subjects.find(x=>x.id===sid);
    arr.forEach(q=>items.push({
      type:"سؤال",
      title:q.q,
      sub:`${subj?.name||""} • ${q.topic||"—"}`,
      action:()=>{ location.hash="#/questions"; setTimeout(()=>scrollToQuestion(q.id), 80); }
    }));
  }
  return items;
}

function renderSearch(list){
  if(!list.length){
    searchResults.innerHTML = `<div class="item muted">لا نتائج</div>`;
    searchResults.classList.remove("hidden");
    return;
  }
  searchResults.innerHTML = list.slice(0,12).map((it,i)=>`
    <div class="item" data-i="${i}">
      <div><span class="pill">${it.type}</span> <strong>${esc(it.title)}</strong></div>
      <div class="muted tiny">${esc(it.sub||"")}</div>
    </div>
  `).join("");
  searchResults.classList.remove("hidden");
  $$(".item", searchResults).forEach(el=>{
    el.addEventListener("click", ()=>{
      const it = list[+el.dataset.i];
      searchResults.classList.add("hidden");
      it.action?.();
    });
  });
}

searchInput.addEventListener("input", ()=>{
  const q = searchInput.value.trim().toLowerCase();
  if(!q){ searchResults.classList.add("hidden"); return; }
  const idx = buildSearchIndex();
  const res = idx.filter(it => (it.title||"").toLowerCase().includes(q) || (it.sub||"").toLowerCase().includes(q));
  renderSearch(res);
});
document.addEventListener("click",(e)=>{ if(!e.target.closest(".search")) searchResults.classList.add("hidden"); });

function scrollToQuestion(id){
  const el = document.getElementById(`q-${id}`);
  if(el) el.scrollIntoView({behavior:"smooth", block:"center"});
}

// ---------- HOME ----------
let timerId=null;
let mode="focus";
let remaining=25*60;
const DUR = {focus:25*60, short:5*60, long:15*60};

function setMode(m){
  mode=m; remaining=DUR[m];
}
function stopTimer(){
  clearInterval(timerId); timerId=null;
}
function startTimer(subjectId){
  if(timerId) return;
  const start = Date.now();
  timerId = setInterval(()=>{
    remaining--;
    const tEl = $("#pomoTime");
    if(tEl) tEl.textContent = fmt(remaining);

    if(remaining<=0){
      stopTimer();
      // سجل جلسة فقط عند التركيز
      if(mode==="focus"){
        state.sessions.unshift({id:uid(), subjectId, start, end:Date.now(), mins:25});
        save(); renderKPIs();
      }
      toast(mode==="focus" ? "خلص التركيز ✅" : "خلصت الراحة 💪");
      setMode(mode==="focus" ? "short" : "focus");
      renderHome();
    }
  }, 1000);
}

function renderHome(){
  const el = routes["/"];
  const done = state.tasks.items.filter(x=>x.done).length;
  const total = state.tasks.items.length;
  const pct = total ? Math.round((done/total)*100) : 0;

  el.innerHTML = `
    <div class="grid">
      <div class="card span4">
        <h2>⏱️ مؤقت</h2>

        <div class="pill">الوضع: <strong>${mode==="focus"?"تركيز":"راحة"}</strong></div>
        <div id="pomoTime" style="font-size:44px; text-align:center; padding:14px; margin:10px 0;
          border:1px solid rgba(38,49,89,.55); border-radius:14px; background: rgba(6,10,25,.12);">${fmt(remaining)}</div>

        <label>المادة</label>
        <select id="pomoSubject">
          ${state.subjects.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join("")}
        </select>

        <div class="row gap" style="margin-top:10px; flex-wrap:wrap">
          <button class="btn primary" id="pStart">${timerId?"إيقاف":"ابدأ"}</button>
          <button class="btn" id="pReset">إعادة</button>
          <button class="btn" id="pFocus">تركيز 25</button>
          <button class="btn" id="pShort">راحة 5</button>
        </div>

        <p class="muted tiny" style="margin:10px 0 0">عند انتهاء التركيز تُسجّل جلسة تلقائيًا.</p>
      </div>

      <div class="card span4">
        <h2>✅ مهام اليوم</h2>
        <div class="row gap">
          <input class="input" id="taskInput" placeholder="مثال: قراءة درس تاريخ" maxlength="80" />
          <button class="btn primary" id="taskAdd">إضافة</button>
        </div>

        <div id="taskList" style="margin-top:10px; display:grid; gap:8px"></div>

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
              const mins = subjectWeekMins(s.id);
              const p = s.weeklyGoalMins ? Math.round((mins/s.weeklyGoalMins)*100) : 0;
              return `<tr>
                <td><strong>${esc(s.name)}</strong></td>
                <td>${Math.round(s.weeklyGoalMins/60)}س</td>
                <td>${fmtH(mins)}س <span class="muted tiny">(${clamp(p,0,999)}%)</span></td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>

      <div class="card span12">
        <h2>🕒 آخر الجلسات</h2>
        ${renderSessionsTable()}
      </div>
    </div>
  `;

  // Tasks
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
      const item = state.tasks.items.find(x=>x.id===ch.dataset.id);
      item.done = ch.checked;
      save(); renderHome();
    });
  });
  $$("button[data-del]", list).forEach(btn=>{
    btn.addEventListener("click", ()=>{
      state.tasks.items = state.tasks.items.filter(x=>x.id!==btn.dataset.del);
      save(); renderHome();
    });
  });
  $("#taskAdd", el).addEventListener("click", ()=>{
    const input = $("#taskInput", el);
    const t = input.value.trim();
    if(!t) return;
    state.tasks.items.unshift({id:uid(), text:t, done:false});
    input.value="";
    save(); renderHome(); toast("تمت الإضافة ✅");
  });

  // Timer controls
  $("#pStart").addEventListener("click", ()=>{
    const sid = $("#pomoSubject").value;
    if(timerId){ stopTimer(); renderHome(); toast("تم الإيقاف"); }
    else{ startTimer(sid); renderHome(); }
  });
  $("#pReset").addEventListener("click", ()=>{ stopTimer(); setMode(mode); renderHome(); });
  $("#pFocus").addEventListener("click", ()=>{ stopTimer(); setMode("focus"); renderHome(); });
  $("#pShort").addEventListener("click", ()=>{ stopTimer(); setMode("short"); renderHome(); });

  renderKPIs();
}

function renderSessionsTable(){
  if(!state.sessions.length) return `<p class="muted">لا جلسات بعد.</p>`;
  const rows = state.sessions.slice(0,10).map(s=>{
    const subj = state.subjects.find(x=>x.id===s.subjectId);
    const d = new Date(s.start);
    const when = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
    return `<tr><td>${esc(subj?.name||"")}</td><td>${when}</td><td>${s.mins} دقيقة</td></tr>`;
  }).join("");
  return `<table class="table"><thead><tr><th>المادة</th><th>الوقت</th><th>المدة</th></tr></thead><tbody>${rows}</tbody></table>`;
}

// ---------- PLAN ----------
const days = ["الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت","الأحد"];
function renderPlan(){
  const el = routes["/plan"];
  if(state.plan.week !== weekKey()){
    state.plan.week = weekKey();
    state.plan.grid = Array.from({length:7}, ()=> Array.from({length:4}, ()=>""));
    save();
  }
  const opts = `<option value="">—</option>` + state.subjects.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join("");
  el.innerHTML = `
    <div class="grid">
      <div class="card span12">
        <h2>🗓️ خطة الأسبوع (${state.plan.week})</h2>
        <div style="overflow:auto">
          <table class="table">
            <thead><tr><th>اليوم</th>${state.plan.slots.map(s=>`<th>${s}</th>`).join("")}</tr></thead>
            <tbody>
              ${state.plan.grid.map((row,di)=>`
                <tr>
                  <td><strong>${days[di]}</strong></td>
                  ${row.map((sid,si)=>`
                    <td>
                      <select data-di="${di}" data-si="${si}">
                        ${opts.replace(`value="${sid}"`, `value="${sid}" selected`)}
                      </select>
                    </td>
                  `).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <h2 style="margin-top:14px">📌 شو عليّ اليوم؟</h2>
        <div id="todayPlan"></div>
      </div>
    </div>
  `;
  $$("select[data-di]", el).forEach(sel=>{
    sel.addEventListener("change", ()=>{
      const di = +sel.dataset.di, si = +sel.dataset.si;
      state.plan.grid[di][si] = sel.value;
      save();
      renderTodayPlan(el);
      toast("تم الحفظ ✅");
    });
  });
  renderTodayPlan(el);
}
function renderTodayPlan(el){
  const jsDay = new Date().getDay(); // Sun=0
  const idx = (jsDay===0) ? 6 : (jsDay-1);
  const slots = state.plan.grid[idx];
  const html = slots.map((sid,i)=>{
    const subj = state.subjects.find(s=>s.id===sid);
    return `<div style="padding:10px 12px; border:1px solid rgba(38,49,89,.35); border-radius:14px; background: rgba(6,10,25,.12); margin:8px 0">
      <div class="row between">
        <strong>${state.plan.slots[i]}</strong>
        <span class="pill">${esc(subj?.name || "—")}</span>
      </div>
    </div>`;
  }).join("");
  $("#todayPlan", el).innerHTML = html || `<p class="muted">ما في شيء محدد لليوم.</p>`;
}

// ---------- QUESTIONS (AI + Bank) ----------
function renderQuestions(){
  const el = routes["/questions"];
  const sid0 = state.subjects[0]?.id;
  if(sid0) ensureBank(sid0);

  el.innerHTML = `
    <div class="grid">
      <div class="card span4">
        <h2>🤖 توليد أسئلة (ذكاء اصطناعي)</h2>
        <p class="muted tiny">أسئلة تدريب “قريبة من نمط الوزاري” — راجعها قبل الاعتماد.</p>

        <label>المادة</label>
        <select id="aiSubject">
          ${state.subjects.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join("")}
        </select>

        <label>الموضوع (اختياري)</label>
        <input class="input" id="aiTopic" placeholder="مثال: قواعد الهمزة / Reading / أحداث..." />

        <label>عدد الأسئلة</label>
        <input class="input" id="aiCount" type="number" min="3" max="30" value="10" />

        <div class="row gap" style="margin-top:10px; flex-wrap:wrap">
          <button class="btn primary" id="aiRun">توليد وإضافة للبنك</button>
          <button class="btn" id="aiSeed">حط أسئلة جاهزة (بدون AI)</button>
        </div>

        <h2 style="margin-top:14px">🧾 تسجيل نتيجة</h2>
        <label>المادة</label>
        <select id="aSubject">
          ${state.subjects.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join("")}
        </select>
        <label>الموضوع</label>
        <input class="input" id="aTopic" placeholder="مثال: نصوص / قواعد / وحدات..." />
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
          <button class="btn primary" id="aSave">حفظ</button>
        </div>
      </div>

      <div class="card span8">
        <h2>🧠 بنك الأسئلة</h2>
        <div class="row gap" style="flex-wrap:wrap">
          <select id="bankSubject">
            ${state.subjects.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join("")}
          </select>
          <input class="input" id="bankFilter" placeholder="فلتر حسب الدرس/كلمة..." style="max-width:320px" />
          <button class="btn" id="bankExport">تصدير أسئلة المادة</button>
        </div>
        <div id="bankList" style="margin-top:10px; display:grid; gap:8px"></div>
      </div>
    </div>
  `;

  // Seed (بدون AI)
  $("#aiSeed", el).addEventListener("click", ()=>{
    const sid = $("#aiSubject", el).value;
    ensureBank(sid);
    const subj = state.subjects.find(s=>s.id===sid)?.name || "مادة";
    const topic = $("#aiTopic", el).value.trim() || "تدريب";
    const seed = [
      {q:`(${subj}) سؤال تدريب 1 — اكتب هنا سؤال من الكتاب.`, a:"", topic},
      {q:`(${subj}) سؤال تدريب 2 — حول الفكرة لصح/خطأ أو اختيار.`, a:"", topic},
      {q:`(${subj}) سؤال تدريب 3 — اكتب إجابة مختصرة.`, a:"", topic},
    ].map(x=>({id:uid(), topic:x.topic, q:x.q, a:x.a, createdAt:Date.now()}));
    state.questions.bank[sid].unshift(...seed);
    save();
    renderBankList(el);
    toast("تمت إضافة أسئلة جاهزة ✅");
  });

  // AI Generate
  $("#aiRun", el).addEventListener("click", async ()=>{
    if(!AI_API || AI_API.includes("PUT_YOUR_WORKER_URL_HERE")){
      return alert("لازم تحط رابط AI_API في app.js (رابط Cloudflare Worker).");
    }
    const sid = $("#aiSubject", el).value;
    const subjName = state.subjects.find(s=>s.id===sid)?.name || "مادة";
    const topic = $("#aiTopic", el).value.trim();
    const count = clamp(Number($("#aiCount").value||10), 3, 30);

    $("#aiRun").disabled = true;
    $("#aiRun").textContent = "جاري التوليد...";

    try{
      const r = await fetch(AI_API, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          subject: subjName,
          gradeStyle: "توجيهي الأردن 2009",
          count,
          topics: topic
        })
      });
      if(!r.ok) throw new Error(await r.text());
      const out = await r.json();

      ensureBank(sid);
      const items = (out.items||[]).map(it => ({
        id: uid(),
        topic: it.topic || topic || "تدريب",
        q: buildQ(it),
        a: buildA(it),
        createdAt: Date.now()
      }));

      state.questions.bank[sid].unshift(...items);
      save();
      renderBankList(el);
      toast("تم إضافة الأسئلة ✅");
    }catch(e){
      console.error(e);
      alert("صار خطأ. تأكد من Worker والمفتاح.");
    }finally{
      $("#aiRun").disabled = false;
      $("#aiRun").textContent = "توليد وإضافة للبنك";
    }
  });

  // Attempts
  $("#aSave", el).addEventListener("click", ()=>{
    const sid = $("#aSubject", el).value;
    const topic = $("#aTopic", el).value.trim() || "بدون موضوع";
    const correct = Number($("#aCorrect").value||0);
    const total = Math.max(1, Number($("#aTotal").value||1));
    const date = $("#aDate").value || todayKey();
    state.attempts.unshift({id:uid(), subjectId:sid, topic, correct:clamp(correct,0,total), total, date});
    save();
    toast("تم حفظ النتيجة ✅");
  });

  // Bank
  $("#bankSubject", el).addEventListener("change", ()=>renderBankList(el));
  $("#bankFilter", el).addEventListener("input", ()=>renderBankList(el));
  $("#bankExport", el).addEventListener("click", ()=>{
    const sid = $("#bankSubject", el).value;
    ensureBank(sid);
    const subj = state.subjects.find(s=>s.id===sid)?.name || "subject";
    const text = JSON.stringify(state.questions.bank[sid], null, 2);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], {type:"application/json"}));
    a.download = `questions-${subj}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  renderBankList(el);
}

function buildQ(it){
  if(it.type==="mcq" && Array.isArray(it.choices)){
    const choices = it.choices.map((c,i)=>`${String.fromCharCode(65+i)}) ${c}`).join("\n");
    return `${it.question}\n\n${choices}`;
  }
  return it.question || "";
}
function buildA(it){
  const exp = it.explanation ? `\n\nالشرح
