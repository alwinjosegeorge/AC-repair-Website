import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, ChevronRight, Wrench } from "lucide-react";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("MEP");

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Modern Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-12 text-center">
        <span className="inline-block rounded-md bg-[#1888ff]/10 px-3 py-1.5 text-xs font-bold tracking-[0.08em] uppercase text-[#1888ff]">
          OUR PROJECTS
        </span>
        <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold text-ink tracking-tight">
          Engineering Excellence
        </h1>
        <p className="mt-6 text-lg text-ink/60 max-w-2xl mx-auto leading-relaxed">
          Discover our specialized divisions dedicated to delivering top-tier mechanical, electrical, plumbing, HVAC, and fire fighting solutions.
        </p>
      </section>

      {/* Main Content */}
      <section className="flex-1 w-full mx-auto max-w-7xl px-6 pb-24">
        
        {/* Modern Tabs */}
        <div className="flex justify-center gap-4 mb-16 flex-wrap">
          {["MEP", "HVAC", "Fire Fighting"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab
                  ? "bg-[#1888ff] text-white shadow-[0_8px_20px_-8px_rgba(24,136,255,0.5)]"
                  : "bg-white text-ink/70 hover:bg-slate-50 border border-slate-200 shadow-sm"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="max-w-6xl mx-auto">
          {activeTab === "MEP" && (
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center animate-fade-in-up">
              
              {/* Graphic Card */}
              <div className="rounded-3xl bg-slate-50 border border-slate-100 p-12 aspect-square max-h-[500px] flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#1888ff]/10 via-transparent to-transparent"></div>
                
                <div className="size-32 rounded-full bg-white shadow-xl flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform duration-500 border border-slate-50">
                  <Wrench className="size-16 text-[#1888ff]" />
                </div>
                
                <h3 className="text-4xl font-black text-ink relative z-10 tracking-tight">MEP Division</h3>
                
                <div className="mt-6 flex flex-wrap justify-center gap-2 relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink/60 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">Mechanical</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink/60 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">Electrical</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink/60 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">Plumbing</span>
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink leading-tight">
                  Mechanical, Electrical <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1888ff] to-[#005a9c]">& Plumbing</span>
                </h2>
                
                <div className="space-y-6 text-lg text-ink/70 leading-relaxed font-medium">
                  <p>
                    Expert started its MEP project division in 2011 with the aim to cater to all the Mechanical, Electrical and plumbing works for our customers.
                  </p>
                  <p>
                    Expert MEP has been handled with total care on giving Quality workmanship to satisfy customers total.
                  </p>
                </div>

                <div className="pt-4">
                  <a href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-[#1888ff] px-8 py-4 text-sm font-bold text-white shadow-[0_12px_24px_-8px_rgba(24,136,255,0.4)] hover:-translate-y-1 transition-all">
                    Submit Project Inquiry <ChevronRight className="size-4" />
                  </a>
                </div>
              </div>

            </div>
          )}
          
          {activeTab === "HVAC" && (
            <div className="rounded-3xl bg-slate-50 border border-slate-100 p-16 text-center shadow-sm max-w-3xl mx-auto animate-fade-in-up">
              <div className="size-20 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-6">
                <Settings className="size-10 text-ink/20" />
              </div>
              <h3 className="text-2xl font-bold text-ink mb-4">HVAC Solutions</h3>
              <p className="text-lg text-ink/60 max-w-xl mx-auto">
                HVAC project information is currently being updated. Please check back later for detailed case studies and service capabilities.
              </p>
              <a href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-6 py-3 mt-8 text-sm font-bold text-ink shadow-sm hover:bg-slate-50 transition-colors">
                Contact us for details <ChevronRight className="size-4" />
              </a>
            </div>
          )}

          {activeTab === "Fire Fighting" && (
            <div className="rounded-3xl bg-slate-50 border border-slate-100 p-16 text-center shadow-sm max-w-3xl mx-auto animate-fade-in-up">
              <div className="size-20 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-6">
                <Settings className="size-10 text-ink/20" />
              </div>
              <h3 className="text-2xl font-bold text-ink mb-4">Fire Fighting Systems</h3>
              <p className="text-lg text-ink/60 max-w-xl mx-auto">
                Fire Fighting project information is currently being updated. Please check back later for detailed case studies and service capabilities.
              </p>
              <a href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-6 py-3 mt-8 text-sm font-bold text-ink shadow-sm hover:bg-slate-50 transition-colors">
                Contact us for details <ChevronRight className="size-4" />
              </a>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
