/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ROADSIDE_DESIGN_LOOKUP, BASE_CLEAR_ZONE_TABLE } from "../data/lookupTables";
import { CalculationRecord } from "../types";
import { Copy, Save, RotateCcw, Check, AlertTriangle, HelpCircle, Shield } from "lucide-react";

interface Props {
  onSaveCalculation: (calc: Omit<CalculationRecord, "id" | "timestamp">) => void;
}

export default function DividedBarrier({ onSaveCalculation }: Props) {
  // Speed selection to auto-select defaults
  const [speed, setSpeed] = useState<number>(100);
  const [barrierType, setBarrierType] = useState<"steel" | "concrete">("steel");
  
  // Inputs
  const [lh, setLh] = useState<number>(6.0); // Lateral distance to hazard
  const [lr, setLr] = useState<number>(130); // Runout length
  const [l1, setL1] = useState<number>(10);  // Tangent rail length
  const [l2, setL2] = useState<number>(1.5); // Barrier offset
  const [flareRatio, setFlareRatio] = useState<number>(15); // Flare rate (e.g. 15 for 1:15)
  const [l0, setL0] = useState<number>(30);  // Hazard length
  const [terminalLength, setTerminalLength] = useState<number>(3.80); // Terminal length (Crashworthy Terminal)
  const [lc, setLc] = useState<number>(7.5); // Clear Zone width

  const [saved, setSaved] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Auto-fill from lookup tables on speed or barrier type change
  useEffect(() => {
    const config = ROADSIDE_DESIGN_LOOKUP.find(r => r.speed === speed);
    if (config) {
      setLr(config.lr);
      setFlareRatio(barrierType === "steel" ? config.steel_flare : config.concrete_flare);
      
      // Approximate Clear zone LC based on 4:1 slope for speed
      const speedStr = speed.toString() as "50" | "60" | "80" | "100" | "110" | "120" | "130" | "140";
      const lcVal = BASE_CLEAR_ZONE_TABLE.slope_4_1[speedStr] || 6.5;
      setLc(lcVal);
    }
  }, [speed, barrierType]);

  // Calculations
  const flareFraction = 1 / flareRatio;

  // A. With Flare Back
  // Formula: L = [LH + (b/a)(L1) - L2] / [(b/a) + (LH/LR)]
  // To avoid divide by zero, check denom
  const denomWithFlare = flareFraction + (lh / lr);
  const lWithFlare = denomWithFlare > 0 ? (lh + (flareFraction * l1) - l2) / denomWithFlare : 0;
  const yWithFlare = (lh / lr) * lWithFlare;

  // B. Without Flare Back
  // Formula: L = (LH - L2) * (LR / LH)
  const lNoFlare = lh > 0 ? (lh - l2) * (lr / lh) : 0;

  // D. Total barrier length (using the flared calculation by default as conservative or let user choose)
  // Lt = L0 + Crashworthy Terminal + L
  const ltWithFlare = l0 + terminalLength + Math.max(0, lWithFlare);
  const ltNoFlare = l0 + terminalLength + Math.max(0, lNoFlare);

  // E. Special Case: LH >= LC (hazard lies outside the Clear Zone buffer, or we must limit calculation boundary to LC)
  const isLhExceedsLc = lh >= lc;
  const denomSpecial = flareFraction + (lc / lr);
  const lSpecial = denomSpecial > 0 ? (lc + (flareFraction * l1) - l2) / denomSpecial : 0;
  const ySpecial = (lc / lr) * lSpecial;
  const ltSpecial = l0 + terminalLength + Math.max(0, lSpecial);

  // Active inputs used for the final safe report
  const finalL = isLhExceedsLc ? lSpecial : lWithFlare;
  const finalY = isLhExceedsLc ? ySpecial : yWithFlare;
  const finalLt = isLhExceedsLc ? ltSpecial : ltWithFlare;

  const handleCopy = () => {
    const text = `تصميم حواجز الحماية الجانبية (الطرق السريعة والمزدوجة) - السرعة ${speed} كم/ساعة:
1. طول الحماية الفعلي مع برم مائل (L) = ${lWithFlare.toFixed(2)} م
- إزاحة نهاية الحاجز (Y) = ${yWithFlare.toFixed(2)} م
2. طول الحماية بدون برم مائل (L) = ${lNoFlare.toFixed(2)} م (يتطلب نهاية ماصة للصدمات)
3. الطول الكلي المطلوب للحاجز (Lt) = ${finalLt.toFixed(2)} م
4. حالة تجاوز خلوص الأمان (LH >= LC): ${isLhExceedsLc ? `نعم (LH = ${lh}م >= LC = ${lc}م) وتم تعديل المدخلات` : "لا"}
- كود الطرق السعودي 305`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSpeed(100);
    setLh(6.0);
    setL0(30);
    setTerminalLength(12);
    setL1(10);
    setL2(1.5);
    setSaved(false);
  };

  const handleSave = () => {
    onSaveCalculation({
      calculatorId: "divided_barrier",
      calculatorName: "حواجز الطريق المزدوج والسريع (Length of Need)",
      inputs: {
        "السرعة التصميمية كم/ساعة": speed,
        "إزاحة العائق (LH) م": lh,
        "طول الانحراف (LR) م": lr,
        "طول الحاجز الموازي (L1) م": l1,
        "إزاحة الحاجز (L2) م": l2,
        "معدل الانحراف المائل (b/a)": `1:${flareRatio}`,
        "طول العائق (L0) م": l0,
        "عرض حرم الأمان (LC) م": lc,
      },
      results: {
        "طول الحماية المقترح (L) م": finalL.toFixed(2),
        "إزاحة نقطة البداية (Y) م": finalY.toFixed(2),
        "إجمالي طول الحاجز (Lt) م": finalLt.toFixed(2),
      },
      units: {
        "طول الحماية المقترح (L) م": "m",
        "إزاحة نقطة البداية (Y) م": "m",
        "إجمالي طول الحاجز (Lt) م": "m",
      },
      notes: `تصميم حواجز السلامة لطريق سريع مزدوج سرعة ${speed} كم/ساعة. معالجة حالة LH >= LC بشكل آمن تلقائياً. كود 305.`,
      isSafe: finalL > 0,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div id="divided-barrier-module" className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-brand-primary/10 p-2 rounded-lg text-brand-primary">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-brand-primary">تصميم حواجز الحماية المعدنية للأكتاف — طرق سريعة ومزدوجة</h2>
        </div>
        <p className="text-brand-muted text-sm leading-relaxed">
          يوفر هذا الموديل الحسابات الدقيقة لتحديد <strong>طول الحاجز الفعلي المطلوب للحماية (Length of Need)</strong> وطرق الانحراف المائل للخلف (Flare Back) لتغطية العوائق الصلبة على جوانب الطرق، تماشياً مع الكود السعودي 305 وكتيب آشتو لتصميم جوانب الطرق الآمنة.
        </p>

        {/* Quick parameters selector */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="col-span-full text-[11px] font-bold text-gray-500 mb-1 pr-1">تعبئة سريعة من جداول الكود حسب السرعة التصميمية:</div>
          {[50, 60, 80, 100, 110, 120, 130, 140].map((spd) => (
            <button
              key={spd}
              onClick={() => {
                setSpeed(spd);
                setSaved(false);
              }}
              className={`py-1.5 px-2 text-xs font-mono font-bold rounded border transition-all ${
                speed === spd
                  ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {spd} كم/س
            </button>
          ))}
        </div>
      </div>

      {/* Inputs & Schema Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Equations and parameters explanations */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800 text-sm border-r-4 border-brand-secondary pr-3">المصطلحات الفنية المعتمدة</h3>
          
          <div className="space-y-3 text-xs text-gray-600 leading-relaxed font-sans">
            <div>
              <span className="font-mono font-bold text-brand-primary">LH (Lateral Distance):</span> المسافة من الخط الأصفر الى أبعد نقطه للعائق (LH).
            </div>
            <div>
              <span className="font-mono font-bold text-brand-primary">LR (Runout Length):</span> مسافة وصول المركبة للعائق (مسافة الانحراف التصميمية لخروج السيارة عن المسار).
            </div>
            <div>
              <span className="font-mono font-bold text-brand-primary">L1 (Tangent Rail):</span> الجزء المستقيم قبل الحاجز (طول الجزء المستقيم المتصل قبل بدء انحراف الحاجز).
            </div>
            <div>
              <span className="font-mono font-bold text-brand-primary">L2 (Barrier Offset):</span> المسافة من الخط الأصفر (خط الحافة) إلى وجه الحاجز (L2).
            </div>
            <div>
              <span className="font-mono font-bold text-brand-primary">b/a (Flare Rate):</span> نسبة انحراف الحاجز a:b (معدل انحراف الحاجز التدريجي لتأمين البدايات ببطء).
            </div>
            <div>
              <span className="font-mono font-bold text-brand-primary">L0 (Hazard Length):</span> الطول الطولي للعائق الموازي لخط سير السيارات م.
            </div>
            <div>
              <span className="font-mono font-bold text-brand-primary">LC (Clear Zone):</span> عرض منطقة الأمان Clear Zone (LC) المفترضة الخالية من العوائق الصلبة تماماً.
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs text-brand-muted leading-relaxed">
            <span className="font-bold text-gray-700">المعادلة القياسية بالانحراف المائل (Flare Back):</span>
            <div className="bg-slate-50 p-2 rounded text-center font-mono font-bold text-brand-primary mt-1 text-[11px] ltr">
              L = [LH + (b/a)(L1) - L2] / [(b/a) + (LH/LR)]
            </div>
          </div>
        </div>

        {/* Inputs panel */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 text-base mb-4">مدخلات حساب طول الحماية</h3>

          {/* Barrier Type Selection */}
          <div className="mb-5 bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-brand-primary" />
              <span>نوع حاجز الحماية للكتف (Barrier Type):</span>
            </span>
            <div className="flex bg-white rounded border p-0.5 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setBarrierType("steel");
                  setSaved(false);
                }}
                className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                  barrierType === "steel"
                    ? "bg-brand-primary text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                معدني (Metal)
              </button>
              <button
                type="button"
                onClick={() => {
                  setBarrierType("concrete");
                  setSaved(false);
                }}
                className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                  barrierType === "concrete"
                    ? "bg-brand-primary text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                خرساني (Concrete)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                المسافة من الخط الأصفر الى أبعد نقطه للعائق (LH) م
              </label>
              <input
                type="number"
                step="0.1"
                value={lh}
                onChange={(e) => {
                  setLh(Math.max(0.1, parseFloat(e.target.value) || 0));
                  setSaved(false);
                }}
                className="w-full text-left font-mono text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-brand-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                مسافة وصول المركبة للعائق (LR) م
              </label>
              <input
                type="number"
                step="5"
                value={lr}
                onChange={(e) => {
                  setLr(Math.max(1, parseFloat(e.target.value) || 0));
                  setSaved(false);
                }}
                className="w-full text-left font-mono text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-brand-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                الجزء المستقيم قبل الحاجز (L1) م
              </label>
              <input
                type="number"
                step="1"
                value={l1}
                onChange={(e) => {
                  setL1(Math.max(0, parseFloat(e.target.value) || 0));
                  setSaved(false);
                }}
                className="w-full text-left font-mono text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-brand-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                المسافة من الخط الأصفر (خط الحافة) إلى وجه الحاجز (L2) م
              </label>
              <input
                type="number"
                step="0.1"
                value={l2}
                onChange={(e) => {
                  setL2(Math.max(0, parseFloat(e.target.value) || 0));
                  setSaved(false);
                }}
                className="w-full text-left font-mono text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-brand-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                نسبة انحراف الحاجز a:b
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  value={flareRatio}
                  onChange={(e) => {
                    setFlareRatio(Math.max(1, parseInt(e.target.value) || 0));
                    setSaved(false);
                  }}
                  className="w-full text-left font-mono text-xs border border-gray-300 rounded px-2.5 py-1.5 pr-8 focus:ring-1 focus:ring-brand-primary outline-none"
                />
                <span className="absolute right-2.5 top-1.5 font-mono text-xs text-slate-400">1:</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                طول العائق الكلي (L0) م
              </label>
              <input
                type="number"
                step="5"
                value={l0}
                onChange={(e) => {
                  setL0(Math.max(1, parseFloat(e.target.value) || 0));
                  setSaved(false);
                }}
                className="w-full text-left font-mono text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-brand-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                طول نهاية ماص الصدمات المعدني م
              </label>
              <input
                type="number"
                step="1"
                value={terminalLength}
                onChange={(e) => {
                  setTerminalLength(Math.max(0, parseFloat(e.target.value) || 0));
                  setSaved(false);
                }}
                className="w-full text-left font-mono text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-brand-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                عرض منطقة الأمان Clear Zone (LC)
              </label>
              <input
                type="number"
                step="0.5"
                value={lc}
                onChange={(e) => {
                  setLc(Math.max(0.1, parseFloat(e.target.value) || 0));
                  setSaved(false);
                }}
                className="w-full text-left font-mono text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-brand-primary outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-700 rounded border border-gray-205 hover:bg-gray-100 text-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-brand-success" /> : <Copy className="w-3.5 h-3.5" />}
              <span>نسخ نتائج التصميم</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-500 rounded border border-gray-205 hover:bg-gray-100 text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ضبط الافتراضيات</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-4 py-1.5 bg-brand-primary text-white rounded hover:bg-opacity-90 text-xs transition-all mr-auto shadow-sm"
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saved ? "تم الحفظ" : "حفظ التصميم بالسجل"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Outputs and Warnings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Output A: With Flare Back */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">الحالة (أ): بالانحراف المائل (With Flare Back)</div>
          <div className="pt-2">
            <div className="text-xs text-gray-500">طول الحماية المطلوب (L)</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-mono font-bold text-slate-800">{lWithFlare > 0 ? lWithFlare.toFixed(2) : "0.00"}</span>
              <span className="text-xs text-gray-500">متر</span>
            </div>
          </div>
          <div className="pt-1">
            <div className="text-xs text-gray-500">مستوى الإزاحة الطرفية عند البداية (Y)</div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-mono font-bold text-brand-primary">{yWithFlare > 0 ? yWithFlare.toFixed(2) : "0.00"}</span>
              <span className="text-xs text-gray-500">متر</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-gray-500 leading-snug">
            يعيد توجيه المركبة تدريجياً لتقليل خطر الاصطدام المباشر بالحاجز.
          </div>
        </div>

        {/* Output B: Without Flare Back */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">الحالة (ب): بدون برم مائل (Without Flare Back)</div>
          <div className="pt-2">
            <div className="text-xs text-gray-500">طول الحماية الموازي تماماً السائد (L)</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-mono font-bold text-slate-800">{lNoFlare > 0 ? lNoFlare.toFixed(2) : "0.00"}</span>
              <span className="text-xs text-gray-500">متر</span>
            </div>
          </div>
          <div className="pt-1 text-[11px] bg-brand-danger/10 text-brand-danger p-2.5 rounded border border-brand-danger/20 flex gap-1.5 items-start">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span><strong>تحذير الكود:</strong> يجب تثبيت نهاية ماصة للصدمات معتمدة واجتياز اختبار السلامة (Crashworthy Terminal) لتفادي اختراق مقصورة الركاب.</span>
          </div>
        </div>

        {/* Output C: Special Case & Total length */}
        <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-200/60 space-y-3">
          <div className="text-xs font-bold text-brand-success uppercase tracking-wider">النظام الكلي المقترح وحالة حرم الطريق (LC)</div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600">هل العائق خارج الأمان الجانبي؟ (LH ≥ LC)</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isLhExceedsLc ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}>
                {isLhExceedsLc ? "نعم - فئة آمنة" : "لا - بداخل حرم الأمان"}
              </span>
            </div>
            
            {isLhExceedsLc && (
              <div className="text-[10px] text-brand-warning bg-amber-50 p-1.5 rounded leading-relaxed">
                تم استبدال LH بالقيمة العظمى لحرم الأمان LC ({lc}م) تلقائياً لترشيد طول الحاجز كما تنص مواصفات الكود.
              </div>
            )}

            <div className="pt-2 border-t border-dashed border-emerald-200">
              <div className="text-xs text-brand-success font-bold">الطول الإجمالي المعتمد للتوريد والتركيب (Lt):</div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-mono font-bold text-brand-success">{finalLt.toFixed(2)}</span>
                <span className="text-xs font-semibold text-brand-success">متر (m)</span>
              </div>
              <span className="text-[10px] text-slate-505 block mt-0.5 font-sans">معادلة المعيار: Lt = L0 + Terminal + L</span>
            </div>
          </div>
        </div>

      </div>

      {/* Speed Lookup lists */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm font-sans text-right">
        <h4 className="font-bold text-gray-800 text-xs mb-3 border-r-4 border-brand-secondary pr-2">جدول طول الانحراف LR ومعدل الانحراف الموصى به (الانحراف المائل Flare Back) - كود 305:</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-gray-500 font-bold">
                <th className="p-2.5 text-right font-sans">سرعة التصميم (كم/س)</th>
                <th className="p-2.5 font-sans justify-center">طول الانحراف LR (م)</th>
                <th className="p-2.5 font-sans justify-center">طول المستقيم LS (م)</th>
                <th className="p-2.5 font-sans justify-center">الانحراف المائل للحاجز المعدني (Steel Flare)</th>
                <th className="p-2.5 font-sans justify-center">الانحراف المائل للحاجز الخرساني (Concrete Flare)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono text-gray-700">
              {ROADSIDE_DESIGN_LOOKUP.map((row) => (
                <tr key={row.speed} className={`hover:bg-slate-50 transition-colors ${row.speed === speed ? "bg-brand-primary/5 font-bold text-brand-primary" : ""}`}>
                  <td className="p-2.5 text-right font-sans text-gray-950 font-semibold">{row.speed} كم/س</td>
                  <td className="p-2.5">{row.lr} م</td>
                  <td className="p-2.5">{row.ls} م</td>
                  <td className="p-2.5 text-brand-primary">{row.steel_flare}:1</td>
                  <td className="p-2.5 text-emerald-700 font-semibold">{row.concrete_flare}:1</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
