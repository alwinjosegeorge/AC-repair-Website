import { useState, useEffect } from "react";
import { Phone, Calendar, X } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { EGS_WHATSAPP_NUMBER, EGS_CALL_NUMBER } from "../lib/store";
import { trackCallClick, trackWhatsAppClick } from "../lib/tracking";
import { BookingWizard } from "./BookingWizard";

export function FloatingActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Don't render floating consumer actions inside admin or technician field portals
  if (
    typeof window !== "undefined" &&
    (window.location.pathname.startsWith("/control-hub") ||
      window.location.pathname.startsWith("/admin") ||
      window.location.pathname.startsWith("/technician"))
  ) {
    return null;
  }

  // Quick default WhatsApp link
  const defaultWhatsAppText = encodeURIComponent(
    "Hello EGS INDIA! I need assistance with AC Service / Repair. Please share technician availability."
  );
  const waURL = `https://wa.me/${EGS_WHATSAPP_NUMBER}?text=${defaultWhatsAppText}`;

  return (
    <>
      {/* Mobile Sticky Bottom Action Bar (always visible on small screens) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 block border-t border-border/80 bg-background/95 backdrop-blur-md p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2">
          {/* Call button */}
          <a
            href={`tel:${EGS_CALL_NUMBER}`}
            onClick={() => trackCallClick("mobile_bottom_bar")}
            className="flex flex-1 flex-col items-center justify-center rounded-xl bg-surface/90 py-2 text-foreground transition-transform active:scale-95 border border-border"
          >
            <Phone className="size-5 text-brand" />
            <span className="mt-0.5 text-[11px] font-bold">Call now</span>
          </a>

          {/* WhatsApp button */}
          <a
            href={waURL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("mobile_bottom_bar")}
            className="flex flex-1 flex-col items-center justify-center rounded-xl bg-[#25D366]/10 py-2 text-[#25D366] transition-transform active:scale-95 border border-[#25D366]/20"
          >
            <WhatsAppIcon className="size-5 fill-current" />
            <span className="mt-0.5 text-[11px] font-bold">WhatsApp us</span>
          </a>

          {/* Book Service button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex flex-[1.6] items-center justify-center gap-1.5 rounded-xl bg-brand py-3 px-3 text-brand-foreground font-black text-xs uppercase tracking-wider shadow-lg shadow-brand/40 transition-transform active:scale-95 animate-pulse"
          >
            <Calendar className="size-4 shrink-0" />
            <span>Book a service</span>
          </button>
        </div>
      </div>

      {/* Desktop Floating Actions Widget */}
      <div className="fixed bottom-8 right-8 z-50 hidden md:flex flex-col items-end gap-3">
        {/* Instant Book Service Floating Button */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-2.5 rounded-full bg-brand px-5 py-3 text-brand-foreground shadow-2xl shadow-brand/40 transition-all hover:scale-105 hover:shadow-brand/60 ring-2 ring-brand/30 animate-pulse"
        >
          <Calendar className="size-5" />
          <span className="text-xs font-black uppercase tracking-wider">Book a service</span>
        </button>

        {/* WhatsApp Floating Pill */}
        <a
          href={waURL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick("desktop_floating_pill")}
          className="group flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-2.5 text-white shadow-xl shadow-[#25D366]/30 transition-all hover:scale-105 hover:shadow-2xl"
        >
          <WhatsAppIcon className="size-4 fill-current" />
          <span className="text-xs font-bold tracking-wide">WhatsApp us</span>
        </a>

        {/* Call Floating Pill */}
        <a
          href={`tel:${EGS_CALL_NUMBER}`}
          onClick={() => trackCallClick("desktop_floating_pill")}
          className="flex items-center gap-2.5 rounded-full bg-surface border border-border px-4 py-2.5 text-foreground shadow-lg hover:border-brand/40 transition-all hover:scale-105"
        >
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <Phone className="size-4 text-brand" />
          <span className="text-xs font-bold">Call now</span>
        </a>
      </div>

      {/* Instant Booking Modal when triggered from floating action */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-2.5 sm:p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[94vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-card shadow-2xl">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-3.5 top-3.5 z-10 flex size-9 items-center justify-center rounded-full bg-surface border border-border text-foreground hover:bg-muted"
            >
              <X className="size-5" />
            </button>
            <div className="p-1 sm:p-2">
              <BookingWizard
                isModal={true}
                onSuccess={() => {
                  // Keep modal open so customer sees booking reference & WhatsApp button
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
