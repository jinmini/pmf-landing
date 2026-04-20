type GaParamValue = string | number | boolean | null | undefined;

type GaEventParams = Record<string, GaParamValue>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: "js" | "config" | "event", eventOrDate: string | Date, params?: GaEventParams) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function isGaEnabled() {
  return Boolean(GA_MEASUREMENT_ID);
}

export function trackEvent(eventName: string, params?: GaEventParams) {
  if (typeof window === "undefined") {
    return;
  }

  if (!isGaEnabled()) {
    return;
  }

  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, params);
}
