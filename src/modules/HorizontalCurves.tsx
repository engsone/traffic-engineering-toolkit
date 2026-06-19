/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MIN_CURVE_RADIUS_TABLE, SIDE_FRICTION_COEFFICIENTS } from "../data/lookupTables";
import { CalculationRecord } from "../types";
import { Copy, Save, RotateCcw, Check, HelpCircle, ShieldCheck, ShieldAlert, Table } from "lucide-react";

interface Props {
  onSaveCalculation: (calc: Omit<CalculationRecord, "id" | "timestamp">) => void;
}

export default function HorizontalCurves({ onSaveCalculation }: Props) {
  const [activeTab, setActiveTab] = useState<"speed" | "radius" | "sight">("speed");
  const [saved, setSaved] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Common inputs
  const [ePercent, setEPercent] = useState<number>(6); // 6% superelevation
  const [fFactor, setFFactor] = useState<number>(0.13); // side friction factor

  // Tab A (Safe Speed Calculator) inputs
  const [radiusA, setRadiusA] = useState<number>(300); // 300 meters

  // Tab B (Radius Calculator) inputs
  const [speedB, setSpeedB] = useState<number>(100); // 100 km/h

  // Tab C (Curve Sight Distance Calculator) inputs
  const [radiusC, setRadiusC] = useState<number>(400); 
  const [ordinateM, setOrdinateM] = useState<number>(6); // distance from lane center to obstacle
  const [requiredSsd, setRequiredSsd] = useState<number>(185); // SSD requirement for 100km/h

  // Math converters
  const eDecimal = ePercent / 100;

  // Calculators implementations
  // A. Safe Speed: V = sqrt(127 * R * (e + f))
  const calculatedSpeed = Math.sqrt(127 * radiusA * (eDecimal + fFactor));

  // B. Required Radius: R = V^2 / (127 * (e + f))
  const calculatedRadius = Math.pow(speedB, 2) / (127 * (eDecimal + fFactor));

  // C. Sight Obstacle Ordinate & Available Sight Distance
  // Angle argument is in radians, Sa / 2R.
  // m = R * (1 - cos( Sa / 2R )) => (1 - m/R) = cos( Sa / 2R ) => Sa = 2R * acos(1 - m/R)
  let availableSightDistance = 0;
  if (ordinateM < radiusC) {
    availableSightDistance = 2 * radiusC * Math.acos(1 - (ordinateM / radiusC));
  }
  const isSightSafe = availableSightDistance >= requiredSsd;

  // Compute m base from required SSD
  // mReq = R * (1 - cos(Ssd / 2R))
  const requiredOrdinate = radiusC * (1 - Math.cos(requiredSsd / (2 * radiusC)));

  const handleCopy = () => {
    let text = "";
    if (activeTab === "speed") {
      text = `حساب السرعة الآمنة على منحنى أفقي:
- نصف القطر (R) = ${radiusA} م
- معدل الارتفاع الجانبي (e) = ${ePercent}%
- معامل الاحتكاك الجانبي (f) = ${fFactor}
- السرعة الآمنة المحسوبة (V) = ${calculatedSpeed.toFixed(2)} كم/ساعة`;
    } else if (activeTab === "radius") {
      text = `حساب نصف قطر المنحنى المطلوب:
- السرعة التصميمية (V) = ${speedB} كم/ساعة
- معدل الارتفاع الجانبي (e) = ${ePercent}%
- معامل الاحتكاك الجانبي (f) = ${fFactor}
- نصف القطر الأدنى المطلوبة (R) = ${calculatedRadius.toFixed(2)} م`;
    } else {
      text = `حساب مسافة الرؤية على المنحنيات الأفقية:
- مسافة الرؤية المتوفرة (Sa) = ${availableSightDistance.toFixed(2)} م
- مسافة التوقف المطلوبة (SSD) = ${requiredSsd} م
- الإزاحة الجانبية المتاحة (m) = ${ordinateM} م
- حالة الأمان = ${isSightSafe ? "آمن ومطابق" : "غير آمن - عوائق تحجب الرؤية"}`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    let inputs: Record<string, number | string> = {};
    let results: Record<string, number | string> = {};
    let units: Record<string, string> = {};
    let calcName = "";
    let isSafe = true;

    if (activeTab === "speed") {
      calcName = "السرعة الآمنة على منحنى أفقي";
      inputs = { "نصف القطر (R) م": radiusA, "التعلية (e) %": ePercent, "الاحتكاك (f)": fFactor };
      results = { "السرعة الآمنة المحسوبة كم/ساعة": calculatedSpeed.toFixed(2) };
      units = { "السرعة الآمنة المحسوبة كم/ساعة": "km/h" };
    } else if (activeTab === "radius") {
      calcName = "أدنى قطر للمنحنى الأفقي";
      inputs = { "السرعة (V) كم/س": speedB, "التعلية (e) %": ePercent, "الاحتكاك (f)": fFactor };
      results = { "نصف القطر المطلوبة م": calculatedRadius.toFixed(2) };
      units = { "نصف القطر المطلوبة م": "m" };
    } else {
      calcName = "مسافة الرؤية على منحنى أفقي";
      inputs = { "نصف القطر م": radiusC, "مسافة عائق العرض (m) م": ordinateM, "مسافة SSD المطلوبة م": requiredSsd };
      results = { "مسافة الرؤية المتوفرة م": availableSightDistance.toFixed(2), "حجم العائق الأمثل": requiredOrdinate.toFixed(2) };
      units = { "مسافة الرؤية المتوفرة م": "m", "حجم العائق الأمثل": "m" };
      isSafe = isSightSafe;
    }

    onSaveCalculation({
      calculatorId: `horizontal_curve_${activeTab}`,
      calculatorName: calcName,
      inputs,
      results,
      units,
      notes: "تم القياس بناء على معطيات كود الطرق السعودي 301 للتصميم الهندسي والارتفاع الفرعي الجانبي.",
      isSafe,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setEPercent(6);
    setFFactor(0.13);
    setRadiusA(300);
    setSpeedB(100);
    setRadiusC(400);
    setOrdinateM(6);
    setRequiredSsd(185);
    setSaved(false);
  };

  return (
    <div id="horizontal-curves-module" className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-brand-primary mb-2">منظومة حسابات المنحنيات الأفقية والسرعة الآمنة</h2>
        <p className="text-brand-muted text-sm leading-relaxed mb-6">
          توفر هذه الصفحة الأدوات الهندسية اللازمة لحساب العلاقة بين السرعة التصميمية ونوعية الأسفلت والانعطاف الفعلي للطرق والارتفاع الفرعي الجانبي (Superelevation)، لضمان تماسك عجلات السيارات ضد الانزلاق الطارد.
        </p>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 mb-6 gap-2">
          {[
            { id: "speed", label: "السرعة الآمنة على منحنى" },
            { id: "radius", label: "حساب نصف قطر المنحنى" },
            { id: "sight", label: "مسافة الرؤية والـ SSD" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSaved(false);
              }}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 -mb-[2px] ${
                activeTab === tab.id
                  ? "border-brand-primary text-brand-primary font-bold"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Interactive content row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Form variables inputs */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 border-r-4 border-brand-primary pr-3 text-sm">متغيرات المعادلة</h3>

            {/* Common parameters for speed and radius cases */}
            {activeTab !== "sight" && (
              <div className="grid grid-cols-2 gap-3 pb-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1">الارتفاع الجانبي (e) %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={ePercent}
                    onChange={(e) => {
                      setEPercent(Math.max(-5, parseFloat(e.target.value) || 0));
                      setSaved(false);
                    }}
                    className="w-full text-left font-mono text-xs border border-gray-300 rounded px-2 py-1 bg-white outline-none"
                  />
                  <span className="text-[9px] text-gray-450 block mt-0.5">عادة 4% إلى 12%</span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1">الاحتكاك الجانبي (f)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={fFactor}
                    onChange={(e) => {
                      setFFactor(Math.max(0.01, parseFloat(e.target.value) || 0));
                      setSaved(false);
                    }}
                    className="w-full text-left font-mono text-xs border border-gray-300 rounded px-2 py-1 bg-white outline-none"
                  />
                  <span className="text-[9px] text-gray-450 block mt-0.5">يتراوح بين 0.08 و 0.19</span>
                </div>
              </div>
            )}

            {activeTab === "speed" && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">نصف القطر القائم للمنحنى الميداني (R)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={radiusA}
                    onChange={(e) => {
                      setRadiusA(Math.max(1, parseFloat(e.target.value) || 0));
                      setSaved(false);
                    }}
                    className="w-full text-left font-mono text-xs border border-gray-300 rounded p-2 focus:ring-1 focus:ring-brand-primary outline-none"
                  />
                  <span className="absolute right-3 top-2 text-xs text-gray-500 font-sans pointer-events-none">متر m</span>
                </div>
              </div>
            )}

            {activeTab === "radius" && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">السرعة التصميمية المستهدفة بالطريق (V)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={speedB}
                    onChange={(e) => {
                      const v = Math.max(1, parseInt(e.target.value) || 0);
                      setSpeedB(v);
                      // Auto-update f coefficient dynamically from lookup if available
                      if (SIDE_FRICTION_COEFFICIENTS[v]) {
                        setFFactor(SIDE_FRICTION_COEFFICIENTS[v]);
                      }
                      setSaved(false);
                    }}
                    className="w-full text-left font-mono text-xs border border-gray-300 rounded p-2 focus:ring-1 focus:ring-brand-primary outline-none"
                  />
                  <span className="absolute right-3 top-2 text-xs text-gray-500 font-sans pointer-events-none">كم/ساعة km/h</span>
                </div>
              </div>
            )}

            {activeTab === "sight" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">نصف قطر المنحنى الأفقي (R) م:</label>
                  <input
                    type="number"
                    value={radiusC}
                    onChange={(e) => {
                      setRadiusC(Math.max(1, parseFloat(e.target.value) || 0));
                      setSaved(false);
                    }}
                    className="w-full text-left font-mono text-xs border border-gray-300 rounded p-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">المسافة للعوائق الجانبية الجرفية (m) م:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ordinateM}
                    onChange={(e) => {
                      setOrdinateM(Math.max(0.1, parseFloat(e.target.value) || 0));
                      setSaved(false);
                    }}
                    className="w-full text-left font-mono text-xs border border-gray-300 rounded p-2 outline-none"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">البعد الجانبي الصافي من مركز مسار الحافة الأقرب إلى وجه الجبل أو الحاجز الحاجب للرؤية.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">مسافة الرؤية المطلوبة للتوقف (Required SSD) م:</label>
                  <input
                    type="number"
                    value={requiredSsd}
                    onChange={(e) => {
                      setRequiredSsd(Math.max(1, parseFloat(e.target.value) || 0));
                      setSaved(false);
                    }}
                    className="w-full text-left font-mono text-xs border border-gray-300 rounded p-2 outline-none"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-700 rounded border border-gray-205 hover:bg-gray-100 text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-brand-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>نسخ الحساب</span>
              </button>
              <button
                onClick={() => {
                  handleReset();
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-500 rounded border border-gray-205 hover:bg-gray-100 text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-4 py-1.5 bg-brand-primary text-white rounded hover:bg-opacity-90 text-xs transition-all mr-auto shadow-sm font-semibold"
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{saved ? "تم الحفظ" : "حفظ النتيجة"}</span>
              </button>
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 text-base mb-3">التحليل الحسابي</h3>

              {activeTab === "speed" && (
                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-lg border border-slate-205 shadow-sm">
                    <div className="text-xs text-brand-muted">السرعة القصوى الآمنة هندسياً (V):</div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-mono font-bold text-brand-primary">{calculatedSpeed.toFixed(2)}</span>
                      <span className="text-sm font-bold text-gray-550">كم/ساعة</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-500 leading-relaxed font-sans">
                    المعادلة المطبقة: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">V = √[127 × R × (e + f)]</span>. في حال هطول المطر أو الانجماد بمرتفعات تبوك يُوصى بتبني سرعة حظر تقل بـ <span className="font-mono">20%</span> عن القيمة الرياضية أعلاه لتفادي عدم الانزلاق المسحوب.
                  </div>
                </div>
              )}

              {activeTab === "radius" && (
                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-lg border border-slate-205 shadow-sm">
                    <div className="text-xs text-brand-muted">نصف القطر الأدنى المسموح به (R):</div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-mono font-bold text-brand-primary">{calculatedRadius.toFixed(2)}</span>
                      <span className="text-sm font-bold text-gray-550">متر m</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-500 leading-relaxed font-sans">
                    المعادلة لسلامة الالتفاف: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">R = V² / [127 × (e + f)]</span>.
                  </div>
                </div>
              )}

              {activeTab === "sight" && (
                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-lg border border-slate-205 shadow-sm space-y-2">
                    <div>
                      <div className="text-xs text-brand-muted">مسافة الرؤية الأفقية الحرة المتوفرة (Sa):</div>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-2xl font-mono font-bold text-slate-800">{availableSightDistance.toFixed(2)}</span>
                        <span className="text-xs text-gray-500">متر</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-dashed border-slate-200">
                      <div className="text-xs text-brand-muted">الإزاحة الدنيا المقترحة لمنع حجب الرؤية (m) م:</div>
                      <div className="text-base font-mono font-bold text-slate-800 mt-0.5">{requiredOrdinate.toFixed(2)} متر</div>
                      <span className="text-[9px] text-gray-400 mt-0.5 font-sans block">معيار هندسي: m = R * (1 - cos(SSD / 2R))</span>
                    </div>
                  </div>

                  {/* Safety Alert Badge */}
                  <div className={`p-3 rounded-lg border flex gap-2 items-start ${
                    isSightSafe 
                      ? "bg-brand-success/10 border-brand-success text-brand-success" 
                      : "bg-brand-danger/10 border-brand-danger text-brand-danger"
                  }`}>
                    {isSightSafe ? (
                      <>
                        <ShieldCheck className="w-5 h-5 shrink-0" />
                        <div className="text-xs leading-relaxed">
                          <span className="font-bold">استيفاء آمن:</span> مسافة الرؤية المتوفرة على المنحنى (<span className="font-mono font-bold">{availableSightDistance.toFixed(1)}م</span>) تتجاوز وتغطي متطلب سلامة التوقف الـ SSD المطلوبة (<span className="font-mono font-bold">{requiredSsd}م</span>). الوضع سليم.
                        </div>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-5 h-5 shrink-0" />
                        <div className="text-xs leading-relaxed">
                          <span className="font-bold">مخاطر حجب رؤية:</span> مسافة الرؤية المتوفرة (<span className="font-mono font-bold">{availableSightDistance.toFixed(1)}م</span>) غير كافية وتقل عن متطلب الكود للأمان للتوقف (<span className="font-mono font-bold">{requiredSsd}م</span>). يجب توسيع الجوانب أو خفض السرعة فوراً!
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Grid of Min curves radii by speed */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Table className="w-5 h-5 text-brand-secondary" />
          <h3 className="font-bold text-gray-800 text-sm">جدول توازن الحدود الدنيا لأنصاف أقطار المنحنيات الأفقية (Min Radii) - كود 301</h3>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          يعرض الجدول أدنى نصف قطر مسموح به (متر m) لمنع انزلاق المركبات على المنعطفات بحسب نسب الارتفاعات الفائقة المتنوعة (e):
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-gray-500">
                <th className="p-2 text-right">السرعة التصميمية</th>
                <th className="p-2">معامل الاحتكاك f</th>
                <th className="p-2">التعلية e = 4%</th>
                <th className="p-2">التعلية e = 6%</th>
                <th className="p-2">التعلية e = 8%</th>
                <th className="p-2">التعلية e = 10%</th>
                <th className="p-2">التعلية e = 12%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono text-gray-700">
              {Object.keys(MIN_CURVE_RADIUS_TABLE).map((spdStr) => {
                const spd = parseInt(spdStr);
                const values = MIN_CURVE_RADIUS_TABLE[spd];
                const f = SIDE_FRICTION_COEFFICIENTS[spd] || 0.15;
                const isSelectedSpeed = (activeTab === "radius" && spd === speedB) || (activeTab === "speed" && Math.abs(spd - calculatedSpeed) < 10);

                return (
                  <tr key={spd} className={`hover:bg-slate-50 ${isSelectedSpeed ? "bg-brand-primary/5 font-semibold" : ""}`}>
                    <td className="p-2 text-right font-sans font-bold text-gray-900">{spd} كم/ساعة</td>
                    <td className="p-2 text-slate-550 font-sans">{f}</td>
                    <td className="p-2">{values[4] ? `${values[4]} م` : "-"}</td>
                    <td className="p-2 font-bold text-brand-primary">{values[6] ? `${values[6]} م` : "-"}</td>
                    <td className="p-2">{values[8] ? `${values[8]} م` : "-"}</td>
                    <td className="p-2">{values[10] ? `${values[10]} م` : "-"}</td>
                    <td className="p-2">{values[12] ? `${values[12]} م` : "-"}</td>
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
