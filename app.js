// ---------- Pomodoro ----------
const timeEl = document.getElementById("time");
const hintEl = document.getElementById("hint");
const startPauseBtn = document.getElementById("startPause");
const resetBtn = document.getElementById("reset");
const modeBtns = document.querySelectorAll(".chip");

const DURATIONS = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };

let mode = "focus";
let remaining = DURATIONS[mode];
let timerId = null;

function fmt(sec){
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function setMode(newMode){
  mode = newMode;
  remaining = DURATIONS[mode];
  timeEl.textContent = fmt(remaining);
  hintEl.textContent =
    mode === "focus" ? "ركّز 25 دقيقة… بعدين خذ 5 دقايق راحة."
    : mode === "short" ? "راحة قصيرة 5 دقايق… اشرب مي وارجع."
    : "راحة طويلة 15 دقيقة… خفّف ضغط ورجّع طاقتك.";

  modeBtns.forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
  stopTimer();
}

function tick(){
  remaining--;
  timeEl.textContent = fmt(remaining);

  if(remaining <= 0){
    stopTimer();
    // تنبيه بسيط بدون صوت (تقدر تضيف صوت لاحقًا)
    alert(mode === "focus" ? "خلص التركيز! خذ راحة ✅" : "خلصت الراحة! ارجع ركّز 💪");
    // سويتش تلقائي
    if(mode === "focus") setMode("short");
    else setMode("focus");
  }
}

function startTimer(){
  if(timerId) return;
  timerId = setInterval(tick, 1000);
  startPauseBtn.textContent = "إيقاف مؤقت";
}

function stopTimer(){
  if(!timerId) return;
  clearInterval(timerId);
  timerId = null;
  startPauseBtn.textContent = "ابدأ";
}

startPauseBtn.addEventListener("click", () => timerId ? stopTimer() : startTimer());
resetBtn.addEventListener("click", () => { stopTimer(); setMode(mode); });

modeBtns.forEach(btn => btn.addEventListener("click", () => setMode(btn.dataset.mode)));
timeEl.textContent = fmt(remaining);

// ---------- Tasks (with localStorage) ----------
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const tasksEl = document.getElementById("tasks");

const doneCountEl = document.getElementById("doneCount");
const totalCountEl = document.getElementById("totalCount");
const percentEl = document.getElementById("percent");
const barFillEl = document.getElementById("barFill");
const progressTextEl = document.getElementById("progressText");

const STORAGE_KEY = "tawjihi_tasks_v1";
const DATE_KEY = "tawjihi_tasks_date_v1";

function todayKey(){
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

function loadTasks(){
  const savedDate = localStorage.getItem(DATE_KEY);
  const t = localStorage.getItem(STORAGE_KEY);

  // كل يوم جديد => نفضي المهام (حتى تكون "مهام اليوم")
  if(savedDate && savedDate !== todayKey()){
    localStorage.removeItem(STORAGE_KEY);
  }
  localStorage.setItem(DATE_KEY, todayKey());

  return t ? JSON.parse(t) : [];
}

function saveTasks(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

let tasks = loadTasks();

function render(){
  tasksEl.innerHTML = "";
  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " done" : "");
    li.innerHTML = `
      <div class="left">
        <input type="checkbox" ${task.done ? "checked":""} aria-label="done"/>
        <span class="title">${escapeHtml(task.title)}</span>
      </div>
      <button class="x" title="حذف" aria-label="delete">✕</button>
    `;

    li.querySelector("input").addEventListener("change", (e) => {
      tasks[i].done = e.target.checked;
      saveTasks();
      render();
    });

    li.querySelector(".x").addEventListener("click", () => {
      tasks.splice(i, 1);
      saveTasks();
      render();
    });

    tasksEl.appendChild(li);
  });

  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pct = total === 0 ? 0 : Math.round((done/total)*100);

  doneCountEl.textContent = done;
  totalCountEl.textContent = total;
  percentEl.textContent = `${pct}%`;
  barFillEl.style.width = `${pct}%`;

  // نص لطيف
  progressTextEl.textContent =
    pct === 0 ? "0% ✨"
    : pct < 50 ? `${pct}% 👍`
    : pct < 100 ? `${pct}% 🔥`
    : "100% 🏆";
}

function escapeHtml(str){
  return str.replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if(!title) return;
  tasks.unshift({ title, done:false });
  taskInput.value = "";
  saveTasks();
  render();
});

render();

// ---------- Streak ----------
const streakEl = document.getElementById("streak");
const finishDayBtn = document.getElementById("finishDay");
const resetStreakBtn = document.getElementById("resetStreak");

const STREAK_KEY = "tawjihi_streak_v1";
const STREAK_LAST_KEY = "tawjihi_streak_last_v1";

function loadStreak(){
  return Number(localStorage.getItem(STREAK_KEY) || 0);
}
function loadLast(){
  return localStorage.getItem(STREAK_LAST_KEY) || "";
}

let streak = loadStreak();
streakEl.textContent = streak;

finishDayBtn.addEventListener("click", () => {
  const last = loadLast();
  const today = todayKey();

  if(last === today){
    alert("أنت مُسجّل اليوم بالفعل ✅");
    return;
  }

  // إذا اليوم بعد آخر تسجيل بيوم واحد => زِد الستريك
  // غير هيك: اعتبرها بداية جديدة
  const lastDate = last ? new Date(last) : null;
  const tDate = new Date(today);

  let nextDay = false;
  if(lastDate){
    const diff = Math.round((tDate - lastDate) / (1000*60*60*24));
    nextDay = diff === 1;
  }

  streak = nextDay ? (streak + 1) : 1;

  localStorage.setItem(STREAK_KEY, String(streak));
  localStorage.setItem(STREAK_LAST_KEY, today);

  streakEl.textContent = streak;
  alert(`ممتاز! ستريكك صار ${streak} يوم ⭐`);
});

resetStreakBtn.addEventListener("click", () => {
  localStorage.removeItem(STREAK_KEY);
  localStorage.removeItem(STREAK_LAST_KEY);
  streak = 0;
  streakEl.textContent = streak;
});
