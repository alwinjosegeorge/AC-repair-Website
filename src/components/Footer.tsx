import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, ShieldCheck, Clock, Award } from "lucide-react";
import { EGS_CALL_NUMBER, EGS_WHATSAPP_NUMBER } from "../lib/store";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border bg-[oklch(0.20_0.07_265)] px-4 py-16 text-background md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo-full.png"
                alt="Expert Goods & Services"
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-background/70">
              Expert Goods & Services (EGS INDIA) is a premier HVAC and air conditioning service provider across Kerala and Tamil Nadu. Delivering high-precision jet cleaning, repair, installation, and AMC solutions.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-background/80">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-400" />
                30-Day Service Warranty
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4 text-sky-400" />
                90-Min Express Slots
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="size-4 text-amber-400" />
                Police-Verified Techs
              </span>
            </div>
          </div>

          {/* Quick Services */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-background/90">
              Our Services
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-background/70">
              <li>
                <Link to="/services/ac-service" className="hover:text-white transition-colors">
                  AC Deep Jet Service
                </Link>
              </li>
              <li>
                <Link to="/services/ac-repair" className="hover:text-white transition-colors">
                  AC Repair & Gas Refill
                </Link>
              </li>
              <li>
                <Link to="/services/ac-installation" className="hover:text-white transition-colors">
                  AC Installation & Relocation
                </Link>
              </li>
              <li>
                <Link to="/services/ac-amc" className="hover:text-white transition-colors">
                  Annual Maintenance (AMC)
                </Link>
              </li>
              <li>
                <Link to="/services/commercial-hvac" className="hover:text-white transition-colors">
                  Commercial VRV / VRF HVAC
                </Link>
              </li>
              <li>
                <Link to="/book" className="font-bold text-white hover:underline">
                  Online Service Booking →
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Locations */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-background/90">
              Service Hubs
            </h3>
            <ul className="mt-4 space-y-2 text-xs text-background/70">
              <li>📍 Kollam Central Hub</li>
              <li>📍 Thiruvananthapuram City</li>
              <li>📍 Ernakulam / Cochin Metro</li>
              <li>📍 Thrissur Town</li>
              <li>📍 Chennai Regional Branch</li>
            </ul>

            <div className="mt-4">
              <Link to="/contact" className="text-xs font-semibold text-sky-300 hover:underline">
                View all branches & map →
              </Link>
            </div>
          </div>

          {/* Direct Support */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-background/90">
              Direct Contact
            </h3>
            <div className="mt-4 space-y-3 text-xs text-background/70">
              <a
                href={`tel:${EGS_CALL_NUMBER}`}
                className="flex items-center gap-2 font-bold text-white hover:text-sky-300"
              >
                <Phone className="size-4 text-sky-400" />
                +91 98956 88833
              </a>
              <a
                href={`https://wa.me/${EGS_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-bold text-emerald-400 hover:underline"
              >
                <span>💬 WhatsApp Support</span>
              </a>
              <div className="flex items-center gap-2">
                <Mail className="size-4" />
                <span>info@egsindia.in</span>
              </div>
              <div className="pt-2">
                <Link
                  to="/admin"
                  className="inline-block rounded-lg bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white/90 hover:bg-white/20 transition-colors"
                >
                  Admin CRM Login ↗
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-background/50 md:flex-row">
          <span>© {currentYear} Expert Goods & Services (EGS INDIA). All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-white">About</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
            <Link to="/book" className="hover:text-white">Book Now</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
