import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Building2, MapPin, Sparkles, PhoneCall, ArrowRight } from "lucide-react";
import { EGS_CLIENTS, ClientItem } from "../data/clients";

export function RecentWorksBanner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-blue-200/80 dark:border-blue-900/40 bg-gradient-to-br from-[#ebf5ff] via-[#f4f9ff] to-[#e1effe] dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 p-6 sm:p-10 md:p-12 shadow-xl ${className}`}
    >
      {/* Cool stripes background pattern */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40 cool-stripes-pattern" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Technician working on AC filter */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 opacity-20 blur-lg transition duration-500 group-hover:opacity-40" />
            <img
              src="/clients/recent-works-tech.png"
              alt="EGS INDIA HVAC technician cleaning AC unit filter"
              width={430}
              height={320}
              loading="lazy"
              className="relative rounded-2xl border-4 border-white dark:border-slate-800 shadow-2xl object-cover max-w-full sm:max-w-[420px] transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Right: Copy & Actions */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1888ff]/15 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1888ff]">
            <Sparkles className="size-3.5" />
            <span>Demonstrated Excellence</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink tracking-tight leading-tight">
            View Our Recent Works
          </h2>

          <p className="text-base sm:text-lg text-ink/75 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Our projects highlight completed installations, repair work, and upgrades demonstrating our commitment to quality service.
          </p>

          <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1888ff] hover:bg-[#1577de] px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <span>Get In Touch</span>
              <ChevronRight className="size-4" />
            </Link>

            <Link
              to="/book"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-white dark:bg-card px-7 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-ink hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <PhoneCall className="size-4 text-brand" />
              <span>Book AC Service</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ClientsShowcaseProps {
  showBanner?: boolean;
  limit?: number;
  showFilters?: boolean;
  title?: string;
  subtitle?: string;
}

export function ClientsShowcase({
  showBanner = true,
  limit,
  showFilters = true,
  title = "Our Prestigious Clients",
  subtitle = "Trusted by Kerala & South India's leading hospitals, hotels, airports, government institutions, and retail establishments.",
}: ClientsShowcaseProps) {
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const cities = ["All", "Kollam", "Cochin", "Thrissur", "Trivandrum"];
  const categories = [
    "All",
    "Government & PSU",
    "Hospitality",
    "Healthcare",
    "Retail & Corporate",
    "Education",
  ];

  const filteredClients = EGS_CLIENTS.filter((client) => {
    const matchesCity = selectedCity === "All" || client.city === selectedCity;
    const matchesCategory = selectedCategory === "All" || client.category === selectedCategory;
    return matchesCity && matchesCategory;
  });

  const displayedClients = limit ? filteredClients.slice(0, limit) : filteredClients;

  return (
    <div className="space-y-12">
      {/* Optional Recent Works Banner */}
      {showBanner && <RecentWorksBanner />}

      {/* Header & Section Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
          <Building2 className="size-3.5" />
          <span>PROVEN CLIENT PORTFOLIO</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink tracking-tight">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-ink/70 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Interactive Filters (if enabled) */}
      {showFilters && (
        <div className="space-y-4">
          {/* City / Location Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold text-ink/50 uppercase tracking-wider mr-1 flex items-center gap-1">
              <MapPin className="size-3.5" /> Location:
            </span>
            {cities.map((city) => {
              const count =
                city === "All"
                  ? EGS_CLIENTS.length
                  : EGS_CLIENTS.filter((c) => c.city === city).length;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCity === city
                      ? "bg-[#38c6a0] text-white shadow-md shadow-emerald-500/20"
                      : "bg-surface border border-border text-ink/75 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {city} ({count})
                </button>
              );
            })}
          </div>

          {/* Sector Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold text-ink/50 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Building2 className="size-3.5" /> Sector:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#1888ff] text-white shadow-sm"
                    : "bg-background border border-border/60 text-ink/65 hover:text-ink hover:bg-surface"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid of Client Cards matching screenshot aesthetic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedClients.map((client: ClientItem) => (
          <article
            key={client.id}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-white dark:bg-card shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Top Logo / Building Photo Area */}
            <div className="relative flex h-36 sm:h-40 w-full items-center justify-center bg-white p-4">
              <img
                src={client.image}
                alt={client.name}
                loading="lazy"
                className="max-h-24 sm:max-h-28 max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute top-2.5 right-2.5 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-xs">
                {client.category}
              </span>
            </div>

            {/* Bottom Signature Teal/Green Bar matching screenshot */}
            <div className="bg-[#38c6a0] px-4 py-3.5 text-center text-white flex flex-col justify-center min-h-[76px] transition-colors group-hover:bg-[#2fb591]">
              <h3 className="text-xs sm:text-sm font-bold text-white leading-snug drop-shadow-xs">
                {client.name}
              </h3>
              <p className="mt-1 text-[11px] sm:text-xs italic text-white/90 font-medium tracking-wide">
                {client.city}
              </p>
            </div>
          </article>
        ))}
      </div>

      {displayedClients.length === 0 && (
        <div className="text-center py-12 bg-surface rounded-2xl border border-dashed border-border">
          <p className="text-ink/60 font-medium">No clients found matching the selected filters.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCity("All");
              setSelectedCategory("All");
            }}
            className="mt-3 text-sm font-bold text-brand hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* If limited on homepage, provide CTA to /projects */}
      {limit && EGS_CLIENTS.length > limit && (
        <div className="text-center pt-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-xl bg-brand/10 hover:bg-brand/15 text-brand px-6 py-3 text-sm font-bold transition-colors"
          >
            <span>View All 19 Major Clients &amp; MEP / HVAC Projects</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
