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
  title?: string;
}

const C = {
  ink: "#1e293b",
  primary: "#407189",
  success: "#3E7761",
  warning: "#C6A230",
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

export default function BarrierLayoutDiagram(p: DiagramProps) {
  // layout (faithful to Fig 1.15.9: hazard left, barrier flares right to crashworthy terminal,
  // runout line L_R as a long diagonal from terminal area up to back of hazard)
  const yTop = 46;     // adjacent clear zone line
  const yEdge = 392;   // edge of traveled way
  const yAdj = 446;    // adjacent traffic centerline (dashed)
  const hzX = 158, hzW = 56, hzTop = 150, hzBot = 326; // hazard box
  const bTanX1 = hzX + hzW, bTanX2 = bTanX1 + 80;      // tangent (L1) segment
  const termX = 770, termY = 372;                       // crashworthy terminal end
  const bTanY = 320;                                    // barrier near hazard

  const posts: number[] = [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 0.84, 0.96];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 overflow-x-auto shadow-sm">
      <div className="text-sm font-bold text-brand-primary mb-1">{p.title || "مخطط الحاجز — شكل 1.15.9 (Approach Barrier Layout)"}</div>
      <div className="text-[11px] text-brand-muted mb-3">مطابق لشكل آشتو؛ الأبعاد تتحدّث تلقائياً من المدخلات والنتائج.</div>
      <svg viewBox="0 0 940 470" className="w-full" style={{ minWidth: 680 }}>
        {/* top adjacent clear zone line */}
        <line x1={24} y1={yTop} x2={916} y2={yTop} stroke={C.ink} strokeWidth={1.5} />
        <text x={910} y={yTop - 7} fill={C.muted} fontSize={11} fontWeight={700} textAnchor="end">خط حرم الأمان للاتجاه المجاور</text>

        {/* edge of traveled way (solid) + adjacent traffic (dashed) */}
        <line x1={24} y1={yEdge} x2={916} y2={yEdge} stroke={C.ink} strokeWidth={2} />
        <text x={470} y={yEdge + 16} fill={C.muted} fontSize={11} fontWeight={700} textAnchor="middle">حافة المسار (Edge of traveled way)</text>
        <line x1={24} y1={yAdj} x2={916} y2={yAdj} stroke={C.muted} strokeWidth={1} strokeDasharray="9 6" />
        <line x1={150} y1={yAdj + 16} x2={92} y2={yAdj + 16} stroke={C.muted} strokeWidth={1.5} />
        <path d={`M92,${yAdj + 16} l9,-4 l0,8 Z`} fill={C.muted} />
        <text x={158} y={yAdj + 20} fill={C.muted} fontSize={10} fontWeight={700}>الاتجاه المجاور (Adjacent traffic)</text>

        {/* hazard */}
        <rect x={hzX} y={hzTop} width={hzW} height={hzBot - hzTop} fill={C.secondary} fillOpacity={0.22} stroke={C.danger} strokeWidth={1.5} />
        <line x1={hzX + hzW / 2} y1={hzTop} x2={hzX + hzW / 2 + 26} y2={hzTop - 22} stroke={C.danger} strokeWidth={1} />
        <text x={hzX + hzW / 2 + 30} y={hzTop - 24} fill={C.danger} fontSize={12} fontWeight={700}>العائق (Hazard)</text>

        {/* runout line L_R : long diagonal from terminal/shy area up to back-top of hazard */}
        <line x1={840} y1={yAdj} x2={hzX} y2={hzTop + 18} stroke={C.muted} strokeWidth={1.25} strokeDasharray="7 5" />

        {/* barrier: tangent then flared posts toward terminal */}
        <line x1={bTanX1} y1={bTanY} x2={bTanX2} y2={bTanY} stroke={C.primary} strokeWidth={3.5} />
        <line x1={bTanX2} y1={bTanY} x2={termX} y2={termY} stroke={C.primary} strokeWidth={3.5} />
        {posts.map((t, i) => {
          const x = bTanX2 + (termX - bTanX2) * t;
          const y = bTanY + (termY - bTanY) * t;
          return <circle key={i} cx={x} cy={y} r={3} fill="#fff" stroke={C.primary} strokeWidth={2} />;
        })}
        {/* crashworthy terminal curl */}
        <path d={`M${termX},${termY} q16,2 16,14 q0,10 -12,8`} fill="none" stroke={C.success} strokeWidth={3} strokeLinecap="round" />
        <line x1={termX + 6} y1={termY - 30} x2={termX + 18} y2={termY + 6} stroke={C.success} strokeWidth={1} />
        <text x={termX + 22} y={termY - 30} fill={C.success} fontSize={11} fontWeight={700}>نهاية ماصّة للصدمات</text>

        {/* flare ratio a:b triangle */}
        <g transform="translate(430,338)">
          <path d="M0,0 L52,0 L52,-15 Z" fill="none" stroke={C.ink} strokeWidth={1.25} />
          <text x={26} y={12} fill={C.ink} fontSize={11} fontWeight={700} textAnchor="middle">a</text>
          <text x={58} y={-6} fill={C.ink} fontSize={11} fontWeight={700}>b</text>
        </g>

        {/* dimensions */}
        <VDim x={64} y1={yTop} y2={yAdj} label={`LC = ${f(p.lc ?? p.lh)} م`} color={C.secondary} />
        <HDim x1={hzX} x2={840} y={92} label={`LR (طول الجريان) = ${f(p.lr)} م`} color={C.muted} />
        <HDim x1={bTanX1} x2={termX} y={128} label={`طول الحماية المطلوب L = ${f(p.L)} م`} color={C.success} />
        <HDim x1={bTanX1} x2={bTanX2} y={302} label={`L1 = ${f(p.l1)} م`} color={C.primary} />
        <HDim x1={hzX} x2={hzX + hzW} y={hzBot + 16} label={`L0 = ${f(p.l0)} م`} color={C.danger} />
        <VDim x={130} y1={hzTop} y2={yEdge} label={`LH = ${f(p.lh)} م`} color={C.ink} />
        <VDim x={termX + 44} y1={termY} y2={yEdge} label={`Y = ${f(p.Y)} م`} color={C.muted} />
        <VDim x={hzX + hzW + 14} y1={bTanY} y2={yEdge} label={`L2 = ${f(p.l2)} م`} color={C.secondary} />
      </svg>

      {/* formula + live total + special note */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="text-[11px] font-mono text-brand-muted bg-slate-50 border border-slate-100 rounded px-2 py-1">L = (LR − L1 − L0) / (1 − a/b)</div>
        <div className="inline-flex items-baseline gap-2 bg-brand-success/10 border border-brand-success/30 rounded-lg px-4 py-2">
          <span className="text-xs font-bold text-brand-success">الطول الكلي المعتمد Lt</span>
          <span className="text-xl font-mono font-bold text-brand-success">{f(p.Lt)}</span>
          <span className="text-xs text-brand-success">م</span>
        </div>
        {p.isLhExceedsLc && (
          <div className="text-[11px] font-bold text-brand-warning bg-brand-warning/10 border border-brand-warning/30 rounded-lg px-3 py-2">LH ≥ LC → استُخدمت قيمة LC في الحساب</div>
        )}
      </div>
    </div>
  );
}
