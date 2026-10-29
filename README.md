# ❄️ EGS INDIA — Enterprise HVAC Solutions & Certified AC Services 🛠️

<div align="center">

### *"Fresh Air, Happy Homes & Precision Cooling Reinvented!"* ✨

[![Website](https://img.shields.io/badge/Live_Site-egsindia.in-0066cc?style=for-the-badge&logo=google-chrome&logoColor=white)](https://www.egsindia.in)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TanStack Start](https://img.shields.io/badge/TanStack-Start-FF4154?style=for-the-badge&logo=react-router&logoColor=white)](https://tanstack.com/start)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Neon Database](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

**Official Web Application, 60-Second Consumer Booking Engine & Real-Time Field Service Operations ERP for EGS INDIA (Expert Goods & Services).**

[🌐 Explore Website](https://www.egsindia.in) • [⚡ Book a Service](https://www.egsindia.in/book) • [🛠️ Services](https://www.egsindia.in/#services) • [🏢 Client Portfolio](https://www.egsindia.in/projects) • [📍 Service Areas](https://www.egsindia.in/service-areas)

<br />

<p align="center">
  <img src="./public/og-image.png" alt="EGS INDIA HVAC Engineering & Doorstep AC Solutions" width="100%" style="border-radius: 16px; box-shadow: 0 15px 40px rgba(0,0,0,0.18);" />
</p>

</div>

---

## 🖥️ Live Application Showcase & Desktop Experience

Experience the official web application running live in production on [egsindia.in](https://www.egsindia.in):

<table align="center" width="100%">
  <tr>
    <td align="center" width="50%">
      <img src="./public/screenshots/hero-desktop.png" alt="Homepage Hero Experience" style="border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.12);" /><br />
      <sub><b>🌟 Modern Homepage & Hero Experience</b><br />Floating glassmorphism navigation, dynamic counters, and instant service speed-dials.</sub>
    </td>
    <td align="center" width="50%">
      <img src="./public/screenshots/booking-wizard-desktop.png" alt="5-Step Online Booking Wizard" style="border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.12);" /><br />
      <sub><b>⚡ 5-Step Certified AC Booking Engine</b><br />Instant service selection, multi-unit discounts, and rapid technician dispatch.</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="./public/screenshots/trust-partner-desktop.png" alt="Trust Metrics & Commercial Experience" style="border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.12);" /><br />
      <sub><b>🏢 South India's Most Trusted AC Partner</b><br />15+ years engineering heritage, 30,000+ happy customers, and central plant expertise.</sub>
    </td>
    <td align="center" width="50%">
      <img src="./public/screenshots/cta-section-desktop.png" alt="High-Conversion Call to Action" style="border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.12);" /><br />
      <sub><b>📞 Seamless 1-Click WhatsApp & Call Assistance</b><br />Direct connect to regional dispatch desks across Kerala and South India.</sub>
    </td>
  </tr>
</table>

---

## 📖 About EGS INDIA

Established in **2015 in Kollam, Kerala**, **Expert Goods & Services (EGS INDIA)** is one of South India's premier organized HVAC engineering and cooling solutions providers. Spanning Kerala, Tamil Nadu, and Karnataka, EGS INDIA operates with a dedicated fleet of **80+ certified mobile technicians**, providing **guaranteed 90-minute arrival** for emergency AC breakdowns, preventive maintenance, industrial VRV/VRF deployments, and multi-year corporate AMCs.

This repository powers the entire customer-facing digital presence and the internal operational backbone for customer intake, technician dispatching, and billing.

---

## ✨ Key Features

### 1. 🚀 5-Step Online Booking Engine (`/book`)
- **60-Second Instant Booking**: Wizard guiding customers through Service Selection, AC Types, Unit Quantities, Address, and Preferred Arrival Window.
- **Dynamic Pricing Engine**: Automated estimation including multi-unit volume discounts, flat ₹799 full-body service packages, and cash/UPI post-service payment guarantee.
- **Express 90-Minute Dispatch**: Live slot options including `⚡ Emergency Now (Within 90 Mins)` and scheduled date/time windows.
- **Dual-Layer Persistence**: Asynchronously persists to **Neon PostgreSQL Cloud** with intelligent fallback to local browser cache.
- **Automated WhatsApp Integration**: One-click customer dispatch generating formatted WhatsApp orders with Google Maps GPS pins.

### 2. 🏢 Executive Operations Control Hub (`/control-hub`)
- **PIN-Protected Admin Portal**: Clean, luxury light-themed operations center with rapid mobile PIN authentication.
- **End-to-End Lead Pipeline**: Full tracking across statuses:
  $$\text{NEW} \longrightarrow \text{CONTACTED} \longrightarrow \text{CONFIRMED} \longrightarrow \text{ASSIGNED} \longrightarrow \text{EN ROUTE} \longrightarrow \text{IN PROGRESS} \longrightarrow \text{COMPLETED} \longrightarrow \text{PAID}$$
- **Customer CRM & Asset History**: Tracks service logs, customer profiles, past invoices, and machine maintenance records.
- **AMC Renewal Management**: Automatic tracking of active quarterly/bi-annual maintenance contracts with 1-click WhatsApp renewal alerts.
- **Billing & Invoicing Engine**: Generates professional branded tax invoices and UPI QR payment links directly for field technicians.
- **Mobile Admin Bottom Navigation Dock**: 5-tab quick switcher dock (Bookings, AMC, Customers, Billing, Operations Drawer) designed for smartphone usage.

### 3. ❄️ Commercial HVAC & Central Cooling Deployments
EGS INDIA specializes in the design, engineering, supply, erection, and commissioning of large-scale central air conditioning plants, chillers, and VRV/VRF systems across South India.

<br />

<p align="center">
  <img src="./public/commercial-ac-plant.jpg" alt="Commercial HVAC Central Chiller Plant" width="100%" style="border-radius: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" /><br />
  <sub><em>Central Air Conditioning & Rooftop Chiller Plant deployed by EGS INDIA Engineering Division</em></sub>
</p>

<br />

- **[AC Service & Deep Cleaning](https://www.egsindia.in/services/ac-service)**: Anti-bacterial foam jet cleaning, indoor blower wash, and outdoor condenser hygiene.
- **[AC Repair & Diagnostics](https://www.egsindia.in/services/ac-repair)**: Gas leak detection, compressor diagnostics, capacitor swaps, and PCB repairs.
- **[AC Installation & Uninstallation](https://www.egsindia.in/services/ac-installation)**: Professional copper piping, bracket mounting, vacuum testing, and office shifting.
- **[Annual Maintenance Contracts (AMC)](https://www.egsindia.in/services/ac-amc)**: Basic & Comprehensive packages for residential villas and enterprise offices.
- **[Commercial HVAC Solutions](https://www.egsindia.in/services/commercial-hvac)**: Central chillers, VRF/VRV engineering, cassette ACs, and ductable units.

---

## 🏛️ Trusted by Leading Institutions

EGS INDIA manages mission-critical HVAC operations, precision cooling, and preventive AMC for prominent corporate, government, healthcare, and hospitality institutions across South India:

<div align="center">

| <img src="./public/clients/state-bank-of-india.png" width="140" alt="State Bank of India" /> | <img src="./public/clients/trivandrum-airport.png" width="140" alt="Trivandrum International Airport" /> | <img src="./public/clients/kerala-police-academy.png" width="140" alt="Kerala Police Academy" /> | <img src="./public/clients/sut-hospital.png" width="140" alt="SUT Hospital" /> |
| :---: | :---: | :---: | :---: |
| **State Bank of India** | **Trivandrum Intl Airport** | **Kerala Police Academy** | **SUT Hospital** |

| <img src="./public/clients/jayalakshmi-silks.png" width="140" alt="Jayalakshmi Silks" /> | <img src="./public/clients/tuv-rheinland.png" width="140" alt="TÜV Rheinland" /> | <img src="./public/clients/ahalya-eye-foundation.png" width="140" alt="Ahalya Eye Foundation" /> | <img src="./public/clients/hotel-all-season.png" width="140" alt="Hotel All Season" /> |
| :---: | :---: | :---: | :---: |
| **Jayalakshmi Silks** | **TÜV Rheinland** | **Ahalya Eye Foundation** | **Hotel All Season (5-Star)** |

</div>

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev) | High-performance modern UI rendering |
| **Meta-Framework** | [TanStack Start](https://tanstack.com/start) | SSR & Type-safe file-based routing |
| **Routing** | [TanStack Router v1](https://tanstack.com/router) | 100% type-safe client-side navigation |
| **Data Fetching** | [TanStack Query v5](https://tanstack.com/query) | Async state caching and cache invalidation |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) | Modern atomic design system with OKLCH palettes |
| **Iconography** | [Lucide React](https://lucide.dev) | Crisp vector icons |
| **Database** | [Neon PostgreSQL](https://neon.tech) | Cloud serverless database with connection pooling |
| **Database Driver** | `@neondatabase/serverless` | Sub-50ms HTTP SQL querying compatible with Edge & Node |
| **Build System** | [Vite](https://vite.dev) & [Nitro](https://nitro.unjs.io) | Lightning-fast HMR and universal production bundle |
| **Analytics & SEO** | GTM, GA4, Meta Pixel, Google Ads | Full-funnel ad attribution and UTM parameter capture |
| **Hosting** | [Vercel](https://vercel.com) | Worldwide edge CDN deployment with automatic CI/CD |

---

## 🗄️ Database Schema & Keep-Alive System

The project connects to **Neon PostgreSQL** via serverless connection pooling. The schema supports complete HVAC operational lifecycle management:

```
src/db/schema.sql
├── bookings              # Customer bookings, statuses, preferred slots, GPS coordinates
├── customers             # Customer directory with lifetime value & service frequency
├── technicians           # Field workforce directory, skills, active jobs & ratings
├── amc_contracts         # Annual maintenance agreements, unit counts, renewal dates
├── payments              # Cash/UPI transactions, payment IDs, verification logs
├── invoices              # Branded tax invoice records, line items, and GST breakdowns
└── audit_logs            # Immutable history of status transitions and updates
```

### ⚡ 4-Layer Keep-Alive System (Zero Cold-Starts)
Neon computes scale-to-zero when inactive. To guarantee instant sub-50ms responses for customers and field managers:
1. **Visitor Background Pre-Warming (`__root.tsx`)**: As soon as any visitor lands on any page, a non-blocking `pingDatabaseKeepAlive()` runs in an idle callback. The database is warm before they complete the booking form.
2. **Control Hub Heartbeat (`control-hub.tsx`)**: Sends an active keep-alive ping every 3.5 minutes while the admin tab is open.
3. **Scheduled GitHub Action (`.github/workflows/db-keepalive.yml`)**: Pings the database every 10 minutes throughout Indian business hours (8:00 AM – 10:00 PM IST) and sleeps at night to preserve Neon's free Compute Unit quota.
4. **Standalone CLI Script (`scripts/keepalive.mjs`)**: Instant health check via `npm run db:keepalive`.

---

## 📁 Project Structure

```bash
egs_india/
├── .github/
│   └── workflows/
│       └── db-keepalive.yml     # Automated scheduled database keep-alive workflow
├── public/
│   ├── clients/                 # Client institutional brand logos
│   ├── screenshots/             # Live desktop application captures
│   ├── commercial-ac-plant.jpg  # Central chiller & VRV plant photography
│   ├── og-image.png             # Official OpenGraph branding social card
│   └── logo-full.png            # Official high-resolution logo
├── scripts/
│   ├── setup-db.mjs             # Database schema migration & initialization script
│   └── keepalive.mjs            # Standalone Neon database keep-alive ping script
├── src/
│   ├── assets/                  # Photography and visual assets
│   ├── components/
│   │   ├── ui/                  # Accessible UI primitives (dialogs, sheet, accordions)
│   │   ├── BookingWizard.tsx    # 5-step interactive service booking wizard
│   │   ├── ClientsShowcase.tsx  # Institutional client showcase with filtering
│   │   ├── CoolAirFlow.tsx      # Ambient animated AC airflow background canvas
│   │   ├── FloatingActions.tsx  # Quick WhatsApp & Call speed-dial widgets
│   │   ├── Footer.tsx           # Enterprise footer with quick links & regional hubs
│   │   ├── Navbar.tsx           # Floating glassmorphism navbar with service dropdown
│   │   ├── ScrollReveal.tsx     # Intersection-observer scroll reveal animations
│   │   ├── ServiceLandingTemplate.tsx # Universal layout for service landing pages
│   │   └── WhatsAppIcon.tsx     # Vector WhatsApp brand badge
│   ├── data/
│   │   └── clients.ts           # 19 institutional client profiles, logos & details
│   ├── db/
│   │   └── schema.sql           # Complete PostgreSQL schema definitions
│   ├── lib/
│   │   ├── db.ts                # Neon SQL connection client & query helpers
│   │   ├── store.ts             # Central business logic, state models & WhatsApp formatters
│   │   ├── tracking.ts          # UTM capture, GTM dataLayer & Meta Pixel dispatchers
│   │   └── utils.ts             # Tailwind class merging utility
│   ├── routes/
│   │   ├── __root.tsx           # Root application shell, SEO meta & tracking scripts
│   │   ├── index.tsx            # High-conversion homepage & hero section
│   │   ├── book.tsx             # Dedicated online booking page
│   │   ├── about.tsx            # Company story, founding leadership & milestones
│   │   ├── contact.tsx          # Contact inquiries, office addresses & direct helpline
│   │   ├── control-hub.tsx      # Admin ERP operations dashboard & lead pipeline
│   │   ├── projects.tsx         # Major MEP/HVAC institutional projects portfolio
│   │   ├── service-areas.tsx    # South India service hubs directory
│   │   └── services/            # Deep-dive SEO service landing routes
│   │       ├── ac-service.tsx
│   │       ├── ac-repair.tsx
│   │       ├── ac-installation.tsx
│   │       ├── ac-amc.tsx
│   │       └── commercial-hvac.tsx
│   ├── styles.css               # Global styling, custom scrollbars & color variables
│   └── router.tsx               # TanStack router tree configuration
├── .env.example                 # Environment variable templates
├── package.json                 # Project dependencies & npm scripts
├── tsconfig.json                # Strict TypeScript configuration
└── vite.config.ts               # Vite configuration with Tailwind CSS v4 plugin
```

---

## 🚦 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm` (v10+) or `bun`
- **Neon Account**: A PostgreSQL database connection string (Neon or standard Postgres).

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/alwinjosegeorge/AC-repair-Website.git
cd AC-repair-Website
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Neon Serverless PostgreSQL Connection String
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@YOUR_ENDPOINT-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
VITE_DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@YOUR_ENDPOINT-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

### 3. Initialize Database Schema
Run the automated migration runner to create tables, indexes, and initial seeds:
```bash
npm run db:setup
```

Verify database connectivity:
```bash
npm run db:health
npm run db:keepalive
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with hot-module reload |
| `npm run build` | Builds client assets and compiles Nitro SSR server bundle |
| `npm run preview` | Runs a local production preview of the build output |
| `npm run lint` | Runs ESLint to check for syntax and style issues |
| `npm run format` | Formats all code with Prettier |
| `npm run db:setup` | Executes `schema.sql` on the connected Neon database |
| `npm run db:health` | Performs an instant SQL connectivity and version check |
| `npm run db:keepalive` | Executes a lightweight keep-alive ping on the database |

---

## 🌐 Production Deployment

The project is optimized for zero-config deployment on **Vercel**:

1. **Import to Vercel**: Connect the repository to your Vercel account.
2. **Configure Environment Variables**:
   - `DATABASE_URL`: Your pooled Neon connection string.
   - `VITE_DATABASE_URL`: Same pooled Neon connection string.
3. **Build Settings**:
   - Framework Preset: `Other` or `Vite`
   - Build Command: `npm run build`
   - Output Directory: `.output/public`
4. **Custom Domain Configuration**:
   - Configure DNS A records for `egsindia.in` pointing to `76.76.21.21`
   - Configure CNAME record for `www.egsindia.in` pointing to `cname.vercel-dns.com`

---

## 📞 Support & Helpline

- **Official Website**: [https://www.egsindia.in](https://www.egsindia.in)
- **Customer Helpline**: `+91 98956 88833`
- **WhatsApp Support**: `+91 98956 88833`
- **Headquarters**: EGS INDIA HVAC Division, Kollam, Kerala, India

---

<div align="center">
  <sub>Built with ❤️ for <strong>EGS INDIA</strong> • Designed & Made by <a href="https://codexorastudio.vercel.app/"><strong>Codexora Studio</strong></a></sub>
</div>
