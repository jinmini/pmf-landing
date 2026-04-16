"use client";

import type { PrototypeFlow } from "@/constants/prototypeFlows";
import FlowAExperience from "./FlowAExperience";
import FlowBExperience from "./FlowBExperience";
import FlowCExperience from "./FlowCExperience";

type FlowPrototypeClientProps = {
  flow: PrototypeFlow;
};

export default function FlowPrototypeClient({ flow }: FlowPrototypeClientProps) {
  if (flow.slug === "flow-a") {
    return <FlowAExperience flow={flow} />;
  }

  if (flow.slug === "flow-c") {
    return <FlowCExperience flow={flow} />;
  }

  return <FlowBExperience flow={flow} />;
}
