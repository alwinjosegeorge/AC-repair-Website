import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Booking,
  Technician,
  AMCContract,
  BookingStatus,
  BOOKING_STATUS_FLOW,
  getBookings,
  getTechnicians,
  getAMCContracts,
  updateBookingStatus,
  generateAdminToCustomerWhatsAppURL,
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

  // Filters & Selected State
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Load Data
  const loadData = () => {
    const b = getBookings();
    setBookings(b);
    setTechnicians(getTechnicians());
    setAmcContracts(getAMCContracts());
  };

  useEffect(() => {
    loadData();
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
    const amcLeads = bookings.filter((b) => b.serviceCategory === "ac-amc").length;
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
      quotation,
    };
  }, [bookings]);

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

  // Derived Customers CRM list
  const customersList = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        phone: string;
        whatsapp: string;
        city: string;
        address: string;
        count: number;
        totalSpend: number;
        lastDate: string;
        lastService: string;
      }
    >();

    bookings.forEach((b) => {
      const key = b.phone;
      if (!map.has(key)) {
        map.set(key, {
          name: b.customerName,
          phone: b.phone,
          whatsapp: b.whatsappNumber || b.phone,
          city: b.city,
          address: b.address,
          count: 1,
          totalSpend: b.estimatedAmount,
          lastDate: b.createdAt,
          lastService: b.serviceName,
        });
      } else {
        const item = map.get(key)!;
        item.count += 1;
        item.totalSpend += b.estimatedAmount;
        if (new Date(b.createdAt) > new Date(item.lastDate)) {
          item.lastDate = b.createdAt;
          item.lastService = b.serviceName;
        }
      }
    });

    return Array.from(map.values()).filter(
      (c) =>
        searchQuery === "" ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [bookings, searchQuery]);

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
                    <span>AMC Leads</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      activeSection === "amc-leads"
                        ? "bg-white text-brand"
                        : "bg-brand/10 text-brand"
                    }`}
                  >
                    {counts.amcLeads}
                  </span>
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
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION VIEWS */}
          {/* ============================================================ */}

          {/* VIEW: BOOKINGS TABLES (New, Today, Upcoming, Completed, Cancelled, AMC Leads, Quotes) */}
          {(activeSection === "new-bookings" ||
            activeSection === "todays-bookings" ||
            activeSection === "upcoming-bookings" ||
            activeSection === "completed" ||
            activeSection === "cancelled" ||
            activeSection === "amc-leads" ||
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

          {/* VIEW: CUSTOMERS CRM DIRECTORY */}
          {activeSection === "customers" && (
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-foreground">
                  <thead className="border-b border-border bg-surface text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Customer Name</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">City</th>
                      <th className="px-4 py-3">Total Orders</th>
                      <th className="px-4 py-3">Lifetime Value</th>
                      <th className="px-4 py-3">Last Service</th>
                      <th className="px-4 py-3 text-right">Connect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {customersList.map((c) => (
                      <tr key={c.phone} className="hover:bg-surface/50 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-foreground">{c.name}</td>
                        <td className="px-4 py-3.5">
                          <div>{c.phone}</div>
                          <div className="text-[11px] text-muted-foreground">WA: {c.whatsapp}</div>
                        </td>
                        <td className="px-4 py-3.5 font-medium">{c.city}</td>
                        <td className="px-4 py-3.5">
                          <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-bold text-brand">
                            {c.count} {c.count === 1 ? "Booking" : "Bookings"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-black text-brand">
                          ₹{c.totalSpend.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground truncate max-w-xs">
                          {c.lastService}
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-2">
                          <a
                            href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello from EGS INDIA! Checking in regarding your AC comfort.")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-[#25D366]/15 px-2.5 py-1 text-xs font-bold text-[#25D366]"
                          >
                            <MessageSquare className="size-3 fill-current" />
                            <span>WhatsApp</span>
                          </a>
                          <a
                            href={`tel:${c.phone}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-bold text-foreground"
                          >
                            <Phone className="size-3 text-brand" />
                            <span>Call</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
    </div>
  );
}
