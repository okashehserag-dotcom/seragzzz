# seragzzz # T09 — Tawjihi Jordan (2009) Static Dashboard (AR/EN)

A bilingual (Arabic/English) **static** web app designed specifically for **Jordan Tawjihi** students:
- Home (today’s focus)
- Sessions Timer (Tawjihi Pomodoro)
- Weekly Plan (Sun–Sat, 4 subjects)
- Statistics (streak + chart)
- **Question Bank** (Sample Tawjihi-style placeholders + Sources panel)

> مهم: بنك الأسئلة يحتوي **أسئلة عيّنة (Sample)** فقط. لا يوجد أي ادعاء بجلب “أسئلة وزارية 2026” من الإنترنت.  
> لاحقاً يمكنك استبدال الأسئلة العيّنة بأسئلة حقيقية عبر تعديل **JSON واحد** داخل `app.js` (`questionBank`).

---

## ملفات المشروع (Exact names)
- `index.html`
- `style.css`
- `app.js`
- `manifest.webmanifest`
- `sw.js`
- `README.md`

---

## تشغيل محلياً (VS Code Live Server)
1. افتح المجلد في VS Code
2. ثبّت إضافة **Live Server**
3. اضغط يمين على `index.html` → **Open with Live Server**

> ملاحظة: الـ Service Worker يعمل بشكل صحيح مع خادم محلي (مثل Live Server)، وليس من خلال فتح الملف مباشرة (file://).

---

## النشر على GitHub Pages
1. ارفع الملفات إلى Repo على GitHub (مثلاً branch: `main`)
2. من **Settings → Pages**
3. اختر:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
4. احفظ، وراح يعطيك رابط GitHub Pages.

---

## مسح كاش الـ Service Worker أثناء التطوير
لأن التطبيق PWA وبيستخدم Cache، أحياناً بتشوف نسخة قديمة. للحل:

### الطريقة 1 (Chrome / Edge)
1. افتح DevTools → Application
2. Service Workers → فعل **Update on reload**
3. Cache Storage → احذف `t09-v1` (أو أي نسخة موجودة)

### الطريقة 2
- اعمل Hard Reload:
  - Windows: `Ctrl + Shift + R`

### الطريقة 3 (تغيير نسخة الكاش)
- في `sw.js` غيّر:
  ```js
  const CACHE_VERSION = "t09-v2";
