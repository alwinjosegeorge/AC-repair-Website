/**
 * Data Store & Types for EGS INDIA HVAC Platform
 * Provides CRM-ready data models and persistent local storage
 * with WhatsApp notification builders and mock API functions.
 */

import { TrackingData, getStoredTracking } from "./tracking";

export type ServiceCategory =
  | "ac-service"
  | "ac-repair"
  | "ac-cleaning"
  | "ac-installation"
  | "gas-charging"
  | "commercial-hvac"
  | "ac-amc"
  | "buy-new-ac";

export type ACType =
  | "Split AC"
  | "Window AC"
  | "Cassette AC"
  | "Ductable AC"
  | "VRF / VRV"
  | "Central AC"
  | "Other";

export type BookingStatus =
  | "NEW"
  | "CONTACTED"
  | "CONFIRMED"
  | "ASSIGNED"
  | "TECHNICIAN ON THE WAY"
  | "SERVICE STARTED"
  | "COMPLETED"
  | "PAYMENT RECEIVED"
  | "CANCELLED";

export const BOOKING_STATUS_FLOW: BookingStatus[] = [
  "NEW",
  "CONTACTED",
  "CONFIRMED",
  "ASSIGNED",
  "TECHNICIAN ON THE WAY",
  "SERVICE STARTED",
  "COMPLETED",
  "PAYMENT RECEIVED",
];

export function normalizeBookingStatus(status: string): BookingStatus {
  const upper = (status || "").toUpperCase().trim();
  if (upper === "NEW") return "NEW";
  if (upper === "CONTACTED") return "CONTACTED";
  if (upper === "CONFIRMED") return "CONFIRMED";
  if (upper === "ASSIGNED" || upper === "TECHNICIAN_ASSIGNED") return "ASSIGNED";
  if (upper === "TECHNICIAN ON THE WAY") return "TECHNICIAN ON THE WAY";
  if (upper === "SERVICE STARTED" || upper === "IN_PROGRESS") return "SERVICE STARTED";
  if (upper === "COMPLETED") return "COMPLETED";
  if (upper === "PAYMENT RECEIVED") return "PAYMENT RECEIVED";
  if (upper === "CANCELLED" || upper === "CANCELED") return "CANCELLED";
  return "NEW";
}

export interface Booking {
  id: string; // e.g. EGS-2026-1042
  createdAt: string;
  status: BookingStatus;
  
  // Service info
  serviceCategory: ServiceCategory;
  serviceName: string;
  subService?: string;
  acType: ACType;
  acBrand?: string;
  unitCount: number | string; // 1, 2, 3, 4, "5+"
  issueDescription?: string;
  
  // Schedule
  preferredDate?: string;
  preferredSlot?: string; // "Morning (9 AM - 12 PM)", "Afternoon (12 PM - 3 PM)", etc.
  
  // Customer info
  customerName: string;
  phone: string;
  whatsappNumber?: string;
  alternatePhone?: string;
  email?: string;
  houseBuilding?: string;
  area?: string;
  address: string;
  landmark?: string;
  city: string;
  pincode: string;
  locationCoordinates?: { latitude: number; longitude: number };
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

export interface CustomerBookingHistory {
  bookingId: string;
  serviceCategory: ServiceCategory;
  serviceName: string;
  subService?: string;
  date: string;
  slot?: string;
  amount: number;
  status: BookingStatus;
  technicianName?: string;
}

export interface Customer {
  id: string; // Customer ID e.g. "CUST-2026-101"
  name: string;
  mobile: string;
  whatsapp: string;
  email: string;
  address: string;
  pin: string;
  location: string;
  locationCoordinates?: { latitude: number; longitude: number };
  previousServices: string[];
  acType: ACType;
  numberOfUnits: number | string;
  amcStatus: "Active" | "Expiring Soon" | "Expired" | "None";
  amcPlan?: string;
  bookingHistory: CustomerBookingHistory[];
  totalSpend: number;
  lastBookingDate?: string;
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

// Initial Sample Bookings with complete status lifecycle
const SEED_BOOKINGS: Booking[] = [
  {
    id: "EGS-2026-1095",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: "NEW",
    serviceCategory: "ac-service",
    serviceName: "❄ AC Service",
    subService: "Deep Hydro Jet Cleaning & Sanitization",
    acType: "Split AC",
    acBrand: "Daikin",
    unitCount: 2,
    issueDescription: "Pre-summer jet wash required for living room and bedroom ACs.",
    preferredDate: "Today (Express 90-Min Slot)",
    preferredSlot: "Morning (9:00 AM - 12:00 PM)",
    customerName: "Sanjay Menon",
    phone: "+91 98950 11223",
    whatsappNumber: "+91 98950 11223",
    houseBuilding: "Villa 4B, Palm Meadows",
    area: "Kadavanthra",
    address: "Villa 4B, Palm Meadows, Kadavanthra",
    landmark: "Near Metro Station",
    city: "Ernakulam / Cochin",
    pincode: "682020",
    estimatedAmount: 998,
    attribution: {
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "Google_AC_Service_Kochi",
      utm_term: "ac jet wash near me",
      utm_content: "search_ad_v1",
      gclid: "gclid_demo_1095",
      fbclid: "",
      referrer: "https://www.google.com/",
      landing_page: "/services/ac-service",
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: "EGS-2026-1094",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: "CONTACTED",
    serviceCategory: "ac-repair",
    serviceName: "🔧 AC Repair",
    subService: "Water Leakage & Drainage Block",
    acType: "Split AC",
    acBrand: "Voltas",
    unitCount: 1,
    issueDescription: "Water leaking heavily from indoor unit onto bedroom floor.",
    preferredDate: "Today (Express 90-Min Slot)",
    preferredSlot: "Afternoon (12:00 PM - 3:00 PM)",
    customerName: "Naveen Chandran",
    phone: "+91 98471 55667",
    whatsappNumber: "+91 98471 55667",
    houseBuilding: "Flat 4B, Skyview Apts",
    area: "Asramam",
    address: "Flat 4B, Skyview Apts, Asramam",
    landmark: "Near Adventure Park",
    city: "Kollam",
    pincode: "691001",
    estimatedAmount: 599,
    attribution: {
      utm_source: "meta",
      utm_medium: "cpc",
      utm_campaign: "Meta_Emergency_Repair_Kerala",
      utm_term: "",
      utm_content: "leak_fix_video",
      gclid: "",
      fbclid: "fb_click_id_992834",
      referrer: "https://l.instagram.com/",
      landing_page: "/services/ac-repair",
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: "EGS-2026-1093",
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    status: "CONFIRMED",
    serviceCategory: "gas-charging",
    serviceName: "💨 Gas Charging",
    subService: "Full Gas Refill (R32 / R410A / R22)",
    acType: "Split AC",
    acBrand: "LG",
    unitCount: 1,
    issueDescription: "AC blowing warm air, low refrigerant level suspected.",
    preferredDate: "Today (Express 90-Min Slot)",
    preferredSlot: "Evening (3:00 PM - 7:00 PM)",
    customerName: "Aiswarya Lakshmi",
    phone: "+91 94472 88991",
    whatsappNumber: "+91 94472 88991",
    houseBuilding: "House No 18, Kowdiar Gardens",
    area: "Kowdiar",
    address: "House No 18, Kowdiar Gardens, Kowdiar",
    landmark: "Behind Golf Club",
    city: "Thiruvananthapuram",
    pincode: "695003",
    estimatedAmount: 1499,
    attribution: {
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "Search_AC_Gas_Refill",
      utm_term: "ac gas filling charges",
      utm_content: "r32_refill_ad",
      gclid: "gclid_demo_1093",
      fbclid: "",
      referrer: "https://www.google.com/",
      landing_page: "/book",
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: "EGS-2026-1092",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    status: "ASSIGNED",
    serviceCategory: "ac-installation",
    serviceName: "⚙ AC Installation",
    subService: "New Split AC Installation with Copper Piping",
    acType: "Split AC",
    acBrand: "Mitsubishi",
    unitCount: 1,
    issueDescription: "Brand new 1.5T inverter AC unboxing and precision wall fitting.",
    preferredDate: "Tomorrow",
    preferredSlot: "Morning (9:00 AM - 12:00 PM)",
    customerName: "Mathew Varghese",
    phone: "+91 97455 88990",
    whatsappNumber: "+91 97455 88990",
    houseBuilding: "Villa 12, Sobha Silver",
    area: "Kakkanad",
    address: "Villa 12, Sobha Silver, Kakkanad",
    landmark: "Near Infopark Phase 1",
    city: "Ernakulam / Cochin",
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
    id: "EGS-2026-1091",
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    status: "TECHNICIAN ON THE WAY",
    serviceCategory: "ac-service",
    serviceName: "❄ AC Service",
    subService: "Deep Jet Power Cleaning (Indoor + Outdoor)",
    acType: "Cassette AC",
    acBrand: "Blue Star",
    unitCount: 2,
    issueDescription: "Commercial showroom ceiling cassette power jet flush.",
    preferredDate: "Today (Express 90-Min Slot)",
    preferredSlot: "Afternoon (12:00 PM - 3:00 PM)",
    customerName: "Priya Soman",
    phone: "+91 98952 44332",
    whatsappNumber: "+91 98952 44332",
    houseBuilding: "Soman Arcade, Round South",
    area: "Round South",
    address: "Soman Arcade, Round South",
    landmark: "Opp. Swaraj Round",
    city: "Thrissur",
    pincode: "680001",
    estimatedAmount: 1798,
    assignedTechnicianId: "tech-4",
    assignedTechnicianName: "Sujith Nair",
    attribution: {
      utm_source: "meta",
      utm_medium: "cpc",
      utm_campaign: "Meta_Commercial_HVAC",
      utm_term: "",
      utm_content: "thrissur_promo",
      gclid: "",
      fbclid: "fb_click_id_1091",
      referrer: "https://l.facebook.com/",
      landing_page: "/services/ac-service",
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: "EGS-2026-1090",
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    status: "SERVICE STARTED",
    serviceCategory: "ac-repair",
    serviceName: "🔧 AC Repair",
    subService: "PCB Board Repair & Power Trip",
    acType: "Split AC",
    acBrand: "Panasonic",
    unitCount: 1,
    issueDescription: "Unit trips MCB switch immediately when turned on.",
    preferredDate: "Today (Express 90-Min Slot)",
    preferredSlot: "Morning (9:00 AM - 12:00 PM)",
    customerName: "Biju Thomas",
    phone: "+91 94470 66554",
    whatsappNumber: "+91 94470 66554",
    houseBuilding: "House 55, Beach Road",
    area: "Chinnakkada",
    address: "House 55, Beach Road, Chinnakkada",
    landmark: "Near Railway Station",
    city: "Kollam",
    pincode: "691001",
    estimatedAmount: 799,
    assignedTechnicianId: "tech-1",
    assignedTechnicianName: "Arun Kumar",
    attribution: {
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "Search_PCB_Repair",
      utm_term: "ac pcb repair service",
      utm_content: "kollam_local_desk",
      gclid: "gclid_demo_1090",
      fbclid: "",
      referrer: "https://www.google.com/",
      landing_page: "/services/ac-repair",
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: "EGS-2026-1089b",
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    status: "COMPLETED",
    serviceCategory: "ac-service",
    serviceName: "🧹 AC Cleaning",
    subService: "Indoor & Outdoor Foam Wash",
    acType: "Split AC",
    acBrand: "Carrier",
    unitCount: 1,
    issueDescription: "Deep foam wash completed. Customer requested invoice on WhatsApp.",
    preferredDate: "Today (Express 90-Min Slot)",
    preferredSlot: "Morning (9:00 AM - 12:00 PM)",
    customerName: "Rohan Varma",
    phone: "+91 97440 22334",
    whatsappNumber: "+91 97440 22334",
    houseBuilding: "Flat 2C, Sky Towers",
    area: "Pattom",
    address: "Flat 2C, Sky Towers, Pattom",
    landmark: "Near LIC Office",
    city: "Thiruvananthapuram",
    pincode: "695004",
    estimatedAmount: 499,
    assignedTechnicianId: "tech-2",
    assignedTechnicianName: "Vipin Das",
    attribution: {
      utm_source: "direct",
      utm_medium: "none",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
      gclid: "",
      fbclid: "",
      referrer: "direct",
      landing_page: "/",
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: "EGS-2026-1088b",
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    status: "PAYMENT RECEIVED",
    serviceCategory: "gas-charging",
    serviceName: "💨 Gas Charging",
    subService: "Nitrogen Pressure Leak Detection & R410A Refill",
    acType: "Split AC",
    acBrand: "Daikin",
    unitCount: 1,
    issueDescription: "Flare nut brazed, pressure tested, full R410A gas charged. ₹1,499 paid via GPay.",
    preferredDate: "Today (Express 90-Min Slot)",
    preferredSlot: "Morning (9:00 AM - 12:00 PM)",
    customerName: "Harish Kumar",
    phone: "+91 98460 77881",
    whatsappNumber: "+91 98460 77881",
    houseBuilding: "House 12, Lake View",
    area: "Thevara",
    address: "House 12, Lake View, Thevara",
    landmark: "Near Sacred Heart College",
    city: "Ernakulam / Cochin",
    pincode: "682013",
    estimatedAmount: 1499,
    assignedTechnicianId: "tech-3",
    assignedTechnicianName: "Muhammed Shafi",
    attribution: {
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "Google_Search_Gas_Refill",
      utm_term: "daikin ac gas filling",
      utm_content: "gpay_instant",
      gclid: "gclid_demo_1088",
      fbclid: "",
      referrer: "https://www.google.com/",
      landing_page: "/book",
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: "EGS-2026-1087b",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    status: "CANCELLED",
    serviceCategory: "ac-service",
    serviceName: "❄ AC Service",
    subService: "Pre-Summer Servicing",
    acType: "Window AC",
    acBrand: "Voltas",
    unitCount: 1,
    issueDescription: "Customer had to travel urgently for medical reasons, requested cancellation.",
    preferredDate: "Yesterday",
    preferredSlot: "Evening (3:00 PM - 7:00 PM)",
    customerName: "Meera Krishnan",
    phone: "+91 94471 99882",
    whatsappNumber: "+91 94471 99882",
    houseBuilding: "Krishnapriya, Hill Road",
    area: "Kowdiar",
    address: "Krishnapriya, Hill Road, Kowdiar",
    landmark: "Near Raj Bhavan",
    city: "Thiruvananthapuram",
    pincode: "695003",
    estimatedAmount: 499,
    attribution: {
      utm_source: "meta",
      utm_medium: "cpc",
      utm_campaign: "Meta_Retargeting_Leads",
      utm_term: "",
      utm_content: "cancelled_followup",
      gclid: "",
      fbclid: "fb_click_id_cancel",
      referrer: "https://l.instagram.com/",
      landing_page: "/services/ac-service",
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: "EGS-2026-1086",
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    status: "NEW",
    serviceCategory: "commercial-hvac",
    serviceName: "🏢 Commercial HVAC",
    subService: "VRV / VRF System Installation & Diagnostic",
    acType: "VRF / VRV",
    acBrand: "Daikin",
    unitCount: "8+",
    issueDescription: "3-floor IT office VRV outdoor unit diagnostic and maintenance proposal required.",
    preferredDate: "Upcoming Monday",
    preferredSlot: "Morning (9:00 AM - 12:00 PM)",
    customerName: "Kalyan InfoTech Pvt Ltd",
    phone: "+91 94470 88221",
    whatsappNumber: "+91 94470 88221",
    houseBuilding: "Cyber Towers, 4th Floor",
    area: "Round South",
    address: "Cyber Towers, 4th Floor, Round South",
    landmark: "MG Road Commercial Plaza",
    city: "Thrissur",
    pincode: "680001",
    estimatedAmount: 6500,
    attribution: {
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "Commercial_HVAC_Search",
      utm_term: "commercial hvac contractors kerala",
      utm_content: "vrv_quote_b2b",
      gclid: "gclid_demo_quote",
      fbclid: "",
      referrer: "https://www.google.com/",
      landing_page: "/services/commercial-hvac",
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: "EGS-2026-1085",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    status: "CONTACTED",
    serviceCategory: "ac-amc",
    serviceName: "📋 AMC",
    subService: "Residential Saver Plan (3 Free Wet Services + 1 Free Breakdown)",
    acType: "Split AC",
    acBrand: "Blue Star",
    unitCount: 3,
    issueDescription: "Annual maintenance contract quote for 3 bedroom split ACs in duplex villa.",
    preferredDate: "Next Saturday",
    preferredSlot: "Morning (9:00 AM - 12:00 PM)",
    customerName: "Deepak Sreekumar",
    phone: "+91 98951 33445",
    whatsappNumber: "+91 98951 33445",
    houseBuilding: "Deepam, Riverside Enclave",
    area: "Asramam",
    address: "Deepam, Riverside Enclave, Asramam",
    landmark: "Near Ashtamudi Lake",
    city: "Kollam",
    pincode: "691001",
    estimatedAmount: 3999,
    attribution: {
      utm_source: "meta",
      utm_medium: "cpc",
      utm_campaign: "Meta_AMC_Promo",
      utm_term: "",
      utm_content: "amc_annual_care",
      gclid: "",
      fbclid: "fb_click_id_amc",
      referrer: "https://l.facebook.com/",
      landing_page: "/services/ac-amc",
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: "EGS-2026-1084",
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    status: "NEW",
    serviceCategory: "buy-new-ac",
    serviceName: "🛒 Buy new ac",
    subService: "1.5 Ton 5-Star Inverter Split AC Inquiry",
    acType: "Split AC",
    acBrand: "Daikin",
    unitCount: 2,
    issueDescription: "Looking to purchase 2 new 5-star inverter split units with installation.",
    preferredDate: "Tomorrow",
    preferredSlot: "Evening (3:00 PM - 7:00 PM)",
    customerName: "Anand Raghunath",
    phone: "+91 97451 44556",
    whatsappNumber: "+91 97451 44556",
    houseBuilding: "Flat 8A, Prime Heights",
    area: "Anna Nagar",
    address: "Flat 8A, Prime Heights, Anna Nagar",
    landmark: "Near Tower Park",
    city: "Chennai",
    pincode: "600040",
    estimatedAmount: 76000,
    attribution: {
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "Google_Buy_AC_Online",
      utm_term: "daikin 5 star inverter ac price chennai",
      utm_content: "buy_ac_quote",
      gclid: "gclid_demo_buy_ac",
      fbclid: "",
      referrer: "https://www.google.com/",
      landing_page: "/book",
      timestamp: new Date().toISOString(),
    },
  },
];

const STORAGE_KEYS = {
  BOOKINGS: "egs_crm_bookings_v2",
  TECHNICIANS: "egs_crm_technicians_v2",
  AMC: "egs_crm_amc_v2",
  CUSTOMERS: "egs_crm_customers_v3",
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
    const parsed: Booking[] = JSON.parse(raw);
    return parsed.map((b) => ({
      ...b,
      status: normalizeBookingStatus(b.status),
    }));
  } catch {
    return SEED_BOOKINGS;
  }
}

export function saveBooking(bookingData: Omit<Booking, "id" | "createdAt" | "status" | "attribution">): Booking {
  const current = getBookings();
  const nextNumber = 1096 + current.length;
  const newBooking: Booking = {
    ...bookingData,
    id: `EGS-2026-${nextNumber}`,
    createdAt: new Date().toISOString(),
    status: "NEW",
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

export const SEED_CUSTOMERS: Customer[] = [
  {
    id: "CUST-2026-101",
    name: "Sanjay Menon",
    mobile: "+91 98950 11223",
    whatsapp: "+91 98950 11223",
    email: "sanjay.menon@gmail.com",
    address: "Villa 4B, Palm Meadows, Kadavanthra",
    pin: "682020",
    location: "Kadavanthra, Ernakulam / Cochin",
    locationCoordinates: { latitude: 9.9674, longitude: 76.2995 },
    previousServices: ["❄ AC Service", "🔧 AC Repair"],
    acType: "Split AC",
    numberOfUnits: 2,
    amcStatus: "Active",
    amcPlan: "Residential Saver (2 Units)",
    totalSpend: 1848,
    lastBookingDate: "2026-10-25T11:00:00.000Z",
    bookingHistory: [
      {
        bookingId: "EGS-2026-1095",
        serviceCategory: "ac-service",
        serviceName: "❄ AC Service",
        subService: "Deep Hydro Jet Cleaning & Sanitization",
        date: "Today (Express 90-Min Slot)",
        slot: "Morning (9:00 AM - 12:00 PM)",
        amount: 998,
        status: "NEW",
      },
      {
        bookingId: "EGS-2025-0812",
        serviceCategory: "ac-repair",
        serviceName: "🔧 AC Repair",
        subService: "Capacitor Replacement & General Check",
        date: "14 Oct 2025",
        slot: "Afternoon (12:00 PM - 3:00 PM)",
        amount: 850,
        status: "COMPLETED",
        technicianName: "Muhammed Shafi",
      },
    ],
  },
  {
    id: "CUST-2026-102",
    name: "Anita George",
    mobile: "+91 94472 88990",
    whatsapp: "+91 94472 88990",
    email: "anita.george@outlook.com",
    address: "Apt 502, Skyline Oasis, Pattom",
    pin: "695004",
    location: "Pattom, Thiruvananthapuram",
    locationCoordinates: { latitude: 8.5241, longitude: 76.9366 },
    previousServices: ["🔧 AC Repair"],
    acType: "Split AC",
    numberOfUnits: 1,
    amcStatus: "None",
    totalSpend: 699,
    lastBookingDate: "2026-10-25T10:30:00.000Z",
    bookingHistory: [
      {
        bookingId: "EGS-2026-1094",
        serviceCategory: "ac-repair",
        serviceName: "🔧 AC Repair",
        subService: "Water Leakage & Drainage Block",
        date: "Today (Express 90-Min Slot)",
        slot: "Afternoon (12:00 PM - 3:00 PM)",
        amount: 699,
        status: "CONTACTED",
      },
    ],
  },
  {
    id: "CUST-2026-103",
    name: "Apex Software Solutions",
    mobile: "+91 98956 77889",
    whatsapp: "+91 98956 77889",
    email: "facilities@apexsoftware.in",
    address: "Level 4, IT Tower 2, Infopark Phase 1, Kakkanad",
    pin: "682030",
    location: "Infopark, Kakkanad, Ernakulam",
    locationCoordinates: { latitude: 10.0104, longitude: 76.3654 },
    previousServices: ["⚙ AC Installation", "🏢 Commercial HVAC", "📋 AMC"],
    acType: "VRF / VRV",
    numberOfUnits: 12,
    amcStatus: "Expiring Soon",
    amcPlan: "Commercial Pro (12 Units)",
    totalSpend: 36498,
    lastBookingDate: "2026-10-25T09:15:00.000Z",
    bookingHistory: [
      {
        bookingId: "EGS-2026-1092",
        serviceCategory: "ac-installation",
        serviceName: "⚙ AC Installation",
        subService: "Inverter Split AC Full Installation",
        date: "Tomorrow",
        slot: "Morning (9:00 AM - 12:00 PM)",
        amount: 1499,
        status: "ASSIGNED",
        technicianName: "Muhammed Shafi",
      },
      {
        bookingId: "EGS-2025-1101",
        serviceCategory: "commercial-hvac",
        serviceName: "🏢 Commercial HVAC",
        subService: "Annual VRV Performance & Gas Charge",
        date: "01 Nov 2025",
        slot: "Full Day Service",
        amount: 34999,
        status: "COMPLETED",
        technicianName: "Muhammed Shafi",
      },
    ],
  },
  {
    id: "CUST-2026-104",
    name: "Priya Soman",
    mobile: "+91 98952 44332",
    whatsapp: "+91 98952 44332",
    email: "priya.soman@gmail.com",
    address: "Soman Arcade, Round South",
    pin: "680001",
    location: "Round South, Thrissur",
    locationCoordinates: { latitude: 10.5276, longitude: 76.2144 },
    previousServices: ["❄ AC Service", "🧹 AC Cleaning"],
    acType: "Cassette AC",
    numberOfUnits: 2,
    amcStatus: "Active",
    amcPlan: "Comprehensive Care (2 Units)",
    totalSpend: 1798,
    lastBookingDate: "2026-10-25T08:00:00.000Z",
    bookingHistory: [
      {
        bookingId: "EGS-2026-1091",
        serviceCategory: "ac-service",
        serviceName: "❄ AC Service",
        subService: "Deep Jet Power Cleaning (Indoor + Outdoor)",
        date: "Today (Express 90-Min Slot)",
        slot: "Afternoon (12:00 PM - 3:00 PM)",
        amount: 1798,
        status: "TECHNICIAN ON THE WAY",
        technicianName: "Sujith Nair",
      },
    ],
  },
  {
    id: "CUST-2026-105",
    name: "Biju Thomas",
    mobile: "+91 94470 66554",
    whatsapp: "+91 94470 66554",
    email: "bijuthomas.kollam@gmail.com",
    address: "House 55, Beach Road, Chinnakkada",
    pin: "691001",
    location: "Chinnakkada, Kollam",
    locationCoordinates: { latitude: 8.8879, longitude: 76.5956 },
    previousServices: ["🔧 AC Repair"],
    acType: "Split AC",
    numberOfUnits: 1,
    amcStatus: "None",
    totalSpend: 799,
    lastBookingDate: "2026-10-25T07:30:00.000Z",
    bookingHistory: [
      {
        bookingId: "EGS-2026-1090",
        serviceCategory: "ac-repair",
        serviceName: "🔧 AC Repair",
        subService: "PCB Board Repair & Power Trip",
        date: "Today (Express 90-Min Slot)",
        slot: "Morning (9:00 AM - 12:00 PM)",
        amount: 799,
        status: "SERVICE STARTED",
        technicianName: "Arun Kumar",
      },
    ],
  },
  {
    id: "CUST-2026-106",
    name: "Dr. Thomas Mathew",
    mobile: "+91 94471 22334",
    whatsapp: "+91 94471 22334",
    email: "drthomasmathew@yahoo.com",
    address: "Grace Villa, Kadappakada",
    pin: "691008",
    location: "Kadappakada, Kollam",
    locationCoordinates: { latitude: 8.8942, longitude: 76.6025 },
    previousServices: ["❄ AC Service", "📋 AMC", "🧹 AC Cleaning"],
    acType: "Split AC",
    numberOfUnits: 3,
    amcStatus: "Active",
    amcPlan: "Comprehensive Care (3 Units)",
    totalSpend: 6498,
    lastBookingDate: "2026-10-25T06:00:00.000Z",
    bookingHistory: [
      {
        bookingId: "EGS-2026-1089b",
        serviceCategory: "ac-service",
        serviceName: "❄ AC Service",
        subService: "Foam Wash & Jet Spray Sanitization",
        date: "Today",
        slot: "Morning (9:00 AM - 12:00 PM)",
        amount: 499,
        status: "COMPLETED",
        technicianName: "Vipin Das",
      },
      {
        bookingId: "EGS-2026-0115",
        serviceCategory: "ac-amc",
        serviceName: "📋 AMC",
        subService: "Comprehensive AMC Package 3 Units",
        date: "15 Jan 2026",
        slot: "Full Day Setup",
        amount: 5999,
        status: "COMPLETED",
        technicianName: "Arun Kumar",
      },
    ],
  },
  {
    id: "CUST-2026-107",
    name: "Harish Kumar",
    mobile: "+91 98460 77881",
    whatsapp: "+91 98460 77881",
    email: "harish.kumar77@gmail.com",
    address: "House 12, Lake View, Thevara",
    pin: "682013",
    location: "Thevara, Ernakulam / Cochin",
    locationCoordinates: { latitude: 9.9328, longitude: 76.2991 },
    previousServices: ["💨 Gas Charging", "🔧 AC Repair"],
    acType: "Split AC",
    numberOfUnits: 1,
    amcStatus: "None",
    totalSpend: 1499,
    lastBookingDate: "2026-10-24T18:00:00.000Z",
    bookingHistory: [
      {
        bookingId: "EGS-2026-1088b",
        serviceCategory: "gas-charging",
        serviceName: "💨 Gas Charging",
        subService: "Nitrogen Pressure Leak Detection & R410A Refill",
        date: "Today (Express 90-Min Slot)",
        slot: "Morning (9:00 AM - 12:00 PM)",
        amount: 1499,
        status: "PAYMENT RECEIVED",
        technicianName: "Muhammed Shafi",
      },
    ],
  },
  {
    id: "CUST-2026-108",
    name: "Rajesh Kannan",
    mobile: "+91 98401 22334",
    whatsapp: "+91 98401 22334",
    email: "rajesh.kannan@chennaihvac.com",
    address: "Flat 8A, Prime Heights, Anna Nagar",
    pin: "600040",
    location: "Anna Nagar, Chennai",
    locationCoordinates: { latitude: 13.0850, longitude: 80.2101 },
    previousServices: ["🛒 Buy new ac", "⚙ AC Installation"],
    acType: "Split AC",
    numberOfUnits: 2,
    amcStatus: "None",
    totalSpend: 76000,
    lastBookingDate: "2026-10-24T12:00:00.000Z",
    bookingHistory: [
      {
        bookingId: "EGS-2026-1085",
        serviceCategory: "buy-new-ac",
        serviceName: "🛒 Buy new ac",
        subService: "Daikin 1.5 Ton 5-Star Inverter AC Purchase (x2)",
        date: "Tomorrow",
        slot: "Afternoon (12:00 PM - 3:00 PM)",
        amount: 76000,
        status: "NEW",
      },
    ],
  },
];

export function getCustomers(): Customer[] {
  let baseCustomers = SEED_CUSTOMERS;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (raw) {
        baseCustomers = JSON.parse(raw);
      } else {
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(SEED_CUSTOMERS));
      }
    } catch {
      baseCustomers = SEED_CUSTOMERS;
    }
  }

  // Dynamically enrich or merge with all bookings in localStorage:
  const bookings = getBookings();
  const amcContracts = getAMCContracts();

  const customerMap = new Map<string, Customer>();
  baseCustomers.forEach((c) => {
    const cleanPhone = c.mobile.replace(/\D/g, "");
    customerMap.set(cleanPhone, { ...c, bookingHistory: [...c.bookingHistory], previousServices: [...c.previousServices] });
  });

  bookings.forEach((b) => {
    const cleanPhone = b.phone.replace(/\D/g, "");
    if (!cleanPhone) return;

    const existing = customerMap.get(cleanPhone);
    const historyItem: CustomerBookingHistory = {
      bookingId: b.id,
      serviceCategory: b.serviceCategory,
      serviceName: b.serviceName,
      subService: b.subService,
      date: b.preferredDate || new Date(b.createdAt).toLocaleDateString("en-IN"),
      slot: b.preferredSlot,
      amount: b.estimatedAmount,
      status: b.status,
      technicianName: b.assignedTechnicianName,
    };

    if (existing) {
      const histIndex = existing.bookingHistory.findIndex((h) => h.bookingId === b.id);
      if (histIndex === -1) {
        existing.bookingHistory.unshift(historyItem);
        existing.totalSpend += b.estimatedAmount;
        if (!existing.previousServices.includes(b.serviceName)) {
          existing.previousServices.push(b.serviceName);
        }
      } else {
        existing.bookingHistory[histIndex] = {
          ...existing.bookingHistory[histIndex],
          status: b.status,
          technicianName: b.assignedTechnicianName,
          amount: b.estimatedAmount,
        };
      }
    } else {
      const amcMatch = amcContracts.find(
        (a) => a.phone.replace(/\D/g, "") === cleanPhone
      );
      const newCust: Customer = {
        id: `CUST-2026-${100 + customerMap.size + 1}`,
        name: b.customerName,
        mobile: b.phone,
        whatsapp: b.whatsappNumber || b.phone,
        email: b.email || `${b.customerName.toLowerCase().replace(/[^a-z0-9]/g, "")}@gmail.com`,
        address: b.address,
        pin: b.pincode,
        location: b.area ? `${b.area}, ${b.city}` : b.city,
        locationCoordinates: b.locationCoordinates,
        previousServices: [b.serviceName],
        acType: b.acType,
        numberOfUnits: b.unitCount,
        amcStatus: amcMatch
          ? amcMatch.status === "active"
            ? "Active"
            : amcMatch.status === "expiring_soon"
            ? "Expiring Soon"
            : "Expired"
          : "None",
        amcPlan: amcMatch ? `${amcMatch.planName} (${amcMatch.unitsCovered} Units)` : undefined,
        bookingHistory: [historyItem],
        totalSpend: b.estimatedAmount,
        lastBookingDate: b.createdAt,
      };
      customerMap.set(cleanPhone, newCust);
    }
  });

  return Array.from(customerMap.values());
}

export function getCustomerById(id: string): Customer | undefined {
  const all = getCustomers();
  return all.find((c) => c.id === id || c.mobile.replace(/\D/g, "") === id.replace(/\D/g, ""));
}

export function saveCustomer(updatedCustomer: Customer): void {
  const all = getCustomers();
  const index = all.findIndex(
    (c) => c.id === updatedCustomer.id || c.mobile.replace(/\D/g, "") === updatedCustomer.mobile.replace(/\D/g, "")
  );
  let newList: Customer[];
  if (index >= 0) {
    newList = all.map((c, i) => (i === index ? updatedCustomer : c));
  } else {
    newList = [updatedCustomer, ...all];
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(newList));
    window.dispatchEvent(new Event("egs_customers_updated"));
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
*Service:* ${booking.serviceName}
*AC Type:* ${booking.acType}
*No. of ACs:* ${booking.unitCount}
*Customer Name:* ${booking.customerName}
*Contact:* ${booking.phone}
*WhatsApp:* ${booking.whatsappNumber || booking.phone}
*Location Details:*
${booking.houseBuilding ? `• House/Building: ${booking.houseBuilding}\n` : ""}• Area: ${booking.area || booking.address}
• City: ${booking.city}
• PIN Code: ${booking.pincode}
${booking.landmark ? `• Landmark: ${booking.landmark}\n` : ""}${booking.locationCoordinates ? `• GPS Map: https://maps.google.com/?q=${booking.locationCoordinates.latitude},${booking.locationCoordinates.longitude}\n` : ""}${booking.issueDescription ? `*Note:* ${booking.issueDescription}\n` : ""}*Est. Amount:* ₹${booking.estimatedAmount}
━━━━━━━━━━━━━━━━━━
Please confirm my booking and dispatch technician. Thank you!`;

  return `https://wa.me/${EGS_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function generateAdminToCustomerWhatsAppURL(
  booking: Booking,
  templateType: BookingStatus | "confirm" | "tech_dispatched" | "completed"
): string {
  const cleanPhone = booking.phone.replace(/[^0-9]/g, "");
  const targetPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;

  let text = "";
  switch (templateType) {
    case "CONTACTED":
      text = `Hello ${booking.customerName}! 👋
This is *Expert Goods & Services (EGS INDIA)*.
We have received your service request *${booking.id}* for *${booking.serviceName}*.

Our service manager is checking technician availability in ${booking.city}. We will confirm your exact slot shortly.
Questions? Call us at +91 98956 88833.`;
      break;

    case "CONFIRMED":
    case "confirm":
      text = `Hello ${booking.customerName}! 👋
Your HVAC service booking *${booking.id}* has been confirmed by *Expert Goods & Services (EGS INDIA)*.

📋 *Booking Details:*
• Service: ${booking.serviceName}
• Slot: ${booking.preferredDate} (${booking.preferredSlot})
• Address: ${booking.address}, ${booking.city}

Our certified technician will arrive on time. For emergency assistance call +91 98956 88833.`;
      break;

    case "ASSIGNED":
      text = `Hello ${booking.customerName}! 🔧
Certified HVAC technician *${booking.assignedTechnicianName || "Arun Kumar"}* has been assigned to your booking *${booking.id}* (${booking.serviceName}).
The technician will call you shortly prior to dispatch.`;
      break;

    case "TECHNICIAN ON THE WAY":
    case "tech_dispatched":
      text = `Hello ${booking.customerName}! 🚀
Our certified HVAC technician *${booking.assignedTechnicianName || "Arun Kumar"}* is *ON THE WAY* to your location for booking *${booking.id}*.

• Service: ${booking.serviceName}
• Estimated Arrival: within 30-45 mins
• Support Helpline: +91 98956 88833`;
      break;

    case "SERVICE STARTED":
      text = `Hello ${booking.customerName}! ⚙️
Technician *${booking.assignedTechnicianName || "Arun Kumar"}* has arrived and started the service on your ${booking.acType} unit for booking *${booking.id}*.
We perform complete safety & diagnostic checks before and after service.`;
      break;

    case "COMPLETED":
    case "completed":
      text = `Thank you for choosing *EGS INDIA*! ⭐
Your service *${booking.id}* (${booking.serviceName}) has been marked *COMPLETED*.

🛡️ *30-Day Post-Service Guarantee:* Free re-visit warranty covers your serviced unit.
Est. Amount: ₹${booking.estimatedAmount}. Please verify performance with the technician.`;
      break;

    case "PAYMENT RECEIVED":
      text = `Payment Confirmation - *EGS INDIA* ✅
Thank you ${booking.customerName}! We have received payment of *₹${booking.estimatedAmount}* for booking *${booking.id}*.

Your digital invoice & 30-day warranty card have been generated. Thank you for choosing EGS INDIA!`;
      break;

    case "CANCELLED":
      text = `Booking Update - *EGS INDIA*
Your booking *${booking.id}* has been marked CANCELLED as requested.
If you need to reschedule in the future, please call us at +91 98956 88833 or visit https://egsindia.com.`;
      break;

    default:
      text = `Hello ${booking.customerName}! Status update for your EGS INDIA booking *${booking.id}*: Current Status: *${booking.status}*. Helpline: +91 98956 88833.`;
  }

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

export function generateTechnicianEtaWhatsAppURL(
  booking: Booking,
  technicianName: string,
  etaMinutes = 25
): string {
  const cleanPhone = (booking.whatsappNumber || booking.phone).replace(/[^0-9]/g, "");
  const targetPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
  const text = `Hello ${booking.customerName}! 👋
This is *${technicianName}*, your certified HVAC technician from *Expert Goods & Services (EGS INDIA)*.
I am on the way to your location for booking *${booking.id}* (*${booking.serviceName}*).

📍 *Destination:* ${booking.address}, ${booking.city}
⏱️ *ETA:* Approximately ${etaMinutes} minutes.

Please let me know if you need any directions or special instructions. See you shortly!`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

export function generateTechnicianCompletedWhatsAppURL(
  booking: Booking,
  technicianName: string
): string {
  const cleanPhone = (booking.whatsappNumber || booking.phone).replace(/[^0-9]/g, "");
  const targetPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
  const text = `Hello ${booking.customerName}! ⭐
Your AC service for booking *${booking.id}* (*${booking.serviceName}*) has been completed by technician *${technicianName}* - *EGS INDIA*.

✅ Cooling diagnostic and performance test passed.
🛡️ 30-Day Post-Service Warranty active.
Total Amount: ₹${booking.estimatedAmount}.

Thank you for choosing EGS INDIA!`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

