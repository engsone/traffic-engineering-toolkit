/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";

const C = {
  ink: "#1e293b",
  primary: "#407189",
  danger: "#A8483D",
  secondary: "#7B6756",
  muted: "#636569",
};

function Ground({ y }: { y: number }) {
  return (
    <g>
      <line x1={14} y1={y} x2={116} y2={y} stroke={C.muted} strokeWidth={1.5} />
      {[20, 34, 48, 62, 76, 90, 104].map((x) => (
        <line key={x} x1={x} y1={y} x2={x - 6} y2={y + 7} stroke={C.muted} strokeWidth={1} />
      ))}
    </g>
  );
}

function CableSection() {
  return (
    <svg viewBox="0 0 130 150" width="112" height="130" aria-hidden>
      <Ground y={116} />
      {/* weak post */}
      <rect x={62} y={36} width={6} height={80} fill={C.secondary} fillOpacity={0.35} stroke={C.secondary} strokeWidth={1.25} />
      {/* below ground break */}
      <path d="M65,116 l-3,6 l6,4 l-6,4 l3,4" fill="none" stroke={C.secondary} strokeWidth={1} />
      {/* three cables on the post */}
      {[44, 56, 68].map((y, i) => (
        <g key={i}>
          <line x1={30} y1={y} x2={62} y2={y} stroke={C.primary} strokeWidth={2} />
          <circle cx={62} cy={y} r={3} fill="#fff" stroke={C.primary} strokeWidth={1.75} />
        </g>
      ))}
      {/* dims */}
      <text x={50} y={32} fill={C.muted} fontSize={8} textAnchor="middle">90مم</text>
      <text x={20} y={59} fill={C.muted} fontSize={8} textAnchor="start">100مم</text>
      <line x1={80} y1={36} x2={80} y2={116} stroke={C.muted} strokeWidth={0.75} />
      <text x={88} y={78} fill={C.muted} fontSize={8} textAnchor="start">1.6م</text>
      <text x={65} y={140} fill={C.primary} fontSize={8} textAnchor="middle" fontWeight={700}>Ø19مم</text>
    </svg>
  );
}

function WBeamSection() {
  return (
    <svg viewBox="0 0 130 150" width="112" height="130" aria-hidden>
      <Ground y={116} />
      {/* strong post */}
      <rect x={70} y={42} width={9} height={74} fill={C.secondary} fillOpacity={0.35} stroke={C.secondary} strokeWidth={1.25} />
      <path d="M74,116 l-3,6 l6,4 l-6,4 l3,4" fill="none" stroke={C.secondary} strokeWidth={1} />
      {/* W-beam corrugated profile (end view) */}
      <path d="M70,40 L52,40 L46,46 L52,52 L46,58 L52,64 L70,64" fill="none" stroke={C.primary} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {/* dims */}
      <text x={48} y={36} fill={C.muted} fontSize={8} textAnchor="middle">20مم</text>
      <line x1={92} y1={42} x2={92} y2={116} stroke={C.muted} strokeWidth={0.75} />
      <text x={98} y={70} fill={C.muted} fontSize={8} textAnchor="start">1.63م</text>
      <text x={40} y={78} fill={C.muted} fontSize={8} textAnchor="middle">690مم</text>
    </svg>
  );
}

function ConcreteSection() {
  return (
    <svg viewBox="0 0 130 150" width="112" height="130" aria-hidden>
      <Ground y={120} />
      {/* New-Jersey safety shape */}
      <path d="M40,120 L90,120 L84,104 L74,58 L72,44 L58,44 L56,58 L46,104 Z" fill={C.secondary} fillOpacity={0.16} stroke={C.secondary} strokeWidth={1.75} strokeLinejoin="round" />
      <line x1={46} y1={104} x2={84} y2={104} stroke={C.secondary} strokeWidth={0.75} strokeDasharray="2 2" />
      {/* key dims */}
      <text x={65} y={40} fill={C.muted} fontSize={8} textAnchor="middle">16سم</text>
      <text x={65} y={134} fill={C.muted} fontSize={8} textAnchor="middle">62سم</text>
      <line x1={98} y1={44} x2={98} y2={120} stroke={C.muted} strokeWidth={0.75} />
      <text x={104} y={84} fill={C.muted} fontSize={8} textAnchor="start">85سم</text>
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
    desc: "حاجز خرساني صلب غير مرن (مقطع نيوجرسي) — ارتفاع 85سم، قاعدة 62سم",
    deflection: "صفر",
    minDist: "لا ينطبق",
  },
];

export default function BarrierTypesTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="text-sm font-bold text-brand-primary mb-1">أنواع حواجز الحماية — جدول 1.15.3 (AASHTO Roadside Barriers)</div>
      <div className="text-[11px] text-brand-muted mb-3">المقاطع بأبعادها الحقيقية؛ مرجعي لاختيار النوع حسب الانحراف عند الصدم والمسافة المتاحة.</div>
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
                <td className="p-2 border border-gray-200 align-middle text-center bg-white">{r.shape}</td>
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
