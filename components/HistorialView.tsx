"use client";
import React, { useEffect, useState } from "react";
import { FileText, QrCode, ChevronRight } from "lucide-react";
import { TicketInfo } from "@/types";

interface HistorialViewProps {
  onSelectTicket: (ticket: TicketInfo) => void;
}

export default function HistorialView({ onSelectTicket }: HistorialViewProps) {
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reportes")
      .then((res) => res.json())
      .then((data) => {
        try {
          const localTickets = JSON.parse(localStorage.getItem("offline_tickets") || "[]");
          if (Array.isArray(data)) {
            setHistoryList([...localTickets, ...data]);
          } else {
            setHistoryList(localTickets);
          }
        } catch {
          if (Array.isArray(data)) setHistoryList(data);
        }
      })
      .catch(() => {
        try {
          const localTickets = JSON.parse(localStorage.getItem("offline_tickets") || "[]");
          setHistoryList(localTickets);
        } catch {
          setHistoryList([]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-5 flex flex-col gap-3 animate-fadeIn flex-1">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800">Historial de Alertas</h2>
        <span className="text-[11px] text-slate-500">{historyList.length} registros</span>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Cargando reportes...</div>
      ) : historyList.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center gap-2 mt-4">
          <FileText className="w-10 h-10 text-slate-300" />
          <p className="text-xs text-slate-600 font-medium">Aún no has reportado averías</p>
          <p className="text-[11px] text-slate-400">Los tickets enviados o guardados aparecerán aquí.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {historyList.map((t, idx) => (
            <div
              key={t.id || idx}
              onClick={() =>
                onSelectTicket({
                  id: t.id,
                  pcId: t.pc_id || t.pcId,
                  aula: t.aula,
                  falla: t.falla,
                  hora: t.creado_en
                    ? new Date(t.creado_en).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
                    : "10:30 AM",
                  isOffline: t.isOffline,
                })
              }
              className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#0D47A1] transition cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    t.isOffline ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-[#0D47A1]"
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{t.id}</span>
                    {t.isOffline && (
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">
                        Offline
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {t.pc_id || t.pcId} • Lab {t.aula}
                  </p>
                  <p className="text-[10px] text-rose-600 font-semibold">{t.falla}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}