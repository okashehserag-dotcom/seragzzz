function buildA(it){
  const exp = it.explanation ? `\n\nالشرح:\n${it.explanation}` : "";
  if(it.type==="mcq"){
    const ans = (it.answerKey !== undefined && it.answerKey !== null)
      ? `الإجابة: ${String.fromCharCode(65 + Number(it.answerKey))}`
      : (it.answer ? `الإجابة: ${it.answer}` : "");
    return `${ans}${exp}`.trim();
  }
  if(it.answer !== undefined && it.answer !== null){
    return `${it.answer}${exp}`.trim();
  }
  return `${exp}`.trim();
}

// ---------- Bank UI ----------
function renderBankList(rootEl){
  const el = rootEl || routes["/questions"];
  const sid = $("#bankSubject", el).value;
  ensureBank(sid);

  const filter = ($("#bankFilter", el).value || "").trim().toLowerCase();
  const arr = state.questions.bank[sid] || [];

  const subjName = state.subjects.find(s=>s.id===sid)?.name || "مادة";
  const filtered = !filter ? arr : arr.filter(q => {
    const hay = `${q.topic||""} ${q.q||""} ${q.a||""}`.toLowerCase();
    return hay.includes(filter);
  });

  const list = $("#bankList", el);
  if(!filtered.length){
    list.innerHTML = `<p class="muted">لا أسئلة بعد لهذه المادة.</p>`;
    return;
  }

  list.innerHTML = filtered.map(q => `
    <div class="card" id="q-${q.id}" style="padding:12px">
      <div class="row between" style="gap:10px; flex-wrap:wrap">
        <div class="row gap" style="flex-wrap:wrap">
          <span class="pill">📚 ${esc(subjName)}</span>
          <span class="pill">🏷️ ${esc(q.topic||"—")}</span>
          <span class="pill muted tiny">🕒 ${new Date(q.createdAt||Date.now()).toLocaleString()}</span>
        </div>

        <div class="row gap" style="flex-wrap:wrap">
          <button class="btn" data-toggle="${q.id}">إظهار/إخفاء الإجابة</button>
          <button class="btn" data-edit="${q.id}">تعديل</button>
          <button class="btn" data-delq="${q.id}">حذف</button>
        </div>
      </div>

      <div style="margin-top:10px; white-space:pre-wrap; line-height:1.6">
        <strong>السؤال:</strong>
        <div>${esc(q.q||"")}</div>
      </div>

      <div data-answrap="${q.id}" class="hidden" style="margin-top:10px; white-space:pre-wrap; line-height:1.6;
        padding:10px 12px; border:1px solid rgba(38,49,89,.35); border-radius:14px; background: rgba(6,10,25,.12);">
        <strong>الإجابة:</strong>
        <div>${esc(q.a||"") || `<span class="muted">—</span>`}</div>
      </div>
    </div>
  `).join("");

  // Toggle answer
  $$("button[data-toggle]", list).forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.dataset.toggle;
      const wrap = $(`[data-answrap="${id}"]`, list);
      wrap.classList.toggle("hidden");
    });
  });

  // Delete question
  $$("button[data-delq]", list).forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.dataset.delq;
      state.questions.bank[sid] = (state.questions.bank[sid]||[]).filter(x=>x.id!==id);
      save();
      renderBankList(el);
      toast("تم الحذف ✅");
    });
  });

  // Edit question
  $$("button[data-edit]", list).forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.dataset.edit;
      const q = (state.questions.bank[sid]||[]).find(x=>x.id===id);
      if(!q) return;

      openModal("تعديل سؤال", `
        <label>الموضوع</label>
        <input class="input" id="editTopic" value="${esc(q.topic||"")}" maxlength="60" />
        <label style="margin-top:10px">السؤال</label>
        <textarea class="input" id="editQ" rows="6" style="resize:vertical">${esc(q.q||"")}</textarea>
        <label style="margin-top:10px">الإجابة</label>
        <textarea class="input" id="editA" rows="6" style="resize:vertical">${esc(q.a||"")}</textarea>

        <div class="row gap" style="margin-top:10px">
          <button class="btn primary" id="editSave">حفظ</button>
          <button class="btn" id="editCancel">إلغاء</button>
        </div>
      `);

      $("#editCancel").addEventListener("click", closeModal);
      $("#editSave").addEventListener("click", ()=>{
        q.topic = $("#editTopic").value.trim() || "—";
        q.q = $("#editQ").value.trim();
        q.a = $("#editA").value.trim();
        save();
        closeModal();
        renderBankList(el);
        toast("تم الحفظ ✅");
      });
    });
  });
}

// ---------- STATS ----------
function renderStats(){
  const el = routes["/stats"];

  // totals
  const totalSessions = state.sessions.length;
  const totalMins = state.sessions.reduce((a,x)=>a+(x.mins||0),0);

  // last 7 days minutes (simple)
  const now = new Date();
  const daysBack = Array.from({length:7}, (_,i)=>{
    const d = new Date(now);
    d.setDate(now.getDate() - (6-i));
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    return key;
  });

  const minsByDay = Object.fromEntries(daysBack.map(k=>[k,0]));
  state.sessions.forEach(s=>{
    const d = new Date(s.start);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    if(key in minsByDay) minsByDay[key] += (s.mins||0);
  });

  // attempts summary by subject
  const attemptsBySub = state.subjects.map(sub=>{
    const arr = state.attempts.filter(a=>a.subjectId===sub.id);
    const total = arr.reduce((x,a)=>x+(a.total||0),0);
    const correct = arr.reduce((x,a)=>x+(a.correct||0),0);
    const pct = total ? Math.round((correct/total)*100) : 0;
    return {name: sub.name, correct, total, pct};
  });

  el.innerHTML = `
    <div class="grid">
      <div class="card span6">
        <h2>📊 ملخص</h2>
        <div class="row gap" style="flex-wrap:wrap">
          <span class="pill">الجلسات: <strong>${totalSessions}</strong></span>
          <span class="pill">الإجمالي: <strong>${fmtH(totalMins)}س</strong></span>
          <span class="pill">هذا الأسبوع: <strong>${fmtH(weekMinutes())}س</strong></span>
        </div>

        <h2 style="margin-top:14px">🗓️ آخر 7 أيام</h2>
        <table class="table">
          <thead><tr><th>اليوم</th><th>المدة</th></tr></thead>
          <tbody>
            ${daysBack.map(k=>`<tr><td>${k}</td><td>${fmtH(minsByDay[k])}س</td></tr>`).join("")}
          </tbody>
        </table>
      </div>

      <div class="card span6">
        <h2>✅ نتائج المحاولات</h2>
        <table class="table">
          <thead><tr><th>المادة</th><th>صح/مجموع</th><th>النسبة</th></tr></thead>
          <tbody>
            ${attemptsBySub.map(x=>`
              <tr>
                <td><strong>${esc(x.name)}</strong></td>
                <td>${x.correct}/${x.total}</td>
                <td>${x.pct}%</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <p class="muted tiny" style="margin-top:10px">
          تقدر تسجل نتائج من صفحة “بنك الأسئلة”.
        </p>
      </div>

      <div class="card span12">
        <h2>🧹 إدارة البيانات</h2>
        <div class="row gap" style="flex-wrap:wrap">
          <button class="btn" id="exportAll">تصدير كل البيانات (JSON)</button>
          <button class="btn" id="importAll">استيراد بيانات (JSON)</button>
          <button class="btn" id="resetAll">مسح كل شيء</button>
        </div>
        <input type="file" id="importFile" accept="application/json" style="display:none" />
      </div>
    </div>
  `;

  $("#exportAll", el).addEventListener("click", ()=>{
    const text = JSON.stringify(state, null, 2);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], {type:"application/json"}));
    a.download = `tawjihi-data-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  $("#importAll", el).addEventListener("click", ()=> $("#importFile", el).click());

  $("#importFile", el).addEventListener("change", async (e)=>{
    const f = e.target.files?.[0];
    if(!f) return;
    try{
      const txt = await f.text();
      const obj = JSON.parse(txt);
      // minimal safety checks
      if(!obj || typeof obj !== "object") throw new Error("bad json");
      state = obj;
      save();
      toast("تم الاستيراد ✅");
      renderAll();
    }catch{
      alert("ملف غير صالح.");
    }finally{
      e.target.value = "";
    }
  });

  $("#resetAll", el).addEventListener("click", ()=>{
    const ok = confirm("متأكد بدك تمسح كل البيانات؟");
    if(!ok) return;
    state = defaultState();
    save();
    toast("تم المسح ✅");
    renderAll();
  });
}

// ---------- SETTINGS ----------
function renderSettings(){
  const el = routes["/settings"];

  el.innerHTML = `
    <div class="grid">
      <div class="card span6">
        <h2>📚 المواد والأهداف</h2>

        <div class="row gap">
          <input class="input" id="newSubName" placeholder="اسم المادة" maxlength="30" />
          <input class="input" id="newSubGoal" type="number" min="60" step="30" value="480" style="max-width:140px" />
          <button class="btn primary" id="addSub">إضافة</button>
        </div>
        <p class="muted tiny">الهدف بالدقائق/أسبوع (مثال 480 = 8 ساعات).</p>

        <div id="subList" style="margin-top:10px; display:grid; gap:8px"></div>
      </div>

      <div class="card span6">
        <h2>⚙️ إعدادات عامة</h2>
        <div class="row between" style="gap:10px; flex-wrap:wrap">
          <span class="pill">الثيم الحالي: <strong>${state.ui.theme==="light"?"فاتح":"داكن"}</strong></span>
          <button class="btn" id="toggleTheme2">تبديل الثيم</button>
        </div>

        <h2 style="margin-top:14px">🧠 ملاحظات</h2>
        <p class="muted">
          رابط الـ Worker للـ AI بيتحدد من أعلى الملف داخل:
          <code>const AI_API = "..."</code>
        </p>
      </div>
    </div>
  `;

  $("#toggleTheme2", el).addEventListener("click", ()=>{
    state.ui.theme = (state.ui.theme==="light") ? "dark" : "light";
    save(); applyTheme();
    renderSettings();
  });

  const list = $("#subList", el);
  list.innerHTML = state.subjects.map(s=>`
    <div class="row between" style="padding:10px 12px; border:1px solid rgba(38,49,89,.35); border-radius:14px; background: rgba(6,10,25,.12); gap:10px">
      <div style="min-width:180px">
        <strong>${esc(s.name)}</strong>
        <div class="muted tiny">هدف أسبوعي: ${Math.round((s.weeklyGoalMins||0)/60)}س</div>
      </div>

      <div class="row gap" style="flex-wrap:wrap">
        <input class="input" data-goal="${s.id}" type="number" min="60" step="30" value="${s.weeklyGoalMins||0}" style="max-width:140px" />
        <button class="btn" data-delsub="${s.id}">حذف</button>
      </div>
    </div>
  `).join("");

  $$("input[data-goal]", list).forEach(inp=>{
    inp.addEventListener("change", ()=>{
      const sub = state.subjects.find(x=>x.id===inp.dataset.goal);
      if(!sub) return;
      sub.weeklyGoalMins = Math.max(0, Number(inp.value||0));
      save();
      toast("تم التعديل ✅");
      renderKPIs();
    });
  });

  $$("button[data-delsub]", list).forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.dataset.delsub;
      const ok = confirm("حذف المادة؟ (سيبقى سجل الجلسات لكن بدون اسم)");
      if(!ok) return;
      state.subjects = state.subjects.filter(s=>s.id!==id);
      delete (state.questions.bank||{})[id];
      save();
      toast("تم الحذف ✅");
      renderSettings();
    });
  });

  $("#addSub", el).addEventListener("click", ()=>{
    const name = $("#newSubName", el).value.trim();
    const goal = Math.max(0, Number($("#newSubGoal", el).value||0));
    if(!name) return;
    state.subjects.push({id:uid(), name, weeklyGoalMins:goal});
    save();
    toast("تمت الإضافة ✅");
    renderSettings();
  });
}

// ---------- renderAll ----------
function renderAll(){
  renderKPIs();
  const hash = location.hash.replace("#","") || "/";
  if(hash==="/") renderHome();
  else if(hash==="/plan") renderPlan();
  else if(hash==="/questions") renderQuestions();
  else if(hash==="/stats") renderStats();
  else if(hash==="/settings") renderSettings();
}

// ---------- Boot ----------
route();
renderAll();
