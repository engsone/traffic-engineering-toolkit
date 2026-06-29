/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";

interface DiagramProps {
  lh: number;
  lr: number;
  l1: number;
  l2: number;
  l0: number;
  terminal: number;
  L: number;
  Y: number;
  Lt: number;
  lc?: number;
  isLhExceedsLc?: boolean;
  directionLabel?: string;
}

const C = {
  primary: "#407189",
  success: "#3E7761",
  warning: "#C6A230",
  danger: "#A8483D",
  secondary: "#7B6756",
  muted: "#636569",
};

const f = (n: number): string => (isFinite(n) ? n.toFixed(1) : "0.0");

function Tick({ x, y, vertical }: { x: number; y: number; vertical?: boolean }) {
  return vertical ? (
    <line x1={x - 4} y1={y} x2={x + 4} y2={y} stroke={C.muted} strokeWidth={1} />
  ) : (
    <line x1={x} y1={y - 4} x2={x} y2={y + 4} stroke={C.muted} strokeWidth={1} />
  );
}

function DimLabel({ x, y, text, color, vertical }: { x: number; y: number; text: string; color: string; vertical?: boolean }) {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={11}
      fontWeight={700}
      textAnchor="middle"
      dominantBaseline="central"
      transform={vertical ? `rotate(-90 ${x} ${y})` : undefined}
      style={{ paintOrder: "stroke", stroke: "#ffffff", strokeWidth: 3, strokeLinejoin: "round" }}
    >
      {text}
    </text>
  );
}

export default function BarrierLayoutDiagram(p: DiagramProps) {
  // Schematic fixed layout. Numbers are live; geometry is illustrative only.
  const edgeY = 272;   // road edge (yellow line) y
  const czY = 64;      // clear zone boundary y
  const hazardX = 78;  // hazard box left
  const hazardW = 86;  // hazard box width (schematic)
  const hazardY = 92;  // hazard box top
  const hazardH = 26;
  // Barrier schematic: tangent part near hazard then flares toward road edge
  const bStartX = 168;             // upstream start (tangent) x
  const bTangentEndX = 244;        // end of tangent (L1)
  const bDownX = 498;              // downstream end (flared) near edge
  const bTopY = hazardY + hazardH + 14; // barrier line near hazard side
  const bBotY = edgeY - 18;        // barrier near road edge

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 overflow-x-auto shadow-sm">
      <div className="text-sm font-bold text-brand-primary mb-1">المخطط التخطيطي للحاجز — شكل 1.15.9 (AASHTO)</div>
      <div className="text-[11px] text-brand-muted mb-3">الأبعاد تتحدّث تلقائياً من المدخلات والنتائج (مخطط تخطيطي وليس بمقياس رسم دقيق).</div>
      <svg viewBox="0 0 620 330" className="w-full" style={{ minWidth: 560 }}>
        {/* Clear zone boundary */}
        <line x1={28} y1={czY} x2={592} y2={czY} stroke={C.secondary} strokeWidth={1.5} strokeDasharray="7 5" />
        <text x={36} y={czY - 7} fill={C.secondary} fontSize={11} fontWeight={700}>حدّ حرم الأمان (Clear Zone)</text>

        {/* Road edge (yellow line) */}
        <line x1={28} y1={edgeY} x2={592} y2={edgeY} stroke={C.warning} strokeWidth={3} />
        <text x={584} y={edgeY + 16} fill={C.warning} fontSize={11} fontWeight={700} textAnchor="end">حافة المسار (الخط الأصفر)</text>
        {/* Direction of travel arrow */}
        <g>
          <line x1={120} y1={edgeY + 14} x2={56} y2={edgeY + 14} stroke={C.muted} strokeWidth={1.5} />
          <path d={`M56,${edgeY + 14} l9,-4 l0,8 Z`} fill={C.muted} />
          <text x={126} y={edgeY + 18} fill={C.muted} fontSize={10} fontWeight={700}>اتجاه السير</text>
        </g>

        {/* LR dimension (runout) at very top */}
        <line x1={hazardX} y1={42} x2={bDownX} y2={42} stroke={C.muted} strokeWidth={1} />
        <Tick x={hazardX} y={42} />
        <Tick x={bDownX} y={42} />
        <DimLabel x={(hazardX + bDownX) / 2} y={34} text={`LR (طول الانحراف) = ${f(p.lr)} م`} color={C.muted} />

        {/* Hazard box */}
        <rect x={hazardX} y={hazardY} width={hazardW} height={hazardH} rx={3} fill={C.danger} fillOpacity={0.14} stroke={C.danger} strokeWidth={1.5} />
        <text x={hazardX + hazardW / 2} y={hazardY + hazardH / 2} fill={C.danger} fontSize={11} fontWeight={700} textAnchor="middle" dominantBaseline="central">العائق</text>
        {/* L0 dimension under hazard */}
        <line x1={hazardX} y1={hazardY + hazardH + 8} x2={hazardX + hazardW} y2={hazardY + hazardH + 8} stroke={C.danger} strokeWidth={1} />
        <Tick x={hazardX} y={hazardY + hazardH + 8} />
        <Tick x={hazardX + hazardW} y={hazardY + hazardH + 8} />
        <DimLabel x={hazardX + hazardW / 2} y={hazardY + hazardH + 18} text={`L0 = ${f(p.l0)} م`} color={C.danger} />

        {/* LH dimension (vertical) from edge up to hazard */}
        <line x1={48} y1={edgeY} x2={48} y2={hazardY + hazardH} stroke={C.primary} strokeWidth={1} />
        <Tick x={48} y={edgeY} vertical />
        <Tick x={48} y={hazardY + hazardH} vertical />
        <DimLabel x={40} y={(edgeY + hazardY + hazardH) / 2} text={`LH = ${f(p.lh)} م`} color={C.primary} vertical />

        {/* Barrier: tangent + flared posts */}
        <g>
          {/* tangent (L1) near hazard */}
          <line x1={bStartX} y1={bTopY} x2={bTangentEndX} y2={bTopY} stroke={C.primary} strokeWidth={3} />
          {/* flared part down to road edge (Length of Need L) */}
          <line x1={bTangentEndX} y1={bTopY} x2={bDownX} y2={bBotY} stroke={C.primary} strokeWidth={3} />
          {/* posts */}
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((t, i) => {
            const x = bTangentEndX + (bDownX - bTangentEndX) * t;
            const y = bTopY + (bBotY - bTopY) * t;
            return <line key={i} x1={x} y1={y - 5} x2={x} y2={y + 5} stroke={C.primary} strokeWidth={2} />;
          })}
          {[bStartX + 18, bStartX + 46].map((x, i) => (
            <line key={`t${i}`} x1={x} y1={bTopY - 5} x2={x} y2={bTopY + 5} stroke={C.primary} strokeWidth={2} />
          ))}
        </g>
        {/* L label along the flare */}
        <DimLabel x={(bTangentEndX + bDownX) / 2 + 10} y={(bTopY + bBotY) / 2 - 12} text={`طول الحماية L = ${f(p.L)} م`} color={C.success} />
        {/* L1 label */}
        <DimLabel x={(bStartX + bTangentEndX) / 2} y={bTopY - 12} text={`L1 = ${f(p.l1)} م`} color={C.primary} />

        {/* L2 small offset near road edge at downstream end */}
        <line x1={bDownX} y1={bBotY} x2={bDownX} y2={edgeY} stroke={C.secondary} strokeWidth={1} />
        <DimLabel x={bDownX + 30} y={(bBotY + edgeY) / 2} text={`L2 = ${f(p.l2)} م`} color={C.secondary} />
        {/* Y offset of barrier start */}
        <line x1={bStartX} y1={bTopY} x2={bStartX} y2={edgeY} stroke={C.muted} strokeWidth={0.75} strokeDasharray="3 3" />
        <DimLabel x={bStartX - 26} y={(bTopY + edgeY) / 2} text={`Y = ${f(p.Y)} م`} color={C.muted} vertical />

        {/* Crashworthy terminal at downstream end */}
        <g>
          <path d={`M${bDownX},${bBotY} l16,-7 l0,14 Z`} fill={C.success} />
          <text x={bDownX + 22} y={bBotY + 4} fill={C.success} fontSize={10} fontWeight={700}>نهاية ماصّة للصدمات</text>
        </g>

        {/* LC dimension (vertical) on the right if provided */}
        {typeof p.lc === "number" && (
          <g>
            <line x1={572} y1={edgeY} x2={572} y2={czY} stroke={C.secondary} strokeWidth={1} />
            <Tick x={572} y={edgeY} vertical />
            <Tick x={572} y={czY} vertical />
            <DimLabel x={580} y={(edgeY + czY) / 2} text={`LC = ${f(p.lc)} م`} color={C.secondary} vertical />
          </g>
        )}
      </svg>

      {/* Live result + special-case note */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="inline-flex items-baseline gap-2 bg-brand-success/10 border border-brand-success/30 rounded-lg px-4 py-2">
          <span className="text-xs font-bold text-brand-success">الطول الكلي المعتمد Lt</span>
          <span className="text-xl font-mono font-bold text-brand-success">{f(p.Lt)}</span>
          <span className="text-xs text-brand-success">م</span>
        </div>
        {p.isLhExceedsLc && (
          <div className="text-[11px] font-bold text-brand-warning bg-brand-warning/10 border border-brand-warning/30 rounded-lg px-3 py-2">
            LH ≥ LC → استُخدمت قيمة LC في الحساب
          </div>
        )}
      </div>
    </div>
  );
}
