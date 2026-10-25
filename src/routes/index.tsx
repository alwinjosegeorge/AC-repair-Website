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
import { EGS_CALL_NUMBER, EGS_WHATSAPP_NUMBER } from "@/lib/store";
import { captureTrackingParams, trackCallClick, trackWhatsAppClick } from "@/lib/tracking";
import acUnit from "@/assets/ac-unit.png";
import acWaves from "@/assets/ac-waves.png";
import heroInline from "@/assets/hero-inline.jpg";
import aboutTech from "@/assets/about-tech.jpg";
import projectResidential from "@/assets/project-residential.jpg";
import projectCommercial from "@/assets/project-commercial.jpg";
import processImg from "@/assets/process.jpg";
import team1 from "@/assets/team-1.jpg";
import team2 from "@/assets/team-2.jpg";
import team3 from "@/assets/team-3.jpg";
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
  { name: "Team", href: "#team" },
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
    <section className="relative -mt-24 overflow-hidden cool-stripes pt-40 pb-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h1 className="text-5xl leading-[0.95] font-extrabold md:text-7xl lg:text-[5.5rem] animate-fade-in-up">
          Digital AC <span className="text-brand">Solutions</span>
          <span className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            For
            <img
              src={heroInline}
              alt="Homeowner enjoying cool air from a serviced air conditioner"
              width={640}
              height={512}
              className="h-16 w-32 rounded-xl border-4 border-background object-cover shadow-lg md:h-24 md:w-48"
            />
            Tomorrow
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-ink/65 md:text-lg animate-fade-in-up-delay-1">
          Expert AC repair and maintenance services that keep your home comfortable year-round
          technicians, guaranteed results.
        </p>
        <div className="mt-8 flex flex-wrap justify-center items-center gap-3 animate-fade-in-up-delay-2">
          <Link
            to="/book"
            className="flex items-center gap-2 rounded-2xl bg-brand px-8 py-4 text-sm font-black uppercase tracking-wider text-brand-foreground shadow-2xl shadow-brand/40 transition-all hover:scale-105 hover:bg-brand/90 hover:shadow-brand/60 ring-4 ring-brand/20 animate-pulse"
          >
            <Calendar className="size-4" />
            <span>BOOK SERVICE (90-MIN ARRIVAL)</span>
          </Link>
          <a
            href={`tel:${EGS_CALL_NUMBER}`}
            onClick={() => trackCallClick("homepage_hero")}
            className="flex items-center gap-2 rounded-2xl border border-border bg-background px-5 py-3.5 text-sm font-bold text-ink shadow-sm transition-all hover:bg-surface"
          >
            <Phone className="size-4 text-brand" />
            <span>Call +91 9895688833</span>
          </a>
          <a
            href={`https://wa.me/${EGS_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello EGS INDIA! I need assistance with AC Service/Repair.")}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("homepage_hero")}
            className="flex items-center gap-2 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 px-5 py-3.5 text-sm font-bold text-[#25D366] transition-all hover:bg-[#25D366]/20"
          >
            <MessageSquare className="size-4 fill-current" />
            <span>WhatsApp</span>
          </a>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-ink/70">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <CheckCircle2 className="size-4" /> Flat ₹499 Jet Wash
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-brand">
            <CheckCircle2 className="size-4" /> 30-Day Guarantee
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-amber-600">
            <CheckCircle2 className="size-4" /> Pay After Service
          </span>
        </div>
      </div>

      <FloatingCard
        className="top-1/2 -left-10 xl:left-6"
        rotate="-14deg"
        icon={<Recycle className="size-9 text-[oklch(0.72_0.19_150)]" strokeWidth={2.5} />}
        label="Energy Saved"
        value="50%"
      />
      <FloatingCard
        className="top-28 -right-8 xl:right-8"
        rotate="10deg"
        icon={
          <span className="grid size-10 place-items-center rounded-full bg-brand text-brand-foreground">
            <ThumbsUp className="size-5" />
          </span>
        }
        label="Happy Client's"
        value="12k+"
      />

      <div className="relative mx-auto -mb-14 mt-14 h-56 max-w-5xl px-6 md:h-80 mask-bottom-fade">
        {/* Original Animated Cool Air Waves */}
        <img
          src={acWaves}
          alt="Cool air flow blowing out of the air conditioner"
          className="absolute left-1/2 top-[36%] w-full max-w-3xl -translate-x-1/2 pointer-events-none z-0 animate-air-flow-pulse"
        />

        {/* Floating AC Unit */}
        <img
          src={acUnit}
          alt="Wall mounted split air conditioner blowing cool air"
          width={1408}
          height={912}
          className="absolute left-1/2 top-[-8%] w-full max-w-3xl drop-shadow-2xl animate-ac-float z-10"
        />
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    "Comfort Restored",
    "Reliable Cooling",
    "Perfect Comfort",
    "Get Fast & Reliable AC Service",
  ];
  return (
    <div className="relative py-14 overflow-hidden">
      {/* Background stripes that fade out at the bottom */}
      <div className="absolute inset-0 cool-stripes mask-bottom-fade -z-10" />

      {/* Foreground text that remains fully opaque */}
      <div className="flex flex-wrap items-center justify-center gap-6 px-6 text-4xl font-extrabold tracking-tight md:text-6xl">
        {items.map((t, i) => (
          <span key={t} className="flex items-center gap-6">
            <Sparkles className="size-8 text-brand/60" fill="currentColor" strokeWidth={0} />
            <span className={i % 2 === 0 ? "text-brand" : "text-ink"}>{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <Badge>KNOW ABOUT US</Badge>
          <h2 className="mt-6 text-4xl font-extrabold md:text-6xl">Get Fast &amp; Reliable AC Service</h2>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-brand p-9 text-brand-foreground">
            <span className="inline-block rounded-md bg-brand-foreground/20 px-3 py-1.5 text-xs font-bold tracking-[0.08em] uppercase">
              GET TO KNOW US
            </span>
            <h3 className="mt-7 text-3xl leading-tight font-extrabold md:text-4xl">
              Reliable Cooling Services For Homes{" "}
              <span className="text-brand-foreground/50">And Businesses</span>
            </h3>
            <p className="mt-6 text-brand-foreground/85">
              Expert AC repair and maintenance services that keep your home comfortable.
            </p>
          </div>

          <img
            src={aboutTech}
            alt="Technician in a yellow hard hat servicing AC wiring"
            width={800}
            height={1000}
            loading="lazy"
            className="h-full max-h-[26rem] w-full rounded-2xl object-cover"
          />

          <div className="grid gap-6">
            {[
              { icon: HardHat, value: "15+", label: "YEARS OF EXPERIENCE" },
              { icon: ThumbsUp, value: "2638+", label: "HAPPY CUSTOMERS" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="rounded-2xl bg-surface p-9">
                <Icon className="size-9 text-brand" strokeWidth={2} />
                <p className="mt-10 text-5xl font-extrabold">{value}</p>
                <p className="mt-3 text-sm font-bold tracking-wide text-ink/70 uppercase">
                  <span className="mr-2 text-brand">|</span>
                  {label}
                </p>
              </div>
            ))}
          </div>
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
    price: "From ₹499",
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
    <section id="services" className="bg-[oklch(0.976_0.012_250)] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <Badge tone="white">EXPERTISE YOU CAN TRUST</Badge>
            <h2 className="mt-6 text-4xl font-extrabold md:text-6xl">Our HVAC Solutions</h2>
          </div>
          <p className="text-lg leading-relaxed text-ink/60">
            Certified air conditioning and refrigeration solutions for homes, villas, corporate offices, and industrial complexes across Kerala and Tamil Nadu.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, href, price, badge, text }) => (
            <article key={title} className="flex flex-col justify-between rounded-3xl bg-background p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 border border-border/80">
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
          ))}
        </div>
      </div>
    </section>
  );
}

function BookOnlineSection() {
  return (
    <section id="book-online" className="py-20 px-4 md:px-8 bg-surface/50 border-y border-border">
      <div className="mx-auto max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <Badge>ONLINE SERVICE BOOKING</Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-foreground">
            Book AC Service in 4 Simple Steps
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Choose your service, select preferred date & slot, and get instant WhatsApp confirmation with real-time technician assignment.
          </p>
        </div>

        <BookingWizard className="mx-auto" />
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
    <section className="bg-[oklch(0.972_0.014_250)] py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2">
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

        <div className="lg:pl-6">
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
            className="mt-10 w-full rounded-2xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}

const team = [
  { img: team1, name: "Matthew Lewis", role: "Support Manager" },
  { img: team2, name: "Bipasa Sarkar", role: "HVAC Service Engineer" },
  { img: team3, name: "James Carter", role: "AC Technician" },
  { img: aboutTech, name: "Imran Hossain", role: "AC Installation Specialist" },
];

function Team() {
  return (
    <section id="team" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Badge tone="white">MEET WITH OUR TECHNICIAN</Badge>
        <h2 className="mt-6 text-4xl font-extrabold md:text-6xl">Our Skilled Team</h2>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map(({ img, name, role }) => (
            <article key={name} className="group relative overflow-hidden rounded-2xl">
              <img
                src={img}
                alt={`${name}, ${role}`}
                width={800}
                height={1000}
                loading="lazy"
                className="h-[30rem] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-5 left-5 grid size-11 place-items-center rounded-lg bg-background">
                <Plus className="size-5" />
              </span>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-6 pt-16">
                <h3 className="text-3xl font-extrabold text-background">{name}</h3>
                <p className="text-sm text-background/80">{role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="bg-background px-6 py-16">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl cool-stripes px-6 py-28 text-center">
        <img
          src={cta2}
          alt="Technician cleaning an AC filter"
          width={600}
          height={600}
          loading="lazy"
          className="absolute bottom-10 left-6 hidden size-56 blob-shape border-4 border-background object-cover lg:block"
        />
        <img
          src={cta1}
          alt="Smiling AC service technician"
          width={600}
          height={600}
          loading="lazy"
          className="absolute top-10 right-6 hidden size-56 blob-shape border-4 border-background object-cover lg:block"
        />
        <Badge tone="white">COMFORT RESTORED</Badge>
        <h2 className="mx-auto mt-8 max-w-3xl text-4xl leading-tight font-extrabold md:text-6xl">
          Ready to Upgrade Your Cooling System?
        </h2>
        <a
          href="/contact"
          className="mt-10 inline-block rounded-xl bg-background px-8 py-4 text-base font-semibold shadow-[0_18px_40px_-24px_oklch(0.2_0.06_260/0.6)] transition-transform hover:-translate-y-0.5"
        >
          Book A Schedule
        </a>
      </div>
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
          <div className="rounded-2xl bg-background p-8 md:p-10 shadow-2xl text-ink">
            <h3 className="text-xl md:text-2xl font-extrabold mb-8 text-ink">Fill The Form Below</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Name"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm outline-none transition-colors focus:border-[#1888ff]"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm outline-none transition-colors focus:border-[#1888ff]"
                />
              </div>
              <div>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm outline-none transition-colors focus:border-[#1888ff]"
                />
              </div>
              <div>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm outline-none transition-colors focus:border-[#1888ff] text-ink/80"
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
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm outline-none transition-colors focus:border-[#1888ff] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#1888ff] py-4 text-center text-base font-semibold text-white shadow-md transition-opacity hover:opacity-90 cursor-pointer mt-2"
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

function Index() {
  return (
    <main className="bg-background">
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Services />
      <BookOnlineSection />
      <Process />
      <Team />
      <CallToAction />
      <Footer />
    </main>
  );
}
