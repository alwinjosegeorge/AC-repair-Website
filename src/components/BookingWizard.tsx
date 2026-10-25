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
  LocateFixed,
  Wind,
  ShoppingBag,
  Home,
  Check,
  Zap,
} from "lucide-react";
import {
  Booking,
  ServiceCategory,
  ACType,
  saveBooking,
  generateCustomerWhatsAppURL,
  EGS_CALL_NUMBER,
  EGS_WHATSAPP_NUMBER,
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

// Step 1: 8 Services
export const SERVICES_DATA: Array<{
  id: ServiceCategory;
  title: string;
  emoji: string;
  badge: string;
  priceText: string;
  icon: typeof AirVent;
  desc: string;
  subServices: string[];
  defaultAmount: number;
}> = [
  {
    id: "ac-service",
    title: "AC Service",
    emoji: "❄",
    badge: "Most Popular",
    priceText: "From ₹499",
    icon: AirVent,
    desc: "Power jet pump wash, 10-point checkup, chemical disinfection & cooling test.",
    subServices: [
      "Deep Jet Power Cleaning (Indoor + Outdoor)",
      "Chemical Foam Wash & Coil Disinfection",
      "Filter & Drainage Pipe Flush",
      "Pre-Summer Complete Servicing",
    ],
    defaultAmount: 499,
  },
  {
    id: "ac-repair",
    title: "AC Repair",
    emoji: "🔧",
    badge: "90-Min Arrival",
    priceText: "From ₹399",
    icon: Wrench,
    desc: "Cooling issues, unusual noise, PCB diagnosis, water leak & electrical fixes.",
    subServices: [
      "AC Not Cooling / Less Cooling",
      "Water Leakage & Drainage Block",
      "Compressor / Fan Motor Failure",
      "PCB Board Repair & Power Trip",
    ],
    defaultAmount: 399,
  },
  {
    id: "ac-cleaning",
    title: "AC Cleaning",
    emoji: "🧹",
    badge: "Eco Foam",
    priceText: "From ₹349",
    icon: Sparkles,
    desc: "Indoor & outdoor coil chemical foam clean, blower wipe & drain line flush.",
    subServices: [
      "Indoor Unit Deep Foam Wash",
      "Outdoor Condenser Jet Flush",
      "Filter Anti-Bacterial Sanitization",
      "Blower & Air Vane Degreasing",
    ],
    defaultAmount: 349,
  },
  {
    id: "ac-installation",
    title: "AC Installation",
    emoji: "⚙",
    badge: "Zero Gas Loss",
    priceText: "From ₹1,199",
    icon: Cog,
    desc: "Wall mounting, copper piping, core drilling, vacuuming & safe dismantling.",
    subServices: [
      "New Split AC Complete Installation",
      "Old AC Uninstallation / Dismantling",
      "AC Relocation (Dismantle + Re-fitting)",
      "Window AC Fitting & Wooden Frame Setup",
    ],
    defaultAmount: 1199,
  },
  {
    id: "gas-charging",
    title: "Gas Charging",
    emoji: "💨",
    badge: "Leak Test Incl.",
    priceText: "From ₹1,499",
    icon: Wind,
    desc: "Nitrogen pressure leak testing & pure R32 / R410A / R22 refrigerant refill.",
    subServices: [
      "Full Gas Refill (R32 / R410A / R22)",
      "Nitrogen Pressure Leak Detection & Brazing",
      "Top-up Gas Charging (Partial)",
      "Valve & Flare Nut Replacement",
    ],
    defaultAmount: 1499,
  },
  {
    id: "commercial-hvac",
    title: "Commercial HVAC",
    emoji: "🏢",
    badge: "B2B Solutions",
    priceText: "Custom Quote",
    icon: Building2,
    desc: "VRV/VRF systems, ductable splits, chillers, AHUs & server room precision cooling.",
    subServices: [
      "VRV / VRF System Installation & Diagnostic",
      "Ductable Split AC Servicing & Duct Cleaning",
      "Chiller Plant & AHU Checkup",
      "Server Room Precision AC Maintenance",
    ],
    defaultAmount: 3500,
  },
  {
    id: "ac-amc",
    title: "AMC",
    emoji: "📋",
    badge: "Save 40%",
    priceText: "From ₹1,999/yr",
    icon: ShieldCheck,
    desc: "Annual maintenance contracts with scheduled deep services & free breakdown visits.",
    subServices: [
      "Residential Saver Plan (3 Wet Services + Free Visits)",
      "Comprehensive Care AMC (Services + Spares + Gas)",
      "Commercial Building Annual HVAC Contract",
    ],
    defaultAmount: 1999,
  },
  {
    id: "buy-new-ac",
    title: "Buy new ac",
    emoji: "🛒",
    badge: "Dealer Rates",
    priceText: "Best Market Price",
    icon: ShoppingBag,
    desc: "Free room sizing consultation, top brand 5-star inverters & direct doorstep delivery.",
    subServices: [
      "1.5 Ton 5-Star Inverter Split AC Inquiry",
      "1.0 Ton Bedroom Energy Saver AC Inquiry",
      "2.0 Ton Large Living Room / Office AC Inquiry",
      "Multi-Unit Bulk Purchase for Homes / Villas",
    ],
    defaultAmount: 0,
  },
];

// Step 2: 7 AC Types
export const AC_TYPES: ACType[] = [
  "Split AC",
  "Window AC",
  "Cassette AC",
  "Ductable AC",
  "VRF / VRV",
  "Central AC",
  "Other",
];

const TOP_BRANDS = [
  "Daikin",
  "Voltas",
  "LG",
  "Blue Star",
  "Mitsubishi",
  "Panasonic",
  "Carrier",
  "Lloyd",
  "Hitachi",
  "O General",
  "Other",
];

// Step 5: Time Slots
const TIME_SLOTS = [
  { id: "slot-emergency", label: "⚡ Emergency Now (Within 90 Mins)", note: "Rapid dispatch" },
  { id: "slot-morning", label: "🌅 Morning (9:00 AM - 12:00 PM)", note: "First slot of the day" },
  { id: "slot-afternoon", label: "☀️ Afternoon (12:00 PM - 3:00 PM)", note: "Mid-day visit" },
  { id: "slot-evening", label: "🌇 Evening (3:00 PM - 7:00 PM)", note: "Most popular" },
  { id: "slot-night", label: "🌙 Night Express (7:00 PM - 9:00 PM)", note: "After work hours" },
];

const MAJOR_CITIES = [
  "Kollam",
  "Thiruvananthapuram",
  "Ernakulam / Cochin",
  "Thrissur",
  "Kozhikode",
  "Kottayam",
  "Palakkad",
  "Alappuzha",
  "Kannur",
  "Chennai",
  "Other City",
];

export function BookingWizard({
  initialCategory = "ac-service",
  onSuccess,
  className = "",
  isModal = false,
}: BookingWizardProps) {
  // Wizard Steps (1 -> 2 -> 3 -> 4 -> 5 -> 6 Confirmation)
  const [step, setStep] = useState(1);

  // Step 1: Service selection
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>(initialCategory);
  const [selectedSubService, setSelectedSubService] = useState<string>("");

  // Step 2: Select ac type
  const [acType, setAcType] = useState<ACType>("Split AC");
  const [acBrand, setAcBrand] = useState("Daikin");
  const [issueDescription, setIssueDescription] = useState("");

  // Step 3: No of acs (1, 2, 3, 4, 5+)
  const [unitSelection, setUnitSelection] = useState<"1" | "2" | "3" | "4" | "5+">("1");
  const [customUnitCount, setCustomUnitCount] = useState<number>(5);

  // Step 4: Customer details
  const [customerName, setCustomerName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappSameAsContact, setWhatsappSameAsContact] = useState(true);

  // Location fields
  const [houseBuilding, setHouseBuilding] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("Kollam");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");
  const [locationCoordinates, setLocationCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>("");

  // Step 5: Preferred time
  const [dateOption, setDateOption] = useState<"today" | "tomorrow" | "custom">("today");
  const [customDate, setCustomDate] = useState("");
  const [preferredSlot, setPreferredSlot] = useState(TIME_SLOTS[0]?.label || "Morning (8:00 AM - 11:00 AM)");
  const [specialTimingNotes, setSpecialTimingNotes] = useState("");

  // Step 6: Created Booking result
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Sync initialCategory prop
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      const svc = SERVICES_DATA.find((s) => s.id === initialCategory);
      if (svc && svc.subServices.length > 0 && svc.subServices[0]) {
        setSelectedSubService(svc.subServices[0]);
      }
    }
  }, [initialCategory]);

  // Auto-sync WhatsApp number when checkbox is checked
  useEffect(() => {
    if (whatsappSameAsContact) {
      setWhatsappNumber(contactPhone);
    }
  }, [contactPhone, whatsappSameAsContact]);

  const currentServiceObj =
    SERVICES_DATA.find((s) => s.id === selectedCategory) ?? SERVICES_DATA[0]!;

  const effectiveUnits =
    unitSelection === "5+" ? Math.max(5, customUnitCount) : parseInt(unitSelection, 10);

  // Estimated Total calculation
  const estimatedTotal =
    selectedCategory === "commercial-hvac" || selectedCategory === "buy-new-ac"
      ? currentServiceObj.defaultAmount
      : currentServiceObj.defaultAmount * effectiveUnits;

  // Handle Category Click
  const handleCategorySelect = (catId: ServiceCategory) => {
    setSelectedCategory(catId);
    const svc = SERVICES_DATA.find((s) => s.id === catId);
    if (svc && svc.subServices.length > 0 && svc.subServices[0]) {
      setSelectedSubService(svc.subServices[0]);
    }
  };

  // GPS "Use My Location" Geolocation Handler
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationStatus("Detecting your GPS location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationCoordinates({ latitude, longitude });

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const detectedArea =
              addr.suburb || addr.neighbourhood || addr.road || addr.village || "";
            const detectedCity =
              addr.city || addr.town || addr.county || addr.state_district || "";
            const detectedPin = addr.postcode || "";

            if (detectedArea && !area) setArea(detectedArea);
            if (detectedCity) {
              const matched = MAJOR_CITIES.find((c) =>
                c.toLowerCase().includes(detectedCity.toLowerCase())
              );
              if (matched) setCity(matched);
              else setCity(detectedCity);
            }
            if (detectedPin && !pincode) setPincode(detectedPin);

            setLocationStatus(
              `Live location captured: ${detectedArea ? detectedArea + ", " : ""}${detectedCity || "Coordinates saved"}`
            );
          } else {
            setLocationStatus(
              `GPS location locked (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
            );
          }
        } catch {
          setLocationStatus(
            `GPS location locked (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
          );
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus("Location access was denied. Please enter address manually.");
        } else {
          setLocationStatus("Could not fetch location. Please enter manually.");
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Step 1 -> Step 2
  const goToStep2 = () => {
    trackBookingStep(2, "Select AC Type", selectedCategory);
    setStep(2);
    setErrorMsg("");
  };

  // Step 2 -> Step 3
  const goToStep3 = () => {
    trackBookingStep(3, "No of ACs", selectedCategory);
    setStep(3);
    setErrorMsg("");
  };

  // Step 3 -> Step 4
  const goToStep4 = () => {
    trackBookingStep(4, "Customer Details", selectedCategory);
    setStep(4);
    setErrorMsg("");
  };

  // Step 4 -> Step 5 (Preferred Time)
  const goToStep5 = () => {
    setErrorMsg("");

    if (!customerName.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }

    const cleanContact = contactPhone.replace(/\D/g, "");
    if (cleanContact.length < 10) {
      setErrorMsg("Please enter a valid 10-digit contact mobile number.");
      return;
    }

    const cleanWhatsApp = (whatsappSameAsContact ? contactPhone : whatsappNumber).replace(
      /\D/g,
      ""
    );
    if (cleanWhatsApp.length < 10) {
      setErrorMsg("Please enter a valid 10-digit WhatsApp number.");
      return;
    }

    if (!area.trim()) {
      setErrorMsg("Please enter your Area / Locality name.");
      return;
    }

    trackBookingStep(5, "Preferred Time", selectedCategory);
    setStep(5);
    setErrorMsg("");
  };

  // Step 5 Submit -> Step 6 Confirmation
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (dateOption === "custom" && !customDate) {
      setErrorMsg("Please pick your preferred service date.");
      return;
    }

    const fullAddress = [houseBuilding.trim(), area.trim()].filter(Boolean).join(", ");

    const preferredDateString =
      dateOption === "today"
        ? "Today (Express 90-Min Slot)"
        : dateOption === "tomorrow"
        ? "Tomorrow"
        : customDate || "Earliest Available";

    const booking = saveBooking({
      serviceCategory: selectedCategory,
      serviceName: `${currentServiceObj.emoji} ${currentServiceObj.title}`,
      subService: selectedSubService || currentServiceObj.title,
      acType,
      acBrand,
      unitCount: unitSelection === "5+" ? `${customUnitCount}+` : unitSelection,
      issueDescription: issueDescription.trim() || undefined,
      preferredDate: preferredDateString,
      preferredSlot,
      specialNotes: specialTimingNotes.trim() || undefined,
      customerName: customerName.trim(),
      phone: contactPhone.trim(),
      whatsappNumber: (whatsappSameAsContact ? contactPhone : whatsappNumber).trim(),
      houseBuilding: houseBuilding.trim() || undefined,
      area: area.trim(),
      address: fullAddress,
      landmark: landmark.trim() || undefined,
      city,
      pincode: pincode.trim() || "691001",
      locationCoordinates: locationCoordinates || undefined,
      estimatedAmount: estimatedTotal,
    });

    trackBookingComplete({
      bookingId: booking.id,
      service: booking.serviceName,
      amount: booking.estimatedAmount,
      city: booking.city,
      customerName: booking.customerName,
      customerPhone: booking.phone,
      customerEmail: booking.email,
      pincode: booking.pincode,
      address: booking.address,
    });

    setCreatedBooking(booking);
    setStep(6);
    if (onSuccess) onSuccess(booking);
  };

  // Reset booking form
  const handleReset = () => {
    setStep(1);
    setCreatedBooking(null);
    setCustomerName("");
    setContactPhone("");
    setWhatsappNumber("");
    setHouseBuilding("");
    setArea("");
    setLandmark("");
    setPincode("");
    setLocationCoordinates(null);
    setLocationStatus("");
    setIssueDescription("");
    setSpecialTimingNotes("");
    setErrorMsg("");
  };

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl border border-border bg-card p-3.5 sm:p-6 md:p-8 shadow-2xl transition-all ${className}`}
    >
      {/* Step Header & Progress Indicator (Steps 1 to 5) */}
      {step < 6 && (
        <div className="mb-5 sm:mb-6 border-b border-border/80 pb-4 sm:pb-5">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>
              Step {step}/5:{" "}
              <span className="text-foreground font-bold">
                {step === 1 && "Service"}
                {step === 2 && "AC Type"}
                {step === 3 && "Units"}
                {step === 4 && "Details"}
                {step === 5 && "Time"}
              </span>
            </span>
            <span className="text-brand font-black text-xs sm:text-sm">
              {estimatedTotal > 0
                ? `Est: ₹${estimatedTotal.toLocaleString("en-IN")}`
                : currentServiceObj.priceText}
            </span>
          </div>

          {/* 5-Step Progress Bar */}
          <div className="mt-2.5 sm:mt-3 grid grid-cols-5 gap-1.5 sm:gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
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

      {/* ============================================================ */}
      {/* STEP 1: SERVICE SELECTION */}
      {/* ============================================================ */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <div className="inline-block rounded-md bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand uppercase tracking-wider">
              Step 1 • Service Selection
            </div>
            <h2 className="mt-2 text-xl md:text-2xl font-black tracking-tight text-foreground">
              Choose the HVAC Service You Need
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Instant pricing, verified technicians, and guaranteed 90-minute doorstep arrival.
            </p>
          </div>

          {/* 8 Requested Services Grid (2 cols on mobile, 4 on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {SERVICES_DATA.map((svc) => {
              const isSelected = selectedCategory === svc.id;
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => handleCategorySelect(svc.id)}
                  className={`group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border p-3 sm:p-4 text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-brand bg-brand/5 shadow-md ring-2 ring-brand/30"
                      : "border-border bg-surface/50 hover:border-brand/40 hover:bg-surface"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xl sm:text-2xl">{svc.emoji}</span>
                      <span className="rounded-full bg-brand-soft px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase text-brand truncate max-w-[85px] sm:max-w-none">
                        {svc.badge}
                      </span>
                    </div>

                    <h3 className="mt-2.5 sm:mt-3 font-extrabold text-foreground text-xs sm:text-base flex items-center gap-1 leading-tight">
                      <span>{svc.title}</span>
                    </h3>
                    <p className="hidden sm:block mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {svc.desc}
                    </p>
                  </div>

                  <div className="mt-3 sm:mt-4 flex w-full items-center justify-between border-t border-border/60 pt-2 sm:pt-3">
                    <span className="text-[11px] sm:text-xs font-black text-brand">{svc.priceText}</span>
                    <span
                      className={`text-[10px] sm:text-xs font-bold flex items-center gap-0.5 sm:gap-1 ${
                        isSelected ? "text-brand" : "text-muted-foreground"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="size-3 sm:size-3.5" /> Selected
                        </>
                      ) : (
                        "Select"
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sub Service Checklist */}
          {currentServiceObj.subServices.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface/40 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Specific Work Requirement ({currentServiceObj.title}):
              </h4>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {currentServiceObj.subServices.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubService(sub)}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs font-medium transition-all ${
                      selectedSubService === sub
                        ? "border-brand bg-brand text-brand-foreground shadow-sm"
                        : "border-border bg-card text-foreground hover:border-brand/40"
                    }`}
                  >
                    <div
                      className={`size-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedSubService === sub
                          ? "border-white bg-white"
                          : "border-muted-foreground"
                      }`}
                    >
                      {selectedSubService === sub && (
                        <div className="size-1.5 rounded-full bg-brand" />
                      )}
                    </div>
                    <span>{sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={goToStep2}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-sm font-black uppercase tracking-wider text-brand-foreground shadow-lg shadow-brand/25 transition-all hover:scale-105 hover:bg-brand/90"
            >
              <span>Continue to AC Type</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 2: SELECT AC TYPE */}
      {/* ============================================================ */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <div className="inline-block rounded-md bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand uppercase tracking-wider">
              Step 2 • Select AC Type
            </div>
            <h2 className="mt-2 text-xl md:text-2xl font-black tracking-tight text-foreground">
              What Type of Air Conditioner?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Helps our technicians carry the exact diagnostic tools, manifold gauges, and replacement spares.
            </p>
          </div>

          {/* 7 Requested AC Types */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {AC_TYPES.map((type) => {
              const isSelected = acType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAcType(type)}
                  className={`group flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all cursor-pointer ${
                    isSelected
                      ? "border-brand bg-brand text-brand-foreground shadow-lg ring-2 ring-brand/30"
                      : "border-border bg-surface/50 text-foreground hover:border-brand/40 hover:bg-surface"
                  }`}
                >
                  <AirVent
                    className={`size-7 mb-2 transition-transform group-hover:scale-110 ${
                      isSelected ? "text-brand-foreground" : "text-brand"
                    }`}
                  />
                  <span className="text-sm font-bold">{type}</span>
                  <span
                    className={`text-[10px] mt-1 ${
                      isSelected ? "text-brand-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    {isSelected ? "Selected ✓" : "Tap to pick"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Brand Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              AC Brand / Manufacturer (Optional)
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

          {/* Optional Issue description */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Describe Any Specific Issue or Need (Optional)
            </label>
            <textarea
              rows={2}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="e.g. Less cooling, water dripping on floor, bad odor, remote not working..."
              className="mt-2 w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-3 text-xs sm:text-sm font-semibold text-foreground hover:bg-border/40 shrink-0"
            >
              <ArrowLeft className="size-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={goToStep3}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 sm:px-7 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-brand-foreground shadow-lg shadow-brand/25 hover:scale-105 hover:bg-brand/90"
            >
              <span>Continue to No of ACs</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 3: NO OF ACS (1, 2, 3, 4, 5+) */}
      {/* ============================================================ */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <div className="inline-block rounded-md bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand uppercase tracking-wider">
              Step 3 • Number of ACs
            </div>
            <h2 className="mt-2 text-xl md:text-2xl font-black tracking-tight text-foreground">
              How Many AC Units Need Service?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Select the total number of air conditioners. Multi-unit bookings receive up to 15% discount!
            </p>
          </div>

          {/* Requested 1, 2, 3, 4, 5+ Selection */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-4">
            {(["1", "2", "3", "4", "5+"] as const).map((count) => {
              const isSelected = unitSelection === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setUnitSelection(count)}
                  className={`flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border py-3 sm:py-6 text-center transition-all cursor-pointer ${
                    isSelected
                      ? "border-brand bg-brand text-brand-foreground shadow-xl ring-2 sm:ring-4 ring-brand/20 scale-105"
                      : "border-border bg-surface/50 text-foreground hover:border-brand/40 hover:bg-surface"
                  }`}
                >
                  <span className="text-xl sm:text-3xl font-black">{count}</span>
                  <span
                    className={`mt-0.5 sm:mt-1 text-[9px] sm:text-[11px] font-semibold uppercase ${
                      isSelected ? "text-brand-foreground/85" : "text-muted-foreground"
                    }`}
                  >
                    {count === "1" ? "Unit" : "Units"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* If 5+ selected, allow custom count entry */}
          {unitSelection === "5+" && (
            <div className="rounded-2xl border border-brand/30 bg-brand/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-sm font-bold text-foreground">Enter Exact Unit Count:</span>
                <span className="text-xs text-muted-foreground block">
                  For corporate, school, or multi-villa bulk requests.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCustomUnitCount((prev) => Math.max(5, prev - 1))}
                  className="flex size-9 items-center justify-center rounded-xl border border-border bg-card font-bold hover:bg-surface"
                >
                  -
                </button>
                <input
                  type="number"
                  min={5}
                  value={customUnitCount}
                  onChange={(e) => setCustomUnitCount(Math.max(5, parseInt(e.target.value, 10) || 5))}
                  className="w-16 text-center font-black text-brand text-lg bg-card rounded-xl border border-border p-1"
                />
                <button
                  type="button"
                  onClick={() => setCustomUnitCount((prev) => prev + 1)}
                  className="flex size-9 items-center justify-center rounded-xl border border-border bg-card font-bold hover:bg-surface"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Pricing Highlight */}
          <div className="rounded-2xl border border-brand/20 bg-brand/5 p-4 flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-foreground block">
                {currentServiceObj.emoji} {currentServiceObj.title} ({unitSelection}{" "}
                {unitSelection === "1" ? "Unit" : "Units"})
              </span>
              <span className="text-xs text-muted-foreground">
                {effectiveUnits >= 2 ? "Multi-unit discount included • Pay after service" : "Upfront standard rate • Pay after service"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-brand">
                {estimatedTotal > 0
                  ? `₹${estimatedTotal.toLocaleString("en-IN")}`
                  : currentServiceObj.priceText}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-3 text-xs sm:text-sm font-semibold text-foreground hover:bg-border/40 shrink-0"
            >
              <ArrowLeft className="size-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={goToStep4}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 sm:px-7 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-brand-foreground shadow-lg shadow-brand/25 hover:scale-105 hover:bg-brand/90"
            >
              <span>Continue to Details</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 4: CUSTOMER DETAILS */}
      {/* ============================================================ */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <div className="inline-block rounded-md bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand uppercase tracking-wider">
              Step 4 • Customer Details
            </div>
            <h2 className="mt-2 text-xl md:text-2xl font-black tracking-tight text-foreground">
              Contact &amp; Service Location
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tell us where and who we are serving. Next step: pick your preferred arrival time.
            </p>
          </div>

          {/* Contact Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Name *
              </label>
              <div className="relative mt-1.5">
                <User className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Nair"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card py-3 sm:py-2.5 pl-10 pr-4 text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            {/* Contact */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Contact (Mobile Number) *
              </label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 9895688833"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card py-3 sm:py-2.5 pl-10 pr-4 text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>
          </div>

          {/* WhatsApp Number with Sync Checkbox */}
          <div className="rounded-2xl border border-border bg-surface/40 p-3.5 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <MessageSquare className="size-3.5 text-[#25D366]" />
                WhatsApp Number *
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
                <input
                  type="checkbox"
                  checked={whatsappSameAsContact}
                  onChange={(e) => setWhatsappSameAsContact(e.target.checked)}
                  className="rounded border-border text-brand focus:ring-brand size-4"
                />
                <span>Same as contact number</span>
              </label>
            </div>

            {!whatsappSameAsContact && (
              <div className="relative mt-2.5">
                <MessageSquare className="absolute left-3.5 top-3.5 size-4 text-[#25D366]" />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 9895688833"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card py-3 sm:py-2.5 pl-10 pr-4 text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            )}
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Location
              </label>

              {/* "Use My Location" GPS Button */}
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={isLocating}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-brand/30 bg-brand/10 px-4 py-2 text-xs font-black text-brand transition-all hover:bg-brand/20 active:scale-95"
              >
                <LocateFixed className={`size-4 ${isLocating ? "animate-spin" : ""}`} />
                <span>{isLocating ? "Detecting GPS..." : "📍 Use my location"}</span>
              </button>
            </div>

            {locationStatus && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{locationStatus}</span>
              </div>
            )}

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                or enter manually
              </span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            {/* House / Building */}
            <div>
              <label className="text-xs font-semibold text-foreground">
                House / Building
              </label>
              <div className="relative mt-1">
                <Home className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="e.g. TC 14/120, Rose Villa / Flat 4B, Blue Horizon"
                  value={houseBuilding}
                  onChange={(e) => setHouseBuilding(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card py-3 sm:py-2.5 pl-10 pr-4 text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            {/* Area & City */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-foreground">Area *</label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kadappakada / MG Road / Kakkanad"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card py-3 sm:py-2.5 pl-10 pr-4 text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">City *</label>
                <input
                  list="city-suggestions"
                  type="text"
                  required
                  placeholder="e.g. Kollam / Thiruvananthapuram"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card p-3 sm:p-2.5 text-base sm:text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <datalist id="city-suggestions">
                  {MAJOR_CITIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* PIN Code & Landmark */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-foreground">PIN Code *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 691001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card p-3 sm:p-2.5 text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. Near SBI Bank / Opp. Metro Pillar 32"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card p-3 sm:p-2.5 text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-3 text-xs sm:text-sm font-semibold text-foreground hover:bg-border/40 shrink-0"
            >
              <ArrowLeft className="size-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={goToStep5}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 sm:px-8 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-brand-foreground shadow-xl shadow-brand/30 transition-all hover:scale-105 hover:bg-brand/90"
            >
              <span>Continue to Time</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 5: PREFERRED TIME */}
      {/* ============================================================ */}
      {step === 5 && (
        <form onSubmit={handleSubmitBooking} className="space-y-6">
          <div>
            <div className="inline-block rounded-md bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand uppercase tracking-wider">
              Step 5 • Preferred Time
            </div>
            <h2 className="mt-2 text-xl md:text-2xl font-black tracking-tight text-foreground">
              When Should Our Technician Arrive?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Select your preferred service day and arrival slot. Our certified team works 7 days a week, 8:00 AM – 9:00 PM.
            </p>
          </div>

          {/* Service Day Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Service Day *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setDateOption("today")}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                  dateOption === "today"
                    ? "border-brand bg-brand/10 shadow-md ring-2 ring-brand/40"
                    : "border-border bg-surface/50 hover:border-brand/40 hover:bg-surface"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-base font-black text-foreground">Today</span>
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black text-emerald-600">
                    ⚡ 90-Min Arrival
                  </span>
                </div>
                <span className="mt-1 text-xs text-muted-foreground">
                  Immediate breakdown &amp; express arrival
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDateOption("tomorrow")}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                  dateOption === "tomorrow"
                    ? "border-brand bg-brand/10 shadow-md ring-2 ring-brand/40"
                    : "border-border bg-surface/50 hover:border-brand/40 hover:bg-surface"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-base font-black text-foreground">Tomorrow</span>
                  <span className="rounded-md bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand">
                    Guaranteed Slot
                  </span>
                </div>
                <span className="mt-1 text-xs text-muted-foreground">
                  Scheduled regular service visit
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDateOption("custom")}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                  dateOption === "custom"
                    ? "border-brand bg-brand/10 shadow-md ring-2 ring-brand/40"
                    : "border-border bg-surface/50 hover:border-brand/40 hover:bg-surface"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-base font-black text-foreground">Pick Date</span>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                    Advance
                  </span>
                </div>
                <span className="mt-1 text-xs text-muted-foreground">
                  Choose specific upcoming date
                </span>
              </button>
            </div>

            {dateOption === "custom" && (
              <div className="pt-1">
                <label className="text-xs font-semibold text-foreground">
                  Select Specific Calendar Date:
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            )}
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Preferred Arrival Window *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TIME_SLOTS.map((slot) => {
                const isSelected = preferredSlot === slot.label;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setPreferredSlot(slot.label)}
                    className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-brand bg-brand text-brand-foreground shadow-md ring-2 ring-brand/30"
                        : "border-border bg-surface/50 text-foreground hover:border-brand/40 hover:bg-surface"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock
                        className={`size-4 shrink-0 ${
                          isSelected ? "text-brand-foreground" : "text-brand"
                        }`}
                      />
                      <div>
                        <div className="text-xs sm:text-sm font-bold">{slot.label}</div>
                        <div
                          className={`text-[10px] ${
                            isSelected ? "text-brand-foreground/80" : "text-muted-foreground"
                          }`}
                        >
                          {slot.note}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="size-4 shrink-0 text-brand-foreground" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Timing / Arrival Notes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Special Instructions for Technician (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Call 30 mins before arrival, ring doorbell twice, visit after 10 AM..."
              value={specialTimingNotes}
              onChange={(e) => setSpecialTimingNotes(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-card p-3 text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          {/* Complete Booking Review Card */}
          <div className="rounded-2xl border-2 border-brand/20 bg-brand/5 p-4 sm:p-5 space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-brand/10 pb-2">
              <span className="font-extrabold text-foreground">
                {currentServiceObj.emoji} {currentServiceObj.title}
              </span>
              <span className="font-black text-brand text-base">
                {estimatedTotal > 0
                  ? `₹${estimatedTotal.toLocaleString("en-IN")}`
                  : currentServiceObj.priceText}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>
                <strong className="text-foreground">AC Type:</strong> {acType} ({unitSelection}{" "}
                {unitSelection === "1" ? "Unit" : "Units"})
              </div>
              <div>
                <strong className="text-foreground">Customer:</strong> {customerName} ({contactPhone})
              </div>
              <div>
                <strong className="text-foreground">Location:</strong> {area}, {city} - {pincode}
              </div>
              <div>
                <strong className="text-foreground">Schedule:</strong>{" "}
                {dateOption === "today" ? "Today" : dateOption === "tomorrow" ? "Tomorrow" : customDate} • {preferredSlot}
              </div>
            </div>

            <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[11px] font-semibold text-emerald-600">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> 30-Day Post-Service Guarantee
              </span>
              <span className="text-foreground font-bold">Pay After Service (Cash / UPI)</span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-3 text-xs sm:text-sm font-semibold text-foreground hover:bg-border/40 shrink-0"
            >
              <ArrowLeft className="size-4" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 sm:px-8 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-brand-foreground shadow-2xl shadow-brand/40 transition-all hover:scale-105 hover:bg-brand/90"
            >
              <span>Confirm &amp; Book</span>
              <CheckCircle2 className="size-4" />
            </button>
          </div>
        </form>
      )}

      {/* ============================================================ */}
      {/* STEP 6: BOOKING CONFIRMATION & WHATSAPP DISPATCH */}
      {/* ============================================================ */}
      {step === 6 && createdBooking && (
        <div className="text-center py-4 space-y-6">
          <div className="inline-flex size-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500 ring-8 ring-emerald-500/5">
            <CheckCircle2 className="size-9" />
          </div>

          <div>
            <span className="inline-block rounded-full bg-brand-soft px-3.5 py-1 text-xs font-black text-brand">
              Booking ID: {createdBooking.id}
            </span>
            <h2 className="mt-2 text-2xl md:text-3xl font-black text-foreground">
              Booking Confirmed Successfully!
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Thank you, <strong className="text-foreground">{createdBooking.customerName}</strong>. Our service desk in{" "}
              <strong className="text-foreground">{createdBooking.city}</strong> has received your request and assigned a technician.
            </p>
          </div>

          {/* Full Breakdown Summary Card */}
          <div className="rounded-2xl border border-border bg-surface/50 p-5 text-left max-w-lg mx-auto text-sm space-y-2.5">
            <div className="flex justify-between border-b border-border/80 pb-2">
              <span className="text-muted-foreground">Service:</span>
              <span className="font-bold text-foreground">{createdBooking.serviceName}</span>
            </div>
            <div className="flex justify-between border-b border-border/80 pb-2">
              <span className="text-muted-foreground">AC Type &amp; Units:</span>
              <span className="font-medium text-foreground">
                {createdBooking.acType} ({createdBooking.unitCount}{" "}
                {createdBooking.unitCount === "1" ? "Unit" : "Units"})
              </span>
            </div>
            <div className="flex justify-between border-b border-border/80 pb-2">
              <span className="text-muted-foreground">Preferred Time:</span>
              <span className="font-medium text-foreground">
                {createdBooking.preferredDate} ({createdBooking.preferredSlot})
              </span>
            </div>
            <div className="flex justify-between border-b border-border/80 pb-2">
              <span className="text-muted-foreground">Contact &amp; WhatsApp:</span>
              <span className="font-medium text-foreground">
                {createdBooking.phone} / {createdBooking.whatsappNumber || createdBooking.phone}
              </span>
            </div>
            <div className="flex justify-between border-b border-border/80 pb-2">
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium text-foreground text-right max-w-xs">
                {createdBooking.address}, {createdBooking.city} - {createdBooking.pincode}
                {createdBooking.landmark ? ` (Landmark: ${createdBooking.landmark})` : ""}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="font-bold text-foreground">Estimated Total:</span>
              <span className="font-black text-brand text-base">
                {createdBooking.estimatedAmount > 0
                  ? `₹${createdBooking.estimatedAmount.toLocaleString("en-IN")}`
                  : "Pay After Inspection"}
              </span>
            </div>
          </div>

          {/* Actions: Send WhatsApp & Call */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto pt-2">
            <a
              href={generateCustomerWhatsAppURL(createdBooking)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("booking_success_dispatch")}
              className="flex w-full sm:w-auto flex-1 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-4 text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-[#25D366]/30 transition-all hover:scale-105 hover:bg-[#20ba59]"
            >
              <MessageSquare className="size-5 fill-current" />
              <span>Send on WhatsApp</span>
            </a>

            <a
              href={`tel:${EGS_CALL_NUMBER}`}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card px-6 py-4 text-sm font-bold text-foreground shadow-sm transition-all hover:border-brand/40 hover:bg-surface"
            >
              <Phone className="size-4 text-brand" />
              <span>Call Helpline</span>
            </a>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-muted-foreground hover:text-brand underline cursor-pointer"
            >
              Book Another AC Service
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
