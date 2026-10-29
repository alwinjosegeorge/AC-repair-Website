import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  Booking,
  Technician,
  BookingStatus,
  BOOKING_STATUS_FLOW,
  PaymentMethod,
  PaymentTransaction,
  EGSInvoice,
  getBookings,
  getTechnicians,
  getTransactions,
  getInvoiceByNumber,
  updateBookingStatus,
  recordBookingPayment,
  generateUPIPaymentUrl,
  getUPIQRCodeUrl,
  generatePaymentReceiptWhatsAppURL,
  generateTechnicianEtaWhatsAppURL,
  generateTechnicianCompletedWhatsAppURL,
  EGS_CALL_NUMBER,
  EGS_WHATSAPP_NUMBER,
  EGS_COMPANY_DETAILS,
} from "@/lib/store";
import {
  Phone,
  MessageSquare,
  Navigation,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Truck,
  Play,
  Award,
  CreditCard,
  User,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  Check,
  ChevronDown,
  Wrench,
  Sparkles,
  Layers,
  ArrowLeft,
  X,
  FileText,
  DollarSign,
  AlertTriangle,
  QrCode,
  Share2,
  Copy,
  Receipt,
  Download,
  Printer,
  Building2,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/technician")({
  beforeLoad: () => {
    throw redirect({ to: "/control-hub" });
  },
  head: () => ({
    meta: [
      { title: "EGS Control Hub | HVAC Operations" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => null,
});

type DateFilterOption = "today" | "tomorrow" | "upcoming" | "all";
type TimeSlotFilterOption = "all" | "morning" | "afternoon" | "evening" | "night";

export function TechnicianMobilePortal() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedTechId, setSelectedTechId] = useState<string>("tech-1"); // Default: Arun Kumar (Kollam)
  const [dateFilter, setDateFilter] = useState<DateFilterOption>("today");
  const [timeFilter, setTimeFilter] = useState<TimeSlotFilterOption>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeJobDetails, setActiveJobDetails] = useState<Booking | null>(null);
  const [sparesNotesModal, setSparesNotesModal] = useState<Booking | null>(null);
  const [sparesText, setSparesText] = useState("");
  const [techRemarks, setTechRemarks] = useState("");
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  // Field Technician Payment Collector State
  const [paymentModalJob, setPaymentModalJob] = useState<Booking | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI / QR Code");
  const [paymentCollectAmount, setPaymentCollectAmount] = useState<number>(0);
  const [paymentUtrRef, setPaymentUtrRef] = useState<string>("");
  const [paymentNotes, setPaymentNotes] = useState<string>("");
  const [paymentSuccessResult, setPaymentSuccessResult] = useState<{
    transaction: PaymentTransaction;
    invoice: EGSInvoice;
  } | null>(null);
  const [receiptModalJob, setReceiptModalJob] = useState<Booking | null>(null);
  const [copiedUpiNotice, setCopiedUpiNotice] = useState(false);

  // Load state and listen for store updates
  const refreshData = () => {
    setBookings(getBookings());
    setTechnicians(getTechnicians());
  };

  useEffect(() => {
    refreshData();

    const handleBookingUpdate = () => refreshData();
    window.addEventListener("egs_bookings_updated", handleBookingUpdate);
    return () => {
      window.removeEventListener("egs_bookings_updated", handleBookingUpdate);
    };
  }, []);

  const currentTechnician = useMemo(() => {
    return technicians.find((t) => t.id === selectedTechId) || technicians[0];
  }, [technicians, selectedTechId]);

  // Hierarchical Filtering:
  // Step 1: Booking Pool
  // Step 2: Technician Selection
  // Step 3: Date Filtering
  // Step 4: Time Slot Filtering
  const filteredJobs = useMemo(() => {
    return bookings.filter((b) => {
      // Step 2: Technician Match
      // If "all" selected, show all assigned jobs, else match selected technician id or name
      if (selectedTechId !== "all") {
        const matchesTechId = b.assignedTechnicianId === selectedTechId;
        const matchesTechName =
          currentTechnician &&
          b.assignedTechnicianName?.toLowerCase() === currentTechnician.name.toLowerCase();
        // If booking is not explicitly assigned yet, don't show under specific tech unless it's new in that city
        if (!matchesTechId && !matchesTechName) {
          // If unassigned but matches the technician's home city and status is NEW/CONFIRMED, allow tech to claim
          const matchesCity = currentTechnician && b.city.toLowerCase().includes(currentTechnician.city.toLowerCase());
          if (!matchesCity || b.assignedTechnicianId) return false;
        }
      }

      // Step 3: Date Filter
      const dateLower = (b.preferredDate || "").toLowerCase();
      if (dateFilter === "today") {
        const isToday = dateLower.includes("today") || dateLower.includes("express");
        if (!isToday && b.status !== "TECHNICIAN ON THE WAY" && b.status !== "SERVICE STARTED") {
          return false;
        }
      } else if (dateFilter === "tomorrow") {
        if (!dateLower.includes("tomorrow")) return false;
      } else if (dateFilter === "upcoming") {
        if (dateLower.includes("today") || b.status === "COMPLETED" || b.status === "PAYMENT RECEIVED") {
          return false;
        }
      }

      // Step 4: Time Slot Filter
      const slotLower = (b.preferredSlot || "").toLowerCase();
      if (timeFilter === "morning" && !slotLower.includes("morning")) return false;
      if (timeFilter === "afternoon" && !slotLower.includes("afternoon")) return false;
      if (timeFilter === "evening" && !slotLower.includes("evening")) return false;
      if (timeFilter === "night" && !slotLower.includes("night")) return false;

      // Optional text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          b.customerName.toLowerCase().includes(q) ||
          b.phone.includes(q) ||
          b.id.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q) ||
          b.serviceName.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [bookings, selectedTechId, currentTechnician, dateFilter, timeFilter, searchQuery]);

  // Metrics for current technician
  const metrics = useMemo(() => {
    const techJobs = bookings.filter(
      (b) =>
        b.assignedTechnicianId === selectedTechId ||
        (currentTechnician && b.assignedTechnicianName === currentTechnician.name)
    );

    const onTheWay = techJobs.filter((b) => b.status === "TECHNICIAN ON THE WAY").length;
    const inProgress = techJobs.filter((b) => b.status === "SERVICE STARTED").length;
    const completedToday = techJobs.filter(
      (b) => b.status === "COMPLETED" || b.status === "PAYMENT RECEIVED"
    ).length;
    const totalCollected = techJobs
      .filter((b) => b.status === "PAYMENT RECEIVED")
      .reduce((acc, curr) => acc + (curr.estimatedAmount || 0), 0);

    return {
      total: techJobs.length,
      onTheWay,
      inProgress,
      completedToday,
      totalCollected,
    };
  }, [bookings, selectedTechId, currentTechnician]);

  // Quick Action: Advance booking status
  const handleAdvanceStatus = (booking: Booking, nextStatus: BookingStatus) => {
    updateBookingStatus(booking.id, nextStatus, currentTechnician?.id || selectedTechId);
    setActionSuccessNotice(`Job ${booking.id} updated to ${nextStatus}`);
    setTimeout(() => setActionSuccessNotice(null), 3500);
    refreshData();
  };

  // Google Maps turn-by-turn navigation link
  const getGoogleMapsUrl = (b: Booking) => {
    if (b.locationCoordinates) {
      return `https://www.google.com/maps/dir/?api=1&destination=${b.locationCoordinates.latitude},${b.locationCoordinates.longitude}`;
    }
    const query = encodeURIComponent(`${b.address}, ${b.city}, Kerala, India`);
    return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-28">
      {/* SUCCESS TOAST NOTIFICATION */}
      {actionSuccessNotice && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-2xl flex items-center gap-2 border border-emerald-400/30 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="size-4 shrink-0 text-white" />
          <span className="flex-1">{actionSuccessNotice}</span>
          <button onClick={() => setActionSuccessNotice(null)} className="opacity-70 hover:opacity-100">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* TOP MOBILE APP HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-4 py-3">
        <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-brand font-black text-brand-foreground shadow-md shadow-brand/30">
              <Wrench className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold tracking-tight text-white">EGS INDIA</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Field Tech
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">Mobile Job Management</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshData}
              title="Refresh Jobs"
              className="flex size-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-800/80 text-slate-300 hover:text-white active:scale-95 transition-transform"
            >
              <RefreshCw className="size-3.5" />
            </button>
          </div>
        </div>

        {/* HIERARCHICAL WORKFLOW BREADCRUMB INDICATOR */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 max-w-lg mx-auto">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <div className="flex items-center gap-1">
              <span className="text-brand font-black">1. Booking</span>
              <ChevronRight className="size-3 text-slate-600" />
              <span className="text-brand font-black">2. Tech</span>
              <ChevronRight className="size-3 text-slate-600" />
              <span className="text-brand font-black">3. Date</span>
              <ChevronRight className="size-3 text-slate-600" />
              <span className="text-brand font-black">4. Time</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-md font-bold text-slate-300">
              {filteredJobs.length} {filteredJobs.length === 1 ? "Job" : "Jobs"}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-3 space-y-3.5">
        {/* HIERARCHY LEVEL 1 & 2: TECHNICIAN SWITCHER */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="size-3.5 text-brand" /> Active Field Technician:
            </span>
            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
              ⭐ {currentTechnician?.rating || 4.9} • {currentTechnician?.experienceYears || 8}y Exp
            </span>
          </div>

          {/* Horizontal Technician Selector Carousel */}
          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none snap-x">
            {technicians.map((t) => {
              const isSelected = selectedTechId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTechId(t.id)}
                  className={`snap-start shrink-0 rounded-xl px-3 py-2 text-left transition-all border ${
                    isSelected
                      ? "border-brand bg-brand text-brand-foreground shadow-md shadow-brand/20 font-bold"
                      : "border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`size-2 rounded-full ${
                        t.status === "available"
                          ? "bg-emerald-400"
                          : t.status === "on_job"
                          ? "bg-amber-400 animate-pulse"
                          : "bg-slate-500"
                      }`}
                    />
                    <div className="text-xs font-black whitespace-nowrap">{t.name}</div>
                  </div>
                  <div
                    className={`text-[10px] mt-0.5 whitespace-nowrap ${
                      isSelected ? "text-brand-foreground/80 font-medium" : "text-slate-500"
                    }`}
                  >
                    {t.city} • {t.activeJobsCount} Active
                  </div>
                </button>
              );
            })}
            <button
              onClick={() => setSelectedTechId("all")}
              className={`snap-start shrink-0 rounded-xl px-3 py-2 text-left transition-all border ${
                selectedTechId === "all"
                  ? "border-brand bg-brand text-brand-foreground font-bold"
                  : "border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700"
              }`}
            >
              <div className="text-xs font-black whitespace-nowrap">🌐 All Technicians</div>
              <div className="text-[10px] text-slate-500 whitespace-nowrap">Overview View</div>
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-3 grid grid-cols-4 gap-2 pt-2.5 border-t border-slate-800/80 text-center">
            <div className="rounded-xl bg-slate-950/60 p-2 border border-slate-800/60">
              <div className="text-[10px] font-semibold text-slate-400">Total Jobs</div>
              <div className="text-sm font-black text-white">{metrics.total}</div>
            </div>
            <div className="rounded-xl bg-slate-950/60 p-2 border border-slate-800/60">
              <div className="text-[10px] font-semibold text-amber-400">Active</div>
              <div className="text-sm font-black text-amber-400">
                {metrics.onTheWay + metrics.inProgress}
              </div>
            </div>
            <div className="rounded-xl bg-slate-950/60 p-2 border border-slate-800/60">
              <div className="text-[10px] font-semibold text-emerald-400">Done</div>
              <div className="text-sm font-black text-emerald-400">{metrics.completedToday}</div>
            </div>
            <div className="rounded-xl bg-slate-950/60 p-2 border border-slate-800/60">
              <div className="text-[10px] font-semibold text-slate-400">Cash/UPI</div>
              <div className="text-xs font-black text-white">₹{metrics.totalCollected.toLocaleString("en-IN")}</div>
            </div>
          </div>
        </section>

        {/* HIERARCHY LEVEL 3: DATE SELECTOR */}
        <section className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calendar className="size-3.5 text-brand" /> 3. Select Service Date:
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: "today", label: "Today", sub: "90-Min / Immediate" },
              { id: "tomorrow", label: "Tomorrow", sub: "Scheduled" },
              { id: "upcoming", label: "Upcoming", sub: "Later Dates" },
              { id: "all", label: "All Dates", sub: "Complete" },
            ].map((tab) => {
              const active = dateFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDateFilter(tab.id as DateFilterOption)}
                  className={`flex flex-col items-center justify-center rounded-xl py-2 px-1 text-center transition-all border ${
                    active
                      ? "border-brand bg-brand/15 text-brand shadow-sm font-black"
                      : "border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="text-xs font-extrabold">{tab.label}</span>
                  <span className="text-[9px] opacity-75 truncate max-w-full">{tab.sub}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* HIERARCHY LEVEL 4: TIME SLOT SELECTOR */}
        <section className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="size-3.5 text-brand" /> 4. Preferred Time Window:
            </span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "All Slots" },
              { id: "morning", label: "🌅 Morning (9-12)" },
              { id: "afternoon", label: "☀️ Afternoon (12-3)" },
              { id: "evening", label: "🌇 Evening (3-6)" },
              { id: "night", label: "🌙 Night Express (6-9)" },
            ].map((slot) => {
              const active = timeFilter === slot.id;
              return (
                <button
                  key={slot.id}
                  onClick={() => setTimeFilter(slot.id as TimeSlotFilterOption)}
                  className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all border whitespace-nowrap ${
                    active
                      ? "border-brand bg-brand text-brand-foreground shadow-sm"
                      : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  {slot.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* SEARCH FILTER */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer, location or booking ID..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-9 pr-8 text-xs text-slate-100 placeholder:text-slate-500 focus:border-brand focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* SECTION HEADER: MATCHING ASSIGNED JOBS */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span>Assigned Bookings Queue</span>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-white">
              {filteredJobs.length}
            </span>
          </h2>
          <span className="text-[10px] text-slate-500">Tap card for details</span>
        </div>

        {/* JOB CARDS LIST */}
        {filteredJobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center space-y-3">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-400">
              <CheckCircle2 className="size-6 text-brand" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">No Jobs Found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                No active bookings match this Technician + Date + Time filter. Try switching dates or clearing the search.
              </p>
            </div>
            <button
              onClick={() => {
                setDateFilter("all");
                setTimeFilter("all");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand/40 bg-brand/10 px-3 py-1.5 text-xs font-bold text-brand"
            >
              <RefreshCw className="size-3" />
              <span>Show All Bookings</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredJobs.map((b) => {
              // Status Badge styling
              const isNew = b.status === "NEW";
              const isAssigned = b.status === "ASSIGNED";
              const isOnTheWay = b.status === "TECHNICIAN ON THE WAY";
              const isStarted = b.status === "SERVICE STARTED";
              const isCompleted = b.status === "COMPLETED";
              const isPaid = b.status === "PAYMENT RECEIVED";

              return (
                <div
                  key={b.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOnTheWay || isStarted
                      ? "border-amber-500/50 bg-slate-900 shadow-md shadow-amber-500/10"
                      : isCompleted || isPaid
                      ? "border-emerald-500/40 bg-slate-900/70"
                      : "border-slate-800 bg-slate-900/90 hover:border-slate-700"
                  }`}
                >
                  {/* Card Top: Booking ID, Category Badge & Status */}
                  <div className="p-3.5 pb-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-brand tracking-wider">
                            {b.id}
                          </span>
                          <span className="text-[10px] text-slate-400">• {b.city}</span>
                        </div>
                        <h3 className="text-sm font-extrabold text-white mt-0.5">
                          {b.serviceName}
                        </h3>
                        {b.subService && (
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {b.subService}
                          </p>
                        )}
                      </div>

                      {/* Status Tag */}
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide border ${
                          isPaid
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : isCompleted
                            ? "bg-teal-500/15 text-teal-400 border-teal-500/30"
                            : isStarted
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse"
                            : isOnTheWay
                            ? "bg-blue-500/20 text-blue-300 border-blue-500/40 animate-pulse"
                            : isAssigned
                            ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                            : "bg-slate-800 text-slate-300 border-slate-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    {/* AC Unit Specs & Customer Details */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="rounded-md bg-slate-950 px-2 py-0.5 text-[11px] font-bold text-slate-200 border border-slate-800">
                        ❄️ {b.acType}
                      </span>
                      <span className="rounded-md bg-slate-950 px-2 py-0.5 text-[11px] font-bold text-slate-200 border border-slate-800">
                        Qty: {b.unitCount} {Number(b.unitCount) === 1 ? "Unit" : "Units"}
                      </span>
                      {b.acBrand && (
                        <span className="rounded-md bg-slate-950 px-2 py-0.5 text-[11px] font-bold text-slate-300 border border-slate-800">
                          Brand: {b.acBrand}
                        </span>
                      )}
                      <span className="ml-auto font-black text-brand text-xs">
                        ₹{b.estimatedAmount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Schedule Row */}
                    <div className="mt-2 rounded-xl bg-slate-950/70 p-2 border border-slate-800/80 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                        <Calendar className="size-3.5 text-brand" />
                        <span>{b.preferredDate || "Immediate"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <Clock className="size-3.5" />
                        <span>{b.preferredSlot || "Morning Slot"}</span>
                      </div>
                    </div>

                    {/* Address & Landmark */}
                    <div className="mt-2 text-xs text-slate-300 space-y-0.5">
                      <div className="font-bold text-white flex items-center gap-1">
                        <User className="size-3 text-slate-400" />
                        <span>{b.customerName}</span>
                      </div>
                      <div className="flex items-start gap-1 text-[11px] text-slate-400">
                        <MapPin className="size-3.5 shrink-0 text-red-400 mt-0.5" />
                        <span>
                          {b.houseBuilding ? `${b.houseBuilding}, ` : ""}
                          {b.address}, {b.city} - {b.pincode}
                          {b.landmark ? ` (Landmark: ${b.landmark})` : ""}
                        </span>
                      </div>
                      {b.issueDescription && (
                        <div className="mt-1.5 text-[11px] rounded-lg bg-amber-500/10 p-2 text-amber-300 border border-amber-500/20">
                          <span className="font-bold">Issue Note: </span>
                          {b.issueDescription}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 1-TAP ACTION BUTTONS BAR (Call, WhatsApp ETA, GPS Navigation) */}
                  <div className="grid grid-cols-3 border-t border-slate-800 bg-slate-950/90 divide-x divide-slate-800">
                    {/* Call Button */}
                    <a
                      href={`tel:${b.phone}`}
                      className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-slate-200 hover:text-white active:bg-slate-800 transition-colors"
                    >
                      <Phone className="size-3.5 text-brand" />
                      <span>Call</span>
                    </a>

                    {/* WhatsApp ETA Dispatch */}
                    <a
                      href={generateTechnicianEtaWhatsAppURL(
                        b,
                        currentTechnician?.name || "Arun Kumar",
                        25
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-[#25D366] hover:bg-slate-800/80 transition-colors"
                    >
                      <MessageSquare className="size-3.5 fill-current" />
                      <span>Send ETA</span>
                    </a>

                    {/* GPS Maps Turn-by-Turn */}
                    <a
                      href={getGoogleMapsUrl(b)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-blue-400 hover:text-blue-300 active:bg-slate-800 transition-colors"
                    >
                      <Navigation className="size-3.5 fill-current" />
                      <span>GPS Nav</span>
                    </a>
                  </div>

                  {/* 1-TAP STATUS STEPPER ACTION BUTTON */}
                  <div className="p-3 bg-slate-900 border-t border-slate-800/80">
                    {isAssigned && (
                      <button
                        onClick={() => handleAdvanceStatus(b, "TECHNICIAN ON THE WAY")}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 text-xs font-black text-white shadow-md shadow-blue-600/30 active:scale-98 transition-transform"
                      >
                        <Truck className="size-4 animate-bounce" />
                        <span>🚀 Start Trip (Technician On The Way)</span>
                      </button>
                    )}

                    {isOnTheWay && (
                      <button
                        onClick={() => handleAdvanceStatus(b, "SERVICE STARTED")}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-amber-500/30 active:scale-98 transition-transform"
                      >
                        <Play className="size-4 fill-current" />
                        <span>⚙️ Arrived at Site - Start Service</span>
                      </button>
                    )}

                    {isStarted && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setSparesNotesModal(b);
                            setSparesText("");
                            setTechRemarks("");
                          }}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700"
                        >
                          <FileText className="size-3.5 text-brand" />
                          <span>Log Spares</span>
                        </button>
                        <button
                          onClick={() => handleAdvanceStatus(b, "COMPLETED")}
                          className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 text-xs font-black text-white shadow-md shadow-emerald-600/30 active:scale-98"
                        >
                          <CheckCircle2 className="size-4" />
                          <span>✅ Service Done</span>
                        </button>
                      </div>
                    )}

                    {isCompleted && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                          <span>Service Completed!</span>
                          <a
                            href={generateTechnicianCompletedWhatsAppURL(
                              b,
                              currentTechnician?.name || "Arun Kumar"
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] underline text-[#25D366] font-bold"
                          >
                            Send Warranty WA
                          </a>
                        </div>
                        <button
                          onClick={() => {
                            setPaymentModalJob(b);
                            setPaymentCollectAmount(b.estimatedAmount);
                            setPaymentMethod("UPI / QR Code");
                            setPaymentUtrRef("");
                            setPaymentNotes("");
                            setPaymentSuccessResult(null);
                          }}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand hover:bg-brand/90 py-2.5 text-xs font-black text-brand-foreground shadow-md shadow-brand/30 active:scale-98 transition-transform cursor-pointer"
                        >
                          <QrCode className="size-4" />
                          <span>💳 Show UPI QR / Collect Payment (₹{b.estimatedAmount})</span>
                        </button>
                      </div>
                    )}

                    {isPaid && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between rounded-xl bg-emerald-950/40 p-2.5 border border-emerald-500/30 text-xs">
                          <div className="flex items-center gap-2 text-emerald-400 font-bold">
                            <Check className="size-4" />
                            <span>Payment Received (₹{b.estimatedAmount})</span>
                          </div>
                          <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-300">
                            Warranty Active 🛡️
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setReceiptModalJob(b)}
                          className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                        >
                          <Receipt className="size-3.5 text-brand" />
                          <span>View Receipt, Invoice &amp; 30-Day Guarantee</span>
                        </button>
                      </div>
                    )}

                    {isNew && (
                      <button
                        onClick={() => handleAdvanceStatus(b, "CONFIRMED")}
                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-bold text-slate-200"
                      >
                        <span>Claim & Confirm Job</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* MODAL: LOG SPARE PARTS & TECHNICIAN NOTES */}
      {sparesNotesModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-black text-white text-base">Service Job Report</h3>
                <p className="text-xs text-slate-400">
                  {sparesNotesModal.id} • {sparesNotesModal.customerName}
                </p>
              </div>
              <button
                onClick={() => setSparesNotesModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Spare Parts Used / Replaced:
                </label>
                <input
                  type="text"
                  value={sparesText}
                  onChange={(e) => setSparesText(e.target.value)}
                  placeholder="e.g., Capacitor 45uF, 400g R32 Gas, Flare Nut..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder:text-slate-500 focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Technician Final Notes & Cooling Diagnostic:
                </label>
                <textarea
                  rows={3}
                  value={techRemarks}
                  onChange={(e) => setTechRemarks(e.target.value)}
                  placeholder="e.g., Temperature drop tested at 14°C, coil hydro cleaned, no refrigerant leaks found."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder:text-slate-500 focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSparesNotesModal(null)}
                className="flex-1 rounded-xl border border-slate-700 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setActionSuccessNotice(`Service report recorded for ${sparesNotesModal.id}`);
                  setSparesNotesModal(null);
                  setTimeout(() => setActionSuccessNotice(null), 3000);
                }}
                className="flex-1 rounded-xl bg-brand py-2.5 text-xs font-black text-brand-foreground shadow-md shadow-brand/30"
              >
                Save Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: FIELD TECHNICIAN PAYMENT COLLECTOR */}
      {/* ============================================================ */}
      {paymentModalJob && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-3 overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-6 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-brand">
                  Field Payment Collection
                </span>
                <h3 className="font-black text-white text-base mt-0.5">
                  {paymentModalJob.serviceName}
                </h3>
                <p className="text-xs text-slate-400">
                  {paymentModalJob.id} • {paymentModalJob.customerName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPaymentModalJob(null);
                  setPaymentSuccessResult(null);
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* IF PAYMENT COMPLETED SUCCESSFULLY: SHOW RECEIPT SCREEN */}
            {paymentSuccessResult ? (
              <div className="space-y-4 text-center py-2 animate-in fade-in zoom-in-95">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <CheckCircle2 className="size-8" />
                </div>

                <div>
                  <h4 className="text-lg font-black text-white">Payment Received!</h4>
                  <p className="text-xs text-emerald-400 font-bold mt-0.5">
                    ₹{paymentSuccessResult.transaction.amount.toLocaleString("en-IN")} collected via {paymentSuccessResult.transaction.paymentMethod}
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5 text-left text-xs space-y-2">
                  <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800/80">
                    <span>Receipt No:</span>
                    <span className="font-mono font-bold text-slate-200">
                      {paymentSuccessResult.transaction.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800/80">
                    <span>Tax Invoice:</span>
                    <span className="font-mono font-bold text-brand">
                      {paymentSuccessResult.invoice.invoiceNo}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800/80">
                    <span>GST (18% Included):</span>
                    <span className="font-semibold text-slate-300">
                      ₹{paymentSuccessResult.transaction.taxAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>30-Day Guarantee Valid:</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="size-3.5" />
                      {paymentSuccessResult.invoice.warrantyValidUntil}
                    </span>
                  </div>
                </div>

                {/* Dispatch WhatsApp Receipt */}
                <div className="space-y-2 pt-1">
                  <a
                    href={generatePaymentReceiptWhatsAppURL(
                      paymentSuccessResult.transaction,
                      paymentSuccessResult.invoice
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#25D366]/25 transition-transform active:scale-98"
                  >
                    <MessageSquare className="size-4 fill-current" />
                    <span>Send Receipt &amp; Warranty via WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentModalJob(null);
                      setPaymentSuccessResult(null);
                      refreshData();
                    }}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    Close &amp; Return to Job Queue
                  </button>
                </div>
              </div>
            ) : (
              /* COLLECT PAYMENT FORM */
              <div className="space-y-4">
                {/* Amount to Collect with optional quick adjustments */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      Total Amount to Collect:
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      (Includes 18% GST)
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-extrabold text-brand">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={100}
                      value={paymentCollectAmount}
                      onChange={(e) => setPaymentCollectAmount(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-8 pr-3 text-base font-black text-white focus:border-brand focus:outline-none"
                    />
                  </div>

                  {/* Quick adjustments */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 py-1">Quick Add:</span>
                    {[
                      { label: "Base Fee", val: paymentModalJob.estimatedAmount },
                      { label: "+₹299 Gas Topup", val: paymentModalJob.estimatedAmount + 299 },
                      { label: "+₹450 Capacitor", val: paymentModalJob.estimatedAmount + 450 },
                      { label: "+₹950 Deep Coil Wash", val: paymentModalJob.estimatedAmount + 950 },
                    ].map((adj, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPaymentCollectAmount(adj.val)}
                        className={`rounded-lg px-2 py-0.5 text-[10px] font-bold border transition-all ${
                          paymentCollectAmount === adj.val
                            ? "border-brand bg-brand/20 text-brand"
                            : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                        }`}
                      >
                        {adj.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method Selector Tabs */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Select Collection Method:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "UPI / QR Code", label: "📱 UPI / QR", sub: "GPay/PhonePe" },
                      { id: "Cash on Delivery", label: "💵 Cash", sub: "Handover" },
                      { id: "Credit / Debit Card", label: "💳 Card/POS", sub: "Card Swipe" },
                    ].map((m) => {
                      const active = paymentMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                          className={`rounded-xl border p-2.5 text-center transition-all cursor-pointer ${
                            active
                              ? "border-brand bg-brand text-brand-foreground shadow-md font-black"
                              : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 font-bold"
                          }`}
                        >
                          <div className="text-xs">{m.label}</div>
                          <div
                            className={`text-[9px] mt-0.5 ${
                              active ? "text-brand-foreground/80 font-bold" : "text-slate-500"
                            }`}
                          >
                            {m.sub}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* METHOD 1: DYNAMIC UPI QR CODE */}
                {paymentMethod === "UPI / QR Code" && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                    <div className="text-center space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Scan with GPay, PhonePe, Paytm, BHIM
                      </span>
                      <div className="text-xs font-bold text-white">
                        EGS Merchant UPI: <span className="font-mono text-brand">{EGS_COMPANY_DETAILS.bankDetails.upiId}</span>
                      </div>
                    </div>

                    {/* QR Code Container */}
                    <div className="mx-auto flex size-48 items-center justify-center rounded-2xl bg-white p-2 shadow-inner border-2 border-slate-700">
                      <img
                        src={getUPIQRCodeUrl(
                          generateUPIPaymentUrl(paymentCollectAmount, paymentModalJob.id),
                          240
                        )}
                        alt="EGS INDIA UPI QR Code"
                        className="size-full object-contain rounded-lg"
                      />
                    </div>

                    {/* Quick 1-tap open in mobile UPI app or Copy UPI ID */}
                    <div className="flex gap-2 justify-center text-xs">
                      <a
                        href={generateUPIPaymentUrl(paymentCollectAmount, paymentModalJob.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 font-bold text-brand hover:border-brand"
                      >
                        <ExternalLink className="size-3.5" />
                        <span>Open UPI App</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(EGS_COMPANY_DETAILS.bankDetails.upiId);
                          setCopiedUpiNotice(true);
                          setTimeout(() => setCopiedUpiNotice(false), 2500);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 font-bold text-slate-300 hover:text-white"
                      >
                        <Copy className="size-3.5" />
                        <span>{copiedUpiNotice ? "Copied!" : "Copy VPA"}</span>
                      </button>
                    </div>

                    {/* UTR reference input */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Customer UPI Transaction UTR / Ref ID (Optional):
                      </label>
                      <input
                        type="text"
                        value={paymentUtrRef}
                        onChange={(e) => setPaymentUtrRef(e.target.value)}
                        placeholder="e.g. 429188491023 (12-digit UTR)"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white placeholder:text-slate-500 focus:border-brand focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* METHOD 2: CASH ON DELIVERY */}
                {paymentMethod === "Cash on Delivery" && (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2.5 text-xs">
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <CheckCircle2 className="size-4" />
                      <span>Physical Cash Collection</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Collect ₹{paymentCollectAmount.toLocaleString("en-IN")} in cash directly from {paymentModalJob.customerName}. Once verified, confirm below to issue digital receipt &amp; 30-day guarantee.
                    </p>
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Cash Slip / Denomination Notes:
                      </label>
                      <input
                        type="text"
                        value={paymentUtrRef}
                        onChange={(e) => setPaymentUtrRef(e.target.value)}
                        placeholder="e.g. Received ₹1500 cash from customer"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white placeholder:text-slate-500 focus:border-brand focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* METHOD 3: CARD / POS */}
                {paymentMethod === "Credit / Debit Card" && (
                  <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 space-y-2.5 text-xs">
                    <div className="flex items-center gap-2 font-bold text-blue-300">
                      <CreditCard className="size-4" />
                      <span>mPOS Card Swipe / Tap</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Process ₹{paymentCollectAmount.toLocaleString("en-IN")} on portable card machine or digital payment link.
                    </p>
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Card Approval Code / Machine Ref:
                      </label>
                      <input
                        type="text"
                        value={paymentUtrRef}
                        onChange={(e) => setPaymentUtrRef(e.target.value)}
                        placeholder="e.g. AUTH-882910"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white placeholder:text-slate-500 focus:border-brand focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* ACTION CONFIRM BUTTON */}
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentModalJob(null)}
                    className="flex-1 rounded-xl border border-slate-700 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (paymentCollectAmount <= 0) return;
                      const result = recordBookingPayment(
                        paymentModalJob.id,
                        paymentMethod,
                        paymentCollectAmount,
                        paymentUtrRef,
                        currentTechnician?.id || selectedTechId,
                        currentTechnician?.name || "Arun Kumar",
                        paymentNotes || `Field payment received via ${paymentMethod}`
                      );
                      setPaymentSuccessResult(result);
                      setActionSuccessNotice(`Payment of ₹${paymentCollectAmount} recorded! Status: PAYMENT RECEIVED.`);
                      refreshData();
                    }}
                    className="flex-2 rounded-xl bg-brand py-3 text-xs font-black uppercase tracking-wider text-brand-foreground shadow-lg shadow-brand/30 hover:bg-brand/90 transition-transform active:scale-98 cursor-pointer"
                  >
                    Confirm Payment (₹{paymentCollectAmount.toLocaleString("en-IN")})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: DIGITAL RECEIPT & 30-DAY GUARANTEE VIEWER */}
      {/* ============================================================ */}
      {receiptModalJob && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-3 overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  Digital Service Receipt
                </span>
                <h3 className="font-black text-white text-base mt-0.5">
                  {receiptModalJob.serviceName}
                </h3>
                <p className="text-xs text-slate-400">
                  {receiptModalJob.id} • {receiptModalJob.customerName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReceiptModalJob(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Receipt Summary Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Invoice Number:</span>
                <span className="font-mono font-bold text-brand">
                  INV-2026-{receiptModalJob.id.replace(/\D/g, "") || "1088"}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-black text-white text-sm">
                  ₹{receiptModalJob.estimatedAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Tax Breakdown (18% GST):</span>
                <span className="text-slate-300">
                  CGST (9%) + SGST (9%)
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Serviced By:</span>
                <span className="font-semibold text-slate-200">
                  {receiptModalJob.assignedTechnicianName || currentTechnician?.name || "EGS Specialist"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Warranty Certificate:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="size-3.5" /> 30-Day Active
                </span>
              </div>
            </div>

            {/* Official Stamped Guarantee Box */}
            <div className="rounded-2xl border-2 border-dashed border-emerald-500/40 bg-emerald-500/10 p-4 text-center space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                🛡️ Stamped Post-Service Warranty
              </div>
              <div className="text-xs font-bold text-white">
                Expert Goods &amp; Services (EGS INDIA)
              </div>
              <p className="text-[11px] text-slate-300">
                Covers free re-visit, leak diagnostics, and cooling performance check for 30 calendar days from service completion.
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-2 pt-1">
              <a
                href={generatePaymentReceiptWhatsAppURL({
                  id: `TXN-2026-${receiptModalJob.id.replace(/\D/g, "") || "8801"}`,
                  invoiceNo: `INV-2026-${receiptModalJob.id.replace(/\D/g, "") || "1088"}`,
                  bookingId: receiptModalJob.id,
                  customerName: receiptModalJob.customerName,
                  phone: receiptModalJob.phone,
                  whatsapp: receiptModalJob.whatsappNumber || receiptModalJob.phone,
                  amount: receiptModalJob.estimatedAmount,
                  subtotal: Math.round(receiptModalJob.estimatedAmount / 1.18),
                  taxAmount: Math.round(receiptModalJob.estimatedAmount - receiptModalJob.estimatedAmount / 1.18),
                  paymentMethod: "UPI / QR Code",
                  status: "PAID",
                  serviceName: receiptModalJob.serviceName,
                  createdAt: receiptModalJob.createdAt,
                  paidAt: new Date().toISOString(),
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#25D366]/25"
              >
                <MessageSquare className="size-4 fill-current" />
                <span>Re-send Receipt via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setReceiptModalJob(null)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE STICKY BOTTOM EMERGENCY DISPATCH HELPLINE */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md p-3">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="size-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-white">EGS Dispatch Desk</div>
              <div className="text-[10px] text-slate-400">Escalation & Parts Pickup</div>
            </div>
          </div>

          <a
            href={`tel:${EGS_CALL_NUMBER}`}
            className="flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 text-xs font-black text-brand-foreground shadow-md shadow-brand/20 active:scale-95"
          >
            <Phone className="size-3.5" />
            <span>Call Dispatch</span>
          </a>
        </div>
      </div>
    </div>
  );
}
