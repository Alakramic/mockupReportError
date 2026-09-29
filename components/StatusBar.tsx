"use client";
import React, { useEffect, useState } from "react";
import { Radio, Wifi } from "lucide-react";

export default function StatusBar() {
  const [time, setTime] = useState("09:41");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }));
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full h-10 px-7 pt-2 flex items-center justify-between text-xs font-semibold text-slate-900 z-30 shrink-0">
      <span>{time}</span>
      <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center shadow-inner">
        <div className="w-2.5 h-2.5 bg-slate-800 rounded-full mr-3"></div>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
      </div>
      <div className="flex items-center gap-1.5 text-slate-800">
        <Radio className="w-3.5 h-3.5 text-slate-700" />
        <Wifi className="w-3.5 h-3.5 text-slate-700" />
        <div className="w-5 h-2.5 border border-slate-700 rounded-sm p-0.5 flex items-center">
          <div className="w-full h-full bg-slate-800 rounded-2xs"></div>
        </div>
      </div>
    </header>
  );
}