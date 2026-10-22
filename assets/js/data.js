/*
 * ─────────────────────────────────────────────────────────────────────────────
 *  LX International · Power Equipment Promotion — 콘텐츠 데이터
 * ─────────────────────────────────────────────────────────────────────────────
 *  페이지에 표시되는 모든 제품 사양·문구는 이 파일 하나에서 관리합니다.
 *  (HTML/디자인 수정 없이 이 파일만 고치면 모든 화면에 반영됩니다.)
 *
 *  ■ TBD 채우기
 *    - 값이 "TBD" 인 항목은 화면에 주황색 'TBD' 표시로 나타납니다.
 *    - 확정되면 따옴표 안의 텍스트만 바꿔 주세요.  예) leadTime: "12 – 16 weeks"
 *
 *  ■ 생산국가(Made in) 바꾸기
 *    - madeIn: ["kr", "tw"]  →  사용 가능한 코드: kr(Korea), tw(Taiwan), id(Indonesia), om(Oman)
 *
 *  ■ 연락처 / 메일 초안
 *    - CONTACT 의 phones · mail(to/cc/subject/body) 를 수정하면 버튼에 바로 반영됩니다.
 *    - mail.to = 수신, mail.cc = 참조 (주소를 따옴표로 감싸 쉼표로 구분해 추가/삭제)
 *    - 메일 초안은 Outlook 호환을 위해 영문·숫자·기본 기호만 사용하세요. (줄바꿈은 \n)
 *    - {product} 자리에는 제품 카드의 'Request a quote' 를 누른 제품명이 들어갑니다.
 *
 *  ■ 일본어 버전
 *    - 일본어 문구는 assets/js/i18n.js 에 있습니다. 이 파일(영문)을 고치면 i18n.js 의 같은 항목도 함께 고쳐 주세요.
 *
 *  ■ 수정 후 GitHub 에 올릴 때
 *    - index.html 안의 "?v=..." 숫자를 하나 올리면 방문자 브라우저 캐시와 상관없이 즉시 새 버전이 보입니다.
 * ─────────────────────────────────────────────────────────────────────────────
 */

window.LXI = {
  COMPANY: {
    name: "LX International Corp.",
    website: "https://www.lxinternational.com",
    offices: [
      { label: "Headquarters · Korea", name: "LX International Corp.",
        address: "LX Gwanghwamun Building, 58 Saemunan-ro, Jongno-gu, Seoul 03184, Korea" },
      { label: "USA", name: "LX International (America), Inc.",
        address: "770 The City Drive South, Suite 7300, Orange, CA 92868, USA" }
    ],
    copyright: "© 2026 LX International Corp. All Rights Reserved."
  },

  CONTACT: {
    team: "Power Equipment",
    phones: [
      { label: "USA", number: "+1-617-991-8500", flag: "assets/img/flags/us.svg" },
      { label: "Korea", number: "+82-10-3380-3240", flag: "assets/img/flags/kr.svg" }
    ],
    mail: {
      to: ["jhbaka@lxintl.co.kr", "maparka@lxintl.co.kr"],                                   // 수신
      cc: ["ihpark@lxintl.co.kr", "hslee@lxintl.co.kr", "ybsonga@lxintl.co.kr",
           "gyhwang@lxintl.co.kr", "jwkimf@lxintl.co.kr"],                                   // 참조
      subject: "Request for Quotation - {product} | LX International",
      generalProduct: "Power Equipment",                  // 제목 {product} 기본값 (상단·하단 Email 버튼)
      generalBodyProduct: "your power equipment solutions", // 본문 {product} 기본값
      body:
        "Dear LX International Team,\n\n" +
        "I would like to request a quotation and further information on {product}.\n\n" +
        "[Company & contact]\n" +
        "- Company:\n" +
        "- Name / Title:\n" +
        "- Phone:\n\n" +
        "[Project]\n" +
        "- Project name & location:\n" +
        "- Application (Utility / Data Center / BESS / Industrial):\n" +
        "- Required on-site delivery date:\n\n" +
        "[Technical requirements]\n" +
        "- Product & quantity:\n" +
        "- Ratings (kV, MVA or kVA, phase, Hz):\n" +
        "- Applicable standards (e.g., ANSI/IEEE, IEC, UL, DOE, CSA):\n" +
        "- Delivery terms (e.g., DDP, CIF):\n\n" +
        "[Additional notes]\n\n\n" +
        "Best regards,\n"
    },
    whatsapp: { name: "Jayde Bak", number: "+82-10-3380-3240",
                text: "Hello Jayde, I would like to know more about LX International's power equipment solutions." },
    // 언어별 브로셔 (null 이면 버튼 숨김) — 일본어 브로셔 제작 전까지 일본어 화면도 영문 PDF 연결
    // PDF 를 교체하면 ?v= 숫자도 올려 주세요 (브라우저 캐시 우회)
    brochure: {
      en: { href: "assets/docs/LX-International_Power-Equipment-Brochure_EN.pdf?v=7", note: "PDF · 16 pages" },
      ja: { href: "assets/docs/LX-International_Power-Equipment-Brochure_EN.pdf?v=7", note: "PDF · 英語版 · 16ページ" }
    }
  },

  COUNTRIES: {
    kr: { name: "Korea", flag: "assets/img/flags/kr.svg" },
    tw: { name: "Taiwan", flag: "assets/img/flags/tw.svg" },
    id: { name: "Indonesia", flag: "assets/img/flags/id.svg" },
    om: { name: "Oman", flag: "assets/img/flags/om.svg" },
    us: { name: "USA", flag: "assets/img/flags/us.svg" },
    jp: { name: "Japan", flag: "assets/img/flags/jp.svg" }
  },

  /* 제품 마스터: 같은 제품이 여러 솔루션에 나오더라도 여기 한 곳만 수정하면 됩니다. */
  PRODUCTS: {
    "power-transformer": {
      name: "Power Transformer",
      family: "Transmission & Substation",
      headline: "up to 500kV / 1,000MVA",
      image: { base: "assets/img/products/power-transformer", w: 1163, h: 1425, type: "photo" },
      specs: {
        phase: "Single / Three-phase",
        frequency: "50 / 60Hz",
        voltage: "69 – 500kV",
        voltageNote: "69 / 115 / 138 / 230 / 345 / 500kV",
        capacity: "up to 1,000MVA",
        insulation: "Oil-immersed",
        insulationNote: "Mineral oil / Natural ester",
        tap: "OLTC / DETC",
        standards: "ANSI (IEEE C57) / IEC 60076",
        leadTime: "18 – 36 months",
        leadTimeNote: "DDP basis"
      },
      madeIn: ["kr", "tw", "id", "om"]
    },

    "pad-mounted": {
      name: "Pad-mounted Transformer",
      family: "Underground Distribution",
      headline: "up to 34.5kV / 10,000kVA",
      image: { base: "assets/img/products/pad-mounted", w: 1003, h: 960, type: "photo" },
      specs: {
        phase: "Single / Three-phase",
        frequency: "50 / 60Hz",
        voltage: "up to 34.5kV class",
        capacity: "up to 10MVA",
        capacityNote: "10,000kVA",
        insulation: "Mineral oil / Natural ester",
        tap: "DETC",
        standards: "ANSI / IEEE / DOE / CSA",
        leadTime: "8 – 16 weeks"
      },
      madeIn: ["kr", "om"]           // Data Center·ESS 의 'Distribution Transformer' 카드도 이 값을 사용
    },

    "pole-mounted": {
      name: "Pole-mounted Transformer",
      family: "Overhead Distribution",
      headline: "up to 34.5kV / 500kVA",
      image: { base: "assets/img/products/pole-mounted", w: 675, h: 1187, type: "photo" },
      specs: {
        phase: "Single / Three-phase",
        frequency: "50 / 60Hz",
        voltage: "up to 34.5kV class",
        capacity: "up to 0.5MVA",
        capacityNote: "500kVA",
        insulation: "Mineral oil / Natural ester",
        tap: "DETC",
        standards: "ANSI / IEEE / DOE",
        leadTime: "8 – 12 weeks"
      },
      madeIn: ["kr"]
    },

    "dry-type": {
      name: "Dry-type Transformer",
      family: "Indoor / Dry Distribution",
      headline: "up to 36kV / 20,000kVA",
      image: { base: "assets/img/products/dry-type", w: 976, h: 1226, type: "photo" },
      specs: {
        phase: "Three-phase",
        frequency: "50 / 60Hz",
        voltage: "up to 36kV class",
        capacity: "up to 20MVA",
        capacityNote: "20,000kVA",
        insulation: "Cast resin / VPI",
        tap: "DETC",
        standards: "ANSI / IEEE / IEC",
        leadTime: "8 – 16 weeks"
      },
      madeIn: ["kr"]
    },

    "mv-gis": {
      name: "MV GIS",
      family: "Gas Insulated Switchgear",
      headline: "24 – 38kV / up to 40kA",
      image: { base: "assets/img/products/mv-gis-render", w: 1600, h: 1195, type: "render" },
      specs: {
        phase: "Three-phase",
        frequency: "50 / 60Hz",
        voltage: "24 – 38kV",
        rating: "up to 4,000A",                // GIS 는 MVA 대신 정격전류/차단전류로 표기
        ratingNote: "40kA short-circuit breaking",
        insulation: "SF6 / Dry air",
        insulationNote: "Dry-air type: GWP 0",
        standards: "IEC / IEEE (ANSI)",
        leadTime: "TBD"
      },
      madeIn: ["kr"]
    },

    "mv-station": {
      name: "MV Station",
      family: "Integrated Skid / Container",
      headline: "Integrated MV skid for BESS",
      components: ["MV switchgear", "Step-up transformer", "Aux. panels", "Containerized skid"],
      image: { base: "assets/img/products/mv-station-render", w: 1600, h: 1073, type: "render" },
      specs: {
        phase: "Three-phase",
        frequency: "TBD",
        voltage: "TBD",
        capacity: "TBD",
        standards: "TBD",
        leadTime: "TBD"
      },
      madeIn: ["kr"]
    }
  },

  /* 솔루션 구성 (첫 화면의 3개 카드 + 각 상세 화면) */
  SOLUTIONS: [
    {
      id: "power",
      index: "01",
      title: "Power Solution",
      tagline: "Transformers up to 500kV",
      cardItems: "Power · Pad · Pole · Dry-type",
      cardImage: "assets/img/products/power-transformer-640.webp",
      intro: "Transformers for transmission, substations and distribution — from 500kV-class power units to pad-mounted, pole-mounted and dry-type.",
      stats: ["up to 500kV", "up to 1,000MVA", "ANSI · IEEE · IEC"],
      sections: [
        { items: [
          { id: "power-transformer" },
          { id: "pad-mounted" },
          { id: "pole-mounted" },
          { id: "dry-type" }
        ] }
      ]
    },
    {
      id: "data-center",
      index: "02",
      title: "Data Center Solution",
      tagline: "From grid to IT load",
      cardItems: "Power TR · UL Pad-mount · MV GIS",
      cardImage: "assets/img/products/pad-mounted-640.webp",
      intro: "Reliable power from the utility interconnection to the data hall — for hyperscale, colocation and campus substations.",
      stats: ["HV to LV", "UL-certified distribution TR", "MV GIS up to 38kV"],
      chain: [
        { label: "Utility Grid", sub: "HV", end: true },
        { label: "Power TR", sub: "HV / MV", ref: "power-transformer" },
        { label: "MV GIS", sub: "MV distribution", ref: "mv-gis" },
        { label: "Dist. TR", sub: "MV / LV", ref: "pad-mounted" },
        { label: "IT Load", sub: "UPS · racks", end: true }
      ],
      why: {
        title: "Data center challenges — and how we help",
        items: [
          { icon: "clock", title: "Speed to power", text: "Distribution transformers in 8–16 weeks and EHV power transformers in 18–21 months help you energize on schedule." },
          { icon: "shield", title: "Supply-chain risk", text: "Approved factories, pre-inspection and a 100% P-Bond on every supply." },
          { icon: "truck", title: "Delivery to site", text: "Ocean, inland transport, installation and O&M coordinated by one partner." }
        ]
      },
      sections: [
        { items: [
          { id: "power-transformer" },
          { id: "pad-mounted", title: "Distribution Transformer", subtitle: "Pad-mounted Transformer", ul: true },
          { id: "mv-gis" }
        ] }
      ]
    },
    {
      id: "ess",
      index: "03",
      title: "ESS Solution",
      tagline: "Grid-ready BESS interconnection",
      cardItems: "MV Station · Power TR · Pad-mount",
      cardImage: "assets/img/products/mv-station-render-900.webp",
      intro: "Integrated MV stations and transformers that connect battery energy storage to the grid.",
      stats: ["Integrated MV station", "Power & distribution TR", "BESS supply in Japan"],
      chain: [
        { label: "Battery & PCS", sub: "LV AC", end: true },
        { label: "MV Station", sub: "LV / MV step-up", ref: "mv-station" },
        { label: "Power TR", sub: "MV / HV", ref: "power-transformer" },
        { label: "Utility Grid", sub: "POI", end: true }
      ],
      sections: [
        { title: "MV Station", items: [ { id: "mv-station" } ] },
        { title: "Transformer", items: [
          { id: "power-transformer" },
          { id: "pad-mounted", title: "Distribution Transformer", subtitle: "Pad-mounted Transformer", ul: true }
        ] }
      ]
    }
  ],

  /* Business Roadmap — 공급 품목 (Items) */
  SCOPE: ["Transformer", "GIS", "Switchgear", "MV Station", "Inverter", "CHP System", "Cable"],

  /* Business Roadmap — Manufacturer → LXI → Customer  (제조사명은 비공개, 국가별 수만 표기) */
  MODEL: {
    makers: { title: "Manufacturers", note: "approved manufacturers",
              pool: [{ code: "kr", count: 8 }, { code: "tw", count: 3 }, { code: "id", count: 1 }, { code: "om", count: 1 }] },
    lxi: { title: "LX International", roles: ["Sourcing & contracting", "Logistics", "Installation & O&M"] },
    customers: { title: "Customers", types: ["Utility", "Industrial — renewables, data centers, etc."] }
  },

  /* Global network 지도 — 좌표는 make_dotmap.py 와 같은 기준 (lon0/lat0/step/cell) */
  MAP: {
    lon0: -15, lat0: 66, step: 2.5, cell: 10, width: 1250, height: 440, dots: "assets/img/world-dots.svg",
    hub: "kr",
    sources: [
      { code: "kr", lon: 127.0, lat: 37.5 },
      { code: "tw", lon: 121.0, lat: 23.7 },
      { code: "id", lon: 106.8, lat: -6.2 },
      { code: "om", lon: 56.7, lat: 24.4 }
    ],
    markets: [
      { name: "USA", lon: -98, lat: 39.5, focus: true, label: "top" },
      { name: "Japan / APAC", lon: 139.7, lat: 35.7, label: "right" },
      { name: "Middle East", lon: 46.7, lat: 24.7, label: "bottom" },
      { name: "Europe", lon: 10.0, lat: 50.0, label: "bottom" }
    ],
    logistics: "Ocean freight delivered in-house by LX Pantos — an LX International subsidiary and global No.6 forwarder — extended to our logistics partner pool with deep transformer and project-cargo references."
  },

  /* 첫 화면: LXI 가치 제안 */
  VALUES: [
    { no: "01", title: "Gateway to Asian-made equipment",
      text: "An approved pool of 13 leading manufacturers in Korea, Taiwan, Indonesia and Oman — factory pre-inspection and a 100% P-Bond on every supply." },
    { no: "02", title: "Logistics, delivered in-house",
      text: "Ocean freight by LX Pantos, an LX International subsidiary and global No.6 forwarder — extended to specialist partners for transformer and project cargo." },
    { no: "03", title: "Installation, O&M and beyond",
      text: "Local partners for installation, A/S and warranty — and growing into EPC and investment as a power & energy business developer." }
  ],

  STATS: [
    { icon: "flag", value: "1953", label: "Founded" },
    { icon: "factory", value: "13", label: "Approved manufacturers" },
    { icon: "ship", value: "No.6", label: "Global forwarder — LX Pantos" },
    { icon: "clock", value: "8–16", unit: "wks", label: "Distribution TR lead time" },
    { icon: "clock", value: "18–21", unit: "mo", label: "EHV power TR lead time (OLTC)" },
    { icon: "shield", value: "100%", label: "P-Bond secured" }
  ],

  /* Current Status & Pipeline — state: delivering | developing, tags: 해당 솔루션 페이지에도 표시 */
  TRACK: [
    { region: "USA", flag: "us", items: [
      { state: "delivering", text: "EHV power transformers for U.S. utilities — supply commenced in 2025", tags: ["power", "data-center"] },
      { state: "developing", text: "Transformers for U.S. data centers", tags: ["data-center"] }
    ] },
    { region: "Japan", flag: "jp", items: [
      { state: "delivering", text: "Supply to a Japanese BESS operator and a shipyard", tags: ["ess"] },
      { state: "developing", text: "BESS project development in Japan and Australia", tags: ["ess"] }
    ] }
  ],

  /* 인증·시험 대응 (공식 로고 대신 텍스트 배지 — 인증서·성적서는 승인 제조사가 보유) */
  CERTS: {
    groups: [
      { label: "Type tests", items: [{ code: "KEMA", desc: "Netherlands" }, { code: "KERI", desc: "Korea" }] },
      { label: "Management systems", items: [{ code: "ISO 9001", desc: "Quality" }, { code: "ISO 14001", desc: "Environment" }, { code: "ISO 45001", desc: "Health & safety" }] },
      { label: "Product certification", items: [{ code: "UL", desc: "USA" }, { code: "CSA", desc: "Canada" }] },
      { label: "Design standards", items: [{ code: "IEEE C57", desc: "Transformers" }, { code: "IEC 60076", desc: "Transformers" }, { code: "ANSI", desc: "USA" }, { code: "DOE", desc: "Efficiency" }] }
    ],
    note: "Available through our approved manufacturers — certificates and type-test reports are provided per project."
  },

  /* 방문 통계 (Umami Cloud) — Website ID 를 넣으면 자동으로 켜집니다. 비워두면 통계 미사용 */
  ANALYTICS: { umamiWebsiteId: "" },

  /* Scaling Up */
  SCALE: {
    label: "Power & Energy Biz. Developer",
    now: ["Electrical equipment", "Services"],
    next: ["EPC", "Investor / Developer"]
  }
};
