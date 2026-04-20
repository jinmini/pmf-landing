import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { GA_MEASUREMENT_ID, isGaEnabled } from "@/lib/analytics/ga";
import { cn } from "@/lib/utils";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://carbonhero.kr";
const siteName = "CarbonHero";

export const metadata: Metadata = {
  title: "CarbonHero | 탄소 대응 예산 진단",
  description:
    "제조기업 실무자가 탄소 대응의 예산 범위를 빠르게 가늠해볼 수 있도록 도와드립니다.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName,
    title: "CarbonHero | 탄소 대응 예산 진단",
    description: "제조기업 실무자가 탄소 대응의 예산 범위를 빠르게 가늠해볼 수 있도록 도와드립니다."
  },
  twitter: {
    card: "summary_large_image",
    title: "CarbonHero | 탄소 대응 예산 진단",
    description: "제조기업 실무자가 탄소 대응의 예산 범위를 빠르게 가늠해볼 수 있도록 도와드립니다."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("font-sans")}>
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
