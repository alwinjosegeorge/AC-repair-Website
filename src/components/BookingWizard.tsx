import { useState, useEffect } from "react";
import {
  AirVent,
  Wrench,
  Cog,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import {
  Booking,
  ServiceCategory,
  ACType,
  saveBooking,
  generateCustomerWhatsAppURL,
  EGS_CALL_NUMBER,
} from "../lib/store";
import {
  trackBookingStep,
  trackBookingComplete,
  trackWhatsAppClick,
} from "../lib/tracking";

interface BookingWizardProps {
  initialCategory?: ServiceCategory;
  onSuccess?: (booking: Booking) => void;
  className?: string;
  isModal?: boolean;
}

const SERVICES_DATA = [
  {
    id: "ac-service" as ServiceCategory,
    title: "AC Deep Service",
    badge: "Most Popular",
    priceText: "From ₹499",
    icon: AirVent,
    desc: "Jet pump wash, chemical foam cleaning, filter disinfection & 10-point checkup.",
    subServices: [
      "Deep Jet Power Cleaning (Indoor + Outdoor)",
      "Chemical Foam Wash & Coil Disinfection",
      "Basic Filter & Drainage Pipe Flush",
      "Pre-Summer Complete Servicing",
    ],
    defaultAmount: 499,
  },
  {
    id: "ac-repair" as ServiceCategory,
    title: "AC Repair & Fix",
    badge: "90-Min Response",
    priceText: "From ₹399",
    icon: Wrench,
    desc: "Cooling issues, gas refill, water leaking, unusual noise, PCB & compressor repairs.",
    subServices: [
      "AC Not Cooling / Less Cooling Issue",
      "Water Leakage & Drainage Block",
      "Gas Leakage Check & R32 / R410A Refill",
      "Compressor / Fan Motor Failure",
      "PCB Board Repair & Power Trip",
    ],
    defaultAmount: 599,
  },
  {
    id: "ac-installation" as ServiceCategory,
    title: "Installation & Shift",
    badge: "Certified Pros",
    priceText: "From ₹1,199",
    icon: Cog,
    desc: "Precision wall mounting, core drilling, vacuuming, copper piping & safe dismantling.",
    subServices: [
      "New Split AC Complete Installation",
      "Old AC Uninstallation / Dismantling",
      "AC Relocation (Uninstallation + Re-fitting)",
      "Window AC Fitting with Wooden/Iron Frame",
    ],
    defaultAmount: 1199,
  },
  {
    id: "ac-amc" as ServiceCategory,
    title: "AC AMC Contract",
    badge: "Save 40%",
    priceText: "From ₹1,999/yr",
    icon: ShieldCheck,
    desc: "Annual maintenance contracts for homes & businesses with free unlimited breakdown visits.",
    subServices: [
      "Residential Saver Plan (3 Free Wet Services + 1 Free Breakdown)",
      "Comprehensive Care AMC (Wet Services + Spare Parts + Gas Top-up)",
      "Multi-Unit Residential Society AMC",
    ],
    defaultAmount: 1999,
  },
  {
    id: "commercial-hvac" as ServiceCategory,
    title: "Commercial HVAC",
    badge: "B2B Solutions",
    priceText: "Custom Quote",
    icon: Building2,
    desc: "VRV/VRF systems, ductable ACs, chillers, server room precision ACs & central plants.",
    subServices: [
      "VRV / VRF System Installation & Diagnostic",
      "Ductable Split AC Servicing & Duct Cleaning",
      "Chiller Plant & Air Handling Unit (AHU) Checkup",
      "Server Room Precision AC Maintenance",
    ],
    defaultAmount: 3500,
  },
];

const AC_TYPES: ACType[] = [
  "Split AC",
  "Window AC",
  "Cassette AC",
  "Tower AC",
  "Central / VRV",
];

const TOP_BRANDS = [
  "Daikin",
  "Voltas",
  "LG",
  "Blue Star",
  "Mitsubishi",
  "Panasonic",
  "Lloyd",
  "Hitachi",
  "Carrier",
  "O General",
  "Other",
];

const TIME_SLOTS = [
  "Morning (9:00 AM - 12:00 PM)",
  "Afternoon (12:00 PM - 3:00 PM)",
  "Evening (3:00 PM - 7:00 PM)",
  "Night Express (7:00 PM - 9:00 PM)",
];

const MAJOR_CITIES = [
  "Kollam",
  "Thiruvananthapuram",
  "Ernakulam / Cochin",
  "Thrissur",
  "Chennai",
  "Kozhikode",
  "Other Kerala City",
];

export function BookingWizard({
  initialCategory = "ac-service",
  onSuccess,
  className = "",
  isModal = false,
}: BookingWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>(initialCategory);
  const [selectedSubService, setSelectedSubService] = useState<string>("");
  const [acType, setAcType] = useState<ACType>("Split AC");
  const [acBrand, setAcBrand] = useState("Daikin");
  const [unitCount, setUnitCount] = useState(1);
  const [issueDescription, setIssueDescription] = useState("");

  const [dateOption, setDateOption] = useState<"today" | "tomorrow" | "custom">("today");
  const [customDate, setCustomDate] = useState("");
  const [preferredSlot, setPreferredSlot] = useState(TIME_SLOTS[0]);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Kollam");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Update initial category if prop changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      const svc = SERVICES_DATA.find((s) => s.id === initialCategory);
      if (svc && svc.subServices.length > 0) {
        setSelectedSubService(svc.subServices[0]);
      }
    }
  }, [initialCategory]);

  // Set default sub-service on category select
  const handleCategorySelect = (catId: ServiceCategory) => {
    setSelectedCategory(catId);
    const svc = SERVICES_DATA.find((s) => s.id === catId);
    if (svc && svc.subServices.length > 0) {
      setSelectedSubService(svc.subServices[0]);
    }
  };

  const currentServiceObj =
    SERVICES_DATA.find((s) => s.id === selectedCategory) || SERVICES_DATA[0];

  const estimatedTotal =
    selectedCategory === "commercial-hvac"
      ? currentServiceObj.defaultAmount
      : currentServiceObj.defaultAmount * unitCount;

  // Step 1 -> 2
  const goToStep2 = () => {
    if (!selectedSubService) {
      setSelectedSubService(currentServiceObj.subServices[0]);
    }
    trackBookingStep(2, "Appliance Details", selectedCategory);
    setStep(2);
    setErrorMsg("");
  };

  // Step 2 -> 3
  const goToStep3 = () => {
    trackBookingStep(3, "Schedule Slot", selectedCategory);
    setStep(3);
    setErrorMsg("");
  };

  // Step 3 -> 4
  const goToStep4 = () => {
    if (dateOption === "custom" && !customDate) {
      setErrorMsg("Please select your preferred service date.");
      return;
    }
    trackBookingStep(4, "Contact & Location", selectedCategory);
    setStep(4);
    setErrorMsg("");
  };

  // Step 4 -> 5 (Submit)
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!customerName.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!address.trim()) {
      setErrorMsg("Please enter your service address.");
      return;
    }

    const preferredDateString =
      dateOption === "today"
        ? "Today (Express Slot)"
        : dateOption === "tomorrow"
        ? "Tomorrow"
        : customDate || "Earliest Available";

    const booking = saveBooking({
      serviceCategory: selectedCategory,
      serviceName: currentServiceObj.title,
      subService: selectedSubService || currentServiceObj.subServices[0],
      acType,
      acBrand,
      unitCount,
      issueDescription: issueDescription.trim() || undefined,
      preferredDate: preferredDateString,
      preferredSlot,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim(),
      landmark: landmark.trim() || undefined,
      city,
      pincode: pincode.trim() || "691001",
      specialNotes: specialNotes.trim() || undefined,
      estimatedAmount: estimatedTotal,
    });

    trackBookingComplete({
      bookingId: booking.id,
      service: booking.serviceName,
      amount: booking.estimatedAmount,
      city: booking.city,
    });

    setCreatedBooking(booking);
    setStep(5);
    if (onSuccess) onSuccess(booking);
  };

  return (
    <div
      className={`rounded-3xl border border-border bg-card p-5 md:p-8 shadow-2xl transition-all ${className}`}
    >
      {/* Progress Header */}
      {step < 5 && (
        <div className="mb-6 border-b border-border/80 pb-5">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>
              Step {step} of 4:{" "}
              {step === 1 && "Choose Service"}
              {step === 2 && "Appliance Details"}
              {step === 3 && "Date & Time"}
              {step === 4 && "Contact & Address"}
            </span>
            <span className="text-brand font-bold">
              Est: ₹{estimatedTotal.toLocaleString("en-IN")}
            </span>
          </div>
          {/* Visual Step Bar */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  step >= i ? "bg-brand" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-sm font-medium text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: SELECT SERVICE */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
              Select HVAC Service Required
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose your service category to see instant pricing and verified technician slots.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES_DATA.map((svc) => {
              const Icon = svc.icon;
              const isSelected = selectedCategory === svc.id;
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => handleCategorySelect(svc.id)}
                  className={`group relative flex flex-col items-start justify-between rounded-2xl border p-4 text-left transition-all ${
                    isSelected
                      ? "border-brand bg-brand/5 shadow-md ring-2 ring-brand/30"
                      : "border-border bg-surface/50 hover:border-brand/40 hover:bg-surface"
                  }`}
                >
                  <div className="flex w-full items-start justify-between">
                    <div
                      className={`flex size-11 items-center justify-center rounded-xl transition-colors ${
                        isSelected
                          ? "bg-brand text-brand-foreground shadow-sm"
                          : "bg-background text-foreground group-hover:bg-brand/10 group-hover:text-brand"
                      }`}
                    >
                      <Icon className="size-6" />
                    </div>
                    <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-bold text-brand">
                      {svc.badge}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-bold text-foreground text-base">{svc.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {svc.desc}
                    </p>
                  </div>

                  <div className="mt-4 flex w-full items-center justify-between border-t border-border/60 pt-3">
                    <span className="text-xs font-black text-brand">{svc.priceText}</span>
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? "text-brand" : "text-muted-foreground"
                      }`}
                    >
                      {isSelected ? "Selected ✓" : "Select"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sub Service Checklist */}
          <div className="rounded-2xl border border-border bg-surface/40 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Specific Requirement:
            </h4>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {currentServiceObj.subServices.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubService(sub)}
                  className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition-all ${
                    selectedSubService === sub
                      ? "border-brand bg-brand text-brand-foreground shadow-sm"
                      : "border-border bg-card text-foreground hover:border-brand/40"
                  }`}
                >
                  <div
                    className={`size-4 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedSubService === sub
                        ? "border-white bg-white"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selectedSubService === sub && (
                      <div className="size-2 rounded-full bg-brand" />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm">{sub}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={goToStep2}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-sm font-bold text-brand-foreground shadow-lg shadow-brand/25 transition-all hover:opacity-95 hover:shadow-brand/35"
            >
              Continue to AC Details
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: APPLIANCE DETAILS */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
              Air Conditioner Specifications
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Helps our technicians carry the exact diagnostic tools, gas cylinders, or spares.
            </p>
          </div>

          {/* AC Type */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              AC Type
            </label>
            <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {AC_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAcType(t)}
                  className={`rounded-xl border px-3 py-3 text-center text-xs font-bold transition-all ${
                    acType === t
                      ? "border-brand bg-brand text-brand-foreground shadow-sm"
                      : "border-border bg-surface/50 text-foreground hover:border-brand/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              AC Brand / Manufacturer
            </label>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {TOP_BRANDS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setAcBrand(b)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                    acBrand === b
                      ? "border-brand bg-brand/10 text-brand font-bold ring-1 ring-brand"
                      : "border-border bg-card text-foreground hover:border-brand/30"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Stepper */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-surface/50 p-4">
            <div>
              <span className="font-bold text-foreground text-sm block">Number of AC Units</span>
              <span className="text-xs text-muted-foreground">
                Get up to 15% discount on 2 or more units booked together.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setUnitCount((prev) => Math.max(1, prev - 1))}
                className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-foreground font-bold hover:bg-surface"
              >
                -
              </button>
              <span className="w-8 text-center text-base font-black text-brand">
                {unitCount}
              </span>
              <button
                type="button"
                onClick={() => setUnitCount((prev) => prev + 1)}
                className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-foreground font-bold hover:bg-surface"
              >
                +
              </button>
            </div>
          </div>

          {/* Problem description */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Describe Any Specific Issue (Optional)
            </label>
            <textarea
              rows={2}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="e.g. Water leaking inside bedroom, strange humming sound, not cooling since yesterday..."
              className="mt-2 w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground hover:bg-border/40"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
            <button
              type="button"
              onClick={goToStep3}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3 text-sm font-bold text-brand-foreground shadow-lg shadow-brand/25 hover:opacity-95"
            >
              Select Schedule
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DATE & TIME */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
              Select Date & Preferred Time Slot
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Our technicians operate 7 days a week, 8:00 AM – 9:00 PM across all service locations.
            </p>
          </div>

          {/* Quick Date Options */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Service Day
            </label>
            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setDateOption("today")}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                  dateOption === "today"
                    ? "border-brand bg-brand/5 shadow-md ring-2 ring-brand/30"
                    : "border-border bg-surface/50 hover:border-brand/40"
                }`}
              >
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold text-emerald-600">
                  ⚡ Express Available
                </span>
                <span className="mt-2 text-base font-bold text-foreground">Today</span>
                <span className="text-xs text-muted-foreground">
                  Arrival within 90-120 mins
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDateOption("tomorrow")}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                  dateOption === "tomorrow"
                    ? "border-brand bg-brand/5 shadow-md ring-2 ring-brand/30"
                    : "border-border bg-surface/50 hover:border-brand/40"
                }`}
              >
                <span className="rounded-md bg-brand-soft px-2 py-0.5 text-[10px] font-extrabold text-brand">
                  Guaranteed Slot
                </span>
                <span className="mt-2 text-base font-bold text-foreground">Tomorrow</span>
                <span className="text-xs text-muted-foreground">Full day choice</span>
              </button>

              <button
                type="button"
                onClick={() => setDateOption("custom")}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                  dateOption === "custom"
                    ? "border-brand bg-brand/5 shadow-md ring-2 ring-brand/30"
                    : "border-border bg-surface/50 hover:border-brand/40"
                }`}
              >
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-extrabold text-muted-foreground">
                  Advance Schedule
                </span>
                <span className="mt-2 text-base font-bold text-foreground">Pick a Date</span>
                <span className="text-xs text-muted-foreground">Choose upcoming date</span>
              </button>
            </div>
          </div>

          {dateOption === "custom" && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Choose Specific Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground focus:border-brand focus:outline-none"
              />
            </div>
          )}

          {/* Time Slot */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Preferred Arrival Window
            </label>
            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setPreferredSlot(slot)}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left text-xs sm:text-sm font-semibold transition-all ${
                    preferredSlot === slot
                      ? "border-brand bg-brand text-brand-foreground shadow-sm"
                      : "border-border bg-surface/50 text-foreground hover:border-brand/40"
                  }`}
                >
                  <Clock className="size-4 shrink-0" />
                  <span>{slot}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground hover:bg-border/40"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
            <button
              type="button"
              onClick={goToStep4}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3 text-sm font-bold text-brand-foreground shadow-lg shadow-brand/25 hover:opacity-95"
            >
              Enter Contact Info
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CONTACT & LOCATION */}
      {step === 4 && (
        <form onSubmit={handleSubmitBooking} className="space-y-5">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
              Service Location & Contact Details
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You will receive an instant WhatsApp confirmation with technician live status.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Your Full Name *
              </label>
              <div className="relative mt-1.5">
                <User className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Nair"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Mobile Number (WhatsApp) *
              </label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 9895688833"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Service City *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-card p-2.5 text-sm text-foreground focus:border-brand focus:outline-none"
              >
                {MAJOR_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Pincode
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="e.g. 691001"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-card p-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              House / Flat / Building Address *
            </label>
            <div className="relative mt-1.5">
              <MapPin className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
              <input
                type="text"
                required
                placeholder="e.g. Flat 3A, Green Valley Heights, MG Road"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Landmark (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Near Metro Station / District Hospital"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-card p-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="For invoice and warranty card"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-card p-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Summary Pill before Confirm */}
          <div className="rounded-2xl border border-brand/20 bg-brand/5 p-4 text-xs text-foreground flex items-center justify-between">
            <div>
              <span className="font-bold block text-sm text-brand">
                {currentServiceObj.title} ({unitCount} Unit{unitCount > 1 ? "s" : ""})
              </span>
              <span className="text-muted-foreground">
                {dateOption === "today" ? "Today" : dateOption === "tomorrow" ? "Tomorrow" : customDate} | {preferredSlot}
              </span>
            </div>
            <div className="text-right">
              <span className="text-muted-foreground block text-[11px]">Pay After Service</span>
              <span className="text-base font-black text-brand">
                ₹{estimatedTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground hover:bg-border/40"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-3.5 text-sm font-extrabold text-brand-foreground shadow-xl shadow-brand/30 transition-all hover:opacity-95"
            >
              Confirm Booking (Free Cancellation)
              <CheckCircle2 className="size-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 5: SUCCESS / CONFIRMATION */}
      {step === 5 && createdBooking && (
        <div className="text-center py-4 space-y-6">
          <div className="inline-flex size-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500 ring-8 ring-emerald-500/5">
            <CheckCircle2 className="size-9" />
          </div>

          <div>
            <span className="inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
              Booking Ref: {createdBooking.id}
            </span>
            <h2 className="mt-2 text-2xl md:text-3xl font-black text-foreground">
              Service Booking Confirmed!
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Thank you, <strong className="text-foreground">{createdBooking.customerName}</strong>. Our service manager in{" "}
              <strong className="text-foreground">{createdBooking.city}</strong> has received your request.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="rounded-2xl border border-border bg-surface/50 p-5 text-left max-w-lg mx-auto text-sm space-y-2.5">
            <div className="flex justify-between border-b border-border/80 pb-2">
              <span className="text-muted-foreground">Service:</span>
              <span className="font-bold text-foreground">{createdBooking.serviceName}</span>
            </div>
            <div className="flex justify-between border-b border-border/80 pb-2">
              <span className="text-muted-foreground">Specific Work:</span>
              <span className="font-medium text-foreground">{createdBooking.subService}</span>
            </div>
            <div className="flex justify-between border-b border-border/80 pb-2">
              <span className="text-muted-foreground">Appliance:</span>
              <span className="font-medium text-foreground">
                {createdBooking.acBrand} {createdBooking.acType} ({createdBooking.unitCount} Unit)
              </span>
            </div>
            <div className="flex justify-between border-b border-border/80 pb-2">
              <span className="text-muted-foreground">Slot:</span>
              <span className="font-semibold text-brand">
                {createdBooking.preferredDate} ({createdBooking.preferredSlot})
              </span>
            </div>
            <div className="flex justify-between border-b border-border/80 pb-2">
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium text-foreground">
                {createdBooking.address}, {createdBooking.city}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-muted-foreground">Est. Total (Pay after check):</span>
              <span className="font-black text-base text-foreground">
                ₹{createdBooking.estimatedAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Primary Action: Direct WhatsApp Confirmation */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={generateCustomerWhatsAppURL(createdBooking)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("booking_success_screen", createdBooking.serviceName)}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/25 transition-transform hover:scale-[1.02]"
            >
              <MessageSquare className="size-5" />
              Open WhatsApp for Fast Track Update
            </a>

            <a
              href={`tel:${EGS_CALL_NUMBER}`}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-3.5 text-sm font-bold text-foreground hover:bg-surface"
            >
              <Phone className="size-4" />
              Call Support Directly
            </a>
          </div>

          <p className="text-xs text-muted-foreground">
            🛡️ 30-Day Post-Service Warranty included • Verified Technicians with ID Card
          </p>
        </div>
      )}
    </div>
  );
}
