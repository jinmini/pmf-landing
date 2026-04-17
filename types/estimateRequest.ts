export type EstimateRange = {
  min: number;
  max: number;
};

export type EstimateServiceBreakdownItem = {
  id: string;
  label: string;
  range: EstimateRange;
};

export type DetailServiceProgressItem = {
  id: string;
  title: string;
  checkedCount: number;
  totalCount: number;
};

export type EstimateRequestPayload = {
  email: string;
  source: "flow-c";
  selections: {
    industryId: string;
    scaleId: string;
    currentStateId: string;
    serviceIds: string[];
    goalIds: string[];
  };
  estimate: {
    min: number;
    max: number;
    recommendation: string;
    serviceBreakdown: EstimateServiceBreakdownItem[];
  };
  detailDiagnosis: {
    checklistState: Record<string, boolean>;
    serviceProgress: DetailServiceProgressItem[];
  };
  submittedAt: string;
};

export type EstimateRequestApiResponse =
  | {
      ok: true;
      requestId: string;
      mailStatus: "sent" | "skipped" | "failed";
    }
  | {
      ok: false;
      error: string;
    };
