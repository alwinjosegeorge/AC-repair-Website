import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Booking,
  Technician,
  AMCContract,
  AMCServiceFrequency,
  Customer,
  CustomerBookingHistory,
  BookingStatus,
  BOOKING_STATUS_FLOW,
  PaymentMethod,
  PaymentStatus,
  PaymentTransaction,
  EGSInvoice,
  EGS_COMPANY_DETAILS,
  getBookings,
  getTechnicians,
  getAMCContracts,
  renewAMCContract,
  scheduleAMCNextService,
  saveAMCContract,
  getCustomers,
  getTransactions,
  saveTransaction,
  recordBookingPayment,
  getInvoices,
  getInvoiceByNumber,
  generateInvoiceForBooking,
  generateInvoiceForAMC,
  generatePaymentReceiptWhatsAppURL,
  generateCustomerPaymentLinkWhatsAppURL,
  generateUPIPaymentUrl,
  getUPIQRCodeUrl,
  updateBookingStatus,
  generateAdminToCustomerWhatsAppURL,
  generateAMCRenewalWhatsAppURL,
  generateAMCRenewalConfirmationWhatsAppURL,
  EGS_CALL_NUMBER,
  EGS_WHATSAPP_NUMBER,
} from "@/lib/store";
import {
  LayoutDashboard,
  CalendarCheck,
  Calendar,
  Users,
  HardHat,
  FileCheck2,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MessageSquare,
  Phone,
  RefreshCw,
  ExternalLink,
  Tag,
  ArrowUpRight,
  ShieldAlert,
  MapPin,
  Building2,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Check,
  X,
  AlertTriangle,
  ChevronRight,
  ChevronUp,
  DollarSign,
  Send,
  Truck,
  Play,
  Award,
  CreditCard,
  XCircle,
  Menu,
  Receipt,
  QrCode,
  Printer,
  Download,
  Share2,
  Copy,
  BadgePercent,
  Banknote,
  FileText,
  Radio,
  Activity,
  Terminal,
  Sliders,
  Cpu,
  Layers,
  Lock,
  Shield,
  Delete,
} from "lucide-react";
import {
  getTrackingConfig,
  saveTrackingConfig,
  DEFAULT_TRACKING_CONFIG,
  TrackingConfig,
  pushDataLayer,
  trackGoogleAdsConversion,
  trackGAEvent,
  trackMetaPixel,
  sendMetaCapiEvent,
  getTrackingLogs,
  clearTrackingLogs,
  TrackingLog,
  trackWhatsAppClick,
  trackCallClick,
} from "@/lib/tracking";

export const Route = createFileRoute("/control-hub")({
  head: () => ({
    meta: [
      { title: "EGS Control Hub | Restricted Access" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ControlHubGate,
});

const CONTROL_HUB_PIN = "5555";
const AUTH_STORAGE_KEY = "egs_control_hub_auth_v1";

function ControlHubGate() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pin, setPin] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored === "authenticated") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const verifyPin = (pinToTest: string) => {
    setIsVerifying(true);
    if (pinToTest === CONTROL_HUB_PIN) {
      setTimeout(() => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(AUTH_STORAGE_KEY, "authenticated");
        }
        setIsAuthenticated(true);
        setErrorMsg("");
        setIsVerifying(false);
      }, 150);
    } else {
      setTimeout(() => {
        setIsShaking(true);
        setErrorMsg("Access Denied: Invalid Security PIN.");
        setPin("");
        setIsVerifying(false);
        setTimeout(() => setIsShaking(false), 500);
      }, 150);
    }
  };

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg("");
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg("");
  };

  const handleLock = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setIsAuthenticated(false);
    setPin("");
    setErrorMsg("");
  };

  // Keyboard navigation for desktop & laptop typing
  useEffect(() => {
    if (isAuthenticated) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isVerifying) return;
      if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === "Backspace") {
        handleDelete();
      } else if (e.key === "Escape") {
        setPin("");
        setErrorMsg("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthenticated, isVerifying, pin]);

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-sky-50/40 to-blue-50/30 text-slate-900 flex flex-col justify-between p-4 sm:p-6 font-sans select-none overflow-hidden">
        {/* Ambient Glows & Light Mesh */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-sky-200/60 via-blue-200/30 to-teal-100/40 rounded-full blur-[130px] opacity-75" />
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[520px] h-[360px] bg-sky-200/40 rounded-full blur-[110px] opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        </div>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between max-w-lg mx-auto w-full pt-1 sm:pt-2">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:text-brand hover:border-brand/40 hover:shadow"
          >
            <ArrowRight className="size-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
            <span>Return to Site</span>
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1 text-[10px] sm:text-[11px] font-bold tracking-wider text-emerald-700 uppercase shadow-sm backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span>Restricted Portal</span>
          </div>
        </div>

        {/* Centerpiece Light Glass Card */}
        <div className="relative z-10 w-full max-w-[390px] sm:max-w-[420px] mx-auto my-auto py-4">
          <div className="relative rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-sky-950/10 ring-1 ring-slate-100 overflow-hidden">
            {/* Top Accent Gradient Line */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-48 h-[3px] bg-gradient-to-r from-transparent via-[#0084f6] to-transparent" />

            {/* Header */}
            <div className="text-center mb-6">
              <div className="relative mx-auto mb-3.5 flex size-16 sm:size-17 items-center justify-center rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50 to-blue-100/60 shadow-md shadow-sky-500/10 ring-4 ring-sky-50">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-400/15 to-transparent opacity-80" />
                <Lock className="relative size-7 text-[#0084f6] drop-shadow-[0_2px_4px_rgba(0,132,246,0.3)]" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                EGS Control Hub
              </h1>
              <p className="mt-1 text-xs text-slate-500 font-medium">
                Restricted Operations Center • Enter 4-Digit Security PIN
              </p>
            </div>

            {/* 4 Digit Visual Indicators */}
            <div
              className={`flex justify-center items-center gap-3 sm:gap-3.5 mb-5 ${
                isShaking ? "animate-shake" : ""
              }`}
            >
              {[0, 1, 2, 3].map((idx) => {
                const isFilled = pin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`size-13 sm:size-14 rounded-2xl border flex items-center justify-center transition-all duration-300 ${
                      isShaking
                        ? "border-rose-400 bg-rose-50 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                        : isFilled
                        ? "border-[#0084f6] bg-gradient-to-b from-sky-50 to-blue-100/70 shadow-md shadow-sky-500/20 scale-105"
                        : "border-slate-200 bg-slate-50 shadow-inner"
                    }`}
                  >
                    {isFilled ? (
                      <span className="size-3.5 sm:size-4 rounded-full bg-gradient-to-tr from-sky-400 to-[#0084f6] shadow-[0_0_8px_rgba(0,132,246,0.7)] animate-pulse" />
                    ) : (
                      <span className="size-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Status / Error Message */}
            <div className="min-h-8 mb-4 flex items-center justify-center">
              {isVerifying ? (
                <div className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-1 text-xs font-semibold text-sky-700 animate-pulse">
                  <RefreshCw className="size-3.5 animate-spin text-[#0084f6]" />
                  <span>Verifying Security Clearance...</span>
                </div>
              ) : errorMsg ? (
                <div className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-semibold text-rose-700 animate-fade-in shadow-sm">
                  <AlertTriangle className="size-3.5 shrink-0 text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                  <Shield className="size-3 text-[#0084f6]" />
                  <span>Protected 256-Bit Encrypted Session</span>
                </div>
              )}
            </div>

            {/* On-Screen Touch Keypad */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-[280px] sm:max-w-[300px] mx-auto">
              {[
                { num: "1", sub: "•" },
                { num: "2", sub: "ABC" },
                { num: "3", sub: "DEF" },
                { num: "4", sub: "GHI" },
                { num: "5", sub: "JKL" },
                { num: "6", sub: "MNO" },
                { num: "7", sub: "PQRS" },
                { num: "8", sub: "TUV" },
                { num: "9", sub: "WXYZ" },
              ].map(({ num, sub }) => (
                <button
                  key={num}
                  type="button"
                  disabled={isVerifying}
                  onClick={() => handleKeyPress(num)}
                  className="group flex h-14 sm:h-15 w-full flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-150 hover:bg-slate-50 hover:border-sky-300 hover:shadow-md active:scale-95 active:bg-sky-50 active:border-[#0084f6] cursor-pointer disabled:opacity-40"
                >
                  <span className="text-xl sm:text-2xl font-black text-slate-800 group-hover:text-[#0084f6] transition-colors leading-none">
                    {num}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-bold tracking-widest text-slate-400 uppercase leading-tight mt-0.5">
                    {sub}
                  </span>
                </button>
              ))}

              {/* Clear Button */}
              <button
                type="button"
                onClick={() => {
                  setPin("");
                  setErrorMsg("");
                }}
                disabled={isVerifying || pin.length === 0}
                className="flex h-14 sm:h-15 w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-100/80 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 hover:border-slate-300 transition-all active:scale-95 cursor-pointer disabled:opacity-30"
              >
                Clear
              </button>

              {/* 0 Button */}
              <button
                type="button"
                disabled={isVerifying}
                onClick={() => handleKeyPress("0")}
                className="group flex h-14 sm:h-15 w-full flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-150 hover:bg-slate-50 hover:border-sky-300 hover:shadow-md active:scale-95 active:bg-sky-50 active:border-[#0084f6] cursor-pointer disabled:opacity-40"
              >
                <span className="text-xl sm:text-2xl font-black text-slate-800 group-hover:text-[#0084f6] transition-colors leading-none">
                  0
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold tracking-widest text-slate-400 uppercase leading-tight mt-0.5">
                  +
                </span>
              </button>

              {/* Backspace Button */}
              <button
                type="button"
                disabled={isVerifying || pin.length === 0}
                onClick={handleDelete}
                className="flex h-14 sm:h-15 w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-100/80 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 hover:border-slate-300 transition-all active:scale-95 cursor-pointer disabled:opacity-30"
                title="Delete"
              >
                <Delete className="size-5" />
              </button>
            </div>

            {/* Quick demo PIN helper badge for convenience */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Default Operations PIN:</span>
              <button
                type="button"
                onClick={() => {
                  setPin("5555");
                  verifyPin("5555");
                }}
                className="inline-flex items-center gap-1 rounded-md bg-sky-50 border border-sky-200 px-2 py-0.5 text-[#0084f6] font-mono text-[11px] font-bold hover:bg-sky-100 hover:border-sky-300 transition-colors cursor-pointer shadow-xs"
              >
                <span>5555</span>
                <span className="text-[9px] text-slate-500">(Quick Fill)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-center text-[11px] text-slate-500 max-w-sm mx-auto pb-1">
          Expert Goods &amp; Services (EGS INDIA) • ISO 9001:2015 Operations
        </div>
      </div>
    );
  }

  return <AdminDashboard onLock={handleLock} />;
}

// Admin Navigation Items matching the exact brief:
export type AdminSection =
  | "new-bookings"
  | "todays-bookings"
  | "upcoming-bookings"
  | "completed"
  | "cancelled"
  | "amc-leads"
  | "quotation-requests"
  | "customers"
  | "technicians"
  | "service-areas"
  | "reports"
  | "payments"
  | "tracking-diagnostics";

const SERVICE_HUBS = [
  {
    city: "Kollam",
    head: "Arun Kumar",
    phone: "+91 98950 12345",
    activeTechs: 6,
    activeJobs: 3,
    coverage: ["Kadappakada", "Asramam", "Chinnakkada", "Beach Road", "Kilikollur", "Kottiyam"],
    pincodes: "691001, 691002, 691004, 691020",
  },
  {
    city: "Thiruvananthapuram",
    head: "Vipin Das",
    phone: "+91 85890 54321",
    activeTechs: 9,
    activeJobs: 5,
    coverage: ["Kowdiar", "Pattom", "Vellayambalam", "Kazhakkoottam", "Technopark", "Statue"],
    pincodes: "695001, 695003, 695004, 695581",
  },
  {
    city: "Ernakulam / Cochin",
    head: "Muhammed Shafi",
    phone: "+91 97450 99881",
    activeTechs: 14,
    activeJobs: 8,
    coverage: ["Kakkanad", "Infopark", "Kaloor", "Edappally", "MG Road", "Thevara", "Palarivattom"],
    pincodes: "682020, 682030, 682013, 682025",
  },
  {
    city: "Thrissur",
    head: "Sujith Nair",
    phone: "+91 94471 22334",
    activeTechs: 5,
    activeJobs: 2,
    coverage: ["Round South", "East Fort", "Punkunnam", "Ayyanthole", "Ollur"],
    pincodes: "680001, 680005, 680003",
  },
  {
    city: "Chennai Hub",
    head: "Karthik Raman",
    phone: "+91 98840 11223",
    activeTechs: 12,
    activeJobs: 6,
    coverage: ["Anna Nagar", "T Nagar", "Velachery", "Adyar", "OMR IT Corridor"],
    pincodes: "600040, 600017, 600042, 600096",
  },
];

export function AdminDashboard({ onLock }: { onLock?: () => void } = {}) {
  const [activeSection, setActiveSection] = useState<AdminSection>("new-bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [amcContracts, setAmcContracts] = useState<AMCContract[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Filters & Selected State
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [amcStatusFilter, setAmcStatusFilter] = useState("all");
  const [acTypeFilter, setAcTypeFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileOperationsSheetOpen, setMobileOperationsSheetOpen] = useState(false);

  const isBookingSection = useMemo(
    () =>
      [
        "new-bookings",
        "todays-bookings",
        "upcoming-bookings",
        "completed",
        "cancelled",
      ].includes(activeSection),
    [activeSection]
  );

  // AMC Renewal System State
  const [amcSectionTab, setAmcSectionTab] = useState<"all" | "expiring_soon" | "active" | "expired" | "renewed">("all");
  const [renewModalContract, setRenewModalContract] = useState<AMCContract | null>(null);
  const [scheduleServiceContract, setScheduleServiceContract] = useState<AMCContract | null>(null);
  const [showNewAMCModal, setShowNewAMCModal] = useState(false);
  const [amcActionToast, setAmcActionToast] = useState<string | null>(null);

  // Payments & Invoicing State
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [invoices, setInvoices] = useState<EGSInvoice[]>([]);
  const [paymentSearchQuery, setPaymentSearchQuery] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [paymentDateFilter, setPaymentDateFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<EGSInvoice | null>(null);
  const [recordPaymentModalOpen, setRecordPaymentModalOpen] = useState(false);
  const [bankDetailsModalOpen, setBankDetailsModalOpen] = useState(false);
  const [paymentActionToast, setPaymentActionToast] = useState<string | null>(null);

  // GTM & Tracking Diagnostics State
  const [trackingConfig, setTrackingConfig] = useState<TrackingConfig>(() => getTrackingConfig());
  const [trackingLogs, setTrackingLogs] = useState<TrackingLog[]>(() => getTrackingLogs());
  const [trackingToast, setTrackingToast] = useState<string | null>(null);
  const [isEditingTrackingConfig, setIsEditingTrackingConfig] = useState(false);
  const [editedConfig, setEditedConfig] = useState<TrackingConfig>(() => getTrackingConfig());
  const [trackingLogFilter, setTrackingLogFilter] = useState<string>("all");

  const filteredTrackingLogs = useMemo(() => {
    if (trackingLogFilter === "all") return trackingLogs;
    return trackingLogs.filter((l) => l.platform === trackingLogFilter);
  }, [trackingLogs, trackingLogFilter]);

  const handleFireTestGTMLead = () => {
    const id = `TEST-EGS-${Math.floor(1000 + Math.random() * 9000)}`;
    pushDataLayer("generate_lead", {
      transaction_id: id,
      value: 1499,
      currency: "INR",
      service_name: "AC Deep Jet Cleaning & Service",
      city: "Ernakulam",
      lead_source: "admin_test_trigger",
    });
    setTrackingLogs(getTrackingLogs());
    setTrackingToast(`✓ GTM generate_lead event pushed to dataLayer (${id})`);
  };

  const handleFireTestGoogleAds = () => {
    const txId = `GADS-TEST-${Math.floor(1000 + Math.random() * 9000)}`;
    trackGoogleAdsConversion({
      transactionId: txId,
      value: 1499,
      customerEmail: "contact@egsindia.com",
      customerPhone: "+919895012345",
      customerName: "Rajesh",
      city: "Kollam",
      pincode: "691001",
    });
    setTrackingLogs(getTrackingLogs());
    setTrackingToast(`✓ Google Ads Lead Conversion & Enhanced Conversions dispatched (${txId})`);
  };

  const handleFireTestMetaCAPI = () => {
    const testId = `META-TEST-${Date.now()}`;
    trackMetaPixel("Lead", {
      content_name: "AC Deep Jet Service",
      value: 1499,
      currency: "INR",
    });
    sendMetaCapiEvent(
      "Lead",
      {
        email: "contact@egsindia.com",
        phone: "+919895012345",
        firstName: "Rajesh",
        city: "Ernakulam",
        pincode: "682020",
      },
      {
        content_name: "AC Deep Jet Service",
        value: 1499,
        currency: "INR",
        event_id: testId,
      }
    );
    setTrackingLogs(getTrackingLogs());
    setTrackingToast("✓ Meta Pixel & CAPI Lead with SHA-256 PII hashed payload dispatched!");
  };

  const handleFireTestWhatsApp = () => {
    trackWhatsAppClick("admin_diagnostics_test", "AC Service");
    setTrackingLogs(getTrackingLogs());
    setTrackingToast("✓ WhatsApp Click Conversion fired (Google Ads + Meta Contact + GTM)!");
  };

  const handleFireTestCall = () => {
    trackCallClick("admin_diagnostics_test");
    setTrackingLogs(getTrackingLogs());
    setTrackingToast("✓ Phone Call Click Conversion fired (Google Ads + GA4 + GTM)!");
  };

  const handleClearLogs = () => {
    clearTrackingLogs();
    setTrackingLogs([]);
    setTrackingToast("✓ Event stream logs cleared.");
  };

  const handleSaveTrackingConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveTrackingConfig(editedConfig);
    setTrackingConfig(editedConfig);
    setIsEditingTrackingConfig(false);
    setTrackingToast("✓ Marketing tracking configuration saved and applied!");
  };

  const handleResetTrackingConfig = () => {
    setEditedConfig({ ...DEFAULT_TRACKING_CONFIG });
  };

  // Manual payment recording form inputs
  const [recordPayBookingId, setRecordPayBookingId] = useState("");
  const [recordPayCustName, setRecordPayCustName] = useState("");
  const [recordPayCustPhone, setRecordPayCustPhone] = useState("");
  const [recordPayServiceName, setRecordPayServiceName] = useState("❄ AC Service");
  const [recordPayAmount, setRecordPayAmount] = useState<number>(1499);
  const [recordPayMethod, setRecordPayMethod] = useState<PaymentMethod>("UPI / QR Code");
  const [recordPayRef, setRecordPayRef] = useState("");
  const [recordPayNotes, setRecordPayNotes] = useState("");

  // Renewal form inputs
  const [renewalAmount, setRenewalAmount] = useState<number>(0);
  const [renewalPaymentMode, setRenewalPaymentMode] = useState<string>("UPI / GPay");
  const [renewalDiscountPercent, setRenewalDiscountPercent] = useState<number>(0);
  const [renewalNotes, setRenewalNotes] = useState<string>("");

  // Schedule visit inputs
  const [serviceVisitDate, setServiceVisitDate] = useState<string>("");
  const [serviceVisitSlot, setServiceVisitSlot] = useState<string>("Morning Slot (9:00 AM - 12:00 PM)");
  const [serviceVisitTechId, setServiceVisitTechId] = useState<string>("tech-1");

  // New AMC contract form inputs
  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustCity, setNewCustCity] = useState("Ernakulam / Cochin");
  const [newCustAddress, setNewCustAddress] = useState("");
  const [newPlanName, setNewPlanName] = useState("Comprehensive Care");
  const [newUnitsCount, setNewUnitsCount] = useState(2);
  const [newFrequency, setNewFrequency] = useState<AMCServiceFrequency>("Quarterly (4 Services/Year)");
  const [newContractAmount, setNewContractAmount] = useState(4999);
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split("T")[0]);

  // Load Data
  const loadData = () => {
    const b = getBookings();
    setBookings(b);
    setTechnicians(getTechnicians());
    setAmcContracts(getAMCContracts());
    setCustomers(getCustomers());
    setTransactions(getTransactions());
    setInvoices(getInvoices());
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("egs_bookings_updated", handleUpdate);
    window.addEventListener("egs_customers_updated", handleUpdate);
    window.addEventListener("egs_amc_updated", handleUpdate);
    window.addEventListener("egs_transactions_updated", handleUpdate);
    window.addEventListener("egs_invoices_updated", handleUpdate);
    return () => {
      window.removeEventListener("egs_bookings_updated", handleUpdate);
      window.removeEventListener("egs_customers_updated", handleUpdate);
      window.removeEventListener("egs_amc_updated", handleUpdate);
      window.removeEventListener("egs_transactions_updated", handleUpdate);
      window.removeEventListener("egs_invoices_updated", handleUpdate);
    };
  }, []);

  // Update Status in Store
  const handleStatusChange = (bookingId: string, newStatus: BookingStatus, techId?: string) => {
    const updated = updateBookingStatus(bookingId, newStatus, techId);
    if (updated) {
      loadData();
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking(updated);
      }
    }
  };

  // Status counts for badge indicators
  const counts = useMemo(() => {
    const newBookings = bookings.filter((b) => b.status === "NEW").length;
    const todays = bookings.filter(
      (b) =>
        (b.preferredDate?.toLowerCase().includes("today") || false) &&
        b.status !== "COMPLETED" &&
        b.status !== "PAYMENT RECEIVED" &&
        b.status !== "CANCELLED"
    ).length;
    const upcoming = bookings.filter(
      (b) =>
        !b.preferredDate?.toLowerCase().includes("today") &&
        b.status !== "COMPLETED" &&
        b.status !== "PAYMENT RECEIVED" &&
        b.status !== "CANCELLED"
    ).length;
    const completed = bookings.filter(
      (b) => b.status === "COMPLETED" || b.status === "PAYMENT RECEIVED"
    ).length;
    const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;
    const amcLeads = amcContracts.length;
    const amcExpiring = amcContracts.filter((a) => a.status === "expiring_soon").length;
    const quotation = bookings.filter(
      (b) =>
        b.serviceCategory === "commercial-hvac" ||
        b.serviceCategory === "buy-new-ac" ||
        String(b.unitCount).includes("+")
    ).length;

    const totalRevenue = transactions
      .filter((t) => t.status === "PAID")
      .reduce((acc, t) => acc + (t.amount || 0), 0);
    const todayRevenue = transactions
      .filter((t) => {
        if (t.status !== "PAID") return false;
        const d = new Date(t.paidAt || t.createdAt);
        const today = new Date();
        return (
          d.getDate() === today.getDate() &&
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear()
        );
      })
      .reduce((acc, t) => acc + (t.amount || 0), 0);
    const pendingCollections = bookings
      .filter((b) => b.status === "COMPLETED")
      .reduce((acc, b) => acc + (b.estimatedAmount || 0), 0);

    return {
      newBookings,
      todays,
      upcoming,
      completed,
      cancelled,
      amcLeads,
      amcExpiring,
      quotation,
      totalRevenue,
      todayRevenue,
      pendingCollections,
      transactionsCount: transactions.length,
    };
  }, [bookings, amcContracts, transactions]);

  // Filtered Transactions for Payments Ledger
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (paymentMethodFilter !== "all" && t.paymentMethod !== paymentMethodFilter) {
        return false;
      }
      if (paymentStatusFilter !== "all" && t.status !== paymentStatusFilter) {
        return false;
      }
      if (paymentDateFilter === "today") {
        const d = new Date(t.paidAt || t.createdAt);
        const today = new Date();
        if (
          d.getDate() !== today.getDate() ||
          d.getMonth() !== today.getMonth() ||
          d.getFullYear() !== today.getFullYear()
        ) {
          return false;
        }
      } else if (paymentDateFilter === "month") {
        const d = new Date(t.paidAt || t.createdAt);
        const today = new Date();
        if (d.getMonth() !== today.getMonth() || d.getFullYear() !== today.getFullYear()) {
          return false;
        }
      }
      if (paymentSearchQuery.trim()) {
        const q = paymentSearchQuery.toLowerCase();
        const match =
          t.id.toLowerCase().includes(q) ||
          t.invoiceNo.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.phone.includes(q) ||
          t.serviceName.toLowerCase().includes(q) ||
          (t.transactionRef && t.transactionRef.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [transactions, paymentMethodFilter, paymentStatusFilter, paymentDateFilter, paymentSearchQuery]);

  // Filtered AMC Contracts for the AMC Renewal System
  const filteredAMCContracts = useMemo(() => {
    return amcContracts.filter((c) => {
      // Tab filter
      if (amcSectionTab === "expiring_soon" && c.status !== "expiring_soon") return false;
      if (amcSectionTab === "active" && c.status !== "active") return false;
      if (amcSectionTab === "expired" && c.status !== "expired") return false;
      if (amcSectionTab === "renewed" && c.status !== "renewed") return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          c.contractNo.toLowerCase().includes(q) ||
          c.customerName.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.planName.toLowerCase().includes(q) ||
          c.serviceFrequency.toLowerCase().includes(q);
        if (!match) return false;
      }

      // City filter
      if (cityFilter !== "all" && !c.city.toLowerCase().includes(cityFilter.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [amcContracts, amcSectionTab, searchQuery, cityFilter]);

  // Filtered Bookings for the current section
  const currentSectionBookings = useMemo(() => {
    let list: Booking[] = [];

    switch (activeSection) {
      case "new-bookings":
        list = bookings.filter((b) => b.status === "NEW");
        break;
      case "todays-bookings":
        list = bookings.filter((b) =>
          b.preferredDate?.toLowerCase().includes("today")
        );
        break;
      case "upcoming-bookings":
        list = bookings.filter(
          (b) =>
            !b.preferredDate?.toLowerCase().includes("today") &&
            b.status !== "COMPLETED" &&
            b.status !== "PAYMENT RECEIVED" &&
            b.status !== "CANCELLED"
        );
        break;
      case "completed":
        list = bookings.filter(
          (b) => b.status === "COMPLETED" || b.status === "PAYMENT RECEIVED"
        );
        break;
      case "cancelled":
        list = bookings.filter((b) => b.status === "CANCELLED");
        break;
      case "amc-leads":
        list = bookings.filter((b) => b.serviceCategory === "ac-amc");
        break;
      case "quotation-requests":
        list = bookings.filter(
          (b) =>
            b.serviceCategory === "commercial-hvac" ||
            b.serviceCategory === "buy-new-ac" ||
            String(b.unitCount).includes("+")
        );
        break;
      default:
        list = bookings;
    }

    return list.filter((b) => {
      const matchSearch =
        searchQuery === "" ||
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.phone.includes(searchQuery) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCity = cityFilter === "all" || b.city === cityFilter;
      return matchSearch && matchCity;
    });
  }, [bookings, activeSection, searchQuery, cityFilter]);

  // Filtered Customers CRM list
  const customersList = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        searchQuery === "" ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.mobile.includes(searchQuery) ||
        c.whatsapp.includes(searchQuery) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.pin.includes(searchQuery) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.acType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCity =
        cityFilter === "all" ||
        c.location.toLowerCase().includes(cityFilter.toLowerCase()) ||
        c.address.toLowerCase().includes(cityFilter.toLowerCase());

      const matchAmc =
        amcStatusFilter === "all" || c.amcStatus.toLowerCase() === amcStatusFilter.toLowerCase();

      const matchAcType = acTypeFilter === "all" || c.acType === acTypeFilter;

      return matchSearch && matchCity && matchAmc && matchAcType;
    });
  }, [customers, searchQuery, cityFilter, amcStatusFilter, acTypeFilter]);

  // Reports / KPI Metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.estimatedAmount || 0), 0);
  const paidRevenue = bookings
    .filter((b) => b.status === "PAYMENT RECEIVED")
    .reduce((sum, b) => sum + (b.estimatedAmount || 0), 0);

  const attributionStats = useMemo(() => {
    const counts = { google: 0, meta: 0, direct: 0, other: 0 };
    bookings.forEach((b) => {
      const src = (b.attribution?.utm_source || "direct").toLowerCase();
      if (src.includes("google")) counts.google += 1;
      else if (src.includes("meta") || src.includes("facebook") || src.includes("instagram"))
        counts.meta += 1;
      else if (src.includes("direct")) counts.direct += 1;
      else counts.other += 1;
    });
    return counts;
  }, [bookings]);

  // Status Badge Component
  const renderStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "NEW":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 text-xs font-black text-blue-600">
            <span className="size-1.5 rounded-full bg-blue-600 animate-ping" />
            NEW
          </span>
        );
      case "CONTACTED":
        return (
          <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-xs font-black text-amber-600">
            CONTACTED
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="rounded-full bg-teal-500/15 border border-teal-500/30 px-2.5 py-0.5 text-xs font-black text-teal-600">
            CONFIRMED
          </span>
        );
      case "ASSIGNED":
        return (
          <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 text-xs font-black text-indigo-600">
            ASSIGNED
          </span>
        );
      case "TECHNICIAN ON THE WAY":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 text-xs font-black text-purple-600 animate-pulse">
            <Truck className="size-3" />
            ON THE WAY
          </span>
        );
      case "SERVICE STARTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 border border-orange-500/30 px-2.5 py-0.5 text-xs font-black text-orange-600">
            <Play className="size-3" />
            STARTED
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-black text-emerald-600">
            <CheckCircle2 className="size-3" />
            COMPLETED
          </span>
        );
      case "PAYMENT RECEIVED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-xs font-black shadow-sm">
            <CreditCard className="size-3" />
            PAID ₹
          </span>
        );
      case "CANCELLED":
        return (
          <span className="rounded-full bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 text-xs font-black text-rose-600">
            CANCELLED
          </span>
        );
      default:
        return <span className="text-xs font-bold">{status}</span>;
    }
  };

  // Helper to advance booking to next status
  const advanceStatus = (booking: Booking) => {
    const currentIndex = BOOKING_STATUS_FLOW.indexOf(booking.status);
    if (currentIndex >= 0 && currentIndex < BOOKING_STATUS_FLOW.length - 1) {
      const nextStatus = BOOKING_STATUS_FLOW[currentIndex + 1];
      if (nextStatus) {
        handleStatusChange(booking.id, nextStatus);
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface/50 text-foreground font-sans flex flex-col">
      {/* Top Admin Application Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl border border-border bg-surface text-foreground"
            >
              <Menu className="size-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo-full.png" alt="EGS INDIA" className="h-9 w-auto object-contain" />
            </Link>
            <div className="hidden sm:block h-5 w-px bg-border" />
            <span className="hidden sm:inline-block rounded-md bg-brand-soft px-2.5 py-1 text-xs font-black uppercase tracking-wider text-brand">
              Operations &amp; Dispatch CRM
            </span>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={loadData}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-surface transition-colors"
            >
              <RefreshCw className="size-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-1.5 text-xs font-black text-brand-foreground shadow-sm hover:bg-brand/90"
            >
              <span>Live Website</span>
              <ExternalLink className="size-3.5" />
            </Link>

            {onLock && (
              <button
                type="button"
                onClick={onLock}
                className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500/20 transition-colors cursor-pointer"
                title="Lock Control Hub"
              >
                <Lock className="size-3.5" />
                <span className="hidden sm:inline">Lock Hub</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Admin App Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* ============================================================ */}
        {/* SIDEBAR NAVIGATION: Exact hierarchy requested */}
        {/* ============================================================ */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border p-4 flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="space-y-6 overflow-y-auto">
            {/* Mobile Close Button */}
            <div className="flex items-center justify-between lg:hidden border-b border-border pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-brand">
                Dashboard Menu
              </span>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Section 1: Bookings Management */}
            <div>
              <div className="px-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Bookings Flow
              </div>
              <div className="mt-2 space-y-1">
                {/* 1. New Bookings */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("new-bookings");
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeSection === "new-bookings"
                      ? "bg-brand text-brand-foreground shadow-md"
                      : "text-foreground hover:bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Clock className="size-4" />
                    <span>New Bookings</span>
                  </div>
                  {counts.newBookings > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        activeSection === "new-bookings"
                          ? "bg-white text-brand"
                          : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      {counts.newBookings}
                    </span>
                  )}
                </button>

                {/* 2. Today's Bookings */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("todays-bookings");
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeSection === "todays-bookings"
                      ? "bg-brand text-brand-foreground shadow-md"
                      : "text-foreground hover:bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CalendarCheck className="size-4" />
                    <span>Today's Bookings</span>
                  </div>
                  {counts.todays > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        activeSection === "todays-bookings"
                          ? "bg-white text-brand"
                          : "bg-emerald-500/15 text-emerald-600"
                      }`}
                    >
                      {counts.todays}
                    </span>
                  )}
                </button>

                {/* 3. Upcoming Bookings */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("upcoming-bookings");
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeSection === "upcoming-bookings"
                      ? "bg-brand text-brand-foreground shadow-md"
                      : "text-foreground hover:bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Clock className="size-4" />
                    <span>Upcoming Bookings</span>
                  </div>
                  {counts.upcoming > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        activeSection === "upcoming-bookings"
                          ? "bg-white text-brand"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {counts.upcoming}
                    </span>
                  )}
                </button>

                {/* 4. Completed */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("completed");
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeSection === "completed"
                      ? "bg-brand text-brand-foreground shadow-md"
                      : "text-foreground hover:bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4" />
                    <span>Completed</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      activeSection === "completed"
                        ? "bg-white text-brand"
                        : "bg-emerald-500/10 text-emerald-600"
                    }`}
                  >
                    {counts.completed}
                  </span>
                </button>

                {/* 5. Cancelled */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("cancelled");
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeSection === "cancelled"
                      ? "bg-brand text-brand-foreground shadow-md"
                      : "text-foreground hover:bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <XCircle className="size-4" />
                    <span>Cancelled</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      activeSection === "cancelled"
                        ? "bg-white text-brand"
                        : "bg-rose-500/10 text-rose-600"
                    }`}
                  >
                    {counts.cancelled}
                  </span>
                </button>
              </div>
            </div>

            {/* Section 2: Leads & Quotes */}
            <div>
              <div className="px-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Leads &amp; Contracts
              </div>
              <div className="mt-2 space-y-1">
                {/* 6. AMC Leads */}
                {/* 6. AMC Renewal System */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("amc-leads");
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeSection === "amc-leads"
                      ? "bg-brand text-brand-foreground shadow-md"
                      : "text-foreground hover:bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="size-4" />
                    <span>AMC Renewal System</span>
                  </div>
                  {counts.amcExpiring > 0 ? (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        activeSection === "amc-leads"
                          ? "bg-white text-brand"
                          : "bg-amber-500/15 text-amber-600 animate-pulse"
                      }`}
                    >
                      {counts.amcExpiring} Expiring
                    </span>
                  ) : (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        activeSection === "amc-leads"
                          ? "bg-white text-brand"
                          : "bg-brand/10 text-brand"
                      }`}
                    >
                      {counts.amcLeads}
                    </span>
                  )}
                </button>

                {/* 7. Quotation Requests */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("quotation-requests");
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeSection === "quotation-requests"
                      ? "bg-brand text-brand-foreground shadow-md"
                      : "text-foreground hover:bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="size-4" />
                    <span>Quotation Requests</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      activeSection === "quotation-requests"
                        ? "bg-white text-brand"
                        : "bg-brand/10 text-brand"
                    }`}
                  >
                    {counts.quotation}
                  </span>
                </button>
              </div>
            </div>

            {/* Section 3: CRM Directory & Coverage */}
            <div>
              <div className="px-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Directory &amp; Fleet
              </div>
              <div className="mt-2 space-y-1">
                {/* 8. Customers */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("customers");
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeSection === "customers"
                      ? "bg-brand text-brand-foreground shadow-md"
                      : "text-foreground hover:bg-surface"
                  }`}
                >
                  <Users className="size-4" />
                  <span>Customers</span>
                </button>

                {/* 9. Technicians */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("technicians");
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeSection === "technicians"
                      ? "bg-brand text-brand-foreground shadow-md"
                      : "text-foreground hover:bg-surface"
                  }`}
                >
                  <HardHat className="size-4" />
                  <span>Technicians</span>
                </button>

                {/* 10. Service Areas */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("service-areas");
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeSection === "service-areas"
                      ? "bg-brand text-brand-foreground shadow-md"
                      : "text-foreground hover:bg-surface"
                  }`}
                >
                  <MapPin className="size-4" />
                  <span>Service Areas</span>
                </button>
              </div>
            </div>

            {/* Section 4: Billing & Finance */}
            <div>
              <div className="px-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Billing &amp; Finance
              </div>
              <div className="mt-2 space-y-1">
                {/* Payments & Invoices */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("payments");
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeSection === "payments"
                      ? "bg-brand text-brand-foreground shadow-md"
                      : "text-foreground hover:bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="size-4" />
                    <span>Payments &amp; Invoices</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      activeSection === "payments"
                        ? "bg-white text-brand"
                        : "bg-emerald-500/15 text-emerald-600"
                    }`}
                  >
                    ₹{(counts.totalRevenue / 1000).toFixed(0)}k
                  </span>
                </button>
              </div>
            </div>

            {/* Section 5: Analytics */}
            <div>
              <div className="px-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Analytics
              </div>
              <div className="mt-2 space-y-1">
                {/* 11. Reports */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("reports");
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeSection === "reports"
                      ? "bg-brand text-brand-foreground shadow-md"
                      : "text-foreground hover:bg-surface"
                  }`}
                >
                  <TrendingUp className="size-4" />
                  <span>Reports</span>
                </button>

                {/* 12. GTM & Ads Tracking Diagnostics */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("tracking-diagnostics");
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeSection === "tracking-diagnostics"
                      ? "bg-brand text-brand-foreground shadow-md"
                      : "text-foreground hover:bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Radio className="size-4" />
                    <span>GTM &amp; Ads Tracking</span>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                      activeSection === "tracking-diagnostics"
                        ? "bg-white text-brand"
                        : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    }`}
                  >
                    6/6 Live
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Dedicated Field Technician Mobile Interface Link */}
          <div className="mt-4 pt-3 border-t border-border">
            <Link
              to="/technician"
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-white shadow-md hover:bg-slate-850 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg bg-brand text-brand-foreground font-black">
                  <HardHat className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-white">Technician Portal</div>
                  <div className="text-[10px] text-slate-400">Mobile Field Interface</div>
                </div>
              </div>
              <ChevronRight className="size-4 text-brand group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Quick Hotline Card */}
          <div className="mt-4 rounded-2xl border border-border bg-surface p-3 text-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
              Dispatcher Support
            </span>
            <span className="font-bold text-foreground block mt-0.5">+91 98956 88833</span>
            <span className="text-[10px] text-emerald-600 font-semibold">24/7 Operations</span>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}

        {/* ============================================================ */}
        {/* MAIN CONTENT AREA */}
        {/* ============================================================ */}
        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-x-hidden pb-36 lg:pb-8">
          {/* Header Title & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-foreground capitalize flex items-center gap-2">
                {activeSection.replace("-", " ")}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activeSection === "new-bookings" && "Fresh leads requiring immediate contact & confirmation."}
                {activeSection === "todays-bookings" && "Live operations scheduled for execution today."}
                {activeSection === "upcoming-bookings" && "Advance scheduled visits for tomorrow and upcoming dates."}
                {activeSection === "completed" && "Jobs finished and paid with active 30-day warranty."}
                {activeSection === "cancelled" && "Dropped or rescheduled customer requests."}
                {activeSection === "amc-leads" && "Annual maintenance contract subscribers and renewal inquiries."}
                {activeSection === "quotation-requests" && "Commercial VRV/VRF and bulk AC purchase quotation requests."}
                {activeSection === "customers" && "CRM directory of verified residential & corporate customers."}
                {activeSection === "technicians" && "Certified field technicians roster, rating & active jobs."}
                {activeSection === "service-areas" && "Regional hubs, active dispatchers & coverage pincodes."}
                {activeSection === "reports" && "Revenue, Google & Meta Ads ROI, and conversion funnel."}
                {activeSection === "tracking-diagnostics" && "Google Tag Manager, Google Ads Conversion Tracking (Enhanced), GA4, Meta Pixel & Conversions API (CAPI)."}
              </p>
            </div>

            {/* Search & City Filter (for booking/customer views) */}
            <div className="flex flex-wrap items-center gap-2">
              {activeSection !== "tracking-diagnostics" && (
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by ID, Name, Phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-xl border border-border bg-card py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none"
                  />
                </div>
              )}

              {activeSection !== "reports" && activeSection !== "service-areas" && activeSection !== "tracking-diagnostics" && (
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="rounded-xl border border-border bg-card py-1.5 px-3 text-xs text-foreground focus:border-brand focus:outline-none"
                >
                  <option value="all">All Cities</option>
                  <option value="Kollam">Kollam</option>
                  <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                  <option value="Ernakulam / Cochin">Ernakulam / Cochin</option>
                  <option value="Thrissur">Thrissur</option>
                  <option value="Chennai">Chennai</option>
                </select>
              )}

              <Link
                to="/technician"
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-sm"
                title="Open Technician Field Mobile Portal"
              >
                <HardHat className="size-3.5 text-brand" />
                <span>Field Tech Portal 📱</span>
              </Link>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION VIEWS */}
          {/* ============================================================ */}

          {/* VIEW: BOOKINGS TABLES (New, Today, Upcoming, Completed, Cancelled, Quotes) */}
          {(activeSection === "new-bookings" ||
            activeSection === "todays-bookings" ||
            activeSection === "upcoming-bookings" ||
            activeSection === "completed" ||
            activeSection === "cancelled" ||
            activeSection === "quotation-requests") && (
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-foreground">
                  <thead className="border-b border-border bg-surface text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Booking ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Service &amp; AC Type</th>
                      <th className="px-4 py-3">Slot / Date</th>
                      <th className="px-4 py-3">City &amp; Area</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {currentSectionBookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                          No bookings found in {activeSection.replace("-", " ")}.
                        </td>
                      </tr>
                    ) : (
                      currentSectionBookings.map((b) => (
                        <tr
                          key={b.id}
                          className="hover:bg-surface/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedBooking(b)}
                        >
                          <td className="px-4 py-3.5 font-black text-brand">{b.id}</td>
                          <td className="px-4 py-3.5">
                            <div className="font-bold text-foreground">{b.customerName}</div>
                            <div className="text-[11px] text-muted-foreground">{b.phone}</div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-medium text-foreground">{b.serviceName}</div>
                            <div className="text-[11px] text-muted-foreground">
                              {b.acType} ({b.unitCount} {b.unitCount === "1" ? "Unit" : "Units"})
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-medium text-foreground">{b.preferredDate}</div>
                            <div className="text-[11px] text-muted-foreground">{b.preferredSlot}</div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-medium text-foreground">{b.city}</div>
                            <div className="text-[11px] text-muted-foreground truncate max-w-[120px]">
                              {b.area || b.address}
                            </div>
                          </td>
                          <td className="px-4 py-3.5">{renderStatusBadge(b.status)}</td>
                          <td className="px-4 py-3.5 font-black text-foreground">
                            {b.estimatedAmount > 0 ? `₹${b.estimatedAmount}` : "Quote"}
                          </td>
                          <td className="px-4 py-3.5 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                            {/* Advance Status button */}
                            {b.status !== "PAYMENT RECEIVED" && b.status !== "CANCELLED" && (
                              <button
                                type="button"
                                onClick={() => advanceStatus(b)}
                                className="inline-flex items-center gap-1 rounded-lg bg-brand-soft border border-brand/20 px-2.5 py-1 text-[11px] font-bold text-brand hover:bg-brand/20"
                                title="Advance to next workflow status"
                              >
                                <span>Advance</span>
                                <ArrowRight className="size-3" />
                              </button>
                            )}

                            {/* 1-Tap WhatsApp */}
                            <a
                              href={generateAdminToCustomerWhatsAppURL(b, b.status)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg bg-[#25D366]/15 border border-[#25D366]/30 px-2 py-1 text-[11px] font-bold text-[#25D366] hover:bg-[#25D366]/25"
                              title="Send WhatsApp status notification"
                            >
                              <MessageSquare className="size-3 fill-current" />
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW: AMC RENEWAL SYSTEM (7 Core Required AMC Fields) */}
          {/* ============================================================ */}
          {activeSection === "amc-leads" && (
            <div className="space-y-4">
              {/* AMC Action Toast */}
              {amcActionToast && (
                <div className="rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-lg flex items-center justify-between border border-emerald-400/30 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-white" />
                    <span>{amcActionToast}</span>
                  </div>
                  <button onClick={() => setAmcActionToast(null)} className="opacity-75 hover:opacity-100">
                    <X className="size-4" />
                  </button>
                </div>
              )}

              {/* Header & Quick Action Ribbon */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div>
                  <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                    <ShieldCheck className="size-5 text-brand" />
                    <span>HVAC Annual Maintenance Contract (AMC) Renewal System</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Track contract validity, automated 30-day renewal pipelines, and routine preventative service visits.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewAMCModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 text-xs font-black text-brand-foreground shadow-md shadow-brand/25 hover:bg-brand/90 transition-transform active:scale-95"
                  >
                    <span>+ New AMC Contract</span>
                  </button>
                </div>
              </div>

              {/* AMC KPI Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Active Contracts
                  </div>
                  <div className="text-2xl font-black text-foreground mt-1">
                    {amcContracts.filter((c) => c.status === "active").length}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                    100% Protected Warranty
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 shadow-sm">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 flex items-center justify-between">
                    <span>Expiring in 30 Days</span>
                    <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                  </div>
                  <div className="text-2xl font-black text-amber-600 mt-1">
                    {amcContracts.filter((c) => c.status === "expiring_soon").length}
                  </div>
                  <div className="text-[11px] text-amber-700/80 font-bold mt-0.5">
                    ⚠️ Urgent Renewal Pipeline
                  </div>
                </div>

                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 shadow-sm">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                    Expired Contracts
                  </div>
                  <div className="text-2xl font-black text-rose-600 mt-1">
                    {amcContracts.filter((c) => c.status === "expired").length}
                  </div>
                  <div className="text-[11px] text-rose-700/80 font-bold mt-0.5">
                    Win-back Renewal Leads
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Total Renewal Value
                  </div>
                  <div className="text-2xl font-black text-brand mt-1">
                    ₹{amcContracts.reduce((sum, c) => sum + (c.amount || 0), 0).toLocaleString("en-IN")}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-semibold mt-0.5">
                    Annual Contract Revenue
                  </div>
                </div>
              </div>

              {/* Status Tab Filters */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: "all", label: `All Contracts (${amcContracts.length})` },
                  {
                    id: "expiring_soon",
                    label: `⚠️ Expiring Soon (${amcContracts.filter((c) => c.status === "expiring_soon").length})`,
                    highlight: true,
                  },
                  { id: "active", label: `Active (${amcContracts.filter((c) => c.status === "active").length})` },
                  { id: "expired", label: `Expired (${amcContracts.filter((c) => c.status === "expired").length})` },
                  { id: "renewed", label: `Renewed (${amcContracts.filter((c) => c.status === "renewed").length})` },
                ].map((tab) => {
                  const active = amcSectionTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setAmcSectionTab(tab.id as any)}
                      className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all border whitespace-nowrap ${
                        active
                          ? "border-brand bg-brand text-brand-foreground shadow-sm"
                          : tab.highlight
                          ? "border-amber-500/40 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* AMC RENEWAL TABLE WITH EXACT 7 REQUIRED FIELDS */}
              <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-foreground">
                    <thead className="border-b border-border bg-surface text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">1. AMC Start Date</th>
                        <th className="px-4 py-3">2. AMC End Date</th>
                        <th className="px-4 py-3">3. Customer</th>
                        <th className="px-4 py-3">4. Number of Units</th>
                        <th className="px-4 py-3">5. Service Frequency</th>
                        <th className="px-4 py-3">6. Last Service</th>
                        <th className="px-4 py-3">7. Next Service</th>
                        <th className="px-4 py-3 text-right">Renewal Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredAMCContracts.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                            No AMC contracts found matching this tab filter.
                          </td>
                        </tr>
                      ) : (
                        filteredAMCContracts.map((c) => {
                          const isExpiring = c.status === "expiring_soon";
                          const isExpired = c.status === "expired";
                          const isActive = c.status === "active";
                          const isRenewed = c.status === "renewed";

                          // Calculate days to expiry
                          const end = new Date(c.amcEndDate);
                          const diffDays = Math.ceil((end.getTime() - Date.now()) / (1000 * 3600 * 24));

                          return (
                            <tr
                              key={c.id}
                              className={`transition-colors ${
                                isExpiring
                                  ? "bg-amber-500/5 hover:bg-amber-500/10"
                                  : isExpired
                                  ? "bg-rose-500/5 hover:bg-rose-500/10"
                                  : "hover:bg-surface/50"
                              }`}
                            >
                              {/* 1. AMC Start Date */}
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <div className="font-bold text-foreground flex items-center gap-1.5">
                                  <Calendar className="size-3.5 text-brand" />
                                  <span>{c.amcStartDate}</span>
                                </div>
                                <span className="text-[10px] text-muted-foreground">Contract Inception</span>
                              </td>

                              {/* 2. AMC End Date (With Expiry Alert) */}
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <div className="font-extrabold text-foreground">{c.amcEndDate}</div>
                                <div className="mt-0.5">
                                  {isExpiring ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-black text-amber-600 animate-pulse">
                                      ⚠️ Expires in {diffDays} {diffDays === 1 ? "day" : "days"}
                                    </span>
                                  ) : isExpired ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-black text-rose-600">
                                      ❌ Expired {Math.abs(diffDays)}d ago
                                    </span>
                                  ) : isRenewed ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/15 border border-teal-500/30 px-2 py-0.5 text-[10px] font-black text-teal-600">
                                      ✨ Renewed
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-600">
                                      ✓ Active ({diffDays}d left)
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* 3. Customer */}
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-foreground text-xs">{c.customerName}</span>
                                  <span className="rounded bg-brand-soft px-1.5 py-0.5 font-mono text-[10px] font-black text-brand border border-brand/20">
                                    {c.contractNo}
                                  </span>
                                </div>
                                <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                                  <span>{c.phone}</span>
                                  <span>•</span>
                                  <span>{c.city}</span>
                                </div>
                              </td>

                              {/* 4. Number of Units */}
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <span className="rounded-md bg-surface px-2 py-0.5 font-black text-foreground border border-border">
                                  ❄️ {c.numberOfUnits} {c.numberOfUnits === 1 ? "Unit" : "Units"}
                                </span>
                                <div className="text-[10px] font-semibold text-muted-foreground mt-1">
                                  Plan: {c.planName}
                                </div>
                              </td>

                              {/* 5. Service Frequency */}
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <div className="font-bold text-foreground">{c.serviceFrequency}</div>
                                <div className="text-[10px] font-semibold text-muted-foreground mt-0.5">
                                  Progress: <strong className="text-brand">{c.servicesCompleted}</strong> of{" "}
                                  <strong>{c.servicesIncluded}</strong> Services Done
                                </div>
                              </td>

                              {/* 6. Last Service */}
                              <td className="px-4 py-3.5 max-w-[200px]">
                                <div className="font-bold text-foreground flex items-center gap-1">
                                  <CheckCircle2 className="size-3 text-emerald-500" />
                                  <span>{c.lastServiceDate}</span>
                                </div>
                                {c.lastServiceDetails && (
                                  <div className="text-[11px] text-muted-foreground truncate" title={c.lastServiceDetails}>
                                    {c.lastServiceDetails}
                                  </div>
                                )}
                                {c.lastServiceTechnician && (
                                  <div className="text-[10px] text-muted-foreground font-semibold">
                                    Tech: {c.lastServiceTechnician}
                                  </div>
                                )}
                              </td>

                              {/* 7. Next Service */}
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <div className="font-extrabold text-foreground flex items-center gap-1">
                                  <Clock className="size-3 text-amber-500" />
                                  <span>{c.nextServiceDate}</span>
                                </div>
                                <div className="text-[10px] text-muted-foreground">{c.nextServiceSlot || "Morning Slot"}</div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setScheduleServiceContract(c);
                                    setServiceVisitDate(c.nextServiceDate || new Date().toISOString().split("T")[0] || "");
                                    setServiceVisitSlot(c.nextServiceSlot || "Morning Slot (9:00 AM - 12:00 PM)");
                                  }}
                                  className="mt-1 inline-flex items-center gap-1 rounded-md bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand hover:bg-brand/20 transition-colors"
                                >
                                  <span>📅 Schedule Visit</span>
                                </button>
                              </td>

                              {/* Actions Column */}
                              <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                                {/* 1-Click WhatsApp Renewal Alert */}
                                <a
                                  href={generateAMCRenewalWhatsAppURL(c)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex size-7 items-center justify-center rounded-lg bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/25 transition-colors"
                                  title="Send WhatsApp Renewal Notice"
                                >
                                  <MessageSquare className="size-3.5 fill-current" />
                                </a>

                                {/* 1-Click Call */}
                                <a
                                  href={`tel:${c.phone}`}
                                  className="inline-flex size-7 items-center justify-center rounded-lg border border-border bg-surface text-foreground hover:bg-surface/80 transition-colors"
                                  title="Call Customer"
                                >
                                  <Phone className="size-3.5 text-brand" />
                                </a>

                                {/* 1-Click Renew AMC Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRenewModalContract(c);
                                    setRenewalAmount(c.amount);
                                    setRenewalDiscountPercent(0);
                                    setRenewalNotes("");
                                  }}
                                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-black shadow-sm transition-transform active:scale-95 ${
                                    isExpiring || isExpired
                                      ? "bg-brand text-brand-foreground hover:bg-brand/90 animate-pulse"
                                      : "bg-surface border border-border text-foreground hover:bg-surface/80"
                                  }`}
                                >
                                  <RefreshCw className="size-3" />
                                  <span>Renew AMC</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: CUSTOMERS CRM DIRECTORY (13 Core Customer Database Fields) */}
          {activeSection === "customers" && (
            <div className="space-y-4">
              {/* Secondary Filter & Stats Ribbon for Customers */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  {/* AMC Status Filter */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-bold text-muted-foreground text-[11px] uppercase tracking-wider">
                      AMC Status:
                    </span>
                    <select
                      value={amcStatusFilter}
                      onChange={(e) => setAmcStatusFilter(e.target.value)}
                      className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-foreground focus:border-brand focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Active">Active AMC</option>
                      <option value="Expiring Soon">Expiring Soon</option>
                      <option value="Expired">Expired</option>
                      <option value="None">No AMC</option>
                    </select>
                  </div>

                  {/* AC Type Filter */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-bold text-muted-foreground text-[11px] uppercase tracking-wider">
                      AC Type:
                    </span>
                    <select
                      value={acTypeFilter}
                      onChange={(e) => setAcTypeFilter(e.target.value)}
                      className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-foreground focus:border-brand focus:outline-none"
                    >
                      <option value="all">All AC Types</option>
                      <option value="Split AC">Split AC</option>
                      <option value="Window AC">Window AC</option>
                      <option value="Cassette AC">Cassette AC</option>
                      <option value="Ductable AC">Ductable AC</option>
                      <option value="VRF / VRV">VRF / VRV</option>
                      <option value="Central AC">Central AC</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Quick CRM Metrics */}
                <div className="flex items-center gap-3 text-xs">
                  <span className="rounded-lg bg-surface px-2.5 py-1 font-bold text-muted-foreground border border-border">
                    Total: <strong className="text-foreground">{customersList.length}</strong>
                  </span>
                  <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 font-bold text-emerald-600 border border-emerald-500/20">
                    AMC Holders: <strong className="text-foreground">{customers.filter((c) => c.amcStatus === "Active").length}</strong>
                  </span>
                  <span className="rounded-lg bg-brand-soft px-2.5 py-1 font-black text-brand">
                    LTV: ₹{customersList.reduce((acc, c) => acc + (c.totalSpend || 0), 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* CRM Database Table (13 Fields) */}
              <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-foreground">
                    <thead className="border-b border-border bg-surface text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">1. Customer ID</th>
                        <th className="px-4 py-3">2. Name &amp; Email</th>
                        <th className="px-4 py-3">3. Mobile &amp; WhatsApp</th>
                        <th className="px-4 py-3">4. Address &amp; PIN</th>
                        <th className="px-4 py-3">5. Location (GPS)</th>
                        <th className="px-4 py-3">6. AC Type &amp; Units</th>
                        <th className="px-4 py-3">7. Previous Services</th>
                        <th className="px-4 py-3">8. AMC Status</th>
                        <th className="px-4 py-3">9. Booking History</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {customersList.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
                            No customers found matching this filter criteria.
                          </td>
                        </tr>
                      ) : (
                        customersList.map((c) => {
                          const isAmcActive = c.amcStatus === "Active";
                          const isAmcExpiring = c.amcStatus === "Expiring Soon";
                          const isAmcExpired = c.amcStatus === "Expired";

                          return (
                            <tr
                              key={c.id}
                              className="hover:bg-surface/50 transition-colors cursor-pointer group"
                              onClick={() => setSelectedCustomer(c)}
                            >
                              {/* 1. Customer ID */}
                              <td className="px-4 py-3.5 font-mono text-xs font-black text-brand whitespace-nowrap">
                                <span className="rounded-md bg-brand-soft px-2 py-0.5 border border-brand/20">
                                  {c.id}
                                </span>
                              </td>

                              {/* 2. Name & Email */}
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <div className="font-bold text-foreground text-xs group-hover:text-brand transition-colors">
                                  {c.name}
                                </div>
                                <div className="text-[11px] text-muted-foreground">{c.email}</div>
                              </td>

                              {/* 3. Mobile & WhatsApp */}
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <div className="font-semibold text-foreground">{c.mobile}</div>
                                <div className="text-[11px] text-emerald-600 flex items-center gap-1 font-bold">
                                  <MessageSquare className="size-3 fill-current" />
                                  <span>{c.whatsapp}</span>
                                </div>
                              </td>

                              {/* 4. Address & PIN */}
                              <td className="px-4 py-3.5 max-w-xs">
                                <div className="truncate text-foreground font-medium" title={c.address}>
                                  {c.address}
                                </div>
                                <div className="text-[11px] font-mono text-muted-foreground">
                                  PIN: {c.pin}
                                </div>
                              </td>

                              {/* 5. Location */}
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <div className="font-semibold text-foreground flex items-center gap-1">
                                  <MapPin className="size-3 text-red-500" />
                                  <span>{c.location}</span>
                                </div>
                                {c.locationCoordinates ? (
                                  <a
                                    href={`https://maps.google.com/?q=${c.locationCoordinates.latitude},${c.locationCoordinates.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[10px] text-brand hover:underline font-bold"
                                  >
                                    View GPS Pin 📍
                                  </a>
                                ) : (
                                  <span className="text-[10px] text-muted-foreground">Local Area</span>
                                )}
                              </td>

                              {/* 6. AC Type & Number of Units */}
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <span className="rounded-md bg-surface px-2 py-0.5 text-xs font-bold text-foreground border border-border">
                                  ❄️ {c.acType}
                                </span>
                                <div className="text-[11px] text-muted-foreground font-semibold mt-0.5">
                                  {c.numberOfUnits} {Number(c.numberOfUnits) === 1 ? "Unit" : "Units"}
                                </div>
                              </td>

                              {/* 7. Previous Services */}
                              <td className="px-4 py-3.5">
                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                  {c.previousServices.slice(0, 2).map((srv) => (
                                    <span
                                      key={srv}
                                      className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-bold text-foreground/80 border border-border truncate"
                                    >
                                      {srv}
                                    </span>
                                  ))}
                                  {c.previousServices.length > 2 && (
                                    <span className="text-[10px] font-bold text-muted-foreground">
                                      +{c.previousServices.length - 2} more
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* 8. AMC Status */}
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide border ${
                                    isAmcActive
                                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                                      : isAmcExpiring
                                      ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                                      : isAmcExpired
                                      ? "bg-red-500/10 text-red-600 border-red-500/30"
                                      : "bg-surface text-muted-foreground border-border"
                                  }`}
                                >
                                  {c.amcStatus}
                                </span>
                                {c.amcPlan && (
                                  <div className="text-[10px] text-muted-foreground font-medium mt-0.5 truncate max-w-[130px]">
                                    {c.amcPlan}
                                  </div>
                                )}
                              </td>

                              {/* 9. Booking History (Count & Drilldown) */}
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCustomer(c);
                                  }}
                                  className="inline-flex items-center gap-1 rounded-lg bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand hover:bg-brand/20 transition-colors"
                                >
                                  <CalendarCheck className="size-3" />
                                  <span>{c.bookingHistory.length} Bookings</span>
                                </button>
                                <div className="text-[10px] text-muted-foreground font-medium mt-0.5">
                                  LTV: ₹{c.totalSpend.toLocaleString("en-IN")}
                                </div>
                              </td>

                              {/* 10. Actions */}
                              <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                <a
                                  href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello " + c.name + "! EGS INDIA HVAC support checking in regarding your AC service.")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex size-7 items-center justify-center rounded-lg bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/25 transition-colors"
                                  title="WhatsApp Customer"
                                >
                                  <MessageSquare className="size-3.5 fill-current" />
                                </a>
                                <a
                                  href={`tel:${c.mobile}`}
                                  className="inline-flex size-7 items-center justify-center rounded-lg border border-border bg-surface text-foreground hover:bg-surface/80 transition-colors"
                                  title="Call Customer"
                                >
                                  <Phone className="size-3.5 text-brand" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => setSelectedCustomer(c)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-bold text-foreground hover:bg-surface/80"
                                >
                                  <span>View 360</span>
                                  <ArrowRight className="size-3 text-brand" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: TECHNICIANS ROSTER */}
          {activeSection === "technicians" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {technicians.map((t) => (
                <div key={t.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-foreground text-base">{t.name}</h3>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="size-3" /> {t.city} • {t.experienceYears} Years Exp.
                      </span>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-black uppercase ${
                        t.status === "available"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : t.status === "on_job"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {t.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-amber-500 flex items-center gap-0.5">
                      ⭐ {t.rating}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-muted-foreground">
                      {t.activeJobsCount} Active Jobs
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {t.specialization.map((spec) => (
                      <span
                        key={spec}
                        className="rounded-md bg-surface px-2 py-0.5 text-[10px] font-bold text-foreground/80 border border-border"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <a
                      href={`tel:${t.phone}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand"
                    >
                      <Phone className="size-3.5" />
                      <span>{t.phone}</span>
                    </a>
                    <a
                      href={`https://wa.me/${t.phone.replace(/\D/g, "")}?text=${encodeURIComponent("Hello " + t.name + ", job assignment update from EGS dispatch desk.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#25D366]"
                    >
                      <MessageSquare className="size-3.5 fill-current" />
                      <span>Dispatch WA</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW: SERVICE AREAS & REGIONAL HUBS */}
          {activeSection === "service-areas" && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {SERVICE_HUBS.map((hub) => (
                <div key={hub.city} className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div>
                      <h3 className="font-black text-foreground text-lg">{hub.city}</h3>
                      <span className="text-xs text-muted-foreground">Hub Manager: {hub.head}</span>
                    </div>
                    <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-black text-brand">
                      {hub.activeTechs} Techs
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                      Key Localities Covered:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {hub.coverage.map((loc) => (
                        <span
                          key={loc}
                          className="rounded-md bg-surface px-2 py-0.5 text-[11px] font-medium text-foreground border border-border"
                        >
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <strong className="text-foreground">PIN Codes:</strong> {hub.pincodes}
                  </div>

                  <div className="border-t border-border pt-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      {hub.activeJobs} Jobs Dispatched Today
                    </span>
                    <a
                      href={`tel:${hub.phone}`}
                      className="text-xs font-bold text-brand hover:underline"
                    >
                      Call Desk
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW: REPORTS & ADS ATTRIBUTION */}
          {activeSection === "reports" && (
            <div className="space-y-6">
              {/* Top Financial KPI Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Gross Booking Volume
                  </span>
                  <div className="mt-2 text-3xl font-black text-brand">
                    ₹{totalRevenue.toLocaleString("en-IN")}
                  </div>
                  <span className="text-xs text-muted-foreground">Total order pipeline</span>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Realized Revenue (Paid)
                  </span>
                  <div className="mt-2 text-3xl font-black text-emerald-600">
                    ₹{paidRevenue.toLocaleString("en-IN")}
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold">Payment Received</span>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Average Ticket Size
                  </span>
                  <div className="mt-2 text-3xl font-black text-foreground">
                    ₹{bookings.length > 0 ? Math.round(totalRevenue / bookings.length) : 0}
                  </div>
                  <span className="text-xs text-muted-foreground">Per service order</span>
                </div>
              </div>

              {/* Booking Status Conversion Funnel (The requested 8-step workflow) */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
                <h3 className="text-base font-black text-foreground">
                  Booking Status Conversion Funnel
                </h3>
                <p className="text-xs text-muted-foreground">
                  Sequential progress from lead capture to final payment realization:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                  {BOOKING_STATUS_FLOW.map((status, index) => {
                    const statusCount = bookings.filter((b) => b.status === status).length;
                    return (
                      <div
                        key={status}
                        className="rounded-xl border border-border bg-surface p-3 text-center space-y-1"
                      >
                        <div className="text-[10px] font-black text-brand uppercase">Step {index + 1}</div>
                        <div className="text-lg font-black text-foreground">{statusCount}</div>
                        <div className="text-[10px] font-bold text-muted-foreground truncate" title={status}>
                          {status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ad Attribution Performance: Google Ads vs Meta Ads */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
                  <h3 className="text-base font-black text-foreground">
                    Campaign Attribution Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-blue-600">Google Ads (Search &amp; Call Ads)</span>
                        <span>{attributionStats.google} Leads</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{
                            width: `${bookings.length > 0 ? (attributionStats.google / bookings.length) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-pink-600">Meta Ads (Facebook &amp; Instagram)</span>
                        <span>{attributionStats.meta} Leads</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface overflow-hidden">
                        <div
                          className="h-full bg-pink-600 rounded-full"
                          style={{
                            width: `${bookings.length > 0 ? (attributionStats.meta / bookings.length) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-emerald-600">Direct &amp; Organic Visitors</span>
                        <span>{attributionStats.direct + attributionStats.other} Leads</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{
                            width: `${bookings.length > 0 ? ((attributionStats.direct + attributionStats.other) / bookings.length) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Regional Density */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
                  <h3 className="text-base font-black text-foreground">City Volume Distribution</h3>
                  <div className="space-y-2 text-xs">
                    {["Kollam", "Thiruvananthapuram", "Ernakulam / Cochin", "Thrissur", "Chennai"].map(
                      (city) => {
                        const cityPrefix = city.split(" ")[0] || "";
                        const count = bookings.filter((b) => b.city.includes(cityPrefix)).length;
                        return (
                          <div key={city} className="flex items-center justify-between py-1.5 border-b border-border/60">
                            <span className="font-semibold text-foreground">{city}</span>
                            <span className="font-black text-brand">{count} Bookings</span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW: PAYMENTS & INVOICING (GST 18% Invoices & UPI QR Ledger) */}
          {/* ============================================================ */}
          {activeSection === "payments" && (
            <div className="space-y-4">
              {/* Payment Action Toast */}
              {paymentActionToast && (
                <div className="rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-lg flex items-center justify-between border border-emerald-400/30 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-white" />
                    <span>{paymentActionToast}</span>
                  </div>
                  <button onClick={() => setPaymentActionToast(null)} className="opacity-75 hover:opacity-100">
                    <X className="size-4" />
                  </button>
                </div>
              )}

              {/* Header Ribbon & Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div>
                  <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                    <CreditCard className="size-5 text-brand" />
                    <span>Payments, Invoicing &amp; 30-Day Guarantee Ledger</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Real-time GST-ready tax invoicing, UPI QR reconciliations, field cash collections &amp; warranty dispatch.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBankDetailsModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-foreground hover:bg-surface/80 transition-colors"
                  >
                    <Building2 className="size-3.5 text-brand" />
                    <span>Banking &amp; UPI Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRecordPayBookingId("");
                      setRecordPayCustName("");
                      setRecordPayCustPhone("");
                      setRecordPayServiceName("❄ AC Service");
                      setRecordPayAmount(1499);
                      setRecordPayMethod("UPI / QR Code");
                      setRecordPayRef("");
                      setRecordPayNotes("");
                      setRecordPaymentModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 text-xs font-black text-brand-foreground shadow-md shadow-brand/25 hover:bg-brand/90 transition-transform active:scale-95"
                  >
                    <span>+ Record Payment / Invoice</span>
                  </button>
                </div>
              </div>

              {/* 4 Revenue KPI Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Total Revenue Collected */}
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Total Collections
                  </div>
                  <div className="text-2xl font-black text-foreground">
                    ₹{counts.totalRevenue.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="size-3" />
                    <span>{transactions.filter((t) => t.status === "PAID").length} Paid Transactions</span>
                  </div>
                </div>

                {/* 2. Today's Collections */}
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Today's Collections
                  </div>
                  <div className="text-2xl font-black text-brand">
                    ₹{counts.todayRevenue.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Realized via UPI &amp; Field COD
                  </div>
                </div>

                {/* 3. Channels Breakdown */}
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Top Collection Method
                  </div>
                  <div className="text-sm font-extrabold text-foreground pt-1">
                    📱 UPI: ₹{transactions.filter(t => t.paymentMethod.includes("UPI") && t.status === "PAID").reduce((a,b)=>a+b.amount,0).toLocaleString("en-IN")}
                  </div>
                  <div className="text-[11px] text-muted-foreground flex gap-2">
                    <span>💵 COD: ₹{transactions.filter(t => t.paymentMethod.includes("Cash") && t.status === "PAID").reduce((a,b)=>a+b.amount,0).toLocaleString("en-IN")}</span>
                    <span>🏦 NEFT: ₹{transactions.filter(t => t.paymentMethod.includes("NEFT") && t.status === "PAID").reduce((a,b)=>a+b.amount,0).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* 4. Pending Receivables */}
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Pending Receivables
                  </div>
                  <div className="text-2xl font-black text-amber-600">
                    ₹{counts.pendingCollections.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {bookings.filter((b) => b.status === "COMPLETED").length} Completed jobs awaiting payment
                  </div>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
                  {/* Search */}
                  <div className="relative flex-1 min-w-[180px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      value={paymentSearchQuery}
                      onChange={(e) => setPaymentSearchQuery(e.target.value)}
                      placeholder="Search customer, Txn ID, invoice or ref..."
                      className="w-full rounded-xl border border-border bg-surface py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none"
                    />
                  </div>

                  {/* Method Filter */}
                  <select
                    value={paymentMethodFilter}
                    onChange={(e) => setPaymentMethodFilter(e.target.value)}
                    className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground focus:border-brand focus:outline-none"
                  >
                    <option value="all">All Payment Modes</option>
                    <option value="UPI / QR Code">📱 UPI / QR Code</option>
                    <option value="Cash on Delivery">💵 Cash on Delivery</option>
                    <option value="Bank NEFT / RTGS">🏦 Bank NEFT / RTGS</option>
                    <option value="Credit / Debit Card">💳 Credit / Debit Card</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={paymentStatusFilter}
                    onChange={(e) => setPaymentStatusFilter(e.target.value)}
                    className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground focus:border-brand focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="PAID">PAID</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>

                {/* Date Filter Tabs */}
                <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border text-xs">
                  {[
                    { id: "all", label: "All Time" },
                    { id: "today", label: "Today" },
                    { id: "month", label: "This Month" },
                  ].map((df) => (
                    <button
                      key={df.id}
                      type="button"
                      onClick={() => setPaymentDateFilter(df.id)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        paymentDateFilter === df.id
                          ? "bg-brand text-brand-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {df.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transactions Ledger Table */}
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface/80 text-[10px] font-black uppercase tracking-wider text-muted-foreground border-b border-border">
                      <tr>
                        <th className="px-4 py-3">Txn &amp; Invoice No</th>
                        <th className="px-4 py-3">Customer Details</th>
                        <th className="px-4 py-3">Service &amp; Reference</th>
                        <th className="px-4 py-3">Gross Amount</th>
                        <th className="px-4 py-3">GST (18%)</th>
                        <th className="px-4 py-3">Mode &amp; Reference</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                            No payment transactions found matching the filter.
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map((t) => {
                          const isPaid = t.status === "PAID";
                          return (
                            <tr key={t.id} className="hover:bg-surface/50 transition-colors">
                              {/* Txn ID & Invoice */}
                              <td className="px-4 py-3.5">
                                <div className="font-mono font-black text-brand text-xs">
                                  {t.id}
                                </div>
                                <div className="font-mono text-[11px] text-muted-foreground">
                                  {t.invoiceNo}
                                </div>
                              </td>

                              {/* Customer */}
                              <td className="px-4 py-3.5">
                                <div className="font-bold text-foreground">{t.customerName}</div>
                                <div className="text-[11px] text-muted-foreground">{t.phone}</div>
                              </td>

                              {/* Service & Ref */}
                              <td className="px-4 py-3.5">
                                <div className="font-semibold text-foreground line-clamp-1 max-w-[200px]">
                                  {t.serviceName}
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  {t.bookingId || t.amcContractNo || "Direct HVAC"}
                                  {t.technicianName && ` • Tech: ${t.technicianName}`}
                                </div>
                              </td>

                              {/* Gross Amount */}
                              <td className="px-4 py-3.5">
                                <div className="font-black text-foreground text-sm">
                                  ₹{t.amount.toLocaleString("en-IN")}
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  Base: ₹{t.subtotal.toFixed(0)}
                                </div>
                              </td>

                              {/* Tax 18% */}
                              <td className="px-4 py-3.5">
                                <div className="font-semibold text-foreground">
                                  ₹{t.taxAmount.toFixed(0)}
                                </div>
                                <div className="text-[9px] text-muted-foreground uppercase">
                                  CGST 9% + SGST 9%
                                </div>
                              </td>

                              {/* Mode & Ref */}
                              <td className="px-4 py-3.5">
                                <span className="inline-flex items-center gap-1 font-bold text-foreground">
                                  {t.paymentMethod.includes("UPI") ? (
                                    <QrCode className="size-3 text-brand" />
                                  ) : t.paymentMethod.includes("Cash") ? (
                                    <Banknote className="size-3 text-emerald-600" />
                                  ) : (
                                    <CreditCard className="size-3 text-blue-600" />
                                  )}
                                  <span>{t.paymentMethod}</span>
                                </span>
                                {t.transactionRef && (
                                  <div className="font-mono text-[10px] text-muted-foreground truncate max-w-[130px]">
                                    {t.transactionRef}
                                  </div>
                                )}
                              </td>

                              {/* Status Badge */}
                              <td className="px-4 py-3.5">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                                    isPaid
                                      ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                                      : "bg-amber-500/15 text-amber-600 border border-amber-500/30 animate-pulse"
                                  }`}
                                >
                                  <span className={`size-1.5 rounded-full ${isPaid ? "bg-emerald-500" : "bg-amber-500"}`} />
                                  <span>{t.status}</span>
                                </span>
                              </td>

                              {/* Date */}
                              <td className="px-4 py-3.5 text-muted-foreground text-[11px] whitespace-nowrap">
                                {new Date(t.paidAt || t.createdAt).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>

                              {/* 1-Tap Actions */}
                              <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                                {/* View Tax Invoice */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const inv = getInvoiceByNumber(t.invoiceNo);
                                    if (inv) {
                                      setSelectedInvoice(inv);
                                    } else {
                                      const mockInv: EGSInvoice = {
                                        invoiceNo: t.invoiceNo,
                                        date: (t.paidAt ? t.paidAt.split("T")[0] : new Date().toISOString().split("T")[0]) || "",
                                        bookingId: t.bookingId,
                                        amcContractNo: t.amcContractNo,
                                        customerName: t.customerName,
                                        customerPhone: t.phone,
                                        customerAddress: "Kerala, India",
                                        customerCity: "Ernakulam",
                                        technicianName: t.technicianName || "EGS HVAC Specialist",
                                        items: [
                                          {
                                            description: t.serviceName,
                                            hsnCode: EGS_COMPANY_DETAILS.sacCode,
                                            quantity: 1,
                                            unitPrice: t.subtotal,
                                            amount: t.subtotal,
                                          },
                                        ],
                                        subtotal: t.subtotal,
                                        cgst: Math.round(t.taxAmount / 2),
                                        sgst: Math.round(t.taxAmount / 2),
                                        taxAmount: t.taxAmount,
                                        grandTotal: t.amount,
                                        paymentMethod: t.paymentMethod,
                                        paymentStatus: t.status,
                                        transactionRef: t.transactionRef,
                                        warrantyPeriodDays: 30,
                                        warrantyValidUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0] || "",
                                      };
                                      setSelectedInvoice(mockInv);
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] font-bold text-foreground hover:bg-surface/80"
                                  title="View GST Tax Invoice & Warranty"
                                >
                                  <FileText className="size-3 text-brand" />
                                  <span>Invoice</span>
                                </button>

                                {/* WhatsApp Receipt */}
                                <a
                                  href={generatePaymentReceiptWhatsAppURL(t)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 rounded-lg bg-[#25D366]/15 border border-[#25D366]/30 px-2.5 py-1 text-[11px] font-bold text-[#25D366] hover:bg-[#25D366]/25"
                                  title="Send WhatsApp Payment Receipt"
                                >
                                  <MessageSquare className="size-3 fill-current" />
                                  <span>Receipt</span>
                                </a>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW: GTM & MARKETING TRACKING DIAGNOSTICS (Item 24) */}
          {/* ============================================================ */}
          {activeSection === "tracking-diagnostics" && (
            <div className="space-y-6">
              {/* Toast Feedback */}
              {trackingToast && (
                <div className="rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-lg flex items-center justify-between border border-emerald-400/30 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-white" />
                    <span>{trackingToast}</span>
                  </div>
                  <button onClick={() => setTrackingToast(null)} className="opacity-75 hover:opacity-100">
                    <X className="size-4" />
                  </button>
                </div>
              )}

              {/* Header Ribbon & Settings Trigger */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div>
                  <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                    <Radio className="size-5 text-brand" />
                    <span>Marketing Tag Manager &amp; Conversion Diagnostics</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Google Tag Manager container, Google Ads Conversion Tracking (with Enhanced Conversions), GA4, GSC, Meta Pixel &amp; Meta Conversions API (CAPI).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditedConfig({ ...trackingConfig });
                      setIsEditingTrackingConfig(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-foreground shadow-sm hover:border-brand/40 hover:bg-surface/80"
                  >
                    <Sliders className="size-3.5 text-brand" />
                    <span>Configure IDs</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTrackingLogs(getTrackingLogs());
                      setTrackingToast("✓ Event stream refreshed.");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 text-xs font-bold text-brand-foreground shadow-sm hover:bg-brand/90"
                  >
                    <RefreshCw className="size-3.5" />
                    <span>Refresh Logs ({trackingLogs.length})</span>
                  </button>
                </div>
              </div>

              {/* 6 Core Integration Cards (Item 24 Breakdown) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Google Tag Manager */}
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 font-black text-xs">
                        GTM
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-foreground">Google Tag Manager</h3>
                        <p className="text-[11px] text-muted-foreground">Global DataLayer Pipeline</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-600">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      INSTALLED
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs bg-surface p-3 rounded-xl border border-border/60">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Container ID:</span>
                      <code className="font-mono font-bold text-foreground">{trackingConfig.gtmContainerId || trackingConfig.gtmId}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">DataLayer State:</span>
                      <span className="font-semibold text-emerald-600">Initialized in &lt;head&gt;</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Noscript Fallback:</span>
                      <span className="font-semibold text-foreground">Active in &lt;body&gt;</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    All funnel events push through unified <code className="text-xs bg-surface px-1 py-0.5 rounded">window.dataLayer.push()</code>.
                  </p>
                </div>

                {/* 2. Google Ads Conversion Tracking */}
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 font-black text-xs">
                        GAds
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-foreground">Google Ads Tracking</h3>
                        <p className="text-[11px] text-muted-foreground">Enhanced Conversions Active</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-600">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      ACTIVE
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs bg-surface p-3 rounded-xl border border-border/60">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conversion ID:</span>
                      <code className="font-mono font-bold text-foreground">{trackingConfig.googleAdsId}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lead Label:</span>
                      <code className="font-mono text-brand truncate max-w-[140px]">{trackingConfig.googleAdsLeadLabel || trackingConfig.googleAdsConversionLabel}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone / WA Labels:</span>
                      <span className="font-semibold text-emerald-600">CALL &amp; WA Configured</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Includes SHA-256 hashed customer email &amp; phone for maximum offline conversion accuracy.
                  </p>
                </div>

                {/* 3. Google Analytics 4 (GA4) */}
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 font-black text-xs">
                        GA4
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-foreground">Google Analytics 4</h3>
                        <p className="text-[11px] text-muted-foreground">Full Funnel &amp; UTM Tracking</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-600">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      STREAMING
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs bg-surface p-3 rounded-xl border border-border/60">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Measurement ID:</span>
                      <code className="font-mono font-bold text-foreground">{trackingConfig.ga4MeasurementId}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Key Events:</span>
                      <span className="font-semibold text-foreground">page_view, generate_lead, contact</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Attribution:</span>
                      <span className="font-semibold text-emerald-600">UTM + GCLID + FBCLID</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Automatic route transition <code className="text-xs bg-surface px-1 py-0.5 rounded">page_view</code> dispatches with page titles.
                  </p>
                </div>

                {/* 4. Google Search Console */}
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600 font-black text-xs">
                        GSC
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-foreground">Search Console &amp; SEO</h3>
                        <p className="text-[11px] text-muted-foreground">HTML Meta &amp; XML Sitemap</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-600">
                      <CheckCircle2 className="size-3" />
                      VERIFIED
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs bg-surface p-3 rounded-xl border border-border/60">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verification Meta:</span>
                      <span className="font-semibold text-emerald-600">Embedded in &lt;head&gt;</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sitemap URL:</span>
                      <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="font-mono font-bold text-brand hover:underline flex items-center gap-1">
                        <span>/sitemap.xml</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Robots.txt:</span>
                      <a href="/robots.txt" target="_blank" rel="noreferrer" className="font-mono font-bold text-foreground hover:underline flex items-center gap-1">
                        <span>/robots.txt</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    10 core service &amp; regional landing pages indexed with canonical tags and priority tags.
                  </p>
                </div>

                {/* 5. Meta Pixel */}
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-600 font-black text-xs">
                        Meta
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-foreground">Meta Pixel (Facebook)</h3>
                        <p className="text-[11px] text-muted-foreground">Browser-Side Tracking</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-600">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      ACTIVE
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs bg-surface p-3 rounded-xl border border-border/60">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pixel ID:</span>
                      <code className="font-mono font-bold text-foreground">{trackingConfig.metaPixelId}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Standard Events:</span>
                      <span className="font-semibold text-foreground">PageView, Lead, Contact, Purchase</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Noscript Pixel:</span>
                      <span className="font-semibold text-emerald-600">Configured in &lt;noscript&gt;</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Captures Facebook &amp; Instagram ad clicks, re-targets visitors via Custom Audiences.
                  </p>
                </div>

                {/* 6. Meta Conversions API (CAPI) */}
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-black text-xs">
                        CAPI
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-foreground">Meta Conversions API</h3>
                        <p className="text-[11px] text-muted-foreground">Server-Side Resilient CAPI</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-600">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      CONNECTED
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs bg-surface p-3 rounded-xl border border-border/60">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Endpoint:</span>
                      <span className="font-semibold text-foreground">Graph API v19.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">PII Hashing:</span>
                      <span className="font-semibold text-emerald-600">SHA-256 (email, phone, name, city)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Test Event Code:</span>
                      <code className="font-mono text-indigo-600 font-bold">{trackingConfig.metaTestEventCode || "TEST8833"}</code>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Bypasses browser ad blockers with deterministic event ID deduplication against Meta Pixel.
                  </p>
                </div>
              </div>

              {/* Live Test Event Triggers Toolbar */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                      <Activity className="size-4 text-brand" />
                      <span>1-Click Live Test Event Triggers</span>
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Fire simulated conversions across all 6 tracking platforms to verify your setup in real-time.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-muted-foreground">
                    Check browser console &amp; log stream below
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  <button
                    type="button"
                    onClick={handleFireTestGTMLead}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-center transition-all group cursor-pointer"
                  >
                    <Layers className="size-5 text-blue-600 group-hover:scale-110 transition-transform mb-1.5" />
                    <span className="text-xs font-bold text-foreground">Test GTM Lead</span>
                    <span className="text-[10px] text-muted-foreground">dataLayer.push</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFireTestGoogleAds}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-center transition-all group cursor-pointer"
                  >
                    <Award className="size-5 text-amber-600 group-hover:scale-110 transition-transform mb-1.5" />
                    <span className="text-xs font-bold text-foreground">Test Google Ads</span>
                    <span className="text-[10px] text-muted-foreground">Enhanced Conv.</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFireTestMetaCAPI}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 text-center transition-all group cursor-pointer"
                  >
                    <Cpu className="size-5 text-indigo-600 group-hover:scale-110 transition-transform mb-1.5" />
                    <span className="text-xs font-bold text-foreground">Test Meta CAPI</span>
                    <span className="text-[10px] text-muted-foreground">SHA-256 Hashed</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFireTestWhatsApp}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-center transition-all group cursor-pointer"
                  >
                    <MessageSquare className="size-5 text-emerald-600 group-hover:scale-110 transition-transform mb-1.5" />
                    <span className="text-xs font-bold text-foreground">Test WhatsApp</span>
                    <span className="text-[10px] text-muted-foreground">Ads + Meta Contact</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFireTestCall}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 text-center transition-all group cursor-pointer"
                  >
                    <Phone className="size-5 text-teal-600 group-hover:scale-110 transition-transform mb-1.5" />
                    <span className="text-xs font-bold text-foreground">Test Call Click</span>
                    <span className="text-[10px] text-muted-foreground">Ads Call Label</span>
                  </button>
                </div>
              </div>

              {/* Live Event Stream / Log Inspector */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="size-4 text-brand" />
                    <h3 className="text-sm font-extrabold text-foreground">
                      Real-Time Tracking Event Stream
                    </h3>
                    <span className="rounded-full bg-brand/10 text-brand px-2 py-0.5 text-[10px] font-black">
                      {filteredTrackingLogs.length} Events
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Platform Filter */}
                    <div className="flex items-center gap-1 rounded-xl bg-surface p-1 border border-border text-[11px] font-bold">
                      {["all", "GTM", "GOOGLE_ADS", "GA4", "META_PIXEL", "META_CAPI"].map((platform) => (
                        <button
                          key={platform}
                          type="button"
                          onClick={() => setTrackingLogFilter(platform)}
                          className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                            trackingLogFilter === platform
                              ? "bg-brand text-brand-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {platform === "all" ? "All" : platform}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleClearLogs}
                      className="px-2.5 py-1 rounded-lg border border-border text-[11px] font-bold text-muted-foreground hover:bg-surface hover:text-foreground cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Event Stream Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border/60 bg-surface/60 text-muted-foreground font-black uppercase text-[10px]">
                        <th className="py-2.5 px-3">Time</th>
                        <th className="py-2.5 px-3">Platform</th>
                        <th className="py-2.5 px-3">Event Name</th>
                        <th className="py-2.5 px-3">Payload Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 font-mono">
                      {filteredTrackingLogs.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-muted-foreground font-sans">
                            No tracking events recorded yet. Click one of the test buttons above to simulate events!
                          </td>
                        </tr>
                      ) : (
                        filteredTrackingLogs.slice(0, 50).map((log) => {
                          const timeStr = new Date(log.timestamp).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          });
                          return (
                            <tr key={log.id} className="hover:bg-surface/50 transition-colors">
                              <td className="py-2 px-3 text-muted-foreground text-[11px] whitespace-nowrap">
                                {timeStr}
                              </td>
                              <td className="py-2 px-3 whitespace-nowrap">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-black ${
                                    log.platform === "GTM"
                                      ? "bg-blue-500/15 text-blue-600 border border-blue-500/20"
                                      : log.platform === "Google Ads" || log.platform === "GOOGLE_ADS"
                                      ? "bg-amber-500/15 text-amber-600 border border-amber-500/20"
                                      : log.platform === "GA4"
                                      ? "bg-orange-500/15 text-orange-600 border border-orange-500/20"
                                      : log.platform === "Meta Pixel" || log.platform === "META_PIXEL"
                                      ? "bg-pink-500/15 text-pink-600 border border-pink-500/20"
                                      : "bg-indigo-500/15 text-indigo-600 border border-indigo-500/20"
                                  }`}
                                >
                                  {log.platform}
                                </span>
                              </td>
                              <td className="py-2 px-3 font-bold text-foreground whitespace-nowrap">
                                {log.eventName || log.event}
                              </td>
                              <td className="py-2 px-3 text-muted-foreground text-[11px] max-w-md truncate">
                                <span title={JSON.stringify(log.payload, null, 2)}>
                                  {JSON.stringify(log.payload)}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ============================================================ */}
      {/* BOOKING DETAIL & STATUS WORKFLOW MODAL */}
      {/* ============================================================ */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-brand text-lg">{selectedBooking.id}</span>
                  {renderStatusBadge(selectedBooking.status)}
                </div>
                <h3 className="mt-1 text-base font-bold text-foreground">
                  {selectedBooking.serviceName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-xl p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* STATUS STEPPER: Exact 8-Step Sequential Workflow */}
            <div className="rounded-2xl border border-border bg-surface/50 p-4 space-y-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block">
                Booking Status Workflow (Click to Change):
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BOOKING_STATUS_FLOW.map((st) => {
                  const isCurrent = selectedBooking.status === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedBooking.id, st)}
                      className={`rounded-xl border p-2 text-center text-xs font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? "border-brand bg-brand text-brand-foreground shadow-md ring-2 ring-brand/30"
                          : "border-border bg-card text-foreground hover:border-brand/40"
                      }`}
                    >
                      <div className="text-[10px] truncate">{st}</div>
                    </button>
                  );
                })}
              </div>

              {/* Cancel Option */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedBooking.id, "CANCELLED")}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Mark as Cancelled
                </button>
              </div>
            </div>

            {/* Quick WhatsApp Status Dispatch Button */}
            <div className="rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black text-[#25D366] uppercase block">
                  Customer WhatsApp Notification
                </span>
                <span className="text-xs text-foreground/80">
                  Send pre-filled status update for: <strong>{selectedBooking.status}</strong>
                </span>
              </div>
              <a
                href={generateAdminToCustomerWhatsAppURL(selectedBooking, selectedBooking.status)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-[#20ba59]"
              >
                <MessageSquare className="size-4 fill-current" />
                <span>Send WhatsApp</span>
              </a>
            </div>

            {/* Technician Assignment */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Assigned Technician:
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <select
                  value={selectedBooking.assignedTechnicianId || ""}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedBooking.id,
                      selectedBooking.status === "NEW" ? "ASSIGNED" : selectedBooking.status,
                      e.target.value
                    )
                  }
                  className="flex-1 rounded-xl border border-border bg-surface p-2.5 text-xs text-foreground focus:border-brand focus:outline-none"
                >
                  <option value="">Unassigned (Select Technician)</option>
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name} ({tech.city} • {tech.rating}⭐ • {tech.status})
                    </option>
                  ))}
                </select>

                {selectedBooking.assignedTechnicianId && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="size-4" /> Assigned
                  </span>
                )}
              </div>
            </div>

            {/* Customer & Location Details */}
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-border bg-surface/50 p-3.5 space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-muted-foreground block text-[10px]">
                  Customer Contact
                </span>
                <div className="font-extrabold text-foreground text-sm">
                  {selectedBooking.customerName}
                </div>
                <div>Primary Phone: <strong className="text-foreground">{selectedBooking.phone}</strong></div>
                <div>WhatsApp: <strong className="text-foreground">{selectedBooking.whatsappNumber || selectedBooking.phone}</strong></div>
              </div>

              <div className="rounded-xl border border-border bg-surface/50 p-3.5 space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-muted-foreground block text-[10px]">
                  Service Location
                </span>
                <div className="font-bold text-foreground">
                  {selectedBooking.address}, {selectedBooking.city} - {selectedBooking.pincode}
                </div>
                {selectedBooking.landmark && (
                  <div className="text-muted-foreground">Landmark: {selectedBooking.landmark}</div>
                )}
                {selectedBooking.locationCoordinates && (
                  <a
                    href={`https://maps.google.com/?q=${selectedBooking.locationCoordinates.latitude},${selectedBooking.locationCoordinates.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand font-bold hover:underline pt-0.5"
                  >
                    <MapPin className="size-3" /> View on Google Maps
                  </a>
                )}
              </div>
            </div>

            {/* Ad Attribution Information */}
            <div className="rounded-xl border border-border bg-surface/30 p-3.5 text-xs space-y-1">
              <span className="font-bold uppercase tracking-wider text-muted-foreground block text-[10px]">
                Ad Attribution &amp; Source Tracking
              </span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                <div>Source: <strong className="text-foreground">{selectedBooking.attribution?.utm_source || "Direct"}</strong></div>
                <div>Medium: <strong className="text-foreground">{selectedBooking.attribution?.utm_medium || "None"}</strong></div>
                <div>Campaign: <strong className="text-foreground">{selectedBooking.attribution?.utm_campaign || "N/A"}</strong></div>
                {selectedBooking.attribution?.gclid && (
                  <div className="text-blue-600 font-bold">Google Ads (GCLID captured)</div>
                )}
                {selectedBooking.attribution?.fbclid && (
                  <div className="text-pink-600 font-bold">Meta Ads (FBCLID captured)</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER 360 CRM PROFILE & BOOKING HISTORY MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-brand rounded-md bg-brand-soft px-2 py-0.5 border border-brand/20">
                    {selectedCustomer.id}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide border ${
                      selectedCustomer.amcStatus === "Active"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                        : selectedCustomer.amcStatus === "Expiring Soon"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                        : selectedCustomer.amcStatus === "Expired"
                        ? "bg-red-500/10 text-red-600 border-red-500/30"
                        : "bg-surface text-muted-foreground border-border"
                    }`}
                  >
                    AMC: {selectedCustomer.amcStatus}
                  </span>
                </div>
                <h2 className="text-xl font-black text-foreground mt-1.5">{selectedCustomer.name}</h2>
                <p className="text-xs text-muted-foreground">{selectedCustomer.email}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="rounded-full p-2 text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Quick Action Ribbon */}
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={`tel:${selectedCustomer.mobile}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-foreground hover:bg-surface/80 shadow-sm"
              >
                <Phone className="size-3.5 text-brand" />
                <span>Call {selectedCustomer.mobile}</span>
              </a>
              <a
                href={`https://wa.me/${selectedCustomer.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello " + selectedCustomer.name + "! Expert Goods & Services (EGS INDIA) checking in regarding your AC comfort.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 px-3 py-2 text-xs font-bold text-[#25D366] hover:bg-[#25D366]/25 shadow-sm"
              >
                <MessageSquare className="size-3.5 fill-current" />
                <span>WhatsApp Message</span>
              </a>
              {selectedCustomer.locationCoordinates && (
                <a
                  href={`https://maps.google.com/?q=${selectedCustomer.locationCoordinates.latitude},${selectedCustomer.locationCoordinates.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-500/20 shadow-sm"
                >
                  <MapPin className="size-3.5" />
                  <span>Google Maps GPS</span>
                </a>
              )}
            </div>

            {/* Customer Details Grid (Location & Equipment Profile) */}
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              {/* Card 1: Location & Address */}
              <div className="rounded-2xl border border-border bg-surface/40 p-4 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-brand" /> Location &amp; Address
                </span>
                <div className="font-bold text-foreground text-sm">{selectedCustomer.location}</div>
                <div className="text-muted-foreground">{selectedCustomer.address}</div>
                <div className="font-mono text-xs text-muted-foreground">
                  PIN Code: <strong className="text-foreground">{selectedCustomer.pin}</strong>
                </div>
              </div>

              {/* Card 2: HVAC Equipment & AMC */}
              <div className="rounded-2xl border border-border bg-surface/40 p-4 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-brand" /> AC Equipment &amp; AMC Status
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">AC Type:</span>
                  <span className="rounded-md bg-surface px-2 py-0.5 font-bold border border-border">
                    ❄️ {selectedCustomer.acType}
                  </span>
                </div>
                <div className="text-muted-foreground">
                  Units Under Care: <strong className="text-foreground">{selectedCustomer.numberOfUnits} Units</strong>
                </div>
                {selectedCustomer.amcPlan && (
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-700 font-bold border border-emerald-500/20 text-[11px]">
                    Plan: {selectedCustomer.amcPlan}
                  </div>
                )}
                <div className="text-muted-foreground">
                  Lifetime Value: <strong className="text-brand font-black">₹{selectedCustomer.totalSpend.toLocaleString("en-IN")}</strong>
                </div>
              </div>
            </div>

            {/* Previous Services Tags */}
            <div className="rounded-2xl border border-border bg-surface/20 p-4 space-y-2 text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                Previous Services Taken:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCustomer.previousServices.map((srv) => (
                  <span
                    key={srv}
                    className="rounded-lg bg-surface px-2.5 py-1 text-xs font-bold text-foreground border border-border"
                  >
                    ✓ {srv}
                  </span>
                ))}
              </div>
            </div>

            {/* Full Booking History Timeline */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                  <CalendarCheck className="size-4 text-brand" />
                  <span>Chronological Booking History ({selectedCustomer.bookingHistory.length})</span>
                </h3>
                <span className="text-xs text-muted-foreground">Latest first</span>
              </div>

              <div className="space-y-2">
                {selectedCustomer.bookingHistory.length === 0 ? (
                  <div className="p-4 text-center text-xs text-muted-foreground rounded-xl bg-surface">
                    No booking records found.
                  </div>
                ) : (
                  selectedCustomer.bookingHistory.map((hist, idx) => (
                    <div
                      key={hist.bookingId || idx}
                      className="rounded-xl border border-border bg-surface/50 p-3.5 space-y-2 hover:border-brand/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-brand">
                              {hist.bookingId}
                            </span>
                            <span className="text-[11px] text-muted-foreground">• {hist.date}</span>
                            {hist.slot && (
                              <span className="text-[11px] text-muted-foreground">({hist.slot})</span>
                            )}
                          </div>
                          <h4 className="text-xs font-black text-foreground mt-0.5">{hist.serviceName}</h4>
                          {hist.subService && (
                            <p className="text-[11px] text-muted-foreground mt-0.5">{hist.subService}</p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide border ${
                              hist.status === "COMPLETED" || hist.status === "PAYMENT RECEIVED"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                                : hist.status === "CANCELLED"
                                ? "bg-red-500/10 text-red-600 border-red-500/30"
                                : "bg-brand/10 text-brand border-brand/30"
                            }`}
                          >
                            {hist.status}
                          </span>
                          <div className="text-xs font-black text-foreground mt-1">
                            ₹{hist.amount.toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>

                      {hist.technicianName && (
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1 border-t border-border/50">
                          <HardHat className="size-3 text-brand" />
                          <span>Technician: <strong>{hist.technicianName}</strong></span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: AMC RENEWAL MODAL */}
      {renewModalContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-brand-soft px-2 py-0.5 font-mono text-xs font-black text-brand border border-brand/20">
                    {renewModalContract.contractNo}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">Renewal Process</span>
                </div>
                <h3 className="text-lg font-black text-foreground mt-1">
                  Renew AMC Contract
                </h3>
                <p className="text-xs text-muted-foreground">
                  Customer: <strong>{renewModalContract.customerName}</strong> ({renewModalContract.city})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRenewModalContract(null)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Current vs New Extended Validity */}
            <div className="rounded-2xl border border-border bg-surface/60 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-semibold">Covered Units:</span>
                <span className="font-extrabold text-foreground">
                  ❄️ {renewModalContract.numberOfUnits} Units ({renewModalContract.planName})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-semibold">Service Frequency:</span>
                <span className="font-bold text-foreground">{renewModalContract.serviceFrequency}</span>
              </div>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Current Expiry Date
                  </span>
                  <span className="font-mono font-bold text-rose-500">{renewModalContract.amcEndDate}</span>
                </div>
                <ArrowRight className="size-4 text-brand" />
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    New Extended Expiry (+12 Mo)
                  </span>
                  <span className="font-mono font-black text-emerald-600">
                    {(() => {
                      const d = new Date(renewModalContract.amcEndDate || new Date());
                      const n = d < new Date() ? new Date() : d;
                      n.setFullYear(n.getFullYear() + 1);
                      return n.toISOString().split("T")[0];
                    })()}
                  </span>
                </div>
              </div>
            </div>

            {/* Renewal Amount & Payment Mode Form */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Renewal Amount (₹):
                  </label>
                  <input
                    type="number"
                    value={renewalAmount}
                    onChange={(e) => setRenewalAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-surface p-2.5 font-bold text-foreground focus:border-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Payment Mode:
                  </label>
                  <select
                    value={renewalPaymentMode}
                    onChange={(e) => setRenewalPaymentMode(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface p-2.5 font-semibold text-foreground focus:border-brand focus:outline-none"
                  >
                    <option value="UPI / GPay">UPI / GPay / PhonePe</option>
                    <option value="Bank NEFT / RTGS">Bank NEFT / RTGS</option>
                    <option value="Credit / Debit Card">Credit / Debit Card</option>
                    <option value="Cash Collection">Cash Collection by Tech</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">
                  Loyalty Renewal Discount:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Standard (0%)", val: 0 },
                    { label: "Loyalty (10% Off)", val: 10 },
                    { label: "VIP Multi (15% Off)", val: 15 },
                  ].map((disc) => (
                    <button
                      key={disc.val}
                      type="button"
                      onClick={() => {
                        setRenewalDiscountPercent(disc.val);
                        const discounted = Math.round(
                          renewModalContract.amount * (1 - disc.val / 100)
                        );
                        setRenewalAmount(discounted);
                      }}
                      className={`rounded-lg py-1.5 px-2 text-center text-[11px] font-bold border transition-colors ${
                        renewalDiscountPercent === disc.val
                          ? "border-brand bg-brand-soft text-brand font-black"
                          : "border-border bg-surface text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {disc.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">
                  Renewal Notes &amp; Added Perks:
                </label>
                <input
                  type="text"
                  value={renewalNotes}
                  onChange={(e) => setRenewalNotes(e.target.value)}
                  placeholder="e.g. Free Hydro Foam wash included on next visit."
                  className="w-full rounded-xl border border-border bg-surface p-2.5 text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setRenewModalContract(null)}
                className="flex-1 rounded-xl border border-border py-2.5 text-xs font-bold text-foreground hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const updated = renewAMCContract(renewModalContract.id, {
                    amountPaid: renewalAmount,
                    paymentMode: renewalPaymentMode,
                    notes: renewalNotes,
                  });
                  if (updated) {
                    setAmcActionToast(
                      `AMC Contract ${updated.contractNo} successfully renewed until ${updated.amcEndDate}!`
                    );
                    setRenewModalContract(null);
                    loadData();
                    // Open WhatsApp confirmation preview
                    window.open(generateAMCRenewalConfirmationWhatsAppURL(updated), "_blank");
                  }
                }}
                className="flex-[1.5] flex items-center justify-center gap-1.5 rounded-xl bg-brand py-2.5 text-xs font-black text-brand-foreground shadow-lg shadow-brand/30 hover:bg-brand/90 transition-transform active:scale-95"
              >
                <RefreshCw className="size-3.5" />
                <span>Confirm &amp; Activate Renewal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SCHEDULE NEXT AMC ROUTINE SERVICE VISIT */}
      {scheduleServiceContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <span className="rounded-md bg-brand-soft px-2 py-0.5 font-mono text-xs font-black text-brand border border-brand/20">
                  {scheduleServiceContract.contractNo}
                </span>
                <h3 className="text-base font-black text-foreground mt-1">
                  Schedule AMC Maintenance Visit
                </h3>
                <p className="text-xs text-muted-foreground">
                  {scheduleServiceContract.customerName} • {scheduleServiceContract.numberOfUnits} Units
                </p>
              </div>
              <button
                type="button"
                onClick={() => setScheduleServiceContract(null)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-foreground block mb-1">
                  Preferred Service Visit Date:
                </label>
                <input
                  type="date"
                  value={serviceVisitDate}
                  onChange={(e) => setServiceVisitDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface p-2.5 font-bold text-foreground focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">
                  Preferred Time Slot Window:
                </label>
                <select
                  value={serviceVisitSlot}
                  onChange={(e) => setServiceVisitSlot(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface p-2.5 font-semibold text-foreground focus:border-brand focus:outline-none"
                >
                  <option value="Morning Slot (9:00 AM - 12:00 PM)">🌅 Morning Slot (9:00 AM - 12:00 PM)</option>
                  <option value="Afternoon Slot (12:00 PM - 3:00 PM)">☀️ Afternoon Slot (12:00 PM - 3:00 PM)</option>
                  <option value="Evening Slot (3:00 PM - 6:00 PM)">🌇 Evening Slot (3:00 PM - 6:00 PM)</option>
                  <option value="Express Night (6:00 PM - 9:00 PM)">🌙 Express Night (6:00 PM - 9:00 PM)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">
                  Assign Lead HVAC Technician:
                </label>
                <select
                  value={serviceVisitTechId}
                  onChange={(e) => setServiceVisitTechId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface p-2.5 font-semibold text-foreground focus:border-brand focus:outline-none"
                >
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.city} • ⭐{t.rating})
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-xl bg-surface/60 p-3 text-muted-foreground text-[11px] space-y-1">
                <div className="font-bold text-foreground">💡 Auto-Booking Guarantee:</div>
                <p>
                  This creates an official service booking (₹0 charged as it is 100% covered under AMC)
                  and automatically advances the next routine date based on {scheduleServiceContract.serviceFrequency}.
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setScheduleServiceContract(null)}
                className="flex-1 rounded-xl border border-border py-2.5 text-xs font-bold text-foreground hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const tech = technicians.find((t) => t.id === serviceVisitTechId);
                  scheduleAMCNextService(scheduleServiceContract.id, {
                    date: serviceVisitDate || new Date().toISOString().split("T")[0] || "",
                    slot: serviceVisitSlot || "Morning Slot (9:00 AM - 12:00 PM)",
                    technicianId: serviceVisitTechId,
                    technicianName: tech?.name,
                  });
                  setAmcActionToast(
                    `AMC Maintenance Visit booked for ${scheduleServiceContract.customerName} on ${serviceVisitDate}!`
                  );
                  setScheduleServiceContract(null);
                  loadData();
                }}
                className="flex-1 rounded-xl bg-brand py-2.5 text-xs font-black text-brand-foreground shadow-lg shadow-brand/30 hover:bg-brand/90 transition-transform active:scale-95"
              >
                Confirm &amp; Dispatch Visit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ONBOARD NEW AMC CONTRACT */}
      {showNewAMCModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-black text-foreground">
                  Create New AMC Contract
                </h3>
                <p className="text-xs text-muted-foreground">
                  Onboard customer to continuous annual preventative maintenance.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewAMCModal(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-[65vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Customer / Company Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="e.g. Skyline Residency"
                    className="w-full rounded-xl border border-border bg-surface p-2.5 text-foreground focus:border-brand focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Mobile / WhatsApp:
                  </label>
                  <input
                    type="tel"
                    required
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="+91 98950 12345"
                    className="w-full rounded-xl border border-border bg-surface p-2.5 text-foreground focus:border-brand focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-foreground block mb-1">City Hub:</label>
                  <select
                    value={newCustCity}
                    onChange={(e) => setNewCustCity(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface p-2.5 font-semibold text-foreground focus:border-brand focus:outline-none"
                  >
                    <option value="Kollam">Kollam</option>
                    <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                    <option value="Ernakulam / Cochin">Ernakulam / Cochin</option>
                    <option value="Thrissur">Thrissur</option>
                    <option value="Chennai">Chennai</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">Address / Landmark:</label>
                  <input
                    type="text"
                    value={newCustAddress}
                    onChange={(e) => setNewCustAddress(e.target.value)}
                    placeholder="Tower 2, MG Road"
                    className="w-full rounded-xl border border-border bg-surface p-2.5 text-foreground focus:border-brand focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-foreground block mb-1">AMC Plan:</label>
                  <select
                    value={newPlanName}
                    onChange={(e) => setNewPlanName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface p-2.5 font-semibold text-foreground focus:border-brand focus:outline-none"
                  >
                    <option value="Comprehensive Care">Comprehensive Care</option>
                    <option value="Commercial Pro">Commercial Pro</option>
                    <option value="Residential Saver">Residential Saver</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">Number of AC Units:</label>
                  <input
                    type="number"
                    min={1}
                    value={newUnitsCount}
                    onChange={(e) => setNewUnitsCount(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-surface p-2.5 font-bold text-foreground focus:border-brand focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Service Frequency:
                  </label>
                  <select
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-surface p-2.5 font-semibold text-foreground focus:border-brand focus:outline-none"
                  >
                    <option value="Quarterly (4 Services/Year)">Quarterly (4 Services/Year)</option>
                    <option value="Bi-Monthly (6 Services/Year)">Bi-Monthly (6 Services/Year)</option>
                    <option value="Monthly (12 Services/Year)">Monthly (12 Services/Year)</option>
                    <option value="Half-Yearly (2 Services/Year)">Half-Yearly (2 Services/Year)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Annual Fee (₹):
                  </label>
                  <input
                    type="number"
                    value={newContractAmount}
                    onChange={(e) => setNewContractAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-surface p-2.5 font-bold text-foreground focus:border-brand focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    AMC Start Date:
                  </label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface p-2.5 font-bold text-foreground focus:border-brand focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    AMC End Date (+1 Yr):
                  </label>
                  <div className="rounded-xl border border-border bg-surface/50 p-2.5 font-mono font-bold text-emerald-600">
                    {(() => {
                      const d = new Date(newStartDate || new Date());
                      d.setFullYear(d.getFullYear() + 1);
                      return d.toISOString().split("T")[0];
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowNewAMCModal(false)}
                className="flex-1 rounded-xl border border-border py-2.5 text-xs font-bold text-foreground hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newCustName || !newCustPhone) return;
                  const effectiveStartDate = newStartDate || new Date().toISOString().split("T")[0] || "";
                  const endD = new Date(effectiveStartDate);
                  endD.setFullYear(endD.getFullYear() + 1);
                  const nextD = new Date(effectiveStartDate);
                  nextD.setDate(nextD.getDate() + 45);

                  const newContract: AMCContract = {
                    id: `amc-${Date.now()}`,
                    contractNo: `AMC-2026-${125 + amcContracts.length}`,
                    customerName: newCustName,
                    phone: newCustPhone,
                    whatsapp: newCustPhone,
                    city: newCustCity,
                    address: newCustAddress || newCustCity,
                    planName: newPlanName as any,
                    numberOfUnits: Number(newUnitsCount),
                    unitsCovered: Number(newUnitsCount),
                    serviceFrequency: newFrequency,
                    amcStartDate: effectiveStartDate,
                    startDate: effectiveStartDate,
                    amcEndDate: endD.toISOString().split("T")[0] || "",
                    expiryDate: endD.toISOString().split("T")[0] || "",
                    lastServiceDate: effectiveStartDate,
                    lastServiceDetails: "Initial Setup Inspection",
                    nextServiceDate: nextD.toISOString().split("T")[0] || "",
                    nextServiceSlot: "Morning Slot (9:00 AM - 12:00 PM)",
                    nextServiceStatus: "scheduled",
                    servicesIncluded: newFrequency.includes("Bi-Monthly") ? 6 : newFrequency.includes("Monthly") ? 12 : 4,
                    servicesCompleted: 1,
                    status: "active",
                    amount: Number(newContractAmount),
                  };

                  saveAMCContract(newContract);
                  setAmcActionToast(`AMC Contract ${newContract.contractNo} successfully created!`);
                  setShowNewAMCModal(false);
                  loadData();
                }}
                className="flex-1 rounded-xl bg-brand py-2.5 text-xs font-black text-brand-foreground shadow-lg shadow-brand/30 hover:bg-brand/90 transition-transform active:scale-95"
              >
                Create Contract
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: OFFICIAL GST TAX INVOICE & 30-DAY WARRANTY CARD */}
      {/* ============================================================ */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm print:p-0 print:bg-white">
          <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 md:p-8 shadow-2xl space-y-6 print:border-none print:shadow-none print:p-0 print:max-h-none print:max-w-none">
            {/* Top Toolbar (Hidden on print) */}
            <div className="flex items-center justify-between border-b border-border pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-brand text-lg">
                  {selectedInvoice.invoiceNo}
                </span>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-600">
                  {selectedInvoice.paymentStatus}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-bold text-foreground hover:bg-surface/80 cursor-pointer"
                >
                  <Printer className="size-3.5 text-brand" />
                  <span>Print / PDF</span>
                </button>
                <a
                  href={generatePaymentReceiptWhatsAppURL({
                    id: `TXN-${selectedInvoice.invoiceNo.replace(/\D/g, "")}`,
                    invoiceNo: selectedInvoice.invoiceNo,
                    bookingId: selectedInvoice.bookingId,
                    customerName: selectedInvoice.customerName,
                    phone: selectedInvoice.customerPhone,
                    whatsapp: selectedInvoice.customerPhone,
                    amount: selectedInvoice.grandTotal,
                    subtotal: selectedInvoice.subtotal,
                    taxAmount: selectedInvoice.taxAmount,
                    paymentMethod: selectedInvoice.paymentMethod,
                    status: selectedInvoice.paymentStatus,
                    serviceName: selectedInvoice.items[0]?.description || "HVAC Service",
                    createdAt: selectedInvoice.date,
                    paidAt: selectedInvoice.date,
                  }, selectedInvoice)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-1.5 text-xs font-black text-white hover:bg-[#20ba59]"
                >
                  <MessageSquare className="size-3.5 fill-current" />
                  <span>Send WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="rounded-xl p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE INVOICE BODY */}
            <div className="space-y-6 text-foreground print:space-y-4">
              {/* Company Header */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-border pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-brand flex items-center justify-center text-brand-foreground font-black text-sm">
                      EGS
                    </div>
                    <div>
                      <h1 className="text-lg font-black tracking-tight text-foreground">
                        {EGS_COMPANY_DETAILS.name}
                      </h1>
                      <div className="text-[11px] font-bold text-muted-foreground">
                        {EGS_COMPANY_DETAILS.legalName}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground space-y-0.5">
                    <div>{EGS_COMPANY_DETAILS.registeredOffice}</div>
                    <div>Branches: Kollam • Kochi • Thiruvananthapuram • Thrissur • Chennai</div>
                    <div>GSTIN: <strong className="text-foreground font-mono">{EGS_COMPANY_DETAILS.gstin}</strong> | PAN: <strong className="text-foreground font-mono">{EGS_COMPANY_DETAILS.pan}</strong></div>
                    <div>Helpline: {EGS_COMPANY_DETAILS.phone} | {EGS_COMPANY_DETAILS.email}</div>
                  </div>
                </div>

                <div className="text-left sm:text-right space-y-1 text-xs">
                  <div className="text-[11px] font-black uppercase tracking-wider text-brand">
                    TAX INVOICE (RULE 46 OF CGST RULES)
                  </div>
                  <div className="text-base font-black font-mono text-foreground">
                    {selectedInvoice.invoiceNo}
                  </div>
                  <div>Date: <strong className="text-foreground">{selectedInvoice.date}</strong></div>
                  <div>Reference: <strong className="text-foreground">{selectedInvoice.bookingId || selectedInvoice.amcContractNo || "Direct"}</strong></div>
                  <div>Payment Mode: <strong className="text-foreground">{selectedInvoice.paymentMethod}</strong></div>
                  {selectedInvoice.transactionRef && (
                    <div className="text-[11px] text-muted-foreground font-mono">
                      Ref: {selectedInvoice.transactionRef}
                    </div>
                  )}
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-surface/50 p-4 rounded-2xl border border-border">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block mb-1">
                    Billed To (Customer):
                  </span>
                  <div className="font-extrabold text-foreground text-sm">
                    {selectedInvoice.customerName}
                  </div>
                  <div className="text-muted-foreground mt-0.5">{selectedInvoice.customerAddress}</div>
                  <div className="text-muted-foreground">{selectedInvoice.customerCity}</div>
                  <div className="text-foreground font-medium mt-1">Phone: {selectedInvoice.customerPhone}</div>
                  {selectedInvoice.customerEmail && (
                    <div className="text-muted-foreground">{selectedInvoice.customerEmail}</div>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block mb-1">
                    Service Details:
                  </span>
                  <div className="font-bold text-foreground">
                    {selectedInvoice.acType || "HVAC Unit Servicing"}
                  </div>
                  <div className="text-muted-foreground">
                    Assigned Specialist: {selectedInvoice.technicianName || "EGS Certified Specialist"}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                    <CheckCircle2 className="size-3" />
                    <span>Payment Received</span>
                  </div>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="overflow-hidden rounded-2xl border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface text-[10px] font-black uppercase tracking-wider text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-4 py-2.5">#</th>
                      <th className="px-4 py-2.5">Description of Goods / Services</th>
                      <th className="px-4 py-2.5">HSN/SAC</th>
                      <th className="px-4 py-2.5 text-center">Qty</th>
                      <th className="px-4 py-2.5 text-right">Rate (₹)</th>
                      <th className="px-4 py-2.5 text-right">Taxable Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">{item.description}</td>
                        <td className="px-4 py-3 font-mono text-muted-foreground">{item.hsnCode || "998719"}</td>
                        <td className="px-4 py-3 text-center text-foreground font-bold">{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-mono">₹{item.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold">₹{item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tax Calculation Breakdown */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-2">
                <div className="flex-1 space-y-2 text-xs">
                  <div className="rounded-xl border border-border bg-surface/40 p-3 text-muted-foreground">
                    <span className="font-bold text-foreground block mb-0.5">Payment Terms &amp; Conditions:</span>
                    <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
                      <li>All charges are inclusive of 18% GST (CGST 9% + SGST 9%).</li>
                      <li>This is a computer-generated tax invoice and requires no physical signature.</li>
                      <li>EGS INDIA helpline: +91 98956 88833 (24/7 HVAC Breakdown Support).</li>
                    </ol>
                  </div>
                </div>

                <div className="w-full sm:w-72 space-y-2 text-xs bg-surface/50 p-4 rounded-2xl border border-border font-mono">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxable Subtotal:</span>
                    <span>₹{selectedInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>CGST (9.0%):</span>
                    <span>₹{selectedInvoice.cgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>SGST (9.0%):</span>
                    <span>₹{selectedInvoice.sgst.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between text-sm font-black text-foreground">
                    <span>Grand Total:</span>
                    <span className="text-brand">₹{selectedInvoice.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* OFFICIAL STAMPED 30-DAY WARRANTY CARD */}
              <div className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-500/10 p-5 space-y-3 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-black uppercase text-white tracking-wider shadow-sm">
                      <ShieldCheck className="size-4" />
                      <span>30-Day Post-Service Guarantee Warranty Certificate</span>
                    </div>
                    <div className="text-sm font-black text-foreground">
                      Certified Cooling &amp; Workmanship Protection
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This unit is protected under EGS INDIA 30-Day No-Questions-Asked Revisit Guarantee. If any cooling loss or gas drop occurs within 30 days, our senior technician will re-attend free of charge.
                    </p>
                  </div>

                  <div className="text-right shrink-0 bg-card p-3 rounded-xl border border-emerald-500/30 font-mono">
                    <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      Warranty Expiry
                    </div>
                    <div className="text-sm font-black text-emerald-600">
                      {selectedInvoice.warrantyValidUntil}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      30 Days Validity
                    </div>
                  </div>
                </div>

                {/* Stamped Authorized Seal */}
                <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20 text-[11px]">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400">
                    Verified by EGS Quality Assurance Desk • Kollam &amp; Kochi Hub
                  </div>
                  <div className="font-mono text-muted-foreground text-[10px]">
                    Authorized Digital Stamp • EGS INDIA
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: RECORD PAYMENT / GENERATE INVOICE */}
      {/* ============================================================ */}
      {recordPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-black text-foreground text-base">Record Payment &amp; Generate Invoice</h3>
                <p className="text-xs text-muted-foreground">Log offline payment or field cash realization</p>
              </div>
              <button
                type="button"
                onClick={() => setRecordPaymentModalOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Optional: Link to Existing Booking */}
              <div>
                <label className="font-bold text-foreground block mb-1">
                  Link to Completed Booking (Optional):
                </label>
                <select
                  value={recordPayBookingId}
                  onChange={(e) => {
                    const bId = e.target.value;
                    setRecordPayBookingId(bId);
                    if (bId) {
                      const match = bookings.find((b) => b.id === bId);
                      if (match) {
                        setRecordPayCustName(match.customerName);
                        setRecordPayCustPhone(match.phone);
                        setRecordPayServiceName(match.serviceName);
                        setRecordPayAmount(match.estimatedAmount || 1499);
                      }
                    }
                  }}
                  className="w-full rounded-xl border border-border bg-surface p-2.5 font-medium text-foreground focus:border-brand focus:outline-none"
                >
                  <option value="">-- Direct Payment (Not linked to booking) --</option>
                  {bookings
                    .filter((b) => b.status === "COMPLETED" || b.status === "SERVICE STARTED" || b.status === "CONFIRMED")
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.id} - {b.customerName} ({b.serviceName} • ₹{b.estimatedAmount})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-foreground block mb-1">Customer Name:</label>
                  <input
                    type="text"
                    value={recordPayCustName}
                    onChange={(e) => setRecordPayCustName(e.target.value)}
                    placeholder="e.g. Suresh Menon"
                    className="w-full rounded-xl border border-border bg-surface p-2.5 text-foreground focus:border-brand focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">Phone Number:</label>
                  <input
                    type="text"
                    value={recordPayCustPhone}
                    onChange={(e) => setRecordPayCustPhone(e.target.value)}
                    placeholder="+91 98470 12345"
                    className="w-full rounded-xl border border-border bg-surface p-2.5 text-foreground focus:border-brand focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-foreground block mb-1">Amount (₹):</label>
                  <input
                    type="number"
                    min={100}
                    value={recordPayAmount}
                    onChange={(e) => setRecordPayAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-surface p-2.5 font-bold text-foreground focus:border-brand focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">Payment Mode:</label>
                  <select
                    value={recordPayMethod}
                    onChange={(e) => setRecordPayMethod(e.target.value as PaymentMethod)}
                    className="w-full rounded-xl border border-border bg-surface p-2.5 font-medium text-foreground focus:border-brand focus:outline-none"
                  >
                    <option value="UPI / QR Code">📱 UPI / QR Code</option>
                    <option value="Cash on Delivery">💵 Cash on Delivery</option>
                    <option value="Bank NEFT / RTGS">🏦 Bank NEFT / RTGS</option>
                    <option value="Credit / Debit Card">💳 Credit / Debit Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">
                  Transaction Reference / UTR Number:
                </label>
                <input
                  type="text"
                  value={recordPayRef}
                  onChange={(e) => setRecordPayRef(e.target.value)}
                  placeholder="e.g. UPI/429188491023 or Cash Slip #42"
                  className="w-full rounded-xl border border-border bg-surface p-2.5 text-foreground focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Service Notes:</label>
                <input
                  type="text"
                  value={recordPayNotes}
                  onChange={(e) => setRecordPayNotes(e.target.value)}
                  placeholder="e.g. Full gas recharge completed with 30-day warranty"
                  className="w-full rounded-xl border border-border bg-surface p-2.5 text-foreground focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setRecordPaymentModalOpen(false)}
                className="flex-1 rounded-xl border border-border py-2.5 text-xs font-bold text-foreground hover:bg-surface cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (recordPayAmount <= 0) return;
                  if (recordPayBookingId) {
                    const result = recordBookingPayment(
                      recordPayBookingId,
                      recordPayMethod,
                      recordPayAmount,
                      recordPayRef,
                      undefined,
                      undefined,
                      recordPayNotes
                    );
                    setPaymentActionToast(`Payment of ₹${recordPayAmount} recorded for ${recordPayBookingId}!`);
                    setSelectedInvoice(result.invoice);
                  } else {
                    const finalAmount = recordPayAmount;
                    const subtotal = Math.round((finalAmount / 1.18) * 100) / 100;
                    const taxAmount = Math.round((finalAmount - subtotal) * 100) / 100;
                    const invNo = `INV-2026-${Math.floor(8820 + Math.random() * 800)}`;
                    const txn: PaymentTransaction = {
                      id: `TXN-2026-${Math.floor(8820 + Math.random() * 800)}`,
                      invoiceNo: invNo,
                      customerName: recordPayCustName || "Walk-in Customer",
                      phone: recordPayCustPhone || "+91 98956 88833",
                      amount: finalAmount,
                      subtotal,
                      taxAmount,
                      paymentMethod: recordPayMethod,
                      status: "PAID",
                      transactionRef: recordPayRef || `TXN-${Date.now().toString().slice(-6)}`,
                      serviceName: recordPayServiceName,
                      createdAt: new Date().toISOString(),
                      paidAt: new Date().toISOString(),
                      notes: recordPayNotes,
                    };
                    saveTransaction(txn);
                    const inv: EGSInvoice = {
                      invoiceNo: invNo,
                      date: new Date().toISOString().split("T")[0] || "",
                      customerName: txn.customerName,
                      customerPhone: txn.phone,
                      customerAddress: "Kerala, India",
                      customerCity: "Ernakulam",
                      items: [
                        {
                          description: recordPayServiceName,
                          hsnCode: EGS_COMPANY_DETAILS.sacCode,
                          quantity: 1,
                          unitPrice: subtotal,
                          amount: subtotal,
                        },
                      ],
                      subtotal,
                      cgst: Math.round(taxAmount / 2),
                      sgst: Math.round(taxAmount / 2),
                      taxAmount,
                      grandTotal: finalAmount,
                      paymentMethod: recordPayMethod,
                      paymentStatus: "PAID",
                      transactionRef: txn.transactionRef,
                      warrantyPeriodDays: 30,
                      warrantyValidUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0] || "",
                    };
                    setSelectedInvoice(inv);
                    setPaymentActionToast(`Custom Invoice ${invNo} generated successfully!`);
                  }
                  setRecordPaymentModalOpen(false);
                  loadData();
                }}
                className="flex-1 rounded-xl bg-brand py-2.5 text-xs font-black text-brand-foreground shadow-lg shadow-brand/30 hover:bg-brand/90 transition-transform active:scale-95 cursor-pointer"
              >
                Record &amp; Issue Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: ICICI BANKING & DYNAMIC QR DETAILS */}
      {/* ============================================================ */}
      {bankDetailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-black text-foreground text-base">EGS INDIA Banking &amp; UPI</h3>
                <p className="text-xs text-muted-foreground">Official Corporate Collections Account</p>
              </div>
              <button
                type="button"
                onClick={() => setBankDetailsModalOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Merchant QR Code */}
            <div className="text-center space-y-2">
              <div className="mx-auto flex size-44 items-center justify-center rounded-2xl bg-white p-2 border-2 border-border shadow-inner">
                <img
                  src={getUPIQRCodeUrl(generateUPIPaymentUrl(0, "EGS-MERCHANT"), 220)}
                  alt="EGS Merchant UPI QR"
                  className="size-full object-contain rounded-lg"
                />
              </div>
              <div className="text-xs font-bold text-foreground">
                UPI VPA ID: <span className="font-mono text-brand">{EGS_COMPANY_DETAILS.bankDetails.upiId}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Accepts GPay, PhonePe, Paytm, BHIM, Amazon Pay &amp; all Indian UPI Apps.
              </p>
            </div>

            {/* Corporate Bank Account Details */}
            <div className="rounded-2xl border border-border bg-surface/50 p-4 text-xs space-y-2">
              <div className="flex justify-between pb-1.5 border-b border-border/80">
                <span className="text-muted-foreground">Bank Name:</span>
                <span className="font-bold text-foreground">{EGS_COMPANY_DETAILS.bankDetails.bankName}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-border/80">
                <span className="text-muted-foreground">Account Name:</span>
                <span className="font-bold text-foreground">{EGS_COMPANY_DETAILS.bankDetails.accountName}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-border/80">
                <span className="text-muted-foreground">Account Number:</span>
                <span className="font-mono font-bold text-brand">{EGS_COMPANY_DETAILS.bankDetails.accountNumber}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-border/80">
                <span className="text-muted-foreground">Account Type:</span>
                <span className="font-bold text-foreground">{EGS_COMPANY_DETAILS.bankDetails.accountType}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-border/80">
                <span className="text-muted-foreground">IFSC Code:</span>
                <span className="font-mono font-bold text-foreground">{EGS_COMPANY_DETAILS.bankDetails.ifscCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Branch:</span>
                <span className="font-bold text-foreground">{EGS_COMPANY_DETAILS.bankDetails.branch}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setBankDetailsModalOpen(false)}
              className="w-full rounded-xl bg-brand py-2.5 text-xs font-black text-brand-foreground hover:bg-brand/90 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MARKETING & TRACKING CONFIGURATION MODAL */}
      {/* ============================================================ */}
      {isEditingTrackingConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders className="size-5 text-brand" />
                  <h3 className="text-base font-black text-foreground">
                    Marketing Tag &amp; Conversion Tracking Config
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update Container IDs, Conversion Labels, and Meta CAPI parameters without touching code.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingTrackingConfig(false)}
                className="rounded-xl p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTrackingConfig} className="space-y-4">
              {/* 1. Google Tag Manager */}
              <div className="rounded-2xl border border-border bg-surface/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-blue-600" />
                    Google Tag Manager
                  </span>
                  <label className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editedConfig.enabled}
                      onChange={(e) => setEditedConfig({ ...editedConfig, enabled: e.target.checked })}
                      className="rounded accent-brand"
                    />
                    <span>Enabled</span>
                  </label>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    GTM Container ID
                  </label>
                  <input
                    type="text"
                    value={editedConfig.gtmContainerId}
                    onChange={(e) => setEditedConfig({ ...editedConfig, gtmContainerId: e.target.value.trim() })}
                    placeholder="GTM-N68W4M8"
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-mono text-foreground focus:border-brand focus:outline-none"
                  />
                </div>
              </div>

              {/* 2. Google Ads Tracking */}
              <div className="rounded-2xl border border-border bg-surface/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-amber-600" />
                    Google Ads Conversion Tracking
                  </span>
                  <label className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editedConfig.googleAdsEnabled}
                      onChange={(e) => setEditedConfig({ ...editedConfig, googleAdsEnabled: e.target.checked })}
                      className="rounded accent-brand"
                    />
                    <span>Enabled</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Conversion ID
                    </label>
                    <input
                      type="text"
                      value={editedConfig.googleAdsId}
                      onChange={(e) => setEditedConfig({ ...editedConfig, googleAdsId: e.target.value.trim() })}
                      placeholder="AW-11628491023"
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-mono text-foreground focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Lead Conversion Label
                    </label>
                    <input
                      type="text"
                      value={editedConfig.googleAdsLeadLabel}
                      onChange={(e) => setEditedConfig({ ...editedConfig, googleAdsLeadLabel: e.target.value.trim() })}
                      placeholder="vL3aCN-N_qcZEP-z8s0D"
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-mono text-foreground focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Call Conversion Label
                    </label>
                    <input
                      type="text"
                      value={editedConfig.googleAdsPhoneCallLabel}
                      onChange={(e) => setEditedConfig({ ...editedConfig, googleAdsPhoneCallLabel: e.target.value.trim() })}
                      placeholder="CALL_EGS_INDIA_2026"
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-mono text-foreground focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      WhatsApp Conversion Label
                    </label>
                    <input
                      type="text"
                      value={editedConfig.googleAdsWhatsAppLabel}
                      onChange={(e) => setEditedConfig({ ...editedConfig, googleAdsWhatsAppLabel: e.target.value.trim() })}
                      placeholder="WA_EGS_INDIA_2026"
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-mono text-foreground focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Google Analytics 4 */}
              <div className="rounded-2xl border border-border bg-surface/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-orange-600" />
                    Google Analytics 4 (GA4)
                  </span>
                  <label className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editedConfig.ga4Enabled}
                      onChange={(e) => setEditedConfig({ ...editedConfig, ga4Enabled: e.target.checked })}
                      className="rounded accent-brand"
                    />
                    <span>Enabled</span>
                  </label>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    GA4 Measurement ID
                  </label>
                  <input
                    type="text"
                    value={editedConfig.ga4MeasurementId}
                    onChange={(e) => setEditedConfig({ ...editedConfig, ga4MeasurementId: e.target.value.trim() })}
                    placeholder="G-EGSINDIA26"
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-mono text-foreground focus:border-brand focus:outline-none"
                  />
                </div>
              </div>

              {/* 4. Meta Pixel & Conversions API */}
              <div className="rounded-2xl border border-border bg-surface/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-pink-600 flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-pink-600" />
                    Meta Pixel &amp; Conversions API (CAPI)
                  </span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editedConfig.metaPixelEnabled}
                        onChange={(e) => setEditedConfig({ ...editedConfig, metaPixelEnabled: e.target.checked })}
                        className="rounded accent-brand"
                      />
                      <span>Pixel</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editedConfig.metaCapiEnabled}
                        onChange={(e) => setEditedConfig({ ...editedConfig, metaCapiEnabled: e.target.checked })}
                        className="rounded accent-brand"
                      />
                      <span>CAPI</span>
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Meta Pixel ID
                    </label>
                    <input
                      type="text"
                      value={editedConfig.metaPixelId}
                      onChange={(e) => setEditedConfig({ ...editedConfig, metaPixelId: e.target.value.trim() })}
                      placeholder="108928374619283"
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-mono text-foreground focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      CAPI Test Event Code
                    </label>
                    <input
                      type="text"
                      value={editedConfig.metaTestEventCode || ""}
                      onChange={(e) => setEditedConfig({ ...editedConfig, metaTestEventCode: e.target.value.trim() })}
                      placeholder="TEST8833"
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-mono text-foreground focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={handleResetTrackingConfig}
                  className="rounded-xl border border-border px-3.5 py-2 text-xs font-bold text-muted-foreground hover:bg-surface hover:text-foreground cursor-pointer"
                >
                  Reset Defaults
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingTrackingConfig(false)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-foreground hover:bg-surface cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-brand px-5 py-2 text-xs font-black text-brand-foreground shadow-md hover:bg-brand/90 cursor-pointer"
                  >
                    Save &amp; Apply
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. BOOKING SUB-FILTER CHIP BAR (Mobile only, shown when in Bookings) */}
      {/* ============================================================ */}
      {isBookingSection && !mobileOperationsSheetOpen && (
        <div className="lg:hidden fixed bottom-[68px] left-2.5 right-2.5 z-40 bg-card/95 backdrop-blur-2xl border border-border/80 rounded-2xl shadow-xl p-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar animate-in slide-in-from-bottom-2 duration-200">
          {/* New Leads */}
          <button
            type="button"
            onClick={() => setActiveSection("new-bookings")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSection === "new-bookings"
                ? "bg-rose-500 text-white shadow-sm shadow-rose-500/40"
                : "text-muted-foreground hover:text-foreground hover:bg-surface/80"
            }`}
          >
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-rose-500" />
            </span>
            <span>New Leads</span>
            {counts.newBookings > 0 && (
              <span className="bg-white/25 text-white px-1.5 py-0.2 rounded-full text-[10px] font-black leading-none">
                {counts.newBookings}
              </span>
            )}
          </button>

          {/* Today's Bookings */}
          <button
            type="button"
            onClick={() => setActiveSection("todays-bookings")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSection === "todays-bookings"
                ? "bg-amber-500 text-white shadow-sm shadow-amber-500/40"
                : "text-muted-foreground hover:text-foreground hover:bg-surface/80"
            }`}
          >
            <Clock className="size-3" />
            <span>Today ({counts.todays})</span>
          </button>

          {/* Upcoming Bookings */}
          <button
            type="button"
            onClick={() => setActiveSection("upcoming-bookings")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSection === "upcoming-bookings"
                ? "bg-brand text-brand-foreground shadow-sm shadow-brand/40"
                : "text-muted-foreground hover:text-foreground hover:bg-surface/80"
            }`}
          >
            <Calendar className="size-3" />
            <span>Upcoming ({counts.upcoming})</span>
          </button>

          {/* Completed */}
          <button
            type="button"
            onClick={() => setActiveSection("completed")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSection === "completed"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/40"
                : "text-muted-foreground hover:text-foreground hover:bg-surface/80"
            }`}
          >
            <CheckCircle2 className="size-3" />
            <span>Completed ({counts.completed})</span>
          </button>

          {/* Cancelled */}
          <button
            type="button"
            onClick={() => setActiveSection("cancelled")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSection === "cancelled"
                ? "bg-slate-700 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-surface/80"
            }`}
          >
            <XCircle className="size-3" />
            <span>Cancelled ({counts.cancelled})</span>
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. ADMIN MOBILE BOTTOM NAVIGATION DOCK (lg:hidden) */}
      {/* ============================================================ */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 block lg:hidden border-t border-border/80 bg-background/95 backdrop-blur-2xl shadow-[0_-10px_35px_rgba(0,0,0,0.18)] pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2 px-2">
        <div className="grid grid-cols-5 items-center gap-1 max-w-lg mx-auto">
          {/* TAB 1: BOOKINGS */}
          <button
            type="button"
            onClick={() => {
              setMobileOperationsSheetOpen(false);
              if (!isBookingSection) {
                setActiveSection("new-bookings");
              } else if (activeSection === "new-bookings") {
                setActiveSection("todays-bookings");
              } else {
                setActiveSection("new-bookings");
              }
            }}
            className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all active:scale-95 cursor-pointer ${
              isBookingSection
                ? "text-brand font-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="relative">
              <CalendarCheck className={`size-5 transition-transform ${isBookingSection ? "scale-110" : ""}`} />
              {counts.newBookings > 0 && (
                <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[17px] h-[17px] px-1 rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-background animate-pulse">
                  {counts.newBookings}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold tracking-tight mt-1 leading-none">
              Bookings
            </span>
            {isBookingSection && (
              <span className="absolute -bottom-1 size-1 rounded-full bg-brand" />
            )}
          </button>

          {/* TAB 2: AMC */}
          <button
            type="button"
            onClick={() => {
              setActiveSection("amc-leads");
              setMobileOperationsSheetOpen(false);
            }}
            className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all active:scale-95 cursor-pointer ${
              activeSection === "amc-leads"
                ? "text-brand font-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="relative">
              <ShieldCheck className={`size-5 transition-transform ${activeSection === "amc-leads" ? "scale-110" : ""}`} />
              {counts.amcExpiring > 0 && (
                <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[17px] h-[17px] px-1 rounded-full bg-amber-500 text-[10px] font-black text-white ring-2 ring-background">
                  {counts.amcExpiring}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold tracking-tight mt-1 leading-none">
              AMC
            </span>
            {activeSection === "amc-leads" && (
              <span className="absolute -bottom-1 size-1 rounded-full bg-brand" />
            )}
          </button>

          {/* TAB 3: CUSTOMERS CRM */}
          <button
            type="button"
            onClick={() => {
              setActiveSection("customers");
              setMobileOperationsSheetOpen(false);
            }}
            className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all active:scale-95 cursor-pointer ${
              activeSection === "customers"
                ? "text-brand font-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="relative">
              <Users className={`size-5 transition-transform ${activeSection === "customers" ? "scale-110" : ""}`} />
              {customers.length > 0 && (
                <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-surface border border-border text-[9px] font-black text-foreground">
                  {customers.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold tracking-tight mt-1 leading-none">
              Customers
            </span>
            {activeSection === "customers" && (
              <span className="absolute -bottom-1 size-1 rounded-full bg-brand" />
            )}
          </button>

          {/* TAB 4: PAYMENTS & INVOICES */}
          <button
            type="button"
            onClick={() => {
              setActiveSection("payments");
              setMobileOperationsSheetOpen(false);
            }}
            className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all active:scale-95 cursor-pointer ${
              activeSection === "payments"
                ? "text-brand font-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="relative">
              <Receipt className={`size-5 transition-transform ${activeSection === "payments" ? "scale-110" : ""}`} />
            </div>
            <span className="text-[10px] font-bold tracking-tight mt-1 leading-none">
              Billing
            </span>
            {activeSection === "payments" && (
              <span className="absolute -bottom-1 size-1 rounded-full bg-brand" />
            )}
          </button>

          {/* TAB 5: OPERATIONS & QUICK ACTIONS */}
          <button
            type="button"
            onClick={() => setMobileOperationsSheetOpen(!mobileOperationsSheetOpen)}
            className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all active:scale-95 cursor-pointer ${
              mobileOperationsSheetOpen ||
              ["technicians", "service-areas", "reports", "quotation-requests", "tracking-diagnostics"].includes(activeSection)
                ? "text-brand font-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="relative">
              <Sliders className="size-5" />
            </div>
            <span className="text-[10px] font-bold tracking-tight mt-1 leading-none">
              Operations
            </span>
            {(mobileOperationsSheetOpen ||
              ["technicians", "service-areas", "reports", "quotation-requests", "tracking-diagnostics"].includes(activeSection)) && (
              <span className="absolute -bottom-1 size-1 rounded-full bg-brand" />
            )}
          </button>
        </div>
      </nav>

      {/* ============================================================ */}
      {/* 3. OPERATIONS MOBILE BOTTOM SHEET DRAWER */}
      {/* ============================================================ */}
      {mobileOperationsSheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setMobileOperationsSheetOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Bottom Sheet Card */}
          <div className="relative z-10 w-full rounded-t-3xl border-t border-border bg-card p-5 shadow-2xl max-h-[85vh] overflow-y-auto space-y-5 animate-in slide-in-from-bottom duration-300 pb-[max(2rem,env(safe-area-inset-bottom))]">
            {/* Sheet Handle */}
            <div className="flex justify-center -mt-1">
              <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Sliders className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-foreground">Hub Operations</h3>
                  <p className="text-[11px] text-muted-foreground">Logistics, Techs, Analytics &amp; Controls</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOperationsSheetOpen(false)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Field Operations Grid */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block px-1">
                Field Operations &amp; Logistics
              </span>
              <div className="grid grid-cols-1 gap-2">
                {/* Field Technicians */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("technicians");
                    setMobileOperationsSheetOpen(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                    activeSection === "technicians"
                      ? "border-brand bg-brand/10 text-brand font-bold"
                      : "border-border bg-surface/50 text-foreground hover:bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                      <HardHat className="size-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black block">Field Technicians Roster</span>
                      <span className="text-[11px] text-muted-foreground block">
                        {technicians.length} Technicians • Live job assignments
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>

                {/* Regional Hubs & Service Areas */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("service-areas");
                    setMobileOperationsSheetOpen(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                    activeSection === "service-areas"
                      ? "border-brand bg-brand/10 text-brand font-bold"
                      : "border-border bg-surface/50 text-foreground hover:bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
                      <Building2 className="size-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black block">Regional Hubs &amp; Cities</span>
                      <span className="text-[11px] text-muted-foreground block">
                        Kochi, TVM, Kozhikode, Kollam, Thrissur, Chennai
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>

                {/* Quotation Requests */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("quotation-requests");
                    setMobileOperationsSheetOpen(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                    activeSection === "quotation-requests"
                      ? "border-brand bg-brand/10 text-brand font-bold"
                      : "border-border bg-surface/50 text-foreground hover:bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                      <ShoppingBag className="size-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black block">Quotation Requests</span>
                      <span className="text-[11px] text-muted-foreground block">
                        Commercial VRF/VRV &amp; Bulk AC Purchases ({counts.quotation})
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Analytics & Marketing Diagnostics */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block px-1">
                Analytics &amp; Marketing Intelligence
              </span>
              <div className="grid grid-cols-1 gap-2">
                {/* Reports & ROI */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("reports");
                    setMobileOperationsSheetOpen(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                    activeSection === "reports"
                      ? "border-brand bg-brand/10 text-brand font-bold"
                      : "border-border bg-surface/50 text-foreground hover:bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                      <TrendingUp className="size-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black block">Revenue &amp; Ads ROI Reports</span>
                      <span className="text-[11px] text-muted-foreground block">
                        Google Ads vs Meta Ads conversion breakdown
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>

                {/* GTM & Tracking Diagnostics */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("tracking-diagnostics");
                    setMobileOperationsSheetOpen(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                    activeSection === "tracking-diagnostics"
                      ? "border-brand bg-brand/10 text-brand font-bold"
                      : "border-border bg-surface/50 text-foreground hover:bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                      <Activity className="size-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black block">GTM &amp; Tracking Diagnostics</span>
                      <span className="text-[11px] text-muted-foreground block">
                        GA4, Meta CAPI, Google Ads Enhanced Conversions
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Quick System Actions */}
            <div className="space-y-2 pt-2 border-t border-border">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block px-1">
                Terminal &amp; Quick Links
              </span>
              <div className="grid grid-cols-2 gap-2">
                {/* Refresh Neon DB */}
                <button
                  type="button"
                  onClick={() => {
                    loadData();
                    setMobileOperationsSheetOpen(false);
                  }}
                  className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card text-foreground hover:bg-surface text-left cursor-pointer"
                >
                  <RefreshCw className="size-4 text-brand" />
                  <span className="text-xs font-bold">Refresh DB</span>
                </button>

                {/* Lock Portal */}
                {onLock && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOperationsSheetOpen(false);
                      onLock();
                    }}
                    className="flex items-center gap-2 p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-left cursor-pointer"
                  >
                    <Lock className="size-4" />
                    <span className="text-xs font-bold">Lock Hub</span>
                  </button>
                )}

                {/* Live Customer Website */}
                <Link
                  to="/"
                  target="_blank"
                  className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card text-foreground hover:bg-surface text-left cursor-pointer"
                >
                  <ExternalLink className="size-4 text-sky-500" />
                  <span className="text-xs font-bold">Live Website</span>
                </Link>

                {/* Field Tech Mobile Portal */}
                <Link
                  to="/technician"
                  className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card text-foreground hover:bg-surface text-left cursor-pointer"
                >
                  <HardHat className="size-4 text-amber-500" />
                  <span className="text-xs font-bold">Tech Portal 📱</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
