/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ACCELERATION_LENGTHS, DECELERATION_LENGTHS, GRADE_CLASS_FACTORS } from "../data/lookupTables";
import { CalculationRecord } from "../types";
import { Copy, Save, RotateCcw, Check, Info, HelpCircle } from "lucide-react";

interface Props {
  onSaveCalculation: (calc: Omit<CalculationRecord, "id" | "timestamp">) => void;
}

export default function SpeedChangeLanes({ onSaveCalculation }: Props) {
  const [laneType, setLaneType] = useState<"acceleration" | "deceleration">("acceleration");
  const [mainSpeed, setMainSpeed] = useState<number>(100);
  const [rampSpeedStr, setRampSpeedStr] = useState<string>("Stop");
  
  // Grade Adjustment Calculator inputs
  const [gradeClass, setGradeClass] = useState<string>("3_4_upgrade");
  const [basicLengthInput, setBasicLengthInput] = useState<number>(0);
  const [saved, setSaved] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Look up basic minimum length based on laneType, mainSpeed and rampSpeed
  const currentLengthsTable = laneType === "acceleration" ? ACCELERATION_LENGTHS : DECELERATION_LENGTHS;
  const speedRow = currentLengthsTable[mainSpeed] || {};
  const basicLength = speedRow[rampSpeedStr] || 0;

  // Auto-sync basic length input with the looked up value
  useEffect(() => {
    setBasicLengthInput(basicLength);
  }, [basicLength, laneType, mainSpeed, rampSpeedStr]);

  // Handle factor
  const currentGradeFactors = GRADE_CLASS_FACTORS[gradeClass] || { acc: 1, dec: 1 };
  const factor = laneType === "acceleration" ? currentGradeFactors.acc : currentGradeFactors.dec;
  const adjustedLength = basicLengthInput * factor;

  // Dynamic Taper Design Notes based on Speeds
  let taperRecommendation = "Taper Type is recommended for high-speed roads or high traffic volumes.";
  if (laneType === "acceleration") {
    if (mainSpeed > 110 || adjustedLength > 400) {
      taperRecommendation = "توصية: نظرًا للسرعة العالية (> 110 كم/س) أو تجاوز الطول 400م، استخدم مسلوب دمج بمستوى (Taper Ratio = 70:1).";
    } else if (mainSpeed >= 80) {
      taperRecommendation = "توصية: للسرعات التصميمية المقاسة (>= 80 كم/س)، استخدم مسلوب دمج بمستوى (Taper Ratio = 50:1).";
    } else {
      taperRecommendation = "توصية: للسرعات المنخفضة، يمكن استخدام مسلوب بمستوى (25:1) لسهولة دوران المركبة البطيئة.";
    }
  } else {
    taperRecommendation = "توصية: يُفَضَّل النموذج المتوازي (Parallel Type) لمخارج الطرق السريعة. ويقاس طول التباطؤ الكلي بدءًا من انفصال وجه مسار الحارة السريع إلى قفل نقطة التحويلة.";
  }

  const handleCopy = () => {
    const text = `تصميم حارات الاندماج والفرز (مسارات التسارع والتباطؤ):
- فئة الحارة = ${laneType === "acceleration" ? "تسارع (Acceleration Lane)" : "تباطؤ (Deceleration Lane)"}
- سرعة الطريق الرئيسي المستهدف = ${mainSpeed} كم/ساعة
- سرعة منحنى المنحدر الجانبي (Ramp) = ${rampSpeedStr === "Stop" ? "وقوف تام" : `${rampSpeedStr} كم/ساعة`}
- الطول المعياري الأساسي (L_basic) = ${basicLength} م
- فئة الميول والمنحدرات = ${gradeClass} (عامل التعديل = ${factor})
- الطول النهائي المعتمد بعد تعديل الميل = ${adjustedLength.toFixed(2)} م
- التوصية الهندسية: ${taperRecommendation}
كود الطرق السعودي 301`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setLaneType("acceleration");
    setMainSpeed(100);
    setRampSpeedStr("Stop");
    setGradeClass("3_4_upgrade");
    setSaved(false);
  };

  const handleSave = () => {
    onSaveCalculation({
      calculatorId: "speed_change_lanes",
      calculatorName: `حارات السرعة (${laneType === "acceleration" ? "تسارع" : "تباطؤ"})`,
      inputs: {
        "فئة الحارة": laneType === "acceleration" ? "تسارع" : "تباطؤ",
        "سرعة الرئيسي كم/س": mainSpeed,
        "سرعة فرعي (الرامب)": rampSpeedStr,
        "انحدار حارة السرعة": gradeClass,
        "الطول الأساسي م": basicLengthInput,
      },
      results: {
        "عامل تعديل الميل": factor,
        "الطول المعدل النهائي م": adjustedLength.toFixed(2),
      },
      units: {
        "الطول المعدل النهائي م": "m",
      },
      notes: `حساب حارة سرعة لطريق ${mainSpeed} كم/ساعة. تطبيق معدل تعديل الميل ${factor} لمستوى ${gradeClass}. كود 301.`,
      isSafe: adjustedLength > 0,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Get available ramp-speed options based on main road speed
  const availableRampOptions = Object.keys(speedRow);

  return (
    <div id="speed-change-lanes-module" className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-brand-primary mb-2">حسابات حارات التسارع والتباطؤ (Speed-Change Lanes)</h2>
        <p className="text-brand-muted text-sm leading-relaxed mb-6">
          تعد حارات التسارع (Acceleration Lanes) والتباطؤ (Deceleration Lanes) من العناصر الأساسية على مداخل ومخارج الطرق السريعة، حيث تتيح للمركبات مواءمة سرعتها مع السرعة الحالية للطريق الرئيسي من خلال دمج أو تفريغ الحركة المرورية بكل أمان انسيابي.
        </p>

        {/* Tab switcher */}
        <div className="flex bg-slate-100 p-1 rounded-lg max-w-md mb-6 gap-2 border border-slate-200">
          <button
            onClick={() => {
              setLaneType("acceleration");
              setSaved(false);
            }}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-md transition-all ${
              laneType === "acceleration"
                ? "bg-brand-primary text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            حارات التسارع والاندماج (Acceleration)
          </button>
          
          <button
            onClick={() => {
              setLaneType("deceleration");
              setSaved(false);
            }}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-md transition-all ${
              laneType === "deceleration"
                ? "bg-brand-primary text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            حارات التباطؤ والفرز (Deceleration)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-5">
            <h3 className="font-semibold text-gray-800 border-r-4 border-brand-primary pr-3 text-sm">بارامترات السرعة الأساسية الكود</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">سرعة الطريق الرئيسي (V) ك/س</label>
                <select
                  value={mainSpeed}
                  onChange={(e) => {
                    const nextSpd = parseInt(e.target.value);
                    setMainSpeed(nextSpd);
                    // Prepopulate ramp curve speed safely from available
                    const nextRow = currentLengthsTable[nextSpd] || {};
                    const keys = Object.keys(nextRow);
                    if (keys.length > 0) setRampSpeedStr(keys[0]);
                    setSaved(false);
                  }}
                  className="w-full text-xs border border-gray-300 rounded bg-white p-2 outline-none"
                >
                  {Object.keys(currentLengthsTable).map(spd => (
                    <option key={spd} value={spd}>{spd} كم/ساعة</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">سرعة منحنى الرامب (V_ramp)</label>
                <select
                  value={rampSpeedStr}
                  onChange={(e) => {
                    setRampSpeedStr(e.target.value);
                    setSaved(false);
                  }}
                  className="w-full text-xs border border-gray-300 rounded bg-white p-2 outline-none"
                >
                  {availableRampOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === "Stop" ? "وقوف تام (Stop)" : `${opt} كم/ساعة`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Manual length modification if desired */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                طول الحارة الأساسي المقاس من الكود (L_basic) م
              </label>
              <input
                type="number"
                value={basicLengthInput}
                onChange={(e) => {
                  setBasicLengthInput(Math.max(0, parseFloat(e.target.value) || 0));
                  setSaved(false);
                }}
                className="w-full text-left font-mono text-xs border border-gray-300 rounded p-2 focus:ring-1 focus:ring-brand-primary outline-none"
              />
              <span className="text-[9px] text-gray-400 mt-0.5 block">يتم استخلاصه تلقائياً من مواصفة الكود أو يمكن تعديله يدوياً.</span>
            </div>

            {/* Grade Adjustment sub section */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-3 font-sans">
              <label className="block text-xs font-bold text-gray-800">حسبة تعديل المنحدرات الطولية (Grade Adjustment)</label>
              
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-1">منحدر وتضاريس موقع حارة السرعة</label>
                <select
                  value={gradeClass}
                  onChange={(e) => {
                    setGradeClass(e.target.value);
                    setSaved(false);
                  }}
                  className="w-full text-xs border border-gray-300 rounded bg-white p-1.5 focus:ring-1 focus:ring-brand-primary outline-none"
                >
                  <option value="3_4_upgrade">صعود صاعد بمعدل 3% إلى 4% (Upgrade)</option>
                  <option value="3_4_downgrade">هبوط منحدِر بمعدل 3% إلى 4% (Downgrade)</option>
                  <option value="5_6_upgrade">صعود صاعد قاسٍ بمعدل 5% إلى 6% (Steep Upgrade)</option>
                  <option value="5_6_downgrade">هبوط منحدِر قاسٍ بمعدل 5% إلى 6% (Steep Downgrade)</option>
                </select>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">معامل تعديل ميل الكود التلقائي:</span>
                <span className="bg-brand-warning/10 px-2 py-0.5 rounded font-mono font-bold text-brand-warning">
                  {factor.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-700 rounded border border-gray-205 hover:bg-gray-100 text-xs transition-colors"
                title="نسخ الحسابات"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-brand-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>نسخ الحساب</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-500 rounded border border-gray-205 hover:bg-gray-100 text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة تصفير</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-4 py-1.5 bg-brand-primary text-white rounded hover:bg-opacity-90 text-xs transition-all mr-auto shadow-sm font-semibold"
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>حفظ حارة السرعة</span>
              </button>
            </div>
          </div>

          {/* Outputs */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 text-base">منظومة مخرجات تصميم الحارات</h3>

              {/* Basic Length calculated */}
              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <div className="text-xs text-brand-muted">طول الحارة الأساسي المقترح بمستوي الكود (L_basic)</div>
                <div className="flex items-baseline gap-1 mt-1 font-mono">
                  <span className="text-2xl font-bold text-slate-800">{basicLength}</span>
                  <span className="text-xs text-gray-500 font-bold font-sans">متر (m)</span>
                </div>
              </div>

              {/* Adjusted final length */}
              <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm space-y-2">
                <div className="text-xs text-brand-success font-bold font-sans">الطول الإجمالي المعدل والنهائي المطلوب للموقع (L_adjusted):</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-mono font-bold text-brand-success">{adjustedLength.toFixed(1)}</span>
                  <span className="text-sm font-bold text-emerald-900">متر (m)</span>
                </div>
                <p className="text-[10px] text-gray-500 font-sans leading-normal">
                  حساب السلامة: <span className="font-mono text-slate-705">L_adjusted = L_basic × Factor</span> (مُعدَّل لتجاوز انحدارات وتعرجات الجبال والكتلة الأرضية بتبوك).
                </p>
              </div>
            </div>

            {/* Design Notes */}
            <div className="bg-brand-primary/10 border-r-4 border-brand-primary p-3 rounded text-[11px] text-gray-800 leading-relaxed font-sans">
              <span className="font-bold flex items-center gap-1 mb-1">
                <Info className="w-4 h-4 text-brand-primary" />
                توصيات الكود الهندسية وتفصيل الـ Taper:
              </span>
              <span>{taperRecommendation}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
