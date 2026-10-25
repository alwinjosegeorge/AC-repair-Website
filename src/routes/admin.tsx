import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Booking,
  Technician,
  AMCContract,
  BookingStatus,
  getBookings,
  getTechnicians,
  getAMCContracts,
  updateBookingStatus,
  generateAdminToCustomerWhatsAppURL,
  EGS_CALL_NUMBER,
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
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "EGS Admin & CRM Portal | Bookings, Technicians & AMC" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

type Tab = "bookings" | "customers" | "technicians" | "amc" | "reports";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [amcContracts, setAmcContracts] = useState<AMCContract[]>([]);

  // Search & Filter state for Bookings
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Load store data
  const loadData = () => {
    setBookings(getBookings());
    setTechnicians(getTechnicians());
    setAmcContracts(getAMCContracts());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.phone.includes(searchQuery) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      const matchesCity = cityFilter === "all" || b.city === cityFilter;

      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [bookings, searchQuery, statusFilter, cityFilter]);

  // Derived Customers List from Bookings
  const customersList = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; city: string; count: number; totalSpend: number; lastDate: string }>();
    bookings.forEach((b) => {
      const key = b.phone;
      if (!map.has(key)) {
        map.set(key, {
          name: b.customerName,
          phone: b.phone,
          city: b.city,
          count: 1,
          totalSpend: b.estimatedAmount,
          lastDate: b.createdAt,
        });
      } else {
        const item = map.get(key)!;
        item.count += 1;
        item.totalSpend += b.estimatedAmount;
        if (new Date(b.createdAt) > new Date(item.lastDate)) {
          item.lastDate = b.createdAt;
        }
      }
    });
    return Array.from(map.values());
  }, [bookings]);

  // Handle Status Update
  const handleStatusChange = (bookingId: string, newStatus: BookingStatus, techId?: string) => {
    const updated = updateBookingStatus(bookingId, newStatus, techId);
    if (updated) {
      loadData();
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking(updated);
      }
    }
  };

  // KPI Metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.estimatedAmount || 0), 0);
  const newBookingsCount = bookings.filter((b) => b.status === "new").length;
  const inProgressCount = bookings.filter((b) => b.status === "in_progress" || b.status === "technician_assigned").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;

  // Attribution breakdown
  const attributionStats = useMemo(() => {
    const counts: Record<string, number> = { google: 0, meta: 0, direct: 0, other: 0 };
    bookings.forEach((b) => {
      const src = (b.attribution?.utm_source || "direct").toLowerCase();
      if (src.includes("google")) counts.google += 1;
      else if (src.includes("meta") || src.includes("facebook") || src.includes("instagram")) counts.meta += 1;
      else if (src.includes("direct")) counts.direct += 1;
      else counts.other += 1;
    });
    return counts;
  }, [bookings]);

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "new":
        return <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-600">New Lead</span>;
      case "confirmed":
        return <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600">Confirmed</span>;
      case "technician_assigned":
        return <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600">Tech Assigned</span>;
      case "in_progress":
        return <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-bold text-purple-600">In Progress</span>;
      case "completed":
        return <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-700">Completed ✓</span>;
      case "cancelled":
        return <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-bold text-destructive">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface/50 text-foreground font-sans">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background px-4 py-3 md:px-8 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <img src="/logo-full.png" alt="EGS INDIA" className="h-9 w-auto object-contain" />
            </Link>
            <div className="h-5 w-px bg-border" />
            <span className="rounded-md bg-brand-soft px-2.5 py-1 text-xs font-black uppercase tracking-wider text-brand">
              Admin & Operations CRM
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadData}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-surface"
            >
              <RefreshCw className="size-3.5" />
              <span>Refresh</span>
            </button>
            <Link
              to="/"
              className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-brand"
            >
              <span>Live Website</span>
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 space-y-6">
        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Bookings
            </span>
            <div className="mt-2 text-2xl font-black text-foreground">{bookings.length}</div>
            <span className="text-[11px] text-emerald-600 font-semibold">{newBookingsCount} Action required</span>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Est. Service Value
            </span>
            <div className="mt-2 text-2xl font-black text-brand">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-muted-foreground">Gross leads value</span>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Jobs In Progress
            </span>
            <div className="mt-2 text-2xl font-black text-amber-500">{inProgressCount}</div>
            <span className="text-[11px] text-muted-foreground">Active technicians on site</span>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Completed
            </span>
            <div className="mt-2 text-2xl font-black text-emerald-600">{completedCount}</div>
            <span className="text-[11px] text-muted-foreground">With 30-day warranty</span>
          </div>

          <div className="col-span-2 sm:col-span-1 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Ad Attribution
            </span>
            <div className="mt-1 flex items-center gap-2 text-xs font-bold">
              <span className="text-blue-600">Google: {attributionStats.google}</span>
              <span>•</span>
              <span className="text-pink-600">Meta: {attributionStats.meta}</span>
            </div>
            <span className="text-[11px] text-muted-foreground">Direct/Organic: {attributionStats.direct + attributionStats.other}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
              activeTab === "bookings"
                ? "bg-brand text-brand-foreground shadow"
                : "text-muted-foreground hover:bg-card hover:text-foreground"
            }`}
          >
            <CalendarCheck className="size-4" />
            <span>Service Bookings ({bookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("customers")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
              activeTab === "customers"
                ? "bg-brand text-brand-foreground shadow"
                : "text-muted-foreground hover:bg-card hover:text-foreground"
            }`}
          >
            <Users className="size-4" />
            <span>Customers ({customersList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("technicians")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
              activeTab === "technicians"
                ? "bg-brand text-brand-foreground shadow"
                : "text-muted-foreground hover:bg-card hover:text-foreground"
            }`}
          >
            <HardHat className="size-4" />
            <span>Technicians ({technicians.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("amc")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
              activeTab === "amc"
                ? "bg-brand text-brand-foreground shadow"
                : "text-muted-foreground hover:bg-card hover:text-foreground"
            }`}
          >
            <FileCheck2 className="size-4" />
            <span>AMC Contracts ({amcContracts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
              activeTab === "reports"
                ? "bg-brand text-brand-foreground shadow"
                : "text-muted-foreground hover:bg-card hover:text-foreground"
            }`}
          >
            <TrendingUp className="size-4" />
            <span>Ad & Lead Attribution</span>
          </button>
        </div>

        {/* TAB 1: BOOKINGS MANAGER */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search customer, phone, ID (e.g. EGS-2026-1089)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface/50 py-2 pl-10 pr-4 text-xs font-medium text-foreground focus:border-brand focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-border bg-surface/50 px-3 py-2 text-xs font-bold text-foreground focus:border-brand focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New Leads</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="technician_assigned">Tech Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="rounded-xl border border-border bg-surface/50 px-3 py-2 text-xs font-bold text-foreground focus:border-brand focus:outline-none"
                >
                  <option value="all">All Cities</option>
                  <option value="Kollam">Kollam</option>
                  <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                  <option value="Ernakulam">Ernakulam</option>
                  <option value="Thrissur">Thrissur</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-surface/60 text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3.5">Booking Ref</th>
                    <th className="p-3.5">Customer & City</th>
                    <th className="p-3.5">Service & AC</th>
                    <th className="p-3.5">Slot / Date</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Source / UTM</th>
                    <th className="p-3.5">Est. Total</th>
                    <th className="p-3.5 text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-sm text-muted-foreground">
                        No service bookings match your search filters.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr
                        key={b.id}
                        className="hover:bg-surface/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedBooking(b)}
                      >
                        <td className="p-3.5 font-black text-brand whitespace-nowrap">
                          {b.id}
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-foreground">{b.customerName}</div>
                          <div className="text-[11px] text-muted-foreground">{b.phone} • {b.city}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-foreground">{b.serviceName}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {b.acBrand} {b.acType} ({b.unitCount} Unit)
                          </div>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="font-medium text-foreground">{b.preferredDate}</div>
                          <div className="text-[11px] text-muted-foreground">{b.preferredSlot}</div>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          {getStatusBadge(b.status)}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 rounded-md bg-surface px-2 py-0.5 text-[10px] font-bold text-foreground border border-border">
                            <Tag className="size-3 text-brand" />
                            {b.attribution?.utm_source || "direct"} / {b.attribution?.utm_medium || "web"}
                          </span>
                        </td>
                        <td className="p-3.5 font-black text-foreground whitespace-nowrap">
                          ₹{b.estimatedAmount}
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {/* 1-Click WhatsApp to Customer */}
                            <a
                              href={generateAdminToCustomerWhatsAppURL(b, "confirm")}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Send Confirmation on WhatsApp"
                              className="flex size-7 items-center justify-center rounded-lg bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                            >
                              <MessageSquare className="size-3.5" />
                            </a>

                            {/* Direct Call Customer */}
                            <a
                              href={`tel:${b.phone}`}
                              title="Call Customer"
                              className="flex size-7 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-surface"
                            >
                              <Phone className="size-3.5" />
                            </a>

                            {/* Quick Status Select */}
                            <select
                              value={b.status}
                              onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                              className="rounded-lg border border-border bg-card px-2 py-1 text-[11px] font-bold text-foreground focus:border-brand focus:outline-none"
                            >
                              <option value="new">New</option>
                              <option value="confirmed">Confirm</option>
                              <option value="technician_assigned">Assign Tech</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancel</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Detailed Slide-Over Modal for Selected Booking */}
            {selectedBooking && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                <div className="relative w-full max-w-2xl rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-start justify-between border-b border-border pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-brand">{selectedBooking.id}</span>
                        {getStatusBadge(selectedBooking.status)}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Booked on {new Date(selectedBooking.createdAt).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedBooking(null)}
                      className="rounded-xl border border-border px-3 py-1 text-xs font-bold hover:bg-surface"
                    >
                      Close ✕
                    </button>
                  </div>

                  {/* Customer & Address Details */}
                  <div className="grid gap-4 sm:grid-cols-2 rounded-2xl bg-surface/60 p-4 text-xs">
                    <div>
                      <span className="text-muted-foreground font-semibold uppercase text-[10px]">
                        Customer Details
                      </span>
                      <div className="mt-1 font-bold text-sm text-foreground">{selectedBooking.customerName}</div>
                      <div className="text-foreground">{selectedBooking.phone}</div>
                      {selectedBooking.alternatePhone && (
                        <div className="text-muted-foreground">Alt: {selectedBooking.alternatePhone}</div>
                      )}
                      {selectedBooking.email && <div className="text-muted-foreground">{selectedBooking.email}</div>}
                    </div>

                    <div>
                      <span className="text-muted-foreground font-semibold uppercase text-[10px]">
                        Service Location
                      </span>
                      <div className="mt-1 font-medium text-foreground">{selectedBooking.address}</div>
                      {selectedBooking.landmark && (
                        <div className="text-muted-foreground">Near: {selectedBooking.landmark}</div>
                      )}
                      <div className="font-bold text-brand">{selectedBooking.city} - {selectedBooking.pincode}</div>
                    </div>
                  </div>

                  {/* Service Specifics */}
                  <div className="space-y-2 text-xs border border-border rounded-2xl p-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Name:</span>
                      <span className="font-bold text-foreground">{selectedBooking.serviceName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Specific Issue / Work:</span>
                      <span className="font-medium text-foreground">{selectedBooking.subService}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Appliance:</span>
                      <span className="font-medium text-foreground">
                        {selectedBooking.acBrand} {selectedBooking.acType} ({selectedBooking.unitCount} Unit)
                      </span>
                    </div>
                    {selectedBooking.issueDescription && (
                      <div className="pt-2 border-t border-border">
                        <span className="text-muted-foreground block text-[11px]">Customer Note:</span>
                        <p className="mt-0.5 text-foreground italic">"{selectedBooking.issueDescription}"</p>
                      </div>
                    )}
                  </div>

                  {/* Technician Assignment */}
                  <div className="rounded-2xl border border-brand/20 bg-brand/5 p-4 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand">
                      Assign Technician
                    </span>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <select
                        value={selectedBooking.assignedTechnicianId || ""}
                        onChange={(e) => {
                          const techId = e.target.value;
                          handleStatusChange(
                            selectedBooking.id,
                            techId ? "technician_assigned" : selectedBooking.status,
                            techId
                          );
                        }}
                        className="flex-1 rounded-xl border border-border bg-card p-2 text-xs font-semibold text-foreground focus:border-brand focus:outline-none"
                      >
                        <option value="">Select Technician...</option>
                        {technicians.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.city}) - ⭐ {t.rating} ({t.status === "available" ? "Free" : "On Job"})
                          </option>
                        ))}
                      </select>

                      {/* 1-Click WhatsApp to Customer with Technician Dispatched */}
                      <a
                        href={generateAdminToCustomerWhatsAppURL(selectedBooking, "tech_dispatched")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-bold text-white shadow hover:opacity-90"
                      >
                        <MessageSquare className="size-3.5" />
                        Send Tech ETA on WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Ad & Attribution Tracking Details */}
                  <div className="rounded-2xl border border-border bg-surface/40 p-4 text-xs space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block mb-2">
                      Ad Campaign Attribution Data (UTM & Clicks)
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-muted-foreground">Source / Medium: </span>
                        <strong className="text-foreground">
                          {selectedBooking.attribution?.utm_source || "direct"} / {selectedBooking.attribution?.utm_medium || "none"}
                        </strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Campaign: </span>
                        <strong className="text-foreground">
                          {selectedBooking.attribution?.utm_campaign || "N/A"}
                        </strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Search Keyword: </span>
                        <strong className="text-foreground">
                          {selectedBooking.attribution?.utm_term || "N/A"}
                        </strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Google Click ID (gclid): </span>
                        <span className="font-mono text-[10px] text-brand">
                          {selectedBooking.attribution?.gclid ? selectedBooking.attribution.gclid.substring(0, 16) + "..." : "None"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Completion Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(selectedBooking.id, "completed")}
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        Mark as Completed ✓
                      </button>
                      <a
                        href={generateAdminToCustomerWhatsAppURL(selectedBooking, "completed")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface"
                      >
                        Send Warranty on WhatsApp
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedBooking.id, "cancelled")}
                      className="text-xs font-bold text-destructive hover:underline"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CUSTOMERS */}
        {activeTab === "customers" && (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-black text-foreground">Customer Database</h2>
              <p className="text-xs text-muted-foreground">
                Aggregated customer records, booking history, lifetime spend, and location.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-surface/50 text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">City</th>
                    <th className="p-3">Total Bookings</th>
                    <th className="p-3">Total Spend</th>
                    <th className="p-3">Last Active</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {customersList.map((c, i) => (
                    <tr key={i} className="hover:bg-surface/40">
                      <td className="p-3 font-bold text-foreground">{c.name}</td>
                      <td className="p-3 font-medium text-foreground">{c.phone}</td>
                      <td className="p-3 text-muted-foreground">{c.city}</td>
                      <td className="p-3">
                        <span className="rounded-md bg-brand-soft px-2 py-0.5 text-xs font-bold text-brand">
                          {c.count} Service{c.count > 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="p-3 font-black text-foreground">₹{c.totalSpend}</td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(c.lastDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="p-3 text-right">
                        <a
                          href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
                        >
                          <MessageSquare className="size-3.5" />
                          Chat
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TECHNICIANS */}
        {activeTab === "technicians" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-foreground">Certified Field Technicians</h2>
                <p className="text-xs text-muted-foreground">
                  Police verified, HVAC certified personnel across all Kerala and Chennai hubs.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {technicians.map((t) => (
                <div key={t.id} className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-foreground text-sm">{t.name}</h3>
                      <span className="text-xs text-muted-foreground">{t.city} • {t.experienceYears} Years Exp</span>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        t.status === "available"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {t.status === "available" ? "Available" : "On Job"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-amber-500">⭐ {t.rating} Rating</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{t.activeJobsCount} Active Jobs</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {t.specialization.map((s, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-surface border border-border px-2 py-0.5 text-[10px] font-semibold text-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                    <a
                      href={`tel:${t.phone}`}
                      className="font-bold text-brand hover:underline flex items-center gap-1"
                    >
                      <Phone className="size-3" />
                      {t.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AMC CONTRACTS */}
        {activeTab === "amc" && (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-foreground">Annual Maintenance Contracts (AMC)</h2>
                <p className="text-xs text-muted-foreground">
                  Active contracts, renewal dates, and scheduled service tracking.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-surface/50 text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3">Contract No</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Plan</th>
                    <th className="p-3">Units</th>
                    <th className="p-3">Expiry Date</th>
                    <th className="p-3">Services Status</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Reminder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {amcContracts.map((a) => (
                    <tr key={a.id} className="hover:bg-surface/40">
                      <td className="p-3 font-bold text-brand">{a.contractNo}</td>
                      <td className="p-3">
                        <div className="font-bold text-foreground">{a.customerName}</div>
                        <div className="text-[11px] text-muted-foreground">{a.phone} • {a.city}</div>
                      </td>
                      <td className="p-3 font-semibold text-foreground">{a.planName}</td>
                      <td className="p-3 font-medium text-foreground">{a.unitsCovered} Units</td>
                      <td className="p-3 font-medium text-foreground">{a.expiryDate}</td>
                      <td className="p-3">
                        <div className="font-bold text-foreground">
                          {a.servicesCompleted} of {a.servicesIncluded} Completed
                        </div>
                        <div className="w-24 bg-muted h-1.5 rounded-full mt-1 overflow-hidden">
                          <div
                            className="bg-brand h-full rounded-full"
                            style={{ width: `${(a.servicesCompleted / a.servicesIncluded) * 100}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                            a.status === "active"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-amber-500/10 text-amber-600 animate-pulse"
                          }`}
                        >
                          {a.status === "active" ? "Active" : "Expiring Soon"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <a
                          href={`https://wa.me/${a.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                            `Hello ${a.customerName}! Your EGS INDIA AC AMC contract (${a.contractNo}) has an upcoming scheduled wet service. Reply to book your technician slot.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-[#25D366]/10 px-2.5 py-1 text-xs font-bold text-[#25D366] hover:bg-[#25D366]/20"
                        >
                          <MessageSquare className="size-3" />
                          Remind
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: REPORTS & ATTRIBUTION */}
        {activeTab === "reports" && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h2 className="text-base font-black text-foreground">Campaign Lead Breakdown</h2>
              <p className="text-xs text-muted-foreground">
                Tracks Google Ads (gclid), Meta Pixel (fbclid), and organic search conversions.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">Google Ads (Search & Local)</span>
                  <span className="font-black text-brand">{attributionStats.google} Leads</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${(attributionStats.google / Math.max(1, bookings.length)) * 100}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="font-bold text-foreground">Meta Ads (Instagram & Facebook)</span>
                  <span className="font-black text-pink-600">{attributionStats.meta} Leads</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-pink-500 rounded-full"
                    style={{
                      width: `${(attributionStats.meta / Math.max(1, bookings.length)) * 100}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="font-bold text-foreground">Direct & Organic Search</span>
                  <span className="font-black text-emerald-600">{attributionStats.direct + attributionStats.other} Leads</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${((attributionStats.direct + attributionStats.other) / Math.max(1, bookings.length)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h2 className="text-base font-black text-foreground">EGS Growth & Scalability Readiness</h2>
              <p className="text-xs text-muted-foreground">
                Architectural capabilities ready for future scaling:
              </p>

              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Full UTM Extraction:</strong> Automatic capture of gclid, fbclid, campaign, ad group, and landing page on every lead.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Technician App Ready:</strong> API endpoints and status models (`new` → `confirmed` → `assigned` → `in_progress` → `completed`).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Automated Invoicing & WhatsApp:</strong> Preformatted direct message generator for ETA, billing, and warranty receipt.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Neon Postgres / Supabase Sync:</strong> State models mapped for direct zero-downtime database migration.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
