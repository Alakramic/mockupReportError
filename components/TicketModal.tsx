"use client";
import React, { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { TicketInfo } from "@/types";

interface TicketModalProps {
  ticket: TicketInfo;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export default function TicketModal({ ticket, onClose, showToast }: TicketModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ticket.id).catch(() => {});
    setCopied(true);
    showToast(`Código ${ticket.id} copiado`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full bg-white rounded-3xl p-5 shadow-2xl flex flex-col items-center max-h-[90%] overflow-y-auto">
        <div className="w-full flex justify-between items-center pb-2 border-b border-slate-100 mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Detalle del Comprobante</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <span className="text-base font-black text-[#0D47A1]">{ticket.id}</span>
        <p className="text-xs text-slate-600 font-bold mb-2">
          {ticket.pcId} • Aula {ticket.aula}
        </p>

        <div className="w-full py-1 px-2 bg-emerald-50 rounded-lg text-center text-[10px] font-bold text-emerald-800 mb-3">
          AUTORIZADO PARA REUBICACIÓN
        </div>

        <div className="p-3 bg-white rounded-2xl border-2 border-slate-900 shadow-xs mb-3">
          <QRCodeSVG
            value={`https://unsa.edu.pe/ticket/${ticket.id}?pc=${ticket.pcId}&aula=${ticket.aula}`}
            size={120}
          />
        </div>

        <p className="text-xs text-rose-600 font-semibold mb-4">Falla reportada: {ticket.falla}</p>

        <button
          onClick={handleCopy}
          className="w-full py-2.5 bg-[#0D47A1] text-white rounded-xl font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? "¡Código copiado!" : "Copiar Código de Ticket"}</span>
        </button>
      </div>
    </div>
  );
}