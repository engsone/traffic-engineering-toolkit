/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CalculationRecord } from "../types";
import { Copy, Save, RotateCcw, Check, ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";

export default function SightDistanceSSD({ onSaveCalculation }: Props) {
  const [speed, setSpeed] = useState<number>(80);
  const [reactionTime, setReactionTime] = useState<number>(2.5); // standard AASHTO PRT is 2.5s
  const [friction, setFriction] = useState<number>(0.35); // standard wet pavement coefficient
  const [gradeType, setGradeType] = useState<"level" | "upgrade" | "downgrade">("level");
  const [gradePercent, setGradePercent] = useState<number>(3.0); // 3% slope
  const [availableSight, setAvailableSight] = useState<number>(140); // 140 m

  const [saved, setSaved] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // G value
  const gradeDecimal = gradePercent / 100;
  let gSign = 0;
  if (gradeType === "upgrade") gSign = gradeDecimal;
  if (gradeType === "downgrade") gSign = -gradeDecimal;

  // SSD calculation: SSD = 0.278 * V * t + V^2 / [254 * (f +/- G)]
  const perceptionDist = 0.278 * speed * reactionTime;
  
  // Prevent division by zero or negative denominator
  const denom = 254 * (friction + gSign);
  const brakingDist = denom > 0 ? (Math.pow(speed, 2) / denom) : 0;

  const totalSsd = perceptionDist + brakingDist;
  const isSafe = availableSight >= totalSsd;

  const handleCopy = () => {
    const text = `حساب مسافة الرؤية للتوقف (Stopping Sight Distance - SSD):
- السرعة (V) = ${speed} كم/ساعة
- زمن رد الفعل (t) = ${reactionTime} ثانية
- معامل الاحتكاك (f) = ${friction}
- حالة المنحدر الطولي = ${gradeType === "level" ? "مستوي" : gradeType === "upgrade" ? `صعود (+ ${gradePercent}%)` : `هبوط (- ${gradePercent}%)`}
- مسافة الإدراك والرد = ${perceptionDist.toFixed(2)} م
- مسافة الكبح والفرملة = ${brakingDist.toFixed(2)} م
- مسافة التوقف الكلية المطلوبة (SSD) = ${totalSsd.toFixed(2)} م
- مسافة الرؤية المتوفرة بالموقع = ${availableSight} م
- حالة الأمان والسلامة = ${isSafe ? "آمن ومستوفٍ" : "غير آمن - الرؤية محجوبة!"}
كود الطرق السعودي 301`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSpeed(80);
    setReactionTime(2.5);
    setFriction(0.35);
    setGradeType("level");
    setGradePercent(3.0);
    setAvailableSight(140);
    setSaved(false);
  };

  const handleSave = () => {
    onSaveCalculation({
      calculatorId: "sight_distance_ssd",
      calculatorName: "مسافة الرؤية للتوقف (Stopping Sight Distance)",
      inputs: {
        "السرعة كم/ساعة": speed,
        "زمن الاستجابة ث": reactionTime,
        "معامل الاحتكاك": friction,
        "انحدار الطريق %": gradeType === "level" ? 0 : gradeType === "upgrade" ? gradePercent : -gradePercent,
        "مسافة الأفق بالموقع م": availableSight,
      },
      results: {
        "مسافة الإدراك م": perceptionDist.toFixed(2),
        "مسافة الكبح م": brakingDist.toFixed(2),
        "مسافة SSD المطلوبة م": totalSsd.toFixed(2),
      },
      units: {
        "مسافة الإدراك م": "m",
        "مسافة الكبح م": "m",
        "مسافة SSD المطلوبة م": "m",
      },
      notes: `حساب مسافة التوقف الآمن للسرعة ${speed} كم/ساعة مع مقارنة الأفق المتاح. الحالة ${isSafe ? "آمن" : "غير آمن"}. كود 301.`,
      isSafe: isSafe,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div id="ssd-distance-module" className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-brand-primary mb-2">حساب مسافة الرؤية للتوقف (Stopping Sight Distance - SSD)</h2>
        <p className="text-brand-muted text-sm leading-relaxed mb-6">
          تعد مسافة الرؤية للتوقف (SSD) العنصر الأكثر أهمية في تصميم مسارات الطرق وتخطيط الرؤية الجانبية؛ لضمان أن السائق يسير بسرعة تصميمية يملك دائماً الأفق البصري الكافي لاكتشاف عائق صلب مفاجئ والكبح للتوقف التام دونه لتجنب الارتطام.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 border-r-4 border-brand-primary pr-3 text-sm">منظومة معطيات ومؤشرات التوقف</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">السرعة التشغيلية (V) كم/س</label>
                <input
                  type="number"
                  value={speed}
                  onChange={(e) => {
                    const s = Math.max(1, parseInt(e.target.value) || 0);
                    setSpeed(s);
                    // auto friction adjustment based on AASHTO
                    if (s >= 120) setFriction(0.28);
                    else if (s >= 100) setFriction(0.30);
                    else if (s >= 80) setFriction(0.32);
                    else setFriction(0.35);
                    setSaved(false);
                  }}
                  className="w-full text-left font-mono text-xs border border-gray-300 rounded p-2 focus:ring-1 focus:ring-brand-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">زمن الإدراك والرد (t) ث</label>
                <input
                  type="number"
                  step="0.1"
                  value={reactionTime}
                  onChange={(e) => {
                    setReactionTime(Math.max(0.1, parseFloat(e.target.value) || 0));
                    setSaved(false);
                  }}
                  className="w-full text-left font-mono text-xs border border-gray-300 rounded p-2 focus:ring-1 focus:ring-brand-primary outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 font-sans">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">معامل الاحتكاك السطحي (f)</label>
                <input
                  type="number"
                  step="0.01"
                  value={friction}
                  onChange={(e) => {
                    setFriction(Math.max(0.05, parseFloat(e.target.value) || 0));
                    setSaved(false);
                  }}
                  className="w-full text-left font-mono text-xs border border-gray-300 rounded p-2 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-705 mb-1">مسافة المنظر الميدانية المتاحة م</label>
                <input
                  type="number"
                  value={availableSight}
                  onChange={(e) => {
                    setAvailableSight(Math.max(1, parseFloat(e.target.value) || 0));
                    setSaved(false);
                  }}
                  className="w-full text-left font-mono text-xs border border-gray-300 rounded p-2 outline-none"
                />
              </div>
            </div>

            {/* Hill Slope Gradient inputs */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-3 font-sans">
              <label className="block text-xs font-bold text-gray-800">حالة ونوع الانحدار الجبلي المعني للفرملة (G)</label>
              
              <div className="flex gap-2">
                {[
                  { id: "level", label: "طريق مستوٍ (G = 0)" },
                  { id: "upgrade", label: "مسار صاعد (+G)" },
                  { id: "downgrade", label: "مسار هابط (-G)" }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setGradeType(item.id as any);
                      setSaved(false);
                    }}
                    className={`flex-1 py-1 px-2 text-[10px] font-bold rounded border transition-all ${
                      gradeType === item.id 
                        ? "bg-brand-primary text-white border-brand-primary" 
                        : "bg-white text-gray-700 border-gray-200 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {gradeType !== "level" && (
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-1">نسبة زاوية الميل الانحداري (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={gradePercent}
                    onChange={(e) => {
                      setGradePercent(Math.max(0.1, parseFloat(e.target.value) || 0));
                      setSaved(false);
                    }}
                    className="w-full text-left font-mono text-xs border border-gray-300 rounded px-2 py-1 bg-white outline-none"
                  />
                  <span className="text-[9px] text-gray-450 block mt-0.5">عادة ما تتراوح بين 2% إلى 8% لمشاريع متبقي الميول بالمملكة.</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 rounded border border-gray-205 hover:bg-gray-100 text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-brand-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>نسخ الـ SSD</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 rounded border border-gray-205 hover:bg-gray-100 text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة الكبح</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-primary text-white rounded hover:bg-opacity-90 text-xs transition-all mr-auto shadow-sm font-semibold"
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>حفظ التوقيت بالسجل</span>
              </button>
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 text-base">جرد وتحليل الكبح</h3>

              {/* Segmented output widths */}
              <div className="grid grid-cols-2 gap-3 text-right">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="text-[10px] text-gray-500 font-bold">مسافة الإدراك والرد واليقظة:</div>
                  <div className="text-slate-900 font-mono font-bold text-lg mt-1">{perceptionDist.toFixed(2)} م</div>
                  <span className="text-[9px] text-gray-400 block font-mono">0.278 × V × t</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="text-[10px] text-gray-500 font-bold">مسافة انزلاق المكابح والانزواء:</div>
                  <div className="text-slate-900 font-mono font-bold text-lg mt-1">{brakingDist.toFixed(2)} م</div>
                  <span className="text-[9px] text-gray-400 block font-mono">V² / [254 × (f ± G)]</span>
                </div>
              </div>

              {/* Total SSD output */}
              <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm space-y-2">
                <div className="text-xs text-brand-muted font-bold">إجمالي مسافة التوقف المطلوبة للتطبيق الآمن (SSD):</div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl font-mono font-bold text-brand-primary">{totalSsd.toFixed(2)}</span>
                  <span className="text-sm font-bold text-gray-550">متر (m)</span>
                </div>
              </div>

              {/* Safety Alert Status */}
              <div className={`p-4 rounded-xl border flex gap-3 items-start ${
                isSafe 
                  ? "bg-brand-success/15 border-brand-success text-brand-success" 
                  : "bg-brand-danger/15 border-brand-danger text-brand-danger"
              }`}>
                {isSafe ? (
                  <>
                    <ShieldCheck className="w-6 h-6 shrink-0" />
                    <div className="text-xs leading-relaxed">
                      <span className="font-bold text-emerald-900 block text-sm">استيفاء آمن للرؤية:</span>
                      مسافة الرؤية المتوفرة بالموقع (<span className="font-mono font-bold text-sm bg-white/60 px-1 py-0.5 rounded">{availableSight}م</span>) تزيد وتغطي أفق الكبح الكلي المطلوب (<span className="font-mono font-bold text-sm bg-white/60 px-1 py-0.5 rounded">{totalSsd.toFixed(1)}م</span>). الموقع آمن للتصميم والحركة المرورية.
                    </div>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-6 h-6 shrink-0 text-brand-danger" />
                    <div className="text-xs leading-relaxed">
                      <span className="font-bold text-red-900 block text-sm">مخاطر حتمية لحوادث المرور!</span>
                      إن مسافة الرؤية المتوفرة (<span className="font-mono font-bold text-sm bg-white/60 px-1" >{availableSight}م</span>) أقل من أفق كبح المركبات المطلوب (<span className="font-mono font-bold text-sm bg-white/60 px-1" >{totalSsd.toFixed(1)}م</span>). يجب تصفية العائق الحاجب للأفق فوراً أو تركيب علامات تحديد للسرعة الأدنى أو لوحات تحذيرية!
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Note text on Wet roads condition */}
            <div className="p-2.5 bg-amber-50/50 rounded border border-amber-200 text-[10px] text-gray-700 leading-normal">
              <span className="font-bold">ملاحظات الكود الفنية:</span> تُحسب قيم التوقف بناء على قيادة المركبة فوق أسفلت رطب (Wet Pavement) كمعامل أمان حرج لسلامة الرحلات بالمملكة.
            </div>
          </div>
        </div>
      </div>

      {/* Quick reference guide values table */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 text-sm mb-3 border-r-4 border-brand-secondary pr-2">جدول متطلبات الـ SSD المرجعية السريعة (شوارع مستوية تامة - كود 301):</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { spd: 60, reqVal: 85, note: "شارع تجميعي وحضري" },
            { spd: 80, reqVal: 130, note: "طريق تفرع فرعي ثنائي" },
            { spd: 100, reqVal: 185, note: "طريق شرياني رئيسي" },
            { spd: 120, reqVal: 245, note: "شامل الطرق السريعة الحرة" }
          ].map(cell => (
            <div
              key={cell.spd}
              className={`p-4 rounded-xl border text-center font-sans cursor-pointer transition-all ${
                speed === cell.spd
                  ? "bg-brand-primary/10 border-brand-primary"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200"
              }`}
              onClick={() => {
                setSpeed(cell.spd);
                setAvailableSight(cell.reqVal + 30);
                setSaved(false);
              }}
            >
              <div className="text-[10px] text-gray-400 font-bold">{cell.note}</div>
              <div className="text-xl font-mono font-black text-slate-800 mt-1">{cell.spd} كم/س</div>
              <div className="mt-2 bg-white rounded border border-slate-150 py-1 text-xs">
                الحد الأدنى: <span className="font-mono text-brand-primary font-bold">{cell.reqVal}م</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Ensure type check compiles by declaring Props interfaces or types correctly
interface Props {
  onSaveCalculation: (calc: Omit<CalculationRecord, "id" | "timestamp">) => void;
}
