/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { CalculationRecord } from "./types";

// Import modules
import Overview from "./modules/Overview";
import TaperLength from "./modules/TaperLength";
import PavementMarkings from "./modules/PavementMarkings";
import RumbleStrips from "./modules/RumbleStrips";
import DividedBarrier from "./modules/DividedBarrier";
import UndividedBarrier from "./modules/UndividedBarrier";
import ClearZone from "./modules/ClearZone";
import HorizontalCurves from "./modules/HorizontalCurves";
import VerticalCurves from "./modules/VerticalCurves";
import SightDistanceSSD from "./modules/SightDistanceSSD";
import SightDistancePSD from "./modules/SightDistancePSD";
import SpeedChangeLanes from "./modules/SpeedChangeLanes";
import ReferencesList from "./modules/ReferencesList";
import StandardDrawingsList from "./modules/StandardDrawingsList";
import AttachmentsView from "./modules/AttachmentsView";
import HistoryView from "./modules/HistoryView";

import { 
  Home, 
  Settings, 
  Menu, 
  X, 
  FileText, 
  Grid, 
  AlertTriangle, 
  History, 
  ShieldCheck, 
  Paintbrush, 
  Compass, 
  BookOpen, 
  Layers, 
  Clock, 
  Printer, 
  Share2,
  ArrowRightLeft
} from "lucide-react";

export default function App() {
  const [currentModule, setCurrentModule] = useState<string>("overview");
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Load history from localStorage on mounting
  useEffect(() => {
    const saved = localStorage.getItem("traffic_calc_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        setHistory([]);
      }
    }
  }, []);

  // Save new calculation callback
  const handleSaveCalculation = (calcRaw: Omit<CalculationRecord, "id" | "timestamp">) => {
    const newRecord: CalculationRecord = {
      ...calcRaw,
      id: `calc_${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    const updated = [newRecord, ...history];
    setHistory(updated);
    localStorage.setItem("traffic_calc_history", JSON.stringify(updated));
  };

  // Clear all history logs
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("traffic_calc_history");
  };

  // Safe fetch of the absolute most recent calculation run (if any)
  const lastRecord = history.length > 0 ? history[0] : null;

  // Sidebar list of pages
  const navItems = [
    { id: "overview", label: "الصفحة الرئيسية", icon: Home, group: "عام" },
    { id: "taper", label: "المنطقة الانتقالية / Taper Length", icon: Layers, group: "حسابات السلامة" },
    { id: "markings", label: "الدهانات والعلامات الأرضية", icon: Paintbrush, group: "حسابات السلامة" },
    { id: "rumble", label: "المطبات الاهتزازية / Rumble Strips", icon: AlertTriangle, group: "حسابات السلامة" },
    { id: "divided_barrier", label: "الحواجز المعدنية — طرق مزدوجة", icon: ShieldCheck, group: "حواجز وحمايات" },
    { id: "undivided_barrier", label: "الحواجز المعدنية — طريق مفرد", icon: ShieldCheck, group: "حواجز وحمايات" },
    { id: "clear_zone", label: "الخلوص الجانبي / Clear Zone", icon: Clock, group: "حواجز وحمايات" },
    { id: "curves", label: "المنحنيات الأفقية والسرعة", icon: Compass, group: "التصميم الجيومتري" },
    { id: "vertical", label: "المنحنيات الرأسية والأطوال", icon: Compass, group: "التصميم الجيومتري" },
    { id: "ssd", label: "مسافة الرؤية للتوقف / SSD", icon: Clock, group: "التصميم الجيومتري" },
    { id: "psd", label: "مسافة الرؤية للتجاوز / PSD", icon: Clock, group: "التصميم الجيومتري" },
    { id: "speed_change", label: "حارات التسارع والتباطؤ", icon: ArrowRightLeft, group: "التصميم الجيومتري" },
    { id: "references", label: "الدليل المرجعي والأكواد", icon: BookOpen, group: "مكتبة ومستندات" },
    { id: "drawings", label: "المخططات القياسية AutoCAD", icon: Grid, group: "مكتبة ومستندات" },
    { id: "attachments", label: "الملحقات والأدلة الفنية", icon: FileText, group: "مكتبة ومستندات" },
    { id: "history", label: "سجل حساباتك الميدانية", icon: History, group: "أرشيف وتدقيق" }
  ];

  // Grouped Navigation Items
  const navGroups = navItems.reduce((acc: any, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const renderModuleContent = () => {
    switch (currentModule) {
      case "overview":
        return (
          <Overview 
            onNavigateToModule={(modId) => setCurrentModule(modId)} 
            lastRecord={lastRecord}
            historyLength={history.length}
          />
        );
      case "taper":
        return <TaperLength onSaveCalculation={handleSaveCalculation} />;
      case "markings":
        return <PavementMarkings onSaveCalculation={handleSaveCalculation} />;
      case "rumble":
        return <RumbleStrips onSaveCalculation={handleSaveCalculation} />;
      case "divided_barrier":
        return <DividedBarrier onSaveCalculation={handleSaveCalculation} />;
      case "undivided_barrier":
        return <UndividedBarrier onSaveCalculation={handleSaveCalculation} />;
      case "clear_zone":
        return <ClearZone onSaveCalculation={handleSaveCalculation} />;
      case "curves":
        return <HorizontalCurves onSaveCalculation={handleSaveCalculation} />;
      case "vertical":
        return <VerticalCurves onSaveCalculation={handleSaveCalculation} />;
      case "ssd":
        return <SightDistanceSSD onSaveCalculation={handleSaveCalculation} />;
      case "psd":
        return <SightDistancePSD onSaveCalculation={handleSaveCalculation} />;
      case "speed_change":
        return <SpeedChangeLanes onSaveCalculation={handleSaveCalculation} />;
      case "references":
        return <ReferencesList />;
      case "drawings":
        return <StandardDrawingsList />;
      case "attachments":
        return <AttachmentsView />;
      case "history":
        return <HistoryView history={history} onClearHistory={handleClearHistory} />;
      default:
        return <Overview onNavigateToModule={(modId) => setCurrentModule(modId)} lastRecord={lastRecord} historyLength={history.length} />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] flex flex-col antialiased selection:bg-brand-primary selection:text-white" dir="rtl">
      
      {/* Top Main Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 print:hidden shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu toggle and Logo */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 rounded md:hidden hover:bg-slate-100 text-slate-500"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-brand-primary rounded-full animate-pulse"></span>
              <h1 className="font-extrabold text-brand-primary text-base sm:text-lg">منصة أدوات مهندس المرور</h1>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-sans">
            {/* Author Profile watermark */}
            <div className="hidden sm:block text-right border-r-2 border-brand-secondary pr-2">
              <span className="text-[10px] text-gray-400 block font-bold">يوروقروب للاستشارات الهندسية</span>
              <span className="font-extrabold text-slate-800 text-[11px]">م. حسان عبد الله الحلبي</span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrint}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                title="طباعة التقرير"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("تم نسخ رابط التطبيق لتبادله مع مهندسي الأمانة والوزارة بنجاح!");
                }}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                title="مشاركة التطبيق"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main shell Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        
        {/* Sticky Desktop Side Navigation Panel on the right (for RTL) */}
        <aside className="w-64 border-l border-[#325a6e]/20 bg-brand-primary text-white hidden md:block shrink-0 print:hidden h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto">
          <nav className="p-3 space-y-4">
            {Object.entries(navGroups).map(([groupName, items]: any) => (
              <div key={groupName} className="space-y-0.5">
                <h3 className="text-[10px] font-bold text-white/50 px-2.5 tracking-wider mb-1.5 uppercase">
                  {groupName}
                </h3>
                {items.map((item: any) => {
                  const Icon = item.icon;
                  const isActive = currentModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentModule(item.id)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-right font-medium text-xs transition-all focus:outline-none border-r-4 ${
                        isActive
                          ? "bg-white/10 text-white font-bold border-brand-warning"
                          : "text-white/80 hover:bg-white/5 hover:text-white border-transparent"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-brand-warning" : "text-white/60"}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* Mobile View Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div
              className="absolute right-0 top-0 bottom-0 w-64 bg-brand-primary text-white shadow-2xl overflow-y-auto p-4 space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="font-extrabold text-white text-sm">منصة أدوات مهندس المرور</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded bg-white/10 text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right pb-4 border-b border-white/10">
                <span className="text-[9px] text-white/50 block font-bold">مهندس الأمان والسلامة:</span>
                <span className="font-extrabold text-white text-xs">م. حسان عبد الله الحلبي</span>
              </div>

              <nav className="space-y-4">
                {Object.entries(navGroups).map(([groupName, items]: any) => (
                  <div key={groupName} className="space-y-0.5">
                    <h3 className="text-[10px] font-bold text-white/50 px-2 tracking-wider mb-1">
                      {groupName}
                    </h3>
                    {items.map((item: any) => {
                      const Icon = item.icon;
                      const isActive = currentModule === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setCurrentModule(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-right font-bold text-[11px] transition-all border-r-4 ${
                            isActive
                              ? "bg-white/10 text-white border-brand-warning"
                              : "text-white/80 hover:bg-white/5 border-transparent"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Central Workspace Window */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0 print:p-0 print:bg-white">
          {renderModuleContent()}
        </main>
      </div>

      {/* Footer / Standard Civil Note */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 print:hidden text-center text-[10px] text-gray-400 font-sans">
        منصة أدوات مهندس المرور © {new Date().getFullYear()} م. حسان الحلبي. متجاوب بالكامل وتدقيق المعادلات قائم استناداً لكود الطرق السعودي العام.
      </footer>
    </div>
  );
}
