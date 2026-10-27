import { Sparkles } from "lucide-react";
import acUnit from "@/assets/ac-unit.png";
import acAirflowPng from "@/assets/ac-airflow.png";

interface CoolAirFlowProps {
  className?: string;
}

export function CoolAirFlow({ className = "" }: CoolAirFlowProps) {
  return (
    <div className={`relative mx-auto w-full max-w-4xl select-none px-2 sm:px-4 ${className}`}>
      {/* Assembly Container: Floats in physical unison */}
      <div className="relative w-full animate-ac-assembly-float">
        {/* ========================================================== */}
        {/* WALL-MOUNTED AC UNIT & AUTHENTIC AIRFLOW ASSEMBLY */}
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

          {/* User's Authentic Airflow Stream Graphic (ac.avif) perfectly aligned with the open vent flap */}
          <div className="absolute left-[8.5%] w-[83.4%] top-[79.2%] pointer-events-none z-20 overflow-visible">
            {/* Primary Breathing/Pulsing Airflow Stream */}
            <picture className="block w-full">
              <source srcSet="/ac-airflow.avif" type="image/avif" />
              <img
                src={acAirflowPng}
                alt="Cold air blowing from split air conditioner"
                className="w-full pointer-events-none animate-ac-flow select-none drop-shadow-[0_12px_24px_rgba(56,189,248,0.45)]"
              />
            </picture>

            {/* Secondary Cascading Wind Shimmer 1 */}
            <picture className="absolute inset-0 block w-full opacity-60">
              <source srcSet="/ac-airflow.avif" type="image/avif" />
              <img
                src={acAirflowPng}
                alt="Cold breeze ripple"
                className="w-full pointer-events-none animate-ac-flow-shimmer select-none"
              />
            </picture>

            {/* Staggered Cascading Wind Shimmer 2 */}
            <picture className="absolute inset-0 block w-full opacity-45">
              <source srcSet="/ac-airflow.avif" type="image/avif" />
              <img
                src={acAirflowPng}
                alt="Cold breeze continuous wave"
                className="w-full pointer-events-none animate-ac-flow-shimmer-delay select-none"
              />
            </picture>
          </div>

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
