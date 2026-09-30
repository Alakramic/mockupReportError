"use client";

import React, { useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import StatusBar from "@/components/StatusBar";
import AppHeader from "@/components/AppHeader";
import ProgressBar from "@/components/ProgressBar";
import BottomNav from "@/components/BottomNav";
import Screen1Scanner from "@/components/Screen1Scanner";
import Screen2Defects from "@/components/Screen2Defects";
import Screen4Ticket from "@/components/Screen4Ticket";
import Screen5Recovery from "@/components/Screen5Recovery";
import ManualModal from "@/components/ManualModal";
import HistorialView from "@/components/HistorialView";
import PerfilView from "@/components/PerfilView";
import TicketModal from "@/components/TicketModal";
import DemoScenariosPanel from "@/components/DemoScenariosPanel";
import { PC, TicketInfo } from "@/types";

export default function AlertaAveriasApp() {
  // Navigation & Screen State
  const [currentScreen, setCurrentScreen] = useState<"screen1" | "screen2" | "screen4" | "screen5">("screen1");
  const [activeTab, setActiveTab] = useState<"inicio" | "reportar" | "historial" | "perfil">("reportar");

  // Selection & Form State
  const [scannedPc, setScannedPc] = useState<PC | null>(null);
  const [selectedFalla, setSelectedFalla] = useState<string | null>(null);
  const [detallesExtra, setDetallesExtra] = useState<string>("");

  // Loading & Network Simulation States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [simularFalloRed, setSimularFalloRed] = useState<boolean>(false);

  // Result & Ticket State
  const [ticketData, setTicketData] = useState<TicketInfo | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [manualModalConfig, setManualModalConfig] = useState<{ aula: string; pcNum: string; infoBanner?: string }>({
    aula: "302",
    pcNum: "",
  });
  const [viewingTicketModal, setViewingTicketModal] = useState<TicketInfo | null>(null);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Scan success (Method 1)
  const handleScanSuccess = (pcId: string, aula: string, numero: number) => {
    setScannedPc({ id: pcId, aula, numero, estado: "OPERATIVO" });
    setSelectedFalla(null);
    setCurrentScreen("screen2");
    showToast(`Equipo detectado: ${pcId}`);
  };

  // Manual select success (Method 2)
  const handleManualConfirm = (pcId: string, aula: string, numero: number) => {
    setScannedPc({ id: pcId, aula, numero, estado: "OPERATIVO" });
    setShowManualModal(false);
    setSelectedFalla(null);
    setCurrentScreen("screen2");
    showToast(`Equipo confirmado: ${pcId}`);
  };

  // Submit Alert Report Handler with explicit override support
  const handleSubmitReport = async (overrideFalloRed?: boolean) => {
    if (!scannedPc || !selectedFalla) {
      showToast("Selecciona una avería antes de enviar.");
      return;
    }

    const failureMode = overrideFalloRed !== undefined ? overrideFalloRed : simularFalloRed;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reportes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pcId: scannedPc.id,
          aula: scannedPc.aula,
          falla: selectedFalla,
          simularFalloRed: failureMode,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setTicketData(data.ticket);
        setCurrentScreen("screen4");
        showToast("¡Alerta registrada con éxito!");
      } else if (response.status === 503 || failureMode) {
        // HTTP 503 Network Exception -> Screen 5 (Error de conexión y recuperación)
        setCurrentScreen("screen5");
      } else {
        // Validation or other error (e.g. 400)
        showToast(data.error || "No se pudo procesar el reporte.");
      }
    } catch (error) {
      console.error("Network exception:", error);
      setCurrentScreen("screen5");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Screen 5 Recovery: Retry (Forces normal network success)
  const handleRetrySubmit = () => {
    setSimularFalloRed(false);
    showToast("Reintentando con conexión restablecida...");
    handleSubmitReport(false); // Explicitly override failure mode to false
  };

  // Screen 5 Recovery: Save Offline Emergency Ticket
  const handleSaveOfflineTicket = () => {
    if (!scannedPc || !selectedFalla) return;

    const randomOffline = Math.floor(100 + Math.random() * 900);
    const offlineTicket: TicketInfo = {
      id: `#TK-OFFLINE-${randomOffline}`,
      pcId: scannedPc.id,
      aula: scannedPc.aula,
      falla: selectedFalla,
      hora: new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: true }),
      isOffline: true,
    };

    try {
      const existing = JSON.parse(localStorage.getItem("offline_tickets") || "[]");
      existing.unshift({
        id: offlineTicket.id,
        pc_id: offlineTicket.pcId,
        aula: offlineTicket.aula,
        falla: offlineTicket.falla,
        creado_en: new Date().toISOString(),
        isOffline: true,
      });
      localStorage.setItem("offline_tickets", JSON.stringify(existing));
    } catch (e) {
      console.error("Could not save to localStorage:", e);
    }

    setTicketData(offlineTicket);
    setCurrentScreen("screen4");
    showToast("Ticket provisional guardado localmente (Offline)");
  };

  // Copy Ticket ID
  const handleCopyTicket = (id: string) => {
    navigator.clipboard.writeText(id).catch(() => {});
    showToast(`Código ${id} copiado al portapapeles`);
  };

  // Reset to Start
  const handleResetToStart = () => {
    setCurrentScreen("screen1");
    setActiveTab("reportar");
    setScannedPc(null);
    setSelectedFalla(null);
    setDetallesExtra("");
    setTicketData(null);
    setSimularFalloRed(false);
    setActiveScenarioId(null);
    showToast("Aplicación reiniciada");
  };

  // Tab switching
  const handleTabChange = (tab: "inicio" | "reportar" | "historial" | "perfil") => {
    setActiveTab(tab);
    if (tab === "inicio") {
      setCurrentScreen("screen1");
    } else if (tab === "reportar") {
      if (!scannedPc) {
        setCurrentScreen("screen1");
      } else if (!ticketData) {
        setCurrentScreen("screen2");
      }
    }
  };

  // Predefined Scenario 1: Camino Feliz (Red Normal)
  const handleRunScenario1 = () => {
    setActiveScenarioId("sc1");
    setSimularFalloRed(false);
    setActiveTab("reportar");
    setScannedPc({ id: "PC-04-LAB302", aula: "302", numero: 4, estado: "OPERATIVO" });
    setSelectedFalla("No enciende");
    setDetallesExtra("No emite sonido ni luces LED al presionar botón de encendido.");
    setCurrentScreen("screen2");
    showToast("Flujo 1: PC-04 | Lab 302 (No enciende) listo para enviar");
  };

  // Predefined Scenario 2: Periférico Roto (Red Normal)
  const handleRunScenario2 = () => {
    setActiveScenarioId("sc2");
    setSimularFalloRed(false);
    setActiveTab("reportar");
    setScannedPc({ id: "PC-15-LAB201", aula: "201", numero: 15, estado: "OPERATIVO" });
    setSelectedFalla("Periférico roto");
    setDetallesExtra("Mouse óptico no responde al clic izquierdo y cable USB flojo.");
    setCurrentScreen("screen2");
    showToast("Flujo 2: PC-15 | Lab 201 (Periférico roto) cargado");
  };

  // Predefined Scenario 3: QR Dañado / Contingencia Manual (Red Normal)
  const handleRunScenario3 = () => {
    setActiveScenarioId("sc3");
    setSimularFalloRed(false);
    setActiveTab("reportar");
    setCurrentScreen("screen1");
    setScannedPc(null);
    setSelectedFalla(null);
    setManualModalConfig({
      aula: "301",
      pcNum: "12",
      infoBanner: "Código QR desgastado. Ingreso manual seleccionado para Aula 301 - PC 12.",
    });
    setShowManualModal(true);
    showToast("Flujo 3: Contingencia manual activada para Aula 301");
  };

  // Predefined Scenario 4: Falla de Servidor 503 & Modo Offline (Fallo Red ON)
  const handleRunScenario4 = () => {
    setActiveScenarioId("sc4");
    setSimularFalloRed(true);
    setActiveTab("reportar");
    setScannedPc({ id: "PC-08-LAB303", aula: "303", numero: 8, estado: "OPERATIVO" });
    setSelectedFalla("Sin red / Internet");
    setDetallesExtra("Sin conexión al switch central. Cable de red sin enlace.");
    setCurrentScreen("screen2");
    showToast("Flujo 4: Fallo de red activado. Pulsa 'Enviar Alerta' para ver la pantalla de recuperación.");
  };

  // Predefined Scenario 5: Falla de Video / Monitor (Red Normal)
  const handleRunScenario5 = () => {
    setActiveScenarioId("sc5");
    setSimularFalloRed(false);
    setActiveTab("reportar");
    setScannedPc({ id: "PC-22-LAB202", aula: "202", numero: 22, estado: "OPERATIVO" });
    setSelectedFalla("Pantalla / Video");
    setDetallesExtra("Pantalla parpadea con líneas horizontales intermitentes.");
    setCurrentScreen("screen2");
    showToast("Flujo 5: PC-22 | Lab 202 (Pantalla / Video) cargado");
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center p-2 sm:p-6 bg-slate-950 font-sans text-slate-800">
      {/* 2-COLUMN LAYOUT: SMARTPHONE VIEWPORT + DEMO SCENARIOS ASSISTANT */}
      <div className="w-full max-w-[840px] flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6">
        {/* PHONE VIEWPORT CONTAINER (max-w-[393px], h-[830px], rounded-[44px], #F4F6F8) */}
        <div className="relative w-full max-w-[393px] h-[830px] max-h-[92vh] bg-[#F4F6F8] rounded-[44px] shadow-2xl border-[6px] border-slate-800 flex flex-col overflow-hidden select-none shrink-0">
          {/* iOS Status Bar */}
          <StatusBar />

          {/* UNSA App Header */}
          <AppHeader simularFalloRed={simularFalloRed} />

          {/* Linear Step Progress Indicator */}
          {(activeTab === "reportar" || activeTab === "inicio") && (
            <ProgressBar currentScreen={currentScreen} hasSelectedFalla={Boolean(selectedFalla)} />
          )}

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto relative flex flex-col">
            {/* Toast Notification */}
            {toastMessage && (
              <div className="absolute top-3 left-4 right-4 z-50 animate-bounce transition duration-300">
                <div className="bg-slate-900/95 text-white text-xs font-medium py-2.5 px-3.5 rounded-xl shadow-xl flex items-center justify-between border border-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{toastMessage}</span>
                  </div>
                  <button
                    onClick={() => setToastMessage(null)}
                    className="text-slate-400 hover:text-white text-sm ml-2 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB: PERFIL */}
            {activeTab === "perfil" && (
              <PerfilView
                onNewReport={() => {
                  setActiveTab("reportar");
                  setCurrentScreen("screen1");
                }}
              />
            )}

            {/* TAB: HISTORIAL */}
            {activeTab === "historial" && (
              <HistorialView onSelectTicket={(ticket) => setViewingTicketModal(ticket)} />
            )}

            {/* TAB: INICIO & REPORTAR SCREENS */}
            {(activeTab === "reportar" || activeTab === "inicio") && (
              <>
                {currentScreen === "screen1" && (
                  <Screen1Scanner
                    onScanSuccess={handleScanSuccess}
                    onOpenManualModal={() => {
                      setManualModalConfig({ aula: "302", pcNum: "" });
                      setShowManualModal(true);
                    }}
                    showToast={showToast}
                  />
                )}

                {currentScreen === "screen2" && (
                  <Screen2Defects
                    scannedPc={scannedPc}
                    selectedFalla={selectedFalla}
                    detallesExtra={detallesExtra}
                    isSubmitting={isSubmitting}
                    onSelectFalla={(falla) => {
                      setSelectedFalla(falla);
                      showToast(`Avería seleccionada: ${falla}`);
                    }}
                    onChangeDetalles={setDetallesExtra}
                    onChangePc={() => setCurrentScreen("screen1")}
                    onSubmit={() => handleSubmitReport()}
                  />
                )}

                {currentScreen === "screen4" && ticketData && (
                  <Screen4Ticket
                    ticketData={ticketData}
                    onCopyTicket={handleCopyTicket}
                    onResetToStart={handleResetToStart}
                  />
                )}

                {currentScreen === "screen5" && (
                  <Screen5Recovery
                    scannedPc={scannedPc}
                    selectedFalla={selectedFalla}
                    detallesExtra={detallesExtra}
                    isSubmitting={isSubmitting}
                    onRetrySubmit={handleRetrySubmit}
                    onSaveOfflineTicket={handleSaveOfflineTicket}
                    onReturnToEdit={() => setCurrentScreen("screen2")}
                  />
                )}
              </>
            )}
          </div>

          {/* Contingency Manual Input Modal */}
          {showManualModal && (
            <ManualModal
              initialAula={manualModalConfig.aula}
              initialPcNum={manualModalConfig.pcNum}
              infoBanner={manualModalConfig.infoBanner}
              onClose={() => setShowManualModal(false)}
              onConfirm={handleManualConfirm}
            />
          )}

          {/* View Ticket Modal (From Historial) */}
          {viewingTicketModal && (
            <TicketModal
              ticket={viewingTicketModal}
              onClose={() => setViewingTicketModal(null)}
              showToast={showToast}
            />
          )}

          {/* Persistent 4-Tab Bottom Navigation */}
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* SIDEBAR: PREDEFINED DEMO SCENARIOS PANEL */}
        <DemoScenariosPanel
          onRunScenario1={handleRunScenario1}
          onRunScenario2={handleRunScenario2}
          onRunScenario3={handleRunScenario3}
          onRunScenario4={handleRunScenario4}
          onRunScenario5={handleRunScenario5}
          onReset={handleResetToStart}
          simularFalloRed={simularFalloRed}
          onToggleFalloRed={(val) => {
            setSimularFalloRed(val);
            showToast(val ? "Simulación de corte activada (Modo Offline)" : "Conexión normal restaurada");
          }}
          activeScenarioId={activeScenarioId}
        />
      </div>
    </main>
  );
}