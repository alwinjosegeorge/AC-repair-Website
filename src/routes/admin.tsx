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
  getBookings,
  getTechnicians,
  getAMCContracts,
  renewAMCContract,
  scheduleAMCNextService,
  saveAMCContract,
  getCustomers,
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
  DollarSign,
  Send,
  Truck,
  Play,
  Award,
  CreditCard,
  XCircle,
  Menu,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "EGS Admin Dashboard | Bookings, Technicians, AMC & Reports" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

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
  | "reports";

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

export function AdminDashboard() {
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

  // AMC Renewal System State
  const [amcSectionTab, setAmcSectionTab] = useState<"all" | "expiring_soon" | "active" | "expired" | "renewed">("all");
  const [renewModalContract, setRenewModalContract] = useState<AMCContract | null>(null);
  const [scheduleServiceContract, setScheduleServiceContract] = useState<AMCContract | null>(null);
  const [showNewAMCModal, setShowNewAMCModal] = useState(false);
  const [amcActionToast, setAmcActionToast] = useState<string | null>(null);

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
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("egs_bookings_updated", handleUpdate);
    window.addEventListener("egs_customers_updated", handleUpdate);
    window.addEventListener("egs_amc_updated", handleUpdate);
    return () => {
      window.removeEventListener("egs_bookings_updated", handleUpdate);
      window.removeEventListener("egs_customers_updated", handleUpdate);
      window.removeEventListener("egs_amc_updated", handleUpdate);
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

    return {
      newBookings,
      todays,
      upcoming,
      completed,
      cancelled,
      amcLeads,
      amcExpiring,
      quotation,
    };
  }, [bookings, amcContracts]);

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
    const counts: Record<string, number> = { google: 0, meta: 0, direct: 0, other: 0 };
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
      handleStatusChange(booking.id, nextStatus);
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

            {/* Section 4: Analytics */}
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
        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-x-hidden">
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
              </p>
            </div>

            {/* Search & City Filter (for booking/customer views) */}
            <div className="flex flex-wrap items-center gap-2">
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

              {activeSection !== "reports" && activeSection !== "service-areas" && (
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
                                    setServiceVisitDate(c.nextServiceDate || new Date().toISOString().split("T")[0]);
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
                        const count = bookings.filter((b) => b.city.includes(city.split(" ")[0])).length;
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
                    date: serviceVisitDate || new Date().toISOString().split("T")[0],
                    slot: serviceVisitSlot,
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
                  const endD = new Date(newStartDate);
                  endD.setFullYear(endD.getFullYear() + 1);
                  const nextD = new Date(newStartDate);
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
                    amcStartDate: newStartDate,
                    startDate: newStartDate,
                    amcEndDate: endD.toISOString().split("T")[0],
                    expiryDate: endD.toISOString().split("T")[0],
                    lastServiceDate: newStartDate,
                    lastServiceDetails: "Initial Setup Inspection",
                    nextServiceDate: nextD.toISOString().split("T")[0],
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
    </div>
  );
}
