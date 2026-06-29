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
  primary: "#0e7490",
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
  // Mirror of 1.15.9: hazard RIGHT, terminal LEFT, for opposing traffic.
  const yTop = 46;
  const yEdge = 392;
  const yAdj = 446;
  const hzX = 726, hzW = 56, hzTop = 150, hzBot = 326;
  const bTanX2 = hzX;                 // tangent end at hazard
  const bTanX1 = hzX - 80;            // tangent start (L1)
  const termX = 170, termY = 372;     // crashworthy terminal (left)
  const bTanY = 320;
  const posts: number[] = [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 0.84, 0.96];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 overflow-x-auto shadow-sm">
      <div className="text-sm font-bold" style={{ color: C.primary }}>{p.title || "حاجز إضافي للاتجاه المعاكس — شكل 1.15.11 (Opposing Traffic)"}</div>
      <div className="text-[11px] text-brand-muted mb-3">القياس من سنتر الطريق؛ الأبعاد تتحدّث تلقائياً من نتائج الاتجاه المعاكس.</div>
      <svg viewBox="0 0 940 480" className="w-full" style={{ minWidth: 680 }}>
        {/* top clear zone line for opposing traffic */}
        <line x1={24} y1={yTop} x2={916} y2={yTop} stroke={C.ink} strokeWidth={1.5} />
        <text x={30} y={yTop - 7} fill={C.muted} fontSize={11} fontWeight={700}>خط حرم الأمان للاتجاه المعاكس</text>

        {/* EOP + traffic lines */}
        <line x1={24} y1={yEdge} x2={916} y2={yEdge} stroke={C.ink} strokeWidth={2} />
        <text x={470} y={yEdge + 16} fill={C.muted} fontSize={11} fontWeight={700} textAnchor="middle">حافة الرصف (EOP)</text>
        <line x1={24} y1={yAdj} x2={916} y2={yAdj} stroke={C.muted} strokeWidth={1} strokeDasharray="9 6" />
        {/* adjacent traffic (left) */}
        <line x1={150} y1={yAdj + 14} x2={92} y2={yAdj + 14} stroke={C.muted} strokeWidth={1.5} />
        <path d={`M92,${yAdj + 14} l9,-4 l0,8 Z`} fill={C.muted} />
        <text x={158} y={yAdj + 18} fill={C.muted} fontSize={10} fontWeight={700}>الاتجاه المجاور</text>
        {/* opposing traffic (right) */}
        <line x1={760} y1={yAdj + 30} x2={818} y2={yAdj + 30} stroke={C.primary} strokeWidth={1.5} />
        <path d={`M818,${yAdj + 30} l-9,-4 l0,8 Z`} fill={C.primary} />
        <text x={640} y={yAdj + 34} fill={C.primary} fontSize={10} fontWeight={700}>الاتجاه المعاكس (Opposing traffic)</text>

        {/* hazard right */}
        <rect x={hzX} y={hzTop} width={hzW} height={hzBot - hzTop} fill={C.secondary} fillOpacity={0.22} stroke={C.danger} strokeWidth={1.5} />
        <line x1={hzX + hzW / 2} y1={hzTop} x2={hzX + hzW / 2 - 26} y2={hzTop - 22} stroke={C.danger} strokeWidth={1} />
        <text x={hzX + hzW / 2 - 30} y={hzTop - 24} fill={C.danger} fontSize={12} fontWeight={700} textAnchor="end">العائق (Hazard)</text>

        {/* runout L_R diagonal from bottom-left up to hazard back-top */}
        <line x1={100} y1={yAdj} x2={hzX + hzW} y2={hzTop + 18} stroke={C.muted} strokeWidth={1.25} strokeDasharray="7 5" />

        {/* barrier tangent + flared posts from terminal (left) to hazard */}
        <line x1={bTanX2} y1={bTanY} x2={bTanX1} y2={bTanY} stroke={C.primary} strokeWidth={3.5} />
        <line x1={bTanX1} y1={bTanY} x2={termX} y2={termY} stroke={C.primary} strokeWidth={3.5} />
        {posts.map((t, i) => {
          const x = bTanX1 + (termX - bTanX1) * t;
          const y = bTanY + (termY - bTanY) * t;
          return <circle key={i} cx={x} cy={y} r={3} fill="#fff" stroke={C.primary} strokeWidth={2} />;
        })}
        {/* terminal curl (left) */}
        <path d={`M${termX},${termY} q-16,2 -16,14 q0,10 12,8`} fill="none" stroke={C.success} strokeWidth={3} strokeLinecap="round" />
        <text x={termX - 22} y={termY - 30} fill={C.success} fontSize={11} fontWeight={700} textAnchor="end">نهاية ماصّة للصدمات</text>

        {/* flare a:b */}
        <g transform="translate(458,338)">
          <path d="M0,0 L-52,0 L-52,-15 Z" fill="none" stroke={C.ink} strokeWidth={1.25} />
          <text x={-26} y={12} fill={C.ink} fontSize={11} fontWeight={700} textAnchor="middle">a</text>
          <text x={-58} y={-6} fill={C.ink} fontSize={11} fontWeight={700} textAnchor="end">b</text>
        </g>

        {/* dims */}
        <VDim x={64} y1={yTop} y2={yAdj} label={`LC = ${f(p.lc ?? p.lh)} م`} color={C.secondary} />
        <HDim x1={100} x2={hzX + hzW} y={92} label={`LR = ${f(p.lr)} م`} color={C.muted} />
        <HDim x1={termX} x2={bTanX2} y={128} label={`طول الحماية الإضافي L = ${f(p.L)} م`} color={C.success} />
        <HDim x1={bTanX1} x2={bTanX2} y={302} label={`L1 = ${f(p.l1)} م`} color={C.primary} />
        <HDim x1={hzX} x2={hzX + hzW} y={hzBot + 16} label={`L0 = ${f(p.l0)} م`} color={C.danger} />
        <VDim x={hzX + hzW + 26} y1={hzTop} y2={yEdge} label={`LH = ${f(p.lh)} م`} color={C.ink} />
        <VDim x={termX - 44} y1={termY} y2={yEdge} label={`Y = ${f(p.Y)} م`} color={C.muted} />
        <VDim x={hzX - 14} y1={bTanY} y2={yEdge} label={`L2 = ${f(p.l2)} م`} color={C.secondary} />
      </svg>

      <div className="mt-3 inline-flex items-baseline gap-2 bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-2">
        <span className="text-xs font-bold" style={{ color: C.primary }}>الطول الكلي (سنتر) Lt②</span>
        <span className="text-xl font-mono font-bold" style={{ color: C.primary }}>{f(p.Lt)}</span>
        <span className="text-xs" style={{ color: C.primary }}>م</span>
      </div>
    </div>
  );
}
