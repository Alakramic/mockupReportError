"use client";
import React from "react";
import { Laptop } from "lucide-react";

interface PerfilViewProps {
  onNewReport: () => void;
}

export default function PerfilView({ onNewReport }: PerfilViewProps) {
  return (
    <div className="p-5 flex flex-col gap-4 animate-fadeIn flex-1">
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-gradient-to-tr from-[#0D47A1] to-sky-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-md">
          JP
        </div>
        <h2 className="text-base font-bold text-slate-800">Juan Pérez Quispe</h2>
        <p className="text-xs text-slate-500">CUI: 20210456 • Alumno</p>
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-[#0D47A1] text-xs font-semibold rounded-full border border-sky-200">
          <Laptop className="w-3.5 h-3.5" />
          Ingeniería de Sistemas - UNSA
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estadísticas de Reporte</h3>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-lg font-bold text-[#0D47A1]">Lab 302</span>
            <p className="text-[11px] text-slate-500">Aula más frecuente</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-lg font-bold text-emerald-600">100%</span>
            <p className="text-[11px] text-slate-500">Atención docente</p>
          </div>
        </div>
      </div>

      <button
        onClick={onNewReport}
        className="w-full py-3.5 bg-[#0D47A1] text-white rounded-2xl font-bold text-xs shadow-md hover:bg-blue-800 transition cursor-pointer"
      >
        Nuevo Reporte de Avería
      </button>
    </div>
  );
}