/**
 * Data Store & Types for EGS INDIA HVAC Platform
 * Provides CRM-ready data models and persistent local storage
 * with WhatsApp notification builders and mock API functions.
 */

import { TrackingData, getStoredTracking } from "./tracking";

export type ServiceCategory =
  | "ac-service"
  | "ac-repair"
  | "ac-installation"
  | "ac-amc"
  | "commercial-hvac";

export type ACType = "Split AC" | "Window AC" | "Cassette AC" | "Tower AC" | "Central / VRV";

export type BookingStatus =
  | "new"
  | "confirmed"
  | "technician_assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Booking {
  id: string; // e.g. EGS-2026-1042
  createdAt: string;
  status: BookingStatus;
  
  // Service info
  serviceCategory: ServiceCategory;
  serviceName: string;
  subService: string;
  acType: ACType;
  acBrand: string;
  unitCount: number;
  issueDescription?: string;
  
  // Schedule
  preferredDate: string;
  preferredSlot: string; // "Morning (9 AM - 12 PM)", "Afternoon (12 PM - 3 PM)", etc.
  
  // Customer info
  customerName: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  address: string;
  landmark?: string;
  city: string;
  pincode: string;
  specialNotes?: string;
  
  // Pricing & Assignment
  estimatedAmount: number;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  
  // Ad & Attribution Tracking
  attribution: TrackingData;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  city: string;
  rating: number;
  experienceYears: number;
  specialization: string[];
  status: "available" | "on_job" | "off_duty";
  activeJobsCount: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  totalBookings: number;
  lastBookingDate: string;
  amcActive: boolean;
}

export interface AMCContract {
  id: string;
  contractNo: string;
  customerName: string;
  phone: string;
  city: string;
  planName: "Residential Saver" | "Comprehensive Care" | "Commercial Pro";
  unitsCovered: number;
  startDate: string;
  expiryDate: string;
  servicesIncluded: number;
  servicesCompleted: number;
  status: "active" | "expiring_soon" | "expired";
  amount: number;
}

// Initial Technicians Data
const SEED_TECHNICIANS: Technician[] = [
  {
    id: "tech-1",
    name: "Arun Kumar",
    phone: "+91 98950 12345",
    city: "Kollam",
    rating: 4.9,
    experienceYears: 8,
    specialization: ["Jet Cleaning", "PCB Repair", "Gas Refill"],
    status: "available",
    activeJobsCount: 1,
  },
  {
    id: "tech-2",
    name: "Vipin Das",
    phone: "+91 85890 54321",
    city: "Thiruvananthapuram",
    rating: 4.8,
    experienceYears: 6,
    specialization: ["Installation", "Ductable AC", "Inverter AC"],
    status: "on_job",
    activeJobsCount: 2,
  },
  {
    id: "tech-3",
    name: "Muhammed Shafi",
    phone: "+91 85899 98765",
    city: "Ernakulam",
    rating: 4.9,
    experienceYears: 10,
    specialization: ["VRV/VRF Systems", "Commercial Chillers", "Compressor Replacement"],
    status: "available",
    activeJobsCount: 0,
  },
  {
    id: "tech-4",
    name: "Sujith Nair",
    phone: "+91 99959 11223",
    city: "Thrissur",
    rating: 4.7,
    experienceYears: 5,
    specialization: ["AMC Maintenance", "Foam Wash", "Leak Detection"],
    status: "available",
    activeJobsCount: 1,
  },
  {
    id: "tech-5",
    name: "Karthik R.",
    phone: "+91 98958 33445",
    city: "Chennai",
    rating: 4.9,
    experienceYears: 7,
    specialization: ["Split AC", "Multi-brand Repair", "Emergency Fix"],
    status: "on_job",
    activeJobsCount: 3,
  },
];

// Initial AMC Contracts
const SEED_AMC: AMCContract[] = [
  {
    id: "amc-1",
    contractNo: "AMC-2026-081",
    customerName: "Dr. Thomas Mathew",
    phone: "+91 94471 22334",
    city: "Kollam",
    planName: "Comprehensive Care",
    unitsCovered: 3,
    startDate: "2026-01-15",
    expiryDate: "2027-01-14",
    servicesIncluded: 4,
    servicesCompleted: 2,
    status: "active",
    amount: 5999,
  },
  {
    id: "amc-2",
    contractNo: "AMC-2026-104",
    customerName: "Apex Software Solutions",
    phone: "+91 98956 77889",
    city: "Ernakulam",
    planName: "Commercial Pro",
    unitsCovered: 12,
    startDate: "2025-11-01",
    expiryDate: "2026-10-31",
    servicesIncluded: 6,
    servicesCompleted: 5,
    status: "expiring_soon",
    amount: 34999,
  },
  {
    id: "amc-3",
    contractNo: "AMC-2026-118",
    customerName: "Reshmi Rajeev",
    phone: "+91 97450 66778",
    city: "Thiruvananthapuram",
    planName: "Residential Saver",
    unitsCovered: 2,
    startDate: "2026-03-10",
    expiryDate: "2027-03-09",
    servicesIncluded: 3,
    servicesCompleted: 1,
    status: "active",
    amount: 3499,
  },
];

// Initial Sample Bookings
const SEED_BOOKINGS: Booking[] = [
  {
    id: "EGS-2026-1089",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: "new",
    serviceCategory: "ac-repair",
    serviceName: "AC Repair & Troubleshooting",
    subService: "Water Leakage & Drainage Block",
    acType: "Split AC",
    acBrand: "Daikin",
    unitCount: 1,
    issueDescription: "Water dripping heavily from indoor unit onto bedroom floor.",
    preferredDate: "Today (Express)",
    preferredSlot: "Evening (3:00 PM - 7:00 PM)",
    customerName: "Naveen Chandran",
    phone: "+91 98471 55667",
    alternatePhone: "+91 94470 11223",
    email: "naveen.c@gmail.com",
    address: "Flat 4B, Skyview Apartments, Asramam",
    landmark: "Near Adventure Park",
    city: "Kollam",
    pincode: "691001",
    estimatedAmount: 599,
    attribution: {
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "Search_AC_Repair_Kerala",
      utm_term: "ac repair near me",
      utm_content: "emergency_leak_fix",
      gclid: "Cj0KCQjwn-PCBhDaARIsA",
      fbclid: "",
      referrer: "https://www.google.com/",
      landing_page: "/services/ac-repair",
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: "EGS-2026-1088",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    status: "technician_assigned",
    serviceCategory: "ac-service",
    serviceName: "AC Jet Service",
    subService: "Deep Hydro Jet Cleaning & Sanitization",
    acType: "Split AC",
    acBrand: "Voltas",
    unitCount: 2,
    issueDescription: "Routine pre-summer deep maintenance and foam jet cleaning.",
    preferredDate: "Tomorrow",
    preferredSlot: "Morning (9:00 AM - 12:00 PM)",
    customerName: "Priya Soman",
    phone: "+91 98952 44332",
    email: "priya.soman@yahoo.com",
    address: "House 24, Emerald Gardens, Jawahar Nagar",
    landmark: "Behind Club",
    city: "Thiruvananthapuram",
    pincode: "695003",
    estimatedAmount: 1198,
    assignedTechnicianId: "tech-2",
    assignedTechnicianName: "Vipin Das",
    attribution: {
      utm_source: "meta",
      utm_medium: "cpc",
      utm_campaign: "Meta_Summer_AC_Service",
      utm_term: "",
      utm_content: "foam_wash_ad_video",
      gclid: "",
      fbclid: "fb_click_id_992834710",
      referrer: "https://l.instagram.com/",
      landing_page: "/services/ac-service",
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: "EGS-2026-1087",
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    status: "confirmed",
    serviceCategory: "ac-installation",
    serviceName: "AC Installation",
    subService: "New Split AC Installation with Copper Piping",
    acType: "Split AC",
    acBrand: "Mitsubishi Heavy",
    unitCount: 1,
    preferredDate: "Tomorrow",
    preferredSlot: "Afternoon (12:00 PM - 3:00 PM)",
    customerName: "Mathew Varghese",
    phone: "+91 97455 88990",
    email: "mathew.v@outlook.com",
    address: "Villa 12, Sobha Silver, Kakkanad",
    city: "Ernakulam",
    pincode: "682030",
    estimatedAmount: 1499,
    assignedTechnicianId: "tech-3",
    assignedTechnicianName: "Muhammed Shafi",
    attribution: {
      utm_source: "direct",
      utm_medium: "none",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
      gclid: "",
      fbclid: "",
      referrer: "direct",
      landing_page: "/services/ac-installation",
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: "EGS-2026-1086",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    status: "completed",
    serviceCategory: "commercial-hvac",
    serviceName: "Commercial HVAC Inspection",
    subService: "Ductable AC & VRV Diagnostic Check",
    acType: "Central / VRV",
    acBrand: "Blue Star",
    unitCount: 4,
    customerName: "Kalyan Textiles Ltd",
    phone: "+91 94470 88221",
    email: "facility@kalyantextiles.com",
    address: "MG Road Commercial Plaza, Round South",
    city: "Thrissur",
    pincode: "680001",
    estimatedAmount: 4500,
    assignedTechnicianId: "tech-4",
    assignedTechnicianName: "Sujith Nair",
    attribution: {
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "Commercial_HVAC_Search",
      utm_term: "commercial hvac contractors",
      utm_content: "b2b_landing",
      gclid: "Cj0KCQjwn_commercial_gclid",
      fbclid: "",
      referrer: "https://www.google.com/",
      landing_page: "/services/commercial-hvac",
      timestamp: new Date().toISOString(),
    },
  },
];

const STORAGE_KEYS = {
  BOOKINGS: "egs_crm_bookings",
  TECHNICIANS: "egs_crm_technicians",
  AMC: "egs_crm_amc",
};

/**
 * Storage helpers
 */
export function getBookings(): Booking[] {
  if (typeof window === "undefined") return SEED_BOOKINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS));
      return SEED_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_BOOKINGS;
  }
}

export function saveBooking(bookingData: Omit<Booking, "id" | "createdAt" | "status" | "attribution">): Booking {
  const current = getBookings();
  const nextNumber = 1090 + current.length;
  const newBooking: Booking = {
    ...bookingData,
    id: `EGS-2026-${nextNumber}`,
    createdAt: new Date().toISOString(),
    status: "new",
    attribution: getStoredTracking(),
  };

  const updated = [newBooking, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
  }
  return newBooking;
}

export function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  technicianId?: string
): Booking | undefined {
  const current = getBookings();
  let updatedBooking: Booking | undefined;
  
  const techs = getTechnicians();
  const assignedTech = technicianId ? techs.find((t) => t.id === technicianId) : undefined;

  const updated = current.map((b) => {
    if (b.id === bookingId) {
      updatedBooking = {
        ...b,
        status,
        ...(assignedTech && {
          assignedTechnicianId: assignedTech.id,
          assignedTechnicianName: assignedTech.name,
        }),
      };
      return updatedBooking;
    }
    return b;
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
  }
  return updatedBooking;
}

export function getTechnicians(): Technician[] {
  if (typeof window === "undefined") return SEED_TECHNICIANS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TECHNICIANS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(SEED_TECHNICIANS));
      return SEED_TECHNICIANS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_TECHNICIANS;
  }
}

export function getAMCContracts(): AMCContract[] {
  if (typeof window === "undefined") return SEED_AMC;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AMC);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AMC, JSON.stringify(SEED_AMC));
      return SEED_AMC;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_AMC;
  }
}

/**
 * WhatsApp Confirmation Message Generator
 */
export const EGS_WHATSAPP_NUMBER = "919895688833"; // 9895688833
export const EGS_CALL_NUMBER = "+919895688833";

export function generateCustomerWhatsAppURL(booking: Booking): string {
  const text = `*New Service Booking - EGS INDIA* ❄️
━━━━━━━━━━━━━━━━━━
*Booking ID:* ${booking.id}
*Service:* ${booking.serviceName} (${booking.subService})
*AC Type:* ${booking.acType} (${booking.unitCount} Unit${booking.unitCount > 1 ? "s" : ""}) ${booking.acBrand ? `- ${booking.acBrand}` : ""}
*Date & Slot:* ${booking.preferredDate} | ${booking.preferredSlot}
*Customer Name:* ${booking.customerName}
*Phone:* ${booking.phone}
*Address:* ${booking.address}, ${booking.city} - ${booking.pincode}
${booking.issueDescription ? `*Issue Note:* ${booking.issueDescription}\n` : ""}*Est. Amount:* ₹${booking.estimatedAmount}
━━━━━━━━━━━━━━━━━━
Please confirm my booking slot and technician arrival time. Thank you!`;

  return `https://wa.me/${EGS_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function generateAdminToCustomerWhatsAppURL(booking: Booking, templateType: "confirm" | "tech_dispatched" | "completed"): string {
  const cleanPhone = booking.phone.replace(/[^0-9]/g, "");
  const targetPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;

  let text = "";
  if (templateType === "confirm") {
    text = `Hello ${booking.customerName}! 👋
Your HVAC service booking *${booking.id}* has been confirmed by *Expert Goods & Services (EGS INDIA)*.

📋 *Booking Details:*
• Service: ${booking.serviceName}
• Slot: ${booking.preferredDate} (${booking.preferredSlot})
• City: ${booking.city}

Our certified technician will contact you prior to visiting. For immediate assistance call us at +91 9895688833.`;
  } else if (templateType === "tech_dispatched") {
    text = `Hello ${booking.customerName}! 🚀
Our certified HVAC technician *${booking.assignedTechnicianName || "Arun Kumar"}* has been assigned to your booking *${booking.id}* and is on the way to your location.

• Service: ${booking.serviceName}
• Technician Contact: +91 9895688833
Need to reschedule? Reply directly to this WhatsApp message.`;
  } else {
    text = `Thank you for choosing *EGS INDIA*! ⭐
Your service *${booking.id}* has been marked completed.

We provide a *30-Day Post Service Guarantee* on all repairs and jet cleaning. If you experience any issues, we will revisit free of cost.
Have feedback? Please let us know how we did!`;
  }

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}
