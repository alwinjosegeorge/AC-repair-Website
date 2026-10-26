import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! Your message has been sent.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const locations = [
    {
      title: "Kollam (Headquarters)",
      address: "KMC/46/322, First Floor, VT Tower, Nr District Hospital, Hospital Road, Kollam - 691001",
      phones: [
        { label: "Mobile", number: "9895688833", formatted: "+91 98956 88833" },
        { label: "Landline", number: "04742950513", formatted: "0474 2950513" },
      ],
      email: "info@egsindia.in",
    },
    {
      title: "Thiruvananthapuram (Trivandrum)",
      address: "Mahesh Estates, TC 29/4590 CV Raman Pillai Road, Vazhuthacaud, Trivandrum, Kerala - 695014",
      phones: [
        { label: "Landline", number: "04714248080", formatted: "0471-4248080" },
        { label: "Mobile", number: "8589035555", formatted: "+91 85890 35555" },
      ],
      email: "info@egsindia.in",
    },
    {
      title: "Ernakulam (Cochin)",
      address: "Second Floor, Pukalakkatt Building Changampuzha Park, Metro Piller No. 465, Near Changampuzha Metro Station Edapally, Elamakkara PO, Cochin - 682026",
      phones: [
        { label: "Landline", number: "04844010280", formatted: "0484 4010280" },
        { label: "Mobile", number: "8589935555", formatted: "+91 85899 35555" },
      ],
      email: "info@egsindia.in",
    },
    {
      title: "Thrissur",
      address: "17/81/15 A Tower, Calvary Junction, Poothole Road, Poothole, Thrissur, Kerala - 680004",
      phones: [
        { label: "Mobile 1", number: "8943312261", formatted: "+91 89433 12261" },
        { label: "Mobile 2", number: "8943571111", formatted: "+91 89435 71111" },
        { label: "Office", number: "9995997766", formatted: "+91 99959 97766" },
      ],
      email: "info@egsindia.in",
    },
    {
      title: "Chennai",
      address: "Periyamet, Chennai, Tamil Nadu - 600003",
      phones: [
        { label: "Mobile 1", number: "9995108080", formatted: "+91 99951 08080" },
        { label: "Mobile 2", number: "9895887755", formatted: "+91 98958 87755" },
      ],
      email: "info@egsindia.in",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-16 text-center">
        <span className="inline-block rounded-md bg-[#1888ff]/10 px-3 py-1.5 text-xs font-bold tracking-[0.08em] uppercase text-[#1888ff]">
          REACH OUT TODAY
        </span>
        <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold text-ink tracking-tight">
          We're Here to Help
        </h1>
        <p className="mt-6 text-lg text-ink/60 max-w-2xl mx-auto leading-relaxed">
          Whether you need a quick repair, routine maintenance, or a massive enterprise cooling deployment, our regional hubs are ready to dispatch expert mechanics.
        </p>
      </section>

      <section className="flex-1 w-full mx-auto max-w-7xl px-6 pb-24">
        <div className="grid xl:grid-cols-5 gap-12 items-start">
          
          {/* Contact Form Column */}
          <div className="xl:col-span-2 rounded-3xl bg-white p-8 md:p-10 shadow-xl border border-slate-100">
            <h3 className="text-2xl font-bold text-ink mb-8">Send a Message</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-semibold text-ink/80 mb-2">Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-slate-50/50 px-4 py-3.5 text-sm text-ink outline-none transition-colors focus:border-[#1888ff] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink/80 mb-2">Email Address *</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-border bg-slate-50/50 px-4 py-3.5 text-sm text-ink outline-none transition-colors focus:border-[#1888ff] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink/80 mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  required
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full rounded-xl border border-border bg-slate-50/50 px-4 py-3.5 text-sm text-ink outline-none transition-colors focus:border-[#1888ff] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink/80 mb-2">Message *</label>
                <textarea
                  placeholder="Write your message here..."
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl border border-border bg-slate-50/50 px-4 py-3.5 text-sm text-ink outline-none transition-colors focus:border-[#1888ff] focus:bg-white resize-none"
                />
              </div>
              <button type="submit" className="w-full rounded-xl bg-[#1888ff] py-4 text-center text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 mt-2">
                Send Message
              </button>
            </form>
          </div>

          {/* Locations Grid Column */}
          <div className="xl:col-span-3">
            <h3 className="text-2xl font-bold text-ink mb-8">Regional Offices</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {locations.map((loc, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-brand">
                      {loc.title}
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-soft text-brand">
                      Active Hub
                    </span>
                  </div>
                  <p className="text-xs text-ink/75 leading-relaxed font-medium mb-5">
                    📍 {loc.address}
                  </p>

                  <div className="mt-auto space-y-3 pt-3 border-t border-slate-200/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Direct Helplines:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {loc.phones.map((p) => (
                        <a
                          key={p.number}
                          href={`tel:${p.number}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-bold text-ink hover:border-brand hover:text-brand hover:bg-brand-soft/30 transition-colors"
                        >
                          <Phone className="size-3 text-brand" />
                          <span>{p.formatted}</span>
                        </a>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <Mail className="size-3.5 text-muted-foreground" />
                      <a href={`mailto:${loc.email}`} className="font-semibold text-brand hover:underline">
                        {loc.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
