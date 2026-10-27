import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, ChevronRight, Wrench, ShieldCheck, Flame, Fan } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClientsShowcase } from "@/components/ClientsShowcase";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<"MEP" | "HVAC" | "Fire Fighting">("MEP");

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Modern Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 sm:pt-20 pb-10 text-center">
        <span className="inline-block rounded-full bg-[#1888ff]/10 px-3.5 py-1.5 text-xs font-bold tracking-[0.08em] uppercase text-[#1888ff]">
          OUR PROJECTS &amp; CLIENT PORTFOLIO
        </span>
        <h1 className="mt-5 text-3xl sm:text-5xl md:text-6xl font-black text-ink tracking-tight">
          Engineering Excellence &amp; Trusted Clients
        </h1>
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-ink/70 max-w-2xl mx-auto leading-relaxed">
          From international airports, hospitals, and banking institutions to luxury hotels and commercial complexes, EGS INDIA delivers certified HVAC, MEP, and cooling solutions across Kerala &amp; South India.
        </p>
      </section>

      {/* Primary Clients & Recent Works Showcase */}
      <section className="w-full mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <ClientsShowcase
          showBanner={true}
          title="Our Major Clients Across South India"
          subtitle="Explore the 19 leading institutions and commercial partners who trust EGS INDIA for precision cooling, MEP, and preventive maintenance."
          showFilters={true}
        />
      </section>

      {/* Specialized Engineering Divisions Section */}
      <section className="w-full border-t border-border/80 bg-surface/50 py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="inline-block rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand uppercase tracking-wider">
              PROJECT CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
              Specialized Engineering Divisions
            </h2>
            <p className="text-sm sm:text-base text-ink/70">
              Discover our technical capabilities across Mechanical, Electrical, Plumbing, HVAC, and Fire Fighting infrastructure.
            </p>
          </div>

          {/* Modern Division Tabs */}
          <div className="flex justify-center gap-3 sm:gap-4 mb-14 flex-wrap">
            {[
              { id: "MEP", label: "MEP Division", icon: Wrench },
              { id: "HVAC", label: "HVAC Solutions", icon: Fan },
              { id: "Fire Fighting", label: "Fire Fighting", icon: Flame },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === id
                    ? "bg-[#1888ff] text-white shadow-lg shadow-blue-500/30 scale-105"
                    : "bg-card text-ink/70 hover:bg-surface border border-border shadow-xs"
                }`}
              >
                <Icon className="size-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="max-w-5xl mx-auto">
            {activeTab === "MEP" && (
              <div className="grid lg:grid-cols-2 gap-10 items-center bg-card rounded-3xl border border-border/80 p-8 sm:p-12 shadow-md animate-fade-in-up">
                {/* Graphic Card */}
                <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border border-blue-100 dark:border-slate-700 p-8 flex flex-col items-center justify-center text-center shadow-xs">
                  <div className="size-24 rounded-2xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center mb-6 border border-blue-50 dark:border-slate-700">
                    <Wrench className="size-12 text-[#1888ff]" />
                  </div>
                  <h3 className="text-2xl font-black text-ink tracking-tight">MEP Project Division</h3>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink/70 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-border/60">
                      Mechanical
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink/70 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-border/60">
                      Electrical
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink/70 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-border/60">
                      Plumbing
                    </span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="space-y-6">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-ink leading-tight">
                    Mechanical, Electrical &amp; Plumbing Systems
                  </h3>
                  <div className="space-y-4 text-base text-ink/70 leading-relaxed">
                    <p>
                      Expert Goods and Services established its MEP project division in 2011 to cater to end-to-end mechanical, electrical, and plumbing engineering works for commercial and domestic infrastructure.
                    </p>
                    <p>
                      Every project is handled with exacting quality workmanship, certified safety standards, and reliable post-completion maintenance contracts.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#1888ff] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:scale-105 transition-all"
                    >
                      <span>Submit Project Inquiry</span>
                      <ChevronRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "HVAC" && (
              <div className="grid lg:grid-cols-2 gap-10 items-center bg-card rounded-3xl border border-border/80 p-8 sm:p-12 shadow-md animate-fade-in-up">
                <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border border-sky-100 dark:border-slate-700 p-8 flex flex-col items-center justify-center text-center shadow-xs">
                  <div className="size-24 rounded-2xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center mb-6 border border-sky-50 dark:border-slate-700">
                    <Fan className="size-12 text-[#1888ff]" />
                  </div>
                  <h3 className="text-2xl font-black text-ink tracking-tight">Central HVAC &amp; VRV/VRF</h3>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink/70 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-border/60">
                      Chillers
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink/70 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-border/60">
                      VRV / VRF
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink/70 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-border/60">
                      Air Handling (AHU)
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-ink leading-tight">
                    Centralized Air Conditioning &amp; Industrial HVAC
                  </h3>
                  <div className="space-y-4 text-base text-ink/70 leading-relaxed">
                    <p>
                      Engineered for high-capacity cooling across IT tech parks, hospitals, shopping malls, and manufacturing plants. EGS INDIA designs energy-optimized variable refrigerant flow (VRF) and centralized ducting.
                    </p>
                    <p>
                      Includes psychrometric duct balancing, digital air volume regulation, and 24/7 emergency technician dispatch.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <Link
                      to="/services/commercial-hvac"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#1888ff] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:scale-105 transition-all"
                    >
                      <span>Explore Commercial HVAC</span>
                      <ChevronRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Fire Fighting" && (
              <div className="grid lg:grid-cols-2 gap-10 items-center bg-card rounded-3xl border border-border/80 p-8 sm:p-12 shadow-md animate-fade-in-up">
                <div className="rounded-2xl bg-gradient-to-br from-red-50 to-amber-50 dark:from-slate-800 dark:to-slate-900 border border-red-100 dark:border-slate-700 p-8 flex flex-col items-center justify-center text-center shadow-xs">
                  <div className="size-24 rounded-2xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center mb-6 border border-red-50 dark:border-slate-700">
                    <Flame className="size-12 text-rose-500" />
                  </div>
                  <h3 className="text-2xl font-black text-ink tracking-tight">Fire Fighting &amp; Safety</h3>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink/70 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-border/60">
                      Sprinklers
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink/70 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-border/60">
                      Hydrants
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink/70 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-border/60">
                      Smoke Alarms
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-ink leading-tight">
                    Integrated Fire Protection &amp; Suppression
                  </h3>
                  <div className="space-y-4 text-base text-ink/70 leading-relaxed">
                    <p>
                      Comprehensive fire safety infrastructure compliance under NBC (National Building Code) standards. Automatic wet sprinkler networks, hydrants, pressure boost pumps, and smoke exhaust ventilation.
                    </p>
                    <p>
                      Certified inspection and commissioning for hotels, hospitals, and educational institutions.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 rounded-xl bg-ink text-background px-6 py-3.5 text-sm font-bold shadow-md hover:scale-105 transition-all"
                    >
                      <span>Consult Safety Team</span>
                      <ChevronRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
