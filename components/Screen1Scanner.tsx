"use client";
import React, { useState, useEffect } from "react";
import { QrCode, Flashlight, FlashlightOff, Search, X, Loader2 } from "lucide-react";
import { PC } from "@/types";

interface Screen1ScannerProps {
  onScanSuccess: (pcId: string, aula: string, numero: number) => void;
  onOpenManualModal: () => void;
  showToast: (msg: string) => void;
}

export default function Screen1Scanner({
  onScanSuccess,
  onOpenManualModal,
  showToast,
}: Screen1ScannerProps) {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PC[]>([]);

  // Autocomplete debouncer
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const timer = setTimeout(() => {
        fetch(`/api/pcs?q=${encodeURIComponent(searchQuery.trim())}`)
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setSearchResults(data);
            }
          })
          .catch((err) => console.error("Search error:", err));
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSimulateScan = (pcId: string = "PC-04-LAB302", aula: string = "302", numero: number = 4) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onScanSuccess(pcId, aula, numero);
    }, 650);
  };

  return (
    <div className="p-4 flex-1 flex flex-col justify-between animate-fadeIn">
      <div className="flex flex-col gap-3">
        {/* Title */}
        <div className="text-center pt-1">
          <h2 className="text-base font-bold text-slate-900 leading-tight">Escanea el código QR del equipo</h2>
          <p className="text-xs text-slate-500 mt-0.5">Apunta la cámara al sticker ubicado en el CPU o monitor</p>
        </div>

        {/* Viewfinder Frame */}
        <div className="relative w-full h-[260px] bg-slate-950 rounded-3xl overflow-hidden shadow-lg border-2 border-slate-800 flex items-center justify-center">
          {/* Flashlight Beam */}
          {flashlightOn && (
            <div className="absolute inset-0 bg-yellow-300/20 backdrop-brightness-125 pointer-events-none transition-opacity duration-300"></div>
          )}

          {/* Scanning Shutter Overlay */}
          {isScanning && (
            <div className="absolute inset-0 bg-white/85 z-30 flex flex-col items-center justify-center gap-2 animate-pulse">
              <Loader2 className="w-8 h-8 text-[#0D47A1] animate-spin" />
              <span className="text-xs font-bold text-[#0D47A1]">Decodificando QR...</span>
            </div>
          )}

          {/* Reticle */}
          <div className="relative w-48 h-48 border border-white/20 rounded-2xl flex items-center justify-center p-2">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-sky-400 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-sky-400 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-sky-400 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-sky-400 rounded-br-lg"></div>

            {/* Laser Line */}
            <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-scan shadow-[0_0_12px_#ef4444]"></div>

            <QrCode className="w-20 h-20 text-white/20 stroke-[1]" />
          </div>

          {/* Flashlight button */}
          <button
            type="button"
            onClick={() => {
              setFlashlightOn(!flashlightOn);
              showToast(!flashlightOn ? "Linterna encendida" : "Linterna apagada");
            }}
            className={`absolute top-3 right-3 p-2.5 rounded-full z-20 backdrop-blur-md transition-all cursor-pointer ${
              flashlightOn
                ? "bg-yellow-400 text-slate-900 shadow-[0_0_15px_#facc15]"
                : "bg-black/50 text-white/80 hover:bg-black/70"
            }`}
            title="Alternar linterna"
          >
            {flashlightOn ? <Flashlight className="w-4 h-4" /> : <FlashlightOff className="w-4 h-4" />}
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-[10px] text-sky-200 px-3 py-1 rounded-full border border-white/10 font-medium">
            Cámara activa • Sensor QR
          </div>
        </div>

        {/* Quick Simulator CTA */}
        <button
          type="button"
          disabled={isScanning}
          onClick={() => handleSimulateScan("PC-04-LAB302", "302", 4)}
          className="w-full py-3.5 px-4 bg-[#0D47A1] hover:bg-blue-800 active:scale-[0.98] text-white rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition duration-150 disabled:opacity-50 cursor-pointer"
        >
          {isScanning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Escaneando PC-04...</span>
            </>
          ) : (
            <>
              <QrCode className="w-4 h-4 text-sky-300" />
              <span>Simular escaneo de PC-04 | Lab 302</span>
            </>
          )}
        </button>

        {/* Search Autocomplete */}
        <div className="relative mt-1">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="O busca por código (ej: PC-04, 302)..."
              className="w-full text-xs bg-white py-2 pl-8 pr-7 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0D47A1] text-slate-700 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-40">
              {searchResults.map((pc) => (
                <button
                  key={pc.id}
                  onClick={() => {
                    handleSimulateScan(pc.id, pc.aula, pc.numero);
                    setSearchQuery("");
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-sky-50 flex items-center justify-between border-b border-slate-100 last:border-0 cursor-pointer"
                >
                  <span className="font-bold text-slate-800">{pc.id}</span>
                  <span className="text-[10px] text-slate-500">Aula {pc.aula}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contingency Link (Method 2) */}
      <div className="text-center pt-2 pb-1">
        <button
          type="button"
          onClick={onOpenManualModal}
          className="text-xs text-[#0D47A1] font-semibold underline underline-offset-4 hover:text-blue-800 transition cursor-pointer"
        >
          ¿Código dañado o ilegible? Ingresar manual
        </button>
      </div>
    </div>
  );
}