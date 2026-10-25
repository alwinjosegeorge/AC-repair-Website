import { createFileRoute } from "@tanstack/react-router";
import { ServiceLandingTemplate } from "@/components/ServiceLandingTemplate";

export const Route = createFileRoute("/services/ac-installation")({
  head: () => ({
    meta: [
      { title: "AC Installation, Uninstallation & Relocation | EGS INDIA" },
      {
        name: "description",
        content:
          "Professional split AC installation, copper piping, core drilling, vacuuming, and safe AC relocation in Kerala & Chennai. 60-day workmanship warranty.",
      },
      { property: "og:title", content: "AC Installation & Relocation | EGS INDIA" },
      {
        property: "og:description",
        content:
          "Zero gas loss during dismantling. Certified bracket mounting and nitrogen leak-tested installation.",
      },
    ],
  }),
  component: ACInstallationPage,
});

function ACInstallationPage() {
  return (
    <ServiceLandingTemplate
      category="ac-installation"
      serviceTitle="AC Installation & Relocation"
      badgeText="Certified Technicians • Zero Gas Loss"
      headline="Precision AC Installation, Dismantling & Shifting"
      subheadline="Ensure maximum cooling and long compressor lifespan with vibration-free bracket mounting, vacuum pump line evacuation, and proper copper flare joints."
      startingPrice="₹1,199"
      packages={[
        {
          name: "Standard Split AC Installation",
          price: "₹1,199",
          originalPrice: "₹1,699",
          badge: "Most Booked",
          popular: true,
          features: [
            "Indoor unit precision wall mounting with spirit level",
            "Single core hole drilling for piping conduit",
            "Heavy-duty outdoor bracket fitting (wall or floor)",
            "Copper pipe flare connection with torque wrench",
            "Complete system vacuuming to remove air & moisture",
            "60-Day installation workmanship warranty",
          ],
        },
        {
          name: "Safe Uninstallation / Dismantle",
          price: "₹699",
          originalPrice: "₹999",
          badge: "Zero Gas Loss",
          features: [
            "Refrigerant pump-down into compressor to save 100% gas",
            "Careful removal of indoor and outdoor units",
            "Safe coiling and tape sealing of copper pipes",
            "Outdoor bracket unmounting",
            "Wall hole sealing with white cement/compound",
            "Safe packing advice for relocation",
          ],
        },
        {
          name: "Complete Relocation Combo",
          price: "₹2,199",
          originalPrice: "₹2,899",
          badge: "Best Value",
          features: [
            "Safe uninstallation at old house with gas pump-down",
            "Complete re-installation at new house",
            "Vibration-damping rubber pads for outdoor unit",
            "Vacuum evacuation and flare joint leak test",
            "Full electrical test run and cooling calibration",
            "60-Day relocation warranty",
          ],
        },
      ]}
      includedItems={[
        "Precision spirit-level mounting of indoor backplate",
        "Outdoor unit bracket fixing with anti-vibration rubber pads",
        "Connecting indoor and outdoor units with copper pipe and wiring",
        "Mandatory vacuuming with dual-stage vacuum pump (preserves compressor)",
        "Gas release and manifold gauge pressure verification",
        "Airflow temperature test and remote control demonstration",
      ]}
      excludedItems={[
        "Extra copper piping & insulation beyond original box length (₹280 - ₹350/ft)",
        "Heavy-gauge powder coated outdoor wall bracket pair (₹750)",
        "Electrical power point / 16A MCB box wiring from DB",
        "Core cut drilling through reinforced concrete (RCC) beams",
      ]}
      processSteps={[
        {
          title: "Site & Wall Inspection",
          desc: "We select the optimal airflow position away from direct sunlight and heat sources.",
        },
        {
          title: "Level Mounting & Drilling",
          desc: "Indoor plate is anchored securely with a spirit level to ensure smooth condensate drainage.",
        },
        {
          title: "Vacuum Line Evacuation",
          desc: "We vacuum copper pipes for 15 minutes to eliminate moisture that causes copper clogging.",
        },
        {
          title: "Gas Commissioning",
          desc: "Refrigerant valves opened, pressure checked, and room temperature drop verified.",
        },
      ]}
      faqs={[
        {
          question: "Why is vacuuming necessary during AC installation?",
          answer:
            "Air and moisture trapped inside copper pipes can react with compressor POE oil to create corrosive acid, ruining the compressor in months. EGS strictly follows mandatory 15-minute vacuum pump evacuation for every installation.",
        },
        {
          question: "Will I lose gas when you uninstall my AC for shifting?",
          answer:
            "No! Our technicians use a professional 'pump down' technique that locks 100% of the refrigerant gas safely back inside the outdoor compressor before disconnecting the pipes. You won't pay for gas refills.",
        },
        {
          question: "Do you supply outdoor wall brackets?",
          answer:
            "Yes, our technicians carry heavy-duty rust-resistant powder-coated MS brackets and stainless steel (SS304) brackets for coastal areas with anti-vibration rubber bush sets.",
        },
      ]}
      reviews={[
        {
          name: "Ashwin Raj",
          city: "Kollam",
          rating: 5,
          comment:
            "Installed a new 2 Ton Daikin inverter AC. The team used a dual-stage vacuum pump and tested everything with digital gauges. Zero vibrations on the wall. Top notch workmanship!",
          date: "Yesterday",
        },
        {
          name: "Divya Nambiar",
          city: "Ernakulam",
          rating: 5,
          comment:
            "Moved our apartment from Edapally to Kakkanad. EGS handled uninstallation and reinstalling on the same day. All gas was saved as promised. Very smooth process.",
          date: "4 days ago",
        },
        {
          name: "Manoj Kumar",
          city: "Chennai",
          rating: 5,
          comment:
            "Punctual technicians with genuine tools and core drilling equipment. Cleaned up all wall dust after drilling. Deserves 5 stars!",
          date: "1 week ago",
        },
      ]}
    />
  );
}
