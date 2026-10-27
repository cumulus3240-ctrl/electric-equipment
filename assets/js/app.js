/* LX International \u00b7 Power Equipment promotion \u2014 view rendering, routing, i18n (EN / JA) */
(function () {
  "use strict";

  var EN = window.LXI;                         // English master data (data.js)
  var I18N = window.LXI_I18N || { ui: { en: {} }, content: {} };
  var LANGS = ["en", "ja"];
  var lang = "en";
  var D = EN;                                  // data for the current language
  var T = I18N.ui.en;                          // UI strings for the current language
  var app = document.getElementById("app");
  var homeScroll = 0;
  var current = null;
  var cameFromHome = false;
  var heroWatch = null;

  // ---------------------------------------------------------------- helpers
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function isTBD(v) {
    return v == null || String(v).trim() === "" || String(v).trim().toUpperCase() === "TBD";
  }
  // keep compound words ("Three-phase", "step-up") on one line by using non-breaking hyphens
  function nb(s) {
    return s.replace(/(\w)-(\w)/g, "$1\u2011$2");
  }
  function val(v, note) {
    if (isTBD(v)) return '<span class="tbd">TBD</span>';
    return nb(esc(v)) + (note ? '<small>' + esc(note) + '</small>' : "");
  }
  function pad2(n) {
    return String(n).padStart(2, "0");
  }
  function fmt(s, vars) {
    return String(s).replace(/\{(\w+)\}/g, function (m, k) { return vars && k in vars ? vars[k] : m; });
  }
  // deep merge: objects by key, arrays by index (holes / missing keys keep the base value)
  function merge(base, over) {
    if (over === undefined) return base;
    if (Array.isArray(base) && Array.isArray(over)) {
      var n = Math.max(base.length, over.length), out = [];
      for (var i = 0; i < n; i++) out.push(i < base.length ? merge(base[i], over[i]) : over[i]);
      return out;
    }
    if (base && over && typeof base === "object" && typeof over === "object" && !Array.isArray(over)) {
      var o = {};
      Object.keys(base).forEach(function (k) { o[k] = base[k]; });
      Object.keys(over).forEach(function (k) { o[k] = merge(base[k], over[k]); });
      return o;
    }
    return over;
  }
  function telHref(number) {
    return "tel:" + number.replace(/[^+\d]/g, "");
  }
  // WhatsApp: a solution page goes to that solution's contact (mobile number), the home page to CONTACT.whatsapp
  function waContact(sol) {
    var W = D.CONTACT.whatsapp, k = sol && sol.contact;
    if (!W) return null;
    var name = k ? k.name : W.name;
    return { name: name, number: k ? k.phone : W.number, text: W.text ? fmt(W.text, { name: name.split(" ")[0] }) : "" };
  }
  function waHref(w) {
    return "https://wa.me/" + w.number.replace(/\D/g, "") + (w.text ? "?text=" + encodeURIComponent(w.text) : "");
  }

  // Outlook-safe mailto: ASCII only (classic Outlook garbles UTF-8 in mailto) and CRLF line breaks (RFC 6068)
  function ascii(s) {
    return s.replace(/[\u2010-\u2015\u2212]/g, "-").replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"')
      .replace(/\u00b7/g, "-").replace(/[^\t\n\r\x20-\x7E]/g, "");
  }
  // RFC 6068: recipients comma-separated (Outlook, Apple Mail, Gmail and mobile clients all accept this form)
  function addrList(list) {
    return (list || []).map(function (a) { return String(a).trim(); })
      .filter(function (a) { return /^[^\s@,;?&]+@[^\s@,;?&]+\.[^\s@,;?&]+$/.test(a); }).join(",");
  }
  // mail drafts are always English (product names come from the English master data)
  function mailParts(product) {
    var M = EN.CONTACT.mail;
    return {
      subject: ascii(M.subject.replace("{product}", product || M.generalProduct)),
      body: ascii(M.body.replace("{product}", product ? "the " + product : M.generalBodyProduct))
    };
  }
  function solById(list, id) {
    return id ? list.filter(function (s) { return s.id === id; })[0] || null : null;
  }
  // To = the solution's contact (home page: the general To list); CC = every other team address, in the original order
  function recipients(solId) {
    var M = EN.CONTACT.mail, all = M.to.concat(M.cc), sol = solById(EN.SOLUTIONS, solId);
    var to = sol && sol.contact ? [sol.contact.email] : M.to.slice();
    var cc = all.filter(function (a, i) { return all.indexOf(a) === i && to.indexOf(a) < 0; });
    return { to: to, cc: cc };
  }
  function mailHref(product, solId) {
    var r = recipients(solId), p = mailParts(product), cc = addrList(r.cc);
    return "mailto:" + addrList(r.to) + "?" + (cc ? "cc=" + cc + "&" : "") +
      "subject=" + encodeURIComponent(p.subject) + "&body=" + encodeURIComponent(p.body.replace(/\r?\n/g, "\r\n"));
  }

  var I = {
    arrow: '<path d="M5 12h14M13 5l7 7-7 7"/>',
    back: '<path d="M19 12H5M11 5l-7 7 7 7"/>',
    mail: '<path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/>',
    phone: '<path d="M7.2 3.5h-2a1.7 1.7 0 0 0-1.7 1.8A16.6 16.6 0 0 0 18.7 20.5a1.7 1.7 0 0 0 1.8-1.7v-2a1 1 0 0 0-.8-1l-3.4-.8a1 1 0 0 0-1 .3l-1.4 1.5a12.5 12.5 0 0 1-6.7-6.7L8.7 8.7a1 1 0 0 0 .3-1l-.8-3.4a1 1 0 0 0-1-.8z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    expand: '<path d="M14 4h6v6M10 20H4v-6M20 4l-6.5 6.5M4 20l6.5-6.5"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/>',
    phase: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    freq: '<path d="M2.5 12c1.6-5.5 3.2-5.5 4.8 0s3.2 5.5 4.8 0 3.2-5.5 4.8 0 3.2 5.5 4.6 0"/>',
    volt: '<path d="M13 2.5L5 13.5h6.5L10.5 21.5l8-11h-6.5z"/>',
    gauge: '<path d="M4 17a8.5 8.5 0 1 1 16 0"/><path d="M12 14.5l4-4.5"/><circle cx="12" cy="15" r="1.3"/>',
    drop: '<path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z"/>',
    tap: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
    std: '<path d="M12 3l7 3v6c0 4.4-3 7.4-7 9-4-1.6-7-4.6-7-9V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.3 2"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    grid: '<path d="M12 2.5L7 21.5M12 2.5l5 19M5.5 7h13M7.5 12h9M6.3 17h11.4M5.5 7v2.5M18.5 7v2.5"/>',
    power: '<path d="M13 2.5L5 13.5h6.5L10.5 21.5l8-11h-6.5z"/>',
    server: '<rect x="4" y="3.5" width="16" height="7" rx="1.5"/><rect x="4" y="13.5" width="16" height="7" rx="1.5"/><path d="M8 7h.01M8 17h.01M12 7h4M12 17h4"/>',
    battery: '<rect x="2.5" y="7" width="16" height="10" rx="2"/><path d="M21.5 10.5v3"/><path d="M11 9l-2.5 3.5h3L9 15.5"/>',
    factory: '<path d="M3 21V10l5 3V10l5 3V5h4l1 16z"/><path d="M3 21h18"/>',
    ship: '<path d="M3 15l2 5h14l2-5z"/><path d="M6 15V9h12v6M12 4v5"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 4.5a3.2 3.2 0 0 1 0 6.3M21 20c0-2.6-1.6-4.8-4-5.6"/>',
    shield: '<path d="M12 3l7 3v6c0 4.4-3 7.4-7 9-4-1.6-7-4.6-7-9V6z"/>',
    truck: '<path d="M2.5 6h11v10h-11zM13.5 10h4l3 3v3h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    rocket: '<path d="M12 15l-3-3c1.5-5 4.5-8 10-9-1 5.5-4 8.5-9 10z"/><path d="M9 12l-4 1-2 3 4-.5M12 15l-1 4-3 2 .5-4"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
    award: '<circle cx="12" cy="9" r="5.5"/><path d="M8.5 13.5L7 21l5-2.5 5 2.5-1.5-7.5"/>',
    container: '<rect x="2.5" y="6.5" width="19" height="11" rx="1"/><path d="M7 9v6M10.5 9v6M14 9v6M17.5 9v6"/>'
  };
  function icon(name, cls) {
    return '<svg class="ico ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + I[name] + '</svg>';
  }
  // WhatsApp glyph (green disc, white chat bubble + handset)
  function waIcon() {
    return '<svg class="wa-ico" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><circle cx="16" cy="16" r="16" fill="#25D366"/>' +
      '<path fill="none" stroke="#fff" stroke-width="2.1" stroke-linejoin="round" d="M16 7.4a8.6 8.6 0 0 0-7.4 13l-1.2 4.3 4.4-1.2A8.6 8.6 0 1 0 16 7.4z"/>' +
      '<path fill="#fff" d="M12.9 11.6c.2-.4.4-.5.7-.5h.5c.2 0 .4 0 .6.4l.8 1.8c.1.2 0 .4-.1.6l-.5.6c-.1.2-.2.3 0 .5.4.7 1 1.4 1.6 1.9.6.5 1.2.8 1.5.9.2.1.3 0 .5-.1l.6-.8c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.3.4.5 0 .3-.1 1-.5 1.4-.5.5-1.3.8-2.1.6-1.2-.2-2.7-.9-4-2.1-1.4-1.3-2.3-2.8-2.5-3.9-.2-.8.1-1.5.5-2z"/></svg>';
  }
  var SOL_ICON = { "power": "power", "data-center": "server", "ess": "battery" };

  // ---------------------------------------------------------------- language
  function detectLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q && LANGS.indexOf(q) >= 0) return q;
    try {
      var s = localStorage.getItem("lxi-lang");
      if (s && LANGS.indexOf(s) >= 0) return s;
    } catch (e) { /* storage unavailable */ }
    return "en";
  }
  function applyLang(l) {
    lang = l;
    D = l === "en" ? EN : merge(EN, (I18N.content || {})[l] || {});
    T = l === "en" ? I18N.ui.en : merge(I18N.ui.en, I18N.ui[l] || {});
    document.documentElement.lang = l;
    if (l === "ja" && !document.getElementById("font-ja")) {
      var link = document.createElement("link");
      link.id = "font-ja"; link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-jp-dynamic-subset.min.css";
      document.head.appendChild(link);
    }
  }
  function setLang(l) {
    if (l === lang || LANGS.indexOf(l) < 0) return;
    try { localStorage.setItem("lxi-lang", l); } catch (e) { /* storage unavailable */ }
    var qs = new URLSearchParams(location.search);
    if (l === "en") qs.delete("lang"); else qs.set("lang", l);
    var q = qs.toString();
    history.replaceState(null, "", location.pathname + (q ? "?" + q : "") + location.hash);
    applyLang(l);
    buildOverlays();
    var y = window.scrollY;
    current = null;
    route(true);
    window.scrollTo(0, y);
    trackEvent("language", { to: l });
  }
  function langSwitch(cls) {
    return '<div class="lang ' + (cls || "") + '" role="group" aria-label="' + esc(T.langLabel) + '">' +
      '<button type="button" data-lang="en" aria-pressed="' + (lang === "en") + '"' + (lang === "en" ? ' class="is-on"' : "") + '>EN</button>' +
      '<button type="button" data-lang="ja" aria-pressed="' + (lang === "ja") + '"' + (lang === "ja" ? ' class="is-on"' : "") + ' lang="ja">\u65e5\u672c\u8a9e</button></div>';
  }

  // ---------------------------------------------------------------- analytics (Umami Cloud, cookieless; off until a website ID is set)
  var AN_ID = ((EN.ANALYTICS || {}).umamiWebsiteId || "").trim();
  var anQueue = [];
  function anRun(fn) {
    if (!AN_ID) return;
    if (window.umami && typeof window.umami.track === "function") fn(); else anQueue.push(fn);
  }
  if (AN_ID) {
    var s = document.createElement("script");
    s.defer = true;
    s.src = "https://cloud.umami.is/script.js";
    s.setAttribute("data-website-id", AN_ID);
    s.setAttribute("data-auto-track", "false");
    s.onload = function () { anQueue.splice(0).forEach(function (fn) { fn(); }); };
    document.head.appendChild(s);
  }
  function trackView(path) {
    anRun(function () {
      window.umami.track(function (p) { return merge(p, { url: path + location.search, title: document.title }); });
    });
  }
  function trackEvent(name, data) {
    anRun(function () { window.umami.track(name, merge(data || {}, { lang: lang })); });
  }

  // ---------------------------------------------------------------- media
  function productImg(p, sizes, eager) {
    var im = p.image, alt = esc(p.name);
    var common = ' width="' + im.w + '" height="' + im.h + '" alt="' + alt + '" decoding="async"' +
      (eager ? ' fetchpriority="high"' : ' loading="lazy"');
    if (im.type === "photo") {
      return '<img src="' + im.base + '-640.webp" srcset="' + im.base + '-640.webp 640w, ' + im.base +
        '-1200.webp 1200w" sizes="' + sizes + '"' + common + ' data-full="' + im.base + '-1200.webp">';
    }
    return '<img src="' + im.base + '-900.webp" srcset="' + im.base + '-900.webp 900w, ' + im.base +
      '-1600.webp 1600w" sizes="' + sizes + '"' + common + ' data-full="' + im.base + '-1600.webp">';
  }
  function flagImg(code, w, h) {
    var k = D.COUNTRIES[code];
    return '<img class="flagimg" src="' + k.flag + '" alt="" width="' + (w || 21) + '" height="' + (h || 14) + '">';
  }
  function flag(code) {
    var k = D.COUNTRIES[code];
    return k ? '<span class="flag">' + flagImg(code) + esc(k.name) + '</span>' : "";
  }
  function brochure() {
    var B = D.CONTACT.brochure;
    return B ? (B[lang] || B.en) : null;
  }

  // ---------------------------------------------------------------- shared blocks
  function footer() {
    var C = D.COMPANY;
    var offices = C.offices.map(function (o) {
      return '<div class="office"><p class="office__label">' + esc(o.label) + '</p><p class="office__name">' + esc(o.name) +
        '</p><p>' + esc(o.address) + '</p></div>';
    }).join("");
    return '' +
      '<footer class="footer">' +
        '<div class="wrap">' +
          '<img class="footer__logo" src="assets/img/brand/lx-logo-white.svg" alt="LX International" width="188" height="22">' +
          '<div class="offices">' + offices + '</div>' +
          '<p class="footer__web"><a href="' + C.website + '" target="_blank" rel="noopener">www.lxinternational.com</a></p>' +
          '<p class="footer__copy">' + esc(C.copyright) + '</p>' +
        '</div>' +
      '</footer>';
  }

  // phone lines for the call sheet / contact card: a solution page leads with its contact, then the U.S. office
  function phoneLines(sol) {
    var C = D.CONTACT;
    if (!sol || !sol.contact) return C.phones;
    var k = sol.contact;
    return [{ label: k.name, sub: sol.title, number: k.phone, flag: D.COUNTRIES.kr.flag }]
      .concat(C.phones.filter(function (p) { return p.flag !== D.COUNTRIES.kr.flag && p.number !== k.phone; }));
  }

  function contactBlock(sol) {
    var C = D.CONTACT, W = waContact(sol), B = brochure(), solId = sol && sol.contact ? sol.id : "";
    var nums = phoneLines(sol).map(function (p) {
      return '<span class="cnum"><img src="' + p.flag + '" alt="" width="18" height="12">' + esc(p.number) + '</span>';
    }).join("");
    var person = solId
      ? '<p class="contact__person">' + icon("users") + '<span>' + esc(fmt(T.contactPerson, { solution: sol.title })) +
        ' <b>' + esc(sol.contact.name) + '</b></span></p>'
      : "";
    var btns = [
      '<button class="btn btn--primary" type="button" data-mail data-sol="' + solId + '" aria-haspopup="dialog">' + icon("mail") +
        '<span class="btn__text">' + esc(T.emailUs) + '<small class="cmails">' +
        recipients(solId).to.map(function (a) { return '<span>' + esc(a) + '</span>'; }).join("") + '</small></span></button>',
      '<button class="btn" type="button" data-call data-sol="' + solId + '" aria-haspopup="dialog">' + icon("phone") +
        '<span class="btn__text">' + esc(T.callUs) + '<small class="cnums">' + nums + '</small></span></button>'
    ];
    if (W) {
      btns.push('<a class="btn btn--wa" href="' + waHref(W) + '" target="_blank" rel="noopener" data-ev="whatsapp">' + waIcon() +
        '<span class="btn__text">' + esc(T.whatsapp) + '<small>' + esc(W.name) + ' \u00b7 ' + esc(W.number) + '</small></span></a>');
    }
    if (B) {
      btns.push('<a class="btn" href="' + esc(B.href) + '" target="_blank" rel="noopener" data-ev="brochure">' + icon("download") +
        '<span class="btn__text">' + esc(T.downloadBrochure) + '<small>' + esc(B.note) + '</small></span></a>');
    }
    btns.push('<a class="btn" href="' + D.COMPANY.website + '" target="_blank" rel="noopener">' + icon("globe") +
      '<span class="btn__text">' + esc(T.visitWebsite) + '<small>lxinternational.com</small></span></a>');
    return '' +
      '<section class="contact" id="contact" aria-labelledby="contact-title">' +
        '<div class="wrap">' +
          '<div class="contact__card">' +
            '<p class="eyebrow eyebrow--red">' + esc(T.contact) + '</p>' +
            '<h2 id="contact-title" class="contact__title">' + esc(T.contactTitle) + '</h2>' +
            '<p class="contact__text">' + esc(T.contactText) + '</p>' + person +
            '<div class="contact__actions">' + btns.join("") + '</div>' +
          '</div>' +
        '</div>' +
      '</section>';
  }

  function statusChip(state) {
    var dev = state === "developing";
    return '<span class="status' + (dev ? " status--dev" : "") + '">' + esc(dev ? T.developing : T.delivering) + '</span>';
  }

  function certBlock(compact) {
    var C = D.CERTS;
    var groups = C.groups.map(function (g) {
      return '<div class="cert"><p class="cert__label">' + esc(g.label) + '</p><ul class="cert__badges">' +
        g.items.map(function (it) {
          return '<li class="badge"><b>' + esc(it.code) + '</b>' + (it.desc ? '<span>' + esc(it.desc) + '</span>' : "") + '</li>';
        }).join("") + '</ul></div>';
    }).join("");
    return '<div class="certs' + (compact ? " certs--compact" : "") + '">' + groups + '</div>' +
      '<p class="certs__note">' + icon("award") + '<span>' + esc(C.note) + '</span></p>';
  }

  // ---------------------------------------------------------------- home
  function solutionCard(s, i) {
    var render = /render/.test(s.cardImage) ? " sol-card__img--render" : "";
    return '' +
      '<a class="sol-card sol-card--' + s.id + '" href="#/' + s.id + '">' +
        '<div class="sol-card__text">' +
          '<span class="sol-card__no">' + icon(SOL_ICON[s.id]) + s.index + '</span>' +
          '<h2 class="sol-card__title">' + esc(s.title) + '</h2>' +
          '<p class="sol-card__tag">' + esc(s.tagline) + '</p>' +
          '<p class="sol-card__items">' + esc(s.cardItems) + '</p>' +
        '</div>' +
        '<div class="sol-card__media" aria-hidden="true">' +
          '<img class="sol-card__img' + render + '" src="' + s.cardImage + '" alt="" loading="' + (i ? "lazy" : "eager") + '" decoding="async">' +
        '</div>' +
        '<span class="sol-card__go" aria-hidden="true">' + icon("arrow") + '</span>' +
      '</a>';
  }

  function modelBlock() {
    var M = D.MODEL, total = 0;
    var pool = M.makers.pool.map(function (p) {
      total += p.count;
      return '<li>' + flagImg(p.code, 24, 16) + '<span>' + esc(D.COUNTRIES[p.code].name) + '</span><b>' + p.count + '</b></li>';
    }).join("");
    var roles = M.lxi.roles.map(function (r) { return '<li>' + icon("check") + esc(r) + '</li>'; }).join("");
    var types = M.customers.types.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join("");
    return '' +
      '<ol class="model">' +
        '<li class="model__step">' +
          '<p class="model__head">' + icon("factory") + esc(M.makers.title) + '</p>' +
          '<p class="model__big"><strong>' + total + '</strong>' + esc(M.makers.note) + '</p>' +
          '<ul class="pool">' + pool + '</ul>' +
        '</li>' +
        '<li class="model__step model__step--lxi">' +
          '<p class="model__head"><img src="assets/img/brand/lx-symbol.svg" alt="" width="22" height="19">' + esc(M.lxi.title) + '</p>' +
          '<ul class="model__roles">' + roles + '</ul>' +
        '</li>' +
        '<li class="model__step">' +
          '<p class="model__head">' + icon("users") + esc(M.customers.title) + '</p>' +
          '<ul class="model__types">' + types + '</ul>' +
        '</li>' +
      '</ol>';
  }

  function proj(lon, lat) {
    var M = D.MAP;
    return [((((lon - M.lon0) % 360) + 360) % 360) / M.step * M.cell, (M.lat0 - lat) / M.step * M.cell];
  }
  function mapBlock() {
    var M = D.MAP, B = brochure();
    var hub = M.sources.filter(function (s) { return s.code === M.hub; })[0];
    var h = proj(hub.lon, hub.lat);
    function at(p) {
      return 'left:' + (p[0] / M.width * 100).toFixed(2) + '%;top:' + (p[1] / M.height * 100).toFixed(2) + '%';
    }
    var routes = M.markets.map(function (m, i) {
      var p = proj(m.lon, m.lat);
      var dx = p[0] - h[0], dy = p[1] - h[1];
      var lift = Math.min(170, Math.sqrt(dx * dx + dy * dy) * 0.34);
      var cx = (h[0] + p[0]) / 2, cy = (h[1] + p[1]) / 2 - lift;
      return '<path class="route' + (m.focus ? " route--focus" : "") + '" style="animation-delay:' + (-0.7 * i).toFixed(1) + 's" d="M' +
        h[0].toFixed(1) + " " + h[1].toFixed(1) + "Q" + cx.toFixed(1) + " " + cy.toFixed(1) + " " + p[0].toFixed(1) + " " + p[1].toFixed(1) + '"/>';
    }).join("");
    var pins = M.sources.map(function (s) {
      var p = proj(s.lon, s.lat);
      return '<span class="pin pin--src" style="' + at(p) + '"></span>' +
        '<span class="mlabel mlabel--src mlabel--' + (s.label || "top") + '" style="' + at(p) + '">' + esc(D.COUNTRIES[s.code].name) + '</span>';
    }).join("") + M.markets.map(function (m) {
      var p = proj(m.lon, m.lat);
      return '<span class="pin pin--mkt' + (m.focus ? " is-focus" : "") + '" style="' + at(p) + '"></span>' +
        '<span class="mlabel mlabel--' + m.label + (m.focus ? " is-focus" : "") + '" style="' + at(p) + '">' + esc(m.name) + '</span>';
    }).join("");
    var srcFlags = M.sources.map(function (s) { return flagImg(s.code, 18, 12); }).join("");
    var cta = B ? '<a class="map__cta" href="' + esc(B.href) + '" target="_blank" rel="noopener" data-ev="brochure">' + icon("download") +
      esc(T.downloadBrochure) + '<small>' + esc(B.note) + '</small></a>' : "";
    return '' +
      '<div class="netmap">' +
        '<div class="map" style="aspect-ratio:' + M.width + "/" + M.height + '" role="img" aria-label="' + esc(T.mapAria) + '">' +
          '<img class="map__dots" src="' + M.dots + '" alt="" width="' + M.width + '" height="' + M.height + '" loading="lazy" decoding="async">' +
          '<svg class="map__routes" viewBox="0 0 ' + M.width + " " + M.height + '" preserveAspectRatio="none" aria-hidden="true">' + routes + '</svg>' +
          pins +
        '</div>' +
        '<div class="map__legend">' +
          '<span class="lg lg--src"><i></i>' + esc(T.lgSources) + '<span class="lg__flags">' + srcFlags + '</span></span>' +
          '<span class="lg lg--mkt"><i></i>' + esc(T.lgMarkets) + '</span>' +
          '<span class="lg lg--route"><i></i>' + esc(T.lgRoutes) + '</span>' +
        '</div>' +
        '<p class="map__note">' + icon("ship") + '<span>' + esc(M.logistics) + '</span></p>' +
        cta +
      '</div>';
  }

  function trackBlock() {
    return D.TRACK.map(function (t) {
      var items = t.items.map(function (it) {
        return '<li>' + statusChip(it.state) + '<p>' + esc(it.text) + '</p></li>';
      }).join("");
      return '<article class="track"><h3 class="track__head">' + flagImg(t.flag, 24, 16) + esc(t.region) + '</h3><ul>' + items + '</ul></article>';
    }).join("");
  }

  function scaleBlock() {
    var S = D.SCALE;
    function boxes(list, cls) {
      return list.map(function (x) { return '<span class="scale__box ' + cls + '">' + esc(x) + '</span>'; }).join("");
    }
    return '' +
      '<div class="next">' +
        '<p class="next__label">' + icon("rocket") + '<span>' + esc(T.scalingUp) + '<b>' + esc(S.label) + '</b></span></p>' +
        '<div class="scale">' +
          '<div class="scale__row">' + boxes(S.now, "") + '</div>' +
          '<div class="scale__arrow" aria-hidden="true"><span>' + esc(T.expansion) + '</span></div>' +
          '<div class="scale__row">' + boxes(S.next, "is-next") + '</div>' +
        '</div>' +
      '</div>';
  }

  function renderHome() {
    document.title = T.docTitleHome;
    var values = D.VALUES.map(function (v) {
      return '<li class="value"><span class="value__no">' + v.no + '</span><div><h3>' + esc(v.title) + '</h3><p>' + esc(v.text) + '</p></div></li>';
    }).join("");
    var stats = D.STATS.map(function (s) {
      return '<div class="stat">' + icon(s.icon, "stat__ico") + '<strong>' + esc(s.value) + (s.unit ? '<span>' + esc(s.unit) + '</span>' : "") +
        '</strong><span class="stat__label">' + esc(s.label) + '</span></div>';
    }).join("");
    var scope = D.SCOPE.map(function (s, i) { return '<li' + (i ? "" : ' class="is-core"') + '>' + esc(s) + '</li>'; }).join("");

    app.innerHTML = '' +
      '<header class="homebar" aria-hidden="true">' +
        '<div class="wrap homebar__inner">' +
          '<a class="homebar__logo" href="#/" tabindex="-1" data-top aria-label="' + esc(T.homeTop) + '"><img src="assets/img/brand/lx-logo.svg" alt="LX International" width="150" height="17"></a>' +
          '<div class="homebar__right">' + langSwitch("lang--dark") +
            '<a class="homebar__cta" href="#contact" tabindex="-1" data-scroll="contact">' + icon("mail") + '<span>' + esc(T.contact) + '</span></a></div>' +
        '</div>' +
      '</header>' +

      '<section class="hero">' +
        '<div class="hero__bands" aria-hidden="true"><i></i><i></i></div>' +
        '<div class="wrap hero__inner">' +
          '<div class="hero__top">' +
            '<img class="hero__logo" src="assets/img/brand/lx-logo-onred.svg" alt="LX International" width="188" height="22">' +
            langSwitch("lang--light") +
          '</div>' +
          '<p class="eyebrow eyebrow--light">' + esc(T.heroEyebrow) + '</p>' +
          '<h1 class="hero__title">' + esc(T.heroTitle).replace(/\n/g, "<br>") + '</h1>' +
          '<p class="hero__lead">' + esc(T.heroLead) + '</p>' +
        '</div>' +
        '<img class="hero__photo" src="assets/img/products/hero-transformer-900.webp" srcset="assets/img/products/hero-transformer-900.webp 900w, assets/img/products/hero-transformer-1600.webp 1600w" sizes="(min-width: 900px) 880px, 112vw" width="1600" height="1102" alt="" fetchpriority="high" decoding="async">' +
      '</section>' +

      '<section class="solutions" aria-label="' + esc(T.solutionsAria) + '">' +
        '<div class="wrap solutions__grid">' + D.SOLUTIONS.map(solutionCard).join("") + '</div>' +
      '</section>' +

      '<section class="scope" aria-labelledby="scope-title">' +
        '<div class="wrap">' +
          '<p class="eyebrow eyebrow--red">' + esc(T.modelEyebrow) + '</p>' +
          '<h2 id="scope-title" class="section-title">' + esc(T.modelTitle) + '</h2>' +
          '<p class="section-lead">' + esc(T.modelLead) + '</p>' +
          '<ul class="scope__list" aria-label="' + esc(T.scopeAria) + '">' + scope + '</ul>' +
          modelBlock() +
        '</div>' +
      '</section>' +

      '<section class="network" aria-labelledby="network-title">' +
        '<div class="wrap">' +
          '<p class="eyebrow eyebrow--red">' + esc(T.netEyebrow) + '</p>' +
          '<h2 id="network-title" class="section-title">' + esc(T.netTitle) + '</h2>' +
          mapBlock() +
        '</div>' +
      '</section>' +

      '<section class="why" aria-labelledby="why-title">' +
        '<div class="why__bg" aria-hidden="true"></div>' +
        '<div class="wrap">' +
          '<p class="eyebrow eyebrow--light">' + esc(T.whyEyebrow) + '</p>' +
          '<h2 id="why-title" class="why__title">' + esc(T.whyTitle) + '</h2>' +
          '<ol class="values">' + values + '</ol>' +
          '<div class="stats">' + stats + '</div>' +
        '</div>' +
      '</section>' +

      '<section class="certsec" aria-labelledby="cert-title">' +
        '<div class="wrap">' +
          '<p class="eyebrow eyebrow--red">' + esc(T.certEyebrow) + '</p>' +
          '<h2 id="cert-title" class="section-title">' + esc(T.certTitle) + '</h2>' +
          certBlock(false) +
        '</div>' +
      '</section>' +

      '<section class="tracks" aria-labelledby="track-title">' +
        '<div class="wrap">' +
          '<p class="eyebrow eyebrow--red">' + esc(T.trackEyebrow) + '</p>' +
          '<h2 id="track-title" class="section-title">' + esc(T.trackTitle) + '</h2>' +
          '<div class="tracks__grid">' + trackBlock() + '</div>' +
          scaleBlock() +
        '</div>' +
      '</section>' +
      contactBlock() + footer();

    watchHero();
  }

  // sticky mini header on home once the hero has scrolled away
  function watchHero() {
    if (heroWatch) heroWatch.disconnect();
    var bar = app.querySelector(".homebar"), hero = app.querySelector(".hero");
    if (!bar || !hero || !("IntersectionObserver" in window)) return;
    heroWatch = new IntersectionObserver(function (entries) {
      var show = !entries[0].isIntersecting;
      bar.classList.toggle("is-on", show);
      bar.setAttribute("aria-hidden", show ? "false" : "true");
      bar.querySelectorAll("a, button").forEach(function (a) { a.tabIndex = show ? 0 : -1; });
    }, { rootMargin: "-80px 0px 0px 0px" });
    heroWatch.observe(hero);
  }

  // ---------------------------------------------------------------- solution
  function specRow(cls, ic, label, html) {
    return '<div class="spec ' + cls + '"><dt>' + icon(ic) + esc(label) + '</dt><dd>' + html + '</dd></div>';
  }

  // series / configuration list under a product's specs (e.g. MV GIS series, MV Station ratings)
  function lineupBlock(L) {
    if (!L || !L.items) return "";
    var rows = L.items.map(function (it) {
      return '<li><p class="lineup__head"><b class="lineup__name">' + esc(it.name) + '</b>' +
        (it.tag ? '<span class="lineup__tag">' + esc(it.tag) + '</span>' : "") + '</p>' +
        '<p class="lineup__spec">' + esc(it.spec) + '</p>' +
        (it.note ? '<p class="lineup__note">' + esc(it.note) + '</p>' : "") + '</li>';
    }).join("");
    return '<div class="lineup"><p class="lineup__title">' + esc(L.title) + '</p><ul>' + rows + '</ul></div>';
  }

  function productCard(sol, item, enItem, n) {
    var p = D.PRODUCTS[item.id], sp = p.specs, enP = EN.PRODUCTS[item.id];
    var title = item.title || p.name;
    var kicker = item.subtitle || p.family || "";
    var mailName = (enItem.subtitle || enItem.title || enP.name) + (item.ul ? " (UL)" : "");
    var render = p.image.type === "render" ? " is-render" : "";
    var ul = item.ul ? '<img class="product__ul" src="assets/img/badges/ul-mark.svg" alt="UL Listed" width="56" height="56">' : "";
    var cap = sp.rating !== undefined
      ? specRow("", "gauge", T.rating, val(sp.rating, sp.ratingNote))
      : specRow("", "gauge", T.capacity, val(sp.capacity, sp.capacityNote));
    var phase = specRow("", "phase", T.phase, val(sp.phase)) + specRow("", "freq", T.frequency, val(sp.frequency));
    var grid;
    if (p.specRows) {
      // product-specific spec items (e.g. MV GIS: voltage, current, short-time withstand, busbar, insulation medium)
      grid = p.specRows.map(function (r) {
        return specRow(r.wide ? "spec--wide" : "", r.icon || "std", r.label, val(r.value, r.note));
      }).join("");
    } else if (sp.voltageNote && sp.voltageNote.length > 22 && sp.insulation !== undefined && sp.tap !== undefined) {
      // long voltage list (e.g. 69/115/138/230/345/500kV): voltage & insulation get full rows, capacity pairs with tap changer
      grid = phase + cap + specRow("", "tap", T.tap, val(sp.tap)) +
        specRow("spec--wide", "volt", T.voltage, val(sp.voltage, sp.voltageNote)) +
        specRow("spec--wide", "drop", T.insulation, val(sp.insulation, sp.insulationNote));
    } else {
      grid = phase + specRow("", "volt", T.voltage, val(sp.voltage, sp.voltageNote)) + cap;
      if (sp.insulation !== undefined && sp.tap !== undefined) {
        grid += specRow("", "drop", T.insulation, val(sp.insulation, sp.insulationNote)) + specRow("", "tap", T.tap, val(sp.tap));
      } else if (sp.insulation !== undefined) {
        grid += specRow("spec--wide", "drop", T.insulation, val(sp.insulation, sp.insulationNote));
      }
    }
    var extra = "";
    if (item.ul) extra += '<p class="product__cert">' + icon("check") + esc(T.ulCertified) + '</p>';
    if (p.components) {
      extra += '<ul class="product__parts">' + p.components.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join("") + '</ul>';
    }
    return '' +
      '<article class="product" id="' + sol.id + '-' + item.id + '">' +
        '<div class="product__stage' + render + '" style="--ar:' + p.image.w + '/' + p.image.h + '">' +
          '<span class="product__no">' + pad2(n) + '</span>' +
          ul +
          '<button class="product__zoom" type="button" aria-label="' + esc(fmt(T.enlarge, { title: title })) + '">' +
            productImg(p, "(min-width: 1080px) 340px, (min-width: 760px) 46vw, 92vw", n === 1) +
            '<span class="product__zoom-ico">' + icon("expand") + '</span>' +
          '</button>' +
        '</div>' +
        '<div class="product__body">' +
          (kicker ? '<p class="product__kicker">' + esc(kicker) + '</p>' : "") +
          '<h3 class="product__name">' + esc(title) + '</h3>' +
          '<p class="product__headline">' + esc(p.headline) + '</p>' +
          extra +
          '<dl class="specs">' + grid +
            (sp.standards !== undefined ? specRow("spec--wide", "std", T.standards, val(sp.standards)) : "") +
            (sp.enclosure !== undefined ? specRow("spec--wide", "container", T.enclosure, val(sp.enclosure)) : "") +
            specRow("spec--wide spec--lead", "clock", T.leadTime, val(sp.leadTime, sp.leadTimeNote)) +
          '</dl>' +
          lineupBlock(p.lineup) +
          '<div class="madein"><span class="madein__label">' + icon("pin") + esc(T.madeIn) + '</span>' + p.madeIn.map(flag).join("") + '</div>' +
          '<button class="product__rfq" type="button" data-mail="' + esc(mailName) + '" data-sol="' + sol.id + '" aria-haspopup="dialog">' + icon("mail") +
            esc(T.requestQuote) + icon("arrow", "product__rfq-go") + '</button>' +
          rfqContact(sol) +
        '</div>' +
      '</article>';
  }

  // the solution's contact person under each "Request a quote" button
  function rfqContact(sol) {
    var k = sol.contact;
    if (!k) return "";
    return '<div class="product__contact">' + icon("users") + '<div class="pc__body">' +
        '<p class="pc__name">' + esc(k.name) + '<small>' + esc(fmt(T.solutionContact, { solution: sol.title })) + '</small></p>' +
        '<p class="pc__links"><a href="' + telHref(k.phone) + '" data-ev="call">' + esc(k.phone) + '</a>' +
          '<button type="button" data-mail data-sol="' + sol.id + '" aria-haspopup="dialog">' + esc(k.email) + '</button></p>' +
      '</div></div>';
  }

  // Data Center: the whole product line by voltage level, with spec ranges (items with a card link to it)
  function productLinePanel(sol) {
    var PL = sol.productLine;
    var groups = PL.groups.map(function (g, gi) {
      var items = g.items.map(function (it) {
        var inner = '<span class="pline__name">' + esc(it.name) + '</span>' +
          (it.spec ? '<span class="pline__spec">' + esc(it.spec) + '</span>' : "") +
          (it.note ? '<span class="pline__note">' + esc(it.note) + '</span>' : "");
        return '<li>' + (it.ref
          ? '<a class="pline__item is-link" href="#/' + sol.id + '/' + it.ref + '" data-scroll="' + sol.id + '-' + it.ref + '">' + inner + icon("arrow", "pline__go") + '</a>'
          : '<span class="pline__item">' + inner + '</span>') + '</li>';
      }).join("");
      var lv = EN.SOLUTIONS.filter(function (s) { return s.id === sol.id; })[0].productLine.groups[gi].level.toLowerCase();
      return '<li class="pline__group pline__group--' + esc(lv) + '"><span class="pline__level">' + esc(g.level) + '</span><ul class="pline__items">' + items + '</ul></li>';
    }).join("");
    return '<div class="panel pline"><p class="panel__title">' + esc(PL.title) + '</p><ol class="pline__list">' + groups + '</ol>' +
      (PL.note ? '<p class="pline__foot">' + esc(PL.note) + '</p>' : "") + '</div>';
  }

  function topPanel(sol) {
    if (sol.productLine) return productLinePanel(sol);
    if (!sol.chain) {
      var items = sol.sections[0].items.map(function (it) {
        var p = D.PRODUCTS[it.id];
        return '<a class="pindex__item" href="#/' + sol.id + '/' + it.id + '" data-scroll="' + sol.id + '-' + it.id + '">' +
          '<span class="pindex__img">' + productImg(p, "96px", true) + '</span>' +
          '<span class="pindex__name">' + esc(lang === "en" ? (it.title || p.name).replace(" Transformer", "") : p.name.replace("\u5909\u5727\u5668", "")) + '</span></a>';
      }).join("");
      return '<div class="panel"><p class="panel__title">' + esc(T.lineup) + '</p><div class="pindex">' + items + '</div></div>';
    }
    var nodes = sol.chain.map(function (c, i) {
      var inner = '<span class="node__label">' + nb(esc(c.label)) + '</span><span class="node__sub">' + nb(esc(c.sub)) + '</span>';
      var endIcon = i === 0 ? (sol.id === "ess" ? "battery" : "grid") : (sol.id === "ess" ? "grid" : "server");
      var node = c.end
        ? '<span class="node node--end">' + icon(endIcon) + inner + '</span>'
        : '<a class="node" href="#/' + sol.id + '/' + c.ref + '" data-scroll="' + sol.id + '-' + c.ref + '">' + inner + '</a>';
      return node + (i < sol.chain.length - 1 ? '<span class="chain__arrow" aria-hidden="true"></span>' : "");
    }).join("");
    return '<div class="panel"><p class="panel__title">' + esc(T.chainTitle) + '</p><div class="chain chain--' + sol.chain.length + '">' + nodes + '</div></div>';
  }

  function proofStrip(sol) {
    var rows = [];
    D.TRACK.forEach(function (t) {
      t.items.forEach(function (it) {
        if (it.tags && it.tags.indexOf(sol.id) >= 0) rows.push('<li>' + flagImg(t.flag, 24, 16) + '<div>' + statusChip(it.state) + '<p>' + esc(it.text) + '</p></div></li>');
      });
    });
    return rows.length ? '<section class="proof" aria-label="' + esc(T.trackPanel) + '"><p class="panel__title">' + esc(T.trackPanel) + '</p><ul>' + rows.join("") + '</ul></section>' : "";
  }

  function whyStrip(sol) {
    var W = sol.why || T.whyDefault;
    var items = W.items.map(function (w) {
      return '<li><span class="whys__ico">' + icon(w.icon || "check") + '</span><div><h3>' + esc(w.title) + '</h3><p>' + esc(w.text) + '</p></div></li>';
    }).join("");
    return '<section class="whys" aria-label="' + esc(W.title) + '"><p class="panel__title">' + esc(W.title) + '</p><ul>' + items + '</ul></section>';
  }

  function renderSolution(sol, productId) {
    var enSol = EN.SOLUTIONS.filter(function (s) { return s.id === sol.id; })[0];
    document.title = fmt(T.docTitleSolution, { title: sol.title });
    var n = 0;
    var sections = sol.sections.map(function (sec, si) {
      var cards = sec.items.map(function (it, ii) { n += 1; return productCard(sol, it, enSol.sections[si].items[ii], n); }).join("");
      return '<section class="psection">' +
        (sec.title ? '<h2 class="psection__title"><span>' + esc(sec.title) + '</span></h2>' : "") +
        '<div class="products">' + cards + '</div></section>';
    }).join("");
    var tabs = D.SOLUTIONS.map(function (s, i) {
      var on = s.id === sol.id;
      var short = lang === "en" ? s.title.replace(" Solution", "") : s.title.replace(/\s*\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3$/, "");
      return '<a class="tab' + (on ? " is-active" : "") + '" href="#/' + s.id + '"' + (on ? ' aria-current="page"' : "") + '>' + esc(short) + '</a>';
    }).join("");
    var others = D.SOLUTIONS.filter(function (s) { return s.id !== sol.id; }).map(function (s) {
      return '<a class="other" href="#/' + s.id + '"><span class="other__no">' + icon(SOL_ICON[s.id]) + s.index + '</span>' +
        '<span class="other__title">' + esc(s.title) + '</span><span class="other__tag">' + esc(s.tagline) + '</span>' + icon("arrow", "other__go") + '</a>';
    }).join("");
    var stats = sol.stats ? '<ul class="sol-hero__stats">' + sol.stats.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("") + '</ul>' : "";

    app.innerHTML = '' +
      '<header class="appbar">' +
        '<div class="wrap appbar__inner">' +
          '<a class="appbar__btn" href="#/" data-back aria-label="' + esc(T.backAria) + '">' + icon("back") + '</a>' +
          '<a class="appbar__logo" href="#/" aria-label="' + esc(T.homeAria) + '"><img src="assets/img/brand/lx-logo.svg" alt="LX International" width="150" height="17"></a>' +
          '<div class="appbar__right">' + langSwitch("lang--dark lang--compact") +
            '<a class="appbar__btn" href="#contact" data-scroll="contact" aria-label="' + esc(T.contact) + '">' + icon("mail") + '</a></div>' +
        '</div>' +
      '</header>' +
      '<section class="sol-hero sol-hero--' + sol.id + '">' +
        '<div class="hero__bands" aria-hidden="true"><i></i><i></i></div>' +
        '<div class="wrap sol-hero__inner">' +
          '<nav class="tabs" aria-label="' + esc(T.solutionsAria) + '">' + tabs + '</nav>' +
          '<p class="eyebrow eyebrow--light">' + icon(SOL_ICON[sol.id]) + esc(fmt(T.solutionN, { n: sol.index })) + '</p>' +
          '<h1 class="sol-hero__title">' + esc(sol.title) + '</h1>' +
          '<p class="sol-hero__intro">' + esc(sol.intro) + '</p>' + stats +
        '</div>' +
      '</section>' +
      '<div class="wrap sol-body">' + topPanel(sol) + proofStrip(sol) + sections + whyStrip(sol) +
        '<section class="certpanel" aria-label="' + esc(T.certEyebrow) + '"><p class="panel__title">' + esc(T.certEyebrow) + '</p>' + certBlock(true) + '</section>' +
      '</div>' +
      contactBlock(sol) +
      '<section class="others" aria-label="' + esc(T.othersAria) + '"><div class="wrap"><p class="eyebrow eyebrow--red">' + esc(T.exploreMore) + '</p><div class="others__list">' + others + '</div></div></section>' +
      footer();

    if (productId) {
      var el = document.getElementById(sol.id + "-" + productId);
      if (el) requestAnimationFrame(function () { el.scrollIntoView({ block: "start" }); });
    }
  }

  // ---------------------------------------------------------------- routing
  function parse() {
    var parts = location.hash.replace(/^#\/?/, "").split("/");
    return { sol: parts[0] || "", product: parts[1] || "" };
  }

  function route(forced) {
    var r = parse();
    var sol = D.SOLUTIONS.filter(function (s) { return s.id === r.sol; })[0];
    if (!sol && current && r.sol && document.getElementById(r.sol)) {   // plain in-page anchor (#contact, #app)
      scrollToId(r.sol);
      return;
    }
    if (sol && current === sol.id) {                      // same view: scroll only, no re-render
      var el = r.product && document.getElementById(sol.id + "-" + r.product);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!sol) {
      var fromSolution = current && current !== "home";
      renderHome();
      current = "home";
      if (!forced) window.scrollTo(0, fromSolution ? homeScroll : 0);
      if (r.sol === "contact") requestAnimationFrame(function () { scrollToId("contact"); });
      if (!forced) trackView("/");
    } else {
      if (heroWatch) { heroWatch.disconnect(); heroWatch = null; }
      if (!forced) {
        cameFromHome = current === "home";
        if (cameFromHome) homeScroll = window.scrollY;
      }
      renderSolution(sol, r.product);
      current = sol.id;
      if (!r.product && !forced) window.scrollTo(0, 0);
      if (!forced) trackView("/" + sol.id);
    }
    if (!forced) app.focus({ preventScroll: true });
  }

  function scrollToId(id) {
    var t = document.getElementById(id);
    if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------------------------------------------------------------- overlays (built in JS, so a stale cached index.html can never break them)
  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }
  var lb, lbImg, callSheet, mailSheet, toast, mailState = { product: "", sol: "", to: [], cc: [] };

  function buildOverlays() {
    ["lightbox", "callSheet", "mailSheet", "toast"].forEach(function (id) {
      var o = document.getElementById(id);
      if (o) o.parentNode.removeChild(o);
    });
    var R = recipients("");
    lb = el('<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="' + esc(T.imageViewer) + '" hidden>' +
      '<button class="lightbox__close" type="button" aria-label="' + esc(T.closeImage) + '">&times;</button><img alt=""></div>');
    callSheet = el('<div class="sheet" id="callSheet" role="dialog" aria-modal="true" aria-labelledby="callSheetTitle" hidden>' +
      '<div class="sheet__panel">' +
        '<p class="sheet__title" id="callSheetTitle">' + esc(T.callTitle) + '</p>' +
        '<p class="sheet__sub">' + esc(T.callSub) + '</p>' +
        '<ul class="sheet__list" data-call-list>' + callRows(null) + '</ul>' +
        '<button class="sheet__cancel" type="button" data-close>' + esc(T.cancel) + '</button>' +
      '</div></div>');
    mailSheet = el('<div class="sheet" id="mailSheet" role="dialog" aria-modal="true" aria-labelledby="mailSheetTitle" hidden>' +
      '<div class="sheet__panel">' +
        '<p class="sheet__title" id="mailSheetTitle">' + esc(T.mailTitle) + '</p>' +
        '<p class="sheet__sub" data-mail-subject></p>' +
        '<a class="sheet__primary" href="#" data-mail-open>' + icon("mail") + '<span>' + esc(T.mailOpen) + '</span>' + icon("arrow", "sheet__primary-go") + '</a>' +
        '<ul class="sheet__list sheet__list--copy">' +
          copyRow("to", T.mailTo, R.to.join(", ")) +
          copyRow("cc", T.mailCc, R.cc.join(", ")) +
          copyRow("msg", T.mailMsg, T.mailMsgDesc) +
        '</ul>' +
        '<button class="sheet__cancel" type="button" data-close>' + esc(T.cancel) + '</button>' +
      '</div></div>');
    toast = el('<div class="toast" id="toast" role="status" aria-live="polite" hidden></div>');
    [callSheet, mailSheet, lb, toast].forEach(function (n) { document.body.appendChild(n); });
    lbImg = lb.querySelector("img");

    lb.addEventListener("click", function (e) {
      if (e.target === lbImg) return;
      closeLayer(lb);
      lbImg.removeAttribute("src");
    });
    [callSheet, mailSheet].forEach(function (sheet) {
      sheet.addEventListener("click", function (e) {
        var cp = e.target.closest("[data-copy]");
        if (cp) { copyText(cp.getAttribute("data-copy"), cp.getAttribute("data-toast")); trackEvent("copy", { what: cp.getAttribute("data-what") || "number" }); return; }
        var cm = e.target.closest("[data-copy-mail]");
        if (cm) { copyMail(cm.getAttribute("data-copy-mail")); return; }
        if (e.target === sheet || e.target.closest("[data-close]")) { closeLayer(sheet); return; }
        var go = e.target.closest(".sheet__call, [data-mail-open]");
        if (go) {
          if (go.hasAttribute("data-mail-open")) trackEvent("email_app", { product: mailState.product || "general" });
          else trackEvent("call", { line: go.getAttribute("data-ev-line") });
          setTimeout(function () { closeLayer(sheet); }, 400);
        }
      });
    });
  }
  function callRows(sol) {
    return phoneLines(sol).map(function (p) {
      return '<li class="sheet__row">' +
        '<a class="sheet__call" href="' + telHref(p.number) + '" data-ev="call" data-ev-line="' + esc(p.label) + '"><img src="' + p.flag + '" alt="" width="30" height="20">' +
          '<span class="sheet__num"><strong>' + esc(p.label) + (p.sub ? ' <small>' + esc(p.sub) + '</small>' : "") + '</strong>' + esc(p.number) + '</span>' +
          '<span class="sheet__dial">' + icon("phone") + '</span></a>' +
        '<button class="sheet__copy" type="button" data-copy="' + esc(p.number) + '" data-toast="' + esc(T.numberCopied) + '" aria-label="' + esc(fmt(T.copyNumber, { label: p.label })) + '">' + icon("copy") + '</button>' +
      '</li>';
    }).join("");
  }
  function openCall(solId) {
    callSheet.querySelector("[data-call-list]").innerHTML = callRows(solById(D.SOLUTIONS, solId));
    openLayer(callSheet);
  }
  function copyRow(key, label, value) {
    return '<li class="sheet__row sheet__row--copy"><div class="sheet__addr"><strong>' + esc(label) + '</strong><span data-addr="' + key + '">' + esc(value) + '</span></div>' +
      '<button class="sheet__copy" type="button" data-copy-mail="' + key + '" aria-label="' + esc(fmt(T.copyWhat, { what: label })) + '">' + icon("copy") + '<span>' + esc(T.copy) + '</span></button></li>';
  }
  function copyMail(key) {
    var p = mailParts(mailState.product);
    if (key === "to") copyText(mailState.to.join(", "), T.addrCopied);
    else if (key === "cc") copyText(mailState.cc.join(", "), T.ccCopied);
    else copyText("Subject: " + p.subject + "\n\n" + p.body, T.msgCopied);
    trackEvent("email_copy", { part: key });
  }
  function openMail(product, solId) {
    var r = recipients(solId);
    mailState = { product: product || "", sol: solId || "", to: r.to, cc: r.cc };
    mailSheet.querySelector("[data-mail-open]").setAttribute("href", mailHref(product, solId));
    mailSheet.querySelector("[data-mail-subject]").textContent = mailParts(product).subject;
    mailSheet.querySelector('[data-addr="to"]').textContent = r.to.join(", ");
    mailSheet.querySelector('[data-addr="cc"]').textContent = r.cc.join(", ");
    openLayer(mailSheet);
    trackEvent(product ? "quote" : "email", product ? { product: product, solution: solId || "home" } : { solution: solId || "home" });
  }

  var lastFocus = null;
  function openLayer(layer, focusEl) {
    lastFocus = document.activeElement;
    layer.hidden = false;
    document.documentElement.classList.add("no-scroll");
    (focusEl || layer.querySelector("a[href], button")).focus();
  }
  function closeLayer(layer) {
    if (layer.hidden) return;
    layer.hidden = true;
    if (lb.hidden && callSheet.hidden && mailSheet.hidden) document.documentElement.classList.remove("no-scroll");
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function openLayerNow() {
    return [lb, callSheet, mailSheet].filter(function (l) { return l && !l.hidden; })[0] || null;
  }
  function trapTab(layer, e) {
    var f = layer.querySelectorAll("a[href], button:not([disabled])");
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function openLightbox(img) {
    lbImg.src = img.getAttribute("data-full") || img.currentSrc || img.src;
    lbImg.alt = img.alt;
    openLayer(lb, lb.querySelector(".lightbox__close"));
  }

  var toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 1800);
  }
  function copyText(text, okMsg) {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
      document.body.removeChild(ta);
      showToast(ok ? okMsg : text.split("\n")[0]);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { showToast(okMsg); }, fallback);
    } else {
      fallback();
    }
  }

  document.addEventListener("keydown", function (e) {
    var layer = openLayerNow();
    if (!layer) return;
    if (e.key === "Escape") { closeLayer(layer); if (layer === lb) lbImg.removeAttribute("src"); }
    else if (e.key === "Tab") trapTab(layer, e);
  });

  app.addEventListener("click", function (e) {
    var lg = e.target.closest("[data-lang]");
    if (lg) { setLang(lg.getAttribute("data-lang")); return; }
    var zoom = e.target.closest(".product__zoom");
    if (zoom) { openLightbox(zoom.querySelector("img")); return; }
    var mail = e.target.closest("[data-mail]");
    if (mail) { openMail(mail.getAttribute("data-mail"), mail.getAttribute("data-sol") || ""); return; }
    var call = e.target.closest("[data-call]");
    if (call) { openCall(call.getAttribute("data-sol") || ""); return; }
    var ev = e.target.closest("[data-ev]");
    if (ev) trackEvent(ev.getAttribute("data-ev"), {});
    if (e.target.closest("[data-top]")) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    // back arrow behaves like the browser back button when we arrived from home
    if (e.target.closest("[data-back]") && cameFromHome) { e.preventDefault(); history.back(); return; }
    var sc = e.target.closest("[data-scroll]");
    if (sc) {
      e.preventDefault();
      scrollToId(sc.getAttribute("data-scroll"));
    }
  });

  applyLang(detectLang());
  buildOverlays();
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.addEventListener("hashchange", function () { route(false); });
  route(false);
})();
