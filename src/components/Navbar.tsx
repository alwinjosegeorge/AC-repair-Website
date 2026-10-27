import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Phone,
  Menu,
  X,
  ChevronDown,
  AirVent,
  Wrench,
  Cog,
  ShieldCheck,
  Building2,
  Calendar,
  Home,
  Users,
  MapPin,
  Headphones,
} from "lucide-react";
import { EGS_CALL_NUMBER, EGS_WHATSAPP_NUMBER } from "../lib/store";
import { trackCallClick, trackWhatsAppClick } from "../lib/tracking";
import { WhatsAppIcon } from "./WhatsAppIcon";

export const SERVICE_LINKS = [
  {
    name: "AC Service",
    href: "/services/ac-service",
    desc: "Deep foam & power jet cleaning",
    icon: AirVent,
  },
  {
    name: "AC Repair",
    href: "/services/ac-repair",
    desc: "Gas refill, cooling fix & PCB repair",
    icon: Wrench,
  },
  {
    name: "AC Installation",
    href: "/services/ac-installation",
    desc: "New fitting, copper piping & shift",
    icon: Cog,
  },
  {
    name: "AC AMC Maintenance",
    href: "/services/ac-amc",
    desc: "Annual maintenance contracts for homes",
    icon: ShieldCheck,
  },
  {
    name: "Commercial HVAC",
    href: "/services/commercial-hvac",
    desc: "VRV/VRF, chillers & central cooling",
    icon: Building2,
  },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const waURL = `https://wa.me/${EGS_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello EGS INDIA! I would like to inquire about AC service booking."
  )}`;

  return (
    <header className="sticky top-4 z-40 px-3 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-border/80 bg-background/95 px-4 py-3 shadow-[0_10px_35px_-20px_rgba(0,0,0,0.15)] backdrop-blur-md md:px-6">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo-full.png"
            alt="Expert Goods & Services"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-7 lg:flex">
          <Link
            to="/"
            className="text-sm font-semibold text-foreground/80 transition-colors hover:text-brand"
            activeProps={{ className: "text-brand font-bold" }}
          >
            Home
          </Link>

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => setServicesDropdownOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80 transition-colors hover:text-brand py-1"
            >
              <span>Services</span>
              <ChevronDown className={`size-3.5 transition-transform duration-200 ${servicesDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {servicesDropdownOpen && (
              <div className="absolute left-0 top-full pt-2 z-50 w-80">
                <div className="rounded-2xl border border-border bg-card p-3 shadow-2xl space-y-1">
                  {SERVICE_LINKS.map((s) => {
                    const Icon = s.icon;
                    return (
                      <Link
                        key={s.href}
                        to={s.href}
                        onClick={() => setServicesDropdownOpen(false)}
                        className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-surface"
                      >
                        <div className="flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand shrink-0">
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-foreground">
                            {s.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {s.desc}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/service-areas"
            className="text-sm font-semibold text-foreground/80 transition-colors hover:text-brand"
            activeProps={{ className: "text-brand font-bold" }}
          >
            Service Areas
          </Link>

          <Link
            to="/about"
            className="text-sm font-semibold text-foreground/80 transition-colors hover:text-brand"
            activeProps={{ className: "text-brand font-bold" }}
          >
            About Us
          </Link>

          <Link
            to="/contact"
            className="text-sm font-semibold text-foreground/80 transition-colors hover:text-brand"
            activeProps={{ className: "text-brand font-bold" }}
          >
            Contact
          </Link>
        </nav>

        {/* Header Right Action: ONLY Book a service */}
        <div className="hidden items-center lg:flex">
          <Link
            to="/book"
            className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-black uppercase tracking-wider text-brand-foreground shadow-md shadow-brand/25 transition-all hover:opacity-95 hover:shadow-brand/40 hover:scale-[1.02]"
          >
            <Calendar className="size-3.5" />
            <span>Book a service</span>
          </Link>
        </div>

        {/* Mobile Header Actions (Menu Toggle Only) */}
        <div className="flex items-center lg:hidden">
          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mt-2 rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-2xl lg:hidden animate-fade-in-up">
          <div className="space-y-4">
            {/* 1. Quick Navigation Hub: Home, About Us, Service Areas, Contact */}
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block mb-2 px-1">
                Navigation
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-2xl border border-border/80 bg-surface/70 p-3 text-xs font-bold text-foreground transition-all hover:border-brand/50 hover:bg-surface active:scale-95"
                  activeProps={{ className: "border-brand bg-brand-soft/40 text-brand font-black" }}
                >
                  <div className="flex size-7 items-center justify-center rounded-lg bg-brand-soft text-brand shrink-0">
                    <Home className="size-3.5" />
                  </div>
                  <span>Home</span>
                </Link>

                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-2xl border border-border/80 bg-surface/70 p-3 text-xs font-bold text-foreground transition-all hover:border-brand/50 hover:bg-surface active:scale-95"
                  activeProps={{ className: "border-brand bg-brand-soft/40 text-brand font-black" }}
                >
                  <div className="flex size-7 items-center justify-center rounded-lg bg-brand-soft text-brand shrink-0">
                    <Users className="size-3.5" />
                  </div>
                  <span>About Us</span>
                </Link>

                <Link
                  to="/service-areas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-2xl border border-border/80 bg-surface/70 p-3 text-xs font-bold text-foreground transition-all hover:border-brand/50 hover:bg-surface active:scale-95"
                  activeProps={{ className: "border-brand bg-brand-soft/40 text-brand font-black" }}
                >
                  <div className="flex size-7 items-center justify-center rounded-lg bg-brand-soft text-brand shrink-0">
                    <MapPin className="size-3.5" />
                  </div>
                  <span>Service Areas</span>
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-2xl border border-border/80 bg-surface/70 p-3 text-xs font-bold text-foreground transition-all hover:border-brand/50 hover:bg-surface active:scale-95"
                  activeProps={{ className: "border-brand bg-brand-soft/40 text-brand font-black" }}
                >
                  <div className="flex size-7 items-center justify-center rounded-lg bg-brand-soft text-brand shrink-0">
                    <Headphones className="size-3.5" />
                  </div>
                  <span>Contact</span>
                </Link>
              </div>
            </div>

            {/* 2. HVAC Services Specializations */}
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  Our HVAC Services
                </span>
                <span className="text-[10px] font-bold text-brand bg-brand-soft px-2 py-0.5 rounded-full">
                  5 Specializations
                </span>
              </div>
              <div className="space-y-1">
                {SERVICE_LINKS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <Link
                      key={s.href}
                      to={s.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface transition-colors"
                      activeProps={{ className: "bg-surface text-brand font-bold" }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-6 items-center justify-center rounded-md bg-brand-soft/60 text-brand shrink-0">
                          <Icon className="size-3.5" />
                        </div>
                        <span>{s.name}</span>
                      </div>
                      <span className="text-[11px] font-bold text-brand">View →</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 3. Action Buttons */}
            <div className="border-t border-border pt-4 flex flex-col gap-2">
              <Link
                to="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-brand py-3 text-xs font-black uppercase tracking-wider text-brand-foreground shadow-md shadow-brand/30 transition-all hover:opacity-95 active:scale-95"
              >
                <Calendar className="size-4" />
                <span>Book a service</span>
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${EGS_CALL_NUMBER}`}
                  onClick={() => trackCallClick("mobile_drawer")}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface py-2.5 text-xs font-bold text-foreground shadow-xs hover:border-brand/40 active:scale-95"
                >
                  <Phone className="size-3.5 text-brand" />
                  <span>Call now</span>
                </a>
                <a
                  href={waURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick("mobile_drawer")}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 py-2.5 text-xs font-bold text-[#25D366] shadow-xs hover:bg-[#25D366]/25 active:scale-95"
                >
                  <WhatsAppIcon className="size-3.5 fill-current" />
                  <span>WhatsApp us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
