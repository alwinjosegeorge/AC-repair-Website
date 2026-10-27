import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EGS_CALL_NUMBER, EGS_WHATSAPP_NUMBER } from "@/lib/store";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

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
      title: "Kollam",
      tag: "Headquarters",
      coverage: "Kollam Town, Kottarakkara, Karunagappally & surrounding areas",
    },
    {
      title: "Thiruvananthapuram",
      tag: "Capital Region Hub",
      coverage: "Trivandrum City, Technopark, Kazhakkoottam & Kovalam",
    },
    {
      title: "Ernakulam (Cochin)",
      tag: "Commercial Metro Hub",
      coverage: "Kochi City, Kakkanad, InfoPark, Aluva & Edapally",
    },
    {
      title: "Thrissur",
      tag: "Cultural Capital Hub",
      coverage: "Thrissur City, Ollur, Ayyanthole & Guruvayur Highway",
    },
    {
      title: "Alappuzha",
      tag: "Coastal Service Hub",
      coverage: "Alappuzha Town, Cherthala, Ambalappuzha & Kayamkulam",
    },
    {
      title: "Kottayam",
      tag: "Central Travancore Hub",
      coverage: "Kottayam Town, Kanjikuzhy, Changanassery & Pala",
    },
    {
      title: "Kozhikode",
      tag: "Malabar Regional Hub",
      coverage: "Calicut City, Mavoor Road, Cyberpark & Palayam",
    },
    {
      title: "Bangalore",
      tag: "Karnataka Commercial Hub",
      coverage: "HSR Layout, Koramangala, Indiranagar & Whitefield",
    },
    {
      title: "Chennai",
      tag: "Tamil Nadu Regional Hub",
      coverage: "Chennai Metro, Anna Nagar, T Nagar & OMR Corridor",
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
            <h3 className="text-2xl font-bold text-ink mb-8">Regional Service Hubs</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {locations.map((loc, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-brand">
                        {loc.title}
                      </h4>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-soft text-brand">
                        {loc.tag}
                      </span>
                    </div>
                    <p className="text-xs text-ink/75 leading-relaxed font-medium mb-5">
                      📍 {loc.coverage}
                    </p>
                  </div>

                  <div className="mt-auto space-y-3 pt-3 border-t border-slate-200/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Central Helpline Desk:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`tel:${EGS_CALL_NUMBER}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-bold text-ink hover:border-brand hover:text-brand hover:bg-brand-soft/30 transition-colors"
                      >
                        <Phone className="size-3 text-brand" />
                        <span>+91 98956 88833</span>
                      </a>

                      <a
                        href={`https://wa.me/${EGS_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          `Hello EGS INDIA! I need AC service support in ${loc.title}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 px-2.5 py-1 text-xs font-bold text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                      >
                        <WhatsAppIcon className="size-3 fill-current" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <Mail className="size-3.5 text-muted-foreground" />
                      <a href="mailto:info@egsindia.in" className="font-semibold text-brand hover:underline">
                        info@egsindia.in
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
