/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BASE_CLEAR_ZONE_TABLE } from "../data/lookupTables";
import { CalculationRecord } from "../types";
import { Copy, Save, RotateCcw, Check, Plus, AlertTriangle, Table } from "lucide-react";
import ClearZoneChart from "../components/ClearZoneChart";

interface Props {
  onSaveCalculation: (calc: Omit<CalculationRecord, "id" | "timestamp">) => void;
}

export default function ClearZone({ onSaveCalculation }: Props) {
  const [speed, setSpeed] = useState<number>(100);
  const [slopeKey, setSlopeKey] = useState<"slope_3_1" | "slope_4_1" | "slope_5_1" | "slope_6_1" | "slope_8_1" | "slope_10_1">("slope_4_1");
  const [adtClass, setAdtClass] = useState<number>(0.90); // default for 2000-6000 ADT is 0.90
  const [saved, setSaved] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Base Clear Zone
  const speedStr = speed.toString() as "50" | "60" | "80" | "100" | "110" | "120" | "130" | "140";
  const baseClearZone = BASE_CLEAR_ZONE_TABLE[slopeKey][speedStr] || 6.5;

  // ADT calculation: Clear Zone Final = Base Clear Zone * ADT Adjustment Factor
  const finalClearZone = baseClearZone * adtClass;

  const handleCopy = () => {
    const text = `حساب الخلوص الجانبي وحرم الأمان (Clear Zone):
- السرعة التصميمية = ${speed} كم/ساعة
- الميل الإنشائي الجانبي = ${slopeKey.replace("slope_", "").replace("_", ":")}
- عامل تعديل كثافة الحركة المرورية (ADT) = ${adtClass}
- عرض حرم الأمان الأساسي = ${baseClearZone} م
- عرض حرم الأمان النهائي المعدل = ${finalClearZone.toFixed(2)} م
كود الطرق السعودي 305`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSpeed(100);
    setSlopeKey("slope_4_1");
    setAdtClass(0.90);
    setSaved(false);
  };

  const handleSave = () => {
    onSaveCalculation({
      calculatorId: "clear_zone",
      calculatorName: "الخلوص الجانبي وحرم الأمان (Clear Zone)",
      inputs: {
        "السرعة كم/ساعة": speed,
        "الميل التفصيلي": slopeKey,
        "معامل التعديل المقاص (ADT)": adtClass,
      },
      results: {
        "حرم الأمان الأساسي م": baseClearZone,
        "حرم الأمان النهائي م": finalClearZone.toFixed(2),
      },
      units: {
        "حرم الأمان الأساسي م": "m",
        "حرم الأمان النهائي م": "m",
      },
      notes: `تحديد عرض المنطقة الخالية من العوائق لسرعة ${speed} كم/ساعة.`,
      isSafe: true,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div id="clear-zone-module" className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-brand-primary mb-2">حساب الخلوص الجانبي وحرم الأمان (Clear Zone)</h2>
        <p className="text-brand-muted text-sm leading-relaxed mb-6">
          حرم الأمان الجانبي أو الخلوص الخالي من العوائق (Clear Zone Width) هو العرض الكلي المستعرض لجانب الطريق المفترض تطهيره وخلوه تماماً من أي عوائق صلبة (كالأعمدة أو الصخور أو الأشجار) لتأمين خروج السيارات المندفعة بدون انقلاب أو اصطدام عنيف.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-5">
            <h3 className="font-semibold text-gray-800 border-r-4 border-brand-primary pr-3 text-base">منظومة بارامترات الخلوص</h3>

            {/* Speed selection */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                السرعة التصميمية القصوى للطريق (كم/ساعة)
              </label>
              <select
                value={speed}
                onChange={(e) => {
                  setSpeed(parseInt(e.target.value));
                  setSaved(false);
                }}
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-1 focus:ring-brand-primary outline-none"
              >
                {[50, 60, 80, 100, 110, 120, 130, 140].map((s) => (
                  <option key={s} value={s}>{s} كم/ساعة</option>
                ))}
              </select>
            </div>

            {/* Slope configuration */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                نسبة الميل الإنشائي للجانب (Slope Ratio)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "slope_3_1", label: "ميل حاد 3:1" },
                  { key: "slope_4_1", label: "ميل قياسي 4:1" },
                  { key: "slope_5_1", label: "ميل ناعم 5:1" },
                  { key: "slope_6_1", label: "ميل مخفف 6:1" },
                  { key: "slope_8_1", label: "ميل منبسط 8:1" },
                  { key: "slope_10_1", label: "ميل مسطح 10:1" }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setSlopeKey(item.key as any);
                      setSaved(false);
                    }}
                    className={`py-2 px-1 text-[11px] rounded border font-semibold transition-all ${
                      slopeKey === item.key
                        ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Traffic (ADT) Factors selection */}
            <div>
              <label className="block text-xs font-medium text-gray-705 mb-1">
                حجم الحركة المرورية اليومية (ADT) لتعديل المساحة
              </label>
              <select
                value={adtClass}
                onChange={(e) => {
                  setAdtClass(parseFloat(e.target.value));
                  setSaved(false);
                }}
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-1 focus:ring-brand-primary outline-none"
              >
                <option value="1.00">حجم حركة فوق 6000 مركبة/يوم (عامل التعديل = 1.00)</option>
                <option value="0.90">حجم حركة 2000 - 6000 مركبة/يوم (عامل التعديل = 0.90)</option>
                <option value="0.80">حجم حركة 800 - 2000 مركبة/يوم (عامل التعديل = 0.80)</option>
                <option value="0.75">حجم حركة 250 - 800 مركبة/يوم (عامل التعديل = 0.75)</option>
                <option value="0.65">حجم حركة أقل من 250 مركبة/يوم (عامل التعديل = 0.65)</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-brand-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>نسخ الخواص</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg border border-gray-200 hover:bg-gray-100 text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-primary text-white rounded-lg hover:bg-opacity-90 text-xs transition-all mr-auto shadow-sm font-semibold"
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{saved ? "تم الحفظ" : "حفظ الحساب"}</span>
              </button>
            </div>
          </div>

          {/* Results dashboard & diagram */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 text-base">مخرجات حرم الأمان والخلوص</h3>

              {/* Clear zone measurements */}
              <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm space-y-3">
                <div>
                  <div className="text-xs text-brand-muted">الأمان الجانبي الأساسي (Base Clear Zone)</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-1">{baseClearZone.toFixed(2)} م</div>
                </div>

                <div className="pt-2 border-t border-dashed border-slate-250">
                  <div className="text-xs text-brand-success font-bold font-sans">الأمان الجانبي النهائي المعدل (Adjusted Final)</div>
                  <div className="text-2xl font-mono font-bold text-brand-success">{finalClearZone.toFixed(2)} م</div>
                  <p className="text-[10px] text-gray-400 mt-1 font-sans">معادلة المعالجة الكثافة: Base × ADT Adjusted Factor</p>
                </div>
              </div>

            </div>

            {/* Custom Visual Assist Drawing */}
            <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200 flex flex-col items-center">
              <div className="text-[11px] font-bold text-slate-700 mb-1 w-full text-right">رسم تخطيطي تفاعلي لحرم الأمان:</div>
              <div className="w-full h-16 bg-slate-100 rounded relative flex items-center justify-center overflow-hidden">
                {/* Lane line */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-slate-500 border-l border-dashed border-white"></div>
                {/* Shoulder */}
                <div className="absolute right-8 top-0 bottom-0 w-12 bg-amber-50"></div>
                {/* Slope Area */}
                <div className="absolute right-20 top-0 bottom-0 left-0 bg-emerald-50 border-r border-slate-250 flex items-center pr-3">
                  <span className="text-[9px] text-brand-success font-bold">منطقة الخلوص الآمن: {finalClearZone.toFixed(2)}م</span>
                </div>
                {/* Obstacle Icon representation */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-brand-danger text-white p-1 rounded-full text-[9px] font-bold">
                  عائق صلّد 🪨
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid view of base clear zones table */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 text-sm mb-3 border-r-4 border-brand-secondary pr-2">جدول الأمان الجانبي التأسيسي المعياري (السرعة vs الميل الجانبي):</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-gray-500">
                <th className="p-2 text-right">ميل الجرف الجانبي</th>
                <th className="p-2">50 كم/س</th>
                <th className="p-2">60 كم/س</th>
                <th className="p-2">80 كم/س</th>
                <th className="p-2">100 كم/س</th>
                <th className="p-2">110 كم/س</th>
                <th className="p-2">120 كم/س</th>
                <th className="p-2">130 كم/س</th>
                <th className="p-2">140 كم/س</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono text-gray-700">
              {[
                { title: "ميل حاد 3:1", data: BASE_CLEAR_ZONE_TABLE.slope_3_1 },
                { title: "ميل قياسي 4:1", data: BASE_CLEAR_ZONE_TABLE.slope_4_1 },
                { title: "ميل ناعم 5:1", data: BASE_CLEAR_ZONE_TABLE.slope_5_1 },
                { title: "ميل مهدأ 6:1", data: BASE_CLEAR_ZONE_TABLE.slope_6_1 },
                { title: "ميل منبسط 8:1", data: BASE_CLEAR_ZONE_TABLE.slope_8_1 },
                { title: "ميل مسطح 10:1", data: BASE_CLEAR_ZONE_TABLE.slope_10_1 }
              ].map((row) => (
                <tr key={row.title} className="hover:bg-slate-50">
                  <td className="p-2 text-right font-sans text-gray-900 font-bold">{row.title}</td>
                  {["50", "60", "80", "100", "110", "120", "130", "140"].map((s) => (
                    <td key={s} className={`p-2 ${s === speedStr ? "bg-brand-primary/10 font-bold" : ""}`}>
                      {row.data[s as any] || "-"} م
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* شارت الخلوص التفاعلي (لا يغيّر أي رقم) */}
      <ClearZoneChart speed={speed} slopeKey={slopeKey} clearZone={baseClearZone} />
    </div>
  );
}
