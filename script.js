/* ============================================================
   AGON - тендерное сопровождение. Скрипт страницы.
   Плиты (герой: грани листа собираются на интро по --intro и расходятся
   по --stay; плиты услуг: грани фоном сходятся по --enter, объект
   въезжает по --enter) · меню · бегущая строка · язык RU/EN в файле,
   KZ - отдельным файлом assets/lang/kk.js по выбору человека ·
   WhatsApp с текстом по услуге · счётчики · форма в WhatsApp.
   Библиотек нет. Обработчик кликов tel/wa - только в фазе захвата на window
   (совместимость с LeadBot: трекер дописывает код обращения к готовой ссылке).
   ============================================================ */
(function(){
"use strict";

var WA = "77477953403";
var ASSET_V = ((document.currentScript && document.currentScript.src.match(/[?&]v=([^&]+)/)) || [])[1] || "";
var RED = matchMedia("(prefers-reduced-motion: reduce)").matches;
var HAS_IO = typeof IntersectionObserver === "function";
var root = document.documentElement;

/* ---------------- КОНВЕРСИИ GOOGLE ADS (ярлыки задаст index.html через window.CO_CONV) ---------------- */
function conv(key){
  var id = (window.CO_CONV || {})[key];
  if (!id || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", {send_to: id, value: 1.0, currency: "USD", transport_type: "beacon"});
}

/* ---------------- АНГЛИЙСКИЙ СЛОВАРЬ (русский - снимок из разметки) ---------------- */
var EN = {
  "m.title":"Tender support in Kazakhstan - AGON: tender analysis, bid preparation and review",
  "m.desc":"One-off tender and public procurement services across Kazakhstan: pre-bid tender analysis from 20,000 KZT, turnkey bid preparation, review of a ready bid, complaints and objections, full tender support. 10+ years in procurement, 100+ tenders won. Free 15-minute consultation.",
  "m.ogt":"Tender support in Kazakhstan - AGON",
  "m.ogd":"Tender analysis, bid preparation and review, complaints, full tender support. One-off service from 20,000 KZT. 10+ years, 100+ tenders won. First consultation free.",
  "a.home":"AGON - home","a.nav":"Sections","a.lang":"Site language","a.call":"Call +7 747 795 34 03","a.menu":"Menu","a.price":"Price list",
  "n.uslugi":"Services","n.ceny":"Prices","n.akcii":"Offers","n.process":"How we work","n.faq":"FAQ","n.kontakty":"Contacts",
  "mn.note":"Remote, all of Kazakhstan · Mon-Fri 9:00-18:00, Sat 10:00-15:00",
  "h.kicker":"All of Kazakhstan · remote","h.kicker2":" · public and commercial procurement",
  "h.t1":"Tender support","h.t2":"for your specific task",
  "h.lead":"Tender analysis, bid preparation and review, complaints and objections - as a one-off service from 20,000 KZT or as a full cycle. 10+ years in procurement, a WhatsApp reply within 5-10 minutes.",
  "h.b1":"Free tender assessment","h.b2":"Services and prices",
  "mq.list":"Pre-bid tender analysis|Turnkey bid preparation|Bid review|Full tender support|Specific tender support|Complaints and objections|Competitor and price analysis|Procurement consultations",
  "p1.k":"Before bidding","p1.t":"Tender analysis and check","p1.l":"Is it worth bidding: we read the documentation, qualification requirements and contract terms, and weigh the risks.",
  "p1.b1":"Verdict: bid or not, and why","p1.b2":"Risks as a list: requirements, deadlines, penalties, competitors","p1.b3":"What to collect so the bid is admitted",
  "p1.p":"from 20,000 KZT","p1.pn":"preliminary tender assessment - free","p1.b":"Order analysis","c.allp":"All prices",
  "o1.tag":"Lot 2024-1182","o1.r1":"risk","o1.st":"Verdict: bid","o1.st2":"2 risks, both covered by documents",
  "p2.k":"Turnkey","p2.t":"Bid preparation","p2.l":"We assemble the whole bid: technical part, price proposal, qualification documents - and submit it on the portal.",
  "p2.b1":"Technical specification and description","p2.b2":"Price proposal with calculation","p2.b3":"Portal submission and control until opening",
  "p2.p":"from 50,000 KZT","p2.pn":"submission of a ready bid - from 30,000 KZT","p2.b":"Order a bid",
  "o2.t1":"Technical part","o2.t2":"Price proposal","o2.t3":"Qualification","o2.st":"Bid submitted","o2.st2":"2 days 14 hours until opening",
  "p3.k":"Before submission","p3.t":"Review of a ready bid","p3.l":"You prepared the bid yourself - we check it against every requirement while the error can still be fixed.",
  "p3.b1":"Check against every requirement of the documentation","p3.b2":"Remarks as a list: what to fix and how to prove it","p3.b3":"Re-check after corrections",
  "p3.p":"from 30,000 KZT","p3.pn":"10% off when ordering two or more services","p3.b":"Review my bid",
  "o3.tag":"Check against requirements","o3.fix":"fix","o3.st":"8 of 9 items in order","o3.st2":"1 remark: prove experience with a contract",
  "p4.k":"Ongoing","p4.t":"Full tender support","p4.l":"An outsourced tender department: we select procurements, prepare and submit bids, handle correspondence and complaints, and report every month.",
  "p4.b1":"Daily selection of tenders matching your profile","p4.b2":"Bids, clarifications, objections - in one pair of hands","p4.b3":"A report at the end of every month",
  "p4.p":"from 150,000 KZT/month","p4.pn":"+ 2% of the value of tenders won","p4.b":"Discuss support",
  "o4.w":"won","o4.st":"Month: 12 bids","o4.st2":"3 won, 4 under review",
  "p5.k":"One specific tender","p5.t":"Support for a specific tender","p5.l":"We run your lot from publication to results: clarifications, bid, opening, admission - and objections if something goes wrong.",
  "p5.b1":"Clarification requests to the customer","p5.b2":"Bid, submission, admission control","p5.b3":"Objections and complaints in case of rejection",
  "p5.p":"Price - per tender","p5.pn":"quoted after a free lot assessment","p5.b":"Send a link to the lot",
  "o5.s1":"Publication","o5.s2":"Clarifications","o5.s3":"Bid submitted","o5.s4":"Opening and admission","o5.s5":"Results","o5.now":"now",
  "u.k":"One-off services","u.t":"Came with one task - order one service","u.l":"No subscription or commitments. Describe the situation on WhatsApp - we will say which service you need and how long it takes.",
  "u1.t":"Tender consultation","u1.d":"Review of your situation, the steps to take, answers to questions.","u1.p":"25,000 KZT",
  "u2.t":"Objections, appeals, complaints","u2.d":"If your bid was rejected or the procurement terms break the law.","u2.p":"from 40,000 KZT",
  "u3.t":"Loss analysis","u3.d":"Why you did not pass and what to change in the next bid.","u3.p":"20,000 KZT",
  "u4.t":"Competitor and price analysis","u4.d":"Who bids in your procurements and at what prices they win.","u4.p":"from 40,000 KZT",
  "u5.t":"Bid submission","u5.d":"Documents are ready - we submit on the portal correctly and on time.","u5.p":"from 30,000 KZT",
  "u6.t":"Training","u6.d":"For the employee who will run tenders in-house: portal, documents, typical mistakes.","u6.p":"from 50,000 KZT",
  "c.order":"Order",
  "c.k":"Prices","c.t":"Price list","c.l":"The exact amount - after a free tender assessment. Payment by bank transfer or via Kaspi.",
  "c1.n":"Tender consultation","c1.p":"25,000 KZT","c2.n":"Analysis of the ToR and qualification requirements","c2.p":"from 20,000 KZT",
  "c3.n":"Review of a ready bid","c3.p":"from 30,000 KZT","c4.n":"Bid preparation","c4.p":"from 50,000 KZT","c5.n":"Bid submission","c5.p":"from 30,000 KZT",
  "c6.n":"Objection, appeal or complaint","c6.p":"from 40,000 KZT","c7.n":"Loss analysis","c7.p":"20,000 KZT","c8.n":"Competitor and price analysis","c8.p":"from 40,000 KZT",
  "c9.n":"Training","c9.p":"from 50,000 KZT","c10.n":"Full tender support","c10.p":"from 150,000 KZT/month + 2% of tenders won",
  "c.note":"Two or more one-off services at once - 10% off the whole order.","c.b":"Get an exact quote",
  "ak.k":"Offers","ak.t":"Free, to get started",
  "ak1.t":"Consultation up to 15 minutes","ak1.d":"The first conversation about your tender is free. You will know what to do next.",
  "ak2.t":"Tender assessment before ordering","ak2.d":"Send a link to the lot - we look at it and say whether bidding makes sense, before any payment.",
  "ak3.t":"10% off for two services","ak3.d":"Order two or more one-off services at the same time - 10% off the whole order.",
  "w.k":"Why AGON","w.t":"Experience that counts in contracts",
  "w.n1":"years in tenders and procurement","w.n2":"tenders won","w.n3u":"bn KZT","w.n3":"total value of contracts signed",
  "w.r1":"We know the public procurement law and the practice of commercial procurement in Kazakhstan, not just the portal",
  "w.r2":"We look beyond documents at risks: requirements, competition, prices, contract terms",
  "w.r3":"A separate service for your task - no need to buy ongoing support",
  "w.r4":"We will say honestly if bidding is not worth it. Nobody can guarantee a win - we deliver a prepared bid",
  "pr.k":"How we work","pr.t":"From a message to the result",
  "pr1.t":"Write on WhatsApp","pr1.d":"A link to the lot or a description of the task. Reply within 5-10 minutes in working hours.",
  "pr2.t":"Free assessment","pr2.d":"We look at the tender and name the service, timing and price. The decision is yours.",
  "pr3.t":"Payment","pr3.d":"Bank transfer to the company account or remotely via Kaspi.",
  "pr4.t":"Work and result","pr4.d":"A verdict, a bid or a complaint - on time, with explanations in plain language.",
  "f.k":"FAQ","f.t":"If tenders are new to you",
  "f1.q":"I have never bid in a tender. Where do I start?","f1.a":"With a free consultation of up to 15 minutes. Tell us what you sell or do - we will explain which procurements suit you, what is needed to bid and what it will cost.",
  "f2.q":"Do you guarantee winning the tender?","f2.a":"No, and nobody can: the customer decides the results under the procurement rules. We are responsible for a bid that meets the requirements, is submitted on time, and risks you know in advance. If bidding is not worth it, we will say so before payment.",
  "f3.q":"Do you work with commercial procurement or only public?","f3.a":"Both: public procurement, procurement of the quasi-public sector and subsoil users, commercial tenders of companies.",
  "f4.q":"What do you need from me?","f4.a":"A link to the lot or a description of the task, and company documents from the list we send. The rest is our job.",
  "f5.q":"How long does bid preparation take?","f5.a":"It depends on the size of the documentation and the lot deadline. We name the timing at the assessment stage and meet the procurement deadline.",
  "f6.q":"You are in another city. How will we work?","f6.a":"Everything is remote: WhatsApp, email, the procurement portal. This is how we have worked with clients across Kazakhstan for over 10 years.",
  "fm.k":"Request","fm.t":"Describe the task - we reply on WhatsApp","fm.l":"A link to the lot, the deadline and what is already ready. The first consultation of up to 15 minutes is free.",
  "fm.name":"Name","fm.nameph":"How to address you","fm.phone":"Phone","fm.msg":"Task","fm.msgph":"Link to the lot, deadline, what you need",
  "fm.err":"Please enter your name and phone.","fm.ok":"Thank you. WhatsApp opened with your message. If the window did not appear, write directly: +7 747 795 34 03.",
  "fm.b":"Send via WhatsApp","fm.note":"The button opens a WhatsApp chat with a ready text. The data is not sent anywhere else.",
  "k.k":"Contacts","k.t":"Remote, all of Kazakhstan","k.tel":"Phone","k.wa":"Write on WhatsApp","k.mail":"Email","k.hrs":"Hours","k.hrsv":"Mon-Fri 9:00-18:00, Sat 10:00-15:00","k.geo":"Coverage","k.geov":"All cities of Kazakhstan, online",
  "ft.legal":"WEBCUSTOMS LLP, BIN 161040013660","ft.copy":"Tender support in Kazakhstan",
  "ft.note":"Procurement results are decided by the customer. We do not promise a win - we prepare a bid that meets the requirements.",
  "bar.call":"Call"
};
var RU_MQ = "Анализ тендера перед участием|Подготовка заявки под ключ|Проверка готовой заявки|Комплексное сопровождение|Сопровождение конкретного тендера|Возражения и жалобы|Анализ конкурентов и цен|Консультации по закупкам";
var I18N = {en: EN};
var RU = {};

/* ---------------- ТЕКСТЫ WhatsApp ПО УСЛУГАМ ----------------
   data-wa="hero|analiz|zayavka|proverka|soprovozhdenie|tender|konsult|ceny|kontakty";
   konsult подставляет название карточки из data-wa-title (ключ i18n). */
var WA_T = {
  ru:{
    hero:"Здравствуйте! Пишу с сайта AGON. Нужна помощь с тендером. Ссылка на лот или задача: ",
    analiz:"Здравствуйте! Пишу с сайта AGON.\nУслуга: анализ и проверка тендера перед участием.\nСсылка на лот: ",
    zayavka:"Здравствуйте! Пишу с сайта AGON.\nУслуга: подготовка тендерной заявки под ключ.\nСсылка на лот и срок подачи: ",
    proverka:"Здравствуйте! Пишу с сайта AGON.\nУслуга: проверка готовой заявки.\nСсылка на лот и срок подачи: ",
    soprovozhdenie:"Здравствуйте! Пишу с сайта AGON.\nИнтересует комплексное тендерное сопровождение.\nЧем занимается компания: ",
    tender:"Здравствуйте! Пишу с сайта AGON.\nНужно сопровождение участия в конкретном тендере.\nСсылка на лот: ",
    konsult:"Здравствуйте! Пишу с сайта AGON.\nУслуга: {name}.\nМоя ситуация: ",
    ceny:"Здравствуйте! Пишу с сайта AGON. Хочу узнать точную цену. Задача: ",
    kontakty:"Здравствуйте! Пишу с сайта AGON. Вопрос: "
  },
  en:{
    hero:"Hello! I'm writing from the AGON website. I need help with a tender. Link to the lot or task: ",
    analiz:"Hello! I'm writing from the AGON website.\nService: pre-bid tender analysis.\nLink to the lot: ",
    zayavka:"Hello! I'm writing from the AGON website.\nService: turnkey bid preparation.\nLink to the lot and deadline: ",
    proverka:"Hello! I'm writing from the AGON website.\nService: review of a ready bid.\nLink to the lot and deadline: ",
    soprovozhdenie:"Hello! I'm writing from the AGON website.\nI'm interested in full tender support.\nWhat the company does: ",
    tender:"Hello! I'm writing from the AGON website.\nI need support for a specific tender.\nLink to the lot: ",
    konsult:"Hello! I'm writing from the AGON website.\nService: {name}.\nMy situation: ",
    ceny:"Hello! I'm writing from the AGON website. I'd like an exact quote. Task: ",
    kontakty:"Hello! I'm writing from the AGON website. Question: "
  }
};
function curLang(){ return root.getAttribute("lang") || "ru"; }
function tr(key){
  var d = I18N[curLang()];
  return (d && d[key]) || RU[key] || "";
}
function waText(kind, titleKey){
  var L = curLang(), T = WA_T[L] || WA_T.ru;
  if (L === "kk" && window.SITE_KK && window.SITE_KK.__wa) T = window.SITE_KK.__wa;
  var t = T[kind] || T.hero;
  if (titleKey) t = t.replace("{name}", tr(titleKey));
  return t;
}
function setWaHrefs(){
  document.querySelectorAll("[data-wa]").forEach(function(a){
    a.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(waText(a.dataset.wa, a.dataset.waTitle));
    a.target = "_blank"; a.rel = "noopener";
  });
}
window.addEventListener("click", function(e){
  var a = e.target.closest ? e.target.closest("a[href]") : null;
  if (!a) return;
  var h = a.getAttribute("href") || "";
  if (a.dataset.wa) {
    a.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(waText(a.dataset.wa, a.dataset.waTitle));
    conv("contact");
  } else if (h.indexOf("tel:") === 0) conv("phone");
  else if (h.indexOf("mailto:") === 0) conv("mail");
}, true);

/* ---------------- ЯЗЫК ---------------- */
function snapshot(){
  document.querySelectorAll("[data-i]").forEach(function(el){ RU[el.dataset.i] = el.textContent; });
  document.querySelectorAll("[data-i-ph]").forEach(function(el){ RU[el.dataset.iPh] = el.getAttribute("placeholder"); });
  document.querySelectorAll("[data-i-aria]").forEach(function(el){ RU[el.dataset.iAria] = el.getAttribute("aria-label"); });
  document.querySelectorAll("[data-i-c]").forEach(function(el){ RU[el.dataset.iC] = el.getAttribute("content"); });
  RU["mq.list"] = RU_MQ;
}
function applyLang(lang){
  var d = lang === "ru" ? RU : (I18N[lang] || RU);
  function g(k){ return d[k] != null ? d[k] : RU[k]; }
  document.querySelectorAll("[data-i]").forEach(function(el){ var v = g(el.dataset.i); if (v != null) el.textContent = v; });
  document.querySelectorAll("[data-i-ph]").forEach(function(el){ var v = g(el.dataset.iPh); if (v != null) el.setAttribute("placeholder", v); });
  document.querySelectorAll("[data-i-aria]").forEach(function(el){ var v = g(el.dataset.iAria); if (v != null) el.setAttribute("aria-label", v); });
  document.querySelectorAll("[data-i-c]").forEach(function(el){ var v = g(el.dataset.iC); if (v != null) el.setAttribute("content", v); });
  root.setAttribute("lang", lang);
  document.querySelectorAll(".lang button").forEach(function(b){
    var on = b.dataset.lang === lang;
    b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  try { localStorage.setItem("agon-lang", lang); } catch(e){}
  fillTicker(g("mq.list"));
  setWaHrefs();
}
/* казахский словарь - отдельным файлом, только по выбору человека */
function loadLang(lang, done){
  if (I18N[lang] || lang !== "kk") return done();
  var s = document.createElement("script");
  s.src = "assets/lang/kk.js" + (ASSET_V ? "?v=" + ASSET_V : "");
  s.onload = function(){ if (window.SITE_KK) I18N.kk = window.SITE_KK; done(); };
  s.onerror = function(){ done(); };
  document.head.appendChild(s);
}
function setLang(lang){
  if (["ru","kk","en"].indexOf(lang) < 0) lang = "ru";
  loadLang(lang, function(){ applyLang((I18N[lang] || lang === "ru") ? lang : "ru"); });
}
document.querySelectorAll(".lang button").forEach(function(b){ b.addEventListener("click", function(){ setLang(b.dataset.lang); }); });
function initLang(){
  var q = new URLSearchParams(location.search).get("lang"), saved = null;
  try { saved = localStorage.getItem("agon-lang"); } catch(e){}
  var L = q || saved || "ru";
  if (L !== "ru") setLang(L); else { fillTicker(RU_MQ); setWaHrefs(); }
}

/* ---------------- БЕГУЩАЯ СТРОКА ГЕРОЯ (шаг цикла - одна копия списка) ---------------- */
function fillTicker(list){
  var el = document.getElementById("mq1"); if (!el) return;
  var one = (list || RU_MQ).split("|").map(function(t){ return "<b>" + t + "</b>"; }).join("");
  el.innerHTML = one;
  var w = el.scrollWidth || 1000;
  var need = Math.max(2, Math.ceil((innerWidth * 2) / w) + 1);
  var html = "";
  for (var i = 0; i < need; i++) html += one;
  el.innerHTML = html;
  el.style.setProperty("--tkw", w + "px");
  el.style.setProperty("--tkd", Math.max(28, w / 30) + "s");
}

/* ---------------- МЕНЮ ---------------- */
var burger = document.getElementById("burger");
var mnav = document.getElementById("mnav");
function closeMenu(){
  document.body.classList.remove("menu-open");
  if (burger) burger.setAttribute("aria-expanded", "false");
}
if (burger) burger.addEventListener("click", function(){
  var open = document.body.classList.toggle("menu-open");
  burger.setAttribute("aria-expanded", open ? "true" : "false");
});
if (mnav) mnav.addEventListener("click", function(e){ if (e.target.closest("a")) closeMenu(); });
addEventListener("keydown", function(e){ if (e.key === "Escape") closeMenu(); });

/* ---------------- ЯКОРЯ ---------------- */
var HH = function(){ return parseFloat(getComputedStyle(root).getPropertyValue("--hh")) || 72; };
function targetTop(t){
  return t.getBoundingClientRect().top + scrollY - (t.classList.contains("pw") ? 0 : HH());
}
document.addEventListener("click", function(e){
  var a = e.target.closest('a[href^="#"]'); if (!a) return;
  var id = a.getAttribute("href").slice(1); if (!id) return;
  var t = document.getElementById(id); if (!t) return;
  e.preventDefault();
  closeMenu();
  scrollTo({ top: Math.max(0, targetTop(t)), behavior: RED ? "auto" : "smooth" });
  try { history.pushState(null, "", "#" + id); } catch(err){}
});

/* ---------------- ШАПКА ---------------- */
var hdr = document.getElementById("hdr");
function hdrState(){ if (hdr) hdr.classList.toggle("solid", scrollY > 40); }

/* ---------------- ПЛИТЫ И ИНТРО ГЕРОЯ ---------------- */
function clamp(v){ return v < 0 ? 0 : (v > 1 ? 1 : v); }
function easeOut(t){ return 1 - Math.pow(1 - t, 3); }
var pws = [].slice.call(document.querySelectorAll(".pw"));
var heroPw = document.getElementById("top");
var hero = document.getElementById("hero");
var bar = document.getElementById("bar");
var kont = document.getElementById("kontakty");
var introK = 1, introDone = true;
var DBG = new URLSearchParams(location.search);
var dbgIntro = parseFloat(DBG.get("intro")), dbgEnter = parseFloat(DBG.get("enter"));

function update(){
  var H = innerHeight || root.clientHeight;
  var onKont = kont && kont.getBoundingClientRect().top < H * 0.6;
  if (root.classList.contains("no-plate")) {
    hdrState();
    if (bar) bar.classList.toggle("show", scrollY > H * 0.55 && !onKont);
    return;
  }
  pws.forEach(function(pw){
    var r = pw.getBoundingClientRect();
    var enter = clamp(1 - r.top / H);
    var exit  = clamp(1 - r.bottom / H);
    var stay  = r.height > H + 1 ? clamp(-r.top / (r.height - H)) : enter;
    if (!isNaN(dbgEnter) && pw !== heroPw) enter = dbgEnter;
    pw.style.setProperty("--enter", enter.toFixed(3));
    pw.style.setProperty("--exit",  exit.toFixed(3));
    pw.style.setProperty("--stay",  stay.toFixed(3));
    pw.classList.toggle("gone", exit >= 1);
    pw.classList.toggle("on", enter > 0.58);
    if (pw === heroPw) {
      var ip = introDone ? 1 : easeOut(introK);
      if (!isNaN(dbgIntro)) ip = dbgIntro;
      pw.style.setProperty("--intro", ip.toFixed(4));
    }
  });
  hdrState();
  if (bar) bar.classList.toggle("show", scrollY > H * 0.55 && !onKont);
}
if (RED) {
  root.classList.add("no-plate");
  root.classList.add("no-intro");
  if (hero) hero.classList.add("on");
  pws.forEach(function(pw){ pw.classList.add("on"); });
  addEventListener("scroll", update, {passive:true});
  update();
} else {
  var tick = false;
  addEventListener("scroll", function(){
    if (tick) return; tick = true;
    requestAnimationFrame(function(){ tick = false; update(); });
  }, {passive:true});
  addEventListener("load", update);
  /* интро 1300 мс: грани листа слетаются в одну плоскость, текст поднимается.
     Пропускаем при хэше / прокрутке - человек из рекламы сразу видит собранный экран. */
  var skip = location.hash || scrollY > 80;
  if (skip) {
    root.classList.add("no-intro");
    if (hero) hero.classList.add("on");
    update();
  } else {
    introK = 0; introDone = false; update();
    var t0 = null;
    var step = function(ts){
      if (introDone) return;
      if (t0 === null) t0 = ts;
      var p = clamp((ts - t0) / 1300);
      introK = p;
      if (p > .25 && hero) hero.classList.add("on");
      update();
      if (p < 1) requestAnimationFrame(step);
      else { introDone = true; update(); }
    };
    requestAnimationFrame(function(){ requestAnimationFrame(step); });
    setTimeout(function(){ if (hero) hero.classList.add("on"); }, 700);
    setTimeout(function(){ if (!introDone) { introDone = true; introK = 1; update(); } }, 2400);
  }
}
[1500, 3000, 5000].forEach(function(ms){ setTimeout(update, ms); });
window.plateSync = function(){ introDone = true; introK = 1; if (hero) hero.classList.add("on"); update(); };
addEventListener("hashchange", function(){ root.classList.add("no-intro"); });
/* прямой переход по хэшу: после загрузки довести до цели (плиты меняют высоту после расчёта svh) */
if (location.hash) {
  var ht = document.getElementById(location.hash.slice(1));
  if (ht) [60, 400, 1200].forEach(function(ms){ setTimeout(function(){ scrollTo({top: Math.max(0, targetTop(ht)), behavior: "auto"}); update(); }, ms); });
}

var rsTimer;
addEventListener("resize", function(){
  update();
  clearTimeout(rsTimer);
  rsTimer = setTimeout(function(){ fillTicker(tr("mq.list")); update(); }, 200);
});

/* ---------------- ПОЯВЛЕНИЕ В КАТАЛОЖНЫХ СЕКЦИЯХ + СЧЁТЧИКИ ---------------- */
function runCount(b){
  var to = parseInt(b.dataset.count, 10), t0 = null;
  if (RED || !to) { b.textContent = to; return; }
  var step = function(ts){
    if (t0 === null) t0 = ts;
    var p = clamp((ts - t0) / 1400), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
    b.textContent = v;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function reveal(el){
  el.classList.add("in");
  el.querySelectorAll("[data-count]").forEach(runCount);
}
if (HAS_IO && !RED) {
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if (!e.isIntersecting) return;
      reveal(e.target);
      io.unobserve(e.target);
    });
  }, {threshold:.08, rootMargin:"0px 0px -6% 0px"});
  document.querySelectorAll(".rv").forEach(function(el){ io.observe(el); });
  setTimeout(function(){ document.querySelectorAll(".rv:not(.in)").forEach(function(el){
    if (el.getBoundingClientRect().top < innerHeight) { reveal(el); io.unobserve(el); }
  }); }, 1500);
} else {
  document.querySelectorAll(".rv").forEach(reveal);
}

/* ---------------- ФОРМА → WhatsApp ---------------- */
var form = document.getElementById("form");
if (form) form.addEventListener("submit", function(e){
  e.preventDefault();
  var ok = document.getElementById("fmok"), err = document.getElementById("fmerr");
  if (form.website && form.website.value) return;          /* honeypot */
  var name = form.name.value.trim(), phone = form.phone.value.trim(), msg = form.msg.value.trim();
  if (!name || phone.replace(/\D/g, "").length < 10) { err.hidden = false; ok.hidden = true; return; }
  err.hidden = true;
  var L = curLang();
  var head = L === "en" ? "Hello! Request from the AGON website." : (L === "kk" && window.SITE_KK && window.SITE_KK.__form ? window.SITE_KK.__form.head : "Здравствуйте! Заявка с сайта AGON.");
  var lbl = L === "en" ? ["Name","Phone","Task"] : (L === "kk" && window.SITE_KK && window.SITE_KK.__form ? window.SITE_KK.__form.lbl : ["Имя","Телефон","Задача"]);
  var t = head + "\n" + lbl[0] + ": " + name + "\n" + lbl[1] + ": " + phone + (msg ? "\n" + lbl[2] + ": " + msg : "");
  ok.hidden = false;
  conv("lead");
  window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(t), "_blank", "noopener");
});

/* ---------------- СТАРТ ---------------- */
snapshot();
initLang();
hdrState();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ fillTicker(tr("mq.list")); update(); });
})();
