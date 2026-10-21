/*
 * ─────────────────────────────────────────────────────────────────────────────
 *  LX International · Power Equipment Promotion — 콘텐츠 데이터
 * ─────────────────────────────────────────────────────────────────────────────
 *  페이지에 표시되는 모든 제품 사양·문구는 이 파일 하나에서 관리합니다.
 *  (HTML/디자인 수정 없이 이 파일만 고치면 모든 화면에 반영됩니다.)
 *
 *  ■ TBD 채우기
 *    - 값이 "TBD" 인 항목은 화면에 주황색 'TBD' 표시로 나타납니다.
 *    - 확정되면 따옴표 안의 텍스트만 바꿔 주세요.  예) leadTime: "12–16 months"
 *
 *  ■ 생산국가(Made in) 바꾸기
 *    - madeIn: ["kr", "tw"]  →  사용 가능한 코드: kr(Korea), tw(Taiwan), id(Indonesia), om(Oman)
 *
 *  ■ 연락처
 *    - CONTACT.email / phones / mailSubject / mailBody 를 수정하면 버튼에 바로 반영됩니다.
 *    - mailBody 의 줄바꿈은 \n 으로 표시합니다.
 * ─────────────────────────────────────────────────────────────────────────────
 */

window.LXI = {
  COMPANY: {
    name: "LX International Corp.",
    website: "https://www.lxinternational.com",
    offices: [
      { label: "Headquarters (Korea)", name: "LX International Corp.",
        address: "LX Gwanghwamun Building, 58 Saemunan-ro, Jongno-gu, Seoul 03184, Korea" },
      { label: "USA", name: "LX International (America), Inc.",
        address: "770 The City Drive South, Suite 7300, Orange, CA 92868, USA" }
    ],
    copyright: "© 2026 LX International Corp. All Rights Reserved."
  },

  CONTACT: {
    team: "Power Equipment",
    email: "jhbaka@lxintl.co.kr",
    phones: [
      { label: "USA", number: "+1-617-991-8500", flag: "assets/img/flags/us.svg" },
      { label: "Korea", number: "+82-10-3380-3240", flag: "assets/img/flags/kr.svg" }
    ],
    // 메일 버튼 클릭 시 자동 작성되는 초안 (제품 카드의 'Request a quote' 는 {product} 자리에 제품명이 들어갑니다)
    mailSubject: "[Inquiry] {product} – LX International Power Equipment",
    mailBody:
      "Dear LX International Power Equipment Team,\n\n" +
      "We are interested in {product} and would like to request a quotation / further information.\n\n" +
      "■ Company / Name:\n" +
      "■ Project name & location:\n" +
      "■ Product & quantity:\n" +
      "■ Key ratings (kV, MVA/kVA, phase, frequency):\n" +
      "■ Applicable standards (e.g., ANSI/IEEE, IEC, UL, DOE):\n" +
      "■ Required delivery date (on site):\n" +
      "■ Delivery terms (e.g., DDP, CIF):\n" +
      "■ Additional requirements:\n\n" +
      "Please reach me at:\n" +
      "■ Email:\n" +
      "■ Phone:\n\n" +
      "Best regards,\n",
    defaultProduct: "your power equipment solutions",
    brochure: "assets/docs/LX-International_Power-Distribution-Transformer.pdf"   // 제조사 로고 제거본 (null 이면 버튼 숨김)
  },

  COUNTRIES: {
    kr: { name: "Korea", flag: "assets/img/flags/kr.svg" },
    tw: { name: "Taiwan", flag: "assets/img/flags/tw.svg" },
    id: { name: "Indonesia", flag: "assets/img/flags/id.svg" },
    om: { name: "Oman", flag: "assets/img/flags/om.svg" }
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
        voltageNote: "69 / 115 / 138 / 230 / 345kV",
        capacity: "up to 1,000MVA",
        insulation: "Oil-immersed",
        insulationNote: "Mineral oil / Natural ester",
        tap: "OLTC / DETC",
        standards: "ANSI (IEEE C57) / IEC 60076",
        leadTime: "18 – 36 months",
        leadTimeNote: "DDP basis"
      },
      madeIn: ["kr", "tw", "id"]
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
      madeIn: ["kr"]
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
        ratingNote: "40kA breaking",
        insulation: "SF6 / Dry air",
        insulationNote: "Dry air: GWP 0",
        standards: "IEC / IEEE (ANSI)",
        leadTime: "TBD"
      },
      madeIn: ["kr"]
    },

    "mv-station": {
      name: "MV Station",
      family: "Integrated Skid / Container",
      headline: "Integrated MV skid for BESS",
      components: ["MV switchgear", "Step-up transformer", "Aux. panels 1 & 2", "Container / skid"],
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
      intro: "Transformers for transmission, substations and distribution — from 500kV-class power units to pole-mounted and dry-type distribution.",
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
      chain: [
        { label: "Utility Grid", sub: "HV", end: true },
        { label: "Power TR", sub: "HV / MV", ref: "power-transformer" },
        { label: "MV GIS", sub: "MV distribution", ref: "mv-gis" },
        { label: "Dist. TR", sub: "MV / LV", ref: "pad-mounted" },
        { label: "IT Load", sub: "UPS · racks", end: true }
      ],
      challenges: [
        { title: "Speed to power", text: "Long transformer queues delay energization. We offer distribution transformers in 8–16 weeks and EHV units in 18–21 months." },
        { title: "Supply-chain risk", text: "Vetted factories, pre-inspection and a 100% P-Bond on every supply." },
        { title: "Site delivery", text: "Ocean, inland transport, installation and O&M coordinated by one partner." }
      ],
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

  /* 공급 범위 (Business Roadmap – Items) */
  SCOPE: ["Transformer", "GIS", "Switchgear", "MV Station", "Inverter", "CHP System", "Cable"],

  /* 사업 모델: Manufacturer → LXI → Customer */
  MODEL: {
    makers: { title: "Manufacturers", note: "13 approved factories", countries: ["kr", "tw", "id", "om"] },
    lxi: { title: "LX International", roles: ["Sourcing & contracting", "Logistics", "Installation & O&M"] },
    customers: { title: "Customers", types: ["Utility", "Industrial — renewables, data centers, etc."],
                 regions: [{ name: "USA", focus: true }, { name: "Japan / APAC" }, { name: "Middle East" }, { name: "Europe" }] }
  },

  /* 첫 화면: LXI 가치 제안 */
  VALUES: [
    { no: "01", title: "Gateway to Asian-made equipment",
      text: "An approved pool of leading manufacturers in Korea, Taiwan, Indonesia and Oman. Factory pre-inspection and a 100% P-Bond on every supply." },
    { no: "02", title: "Supply chain, delivered in-house",
      text: "Ocean freight by our affiliate LX Pantos, a global top-6 forwarder, extended to specialist partners with deep transformer and project-cargo references." },
    { no: "03", title: "Installation, O&M and beyond",
      text: "Local partners for installation, A/S and warranty — and project development, EPC and investment as a power & energy developer." }
  ],

  STATS: [
    { value: "1953", label: "Founded" },
    { value: "13", label: "Approved manufacturers" },
    { value: "4", label: "Sourcing countries" },
    { value: "No.6", label: "Global forwarder (LX Pantos)" },
    { value: "18–21", unit: "mo", label: "EHV TR lead time (OLTC)" },
    { value: "100%", label: "P-Bond secured" }
  ],

  /* 실적 & 파이프라인 (Current Status & Pipeline) */
  TRACK: [
    { region: "USA", flag: "assets/img/flags/us.svg", items: [
      { status: "Delivering", text: "EHV power transformers for U.S. utilities — supply commenced in 2025" },
      { status: "Developing", text: "Transformers for U.S. data centers" }
    ] },
    { region: "Japan", flag: "assets/img/flags/jp.svg", items: [
      { status: "Delivering", text: "Supply to a Japanese BESS operator and a shipyard" },
      { status: "Developing", text: "BESS project development in Japan and Australia" }
    ] }
  ],

  /* 사업 확장 방향 (Scaling Up) */
  SCALE: {
    now: ["Electrical equipment", "Services"],
    next: ["EPC", "Investor / Developer"],
    label: "Power & Energy Biz. Developer"
  }
};
