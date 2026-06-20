/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { PSD_LOOKUP_TABLE } from "../data/lookupTables";
import { CalculationRecord } from "../types";
import { Copy, Save, RotateCcw, Check, Ban, ShieldAlert, CheckCircle, Info } from "lucide-react";

interface Props {
  onSaveCalculation: (calc: Omit<CalculationRecord, "id" | "timestamp">) => void;
}

export default function SightDistancePSD({ onSaveCalculation }: Props) {
  const [speed, setSpeed] = useState<number>(80);
  const [availableSight, setAvailableSight] = useState<number>(450); // 450 m
  const [terrainMethod, setTerrainMethod] = useState<"method1" | "method2">("method1");

  const [saved, setSaved] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Lookup Row
  const psdRow = PSD_LOOKUP_TABLE.find((r) => r.speed === speed) || { speed: 80, method1: 540, method2: 620 };
  const requiredPsd = terrainMethod === "method1" ? psdRow.method1 : psdRow.method2;

  const isOvertakingAllowed = availableSight >= requiredPsd;

  const handleCopy = () => {
    const text = `جرد مسافة الرؤية للتجاوز (Passing Sight Distance - PSD):
- السرعة التصميمية للمسلك = ${speed} كم/ساعة
- نوع التضاريس = ${terrainMethod === "method1" ? "سهلية مستوية (Method 1)" : "متموجة جبلية (Method 2)"}
- مسافة الرؤية المتوفرة بالموقع = ${availableSight} م
- الحد الأدنى المطلوب لـ PSD الكود = ${requiredPsd} م
- حالة وإذن التجاوز الجانبي = ${isOvertakingAllowed ? "مسموح بالتعديل والتجاوز" : "ممنوع التجاوز هندسياً لمخاطر حجب رؤية مواجهة"}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSpeed(80);
    setAvailableSight(450);
    setTerrainMethod("method1");
    setSaved(false);
  };

  const handleSave = () => {
    onSaveCalculation({
      calculatorId: "sight_distance_psd",
      calculatorName: "مسافة الرؤية للتجاوز (Passing Sight Distance)",
      inputs: {
        "السرعة كم/ساعة": speed,
        "طبيعة التضاريس": terrainMethod === "method1" ? "مستوية" : "جبلية متموجة",
        "المسافة الحرة المتاحة م": availableSight,
      },
      results: {
        "مسافة PSD المطلوبة م": requiredPsd,
        "التجاوز مسموح": isOvertakingAllowed ? "نعم" : "لا",
      },
      units: {
        "مسافة PSD المطلوبة م": "m",
      },
      notes: `اختبار سلامة التجاوز لسرعة ${speed} كم/ساعة. النتيجة: ${isOvertakingAllowed ? "مسموح" : "ممنوع"}. كود 301.`,
      isSafe: isOvertakingAllowed,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div id="psd-distance-module" className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-brand-primary mb-2">تقدير مسافة الرؤية للتجاوز على الطرق المفردة (Passing Sight Distance - PSD)</h2>
        <p className="text-brand-muted text-sm leading-relaxed mb-6">
          تحدد مسافة الرؤية للتجاوز أطول مسار بصري مستمر يجب توفيره للسماح بمركبة واحدة لتخطي مركبة تسير ببطء في الاتجاه الآمن دون التداخل أو التسبب بالتصادم وجهاً لوجه مع مركبة ثالثة قادمة بشكل مفاجئ.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-5">
            <h3 className="font-semibold text-gray-800 border-r-4 border-brand-primary pr-3 text-sm">متغيرات الرصد الميداني</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                السرعة التصميمية المقدرة للطريق (V) - كم/ساعة
              </label>
              <select
                value={speed}
                onChange={(e) => {
                  setSpeed(parseInt(e.target.value));
                  setSaved(false);
                }}
                className="w-full text-xs border border-gray-300 rounded bg-white p-2 outline-none"
              >
                {PSD_LOOKUP_TABLE.map((row) => (
                  <option key={row.speed} value={row.speed}>{row.speed} كم/ساعة</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                طبيعة تضاريس قطاع التجاوز (Terrain Condition)
              </label>
              <div className="flex gap-4">
                <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg flex-1">
                  <input
                    type="radio"
                    name="terrain"
                    checked={terrainMethod === "method1"}
                    onChange={() => {
                      setTerrainMethod("method1");
                      setSaved(false);
                    }}
                    className="w-4 h-4 text-brand-primary"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">سهلية منبسطة (Method 1)</span>
                    <span className="text-[9px] text-gray-400 font-sans font-medium">سرعة تراجع مرنة</span>
                  </div>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg flex-1">
                  <input
                    type="radio"
                    name="terrain"
                    checked={terrainMethod === "method2"}
                    onChange={() => {
                      setTerrainMethod("method2");
                      setSaved(false);
                    }}
                    className="w-4 h-4 text-brand-primary"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">متموجة جبلية (Method 2)</span>
                    <span className="text-[9px] text-gray-400 font-sans font-medium">سرعات بطيئة بالمنحدرات</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                مسافة الرؤية المتوفرة بالموقع فعلياً - بالمتر
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="20"
                  value={availableSight}
                  onChange={(e) => {
                    setAvailableSight(Math.max(1, parseFloat(e.target.value) || 0));
                    setSaved(false);
                  }}
                  className="w-full text-left font-mono text-xs border border-gray-300 rounded p-2 focus:ring-1 focus:ring-brand-primary outline-none"
                />
                <span className="absolute right-3 top-2 text-xs text-gray-500 font-sans pointer-events-none">متر m</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 rounded border border-gray-205 hover:bg-gray-100 text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-brand-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>نسخ المؤشر</span>
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
                <span>حفظ التجاوز بالسجل</span>
              </button>
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 text-base">تحليل أمان الأفق</h3>

              {/* Requirement display */}
              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <div className="text-xs text-brand-muted">الحد الأدنى لـ PSD المطلوب بمواصفة الكود:</div>
                <div className="flex items-baseline gap-1 mt-1 font-mono">
                  <span className="text-2xl font-bold text-slate-800">{requiredPsd}</span>
                  <span className="text-xs text-gray-500 font-bold font-sans">متر (m)</span>
                </div>
              </div>

              {/* Allowed Status */}
              <div className={`p-4 rounded-xl border flex gap-3 items-start ${
                isOvertakingAllowed 
                  ? "bg-brand-success/15 border-brand-success text-brand-success" 
                  : "bg-brand-danger/15 border-brand-danger text-brand-danger"
              }`}>
                {isOvertakingAllowed ? (
                  <>
                    <CheckCircle className="w-6 h-6 shrink-0" />
                    <div className="text-xs leading-relaxed text-right">
                      <span className="font-bold text-emerald-900 block text-sm">مرسل للسلامة - يتاح التجاوز:</span>
                      مسافة الرؤية المتوفرة بالموقع (<span className="font-mono font-bold text-emerald-950 font-bold">{availableSight}م</span>) كافية وتطابق الحد الموصى به للتخطي الآمن دليلاً.
                    </div>
                  </>
                ) : (
                  <>
                    <Ban className="w-6 h-6 shrink-0 text-brand-danger" />
                    <div className="text-xs leading-relaxed text-right">
                      <span className="font-bold text-red-900 block text-sm">حظر فني حرج وتنبيهات حتمية بالموقع!</span>
                      مسافة الرؤية المتوفرة (<span className="font-mono font-bold text-red-950 font-bold">{availableSight}م</span>) أقل من الـ PSD المطلوب والآمن والبالغ (<span className="font-mono font-bold text-red-950 font-bold">{requiredPsd}م</span>).
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Recommendations Panel (triggered on forbidden) */}
            {!isOvertakingAllowed && (
              <div className="bg-red-50/50 p-3.5 border border-red-200 rounded-lg space-y-2 mt-4">
                <div className="text-xs font-bold text-brand-danger flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>توصيات الكود المقترحة ميدانياً:</span>
                </div>
                <ul className="list-disc pr-4 text-[11px] text-gray-800 space-y-1">
                  <li><span className="font-bold">حظر وثني للتجاوز:</span> يوصى بحظر التجاوز تماماً على هذا القطاع من الطريق.</li>
                  <li><span className="font-bold">دهان خطوط الرصيف:</span> وضع شريط دهان أصفر متصل مزدوج للحظر الطولي (No-Passing Continuous Line).</li>
                  <li><span className="font-bold">لوحات إشارات الطرق:</span> تثبيت اللوحات التنظيمية المقابلة "لوحة منع التجاوز" وفق الكود 603 على جانبي القطاع.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid of full PSD lookup table */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-brand-secondary" />
          <h3 className="font-bold text-gray-800 text-sm">جدول مسافة الرؤية اللازمة للتجاوز المستمر (كود 301):</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-gray-500 font-semibold">
                <th className="p-2 text-right">السرعة التصميمية للمقاس (كم/ساعة)</th>
                <th className="p-2">طريقة 1: تضاريس سهلية (Method 1)</th>
                <th className="p-2">طريقة 2: تضاريس متموجة جبلية (Method 2)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono text-gray-700">
              {PSD_LOOKUP_TABLE.map((row) => (
                <tr key={row.speed} className={`hover:bg-slate-50 ${row.speed === speed ? "bg-brand-primary/5 font-semibold" : ""}`}>
                  <td className="p-2 text-right font-sans font-bold text-slate-900">{row.speed} كم/ساعة</td>
                  <td className={`p-2 ${terrainMethod === "method1" && row.speed === speed ? "bg-brand-primary/10 text-brand-primary font-bold" : ""}`}>
                    {row.method1} م
                  </td>
                  <td className={`p-2 ${terrainMethod === "method2" && row.speed === speed ? "bg-brand-primary/10 text-brand-primary font-bold" : ""}`}>
                    {row.method2} م
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
