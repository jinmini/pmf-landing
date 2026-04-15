export type FlowSlug = "flow-a" | "flow-b";

export type FlowOption = {
  label: string;
  score: number;
};

export type FlowStep = {
  id: string;
  title: string;
  description: string;
  options: FlowOption[];
};

export type FlowResultBand = {
  min: number;
  max: number;
  headline: string;
  recommendation: string;
  rationale: string;
  operationalBenefit: string;
  projectDirection: string;
  nextAction: string;
};

export type PrototypeFlow = {
  slug: FlowSlug;
  route: string;
  shortLabel: string;
  title: string;
  subtitle: string;
  tone: string;
  strategicFocus: string;
  summary: string;
  tags: string[];
  steps: FlowStep[];
  captureMessage: string;
  ctaPrimary: string;
  ctaSecondary: string;
  resultBands: FlowResultBand[];
};

export const PROTOTYPE_HUB = {
  badge: "Interactive Prototypes",
  title: "두 가지 진단 흐름",
  description:
    "같은 제품 컨셉을 서로 다른 인터랙션 방식으로 체험할 수 있도록 구성했습니다.",
  note: "A는 마이크로 진단, B는 인터랙티브 ROI 도구입니다."
};

export const PROTOTYPE_FLOWS: PrototypeFlow[] = [
  {
    slug: "flow-a",
    route: "/flow-a",
    shortLabel: "플로우 A",
    title: "빠른 ROI 우선형",
    subtitle: "최단 경로로 효율·절감 가치를 먼저 제시",
    tone: "직접적 · 즉시성",
    strategicFocus: "빠른 관심 전환",
    summary:
      "최소 입력으로 바로 ROI 수준의 결과를 제시해, 초기 관심과 상담 전환 의도를 빠르게 확인하는 흐름입니다.",
    tags: ["ROI 우선", "3단계 핵심 입력", "결과 즉시 제시"],
    steps: [
      {
        id: "company-size",
        title: "기업 기본 맥락",
        description: "현재 운영 규모와 ESG 대응 조직 수준을 선택해 주세요.",
        options: [
          { label: "중견 이상, ESG 전담 인력이 이미 존재", score: 3 },
          { label: "중소·중견, 실무자가 겸업으로 운영", score: 2 },
          { label: "초기 단계, 정식 운영 체계는 준비 중", score: 1 }
        ]
      },
      {
        id: "manual-load",
        title: "운영 비효율 체감도",
        description: "현재 수작업 중심 업무 부담 수준을 선택해 주세요.",
        options: [
          { label: "매우 높음 (월별 취합·정리 업무가 큰 부담)", score: 4 },
          { label: "보통 (주요 보고 시점에 집중 부담)", score: 2 },
          { label: "낮음 (기본 체계는 있으나 개선 여지 존재)", score: 1 }
        ]
      },
      {
        id: "decision-speed",
        title: "도입 의사결정 속도",
        description: "향후 3~6개월 내 실행 의사결정 계획을 선택해 주세요.",
        options: [
          { label: "빠른 실행 필요 (분기 내 방향 확정)", score: 4 },
          { label: "검토 단계 (반기 내 우선순위 결정)", score: 2 },
          { label: "탐색 단계 (요건 정리 우선)", score: 1 }
        ]
      }
    ],
    captureMessage: "결과 리포트 전달 및 상세 산정 근거 공유를 위해 연락처 수집이 필요한 구조",
    ctaPrimary: "전문가 상담 요청",
    ctaSecondary: "결과 리포트 공유 받기",
    resultBands: [
      {
        min: 0,
        max: 5,
        headline: "현재 상황에서는 단계적 검증 접근이 적합합니다",
        recommendation: "초기 컨설팅 후 플랫폼 전환이 가장 효율적입니다.",
        rationale: "즉시 대규모 도입보다 핵심 데이터 흐름 정렬이 우선되어야 ROI 실현 가능성이 높습니다.",
        operationalBenefit: "리소스 낭비 최소화, 초기 실패 비용 절감",
        projectDirection: "파일럿 중심 하이브리드 접근",
        nextAction: "핵심 프로세스 1~2개를 선정해 4주 단기 검증을 시작합니다."
      },
      {
        min: 6,
        max: 9,
        headline: "플랫폼 우선 접근으로 빠른 효율 개선이 가능합니다",
        recommendation: "현재 상황에서는 플랫폼 중심 도입이 적합합니다.",
        rationale: "수작업 부담과 실행 의지가 동시에 확인되어 단기 운영 절감 효과를 기대할 수 있습니다.",
        operationalBenefit: "보고 준비 시간 단축, 데이터 취합 반복 업무 축소",
        projectDirection: "플랫폼 우선 + 선택형 컨설팅",
        nextAction: "도입 범위를 배출 데이터 취합과 보고 준비 프로세스로 한정해 1차 론칭합니다."
      },
      {
        min: 10,
        max: 20,
        headline: "고속 실행형 ROI 전략이 가장 유효합니다",
        recommendation: "즉시 플랫폼 도입과 병행 운영 최적화가 적합합니다.",
        rationale: "높은 비효율 체감과 빠른 의사결정 여건이 확보되어 있어 조기 성과 창출 가능성이 큽니다.",
        operationalBenefit: "운영 리드타임 단축, 조직 대응 속도 향상",
        projectDirection: "플랫폼 중심 고속 전환",
        nextAction: "실행 TF를 지정하고 8주 이내 KPI 기반 전환 플랜을 확정합니다."
      }
    ]
  },
  {
    slug: "flow-b",
    route: "/flow-b",
    shortLabel: "플로우 B",
    title: "가이드형 ROI 진단",
    subtitle: "근거를 축적하며 맞춤형 ROI 방향 제시",
    tone: "분석적 · 신뢰형",
    strategicFocus: "정교한 적합성 설득",
    summary:
      "회사 맥락, 운영 환경, 의사결정 기준을 단계적으로 수집해 더 설득력 있는 맞춤형 ROI 제안을 제공하는 흐름입니다.",
    tags: ["가이드 진단", "맞춤형 근거", "신뢰 강화"],
    steps: [
      {
        id: "org-context",
        title: "회사 운영 맥락",
        description: "현재 ESG 대응의 조직적 성숙도를 선택해 주세요.",
        options: [
          { label: "전사 KPI와 연동된 운영 체계가 존재", score: 3 },
          { label: "부서 단위 대응은 있으나 정렬이 부족", score: 2 },
          { label: "대응 필요성 인식 단계", score: 1 }
        ]
      },
      {
        id: "esg-process",
        title: "현재 ESG 운영 방식",
        description: "데이터 수집·보고·검증의 현재 운영 방식을 선택해 주세요.",
        options: [
          { label: "여러 시스템과 파일이 혼재되어 통합이 어려움", score: 4 },
          { label: "기본 체계는 있으나 보고 주기마다 병목 발생", score: 3 },
          { label: "운영은 안정적이나 고도화가 필요", score: 2 }
        ]
      },
      {
        id: "uncertainty",
        title: "현재 가장 큰 불확실성",
        description: "의사결정을 지연시키는 핵심 불확실성을 선택해 주세요.",
        options: [
          { label: "어떤 솔루션 조합이 적합한지 불명확", score: 4 },
          { label: "ROI 근거 부족으로 투자 판단이 어려움", score: 3 },
          { label: "내부 우선순위 조정이 늦어짐", score: 2 }
        ]
      },
      {
        id: "decision-criteria",
        title: "의사결정 기준",
        description: "도입 판단 시 가장 중요한 기준을 선택해 주세요.",
        options: [
          { label: "데이터 정합성 및 감사 대응 신뢰성", score: 4 },
          { label: "운영 리소스 절감 및 효율", score: 3 },
          { label: "단기 비용 통제", score: 2 }
        ]
      },
      {
        id: "timeline",
        title: "프로젝트 추진 시점",
        description: "실행 착수 목표 시점을 선택해 주세요.",
        options: [
          { label: "즉시 추진 (1개 분기 이내)", score: 4 },
          { label: "중기 추진 (2개 분기 이내)", score: 3 },
          { label: "요건 정리 후 추진", score: 2 }
        ]
      }
    ],
    captureMessage: "진단 근거표와 실행 시나리오 전달을 위해 결과 단계에서 연락처 확보가 필요한 구조",
    ctaPrimary: "맞춤 진단 미팅 요청",
    ctaSecondary: "상세 결과 공유 받기",
    resultBands: [
      {
        min: 0,
        max: 9,
        headline: "현재는 진단 우선형 접근이 효과적입니다",
        recommendation: "초기 컨설팅 후 플랫폼 전환이 가장 효율적입니다.",
        rationale: "조직 정렬과 의사결정 기준 명확화가 선행되어야 ROI 추정 정확도를 높일 수 있습니다.",
        operationalBenefit: "실행 리스크 축소, 투자 우선순위 명확화",
        projectDirection: "진단 우선 + 단계적 구현",
        nextAction: "핵심 의사결정자 워크숍을 통해 평가 프레임을 먼저 정렬합니다."
      },
      {
        min: 10,
        max: 14,
        headline: "맞춤형 플랫폼 도입이 현실적인 선택입니다",
        recommendation: "플랫폼 중심 접근에 제한적 컨설팅을 결합하는 방식이 적합합니다.",
        rationale: "운영 병목과 ROI 관점이 동시에 확인되어, 빠른 효율 개선과 품질 확보를 병행할 수 있습니다.",
        operationalBenefit: "업무 효율 개선과 데이터 신뢰도 동시 향상",
        projectDirection: "플랫폼 우선 + 선택형 진단",
        nextAction: "우선순위 프로세스부터 적용하는 2단계 롤아웃 계획을 수립합니다."
      },
      {
        min: 15,
        max: 25,
        headline: "고도화형 ROI 실행 전략이 적합합니다",
        recommendation: "플랫폼 전사 확장과 운영 고도화를 병행하는 전략이 유효합니다.",
        rationale: "실행 준비도와 기대 성과가 높아 확장형 접근에서 더 큰 가치가 창출됩니다.",
        operationalBenefit: "전사 운영 표준화, 의사결정 리드타임 단축",
        projectDirection: "전사 확장형 플랫폼 전략",
        nextAction: "분기 단위 성과지표를 설정하고 확장 로드맵을 즉시 착수합니다."
      }
    ]
  }
];

export const FLOW_BY_SLUG: Record<FlowSlug, PrototypeFlow> = {
  "flow-a": PROTOTYPE_FLOWS[0],
  "flow-b": PROTOTYPE_FLOWS[1]
};
