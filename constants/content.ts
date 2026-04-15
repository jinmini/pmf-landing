export const NAV = {
  brand: "LynC",
  links: [
    { label: "문제 인식", href: "#problem" },
    { label: "비전", href: "#vision" },
    { label: "플랫폼 컨셉", href: "#concept" },
    { label: "기대 가치", href: "#value" },
    { label: "마케팅 패턴", href: "#marketing-cases" }
  ]
};

export const HERO = {
  badge: "PMF 탐색 단계 컨셉",
  title: "지속가능성 대응의 불확실성을, 전략적 학습 기회로 전환합니다",
  description:
    "LynC는 ESG 및 LCA 대응 과정에서 실제 고객이 어떤 지점에서 어려움을 겪는지 더 명확히 이해하기 위한 방향성을 제시합니다. 이 페이지는 내부 검토를 위한 초기 컨셉입니다.",
  primaryCta: "컨셉 리뷰 요청",
  secondaryCta: "내부 논의 시작"
};

export const PROBLEM = {
  title: "문제 인식",
  description:
    "시장 요구는 빠르게 변화하지만, 기업이 체감하는 ESG/LCA 실행 과제는 산업별·조직별로 다르게 나타납니다. 무엇이 실제 핵심 페인포인트인지 명확하지 않은 상태에서 대응 전략은 쉽게 분산됩니다.",
  points: [
    "규제와 고객 요구의 변화 속도가 빨라 우선순위 설정이 어렵습니다.",
    "조직 내 데이터·프로세스·책임 범위가 분절되어 실행력이 떨어집니다.",
    "고객이 진짜로 원하는 지원 방식이 무엇인지 검증이 부족합니다."
  ]
};

export const VISION = {
  title: "기회와 비전",
  description:
    "지금 필요한 것은 기능의 양이 아니라, 고객의 실제 맥락을 빠르게 학습하고 의사결정에 반영하는 구조입니다. LynC는 그 출발점을 만들기 위한 발견 중심 접근을 지향합니다.",
  highlights: [
    { title: "시장 해석 정렬", text: "가설 중심의 학습으로 조직 내 관점을 정렬합니다." },
    { title: "우선순위 명확화", text: "중요한 문제부터 검증해 실행 방향을 선명하게 만듭니다." },
    { title: "전략 실행 연결", text: "발견한 인사이트를 제품·사업 전략과 연결합니다." }
  ]
};

export const CONCEPT = {
  title: "플랫폼 컨셉",
  description:
    "LynC는 고객과 시장의 신호를 체계적으로 수집하고, 이를 공통 언어로 정리해 내부 의사결정에 연결하는 발견 중심 경험을 목표로 합니다. 현재는 방향성 검증을 위한 초기 컨셉 단계입니다.",
  blocks: [
    {
      title: "신호 수집",
      text: "현장 대화, 요구사항, 대응 이슈를 구조적으로 모읍니다."
    },
    {
      title: "공통 맥락 정리",
      text: "팀 간 해석 차이를 줄이고 공통 이해 기반을 만듭니다."
    },
    {
      title: "의사결정 정렬",
      text: "전략·제품·사업 우선순위 논의를 더 빠르게 정렬합니다."
    }
  ]
};

export const VALUE = {
  title: "기대 가치",
  description:
    "이 컨셉은 기능 과시가 아니라, 전략 수립과 실행 품질을 높이기 위한 기반 구축에 초점을 둡니다.",
  cards: [
    {
      title: "사업 조직",
      text: "고객 요구와 시장 변화를 더 빠르게 읽고 대응 전략을 정교화합니다."
    },
    {
      title: "전략 팀",
      text: "불확실한 가정 대신 검증 가능한 근거 중심으로 로드맵을 수립합니다."
    },
    {
      title: "제품 방향",
      text: "무엇을 먼저 만들고 검증할지 명확한 기준을 확보합니다."
    }
  ]
};

type MarketingCase = {
  number: string;
  title: string;
  description: string;
  captureTiming: string;
  strategicIntent: string;
  classification: string;
  referenceUrl: string;
};

export const MARKETING_CASES: {
  title: string;
  description: string;
  insight: string;
  lens: string[];
  items: MarketingCase[];
} = {
  title: "SaaS 툴 기반 마케팅 패턴 6가지",
  description:
    "시장 사례를 기능 목록이 아닌 데이터 캡처 시점과 전략 의도로 재해석하면, 각 패턴의 쓰임새를 10초 안에 비교할 수 있습니다.",
  insight:
    "핵심 차이는 이메일을 받느냐가 아니라, 가치 제공의 어느 시점에 데이터를 요구하느냐입니다.",
  lens: ["사전 게이트", "중간 게이트", "결과 게이트", "공개 후 세일즈 전환", "비교 전환 페이지"],
  items: [
    {
      number: "01",
      title: "결과 잠금형 플로우",
      description: "사용자는 단계를 완료하지만 최종 결과는 이메일 제출 후 확인하도록 잠급니다.",
      captureTiming: "가치 제공 직전",
      strategicIntent: "리드 생성",
      classification: "결과 게이트",
      referenceUrl: "https://www.manglai.io/en/carbon-calculator/survey" // [URL-CASE-01] 결과 잠금형 플로우 URL 입력
    },
    {
      number: "02",
      title: "부분 공개 후 전문가 상담 연결",
      description: "핵심 인사이트 일부는 공개하고, 심화 해석은 상담 요청으로 연결합니다.",
      captureTiming: "상담 전환 단계",
      strategicIntent: "잠재고객 선별",
      classification: "공개 후 세일즈 전환",
      referenceUrl: "https://www.dcycle.io/resources/regulation-check/" // [URL-CASE-02] 부분 공개 후 상담 연결 URL 입력
    },
    {
      number: "03",
      title: "ROI 계산 결과 단계 게이트",
      description: "비용 절감/효율 개선 가치를 제시한 뒤 상세 수치는 이메일 제출 후 제공합니다.",
      captureTiming: "가치 확인 직전",
      strategicIntent: "의도 검증 리드 확보",
      classification: "결과 게이트",
      referenceUrl: "https://www.dcycle.io/roi-calculator/" // [URL-CASE-03] ROI 계산 결과 게이트 URL 입력
    },
    {
      number: "04",
      title: "경쟁사 비교 전환 페이지",
      description: "자사와 대안 솔루션을 비교해 차별 포인트를 강조하고 전환을 유도합니다.",
      captureTiming: "비교 탐색 이후",
      strategicIntent: "전환 설득",
      classification: "비교 전환 페이지",
      referenceUrl: "https://greenly.earth/en-us/compare/greenly-vs-watershed" // [URL-CASE-04] 경쟁사 비교 페이지 URL 입력
    },
    {
      number: "05",
      title: "전체 접근 사전 게이트",
      description: "도구 사용 시작 전에 회원가입이나 이메일 입력을 요구해 진입부터 선별합니다.",
      captureTiming: "가치 제공 이전",
      strategicIntent: "리드 품질 관리",
      classification: "사전 게이트",
      referenceUrl: "https://regnav.beta.novata.dev/#/login" // [URL-CASE-05] 전체 접근 사전 게이트 URL 입력
    },
    {
      number: "06",
      title: "중간 탐색형 점진 게이트",
      description: "초기 탐색은 열어두고, 더 깊은 사용 시점에서 이메일 모달을 노출합니다.",
      captureTiming: "경험 도중",
      strategicIntent: "관심도 기반 전환",
      classification: "중간 게이트",
      referenceUrl: "https://www.zevero.earth/tools/carbon-footprint-calculator" // [URL-CASE-06] 중간 탐색형 점진 게이트 URL 입력
    }
  ]
};

export const CTA = {
  title: "이제 내부 검토를 시작할 시점입니다",
  description:
    "LynC의 초기 컨셉을 바탕으로 핵심 가설을 함께 점검하고, 다음 단계의 검증 범위를 정의해 보세요.",
  primary: "리더십 리뷰 진행",
  secondary: "컨셉 검증 미팅 제안"
};

export const FOOTER = {
  text: "© 2026 LynC. PMF 탐색 및 고객 발견을 위한 내부 검토용 컨셉 페이지"
};
