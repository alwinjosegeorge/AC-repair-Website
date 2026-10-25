import { createFileRoute } from "@tanstack/react-router";
import { ServiceLandingTemplate } from "@/components/ServiceLandingTemplate";

export const Route = createFileRoute("/services/commercial-hvac")({
  head: () => ({
    meta: [
      { title: "Commercial HVAC, VRV & VRF Solutions | EGS INDIA" },
      {
        name: "description",
        content:
          "Enterprise HVAC contractor in Kerala & Chennai. Engineering, installation, maintenance & AMC for VRV/VRF systems, ductable split ACs, chillers, and server rooms.",
      },
      { property: "og:title", content: "Commercial HVAC, VRV & VRF Solutions | EGS INDIA" },
      {
        property: "og:description",
        content:
          "B2B HVAC solutions for offices, hospitals, retail, and hotels with guaranteed 2-hour SLA response.",
      },
    ],
  }),
  component: CommercialHVACPage,
});

function CommercialHVACPage() {
  return (
    <ServiceLandingTemplate
      category="commercial-hvac"
      serviceTitle="Commercial HVAC & VRV Solutions"
      badgeText="B2B & Enterprise HVAC • 2-Hour SLA"
      headline="Industrial & Commercial HVAC Systems, VRV / VRF & AMC"
      subheadline="Engineered climate solutions for commercial offices, hospitals, hotels, and retail showrooms. End-to-end design, installation, duct cleaning, and mission-critical 2-hour breakdown SLAs."
      startingPrice="Custom Quote"
      packages={[
        {
          name: "Commercial Diagnostic & Health Audit",
          price: "₹1,499",
          originalPrice: "₹2,500",
          badge: "Full Facility Audit",
          popular: true,
          features: [
            "Complete VRV / VRF error code diagnostic with service checker",
            "Ductable AC air velocity and CFM volume testing",
            "Compressor oil acidity and moisture analysis",
            "AHU belt tension, bearing and coil inspection",
            "Detailed engineering report with ROI recommendations",
            "Fee adjusted against contract work",
          ],
        },
        {
          name: "Ductable AC & Cassette Deep Wash",
          price: "₹1,299",
          originalPrice: "₹1,999",
          badge: "Per Unit",
          features: [
            "Ceiling cassette body and drain pump chemical flush",
            "Duct supply & return air grill sanitization",
            "Outdoor condensing unit power jet wash",
            "Condensate lift pump float switch testing",
            "Static pressure and duct leak inspection",
            "After-hours or weekend service without business disruption",
          ],
        },
        {
          name: "Enterprise Commercial AMC Contract",
          price: "Custom",
          badge: "Guaranteed SLA",
          features: [
            "2-Hour emergency response SLA for mission-critical facilities",
            "Monthly / Bi-monthly scheduled preventive maintenance",
            "Server room precision AC 24/7 backup monitoring",
            "Dedicated certified chiller & VRF senior engineers",
            "Monthly digital logbooks & energy optimization tracking",
            "Discounted OEM spare parts supply agreement",
          ],
        },
      ]}
      includedItems={[
        "Certified HVAC engineers experienced in Daikin VRV, Mitsubishi Electric City Multi, Blue Star & Voltas",
        "Digital service checker diagnostic tool connection to central control boards",
        "Air volume CFM testing, psychrometric temperature, and humidity balancing",
        "Duct and plenum cleaning to maintain indoor air quality (IAQ)",
        "Motor greasing, v-belt alignment, and electrical panel thermal imaging",
        "Detailed engineering reports suitable for corporate audits and ISO standards",
      ]}
      excludedItems={[
        "Duct fabrication and sheet metal manufacturing (quoted separately per sq.ft)",
        "Civil structural modifications and crane lifting charges",
        "Water treatment chemical procurement for cooling towers",
      ]}
      processSteps={[
        {
          title: "Technical Site Survey",
          desc: "Our senior HVAC engineer conducts on-site load calculation, duct inspection, and equipment audit.",
        },
        {
          title: "Custom Proposal & SLA",
          desc: "We deliver a comprehensive scope of work, transparent itemized pricing, and defined response times.",
        },
        {
          title: "Off-Hours Execution",
          desc: "Work is scheduled after office hours or over weekends to ensure zero interruption to your business.",
        },
        {
          title: "Commissioning & Logbooks",
          desc: "Full performance sign-off, digital compliance reports, and regular proactive health checks.",
        },
      ]}
      faqs={[
        {
          question: "Can you service our HVAC systems without disrupting office operations?",
          answer:
            "Yes! We regularly execute commercial servicing, coil washing, and preventative maintenance on weekends or night shifts (after 7 PM) so your daily workplace operations continue uninterrupted.",
        },
        {
          question: "What brands of VRV / VRF systems do you service?",
          answer:
            "Our technicians are factory-trained on Daikin VRV, Mitsubishi Electric City Multi, Blue Star VRF, LG Multi V, Voltas, Carrier, and Hitachi central cooling systems.",
        },
        {
          question: "Do you offer emergency response agreements for Server Rooms?",
          answer:
            "Yes. We offer customized 24/7 SLAs with a guaranteed 2-hour on-site arrival window for server rooms, data centers, and critical hospital diagnostic facilities.",
        },
      ]}
      reviews={[
        {
          name: "Kalyan Tech Park Facility Manager",
          city: "Ernakulam",
          rating: 5,
          comment:
            "EGS manages the 120 HP VRV system across our 4-floor IT office in InfoPark. Their proactive monthly maintenance has eliminated unexpected breakdowns during working hours. Outstanding technical competence.",
          date: "1 week ago",
        },
        {
          name: "Sujatha Residency Hotel",
          city: "Kollam",
          rating: 5,
          comment:
            "Serviced all 24 ceiling cassette ACs and central chillers before tourist season. Prompt, professional team equipped with advanced high-pressure equipment.",
          date: "2 weeks ago",
        },
        {
          name: "Grand Mall Facilities",
          city: "Thrissur",
          rating: 5,
          comment:
            "Resolved a persistent low suction pressure error on our 30 Ton ductable unit that two previous vendors failed to diagnose. Highly skilled engineers.",
          date: "3 weeks ago",
        },
      ]}
    />
  );
}
