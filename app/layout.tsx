import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { GA_MEASUREMENT_ID, isGaEnabled } from "@/lib/analytics/ga";
import { cn } from "@/lib/utils";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://carbonhero.kr";
const siteName = "CarbonHero";

export const metadata: Metadata = {
  title: "CarbonHero | ?꾩냼 ????덉궛 吏꾨떒",
  description:
    "?쒖“湲곗뾽 ?ㅻТ?먭? ?꾩냼 ??묒쓽 ?덉궛 踰붿쐞瑜?鍮좊Ⅴ寃?媛?좏빐蹂????덈룄濡??꾩??쒕┰?덈떎.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName,
    title: "CarbonHero | ?꾩냼 ????덉궛 吏꾨떒",
    description: "?쒖“湲곗뾽 ?ㅻТ?먭? ?꾩냼 ??묒쓽 ?덉궛 踰붿쐞瑜?鍮좊Ⅴ寃?媛?좏빐蹂????덈룄濡??꾩??쒕┰?덈떎.",
    images: [{ url: "/og/carbonhero-og.png", width: 1200, height: 630, alt: "CarbonHero" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "CarbonHero | ?꾩냼 ????덉궛 吏꾨떒",
    description: "?쒖“湲곗뾽 ?ㅻТ?먭? ?꾩냼 ??묒쓽 ?덉궛 踰붿쐞瑜?鍮좊Ⅴ寃?媛?좏빐蹂????덈룄濡??꾩??쒕┰?덈떎.",
    images: ["/og/carbonhero-og.png"]
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  manifest: "/favicon/site.webmanifest",
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
