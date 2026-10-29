import { useState, useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";
import { Phone, Calendar, X, Headphones } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { EGS_WHATSAPP_NUMBER, EGS_CALL_NUMBER } from "../lib/store";
import { trackCallClick, trackWhatsAppClick } from "../lib/tracking";
import { BookingWizard } from "./BookingWizard";

export function FloatingActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [showMobileBar, setShowMobileBar] = useState(!isHomePage);

  // On homepage, only show bottom navigation bar when user scrolls past the hero section
  useEffect(() => {
    if (!isHomePage) {
      setShowMobileBar(true);
      return;
    }

    const handleScroll = () => {
      // Reveal bottom bar when scrolled past hero (around 280px, entering the second section)
      const scrolledPastHero = window.scrollY > 280;
      setShowMobileBar(scrolledPastHero);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Close speed dial when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Don't render floating consumer actions inside admin or technician field portals
  const currentPath = (location?.pathname || "").toLowerCase();
  const isPortalRoute =
    currentPath.startsWith("/control-hub") ||
    currentPath.startsWith("/admin") ||
    currentPath.startsWith("/technician") ||
    (typeof window !== "undefined" &&
      (window.location.pathname.startsWith("/control-hub") ||
        window.location.pathname.startsWith("/admin") ||
        window.location.pathname.startsWith("/technician")));

  if (isPortalRoute) {
    return null;
  }

  // Quick default WhatsApp link
  const defaultWhatsAppText = encodeURIComponent(
    "Hello EGS INDIA! I need assistance with AC Service / Repair. Please share technician availability."
  );
  const waURL = `https://wa.me/${EGS_WHATSAPP_NUMBER}?text=${defaultWhatsAppText}`;

  return (
    <>
      {/* Mobile Sticky Bottom Action Bar (hidden at top of homepage, slides up upon scrolling) */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 block border-t border-border/80 bg-background/95 backdrop-blur-md p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] md:hidden transition-all duration-300 ease-in-out ${
          showMobileBar
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
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

      {/* Desktop Floating Actions Widget - Single Button with Spring-Out Speed Dial */}
      <div ref={menuRef} className="fixed bottom-6 right-6 z-40 hidden md:flex flex-col items-end">
        {/* Popped Out Action Items (Spring up when open) */}
        {isOpen && (
          <div className="flex flex-col items-end gap-2.5 mb-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
            {/* Book Action */}
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(true);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-xs font-black uppercase tracking-wider text-brand-foreground shadow-xl shadow-brand/35 transition-all hover:scale-105 hover:bg-brand/90 cursor-pointer"
            >
              <Calendar className="size-3.5" />
              <span>Book a Service</span>
            </button>

            {/* WhatsApp Action */}
            <a
              href={waURL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackWhatsAppClick("desktop_floating_dock");
                setIsOpen(false);
              }}
              className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white shadow-xl shadow-[#25D366]/30 transition-all hover:scale-105 hover:bg-[#20ba59]"
            >
              <WhatsAppIcon className="size-3.5 fill-current" />
              <span>WhatsApp Us</span>
            </a>

            {/* Call Action */}
            <a
              href={`tel:${EGS_CALL_NUMBER}`}
              onClick={() => {
                trackCallClick("desktop_floating_dock");
                setIsOpen(false);
              }}
              className="flex items-center gap-2 rounded-full border border-border bg-card/95 px-4 py-2.5 text-xs font-bold text-foreground shadow-xl backdrop-blur-md hover:border-brand/40 transition-all hover:scale-105"
            >
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <Phone className="size-3.5 text-brand" />
              <span>Call Helpline</span>
            </a>
          </div>
        )}

        {/* The Single Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-300 cursor-pointer select-none ${
            isOpen
              ? "bg-foreground text-background border-foreground px-4 py-2.5 shadow-foreground/20"
              : "bg-card/95 border-brand/30 text-foreground hover:border-brand hover:scale-105 px-4 py-2.5 shadow-brand/20"
          }`}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close quick menu" : "Open quick contact actions"}
        >
          {isOpen ? (
            <>
              <X className="size-4 text-background" />
              <span className="text-xs font-bold">Close</span>
            </>
          ) : (
            <>
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
              </span>
              <Headphones className="size-3.5 text-brand" />
              <span className="text-xs font-bold text-foreground">Quick Help</span>
            </>
          )}
        </button>
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
