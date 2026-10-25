import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! Your message has been sent.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const locations = [
    {
      title: "Kollam",
      address: "KMC/46/322, First Floor, VT Tower, Nr District Hospital, Hospital Road, Kollam-691001",
      phone: "9895688833, 04742950513",
      email: "info@egsindia.in"
    },
    {
      title: "Thiruvananthapuram",
      address: "Mahesh Estates, TC 29/4590 CV Raman Pillai Road, Vazhuthacaud Trivandrum, Kerala, 695014",
      phone: "04714248080, 8589035555",
      email: "info@egsindia.in"
    },
    {
      title: "Ernakulam",
      address: "Second Floor, Pukalakkatt Building Changampuzha Park, Metro Pillar No. 465, Near Changampuzha Metro Station Edapally, Elamakkara PO, Cochin- 26, Kerala, 682026",
      phone: "8589935555, 04844010280",
      email: "info@egsindia.in"
    },
    {
      title: "Thrissur",
      address: "17/81/15 A Tower Calvary Junction Poothole Road Poothole, Thrissur Kerala 680004",
      phone: "9995997755, 8943571111",
      email: "info@egsindia.in"
    },
    {
      title: "Chennai",
      address: "Periyamet, Chennai, Tamil Nadu 600003",
      phone: "9895887755, 9061555444",
      email: "info@egsindia.in"
    }
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
                <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-bold text-[#1888ff] mb-4">
                    {loc.title}
                  </h4>
                  <p className="text-sm text-ink/70 leading-relaxed font-medium mb-6">
                    {loc.address}
                  </p>
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                        <svg className="size-4 text-[#1888ff]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </div>
                      <p className="text-sm font-semibold text-ink">{loc.phone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                        <svg className="size-4 text-[#1888ff]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      </div>
                      <p className="text-sm font-semibold text-ink">{loc.email}</p>
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
