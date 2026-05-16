import { useState, useEffect, useRef, useCallback } from "react";
import startImage from "./assets/Al farabe.png";

/* ═══════════════════════════════════════════════════════
   TRANSLATIONS
═══════════════════════════════════════════════════════ */
const T = {
  ar: {
    dir: "rtl",
    platformTitle: "منصة الامتحانات الذكية",
    platformSub: "أسئلة فريدة · حماية IP · منع لقطات الشاشة",
    teacher: "تدريسي", student: "طالب",
    teacherDesc: "اضغط عدد الأسئلة واكتبها يدويًا ثم احفظ الامتحان وراقب الطلاب",
    studentDesc: "سجّل بـ Google واحصل على أسئلة فريدة خاصة بك",
    googleLogin: "تسجيل الدخول بـ Google",
    teacherGate: "بوابة التدريسي", studentGate: "بوابة الطالب",
    fullName: "الاسم الكامل", email: "البريد الإلكتروني @gmail.com",
    continue: "متابعة", checking: "جارٍ التحقق...", cancel: "إلغاء",
    fillAll: "يرجى تعبئة جميع الحقول", badEmail: "صيغة البريد غير صحيحة",
    blockedIP: (ip, h) => `🚫 حماية IP: هذا الحساب مرتبط بـ IP مختلف (${ip}). يمكنك التغيير بعد ${h} ساعة.`,
    blocked: "🚫 حسابك محظور. تواصل مع التدريسي.",
    alreadyDone: "⚠️ أكملت الامتحان بالفعل.",
    noApiKey: "",
    apiError: "",
    generationError: "",
    examSetup: "إعداد الامتحان", subjectName: "اسم المادة",
    subjectPH: "مثال: الكيمياء — الفصل الثاني",
    questionImageLabel: "صورة السؤال",
    optional: "اختياري",
    filesLabel: "رفع ملفات إضافية (صور، PDF، نصوص)",
    dropHint: "اسحب الملفات هنا أو انقر للاختيار",
    dropTypes: "صور (JPG، PNG) · ملفات نصية (TXT) · PDF",
    imagesNote: "✅ يمكن رفع الملفات والصور لدعم محتوى الامتحان",
    questionCount: "عدد الأسئلة لكل طالب", duration: "مدة الامتحان",
    questionType: "نوع السؤال",
    typeMC: "اختيار من متعدد",
    typeText: "إجابة كتابة",
    typeImage: "إجابة بصورة",
    optionCount: "عدد الخيارات",
    questionTextLabel: "نص السؤال",
    questionTextPlaceholder: "اكتب السؤال هنا",
    optionLabel: "خيار",
    correctOption: "الخيار الصحيح",
    openAnswerNote: "الطالب سيكتب الإجابة بدون خيارات.",
    imageAnswerNote: "الطالب سيلحق صورة كإجابة.",
    savePublish: "💾 حفظ ونشر", update: "✅ تحديث الامتحان",
    saving: "جارٍ الحفظ...", deleteAll: "🗑️ مسح الكل",
    examActive: "🟢 الامتحان نشط — الطلاب يمكنهم الدخول الآن",
    confirmDelete: "هل أنت متأكد؟ سيُحذف الامتحان وجميع بيانات الطلاب.",
    protection: "🛡️ نظام الحماية",
    students: "👥 الطلاب", studentsTab: "👥 الطلاب", setupTab: "⚙️ الإعداد",
    logout: "خروج", noStudents: "لا يوجد طلاب مسجّلون بعد",
    name: "الاسم", emailH: "البريد", ip: "عنوان IP",
    fingerprint: "بصمة", ipStatus: "حالة IP", status: "الحالة", action: "إجراء",
    ipLocked: h => `🔒 مقفول ${h}h`, ipFree: "🔄 جاهز للتجديد",
    block: "حظر", results: "📊 النتائج",
    correct: "صح", wrong: "خطأ", grade: "التقدير", violations: "مخالفات", screenshots: "لقطات",
    noExam: "لا يوجد امتحان نشط", noExamSub: "انتظر المدرس أو تحقق من الاتصال",
    retry: "🔄 إعادة المحاولة",
    readyTitle: "جاهز للامتحان", questions: "سؤال", minutes: "دقيقة",
    ipLock: "IP مسجّل:",
    ipResetNote: "⏱️ IP مقفول لـ 3 ساعات — يُجدَّد تلقائياً بعدها",
    rules: ["📌 أسئلتك فريدة ومختلفة تماماً عن باقي الطلاب",
            "📸 لقطات الشاشة محظورة وتُسجَّل كمخالفة",
            "👁️ لا تغادر النافذة أثناء الامتحان (3 مخالفات = إيقاف)",
            "🚫 Ctrl+C · Ctrl+V · F12 · كليك اليمين محظورة",
            "⏱️ الوقت يبدأ فور الضغط على ابدأ"],
    startExam: "🚀 ابدأ الامتحان",
    generating: "يتم إعداد الامتحان الآن",
    generatingSub: "الرجاء الانتظار لحظة حتى ينطلق الامتحان",
    verifying: "جارٍ التحقق...",
    ssWarning: n => `📸 تم رصد ${n} محاولة لقطة شاشة — تُحفظ في سجل المخالفات`,
    violWarning: (n, max, left) => `⚠️ مخالفة #${n}: ${left} متبقي قبل الإيقاف`,
    question: "س", of: "/",
    answered: n => `المجاب: ${n}`,
    confirmAnswer: "تأكيد الإجابة ✓",
    nextQ: "التالي →", finishExam: "إنهاء الامتحان 🏁",
    sessionStopped: "تم إيقاف جلستك",
    contactTeacher: "تواصل مع المدرس لإعادة التفعيل",
    excellent: "أحسنت! أداء ممتاز 🎉", good: "جيد، استمر 👍", study: "تحتاج مراجعة 📚",
    answerDetails: "تفاصيل الإجابات:",
    yourAnswer: "إجابتك:", correct2: "الصواب:",
    writeAnswerPlaceholder: "اكتب إجابتك هنا",
    attachImageLabel: "أضف صورة كإجابة",
    imageAttached: "تم إرفاق صورة",
    notGraded: "غير مصنّف",
    notAnswered: "لم تُجب",
    createdBy: "تم تطوير مشروع حماية من الغش",
    by: "من قِبَل",
    dev1Name: "أمير",
    dev2Name: "محمد",
    mins: ["5 دقائق","10 دقائق","15 دقيقة","20 دقيقة","30 دقيقة","45 دقيقة","60 ساعة","120 ساعتين","180 3 ساعات"],
  },
  en: {
    dir: "ltr",
    platformTitle: "Smart Exam Platform",
    platformSub: "Unique questions · IP protection · Screenshot prevention",
    teacher: "Instructor", student: "Student",
    teacherDesc: "Enter questions manually, configure the exam and monitor students",
    studentDesc: "Sign in with Google and get your own unique exam questions",
    googleLogin: "Sign in with Google",
    teacherGate: "Instructor Portal", studentGate: "Student Portal",
    fullName: "Full Name", email: "Email address @gmail.com",
    continue: "Continue", checking: "Verifying...", cancel: "Cancel",
    fillAll: "Please fill in all fields", badEmail: "Invalid email format",
    blockedIP: (ip, h) => `🚫 IP Lock: This account is linked to a different IP (${ip}). You can change after ${h} hour(s).`,
    blocked: "🚫 Your account is blocked. Contact your teacher.",
    blockedLabel: "Blocked",
    unblock: "Unblock",
    studentBanned: "Student has been blocked.",
    studentUnbanned: "Student has been unblocked.",
    alreadyDone: "⚠️ You already completed this exam.",
    noApiKey: "",
    apiError: "",
    generationError: "",
    examSetup: "Exam Setup", subjectName: "Subject Name",
    subjectPH: "e.g. Chemistry — Chapter 2",
    questionImageLabel: "Question image",
    optional: "optional",
    filesLabel: "Upload extra files (images, PDF, text)",
    dropHint: "Drag files here or click to choose",
    dropTypes: "Images (JPG, PNG) · Text files (TXT) · PDF",
    imagesNote: "✅ Images can be uploaded to support the exam material",
    questionCount: "Questions per student", duration: "Exam duration",
    questionType: "Question type",
    typeMC: "Multiple choice",
    typeText: "Open answer",
    typeImage: "Image upload",
    optionCount: "Options count",
    questionTextLabel: "Question text",
    questionTextPlaceholder: "Write the question here",
    optionLabel: "Option",
    correctOption: "Correct option",
    openAnswerNote: "The student will type the answer without options.",
    imageAnswerNote: "The student will attach an image as the answer.",
    savePublish: "💾 Save & Publish", update: "✅ Update Exam",
    saving: "Saving...", deleteAll: "🗑️ Delete All",
    examActive: "🟢 Exam is live — students can join now",
    confirmDelete: "Are you sure? This will delete the exam and all student data.",
    protection: "🛡️ Security System",
    students: "👥 Students", studentsTab: "👥 Students", setupTab: "⚙️ Setup",
    logout: "Logout", noStudents: "No students registered yet",
    name: "Name", emailH: "Email", ip: "IP Address",
    fingerprint: "Fingerprint", ipStatus: "IP Status", status: "Status", action: "Action",
    ipLocked: h => `🔒 Locked ${h}h`, ipFree: "🔄 Ready to renew",
    block: "Block", results: "📊 Results",
    correct: "Correct", wrong: "Wrong", grade: "Grade", violations: "Violations", screenshots: "Screenshots",
    noExam: "No active exam", noExamSub: "Wait for your teacher or check your connection",
    retry: "🔄 Retry",
    readyTitle: "Ready for exam", questions: "questions", minutes: "minutes",
    ipLock: "Registered IP:",
    ipResetNote: "⏱️ IP locked for 3 hours — auto-renewed after that",
    rules: ["📌 Your questions are unique — different from all other students",
            "📸 Screenshots are blocked and logged as violations",
            "👁️ Don't leave the window during the exam (3 violations = stop)",
            "🚫 Ctrl+C · Ctrl+V · F12 · Right-click are all blocked",
            "⏱️ Timer starts when you press Start"],
    startExam: "🚀 Start Exam",
    generating: "Preparing your exam...",
    generatingSub: "Please wait while the exam is prepared",
    verifying: "Verifying...",
    ssWarning: n => `📸 ${n} screenshot attempt(s) detected — logged as violation`,
    violWarning: (n, max, left) => `⚠️ Violation #${n}: ${left} remaining before shutdown`,
    question: "Q", of: "/",
    answered: n => `Answered: ${n}`,
    confirmAnswer: "Confirm Answer ✓",
    nextQ: "Next →", finishExam: "Finish Exam 🏁",
    sessionStopped: "Session Stopped",
    contactTeacher: "Contact your teacher to reactivate your session",
    excellent: "Excellent! Great job 🎉", good: "Good, keep improving 👍", study: "Needs more review 📚",
    answerDetails: "Answer Details:",
    yourAnswer: "Your answer:", correct2: "Correct:",
    writeAnswerPlaceholder: "Write your answer here",
    attachImageLabel: "Attach an image as the answer",
    imageAttached: "Image attached",
    notGraded: "Not graded",
    notAnswered: "Not answered",
    createdBy: "Anti-cheating project developed",
    by: "by",
    dev1Name: "Ameer",
    dev2Name: "Mohammad",
    mins: ["5 minutes","10 minutes","15 minutes","20 minutes","30 minutes","45 minutes","60 hour","120 2 hours","180 3 hours"],
  }
};

/* ═══════════════════════════════════════════════════════
   STORAGE
═══════════════════════════════════════════════════════ */
const store = {
  async get(k) {
    try {
      if (window.storage && typeof window.storage.get === "function") {
        const r = await window.storage.get(k);
        return r ? JSON.parse(r.value) : null;
      }
      const raw = window.localStorage.getItem(k);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  async set(k, v) {
    try {
      const payload = JSON.stringify(v);
      if (window.storage && typeof window.storage.set === "function") {
        await window.storage.set(k, payload);
        return;
      }
      window.localStorage.setItem(k, payload);
    } catch {}
  },
  async del(k) {
    try {
      if (window.storage && typeof window.storage.delete === "function") {
        await window.storage.delete(k);
        return;
      }
      window.localStorage.removeItem(k);
    } catch {}
  },
};

const emptyQuestion = () => ({ text:"", image:"", type:"mc", optionCount:4, options:["","","",""], correct:0 });
const normalizeQuestionArray = (questions = [], count = 10) => Array.from({ length: count }, (_, index) => {
  const q = questions?.[index] || emptyQuestion();
  const optionCount = Math.min(5, Math.max(3, q.type === "mc" ? (q.optionCount || 4) : 4));
  return {
    text: q.text || "",
    image: q.image || "",
    type: q.type || "mc",
    optionCount,
    options: q.type === "mc" ? Array.from({ length: optionCount }, (_, i) => q.options?.[i] || "") : [],
    correct: q.type === "mc" ? (typeof q.correct === "number" ? q.correct : 0) : 0,
  };
});

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
const getIP = async () => {
  try { const r = await fetch("https://api.ipify.org?format=json"); const d = await r.json(); return d.ip; }
  catch { return "local-" + Math.random().toString(36).slice(2,8); }
};
const getFingerprint = () => {
  const s = [navigator.userAgent, navigator.language, screen.width+"x"+screen.height,
    screen.colorDepth, new Date().getTimezoneOffset(), navigator.hardwareConcurrency||0].join("|");
  let h=0; for(let i=0;i<s.length;i++){h=(h<<5)-h+s.charCodeAt(i);h|=0;} return Math.abs(h).toString(16);
};
const fmtTime = t => `${String(Math.floor(t/60)).padStart(2,"0")}:${String(t%60).padStart(2,"0")}`;
const nowStr  = () => new Date().toLocaleString("ar-SA");
const IP_LOCK_MS = 3 * 60 * 60 * 1000; // 3 hours

const fileToBase64 = f => new Promise((res,rej)=>{
  const r=new FileReader(); r.onload=()=>res(r.result.split(",")[1]); r.onerror=()=>rej(new Error("fail")); r.readAsDataURL(f);
});
const fileToText = f => new Promise((res,rej)=>{
  const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=()=>rej(new Error("fail")); r.readAsText(f,"utf-8");
});
const makeWatermarkCSS = (name, ip) => {
  const txt = `${name} | ${ip}`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='360' height='170'><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='rgba(255,255,255,0.042)' transform='rotate(-28,180,85)'>${txt}</text></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
};

/* ═══════════════════════════════════════════════════════
   QUESTION HELPERS
═══════════════════════════════════════════════════════ */
const shuffleArray = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const normalizeText = (text) => text.replace(/[^ -\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim();
const splitSentences = (text) => text.replace(/\r\n/g, " ").split(/(?<=[.!?؟])\s+/).map(s => s.trim()).filter(Boolean);
const extractTerms = (text, lang) => {
  const stopAr = new Set(["و","في","من","على","إلى","عن","التي","الذي","هذا","هذه","كان","لكن","هل","ما","لم","لا","مع","كل","حتى","أن","إن","عن","أما"]);
  const stopEn = new Set(["the","this","that","with","from","then","have","has","had","and","for","but","not","your","over","into","about","which","their","them","when","what","where","will","would","could","should"]);
  return normalizeText(text).toLowerCase().split(" ").filter(w => {
    if (w.length < 4) return false;
    if (/^\d+$/.test(w)) return false;
    if (lang === "ar" ? stopAr.has(w) : stopEn.has(w)) return false;
    return true;
  }).filter((w, i, arr) => arr.indexOf(w) === i);
};

const makeLocalQuestion = (sentence, terms, lang) => {
  const words = sentence.split(/\s+/).map(w => w.replace(/[.,!?؟;:()\"'«»]/g, "")).filter(Boolean);
  const candidates = words.filter(w => terms.includes(w.toLowerCase()) && w.length >= 4);
  const correct = candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : words[0] || terms[0] || "...";
  const blankSentence = sentence.replace(new RegExp(`\\b${correct.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`), "_____" );
  const distractors = shuffleArray(terms.filter(w => w.toLowerCase() !== correct.toLowerCase())).slice(0, 3);
  const options = shuffleArray([correct, ...distractors]).slice(0, 4);
  const correctIndex = options.findIndex(o => o === correct);
  return {
    text: lang === "ar" ? `أكمل الفراغ: "${blankSentence}"` : `Fill in the blank: "${blankSentence}"`,
    options,
    correct: correctIndex === -1 ? 0 : correctIndex,
    explanation: lang === "ar" ? `الإجابة الصحيحة هي: ${correct}` : `The correct answer is: ${correct}`,
  };
};

const generateLocalQuestions = (material, subject, count, studentName, lang) => {
  const sentences = splitSentences(material || subject || studentName || "");
  const terms = extractTerms(material || subject || studentName || "", lang);
  const levels = lang === "ar" ? ["تذكّر", "فهم", "تطبيق"] : ["recall", "comprehension", "application"];

  return Array.from({ length: count }, (_, index) => {
    const sentence = sentences[index % sentences.length] || terms[index] || `${subject}` || `${studentName}` || "...";
    const question = makeLocalQuestion(sentence, terms, lang);
    return {
      id: index + 1,
      level: levels[index % levels.length],
      ...question,
    };
  });
};

const generateQuestions = async (material, subject, count, studentName, seed, lang, images=[]) => {
  return generateLocalQuestions(material, subject, count, studentName, lang);
};

/* ═══════════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Inter:wght@400;600;700;800;900&family=IBM+Plex+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#06090f;--s1:#0c1220;--s2:#111a2e;
  --b1:#1b2d4f;--b2:#243760;
  --teal:#00e5c8;--teal2:#00b5a0;
  --blue:#3b8eff;--gold:#fbbf24;--red:#f43f5e;--green:#10b981;--orange:#fb923c;--purple:#a78bfa;
  --txt:#ddeeff;--muted:#6b8db5;--radius:14px;
  --glow-t:0 0 32px rgba(0,229,200,.15);
}
body{background:var(--bg);color:var(--txt);min-height:100vh}
.font-ar{font-family:'Tajawal',sans-serif}
.font-en{font-family:'Inter',sans-serif}

.exam-protected{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-touch-callout:none}
@media print{.exam-protected,.root{display:none!important}}

.watermark-layer{position:fixed;inset:0;pointer-events:none;z-index:8000;background-repeat:repeat;background-size:360px 170px}
.ss-flash{position:fixed;inset:0;background:rgba(244,63,94,.22);z-index:9998;pointer-events:none;animation:ssflash .5s ease forwards}
@keyframes ssflash{0%{opacity:1}100%{opacity:0}}

.root{min-height:100vh;background:
  radial-gradient(ellipse 100% 50% at 50% -5%,rgba(0,229,200,.09) 0%,transparent 60%),
  radial-gradient(ellipse 70% 40% at 90% 95%,rgba(59,142,255,.07) 0%,transparent 50%),var(--bg)}

/* LANG SWITCHER */
.lang-bar{position:fixed;top:16px;left:16px;z-index:999;display:flex;gap:6px}
.lang-btn{padding:6px 14px;border-radius:999px;border:1.5px solid var(--b2);background:var(--s1);
  color:var(--muted);font-size:13px;font-weight:700;cursor:pointer;transition:all .2s}
.lang-btn.active{border-color:var(--teal);color:var(--teal);background:rgba(0,229,200,.08)}

/* ROLE SELECT */
.role-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.role-box{width:100%;max-width:580px;text-align:center}
.brand{font-size:46px;margin-bottom:10px}
.brand-title{font-size:30px;font-weight:900;background:linear-gradient(135deg,var(--teal),var(--blue));-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px;line-height:1.3}
.brand-sub{color:var(--muted);margin-bottom:36px;font-size:14px;line-height:1.7}
.role-cards{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:28px}
.start-image-wrap{margin:0 auto 28px;max-width:540px;border-radius:24px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.22)}
.start-image{width:100%;display:block;object-fit:cover;height:auto}
.role-card{background:var(--s1);border:1.5px solid var(--b1);border-radius:20px;padding:34px 20px;cursor:pointer;transition:all .25s;text-align:center}
.role-card:hover{border-color:var(--teal);box-shadow:var(--glow-t);transform:translateY(-4px)}
.role-card.t:hover{border-color:var(--blue);box-shadow:0 0 32px rgba(59,142,255,.15)}
.role-icon{font-size:44px;margin-bottom:14px}
.role-name{font-size:19px;font-weight:800;margin-bottom:8px}
.role-desc{font-size:13px;color:var(--muted);line-height:1.65}

/* CREDITS */
.credits{background:var(--s1);border:1px solid var(--b1);border-radius:16px;padding:18px 22px;text-align:center;font-size:13px;color:var(--muted)}
.credits-title{font-size:14px;font-weight:700;color:var(--txt);margin-bottom:10px}
.credits-devs{display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap}
.dev-link{display:flex;align-items:center;gap:7px;text-decoration:none;
  background:var(--s2);border:1px solid var(--b1);border-radius:10px;padding:8px 14px;transition:all .2s}
.dev-link:hover{border-color:var(--purple);box-shadow:0 0 16px rgba(167,139,250,.2);transform:translateY(-2px)}
.dev-avatar{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:#fff}
.dev-name{font-weight:700;font-size:14px;color:var(--txt)}
.dev-ig{font-size:11px;color:var(--purple)}
.ig-icon{font-size:16px}

/* GOOGLE MODAL */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:9990;animation:fadeIn .2s}
.google-modal{background:#fff;border-radius:22px;padding:44px 40px;width:390px;text-align:center;box-shadow:0 40px 100px rgba(0,0,0,.5);animation:slideUp .3s ease}
.g-logo{font-size:40px;margin-bottom:16px}
.g-title{font-size:21px;font-weight:800;color:#202124;margin-bottom:4px}
.g-sub{font-size:13px;color:#5f6368;margin-bottom:26px}
.g-field{width:100%;border:1.5px solid #dadce0;border-radius:9px;padding:13px 14px;font-size:15px;outline:none;margin-bottom:12px;font-family:inherit;transition:border-color .2s}
.g-field:focus{border-color:#1a73e8;box-shadow:0 0 0 3px rgba(26,115,232,.12)}
.g-btn{width:100%;padding:13px;background:#1a73e8;border:none;border-radius:9px;color:#fff;font-size:16px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .2s;margin-top:4px}
.g-btn:hover{background:#1557b0}
.g-btn:disabled{background:#aac7f5;cursor:not-allowed}
.g-cancel{background:none;border:none;color:#5f6368;font-size:14px;cursor:pointer;margin-top:12px;font-family:inherit}
.g-cancel:hover{text-decoration:underline}
.g-err{color:#d93025;font-size:13px;background:#fce8e6;border-radius:7px;padding:10px 12px;margin-bottom:12px}

/* SHELL */
.shell{max-width:960px;margin:0 auto;padding:24px 20px}
.topbar{display:flex;align-items:center;justify-content:space-between;background:var(--s1);border:1px solid var(--b1);border-radius:var(--radius);padding:14px 20px;margin-bottom:22px;flex-wrap:wrap;gap:10px}
.topbar-left{display:flex;align-items:center;gap:10px}
.avatar{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:16px;flex-shrink:0}
.av-t{background:linear-gradient(135deg,var(--blue),#1e5ad4);color:#fff}
.av-s{background:linear-gradient(135deg,var(--teal),var(--teal2));color:#000}
.user-name{font-weight:700;font-size:15px}
.user-role{font-size:12px;color:var(--muted)}
.ip-chip{font-size:11px;font-family:'IBM Plex Mono',monospace;background:var(--s2);border:1px solid var(--b1);border-radius:6px;padding:4px 10px;color:var(--teal)}
.logout-btn{background:none;border:1px solid var(--b1);border-radius:8px;padding:7px 14px;color:var(--muted);font-family:inherit;font-size:13px;cursor:pointer;transition:all .2s}
.logout-btn:hover{border-color:var(--red);color:var(--red)}

/* CARDS */
.card{background:var(--s1);border:1px solid var(--b1);border-radius:18px;padding:28px;margin-bottom:18px;animation:slideUp .3s ease}
.card-title{font-size:18px;font-weight:800;margin-bottom:20px;display:flex;align-items:center;gap:9px}
.field{margin-bottom:16px}
.field label{display:block;font-size:13px;font-weight:600;color:var(--muted);margin-bottom:8px}
.field input,.field select,.field textarea{width:100%;background:var(--s2);border:1.5px solid var(--b1);border-radius:var(--radius);padding:12px 16px;color:var(--txt);font-family:inherit;font-size:15px;outline:none;transition:border-color .2s,box-shadow .2s;resize:vertical}
.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(0,229,200,.1)}
.field textarea{min-height:180px;line-height:1.7}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:14px}

/* FILE UPLOAD */
.upload-zone{border:2px dashed var(--b2);border-radius:var(--radius);padding:26px;text-align:center;cursor:pointer;transition:all .2s;background:var(--s2);position:relative;overflow:hidden}
.upload-zone:hover,.upload-zone.drag{border-color:var(--teal);background:rgba(0,229,200,.04)}
.upload-zone input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.upload-icon{font-size:34px;margin-bottom:10px}
.upload-hint{font-size:14px;color:var(--txt);font-weight:600;margin-bottom:4px}
.upload-types{font-size:12px;color:var(--muted)}
.file-list{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.file-chip{display:flex;align-items:center;gap:7px;background:var(--s1);border:1px solid var(--b1);border-radius:9px;padding:6px 12px;font-size:13px;max-width:200px}
.file-chip img{width:38px;height:38px;object-fit:cover;border-radius:6px;flex-shrink:0}
.file-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}
.rm-btn{background:none;border:none;color:var(--red);cursor:pointer;font-size:18px;line-height:1;padding:0;flex-shrink:0}

/* BUTTONS */
.btn-teal{padding:13px 28px;background:linear-gradient(135deg,var(--teal),var(--teal2));border:none;border-radius:var(--radius);color:#000;font-family:inherit;font-size:16px;font-weight:800;cursor:pointer;transition:all .2s;box-shadow:0 4px 18px rgba(0,229,200,.28)}
.btn-teal:hover{transform:translateY(-1px);box-shadow:0 8px 28px rgba(0,229,200,.38)}
.btn-teal:disabled{opacity:.4;cursor:not-allowed;transform:none}
.btn-blue{padding:11px 20px;background:linear-gradient(135deg,var(--blue),#1e5ad4);border:none;border-radius:var(--radius);color:#fff;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s}
.btn-blue:hover{transform:translateY(-1px)}
.btn-red{padding:9px 18px;background:rgba(244,63,94,.1);border:1px solid rgba(244,63,94,.35);border-radius:9px;color:var(--red);font-family:inherit;font-size:13px;cursor:pointer;transition:all .2s}
.btn-red:hover{background:rgba(244,63,94,.2)}

/* BADGES */
.badge{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:700;padding:4px 10px;border-radius:999px}
.bg{background:rgba(16,185,129,.13);color:var(--green);border:1px solid rgba(16,185,129,.3)}
.br{background:rgba(244,63,94,.13);color:var(--red);border:1px solid rgba(244,63,94,.3)}
.by{background:rgba(251,191,36,.13);color:var(--gold);border:1px solid rgba(251,191,36,.3)}
.bb{background:rgba(59,142,255,.13);color:var(--blue);border:1px solid rgba(59,142,255,.3)}
.bo{background:rgba(251,146,60,.13);color:var(--orange);border:1px solid rgba(251,146,60,.3)}

/* TABLE */
.tbl{width:100%;border-collapse:collapse;font-size:14px}
.tbl th{padding:10px 14px;font-weight:700;color:var(--muted);border-bottom:1px solid var(--b1);font-size:12px}
.tbl td{padding:12px 14px;border-bottom:1px solid rgba(27,45,79,.5);vertical-align:middle}
.tbl tr:last-child td{border-bottom:none}
.tbl tr:hover td{background:rgba(255,255,255,.02)}
.mono{font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--muted)}

/* EXAM */
.exam-shell{max-width:840px;margin:0 auto;padding:20px}
.exam-hdr{display:flex;align-items:center;justify-content:space-between;background:var(--s1);border:1px solid var(--b1);border-radius:var(--radius);padding:14px 20px;margin-bottom:14px;flex-wrap:wrap;gap:10px}
.timer{font-family:'IBM Plex Mono',monospace;font-size:24px;font-weight:600;background:var(--s2);border:1px solid var(--b1);border-radius:10px;padding:8px 20px;color:var(--teal);min-width:92px;text-align:center}
.timer.warn{color:var(--gold);border-color:rgba(251,191,36,.4)}
.timer.danger{color:var(--red);border-color:rgba(244,63,94,.4);animation:pulse 1s ease infinite}
.prog-wrap{background:var(--s1);border:1px solid var(--b1);border-radius:var(--radius);padding:12px 18px;margin-bottom:14px;display:flex;align-items:center;gap:12px}
.prog-track{flex:1;height:7px;background:var(--s2);border-radius:999px;overflow:hidden}
.prog-fill{height:100%;background:linear-gradient(90deg,var(--teal2),var(--teal));border-radius:999px;transition:width .4s;box-shadow:0 0 10px rgba(0,229,200,.4)}
.viol-bar{background:rgba(244,63,94,.1);border:1px solid rgba(244,63,94,.3);border-radius:var(--radius);padding:10px 16px;margin-bottom:12px;font-size:13px;color:var(--red);display:flex;align-items:center;justify-content:space-between}
.ss-bar{background:rgba(251,146,60,.1);border:1px solid rgba(251,146,60,.3);border-radius:var(--radius);padding:10px 16px;margin-bottom:12px;font-size:13px;color:var(--orange);display:flex;align-items:center;gap:8px}
.q-card{background:var(--s1);border:1px solid var(--b1);border-radius:18px;padding:30px;box-shadow:0 8px 32px rgba(0,0,0,.3);animation:slideUp .3s ease}
.q-meta{display:flex;align-items:center;gap:8px;margin-bottom:18px;flex-wrap:wrap}
.q-num{background:linear-gradient(135deg,var(--teal),var(--teal2));color:#000;font-weight:800;font-size:12px;border-radius:8px;padding:4px 12px}
.q-level{font-size:12px;color:var(--muted);background:var(--s2);border:1px solid var(--b1);border-radius:6px;padding:3px 10px}
.q-text{font-size:19px;font-weight:600;line-height:1.75;margin-bottom:22px}
.q-img{width:100%;max-height:260px;object-fit:contain;border-radius:10px;border:1px solid var(--b1);margin-bottom:20px;background:var(--s2)}
.opts{display:flex;flex-direction:column;gap:11px}
.opt{width:100%;background:var(--s2);border:1.5px solid var(--b1);border-radius:var(--radius);padding:15px 18px;color:var(--txt);font-family:inherit;font-size:16px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:12px}
.opt:hover:not(:disabled){border-color:var(--teal);background:rgba(0,229,200,.06);transform:translateX(-2px)}
.opt.sel{border-color:var(--teal);background:rgba(0,229,200,.08);box-shadow:0 0 0 3px rgba(0,229,200,.07)}
.opt.ok{border-color:var(--green);background:rgba(16,185,129,.09)}
.opt.bad{border-color:var(--red);background:rgba(244,63,94,.09)}
.opt-letter{width:30px;height:30px;border-radius:50%;background:var(--b1);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;transition:background .2s}
.opt.sel .opt-letter{background:var(--teal);color:#000}
.expla{background:rgba(16,185,129,.07);border:1px solid rgba(16,185,129,.25);border-radius:12px;padding:16px;margin-top:18px;font-size:14px;line-height:1.7;color:#9de8cc;animation:fadeIn .3s}
.nav-row{display:flex;justify-content:space-between;align-items:center;margin-top:22px;gap:10px;flex-wrap:wrap}
.btn-confirm{padding:12px 26px;background:linear-gradient(135deg,var(--teal),var(--teal2));border:none;border-radius:var(--radius);color:#000;font-family:inherit;font-size:15px;font-weight:800;cursor:pointer;transition:all .2s;box-shadow:0 4px 16px rgba(0,229,200,.28)}
.btn-confirm:hover{transform:translateY(-1px)}
.btn-confirm:disabled{opacity:.35;cursor:not-allowed;transform:none}

/* SECURITY OVERLAY */
.sec-ov{position:fixed;inset:0;z-index:9999;background:rgba(6,9,15,.97);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:18px;animation:fadeIn .2s;text-align:center;padding:28px}
.sec-icon{font-size:72px}
.sec-title{font-size:26px;font-weight:900;color:var(--red)}
.sec-msg{color:var(--muted);max-width:440px;font-size:15px;line-height:1.7}

/* EXAM PROTECTION - MOBILE & DESKTOP */
.exam-protected{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-webkit-touch-callout:none;-webkit-user-drag:none}
.exam-protected *{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}


/* RESULTS */
.res-wrap{max-width:700px;margin:0 auto;padding:28px 20px}
.res-card{background:var(--s1);border:1px solid var(--b1);border-radius:20px;padding:40px;text-align:center;box-shadow:var(--glow-t);animation:slideUp .5s ease}
.score-arc{width:150px;height:150px;border-radius:50%;margin:0 auto 24px;position:relative;display:flex;align-items:center;justify-content:center}
.score-arc::before{content:'';position:absolute;inset:14px;background:var(--s1);border-radius:50%}
.score-num{position:relative;z-index:1;font-size:36px;font-weight:900}
.stats-row{display:flex;gap:12px;justify-content:center;margin-bottom:24px;flex-wrap:wrap}
.stat-box{background:var(--s2);border:1px solid var(--b1);border-radius:12px;padding:14px 18px;min-width:88px}
.stat-val{font-size:24px;font-weight:900}
.stat-lbl{font-size:11px;color:var(--muted);margin-top:3px}
.ans-item{background:var(--s2);border:1px solid var(--b1);border-radius:12px;padding:14px 16px;margin-bottom:10px;display:flex;align-items:flex-start;gap:10px;font-size:14px;line-height:1.6}

/* LOADING */
.loading-ctr{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;text-align:center;padding:24px}
.spinner{width:52px;height:52px;border:3px solid var(--b1);border-top-color:var(--teal);border-radius:50%;animation:spin .8s linear infinite}
.loading-txt{color:var(--muted);font-size:15px}
.dot::after{content:'...';animation:dots 1.2s steps(4,end) infinite}
@keyframes dots{0%{content:'.'}33%{content:'..'}66%{content:'...'}100%{content:'.'}}

/* MISC */
.shield-row{display:flex;align-items:center;gap:8px;background:rgba(0,229,200,.06);border:1px solid rgba(0,229,200,.2);border-radius:10px;padding:10px 14px;font-size:13px;color:var(--teal);margin-top:14px}
.ip-reset-note{background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.25);border-radius:10px;padding:11px 14px;font-size:13px;color:var(--gold);display:flex;align-items:center;gap:8px;margin-top:10px}
.divider{height:1px;background:var(--b1);margin:22px 0}
.empty{color:var(--muted);text-align:center;padding:40px;font-size:15px}

@keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes ssflash{0%{opacity:1}100%{opacity:0}}
`;

/* ═══════════════════════════════════════════════════════
   LANG SWITCHER
═══════════════════════════════════════════════════════ */
function LangSwitcher({ lang, setLang }) {
  return (
    <div className="lang-bar">
      <button className={`lang-btn${lang==="ar"?" active":""}`} onClick={()=>setLang("ar")}>عربي</button>
      <button className={`lang-btn${lang==="en"?" active":""}`} onClick={()=>setLang("en")}>EN</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CREDITS COMPONENT
═══════════════════════════════════════════════════════ */
function Credits({ t }) {
  return (
    <div className="credits">
      <div className="credits-title">
        {t.createdBy} {t.by}
      </div>
      <div className="credits-devs">
        <a href="https://www.instagram.com/26i_q" target="_blank" rel="noopener noreferrer" className="dev-link">
          <div className="dev-avatar" style={{background:"linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)"}}>
            <span className="ig-icon">📸</span>
          </div>
          <div>
            <div className="dev-name">{t.dev1Name}</div>
            <div className="dev-ig">@26i_q</div>
          </div>
        </a>
        <a href="https://www.instagram.com/u.8yy" target="_blank" rel="noopener noreferrer" className="dev-link">
          <div className="dev-avatar" style={{background:"linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)"}}>
            <span className="ig-icon">📸</span>
          </div>
          <div>
            <div className="dev-name">{t.dev2Name}</div>
            <div className="dev-ig">@u.8yy</div>
          </div>
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   GOOGLE LOGIN MODAL
═══════════════════════════════════════════════════════ */
function GoogleModal({ role, t, onSuccess, onClose }) {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr]     = useState("");
  const [busy, setBusy]   = useState(false);

  const submit = async () => {
    if (!name.trim() || !email.trim()) { setErr(t.fillAll); return; }
    if (!email.includes("@"))          { setErr(t.badEmail); return; }
    setBusy(true); setErr("");

    if (role === "student") {
      const reg = await store.get("student-registry") || {};
      const ip  = await getIP();
      const fp  = getFingerprint();
      const ex  = reg[email];
      if (ex) {
        const age = Date.now() - (ex.registeredAt || 0);
        if (age >= IP_LOCK_MS) {
          // 3h passed — allow new IP, reset lock
          reg[email] = { ...ex, ip, fp, registeredAt: Date.now(), ipResetAt: nowStr() };
          if (ex.status !== "done" && ex.status !== "blocked") reg[email].status = "active";
          await store.set("student-registry", reg);
          if (ex.status === "done")    { setErr(t.alreadyDone); setBusy(false); return; }
          if (ex.status === "blocked") { setErr(t.blocked);     setBusy(false); return; }
          onSuccess({ name: ex.name, email, ip, fp }); setBusy(false); return;
        }
        // still within 3h lock
        if (ex.ip !== ip) {
          const remaining = Math.ceil((IP_LOCK_MS - age) / 3600000);
          setErr(t.blockedIP(ex.ip, remaining)); setBusy(false); return;
        }
        if (ex.status === "blocked") { setErr(t.blocked);     setBusy(false); return; }
        if (ex.status === "done")    { setErr(t.alreadyDone); setBusy(false); return; }
        onSuccess({ name: ex.name, email, ip, fp }); setBusy(false); return;
      }
      // brand new student
      reg[email] = { name: name.trim(), email, ip, fp, registeredAt: Date.now(), status: "active" };
      await store.set("student-registry", reg);
      onSuccess({ name: name.trim(), email, ip, fp });
    } else {
      onSuccess({ name: name.trim(), email });
    }
    setBusy(false);
  };

  const fontCls = t.dir === "rtl" ? "font-ar" : "font-en";

  return (
    <div className="modal-bg">
      <div className={`google-modal ${fontCls}`} style={{direction: t.dir, textAlign: t.dir==="rtl"?"right":"left"}}>
        <div className="g-logo">🔵</div>
        <div className="g-title" style={{textAlign:"center"}}>{t.googleLogin}</div>
        <div className="g-sub"  style={{textAlign:"center"}}>{role==="teacher" ? t.teacherGate : t.studentGate}</div>
        {err && <div className="g-err">{err}</div>}
        <input className="g-field" style={{direction:t.dir}} placeholder={t.fullName} value={name}  onChange={e=>setName(e.target.value)}  />
        <input className="g-field" style={{direction:t.dir}} type="email" placeholder={t.email}    value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} />
        <button className="g-btn" onClick={submit} disabled={busy}>{busy ? t.checking : t.continue}</button>
        <br/><button className="g-cancel" onClick={onClose}>{t.cancel}</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TEACHER DASHBOARD
═══════════════════════════════════════════════════════ */
function TeacherDash({ user, lang, t, onLogout }) {
  const [tab,      setTab]      = useState("setup");
  const [cfg,      setCfg]      = useState({ subject:"", count:10, duration:20, questions: normalizeQuestionArray([], 10) });
  const [saved,    setSaved]    = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [students, setStudents] = useState([]);
  const [results,  setResults]  = useState({});

  const load = useCallback(async () => {
    const c = await store.get("exam-config");
    if (c) { setCfg({ ...c, questions: normalizeQuestionArray(c.questions, c.count || 10) }); setSaved(true); }
    const reg = await store.get("student-registry") || {};
    const res = await store.get("student-results")  || {};
    setStudents(Object.values(reg)); setResults(res);
    
    const storageListener = () => {
      load();
    };
    window.addEventListener("storage", storageListener);
    return () => window.removeEventListener("storage", storageListener);
  }, []);

  useEffect(()=>{ load(); },[load]);

  const save = async () => {
    if (!cfg.subject.trim()) return;
    setSaving(true);
    const examId = cfg.id || "exam-" + Date.now();
    const data = { ...cfg, id: examId, questions: normalizeQuestionArray(cfg.questions, cfg.count), lang, teacherEmail:user.email, savedAt:nowStr(), published: true };
    await store.set("exam-config", data);
    await store.set("published-exams", { ...(await store.get("published-exams") || {}), [examId]: data });
    setSaved(true); setSaving(false);
  };

  const reset = async () => {
    if (!confirm(t.confirmDelete)) return;
    await store.del("exam-config"); await store.del("student-registry"); await store.del("student-results");
    setCfg({ subject:"", count:10, duration:20, questions: normalizeQuestionArray([], 10) }); setSaved(false); setStudents([]); setResults({});
  };

  const blockStudent = async (email) => {
    const reg = await store.get("student-registry") || {};
    if (!reg[email]) return;
    reg[email].status = "blocked";
    await store.set("student-registry", reg);
    setStudents(Object.values(reg));
    alert(t.studentBanned);
  };

  const unblockStudent = async (email) => {
    const reg = await store.get("student-registry") || {};
    if (!reg[email]) return;
    reg[email].status = "active";
    await store.set("student-registry", reg);
    setStudents(Object.values(reg));
    alert(t.studentUnbanned);
  };

  const badge = (s, email) => {
    const r   = results[email];
    const age = Date.now() - (s.registeredAt||0);
    if (r)                    return <span className="badge bg">✅ {Math.round(r.score/r.total*100)}%</span>;
    if (s.status==="blocked") return <span className="badge br">🚫 {t.blockedLabel}</span>;
    if (age >= IP_LOCK_MS)    return <span className="badge bo">🔄</span>;
    return <span className="badge by">⏳</span>;
  };

  const ipSt = (s) => {
    const age = Date.now() - (s.registeredAt||0);
    if (age >= IP_LOCK_MS) return <span style={{color:"var(--orange)",fontSize:11}}>{t.ipFree}</span>;
    const h = Math.ceil((IP_LOCK_MS-age)/3600000);
    return <span style={{color:"var(--muted)",fontSize:11}}>{t.ipLocked(h)}</span>;
  };

  const fontCls = t.dir==="rtl"?"font-ar":"font-en";
  const align   = t.dir==="rtl"?"right":"left";

  const durLabels = [[5,t.mins[0]],[10,t.mins[1]],[15,t.mins[2]],[20,t.mins[3]],[30,t.mins[4]],[45,t.mins[5]],[60,t.mins[6]],[120,t.mins[7]],[180,t.mins[8]]];

  return (
    <div className={`shell ${fontCls}`} style={{direction:t.dir}}>
      <div className="topbar">
        <div className="topbar-left">
          <div className="avatar av-t">{user.name[0]}</div>
          <div><div className="user-name">{user.name}</div><div className="user-role">{t.teacher} · {user.email}</div></div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn-blue" onClick={()=>{
            const nextTab = tab==="setup"?"students":"setup";
            setTab(nextTab);
            if(nextTab==="students") load();
          }}>
            {tab==="setup" ? t.studentsTab : t.setupTab}
          </button>
          <button className="logout-btn" onClick={onLogout}>{t.logout}</button>
        </div>
      </div>

      {tab==="setup" && <>
        <div className="card">
          <div className="card-title">📚 {t.examSetup}</div>
          <div className="field">
            <label>{t.subjectName}</label>
            <input style={{textAlign:align}} placeholder={t.subjectPH} value={cfg.subject}
              onChange={e=>setCfg(p=>({...p,subject:e.target.value}))} />
          </div>
          <div className="row2">
            <div className="field">
              <label>{t.questionCount}</label>
              <select value={cfg.count} onChange={e=>setCfg(p=>({ ...p, count:+e.target.value, questions: normalizeQuestionArray(p.questions, +e.target.value) }))}>
                {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="field">
              <label>{t.duration}</label>
              <select value={cfg.duration} onChange={e=>setCfg(p=>({...p,duration:+e.target.value}))}>
                {durLabels.map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="card" style={{marginTop:20,padding:16,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16}}>
            <div style={{fontSize:16,fontWeight:700,marginBottom:12}}>{t.questions} {t.question}</div>
            {cfg.questions.map((q, qi) => (
              <div key={qi} style={{marginBottom:20,padding:12,background:"rgba(0,0,0,0.08)",borderRadius:12}}>
                <div style={{marginBottom:10,fontWeight:700}}>{t.question} {qi + 1}</div>
                <div className="row2">
                  <div className="field" style={{flex:1}}>
                    <label>{t.questionType}</label>
                    <select value={q.type} onChange={e=>setCfg(p=>{
                      const next = [...p.questions];
                      const type = e.target.value;
                      const item = { ...next[qi], type };
                      if (type === "mc") {
                        item.optionCount = item.optionCount || 4;
                        item.options = normalizeQuestionArray([item], 1)[0].options;
                      } else {
                        item.options = [];
                        item.correct = 0;
                      }
                      next[qi] = item;
                      return { ...p, questions: next };
                    })}>
                      <option value="mc">{t.typeMC}</option>
                      <option value="text">{t.typeText}</option>
                      <option value="image">{t.typeImage}</option>
                    </select>
                  </div>
                  {q.type === "mc" && (
                    <div className="field" style={{maxWidth:220}}>
                      <label>{t.optionCount}</label>
                      <select value={q.optionCount} onChange={e=>setCfg(p=>{
                        const next = [...p.questions];
                        const item = { ...next[qi], optionCount:+e.target.value };
                        item.options = normalizeQuestionArray([item], 1)[0].options;
                        if (item.correct >= item.optionCount) item.correct = 0;
                        next[qi] = item;
                        return { ...p, questions: next };
                      })}>
                        {[3,4,5].map(n=><option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  )}
                </div>
                <div className="field">
                  <label>{t.questionTextLabel}</label>
                  <textarea value={q.text} onChange={e=>setCfg(p=>{
                    const next = [...p.questions];
                    next[qi] = { ...next[qi], text: e.target.value };
                    return { ...p, questions: next };
                  })} style={{minHeight:64}} placeholder={t.questionTextPlaceholder} />
                </div>
                {q.type === "mc" ? (
                  <>
                    <div className="row2">
                      {q.options.map((opt, oi) => (
                        <div className="field" key={oi}>
                          <label>{`${t.optionLabel} ${String.fromCharCode(65 + oi)}`}</label>
                          <input value={opt} onChange={e=>setCfg(p=>{
                            const next = [...p.questions];
                            const item = { ...next[qi], options: [...next[qi].options] };
                            item.options[oi] = e.target.value;
                            next[qi] = item;
                            return { ...p, questions: next };
                          })} />
                        </div>
                      ))}
                    </div>
                    <div className="field" style={{maxWidth:220}}>
                      <label>{t.correctOption}</label>
                      <select value={q.correct} onChange={e=>setCfg(p=>{
                        const next = [...p.questions];
                        next[qi] = { ...next[qi], correct: +e.target.value };
                        return { ...p, questions: next };
                      })}>
                        {Array.from({ length: q.optionCount }, (_, i) => i).map(i=><option key={i} value={i}>{String.fromCharCode(65 + i)}</option>)}
                      </select>
                    </div>
                  </>
                ) : (
                  <div style={{fontSize:13,color:"var(--muted)",marginTop:10}}>{q.type==="text"?t.openAnswerNote:t.imageAnswerNote}</div>
                )}
                <div className="field">
                  <label>{t.questionImageLabel} ({t.optional})</label>
                  <input type="file" accept="image/*" onChange={async e=>{
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const data = await fileToBase64(file);
                    setCfg(p=>{
                      const next = [...p.questions];
                      next[qi] = { ...next[qi], image: `data:${file.type};base64,${data}` };
                      return { ...p, questions: next };
                    });
                  }} />
                  {q.image && (
                    <div style={{marginTop:12,position:"relative",display:"inline-block"}}>
                      <img src={q.image} alt="question" style={{maxWidth:"100%",maxHeight:200,borderRadius:8}} />
                      <button onClick={()=>setCfg(p=>{
                        const next = [...p.questions];
                        next[qi] = { ...next[qi], image: "" };
                        return { ...p, questions: next };
                      })} style={{position:"absolute",top:-8,right:-8,width:24,height:24,borderRadius:"50%",background:"var(--red)",border:"none",color:"white",cursor:"pointer",fontSize:16}}>×</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <button className="btn-teal" onClick={save} disabled={saving||!cfg.subject}>
              {saving ? t.saving : saved ? t.update : t.savePublish}
            </button>
            {saved && <button className="btn-red" onClick={reset}>{t.deleteAll}</button>}
          </div>
          {saved && <div className="shield-row">{t.examActive}</div>}
        </div>

        <div className="card">
          <div className="card-title">{t.protection}</div>
          {[
            ["🔒", t.dir==="rtl"?"قفل IP لـ 3 ساعات":"3-Hour IP Lock",
              t.dir==="rtl"?"كل طالب مقفول بـ IP الخاص به لمدة 3 ساعات. بعدها يُسمح بتغيير IP لدعم الطلاب المتنقلين.":"Each student is IP-locked for 3 hours. After that, IP change is allowed to support mobile students."],
            ["📸", t.dir==="rtl"?"منع لقطة الشاشة":"Screenshot Prevention",
              t.dir==="rtl"?"نكشف PrintScreen وننبّه فوراً + علامة مائية بيانات الطالب (اسم + IP) على الشاشة بالكامل.":"We detect PrintScreen and alert immediately + student watermark (name + IP) covers the entire screen."],
            ["🤖", t.dir==="rtl"?"أسئلة يحددها المدرس":"Instructor-Defined Questions",
              t.dir==="rtl"?"الأسئلة تُحدّد يدويًا من التدريسي وتُطبق على جميع الطلاب.":"Questions are defined manually by the instructor and applied to all students."],
            ["📎", t.dir==="rtl"?"صور وملفات للمادة":"Images & Files for Material",
              t.dir==="rtl"?"التدريسي يرفع صورًا أو ملفات نصية لدعم محتوى الامتحان.":"Instructor uploads images or text files to support the exam material."],
            ["👁️", t.dir==="rtl"?"كشف التبديل":"Tab Switch Detection",
              t.dir==="rtl"?"3 مخالفات (خروج عن النافذة / PrintScreen / اختصارات محظورة) = إيقاف تلقائي.":"3 violations (tab switch / PrintScreen / banned shortcuts) = auto session stop."],
          ].map(([icon,title,desc])=>(
            <div key={title} style={{display:"flex",gap:12,marginBottom:16}}>
              <div style={{fontSize:24,flexShrink:0}}>{icon}</div>
              <div><strong style={{fontSize:14}}>{title}</strong>
                <div style={{fontSize:13,color:"var(--muted)",marginTop:3,lineHeight:1.6}}>{desc}</div></div>
            </div>
          ))}
        </div>
      </>}

      {tab==="students" && (
        <div className="card">
          <div className="card-title">{t.students} ({students.length})</div>
          {students.length===0 ? <div className="empty">{t.noStudents}</div> : (
            <div style={{overflowX:"auto"}}>
              <table className="tbl">
                <thead><tr style={{textAlign:align}}>
                  <th>{t.name}</th><th>{t.emailH}</th><th>{t.ip}</th><th>{t.fingerprint}</th>
                  <th>{t.ipStatus}</th><th>{t.status}</th><th>{t.action}</th>
                </tr></thead>
                <tbody>
                  {students.map(s=>(
                    <tr key={s.email}>
                      <td><strong>{s.name}</strong></td>
                      <td className="mono">{s.email}</td>
                      <td className="mono" style={{color:"var(--teal)"}}>{s.ip}</td>
                      <td className="mono">{s.fp?.slice(0,8)}…</td>
                      <td>{ipSt(s)}</td>
                      <td>{badge(s,s.email)}</td>
                      <td>{s.status==="blocked" ?
                        <button className="btn-blue" onClick={()=>unblockStudent(s.email)}>{t.unblock}</button>
                        : !results[s.email] && <button className="btn-red" onClick={()=>blockStudent(s.email)}>{t.block}</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {Object.keys(results).length>0 && <>
            <div className="divider"/>
            <div className="card-title">{t.results}</div>
            {Object.entries(results).map(([email,r])=>{
              const s=students.find(x=>x.email===email);
              const pct=Math.round(r.score/r.total*100);
              return (
                <div key={email} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                  background:"var(--s2)",border:"1px solid var(--b1)",borderRadius:10,padding:"12px 16px",marginBottom:10,flexWrap:"wrap",gap:8}}>
                  <div><strong>{s?.name||email}</strong><div className="mono" style={{marginTop:2}}>{email} · {s?.ip}</div></div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:24,fontWeight:900,color:pct>=80?"var(--green)":pct>=60?"var(--gold)":"var(--red)"}}>{pct}%</div>
                    <div style={{fontSize:12,color:"var(--muted)"}}>{r.score}/{r.total}</div>
                  </div>
                  <div style={{fontSize:12,color:"var(--muted)"}}>
                    <div>{t.violations}: {r.violations||0}</div>
                    <div>{t.screenshots}: {r.ssAttempts||0}</div>
                    <div style={{fontSize:11}}>{r.completedAt}</div>
                  </div>
                </div>
              );
            })}
          </>}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STUDENT EXAM
═══════════════════════════════════════════════════════ */
function StudentExam({ user, lang, t, onLogout }) {
  const [phase,   setPhase]   = useState("loading");
  const [cfg,     setCfg]     = useState(null);
  const [qs,      setQs]      = useState([]);
  const [cur,     setCur]     = useState(0);
  const [ans,     setAns]     = useState({});
  const [shown,   setShown]   = useState(false);
  const [viols,   setViols]   = useState([]);
  const [ssCount, setSS]      = useState(0);
  const [ssFlash, setFlash]   = useState(false);
  const [timeLeft,setTL]      = useState(0);
  const [blockMsg,setBlock]   = useState("");
  const [error,   setError]   = useState("");

  const timerRef = useRef(null);
  const violRef  = useRef(0);
  const ssRef    = useRef(0);
  const MAX_V    = 3;
  const wmCSS    = makeWatermarkCSS(user.name, user.ip);

  useEffect(()=>{ loadExam(); },[]);

  const loadExam = async () => {
    const config = await store.get("exam-config");
    const publishedExams = await store.get("published-exams") || {};
    const availableExam = config || Object.values(publishedExams)[0];
    if (!availableExam) { setPhase("noexam"); return; }
    const res = await store.get("student-results") || {};
    if (res[user.email]) {
      setQs(res[user.email].questions||[]); setAns(res[user.email].answers||{});
      setCfg(availableExam); setPhase("results"); return;
    }
    setCfg(availableExam); setPhase("ready");
  };

  const start = () => {
    setError("");
    const examLang = cfg.lang || lang;
    const questions = (cfg.questions && cfg.questions.length >= cfg.count)
      ? cfg.questions.slice(0, cfg.count).map((q, index) => {
          const type = q.type || "mc";
          const optionCount = type === "mc" ? Math.min(5, Math.max(3, q.optionCount || q.options?.length || 4)) : 0;
          return {
            id: index + 1,
            level: q.level || (examLang === "ar" ? "فهم" : "comprehension"),
            text: q.text || "",
            image: q.image || "",
            type,
            optionCount,
            options: type === "mc" ? Array.from({ length: optionCount }, (_, i) => q.options?.[i] || (examLang === "ar" ? `خيار ${i+1}` : `Option ${i+1}`)) : [],
            correct: type === "mc" ? (typeof q.correct === "number" ? q.correct : 0) : 0,
          };
        })
      : normalizeQuestionArray(cfg.questions, cfg.count);
    setQs(questions);
    setTL(cfg.duration * 60);
    setPhase("exam");
  };

  /* ── Anti-cheat ── */
  useEffect(()=>{
    if (phase!=="exam") return;

    const onKeyUp = (e) => {
      if (e.key==="PrintScreen") {
        ssRef.current+=1; setSS(ssRef.current);
        setFlash(true); setTimeout(()=>setFlash(false),500);
        try { navigator.clipboard.writeText("🚫 Screenshots are blocked during the exam."); } catch {}
        addV("PrintScreen");
      }
    };
    const onKeyDown = (e) => {
      const blocked = (e.ctrlKey||e.metaKey) && ["p","s","u","c","v","a"].includes(e.key.toLowerCase());
      if (blocked || e.key==="F12") { e.preventDefault(); addV(e.key.toUpperCase()); }
    };
    const onVis  = () => { if(document.hidden) addV(lang==="ar"?"مغادرة النافذة":"Tab Switch"); };
    const onBlur = () => addV(lang==="ar"?"فقدان التركيز":"Window Blur");
    const onCtx  = (e) => { e.preventDefault(); addV(lang==="ar"?"قائمة السياق":"Context Menu"); };
    const onCopy = (e) => { e.preventDefault(); addV(lang==="ar"?"محاولة نسخ":"Copy Attempt"); };
    const onPaste = (e) => { e.preventDefault(); addV(lang==="ar"?"محاولة لصق":"Paste Attempt"); };
    const onTouchStart = (e) => { if (e.touches.length > 1) { e.preventDefault(); addV(lang==="ar"?"تكبير/تصغير":"Pinch Zoom"); } };
    const onSelectStart = (e) => { e.preventDefault(); addV(lang==="ar"?"محاولة تحديد":"Text Selection"); };

    document.addEventListener("keyup",            onKeyUp);
    document.addEventListener("keydown",          onKeyDown);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("blur",               onBlur);
    document.addEventListener("contextmenu",      onCtx);
    document.addEventListener("copy",             onCopy);
    document.addEventListener("paste",            onPaste);
    document.addEventListener("touchstart",       onTouchStart, { passive: false });
    document.addEventListener("selectstart",      onSelectStart);

    return () => {
      document.removeEventListener("keyup",            onKeyUp);
      document.removeEventListener("keydown",          onKeyDown);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("blur",               onBlur);
      document.removeEventListener("contextmenu",      onCtx);
      document.removeEventListener("copy",             onCopy);
      document.removeEventListener("paste",            onPaste);
      document.removeEventListener("touchstart",       onTouchStart);
      document.removeEventListener("selectstart",      onSelectStart);
    };
  }, [phase, lang]);

  const addV = useCallback((msg) => {
    violRef.current += 1;
    const v = { msg, time: new Date().toLocaleTimeString(), n: violRef.current };
    setViols(prev => {
      const next = [...prev, v];
      if (violRef.current >= MAX_V) {
        clearInterval(timerRef.current);
        setBlock(lang==="ar"?`تم رصد ${MAX_V} مخالفات — تم إيقاف الجلسة تلقائياً`:`${MAX_V} violations detected — session stopped automatically`);
        setPhase("blocked");
        store.get("student-registry").then(reg=>{
          if(reg&&reg[user.email]){reg[user.email].status="blocked";store.set("student-registry",reg);}
        });
      }
      return next;
    });
  }, [user.email, lang]);

  /* ── Timer ── */
  useEffect(()=>{
    if (phase!=="exam") return;
    timerRef.current = setInterval(()=>{
      setTL(p=>{ if(p<=1){clearInterval(timerRef.current);finish(true);return 0;} return p-1; });
    },1000);
    return ()=>clearInterval(timerRef.current);
  },[phase]);

  const finish = async (auto=false) => {
    clearInterval(timerRef.current);
    const score = qs.reduce((sum,q,i)=>{
      const answer = ans[i];
      if (answer === undefined) return sum;
      if (typeof answer === "object") {
        return q.type === "mc" && answer.type === "mc" && answer.value === q.correct ? sum + 1 : sum;
      }
      return q.type === "mc" && answer === q.correct ? sum + 1 : sum;
    }, 0);
    const data  = { score, total:qs.length, answers:ans, questions:qs,
                    violations:violRef.current, ssAttempts:ssRef.current, completedAt:nowStr(), autoSubmit:auto };
    const res   = await store.get("student-results") || {};
    res[user.email] = data;
    await store.set("student-results", res);
    const reg = await store.get("student-registry") || {};
    if (reg[user.email]) { reg[user.email].status="done"; await store.set("student-registry",reg); }
    setPhase("results");
  };

  const select  = (i) => { if(shown)return; setAns(p=>({...p,[cur]:{ type: "mc", value:i }})); };
  const confirm = () => {
    const answer = ans[cur];
    if (answer === undefined) return;
    if (typeof answer === "object" && answer.type === "text" && !answer.value?.trim()) return;
    if (typeof answer === "object" && answer.type === "image" && !answer.value) return;
    setShown(true);
  };
  const next    = () => { setShown(false); if(cur+1>=qs.length)finish(); else setCur(p=>p+1); };
  const LETTERS = lang==="ar" ? ["أ","ب","ج","د","هـ"] : ["A","B","C","D","E"];
  const currentAnswer = ans[cur];
  const currentType = currentAnswer !== undefined && typeof currentAnswer === "object" ? currentAnswer.type : "mc";
  const selected = currentAnswer !== undefined && typeof currentAnswer === "object" ? currentAnswer.value : currentAnswer;
  const isAnswered = currentAnswer !== undefined && (currentType !== "text" ? (currentType !== "image" ? true : !!currentAnswer.value) : !!currentAnswer.value?.trim());
  const fontCls = t.dir==="rtl"?"font-ar":"font-en";

  /* PHASES */
  if (phase==="loading")    return <div className={`loading-ctr ${fontCls}`}><div className="spinner"/><div className="loading-txt">{t.verifying}</div></div>;
  if (phase==="generating") return <div className={`loading-ctr ${fontCls}`}><div className="spinner"/><div className={`loading-txt dot`}>{t.generating}</div><div style={{color:"var(--muted)",fontSize:13,maxWidth:340,marginTop:8}}>{t.generatingSub}</div></div>;

  if (phase==="noexam") return (
    <div className={`shell ${fontCls}`} style={{direction:t.dir}}>
      <div className="card" style={{textAlign:"center",padding:52}}>
        <div style={{fontSize:52,marginBottom:16}}>📭</div>
        <div style={{fontSize:20,fontWeight:800,marginBottom:8}}>{t.noExam}</div>
        <div style={{color:"var(--muted)",marginBottom:24}}>{t.noExamSub}</div>
        <button className="btn-teal" onClick={loadExam}>{t.retry}</button>
      </div>
    </div>
  );

  if (phase==="ready") return (
    <div className={`shell ${fontCls}`} style={{direction:t.dir}}>
      <div className="topbar">
        <div className="topbar-left">
          <div className="avatar av-s">{user.name[0]}</div>
          <div><div className="user-name">{user.name}</div><div className="user-role">{user.email}</div></div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div className="ip-chip">🌐 {user.ip}</div>
          <button className="logout-btn" onClick={onLogout}>{t.logout}</button>
        </div>
      </div>
      <div className="card" style={{textAlign:"center",padding:48}}>
        <div style={{fontSize:56,marginBottom:16}}>📋</div>
        <div style={{fontSize:26,fontWeight:900,marginBottom:8}}>{cfg?.subject}</div>
        <div style={{color:"var(--muted)",marginBottom:28,fontSize:15}}>
          {cfg?.count} {t.questions} · {cfg?.duration} {t.minutes}
        </div>
        <div className="shield-row" style={{maxWidth:460,margin:"0 auto 10px",justifyContent:"center"}}>
          🔒 {t.ipLock} <strong style={{fontFamily:"monospace",marginRight:4,marginLeft:4}}>{user.ip}</strong>
        </div>
        <div className="ip-reset-note" style={{maxWidth:460,margin:"0 auto 26px"}}>
          {t.ipResetNote}
        </div>
        {t.rules.map(r=>(
          <div key={r} style={{textAlign:t.dir==="rtl"?"right":"left",margin:"7px auto",maxWidth:440,fontSize:14,color:"var(--muted)"}}>{r}</div>
        ))}
        {error && <div style={{color:"var(--red)",fontSize:13,fontWeight:700,marginTop:16}}>{error}</div>}
        <button className="btn-teal" style={{marginTop:28,minWidth:210,fontSize:17}} onClick={start}>{t.startExam}</button>
      </div>
    </div>
  );

  if (phase==="blocked") return (
    <div className={`sec-ov ${fontCls}`} style={{direction:t.dir}}>
      <div className="sec-icon">🚫</div>
      <div className="sec-title">{t.sessionStopped}</div>
      <div className="sec-msg">{blockMsg}</div>
      <div className="sec-msg" style={{marginTop:10,fontSize:13}}>
        {viols.map((v,i)=><div key={i} style={{marginBottom:4}}>[{v.time}] #{v.n}: {v.msg}</div>)}
      </div>
      <div style={{color:"var(--muted)",fontSize:13,marginTop:8}}>{t.contactTeacher}</div>
    </div>
  );

  if (phase==="results") {
    const score = qs.reduce((sum,q,i)=>{
      const answer = ans[i];
      if (answer === undefined) return sum;
      if (typeof answer === "object") {
        return q.type === "mc" && answer.type === "mc" && answer.value === q.correct ? sum + 1 : sum;
      }
      return q.type === "mc" && answer === q.correct ? sum + 1 : sum;
    }, 0);
    const pct   = qs.length>0?Math.round(score/qs.length*100):0;
    const grade = pct>=90?"A+":pct>=80?"A":pct>=70?"B":pct>=60?"C":"F";
    const color = pct>=80?"var(--green)":pct>=60?"var(--gold)":"var(--red)";
    return (
      <div className={`res-wrap ${fontCls}`} style={{direction:t.dir}}>
        <div className="res-card">
          <div className="score-arc" style={{background:`conic-gradient(${color} ${pct}%, var(--s2) 0%)`}}>
            <div className="score-num" style={{color}}>{pct}%</div>
          </div>
          <div style={{fontSize:24,fontWeight:800,marginBottom:6}}>
            {pct>=80?t.excellent:pct>=60?t.good:t.study}
          </div>
          <div style={{color:"var(--muted)",marginBottom:24}}>{user.name} · {cfg?.subject}</div>
          <div className="stats-row">
            {[[score,"var(--green)",t.correct],[qs.length-score,"var(--red)",t.wrong],[grade,"var(--gold)",t.grade],[ssCount,"var(--orange)",t.screenshots],[viols.length,"var(--red)",t.violations]].map(([v,c,l])=>(
              <div key={l} className="stat-box"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div></div>
            ))}
          </div>
          <div className="shield-row" style={{justifyContent:"center",marginBottom:20}}>🔒 {user.ip}</div>
          <div style={{fontWeight:800,marginBottom:12,fontSize:15,textAlign:t.dir==="rtl"?"right":"left"}}>{t.answerDetails}</div>
          {qs.map((q,i)=>{
            const answer = ans[i];
            const type = answer !== undefined && typeof answer === "object" ? answer.type : "mc";
            const ok = q.type === "mc" && type === "mc" && answer?.value === q.correct;
            let userLabel = t.notAnswered;
            if (answer !== undefined) {
              if (type === "mc") userLabel = q.options[answer.value] ?? t.notAnswered;
              else if (type === "text") userLabel = answer.value || t.notAnswered;
              else if (type === "image") userLabel = answer.value ? t.imageAttached : t.notAnswered;
            }
            return (
              <div key={i} className="ans-item" style={{direction:t.dir}}>
                <div style={{fontSize:18,flexShrink:0}}>{ok?"✅":q.type==="mc"?"❌":"➖"}</div>
                <div style={{textAlign:t.dir==="rtl"?"right":"left"}}>
                  <div style={{fontWeight:600,marginBottom:4}}>{t.question}{i+1}: {q.text.slice(0,90)}{q.text.length>90?"...":""}</div>
                  <div style={{fontSize:12,color:"var(--muted)"}}>
                    {t.yourAnswer} {userLabel}
                    {q.type === "mc" && type === "mc" ? (
                      <> · {t.correct2} <span style={{color:"var(--green)"}}>{q.options[q.correct]}</span></>
                    ) : q.type !== "mc" ? (
                      <> · {t.notGraded}</>
                    ) : null}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* EXAM UI */
  const q   = qs[cur];
  const sel = ans[cur];
  return (
    <div className={`exam-protected ${fontCls}`} style={{minHeight:"100vh",direction:t.dir}}>
      <div className="watermark-layer" style={{backgroundImage:wmCSS}}/>
      {ssFlash && <div className="ss-flash"/>}
      <div className="exam-shell">
        {ssCount>0 && <div className="ss-bar">📸 {t.ssWarning(ssCount)}</div>}
        {viols.length>0 && (
          <div className="viol-bar">
            <span>⚠️ {viols[viols.length-1].msg}</span>
            <span style={{fontWeight:700}}>{t.violWarning(viols.length, MAX_V, MAX_V-viols.length)}</span>
          </div>
        )}
        <div className="exam-hdr">
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div className="avatar av-s">{user.name[0]}</div>
            <div><div style={{fontWeight:700}}>{user.name}</div>
              <div style={{fontSize:12,color:"var(--muted)"}}>{user.email} · 🌐{user.ip}</div></div>
          </div>
          <div className={`timer${timeLeft<300?" danger":timeLeft<600?" warn":""}`}>{fmtTime(timeLeft)}</div>
        </div>
        <div className="prog-wrap">
          <div className="prog-track"><div className="prog-fill" style={{width:`${((cur+1)/qs.length)*100}%`}}/></div>
          <div style={{fontSize:13,color:"var(--muted)",whiteSpace:"nowrap"}}>
            {t.question}{cur+1} {t.of} {qs.length}
          </div>
        </div>
        <div className="q-card">
          <div className="q-meta">
            <span className="q-num">{t.question} {cur+1}</span>
            {q.level && <span className="q-level">{q.level}</span>}
          </div>
          <div className="q-text">{q.text}</div>
          {q.image && <img className="q-img" src={q.image} alt=""/>}
          {q.type === "mc" ? (
            <div className="opts">
              {q.options.map((opt,i)=>{
                let cls="opt";
                if(selected===i)cls+=" sel";
                if(shown&&i===q.correct)cls+=" ok";
                if(shown&&selected===i&&i!==q.correct)cls+=" bad";
                return (
                  <button key={i} className={cls} onClick={()=>select(i)} disabled={shown}
                    style={{textAlign:t.dir==="rtl"?"right":"left"}}>
                    <span className="opt-letter">{LETTERS[i]}</span>
                    <span style={{flex:1}}>{opt}</span>
                    {shown&&i===q.correct&&<span>✅</span>}
                    {shown&&selected===i&&i!==q.correct&&<span>❌</span>}
                  </button>
                );
              })}
            </div>
          ) : q.type === "text" ? (
            <div className="field">
              <label>{t.yourAnswer}</label>
              <textarea value={currentAnswer?.type === "text" ? currentAnswer.value : ""}
                onChange={e=>setAns(p=>({ ...p, [cur]: { type: "text", value: e.target.value } }))}
                style={{minHeight:120, width:"100%"}}
                placeholder={t.writeAnswerPlaceholder} />
            </div>
          ) : (
            <div className="field">
              <label>{t.attachImageLabel}</label>
              <input type="file" accept="image/*" onChange={async e=>{
                const file = e.target.files?.[0];
                if (!file) return;
                const data = await fileToBase64(file);
                setAns(p=>({ ...p, [cur]: { type: "image", value: `data:${file.type};base64,${data}` } }));
              }} />
              {currentAnswer?.type === "image" && currentAnswer.value && (
                <img src={currentAnswer.value} alt="uploaded" style={{marginTop:12,maxWidth:"100%",borderRadius:12}} />
              )}
            </div>
          )}

          <div className="nav-row">
            <div style={{fontSize:13,color:"var(--muted)"}}>{t.answered(Object.keys(ans).length+"/"+qs.length)}</div>
            {!shown
              ? <button className="btn-confirm" onClick={confirm} disabled={!isAnswered}>{t.confirmAnswer}</button>
              : <button className="btn-confirm" onClick={next}>{cur+1>=qs.length?t.finishExam:t.nextQ}</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════ */
export default function App() {
  const [lang,     setLang]     = useState("ar");
  const [role,     setRole]     = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [user,     setUser]     = useState(null);

  const t      = T[lang];
  const fontCls = t.dir==="rtl" ? "font-ar" : "font-en";

  const login  = (u) => { setUser(u); setShowAuth(false); };
  const logout = () => { setUser(null); setRole(null); };

  return (
    <>
      <style>{CSS}</style>
      <div className={`root ${fontCls}`} style={{direction:t.dir}}>
        <LangSwitcher lang={lang} setLang={setLang} />

        {!user && (
          <div className="role-wrap">
            <div className="role-box">
              <div className="brand">🎓</div>
              <div className="brand-title">{t.platformTitle}</div>
              <div className="brand-sub">{t.platformSub}</div>
              <div className="start-image-wrap">
                <img className="start-image" src={startImage} alt="hero" />
              </div>
              <div className="role-cards">
                <div className="role-card t" onClick={()=>{setRole("teacher");setShowAuth(true)}}>
                  <div className="role-icon">👨‍🏫</div>
                  <div className="role-name">{t.teacher}</div>
                  <div className="role-desc">{t.teacherDesc}</div>
                </div>
                <div className="role-card" onClick={()=>{setRole("student");setShowAuth(true)}}>
                  <div className="role-icon">👨‍🎓</div>
                  <div className="role-name">{t.student}</div>
                  <div className="role-desc">{t.studentDesc}</div>
                </div>
              </div>
              <Credits t={t} />
            </div>
          </div>
        )}

        {showAuth && (
          <GoogleModal role={role} t={t} onSuccess={login} onClose={()=>{setShowAuth(false);setRole(null)}}/>
        )}

        {user && role==="teacher" && <TeacherDash user={user} lang={lang} t={t} onLogout={logout}/>}
        {user && role==="student" && <StudentExam user={user} lang={lang} t={t} onLogout={logout}/>}
      </div>
    </>
  );
}
