import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { BookingWizard } from "@/components/BookingWizard";
import { ShieldCheck, Clock, Award, Phone, MessageSquare } from "lucide-react";
import { EGS_CALL_NUMBER, EGS_WHATSAPP_NUMBER } from "@/lib/store";

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

      <main className="flex-1 px-4 pt-6 pb-32 md:py-14 md:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header Title */}
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-3">
            <span className="inline-block rounded-full bg-brand-soft px-3.5 py-1 text-xs font-black uppercase tracking-wider text-brand">
              Instant Online Booking
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Book Verified HVAC Service in 4 Simple Steps
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Select your service, choose your preferred slot, and receive instant WhatsApp confirmation with real-time technician assignment.
            </p>

            {/* Quick Guarantees Pill */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-bold text-foreground/80">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <ShieldCheck className="size-4" />
                30-Day Post-Service Guarantee
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-brand">
                <Clock className="size-4" />
                Pay After Service (Zero Advance)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-amber-600">
                <Award className="size-4" />
                Free Rescheduling Anytime
              </span>
            </div>
          </div>

          {/* Booking Wizard */}
          <BookingWizard className="mx-auto max-w-3xl" />

          {/* Alternative Assistance Callout */}
          <div className="mt-10 rounded-2xl border border-border bg-surface/50 p-5 text-center max-w-xl mx-auto text-xs text-muted-foreground">
            <span>Prefer booking over a direct phone call or WhatsApp message?</span>
            <div className="mt-3 flex items-center justify-center gap-4 font-bold text-foreground">
              <a
                href={`tel:${EGS_CALL_NUMBER}`}
                className="flex items-center gap-1.5 hover:text-brand transition-colors"
              >
                <Phone className="size-3.5 text-brand" />
                Call +91 9895688833
              </a>
              <span>•</span>
              <a
                href={`https://wa.me/${EGS_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-600 hover:underline"
              >
                <MessageSquare className="size-3.5" />
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
