import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

/**
 * Vercel Analytics (free tier, cookieless): page views plus the
 * `resume_download` event from lib/analytics.ts. It only reports once the
 * site is deployed on Vercel with Analytics enabled for the project.
 *
 * Google Analytics loads only if NEXT_PUBLIC_GA_ID is set, so no
 * placeholder tag ships.
 */
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <>
      {/* VERCEL is set on Vercel builds; elsewhere its script 404s */}
      {process.env.VERCEL && <VercelAnalytics />}
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}
    </>
  );
}
