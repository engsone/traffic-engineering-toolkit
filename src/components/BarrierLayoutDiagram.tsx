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
  // Faithful to Fig 1.15.9 (Approach Barrier Layout). All dimensions referenced
  // to the EDGE of traveled way. Barrier sits IN FRONT of hazard (gap L2), then
  // flares BACK (away from road) to a crashworthy terminal.
  const yTop = 54;     // clear zone line
  const yAsph = 322;   // asphalt edge (solid)
  const yEdge = 352;   // edge of traveled way (THE reference)
  const yCenter = 400; // road centerline (dashed)
  const hzX = 170, hzW = 68, hzTop = 78, hzBot = 210; // hazard box
  const bX1 = 170, bX2 = 332, bY = 286;               // straight barrier section
  const termX = 658, termY = 238;                      // crashworthy terminal (flared back)
  const flareN = [0.18, 0.36, 0.54, 0.72];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 overflow-x-auto shadow-sm">
      <div className="text-sm font-bold text-brand-primary mb-1">{p.title || "مخطط الحاجز — شكل 1.15.9 (Approach Barrier Layout)"}</div>
      <div className="text-[11px] text-brand-muted mb-3">جميع الأبعاد من خط حافة المسار؛ تتحدّث تلقائياً من المدخلات والنتائج.</div>
      <svg viewBox="0 0 940 470" className="w-full" style={{ minWidth: 680 }}>
        {/* clear zone line */}
        <line x1={24} y1={yTop} x2={916} y2={yTop} stroke={C.ink} strokeWidth={1.5} />
        <text x={910} y={yTop - 8} fill={C.muted} fontSize={11} fontWeight={700} textAnchor="end">خط حرم الأمان (Clear zone line)</text>

        {/* asphalt edge (solid) */}
        <line x1={24} y1={yAsph} x2={916} y2={yAsph} stroke="#9aa0a6" strokeWidth={1.5} />
        <text x={910} y={yAsph - 6} fill="#9aa0a6" fontSize={11} fontWeight={700} textAnchor="end">حافة الأسفلت</text>

        {/* edge of traveled way (reference) */}
        <line x1={24} y1={yEdge} x2={916} y2={yEdge} stroke={C.ink} strokeWidth={2.25} />
        <text x={470} y={yEdge - 7} fill={C.ink} fontSize={12} fontWeight={700} textAnchor="middle">خط حافة المسار (Edge of traveled way) — المرجع</text>

        {/* road centerline (dashed) */}
        <line x1={24} y1={yCenter} x2={916} y2={yCenter} stroke={C.warning} strokeWidth={1.5} strokeDasharray="14 10" />
        <text x={24} y={yCenter - 6} fill="#9a7d1f" fontSize={11} fontWeight={700}>محور الطريق (السنتر)</text>

        {/* traffic direction (right) */}
        <line x1={812} y1={372} x2={752} y2={372} stroke={C.primary} strokeWidth={1.75} />
        <path d="M752,372 l9,-4 l0,8 Z" fill={C.primary} />
        <text x={820} y={376} fill={C.primary} fontSize={12} fontWeight={700}>اتجاه السير</text>

        {/* hazard */}
        <rect x={hzX} y={hzTop} width={hzW} height={hzBot - hzTop} fill={C.secondary} fillOpacity={0.22} stroke={C.danger} strokeWidth={1.5} />
        <line x1={hzX + hzW} y1={hzTop + 42} x2={hzX + hzW + 12} y2={hzTop + 42} stroke={C.danger} strokeWidth={1} />
        <text x={hzX + hzW + 16} y={hzTop + 46} fill={C.danger} fontSize={12} fontWeight={700}>العائق (Hazard)</text>

        {/* runout line L_R : diagonal from edge (downstream) to back-top of hazard */}
        <line x1={714} y1={yEdge} x2={hzX + hzW} y2={hzTop + 14} stroke={C.muted} strokeWidth={1.25} strokeDasharray="7 5" />

        {/* barrier: straight (in front of hazard) then flare back to terminal */}
        <line x1={bX1} y1={bY} x2={bX2} y2={bY} stroke={C.primary} strokeWidth={4} />
        <line x1={bX2} y1={bY} x2={termX} y2={termY} stroke={C.primary} strokeWidth={4} />
        {[194, 250, 306].map((x, i) => (
          <circle key={`s${i}`} cx={x} cy={bY} r={3} fill="#fff" stroke={C.primary} strokeWidth={2} />
        ))}
        {flareN.map((t, i) => (
          <circle key={`fl${i}`} cx={bX2 + (termX - bX2) * t} cy={bY + (termY - bY) * t} r={3} fill="#fff" stroke={C.primary} strokeWidth={2} />
        ))}
        {/* crashworthy terminal curl */}
        <path d={`M${termX},${termY} q14,-2 14,-14 q0,-10 -12,-8`} fill="none" stroke={C.success} strokeWidth={3} strokeLinecap="round" />
        <text x={termX + 12} y={termY - 22} fill={C.success} fontSize={12} fontWeight={700}>نهاية ماصّة للصدمات</text>

        {/* flare ratio a:b (filled triangle) */}
        <g transform="translate(392,242)">
          <path d="M0,0 L80,0 L80,16 Z" fill={C.primary} fillOpacity={0.15} stroke={C.ink} strokeWidth={1.25} />
          <text x={40} y={-5} fill={C.ink} fontSize={11} fontWeight={700} textAnchor="middle">b</text>
          <text x={86} y={11} fill={C.ink} fontSize={11} fontWeight={700}>a</text>
        </g>

        {/* dimensions */}
        <HDim x1={hzX + hzW} x2={714} y={80} label={`LR (طول الجريان) = ${f(p.lr)} م`} color={C.muted} />
        <HDim x1={bX1} x2={termX} y={104} label={`طول الحماية المطلوب L = ${f(p.L)} م`} color={C.success} />
        <HDim x1={hzX} x2={hzX + hzW} y={hzBot + 14} label={`L0 = ${f(p.l0)} م`} color={C.danger} />
        <HDim x1={hzX + hzW} x2={bX2} y={304} label={`L1 = ${f(p.l1)} م`} color={C.primary} />
        <VDim x={40} y1={yTop} y2={yEdge} label={`LC = ${f(p.lc ?? p.lh)} م`} color={C.secondary} />
        <VDim x={92} y1={hzTop} y2={yEdge} label={`LH = ${f(p.lh)} م`} color={C.ink} />
        <VDim x={134} y1={bY} y2={yEdge} label={`L2 = ${f(p.l2)} م`} color={C.secondary} />
        <VDim x={676} y1={termY} y2={yEdge} label={`Y = ${f(p.Y)} م`} color={C.muted} />
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
