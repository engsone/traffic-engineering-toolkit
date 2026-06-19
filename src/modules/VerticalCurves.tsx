/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { CalculationRecord } from "../types";
import { Copy, Save, RotateCcw, Check, ArrowRightLeft, Compass } from "lucide-react";

interface Props {
  onSaveCalculation: (calc: Omit<CalculationRecord, "id" | "timestamp">) => void;
}

// Recommended K factors according to SRC-301 (AASHTO)
const RECOMMENDED_K_VALUES: Record<number, { crest: number; sag: number }> = {
  40: { crest: 4, sag: 10 },
  50: { crest: 11, sag: 17 },
  60: { crest: 17, sag: 17 },
  70: { crest: 23, sag: 20 },
  80: { crest: 30, sag: 26 },
  90: { crest: 38, sag: 33 },
  105: { crest: 45, sag: 45 },
  120: { crest: 95, sag: 66 },
  130: { crest: 120, sag: 82 },
  140: { crest: 150, sag: 95 }
};

export default function VerticalCurves({ onSaveCalculation }: Props) {
  const [g1, setG1] = useState<number>(3.0); // +3%
  const [g2, setG2] = useState<number>(-1.0); // -1%
  const [kFactor, setKFactor] = useState<number>(30); // vertical curve coefficient K
  const [curveType, setCurveType] = useState<"crest" | "sag">("crest");
  const [designSpeed, setDesignSpeed] = useState<number>(80);

  const [saved, setSaved] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Auto-fill K factor from recommendations table based on speed & type
  useEffect(() => {
    const recRow = RECOMMENDED_K_VALUES[designSpeed];
    if (recRow) {
      setKFactor(curveType === "crest" ? recRow.crest : recRow.sag);
    }
  }, [designSpeed, curveType]);

  // Calculations
  const aDifference = Math.abs(g1 - g2);
  const calculatedLength = kFactor * aDifference;

  const handleCopy = () => {
    const text = `حساب المنحنيات الرأسية التأسيسية:
- ميل الدخول (g1) = ${g1 > 0 ? "+" : ""}${g1}%
- ميل الخروج (g2) = ${g2 > 0 ? "+" : ""}${g2}%
- الفرق الجبري للميول (A) = ${aDifference}%
- نوع الانحناء = ${curveType === "crest" ? "محدب (Crest)" : "مقعر (Sag)"
}
- معامل الموازنة الرأسي (K) = ${kFactor}
- الطول الأدنى لمنحنى الرأس الرأسي (L = K × A) = ${calculatedLength.toFixed(2)} م
- كود الطرق السعودي 301`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setG1(3.0);
    setG2(-1.0);
    setKFactor(30);
    setCurveType("crest");
    setDesignSpeed(80);
    setSaved(false);
  };

  const handleSave = () => {
    onSaveCalculation({
      calculatorId: "vertical_curves",
      calculatorName: "حساب المنحنيات الرأسية (Vertical Curves)",
      inputs: {
        "ميل الدخول (g1) %": g1,
        "ميل الخروج (g2) %": g2,
        "الفرق الجبري (A) %": aDifference,
        "معامل المنحنى (K)": kFactor,
        "فئة منحني رأسي": curveType === "crest" ? "محدب" : "مقعر",
      },
      results: {
        "الطول الأدنى للمنحنى (L) م": calculatedLength.toFixed(2),
      },
      units: {
        "الطول الأدنى للمنحنى (L) م": "m",
      },
      notes: `تصميم الطول الرأسي لفرق ميول ${aDifference}% وسرعة تصميمية ${designSpeed} كم/ساعة. كود 301.`,
      isSafe: calculatedLength > 0,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div id="vertical-curves-module" className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-brand-primary mb-2">منظومة تصميم المنحنيات الرأسية (Vertical Curves)</h2>
        <p className="text-brand-muted text-sm leading-relaxed mb-6">
          توفر هذه الحاسبة التحديد الهندسي لـ <strong>طول المنحنى الجانبي الرأسي (L)</strong> المطلوب للتوفيق والدوران الرأسي الآمن بين ميول متباينة عند القمم والوديان على محاور الجبال والطرق السريعة لمقاومة الارتطام بالأسفل.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 border-r-4 border-brand-primary pr-3 text-sm">منظومة إدخال الميول والسرعة</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  ميل الدخول الطولي (g₁)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={g1}
                    onChange={(e) => {
                      setG1(parseFloat(e.target.value) || 0);
                      setSaved(false);
                    }}
                    className="w-full text-left font-mono text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-brand-primary outline-none"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-gray-400 font-sans pointer-events-none">%</span>
                </div>
                <span className="text-[9px] text-gray-400 font-sans block mt-0.5">مثال: +3.0 للصعود</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  ميل الخروج الطولي (g₂)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={g2}
                    onChange={(e) => {
                      setG2(parseFloat(e.target.value) || 0);
                      setSaved(false);
                    }}
                    className="w-full text-left font-mono text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-brand-primary outline-none"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-gray-400 font-sans pointer-events-none">%</span>
                </div>
                <span className="text-[9px] text-gray-400 font-sans block mt-0.5">مثال: -1.0 للهبوط</span>
              </div>
            </div>

            {/* Curve Type Selector */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                فئة الانحناء الرأسي الفعلي للموقع
              </label>
              <div className="flex gap-4">
                <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg flex-1">
                  <input
                    type="radio"
                    name="curvetype"
                    checked={curveType === "crest"}
                    onChange={() => {
                      setCurveType("crest");
                      setSaved(false);
                    }}
                    className="w-4 h-4 text-brand-primary"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">قمة محدبة (Crest)</span>
                    <span className="text-[9px] text-gray-400 font-sans">تحد من مسافة الرؤية الأمامية للسلامة</span>
                  </div>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg flex-1">
                  <input
                    type="radio"
                    name="curvetype"
                    checked={curveType === "sag"}
                    onChange={() => {
                      setCurveType("sag");
                      setSaved(false);
                    }}
                    className="w-4 h-4 text-brand-primary"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">قاع مقعر (Sag)</span>
                    <span className="text-[9px] text-gray-400 font-sans">تتحكم فيها راحة الركاب وإضاءة الأنوار ليلًا</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Design Speed and K coefficient view */}
            <div className="grid grid-cols-2 gap-4 pb-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  السرعة التصميمية للمقاس (كم/س)
                </label>
                <select
                  value={designSpeed}
                  onChange={(e) => {
                    setDesignSpeed(parseInt(e.target.value));
                    setSaved(false);
                  }}
                  className="w-full text-xs border border-gray-300 rounded bg-white p-1.5 focus:ring-1 focus:ring-brand-primary outline-none"
                >
                  <option value="40">40 كم/ساعة</option>
                  <option value="50">50 كم/ساعة</option>
                  <option value="60">60 كم/ساعة</option>
                  <option value="70">70 كم/ساعة</option>
                  <option value="80">80 كم/ساعة</option>
                  <option value="90">90 كم/ساعة</option>
                  <option value="105">105 كم/ساعة</option>
                  <option value="120">120 كم/ساعة</option>
                  <option value="130">130 كم/ساعة</option>
                  <option value="140">140 كم/ساعة</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  معامل المنحنى الكلي (K)
                </label>
                <input
                  type="number"
                  value={kFactor}
                  onChange={(e) => {
                    setKFactor(Math.max(1, parseFloat(e.target.value) || 0));
                    setSaved(false);
                  }}
                  className="w-full text-left font-mono text-xs border border-gray-300 rounded p-1.5 outline-none"
                />
                <span className="text-[9px] text-gray-400 mt-0.5 block">معايير K = L / A</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 rounded border border-gray-205 hover:bg-gray-100 text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-brand-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>نسخ المعادلة</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 rounded border border-gray-205 hover:bg-gray-100 text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-primary text-white rounded hover:bg-opacity-90 text-xs transition-all mr-auto shadow-sm font-semibold"
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>حفظ النتيجة بالسجل</span>
              </button>
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 text-base">تحليل مخرجات الميول الرأسية</h3>

              {/* Difference A */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                <div>
                  <div className="font-semibold text-gray-850 text-xs text-right">الفرق الجبري للميول (A)</div>
                  <div className="text-[9px] text-gray-400 font-mono">A = |g₁ - g₂|</div>
                </div>
                <div className="text-left bg-brand-warning/10 px-2 py-1 rounded">
                  <span className="font-mono text-base font-bold text-brand-warning">{aDifference.toFixed(1)}</span>
                  <span className="text-[10px] text-brand-warning font-semibold mr-1">%</span>
                </div>
              </div>

              {/* L calculation result */}
              <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm space-y-2">
                <div className="text-xs text-brand-muted font-bold">الطول الأدنى المطلوب للمنحنى الرأسي (L):</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-mono font-bold text-brand-primary">{calculatedLength.toFixed(2)}</span>
                  <span className="text-sm font-bold text-gray-500">متر (m)</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-snug pt-1 border-t border-slate-50 font-sans">
                  يعتمد بالأساس على المعادلة: <span className="font-mono text-slate-700 font-bold">L = K × A</span> بهدف حماية أسفل المركبات ومقابلة خط الرادار لراحة القيادة.
                </p>
              </div>
            </div>

            {/* Explanatory layout for algebraic difference example */}
            <div className="bg-brand-primary/5 p-3 rounded border border-brand-primary/10 text-[11px] text-gray-700 space-y-1 font-sans">
              <span className="font-bold text-brand-primary block">مثال حسابي توضيحي للكود:</span>
              <span>إذا كان ميل الدخول الطولي <span className="font-mono font-bold text-slate-800">+3%</span> وميل الخروج هابطاً بـ <span className="font-mono font-bold text-slate-800">-1%</span>، فإن الفرق الجبري للميول يعطى بـ: <span className="font-mono font-bold text-brand-primary text-xs">|3 - (-1)| = 4%</span>.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended K factor values based on speed table */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3 border-r-4 border-brand-secondary pr-2">
          <Compass className="w-5 h-5 text-brand-secondary" />
          <h4 className="font-bold text-gray-800 text-sm">العتبات التصميمية لمعيار K الموصى بها (كود 301 / AASHTO)</h4>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          يعد K هو المسافة اللازمة لتغير الميل الرأسي بنسبة 1%، ويحدد قيمته لضمان الأمان البصري ومسافات التوقف الكافية ليلًا:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-gray-500 font-semibold">
                <th className="p-2 text-right">السرعة التصميمية للطريق (كم/س)</th>
                <th className="p-2 text-brand-primary">معامل المنحنى المحدب القمة (K Crest)</th>
                <th className="p-2 text-brand-danger">معامل المنحنى المقعر القاع (K Sag)</th>
                <th className="p-2">ملاحظة الكود الميدانية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono text-gray-700">
              {Object.keys(RECOMMENDED_K_VALUES).map((spdStr) => {
                const spd = parseInt(spdStr);
                const val = RECOMMENDED_K_VALUES[spd];
                const isSelected = spd === designSpeed;

                return (
                  <tr key={spd} className={`hover:bg-slate-50 ${isSelected ? "bg-brand-primary/5 font-semibold" : ""}`}>
                    <td className="p-2 text-right font-sans font-bold text-slate-900">{spd} كم/ساعة</td>
                    <td className="p-2 text-brand-primary font-bold">{val.crest}</td>
                    <td className="p-2 text-brand-danger font-bold">{val.sag}</td>
                    <td className="p-2 text-right font-sans text-gray-500 text-[10px]">
                      {spd >= 120 ? "سرعة طريق حرة سريعة" : "شوارع حضرية وتجميعية"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
