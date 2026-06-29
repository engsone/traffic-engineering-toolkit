/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";

interface Props {
  lh: number;
  lr: number;
  l1: number;
  l2: number;
  l0: number;
  L: number;
  Y: number;
  Lt: number;
  lc?: number;
  title?: string;
}

const C = {
  ink: "#1e293b",
  primary: "#407189",   // barrier (same brand teal as 1.15.9)
  accent: "#C6A230",    // gold: distinguishes the centre-referenced diagram
  success: "#3E7761",
  danger: "#A8483D",
  secondary: "#7B6756",
  muted: "#636569",
};

const f = (n: number): string => (isFinite(n) ? n.toFixed(1) : "0.0");

function HDim({ x1, x2, y, label, color }: { x1: number; x2: number; y: number; label: string; color: string }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={1} />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} stroke={color} strokeWidth={1} />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} stroke={color} strokeWidth={1} />
      <text x={(x1 + x2) / 2} y={y - 6} fill={color} fontSize={12} fontWeight={700} textAnchor="middle" style={{ paintOrder: "stroke", stroke: "#fff", strokeWidth: 3 }}>{label}</text>
    </g>
  );
}

function VDim({ x, y1, y2, label, color }: { x: number; y1: number; y2: number; label: string; color: string }) {
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth={1} />
      <line x1={x - 4} y1={y1} x2={x + 4} y2={y1} stroke={color} strokeWidth={1} />
      <line x1={x - 4} y1={y2} x2={x + 4} y2={y2} stroke={color} strokeWidth={1} />
      <text x={x} y={(y1 + y2) / 2} fill={color} fontSize={12} fontWeight={700} textAnchor="middle" transform={`rotate(-90 ${x} ${(y1 + y2) / 2})`} style={{ paintOrder: "stroke", stroke: "#fff", strokeWidth: 3 }}>{label}</text>
    </g>
  );
}

export default function OpposingBarrierDiagram(p: Props) {
  // Fig 1.15.11 (Additional Barrier for Opposing Traffic). MIRROR of 1.15.9:
  // hazard RIGHT, terminal LEFT. All dimensions referenced to the road CENTRE
  // line; the runout L_R starts at the centre line.
  const yTop = 62;     // clear zone line
  const yAsph = 330;   // asphalt edge (solid)
  const yEdge = 358;   // edge of traveled way
  const yCenter = 408; // road centerline (THE reference)
  const hzX = 672, hzW = 68, hzTop = 86, hzBot = 218; // hazard box (right)
  const bX2 = 740, bX1 = 608, bY = 294;                // straight barrier (front of hazard)
  const termX = 282, termY = 246;                       // crashworthy terminal (left, flared back)
  const flareN = [0.18, 0.36, 0.54, 0.72];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 overflow-x-auto shadow-sm">
      <div className="text-sm font-bold" style={{ color: C.accent }}>{p.title || "حاجز إضافي للاتجاه المعاكس — شكل 1.15.11 (Opposing Traffic)"}</div>
      <div className="text-[11px] text-brand-muted mb-3">القياس من سنتر الطريق (يُضاف عرض الحارة المعاكسة)؛ يتحدّث تلقائياً من نتائج الاتجاه المعاكس.</div>
      <svg viewBox="0 0 940 492" className="w-full" style={{ minWidth: 680 }}>
        {/* clear zone line */}
        <line x1={24} y1={yTop} x2={916} y2={yTop} stroke={C.ink} strokeWidth={1.5} />
        <text x={210} y={yTop - 8} fill={C.muted} fontSize={11} fontWeight={700} textAnchor="middle">خط حرم الأمان (Clear zone line)</text>

        {/* asphalt edge (solid) */}
        <line x1={24} y1={yAsph} x2={916} y2={yAsph} stroke="#9aa0a6" strokeWidth={1.5} />
        <text x={92} y={yAsph - 6} fill="#9aa0a6" fontSize={11} fontWeight={700} textAnchor="middle">حافة الأسفلت</text>

        {/* edge of traveled way */}
        <line x1={24} y1={yEdge} x2={916} y2={yEdge} stroke={C.ink} strokeWidth={1.5} />
        <text x={470} y={yEdge - 6} fill={C.muted} fontSize={11} fontWeight={700} textAnchor="middle">خط حافة المسار</text>

        {/* near lane direction (ABOVE centre) */}
        <line x1={180} y1={384} x2={120} y2={384} stroke={C.primary} strokeWidth={1.75} />
        <path d="M120,384 l9,-4 l0,8 Z" fill={C.primary} />
        <text x={232} y={388} fill={C.primary} fontSize={12} fontWeight={700} textAnchor="middle">اتجاه السير</text>
        <text x={470} y={390} fill={C.accent} fontSize={11} fontWeight={700} textAnchor="middle">⟵ حارة معاكسة 3.65 م ⟶</text>

        {/* CENTRE line = reference */}
        <line x1={24} y1={yCenter} x2={916} y2={yCenter} stroke={C.accent} strokeWidth={2.75} strokeDasharray="18 8" />
        <text x={740} y={yCenter - 5} fill={C.accent} fontSize={12} fontWeight={800} textAnchor="middle">محور الطريق (السنتر) — المرجع</text>

        {/* opposing direction (BELOW centre) */}
        <line x1={120} y1={432} x2={180} y2={432} stroke={C.accent} strokeWidth={1.75} />
        <path d="M180,432 l-9,-4 l0,8 Z" fill={C.accent} />
        <text x={270} y={436} fill={C.accent} fontSize={12} fontWeight={700} textAnchor="middle">اتجاه السير المعاكس</text>

        {/* hazard (right) */}
        <rect x={hzX} y={hzTop} width={hzW} height={hzBot - hzTop} fill={C.secondary} fillOpacity={0.22} stroke={C.danger} strokeWidth={1.5} />
        <line x1={hzX} y1={hzTop + 42} x2={hzX - 12} y2={hzTop + 42} stroke={C.danger} strokeWidth={1} />
        <text x={hzX - 16} y={hzTop + 46} fill={C.danger} fontSize={12} fontWeight={700} textAnchor="end">العائق (Hazard)</text>

        {/* runout L_R: starts at the CENTRE line, up to back-top of hazard */}
        <line x1={226} y1={yCenter} x2={hzX} y2={hzTop + 10} stroke={C.muted} strokeWidth={1.25} strokeDasharray="7 5" />

        {/* barrier: straight (front of hazard) then flare back to terminal (left) */}
        <line x1={bX1} y1={bY} x2={bX2} y2={bY} stroke={C.primary} strokeWidth={4} />
        <line x1={bX1} y1={bY} x2={termX} y2={termY} stroke={C.primary} strokeWidth={4} />
        {[636, 692, 726].map((x, i) => (
          <circle key={`s${i}`} cx={x} cy={bY} r={3} fill="#fff" stroke={C.primary} strokeWidth={2} />
        ))}
        {flareN.map((t, i) => (
          <circle key={`fl${i}`} cx={bX1 + (termX - bX1) * t} cy={bY + (termY - bY) * t} r={3} fill="#fff" stroke={C.primary} strokeWidth={2} />
        ))}
        {/* crashworthy terminal curl (left) */}
        <path d={`M${termX},${termY} q-14,-2 -14,-14 q0,-10 12,-8`} fill="none" stroke={C.success} strokeWidth={3} strokeLinecap="round" />
        <text x={termX - 12} y={termY - 22} fill={C.success} fontSize={12} fontWeight={700} textAnchor="end">نهاية ماصّة للصدمات</text>

        {/* flare ratio a:b (filled triangle) */}
        <g transform="translate(392,242)">
          <path d="M0,0 L80,0 L80,16 Z" fill={C.primary} fillOpacity={0.15} stroke={C.ink} strokeWidth={1.25} />
          <text x={40} y={-5} fill={C.ink} fontSize={11} fontWeight={700} textAnchor="middle">b</text>
          <text x={86} y={11} fill={C.ink} fontSize={11} fontWeight={700}>a</text>
        </g>

        {/* dimensions (from CENTRE) */}
        <HDim x1={226} x2={hzX} y={88} label={`LR = ${f(p.lr)} م`} color={C.muted} />
        <HDim x1={termX} x2={bX2} y={130} label={`طول الحماية الإضافي L = ${f(p.L)} م`} color={C.success} />
        <HDim x1={hzX} x2={hzX + hzW} y={hzBot + 14} label={`L0 = ${f(p.l0)} م`} color={C.danger} />
        <HDim x1={bX1} x2={hzX} y={312} label={`L1 = ${f(p.l1)} م`} color={C.primary} />
        <VDim x={900} y1={yTop} y2={yCenter} label={`LC = ${f(p.lc ?? p.lh)} م`} color={C.secondary} />
        <VDim x={852} y1={hzTop} y2={yCenter} label={`LH = ${f(p.lh)} م`} color={C.ink} />
        <VDim x={582} y1={bY} y2={yCenter} label={`L2 = ${f(p.l2)} م`} color={C.accent} />
        <VDim x={262} y1={termY} y2={yCenter} label={`Y = ${f(p.Y)} م`} color={C.muted} />
      </svg>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="text-[11px] font-mono text-brand-muted bg-slate-50 border border-slate-100 rounded px-2 py-1">L = [LH + (b/a)·L1 − L2] / [(b/a) + (LH/LR)]</div>
        <div className="inline-flex items-baseline gap-2 rounded-lg px-4 py-2" style={{ background: "#FBF6E6", border: `1px solid ${C.accent}66` }}>
          <span className="text-xs font-bold" style={{ color: C.accent }}>الطول الكلي (سنتر) Lt②</span>
          <span className="text-xl font-mono font-bold" style={{ color: C.accent }}>{f(p.Lt)}</span>
          <span className="text-xs" style={{ color: C.accent }}>م</span>
        </div>
      </div>
    </div>
  );
}
