"use client";
import React, { useState } from "react";
import { Check, MapPin, Copy, RotateCcw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { TicketInfo } from "@/types";

interface Screen4TicketProps {
  ticketData: TicketInfo;
  onCopyTicket: (id: string) => void;
  onResetToStart: () => void;
}

export default function Screen4Ticket({
  ticketData,
  onCopyTicket,
  onResetToStart,
}: Screen4TicketProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyTicket(ticketData.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 flex-1 flex flex-col justify-between animate-fadeIn">
      <div className="flex flex-col items-center">
        {/* Animated Green Badge */}
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-1.5 shadow-xs animate-bounce">
          <Check className="w-6 h-6 stroke-[3]" />
        </div>
        <h2 className="text-base font-bold text-slate-900 leading-tight">¡Alerta enviada con éxito!</h2>
        <p className="text-[11px] text-slate-500">Comprobante digital para justificación en clase</p>

        {/* Digital Receipt Pass Card */}
        <div className="w-full bg-white rounded-3xl p-4 mt-3 shadow-md border border-slate-200 flex flex-col items-center relative overflow-hidden">
          {/* Header Row */}
          <div className="w-full flex items-center justify-between pb-3 border-b border-dashed border-slate-200">
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Ticket ID</p>
              <p className="text-base font-black text-[#0D47A1] tracking-tight">{ticketData.id}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Hora</p>
              <p className="text-xs font-bold text-slate-700">{ticketData.hora}</p>
            </div>
          </div>

          {/* Details */}
          <div className="w-full py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Aula <strong>{ticketData.aula}</strong> • {ticketData.pcId}
              </span>
            </div>
            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-full border border-rose-200">
              {ticketData.falla}
            </span>
          </div>

          {/* Green Status Pill */}
          <div className="w-full py-1.5 px-2 bg-emerald-50 rounded-xl border border-emerald-200 text-center mb-3">
            <span className="text-[11px] font-extrabold text-emerald-800 tracking-wide">
              ✓ AUTORIZADO PARA REUBICACIÓN
            </span>
          </div>

          {/* QR Code */}
          <div className="p-3 bg-white rounded-2xl border-2 border-slate-900 shadow-xs mb-2">
            <QRCodeSVG
              value={`https://unsa.edu.pe/ticket/${ticketData.id}?pc=${ticketData.pcId}&aula=${ticketData.aula}&falla=${encodeURIComponent(ticketData.falla)}`}
              size={130}
            />
          </div>

          <p className="text-[10px] text-center text-slate-500 font-medium px-4">
            Muestra este código al docente para justificar tu cambio
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="w-full py-3 px-4 bg-white border border-slate-300 hover:bg-slate-50 active:scale-[0.98] text-slate-800 rounded-2xl font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
          <span>{copied ? "¡Código copiado!" : "Guardar Ticket"}</span>
        </button>

        <button
          type="button"
          onClick={onResetToStart}
          className="w-full py-3 px-4 bg-[#0D47A1] hover:bg-blue-800 active:scale-[0.98] text-white rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Volver al inicio</span>
        </button>
      </div>
    </div>
  );
}