"use client";

import type { PrototypeFlow } from "@/constants/prototypeFlows";
import FlowAExperience from "./FlowAExperience";
import FlowBExperience from "./FlowBExperience";

type FlowPrototypeClientProps = {
  flow: PrototypeFlow;
};

export default function FlowPrototypeClient({ flow }: FlowPrototypeClientProps) {
  if (flow.slug === "flow-a") {
    return <FlowAExperience flow={flow} />;
  }

  return <FlowBExperience flow={flow} />;
}
