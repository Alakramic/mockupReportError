"use client";
import React from "react";

interface ProgressBarProps {
  currentScreen: "screen1" | "screen2" | "screen4" | "screen5";
  hasSelectedFalla: boolean;
}

export default function ProgressBar({ currentScreen, hasSelectedFalla }: ProgressBarProps) {
  const getProgressDetails = () => {
    switch (currentScreen) {
      case "screen1":
        return { stepText: "Paso 1 de 3: Identificar equipo", percent: 33, color: "bg-[#0D47A1]" };
      case "screen2":
        return hasSelectedFalla
          ? { stepText: "Paso 2 de 3: Confirmar selección", percent: 80, color: "bg-[#0D47A1]" }
          : { stepText: "Paso 2 de 3: Seleccionar avería", percent: 66, color: "bg-[#0D47A1]" };
      case "screen4":
        return { stepText: "Paso 3 de 3: Ticket generado", percent: 100, color: "bg-emerald-600" };
      case "screen5":
        return { stepText: "Recuperación de conexión", percent: 66, color: "bg-amber-500" };
    }
  };

  const { stepText, percent, color } = getProgressDetails();

  return (
    <div className="w-full bg-white px-5 pt-2.5 pb-2 border-b border-slate-200 shadow-xs shrink-0 z-10 transition-all">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-bold text-slate-700">{stepText}</span>
        <span className="text-[10px] font-semibold text-slate-400">{percent}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}