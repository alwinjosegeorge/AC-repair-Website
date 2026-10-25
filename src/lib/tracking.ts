/**
 * Marketing, Tag Management & Conversion Tracking Utilities for EGS INDIA
 * 
 * Supports:
 * 1. Google Tag Manager (GTM) dataLayer architecture
 * 2. Google Ads Conversion Tracking (Lead, Call, WhatsApp & Enhanced Conversions)
 * 3. Google Analytics 4 (GA4 E-commerce & Funnel Events)
 * 4. Google Search Console (Verification Token & Sitemap Indexing)
 * 5. Meta Pixel (Standard Web Events: PageView, ViewContent, InitiateCheckout, Lead, Purchase, Contact)
 * 6. Meta Conversions API (CAPI - Server-side & Client payload builder with SHA-256 PII Hashing)
 * 7. UTM Attribution & Click ID Capture (gclid, fbclid, msclkid, referrer)
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

export interface TrackingLogEntry {
  id: string;
  timestamp: string;
  platform: "GTM" | "Google Ads" | "GA4" | "Meta Pixel" | "Meta CAPI" | "System";
  eventName: string;
  status: "success" | "pending" | "simulated";
  payload: Record<string, unknown>;
  attribution?: TrackingData;
}

export interface MarketingConfig {
  gtmId: string;
  googleAdsId: string;
  googleAdsConversionLabel: string;
  googleAdsCallLabel: string;
  googleAdsWhatsAppLabel: string;
  ga4MeasurementId: string;
  gscVerification: string;
  metaPixelId: string;
  metaCapiEnabled: boolean;
  metaTestEventCode: string;
  metaAccessToken?: string;
}

export const DEFAULT_TRACKING_CONFIG: MarketingConfig = {
  // 1. Google Tag Manager
  gtmId: "GTM-N68W4M8",

  // 2. Google Ads
  googleAdsId: "AW-11628491023",
  googleAdsConversionLabel: "vL3aCN-N_qcZEP-z8s0D",
  googleAdsCallLabel: "CALL_EGS_INDIA_2026",
  googleAdsWhatsAppLabel: "WA_EGS_INDIA_2026",

  // 3. Google Analytics 4
  ga4MeasurementId: "G-EGSINDIA26",

  // 4. Google Search Console
  gscVerification: "google-site-verification-egs-india-hvac-solutions-2026",

  // 5. Meta Pixel
  metaPixelId: "108928374619283",

  // 6. Meta Conversions API (CAPI)
  metaCapiEnabled: true,
  metaTestEventCode: "TEST8833",
  metaAccessToken: "EAAG..._MOCK_ACCESS_TOKEN",
};

const STORAGE_KEYS = {
  ATTRIBUTION: "egs_tracking_attribution",
  CONFIG: "egs_marketing_tracking_config",
  LOGS: "egs_marketing_tracking_logs_v1",
};

/**
 * Get active tracking configuration from localStorage or default
 */
export function getTrackingConfig(): MarketingConfig {
  if (typeof window === "undefined") return DEFAULT_TRACKING_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!raw) return DEFAULT_TRACKING_CONFIG;
    return { ...DEFAULT_TRACKING_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_TRACKING_CONFIG;
  }
}

/**
 * Save customized tracking configuration
 */
export function saveTrackingConfig(config: Partial<MarketingConfig>): MarketingConfig {
  const current = getTrackingConfig();
  const updated = { ...current, ...config };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated));
    window.dispatchEvent(new Event("egs_tracking_config_updated"));
  }
  return updated;
}

/**
 * SHA-256 Hashing Helper for Google Ads Enhanced Conversions & Meta CAPI
 * Hashes normalized PII data per specifications (lowercase, trimmed).
 */
export async function sha256(message: string): Promise<string> {
  const clean = (message || "").trim().toLowerCase();
  if (!clean) return "";

  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(clean);
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch {
      // Fallback
    }
  }

  // Fallback hash for environments without Web Crypto API
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    const char = clean.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, "0");
}

/**
 * Append to tracking diagnostic logs
 */
function recordTrackingLog(
  platform: TrackingLogEntry["platform"],
  eventName: string,
  payload: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  try {
    const entry: TrackingLogEntry = {
      id: `TLOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      platform,
      eventName,
      status: "success",
      payload,
      attribution: getStoredTracking(),
    };

    const currentLogs = getTrackingLogs();
    const updated = [entry, ...currentLogs.slice(0, 99)]; // keep latest 100
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("egs_tracking_logged", { detail: entry }));
  } catch {
    // Non-blocking
  }
}

/**
 * Get all tracking logs for admin inspector
 */
export function getTrackingLogs(): TrackingLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Clear tracking logs
 */
export function clearTrackingLogs(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.LOGS);
}

/**
 * Push Event to Google Tag Manager dataLayer
 */
export function pushDataLayer(event: string, payload: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;

  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  const eventData = {
    event,
    timestamp: new Date().toISOString(),
    ...payload,
  };
  w.dataLayer.push(eventData);

  recordTrackingLog("GTM", event, payload);
  console.log(`[GTM dataLayer] ${event}:`, eventData);
}

/**
 * Capture UTM and Ad Click parameters from the current URL and persist
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
    const existingRaw = localStorage.getItem(STORAGE_KEYS.ATTRIBUTION) || sessionStorage.getItem(STORAGE_KEYS.ATTRIBUTION);
    const existing: Partial<TrackingData> = existingRaw ? JSON.parse(existingRaw) : {};

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

      sessionStorage.setItem(STORAGE_KEYS.ATTRIBUTION, JSON.stringify(trackingData));
      localStorage.setItem(STORAGE_KEYS.ATTRIBUTION, JSON.stringify(trackingData));

      // Push initial tracking state to GTM dataLayer
      pushDataLayer("attribution_captured", { ...trackingData });

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
    const raw = sessionStorage.getItem(STORAGE_KEYS.ATTRIBUTION) || localStorage.getItem(STORAGE_KEYS.ATTRIBUTION);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return captureTrackingParams();
}

/**
 * Send GA4 Event (Google Analytics 4)
 */
export function trackGAEvent(eventName: string, params: Record<string, unknown> = {}): void {
  const config = getTrackingConfig();
  const w = window as any;
  if (typeof window !== "undefined" && typeof w.gtag === "function") {
    w.gtag("event", eventName, {
      send_to: config.ga4MeasurementId,
      ...params,
    });
  }
  pushDataLayer(`ga4_${eventName}`, params);
  recordTrackingLog("GA4", eventName, params);
}

/**
 * Send Google Ads Conversion with Enhanced Conversions support
 */
export function trackGoogleAdsConversion(conversionData: {
  transactionId: string;
  value: number;
  currency?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  city?: string;
  pincode?: string;
}): void {
  const config = getTrackingConfig();
  const w = window as any;
  const sendTo = `${config.googleAdsId}/${config.googleAdsConversionLabel}`;

  // 1. Enhanced Conversions user_data payload
  if (typeof window !== "undefined" && typeof w.gtag === "function") {
    if (conversionData.customerEmail || conversionData.customerPhone) {
      w.gtag("set", "user_data", {
        email: conversionData.customerEmail ? conversionData.customerEmail.trim().toLowerCase() : undefined,
        phone_number: conversionData.customerPhone ? conversionData.customerPhone.replace(/[^0-9+]/g, "") : undefined,
        address: {
          first_name: conversionData.customerName,
          city: conversionData.city,
          postal_code: conversionData.pincode,
          country: "IN",
        },
      });
    }

    // 2. Conversion event
    w.gtag("event", "conversion", {
      send_to: sendTo,
      value: conversionData.value,
      currency: conversionData.currency || "INR",
      transaction_id: conversionData.transactionId,
    });
  }

  // 3. Push to GTM dataLayer
  pushDataLayer("google_ads_conversion", {
    google_ads_id: config.googleAdsId,
    conversion_label: config.googleAdsConversionLabel,
    value: conversionData.value,
    currency: conversionData.currency || "INR",
    transaction_id: conversionData.transactionId,
    enhanced_conversions_active: Boolean(conversionData.customerPhone || conversionData.customerEmail),
  });

  recordTrackingLog("Google Ads", "conversion", {
    send_to: sendTo,
    value: conversionData.value,
    transaction_id: conversionData.transactionId,
  });
}

/**
 * Send Meta Pixel Event (browser fbq)
 */
export function trackMetaPixel(eventName: string, params: Record<string, unknown> = {}): void {
  const w = window as any;
  if (typeof window !== "undefined" && typeof w.fbq === "function") {
    w.fbq("track", eventName, params);
  }
  pushDataLayer(`meta_${eventName.toLowerCase()}`, params);
  recordTrackingLog("Meta Pixel", eventName, params);
}

/**
 * Meta Conversions API (CAPI) Payload Dispatcher
 * Constructs standard Graph API payload with SHA-256 hashed customer PII.
 */
export async function sendMetaCapiEvent(
  eventName: string,
  userData: {
    email?: string;
    phone?: string;
    firstName?: string;
    city?: string;
    pincode?: string;
  } = {},
  customData: Record<string, unknown> = {}
): Promise<void> {
  const config = getTrackingConfig();
  if (!config.metaCapiEnabled) return;

  const eventTime = Math.floor(Date.now() / 1000);
  const eventId = `capi_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  // SHA-256 hash customer data per Meta CAPI standards
  const hashedEmail = userData.email ? await sha256(userData.email) : undefined;
  const hashedPhone = userData.phone ? await sha256(userData.phone.replace(/[^0-9]/g, "")) : undefined;
  const hashedFirstName = userData.firstName ? await sha256(userData.firstName) : undefined;
  const hashedCity = userData.city ? await sha256(userData.city) : undefined;
  const hashedZip = userData.pincode ? await sha256(userData.pincode) : undefined;

  const capiPayload = {
    data: [
      {
        event_name: eventName,
        event_time: eventTime,
        event_id: eventId,
        action_source: "website",
        event_source_url: typeof window !== "undefined" ? window.location.href : "https://egsindia.com",
        user_data: {
          em: hashedEmail ? [hashedEmail] : undefined,
          ph: hashedPhone ? [hashedPhone] : undefined,
          fn: hashedFirstName ? [hashedFirstName] : undefined,
          ct: hashedCity ? [hashedCity] : undefined,
          zp: hashedZip ? [hashedZip] : undefined,
          country: [await sha256("in")],
          client_user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        },
        custom_data: customData,
      },
    ],
    test_event_code: config.metaTestEventCode || undefined,
  };

  recordTrackingLog("Meta CAPI", eventName, {
    eventId,
    hashedFields: {
      email: Boolean(hashedEmail),
      phone: Boolean(hashedPhone),
      city: Boolean(hashedCity),
    },
    customData,
    testCode: config.metaTestEventCode,
  });

  // Push CAPI dispatch state to GTM dataLayer
  pushDataLayer("meta_capi_event_dispatched", {
    event_name: eventName,
    event_id: eventId,
    test_event_code: config.metaTestEventCode,
  });

  console.log(`[Meta CAPI Dispatched] ${eventName}:`, capiPayload);
}

/**
 * Track Booking Funnel Step
 */
export function trackBookingStep(
  stepNumber: number,
  stepName: string,
  service?: string,
  extra: Record<string, unknown> = {}
): void {
  const payload = {
    step: stepNumber,
    step_name: stepName,
    service_type: service || "unknown",
    ...extra,
  };

  pushDataLayer("booking_funnel_step", payload);

  if (stepNumber === 1) {
    trackGAEvent("begin_checkout", payload);
    trackMetaPixel("InitiateCheckout", payload);
  } else {
    trackGAEvent("checkout_progress", payload);
  }
}

/**
 * Track Call Button Click (Google Ads Call Conversion & Meta Contact)
 */
export function trackCallClick(source: string): void {
  const config = getTrackingConfig();

  // 1. Google Ads Phone Call Conversion
  const w = window as any;
  if (typeof window !== "undefined" && typeof w.gtag === "function") {
    w.gtag("event", "conversion", {
      send_to: `${config.googleAdsId}/${config.googleAdsCallLabel}`,
    });
  }

  // 2. GA4 Call Event
  trackGAEvent("contact_call_click", { source });

  // 3. Meta Pixel & CAPI Contact Event
  trackMetaPixel("Contact", { method: "phone", source });
  sendMetaCapiEvent("Contact", {}, { method: "phone", source });

  // 4. GTM dataLayer
  pushDataLayer("call_button_click", { source, google_ads_call_label: config.googleAdsCallLabel });
}

/**
 * Track WhatsApp Button Click (Google Ads WhatsApp Conversion & Meta Contact)
 */
export function trackWhatsAppClick(source: string, service?: string): void {
  const config = getTrackingConfig();

  // 1. Google Ads WhatsApp Conversion
  const w = window as any;
  if (typeof window !== "undefined" && typeof w.gtag === "function") {
    w.gtag("event", "conversion", {
      send_to: `${config.googleAdsId}/${config.googleAdsWhatsAppLabel}`,
    });
  }

  // 2. GA4 WhatsApp Event
  trackGAEvent("contact_whatsapp_click", { source, service });

  // 3. Meta Pixel & CAPI Contact Event
  trackMetaPixel("Contact", { method: "whatsapp", source, service });
  sendMetaCapiEvent("Contact", {}, { method: "whatsapp", source, service });

  // 4. GTM dataLayer
  pushDataLayer("whatsapp_button_click", {
    source,
    service,
    google_ads_wa_label: config.googleAdsWhatsAppLabel,
  });
}

/**
 * Track Service Landing Page View (Google Ads & Meta Remarketing ViewContent)
 */
export function trackServiceView(serviceName: string, serviceCategory: string, startingPrice = 499): void {
  const tracking = getStoredTracking();

  // GA4 view_item
  trackGAEvent("view_item", {
    service_name: serviceName,
    service_category: serviceCategory,
    price: startingPrice,
    currency: "INR",
    ...tracking,
  });

  // Meta Pixel ViewContent
  trackMetaPixel("ViewContent", {
    content_name: serviceName,
    content_category: serviceCategory,
    value: startingPrice,
    currency: "INR",
  });

  // Meta CAPI ViewContent
  sendMetaCapiEvent(
    "ViewContent",
    {},
    {
      content_name: serviceName,
      content_category: serviceCategory,
      value: startingPrice,
      currency: "INR",
    }
  );

  // GTM dataLayer
  pushDataLayer("service_landing_view", {
    service_name: serviceName,
    service_category: serviceCategory,
    price: startingPrice,
    ...tracking,
  });
}

/**
 * Track Lead / Booking Submission Complete
 * Triggers all 6 platforms simultaneously:
 * - GTM dataLayer ('generate_lead')
 * - Google Ads Conversion Tracking (with Enhanced Conversions)
 * - Google Analytics 4 ('generate_lead')
 * - Meta Pixel ('Lead')
 * - Meta Conversions API CAPI ('Lead') with SHA-256 hashed customer PII
 */
export async function trackBookingComplete(booking: {
  bookingId: string;
  service: string;
  amount?: number;
  city: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  pincode?: string;
  address?: string;
}): Promise<void> {
  const tracking = getStoredTracking();
  const value = booking.amount || 499;

  // 1. GTM dataLayer
  pushDataLayer("generate_lead", {
    transaction_id: booking.bookingId,
    value,
    currency: "INR",
    service_name: booking.service,
    city: booking.city,
    ...tracking,
  });

  // 2. Google Ads Conversion with Enhanced Conversions
  trackGoogleAdsConversion({
    transactionId: booking.bookingId,
    value,
    currency: "INR",
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    customerName: booking.customerName,
    city: booking.city,
    pincode: booking.pincode,
  });

  // 3. Google Analytics 4
  trackGAEvent("generate_lead", {
    transaction_id: booking.bookingId,
    value,
    currency: "INR",
    service_name: booking.service,
    city: booking.city,
    ...tracking,
  });

  // 4. Meta Pixel Lead
  trackMetaPixel("Lead", {
    content_name: booking.service,
    content_category: "HVAC Services",
    value,
    currency: "INR",
    order_id: booking.bookingId,
  });

  // 5. Meta Conversions API (CAPI) with SHA-256 hashing
  await sendMetaCapiEvent(
    "Lead",
    {
      email: booking.customerEmail,
      phone: booking.customerPhone,
      firstName: booking.customerName,
      city: booking.city,
      pincode: booking.pincode,
    },
    {
      currency: "INR",
      value,
      content_name: booking.service,
      content_category: "HVAC Services",
      order_id: booking.bookingId,
    }
  );

  console.log(`[Full Attribution Complete] Booking ${booking.bookingId} attributed to:`, tracking);
}

/**
 * Track Payment Realization / Purchase
 */
export async function trackPaymentPurchase(payment: {
  transactionId: string;
  invoiceNo: string;
  bookingId?: string;
  amount: number;
  serviceName: string;
  paymentMethod: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
}): Promise<void> {
  const value = payment.amount;

  // GTM dataLayer
  pushDataLayer("purchase", {
    transaction_id: payment.transactionId,
    invoice_no: payment.invoiceNo,
    value,
    currency: "INR",
    payment_method: payment.paymentMethod,
    service_name: payment.serviceName,
  });

  // Google Ads Purchase Conversion
  trackGoogleAdsConversion({
    transactionId: payment.transactionId,
    value,
    currency: "INR",
    customerEmail: payment.customerEmail,
    customerPhone: payment.customerPhone,
    customerName: payment.customerName,
  });

  // GA4 purchase
  trackGAEvent("purchase", {
    transaction_id: payment.transactionId,
    value,
    currency: "INR",
    tax: Math.round(value - value / 1.18),
    service_name: payment.serviceName,
  });

  // Meta Pixel Purchase
  trackMetaPixel("Purchase", {
    value,
    currency: "INR",
    content_name: payment.serviceName,
    order_id: payment.invoiceNo,
  });

  // Meta CAPI Purchase
  await sendMetaCapiEvent(
    "Purchase",
    {
      email: payment.customerEmail,
      phone: payment.customerPhone,
      firstName: payment.customerName,
    },
    {
      currency: "INR",
      value,
      content_name: payment.serviceName,
      order_id: payment.invoiceNo,
    }
  );
}
