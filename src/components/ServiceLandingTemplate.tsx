import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Clock,
  Sparkles,
  Phone,
  CheckCircle2,
  XCircle,
  Star,
  ChevronRight,
  Award,
  Users,
  Wrench,
  ThumbsUp,
  Calendar,
} from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { FloatingActions } from "./FloatingActions";
import { BookingWizard } from "./BookingWizard";
import { ServiceCategory, EGS_CALL_NUMBER, EGS_WHATSAPP_NUMBER } from "../lib/store";
import { captureTrackingParams, trackCallClick, trackWhatsAppClick } from "../lib/tracking";

export interface PricingPackage {
  name: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  features: string[];
  popular?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ReviewItem {
  name: string;
  city: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ServiceLandingProps {
  category: ServiceCategory;
  serviceTitle: string;
  badgeText: string;
  headline: string;
  subheadline: string;
  startingPrice: string;
  heroImage?: string;
  packages: PricingPackage[];
  includedItems: string[];
  excludedItems: string[];
  processSteps: { title: string; desc: string }[];
  faqs: FAQItem[];
  reviews: ReviewItem[];
}

export function ServiceLandingTemplate({
  category,
  serviceTitle,
  badgeText,
  headline,
  subheadline,
  startingPrice,
  packages,
  includedItems,
  excludedItems,
  processSteps,
  faqs,
  reviews,
}: ServiceLandingProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Auto-capture UTM and ad tracking parameters when visitor arrives on this landing page
  useEffect(() => {
    captureTrackingParams();
  }, []);

  const scrollToBooking = () => {
    const el = document.getElementById("booking-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const waURL = `https://wa.me/${EGS_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello EGS INDIA! I am interested in ${serviceTitle}. Please share technician availability.`
  )}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      {/* Trust Ticker Bar - spaced cleanly below floating island Navbar */}
      <div className="mt-8 sm:mt-10 bg-brand-soft/80 border-y border-brand/20 py-2.5 px-4 text-center text-xs font-bold text-brand">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 flex-wrap">
          <span className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
            </span>
            <span>90-Minute Express Slots Available Today</span>
          </span>
          <span className="hidden sm:inline text-brand/40">•</span>
          <span className="hidden sm:flex items-center gap-1.5">
            ⭐ 4.9/5 Rating (2,850+ Customer Reviews)
          </span>
          <span className="hidden md:inline text-brand/40">•</span>
          <span className="hidden md:flex items-center gap-1.5">
            🛡️ 30-Day Post-Service Guarantee
          </span>
        </div>
      </div>

      {/* Hero Section with Embedded Fast Booking Form */}
      <section className="relative px-4 py-8 md:py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left: High-converting Copy for Google & Meta Ads */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-3.5 py-1 text-xs font-black uppercase tracking-wider text-brand">
                <Sparkles className="size-3.5" />
                <span>{badgeText}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
                {headline}
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {subheadline}
              </p>

              {/* Price Callout */}
              <div className="flex items-baseline gap-3">
                <span className="text-xs uppercase font-bold text-muted-foreground">
                  Starting at
                </span>
                <span className="text-3xl font-black text-brand">{startingPrice}</span>
                <span className="text-xs text-muted-foreground">/ per unit (Pay after service)</span>
              </div>

              {/* Action Buttons for Ads */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={scrollToBooking}
                  className="flex items-center gap-2.5 rounded-2xl bg-brand px-8 py-4 text-sm font-black uppercase tracking-wider text-brand-foreground shadow-2xl shadow-brand/40 transition-all hover:scale-105 hover:bg-brand/90 hover:shadow-brand/60 ring-4 ring-brand/20 animate-pulse"
                >
                  <Calendar className="size-4" />
                  <span>BOOK SERVICE NOW</span>
                </button>

                <a
                  href={`tel:${EGS_CALL_NUMBER}`}
                  onClick={() => trackCallClick("landing_hero")}
                  className="flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-surface"
                >
                  <Phone className="size-4 text-brand" />
                  <span>Call +91 9895688833</span>
                </a>

                <a
                  href={waURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick("landing_hero", serviceTitle)}
                  className="flex items-center gap-2 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 px-5 py-3.5 text-sm font-bold text-[#25D366] transition-colors hover:bg-[#25D366]/20"
                >
                  <WhatsAppIcon className="size-4 fill-current" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Trust Badges Row */}
              <div className="grid grid-cols-3 gap-3 border-t border-border pt-6 text-center">
                <div className="rounded-xl border border-border/80 bg-surface/50 p-2.5">
                  <Clock className="mx-auto size-5 text-brand" />
                  <span className="mt-1 block text-xs font-bold text-foreground">90 Mins</span>
                  <span className="text-[10px] text-muted-foreground">Quick Arrival</span>
                </div>
                <div className="rounded-xl border border-border/80 bg-surface/50 p-2.5">
                  <ShieldCheck className="mx-auto size-5 text-emerald-500" />
                  <span className="mt-1 block text-xs font-bold text-foreground">30 Days</span>
                  <span className="text-[10px] text-muted-foreground">Revisit Warranty</span>
                </div>
                <div className="rounded-xl border border-border/80 bg-surface/50 p-2.5">
                  <Award className="mx-auto size-5 text-amber-500" />
                  <span className="mt-1 block text-xs font-bold text-foreground">Certified</span>
                  <span className="text-[10px] text-muted-foreground">Background Checked</span>
                </div>
              </div>
            </div>

            {/* Right: Embedded Interactive Booking System */}
            <div id="booking-section" className="lg:col-span-6">
              <BookingWizard initialCategory={category} />
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Pricing Packages */}
      <section className="bg-surface/50 px-4 py-16 md:px-8 border-y border-border/60">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-black uppercase tracking-wider text-brand">
              Clear & Upfront Rates
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black text-foreground">
              Transparent Service Packages
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              No hidden charges. Exact inspection and cost breakdown shared before any work begins.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col justify-between rounded-3xl border bg-card p-6 shadow-sm transition-all hover:shadow-xl ${
                  pkg.popular
                    ? "border-brand ring-2 ring-brand/30 shadow-md"
                    : "border-border"
                }`}
              >
                {pkg.badge && (
                  <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-0.5 text-[11px] font-black text-brand-foreground shadow">
                    {pkg.badge}
                  </span>
                )}

                <div>
                  <h3 className="text-lg font-black text-foreground">{pkg.name}</h3>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-foreground">{pkg.price}</span>
                    {pkg.originalPrice && (
                      <span className="text-sm font-semibold text-muted-foreground line-through">
                        {pkg.originalPrice}
                      </span>
                    )}
                  </div>

                  <ul className="mt-6 space-y-3 text-xs sm:text-sm text-foreground/80">
                    {pkg.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-500 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={scrollToBooking}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-brand py-3.5 px-4 text-xs font-black uppercase tracking-wider text-brand-foreground shadow-md shadow-brand/20 transition-all hover:scale-[1.02] hover:bg-brand/90 hover:shadow-lg"
                  >
                    <Calendar className="size-4" />
                    <span>BOOK THIS SERVICE NOW</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included vs Excluded */}
      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              What's Included & What's Excluded
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              100% honesty in our service scope so you know exactly what to expect.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Included */}
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6">
              <div className="flex items-center gap-2 text-emerald-600 font-black text-base mb-4">
                <CheckCircle2 className="size-5" />
                <span>What Is Included</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-foreground/85">
                {includedItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="size-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Excluded */}
            <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6">
              <div className="flex items-center gap-2 text-rose-500 font-black text-base mb-4">
                <XCircle className="size-5" />
                <span>Excluded / Charged at Actuals</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-foreground/85">
                {excludedItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="size-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="bg-surface/40 px-4 py-16 md:px-8 border-y border-border">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-black uppercase tracking-wider text-brand">
              How It Works
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black text-foreground">
              Hassle-Free 4-Step Execution
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand text-brand-foreground font-black text-sm">
                  0{idx + 1}
                </span>
                <h3 className="mt-4 font-bold text-foreground text-base">{step.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews for this Service */}
      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-600">
              Verified Feedback
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black text-foreground">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {Array.from({ length: rev.rating }).map((_, r) => (
                      <Star key={r} className="size-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-foreground block">{rev.name}</span>
                    <span className="text-muted-foreground">{rev.city}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-surface/50 px-4 py-16 md:px-8 border-t border-border">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Got queries? We have answers to ensure complete peace of mind.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-bold text-foreground"
                >
                  <span>{faq.question}</span>
                  <ChevronRight
                    className={`size-4 text-muted-foreground transition-transform ${
                      activeFaq === idx ? "rotate-90 text-brand" : ""
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Conversion Banner */}
      <section className="bg-brand text-brand-foreground px-4 py-14 md:px-8 text-center">
        <div className="mx-auto max-w-4xl space-y-5">
          <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white">
            Ready For Cool Comfort?
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">
            Book Certified {serviceTitle} In 60 Seconds
          </h2>
          <p className="text-white/85 text-sm sm:text-base max-w-xl mx-auto">
            Experience prompt, professional HVAC service with fixed transparent pricing, genuine spare parts, and a 30-day post service warranty.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={scrollToBooking}
              className="flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-black uppercase tracking-wider text-brand shadow-2xl transition-all hover:scale-105 hover:bg-white/95"
            >
              <Calendar className="size-4" />
              <span>BOOK SERVICE NOW</span>
            </button>
            <a
              href={`tel:${EGS_CALL_NUMBER}`}
              className="rounded-2xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/20"
            >
              Call +91 9895688833
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
