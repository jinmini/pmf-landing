import type { Metadata } from "next";
import FlowCExperience from "@/components/flow-c/FlowCExperience";
import { FLOW_C_PAGE } from "@/constants/flowCContent";

export const metadata: Metadata = {
  title: FLOW_C_PAGE.metadata.title,
  description: FLOW_C_PAGE.metadata.description
};

export default function FlowCPage() {
  return <FlowCExperience />;
}
