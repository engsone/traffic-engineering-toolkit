/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  ADT_BANDS,
  AdtBand,
  RUNOUT_LENGTH_TABLE,
  RUNOUT_SPEEDS,
  FLARE_RATE_TABLE,
  FLARE_SPEEDS,
  SHY_LINE_OFFSET,
  getRunoutLength,
  getFlareRate,
  getShyLine,
  BASE_CLEAR_ZONE_TABLE
} from "../data/lookupTables";
import { CalculationRecord } from "../types";
import BarrierLayoutDiagram from "../components/BarrierLayoutDiagram";
import BarrierTypesTable from "../components/BarrierTypesTable";
import { Copy, Save, RotateCcw, Check, AlertTriangle, Shield } from "lucide-react";

interface Props {
  onSaveCalculation: (calc: Omit<CalculationRecord, "id" | "timestamp">) => void;
}

export default function DividedBarrier({ onSaveCalculation }: Props) {
  // Speed selection to auto-select defaults
  const [speed, setSpeed] = useState<number>(100);
  const [barrierType, setBarrierType] = useState<"steel" | "concrete">("steel");
  const [adtBand, setAdtBand] = useState<AdtBand>("5000to10000");

  // Inputs
  const [lh, setLh] = useState<number>(6.0); // Lateral distance to hazard
  const [lr, setLr] = useState<number>(76);  // Runout length (auto from Table 5-10a)
  const [l1, setL1] = useState<number>(10);  // Tangent rail length
  const [l2, setL2] = useState<number>(1.5); // Barrier offset
  const [flareRatio, setFlareRatio] = useState<number>(26); // Flare rate (b in a:b)
  const [l0, setL0] = useState<number>(30);  // Hazard length
  const [terminalLength, setTerminalLength] = useState<number>(3.80); // Crashworthy Terminal
  const [lc, setLc] = useState<number>(6.5); // Clear Zone width

  const [lrInterpolated, setLrInterpolated] = useState<boolean>(false);
  const [flareLabel, setFlareLabel] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const ls = getShyLine(speed);

  // Auto-fill from AASHTO RSDG tables on speed / barrier type / ADT / L2 change
  useEffect(() => {
    const runout = getRunoutLength(speed, adtBand);
    setLr(runout.lr);
    setLrInterpolated(runout.interpolated);

    const shyLine = getShyLine(speed);
    const flare = getFlareRate(speed, barrierType, l2, shyLine);
    setFlareRatio(flare.rate);
    setFlareLabel(flare.labelAr);

    // Approximate Clear zone LC based on 4:1 slope for speed
    const speedStr = speed.toString() as "50" | "60" | "80" | "100" | "110" | "120" | "130" | "140";
    const lcVal = BASE_CLEAR_ZONE_TABLE.slope_4_1[speedStr] || 6.5;
    setLc(lcVal);
  }, [speed, barrierType, adtBand, l2]);

  // Calculations
  const flareFraction = 1 / flareRatio;

  // A. With Flare Back
  // Formula: L = [LH + (b/a)(L1) - L2] / [(b/a) + (LH/LR)]
  const denomWithFlare = flareFraction + (lh / lr);
  const lWithFlare = denomWithFlare > 0 ? (lh + (flareFraction * l1) - l2) / denomWithFlare : 0;
  const yWithFlare = (lh / lr) * lWithFlare;

  // B. Without Flare Back
  // Formula: L = (LH - L2) * (LR / LH)
  const lNoFlare = lh > 0 ? (lh - l2) * (lr / lh) : 0;

  // D. Total barrier length
  const ltWithFlare = l0 + terminalLength + Math.max(0, lWithFlare);
  const ltNoFlare = l0 + terminalLength + Math.max(0, lNoFlare);

  // E. Special Case: LH >= LC
  const isLhExceedsLc = lh >= lc;
  const denomSpecial = flareFraction + (lc / lr);
  const lSpecial = denomSpecial > 0 ? (lc + (flareFraction * l1) - l2) / denomSpecial : 0;
  const ySpecial = (lc / lr) * lSpecial;
  const ltSpecial = l0 + terminalLength + Math.max(0, lSpecial);

  const finalL = isLhExceedsLc ? lSpecial : lWithFlare;
  const finalY = isLhExceedsLc ? ySpecial : yWithFlare;
  const finalLt = isLhExceedsLc ? ltSpecial : ltWithFlare;

  const adtLabel = ADT_BANDS.find(b => b.key === adtBand)?.labelAr || "";

  const handleCopy = () => {
    const text = `تصميم حواجز الحماية الجانبية (الطرق السريعة والمزدوجة) - السرعة ${speed} كم/ساعة:
- حجم المرور اليومي ADT: ${adtLabel}
- طول الخروج LR = ${lr} م (جدول 5-10a${lrInterpolated ? " — قيمة مستوفاة بين سرعتين منصوصتين" : ""})
- خط النفور LS = ${ls} م (جدول 5-7)
- معدل الفلير 1:${flareRatio} — ${flareLabel} (جدول 5-9)
1. طول الحماية الفعلي مع برم مائل (L) = ${lWithFlare.toFixed(2)} م
- إزاحة نهاية الحاجز (Y) = ${yWithFlare.toFixed(2)} م
2. طول الحماية بدون برم مائل (L) = ${lNoFlare.toFixed(2)} م (يتطلب نهاية ماصة للصدمات)
3. الطول الكلي المطلوب للحاجز (Lt) = ${finalLt.toFixed(2)} م
4. حالة تجاوز خلوص الأمان (LH >= LC): ${isLhExceedsLc ? `نعم (LH = ${lh}م >= LC = ${lc}م) وتم تعديل المدخلات` : "لا"}
- المرجع: AASHTO Roadside Design Guide — الطبعة الرابعة 2011 (تصحيحات 2012 و2015)، القسم 5`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSpeed(100);
    setAdtBand("5000to10000");
    setLh(6.0);
    setL0(30);
    setTerminalLength(3.80);
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
        "حجم المرور اليومي ADT": adtLabel,
        "إزاحة العائق (LH) م": lh,
        "طول الخروج (LR) م": lr,
        "خط النفور (LS) م": ls,
        "طول الحاجز الموازي (L1) م": l1,
        "إزاحة الحاجز (L2) م": l2,
        "معدل الفلير (a:b)": `1:${flareRatio}`,
        "طول العائق (L0) م": l0,
        "عرض المنطقة الخالية (LC) م": lc,
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
      notes: `تصميم حواجز السلامة لطريق سريع مزدوج سرعة ${speed} كم/ساعة و ADT ${adtLabel}. معالجة حالة LH >= LC تلقائياً. المرجع: AASHTO RSDG الطبعة الرابعة — الجداول 5-7 و5-9 و5-10(a).`,
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
          يوفر هذا الموديل الحسابات الدقيقة لتحديد <strong>طول الحاجز الفعلي المطلوب للحماية (Length of Need)</strong> وطرق الانحراف المائل للخلف (Flare Back) لتغطية العوائق الصلبة على جوانب الطرق، وفق <strong>AASHTO Roadside Design Guide — الطبعة الرابعة 2011 (مع تصحيحات 2012 و2015)، القسم 5</strong>: الجداول 5-7 (خط النفور) و5-9 (معدلات الفلير) و5-10(a) (طول الخروج LR حسب السرعة وحجم المرور ADT معاً).
        </p>

        {/* Quick parameters selector */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="col-span-full text-[11px] font-bold text-gray-500 mb-1 pr-1">تعبئة سريعة من جداول AASHTO حسب السرعة التصميمية:</div>
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

        {/* ADT band selector — Table 5-10(a) requires traffic volume */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60">
          <div className="col-span-full text-[11px] font-bold text-amber-800 mb-1 pr-1">
            حجم المرور اليومي ADT — متغير أساسي في جدول 5-10(a) لتحديد طول الخروج LR:
          </div>
          {ADT_BANDS.map((band) => (
            <button
              key={band.key}
              onClick={() => {
                setAdtBand(band.key);
                setSaved(false);
              }}
              className={`py-1.5 px-2 text-[11px] font-semibold rounded border transition-all ${
                adtBand === band.key
                  ? "bg-brand-warning text-white border-brand-warning shadow-sm"
                  : "bg-white text-gray-700 border-amber-200 hover:bg-amber-50"
              }`}
            >
              {band.labelAr}
            </button>
          ))}
        </div>

        {/* Auto-derived values strip */}
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          <span className="bg-slate-100 border border-slate-200 rounded px-2.5 py-1 font-mono">
            LR = <b>{lr}</b> م {lrInterpolated && <span className="text-brand-warning font-sans font-bold">(مستوفى — السرعة غير منصوصة في 5-10a)</span>}
          </span>
          <span className="bg-slate-100 border border-slate-200 rounded px-2.5 py-1 font-mono">
            LS = <b>{ls}</b> م
          </span>
          <span className="bg-slate-100 border border-slate-200 rounded px-2.5 py-1 font-mono">
            الفلير 1:<b>{flareRatio}</b> <span className="font-sans text-gray-600">({flareLabel})</span>
          </span>
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
              <span className="font-mono font-bold text-brand-primary">LR (Runout Length):</span> طول الخروج — من جدول 5-10(a) حسب السرعة وحجم المرور ADT معاً.
            </div>
            <div>
              <span className="font-mono font-bold text-brand-primary">LS (Shy Line):</span> إزاحة خط النفور — من جدول 5-7. إذا كان L2 أقل من LS فالحاجز داخل خط النفور ويُستخدم عمود الفلير الأول.
            </div>
            <div>
              <span className="font-mono font-bold text-brand-primary">L1 (Tangent Rail):</span> الجزء المستقيم قبل الحاجز (طول الجزء المستقيم المتصل قبل بدء انحراف الحاجز).
            </div>
            <div>
              <span className="font-mono font-bold text-brand-primary">L2 (Barrier Offset):</span> المسافة من الخط الأصفر (خط الحافة) إلى وجه الحاجز (L2).
            </div>
            <div>
              <span className="font-mono font-bold text-brand-primary">b/a (Flare Rate):</span> معدل الفلير من جدول 5-9 — ثلاثة أعمدة: داخل خط النفور / صلب / شبه صلب.
            </div>
            <div>
              <span className="font-mono font-bold text-brand-primary">L0 (Hazard Length):</span> الطول الطولي للعائق الموازي لخط سير السيارات م.
            </div>
            <div>
              <span className="font-mono font-bold text-brand-primary">LC (Clear Zone):</span> عرض المنطقة الخالية Clear Zone (LC) المفترضة الخالية من العوائق الصلبة تماماً.
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
                معدني شبه صلب (Semi-Rigid)
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
                خرساني صلب (Rigid)
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
                طول الخروج (LR) م — تلقائي من جدول 5-10a
              </label>
              <input
                type="number"
                step="1"
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
              <div className="text-[10px] text-gray-500 mt-0.5">
                {l2 < ls ? `L2 < LS (${ls}م) → الحاجز داخل خط النفور` : `L2 ≥ LS (${ls}م) → عند/خارج خط النفور`}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                معدل الفلير a:b — تلقائي من جدول 5-9
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
                عرض المنطقة الخالية Clear Zone (LC)
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
            <span><strong>تحذير:</strong> يجب تثبيت نهاية ماصة للصدمات معتمدة واجتياز اختبار السلامة (Crashworthy Terminal) لتفادي اختراق مقصورة الركاب.</span>
          </div>
        </div>

        {/* Output C: Special Case & Total length */}
        <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-200/60 space-y-3">
          <div className="text-xs font-bold text-brand-success uppercase tracking-wider">النظام الكلي المقترح وحالة المنطقة الخالية (LC)</div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600">هل العائق خارج الأمان الجانبي؟ (LH ≥ LC)</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isLhExceedsLc ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}>
                {isLhExceedsLc ? "نعم - فئة آمنة" : "لا - بداخل حرم الأمان"}
              </span>
            </div>

            {isLhExceedsLc && (
              <div className="text-[10px] text-brand-warning bg-amber-50 p-1.5 rounded leading-relaxed">
                تم استبدال LH بالقيمة العظمى للمنطقة الخالية LC ({lc}م) تلقائياً لترشيد طول الحاجز وفق AASHTO RSDG.
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

      {/* AASHTO lookup tables */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm font-sans text-right space-y-6">
        <div>
          <h4 className="font-bold text-gray-800 text-xs mb-3 border-r-4 border-brand-secondary pr-2">
            الجدول 5-10(a) — طول الخروج LR بالمتر حسب السرعة وحجم المرور ADT — AASHTO RSDG الطبعة الرابعة:
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-gray-500 font-bold">
                  <th className="p-2.5 text-right font-sans">السرعة (كم/س)</th>
                  {ADT_BANDS.map((band) => (
                    <th key={band.key} className={`p-2.5 font-sans ${band.key === adtBand ? "bg-brand-warning/15 text-brand-warning" : ""}`}>
                      {band.labelAr}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-gray-700">
                {[...RUNOUT_SPEEDS].sort((a, b) => b - a).map((spd) => (
                  <tr key={spd} className={`hover:bg-slate-50 transition-colors ${spd === speed ? "bg-brand-primary/5 font-bold text-brand-primary" : ""}`}>
                    <td className="p-2.5 text-right font-sans text-gray-950 font-semibold">{spd} كم/س</td>
                    {ADT_BANDS.map((band) => (
                      <td key={band.key} className={`p-2.5 ${spd === speed && band.key === adtBand ? "bg-brand-warning/20 font-extrabold rounded" : ""}`}>
                        {RUNOUT_LENGTH_TABLE[spd][band.key]} م
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 text-xs mb-3 border-r-4 border-brand-secondary pr-2">
            الجدولان 5-7 (خط النفور LS) و5-9 (معدلات الفلير القصوى a:b) — AASHTO RSDG الطبعة الرابعة:
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-gray-500 font-bold">
                  <th className="p-2.5 text-right font-sans">السرعة (كم/س)</th>
                  <th className="p-2.5 font-sans">خط النفور LS (م)</th>
                  <th className="p-2.5 font-sans">داخل خط النفور</th>
                  <th className="p-2.5 font-sans">حاجز صلب (خرساني) عند/خارج الخط</th>
                  <th className="p-2.5 font-sans">حاجز شبه صلب (معدني) عند/خارج الخط</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-gray-700">
                {[...FLARE_SPEEDS].sort((a, b) => b - a).map((spd) => (
                  <tr key={spd} className={`hover:bg-slate-50 transition-colors ${spd === speed ? "bg-brand-primary/5 font-bold text-brand-primary" : ""}`}>
                    <td className="p-2.5 text-right font-sans text-gray-950 font-semibold">{spd} كم/س</td>
                    <td className="p-2.5">{SHY_LINE_OFFSET[spd]} م</td>
                    <td className="p-2.5">{FLARE_RATE_TABLE[spd].insideShy}:1</td>
                    <td className="p-2.5 text-emerald-700 font-semibold">{FLARE_RATE_TABLE[spd].rigid}:1</td>
                    <td className="p-2.5 text-brand-primary">{FLARE_RATE_TABLE[spd].semiRigid}:1</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
            القاعدة: إذا كانت إزاحة الحاجز L2 أقل من خط النفور LS فالحاجز داخل خط النفور ويُستخدم العمود الأول. وللسرعات فوق 110 كم/س تُستخدم قيم صف 110 (أعلى صف منصوص في الجدول 5-9). المصدر: AASHTO Roadside Design Guide، الطبعة الرابعة 2011 (تصحيحات 2012 و2015)، القسم 5.
          </p>
        </div>
      </div>
      {/* إضافات بصرية مرجعية (لا تؤثر على الحسابات) */}
      <BarrierLayoutDiagram lh={lh} lr={lr} l1={l1} l2={l2} l0={l0} terminal={terminalLength} lc={lc} L={finalL} Y={finalY} Lt={finalLt} isLhExceedsLc={isLhExceedsLc} />
      <BarrierTypesTable />
    </div>
  );
}
