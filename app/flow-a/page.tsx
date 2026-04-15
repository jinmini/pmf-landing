import type { Metadata } from "next";
import FlowPrototypePage from "@/components/prototype/FlowPrototypePage";
import { FLOW_BY_SLUG } from "@/constants/prototypeFlows";

export const metadata: Metadata = {
  title: "플로우 A | LynC 프로토타입",
  description: "빠른 ROI 우선형 UX 플로우 내부 검토 페이지"
};

export default function FlowAPage() {
  return <FlowPrototypePage flow={FLOW_BY_SLUG["flow-a"]} />;
}
