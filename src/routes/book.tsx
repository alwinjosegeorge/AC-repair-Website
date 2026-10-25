import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookingWizard } from "@/components/BookingWizard";
import { ShieldCheck, Clock, Phone, MessageSquare, CheckCircle2 } from "lucide-react";
import { EGS_CALL_NUMBER, EGS_WHATSAPP_NUMBER } from "@/lib/store";
import { trackCallClick, trackWhatsAppClick } from "@/lib/tracking";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book AC Service & Repair Online in 60 Seconds | EGS INDIA" },
      {
        name: "description",
        content:
          "Fast online AC service booking across Kerala & Chennai. Select your service, AC brand, date and preferred slot. Instant WhatsApp confirmation.",
      },
      { property: "og:title", content: "Book AC Service Online | EGS INDIA" },
    ],
  }),
  component: BookingPage,
});

function BookingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 relative overflow-hidden pt-28 sm:pt-32 pb-20">
        {/* Background stripes matching website hero */}
        <div className="absolute inset-0 cool-stripes mask-bottom-fade -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Title with website badges */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-3">
            <span className="inline-block rounded-full bg-brand-soft px-3.5 py-1 text-xs font-black uppercase tracking-wider text-brand">
              ONLINE SERVICE BOOKING
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              Book Certified AC Service in 5 Easy Steps
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Select your service, AC type, unit count, address, and arrival time. Get instant WhatsApp confirmation with live technician assignment.
            </p>

            {/* Trust Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="size-4" /> Flat ₹499 Jet Wash
              </span>
              <span className="text-muted-foreground/30">•</span>
              <span className="flex items-center gap-1.5 text-brand">
                <ShieldCheck className="size-4" /> 30-Day Post-Service Guarantee
              </span>
              <span className="text-muted-foreground/30">•</span>
              <span className="flex items-center gap-1.5 text-amber-600">
                <Clock className="size-4" /> Pay After Service (Zero Advance)
              </span>
            </div>
          </div>

          {/* Framer-Style Blue Banner Card with Concentric Ripple Circles & Tool Box Technician */}
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

          {/* Alternative Assistance Callout */}
          <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-center max-w-xl mx-auto shadow-sm">
            <span className="text-xs text-muted-foreground block">Prefer booking over a direct phone call or WhatsApp message?</span>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-4 font-bold text-sm">
              <a
                href={`tel:${EGS_CALL_NUMBER}`}
                onClick={() => trackCallClick("booking_page")}
                className="flex items-center gap-1.5 text-foreground hover:text-brand transition-colors"
              >
                <Phone className="size-4 text-brand" />
                Call +91 9895688833
              </a>
              <span className="text-muted-foreground/40">•</span>
              <a
                href={`https://wa.me/${EGS_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello EGS INDIA! I need assistance with booking an AC service.")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("booking_page")}
                className="flex items-center gap-1.5 text-emerald-600 hover:underline"
              >
                <MessageSquare className="size-4" />
                WhatsApp Us Directly
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
