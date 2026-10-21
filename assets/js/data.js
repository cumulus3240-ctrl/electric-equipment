/*
 * ─────────────────────────────────────────────────────────────────────────────
 *  LX International · Electric Equipment Promotion — 콘텐츠 데이터
 * ─────────────────────────────────────────────────────────────────────────────
 *  페이지에 표시되는 모든 제품 사양·문구는 이 파일 하나에서 관리합니다.
 *  (HTML/디자인 수정 없이 이 파일만 고치면 모든 화면에 반영됩니다.)
 *
 *  ■ TBD 채우기
 *    - 값이 "TBD" 인 항목은 화면에 주황색 'TBD' 표시로 나타납니다.
 *    - 확정되면 따옴표 안의 텍스트만 바꿔 주세요.  예) leadTime: "12–16 months"
 *
 *  ■ 생산국가(Made in) 바꾸기
 *    - madeIn: ["kr", "tw"]  →  사용 가능한 코드: kr(Korea), tw(Taiwan), id(Indonesia)
 *    - 국가를 추가하려면 아래 COUNTRIES 에 코드/국기 파일을 추가합니다.
 *
 *  ■ 연락처
 *    - CONTACT 의 email / phone 을 입력하면 하단 버튼이 자동으로 활성화됩니다.
 * ─────────────────────────────────────────────────────────────────────────────
 */

window.LXI = {
  COMPANY: {
    name: "LX International Corp.",
    website: "https://www.lxinternational.com",
    address: "LX Gwanghwamun Building, 58 Saemunan-ro, Jongno-gu, Seoul 03184, Korea",
    copyright: "© 2026 LX International Corp. All Rights Reserved."
  },

  CONTACT: {
    team: "Electric Equipment Sales",          // 담당 조직명
    person: "TBD",                             // 담당자명 (선택)
    email: "TBD",                              // 예) "power@lxinternational.com"
    phone: "TBD",                              // 예) "+82-2-0000-0000"
    brochure: "assets/docs/LX-International_Power-Distribution-Transformer.pdf"   // 제조사 로고 제거본 (null 이면 버튼 숨김)
  },

  COUNTRIES: {
    kr: { name: "Korea", flag: "assets/img/flags/kr.svg" },
    tw: { name: "Taiwan", flag: "assets/img/flags/tw.svg" },
    id: { name: "Indonesia", flag: "assets/img/flags/id.svg" }
  },

  /* 제품 마스터: 같은 제품이 여러 솔루션에 나오더라도 여기 한 곳만 수정하면 됩니다. */
  PRODUCTS: {
    "power-transformer": {
      name: "Power Transformer",
      headline: "up to 500kV / 1,000MVA",
      image: { base: "assets/img/products/power-transformer", w: 1163, h: 1425, type: "photo" },
      specs: {
        phase: "Single / Three-phase",
        frequency: "50 / 60Hz",
        voltage: "69 – 500kV",
        capacity: "up to 1,000MVA",
        standards: "ANSI (IEEE C57) / IEC 60076",
        leadTime: "18 – 36 months",
        leadTimeNote: "DDP basis"
      },
      madeIn: ["kr", "tw", "id"]
    },

    "pad-mounted": {
      name: "Pad-mounted Transformer",
      family: "Distribution Transformer",
      headline: "up to 34.5kV / 10,000kVA",
      image: { base: "assets/img/products/pad-mounted", w: 1003, h: 960, type: "photo" },
      specs: {
        phase: "Single / Three-phase",
        frequency: "50 / 60Hz",
        voltage: "up to 34.5kV class",
        capacity: "up to 10MVA",
        capacityNote: "10,000kVA",
        standards: "ANSI / IEEE / DOE / CSA",
        leadTime: "TBD"
      },
      madeIn: ["kr"]
    },

    "pole-mounted": {
      name: "Pole-mounted Transformer",
      family: "Distribution Transformer",
      headline: "up to 34.5kV / 500kVA",
      image: { base: "assets/img/products/pole-mounted", w: 675, h: 1187, type: "photo" },
      specs: {
        phase: "Single / Three-phase",
        frequency: "50 / 60Hz",
        voltage: "up to 34.5kV class",
        capacity: "up to 0.5MVA",
        capacityNote: "500kVA",
        standards: "ANSI / IEEE / DOE",
        leadTime: "TBD"
      },
      madeIn: ["kr"]
    },

    "dry-type": {
      name: "Dry-type Transformer",
      family: "Distribution Transformer",
      headline: "up to 35kV / 20,000kVA",
      image: { base: "assets/img/products/dry-type", w: 976, h: 1226, type: "photo" },
      specs: {
        phase: "Three-phase",
        frequency: "50 / 60Hz",
        voltage: "up to 35kV class",
        voltageNote: "IEC 36kV",
        capacity: "up to 20MVA",
        capacityNote: "20,000kVA",
        standards: "ANSI / IEEE / IEC",
        leadTime: "TBD"
      },
      madeIn: ["kr"]
    },

    "mv-gis": {
      name: "MV GIS",
      family: "Gas Insulated Switchgear",
      headline: "24 – 38kV / up to 40kA",
      image: { src: "assets/img/illustrations/mv-gis.svg", w: 460, h: 293, type: "illustration" },
      specs: {
        phase: "Three-phase",
        frequency: "50 / 60Hz",
        voltage: "24 – 38kV",
        rating: "up to 4,000A",                // GIS 는 MVA 대신 정격전류/차단전류로 표기
        ratingNote: "40kA breaking",
        standards: "IEC / IEEE (ANSI)",
        leadTime: "TBD"
      },
      highlight: "SF6 or dry-air (GWP 0) insulation",
      madeIn: ["kr"]
    },

    "mv-station": {
      name: "MV Station",
      family: "Integrated Skid / Container",
      headline: "Integrated MV skid for BESS",
      components: ["MV switchgear", "Step-up transformer", "Aux. panels 1 & 2", "Container / skid"],
      image: { src: "assets/img/illustrations/mv-station.svg", w: 792, h: 361, type: "illustration", wide: true },
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
      intro: "Transformers for generation, transmission, substations and industry — from 500kV-class power units to pole-mounted distribution.",
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
      cardImage2: "assets/img/illustrations/mv-gis.svg",
      intro: "Reliable power from the utility interconnection to the data hall — for hyperscale, colocation and campus substations.",
      chain: [
        { label: "Utility Grid", sub: "HV", end: true },
        { label: "Power TR", sub: "HV / MV", ref: "power-transformer" },
        { label: "MV GIS", sub: "MV distribution", ref: "mv-gis" },
        { label: "Dist. TR", sub: "MV / LV", ref: "pad-mounted" },
        { label: "IT Load", sub: "UPS · racks", end: true }
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
      cardImage: "assets/img/illustrations/mv-station.svg",
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

  /* 첫 화면 하단: LXI 가치 제안 (카탈로그 Value 01~03 요약) */
  VALUES: [
    { no: "01", title: "Gateway for Korean-made transformers",
      text: "Approved vendor pool of leading Korean manufacturers plus selected partners in Taiwan. Factory pre-inspection and a 100% P-Bond on every supply." },
    { no: "02", title: "Supply chain management",
      text: "Ocean freight through our affiliate LX Pantos and specialized U.S. inland transport, with local partners for assembly, installation, A/S and warranty." },
    { no: "03", title: "Strategic investment partner",
      text: "Project development, EPC, financing and investment for power plants and electricity infrastructure — including data centers." }
  ],

  STATS: [
    { value: "1953", label: "Founded" },
    { value: "50+", label: "Global business sites" },
    { value: "18–21", unit: "mo", label: "EHV TR lead time (OLTC)" },
    { value: "100%", label: "P-Bond secured" }
  ],

  FLOW: ["Transformer manufacturing", "Freight & inland transportation", "Field service & supervision", "Total service provider"]
};
