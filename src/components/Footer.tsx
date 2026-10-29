import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, ShieldCheck, Clock, Award } from "lucide-react";
import { EGS_CALL_NUMBER, EGS_WHATSAPP_NUMBER } from "../lib/store";

const REGIONAL_HUBS = [
  { name: "Kollam", isHQ: true },
  { name: "Trivandrum" },
  { name: "Ernakulam" },
  { name: "Thrissur" },
  { name: "Alappuzha" },
  { name: "Kottayam" },
  { name: "Kozhikode" },
  { name: "Bangalore" },
  { name: "Chennai" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border bg-[oklch(0.20_0.07_265)] px-4 pt-16 pb-32 sm:pb-16 text-background md:px-8">
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
            <div className="flex items-center gap-2">
              <MapPin className="size-3.5 text-sky-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-background/90">
                Regional Service Hubs
              </h3>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-1.5">
              {REGIONAL_HUBS.map((hub) => (
                <Link
                  key={hub.name}
                  to="/service-areas"
                  className="group flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-1.5 text-xs text-background/75 transition-all duration-200 hover:border-sky-400/30 hover:bg-sky-500/10 hover:text-white"
                >
                  <span className="truncate group-hover:translate-x-0.5 transition-transform duration-200">
                    {hub.name}
                  </span>
                  {hub.isHQ ? (
                    <span className="ml-1 rounded bg-sky-400/20 px-1 py-0.5 text-[9px] font-black tracking-wider text-sky-300 ring-1 ring-sky-400/30">
                      HQ
                    </span>
                  ) : (
                    <span className="size-1 rounded-full bg-sky-400/40 group-hover:bg-sky-400 transition-colors" />
                  )}
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-2">
              <Link
                to="/service-areas"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 transition-colors hover:text-white group"
              >
                <span>Explore All Service Areas & Hubs</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
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
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/60">
            <p className="font-medium">
              © {currentYear} EGS INDIA. Copyright and design by Codexora Studio
            </p>
            <div className="flex flex-wrap gap-4 text-white/60">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/services/ac-service" className="hover:text-white transition-colors">AC Service</Link>
              <Link to="/services/ac-repair" className="hover:text-white transition-colors">AC Repair</Link>
              <Link to="/service-areas" className="hover:text-white transition-colors">Service Areas</Link>
              <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link to="/book" className="text-white font-bold hover:underline">Book a Service</Link>
            </div>
          </div>

          {/* Large Brand Statement Watermark */}
          <div className="pt-2 sm:pt-4 select-none pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="font-black uppercase tracking-tight leading-[0.88] text-white/[0.08] text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[8rem] 2xl:text-[9.25rem]">
              <div>EXPERT</div>
              <div className="whitespace-nowrap">GOODS AND SERVICES</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
