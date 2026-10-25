import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  CheckCircle,
  Clock,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  Shield,
  Target,
  Wrench,
  Headphones
} from "lucide-react";

import aboutTech from "@/assets/about-tech.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

function AboutPage() {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block rounded-md bg-[#1888ff]/10 px-3 py-1.5 text-xs font-bold tracking-wider uppercase text-[#1888ff] mb-6">
            A TRADITION OF EXCELLENCE IN HVAC
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-ink">
            About Expert Goods & Services
          </h1>
          <p className="mt-6 text-lg text-ink/70 leading-relaxed">
            Bringing the most reliable climate operations to promote safety, comfort, and sustainable living for our corporate partners, commercial chains, and government properties across local and international lines.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <a href="/contact" className="rounded-xl bg-[#0047b3] px-6 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90 flex items-center gap-2">
              Our Journey <ArrowRight className="size-4" />
            </a>
            <a href="/#services" className="rounded-xl border border-border bg-white px-6 py-3 text-sm font-semibold text-ink shadow-sm hover:bg-slate-50 flex items-center gap-2">
              Explore Core Services
            </a>
          </div>
        </div>
        <div className="relative">
          <img src={aboutTech} alt="AC Technicians" className="w-full h-auto rounded-3xl object-cover shadow-2xl" />
          <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-4 animate-fade-in-up">
            <div className="rounded-full bg-[#1888ff]/10 p-3">
              <CheckCircle className="size-6 text-[#1888ff]" />
            </div>
            <div>
              <p className="font-bold text-ink">100% Certified</p>
              <p className="text-xs text-ink/60">Guaranteed standard compliance in all protocols.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-slate-50 py-24 mt-12">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink">Our Growth Story</h2>
          <p className="mt-4 text-ink/60 max-w-2xl mx-auto">
            With a vision setup from a mere individual synergy team, expanding our frontlines into a top-tier facility and climate service vendor.
          </p>
          
          <div className="mt-16 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2"></div>
            
            <div className="relative flex items-center justify-between w-full mb-12">
              <div className="w-5/12 text-right pr-8"></div>
              <div className="absolute left-1/2 -translate-x-1/2 size-4 rounded-full border-4 border-white bg-[#1888ff] shadow-sm z-10"></div>
              <div className="w-5/12 text-left pl-8">
                <span className="text-[#1888ff] font-bold text-xl">2015</span>
              </div>
            </div>

            <div className="relative flex items-center justify-between w-full mb-12">
              <div className="w-5/12 text-right pr-8">
                <h3 className="text-lg font-bold text-ink mb-2">Company Inception</h3>
                <p className="text-sm text-ink/60">Expert Goods and Services was founded as a high-quality HVAC repair division with a goal to deliver high-end climate fixes in localized territories, paving the path to an enterprise-wide scaling prospect.</p>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 size-4 rounded-full border-4 border-white bg-[#1888ff] shadow-sm z-10"></div>
              <div className="w-5/12 text-left pl-8"></div>
            </div>

            <div className="relative flex items-center justify-between w-full mb-12">
              <div className="w-5/12 text-right pr-8"></div>
              <div className="absolute left-1/2 -translate-x-1/2 size-4 rounded-full border-4 border-white bg-[#1888ff] shadow-sm z-10"></div>
              <div className="w-5/12 text-left pl-8">
                <h3 className="text-lg font-bold text-ink mb-2 flex items-center gap-3">
                  <span className="text-[#1888ff] font-bold text-xl">2018</span>
                  <span className="text-ink">HVAC Divisions Scale</span>
                </h3>
                <p className="text-sm text-ink/60">With rapidly growing success, we transitioned our focus into a comprehensive commercial and enterprise cooling service provider. We secured massive projects and built partnerships with local tech giants.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between w-full">
              <div className="w-5/12 text-right pr-8">
                <h3 className="text-lg font-bold text-ink mb-2">Leading Solutions Partner</h3>
                <p className="text-sm text-ink/60">Today, EGS functions with top-tier leadership managing over 5000+ active field personnel and over 100+ branches globally. We lead global operations and set benchmark standards for environmental safety and corporate facility mechanics.</p>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 size-4 rounded-full border-4 border-white bg-[#1888ff] shadow-sm z-10"></div>
              <div className="w-5/12 text-left pl-8">
                 <span className="text-[#1888ff] font-bold text-xl">Today</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-3xl border border-[#1888ff]/20 bg-[#1888ff]/5 p-10 shadow-sm transition-transform hover:-translate-y-1">
            <div className="size-12 rounded-xl bg-white text-[#1888ff] flex items-center justify-center shadow-sm mb-6">
              <Target className="size-6" />
            </div>
            <h3 className="text-2xl font-bold text-ink mb-4">Our Mission</h3>
            <p className="text-ink/70 leading-relaxed">
              With the prime focus on sustainable innovations, we aim to ensure the best standards and highly reliable service deliverables. We deploy continuous research and adapt to the latest technological practices to provide automated, scalable, and effective solutions. Our goal is to transform and redefine industrial service standards.
            </p>
          </div>
          <div className="rounded-3xl border border-[#1888ff]/20 bg-[#1888ff]/5 p-10 shadow-sm transition-transform hover:-translate-y-1">
            <div className="size-12 rounded-xl bg-white text-[#1888ff] flex items-center justify-center shadow-sm mb-6">
              <Lightbulb className="size-6" />
            </div>
            <h3 className="text-2xl font-bold text-ink mb-4">Our Vision</h3>
            <p className="text-ink/70 leading-relaxed">
              We imagine a future where corporate facilities are fully optimized and sustainable with zero disruption across their operational timelines. By bridging technological advancements with dedicated service teams, we envision a robust system for all modern architectures.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose EGS */}
      <section className="bg-white py-24 border-y border-border">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink">Why Industry Leaders Choose EGS</h2>
          <p className="mt-4 text-ink/60 max-w-2xl mx-auto">
            From leading tech firms to expanding commercial developers, EGS is trusted across the globe for standard delivery.
          </p>

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Award, title: "15+ Years Industry Experience", desc: "Our massive scope handled everything from conventional HVAC to next-gen integrated mechanical grids." },
              { icon: Wrench, title: "Certified HVAC Engineers", desc: "Our team involves globally recognized licensed field mechanics trained for handling all modern machinery and diagnostics." },
              { icon: Shield, title: "100% Standard AC Specials", desc: "We are proudly associated and authorized by global AC leading firms for direct service, part replacement, and tech deployment." },
              { icon: Clock, title: "Same-Day Onsite Support", desc: "Avoid total operational failure with our rapid response dispatch unit designed to resolve critical emergency scenarios." },
              { icon: Target, title: "Corporate & Commercial Plans", desc: "We provide tailored retainer and maintenance plans perfectly suited for huge enterprise chains and commercial plaza vendors." },
              { icon: CheckCircle, title: "100% Material Risk Coverage", desc: "Ensured liability with all our operations backed by maximum coverage. Any accidental damage is on us, with a 30-day money back guarantee." }
            ].map((feature, i) => (
              <div key={i} className="text-left rounded-2xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                <feature.icon className="size-8 text-[#1888ff] mb-6" strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-ink mb-3">{feature.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#0047b3] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white divide-x divide-white/20">
            <div>
              <p className="text-4xl lg:text-5xl font-extrabold mb-2">2015</p>
              <p className="text-xs font-bold tracking-widest uppercase text-white/70">ESTABLISHED</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-extrabold mb-2">1000+</p>
              <p className="text-xs font-bold tracking-widest uppercase text-white/70">ENTERPRISE CLIENTS</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-extrabold mb-2">5000+</p>
              <p className="text-xs font-bold tracking-widest uppercase text-white/70">FIELD PERSONNEL</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-extrabold mb-2">24/7</p>
              <p className="text-xs font-bold tracking-widest uppercase text-white/70">TECHNICAL SUPPORT</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Hubs */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink">Our Active Service Hubs</h2>
          <p className="mt-4 text-ink/60 max-w-2xl mx-auto">
            Operating from our global centers, we currently provide immediate dispatch across 5 major international operating zones.
          </p>
          
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {["Manhattan", "Miami", "Frankfurt", "Dubai", "Mumbai"].map((city) => (
              <div key={city} className="flex flex-col items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm py-6 px-10 min-w-[160px]">
                <MapPin className="size-6 text-[#1888ff] mb-3" />
                <h4 className="font-bold text-ink">{city}</h4>
                <p className="text-xs text-[#1888ff] font-semibold mt-1 uppercase tracking-wider">COVERED ZONE</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Channels */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink">On-Demand Contact Channels</h2>
            <p className="mt-4 text-ink/60 max-w-2xl mx-auto">
              Our service endpoints are extremely responsive. Contact your localized zones for rapid response and service dispatch scheduling.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              {[
                { title: "Global Head Office", desc: "+1 (800) 123-4567\ninfo@egs-global.com" },
                { title: "Client B2B", desc: "+1 (800) 111-2222\nb2b@egs-global.com" },
                { title: "Technical Support", desc: "+1 (800) 999-0000\nsupport@egs-global.com" },
                { title: "Partner Network", desc: "+1 (800) 888-7777\npartners@egs-global.com" },
                { title: "Command Center Dispatch", desc: "dispatch@egs-global.com" },
              ].map((contact, i) => (
                <div key={i} className="rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-center">
                  <h4 className="font-bold text-[#1888ff] mb-2">{contact.title}</h4>
                  <p className="text-sm font-semibold text-ink whitespace-pre-line leading-relaxed">{contact.desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl bg-slate-50 border border-slate-100 p-8 shadow-sm flex flex-col justify-center">
              <h3 className="text-lg font-bold text-ink mb-6">Request Support</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="size-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                    <Headphones className="size-5 text-[#1888ff]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink/50 uppercase tracking-wider">Toll-Free</p>
                    <p className="font-bold text-ink mt-1">1-800-EGS-HELP</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="size-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                    <Mail className="size-5 text-[#1888ff]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink/50 uppercase tracking-wider">Email Us</p>
                    <p className="font-bold text-ink mt-1">helpdesk@egs-global.com</p>
                  </div>
                </div>

                <a href="/contact" className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl bg-[#1888ff] py-4 text-sm font-bold text-white transition-opacity hover:opacity-90">
                  <Mail className="size-4" /> Message Us directly
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
