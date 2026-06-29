/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";

const C = {
  primary: "#407189",
  success: "#3E7761",
  warning: "#C6A230",
  danger: "#A8483D",
  secondary: "#7B6756",
  muted: "#636569",
};

function CableSection() {
  return (
    <svg viewBox="0 0 90 56" width="78" height="48" aria-hidden>
      {/* ground */}
      <line x1={6} y1={50} x2={84} y2={50} stroke={C.muted} strokeWidth={1.5} />
      {/* weak post */}
      <line x1={45} y1={50} x2={45} y2={12} stroke={C.secondary} strokeWidth={2.5} />
      {/* three cables */}
      <line x1={10} y1={18} x2={80} y2={18} stroke={C.primary} strokeWidth={2} />
      <line x1={10} y1={26} x2={80} y2={26} stroke={C.primary} strokeWidth={2} />
      <line x1={10} y1={34} x2={80} y2={34} stroke={C.primary} strokeWidth={2} />
      <circle cx={45} cy={18} r={2.4} fill={C.primary} />
      <circle cx={45} cy={26} r={2.4} fill={C.primary} />
      <circle cx={45} cy={34} r={2.4} fill={C.primary} />
    </svg>
  );
}

function WBeamSection() {
  return (
    <svg viewBox="0 0 90 56" width="78" height="48" aria-hidden>
      <line x1={6} y1={50} x2={84} y2={50} stroke={C.muted} strokeWidth={1.5} />
      {/* strong post */}
      <rect x={42} y={26} width={6} height={24} fill={C.secondary} />
      {/* W-beam profile */}
      <path d="M10,20 L24,20 L30,26 L24,32 L66,32 L60,26 L66,20 L80,20" fill="none" stroke={C.primary} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function ConcreteSection() {
  return (
    <svg viewBox="0 0 90 56" width="78" height="48" aria-hidden>
      <line x1={6} y1={50} x2={84} y2={50} stroke={C.muted} strokeWidth={1.5} />
      {/* New-Jersey concrete profile */}
      <path d="M30,50 L60,50 L56,30 L52,18 L38,18 L34,30 Z" fill={C.secondary} fillOpacity={0.18} stroke={C.secondary} strokeWidth={2} strokeLinejoin="round" />
      <line x1={38} y1={30} x2={52} y2={30} stroke={C.secondary} strokeWidth={1} />
    </svg>
  );
}

interface Row {
  type: string;
  shape: React.ReactNode;
  desc: string;
  deflection: string;
  minDist: string;
}

const ROWS: Row[] = [
  {
    type: "حاجز كيبل ثلاثي على أعمدة ضعيفة",
    shape: <CableSection />,
    desc: "ثلاثة كيبلات قطر 19مم على أعمدة S75×8.5 بتباعد 4.9م",
    deflection: "3.3 م",
    minDist: "3.6 م",
  },
  {
    type: "حاجز معدني (W-beam) على أعمدة قوية",
    shape: <WBeamSection />,
    desc: "شريحة W بطول 2.7م كحد أدنى على أعمدة فولاذية C150×100×50 بتباعد 1.9م",
    deflection: "0.9 م",
    minDist: "1.0 م",
  },
  {
    type: "حاجز خرساني (Type 1)",
    shape: <ConcreteSection />,
    desc: "حاجز خرساني صلب غير مرن (مقطع نيوجرسي)",
    deflection: "صفر",
    minDist: "لا ينطبق",
  },
];

export default function BarrierTypesTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="text-sm font-bold text-brand-primary mb-1">أنواع حواجز الحماية ومسافات الانحراف — جدول 1.15.3 (AASHTO)</div>
      <div className="text-[11px] text-brand-muted mb-3">مرجعي فقط؛ اختر النوع المناسب بحسب الانحراف عند الصدم والمسافة المتاحة من وجه الحاجز إلى العائق.</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse" dir="rtl">
          <thead>
            <tr className="bg-brand-primary/10 text-brand-primary">
              <th className="p-2.5 text-right font-bold border border-gray-200">النوع</th>
              <th className="p-2.5 text-center font-bold border border-gray-200">الشكل والأبعاد</th>
              <th className="p-2.5 text-right font-bold border border-gray-200">الوصف</th>
              <th className="p-2.5 text-center font-bold border border-gray-200">الانحراف عند الصدم</th>
              <th className="p-2.5 text-center font-bold border border-gray-200">أدنى مسافة من وجه الحاجز إلى العائق</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50" : "bg-white"}>
                <td className="p-2.5 font-bold text-gray-800 border border-gray-200 align-middle">{r.type}</td>
                <td className="p-2.5 border border-gray-200 align-middle text-center">{r.shape}</td>
                <td className="p-2.5 text-brand-muted border border-gray-200 align-middle leading-relaxed">{r.desc}</td>
                <td className="p-2.5 text-center font-mono font-bold text-brand-danger border border-gray-200 align-middle">{r.deflection}</td>
                <td className="p-2.5 text-center font-mono font-bold text-brand-secondary border border-gray-200 align-middle">{r.minDist}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
