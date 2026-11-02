const KEY = 'star-marketing-consent-v1';
export type Consent = { analytics: boolean; marketing: boolean };
declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; fbq?: (...args: unknown[]) => void } }
export function getConsent(): Consent | null {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) as Consent : null; } catch { return null; }
}
const inject = (src: string) => {
  if (document.querySelector(`script[data-source="${src}"]`)) return;
  const script = document.createElement('script'); script.async = true; script.src = src; script.dataset.source = src; document.head.appendChild(script);
};
export function applyConsent(consent: Consent) {
  try { localStorage.setItem(KEY, JSON.stringify(consent)); } catch { /* Privacy settings remain usable if storage is unavailable. */ }
  if (consent.analytics) {
    const gtm = import.meta.env.VITE_GTM_ID;
    const ga4 = import.meta.env.VITE_GA4_ID;
    if (gtm) { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' }); inject(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtm)}`); }
    else if (ga4) { inject(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4)}`); window.dataLayer = window.dataLayer || []; window.gtag = (...args: unknown[]) => { window.dataLayer?.push(args); }; window.gtag('js', new Date()); window.gtag('config', ga4, { send_page_view: false }); }
  }
  if (consent.marketing && import.meta.env.VITE_META_PIXEL_ID) {
    const id = import.meta.env.VITE_META_PIXEL_ID;
    // Meta Pixel intentionally requires an audited install before production.
    // No pixel is injected by default: adding an ID alone does not establish legal consent compliance.
    document.documentElement.dataset.metaPixelConfigured = id ? 'true' : 'false';
  }
}
export function track(event: string, props: Record<string, string> = {}) {
  if (!getConsent()?.analytics) return;
  if (import.meta.env.VITE_GTM_ID) window.dataLayer?.push({ event, ...props });
  else if (window.gtag) window.gtag('event', event, props);
}
