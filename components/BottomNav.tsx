"use client";
import React from "react";
import { Home, QrCode, FileText, User } from "lucide-react";

interface BottomNavProps {
  activeTab: "inicio" | "reportar" | "historial" | "perfil";
  onTabChange: (tab: "inicio" | "reportar" | "historial" | "perfil") => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="w-full bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around shrink-0 z-20">
      <button
        type="button"
        onClick={() => onTabChange("inicio")}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition cursor-pointer ${
          activeTab === "inicio" ? "text-[#0D47A1] font-bold" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <Home className="w-4 h-4" />
        <span className="text-[10px]">Inicio</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("reportar")}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition cursor-pointer ${
          activeTab === "reportar" ? "text-[#0D47A1] font-bold" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <div className="relative">
          <QrCode className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
        </div>
        <span className="text-[10px]">Reportar</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("historial")}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition cursor-pointer ${
          activeTab === "historial" ? "text-[#0D47A1] font-bold" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <FileText className="w-4 h-4" />
        <span className="text-[10px]">Historial</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("perfil")}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition cursor-pointer ${
          activeTab === "perfil" ? "text-[#0D47A1] font-bold" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <User className="w-4 h-4" />
        <span className="text-[10px]">Perfil</span>
      </button>
    </nav>
  );
}