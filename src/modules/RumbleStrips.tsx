/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CalculationRecord } from "../types";
import { Copy, Save, RotateCcw, Check, HelpCircle } from "lucide-react";

interface Props {
  onSaveCalculation: (calc: Omit<CalculationRecord, "id" | "timestamp">) => void;
}

export default function RumbleStrips({ onSaveCalculation }: Props) {
  const [roadLength, setRoadLength] = useState<number>(500); // 500 meters of road segment
  const [bothDirections, setBothDirections] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Math
  const multiplierBoth = bothDirections ? 2 : 1;
  const standardLength = roadLength * 0.60 * multiplierBoth;
  const continuousLength = roadLength * 1.0 * multiplierBoth;

  const handleCopy = () => {
    const text = `حساب أطوال المطبات الاهتزازية الصوتية (Rumble Strips):
- طول قطاع الطريق (L) = ${roadLength} م
- فئة الحساب الجانبي = ${bothDirections ? "اتجاهين" : "اتجاه واحد"}
- طول التطبيق العادي الموزع (Lr = L × 0.60) = ${standardLength.toFixed(2)} م
- طول التطبيق المتصل المستمر (Lr = L × 1.0) = ${continuousLength.toFixed(2)} م`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setRoadLength(500);
    setBothDirections(true);
    setSaved(false);
  };

  const handleSave = () => {
    onSaveCalculation({
      calculatorId: "rumble_strips",
      calculatorName: "المطبات الاهتزازية (Rumble Strips)",
      inputs: {
        "طول قطاع الطريق (L) م": roadLength,
        "تطبيق بالاتجاهين": bothDirections ? "نعم" : "لا",
      },
      results: {
        "التطبيق القياسي الموزع م": standardLength.toFixed(2),
        "التطبيق المستمر المتصل م": continuousLength.toFixed(2),
      },
      units: {
        "التطبيق القياسي الموزع م": "m",
        "التطبيق المستمر المتصل م": "m",
      },
      notes: `حساب تباعد المطبات الاهتزازية لقطاع ${roadLength}م بالكتفين لتنبيه قائدي المركب قبل النزول عن المسار.`,
      isSafe: true,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div id="rumble-strips-module" className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-brand-primary mb-2">حساب أطوال وتوزيع المطبات الاهتزازية الصوتية</h2>
        <p className="text-brand-muted text-sm leading-relaxed mb-6">
          المطبات الاهتزازية المثبتة على أكتاف الطرق (Shoulder Rumble Strips) أو خطوط المسار تحمي السائقين من حوادث الخروج المفاجئ عن مسار الطريق بسبب الإعياء أو النعاس، من خلال إحداث اهتزازات خفيفة وصوت تنبيهي بالمركبة.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input details */}
          <div className="space-y-5">
            <h3 className="font-semibold text-gray-800 border-r-4 border-brand-primary pr-3 text-base">منظومة إدخال البيانات الميدانية</h3>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                طول قطاع الطريق الكلي المستهدف (L)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="50"
                  value={roadLength}
                  onChange={(e) => {
                    setRoadLength(Math.max(1, parseFloat(e.target.value) || 0));
                    setSaved(false);
                  }}
                  className="w-full text-left font-mono border border-gray-300 rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                />
                <span className="absolute right-3 top-2 text-xs text-gray-500 font-sans pointer-events-none">متر m</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-3">
                توزيع التطبيق على الاتجاهات الجانبية
              </label>
              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={bothDirections === true}
                    onChange={() => {
                      setBothDirections(true);
                      setSaved(false);
                    }}
                    className="w-4 h-4 text-brand-primary focus:ring-brand-primary border-gray-300"
                  />
                  <span className="text-xs text-gray-800 font-semibold">تطبيق في كلا الاتجاهين (مضاعفة الطول × 2)</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={bothDirections === false}
                    onChange={() => {
                      setBothDirections(false);
                      setSaved(false);
                    }}
                    className="w-4 h-4 text-brand-primary focus:ring-brand-primary border-gray-300"
                  />
                  <span className="text-xs text-gray-800 font-semibold">اتجاه واحد فقط (بدون مضاعفة × 1)</span>
                </label>
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

          {/* Outputs */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 text-base mb-3">حساب أطوال الفرز والحفر التقديرية</h3>

              <div className="space-y-4">
                {/* Standard Application */}
                <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <div className="text-xs text-brand-muted mb-1 font-bold">التطبيق المتقطع القياسي (Standard Application)</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-bold text-slate-800">{standardLength.toFixed(2)}</span>
                    <span className="text-xs font-semibold text-gray-500">متر طولي</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 font-sans">معادلة: Lr = L × 0.60 (مثالي للسرعات المتوسطة والأكتاف الضيقة).</p>
                </div>

                {/* Continuous application */}
                <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <div className="text-xs text-brand-muted mb-1 font-bold">التطبيق المقوى المتصل (Continuous Application)</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-bold text-brand-primary">{continuousLength.toFixed(2)}</span>
                    <span className="text-xs font-semibold text-gray-500">متر طولي</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 font-sans">معادلة: Lr = L × 1.00 (يوصى به بشدة على الطرق السريعة ذات السرعات ≥ 120 كم/ساعة).</p>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-brand-primary/10 border-r-4 border-brand-primary p-3 rounded text-xs text-gray-800">
              <span className="font-bold">استخدام حقلي هام:</span> تُستثنى مناطق الجسور ومحيط التقاطعات والفتحات الالتفافية لمسافة لا تقل عن <span className="font-bold font-mono">100م</span> من تطبيق المطبات الاهتزازية الجانبية منعاً لحدوث إرباك لقائدي المركبات.
            </div>
          </div>
        </div>
      </div>

      {/* Field guidelines & dimensions */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 text-base mb-3 border-r-4 border-brand-secondary pr-3 flex items-center gap-2">
          <span>دليل الأبعاد والمواصفات للمطبات الحرارية والصوتية</span>
        </h3>
        <p className="text-gray-600 text-xs leading-relaxed mb-4">
          وفقاً لدراسات الأمان بوزارة النقل وكود الطرق السعودي، تشتمل المطبات الاهتزازية عادة على الأبعاد القياسية التالية:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-105">
            <h4 className="font-bold text-gray-800 text-xs mb-1">العمق الإنشائي (Depth)</h4>
            <p className="text-[11px] text-gray-600 leading-relaxed font-sans">يجب أن يتراوح عمق الحفر الميكانيكي بالرمل داخل الأسفلت بين <span className="font-mono font-bold text-brand-danger">8 ملم إلى 13 ملم</span> لضمان إصدار رنين اهتزازي كافي بدون الإضرار بهيكل الإطارات.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-105">
            <h4 className="font-bold text-gray-800 text-xs mb-2">الأبعاد الهندسية المعتمدة (Dimensions)</h4>
            <div className="space-y-1.5 text-[11px] text-gray-600 leading-relaxed font-sans">
              <div>• <span className="font-bold text-slate-800">العرض الإنشائي (Width):</span> <span className="font-mono font-bold text-brand-primary">15 سم</span></div>
              <div>• <span className="font-bold text-slate-800">الطول الفني (Length):</span> <span className="font-mono font-bold text-brand-primary">30 سم</span></div>
              <div>• <span className="font-bold text-slate-800">فجوة التباعد (Gap Length):</span> بمقدار <span className="font-mono font-bold text-brand-primary">15 سم</span> لضمان جودة الأثر الصوتي والاهتزازي لسلامة المركبات.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
