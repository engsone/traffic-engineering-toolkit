/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { PAVEMENT_MARKINGS_SPECS } from "../data/lookupTables";
import { CalculationRecord } from "../types";
import { Copy, Save, RotateCcw, Check, Grid, Paintbrush } from "lucide-react";

interface Props {
  onSaveCalculation: (calc: Omit<CalculationRecord, "id" | "timestamp">) => void;
}

export default function PavementMarkings({ onSaveCalculation }: Props) {
  const [lengthCheck, setLengthCheck] = useState<number>(1000); // 1 km road section
  const [lineWidth, setLineWidth] = useState<number>(0.15); // 15 cm standard line
  const [rumbleSets, setRumbleSets] = useState<number>(10); // 10 rumble sets
  const [saved, setSaved] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations
  const yellowEdgeArea = lengthCheck * 0.20;
  const brokenWhiteArea = (lengthCheck * lineWidth) / 3;
  const continuousWhiteArea = lengthCheck * lineWidth * 2;
  const rumbleStripsArea = 1.5 * lineWidth * rumbleSets;

  // Total summary of project if all applied
  const grandTotalArea = yellowEdgeArea + brokenWhiteArea + continuousWhiteArea + rumbleStripsArea;

  const handleCopy = () => {
    const text = `تخمين كميات دهانات الطرق وعلامات الرصيف (كود 602):
- طول القطاع المعني (L) = ${lengthCheck} م
- عرض خط التخطيط السائد (W) = ${lineWidth} م
- عدد عينات/مجموعات عيون القطط/المطبات المطلية (X) = ${rumbleSets}

مساحات الدهان المحسوبة (م²):
1. دهان حواف أصفر قياسي (A = L × 0.20) = ${yellowEdgeArea.toFixed(2)} م²
2. خطوط حارة متقطعة بيضاء (A = L × W / 3) = ${brokenWhiteArea.toFixed(2)} م²
3. خطوط متصلة بيضاء (مزدوجة/مفردة) = ${continuousWhiteArea.toFixed(2)} م²
4. تخطيط مطبات الرصف الاهتزازية = ${rumbleStripsArea.toFixed(2)} م²
- إجمالي مساحة التخطيط التقديرية = ${grandTotalArea.toFixed(2)} م²`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setLengthCheck(1000);
    setLineWidth(0.15);
    setRumbleSets(10);
    setSaved(false);
  };

  const handleSave = () => {
    onSaveCalculation({
      calculatorId: "pavement_markings",
      calculatorName: "الدهانات والعلامات الأرضية (Pavement Markings)",
      inputs: {
        "طول القطاع (L) م": lengthCheck,
        "عرض الخط (W) م": lineWidth,
        "عدد مجموعات المطبات الملونة (X)": rumbleSets,
      },
      results: {
        "دهان حواف أصفر م²": yellowEdgeArea.toFixed(2),
        "خطوط بيضاء متقطعة م²": brokenWhiteArea.toFixed(2),
        "خطوط بيضاء متصلة م²": continuousWhiteArea.toFixed(2),
        "دهان مطبات اهتزازية م²": rumbleStripsArea.toFixed(2),
        "إجمالي مساحة الدهان م²": grandTotalArea.toFixed(2),
      },
      units: {
        "دهان حواف أصفر م²": "m²",
        "خطوط بيضاء متقطعة م²": "m²",
        "خطوط بيضاء متصلة م²": "m²",
        "دهان مطبات اهتزازية م²": "m²",
        "إجمالي مساحة الدهان م²": "m²",
      },
      notes: `حساب شامل لقطاع بطول ${lengthCheck}م لعرض أساسي ${lineWidth}م. طبقاً لدليل التخطيط والعلامات الأرضية السعودي (كود 602).`,
      isSafe: true,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div id="pavement-markings-module" className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-brand-primary mb-2">حساب كميات الدهانات والعلامات الأرضية</h2>
        <p className="text-brand-muted text-sm leading-relaxed mb-6">
          أداة هندسية لحساب المساحة المطلوبة للتخطيط والدهانات الحرارية (Thermoplastic Paint) بمختلف الألوان والأشكال على أسطح الطرق والمنحنيات طبقاً لمقاييس وزارة النقل (المواصفة 602).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs Panel */}
          <div className="space-y-5">
            <h3 className="font-semibold text-gray-800 border-r-4 border-brand-primary pr-3 text-base">بارامترات حساب الكميات</h3>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                طول قطاع الطريق الكلي المطلوب تخطيطه (L)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="50"
                  value={lengthCheck}
                  onChange={(e) => {
                    setLengthCheck(Math.max(1, parseFloat(e.target.value) || 0));
                    setSaved(false);
                  }}
                  className="w-full text-left font-mono border border-gray-300 rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                />
                <span className="absolute right-3 top-2 text-xs text-gray-500 font-sans pointer-events-none">متر m</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                عرض خط التخطيط المعياري (W)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={lineWidth}
                  onChange={(e) => {
                    setLineWidth(Math.max(0.05, parseFloat(e.target.value) || 0));
                    setSaved(false);
                  }}
                  className="w-full text-left font-mono border border-gray-300 rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                />
                <span className="absolute right-3 top-2 text-xs text-gray-500 font-sans pointer-events-none">متر m</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">عادة ما يعتمد الكود الأبعاد: 12 سم لحارات السير، 15 سم لخط المنع، 20 سم للطرق السريعة.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                عدد خطوط/مجموعات المطبات الاهتزازية المطلية المضافة (X)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  value={rumbleSets}
                  onChange={(e) => {
                    setRumbleSets(Math.max(0, parseInt(e.target.value) || 0));
                    setSaved(false);
                  }}
                  className="w-full text-left font-mono border border-gray-300 rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                />
                <span className="absolute right-3 top-2 text-xs text-gray-500 font-sans pointer-events-none">وحدة qty</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-brand-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "تم النسخ" : "نسخ الكميات"}</span>
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

          {/* Results Summary */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
            <h3 className="font-semibold text-gray-800 text-base">المساحات التقديرية المحسوبة بالمتر المربع (m²)</h3>

            <div className="space-y-3">
              {/* Yellow edge paint */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                <div>
                  <div className="font-semibold text-gray-800 text-xs text-right">دهان خط الحافة الأصفر المتصل</div>
                  <div className="text-[10px] text-gray-500 font-mono">A = L × 0.20</div>
                </div>
                <div className="text-left">
                  <span className="font-mono text-base font-bold text-slate-800">{yellowEdgeArea.toFixed(2)}</span>
                  <span className="text-[10px] text-gray-500 mr-1">م²</span>
                </div>
              </div>

              {/* Broken White Line */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                <div>
                  <div className="font-semibold text-gray-800 text-xs text-right">خطوط حارات السير البيضاء المتقطعة</div>
                  <div className="text-[10px] text-gray-500 font-mono">A = (L × W) / 3</div>
                </div>
                <div className="text-left">
                  <span className="font-mono text-base font-bold text-slate-800">{brokenWhiteArea.toFixed(2)}</span>
                  <span className="text-[10px] text-gray-500 mr-1">م²</span>
                </div>
              </div>

              {/* Continuous White Line */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                <div>
                  <div className="font-semibold text-gray-800 text-xs text-right">خطوط الحواجز/المتصلة البيضاء مزدوجة الجهة</div>
                  <div className="text-[10px] text-gray-500 font-mono">A = L × W × 2</div>
                </div>
                <div className="text-left">
                  <span className="font-mono text-base font-bold text-slate-800">{continuousWhiteArea.toFixed(2)}</span>
                  <span className="text-[10px] text-gray-500 mr-1">م²</span>
                </div>
              </div>

              {/* Painted Rumble Strips */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                <div>
                  <div className="font-semibold text-gray-800 text-xs text-right">تلوين المطبات الاهتزازية الصوتية المستعرضة</div>
                  <div className="text-[10px] text-gray-500 font-mono">A = 1.5 × W × X</div>
                </div>
                <div className="text-left">
                  <span className="font-mono text-base font-bold text-slate-800">{rumbleStripsArea.toFixed(2)}</span>
                  <span className="text-[10px] text-gray-500 mr-1">م²</span>
                </div>
              </div>

              {/* Grand Total Area */}
              <div className="pt-2 border-t border-dashed border-slate-300 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-brand-primary">إجمالي مساحة الدهانات والمواد الحرارية</div>
                  <div className="text-[10px] text-gray-400">شاملة عاكسية الخرز الزجاجي</div>
                </div>
                <div className="bg-brand-primary/10 px-3 py-1.5 rounded-lg text-left">
                  <span className="font-mono text-lg font-bold text-brand-primary">{grandTotalArea.toFixed(2)}</span>
                  <span className="text-xs font-semibold text-brand-primary mr-1">م²</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lookup details from SHC 602 */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-r-4 border-brand-secondary pr-3">
          <Paintbrush className="w-5 h-5 text-brand-secondary" />
          <h3 className="font-bold text-gray-800 text-base">مواصفات وقياسات دليل تخطيط العلامات الأرضية (SHC 602)</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-3 text-xs font-semibold text-gray-500">العنصر المروري للمواصفة</th>
                  <th className="p-3 text-xs font-semibold text-gray-500">العرض القياسي للشريط</th>
                  <th className="p-3 text-xs font-semibold text-gray-500">وصف التباعد والنمط</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {PAVEMENT_MARKINGS_SPECS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 text-xs font-semibold text-gray-800">{row.item}</td>
                    <td className="p-3 text-xs font-mono text-slate-700">{row.widthAr}</td>
                    <td className="p-3 text-xs text-gray-600 leading-relaxed">{row.spaceAr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5 space-y-3">
            <h4 className="font-bold text-brand-warning text-xs">توجيه فني - استلام الأعمال ميدانياً:</h4>
            <ul className="list-disc leading-relaxed text-xs text-gray-700 pr-5 space-y-2">
              <li>يجب تطبيق المواد الحرارية (Thermoplastic Paint) بسماكة لا تقل عن <span className="font-bold font-mono text-brand-primary">1.5 ملم</span> ولا تتجاوز <span className="font-bold font-mono text-brand-primary">3.0 ملم</span> حسب كود المصفحة.</li>
              <li>يرش الزجاج العاكس (Glass Beads) مباشرة على الطلاء المنصهر ليعزز الرؤية الليلية وبمعدل لا يقل عن <span className="font-bold font-mono text-brand-primary">350 جرام/م²</span>.</li>
              <li>
                <span className="text-brand-danger font-bold">تنبيه الحظر:</span> تُمنع الدهانات المتقطعة لخطوط السير في المنحنيات الأفقية الحادة التي تقل فيها مسافة الرؤية الآمنة عن حد توقف المنحنى المعياري ويجب استبدالها بخط متصل مانع للتخطيط والعبور باللون الأصفر.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
