import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { GA_MEASUREMENT_ID, isGaEnabled } from "@/lib/analytics/ga";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body>
        {isGaEnabled() ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        ) : null}
        {children}
      </body>
    </html>
  );
}
