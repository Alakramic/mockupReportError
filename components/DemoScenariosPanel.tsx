"use client";

import React from "react";
import {
  Sparkles,
  Play,
  RotateCcw,
  WifiOff,
  AlertTriangle,
  QrCode,
  Keyboard,
  Monitor,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  heuristic: string;
  badge: string;
  badgeColor: string;
  action: () => void;
}

interface DemoScenariosPanelProps {
  onRunScenario1: () => void;
  onRunScenario2: () => void;
  onRunScenario3: () => void;
  onRunScenario4: () => void;
  onRunScenario5: () => void;
  onReset: () => void;
  simularFalloRed: boolean;
  onToggleFalloRed: (val: boolean) => void;
  activeScenarioId: string | null;
}

export default function DemoScenariosPanel({
  onRunScenario1,
  onRunScenario2,
  onRunScenario3,
  onRunScenario4,
  onRunScenario5,
  onReset,
  simularFalloRed,
  onToggleFalloRed,
  activeScenarioId,
}: DemoScenariosPanelProps) {
  const scenarios: DemoScenario[] = [
    {
      id: "sc1",
      name: "1. Flujo Feliz: Escaneo QR Rápido",
      description: "Escanea PC-04 | Lab 302 y preselecciona 'No enciende' listo para envío en 2 clics.",
      heuristic: "Nielsen #7 (Eficiencia) & Shneiderman (Diálogo con cierre)",
      badge: "Camino Feliz",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      action: onRunScenario1,
    },
    {
      id: "sc2",
      name: "2. Falla Periférico (Lab 201 • PC-15)",
      description: "Reporte de mouse/teclado en Aula 201 con nota complementaria.",
      heuristic: "Nielsen #6 (Reconocimiento visual con tarjetas 2x2)",
      badge: "Periféricos",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      action: onRunScenario2,
    },
    {
      id: "sc3",
      name: "3. Código QR Ilegible / Contingencia",
      description: "Simula daño físico en el sticker QR y despliega el ingreso manual guiado (Lab 301 • PC-12).",
      heuristic: "Nielsen #5 (Prevención de errores) & #7 (Flexibilidad)",
      badge: "Contingencia Manual",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      action: onRunScenario3,
    },
    {
      id: "sc4",
      name: "4. Excepción de Red 503 & Ticket Offline",
      description: "Inyecta fallo de red central; demuestra pantalla 5, cero pérdida de datos y ticket provisional.",
      heuristic: "Nielsen #1 (Estado del sistema) & Shneiderman (Manejo de errores)",
      badge: "Resiliencia 503",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      action: onRunScenario4,
    },
    {
      id: "sc5",
      name: "5. Falla de Video / Monitor (Lab 202)",
      description: "Reporte de monitor parpadeante en PC-22 de Lab 202.",
      heuristic: "Nielsen #6 (Mapeo natural e iconografía clara)",
      badge: "Pantalla / Video",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      action: onRunScenario5,
    },
  ];

  return (
    <div className="w-full max-w-[420px] lg:max-w-[360px] xl:max-w-[400px] flex flex-col gap-3 bg-slate-900/95 border border-slate-800 p-4 rounded-[28px] shadow-2xl text-slate-200">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white leading-tight">Escenarios Predefinidos</h3>
            <p className="text-[10px] text-slate-400">Guía interactiva para evaluación IHC</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[10px] font-semibold bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg text-slate-300 transition cursor-pointer border border-slate-700"
          title="Reiniciar aplicación al estado inicial"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Network Fault Switch */}
      <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <WifiOff className={`w-4 h-4 ${simularFalloRed ? "text-rose-400" : "text-slate-500"}`} />
          <span className="text-[11px] font-medium text-slate-300">Simulación Fallo 503 (Sin Red):</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={simularFalloRed}
            onChange={(e) => onToggleFalloRed(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
        </label>
      </div>

      {/* List of Predefined Scenarios */}
      <div className="flex flex-col gap-2 max-h-[440px] overflow-y-auto pr-1">
        {scenarios.map((sc) => {
          const isActive = activeScenarioId === sc.id;
          return (
            <div
              key={sc.id}
              className={`p-3 rounded-2xl border transition-all duration-200 flex flex-col gap-1.5 ${
                isActive
                  ? "bg-slate-800/90 border-sky-400 shadow-md shadow-sky-950"
                  : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${sc.badgeColor}`}>
                  {sc.badge}
                </span>
                <button
                  onClick={sc.action}
                  className="flex items-center gap-1 text-[11px] font-bold bg-[#0D47A1] hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg transition active:scale-95 cursor-pointer shadow-xs"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Cargar</span>
                </button>
              </div>

              <h4 className="text-xs font-bold text-slate-100">{sc.name}</h4>
              <p className="text-[11px] text-slate-400 leading-snug">{sc.description}</p>
              <div className="text-[9px] text-sky-400/90 font-medium flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-sky-400 shrink-0" />
                <span>{sc.heuristic}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Heuristic Footer Note */}
      <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>Haz clic en &quot;Cargar&quot; para que la app configure automáticamente variables y pantallas.</span>
      </div>
    </div>
  );
}