"use client";

import React from "react";
import {
  Sparkles,
  Play,
  RotateCcw,
  WifiOff,
  Zap,
  CheckCircle2,
} from "lucide-react";

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  tag: string;
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
      name: "1. Reporte Rápido vía QR",
      description: "Escaneo instantáneo de PC-04 (Lab 302) y selección de 'No enciende' listo para envío.",
      tag: "Flujo principal en 2 pasos",
      badge: "Escaneo QR",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      action: onRunScenario1,
    },
    {
      id: "sc2",
      name: "2. Reporte de Periféricos",
      description: "Registro de falla en teclado/mouse en Aula 201 (PC-15) con detalle complementario.",
      tag: "Diagnóstico de hardware",
      badge: "Periféricos",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      action: onRunScenario2,
    },
    {
      id: "sc3",
      name: "3. Contingencia / Código Dañado",
      description: "Simulación de sticker ilegible y apertura del selector manual guiado para Aula 301.",
      tag: "Alternativa sin escáner",
      badge: "Ingreso Manual",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      action: onRunScenario3,
    },
    {
      id: "sc4",
      name: "4. Tolerancia a Fallos y Modo Offline",
      description: "Simula interrupción de conexión central, preserva datos y emite ticket local provisional.",
      tag: "Alta disponibilidad",
      badge: "Modo Offline",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      action: onRunScenario4,
    },
    {
      id: "sc5",
      name: "5. Diagnóstico de Pantalla / Video",
      description: "Reporte de parpadeo e intermitencia de video en Aula 202 (PC-22).",
      tag: "Falla visual / display",
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
            <h3 className="text-xs font-bold text-white leading-tight">Flujos de Demostración</h3>
            <p className="text-[10px] text-slate-400">Pruebas interactivas del sistema</p>
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
          <span className="text-[11px] font-medium text-slate-300">Simular Corte de Red (Offline):</span>
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
                <CheckCircle2 className="w-3 h-3 text-sky-400 shrink-0" />
                <span>{sc.tag}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>Haz clic en &quot;Cargar&quot; para ejecutar cualquier flujo de demostración de manera automática.</span>
      </div>
    </div>
  );
}