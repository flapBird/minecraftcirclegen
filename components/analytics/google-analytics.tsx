import { ANALYTICS_LOCAL_HOSTNAME_GUARD } from "@/lib/site/analytics-guard";

const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/i;

/** Hard-coded so analytics never depends on deployment environment variables. */
const DEFAULT_MEASUREMENT_ID = "G-9NM2YML7QR";

export function getGoogleAnalyticsMeasurementId(
  value = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
) {
  // Bundlers inline a missing env var as an empty string (not undefined),
  // and an invalid override must never disable analytics: anything unusable
  // falls back to the hard-coded default.
  const candidate = value?.trim() || DEFAULT_MEASUREMENT_ID;

  return GA_MEASUREMENT_ID_PATTERN.test(candidate)
    ? candidate
    : DEFAULT_MEASUREMENT_ID;
}

export function GoogleAnalytics() {
  const measurementId = getGoogleAnalyticsMeasurementId();

  if (!measurementId) {
    return null;
  }

  // Rendered as a plain inline script: vinext's Cloudflare runtime drops
  // next/script tags from SSR, which silently disabled GA after the switch.
  const loader = `(function(){
    if (${ANALYTICS_LOCAL_HOSTNAME_GUARD}) return;
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', ${JSON.stringify(measurementId)});
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ${JSON.stringify(measurementId)};
    document.head.appendChild(s);
  })();`;

  return <script dangerouslySetInnerHTML={{ __html: loader }} />;
}
