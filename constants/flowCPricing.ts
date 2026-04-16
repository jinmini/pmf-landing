export const FLOW_C_PRICING = {
  baseRanges: {
    currencyUnit: "KRW_million_supply_amount",
    services: {
      LCA_PCF: { label: "LCA · PCF", min: 13, max: 47, confidence: "high" },
      ETS: { label: "배출권거래제", min: 50, max: 130, confidence: "medium" },
      CBAM: { label: "CBAM", min: 4, max: 12, confidence: "low", note: "추정값 포함" },
      Scope_1_2_3: { label: "Scope 1/2/3", min: 16, max: 30, confidence: "medium" },
      Target_Management: { label: "목표관리제", min: 50, max: 60, confidence: "low", note: "추정값 포함" },
      SBTi: { label: "SBTi", min: 15, max: 35, confidence: "medium" },
      CDP: { label: "CDP", min: 30, max: 41, confidence: "medium" },
      LynC: { label: "LynC(LCA Platform)", min: 17, max: 30, confidence: "medium" }
    }
  },
  multipliers: {
    companySize: {
      listed_over_2t: { label: "상장사 (자산 2조 이상)", min: 1.3, max: 1.8 },
      listed_under_2t: { label: "상장사 (자산 2조 미만)", min: 1.1, max: 1.4 },
      unlisted_large_affiliate: { label: "비상장 대기업 계열사", min: 1.1, max: 1.5 },
      unlisted_mid: { label: "비상장 중견기업 (매출 1,000억 이상)", min: 0.9, max: 1.2 },
      unlisted_small: { label: "비상장 중소기업 (매출 1,000억 미만)", min: 0.7, max: 1.0 }
    },
    maturity: {
      mostly_manual: { label: "대부분 수작업", min: 1.15, max: 1.35 },
      partial_system_weak_connection: { label: "부분 시스템은 있으나 연결이 약함", min: 1.0, max: 1.15 },
      basic_system_need_upgrade: { label: "기본 체계는 있고 고도화 필요", min: 0.85, max: 1.0 }
    },
    industry: {
      automotive_mobility: { label: "자동차 부품, 모빌리티", min: 1.1, max: 1.25 },
      chem_petrochem_material: { label: "화학 석유화학 소재", min: 1.15, max: 1.3 },
      electronics_semiconductor: { label: "전자 전기 반도체", min: 1.1, max: 1.3 },
      steel_metal_nonferrous: { label: "철강 금속 비철", min: 1.05, max: 1.2 },
      consumer_goods: { label: "소비재", min: 0.95, max: 1.1 },
      food_beverage: { label: "식품 음료", min: 0.95, max: 1.1 },
      energy_battery_environment: { label: "에너지, 이차전지, 환경", min: 1.15, max: 1.35 },
      other_manufacturing: { label: "기타 제조", min: 1.0, max: 1.0 }
    },
    addons: {
      platform_included_pct: { label: "플랫폼 포함 시", min: 0.2, max: 0.6 }
    }
  },
  shortMessages: [
    "조직 규모와 선택 범위를 반영한 예상 범위입니다.",
    "플랫폼 포함으로 초기 세팅 비용이 함께 반영됩니다.",
    "수작업 비중이 높아 파일럿 지원 범위가 확대됩니다.",
    "규제·검증 범위 포함 시 상단 금액이 높아질 수 있습니다.",
    "일부 항목은 유사 히스토리 기반 추정값입니다."
  ]
} as const;

export const FLOW_C_SERVICE_KEY_BY_ID = {
  "lca-pcf": "LCA_PCF",
  ets: "ETS",
  cbam: "CBAM",
  scope123: "Scope_1_2_3",
  "target-management": "Target_Management",
  sbti: "SBTi",
  cdp: "CDP",
  "lync-platform": "LynC"
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
