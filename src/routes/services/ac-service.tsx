import { createFileRoute } from "@tanstack/react-router";
import { ServiceLandingTemplate } from "@/components/ServiceLandingTemplate";

export const Route = createFileRoute("/services/ac-service")({
  head: () => ({
    meta: [
      { title: "Expert AC Jet Service & Deep Cleaning | EGS INDIA" },
      {
        name: "description",
        content:
          "High-pressure jet pump AC cleaning, chemical foam wash, coil sanitization & filter disinfection in Kerala & Chennai. 90-min arrival, 30-day warranty.",
      },
      { property: "og:title", content: "Expert AC Jet Service & Deep Cleaning | EGS INDIA" },
      {
        property: "og:description",
        content:
          "Book high-pressure power jet AC cleaning. Fix weak airflow, foul smell, and cut electricity bills.",
      },
    ],
  }),
  component: ACServicePage,
});

function ACServicePage() {
  return (
    <ServiceLandingTemplate
      category="ac-service"
      serviceTitle="AC Deep Jet Service"
      badgeText="Google & Meta Ad Special • Flat ₹799"
      headline="High-Pressure Power Jet AC Service & Sanitization"
      subheadline="Restore icy cooling, boost energy efficiency, and eliminate bacteria and dust with 2X deeper high-pressure jet pump cleaning."
      startingPrice="₹799"
      packages={[
        {
          name: "Full Body AC Service",
          price: "₹799",
          originalPrice: "₹1,199",
          badge: "Most Popular",
          popular: true,
          features: [
            "Indoor cooling coil high-pressure jet wash",
            "Blower fan & drainage tray thorough flush",
            "Air filter deep chemical wash",
            "Outdoor condenser unit power jet wash",
            "Cooling gas pressure diagnostic check",
            "30-Day post-service revisit warranty",
          ],
        },
        {
          name: "Deep Chemical Foam Wash",
          price: "₹1,099",
          originalPrice: "₹1,499",
          badge: "Deep Disinfection",
          features: [
            "Everything in Full Body AC Service",
            "Specialized biodegradable foam spray on coils",
            "Foul odor & mold disinfection treatment",
            "Anti-bacterial coating on indoor louvers",
            "Electrical amp draw & voltage checkup",
            "30-Day post-service revisit warranty",
          ],
        },
        {
          name: "Dual Unit Combo Wash (2 ACs)",
          price: "₹1,499",
          originalPrice: "₹1,999",
          badge: "Save 45%",
          features: [
            "Complete Power Jet wash for 2 AC units",
            "Both indoor & outdoor units cleaned",
            "Coil & tray drainage blockage clearance",
            "Free gas pressure check for both units",
            "Single visit convenience",
            "30-Day post-service revisit warranty",
          ],
        },
      ]}
      includedItems={[
        "High-pressure jet pump wash for indoor cooling coil",
        "Outdoor unit condenser fins and fan cleaning",
        "Drainage tray and pipe flushing to prevent leaks",
        "Air filter wash and antimicrobial sanitization",
        "Refrigerant / Gas level pressure inspection",
        "Electrical wiring, capacitor, and thermostat check",
        "Post-cleaning mess cleanup with protective service jacket",
      ]}
      excludedItems={[
        "Gas top-up or full refill (charged as per required grams)",
        "Electrical spare parts replacement (capacitor, PCB, sensor)",
        "Uninstallation or relocation of indoor/outdoor units",
        "Civil work or carpentry repairs",
      ]}
      processSteps={[
        {
          title: "Pre-Service Inspection",
          desc: "Technician tests initial airflow, temperature drop, and electrical parameters.",
        },
        {
          title: "Protective Jacket Setup",
          desc: "We attach a waterproof service jacket around your AC to protect your walls & furniture.",
        },
        {
          title: "High-Pressure Jet Wash",
          desc: "High-pressure jet wash removes stubborn dirt, mold, and sludge from coils and tray.",
        },
        {
          title: "Final Performance Test",
          desc: "We measure 10-point temperature drop and hand over the 30-day warranty card.",
        },
      ]}
      faqs={[
        {
          question: "How often should I get my AC jet serviced?",
          answer:
            "In coastal and tropical climates like Kerala and Tamil Nadu, we recommend a deep jet service every 3 to 4 months to prevent dust accumulation, coil corrosion, and high electricity bills.",
        },
        {
          question: "Will the water make a mess on my walls or floor?",
          answer:
            "No. Our technicians carry specialized waterproof AC cleaning jackets with drainage pipes that channel all wastewater directly into a bucket, keeping your walls and room completely dry.",
        },
        {
          question: "What is your 30-day warranty?",
          answer:
            "If your AC experiences cooling drop, water leaking, or any service-related defect within 30 days of our service, an EGS technician will revisit and resolve it completely free of cost.",
        },
      ]}
      reviews={[
        {
          name: "Sandeep Varma",
          city: "Kollam",
          rating: 5,
          comment:
            "Amazing jet wash! My Daikin split AC was barely cooling and had a musty smell. Within 45 minutes of jet cleaning, it cools like a brand new AC. Clean work without spilling a drop on the floor.",
          date: "Yesterday",
        },
        {
          name: "Aparna Menon",
          city: "Ernakulam",
          rating: 5,
          comment:
            "Booked through Google Ad at 10 AM, technician arrived by 11:30 AM in Cochin. Very polite, verified with ID card, and explained every step. Highly recommended!",
          date: "3 days ago",
        },
        {
          name: "Ganesh Shankar",
          city: "Thiruvananthapuram",
          rating: 5,
          comment:
            "Best price in Trivandrum for deep foam wash. Both indoor and outdoor units were cleaned thoroughly with high pressure jet. Electricity bill dropped visibly.",
          date: "1 week ago",
        },
      ]}
    />
  );
}
