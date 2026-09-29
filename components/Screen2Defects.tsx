"use client";
import React from "react";
import { Power, Mouse, WifiOff, Monitor, Check, CheckCircle2, Loader2 } from "lucide-react";
import { PC } from "@/types";

interface Screen2DefectsProps {
  scannedPc: PC | null;
  selectedFalla: string | null;
  detallesExtra: string;
  isSubmitting: boolean;
  onSelectFalla: (falla: string) => void;
  onChangeDetalles: (detalles: string) => void;
  onChangePc: () => void;
  onSubmit: () => void;
}

const DEFECT_ITEMS = [
  {
    id: "No enciende",
    title: "No enciende",
    subtitle: "Sin energía o no arranca",
    icon: Power,
    iconColor: "text-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    id: "Periférico roto",
    title: "Periférico roto",
    subtitle: "Mouse, teclado o audio",
    icon: Mouse,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: "Sin red / Internet",
    title: "Sin red / Internet",
    subtitle: "Fallo LAN o cable suelto",
    icon: WifiOff,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    id: "Pantalla / Video",
    title: "Pantalla / Video",
    subtitle: "Monitor negro o parpadeo",
    icon: Monitor,
    iconColor: "text-rose-500",
    bgColor: "bg-rose-50",
  },
];

export default function Screen2Defects({
  scannedPc,
  selectedFalla,
  detallesExtra,
  isSubmitting,
  onSelectFalla,
  onChangeDetalles,
  onChangePc,
  onSubmit,
}: Screen2DefectsProps) {
  return (
    <div className="p-4 flex-1 flex flex-col justify-between animate-fadeIn">
      <div className="flex flex-col gap-3">
        {/* Verified Chip */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Equipo detectado</p>
              <p className="text-xs font-extrabold text-slate-800">
                {scannedPc?.id || "PC-04-LAB302"} <span className="font-normal text-slate-500">| Aula {scannedPc?.aula || "302"}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onChangePc}
            className="text-[11px] font-bold text-[#0D47A1] hover:underline cursor-pointer"
          >
            Cambiar
          </button>
        </div>

        {/* Section title */}
        <div>
          <h2 className="text-sm font-bold text-slate-900">Selecciona el tipo de avería</h2>
          <p className="text-[11px] text-slate-500">Elige la opción que mejor describa el incidente</p>
        </div>

        {/* 2x2 Defect Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {DEFECT_ITEMS.map((item) => {
            const isSelected = selectedFalla === item.id;
            const IconComponent = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectFalla(item.id)}
                className={`relative text-left p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between h-[104px] cursor-pointer ${
                  isSelected
                    ? "border-2 border-[#0D47A1] bg-[#E3F2FD] shadow-md scale-[1.02]"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-xs"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#0D47A1] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                <div className={`w-8 h-8 rounded-xl ${item.bgColor} flex items-center justify-center mb-1.5`}>
                  <IconComponent className={`w-4 h-4 ${item.iconColor}`} />
                </div>

                <div>
                  <p className={`text-xs font-bold leading-tight ${isSelected ? "text-[#0D47A1]" : "text-slate-800"}`}>
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{item.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Optional note */}
        <div className="mt-1">
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">
            Detalle adicional <span className="text-slate-400 font-normal">(Opcional)</span>
          </label>
          <input
            type="text"
            value={detallesExtra}
            onChange={(e) => onChangeDetalles(e.target.value)}
            placeholder="Ej: Teclado no escribe letras 'A' ni 'S'..."
            className="w-full text-xs bg-white py-2 px-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0D47A1] text-slate-700 placeholder:text-slate-400"
            maxLength={80}
          />
        </div>
      </div>

      {/* Sticky Bottom Card & CTA */}
      <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col gap-2">
        <div className="text-center text-[11px] text-slate-500">
          {selectedFalla ? (
            <span>
              Resumen: <strong className="text-slate-800">{scannedPc?.id}</strong> •{" "}
              <strong className="text-rose-600">{selectedFalla}</strong>
            </span>
          ) : (
            <span className="text-amber-600 font-medium">⚠️ Selecciona una avería para habilitar el envío</span>
          )}
        </div>

        <button
          type="button"
          disabled={!selectedFalla || isSubmitting}
          onClick={onSubmit}
          className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition duration-200 ${
            selectedFalla && !isSubmitting
              ? "bg-[#0D47A1] hover:bg-blue-800 active:scale-[0.98] text-white cursor-pointer"
              : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Transmitiendo alerta...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Enviar Alerta (2.° clic)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}