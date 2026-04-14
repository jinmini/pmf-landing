import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LynC | 지속가능성 전략 방향성 탐색",
  description:
    "LynC의 PMF 및 고객 발견 단계에서 ESG/LCA 대응 니즈를 전략적으로 검증하기 위한 컨셉 랜딩 페이지입니다."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
