"use client";
import React, { useState } from "react";
import { X } from "lucide-react";

interface ManualModalProps {
  onClose: () => void;
  onConfirm: (pcId: string, aula: string, numero: number) => void;
  initialAula?: string;
  initialPcNum?: string;
  infoBanner?: string;
}

const AVAILABLE_AULAS = ["201", "202", "203", "301", "302", "303"];

export default function ManualModal({
  onClose,
  onConfirm,
  initialAula = "302",
  initialPcNum = "",
  infoBanner,
}: ManualModalProps) {
  const [manualAula, setManualAula] = useState(initialAula);
  const [manualPcNum, setManualPcNum] = useState(initialPcNum);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleConfirm = () => {
    const num = parseInt(manualPcNum, 10);
    if (isNaN(num) || num < 1 || num > 30) {
      setErrorMsg("Ingresa un número de PC válido entre 1 y 30.");
      return;
    }

    const paddedNum = String(num).padStart(2, "0");
    const generatedId = `PC-${paddedNum}-LAB${manualAula}`;
    onConfirm(generatedId, manualAula, num);
  };

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-end animate-fadeIn">
      <div className="w-full bg-white rounded-t-[32px] p-5 shadow-2xl flex flex-col gap-3.5 max-h-[85%] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Ingreso Manual de Equipo</h3>
            <p className="text-[11px] text-slate-500">Paso a paso según aula y número</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Optional Info Banner */}
        {infoBanner && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-800 font-medium flex items-center gap-1.5">
            <span>⚠️ {infoBanner}</span>
          </div>
        )}

        {/* Step 1: Classroom */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            1. Selecciona el Aula / Laboratorio:
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {AVAILABLE_AULAS.map((aula) => (
              <button
                key={aula}
                type="button"
                onClick={() => {
                  setManualAula(aula);
                  setErrorMsg(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                  manualAula === aula
                    ? "bg-[#0D47A1] text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Lab {aula}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: PC Number (1 to 30) */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            2. Selecciona o escribe el número de PC (1 - 30):
          </label>

          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              min="1"
              max="30"
              value={manualPcNum}
              onChange={(e) => {
                setManualPcNum(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="Escribe el número (ej: 12)"
              className={`flex-1 text-xs bg-slate-50 py-2 px-3 rounded-xl border ${
                errorMsg ? "border-rose-500 bg-rose-50" : "border-slate-300 focus:border-[#0D47A1]"
              } focus:outline-hidden text-slate-800`}
            />
            <span className="text-xs font-bold text-slate-600">
              {manualPcNum && !isNaN(parseInt(manualPcNum, 10)) && parseInt(manualPcNum, 10) >= 1 && parseInt(manualPcNum, 10) <= 30
                ? `→ PC-${String(parseInt(manualPcNum, 10)).padStart(2, "0")}-LAB${manualAula}`
                : ""}
            </span>
          </div>

          {errorMsg && <p className="text-[11px] text-rose-600 font-medium mb-1.5">{errorMsg}</p>}

          {/* Grid 1 to 30 */}
          <div className="grid grid-cols-6 gap-1 max-h-32 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => {
              const isSelected = manualPcNum === String(num);
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setManualPcNum(String(num));
                    setErrorMsg(null);
                  }}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    isSelected
                      ? "bg-[#0D47A1] text-white font-bold shadow-xs"
                      : "bg-white text-slate-700 hover:bg-sky-100 border border-slate-200"
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          disabled={!manualAula || !manualPcNum}
          onClick={handleConfirm}
          className={`w-full py-3.5 rounded-2xl font-bold text-xs shadow-md transition ${
            manualAula && manualPcNum
              ? "bg-[#0D47A1] hover:bg-blue-800 text-white cursor-pointer"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          Confirmar Equipo
        </button>
      </div>
    </div>
  );
}