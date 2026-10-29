import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  CheckCircle,
  Clock,
  Compass,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  Shield,
  Target,
  Wrench,
  Headphones,
  Users,
  Briefcase,
  Building2,
  Cpu,
  Layers,
  ChevronRight,
} from "lucide-react";
import commercialAcPlant from "@/assets/commercial-ac-plant.jpg";
import amalBhPhoto from "@/assets/amal-bh.jpg";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { EGS_CALL_NUMBER, EGS_WHATSAPP_NUMBER } from "@/lib/store";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  const REGIONAL_HUBS = [
    { city: "Kollam (HQ)", state: "Kerala", tag: "Headquarters" },
    { city: "Thiruvananthapuram", state: "Kerala", tag: "Capital Hub" },
    { city: "Ernakulam (Kochi)", state: "Kerala", tag: "Commercial Metro" },
    { city: "Thrissur", state: "Kerala", tag: "Cultural Capital" },
    { city: "Alappuzha", state: "Kerala", tag: "Coastal Hub" },
    { city: "Kottayam", state: "Kerala", tag: "Central Travancore" },
    { city: "Kozhikode", state: "Kerala", tag: "Malabar Hub" },
    { city: "Bangalore", state: "Karnataka", tag: "Tech Commercial" },
    { city: "Chennai", state: "Tamil Nadu", tag: "Regional Office" },
  ];

  const LEADERSHIP_PILLARS = [
    {
      role: "Executive Management & Strategy",
      tag: "Founding Direction",
      desc: "Championing customer-first integrity, disciplined corporate values, and pioneering organized HVAC service delivery standards across South India since 2015.",
      icon: Briefcase,
    },
    {
      role: "HVAC Engineering & Technical Projects",
      tag: "Engineering Excellence",
      desc: "Guiding large-scale VRF/VRV implementations, commercial ductable deployments, central chiller maintenance, and strict adherence to ISHRAE/ASHRAE protocols.",
      icon: Cpu,
    },
    {
      role: "Regional Operations & Fleet Dispatch",
      tag: "Service Delivery",
      desc: "Overseeing rapid 90-minute mobile technician units, ensuring genuine manufacturer spares inventory, and guaranteeing prompt same-day service resolution.",
      icon: Users,
    },
    {
      role: "Quality Assurance & Client Governance",
      tag: "Customer Success",
      desc: "Managing transparent upfront estimates, 30-day post-service warranty compliance, and dedicated enterprise account management for domestic and corporate clients.",
      icon: Shield,
    },
  ];

  return (
    <main className="bg-background min-h-screen text-foreground font-sans">
      <Navbar />

      {/* Hero / About Us Story Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-block rounded-full bg-brand-soft px-3.5 py-1 text-xs font-black tracking-wider uppercase text-brand">
              ESTABLISHED 2015 • KOLLAM, KERALA
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink leading-tight">
              About Expert Goods & Services
            </h1>

            {/* Official Story Copy from Client */}
            <div className="space-y-4 text-base sm:text-lg text-ink/80 leading-relaxed font-normal">
              <p>
                <strong className="font-bold text-ink">Expert Goods and Services</strong> was initially established in 2015 as a home appliances sales and repair service provider to cater to Corporate, Government and domestic clients. Our expertise in the field has been unmatched during the years. We have implemented much needed change in Repair and Services in Kollam in an effective and professional manner by providing highly skilled technicians.
              </p>
              <p>
                <strong className="font-bold text-ink">Expert Goods and Services HVAC division</strong> was formally launched in 2018 having been assigned a separate identity from its parent organization. We are specialized in design, supply, erection, commissioning and maintenance of sophisticated HVAC systems including VRF and central air conditioning plant projects. We have a team of talented and qualified Engineers to cater to our customer’s specific requirements. We take pride in having cutting-edge equipment to meet any installation or repair need for all major brands. Contact us today for same-day service.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/book"
                className="rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 transition-all flex items-center gap-2"
              >
                <span>Book a Service</span>
                <ArrowRight className="size-4" />
              </Link>
              <a
                href={`tel:${EGS_CALL_NUMBER}`}
                className="rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-bold text-foreground shadow-xs hover:border-brand/40 transition-colors flex items-center gap-2"
              >
                <Phone className="size-4 text-brand" />
                <span>+91 98956 88833</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl bg-card">
              <img
                src={commercialAcPlant}
                alt="Expert Goods and Services Commercial AC Plant & Chillers"
                className="w-full h-[380px] sm:h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] font-black uppercase tracking-wider bg-brand px-2.5 py-1 rounded-md">
                  HVAC Specialists
                </span>
                <p className="mt-2 text-lg font-bold leading-snug">
                  Certified Engineers for Residential, Corporate & Industrial HVAC
                </p>
              </div>
            </div>

            {/* Quick Floating Stat Pill */}
            <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-card rounded-2xl p-4 shadow-xl border border-border flex items-center gap-3.5 max-w-xs">
              <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600">
                <CheckCircle className="size-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">100% Verified Techs</p>
                <p className="text-xs text-muted-foreground">Certified diagnostics & factory-grade tools.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-surface/50 border-y border-border py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block rounded-full bg-brand-soft px-3.5 py-1 text-xs font-black tracking-wider uppercase text-brand">
              GUIDING PRINCIPLES
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-ink">
              Our Mission & Vision
            </h2>
            <p className="mt-3 text-base text-ink/70">
              The core commitments that power every service visit, installation project, and engineering deployment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* MISSION CARD */}
            <div className="relative rounded-3xl border border-brand/30 bg-card p-8 sm:p-10 shadow-sm flex flex-col justify-between transition-all hover:shadow-xl hover:border-brand">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="size-14 rounded-2xl bg-brand text-brand-foreground flex items-center justify-center shadow-md">
                    <Target className="size-7" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-brand-soft text-brand">
                    MISSION
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Our Mission
                </h3>

                <p className="text-base sm:text-lg text-ink/80 leading-relaxed font-normal">
                  With the power of Expert’s team of talented people, we aim to provide customers with superb value, high quality, products and services. Our Innovative and Super-fast solutions are designed to increase customer satisfaction levels. By bringing in new ideas and fresh talent we aim to become the most successful establishment in the country that specializes in HVAC.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-border flex items-center gap-2 text-xs font-bold text-brand">
                <Compass className="size-4" />
                <span>Superb Value • High Quality • Super-Fast Solutions</span>
              </div>
            </div>

            {/* VISION CARD */}
            <div className="relative rounded-3xl border border-brand/30 bg-card p-8 sm:p-10 shadow-sm flex flex-col justify-between transition-all hover:shadow-xl hover:border-brand">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="size-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md">
                    <Lightbulb className="size-7" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-sky-500/10 text-sky-600">
                    VISION
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Our Vision
                </h3>

                <blockquote className="space-y-3">
                  <p className="text-lg sm:text-xl font-bold text-brand italic">
                    “Challenge is the path to success”
                  </p>
                  <p className="text-base sm:text-lg text-ink/80 leading-relaxed font-normal">
                    Our vision is delivering happiness to customers, employees and vendor Companies by being the company that promises to introduce fresh changes and provide unmatched customer satisfaction levels. And through that change we are confident in creating a network of satisfied and comfortable customers.
                  </p>
                </blockquote>
              </div>

              <div className="pt-6 mt-6 border-t border-border flex items-center gap-2 text-xs font-bold text-sky-600">
                <CheckCircle className="size-4" />
                <span>Delivering Happiness • Unmatched Customer Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <span className="inline-block rounded-full bg-brand-soft px-3.5 py-1 text-xs font-black tracking-wider uppercase text-brand">
              EXECUTIVE GOVERNANCE
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-ink">
              Leadership &amp; Management
            </h2>
            <p className="mt-3 text-base text-ink/70 leading-relaxed">
              Guided by founding vision and multidisciplinary HVAC engineering mastery across South India.
            </p>
          </div>

          {/* Founder & Managing Director Executive Feature Card */}
          <div className="mb-12 sm:mb-16 rounded-3xl border border-brand/25 bg-gradient-to-br from-card via-card to-brand-soft/20 p-6 sm:p-10 md:p-12 shadow-xl">
            <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
              {/* Photo Column */}
              <div className="md:col-span-5 lg:col-span-4 flex justify-center">
                <div className="relative group max-w-[280px] sm:max-w-[320px] w-full">
                  <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-brand to-sky-400 opacity-25 blur-lg group-hover:opacity-40 transition-opacity duration-300" />
                  <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-brand/30 bg-card shadow-2xl">
                    <img
                      src={amalBhPhoto}
                      alt="Amal B H - Founder & Managing Director, Expert Goods & Services"
                      className="w-full aspect-[3/4] object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-brand px-2.5 py-1 rounded-md inline-block shadow-sm">
                        Founding Leader
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio & Leadership Profile Column */}
              <div className="md:col-span-7 lg:col-span-8 space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-black text-brand tracking-wider uppercase">
                  <Award className="size-3.5" />
                  <span>FOUNDER &amp; MANAGING DIRECTOR</span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                    Amal B H
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-brand mt-1">
                    Founder &amp; Managing Director • Expert Goods &amp; Services
                  </p>
                </div>

                <blockquote className="border-l-4 border-brand pl-4 py-1 italic text-base sm:text-lg text-ink/85 font-medium leading-relaxed">
                  “Since establishing Expert Goods and Services in 2015, our mission has been clear: delivering genuine value, high quality, and super-fast HVAC solutions with unmatched customer trust.”
                </blockquote>

                <p className="text-sm sm:text-base text-ink/75 leading-relaxed">
                  Under the leadership of Amal B H, EGS INDIA has grown from an innovative home appliance repair provider in Kollam into a leading South Indian HVAC engineering enterprise. With specialized focus on VRF systems, central cooling plants, and rapid doorstep domestic service, his vision continues to set new benchmarks for professional HVAC care.
                </p>

                {/* Key Executive Highlights */}
                <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-border/70 text-xs">
                  <div className="p-3 rounded-xl bg-surface/70 border border-border">
                    <div className="font-black text-brand text-base sm:text-lg">2015</div>
                    <div className="text-muted-foreground text-[11px] font-medium">Founded EGS INDIA</div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface/70 border border-border">
                    <div className="font-black text-brand text-base sm:text-lg">15+ Years</div>
                    <div className="text-muted-foreground text-[11px] font-medium">Industry Excellence</div>
                  </div>
                  <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-surface/70 border border-border">
                    <div className="font-black text-brand text-base sm:text-lg">Pan-South India</div>
                    <div className="text-muted-foreground text-[11px] font-medium">9 Regional Hubs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEADERSHIP_PILLARS.map((pillar, idx) => (
              <div
                key={pillar.role}
                className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-brand/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="size-12 rounded-2xl bg-brand-soft text-brand flex items-center justify-center mb-5">
                    <pillar.icon className="size-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block mb-1.5">
                    {pillar.tag}
                  </span>
                  <h3 className="text-lg font-extrabold text-foreground tracking-tight mb-3">
                    {pillar.role}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-border/70 flex items-center gap-1.5 text-xs font-bold text-brand">
                  <span>Standard of Practice</span>
                  <ChevronRight className="size-3.5" />
                </div>
              </div>
            ))}
          </div>

          {/* Growth Milestones Timeline */}
          <div className="mt-16 rounded-3xl border border-border bg-surface/50 p-8 sm:p-12">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-black uppercase tracking-wider text-brand">MILESTONES</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-2">
                Our Evolution Over The Years
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="space-y-3">
                <span className="text-3xl sm:text-4xl font-black text-brand">2015</span>
                <h4 className="text-base font-bold text-foreground">Inception in Kollam</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Established as a premier home appliances sales & repair service provider catering to corporate, government, and domestic clients across Kollam.
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-3xl sm:text-4xl font-black text-brand">2018</span>
                <h4 className="text-base font-bold text-foreground">Dedicated HVAC Division</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Launched formal HVAC division specializing in design, supply, erection, commissioning & maintenance of VRF and central air conditioning plants.
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-3xl sm:text-4xl font-black text-brand">Today</span>
                <h4 className="text-base font-bold text-foreground">South India Regional Network</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Expanding mobile fleet across 9 major service hubs in Kerala, Karnataka, and Tamil Nadu with guaranteed 24-hr dispatch and central helpline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Service Hubs Grid */}
      <section className="py-20 sm:py-24 bg-surface/50 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block rounded-full bg-brand-soft px-3.5 py-1 text-xs font-black tracking-wider uppercase text-brand">
            REGIONAL FOOTPRINT
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
            Our Active Service Network
          </h2>
          <p className="mt-3 text-sm sm:text-base text-ink/70 max-w-2xl mx-auto">
            Stationed across major commercial centers with certified HVAC engineers ready for on-demand dispatch.
          </p>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
            {REGIONAL_HUBS.map((hub) => (
              <div
                key={hub.city}
                className="rounded-2xl border border-border bg-card p-5 text-left shadow-xs hover:border-brand/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-sky-400">📍</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand bg-brand-soft px-2 py-0.5 rounded-full">
                    {hub.tag}
                  </span>
                </div>
                <h4 className="font-extrabold text-foreground text-sm sm:text-base">
                  {hub.city}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">{hub.state}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/service-areas"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand hover:underline"
            >
              <span>Explore all localities and coverage pincodes</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Support & Direct Helpdesk */}
      <section className="py-16 sm:py-20 bg-background border-t border-border">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-brand/20 bg-gradient-to-br from-brand/5 via-card to-card p-8 sm:p-12 text-center space-y-6">
            <span className="rounded-full bg-brand-soft px-3.5 py-1 text-xs font-black uppercase tracking-wider text-brand">
              CENTRAL HELPLINE &amp; WHATSAPP
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-foreground">
              Ready to Partner with EGS INDIA?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Whether you need routine home AC servicing, comprehensive AMC, or complex commercial VRF installation, our engineering desks are available 7 days a week.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href={`tel:${EGS_CALL_NUMBER}`}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-black text-brand-foreground shadow hover:opacity-95"
              >
                <Phone className="size-4" />
                <span>Call +91 98956 88833</span>
              </a>

              <a
                href={`https://wa.me/${EGS_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  "Hello EGS INDIA! I would like to inquire about your HVAC services."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-black text-white shadow hover:bg-[#20ba59]"
              >
                <WhatsAppIcon className="size-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-bold text-foreground hover:border-brand/40"
              >
                <Mail className="size-4 text-brand" />
                <span>Send a Message</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
