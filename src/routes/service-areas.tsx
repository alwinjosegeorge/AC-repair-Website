import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Building,
  Navigation,
} from "lucide-react";
import { EGS_CALL_NUMBER, EGS_WHATSAPP_NUMBER } from "@/lib/store";
import { trackCallClick, trackWhatsAppClick } from "@/lib/tracking";

export const Route = createFileRoute("/service-areas")({
  head: () => ({
    meta: [
      { title: "Service Areas & Regional Hubs in Kerala & Chennai | EGS INDIA" },
      {
        name: "description",
        content:
          "EGS INDIA provides fast 90-minute AC repair, deep jet service, installation and AMC across Kollam, Thiruvananthapuram, Ernakulam (Kochi), Thrissur, and Chennai.",
      },
      { property: "og:title", content: "Service Areas & Regional Hubs | EGS INDIA" },
      {
        property: "og:description",
        content:
          "Find your nearest EGS HVAC service center. Rapid technician dispatch across Kerala and Tamil Nadu.",
      },
    ],
  }),
  component: ServiceAreasPage,
});

interface ServiceHub {
  city: string;
  state: string;
  tag: string;
  address: string;
  phones: string[];
  email: string;
  coverageAreas: string[];
  landmarks: string;
  avgResponseTime: string;
  activeTechnicians: number;
}

const SERVICE_HUBS: ServiceHub[] = [
  {
    city: "Kollam",
    state: "Kerala",
    tag: "Central Headquarters",
    address: "KMC/46/322, First Floor, VT Tower, Nr District Hospital, Hospital Road, Kollam - 691001",
    phones: ["+91 98956 88833", "0474 2950513"],
    email: "kollam@egsindia.in",
    coverageAreas: [
      "Kollam Town",
      "Asramam",
      "Chinnakkada",
      "Kadappakada",
      "Kottiyam",
      "Karunagappally",
      "Kundara",
      "Chathannoor",
      "Paravur",
      "Anchal",
    ],
    landmarks: "Near District Hospital & VT Tower",
    avgResponseTime: "60 - 90 Mins",
    activeTechnicians: 14,
  },
  {
    city: "Thiruvananthapuram",
    state: "Kerala",
    tag: "Capital Regional Hub",
    address: "Mahesh Estates, TC 29/4590, CV Raman Pillai Road, Vazhuthacaud, Trivandrum - 695014",
    phones: ["+91 85890 35555", "0471 4248080"],
    email: "trivandrum@egsindia.in",
    coverageAreas: [
      "Vazhuthacaud",
      "Kowdiar",
      "Pattom",
      "Technopark Phase 1-3",
      "Kazhakkoottam",
      "Sasthamangalam",
      "Vellayambalam",
      "Thampanoor",
      "Kariavattom",
      "Attingal",
    ],
    landmarks: "Opposite Women's College, Vazhuthacaud",
    avgResponseTime: "60 - 90 Mins",
    activeTechnicians: 18,
  },
  {
    city: "Ernakulam (Kochi)",
    state: "Kerala",
    tag: "Metro Commercial Hub",
    address: "Second Floor, Pukalakkatt Building, Metro Pillar No. 465, Near Changampuzha Metro Station, Edapally, Cochin - 682026",
    phones: ["+91 85899 35555", "0484 4010280"],
    email: "cochin@egsindia.in",
    coverageAreas: [
      "Edapally",
      "Kakkanad (InfoPark)",
      "Palarivattom",
      "Kaloor",
      "MG Road",
      "Marine Drive",
      "Aluva",
      "Tripunithura",
      "Vyttila",
      "Kalamassery",
    ],
    landmarks: "Metro Pillar 465, Changampuzha Park",
    avgResponseTime: "60 - 90 Mins",
    activeTechnicians: 22,
  },
  {
    city: "Thrissur",
    state: "Kerala",
    tag: "Cultural Capital Branch",
    address: "17/81/15, A Tower, Calvary Junction, Poothole Road, Poothole, Thrissur - 680004",
    phones: ["+91 99959 97755", "+91 89435 71111"],
    email: "thrissur@egsindia.in",
    coverageAreas: [
      "Round South & North",
      "Poothole",
      "Ayyanthole",
      "Mannuthy",
      "Ollur",
      "Puzhakkal",
      "Kuriachira",
      "Amballur",
      "Guruvayur Highway",
      "Chalakudy",
    ],
    landmarks: "Near Calvary Junction, Poothole",
    avgResponseTime: "75 - 90 Mins",
    activeTechnicians: 12,
  },
  {
    city: "Chennai",
    state: "Tamil Nadu",
    tag: "Tamil Nadu Regional Office",
    address: "No. 14, Sydenhams Road, Periyamet, Chennai, Tamil Nadu - 600003",
    phones: ["+91 98958 87755", "+91 90615 55444"],
    email: "chennai@egsindia.in",
    coverageAreas: [
      "Periyamet",
      "Anna Nagar",
      "T. Nagar",
      "OMR IT Corridor",
      "Adyar",
      "Velachery",
      "Kilpauk",
      "Egmore",
      "Nungambakkam",
      "Tambaram",
    ],
    landmarks: "Near Central Station & Nehru Stadium",
    avgResponseTime: "60 - 90 Mins",
    activeTechnicians: 16,
  },
];

function ServiceAreasPage() {
  const [selectedCity, setSelectedCity] = useState("All");

  const filteredHubs =
    selectedCity === "All"
      ? SERVICE_HUBS
      : SERVICE_HUBS.filter((h) => h.city.toLowerCase().includes(selectedCity.toLowerCase()));

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="bg-surface/50 border-b border-border px-4 py-16 md:py-20 md:px-8 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-3.5 py-1 text-xs font-black uppercase tracking-wider text-brand">
              <Navigation className="size-3.5" />
              <span>Extensive Network Across South India</span>
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
              Our Service Areas & Regional Hubs
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Fast, on-demand HVAC service dispatch. Over 80+ certified mobile technicians stationed across Kerala and Chennai for guaranteed 90-minute arrival.
            </p>

            {/* Quick Guarantees */}
            <div className="pt-4 flex flex-wrap justify-center items-center gap-6 text-xs font-bold text-foreground/80">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <Clock className="size-4" /> 90-Min Arrival Window
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-brand">
                <ShieldCheck className="size-4" /> 30-Day Revisit Guarantee
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-amber-600">
                <CheckCircle2 className="size-4" /> 7 Days a Week (8 AM - 9 PM)
              </span>
            </div>
          </div>
        </section>

        {/* City Filter Pills */}
        <section className="sticky top-20 z-20 border-b border-border bg-background/95 backdrop-blur-md px-4 py-3">
          <div className="mx-auto max-w-7xl flex items-center justify-between gap-3 overflow-x-auto">
            <span className="text-xs font-bold text-muted-foreground uppercase whitespace-nowrap">
              Select City Hub:
            </span>
            <div className="flex items-center gap-2">
              {["All", "Kollam", "Thiruvananthapuram", "Ernakulam (Kochi)", "Thrissur", "Chennai"].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`rounded-xl px-4 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCity === city
                      ? "bg-brand text-brand-foreground shadow-md"
                      : "bg-surface border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Hubs Cards Grid */}
        <section className="px-4 py-12 md:py-16 md:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {filteredHubs.map((hub) => (
                <div
                  key={hub.city}
                  className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm transition-all hover:shadow-xl hover:border-brand/40 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="rounded-md bg-brand-soft px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-brand">
                          {hub.tag}
                        </span>
                        <h2 className="mt-2 text-2xl sm:text-3xl font-black text-foreground">
                          {hub.city}, {hub.state}
                        </h2>
                      </div>
                      <div className="text-right">
                        <span className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">
                          ⚡ {hub.avgResponseTime}
                        </span>
                        <span className="block text-[11px] text-muted-foreground mt-1">
                          {hub.activeTechnicians} Active Techs On Fleet
                        </span>
                      </div>
                    </div>

                    {/* Address & Landmark */}
                    <div className="rounded-2xl border border-border bg-surface/50 p-4 space-y-2 text-xs">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="size-4 text-brand shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground block">Branch Office:</strong>
                          <p className="text-muted-foreground leading-relaxed">{hub.address}</p>
                          <span className="text-[11px] text-brand font-semibold block mt-1">
                            📍 {hub.landmarks}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Coverage Localities */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Key Localities & Pincode Coverage:
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {hub.coverageAreas.map((area) => (
                          <span
                            key={area}
                            className="rounded-lg bg-surface border border-border px-2.5 py-1 text-[11px] font-semibold text-foreground/80"
                          >
                            ✓ {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="border-t border-border pt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${hub.phones[0]}`}
                        onClick={() => trackCallClick(`service_area_${hub.city.toLowerCase()}`)}
                        className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-bold text-foreground hover:border-brand/40"
                      >
                        <Phone className="size-3.5 text-brand" />
                        <span>{hub.phones[0]}</span>
                      </a>

                      <a
                        href={`https://wa.me/${EGS_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          `Hello EGS INDIA! I need AC service in ${hub.city}. Please check technician availability.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackWhatsAppClick(`service_area_${hub.city.toLowerCase()}`)}
                        className="flex items-center gap-1.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 px-3.5 py-2 text-xs font-bold text-[#25D366] hover:bg-[#25D366]/20"
                      >
                        <MessageSquare className="size-3.5 fill-current" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    <Link
                      to="/book"
                      className="rounded-xl bg-brand px-4 py-2 text-xs font-black text-brand-foreground shadow hover:opacity-95"
                    >
                      Book in {hub.city} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Need Service Outside These Cities Banner */}
            <div className="rounded-3xl border border-brand/20 bg-brand/5 p-6 sm:p-8 text-center space-y-4">
              <span className="rounded-full bg-brand-soft px-3.5 py-1 text-xs font-black uppercase tracking-wider text-brand">
                Commercial & Industrial Projects
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-foreground">
                Looking for Central AC / VRV Installation in Other Kerala Districts?
              </h3>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
                We handle commercial HVAC deployments, chiller overhauls, and AMC contracts throughout all 14 districts of Kerala (including Kozhikode, Kannur, Kottayam, and Palakkad).
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Link
                  to="/services/commercial-hvac"
                  className="rounded-xl bg-brand px-6 py-3 text-xs font-black text-brand-foreground shadow"
                >
                  Explore Commercial HVAC →
                </Link>
                <a
                  href={`tel:${EGS_CALL_NUMBER}`}
                  className="rounded-xl border border-border bg-card px-5 py-3 text-xs font-bold text-foreground hover:bg-surface"
                >
                  Speak with Regional Manager
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
