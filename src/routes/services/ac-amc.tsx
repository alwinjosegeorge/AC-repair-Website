import { createFileRoute } from "@tanstack/react-router";
import { ServiceLandingTemplate } from "@/components/ServiceLandingTemplate";

export const Route = createFileRoute("/services/ac-amc")({
  head: () => ({
    meta: [
      { title: "AC AMC Annual Maintenance Contracts | EGS INDIA" },
      {
        name: "description",
        content:
          "Save up to 40% on AC repair & electricity bills with EGS Annual Maintenance Contracts (AMC). Unlimited breakdown calls, 3 wet jet services, and priority technician dispatch.",
      },
      { property: "og:title", content: "AC AMC Annual Maintenance Contracts | EGS INDIA" },
      {
        property: "og:description",
        content:
          "Residential & commercial AC AMC plans across Kerala & Chennai. Protect your cooling year-round.",
      },
    ],
  }),
  component: ACAMCPage,
});

function ACAMCPage() {
  return (
    <ServiceLandingTemplate
      category="ac-amc"
      serviceTitle="Annual Maintenance Contract (AMC)"
      badgeText="Annual Savings Plan • 365 Days Peace of Mind"
      headline="Year-Round AC Protection & Maintenance Contracts"
      subheadline="Never worry about sudden summer breakdowns or surprise repair bills again. Enjoy scheduled quarterly deep jet washes, priority 60-min breakdown visits, and free labor."
      startingPrice="₹1,999/yr"
      packages={[
        {
          name: "Residential Saver AMC",
          price: "₹1,999",
          originalPrice: "₹3,200",
          badge: "Best for Homes",
          popular: true,
          features: [
            "3 Deep Power Jet wet services per year (every 4 months)",
            "Unlimited free breakdown inspection visits",
            "Zero labor charges for any repairs during contract year",
            "10-Point pre-summer comprehensive health checkup",
            "Priority same-day technician dispatch within 2 hours",
            "Dedicated WhatsApp relationship manager",
          ],
        },
        {
          name: "Comprehensive Care AMC",
          price: "₹3,499",
          originalPrice: "₹5,000",
          badge: "Full Parts & Gas Cover",
          features: [
            "Everything in Residential Saver AMC",
            "100% Free Refrigerant / Gas top-ups included",
            "Capacitor, sensor, and fan motor replacements covered",
            "PCB basic board repairs included",
            "Free chemical foam wash upgrade",
            "Full 1-year replacement warranty on all replaced spares",
          ],
        },
        {
          name: "Society / Multi-Unit Plan (3+ ACs)",
          price: "₹1,699",
          originalPrice: "₹2,800",
          badge: "Group Discount",
          features: [
            "Discounted rate per AC unit for villas & apartments",
            "Synchronized service visits for maximum convenience",
            "Dedicated technician team assigned to your premises",
            "Quarterly digital logbook & energy report",
            "20% off on all spare parts and new unit installations",
            "Immediate emergency breakdown hotline",
          ],
        },
      ]}
      includedItems={[
        "3 Scheduled deep jet power wash visits automatically tracked on calendar",
        "Unlimited emergency breakdown visit calls (zero visit fee)",
        "Priority VIP scheduling during peak hot summer months",
        "Free seasonal coil and drainage sanitization",
        "Electrical safety and ampere load monitoring",
        "Official digital AMC card & contract agreement sent via WhatsApp/Email",
      ]}
      excludedItems={[
        "Compressor replacement (covered under manufacturer warranty if applicable)",
        "Physical damage caused by lightning strike, flood, or external impact",
        "Shifting or relocation of units to a different address",
      ]}
      processSteps={[
        {
          title: "Initial Health Audit",
          desc: "We perform a thorough health audit of your AC units to baseline performance and gas pressure.",
        },
        {
          title: "Contract Issuance",
          desc: "You receive your digital AMC certificate with contract validity and scheduled service dates.",
        },
        {
          title: "Automated Reminders",
          desc: "We send automatic WhatsApp reminders every 4 months when your routine jet wash is due.",
        },
        {
          title: "Priority Breakdown Support",
          desc: "If any fault occurs, one message on WhatsApp gets a certified technician at your door.",
        },
      ]}
      faqs={[
        {
          question: "How do I schedule my 3 routine wet services?",
          answer:
            "Our automated CRM tracks your contract start date and sends you WhatsApp reminders every 4 months. You can simply pick any date and time slot that suits your schedule.",
        },
        {
          question: "What is the difference between Saver and Comprehensive AMC?",
          answer:
            "The Saver AMC covers 3 wet jet wash services plus unlimited free breakdown visits and labor (spare parts charged at actuals). The Comprehensive AMC also includes refrigerant gas top-ups, capacitors, and common spare parts free of cost.",
        },
        {
          question: "Can I transfer my AMC if I move to a new house in the same city?",
          answer:
            "Yes! You can transfer your active AMC contract to your new address within any of our operational cities without any transfer fee.",
        },
      ]}
      reviews={[
        {
          name: "Dr. Mathew Thomas",
          city: "Kollam",
          rating: 5,
          comment:
            "Enrolled 3 split ACs in EGS Comprehensive AMC last year. They serviced every 4 months like clockwork. Had one minor capacitor failure in May which was replaced free within 2 hours. Huge peace of mind!",
          date: "3 days ago",
        },
        {
          name: "Sneha Nair",
          city: "Thiruvananthapuram",
          rating: 5,
          comment:
            "The WhatsApp automated scheduling is fantastic. I didn't even have to remember when my service was due; they messaged me and arrived on time. Highly recommend the Saver plan.",
          date: "1 week ago",
        },
        {
          name: "Venkat Raman",
          city: "Chennai",
          rating: 5,
          comment:
            "Best AMC service in Chennai. Professional team, high pressure pumps, and zero hidden charges. Cut our summer electricity consumption noticeably.",
          date: "2 weeks ago",
        },
      ]}
    />
  );
}
