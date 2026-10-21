/* LX International · Power Equipment promotion — view rendering & routing */
(function () {
  "use strict";

  var D = window.LXI;
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
    return s.replace(/(\w)-(\w)/g, "$1‑$2");
  }
  function val(v, note) {
    if (isTBD(v)) return '<span class="tbd">TBD</span>';
    return nb(esc(v)) + (note ? '<small>' + esc(note) + '</small>' : "");
  }
  function pad2(n) {
    return String(n).padStart(2, "0");
  }
  function telHref(number) {
    return "tel:" + number.replace(/[^+\d]/g, "");
  }
  // Outlook-safe mailto: ASCII only (classic Outlook garbles UTF-8 in mailto) and CRLF line breaks (RFC 6068)
  function ascii(s) {
    return s.replace(/[‐-―−]/g, "-").replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
      .replace(/·/g, "-").replace(/[^\t\n\r\x20-\x7E]/g, "");
  }
  function mailHref(product) {
    var M = D.CONTACT.mail;
    var subject = M.subject.replace("{product}", product || M.generalProduct);
    var body = M.body.replace("{product}", product ? "the " + product : M.generalBodyProduct).replace(/\r?\n/g, "\r\n");
    return "mailto:" + D.CONTACT.email + "?subject=" + encodeURIComponent(ascii(subject)) +
      "&body=" + encodeURIComponent(ascii(body));
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
    flag: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>'
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
    // "render": full scene with its own backdrop
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
  function flags(codes) {
    return codes.map(flag).join("");
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

  function contactBlock() {
    var C = D.CONTACT;
    var nums = C.phones.map(function (p) {
      return '<span class="cnum"><img src="' + p.flag + '" alt="" width="18" height="12">' + esc(p.number) + '</span>';
    }).join("");
    var btns = [
      '<a class="btn btn--primary" href="' + mailHref() + '">' + icon("mail") +
        '<span class="btn__text">Email us<small>' + esc(C.email) + '</small></span></a>',
      '<button class="btn" type="button" data-call aria-haspopup="dialog">' + icon("phone") +
        '<span class="btn__text">Call us<small class="cnums">' + nums + '</small></span></button>'
    ];
    if (C.brochure) {
      btns.push('<a class="btn" href="' + esc(C.brochure.href) + '" target="_blank" rel="noopener">' + icon("download") +
        '<span class="btn__text">Download brochure<small>' + esc(C.brochure.note) + '</small></span></a>');
    }
    btns.push('<a class="btn" href="' + D.COMPANY.website + '" target="_blank" rel="noopener">' + icon("globe") +
      '<span class="btn__text">Visit our website<small>lxinternational.com</small></span></a>');
    return '' +
      '<section class="contact" id="contact" aria-labelledby="contact-title">' +
        '<div class="wrap">' +
          '<div class="contact__card">' +
            '<p class="eyebrow eyebrow--red">Contact</p>' +
            '<h2 id="contact-title" class="contact__title">Let’s power your next project</h2>' +
            '<p class="contact__text">Specifications, lead times and delivery options — our ' + esc(C.team) + ' team will get back to you.</p>' +
            '<div class="contact__actions">' + btns.join("") + '</div>' +
          '</div>' +
        '</div>' +
      '</section>';
  }

  function statusChip(status) {
    return '<span class="status' + (/develop/i.test(status) ? " status--dev" : "") + '">' + esc(status) + '</span>';
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
    var M = D.MAP;
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
    var brochure = D.CONTACT.brochure
      ? '<a class="map__cta" href="' + esc(D.CONTACT.brochure.href) + '" target="_blank" rel="noopener">' + icon("download") + 'Download brochure<small>' + esc(D.CONTACT.brochure.note) + '</small></a>'
      : "";
    return '' +
      '<div class="netmap">' +
        '<div class="map" style="aspect-ratio:' + M.width + "/" + M.height + '" role="img" aria-label="Map: sourcing hubs in Korea, Taiwan, Indonesia and Oman serving the USA, Japan / APAC, the Middle East and Europe">' +
          '<img class="map__dots" src="' + M.dots + '" alt="" width="' + M.width + '" height="' + M.height + '" loading="lazy" decoding="async">' +
          '<svg class="map__routes" viewBox="0 0 ' + M.width + " " + M.height + '" preserveAspectRatio="none" aria-hidden="true">' + routes + '</svg>' +
          pins +
        '</div>' +
        '<div class="map__legend">' +
          '<span class="lg lg--src"><i></i>Sourcing hubs<span class="lg__flags">' + srcFlags + '</span></span>' +
          '<span class="lg lg--mkt"><i></i>Key markets</span>' +
          '<span class="lg lg--route"><i></i>LX Pantos logistics</span>' +
        '</div>' +
        '<p class="map__note">' + icon("ship") + '<span>' + esc(M.logistics) + '</span></p>' +
        brochure +
      '</div>';
  }

  function trackBlock() {
    return D.TRACK.map(function (t) {
      var items = t.items.map(function (it) {
        return '<li>' + statusChip(it.status) + '<p>' + esc(it.text) + '</p></li>';
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
        '<p class="next__label">' + icon("rocket") + '<span>Scaling up<b>' + esc(S.label) + '</b></span></p>' +
        '<div class="scale">' +
          '<div class="scale__row">' + boxes(S.now, "") + '</div>' +
          '<div class="scale__arrow" aria-hidden="true"><span>Expansion</span></div>' +
          '<div class="scale__row">' + boxes(S.next, "is-next") + '</div>' +
        '</div>' +
      '</div>';
  }

  function renderHome() {
    document.title = "LX International | Power Equipment Solutions";
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
          '<a class="homebar__logo" href="#/" tabindex="-1" data-top aria-label="LX International — back to top"><img src="assets/img/brand/lx-logo.svg" alt="LX International" width="150" height="17"></a>' +
          '<a class="homebar__cta" href="#contact" tabindex="-1" data-scroll="contact">' + icon("mail") + 'Contact</a>' +
        '</div>' +
      '</header>' +

      '<section class="hero">' +
        '<div class="hero__bands" aria-hidden="true"><i></i><i></i></div>' +
        '<div class="wrap hero__inner">' +
          '<div class="hero__top">' +
            '<img class="hero__logo" src="assets/img/brand/lx-logo-onred.svg" alt="LX International" width="188" height="22">' +
          '</div>' +
          '<p class="eyebrow eyebrow--light">Power Equipment Solutions</p>' +
          '<h1 class="hero__title">Your gateway to Asian&#8209;made power equipment</h1>' +
          '<p class="hero__lead">One partner from sourcing to field service.</p>' +
        '</div>' +
        '<img class="hero__photo" src="assets/img/products/hero-transformer-900.webp" srcset="assets/img/products/hero-transformer-900.webp 900w, assets/img/products/hero-transformer-1600.webp 1600w" sizes="(min-width: 900px) 880px, 112vw" width="1600" height="1102" alt="" fetchpriority="high" decoding="async">' +
      '</section>' +

      '<section class="solutions" aria-label="Solutions">' +
        '<div class="wrap solutions__grid">' + D.SOLUTIONS.map(solutionCard).join("") + '</div>' +
      '</section>' +

      '<section class="scope" aria-labelledby="scope-title">' +
        '<div class="wrap">' +
          '<p class="eyebrow eyebrow--red">Business model</p>' +
          '<h2 id="scope-title" class="section-title">Total provider of electrical equipment</h2>' +
          '<p class="section-lead">From Asian factories to your site — one partner across sourcing, logistics and installation.</p>' +
          '<ul class="scope__list" aria-label="Scope of supply">' + scope + '</ul>' +
          modelBlock() +
        '</div>' +
      '</section>' +

      '<section class="network" aria-labelledby="network-title">' +
        '<div class="wrap">' +
          '<p class="eyebrow eyebrow--red">Global network</p>' +
          '<h2 id="network-title" class="section-title">Sourced in Asia, delivered worldwide</h2>' +
          mapBlock() +
        '</div>' +
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

      '<section class="tracks" aria-labelledby="track-title">' +
        '<div class="wrap">' +
          '<p class="eyebrow eyebrow--red">Track record & pipeline</p>' +
          '<h2 id="track-title" class="section-title">Delivering today, building tomorrow</h2>' +
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
      bar.querySelectorAll("a").forEach(function (a) { a.tabIndex = show ? 0 : -1; });
    }, { rootMargin: "-80px 0px 0px 0px" });
    heroWatch.observe(hero);
  }

  // ---------------------------------------------------------------- solution
  function specRow(cls, ic, label, html) {
    return '<div class="spec ' + cls + '"><dt>' + icon(ic) + label + '</dt><dd>' + html + '</dd></div>';
  }

  function productCard(sol, item, n) {
    var p = D.PRODUCTS[item.id], sp = p.specs;
    var title = item.title || p.name;
    var kicker = item.subtitle || p.family || "";
    var render = p.image.type === "render" ? " is-render" : "";
    var ul = item.ul ? '<img class="product__ul" src="assets/img/badges/ul-mark.svg" alt="UL Certified" width="56" height="56">' : "";
    var cap = sp.rating !== undefined
      ? specRow("", "gauge", "Rating", val(sp.rating, sp.ratingNote))
      : specRow("", "gauge", "Capacity", val(sp.capacity, sp.capacityNote));
    var phase = specRow("", "phase", "Phase", val(sp.phase)) + specRow("", "freq", "Frequency", val(sp.frequency));
    var grid;
    if (sp.voltageNote && sp.voltageNote.length > 22 && sp.insulation !== undefined && sp.tap !== undefined) {
      // long voltage list (e.g. 69/115/138/230/345/500kV): give voltage & insulation full rows, pair capacity with tap changer
      grid = phase + cap + specRow("", "tap", "Tap changer", val(sp.tap)) +
        specRow("spec--wide", "volt", "Voltage", val(sp.voltage, sp.voltageNote)) +
        specRow("spec--wide", "drop", "Insulation", val(sp.insulation, sp.insulationNote));
    } else {
      grid = phase + specRow("", "volt", "Voltage", val(sp.voltage, sp.voltageNote)) + cap;
      if (sp.insulation !== undefined && sp.tap !== undefined) {
        grid += specRow("", "drop", "Insulation", val(sp.insulation, sp.insulationNote)) + specRow("", "tap", "Tap changer", val(sp.tap));
      } else if (sp.insulation !== undefined) {
        grid += specRow("spec--wide", "drop", "Insulation", val(sp.insulation, sp.insulationNote));
      }
    }
    var extra = "";
    if (item.ul) extra += '<p class="product__cert">' + icon("check") + 'UL Certified</p>';
    if (p.components) {
      extra += '<ul class="product__parts">' + p.components.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join("") + '</ul>';
    }
    return '' +
      '<article class="product" id="' + sol.id + '-' + item.id + '">' +
        '<div class="product__stage' + render + '" style="--ar:' + p.image.w + '/' + p.image.h + '">' +
          '<span class="product__no">' + pad2(n) + '</span>' +
          ul +
          '<button class="product__zoom" type="button" aria-label="Enlarge ' + esc(title) + ' image">' +
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
            specRow("spec--wide", "std", "Standards", val(sp.standards)) +
            specRow("spec--wide spec--lead", "clock", "Lead Time", val(sp.leadTime, sp.leadTimeNote)) +
          '</dl>' +
          '<div class="madein"><span class="madein__label">' + icon("pin") + 'Made in</span>' + flags(p.madeIn) + '</div>' +
          '<a class="product__rfq" href="' + mailHref((item.subtitle || title) + (item.ul ? " (UL)" : "")) + '">' + icon("mail") + 'Request a quote' + icon("arrow", "product__rfq-go") + '</a>' +
        '</div>' +
      '</article>';
  }

  function topPanel(sol) {
    if (!sol.chain) {
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
      var endIcon = i === 0 ? (sol.id === "ess" ? "battery" : "grid") : (sol.id === "ess" ? "grid" : "server");
      var node = c.end
        ? '<span class="node node--end">' + icon(endIcon) + inner + '</span>'
        : '<a class="node" href="#/' + sol.id + '/' + c.ref + '" data-scroll="' + sol.id + '-' + c.ref + '">' + inner + '</a>';
      return node + (i < sol.chain.length - 1 ? '<span class="chain__arrow" aria-hidden="true"></span>' : "");
    }).join("");
    return '<div class="panel"><p class="panel__title">Where we fit in your power chain</p><div class="chain chain--' + sol.chain.length + '">' + nodes + '</div></div>';
  }

  function proofStrip(sol) {
    var rows = [];
    D.TRACK.forEach(function (t) {
      t.items.forEach(function (it) {
        if (it.tags && it.tags.indexOf(sol.id) >= 0) rows.push('<li>' + flagImg(t.flag, 24, 16) + '<div>' + statusChip(it.status) + '<p>' + esc(it.text) + '</p></div></li>');
      });
    });
    return rows.length ? '<section class="proof" aria-label="Track record"><p class="panel__title">Track record & pipeline</p><ul>' + rows.join("") + '</ul></section>' : "";
  }

  var DEFAULT_WHY = {
    title: "Why source through LX International",
    items: [
      { icon: "clock", title: "Short lead times", text: "Distribution transformers in 8–16 weeks; EHV power transformers in 18–21 months." },
      { icon: "shield", title: "Secured supply", text: "Pre-inspected, approved factories and a 100% P-Bond on every supply." },
      { icon: "truck", title: "Door-to-site delivery", text: "LX Pantos logistics plus local partners for installation and O&M." }
    ]
  };
  function whyStrip(sol) {
    var W = sol.why || DEFAULT_WHY;
    var items = W.items.map(function (w) {
      return '<li><span class="whys__ico">' + icon(w.icon) + '</span><div><h3>' + esc(w.title) + '</h3><p>' + esc(w.text) + '</p></div></li>';
    }).join("");
    return '<section class="whys" aria-label="' + esc(W.title) + '"><p class="panel__title">' + esc(W.title) + '</p><ul>' + items + '</ul></section>';
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
      '<div class="wrap sol-body">' + topPanel(sol) + proofStrip(sol) + sections + whyStrip(sol) + '</div>' +
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
      window.scrollTo(0, fromSolution ? homeScroll : 0);
      if (r.sol === "contact") requestAnimationFrame(function () { scrollToId("contact"); });
    } else {
      if (heroWatch) { heroWatch.disconnect(); heroWatch = null; }
      cameFromHome = current === "home";
      if (cameFromHome) homeScroll = window.scrollY;
      renderSolution(sol, r.product);
      current = sol.id;
      if (!r.product) window.scrollTo(0, 0);
    }
    app.focus({ preventScroll: true });
  }

  function scrollToId(id) {
    var t = document.getElementById(id);
    if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------------------------------------------------------------- overlays (built here, so a stale cached index.html can never break them)
  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }
  function removeById(id) {
    var o = document.getElementById(id);
    if (o) o.parentNode.removeChild(o);
  }
  ["lightbox", "callSheet", "toast"].forEach(removeById);

  var lb = el('<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" hidden>' +
    '<button class="lightbox__close" type="button" aria-label="Close image">&times;</button><img alt=""></div>');
  var sheet = el('<div class="sheet" id="callSheet" role="dialog" aria-modal="true" aria-labelledby="callSheetTitle" hidden>' +
    '<div class="sheet__panel">' +
      '<p class="sheet__title" id="callSheetTitle">Call LX International</p>' +
      '<p class="sheet__sub">Choose a number to call</p>' +
      '<ul class="sheet__list">' + D.CONTACT.phones.map(function (p) {
        return '<li class="sheet__row">' +
          '<a class="sheet__call" href="' + telHref(p.number) + '"><img src="' + p.flag + '" alt="" width="30" height="20">' +
            '<span class="sheet__num"><strong>' + esc(p.label) + '</strong>' + esc(p.number) + '</span>' +
            '<span class="sheet__dial">' + icon("phone") + '</span></a>' +
          '<button class="sheet__copy" type="button" data-copy="' + esc(p.number) + '" aria-label="Copy ' + esc(p.label) + ' number">' + icon("copy") + '</button>' +
        '</li>';
      }).join("") + '</ul>' +
      '<button class="sheet__cancel" type="button" data-close>Cancel</button>' +
    '</div></div>');
  var toast = el('<div class="toast" id="toast" role="status" aria-live="polite" hidden></div>');
  document.body.appendChild(sheet);
  document.body.appendChild(lb);
  document.body.appendChild(toast);
  var lbImg = lb.querySelector("img");

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
    if (lb.hidden && sheet.hidden) document.documentElement.classList.remove("no-scroll");
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
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
  lb.addEventListener("click", function (e) {
    if (e.target === lbImg) return;
    closeLayer(lb);
    lbImg.removeAttribute("src");
  });

  var toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 1800);
  }
  function copyText(text) {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
      document.body.removeChild(ta);
      showToast(ok ? "Number copied" : text);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { showToast("Number copied"); }, fallback);
    } else {
      fallback();
    }
  }
  sheet.addEventListener("click", function (e) {
    var cp = e.target.closest("[data-copy]");
    if (cp) { copyText(cp.getAttribute("data-copy")); return; }
    if (e.target === sheet || e.target.closest("[data-close]")) closeLayer(sheet);
    else if (e.target.closest(".sheet__call")) setTimeout(function () { closeLayer(sheet); }, 400);
  });

  document.addEventListener("keydown", function (e) {
    var layer = !lb.hidden ? lb : (!sheet.hidden ? sheet : null);
    if (!layer) return;
    if (e.key === "Escape") { closeLayer(layer); if (layer === lb) lbImg.removeAttribute("src"); }
    else if (e.key === "Tab") trapTab(layer, e);
  });

  app.addEventListener("click", function (e) {
    var zoom = e.target.closest(".product__zoom");
    if (zoom) { openLightbox(zoom.querySelector("img")); return; }
    if (e.target.closest("[data-call]")) { openLayer(sheet); return; }
    if (e.target.closest("[data-top]")) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    // back arrow behaves like the browser back button when we arrived from home
    if (e.target.closest("[data-back]") && cameFromHome) { e.preventDefault(); history.back(); return; }
    var sc = e.target.closest("[data-scroll]");
    if (sc) {
      e.preventDefault();
      scrollToId(sc.getAttribute("data-scroll"));
    }
  });

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.addEventListener("hashchange", route);
  route();
})();
