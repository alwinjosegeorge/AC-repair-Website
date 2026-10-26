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
import { WhatsAppIcon } from "./WhatsAppIcon";

interface BookingWizardProps {
  initialCategory?: ServiceCategory;
  onSuccess?: (booking: Booking) => void;
  className?: string;
  isModal?: boolean;
  theme?: "default" | "glass-blue";
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
    priceText: "From ₹800",
    icon: AirVent,
    desc: "Power jet pump wash, 10-point checkup, chemical disinfection & cooling test.",
    subServices: [
      "Full Body Deep Jet Cleaning (Indoor + Outdoor)",
      "Chemical Foam Wash & Coil Disinfection",
      "Filter & Drainage Pipe Flush",
      "Pre-Summer Complete Servicing",
    ],
    defaultAmount: 800,
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
  theme = "default",
}: BookingWizardProps) {
  const isGlass = theme === "glass-blue";
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
  const [city, setCity] = useState("");
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
    if (cleanContact.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number to proceed.");
      return;
    }

    if (!whatsappSameAsContact) {
      const cleanWhatsApp = whatsappNumber.replace(/\D/g, "");
      if (cleanWhatsApp.length !== 10) {
        setErrorMsg("Please enter a valid 10-digit WhatsApp number to proceed.");
        return;
      }
    }

    if (!area.trim()) {
      setErrorMsg("Please enter your Area / Locality name.");
      return;
    }

    if (!city.trim()) {
      setErrorMsg("Please enter your City / District name.");
      return;
    }

    if (pincode.trim() && pincode.replace(/\D/g, "").length !== 6) {
      setErrorMsg("Please enter a valid 6-digit PIN code.");
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

    const cleanContact = contactPhone.replace(/\D/g, "");
    if (cleanContact.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      setStep(4);
      return;
    }

    if (!customerName.trim()) {
      setErrorMsg("Please enter your name.");
      setStep(4);
      return;
    }

    if (dateOption === "custom" && !customDate) {
      setErrorMsg("Please pick your preferred service date.");
      return;
    }

    const fullAddress = [houseBuilding.trim(), area.trim(), city.trim()].filter(Boolean).join(", ");

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
      city: city.trim(),
      pincode: pincode.trim(),
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
      className={`${
        isGlass
          ? "bg-transparent border-none p-0 shadow-none text-white"
          : "rounded-2xl sm:rounded-3xl border border-border bg-card p-3.5 sm:p-6 md:p-8 shadow-2xl text-foreground"
      } transition-all ${className}`}
    >
      {/* Step Header & Progress Indicator (Steps 1 to 5) */}
      {step < 6 && (
        <div className={`mb-3 sm:mb-4 border-b ${isGlass ? "border-white/15" : "border-border/80"} pb-2.5 sm:pb-3`}>
          <div className={`flex items-center justify-between text-xs font-semibold ${isGlass ? "text-white/80" : "text-muted-foreground"} uppercase tracking-wider`}>
            <span>
              Step {step}/5:{" "}
              <span className={isGlass ? "text-white font-bold" : "text-foreground font-bold"}>
                {step === 1 && "Service"}
                {step === 2 && "AC Type"}
                {step === 3 && "Units"}
                {step === 4 && "Details"}
                {step === 5 && "Time"}
              </span>
            </span>
            <span className={isGlass ? "text-slate-900 bg-white font-black text-xs px-2.5 py-0.5 rounded-full shadow-sm" : "text-brand font-black text-xs sm:text-sm"}>
              {estimatedTotal > 0
                ? `Est: ₹${estimatedTotal.toLocaleString("en-IN")}`
                : currentServiceObj.priceText}
            </span>
          </div>

          {/* 5-Step Progress Bar */}
          <div className="mt-2 grid grid-cols-5 gap-1.5 sm:gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step >= i
                    ? isGlass ? "bg-white" : "bg-brand"
                    : isGlass ? "bg-white/20" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {errorMsg && (
        <div className={`mb-3 flex items-center gap-2 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm font-medium ${
          isGlass ? "bg-red-500/25 border border-red-300/40 text-white" : "border border-destructive/20 bg-destructive/10 text-destructive"
        }`}>
          <AlertCircle className={`size-4 shrink-0 ${isGlass ? "text-red-200" : ""}`} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 1: SERVICE SELECTION */}
      {/* ============================================================ */}
      {step === 1 && (
        <div className={isGlass ? "space-y-3 sm:space-y-3.5" : "space-y-6"}>
          {isGlass ? (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Choose Service
                </h2>
                <p className="text-[11px] sm:text-xs text-white/80">
                  Instant pricing • Verified technicians • 90-min doorstep arrival
                </p>
              </div>
              <span className="hidden sm:inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-black tracking-wider text-white uppercase">
                Step 1 of 5
              </span>
            </div>
          ) : (
            <div>
              <div className="inline-block rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-brand-soft text-brand">
                Step 1 • Service Selection
              </div>
              <h2 className="mt-2 text-xl md:text-2xl font-black tracking-tight text-foreground">
                Choose the HVAC Service You Need
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Instant pricing, verified technicians, and guaranteed 90-minute doorstep arrival.
              </p>
            </div>
          )}

          {/* 8 Requested Services Grid (2 Columns for Full Text Visibility) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
            {SERVICES_DATA.map((svc) => {
              const isSelected = selectedCategory === svc.id;

              if (isGlass) {
                return (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => handleCategorySelect(svc.id)}
                    className={`group relative flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-white bg-white text-slate-900 shadow-xl ring-2 ring-white/70 font-bold scale-[1.01]"
                        : "border-white/25 bg-white/10 hover:bg-white/20 hover:border-white/50 text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl sm:text-2xl shrink-0 leading-none">{svc.emoji}</span>
                      <div className="min-w-0">
                        <div className={`text-xs sm:text-sm font-extrabold leading-tight ${
                          isSelected ? "text-slate-900" : "text-white"
                        }`}>
                          {svc.title}
                        </div>
                        <div className={`text-[11px] font-semibold leading-tight mt-0.5 ${
                          isSelected ? "text-slate-600 font-bold" : "text-white/80"
                        }`}>
                          {svc.priceText}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                      {isSelected ? (
                        <div className="size-5 sm:size-5.5 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md">
                          <Check className="size-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="size-5 sm:size-5.5 rounded-full border-2 border-white/40 group-hover:border-white/70" />
                      )}
                    </div>
                  </button>
                );
              }

              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => handleCategorySelect(svc.id)}
                  className={`group relative flex items-center justify-between gap-3 rounded-2xl border p-3 sm:p-3.5 text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-brand bg-brand/5 shadow-md ring-2 ring-brand/30"
                      : "border-border bg-surface/50 hover:border-brand/40 hover:bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0 leading-none">{svc.emoji}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm sm:text-base text-foreground leading-tight">
                          {svc.title}
                        </span>
                        <span className="rounded-full px-2 py-0.5 text-[9px] font-black uppercase bg-brand-soft text-brand">
                          {svc.badge}
                        </span>
                      </div>
                      <span className="text-xs font-black text-brand block mt-1">
                        {svc.priceText}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center">
                    <span
                      className={`text-xs font-bold flex items-center gap-1 ${
                        isSelected ? "text-brand" : "text-muted-foreground"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="size-4 text-brand stroke-[3]" /> Selected
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
            <div className={`rounded-2xl border p-3.5 sm:p-4 ${
              isGlass ? "border-white/20 bg-white/10 text-white" : "border-border bg-surface/40"
            }`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider ${
                isGlass ? "text-white/85" : "text-muted-foreground"
              }`}>
                Specific Work Requirement ({currentServiceObj.title}):
              </h4>
              <div className="mt-2.5 sm:mt-3 grid gap-2 sm:grid-cols-2">
                {currentServiceObj.subServices.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubService(sub)}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs font-medium transition-all cursor-pointer ${
                      selectedSubService === sub
                        ? isGlass
                          ? "border-white bg-white text-slate-900 shadow-md font-bold"
                          : "border-brand bg-brand text-brand-foreground shadow-sm"
                        : isGlass
                          ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                          : "border-border bg-card text-foreground hover:border-brand/40"
                    }`}
                  >
                    <div
                      className={`size-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedSubService === sub
                          ? isGlass ? "border-slate-900 bg-slate-900" : "border-white bg-white"
                          : isGlass ? "border-white/50" : "border-muted-foreground"
                      }`}
                    >
                      {selectedSubService === sub && (
                        <div className={`size-1.5 rounded-full ${isGlass ? "bg-white" : "bg-brand"}`} />
                      )}
                    </div>
                    <span>{sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            <div className={isGlass ? "text-[11px] text-white/80" : "text-xs text-muted-foreground"}>
              <span className={isGlass ? "font-extrabold text-white" : "font-bold text-foreground"}>No advance payment</span> • Pay after service
            </div>
            <button
              type="button"
              onClick={goToStep2}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider shadow-xl transition-all hover:scale-105 cursor-pointer ${
                isGlass
                  ? "bg-white text-slate-900 hover:bg-slate-100 shadow-2xl"
                  : "bg-brand text-brand-foreground shadow-brand/25 hover:bg-brand/90"
              }`}
            >
              <span>Continue to AC Type</span>
              <ArrowRight className="size-3.5 sm:size-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 2: SELECT AC TYPE */}
      {/* ============================================================ */}
      {step === 2 && (
        <div className={isGlass ? "space-y-3 sm:space-y-3.5" : "space-y-6"}>
          {isGlass ? (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Select AC Type &amp; Brand
                </h2>
                <p className="text-[11px] sm:text-xs text-white/80">
                  Helps technicians carry exact diagnostic tools &amp; spares
                </p>
              </div>
              <span className="hidden sm:inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-black tracking-wider text-white uppercase">
                Step 2 of 5
              </span>
            </div>
          ) : (
            <div>
              <div className="inline-block rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-brand-soft text-brand">
                Step 2 • Select AC Type
              </div>
              <h2 className="mt-2 text-xl md:text-2xl font-black tracking-tight text-foreground">
                What Type of Air Conditioner?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Helps our technicians carry the exact diagnostic tools, manifold gauges, and replacement spares.
              </p>
            </div>
          )}

          {/* 7 Requested AC Types */}
          <div className={isGlass ? "grid grid-cols-2 sm:grid-cols-4 gap-2" : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"}>
            {AC_TYPES.map((type) => {
              const isSelected = acType === type;

              if (isGlass) {
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAcType(type)}
                    className={`flex items-center justify-between rounded-xl border p-2 sm:p-2.5 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-white bg-white text-slate-900 shadow-xl ring-2 ring-white/60 font-bold"
                        : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <AirVent className={`size-4 shrink-0 ${isSelected ? "text-slate-900" : "text-white"}`} />
                      <span className="text-xs font-bold leading-tight">{type}</span>
                    </div>
                    {isSelected && <Check className="size-3.5 text-slate-900 shrink-0 stroke-[3]" />}
                  </button>
                );
              }

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
                  <span className={`text-[10px] mt-1 ${isSelected ? "text-brand-foreground/80" : "text-muted-foreground"}`}>
                    {isSelected ? "Selected ✓" : "Tap to pick"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Brand Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
                isGlass ? "text-white/85" : "text-muted-foreground"
              }`}>
                AC Brand / Manufacturer (Optional)
              </label>
              <span className={`text-[10px] ${isGlass ? "text-white/70" : "text-muted-foreground"}`}>
                Selected: <strong className={isGlass ? "text-white" : "text-foreground"}>{acBrand}</strong>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TOP_BRANDS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setAcBrand(b)}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    acBrand === b
                      ? isGlass
                        ? "border-white bg-white text-slate-900 font-bold shadow-sm"
                        : "border-brand bg-brand/10 text-brand font-bold ring-1 ring-brand"
                      : isGlass
                        ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
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
            <label className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
              isGlass ? "text-white/85" : "text-muted-foreground"
            }`}>
              Describe Any Specific Issue or Need (Optional)
            </label>
            <input
              type="text"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="e.g. Less cooling, water dripping on floor, bad odor, remote not working..."
              className={`mt-1 w-full rounded-xl p-2.5 text-xs sm:text-sm focus:outline-none transition-all ${
                isGlass
                  ? "bg-[#006ccf]/60 sm:bg-white/10 border border-white/25 text-white placeholder:text-white/60 focus:bg-[#006ccf]/90 focus:border-white focus:ring-1 focus:ring-white/40"
                  : "border border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-brand focus:ring-1 focus:ring-brand"
              }`}
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold shrink-0 cursor-pointer ${
                isGlass
                  ? "border-white/25 bg-white/15 text-white hover:bg-white/25"
                  : "border-border bg-surface text-foreground hover:bg-border/40"
              }`}
            >
              <ArrowLeft className="size-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={goToStep3}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider shadow-xl transition-all hover:scale-105 cursor-pointer ${
                isGlass
                  ? "bg-white text-slate-900 hover:bg-slate-100 shadow-2xl"
                  : "bg-brand text-brand-foreground shadow-brand/25 hover:bg-brand/90"
              }`}
            >
              <span>Continue to No of ACs</span>
              <ArrowRight className="size-3.5 sm:size-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 3: NO OF ACS (1, 2, 3, 4, 5+) */}
      {/* ============================================================ */}
      {step === 3 && (
        <div className={isGlass ? "space-y-3 sm:space-y-3.5" : "space-y-6"}>
          {isGlass ? (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  How Many AC Units?
                </h2>
                <p className="text-[11px] sm:text-xs text-white/80">
                  Multi-unit bookings receive up to 15% discount
                </p>
              </div>
              <span className="hidden sm:inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-black tracking-wider text-white uppercase">
                Step 3 of 5
              </span>
            </div>
          ) : (
            <div>
              <div className="inline-block rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-brand-soft text-brand">
                Step 3 • Number of ACs
              </div>
              <h2 className="mt-2 text-xl md:text-2xl font-black tracking-tight text-foreground">
                How Many AC Units Need Service?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select the total number of air conditioners. Multi-unit bookings receive up to 15% discount!
              </p>
            </div>
          )}

          {/* Requested 1, 2, 3, 4, 5+ Selection */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
            {(["1", "2", "3", "4", "5+"] as const).map((count) => {
              const isSelected = unitSelection === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setUnitSelection(count)}
                  className={`flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border py-2.5 sm:py-3.5 text-center transition-all cursor-pointer ${
                    isSelected
                      ? isGlass
                        ? "border-white bg-white text-slate-900 shadow-xl ring-2 sm:ring-4 ring-white/40 scale-105"
                        : "border-brand bg-brand text-brand-foreground shadow-xl ring-2 sm:ring-4 ring-brand/20 scale-105"
                      : isGlass
                        ? "border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/40"
                        : "border-border bg-surface/50 text-foreground hover:border-brand/40 hover:bg-surface"
                  }`}
                >
                  <span className={`text-lg sm:text-2xl font-black ${
                    isSelected && isGlass ? "text-slate-900" : isGlass ? "text-white" : ""
                  }`}>{count}</span>
                  <span
                    className={`mt-0.5 text-[9px] sm:text-[10px] font-semibold uppercase ${
                      isSelected
                        ? isGlass ? "text-slate-700 font-bold" : "text-brand-foreground/85"
                        : isGlass ? "text-white/70" : "text-muted-foreground"
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
            <div className={`rounded-xl border p-3 flex items-center justify-between gap-3 ${
              isGlass ? "border-white/20 bg-white/10 text-white" : "border-brand/30 bg-brand/5"
            }`}>
              <div>
                <span className={`text-xs font-bold block ${isGlass ? "text-white" : "text-foreground"}`}>
                  Enter Exact Unit Count:
                </span>
                <span className={`text-[10px] block ${isGlass ? "text-white/75" : "text-muted-foreground"}`}>
                  For corporate, school, or multi-villa bulk requests.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCustomUnitCount((prev) => Math.max(5, prev - 1))}
                  className={`flex size-8 items-center justify-center rounded-lg border font-bold cursor-pointer ${
                    isGlass ? "border-white/30 bg-white/20 text-white hover:bg-white/30" : "border-border bg-card hover:bg-surface"
                  }`}
                >
                  -
                </button>
                <input
                  type="number"
                  min={5}
                  value={customUnitCount}
                  onChange={(e) => setCustomUnitCount(Math.max(5, parseInt(e.target.value, 10) || 5))}
                  className={`w-14 text-center font-black text-base rounded-lg border p-1 ${
                    isGlass ? "bg-white/20 border-white/30 text-white" : "bg-card border-border text-brand"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setCustomUnitCount((prev) => prev + 1)}
                  className={`flex size-8 items-center justify-center rounded-lg border font-bold cursor-pointer ${
                    isGlass ? "border-white/30 bg-white/20 text-white hover:bg-white/30" : "border-border bg-card hover:bg-surface"
                  }`}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Pricing Highlight */}
          <div className={`rounded-xl border p-2.5 sm:p-3 flex items-center justify-between ${
            isGlass ? "border-white/20 bg-white/15 text-white" : "border-brand/20 bg-brand/5"
          }`}>
            <div>
              <span className={`font-bold text-xs sm:text-sm block ${isGlass ? "text-white" : "text-foreground"}`}>
                {currentServiceObj.emoji} {currentServiceObj.title} ({effectiveUnits}{" "}
                {effectiveUnits === 1 ? "Unit" : "Units"})
              </span>
              <span className={`text-[10px] ${isGlass ? "text-white/80" : "text-muted-foreground"}`}>
                {effectiveUnits >= 2 ? "Multi-unit discount included • Pay after service" : "Upfront standard rate • Pay after service"}
              </span>
            </div>
            <div className="text-right">
              <span className={`text-base sm:text-lg font-black ${isGlass ? "text-white" : "text-brand"}`}>
                {estimatedTotal > 0
                  ? `₹${estimatedTotal.toLocaleString("en-IN")}`
                  : currentServiceObj.priceText}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={() => setStep(2)}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold shrink-0 cursor-pointer ${
                isGlass
                  ? "border-white/25 bg-white/15 text-white hover:bg-white/25"
                  : "border-border bg-surface text-foreground hover:bg-border/40"
              }`}
            >
              <ArrowLeft className="size-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={goToStep4}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider shadow-xl transition-all hover:scale-105 cursor-pointer ${
                isGlass
                  ? "bg-white text-slate-900 hover:bg-slate-100 shadow-2xl"
                  : "bg-brand text-brand-foreground shadow-brand/25 hover:bg-brand/90"
              }`}
            >
              <span>Continue to Details</span>
              <ArrowRight className="size-3.5 sm:size-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 4: CUSTOMER DETAILS */}
      {/* ============================================================ */}
      {step === 4 && (
        <div className={isGlass ? "space-y-2.5 sm:space-y-3" : "space-y-6"}>
          {isGlass ? (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Contact &amp; Location
                </h2>
                <p className="text-[11px] sm:text-xs text-white/80">
                  Tell us where and who we are serving
                </p>
              </div>
              <span className="hidden sm:inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-black tracking-wider text-white uppercase">
                Step 4 of 5
              </span>
            </div>
          ) : (
            <div>
              <div className="inline-block rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-brand-soft text-brand">
                Step 4 • Customer Details
              </div>
              <h2 className="mt-2 text-xl md:text-2xl font-black tracking-tight text-foreground">
                Contact &amp; Service Location
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tell us where and who we are serving. Next step: pick your preferred arrival time.
              </p>
            </div>
          )}

          {/* Contact Details */}
          {(() => {
            const cleanContactDigits = contactPhone.replace(/\D/g, "");
            const isPhoneComplete = cleanContactDigits.length === 10;
            const isPhonePartial = cleanContactDigits.length > 0 && cleanContactDigits.length < 10;

            const cleanWhatsAppDigits = (whatsappSameAsContact ? contactPhone : whatsappNumber).replace(/\D/g, "");
            const isWhatsAppComplete = cleanWhatsAppDigits.length === 10;
            const isWhatsAppPartial = !whatsappSameAsContact && cleanWhatsAppDigits.length > 0 && cleanWhatsAppDigits.length < 10;

            return (
              <>
                <div className="grid gap-2 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${isGlass ? "text-white/85" : "text-muted-foreground"}`}>
                      Name *
                    </label>
                    <div className="relative">
                      <User className={`absolute left-3 top-2.5 size-3.5 ${isGlass ? "text-white/70" : "text-muted-foreground"}`} />
                      <input
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          if (errorMsg) setErrorMsg("");
                        }}
                        className={`w-full rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm focus:outline-none transition-all ${
                          isGlass
                            ? "bg-[#006ccf]/60 sm:bg-white/10 border border-white/25 text-white placeholder:text-white/60 focus:bg-[#006ccf]/90 focus:border-white focus:ring-1 focus:ring-white/40"
                            : "border border-border bg-card text-foreground placeholder:text-muted-foreground"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${isGlass ? "text-white/85" : "text-muted-foreground"}`}>
                        Mobile Number *
                      </label>
                      {cleanContactDigits.length > 0 && (
                        <span
                          className={`text-[10px] font-bold transition-all ${
                            isPhoneComplete
                              ? isGlass ? "text-emerald-300" : "text-emerald-600"
                              : isGlass ? "text-amber-300" : "text-amber-600"
                          }`}
                        >
                          {isPhoneComplete ? "✓ 10 Digits" : `${cleanContactDigits.length}/10 digits`}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Phone className={`absolute left-3 top-2.5 size-3.5 ${isGlass ? "text-white/70" : "text-muted-foreground"}`} />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="Enter 10-digit mobile number"
                        value={contactPhone}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setContactPhone(digits);
                          if (errorMsg) setErrorMsg("");
                        }}
                        className={`w-full rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm focus:outline-none transition-all ${
                          isPhoneComplete
                            ? isGlass
                              ? "bg-[#006ccf]/60 sm:bg-white/10 border-2 border-emerald-400 text-white placeholder:text-white/60 focus:border-emerald-300"
                              : "border-2 border-emerald-500 bg-card text-foreground placeholder:text-muted-foreground"
                            : isPhonePartial
                            ? isGlass
                              ? "bg-[#006ccf]/60 sm:bg-white/10 border-2 border-amber-400 text-white placeholder:text-white/60 focus:border-amber-300"
                              : "border-2 border-amber-500 bg-card text-foreground placeholder:text-muted-foreground"
                            : isGlass
                            ? "bg-[#006ccf]/60 sm:bg-white/10 border border-white/25 text-white placeholder:text-white/60 focus:bg-[#006ccf]/90 focus:border-white focus:ring-1 focus:ring-white/40"
                            : "border border-border bg-card text-foreground placeholder:text-muted-foreground"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* WhatsApp Sync Checkbox (Compact) */}
                <div className="flex items-center justify-between text-xs">
                  <label className={`flex items-center gap-1.5 cursor-pointer text-[11px] font-medium ${isGlass ? "text-white/90" : "text-foreground"}`}>
                    <input
                      type="checkbox"
                      checked={whatsappSameAsContact}
                      onChange={(e) => setWhatsappSameAsContact(e.target.checked)}
                      className="rounded border-border text-brand focus:ring-brand size-3.5 cursor-pointer"
                    />
                    <span>WhatsApp same as mobile number</span>
                  </label>
                  {!whatsappSameAsContact && (
                    <span className="text-[10px] text-amber-300 font-semibold">Enter WhatsApp below</span>
                  )}
                </div>

                {!whatsappSameAsContact && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${isGlass ? "text-white/85" : "text-muted-foreground"}`}>
                        WhatsApp Number *
                      </label>
                      {cleanWhatsAppDigits.length > 0 && (
                        <span
                          className={`text-[10px] font-bold transition-all ${
                            isWhatsAppComplete
                              ? isGlass ? "text-emerald-300" : "text-emerald-600"
                              : isGlass ? "text-amber-300" : "text-amber-600"
                          }`}
                        >
                          {isWhatsAppComplete ? "✓ 10 Digits" : `${cleanWhatsAppDigits.length}/10 digits`}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <WhatsAppIcon className="absolute left-3 top-2.5 size-3.5 text-[#25D366]" />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="Enter 10-digit WhatsApp number"
                        value={whatsappNumber}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setWhatsappNumber(digits);
                          if (errorMsg) setErrorMsg("");
                        }}
                        className={`w-full rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm focus:outline-none transition-all ${
                          isWhatsAppComplete
                            ? isGlass
                              ? "bg-[#006ccf]/60 sm:bg-white/10 border-2 border-emerald-400 text-white placeholder:text-white/60 focus:border-emerald-300"
                              : "border-2 border-emerald-500 bg-card text-foreground placeholder:text-muted-foreground"
                            : isWhatsAppPartial
                            ? isGlass
                              ? "bg-[#006ccf]/60 sm:bg-white/10 border-2 border-amber-400 text-white placeholder:text-white/60 focus:border-amber-300"
                              : "border-2 border-amber-500 bg-card text-foreground placeholder:text-muted-foreground"
                            : isGlass
                            ? "bg-[#006ccf]/60 sm:bg-white/10 border border-white/25 text-white placeholder:text-white/60 focus:bg-[#006ccf]/90 focus:border-white focus:ring-1 focus:ring-white/40"
                            : "border border-border bg-card text-foreground placeholder:text-muted-foreground"
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* Location Heading + GPS Button */}
                <div className="flex items-center justify-between pt-0.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isGlass ? "text-white/85" : "text-muted-foreground"}`}>
                    Service Address
                  </span>
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    disabled={isLocating}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                      isGlass
                        ? "border border-white/40 bg-white/20 text-white hover:bg-white/30"
                        : "border border-brand/30 bg-brand/10 text-brand hover:bg-brand/20"
                    }`}
                  >
                    <LocateFixed className={`size-3 ${isLocating ? "animate-spin" : ""}`} />
                    <span>{isLocating ? "Locating..." : "📍 Auto GPS"}</span>
                  </button>
                </div>

                {locationStatus && (
                  <div className={`rounded-lg px-2.5 py-1 text-[10px] font-medium flex items-center gap-1.5 ${
                    isGlass ? "border border-white/30 bg-white/20 text-white" : "border border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
                  }`}>
                    <CheckCircle2 className="size-3 shrink-0" />
                    <span className="truncate">{locationStatus}</span>
                  </div>
                )}

                {/* House / Flat + Area */}
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="relative">
                    <Home className={`absolute left-3 top-2.5 size-3.5 ${isGlass ? "text-white/70" : "text-muted-foreground"}`} />
                    <input
                      type="text"
                      placeholder="House / Flat / Building (Optional)"
                      value={houseBuilding}
                      onChange={(e) => setHouseBuilding(e.target.value)}
                      className={`w-full rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm focus:outline-none transition-all ${
                        isGlass
                          ? "bg-[#006ccf]/60 sm:bg-white/10 border border-white/25 text-white placeholder:text-white/60 focus:bg-[#006ccf]/90 focus:border-white focus:ring-1 focus:ring-white/40"
                          : "border border-border bg-card text-foreground placeholder:text-muted-foreground"
                      }`}
                    />
                  </div>

                  <div className="relative">
                    <MapPin className={`absolute left-3 top-2.5 size-3.5 ${isGlass ? "text-white/70" : "text-muted-foreground"}`} />
                    <input
                      type="text"
                      required
                      placeholder="Area / Locality / Street *"
                      value={area}
                      onChange={(e) => {
                        setArea(e.target.value);
                        if (errorMsg) setErrorMsg("");
                      }}
                      className={`w-full rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm focus:outline-none transition-all ${
                        isGlass
                          ? "bg-[#006ccf]/60 sm:bg-white/10 border border-white/25 text-white placeholder:text-white/60 focus:bg-[#006ccf]/90 focus:border-white focus:ring-1 focus:ring-white/40"
                          : "border border-border bg-card text-foreground placeholder:text-muted-foreground"
                      }`}
                    />
                  </div>
                </div>

                {/* City & PIN */}
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <input
                      list="city-suggestions"
                      type="text"
                      required
                      placeholder="City / District *"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errorMsg) setErrorMsg("");
                      }}
                      className={`w-full rounded-xl py-2 px-3 text-xs sm:text-sm focus:outline-none transition-all ${
                        isGlass
                          ? "bg-[#006ccf]/60 sm:bg-white/10 border border-white/25 text-white placeholder:text-white/60 focus:bg-[#006ccf]/90 focus:border-white focus:ring-1 focus:ring-white/40"
                          : "border border-border bg-card text-foreground"
                      }`}
                    />
                    <datalist id="city-suggestions">
                      {MAJOR_CITIES.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="PIN Code (6 digits)"
                      value={pincode}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setPincode(digits);
                        if (errorMsg) setErrorMsg("");
                      }}
                      className={`w-full rounded-xl py-2 px-3 text-xs sm:text-sm focus:outline-none transition-all ${
                        isGlass
                          ? "bg-[#006ccf]/60 sm:bg-white/10 border border-white/25 text-white placeholder:text-white/60 focus:bg-[#006ccf]/90 focus:border-white focus:ring-1 focus:ring-white/40"
                          : "border border-border bg-card text-foreground"
                      }`}
                    />
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold shrink-0 cursor-pointer ${
                        isGlass ? "border-white/25 bg-white/15 text-white hover:bg-white/25" : "border-border bg-surface text-foreground"
                      }`}
                    >
                      <ArrowLeft className="size-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={goToStep5}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider shadow-xl transition-all hover:scale-105 cursor-pointer ${
                        isPhoneComplete
                          ? isGlass
                            ? "bg-white text-slate-900 hover:bg-slate-100 shadow-2xl"
                            : "bg-brand text-brand-foreground shadow-brand/30 hover:bg-brand/90"
                          : isGlass
                          ? "bg-white/80 text-slate-900 hover:bg-white"
                          : "bg-brand/80 text-brand-foreground hover:bg-brand"
                      }`}
                    >
                      <span>Continue to Time</span>
                      <ArrowRight className="size-3.5 sm:size-4" />
                    </button>
                  </div>
                  {!isPhoneComplete && (
                    <p className={`text-[10px] text-right ${isGlass ? "text-white/70" : "text-muted-foreground"}`}>
                      * 10-digit mobile number required to proceed
                    </p>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 5: PREFERRED TIME */}
      {/* ============================================================ */}
      {step === 5 && (
        <form onSubmit={handleSubmitBooking} className={isGlass ? "space-y-2.5 sm:space-y-3" : "space-y-6"}>
          {isGlass ? (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Preferred Arrival Time
                </h2>
                <p className="text-[11px] sm:text-xs text-white/80">
                  Open 7 days a week, 8:00 AM – 9:00 PM
                </p>
              </div>
              <span className="hidden sm:inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-black tracking-wider text-white uppercase">
                Step 5 of 5
              </span>
            </div>
          ) : (
            <div>
              <div className="inline-block rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-brand-soft text-brand">
                Step 5 • Preferred Time
              </div>
              <h2 className="mt-2 text-xl md:text-2xl font-black tracking-tight text-foreground">
                When Should Our Technician Arrive?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select your preferred service day and arrival slot. Our certified team works 7 days a week, 8:00 AM – 9:00 PM.
              </p>
            </div>
          )}

          {/* Service Day Selection */}
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${isGlass ? "text-white/85" : "text-muted-foreground"}`}>
              Service Day *
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDateOption("today")}
                className={`flex flex-col items-center justify-center rounded-xl border py-2 px-1 text-center transition-all cursor-pointer ${
                  dateOption === "today"
                    ? isGlass ? "border-white bg-white text-slate-900 shadow-lg font-bold" : "border-brand bg-brand/10 shadow-md ring-2 ring-brand/40"
                    : isGlass ? "border-white/20 bg-white/10 text-white hover:bg-white/20" : "border-border bg-surface/50"
                }`}
              >
                <span className="text-xs font-black">Today</span>
                <span className={`text-[9px] font-bold mt-0.5 ${dateOption === "today" && isGlass ? "text-slate-700" : "text-emerald-300"}`}>
                  ⚡ 90-Min
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDateOption("tomorrow")}
                className={`flex flex-col items-center justify-center rounded-xl border py-2 px-1 text-center transition-all cursor-pointer ${
                  dateOption === "tomorrow"
                    ? isGlass ? "border-white bg-white text-slate-900 shadow-lg font-bold" : "border-brand bg-brand/10 shadow-md ring-2 ring-brand/40"
                    : isGlass ? "border-white/20 bg-white/10 text-white hover:bg-white/20" : "border-border bg-surface/50"
                }`}
              >
                <span className="text-xs font-black">Tomorrow</span>
                <span className={`text-[9px] font-semibold mt-0.5 ${dateOption === "tomorrow" && isGlass ? "text-slate-700" : "text-white/70"}`}>
                  Scheduled
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDateOption("custom")}
                className={`flex flex-col items-center justify-center rounded-xl border py-2 px-1 text-center transition-all cursor-pointer ${
                  dateOption === "custom"
                    ? isGlass ? "border-white bg-white text-slate-900 shadow-lg font-bold" : "border-brand bg-brand/10 shadow-md ring-2 ring-brand/40"
                    : isGlass ? "border-white/20 bg-white/10 text-white hover:bg-white/20" : "border-border bg-surface/50"
                }`}
              >
                <span className="text-xs font-black">Pick Date</span>
                <span className={`text-[9px] font-semibold mt-0.5 ${dateOption === "custom" && isGlass ? "text-slate-700" : "text-white/70"}`}>
                  Calendar
                </span>
              </button>
            </div>

            {dateOption === "custom" && (
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className={`mt-2 w-full rounded-xl py-1.5 px-3 text-xs sm:text-sm focus:outline-none transition-all ${
                  isGlass
                    ? "bg-[#006ccf]/60 sm:bg-white/10 border border-white/25 text-white focus:bg-[#006ccf]/90 focus:border-white"
                    : "border border-border bg-card text-foreground"
                }`}
              />
            )}
          </div>

          {/* Time Slot Selection */}
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${isGlass ? "text-white/85" : "text-muted-foreground"}`}>
              Preferred Window *
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {TIME_SLOTS.map((slot) => {
                const isSelected = preferredSlot === slot.label;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setPreferredSlot(slot.label)}
                    className={`flex items-center justify-between rounded-xl border px-2.5 py-1.5 text-left transition-all cursor-pointer ${
                      isSelected
                        ? isGlass ? "border-white bg-white text-slate-900 shadow-md font-bold" : "border-brand bg-brand text-brand-foreground shadow-md"
                        : isGlass ? "border-white/20 bg-white/10 text-white hover:bg-white/20" : "border-border bg-surface/50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Clock className={`size-3 shrink-0 ${isSelected && isGlass ? "text-slate-900" : "text-white/80"}`} />
                      <span className="text-[11px] font-bold leading-tight">{slot.label}</span>
                    </div>
                    {isSelected && <Check className="size-3.5 text-slate-900 shrink-0 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Instructions (Optional) */}
          <div>
            <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${isGlass ? "text-white/85" : "text-muted-foreground"}`}>
              Special Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Call before arrival, ring doorbell twice..."
              value={specialTimingNotes}
              onChange={(e) => setSpecialTimingNotes(e.target.value)}
              className={`w-full rounded-xl py-1.5 px-3 text-xs sm:text-sm focus:outline-none transition-all ${
                isGlass
                  ? "bg-[#006ccf]/60 sm:bg-white/10 border border-white/25 text-white placeholder:text-white/60 focus:bg-[#006ccf]/90 focus:border-white focus:ring-1 focus:ring-white/40"
                  : "border border-border bg-card text-foreground placeholder:text-muted-foreground"
              }`}
            />
          </div>

          {/* Complete Booking Review Card */}
          <div className={`rounded-xl border p-2.5 sm:p-3 text-xs ${
            isGlass ? "border-white/20 bg-white/15 text-white" : "border-2 border-brand/20 bg-brand/5"
          }`}>
            <div className="flex items-center justify-between pb-1.5 border-b border-white/15">
              <span className="font-extrabold text-white">
                {currentServiceObj.emoji} {currentServiceObj.title} • {acType} ({effectiveUnits} {effectiveUnits === 1 ? "Unit" : "Units"})
              </span>
              <span className="font-black text-sm text-white">
                {estimatedTotal > 0 ? `₹${estimatedTotal.toLocaleString("en-IN")}` : currentServiceObj.priceText}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-1 pt-1.5 text-[10px] text-white/80">
              <span>📍 {[area, city].filter(Boolean).join(", ") || "Service Address"}</span>
              <span className="text-emerald-300 font-bold">✓ Pay After Service (Cash/UPI)</span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={() => setStep(4)}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold shrink-0 cursor-pointer ${
                isGlass
                  ? "border-white/25 bg-white/15 text-white hover:bg-white/25"
                  : "border-border bg-surface text-foreground hover:bg-border/40"
              }`}
            >
              <ArrowLeft className="size-3.5" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider shadow-2xl transition-all hover:scale-105 cursor-pointer ${
                isGlass
                  ? "bg-white text-slate-900 hover:bg-slate-100 shadow-2xl"
                  : "bg-brand text-brand-foreground shadow-brand/40 hover:bg-brand/90"
              }`}
            >
              <span>Confirm &amp; Book</span>
              <CheckCircle2 className="size-3.5 sm:size-4" />
            </button>
          </div>
        </form>
      )}

      {/* ============================================================ */}
      {/* STEP 6: BOOKING CONFIRMATION & WHATSAPP DISPATCH */}
      {/* ============================================================ */}
      {step === 6 && createdBooking && (
        <div className="text-center py-4 space-y-6 animate-fade-in">
          <div className={`inline-flex size-16 items-center justify-center rounded-3xl ${
            isGlass
              ? "bg-white/20 text-white ring-8 ring-white/10"
              : "bg-emerald-500/10 text-emerald-500 ring-8 ring-emerald-500/5"
          }`}>
            <CheckCircle2 className="size-9" />
          </div>

          <div>
            <span className={`inline-block rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-wider ${
              isGlass ? "bg-white/20 text-white" : "bg-brand-soft text-brand"
            }`}>
              Booking ID: {createdBooking.id}
            </span>
            <h2 className={`mt-2 text-2xl md:text-3xl font-black ${isGlass ? "text-white" : "text-foreground"}`}>
              Booking Confirmed Successfully!
            </h2>
            <p className={`mt-2 text-sm max-w-md mx-auto ${isGlass ? "text-white/90" : "text-muted-foreground"}`}>
              Thank you, <strong className={isGlass ? "text-white" : "text-foreground"}>{createdBooking.customerName}</strong>. Our service desk in{" "}
              <strong className={isGlass ? "text-white" : "text-foreground"}>{createdBooking.city}</strong> has received your request and assigned a technician.
            </p>
          </div>

          {/* Full Breakdown Summary Card */}
          <div className={`rounded-2xl border p-5 text-left max-w-lg mx-auto text-sm space-y-2.5 ${
            isGlass ? "border-white/20 bg-[#0060b8]/80 text-white" : "border-border bg-surface/50 text-foreground"
          }`}>
            <div className={`flex justify-between border-b pb-2 ${isGlass ? "border-white/15" : "border-border/80"}`}>
              <span className={isGlass ? "text-white/70" : "text-muted-foreground"}>Service:</span>
              <span className={`font-bold ${isGlass ? "text-white" : "text-foreground"}`}>{createdBooking.serviceName}</span>
            </div>
            <div className={`flex justify-between border-b pb-2 ${isGlass ? "border-white/15" : "border-border/80"}`}>
              <span className={isGlass ? "text-white/70" : "text-muted-foreground"}>AC Type &amp; Units:</span>
              <span className={`font-medium ${isGlass ? "text-white" : "text-foreground"}`}>
                {createdBooking.acType} ({createdBooking.unitCount}{" "}
                {createdBooking.unitCount === "1" ? "Unit" : "Units"})
              </span>
            </div>
            <div className={`flex justify-between border-b pb-2 ${isGlass ? "border-white/15" : "border-border/80"}`}>
              <span className={isGlass ? "text-white/70" : "text-muted-foreground"}>Preferred Time:</span>
              <span className={`font-medium ${isGlass ? "text-white" : "text-foreground"}`}>
                {createdBooking.preferredDate} ({createdBooking.preferredSlot})
              </span>
            </div>
            <div className={`flex justify-between border-b pb-2 ${isGlass ? "border-white/15" : "border-border/80"}`}>
              <span className={isGlass ? "text-white/70" : "text-muted-foreground"}>Contact &amp; WhatsApp:</span>
              <span className={`font-medium ${isGlass ? "text-white" : "text-foreground"}`}>
                {createdBooking.phone} / {createdBooking.whatsappNumber || createdBooking.phone}
              </span>
            </div>
            <div className={`flex justify-between border-b pb-2 ${isGlass ? "border-white/15" : "border-border/80"}`}>
              <span className={isGlass ? "text-white/70" : "text-muted-foreground"}>Location:</span>
              <span className={`font-medium text-right max-w-xs ${isGlass ? "text-white" : "text-foreground"}`}>
                {createdBooking.address}, {createdBooking.city} - {createdBooking.pincode}
                {createdBooking.landmark ? ` (Landmark: ${createdBooking.landmark})` : ""}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className={`font-bold ${isGlass ? "text-white" : "text-foreground"}`}>Estimated Total:</span>
              <span className={`font-black text-base ${isGlass ? "text-white text-lg" : "text-brand"}`}>
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
              <WhatsAppIcon className="size-5 fill-current" />
              <span>Send on WhatsApp</span>
            </a>

            <a
              href={`tel:${EGS_CALL_NUMBER}`}
              className={`flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold shadow-sm transition-all ${
                isGlass
                  ? "bg-white text-slate-900 hover:bg-slate-100 shadow-xl"
                  : "border-2 border-border bg-card text-foreground hover:border-brand/40 hover:bg-surface"
              }`}
            >
              <Phone className="size-4 text-brand" />
              <span>Call Helpline</span>
            </a>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleReset}
              className={`text-xs font-semibold underline cursor-pointer ${
                isGlass ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-brand"
              }`}
            >
              Book Another AC Service
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
