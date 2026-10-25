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

export type AMCServiceFrequency =
  | "Quarterly (4 Services/Year)"
  | "Bi-Monthly (6 Services/Year)"
  | "Half-Yearly (2 Services/Year)"
  | "Monthly (12 Services/Year)";

export type AMCStatus = "active" | "expiring_soon" | "expired" | "renewed";

export interface AMCContract {
  id: string; // e.g. "amc-1"
  contractNo: string; // e.g. "AMC-2026-081"

  // 1. AMC Start Date
  amcStartDate: string; // e.g. "2026-01-15"
  startDate?: string; // backwards compatibility

  // 2. AMC End Date
  amcEndDate: string; // e.g. "2027-01-14"
  expiryDate?: string; // backwards compatibility

  // 3. Customer
  customerId?: string; // e.g. "CUST-2026-106"
  customerName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  city: string;
  address?: string;

  // 4. Number of Units
  numberOfUnits: number; // e.g. 3, 12, 2
  unitsCovered?: number; // backwards compatibility

  // 5. Service Frequency
  serviceFrequency: AMCServiceFrequency;

  // 6. Last Service
  lastServiceDate: string; // e.g. "2026-07-20"
  lastServiceDetails?: string; // e.g. "Deep Hydro Jet Clean & Gas Diagnostic"
  lastServiceTechnician?: string; // e.g. "Arun Kumar"

  // 7. Next Service
  nextServiceDate: string; // e.g. "2026-10-28"
  nextServiceSlot?: string; // e.g. "Morning Slot (9:00 AM - 12:00 PM)"
  nextServiceStatus?: "scheduled" | "technician_dispatched" | "completed";

  // Plan & Renewal Metadata
  planName: "Residential Saver" | "Comprehensive Care" | "Commercial Pro" | string;
  servicesIncluded: number;
  servicesCompleted: number;
  status: AMCStatus;
  amount: number;
  renewalDiscountPercent?: number;
  lastRenewedDate?: string;
  renewalHistory?: Array<{
    renewedOn: string;
    previousEndDate: string;
    newEndDate: string;
    amountPaid: number;
    paymentMode: string;
    notes?: string;
  }>;
}

export type PaymentMethod =
  | "UPI / QR Code"
  | "Cash on Delivery"
  | "Credit / Debit Card"
  | "Net Banking"
  | "Bank NEFT / RTGS";

export type PaymentStatus = "PAID" | "PENDING" | "REFUNDED";

export interface PaymentTransaction {
  id: string; // e.g. "TXN-2026-8801"
  invoiceNo: string; // e.g. "INV-2026-1088"
  bookingId?: string; // e.g. "EGS-2026-1088b"
  amcContractNo?: string; // e.g. "AMC-2026-104"
  customerName: string;
  phone: string;
  whatsapp?: string;
  amount: number;
  subtotal: number;
  taxAmount: number; // 18% GST (CGST 9% + SGST 9%)
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionRef?: string; // e.g. UPI UTR number or cash slip
  technicianId?: string;
  technicianName?: string;
  serviceName: string;
  createdAt: string;
  paidAt?: string;
  notes?: string;
}

export interface EGSInvoiceItem {
  description: string;
  hsnCode?: string; // e.g. "998719"
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface EGSInvoice {
  invoiceNo: string;
  date: string;
  dueDate?: string;
  bookingId?: string;
  amcContractNo?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  customerCity: string;
  customerGstin?: string;
  acType?: ACType | string;
  technicianName?: string;
  items: EGSInvoiceItem[];
  subtotal: number;
  cgst: number; // 9%
  sgst: number; // 9%
  taxAmount: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionRef?: string;
  warrantyPeriodDays: number;
  warrantyValidUntil: string;
  notes?: string;
}

export const EGS_COMPANY_DETAILS = {
  name: "Expert Goods & Services India (EGS INDIA)",
  legalName: "Expert Goods and Services India Pvt Ltd",
  tagline: "Expert Air Conditioner Service & HVAC Solutions",
  gstin: "32AAECE8921M1ZX",
  pan: "AAECE8921M",
  cin: "U29190KL2021PTC068192",
  sacCode: "998719", // Maintenance, repair and cleaning of HVAC & machinery
  phone: "+91 98956 88833",
  whatsapp: "919895688833",
  email: "service@egsindia.com",
  website: "https://egsindia.com",
  registeredOffice: "EGS Towers, Near Collectorate, Kollam - 691001, Kerala",
  cochinOffice: "Infopark Phase 1, Kakkanad, Ernakulam - 682030",
  trivandrumOffice: "Golf Links Road, Kowdiar, Thiruvananthapuram - 695003",
  bankDetails: {
    bankName: "ICICI Bank Ltd",
    accountName: "Expert Goods and Services India Pvt Ltd",
    accountNumber: "004205018899",
    accountType: "Current Account",
    ifscCode: "ICIC0000042",
    branch: "Kochi MG Road Branch",
    upiId: "egsindia@icici",
  },
};

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

// Initial AMC Contracts with Complete Renewal Lifecycle
const SEED_AMC: AMCContract[] = [
  {
    id: "amc-1",
    contractNo: "AMC-2026-104",
    customerId: "CUST-2026-103",
    customerName: "Apex Software Solutions",
    phone: "+91 98956 77889",
    whatsapp: "+91 98956 77889",
    email: "facilities@apexsoftware.in",
    city: "Ernakulam",
    address: "Level 4, IT Tower 2, Infopark Phase 1, Kakkanad",
    planName: "Commercial Pro",
    numberOfUnits: 12,
    unitsCovered: 12,
    amcStartDate: "2025-11-01",
    startDate: "2025-11-01",
    amcEndDate: "2026-10-31",
    expiryDate: "2026-10-31",
    serviceFrequency: "Bi-Monthly (6 Services/Year)",
    lastServiceDate: "2026-08-25",
    lastServiceDetails: "VRV Compressor Diagnostic & Filter Deep Wash",
    lastServiceTechnician: "Muhammed Shafi",
    nextServiceDate: "2026-10-28",
    nextServiceSlot: "Morning Slot (9:00 AM - 12:00 PM)",
    nextServiceStatus: "scheduled",
    servicesIncluded: 6,
    servicesCompleted: 5,
    status: "expiring_soon", // Expiring in 6 days! Needs renewal alert
    amount: 34999,
  },
  {
    id: "amc-2",
    contractNo: "AMC-2026-081",
    customerId: "CUST-2026-106",
    customerName: "Dr. Thomas Mathew",
    phone: "+91 94471 22334",
    whatsapp: "+91 94471 22334",
    email: "drthomasmathew@yahoo.com",
    city: "Kollam",
    address: "Grace Villa, Kadappakada",
    planName: "Comprehensive Care",
    numberOfUnits: 3,
    unitsCovered: 3,
    amcStartDate: "2026-01-15",
    startDate: "2026-01-15",
    amcEndDate: "2027-01-14",
    expiryDate: "2027-01-14",
    serviceFrequency: "Quarterly (4 Services/Year)",
    lastServiceDate: "2026-07-20",
    lastServiceDetails: "Deep Hydro Jet Clean & Gas Pressure Diagnostic",
    lastServiceTechnician: "Arun Kumar",
    nextServiceDate: "2026-10-27",
    nextServiceSlot: "Morning Slot (9:00 AM - 12:00 PM)",
    nextServiceStatus: "scheduled",
    servicesIncluded: 4,
    servicesCompleted: 2,
    status: "active",
    amount: 5999,
  },
  {
    id: "amc-3",
    contractNo: "AMC-2026-118",
    customerId: "CUST-2026-109",
    customerName: "Reshmi Rajeev",
    phone: "+91 97450 66778",
    whatsapp: "+91 97450 66778",
    email: "reshmi.rajeev@gmail.com",
    city: "Thiruvananthapuram",
    address: "House 24, Kowdiar Gardens",
    planName: "Residential Saver",
    numberOfUnits: 2,
    unitsCovered: 2,
    amcStartDate: "2026-03-10",
    startDate: "2026-03-10",
    amcEndDate: "2027-03-09",
    expiryDate: "2027-03-09",
    serviceFrequency: "Quarterly (4 Services/Year)",
    lastServiceDate: "2026-09-12",
    lastServiceDetails: "Monsoon Drain Line Clean & Anti-bacterial Spray",
    lastServiceTechnician: "Vipin Das",
    nextServiceDate: "2026-12-10",
    nextServiceSlot: "Afternoon Slot (12:00 PM - 3:00 PM)",
    nextServiceStatus: "scheduled",
    servicesIncluded: 3,
    servicesCompleted: 1,
    status: "active",
    amount: 3499,
  },
  {
    id: "amc-4",
    contractNo: "AMC-2025-062",
    customerId: "CUST-2026-110",
    customerName: "Hotel Malabar Residency",
    phone: "+91 98470 33221",
    whatsapp: "+91 98470 33221",
    email: "manager@malabarresidency.com",
    city: "Thrissur",
    address: "Malabar Complex, Round South",
    planName: "Commercial Pro",
    numberOfUnits: 8,
    unitsCovered: 8,
    amcStartDate: "2025-09-15",
    startDate: "2025-09-15",
    amcEndDate: "2026-09-14",
    expiryDate: "2026-09-14",
    serviceFrequency: "Bi-Monthly (6 Services/Year)",
    lastServiceDate: "2026-08-10",
    lastServiceDetails: "Restaurant Ceiling Cassette Jet Power Flush",
    lastServiceTechnician: "Sujith Nair",
    nextServiceDate: "Pending AMC Renewal",
    nextServiceSlot: "Immediate on Renewal",
    nextServiceStatus: "scheduled",
    servicesIncluded: 6,
    servicesCompleted: 6,
    status: "expired", // Expired! Needs urgent renewal follow-up
    amount: 24999,
  },
  {
    id: "amc-5",
    contractNo: "AMC-2026-015",
    customerId: "CUST-2026-104",
    customerName: "Priya Soman",
    phone: "+91 98952 44332",
    whatsapp: "+91 98952 44332",
    email: "priya.soman@gmail.com",
    city: "Thrissur",
    address: "Soman Arcade, Round South",
    planName: "Comprehensive Care",
    numberOfUnits: 2,
    unitsCovered: 2,
    amcStartDate: "2026-02-01",
    startDate: "2026-02-01",
    amcEndDate: "2027-01-31",
    expiryDate: "2027-01-31",
    serviceFrequency: "Quarterly (4 Services/Year)",
    lastServiceDate: "2026-08-04",
    lastServiceDetails: "Cassette Jet Clean & Air Filter Replacement",
    lastServiceTechnician: "Sujith Nair",
    nextServiceDate: "2026-11-05",
    nextServiceSlot: "Afternoon Slot (12:00 PM - 3:00 PM)",
    nextServiceStatus: "scheduled",
    servicesIncluded: 4,
    servicesCompleted: 2,
    status: "active",
    amount: 3999,
  },
  {
    id: "amc-6",
    contractNo: "AMC-2025-044",
    customerId: "CUST-2026-111",
    customerName: "Kovalam Grand Beach Resort",
    phone: "+91 94470 88112",
    whatsapp: "+91 94470 88112",
    email: "engineering@kovalambeachresort.com",
    city: "Thiruvananthapuram",
    address: "Lighthouse Beach Road, Kovalam",
    planName: "Commercial Pro",
    numberOfUnits: 16,
    unitsCovered: 16,
    amcStartDate: "2025-10-20",
    startDate: "2025-10-20",
    amcEndDate: "2026-10-19",
    expiryDate: "2026-10-19",
    serviceFrequency: "Monthly (12 Services/Year)",
    lastServiceDate: "2026-10-02",
    lastServiceDetails: "Coastal Salt Anti-Corrosion Treatment & Chemical Wash",
    lastServiceTechnician: "Vipin Das",
    nextServiceDate: "Pending Renewal Confirmation",
    nextServiceSlot: "Express Scheduled",
    nextServiceStatus: "scheduled",
    servicesIncluded: 12,
    servicesCompleted: 12,
    status: "expired",
    amount: 48000,
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

// Seed Payment Transactions
const SEED_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: "TXN-2026-8801",
    invoiceNo: "INV-2026-1088",
    bookingId: "EGS-2026-1088b",
    customerName: "Harish Kumar",
    phone: "+91 98460 77881",
    whatsapp: "+91 98460 77881",
    amount: 1499,
    subtotal: 1270.34,
    taxAmount: 228.66,
    paymentMethod: "UPI / QR Code",
    status: "PAID",
    transactionRef: "UPI/429188491023",
    technicianId: "tech-3",
    technicianName: "Muhammed Shafi",
    serviceName: "💨 Gas Charging (Daikin Split AC)",
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    paidAt: new Date(Date.now() - 3.8 * 3600 * 1000).toISOString(),
    notes: "R410A refrigerant charge + flare nut brazed. Scanned dynamic GPay QR code.",
  },
  {
    id: "TXN-2026-8802",
    invoiceNo: "INV-2026-1089",
    bookingId: "EGS-2026-1089b",
    customerName: "Dr. Thomas Mathew",
    phone: "+91 94471 22334",
    whatsapp: "+91 94471 22334",
    amount: 499,
    subtotal: 422.88,
    taxAmount: 76.12,
    paymentMethod: "Cash on Delivery",
    status: "PAID",
    transactionRef: "CASH-REC-1089",
    technicianId: "tech-2",
    technicianName: "Vipin Das",
    serviceName: "❄ AC Service (Foam Wash)",
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    paidAt: new Date(Date.now() - 7.5 * 3600 * 1000).toISOString(),
    notes: "Collected ₹500 cash in field, digital receipt dispatched via WhatsApp.",
  },
  {
    id: "TXN-2026-8803",
    invoiceNo: "INV-2026-0104",
    amcContractNo: "AMC-2026-104",
    customerName: "Apex Software Solutions",
    phone: "+91 98956 77889",
    whatsapp: "+91 98956 77889",
    amount: 34999,
    subtotal: 29660.17,
    taxAmount: 5338.83,
    paymentMethod: "Bank NEFT / RTGS",
    status: "PAID",
    transactionRef: "NEFT-ICICI-88294101",
    technicianId: "tech-3",
    technicianName: "Muhammed Shafi",
    serviceName: "📋 AMC - Commercial Pro (12 Units)",
    createdAt: "2025-11-01T10:00:00.000Z",
    paidAt: "2025-11-01T14:30:00.000Z",
    notes: "Corporate NEFT transfer to ICICI Current Account. GSTIN: 32AAACA1234D1Z8.",
  },
  {
    id: "TXN-2026-8804",
    invoiceNo: "INV-2026-0081",
    amcContractNo: "AMC-2026-081",
    customerName: "Dr. Thomas Mathew",
    phone: "+91 94471 22334",
    whatsapp: "+91 94471 22334",
    amount: 5999,
    subtotal: 5083.9,
    taxAmount: 915.1,
    paymentMethod: "UPI / QR Code",
    status: "PAID",
    transactionRef: "UPI/PhonePe-410294819012",
    technicianId: "tech-1",
    technicianName: "Arun Kumar",
    serviceName: "📋 AMC - Comprehensive Care (3 Units)",
    createdAt: "2026-01-15T11:20:00.000Z",
    paidAt: "2026-01-15T11:25:00.000Z",
    notes: "Annual maintenance contract covering 3 bedroom split units.",
  },
  {
    id: "TXN-2026-8805",
    invoiceNo: "INV-2026-1090",
    bookingId: "EGS-2026-1090",
    customerName: "Biju Thomas",
    phone: "+91 94470 66554",
    whatsapp: "+91 94470 66554",
    amount: 799,
    subtotal: 677.12,
    taxAmount: 121.88,
    paymentMethod: "Cash on Delivery",
    status: "PENDING",
    technicianId: "tech-1",
    technicianName: "Arun Kumar",
    serviceName: "🔧 AC Repair (PCB Board Repair)",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    notes: "Service started on-site. Payment to be collected upon completion.",
  },
  {
    id: "TXN-2026-8806",
    invoiceNo: "INV-2026-1091",
    bookingId: "EGS-2026-1091",
    customerName: "Priya Soman",
    phone: "+91 98952 44332",
    whatsapp: "+91 98952 44332",
    amount: 1798,
    subtotal: 1523.73,
    taxAmount: 274.27,
    paymentMethod: "UPI / QR Code",
    status: "PENDING",
    technicianId: "tech-4",
    technicianName: "Sujith Nair",
    serviceName: "❄ AC Service (2 Cassette Units)",
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    notes: "Technician en route. Customer requested UPI QR code payment upon finish.",
  },
];

const STORAGE_KEYS = {
  BOOKINGS: "egs_crm_bookings_v2",
  TECHNICIANS: "egs_crm_technicians_v2",
  AMC: "egs_crm_amc_v2",
  CUSTOMERS: "egs_crm_customers_v3",
  TRANSACTIONS: "egs_crm_transactions_v2",
  INVOICES: "egs_crm_invoices_v2",
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

export function normalizeAMCContract(c: AMCContract): AMCContract {
  const amcStartDate = c.amcStartDate || c.startDate || "2026-01-15";
  const amcEndDate = c.amcEndDate || c.expiryDate || "2027-01-14";
  const numberOfUnits = c.numberOfUnits || c.unitsCovered || 1;
  const serviceFrequency = c.serviceFrequency || "Quarterly (4 Services/Year)";
  const lastServiceDate = c.lastServiceDate || "2026-08-01";
  const nextServiceDate = c.nextServiceDate || "2026-11-01";

  // Real-time expiry calculation
  let status: AMCStatus = c.status || "active";
  if (status !== "renewed") {
    const now = new Date();
    const end = new Date(amcEndDate);
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 3600 * 24));
    if (diffDays < 0) {
      status = "expired";
    } else if (diffDays <= 30) {
      status = "expiring_soon";
    } else {
      status = "active";
    }
  }

  return {
    ...c,
    amcStartDate,
    startDate: amcStartDate,
    amcEndDate,
    expiryDate: amcEndDate,
    numberOfUnits,
    unitsCovered: numberOfUnits,
    serviceFrequency,
    lastServiceDate,
    nextServiceDate,
    status,
  };
}

export function getAMCContracts(): AMCContract[] {
  let list: AMCContract[] = SEED_AMC;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AMC);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.AMC, JSON.stringify(SEED_AMC));
        list = SEED_AMC;
      } else {
        list = JSON.parse(raw);
      }
    } catch {
      list = SEED_AMC;
    }
  }
  return list.map(normalizeAMCContract);
}

export function saveAMCContract(contract: AMCContract): AMCContract {
  const all = getAMCContracts();
  const index = all.findIndex((c) => c.id === contract.id || c.contractNo === contract.contractNo);
  const normalized = normalizeAMCContract(contract);
  let updatedList: AMCContract[];
  if (index >= 0) {
    updatedList = all.map((c, i) => (i === index ? normalized : c));
  } else {
    updatedList = [normalized, ...all];
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.AMC, JSON.stringify(updatedList));
    window.dispatchEvent(new Event("egs_amc_updated"));
  }
  return normalized;
}

export function renewAMCContract(
  contractId: string,
  options: {
    durationMonths?: number;
    amountPaid?: number;
    paymentMode?: string;
    newPlanName?: string;
    notes?: string;
  } = {}
): AMCContract | undefined {
  const all = getAMCContracts();
  const target = all.find((c) => c.id === contractId || c.contractNo === contractId);
  if (!target) return undefined;

  const durationMonths = options.durationMonths || 12;
  const oldEndDate = new Date(target.amcEndDate || target.expiryDate || new Date());
  const now = new Date();
  
  // If already expired, start renewal from today; if still active, extend from current end date
  const newStartDate = oldEndDate < now ? now : oldEndDate;
  const newEndDate = new Date(newStartDate);
  newEndDate.setMonth(newEndDate.getMonth() + durationMonths);

  const renewalEntry = {
    renewedOn: new Date().toISOString(),
    previousEndDate: target.amcEndDate || target.expiryDate || "",
    newEndDate: newEndDate.toISOString().split("T")[0],
    amountPaid: options.amountPaid || target.amount,
    paymentMode: options.paymentMode || "UPI / GPay",
    notes: options.notes || `Renewed for ${durationMonths} months.`,
  };

  const updated: AMCContract = {
    ...target,
    amcStartDate: newStartDate.toISOString().split("T")[0],
    startDate: newStartDate.toISOString().split("T")[0],
    amcEndDate: newEndDate.toISOString().split("T")[0],
    expiryDate: newEndDate.toISOString().split("T")[0],
    status: "active",
    amount: options.amountPaid || target.amount,
    planName: options.newPlanName || target.planName,
    servicesCompleted: 0,
    servicesIncluded: target.servicesIncluded || (target.serviceFrequency.includes("Bi-Monthly") ? 6 : target.serviceFrequency.includes("Monthly") ? 12 : 4),
    lastRenewedDate: new Date().toISOString(),
    nextServiceDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split("T")[0],
    nextServiceSlot: "Morning Slot (9:00 AM - 12:00 PM)",
    nextServiceStatus: "scheduled",
    renewalHistory: [...(target.renewalHistory || []), renewalEntry],
  };

  saveAMCContract(updated);
  return updated;
}

export function scheduleAMCNextService(
  contractId: string,
  options: {
    date: string;
    slot?: string;
    technicianId?: string;
    technicianName?: string;
    serviceNotes?: string;
  }
): { contract: AMCContract; booking: Booking } | undefined {
  const all = getAMCContracts();
  const target = all.find((c) => c.id === contractId || c.contractNo === contractId);
  if (!target) return undefined;

  // 1. Create a Booking in the system for this AMC visit (₹0 charged as it is included)
  const newBooking = saveBooking({
    serviceCategory: "ac-amc",
    serviceName: `📋 AMC Routine Service (${target.planName})`,
    subService: `Periodic Scheduled Maintenance - ${target.numberOfUnits} Unit(s)`,
    acType: "Split AC",
    unitCount: target.numberOfUnits,
    preferredDate: options.date,
    preferredSlot: options.slot || "Morning Slot (9:00 AM - 12:00 PM)",
    customerName: target.customerName,
    phone: target.phone,
    whatsappNumber: target.whatsapp || target.phone,
    email: target.email,
    city: target.city,
    address: target.address || target.city,
    pincode: "682020",
    estimatedAmount: 0, // AMC Covered
    assignedTechnicianId: options.technicianId || "tech-1",
    assignedTechnicianName: options.technicianName || "Arun Kumar",
    issueDescription: options.serviceNotes || `Periodic AMC Preventative Service visit under ${target.contractNo}.`,
  });

  // 2. Advance the Next Service date on the contract based on frequency
  let nextDateMonths = 3;
  if (target.serviceFrequency.includes("Bi-Monthly")) nextDateMonths = 2;
  else if (target.serviceFrequency.includes("Monthly")) nextDateMonths = 1;
  else if (target.serviceFrequency.includes("Half-Yearly")) nextDateMonths = 6;

  const nextDateObj = new Date(options.date);
  nextDateObj.setMonth(nextDateObj.getMonth() + nextDateMonths);

  const updatedContract: AMCContract = {
    ...target,
    lastServiceDate: options.date,
    lastServiceDetails: `AMC Maintenance Service - Routine Cleaning & Diagnostics`,
    lastServiceTechnician: options.technicianName || "Arun Kumar",
    nextServiceDate: nextDateObj.toISOString().split("T")[0],
    nextServiceSlot: options.slot || "Morning Slot (9:00 AM - 12:00 PM)",
    servicesCompleted: (target.servicesCompleted || 0) + 1,
    nextServiceStatus: "scheduled",
  };

  saveAMCContract(updatedContract);
  return { contract: updatedContract, booking: newBooking };
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

export function generateAMCRenewalWhatsAppURL(contract: AMCContract): string {
  const cleanPhone = (contract.whatsapp || contract.phone).replace(/[^0-9]/g, "");
  const targetPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
  const text = `*HVAC AMC Renewal Reminder - EGS INDIA* ❄️
━━━━━━━━━━━━━━━━━━
Dear *${contract.customerName}*,
Your Annual Maintenance Contract (*${contract.contractNo}*) for *${contract.numberOfUnits} AC Unit(s)* is due for renewal!

📋 *Contract Details:*
• Plan: ${contract.planName}
• Current Start Date: ${contract.amcStartDate}
• Expiry Date: ${contract.amcEndDate}
• Maintenance Frequency: ${contract.serviceFrequency}
• Renewal Fee: ₹${contract.amount.toLocaleString("en-IN")}/year

🛡️ *Continuous AMC Benefits:*
✅ 0 Breakdown Guarantee with Free Labor
✅ Free Spare Parts Coverage & Gas Top-ups
✅ 90-Min Priority Emergency Dispatch
✅ Pre-Scheduled Seasonal Deep Jet Power Cleanings

Please reply *RENEW* to confirm your continuous coverage or call us directly at +91 98956 88833. Thank you!`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

export function generateAMCRenewalConfirmationWhatsAppURL(contract: AMCContract): string {
  const cleanPhone = (contract.whatsapp || contract.phone).replace(/[^0-9]/g, "");
  const targetPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
  const text = `*AMC Renewal Confirmation - EGS INDIA* ✅
━━━━━━━━━━━━━━━━━━
Thank you *${contract.customerName}*!
Your HVAC AMC Contract (*${contract.contractNo}*) has been *RENEWED* successfully!

🎉 *New Extended Validity:*
• AMC Start Date: ${contract.amcStartDate}
• AMC End Date: ${contract.amcEndDate}
• Units Protected: ${contract.numberOfUnits} Unit(s)
• Next Scheduled Service: ${contract.nextServiceDate} (${contract.nextServiceSlot || "Morning Slot"})
• Amount Paid: ₹${contract.amount.toLocaleString("en-IN")}

Your digital AMC Warranty Certificate & Invoicing have been archived.
Support Helpline: +91 98956 88833.`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * ============================================================
 * PAYMENT & INVOICING HELPERS
 * ============================================================
 */

export function generateUPIPaymentUrl(
  amount: number,
  refId: string,
  note = "EGS HVAC Service"
): string {
  const upiId = EGS_COMPANY_DETAILS.bankDetails.upiId;
  const payeeName = "Expert Goods and Services";
  const formattedAmount = Number(amount || 0).toFixed(2);
  const cleanRef = (refId || `EGS-${Date.now()}`).replace(/[^a-zA-Z0-9-]/g, "");
  return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${formattedAmount}&cu=INR&tn=${encodeURIComponent(`${cleanRef} ${note}`)}&tr=${encodeURIComponent(cleanRef)}`;
}

export function getUPIQRCodeUrl(upiUrl: string, size = 260): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(upiUrl)}&margin=8`;
}

export function getTransactions(): PaymentTransaction[] {
  if (typeof window === "undefined") return SEED_TRANSACTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(SEED_TRANSACTIONS));
      return SEED_TRANSACTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_TRANSACTIONS;
  }
}

export function saveTransaction(txn: PaymentTransaction): void {
  const current = getTransactions();
  const existingIdx = current.findIndex((t) => t.id === txn.id);
  let updated: PaymentTransaction[];
  if (existingIdx >= 0) {
    updated = current.map((t, i) => (i === existingIdx ? txn : t));
  } else {
    updated = [txn, ...current];
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
    window.dispatchEvent(new Event("egs_transactions_updated"));
  }
}

export function getInvoices(): EGSInvoice[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveInvoice(inv: EGSInvoice): void {
  const current = getInvoices();
  const existingIdx = current.findIndex((i) => i.invoiceNo === inv.invoiceNo);
  let updated: EGSInvoice[];
  if (existingIdx >= 0) {
    updated = current.map((item, idx) => (idx === existingIdx ? inv : item));
  } else {
    updated = [inv, ...current];
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(updated));
    window.dispatchEvent(new Event("egs_invoices_updated"));
  }
}

export function getInvoiceByNumber(invoiceNo: string): EGSInvoice | undefined {
  const invoices = getInvoices();
  const found = invoices.find((inv) => inv.invoiceNo === invoiceNo);
  if (found) return found;

  // On-the-fly generation if matching a transaction or booking
  const txns = getTransactions();
  const txn = txns.find((t) => t.invoiceNo === invoiceNo);
  if (txn && txn.bookingId) {
    const booking = getBookings().find((b) => b.id === txn.bookingId);
    if (booking) {
      return generateInvoiceForBooking(booking, txn.paymentMethod, txn.transactionRef, txn.id);
    }
  }
  if (txn && txn.amcContractNo) {
    const contract = getAMCContracts().find((c) => c.contractNo === txn.amcContractNo);
    if (contract) {
      return generateInvoiceForAMC(contract, txn.paymentMethod, txn.transactionRef, txn.id);
    }
  }
  return undefined;
}

export function generateInvoiceForBooking(
  booking: Booking,
  paymentMethod: PaymentMethod = "UPI / QR Code",
  transactionRef?: string,
  transactionId?: string
): EGSInvoice {
  const grandTotal = booking.estimatedAmount || 499;
  const subtotal = Math.round((grandTotal / 1.18) * 100) / 100;
  const taxAmount = Math.round((grandTotal - subtotal) * 100) / 100;
  const halfTax = Math.round((taxAmount / 2) * 100) / 100;

  const validUntilDate = new Date();
  validUntilDate.setDate(validUntilDate.getDate() + 30); // 30-day warranty

  const invNum = `INV-2026-${booking.id.replace(/\D/g, "") || Date.now().toString().slice(-4)}`;

  const invoice: EGSInvoice = {
    invoiceNo: invNum,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
    bookingId: booking.id,
    customerName: booking.customerName,
    customerPhone: booking.phone,
    customerEmail: booking.email || `${booking.customerName.toLowerCase().replace(/[^a-z0-9]/g, "")}@gmail.com`,
    customerAddress: `${booking.houseBuilding ? `${booking.houseBuilding}, ` : ""}${booking.address}`,
    customerCity: booking.city,
    acType: booking.acType,
    technicianName: booking.assignedTechnicianName || "Arun Kumar (EGS Specialist)",
    items: [
      {
        description: `${booking.serviceName} - ${booking.subService || booking.acType} (${booking.unitCount} Unit${Number(booking.unitCount) === 1 ? "" : "s"})`,
        hsnCode: EGS_COMPANY_DETAILS.sacCode,
        quantity: typeof booking.unitCount === "number" ? booking.unitCount : 1,
        unitPrice: subtotal,
        amount: subtotal,
      },
    ],
    subtotal,
    cgst: halfTax,
    sgst: halfTax,
    taxAmount,
    grandTotal,
    paymentMethod,
    paymentStatus: "PAID",
    transactionRef: transactionRef || (transactionId ? `REF-${transactionId}` : `UPI-${Date.now().toString().slice(-6)}`),
    warrantyPeriodDays: 30,
    warrantyValidUntil: validUntilDate.toISOString().split("T")[0],
    notes: "Includes 30-Day Post-Service Guarantee covering cooling performance, gas pressure, and workmanship.",
  };

  saveInvoice(invoice);
  return invoice;
}

export function generateInvoiceForAMC(
  contract: AMCContract,
  paymentMethod: PaymentMethod = "Bank NEFT / RTGS",
  transactionRef?: string,
  transactionId?: string
): EGSInvoice {
  const grandTotal = contract.amount || 4999;
  const subtotal = Math.round((grandTotal / 1.18) * 100) / 100;
  const taxAmount = Math.round((grandTotal - subtotal) * 100) / 100;
  const halfTax = Math.round((taxAmount / 2) * 100) / 100;

  const invoice: EGSInvoice = {
    invoiceNo: `INV-2026-${contract.contractNo.replace(/\D/g, "")}`,
    date: contract.amcStartDate || new Date().toISOString().split("T")[0],
    dueDate: contract.amcStartDate || new Date().toISOString().split("T")[0],
    amcContractNo: contract.contractNo,
    customerName: contract.customerName,
    customerPhone: contract.phone,
    customerEmail: contract.email || "accounts@customer.com",
    customerAddress: contract.address || contract.city,
    customerCity: contract.city,
    technicianName: contract.lastServiceTechnician || "EGS HVAC Engineering Team",
    items: [
      {
        description: `HVAC Annual Maintenance Contract: ${contract.planName} (${contract.numberOfUnits} Units, ${contract.serviceFrequency})`,
        hsnCode: EGS_COMPANY_DETAILS.sacCode,
        quantity: contract.numberOfUnits,
        unitPrice: Math.round((subtotal / contract.numberOfUnits) * 100) / 100,
        amount: subtotal,
      },
    ],
    subtotal,
    cgst: halfTax,
    sgst: halfTax,
    taxAmount,
    grandTotal,
    paymentMethod,
    paymentStatus: "PAID",
    transactionRef: transactionRef || (transactionId ? `REF-${transactionId}` : `NEFT-${Date.now().toString().slice(-6)}`),
    warrantyPeriodDays: 365,
    warrantyValidUntil: contract.amcEndDate,
    notes: "Annual Maintenance Contract valid through contract term. 0 Breakdown guarantee with free labor.",
  };

  saveInvoice(invoice);
  return invoice;
}

export function recordBookingPayment(
  bookingId: string,
  paymentMethod: PaymentMethod,
  amount: number,
  transactionRef?: string,
  technicianId?: string,
  technicianName?: string,
  notes?: string
): { transaction: PaymentTransaction; invoice: EGSInvoice } {
  const currentBookings = getBookings();
  const booking = currentBookings.find((b) => b.id === bookingId);
  if (!booking) {
    throw new Error(`Booking ${bookingId} not found`);
  }

  // 1. Advance booking status to PAYMENT RECEIVED
  updateBookingStatus(bookingId, "PAYMENT RECEIVED", technicianId);

  // 2. Compute GST
  const finalAmount = amount > 0 ? amount : booking.estimatedAmount;
  const subtotal = Math.round((finalAmount / 1.18) * 100) / 100;
  const taxAmount = Math.round((finalAmount - subtotal) * 100) / 100;

  const txnId = `TXN-2026-${Math.floor(8810 + Math.random() * 900)}`;
  const invNo = `INV-2026-${booking.id.replace(/\D/g, "") || Date.now().toString().slice(-4)}`;

  const txn: PaymentTransaction = {
    id: txnId,
    invoiceNo: invNo,
    bookingId: booking.id,
    customerName: booking.customerName,
    phone: booking.phone,
    whatsapp: booking.whatsappNumber || booking.phone,
    amount: finalAmount,
    subtotal,
    taxAmount,
    paymentMethod,
    status: "PAID",
    transactionRef:
      transactionRef ||
      (paymentMethod === "Cash on Delivery"
        ? `CASH-${Date.now().toString().slice(-6)}`
        : `UPI/${Date.now().toString().slice(-8)}`),
    technicianId: technicianId || booking.assignedTechnicianId,
    technicianName: technicianName || booking.assignedTechnicianName,
    serviceName: booking.serviceName,
    createdAt: new Date().toISOString(),
    paidAt: new Date().toISOString(),
    notes: notes || `Payment collected for ${booking.serviceName} (${booking.acType})`,
  };

  saveTransaction(txn);

  // 3. Generate Official Invoice
  const invoice = generateInvoiceForBooking(booking, paymentMethod, txn.transactionRef, txn.id);

  return { transaction: txn, invoice };
}

export function generatePaymentReceiptWhatsAppURL(
  txn: PaymentTransaction,
  invoice?: EGSInvoice
): string {
  const cleanPhone = (txn.whatsapp || txn.phone).replace(/[^0-9]/g, "");
  const targetPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
  const text = `*Payment Receipt & 30-Day Guarantee - EGS INDIA* 🧾
━━━━━━━━━━━━━━━━━━
Dear *${txn.customerName}*,
Thank you for your payment to *Expert Goods & Services (EGS INDIA)*!

💳 *Transaction Details:*
• Receipt / Txn ID: *${txn.id}*
• Invoice No: *${txn.invoiceNo}*
• Service: ${txn.serviceName}
• Amount Received: *₹${txn.amount.toLocaleString("en-IN")}*
• Payment Mode: ${txn.paymentMethod}${txn.transactionRef ? ` (${txn.transactionRef})` : ""}
• Date: ${new Date(txn.paidAt || txn.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}

🛡️ *30-Day Post-Service Guarantee:*
Your serviced AC is covered under our 30-Day Free Revisit & Performance Guarantee.

To view or print your GST tax invoice, visit our portal or contact our 24/7 support.
Helpline: +91 98956 88833 | https://egsindia.com`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

export function generateCustomerPaymentLinkWhatsAppURL(booking: Booking): string {
  const cleanPhone = (booking.whatsappNumber || booking.phone).replace(/[^0-9]/g, "");
  const targetPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
  const upiUrl = generateUPIPaymentUrl(booking.estimatedAmount, booking.id);
  const text = `*Service Payment Request - EGS INDIA* ❄️
━━━━━━━━━━━━━━━━━━
Dear *${booking.customerName}*,
Here are your payment details for EGS INDIA booking *${booking.id}* (*${booking.serviceName}*):

💰 *Amount Due:* ₹${booking.estimatedAmount.toLocaleString("en-IN")} (incl. 18% GST)

📲 *Pay via UPI (GPay / PhonePe / Paytm / BHIM):*
${upiUrl}

🏢 *Official Bank Transfer:*
• Bank: ICICI Bank Ltd
• A/C Name: Expert Goods and Services India Pvt Ltd
• A/C No: 004205018899
• IFSC: ICIC0000042

Cash can also be paid directly to our field technician upon service completion.
Support Helpline: +91 98956 88833.`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}


