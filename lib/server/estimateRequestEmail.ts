import type { EstimateRequestPayload } from "@/types/estimateRequest";

type MailSendResult = {
  status: "sent" | "skipped";
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatServiceBreakdownHtml(payload: EstimateRequestPayload) {
  return payload.estimate.serviceBreakdown
    .map(
      (item) =>
        `<li><strong>${escapeHtml(item.label)}</strong>: ${item.range.min.toLocaleString("ko-KR")} ~ ${item.range.max.toLocaleString(
          "ko-KR"
        )} (만원)</li>`
    )
    .join("");
}

function formatServiceProgressHtml(payload: EstimateRequestPayload) {
  return payload.detailDiagnosis.serviceProgress
    .map(
      (item) =>
        `<li><strong>${escapeHtml(item.title)}</strong>: ${item.checkedCount}/${item.totalCount} 완료</li>`
    )
    .join("");
}

export async function sendEstimateRequestNotification(payload: EstimateRequestPayload): Promise<MailSendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const toRaw = process.env.ESTIMATE_REQUEST_NOTIFICATION_TO;

  if (!apiKey || !from || !toRaw) {
    return { status: "skipped" };
  }

  const to = toRaw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (to.length === 0) {
    return { status: "skipped" };
  }

  const subject = `[Flow C] 상세 견적 요청 - ${payload.email}`;
  const html = `
    <h2>Flow C 상세 견적 요청</h2>
    <p><strong>요청 이메일:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>제출 시각(클라이언트):</strong> ${escapeHtml(payload.submittedAt)}</p>
    <p><strong>업종/규모/현재수준:</strong> ${escapeHtml(payload.selections.industryId)} / ${escapeHtml(
      payload.selections.scaleId
    )} / ${escapeHtml(payload.selections.currentStateId)}</p>
    <p><strong>선택 서비스:</strong> ${escapeHtml(payload.selections.serviceIds.join(", "))}</p>
    <p><strong>선택 목표:</strong> ${escapeHtml(payload.selections.goalIds.join(", "))}</p>
    <p><strong>예상 금액 범위:</strong> ${payload.estimate.min.toLocaleString("ko-KR")} ~ ${payload.estimate.max.toLocaleString(
      "ko-KR"
    )} (만원)</p>
    <p><strong>추천 제안:</strong> ${escapeHtml(payload.estimate.recommendation)}</p>
    <h3>서비스 금액 상세</h3>
    <ul>${formatServiceBreakdownHtml(payload)}</ul>
    <h3>상세진단 진행률</h3>
    <ul>${formatServiceProgressHtml(payload)}</ul>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to send email notification: ${body}`);
  }

  return { status: "sent" };
}
