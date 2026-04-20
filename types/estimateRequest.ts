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

export type EstimateSelections = {
  industryId: string;
  scaleId: string;
  currentStateId: string;
  serviceIds: string[];
  goalIds: string[];
};

export type EstimateSummary = {
  min: number;
  max: number;
  recommendation: string;
  serviceBreakdown: EstimateServiceBreakdownItem[];
};

export type EstimateDetailDiagnosis = {
  checklistState: Record<string, boolean>;
  serviceProgress: DetailServiceProgressItem[];
};

export type EstimateRequestPayload = {
  draftId?: string;
  email: string;
  source: "flow-c";
  selections: EstimateSelections;
  estimate: EstimateSummary;
  detailDiagnosis: EstimateDetailDiagnosis;
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

export type EstimateDraftPayload = {
  draftId?: string;
  clientSessionId: string;
  source: "flow-c";
  latestStep: "result" | "detail";
  selections: EstimateSelections;
  estimate: EstimateSummary;
  detailDiagnosis: EstimateDetailDiagnosis;
  capturedAt: string;
};

export type EstimateDraftApiResponse =
  | {
      ok: true;
      draftId: string;
    }
  | {
      ok: false;
      error: string;
    };
