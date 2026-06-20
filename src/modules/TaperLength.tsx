/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TAPER_SPEED_RECOMMENDATIONS } from "../data/lookupTables";
import { CalculationRecord } from "../types";
import { AlertTriangle, Copy, Save, RotateCcw, Check, HelpCircle } from "lucide-react";

interface Props {
  onSaveCalculation: (calc: Omit<CalculationRecord, "id" | "timestamp">) => void;
}

export default function TaperLength({ onSaveCalculation }: Props) {
  const [w, setW] = useState<number>(3.65);
  const [s, setS] = useState<number>(80);
  const [saved, setSaved] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Formulas
  const lHighSpeed = (w * s) / 1.61;
  const recommendedValue = lHighSpeed;

  const handleCopy = () => {
    const text = `حساب طول المنطقة الانتقالية (Taper Length):\n- عرض الإزاحة (W) = ${w} م\n- السرعة (S) = ${s} كم/ساعة\n- المعادلة المعتمدة (S >= 70): L = ${lHighSpeed.toFixed(2)} م\n- القيمة الموصى بها = ${recommendedValue.toFixed(2)} م\n- مرجع: كود الطرق السعودي 401`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setW(3.65);
    setS(80);
    setSaved(false);
  };

  const handleSave = () => {
    onSaveCalculation({
      calculatorId: "taper_length",
      calculatorName: "طول المنطقة الانتقالية (Taper Length)",
      inputs: {
        "عرض الإزاحة (W) م": w,
        "السرعة (S) كم/ساعة": s,
      },
      results: {
        "الموصى به (L) م": recommendedValue.toFixed(2),
        "معادلة السرعات م": lHighSpeed.toFixed(2),
      },
      units: {
        "الموصى به (L) م": "m",
        "معادلة السرعات م": "m",
      },
      notes: `سرعة ${s} كم/ساعة، استخدام معادلة السرعات لـ 70 كم/س فأكثر. المرجع: كود الطرق السعودي 401.`,
      isSafe: true,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div id="taper-length-module" className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-brand-primary mb-2">حساب طول المنطقة الانتقالية (Taper Length)</h2>
        <p className="text-brand-muted text-sm leading-relaxed mb-6">
          يستخدم هذا الحساب لتحديد الطول الأدنى للمنطقة الانتقالية لتوزيع حركة المرور بأمان عند حدوث ضيق في حارة السير أو إزاحة جانبية في مواقع العمل المؤقتة طبقاً للكود السعودي وبحسب السرعة التصميمية للموقع.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs Panel */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 border-r-4 border-brand-primary pr-3 text-base">منظومة البيانات المدخلة</h3>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                عرض الإزاحة الجانبية (W) - بالمتر
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  value={w}
                  onChange={(e) => {
                    setW(Math.max(0.1, parseFloat(e.target.value) || 0));
                    setSaved(false);
                  }}
                  className="w-full text-left font-mono border border-gray-300 rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                />
                <span className="absolute right-3 top-2 text-xs text-gray-500 font-sans pointer-events-none">متر m</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">عادة ما يتراوح بين 3.0م إلى 3.65م لعرض حارات المرور القياسية بالمملكة.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                السرعة التصميمية / التشغيلية للموقع (S) - كم/ساعة
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="5"
                  value={s}
                  onChange={(e) => {
                    setS(Math.max(1, parseInt(e.target.value) || 0));
                    setSaved(false);
                  }}
                  className="w-full text-left font-mono border border-gray-300 rounded-lg px-3 py-2 pr-16 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                />
                <span className="absolute right-3 top-2 text-xs text-gray-500 font-sans pointer-events-none">كم/ساعة km/h</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-brand-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "تم النسخ" : "نسخ النتائج"}</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-500 rounded-lg border border-gray-200 hover:bg-gray-100 text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-opacity-90 text-xs transition-all mr-auto shadow-sm"
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{saved ? "تم الحفظ بالسجل" : "حفظ الحساب"}</span>
              </button>
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 text-base">مخرجات الحساب الفني</h3>
              
              <div className="space-y-4">
                {/* Proposed Output */}
                <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <div className="text-xs text-brand-muted mb-1 font-bold">الطول المقترح للمنطقة الانتقالية (L)</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-mono font-bold text-brand-primary">{recommendedValue.toFixed(2)}</span>
                    <span className="text-sm font-semibold text-gray-500">متر (m)</span>
                  </div>
                  <div className="mt-2 text-[11px] text-gray-500 leading-snug flex items-center gap-1">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-brand-success"></span>
                    <span>
                      القيمة المعتمدة بناء على معادلة السرعات 70 كم/ساعة فأكثر
                    </span>
                  </div>
                </div>

                {/* Detailed Formulas */}
                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-lg">
                  <div className="text-xs font-bold text-brand-primary">المعادلة المطبقة (للسرعات 70 كم/س فأكثر):</div>
                  <div className="text-[12px] font-mono text-gray-600 mt-1">L = (W × S) / 1.61</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-1">{lHighSpeed.toFixed(2)} م</div>
                </div>
              </div>
            </div>

            {/* Note & Standard Warning */}
            <div className="mt-4 p-3 bg-brand-warning/10 border-r-4 border-brand-warning rounded text-xs text-gray-800">
              <span className="font-bold">ملاحظة الكود:</span> للطرق ذات السرعات العالية ذات الأحجام المرورية المرتفعة يُفضل مضاعفة أطوال الانتقال إن أمكن لتعزيز انسيابية مسارات الاندماج والاصطفاف.
            </div>
          </div>
        </div>
      </div>

      {/* Official Lookup table / Typos alert */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h3 className="font-bold text-gray-800 text-base">جدول المقارنة الاسترشادي القياسي (كود 401)</h3>
          <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-1 rounded font-medium">الوحدات: متر للأطوال، كيلومتر/ساعة للسرعات</span>
        </div>

        {/* Warning Badge for 55km/h typo */}
        <div className="mb-4 bg-brand-success/10 border-r-4 border-brand-success p-3 rounded-lg flex items-start gap-2.5">
          <Check className="w-5 h-5 text-brand-success shrink-0 mt-0.5" />
          <div className="text-xs text-gray-800 leading-relaxed">
            <span className="font-bold">مراجعة وتصحيح الكود:</span> تم تصحيح الخطأ المطبعي للسرعة <span className="font-mono font-bold">55 كم/ساعة</span> وعرض الإزاحة <span className="font-mono font-bold">3.0 م</span> (حيث تظهر كـ 90م في بعض النسخ القديمة)، ونعتمد هنا القيمة الهندسية الصحيحة وهي <span className="font-mono font-bold text-brand-success">58م</span> لضمان دقة العمليات.
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3 text-right text-xs font-semibold text-gray-500">السرعة التصميمية (كم/ساعة)</th>
                <th className="p-3 text-xs font-semibold text-gray-500">W = 1.5م</th>
                <th className="p-3 text-xs font-semibold text-gray-500">W = 2.5م</th>
                <th className="p-3 text-xs font-semibold text-gray-500">W = 2.75م</th>
                <th className="p-3 text-xs font-semibold text-gray-500">W = 3.0م</th>
                <th className="p-3 text-xs font-semibold text-gray-500">W = 3.25م</th>
                <th className="p-3 text-xs font-semibold text-gray-500">W = 3.5م</th>
                <th className="p-3 text-xs font-semibold text-gray-500">W = 3.75م</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono">
              {TAPER_SPEED_RECOMMENDATIONS.map((row) => (
                <tr
                  key={row.speed}
                  className={`hover:bg-slate-50 transition-colors ${
                    row.speed === s ? "bg-brand-primary/5 font-semibold" : ""
                  }`}
                >
                  <td className="p-2.5 text-right font-sans text-xs font-semibold text-gray-700">
                    {row.speed} {row.speed === 55 ? "✅" : ""}
                  </td>
                  <td className="p-2.5 text-xs text-gray-800">{row.w15} م</td>
                  <td className="p-2.5 text-xs text-gray-800">{row.w25} م</td>
                  <td className="p-2.5 text-xs text-gray-800">{row.w275} م</td>
                  <td className="p-2.5 text-xs text-slate-900 font-medium bg-slate-50/40">{row.w30} م</td>
                  <td className="p-2.5 text-xs text-gray-800">{row.w325} م</td>
                  <td className="p-2.5 text-xs text-gray-800">{row.w35} م</td>
                  <td className="p-2.5 text-xs text-gray-800">{row.w375} م</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
