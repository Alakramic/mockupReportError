"use client";
import React from "react";
import { AlertTriangle, AlertCircle, RotateCcw, Download, Loader2 } from "lucide-react";
import { PC } from "@/types";

interface Screen5RecoveryProps {
  scannedPc: PC | null;
  selectedFalla: string | null;
  detallesExtra: string;
  isSubmitting: boolean;
  onRetrySubmit: () => void;
  onSaveOfflineTicket: () => void;
  onReturnToEdit: () => void;
}

export default function Screen5Recovery({
  scannedPc,
  selectedFalla,
  detallesExtra,
  isSubmitting,
  onRetrySubmit,
  onSaveOfflineTicket,
  onReturnToEdit,
}: Screen5RecoveryProps) {
  return (
    <div className="p-4 flex-1 flex flex-col justify-between animate-fadeIn">
      <div className="flex flex-col items-center pt-2">
        {/* Warning Icon */}
        <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2 shadow-xs animate-pulse">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-base font-bold text-slate-900 leading-tight">Error de conexión</h2>
        <p className="text-xs text-slate-500 text-center mt-1">
          No se pudo conectar al servidor central de laboratorios. Tus datos han sido preservados intactos.
        </p>

        {/* Preserved State Container (Nielsen #1 & Shneiderman Zero Data Loss) */}
        <div className="w-full bg-white rounded-2xl p-4 mt-4 shadow-xs border border-amber-200">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Datos conservados localmente:</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
            <p className="text-slate-800 font-bold">
              {scannedPc?.id || "PC-04-LAB302"} <span className="font-normal text-slate-500">| Aula {scannedPc?.aula || "302"}</span>
            </p>
            <p className="text-rose-600 font-semibold mt-0.5">Avería: {selectedFalla || "No enciende"}</p>
            {detallesExtra && <p className="text-[11px] text-slate-500 mt-1 italic">&quot;{detallesExtra}&quot;</p>}
          </div>
        </div>
      </div>

      {/* Recovery CTAs */}
      <div className="pt-3 flex flex-col gap-2.5">
        {/* Primary Retry */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onRetrySubmit}
          className="w-full py-3.5 px-4 bg-[#0D47A1] hover:bg-blue-800 active:scale-[0.98] text-white rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Reintentando conexión...</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-4 h-4" />
              <span>Intentar de nuevo</span>
            </>
          )}
        </button>

        {/* Offline Emergency Mode */}
        <button
          type="button"
          onClick={onSaveOfflineTicket}
          className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white rounded-2xl font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Guardar ticket local provisional</span>
        </button>

        {/* Return to Edit */}
        <button
          type="button"
          onClick={onReturnToEdit}
          className="w-full py-2 text-center text-xs text-slate-600 font-semibold hover:text-[#0D47A1] transition cursor-pointer"
        >
          Volver a editar
        </button>
      </div>
    </div>
  );
}