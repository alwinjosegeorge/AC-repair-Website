import { createFileRoute } from "@tanstack/react-router";
import { ServiceLandingTemplate } from "@/components/ServiceLandingTemplate";

export const Route = createFileRoute("/services/ac-repair")({
  head: () => ({
    meta: [
      { title: "Same-Day AC Repair & Gas Refill | EGS INDIA" },
      {
        name: "description",
        content:
          "Fast AC repair near you: not cooling, water leakage, gas leak detection, PCB board fix, and compressor replacement. 90-min express arrival.",
      },
      { property: "og:title", content: "Same-Day AC Repair & Gas Refill | EGS INDIA" },
      {
        property: "og:description",
        content:
          "Emergency AC repair services across Kerala and Chennai. Fixed diagnostic charge, 100% genuine spares.",
      },
    ],
  }),
  component: ACRepairPage,
});

function ACRepairPage() {
  return (
    <ServiceLandingTemplate
      category="ac-repair"
      serviceTitle="AC Repair & Troubleshooting"
      badgeText="Emergency Breakdown • 90-Min Response"
      headline="Instant AC Repair, Gas Refill & Troubleshooting"
      subheadline="Not cooling? Water dripping? Strange noise? Our certified technicians diagnose the root cause in minutes with genuine spares and transparent rates."
      startingPrice="₹649"
      packages={[
        {
          name: "Standard Diagnostic Check",
          price: "₹649",
          originalPrice: "₹599",
          badge: "Adjusted in Bill",
          popular: true,
          features: [
            "Complete electrical, mechanical & gas inspection",
            "Indoor unit coil and sensor diagnostic",
            "Outdoor compressor amp and capacitor test",
            "Accurate quotation before touching parts",
            "Diagnostic fee waived if repair is approved",
            "30-Day revisit warranty on all replaced parts",
          ],
        },
        {
          name: "Gas Leak Fix & Full Refill",
          price: "₹2,199",
          originalPrice: "₹2,800",
          badge: "Zero-Leak Guarantee",
          features: [
            "Nitrogen pressure leak detection test",
            "Brazing / flare nut leak rectification",
            "Vacuum pump evacuation to remove moisture",
            "100% pure R32 / R410A / R22 gas by weight",
            "Free cooling efficiency verification",
            "60-Day cooling & leak warranty",
          ],
        },
        {
          name: "Water Leakage & Drainage Block",
          price: "₹699",
          originalPrice: "₹999",
          badge: "Instant Relief",
          features: [
            "High-pressure drainage line air/water flush",
            "Internal drain tray realignment & leveling check",
            "Condensate pipe unclogging or replacement",
            "Coil defrosting & icing inspection",
            "Cleanup of indoor water spillage",
            "30-Day anti-leak warranty",
          ],
        },
      ]}
      includedItems={[
        "Comprehensive multi-point error diagnosis",
        "Clear upfront written quote before beginning any repair",
        "100% genuine OEM spare parts used with manufacturer warranty",
        "Refrigerant leak detection using soap and nitrogen pressure",
        "Safe brazing with nitrogen purging to prevent inner pipe oxidation",
        "Post-repair test run with digital temperature probes",
      ]}
      excludedItems={[
        "Cost of major spare parts (compressor, PCB, condenser coil)",
        "Civil scaffolding for heights above 2nd floor exterior",
        "Electrical main line stabilizer or breaker rewiring",
      ]}
      processSteps={[
        {
          title: "Root Cause Diagnosis",
          desc: "Technician arrives within 90 mins and tests capacitor, gas pressure, and PCB signals.",
        },
        {
          title: "Fixed Price Estimate",
          desc: "You receive an exact price quote for parts and labor before any work commences.",
        },
        {
          title: "Precision Repair",
          desc: "We fix leaks, solder connections, or replace faulty parts using authentic OEM spares.",
        },
        {
          title: "Cooling Stress Test",
          desc: "We run the AC on 18°C for 20 minutes to verify optimal cooling and power consumption.",
        },
      ]}
      faqs={[
        {
          question: "Why is my AC running but blowing warm room temperature air?",
          answer:
            "This is typically caused by a refrigerant gas leak, a faulty run capacitor, a dirty outdoor condenser preventing heat dissipation, or a locked compressor. Our diagnostic check pinpoints the exact cause in under 15 minutes.",
        },
        {
          question: "How much does AC gas refill cost?",
          answer:
            "A standard diagnostic and top-up starts from ₹1,200, while a complete vacuum, leak rectification, and full pure R32/R410A charge is ₹2,199. We always weigh the gas cylinder with a digital scale for 100% precision.",
        },
        {
          question: "Do you repair inverter AC PCBs?",
          answer:
            "Yes! Our lab engineers specialize in repairing inverter AC outdoor and indoor PCBs (Daikin, Voltas, LG, Mitsubishi, etc.), saving you up to 70% compared to buying a new PCB.",
        },
      ]}
      reviews={[
        {
          name: "Pradeep Kurup",
          city: "Thiruvananthapuram",
          rating: 5,
          comment:
            "My 1.5 ton split AC stopped cooling in peak humidity. EGS technician identified a blown capacitor and restored chilling cooling within 40 minutes. Charged exactly as quoted without extras.",
          date: "2 days ago",
        },
        {
          name: "Rehana Fathima",
          city: "Kollam",
          rating: 5,
          comment:
            "Water was pouring from the indoor unit like a tap. EGS technician cleared a dense fungal block in the drainage pipe and cleaned the tray. Very polite and efficient.",
          date: "5 days ago",
        },
        {
          name: "Rajesh Kannan",
          city: "Chennai",
          rating: 5,
          comment:
            "Other mechanics told me to replace the entire compressor for ₹12,000. EGS technician found it was only an IPM sensor failure on the PCB. Fixed it for ₹2,400 with a warranty. True lifesavers!",
          date: "1 week ago",
        },
      ]}
    />
  );
}
