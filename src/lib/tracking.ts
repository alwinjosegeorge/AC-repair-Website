/**
 * Marketing & Analytics Tracking Utilities
 * Supports:
 * - UTM parameter extraction (utm_source, utm_medium, utm_campaign, utm_term, utm_content)
 * - Ad identifiers (gclid for Google Ads, fbclid for Meta Pixel)
 * - Persistent attribution in sessionStorage / localStorage
 * - Google Analytics 4 (gtag) events
 * - Meta Pixel (fbq) events
 * - Simulated Conversions API (CAPI) payload builder
 */

export interface TrackingData {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  gclid: string;
  fbclid: string;
  referrer: string;
  landing_page: string;
  timestamp: string;
}

const STORAGE_KEY = "egs_tracking_attribution";

/**
 * Capture UTM and Ad Click parameters from the current URL and save them
 */
export function captureTrackingParams(): TrackingData {
  if (typeof window === "undefined") {
    return {
      utm_source: "direct",
      utm_medium: "none",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
      gclid: "",
      fbclid: "",
      referrer: "",
      landing_page: "/",
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const existingRaw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    const existing: Partial<TrackingData> = existingRaw ? JSON.parse(existingRaw) : {};

    // Check if new UTM or Ad params are present in current URL
    const hasNewParams =
      urlParams.has("utm_source") ||
      urlParams.has("gclid") ||
      urlParams.has("fbclid") ||
      urlParams.has("utm_campaign");

    if (hasNewParams || !existing.utm_source) {
      const gclid = urlParams.get("gclid") || "";
      const fbclid = urlParams.get("fbclid") || "";
      let source = urlParams.get("utm_source") || "";
      let medium = urlParams.get("utm_medium") || "";

      // Auto-detect source if gclid or fbclid exists without explicit UTM
      if (!source && gclid) {
        source = "google";
        medium = "cpc";
      } else if (!source && fbclid) {
        source = "meta";
        medium = "cpc";
      } else if (!source && document.referrer) {
        try {
          const refHost = new URL(document.referrer).hostname;
          if (refHost.includes("google")) {
            source = "google";
            medium = "organic";
          } else if (refHost.includes("facebook") || refHost.includes("instagram")) {
            source = "meta";
            medium = "social";
          } else {
            source = refHost;
            medium = "referral";
          }
        } catch {
          source = "referral";
          medium = "referral";
        }
      } else if (!source) {
        source = "direct";
        medium = "none";
      }

      const trackingData: TrackingData = {
        utm_source: source,
        utm_medium: medium,
        utm_campaign: urlParams.get("utm_campaign") || existing.utm_campaign || "",
        utm_term: urlParams.get("utm_term") || existing.utm_term || "",
        utm_content: urlParams.get("utm_content") || existing.utm_content || "",
        gclid: gclid || existing.gclid || "",
        fbclid: fbclid || existing.fbclid || "",
        referrer: document.referrer || existing.referrer || "direct",
        landing_page: window.location.pathname + window.location.search,
        timestamp: new Date().toISOString(),
      };

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trackingData));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trackingData));
      return trackingData;
    }

    return existing as TrackingData;
  } catch (err) {
    console.error("Error in captureTrackingParams:", err);
    return {
      utm_source: "direct",
      utm_medium: "none",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
      gclid: "",
      fbclid: "",
      referrer: "",
      landing_page: "/",
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Get current stored tracking data
 */
export function getStoredTracking(): TrackingData {
  if (typeof window === "undefined") {
    return {
      utm_source: "direct",
      utm_medium: "none",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
      gclid: "",
      fbclid: "",
      referrer: "",
      landing_page: "/",
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return captureTrackingParams();
}

/**
 * Send GA4 Event
 */
export function trackGAEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", eventName, params);
  } else {
    console.log(`[GA4 Event] ${eventName}:`, params);
  }
}

/**
 * Send Meta Pixel Event
 */
export function trackMetaPixel(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
    (window as any).fbq("track", eventName, params);
  } else {
    console.log(`[Meta Pixel Event] ${eventName}:`, params);
  }
}

/**
 * Track Booking Funnel: Step Started
 */
export function trackBookingStep(stepNumber: number, stepName: string, service?: string) {
  trackGAEvent("booking_step_view", {
    step: stepNumber,
    step_name: stepName,
    service_type: service || "unknown",
  });
}

/**
 * Track Call Button Click
 */
export function trackCallClick(source: string) {
  trackGAEvent("contact_call_click", { source });
  trackMetaPixel("Contact", { method: "phone", source });
}

/**
 * Track WhatsApp Button Click
 */
export function trackWhatsAppClick(source: string, service?: string) {
  trackGAEvent("contact_whatsapp_click", { source, service });
  trackMetaPixel("Contact", { method: "whatsapp", source, service });
}

/**
 * Track Lead / Booking Submission Complete
 */
export function trackBookingComplete(booking: {
  bookingId: string;
  service: string;
  amount?: number;
  city: string;
}) {
  const tracking = getStoredTracking();

  // GA4 Purchase / Lead Event
  trackGAEvent("generate_lead", {
    transaction_id: booking.bookingId,
    value: booking.amount || 499,
    currency: "INR",
    service_name: booking.service,
    city: booking.city,
    ...tracking,
  });

  // Meta Pixel Lead Event
  trackMetaPixel("Lead", {
    content_name: booking.service,
    content_category: "HVAC Services",
    value: booking.amount || 499,
    currency: "INR",
  });

  console.log(`[Attribution Logged] Booking ${booking.bookingId} attributed to:`, tracking);
}
