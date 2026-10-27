import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AirVent,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Fan,
  HardHat,
  Plus,
  Send,
  Snowflake,
  Sparkles,
  ThumbsUp,
  Recycle,
  Phone,
  Mail,
  MapPin,
  Menu,
  Wrench,
  Cog,
  ShieldCheck,
  Building2,
  MessageSquare,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookingWizard } from "@/components/BookingWizard";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { ScrollReveal } from "@/components/ScrollReveal";
import { EGS_CALL_NUMBER, EGS_WHATSAPP_NUMBER } from "@/lib/store";
import {
  captureTrackingParams,
  trackCallClick,
  trackWhatsAppClick,
} from "@/lib/tracking";
import { CoolAirFlow } from "@/components/CoolAirFlow";
import aboutTech from "@/assets/about-tech.jpg";
import projectResidential from "@/assets/project-residential.jpg";
import projectCommercial from "@/assets/project-commercial.jpg";
import processImg from "@/assets/process.jpg";
import cta1 from "@/assets/cta-1.jpg";
import cta2 from "@/assets/cta-2.jpg";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import work1 from "@/assets/work-1.jpg";
import work2 from "@/assets/work-2.jpg";
import work3 from "@/assets/work-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EGS INDIA" },
      {
        name: "description",
        content:
          "EGS INDIA - Expert Air Conditioner Service & HVAC Solutions in India.",
      },
      { property: "og:title", content: "EGS INDIA" },
      {
        property: "og:description",
        content:
          "EGS INDIA - Expert Air Conditioner Service & HVAC Solutions in India.",
      },
    ],
  }),
  component: Index,
});

const navLinks = [
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "/contact" }
];

function Badge({ children, tone = "soft" }: { children: string; tone?: "soft" | "white" }) {
  return (
    <span
      className={`inline-block rounded-md px-3 py-1.5 text-xs font-bold tracking-[0.08em] uppercase text-brand ${
        tone === "soft" ? "bg-brand-soft" : "bg-background shadow-sm"
      }`}
    >
      {children}
    </span>
  );
}

function Header() {
  return (
    <header className="sticky top-4 z-50 px-4 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl bg-background px-5 py-4 shadow-[0_10px_40px_-24px_oklch(0.2_0.06_260/0.45)] md:px-8">
        <a href="/" className="flex items-center gap-3">
          <img src="/logo-full.png" alt="Expert Goods & Services" className="h-14 w-auto object-contain" />
        </a>
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.name}
              href={l.href}
              className="text-base font-medium text-ink/80 transition-colors hover:text-brand"
            >
              {l.name}
            </a>
          ))}
        </nav>
        <a
          href="/contact"
          className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 lg:hidden"
        >
          Contact
        </a>
      </div>
    </header>
  );
}

function FloatingCard({
  className,
  icon,
  label,
  value,
  rotate,
}: {
  className: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  rotate: string;
}) {
  const [flipCount, setFlipCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlipCount((c) => c + 1);
    }, 6000); // Flip every 6 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      onMouseEnter={() => setFlipCount((c) => c + 1)}
      className={`absolute hidden w-44 rounded-3xl bg-background p-6 shadow-[0_24px_60px_-30px_oklch(0.2_0.06_260/0.5)] lg:block transition-transform duration-1000 ${className}`}
      style={{ transform: `perspective(1000px) rotate(${rotate}) rotateY(${flipCount * 360}deg)` }}
    >
      <div className="mb-4">{icon}</div>
      <p className="text-sm font-medium text-ink/70">{label}</p>
      <p className="text-4xl font-extrabold tracking-tight">{value}</p>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative -mt-24 overflow-hidden isolate pt-32 pb-16 sm:pt-40 sm:pb-24">
      {/* Animated Flowing Cool Stripes Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-y-0 -left-6 w-[calc(100%+120px)] h-full cool-stripes-pattern animate-cool-stripes" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_15%,rgba(255,255,255,0.75)_0%,transparent_65%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-tight sm:leading-[1.05] tracking-tight animate-fade-in-up">
          Service Reinvented.
          <span className="mt-1 sm:mt-2 block text-brand">
            Comfort Reimagined.
          </span>
        </h1>
        <p className="mx-auto mt-4 sm:mt-8 max-w-xl text-sm leading-relaxed text-ink/75 sm:text-base md:text-lg animate-fade-in-up-delay-1 px-2">
          Expert AC repair and maintenance services that keep your home comfortable year-round.
          Certified technicians, 90-minute rapid arrival, guaranteed results.
        </p>

        {/* 3 Main Action Buttons optimized for mobile & desktop */}
        <div className="mt-7 sm:mt-10 mx-auto max-w-3xl animate-fade-in-up-delay-2">
          <div className="flex flex-col gap-2.5 sm:grid sm:grid-cols-3 sm:gap-4">
            {/* 1. Book a service (prominent full width on mobile) */}
            <Link
              to="/book"
              className="group relative flex items-center justify-center gap-3 sm:flex-col rounded-2xl bg-brand px-5 sm:px-6 py-3.5 sm:py-4 text-brand-foreground shadow-xl shadow-brand/35 transition-all hover:scale-105 hover:bg-brand/90 ring-4 ring-brand/20 active:scale-95"
            >
              <Calendar className="size-5 shrink-0" />
              <div className="text-left sm:text-center">
                <span className="text-sm sm:text-base font-black tracking-wide uppercase block">Book a service</span>
                <span className="text-[11px] font-semibold text-brand-foreground/85 block sm:mt-0.5">
                  Online Slot • 90-Min Arrival
                </span>
              </div>
            </Link>

            {/* 2 & 3: WhatsApp us and Call now side-by-side on mobile */}
            <div className="grid grid-cols-2 gap-2 sm:contents">
              <a
                href={`https://wa.me/${EGS_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello EGS INDIA! I need assistance with AC Service/Repair.")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("homepage_hero")}
                className="group relative flex flex-col items-center justify-center rounded-2xl bg-[#25D366] px-3 sm:px-6 py-3 sm:py-4 text-white shadow-lg shadow-[#25D366]/30 transition-all hover:scale-105 hover:bg-[#20ba59] active:scale-95 text-center"
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <WhatsAppIcon className="size-4 sm:size-5 shrink-0 fill-current" />
                  <span className="text-xs sm:text-base font-black tracking-wide uppercase">WhatsApp</span>
                </div>
                <span className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] font-semibold text-white/90">
                  Direct Chat
                </span>
              </a>

              <a
                href={`tel:${EGS_CALL_NUMBER}`}
                onClick={() => trackCallClick("homepage_hero")}
                className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-border bg-card px-3 sm:px-6 py-3 sm:py-4 text-card-foreground shadow-md transition-all hover:scale-105 hover:border-brand/50 hover:bg-surface active:scale-95 text-center"
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <Phone className="size-4 sm:size-5 shrink-0 text-brand" />
                  <span className="text-xs sm:text-base font-black tracking-wide uppercase">Call now</span>
                </div>
                <span className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] font-semibold text-muted-foreground">
                  +91 98956 88833
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs font-semibold text-ink/75">
          <span className="flex items-center gap-1 text-emerald-600">
            <CheckCircle2 className="size-3.5" /> Flat ₹800 full body service
          </span>
          <span className="text-muted-foreground/30">•</span>
          <span className="flex items-center gap-1 text-brand">
            <CheckCircle2 className="size-3.5" /> 30-Day Guarantee
          </span>
          <span className="text-muted-foreground/30">•</span>
          <span className="flex items-center gap-1 text-amber-600">
            <CheckCircle2 className="size-3.5" /> Pay After Service
          </span>
        </div>
      </div>

      <FloatingCard
        className="top-1/2 left-4 xl:left-8 hidden xl:block z-20"
        rotate="-14deg"
        icon={<Recycle className="size-9 text-[oklch(0.72_0.19_150)]" strokeWidth={2.5} />}
        label="Energy Saved"
        value="50%"
      />
      <FloatingCard
        className="top-28 right-4 xl:right-8 hidden xl:block z-20"
        rotate="10deg"
        icon={
          <span className="grid size-10 place-items-center rounded-full bg-brand text-brand-foreground">
            <ThumbsUp className="size-5" />
          </span>
        }
        label="Happy Clients"
        value="12k+"
      />

      <div className="relative z-10 mx-auto mt-8 sm:mt-12 md:mt-14 max-w-5xl px-4 sm:px-6">
        <CoolAirFlow />
      </div>
    </section>
  );
}

function QuickActionBar() {
  const waURL = `https://wa.me/${EGS_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello EGS INDIA! I need fast AC service assistance."
  )}`;

  return (
    <section className="relative z-20 mt-6 sm:mt-8 md:mt-10 px-4 md:px-8">
      <ScrollReveal className="mx-auto max-w-6xl">
        <div className="rounded-3xl border-2 border-brand/20 bg-background/95 p-6 shadow-2xl backdrop-blur-md md:p-8">
          <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
                <span className="size-2 rounded-full bg-brand animate-ping" />
                PRIORITY SERVICE DISPATCH
              </div>
              <h3 className="mt-2 text-2xl font-black text-ink md:text-3xl">
                Need AC Service Right Now?
              </h3>
              <p className="mt-1 text-sm text-ink/70">
                Get certified HVAC technicians at your doorstep within 90 minutes. Choose your instant option:
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              {/* 1. Book a service */}
              <Link
                to="/book"
                className="flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-xs font-black uppercase tracking-wider text-brand-foreground shadow-lg shadow-brand/30 transition-all hover:scale-105 hover:bg-brand/90"
              >
                <Calendar className="size-4" />
                <span>Book a service</span>
              </Link>

              {/* 2. WhatsApp us */}
              <a
                href={waURL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("homepage_quick_bar")}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#25D366]/30 transition-all hover:scale-105 hover:bg-[#20ba59]"
              >
                <WhatsAppIcon className="size-4 fill-current" />
                <span>WhatsApp us</span>
              </a>

              {/* 3. Call now */}
              <a
                href={`tel:${EGS_CALL_NUMBER}`}
                onClick={() => trackCallClick("homepage_quick_bar")}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 py-3.5 text-xs font-black uppercase tracking-wider text-ink shadow-sm transition-all hover:border-brand/40 hover:bg-background"
              >
                <Phone className="size-4 text-brand" />
                <span>Call now</span>
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

function BreezeIconTwo() {
  return (
    <svg
      className="mx-3 sm:mx-6 h-5 w-6 sm:h-7 sm:w-8 text-[#70a9ff] shrink-0 inline-block align-middle"
      viewBox="0 0 32 28"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 14C2 6.5 7.5 1.5 14 1.5C12 7.5 12 20.5 14 26.5C7.5 26.5 2 21.5 2 14Z"
        fill="#70a9ff"
      />
      <path
        d="M16 14C16 6.5 21.5 1.5 28 1.5C26 7.5 26 20.5 28 26.5C21.5 26.5 16 21.5 16 14Z"
        fill="#70a9ff"
      />
    </svg>
  );
}

function BreezeIconThree() {
  return (
    <svg
      className="mx-3 sm:mx-6 h-5 w-7 sm:h-7 sm:w-9 text-[#70a9ff] shrink-0 inline-block align-middle"
      viewBox="0 0 36 28"
      fill="none"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="7" height="22" rx="3.5" fill="#70a9ff" />
      <rect x="14" y="1" width="8" height="26" rx="4" fill="#70a9ff" />
      <rect x="27" y="3" width="7" height="22" rx="3.5" fill="#70a9ff" />
    </svg>
  );
}

function Marquee() {
  const marqueeItems = [
    { text: "Comfort Restored", isBlue: false },
    { text: "Reliable Cooling", isBlue: true },
    { text: "Perfect Comfort", isBlue: false },
    { text: "Instant Cooling", isBlue: true },
  ];

  const renderItemSet = (keyPrefix: string) => (
    <div key={keyPrefix} className="flex items-center shrink-0">
      {marqueeItems.map((item, idx) => (
        <span key={`${keyPrefix}-${item.text}`} className="flex items-center">
          <span
            className={`text-xl sm:text-3xl md:text-4xl font-bold tracking-tight transition-colors ${
              item.isBlue ? "text-[#70a9ff] dark:text-[#93c5fd]" : "text-ink"
            }`}
          >
            {item.text}
          </span>
          {idx % 2 === 0 ? <BreezeIconTwo /> : <BreezeIconThree />}
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative mt-4 sm:mt-6 mb-2 sm:mb-4 py-2 sm:py-3 overflow-hidden isolate select-none">
      {/* Left and Right Edge Vignette Fades for seamless entrance & exit */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent z-10" />

      {/* Moving Marquee Ticker Track */}
      <div className="relative z-10 animate-marquee-smooth flex items-center whitespace-nowrap">
        {renderItemSet("set-1")}
        {renderItemSet("set-2")}
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="bg-background pt-4 pb-16 sm:pt-6 sm:pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="text-center">
            <Badge>KNOW ABOUT US</Badge>
            <h2 className="mt-4 sm:mt-6 text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-ink">
              South India's Most Trusted AC Service Partner
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          <ScrollReveal delayMs={0} className="h-full">
            <div className="h-full rounded-2xl bg-brand p-9 text-brand-foreground flex flex-col justify-between">
              <div>
                <span className="inline-block rounded-md bg-brand-foreground/20 px-3 py-1.5 text-xs font-bold tracking-[0.08em] uppercase">
                  GET TO KNOW US
                </span>
                <h3 className="mt-7 text-3xl leading-tight font-extrabold md:text-4xl">
                  Reliable Cooling Services For Homes{" "}
                  <span className="text-brand-foreground/50">And Businesses</span>
                </h3>
              </div>
              <p className="mt-6 text-brand-foreground/85">
                Expert AC repair and maintenance services that keep your home comfortable.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={80} className="h-full">
            <img
              src={aboutTech}
              alt="Technician in a yellow hard hat servicing AC wiring"
              width={800}
              height={1000}
              loading="lazy"
              className="h-full max-h-[26rem] w-full rounded-2xl object-cover"
            />
          </ScrollReveal>

          <ScrollReveal delayMs={160} className="h-full">
            <div className="grid gap-6 h-full">
              {[
                { icon: HardHat, value: "15+", label: "YEARS OF EXPERIENCE" },
                { icon: ThumbsUp, value: "2638+", label: "HAPPY CUSTOMERS" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="rounded-2xl bg-surface p-9 flex flex-col justify-center">
                  <Icon className="size-9 text-brand" strokeWidth={2} />
                  <p className="mt-8 text-5xl font-extrabold">{value}</p>
                  <p className="mt-3 text-sm font-bold tracking-wide text-ink/70 uppercase">
                    <span className="mr-2 text-brand">|</span>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

const services = [
  {
    icon: AirVent,
    title: "AC Deep Service",
    href: "/services/ac-service",
    price: "From ₹800",
    badge: "Most Popular",
    text: "High-pressure power jet pump wash, chemical foam cleaning, and deep coil sanitization.",
  },
  {
    icon: Wrench,
    title: "AC Repair & Fix",
    href: "/services/ac-repair",
    price: "From ₹399",
    badge: "90-Min Arrival",
    text: "Immediate diagnostics, gas leak detection & refill, water dripping fix, and PCB repair.",
  },
  {
    icon: Cog,
    title: "AC Installation",
    href: "/services/ac-installation",
    price: "From ₹1,199",
    badge: "Zero Gas Loss",
    text: "Wall mounting, copper piping, vacuum line evacuation, and safe unit shifting.",
  },
  {
    icon: ShieldCheck,
    title: "AC AMC Contract",
    href: "/services/ac-amc",
    price: "From ₹1,999/yr",
    badge: "Save 40%",
    text: "3 Scheduled seasonal wet jet services per year with unlimited free breakdown visits.",
  },
  {
    icon: Building2,
    title: "Commercial HVAC",
    href: "/services/commercial-hvac",
    price: "Custom Quote",
    badge: "Enterprise SLA",
    text: "VRV/VRF multi-splits, ductable units, central chillers, and 24/7 server room cooling.",
  },
];

function Services() {
  return (
    <section id="services" className="bg-[oklch(0.976_0.012_250)] py-20 sm:py-24 border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <Badge tone="white">EXPERTISE YOU CAN TRUST</Badge>
              <h2 className="mt-6 text-4xl font-extrabold md:text-6xl">Our HVAC Solutions</h2>
            </div>
            <p className="text-lg leading-relaxed text-ink/60">
              Certified air conditioning and refrigeration solutions for homes, villas, corporate offices, and industrial complexes across Kerala and Tamil Nadu.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, href, price, badge, text }, idx) => (
            <ScrollReveal key={title} delayMs={idx * 60} className="h-full">
              <article className="h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-background p-5 sm:p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 border border-border/80">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                      <Icon className="size-7" />
                    </div>
                    <span className="rounded-full bg-brand/10 px-3 py-1 text-[11px] font-black uppercase text-brand">
                      {badge}
                    </span>
                  </div>

                  <h3 className="mt-6 text-2xl font-black text-ink">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{text}</p>
                  <div className="mt-4 font-black text-brand text-lg">{price}</div>
                </div>

                <div className="mt-8 border-t border-border pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <Link
                    to={href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-brand"
                  >
                    Details <ArrowRight className="size-3.5" />
                  </Link>
                  <Link
                    to="/book"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-xs font-black uppercase tracking-wider text-brand-foreground shadow-md shadow-brand/20 transition-all hover:scale-105 hover:bg-brand/90 hover:shadow-lg"
                  >
                    <Calendar className="size-3.5" />
                    <span>BOOK SERVICE</span>
                  </Link>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookOnlineSection() {
  return (
    <section id="book-online" className="relative py-16 sm:py-24 px-4 md:px-8 overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-3">
            <Badge>ONLINE SERVICE BOOKING</Badge>
            <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
              Book Certified AC Service in 5 Easy Steps
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Select your service, AC type, unit count, address, and arrival time. Get instant WhatsApp confirmation with live technician assignment.
            </p>
          </div>
        </ScrollReveal>

        {/* Framer-Style Blue Banner Card with Concentric Ripple Circles */}
        <ScrollReveal delayMs={100}>
          <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-[#0084f6] text-white shadow-2xl overflow-hidden border border-white/20">
            {/* Subtle Concentric Rings centered behind the technician */}
            <div className="absolute left-[20%] top-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
              <div className="size-[260px] sm:size-[340px] -translate-x-1/2 -translate-y-1/2 absolute rounded-full border border-white/25 bg-white/5" />
              <div className="size-[420px] sm:size-[520px] -translate-x-1/2 -translate-y-1/2 absolute rounded-full border border-white/15" />
              <div className="size-[600px] sm:size-[720px] -translate-x-1/2 -translate-y-1/2 absolute rounded-full border border-white/10" />
              <div className="size-[800px] sm:size-[940px] -translate-x-1/2 -translate-y-1/2 absolute rounded-full border border-white/5" />
            </div>

            {/* Grid Layout: Left Technician Cutout, Right Translucent 5-Step Wizard Card */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-0">
              {/* Left Column: Technician Cutout holding Toolbox (Flush to bottom edge) */}
              <div className="lg:col-span-5 flex flex-col items-center lg:items-start justify-end self-end order-2 lg:order-1 pt-2 lg:pt-0 pb-0 mb-0 leading-none">
                <picture className="block w-full flex justify-center lg:justify-start items-end leading-none">
                  <source srcSet="/tool-box-man.avif" type="image/avif" />
                  <img
                    src="/tool-box-man.png"
                    alt="EGS Certified AC Technician with Tool Box"
                    width={720}
                    height={960}
                    loading="lazy"
                    className="block w-auto h-auto max-h-[380px] sm:max-h-[460px] lg:max-h-[520px] object-contain object-bottom drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)] select-none pointer-events-none align-bottom -mb-1"
                  />
                </picture>
              </div>

              {/* Right Column: 5-Step Wizard inside Glassmorphism Container */}
              <div className="lg:col-span-7 order-1 lg:order-2 w-full pt-1 pb-5 sm:pb-7">
                <div className="rounded-2xl sm:rounded-3xl bg-[#0074db]/65 sm:bg-[#0074db]/50 backdrop-blur-md p-3.5 sm:p-5 md:p-6 border border-white/20 shadow-2xl text-left">
                  <BookingWizard theme="glass-blue" />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

const statProjects = [
  {
    img: work1,
    title: "Expert AC Repair",
    client: "Jenora Havard",
    time: "2 Days",
    price: "$50",
  },
  {
    img: work2,
    title: "Residential AC Service",
    client: "Aria Mitchell",
    time: "3 Days",
    price: "$75",
  },
  {
    img: work3,
    title: "Quick AC Fix",
    client: "Liana Carter",
    time: "4 Days",
    price: "$100",
  },
];

function Statistics() {
  return (
    <section id="projects" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 text-center md:text-left">
        <Badge>OUR STATISTICS STATE</Badge>
        <h2 className="mt-6 text-4xl font-extrabold md:text-6xl">Speaks Everything</h2>
      </div>
      <div className="mt-14 flex gap-6 overflow-x-auto px-6 pb-4 lg:mx-auto lg:max-w-7xl">
        {statProjects.map(({ img, title, client, time, price }) => (
          <article
            key={title}
            className="relative min-w-[20rem] flex-1 overflow-hidden rounded-2xl md:min-w-[24rem]"
          >
            <img
              src={img}
              alt={title}
              width={900}
              height={1100}
              loading="lazy"
              className="h-[34rem] w-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-background p-6 shadow-md">
              <h3 className="text-2xl font-extrabold text-ink">{title}</h3>
              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm font-medium text-ink/75">
                <div className="flex justify-between">
                  <span className="text-ink/50">Client:</span>
                  <span>{client}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/50">Time:</span>
                  <span>{time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/50">Price:</span>
                  <span className="text-brand font-bold">{price}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-12 text-center">
        <a
          href="/contact"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-4 text-base font-semibold text-brand-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          More Projects <ArrowRight className="size-4" />
        </a>
      </div>
    </section>
  );
}

const steps = [
  { n: "01", title: "Request Service", text: "Submit service request easily through our platform" },
  { n: "02", title: "Schedule Technician", text: "Choose a convenient time for our expert visit" },
  { n: "03", title: "Diagnose Issue", text: "Technician accurately identifies the AC problem" },
  { n: "04", title: "Repair And Test", text: "We repair the system and test performance" },
];

function Process() {
  return (
    <section className="bg-[oklch(0.972_0.014_250)] py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2">
        <ScrollReveal>
          <ol className="relative border-l border-brand/25 pl-8">
            {steps.map(({ n, title, text }) => (
              <li key={n} className="relative pb-12 last:pb-0">
                <span className="absolute -left-[2.28rem] top-2 grid size-4 place-items-center rounded-full border-2 border-brand bg-background">
                  <span className="size-1.5 rounded-full bg-brand" />
                </span>
                <p className="text-sm font-bold tracking-[0.08em] text-brand uppercase">Step – {n}</p>
                <h3 className="mt-2 text-3xl font-extrabold md:text-4xl">{title}</h3>
                <p className="mt-2 text-lg text-ink/60">{text}</p>
              </li>
            ))}
          </ol>
        </ScrollReveal>

        <ScrollReveal delayMs={100} className="lg:pl-6">
          <Badge tone="white">HOW WE WORK</Badge>
          <h2 className="mt-6 text-4xl leading-tight font-extrabold md:text-6xl">
            Our Working Process
          </h2>
          <img
            src={processImg}
            alt="Technician cleaning an air conditioner filter"
            width={1000}
            height={800}
            loading="lazy"
            className="mt-10 w-full rounded-2xl object-cover shadow-lg"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="bg-background px-6 py-16">
      <ScrollReveal>
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl isolate px-6 py-20 sm:py-28 text-center bg-surface border border-border/50 shadow-xl">
          {/* Animated Flowing Cool Stripes Background */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-y-0 -left-6 w-[calc(100%+120px)] h-full cool-stripes-pattern animate-cool-stripes opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_10%,white_0%,transparent_60%)] dark:bg-[radial-gradient(120%_80%_at_50%_10%,rgba(15,23,42,0.6)_0%,transparent_60%)]" />
          </div>

          <img
            src={cta2}
            alt="Technician cleaning an AC filter"
            width={600}
            height={600}
            loading="lazy"
            className="absolute bottom-10 left-6 hidden size-56 blob-shape border-4 border-background object-cover shadow-lg lg:block z-0"
          />
          <img
            src={cta1}
            alt="Smiling AC service technician"
            width={600}
            height={600}
            loading="lazy"
            className="absolute top-10 right-6 hidden size-56 blob-shape border-4 border-background object-cover shadow-lg lg:block z-0"
          />

          <div className="relative z-10 mx-auto max-w-3xl">
            <Badge tone="white">COMFORT RESTORED</Badge>
            <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl md:text-6xl">
              Ready to Upgrade Your Cooling System?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-ink/75 sm:text-lg">
              Get 90-minute rapid arrival, transparent pricing, and 100% genuine spare parts for your home or business.
            </p>
            
            {/* 3 Prominent Home Page Action Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-wrap justify-center items-center gap-4">
              <Link
                to="/book"
                className="flex items-center gap-2 rounded-2xl bg-brand px-8 py-4 text-base font-black uppercase tracking-wider text-brand-foreground shadow-2xl shadow-brand/40 transition-all hover:scale-105 hover:bg-brand/90"
              >
                <Calendar className="size-5" />
                <span>Book a service</span>
              </Link>
              <a
                href={`https://wa.me/${EGS_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello EGS INDIA! I would like to schedule an AC inspection or upgrade.")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("home_bottom_cta")}
                className="flex items-center gap-2 rounded-2xl bg-[#25D366] px-8 py-4 text-base font-black uppercase tracking-wider text-white shadow-xl shadow-[#25D366]/30 transition-all hover:scale-105 hover:bg-[#20ba59]"
              >
                <WhatsAppIcon className="size-5 fill-current" />
                <span>WhatsApp us</span>
              </a>
              <a
                href={`tel:${EGS_CALL_NUMBER}`}
                onClick={() => trackCallClick("home_bottom_cta")}
                className="flex items-center gap-2 rounded-2xl border-2 border-border bg-background px-8 py-4 text-base font-black uppercase tracking-wider text-ink shadow-md transition-all hover:scale-105 hover:bg-surface"
              >
                <Phone className="size-5 text-brand" />
                <span>Call now</span>
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! Your service request has been submitted.");
    setFormData({ name: "", email: "", phone: "", service: "", message: "" });
  };

  return (
    <section id="contact" className="bg-[#1888ff] py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="inline-block rounded-md bg-white/20 px-3 py-1.5 text-xs font-bold tracking-[0.08em] uppercase text-white shadow-sm backdrop-blur-md">
            GET IN TOUCH
          </span>
          <h2 className="mt-6 text-4xl font-extrabold md:text-5xl uppercase tracking-tight">CONTACT US NOW</h2>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          {/* FAQ Accordion */}
          <div className="flex flex-col gap-4 mt-2">
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-4">
              <AccordionItem value="item-1" className="border-none rounded-xl bg-white/10 px-6 backdrop-blur-sm data-[state=open]:bg-white/20 transition-colors">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline text-white">Company Info</AccordionTrigger>
                <AccordionContent className="text-white/85 leading-relaxed pb-6 text-base">
                  Expert Goods and Services provides top-tier HVAC solutions and professional air conditioning repairs, ensuring maximum comfort and energy efficiency for both residential and commercial properties.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-none rounded-xl bg-white/10 px-6 backdrop-blur-sm data-[state=open]:bg-white/20 transition-colors">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline text-white">Technical Support</AccordionTrigger>
                <AccordionContent className="text-white/85 leading-relaxed pb-6 text-base">
                  Our certified technical support team is available around the clock to troubleshoot issues, guide you through emergency fixes, and dispatch mechanics immediately if on-site repair is required.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-none rounded-xl bg-white/10 px-6 backdrop-blur-sm data-[state=open]:bg-white/20 transition-colors">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline text-white">Maintenance</AccordionTrigger>
                <AccordionContent className="text-white/85 leading-relaxed pb-6 text-base">
                  Routine maintenance extends the lifespan of your cooling system. We offer seasonal cleaning, filter replacements, and comprehensive check-ups to prevent breakdowns.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-none rounded-xl bg-white/10 px-6 backdrop-blur-sm data-[state=open]:bg-white/20 transition-colors">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline text-white">Consultation</AccordionTrigger>
                <AccordionContent className="text-white/85 leading-relaxed pb-6 text-base">
                  Not sure which AC unit fits your space? We provide free consultations and estimates to help you choose the most cost-effective and powerful HVAC solution.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-none rounded-xl bg-white/10 px-6 backdrop-blur-sm data-[state=open]:bg-white/20 transition-colors">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline text-white">Others</AccordionTrigger>
                <AccordionContent className="text-white/85 leading-relaxed pb-6 text-base">
                  Have a unique requirement or want to partner with us? Drop us a message, and our management team will get back to you promptly with tailored solutions.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Form */}
          <div className="rounded-2xl bg-background p-5 sm:p-8 md:p-10 shadow-2xl text-ink">
            <h3 className="text-xl md:text-2xl font-extrabold mb-8 text-ink">Fill The Form Below</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Name"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-base sm:text-sm outline-none transition-colors focus:border-[#1888ff]"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-base sm:text-sm outline-none transition-colors focus:border-[#1888ff]"
                />
              </div>
              <div>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-base sm:text-sm outline-none transition-colors focus:border-[#1888ff]"
                />
              </div>
              <div>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-base sm:text-sm outline-none transition-colors focus:border-[#1888ff] text-ink/80"
                >
                  <option value="" disabled>Choose Options</option>
                  <option value="climate-fix">Climate Fix</option>
                  <option value="cooling-experts">Cooling Experts</option>
                  <option value="ac-cleaning">AC Cleaning</option>
                  <option value="hvac-service">HVAC Service</option>
                </select>
              </div>
              <div>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Message"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-base sm:text-sm outline-none transition-colors focus:border-[#1888ff] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#1888ff] py-4 text-center text-base font-semibold text-white shadow-md transition-opacity hover:opacity-90 cursor-pointer mt-2 active:scale-98"
              >
                Make An Appointment
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

const posts = [
  {
    img: blog1,
    title: "Quick and Reliable AC Repair  Technicians",
    text: "Air conditioning maintenance checklist that helps keep your AC",
    read: "3 Min Read",
  },
  {
    img: blog2,
    title: "Deep Air Conditioner Cleaning Service",
    text: "Scheduled servicing, priority support, performance checks",
    read: "4 Min Read",
  },
];

function Blog() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Badge>READ OUR INSIGHTS</Badge>
        <h2 className="mt-6 text-4xl font-extrabold md:text-6xl">Latest Blog &amp; News</h2>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {posts.map(({ img, title, text, read }) => (
            <article
              key={title}
              className="flex gap-6 rounded-2xl border border-border p-4 md:p-5"
            >
              <img
                src={img}
                alt={title}
                width={700}
                height={700}
                loading="lazy"
                className="hidden h-56 w-56 shrink-0 rounded-xl object-cover sm:block"
              />
              <div className="flex flex-1 flex-col justify-center py-2">
                <h3 className="text-2xl font-extrabold">{title}</h3>
                <p className="mt-3 text-ink/60">{text}</p>
                <hr className="my-6 border-border" />
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-ink/60">
                    <Clock className="size-5" /> {read}
                  </span>
                  <a href="/contact" className="flex items-center gap-2 font-medium">
                    Read Now <ArrowRight className="size-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-4 text-base font-semibold text-brand-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            Read More Blogs <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

const REGIONAL_BRANCHES_DATA = [
  {
    city: "Kollam",
    tag: "Headquarters",
    isHQ: true,
    coverage: "Kollam City, Karunagappally, Kottarakkara, Paravur & surrounding areas",
  },
  {
    city: "Thiruvananthapuram",
    tag: "Capital Regional Hub",
    isHQ: false,
    coverage: "Trivandrum City, Technopark, Kazhakkoottam, Kovalam & Neyyattinkara",
  },
  {
    city: "Ernakulam (Cochin)",
    tag: "Metro Commercial Hub",
    isHQ: false,
    coverage: "Kochi City, Kakkanad, InfoPark, Aluva, Tripunithura & Edapally",
  },
  {
    city: "Thrissur",
    tag: "Cultural Capital Hub",
    isHQ: false,
    coverage: "Thrissur Town, Ollur, Ayyanthole, Mannuthy, Guruvayur & Chalakudy",
  },
  {
    city: "Alappuzha",
    tag: "Coastal Service Hub",
    isHQ: false,
    coverage: "Alappuzha Town, Cherthala, Ambalappuzha, Kayamkulam & Haripad",
  },
  {
    city: "Kottayam",
    tag: "Central Travancore Hub",
    isHQ: false,
    coverage: "Kottayam Town, Kanjikuzhy, Changanassery, Pala & Ettumanoor",
  },
  {
    city: "Kozhikode",
    tag: "Malabar Regional Hub",
    isHQ: false,
    coverage: "Calicut City, Mavoor Road, Cyberpark, Palayam, Kallai & Feroke",
  },
  {
    city: "Bangalore",
    tag: "Karnataka Commercial Hub",
    isHQ: false,
    coverage: "HSR Layout, Koramangala, Indiranagar, Whitefield & Electronic City",
  },
  {
    city: "Chennai",
    tag: "Tamil Nadu Regional Hub",
    isHQ: false,
    coverage: "Chennai Metro, Anna Nagar, T Nagar, OMR Tech Corridor & Velachery",
  },
];

function RegionalHubsDirectory() {
  return (
    <section className="bg-surface/50 py-20 sm:py-24 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto">
            <Badge>REGIONAL HUBS &amp; RAPID DISPATCH</Badge>
            <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-ink">
              Regional Service Hubs &amp; Coverage
            </h2>
            <p className="mt-4 text-sm sm:text-base text-ink/70 leading-relaxed">
              Fast 90-minute technician dispatch from verified EGS INDIA service hubs across Kerala, Karnataka, and Tamil Nadu. Book online or call our centralized helpline.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REGIONAL_BRANCHES_DATA.map((branch, idx) => (
            <ScrollReveal key={branch.city} delayMs={idx * 50} className="h-full">
              <div
                className={`rounded-3xl border p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-xl bg-card h-full ${
                  branch.isHQ
                    ? "border-brand/40 shadow-md ring-1 ring-brand/20"
                    : "border-border hover:border-brand/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="text-xl font-extrabold text-foreground tracking-tight">
                      {branch.city}
                    </h3>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        branch.isHQ
                          ? "bg-brand text-brand-foreground"
                          : "bg-brand-soft text-brand"
                      }`}
                    >
                      {branch.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600">
                      ⚡ 90-Min Rapid Dispatch
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      Verified Mechanics
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed font-medium mb-6">
                    {branch.coverage}
                  </p>
                </div>

                <div className="mt-auto space-y-3.5 pt-4 border-t border-border/70">
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={`tel:${EGS_CALL_NUMBER}`}
                      onClick={() => trackCallClick(`hub_${branch.city.toLowerCase()}`)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-bold text-foreground hover:border-brand hover:text-brand hover:bg-brand-soft/40 transition-colors shadow-xs"
                      title="Central Helpline"
                    >
                      <Phone className="size-3 text-brand" />
                      <span>+91 98956 88833</span>
                    </a>

                    <a
                      href={`https://wa.me/${EGS_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        `Hello EGS INDIA! I need AC service in ${branch.city}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackWhatsAppClick(`hub_${branch.city.toLowerCase()}`)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 px-3 py-1.5 text-xs font-bold text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                      title="WhatsApp Desk"
                    >
                      <WhatsAppIcon className="size-3 fill-current" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[11px] text-muted-foreground font-medium">
                      Doorstep Service Available
                    </span>

                    <Link
                      to="/book"
                      className="inline-flex items-center gap-1 font-bold text-brand hover:underline"
                    >
                      <span>Book Service</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delayMs={100}>
          <div className="mt-10 sm:mt-12 text-center">
            <Link
              to="/service-areas"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand hover:underline"
            >
              <span>Explore all detailed coverage areas, landmarks &amp; response times across South India</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function Index() {
  return (
    <main className="bg-background">
      <Navbar />
      <Hero />
      <QuickActionBar />
      <Marquee />
      <About />
      <Services />
      <BookOnlineSection />
      <Process />
      <RegionalHubsDirectory />
      <CallToAction />
      <Footer />
    </main>
  );
}
