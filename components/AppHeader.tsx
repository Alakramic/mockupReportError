"use client";
import React from "react";
import { Laptop } from "lucide-react";

interface AppHeaderProps {
  simularFalloRed: boolean;
}

export default function AppHeader({ simularFalloRed }: AppHeaderProps) {
  return (
    <div className="w-full bg-[#0D47A1] text-white px-5 py-2.5 flex items-center justify-between shadow-md shrink-0 z-20">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
          <Laptop className="w-4 h-4 text-sky-200" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight leading-none">Alerta Averías UNSA</h1>
          <p className="text-[10px] text-sky-200 font-medium">Laboratorios EPIS - Cómputo</p>
        </div>
      </div>

      <div className="flex items-center gap-1 text-[10px] bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            simularFalloRed ? "bg-rose-400" : "bg-emerald-400 animate-pulse"
          }`}
        ></span>
        <span className="font-medium text-slate-100">
          {simularFalloRed ? "Sin Red" : "En Línea"}
        </span>
      </div>
    </div>
  );
}