export const FLOW_C_SERVICE_KEY_BY_ID = {
  "lca-pcf": "LCA_PCF",
  ets: "ETS",
  cbam: "CBAM",
  scope123: "Scope_1_2_3",
  "target-management": "Target_Management",
  sbti: "SBTi",
  cdp: "CDP",
  "lca-platform": "LynC"
} as const;

export const FLOW_C_COMPANY_SIZE_KEY_BY_ID = {
  "listed-large": "listed_over_2t",
  "listed-mid": "listed_under_2t",
  affiliate: "unlisted_large_affiliate",
  "mid-market": "unlisted_mid",
  sme: "unlisted_small"
} as const;

export const FLOW_C_MATURITY_KEY_BY_ID = {
  manual: "mostly_manual",
  partial: "partial_system_weak_connection",
  ready: "basic_system_need_upgrade"
} as const;

export const FLOW_C_INDUSTRY_KEY_BY_ID = {
  mobility: "automotive_mobility",
  chemical: "chem_petrochem_material",
  electronics: "electronics_semiconductor",
  metal: "steel_metal_nonferrous",
  consumer: "consumer_goods",
  food: "food_beverage",
  energy: "energy_battery_environment",
  other: "other_manufacturing"
} as const;

export const FLOW_C_PRICE_RANGE_OFFSET = 500;

export const FLOW_C_PRICE_TABLE = {
  listed_over_2t: {
    LCA_PCF: 3000,
    ETS: 4500,
    CBAM: 3000,
    Scope_1_2_3: 3500,
    Target_Management: 3500,
    SBTi: 5000,
    CDP: 3500,
    LynC: 3000
  },
  listed_under_2t: {
    LCA_PCF: 2500,
    ETS: 4000,
    CBAM: 3000,
    Scope_1_2_3: 3000,
    Target_Management: 3000,
    SBTi: 3500,
    CDP: 3000,
    LynC: 2500
  },
  unlisted_large_affiliate: {
    LCA_PCF: 3000,
    ETS: 4500,
    CBAM: 3000,
    Scope_1_2_3: 3500,
    Target_Management: 3500,
    SBTi: 5000,
    CDP: 3500,
    LynC: 3000
  },
  unlisted_mid: {
    LCA_PCF: 2500,
    ETS: 3500,
    CBAM: 3000,
    Scope_1_2_3: 2500,
    Target_Management: 3000,
    SBTi: 3500,
    CDP: 3000,
    LynC: 1500
  },
  unlisted_small: {
    LCA_PCF: 1500,
    ETS: 2500,
    CBAM: 2000,
    Scope_1_2_3: 2500,
    Target_Management: 2000,
    SBTi: 2500,
    CDP: 2500,
    LynC: 1000
  }
} as const;

export const FLOW_C_LYNC_ONBOARDING_TABLE = {
  listed_over_2t: 7000,
  listed_under_2t: 6000,
  unlisted_large_affiliate: 6000,
  unlisted_mid: 5000,
  unlisted_small: 4000
} as const;

export const FLOW_C_SHORT_MESSAGES = {
  base: "현재 선택 조건을 기준으로 산출한 예상 범위입니다.",
  variance: "실제 도입금액 범위는 대상 제품, 데이터 구조, 운영 방식에 따라 달라질 수 있습니다.",
  onboarding: "LCA SW 선택 시 온보딩 컨설팅 범위가 함께 검토됩니다."
} as const;
