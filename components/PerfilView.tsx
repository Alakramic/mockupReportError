"use client";
import React from "react";
import { Laptop, ShieldCheck, CheckCircle } from "lucide-react";

interface PerfilViewProps {
  onNewReport: () => void;
}

export default function PerfilView({ onNewReport }: PerfilViewProps) {
  return (
    <div className="p-5 flex flex-col gap-4 animate-fadeIn flex-1">
      {/* Student Card */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-gradient-to-tr from-[#0D47A1] to-sky-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-md">
          EV
        </div>
        <h2 className="text-base font-bold text-slate-900">Emil Vizcarra Arana</h2>
        <p className="text-xs text-slate-500 font-medium">CUI: 20000000 • Estudiante</p>
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-[#0D47A1] text-xs font-semibold rounded-full border border-sky-200">
          <Laptop className="w-3.5 h-3.5" />
          Ingeniería de Sistemas - UNSA
        </div>
      </div>

      {/* Account Info Card */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Métricas de la Cuenta</h3>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-lg font-bold text-[#0D47A1]">Activo</span>
            <p className="text-[11px] text-slate-500">Estado de cuenta</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-lg font-bold text-emerald-600">100%</span>
            <p className="text-[11px] text-slate-500">Tasa de aprobación</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Perfil institucional verificado</span>
          </div>
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
        </div>
      </div>

      <button
        onClick={onNewReport}
        className="w-full py-3.5 bg-[#0D47A1] hover:bg-blue-800 active:scale-[0.98] text-white rounded-2xl font-bold text-xs shadow-md transition cursor-pointer"
      >
        Iniciar Nuevo Reporte
      </button>
    </div>
  );
}