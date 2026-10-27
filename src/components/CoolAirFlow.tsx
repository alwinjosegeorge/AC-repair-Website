import { Sparkles } from "lucide-react";
import acUnit from "@/assets/ac-unit.png";
import acAirflowPng from "@/assets/ac-airflow.png";

interface CoolAirFlowProps {
  className?: string;
}

export function CoolAirFlow({ className = "" }: CoolAirFlowProps) {
  const isTurbo = true;

  return (
    <div className={`relative mx-auto w-full max-w-4xl select-none overflow-x-clip px-2 sm:px-4 ${className}`}>
      {/* Assembly Container: Floats in physical unison */}
      <div className="relative w-full animate-ac-assembly-float">
        {/* ========================================================== */}
        {/* COOL AIRFLOW BREEZE LAYERS (Rendered behind the unit) */}
        {/* ========================================================== */}
        <div className="absolute left-1/2 top-[46%] sm:top-[48%] -translate-x-1/2 w-full max-w-3xl pointer-events-none z-0">
          {/* 1. Vent Mouth Icy Mist Glow */}
          <div
            className={`mx-auto h-24 sm:h-32 w-[85%] rounded-[50%] bg-gradient-to-b from-sky-400/50 via-cyan-300/25 to-transparent blur-xl transition-opacity duration-700 ${
              isTurbo ? "opacity-90 animate-frost-mist" : "opacity-55"
            }`}
          />

          {/* 3. Cascading Downward Cool Wind Wave Ribbons */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[92%] h-44 overflow-visible pointer-events-none">
            <div className={`absolute inset-x-0 top-0 h-16 rounded-[40%] bg-gradient-to-b from-sky-400/35 via-cyan-400/20 to-transparent blur-md ${
              isTurbo ? "animate-breeze-ripple-1" : "opacity-40 animate-breeze-ripple-1"
            }`} />
            <div className={`absolute inset-x-0 top-0 h-20 rounded-[40%] bg-gradient-to-b from-cyan-400/30 via-sky-300/15 to-transparent blur-md ${
              isTurbo ? "animate-breeze-ripple-2" : "opacity-40 animate-breeze-ripple-2"
            }`} />
            <div className={`absolute inset-x-0 top-0 h-24 rounded-[40%] bg-gradient-to-b from-sky-300/25 via-blue-400/10 to-transparent blur-lg ${
              isTurbo ? "animate-breeze-ripple-3" : "opacity-30 animate-breeze-ripple-3"
            }`} />
          </div>

          {/* 4. Aerodynamic Vector Wind Streamlines (SVG) */}
          <svg
            className="absolute top-4 left-1/2 -translate-x-1/2 w-full h-56 sm:h-72 pointer-events-none"
            viewBox="0 0 800 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="coolWindGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#67e8f9" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#bae6fd" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="coolWindGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
              </linearGradient>

              <filter id="windBlur" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="1.5" />
              </filter>
            </defs>

            {/* Left Air Streams (Sweeping downwards and expanding outwards) */}
            <path
              d="M 190 10 Q 140 80 80 210"
              stroke="url(#coolWindGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="16 24"
              className={isTurbo ? "animate-wind-stream-fast" : "animate-wind-stream-medium"}
            />
            <path
              d="M 240 12 Q 200 90 150 220"
              stroke="url(#coolWindGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="20 28"
              className={isTurbo ? "animate-wind-stream-medium" : "animate-wind-stream-slow"}
            />
            <path
              d="M 290 15 Q 260 100 220 230"
              stroke="url(#coolWindGlow)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="14 20"
              filter="url(#windBlur)"
              className={isTurbo ? "animate-wind-stream-slow" : "animate-wind-stream-fast"}
            />

            {/* Center Air Streams (Blowing straight down with high velocity) */}
            <path
              d="M 360 18 Q 355 110 340 235"
              stroke="url(#coolWindGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="22 30"
              className={isTurbo ? "animate-wind-stream-fast" : "animate-wind-stream-medium"}
            />
            <path
              d="M 400 20 Q 400 115 400 240"
              stroke="url(#coolWindGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="26 34"
              className={isTurbo ? "animate-wind-stream-fast" : "animate-wind-stream-slow"}
            />
            <path
              d="M 440 18 Q 445 110 460 235"
              stroke="url(#coolWindGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="22 30"
              className={isTurbo ? "animate-wind-stream-medium" : "animate-wind-stream-fast"}
            />

            {/* Right Air Streams (Sweeping downwards and expanding outwards) */}
            <path
              d="M 510 15 Q 540 100 580 230"
              stroke="url(#coolWindGlow)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="14 20"
              filter="url(#windBlur)"
              className={isTurbo ? "animate-wind-stream-slow" : "animate-wind-stream-medium"}
            />
            <path
              d="M 560 12 Q 600 90 650 220"
              stroke="url(#coolWindGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="20 28"
              className={isTurbo ? "animate-wind-stream-medium" : "animate-wind-stream-slow"}
            />
            <path
              d="M 610 10 Q 660 80 720 210"
              stroke="url(#coolWindGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="16 24"
              className={isTurbo ? "animate-wind-stream-fast" : "animate-wind-stream-medium"}
            />
          </svg>

          {/* 5. Drifting Cold Air Frost Particles */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[80%] h-44 pointer-events-none">
            {/* Left Particles */}
            <span
              className="absolute left-[15%] top-2 size-2 rounded-full bg-cyan-300 shadow-md shadow-cyan-300/80 animate-particle-drift-l"
              style={{ animationDelay: "0s" }}
            />
            <span
              className="absolute left-[28%] top-6 size-1.5 rounded-full bg-sky-200 shadow-sm shadow-sky-300/80 animate-particle-drift-l"
              style={{ animationDelay: "1.2s" }}
            />
            <span
              className="absolute left-[38%] top-3 size-2.5 rounded-full bg-white/90 shadow-md shadow-cyan-400/90 animate-particle-drift-c"
              style={{ animationDelay: "0.4s" }}
            />

            {/* Center Particles */}
            <span
              className="absolute left-[48%] top-5 size-2 rounded-full bg-sky-300 shadow-md shadow-sky-400/90 animate-particle-drift-c"
              style={{ animationDelay: "1.8s" }}
            />
            <span
              className="absolute left-[54%] top-2 size-1.5 rounded-full bg-cyan-100 shadow-sm shadow-cyan-300/80 animate-particle-drift-c"
              style={{ animationDelay: "0.8s" }}
            />

            {/* Right Particles */}
            <span
              className="absolute left-[64%] top-4 size-2.5 rounded-full bg-white/90 shadow-md shadow-cyan-400/90 animate-particle-drift-r"
              style={{ animationDelay: "0.2s" }}
            />
            <span
              className="absolute left-[74%] top-6 size-2 rounded-full bg-cyan-300 shadow-md shadow-cyan-300/80 animate-particle-drift-r"
              style={{ animationDelay: "1.5s" }}
            />
            <span
              className="absolute left-[84%] top-2 size-1.5 rounded-full bg-sky-200 shadow-sm shadow-sky-300/80 animate-particle-drift-r"
              style={{ animationDelay: "2.1s" }}
            />
          </div>
        </div>

        {/* ========================================================== */}
        {/* WALL-MOUNTED AC UNIT & AIRFLOW ASSEMBLY */}
        {/* ========================================================== */}
        <div className="relative z-10 mx-auto w-full max-w-3xl">
          {/* Main Indoor AC Split Unit */}
          <img
            src={acUnit}
            alt="Wall mounted split air conditioner blowing cool air"
            width={1408}
            height={912}
            className="w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.18)] relative z-10"
          />

          {/* User's Authentic Airflow Stream Image (ac.avif) with dynamic airflow movement */}
          <div className="absolute left-1/2 top-[71%] sm:top-[72%] -translate-x-1/2 w-[84%] pointer-events-none z-20">
            {/* Primary Breathing/Pulsing Airflow Stream */}
            <picture className="block w-full">
              <source srcSet="/ac-airflow.avif" type="image/avif" />
              <img
                src={acAirflowPng}
                alt="Cold air blowing from split air conditioner"
                className="w-full pointer-events-none animate-ac-flow select-none drop-shadow-[0_12px_24px_rgba(56,189,248,0.5)]"
              />
            </picture>

            {/* Secondary Cascading Wind Shimmer */}
            <picture className="absolute inset-0 block w-full opacity-65">
              <source srcSet="/ac-airflow.avif" type="image/avif" />
              <img
                src={acAirflowPng}
                alt="Cold breeze ripple"
                className="w-full pointer-events-none animate-ac-flow-shimmer select-none"
              />
            </picture>
          </div>

          {/* Vent Backlight Cyan Glow Bar (Inside the open louver slit) */}
          <div
            className="absolute left-1/2 bottom-[14%] sm:bottom-[15%] -translate-x-1/2 w-[74%] sm:w-[76%] h-2 sm:h-2.5 rounded-full bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent blur-xs animate-vent-backlight pointer-events-none z-15"
          />

          {/* Inverter Turbo Cool Badge Tag */}
          <div className="absolute right-2 top-2 sm:right-4 sm:top-4 z-30 flex items-center gap-1 rounded-md sm:rounded-lg border border-sky-400/30 bg-white/85 dark:bg-slate-900/85 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[8px] sm:text-[10px] font-extrabold text-sky-600 dark:text-sky-400 shadow-sm backdrop-blur-xs">
            <Sparkles className="size-2.5 sm:size-3 text-sky-500 animate-pulse" />
            <span>Dual Inverter • Fast Chill</span>
          </div>
        </div>
      </div>
    </div>
  );
}
