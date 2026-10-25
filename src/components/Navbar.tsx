import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Phone,
  MessageSquare,
  Menu,
  X,
  ChevronDown,
  AirVent,
  Wrench,
  Cog,
  ShieldCheck,
  Building2,
  Calendar,
} from "lucide-react";
import { EGS_CALL_NUMBER, EGS_WHATSAPP_NUMBER } from "../lib/store";
import { trackCallClick, trackWhatsAppClick } from "../lib/tracking";

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
        <nav className="hidden items-center gap-6 lg:flex">
          <Link
            to="/"
            className="text-sm font-semibold text-foreground/80 transition-colors hover:text-brand"
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
              className="flex items-center gap-1 text-sm font-semibold text-foreground/80 transition-colors hover:text-brand"
            >
              <span>Services</span>
              <ChevronDown className="size-4" />
            </button>

            {servicesDropdownOpen && (
              <div className="absolute left-0 top-full pt-3 z-50 w-80">
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
          >
            Service Areas
          </Link>

          <Link
            to="/about"
            className="text-sm font-semibold text-foreground/80 transition-colors hover:text-brand"
          >
            About Us
          </Link>

          <Link
            to="/contact"
            className="text-sm font-semibold text-foreground/80 transition-colors hover:text-brand"
          >
            Contact
          </Link>
        </nav>

        {/* Header Right Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Direct Phone Call */}
          <a
            href={`tel:${EGS_CALL_NUMBER}`}
            onClick={() => trackCallClick("header_navbar")}
            className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-bold text-foreground transition-colors hover:border-brand/40"
          >
            <Phone className="size-3.5 text-brand" />
            <span>+91 98956 88833</span>
          </a>

          {/* Direct WhatsApp */}
          <a
            href={waURL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("header_navbar")}
            className="flex items-center gap-1.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 px-3.5 py-2 text-xs font-bold text-[#25D366] transition-colors hover:bg-[#25D366]/20"
          >
            <MessageSquare className="size-3.5 fill-current" />
            <span>WhatsApp</span>
          </a>

          {/* Book a Service CTA */}
          <Link
            to="/book"
            className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-xs font-black text-brand-foreground shadow-md shadow-brand/25 transition-all hover:opacity-95 hover:shadow-brand/40"
          >
            <Calendar className="size-3.5" />
            <span>Book a Service</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground lg:hidden"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mt-2 rounded-3xl border border-border bg-card p-5 shadow-2xl lg:hidden">
          <div className="space-y-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-foreground"
            >
              Home
            </Link>

            <div className="border-t border-border pt-3">
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Our Services
              </span>
              <div className="mt-2 space-y-1">
                {SERVICE_LINKS.map((s) => (
                  <Link
                    key={s.href}
                    to={s.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface"
                  >
                    <span>{s.name}</span>
                    <span className="text-[10px] text-brand">View →</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-3 space-y-2.5">
              <Link
                to="/service-areas"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-bold text-foreground"
              >
                Service Areas
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-semibold text-muted-foreground"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-semibold text-muted-foreground"
              >
                Contact
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-semibold text-brand"
              >
                ⚙️ Admin CRM Portal
              </Link>
            </div>

            <div className="border-t border-border pt-4 grid grid-cols-2 gap-2">
              <a
                href={`tel:${EGS_CALL_NUMBER}`}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface py-2.5 text-xs font-bold text-foreground"
              >
                <Phone className="size-3.5 text-brand" />
                Call Now
              </a>
              <Link
                to="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-brand py-2.5 text-xs font-black text-brand-foreground"
              >
                <Calendar className="size-3.5" />
                Book Online
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
