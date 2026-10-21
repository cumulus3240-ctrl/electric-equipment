/* LX International · Electric Equipment promotion — view rendering & routing */
(function () {
  "use strict";

  var D = window.LXI;
  var app = document.getElementById("app");
  var homeScroll = 0;
  var current = null;
  var cameFromHome = false;

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
    return s.replace(/(\w)-(\w)/g, "$1‑$2");
  }
  function val(v, note) {
    if (isTBD(v)) return '<span class="tbd">TBD</span>';
    var text = nb(esc(v));
    return text + (note ? '<small>' + esc(note) + '</small>' : "");
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
    phase: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    freq: '<path d="M2.5 12c1.6-5.5 3.2-5.5 4.8 0s3.2 5.5 4.8 0 3.2-5.5 4.8 0 3.2 5.5 4.6 0"/>',
    volt: '<path d="M13 2.5L5 13.5h6.5L10.5 21.5l8-11h-6.5z"/>',
    gauge: '<path d="M4 17a8.5 8.5 0 1 1 16 0"/><path d="M12 14.5l4-4.5"/><circle cx="12" cy="15" r="1.3"/>',
    std: '<path d="M12 3l7 3v6c0 4.4-3 7.4-7 9-4-1.6-7-4.6-7-9V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.3 2"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    grid: '<path d="M12 2.5L7 21.5M12 2.5l5 19M5.5 7h13M7.5 12h9M6.3 17h11.4M5.5 7v2.5M18.5 7v2.5"/>',
    power: '<path d="M13 2.5L5 13.5h6.5L10.5 21.5l8-11h-6.5z"/>',
    server: '<rect x="4" y="3.5" width="16" height="7" rx="1.5"/><rect x="4" y="13.5" width="16" height="7" rx="1.5"/><path d="M8 7h.01M8 17h.01M12 7h4M12 17h4"/>',
    battery: '<rect x="2.5" y="7" width="16" height="10" rx="2"/><path d="M21.5 10.5v3"/><path d="M11 9l-2.5 3.5h3L9 15.5"/>'
  };
  function icon(name, cls) {
    return '<svg class="ico ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + I[name] + '</svg>';
  }
  var SOL_ICON = { "power": "power", "data-center": "server", "ess": "battery" };

  function productImg(p, sizes, eager) {
    var im = p.image, alt = esc(p.name);
    var common = ' width="' + im.w + '" height="' + im.h + '" alt="' + alt + '" decoding="async"' +
      (eager ? ' fetchpriority="high"' : ' loading="lazy"');
    if (im.type === "photo") {
      return '<img src="' + im.base + '-640.webp" srcset="' + im.base + '-640.webp 640w, ' + im.base +
        '-1200.webp 1200w" sizes="' + sizes + '"' + common + ' data-full="' + im.base + '-1200.webp">';
    }
    return '<img src="' + im.src + '"' + common + ' data-full="' + im.src + '">';
  }

  function flags(codes) {
    return codes.map(function (c) {
      var k = D.COUNTRIES[c];
      if (!k) return "";
      return '<span class="flag"><img src="' + k.flag + '" alt="" width="21" height="14">' + esc(k.name) + '</span>';
    }).join("");
  }

  // ---------------------------------------------------------------- partials
  function footer() {
    var C = D.COMPANY;
    return '' +
      '<footer class="footer">' +
        '<div class="wrap">' +
          '<img class="footer__logo" src="assets/img/brand/lx-logo-white.svg" alt="LX International" width="188" height="22">' +
          '<p>' + esc(C.address) + '</p>' +
          '<p><a href="' + C.website + '" target="_blank" rel="noopener">www.lxinternational.com</a></p>' +
          '<p class="footer__copy">' + esc(C.copyright) + '</p>' +
        '</div>' +
      '</footer>';
  }

  function contactBlock() {
    var C = D.CONTACT, btns = [];
    if (isTBD(C.email)) {
      btns.push('<span class="btn btn--primary is-tbd">' + icon("mail") + 'Email <span class="tbd">TBD</span></span>');
    } else {
      btns.push('<a class="btn btn--primary" href="mailto:' + esc(C.email) + '?subject=' +
        encodeURIComponent("[Inquiry] LX International Electric Equipment") + '">' + icon("mail") + 'Email us</a>');
    }
    if (isTBD(C.phone)) {
      btns.push('<span class="btn is-tbd">' + icon("phone") + 'Call <span class="tbd">TBD</span></span>');
    } else {
      btns.push('<a class="btn" href="tel:' + esc(C.phone.replace(/[^+\d]/g, "")) + '">' + icon("phone") + esc(C.phone) + '</a>');
    }
    btns.push('<a class="btn" href="' + D.COMPANY.website + '" target="_blank" rel="noopener">' + icon("globe") + 'lxinternational.com</a>');
    if (C.brochure) {
      btns.push('<a class="btn" href="' + esc(C.brochure) + '" target="_blank" rel="noopener">' + icon("download") + 'Brochure (PDF)</a>');
    }
    var who = isTBD(C.person) ? "" : '<p class="contact__who">' + esc(C.person) + ' · ' + esc(C.team) + '</p>';
    return '' +
      '<section class="contact" id="contact" aria-labelledby="contact-title">' +
        '<div class="wrap">' +
          '<div class="contact__card">' +
            '<p class="eyebrow eyebrow--red">Contact</p>' +
            '<h2 id="contact-title">Let’s power your next project</h2>' +
            '<p class="contact__text">Specifications, lead times and delivery options — our ' + esc(C.team) + ' team will get back to you.</p>' +
            who +
            '<div class="contact__actions">' + btns.join("") + '</div>' +
          '</div>' +
        '</div>' +
      '</section>';
  }

  // ---------------------------------------------------------------- home
  function solutionCard(s, i) {
    var media = '<img class="sol-card__img" src="' + s.cardImage + '" alt="" loading="' + (i ? "lazy" : "eager") + '" decoding="async">';
    if (s.cardImage2) media = '<img class="sol-card__img sol-card__img--back" src="' + s.cardImage2 + '" alt="" decoding="async">' + media;
    return '' +
      '<a class="sol-card sol-card--' + s.id + '" href="#/' + s.id + '">' +
        '<div class="sol-card__text">' +
          '<span class="sol-card__no">' + icon(SOL_ICON[s.id]) + s.index + '</span>' +
          '<h2 class="sol-card__title">' + esc(s.title) + '</h2>' +
          '<p class="sol-card__tag">' + esc(s.tagline) + '</p>' +
          '<p class="sol-card__items">' + esc(s.cardItems) + '</p>' +
        '</div>' +
        '<div class="sol-card__media" aria-hidden="true">' + media + '</div>' +
        '<span class="sol-card__go" aria-hidden="true">' + icon("arrow") + '</span>' +
      '</a>';
  }

  function renderHome() {
    document.title = "LX International | Electric Equipment Solutions";
    var values = D.VALUES.map(function (v) {
      return '<li class="value"><span class="value__no">' + v.no + '</span><div><h3>' + esc(v.title) + '</h3><p>' + esc(v.text) + '</p></div></li>';
    }).join("");
    var stats = D.STATS.map(function (s) {
      return '<div class="stat"><strong>' + esc(s.value) + (s.unit ? '<span>' + esc(s.unit) + '</span>' : "") + '</strong><span>' + esc(s.label) + '</span></div>';
    }).join("");
    var flow = D.FLOW.map(function (f, i) {
      return '<li><span>' + String(i + 1).padStart(2, "0") + '</span>' + esc(f) + '</li>';
    }).join("");

    app.innerHTML = '' +
      '<section class="hero">' +
        '<div class="hero__bands" aria-hidden="true"><i></i><i></i></div>' +
        '<div class="wrap hero__inner">' +
          '<div class="hero__top">' +
            '<img class="hero__logo" src="assets/img/brand/lx-logo-onred.svg" alt="LX International" width="188" height="22">' +
          '</div>' +
          '<p class="eyebrow eyebrow--light">Electric Equipment Solutions</p>' +
          '<h1 class="hero__title">Your gateway to Korean&#8209;made power equipment</h1>' +
          '<p class="hero__lead">One partner from sourcing to field service.</p>' +
        '</div>' +
        '<img class="hero__photo" src="assets/img/products/hero-transformer-900.webp" srcset="assets/img/products/hero-transformer-900.webp 900w, assets/img/products/hero-transformer-1600.webp 1600w" sizes="(min-width: 900px) 900px, 120vw" width="1600" height="1102" alt="" fetchpriority="high" decoding="async">' +
      '</section>' +

      '<section class="solutions" aria-label="Solutions">' +
        '<div class="wrap solutions__grid">' + D.SOLUTIONS.map(solutionCard).join("") + '</div>' +
      '</section>' +

      '<section class="why" aria-labelledby="why-title">' +
        '<div class="why__bg" aria-hidden="true"></div>' +
        '<div class="wrap">' +
          '<p class="eyebrow eyebrow--light">Why LX International</p>' +
          '<h2 id="why-title" class="why__title">Value beyond the equipment</h2>' +
          '<ol class="values">' + values + '</ol>' +
          '<div class="stats">' + stats + '</div>' +
        '</div>' +
      '</section>' +

      '<section class="flow" aria-labelledby="flow-title">' +
        '<div class="wrap">' +
          '<p class="eyebrow eyebrow--red">Total service</p>' +
          '<h2 id="flow-title" class="section-title">One partner, from factory to field</h2>' +
          '<ol class="flow__steps">' + flow + '</ol>' +
        '</div>' +
      '</section>' +
      contactBlock() + footer();
  }

  // ---------------------------------------------------------------- solution
  function specRow(cls, ic, label, html) {
    return '<div class="spec ' + cls + '"><dt>' + icon(ic) + label + '</dt><dd>' + html + '</dd></div>';
  }

  function productCard(sol, item, n) {
    var p = D.PRODUCTS[item.id], sp = p.specs;
    var title = item.title || p.name;
    var kicker = item.subtitle || p.family || "";
    var wide = p.image.wide ? " is-wide" : "";
    var illus = p.image.type === "illustration" ? " is-illus" : "";
    var ul = item.ul ? '<img class="product__ul" src="assets/img/badges/ul-mark.svg" alt="UL Certified" width="56" height="56">' : "";
    var cap = sp.rating !== undefined
      ? specRow("", "gauge", "Rating", val(sp.rating, sp.ratingNote))
      : specRow("", "gauge", "Capacity", val(sp.capacity, sp.capacityNote));
    var extra = "";
    if (item.ul) extra += '<p class="product__cert">' + icon("check") + 'UL Certified</p>';
    if (p.highlight) extra += '<p class="product__note">' + esc(p.highlight) + '</p>';
    if (p.components) {
      extra += '<ul class="product__parts">' + p.components.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join("") + '</ul>';
    }
    return '' +
      '<article class="product" id="' + sol.id + '-' + item.id + '">' +
        '<div class="product__stage' + wide + illus + '">' +
          '<span class="product__no">' + String(n).padStart(2, "0") + '</span>' +
          ul +
          '<button class="product__zoom" type="button" aria-label="Enlarge ' + esc(title) + ' image">' +
            productImg(p, "(min-width: 760px) 420px, 88vw", n === 1) +
            '<span class="product__zoom-ico">' + icon("expand") + '</span>' +
          '</button>' +
        '</div>' +
        '<div class="product__body">' +
          (kicker ? '<p class="product__kicker">' + esc(kicker) + '</p>' : "") +
          '<h3 class="product__name">' + esc(title) + '</h3>' +
          '<p class="product__headline">' + esc(p.headline) + '</p>' +
          extra +
          '<dl class="specs">' +
            specRow("", "phase", "Phase", val(sp.phase)) +
            specRow("", "freq", "Frequency", val(sp.frequency)) +
            specRow("", "volt", "Voltage", val(sp.voltage, sp.voltageNote)) +
            cap +
            specRow("spec--wide", "std", "Standards", val(sp.standards)) +
            specRow("spec--wide spec--lead", "clock", "Lead Time", val(sp.leadTime, sp.leadTimeNote)) +
          '</dl>' +
          '<div class="madein"><span class="madein__label">' + icon("pin") + 'Made in</span>' + flags(p.madeIn) + '</div>' +
        '</div>' +
      '</article>';
  }

  function chain(sol) {
    if (!sol.chain) {
      // product index with thumbnails (Power Solution)
      var items = sol.sections[0].items.map(function (it) {
        var p = D.PRODUCTS[it.id];
        return '<a class="pindex__item" href="#/' + sol.id + '/' + it.id + '" data-scroll="' + sol.id + '-' + it.id + '">' +
          '<span class="pindex__img">' + productImg(p, "96px", true) + '</span>' +
          '<span class="pindex__name">' + esc((it.title || p.name).replace(" Transformer", "")) + '</span></a>';
      }).join("");
      return '<div class="panel"><p class="panel__title">Product line-up</p><div class="pindex">' + items + '</div></div>';
    }
    var nodes = sol.chain.map(function (c, i) {
      var inner = '<span class="node__label">' + nb(esc(c.label)) + '</span><span class="node__sub">' + nb(esc(c.sub)) + '</span>';
      var node = c.end
        ? '<span class="node node--end">' + icon(i === 0 ? (sol.id === "ess" ? "battery" : "grid") : (sol.id === "ess" ? "grid" : "server")) + inner + '</span>'
        : '<a class="node" href="#/' + sol.id + '/' + c.ref + '" data-scroll="' + sol.id + '-' + c.ref + '">' + inner + '</a>';
      return node + (i < sol.chain.length - 1 ? '<span class="chain__arrow" aria-hidden="true"></span>' : "");
    }).join("");
    return '<div class="panel"><p class="panel__title">Where we fit in your power chain</p><div class="chain chain--' + sol.chain.length + '">' + nodes + '</div></div>';
  }

  function renderSolution(sol, productId) {
    document.title = sol.title + " | LX International";
    var n = 0;
    var sections = sol.sections.map(function (sec) {
      var cards = sec.items.map(function (it) { n += 1; return productCard(sol, it, n); }).join("");
      return '<section class="psection">' +
        (sec.title ? '<h2 class="psection__title"><span>' + esc(sec.title) + '</span></h2>' : "") +
        '<div class="products">' + cards + '</div></section>';
    }).join("");
    var tabs = D.SOLUTIONS.map(function (s) {
      var on = s.id === sol.id;
      return '<a class="tab' + (on ? " is-active" : "") + '" href="#/' + s.id + '"' + (on ? ' aria-current="page"' : "") + '>' +
        esc(s.title.replace(" Solution", "")) + '</a>';
    }).join("");
    var others = D.SOLUTIONS.filter(function (s) { return s.id !== sol.id; }).map(function (s) {
      return '<a class="other" href="#/' + s.id + '"><span class="other__no">' + icon(SOL_ICON[s.id]) + s.index + '</span>' +
        '<span class="other__title">' + esc(s.title) + '</span><span class="other__tag">' + esc(s.tagline) + '</span>' + icon("arrow", "other__go") + '</a>';
    }).join("");
    var stats = sol.stats ? '<ul class="sol-hero__stats">' + sol.stats.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("") + '</ul>' : "";

    app.innerHTML = '' +
      '<header class="appbar">' +
        '<div class="wrap appbar__inner">' +
          '<a class="appbar__btn" href="#/" data-back aria-label="Back to all solutions">' + icon("back") + '</a>' +
          '<a class="appbar__logo" href="#/" aria-label="LX International home"><img src="assets/img/brand/lx-logo.svg" alt="LX International" width="150" height="17"></a>' +
          '<a class="appbar__btn" href="#contact" data-scroll="contact" aria-label="Contact">' + icon("mail") + '</a>' +
        '</div>' +
      '</header>' +
      '<section class="sol-hero sol-hero--' + sol.id + '">' +
        '<div class="hero__bands" aria-hidden="true"><i></i><i></i></div>' +
        '<div class="wrap sol-hero__inner">' +
          '<nav class="tabs" aria-label="Solutions">' + tabs + '</nav>' +
          '<p class="eyebrow eyebrow--light">' + icon(SOL_ICON[sol.id]) + 'Solution ' + sol.index + '</p>' +
          '<h1 class="sol-hero__title">' + esc(sol.title) + '</h1>' +
          '<p class="sol-hero__intro">' + esc(sol.intro) + '</p>' + stats +
        '</div>' +
      '</section>' +
      '<div class="wrap sol-body">' + chain(sol) + sections + '</div>' +
      contactBlock() +
      '<section class="others" aria-label="Other solutions"><div class="wrap"><p class="eyebrow eyebrow--red">Explore more</p><div class="others__list">' + others + '</div></div></section>' +
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

  function route() {
    var r = parse();
    var sol = D.SOLUTIONS.filter(function (s) { return s.id === r.sol; })[0];
    if (r.sol === "contact") return;                      // in-page anchor, handled by click
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
      window.scrollTo(0, fromSolution ? homeScroll : 0);
    } else {
      cameFromHome = current === "home";
      if (cameFromHome) homeScroll = window.scrollY;
      renderSolution(sol, r.product);
      current = sol.id;
      if (!r.product) window.scrollTo(0, 0);
    }
    app.focus({ preventScroll: true });
  }

  // ---------------------------------------------------------------- interactions
  var lb = document.getElementById("lightbox");
  var lbImg = lb.querySelector("img");
  function openLightbox(img) {
    lbImg.src = img.getAttribute("data-full") || img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lb.hidden = false;
    document.documentElement.classList.add("no-scroll");
    lb.querySelector(".lightbox__close").focus();
  }
  function closeLightbox() {
    lb.hidden = true;
    lbImg.removeAttribute("src");
    document.documentElement.classList.remove("no-scroll");
  }
  lb.addEventListener("click", function (e) {
    if (e.target === lbImg) return;
    closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !lb.hidden) closeLightbox();
  });

  app.addEventListener("click", function (e) {
    var zoom = e.target.closest(".product__zoom");
    if (zoom) { openLightbox(zoom.querySelector("img")); return; }
    // back arrow behaves like the browser back button when we arrived from home
    if (e.target.closest("[data-back]") && cameFromHome) { e.preventDefault(); history.back(); return; }
    var sc = e.target.closest("[data-scroll]");
    if (sc) {
      e.preventDefault();
      var t = document.getElementById(sc.getAttribute("data-scroll"));
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.addEventListener("hashchange", route);
  route();
})();
