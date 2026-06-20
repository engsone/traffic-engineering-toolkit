/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { CalculationRecord } from "../types";
import { Copy, Save, RotateCcw, Check, AlertTriangle, ShieldAlert } from "lucide-react";
import { ROADSIDE_DESIGN_LOOKUP } from "../data/lookupTables";

interface Props {
  onSaveCalculation: (calc: Omit<CalculationRecord, "id" | "timestamp">) => void;
}

export default function UndividedBarrier({ onSaveCalculation }: Props) {
  // Common inputs
  const [speed, setSpeed] = useState<number>(80);
  const [barrierType, setBarrierType] = useState<"steel" | "concrete">("steel");
  const [lr, setLr] = useState<number>(100);
  const [flareRatio, setFlareRatio] = useState<number>(11);
  const [l1, setL1] = useState<number>(8); // Default 8m as requested
  const [l0, setL0] = useState<number>(20);
  const [terminalLength, setTerminalLength] = useState<number>(3.80);
  const [laneWidth, setLaneWidth] = useState<number>(3.65); // Default oncoming lane width

  // Inputs for Card 1 (Yellow line)
  const [lhYellow, setLhYellow] = useState<number>(5.5);
  const [l2, setL2] = useState<number>(1.5);
  const [l3, setL3] = useState<number>(3.0); // Default L3

  const [saved, setSaved] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Auto-fill from lookup tables on speed or barrier type change
  useEffect(() => {
    const config = ROADSIDE_DESIGN_LOOKUP.find(r => r.speed === speed);
    if (config) {
      setLr(config.lr);
      setFlareRatio(barrierType === "steel" ? config.steel_flare : config.concrete_flare);
    }
  }, [speed, barrierType]);

  // Formulas solver
  const flareFraction = 1 / flareRatio;

  // 1. Yellow Line Card Calculations
  const lhYellowVal = lhYellow;
  const l2YellowVal = l2;
  const denomYellow = flareFraction + (lhYellowVal / lr);
  const lYellowRaw = denomYellow > 0 ? (lhYellowVal + (flareFraction * l1) - l2YellowVal) / denomYellow : 0;
  const lYellow = Math.max(0, lYellowRaw);
  const yYellow = (lhYellowVal / lr) * lYellow;
  const ltYellow = l0 + terminalLength + lYellow;

  // 2. Centerline Card Calculations (Automatic +laneWidth)
  const lhCenter = lhYellow + laneWidth;
  const l2Center = l2 + laneWidth;
  const l3Center = l3 + laneWidth;

  const denomCenter = flareFraction + (lhCenter / lr);
  const lCenterRaw = denomCenter > 0 ? (lhCenter + (flareFraction * l1) - l2Center) / denomCenter : 0;
  const lCenter = Math.max(0, lCenterRaw);
  const yCenter = (lhCenter / lr) * lCenter;
  const ltCenter = l0 + terminalLength + lCenter;

  const totalLt = ltYellow + ltCenter;
  const governingCase = ltYellow >= ltCenter ? "yellow" : "centerline";

  const handleCopy = () => {
    const text = `تصميم حواجز الحماية الجانبية (الطرق المفردة غير المقسمة) - سرعة ${speed} كم/ساعة:
[1] الحساب الأول (من خط الحافة الأصفر):
- إزاحة العائق LH = ${lhYellow} م
- إزاحة وجه الحاجز L2 = ${l2} م
- بعد العائق L3 = ${l3} م
- طول الحماية المطلوبة بالانحراف المائل L = ${lhYellow > l2 ? lYellow.toFixed(2) : "0.00"} م
- الطول الإجمالي للحاجز Lt① = ${ltYellow.toFixed(2)} م

[2] الحساب الثاني (من سنتر الطريق - تلقائي + ${laneWidth} م):
- إزاحة العائق LH② = ${lhCenter.toFixed(2)} م
- إزاحة وجه الحاجز L2② = ${l2Center.toFixed(2)} م
- بعد العائق L3② = ${l3Center.toFixed(2)} م
- طول الحماية المطلوبة بالانحراف المائل L = ${lhCenter > l2Center ? lCenter.toFixed(2) : "0.00"} م
- الطول الإجمالي للحاجز Lt② = ${ltCenter.toFixed(2)} م

النتيجة الهندسية النهائية للتركيب:
- الطول المعتمد (مجموع الحسابين) = ${totalLt.toFixed(2)} متر
- شامل حسم مساهمة Lt① و Lt② معاً لتأمين الاتجاهين.

المرجع الرسمي: كود الطرق السعودي 305 تفادياً للاصطدام العكسي والتقاطعي`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSpeed(80);
    setLr(95);
    setL1(8);
    setL2(1.5);
    setL3(3.0);
    setFlareRatio(15);
    setL0(20);
    setTerminalLength(3.80);
    setLaneWidth(3.65);
    setLhYellow(5.5);
    setSaved(false);
  };

  const handleSave = () => {
    onSaveCalculation({
      calculatorId: "undivided_barrier",
      calculatorName: "حواجز الطريق المفرد (Undivided Road Barriers)",
      inputs: {
        "السرعة كم/ساعة": speed,
        "إزاحة عائق خط الحافة (LH) م": lhYellow,
        "بعد الحاجز عن الخط الأصفر (L2) م": l2,
        "بعد العائق عن الخط الأصفر (L3) م": l3,
        "عرض الحارة المعاكسة م": laneWidth,
        "طول الانحراف (LR) م": lr,
        "نسبة الانحراف a:b": `1:${flareRatio}`,
        "طول العائق الطولي (L0) م": l0,
        "طول النهاية المعتمدة م": terminalLength,
        "طول مقطع البداية (L1) م": l1,
      },
      results: {
        "الحساب 1: طول الحماية م": lYellow.toFixed(2),
        "الحساب 1: إجمالي طول الحاجز م": ltYellow.toFixed(2),
        "الحساب 2: طول الحماية م": lCenter.toFixed(2),
        "الحساب 2: إجمالي طول الحاجز م": ltCenter.toFixed(2),
        "الطول الكلي المعتمد (المجموع) م": totalLt.toFixed(2),
      },
      units: {
        "الحساب 1: طول الحماية م": "m",
        "الحساب 1: إجمالي طول الحاجز م": "m",
        "الحساب 2: طول الحماية م": "m",
        "الحساب 2: إجمالي طول الحاجز م": "m",
        "الطول الكلي المعتمد (المجموع) م": "m",
      },
      notes: `تصميم حواجز السلامة لطريق مفرد حارتين. القيمة المعتمدة هي مجموع الحسابين (Lt① + Lt②) لتأمين حركة السير من كلا الاتجاهين. كود 305.`,
      isSafe: true
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div id="undivided-barrier-module" className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-brand-danger/10 p-2 rounded-lg text-brand-danger">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-brand-primary">تصميم حواجز الحماية المعدنية للأكتاف — طرق مفردة (حارتين ثنائية السير)</h2>
        </div>
        <p className="text-brand-muted text-sm leading-relaxed">
          على الطرق المفردة غير المقسمة (Undivided Roads)، تكون المركبات معرضة لخطر الانحراف والاصطدام بالحواجز من كلا الاتجاهين. لذلك، <span className="font-bold text-brand-danger">يُلزِم الكود السعودي 305 بإجراء الحسابات الفنية مرتين متتاليتين</span>: الأولى بقياس البعد من خط الحافة الأصفر المعمر والكتف، والثانية بقياس البعد عن خط منتصف الطريق الفاصل الفعلي (Road Centerline).
        </p>

        {/* Warning Memo */}
        <div className="mt-4 bg-brand-warning/10 border-r-4 border-brand-warning p-3 rounded-lg text-xs leading-relaxed text-gray-800">
          <span className="font-bold">استخدام هندسي دقيق:</span> نعتمد مجموع الحسابين (Lt① + Lt②) كقيمة تركيب حتمية للسلامة لمنع تداخل مسافة الانحراف للمركبات القادمة من كلا الاتجاهين وتغطية زاوية الاصطدام التبادلي بالكامل.
        </div>
      </div>

      {/* Shareable inputs */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800 text-sm border-r-4 border-brand-primary pr-3">المعطيات والمواصفات العامة للطريق والسرعة</h3>
        
        {/* Barrier Type Selection */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-brand-primary"></span>
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
              معدني (Metal)
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
              خرساني (Concrete)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">السرعة التصميمية للمسار (كم/ساعة)</label>
            <input
              type="number"
              value={speed}
              onChange={(e) => {
                const sVal = Math.max(1, parseInt(e.target.value) || 0);
                setSpeed(sVal);
                setSaved(false);
              }}
              className="w-full text-left font-mono text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-brand-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">مسافة وصول المركبة للعائق (LR) م</label>
            <input
              type="number"
              value={lr}
              onChange={(e) => {
                setLr(Math.max(1, parseFloat(e.target.value) || 0));
                setSaved(false);
              }}
              className="w-full text-left font-mono text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-brand-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">نسبة انحراف الحاجز a:b (أدخل b فقط)</label>
            <input
              type="number"
              value={flareRatio}
              onChange={(e) => {
                setFlareRatio(Math.max(1, parseInt(e.target.value) || 0));
                setSaved(false);
              }}
              className="w-full text-left font-mono text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-brand-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">طول العائق الطولي (L0) م</label>
            <input
              type="number"
              value={l0}
              onChange={(e) => {
                setL0(Math.max(1, parseFloat(e.target.value) || 0));
                setSaved(false);
              }}
              className="w-full text-left font-mono text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-brand-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">طول حافة البداية المستقيمة (L1) م</label>
            <input
              type="number"
              value={l1}
              onChange={(e) => {
                setL1(Math.max(0, parseFloat(e.target.value) || 0));
                setSaved(false);
              }}
              className="w-full text-left font-mono text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-brand-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">طول النهاية المعتمدة المستهلكة (Terminal) م</label>
            <input
              type="number"
              value={terminalLength}
              onChange={(e) => {
                setTerminalLength(Math.max(0, parseFloat(e.target.value) || 0));
                setSaved(false);
              }}
              className="w-full text-left font-mono text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-brand-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">عرض الحارة المعاكسة م</label>
            <input
              type="number"
              step="0.05"
              value={laneWidth}
              onChange={(e) => {
                setLaneWidth(Math.max(1.0, parseFloat(e.target.value) || 0));
                setSaved(false);
              }}
              className="w-full text-left font-mono text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-brand-primary outline-none"
            />
          </div>
        </div>
      </div>

      {/* Dual measurements calculators side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card ①: Measured from Yellow Edge Line */}
        <div className="rounded-xl overflow-hidden shadow-sm transition-all duration-300" 
             style={{
               backgroundColor: '#fff7ed',
               border: '2px solid #f59e0b'
             }}>
          <div className="p-4 flex justify-between items-center text-white" style={{ backgroundColor: '#f59e0b' }}>
            <span className="font-bold text-sm text-[#1e293b] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-800 animate-pulse"></span>
              حساب ①: القياس من الخط الأصفر (حافة الطريق)
            </span>
            <span className="bg-[#1e293b] text-[#f59e0b] px-2 py-0.5 rounded text-[10px] font-bold">
              مكون الطول Lt①
            </span>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                المسافة من الخط الأصفر الى أبعد نقطه للعائق (LH) م
              </label>
              <input
                type="number"
                step="0.1"
                value={lhYellow}
                onChange={(e) => {
                  setLhYellow(Math.max(0.1, parseFloat(e.target.value) || 0));
                  setSaved(false);
                }}
                className="w-full text-left font-mono text-sm bg-white border border-[#fed7aa] rounded px-3 py-1.5 focus:ring-1 focus:ring-[#f59e0b] outline-none text-[#1e293b] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                بعد الحاجز عن الخط الأصفر (L2) م
              </label>
              <input
                type="number"
                step="0.1"
                value={l2}
                onChange={(e) => {
                  setL2(Math.max(0, parseFloat(e.target.value) || 0));
                  setSaved(false);
                }}
                className="w-full text-left font-mono text-sm bg-white border border-[#fed7aa] rounded px-3 py-1.5 focus:ring-1 focus:ring-[#f59e0b] outline-none text-[#1e293b] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                بعد العائق عن الخط الأصفر (L3) م <span className="text-[10px] font-normal text-amber-700">(معلومة فقط)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={l3}
                onChange={(e) => {
                  setL3(Math.max(0, parseFloat(e.target.value) || 0));
                  setSaved(false);
                }}
                className="w-full text-left font-mono text-sm bg-white border border-[#fed7aa] rounded px-3 py-1.5 focus:ring-1 focus:ring-[#f59e0b] outline-none text-[#1e293b] font-medium"
              />
            </div>

            {/* Results display for Card 1 */}
            <div className="pt-4 border-t border-amber-200/50 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-amber-100/40 p-2.5 rounded border border-amber-200/50">
                  <div className="text-[10px] text-amber-800 font-medium">طول الحماية بالانحراف المائل (L)</div>
                  <div className="text-sm font-mono font-bold text-[#1e293b]">{lYellow.toFixed(2)} م</div>
                </div>
                <div className="bg-amber-100/40 p-2.5 rounded border border-amber-200/50">
                  <div className="text-[10px] text-amber-800 font-medium">البداية الطرفية الانحرافية (Y)</div>
                  <div className="text-sm font-mono font-bold text-[#1e293b]">{yYellow.toFixed(2)} م</div>
                </div>
              </div>
              <div className="bg-[#f59e0b]/10 p-3 rounded border border-[#f59e0b]/30">
                <div className="text-xs text-amber-900 font-bold">إجمالي الطول المطلوب للجهة المجاورة (Lt①):</div>
                <div className="text-lg font-mono font-bold text-[#1e293b] mt-0.5">{ltYellow.toFixed(2)} م</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card ②: Measured from Centerline (Calculated) */}
        <div className="rounded-xl overflow-hidden shadow-sm transition-all duration-300"
             style={{
               backgroundColor: '#e0f2fe',
               border: '2px solid #0e7490'
             }}>
          <div className="p-4 flex justify-between items-center text-white" style={{ backgroundColor: '#0e7490' }}>
            <span className="font-bold text-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-200 animate-pulse"></span>
              حساب ②: القياس من منتصف الطريق (Centerline)
            </span>
            <span className="bg-white text-[#0e7490] px-2 py-0.5 rounded text-[10px] font-bold">
              مكون الطول Lt②
            </span>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-[#0e7490]">
                  المسافة من منتصف الطريق إلى أبعد نقطة للعائق (LH₂) م
                </label>
                <span className="text-[10px] text-cyan-700 bg-white px-2 py-0.5 rounded border border-cyan-200 font-mono font-bold">
                  LH + {laneWidth}م
                </span>
              </div>
              <div className="w-full text-left font-mono text-sm bg-cyan-50/50 border border-cyan-200 rounded px-3 py-1.5 text-[#0e7490] font-bold cursor-not-allowed">
                {lhCenter.toFixed(2)} م
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-[#0e7490]">
                  إزاحة وجه الحاجز عن منتصف الطريق (L2₂) م
                </label>
                <span className="text-[10px] text-cyan-700 bg-white px-2 py-0.5 rounded border border-cyan-200 font-mono font-bold">
                  L2 + {laneWidth}م
                </span>
              </div>
              <div className="w-full text-left font-mono text-sm bg-cyan-50/50 border border-cyan-200 rounded px-3 py-1.5 text-[#0e7490] font-bold cursor-not-allowed">
                {l2Center.toFixed(2)} م
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-[#0e7490]">
                  بعد العائق عن منتصف الطريق (L3₂) م <span className="text-[10px] font-normal text-cyan-600">(معلومة فقط)</span>
                </label>
                <span className="text-[10px] text-cyan-700 bg-white px-2 py-0.5 rounded border border-cyan-200 font-mono font-bold">
                  L3 + {laneWidth}م
                </span>
              </div>
              <div className="w-full text-left font-mono text-sm bg-cyan-50/50 border border-cyan-200 rounded px-3 py-1.5 text-[#0e7490] font-semibold cursor-not-allowed">
                {l3Center.toFixed(2)} م
              </div>
            </div>

            {/* Results display for Card 2 */}
            <div className="pt-4 border-t border-cyan-200/50 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-cyan-100/50 p-2.5 rounded border border-cyan-200/40">
                  <div className="text-[10px] text-cyan-800 font-medium">طول الحماية بالانحراف المائل (L)</div>
                  <div className="text-sm font-mono font-bold text-[#0e7490]">{lCenter.toFixed(2)} م</div>
                </div>
                <div className="bg-cyan-100/50 p-2.5 rounded border border-cyan-200/40">
                  <div className="text-[10px] text-cyan-800 font-medium">البداية الطرفية الانحرافية (Y)</div>
                  <div className="text-sm font-mono font-bold text-[#0e7490]">{yCenter.toFixed(2)} م</div>
                </div>
              </div>
              <div className="bg-[#0e7490]/10 p-3 rounded border border-[#0e7490]/20">
                <div className="text-xs text-cyan-900 font-bold">إجمالي الطول المطلوب للسير المعاكس (Lt②):</div>
                <div className="text-lg font-mono font-bold text-[#0e7490] mt-0.5">{ltCenter.toFixed(2)} م</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Synthesis final ribbon / Save action bar */}
      <div className="p-6 rounded-xl border-t-4 shadow-md text-white space-y-4" style={{ backgroundColor: '#0a1f44', borderTopColor: '#f59e0b' }}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-right w-full lg:w-auto">
            <div className="flex items-center gap-2 justify-start">
              <div className="bg-[#f59e0b] text-[#1e293b] font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                التوصية الهندسية النهائية
              </div>
              <span className="text-[11px] text-cyan-200 font-medium">حسب مواصفات AASHTO</span>
            </div>
            <h3 className="text-sm md:text-base font-bold text-white mt-1 leading-relaxed">
              طول الحاجز الكلي المعتمد للتركيب (Lt) = مجموع <span className="text-[#f59e0b] font-mono">Lt①</span> + <span className="text-[#38bdf8] font-mono">Lt②</span>
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed max-w-2xl">
              يتم دمج وجمع طولي التغطية معاً لتغطية مسافة الانحراف التبادلي والاصطدام بالكامل للمركبات القادمة من كلا الاتجاهين على الطرق غير المقسمة.
            </p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-lg flex flex-col items-center justify-center min-w-[220px] border"
               style={{ borderColor: '#f59e0b' }}>
            <span className="text-[10px] text-gray-400 font-bold uppercase">النتيجة النهائية المعتمدة</span>
            <span className="text-2xl font-mono font-extrabold text-[#f59e0b] mt-1">
              {totalLt.toFixed(2)} م
            </span>
            <span className="text-[10px] text-cyan-200 mt-1 max-w-[200px] text-center leading-relaxed">
              مجموع Lt① ({ltYellow.toFixed(1)}م) + Lt② ({ltCenter.toFixed(1)}م)
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700/60 flex flex-wrap justify-between items-center gap-4">
          <div className="text-xs text-slate-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0" />
            <span>شامل حافة البداية المستقيمة {l1}م والنهاية المعتمدة {terminalLength}م</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-2 bg-slate-800 text-slate-305 hover:bg-slate-700 hover:text-white text-xs transition-colors border border-slate-700 rounded"
            >
              <RotateCcw className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
              إعادة تعيين وبدء جديد
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-slate-800 text-slate-305 hover:bg-slate-700 hover:text-white text-xs transition-colors border border-slate-700 rounded"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-brand-success inline mr-1" /> : <Copy className="w-3.5 h-3.5 inline mr-1 text-slate-400" />}
              نسخ النتائج الهندسية
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 hover:bg-[#d97706] text-[#1e293b] font-bold rounded text-xs transition-all shadow-sm"
              style={{ backgroundColor: '#f59e0b' }}
            >
              {saved ? <Check className="w-3.5 h-3.5 inline mr-1" /> : <Save className="w-3.5 h-3.5 inline mr-1" />}
              حفظ السجل الفني
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
