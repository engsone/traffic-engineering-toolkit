/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import { BASE_CLEAR_ZONE_TABLE } from "../data/lookupTables";

const C = {
  ink: "#1e293b",
  primary: "#407189",
  danger: "#A8483D",
  muted: "#636569",
};

interface ChartProps {
  speed: number;
  slopeKey: string;
  clearZone: number;
}

const TABLE = BASE_CLEAR_ZONE_TABLE as unknown as Record<string, Record<string, number>>;

// Embankment slopes top->bottom (steep -> flat), matching Fig 1.15.1
const EMB: { key: string; label: string }[] = [
  { key: "slope_3_1", label: "3:1" },
  { key: "slope_4_1", label: "4:1" },
  { key: "slope_5_1", label: "5:1" },
  { key: "slope_6_1", label: "6:1" },
  { key: "slope_8_1", label: "8:1" },
  { key: "slope_10_1", label: "10:1" },
];
const CUT_LABELS = ["10:1", "8:1", "6:1", "5:1", "4:1", "3:1"];
const SPEEDS = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140];

const X0 = 112, X40 = 718;
const xS = (v: number) => X0 + (Math.max(0, Math.min(40, v)) / 40) * (X40 - X0);
const embY = (i: number) => 72 + i * 33;      // 72..237
const FLAT_Y = 268;
const cutY = (i: number) => 300 + i * 33;      // 300..465
const AXIS_Y = 500;

export default function ClearZoneChart(p: ChartProps) {
  const selIdx = EMB.findIndex((s) => s.key === p.slopeKey);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 overflow-x-auto shadow-sm">
      <div className="text-sm font-bold text-brand-primary mb-1">شارت الخلوص الجانبي — شكل 1.15.1 (AASHTO Clear Zone)</div>
      <div className="text-[11px] text-brand-muted mb-3">منحنى لكل سرعة من جدول الكود (جانب التعبئة Embankment). المنحنى المميّز يطابق السرعة المختارة، والنقطة الحمراء عند الميل والخلوص الناتج.</div>
      <svg viewBox="0 0 760 560" className="w-full" style={{ minWidth: 640 }}>
        {/* vertical band labels */}
        <text x={26} y={(embY(0) + embY(5)) / 2} fill={C.muted} fontSize={12} fontWeight={700} textAnchor="middle" transform={`rotate(-90 26 ${(embY(0) + embY(5)) / 2})`}>ميل التعبئة (Embankment)</text>
        <text x={26} y={(cutY(0) + cutY(5)) / 2} fill={C.muted} fontSize={12} fontWeight={700} textAnchor="middle" transform={`rotate(-90 26 ${(cutY(0) + cutY(5)) / 2})`}>ميل القطع (Cut)</text>

        {/* plot frame */}
        <line x1={X0} y1={56} x2={X0} y2={AXIS_Y} stroke={C.ink} strokeWidth={1.25} />
        <line x1={X0} y1={AXIS_Y} x2={X40} y2={AXIS_Y} stroke={C.ink} strokeWidth={1.25} />

        {/* x gridlines + labels */}
        {[0, 5, 10, 15, 20, 25, 30, 35, 40].map((v) => (
          <g key={v}>
            <line x1={xS(v)} y1={56} x2={xS(v)} y2={AXIS_Y} stroke="#eef2f7" strokeWidth={1} />
            <line x1={xS(v)} y1={AXIS_Y} x2={xS(v)} y2={AXIS_Y + 5} stroke={C.ink} strokeWidth={1} />
            <text x={xS(v)} y={AXIS_Y + 18} fill={C.muted} fontSize={10} textAnchor="middle">{v}</text>
          </g>
        ))}
        <text x={(X0 + X40) / 2} y={AXIS_Y + 36} fill={C.ink} fontSize={12} fontWeight={700} textAnchor="middle">عرض الخلوص الجانبي (م)</text>

        {/* embankment slope rows + labels */}
        {EMB.map((s, i) => (
          <g key={s.key}>
            <line x1={X0} y1={embY(i)} x2={X40} y2={embY(i)} stroke={i === selIdx ? "#dbe5ea" : "#f4f6f9"} strokeWidth={1} />
            <text x={X0 - 8} y={embY(i) + 4} fill={i === selIdx ? C.primary : C.muted} fontSize={10} fontWeight={i === selIdx ? 700 : 500} textAnchor="end">{s.label}</text>
          </g>
        ))}
        {/* FLAT divider */}
        <line x1={X0} y1={FLAT_Y} x2={X40} y2={FLAT_Y} stroke={C.ink} strokeWidth={1.25} />
        <text x={X0 - 8} y={FLAT_Y + 4} fill={C.ink} fontSize={11} fontWeight={700} textAnchor="end">FLAT</text>
        {/* cut slope rows */}
        {CUT_LABELS.map((lab, i) => (
          <g key={lab}>
            <line x1={X0} y1={cutY(i)} x2={X40} y2={cutY(i)} stroke="#f4f6f9" strokeWidth={1} />
            <text x={X0 - 8} y={cutY(i) + 4} fill={C.muted} fontSize={10} textAnchor="end">{lab}</text>
          </g>
        ))}
        <text x={(X0 + X40) / 2} y={cutY(2)} fill="#b6bcc4" fontSize={11} textAnchor="middle">منطقة القطع: غير مشمولة في جدول الكود الحالي</text>

        {/* speed curves (embankment) */}
        {SPEEDS.map((sp) => {
          const isSel = sp === p.speed;
          const pts = EMB.map((s, i) => `${xS(TABLE[s.key][String(sp)] || 0)},${embY(i)}`).join(" ");
          const topX = xS(TABLE[EMB[0].key][String(sp)] || 0);
          return (
            <g key={sp}>
              <polyline points={pts} fill="none" stroke={isSel ? C.primary : "#cdd4dc"} strokeWidth={isSel ? 3 : 1.25} strokeOpacity={isSel ? 1 : 0.85} strokeLinejoin="round" />
              <text x={topX} y={embY(0) - 6} fill={isSel ? C.primary : "#aeb6bf"} fontSize={9} fontWeight={isSel ? 700 : 500} textAnchor="middle">{sp}</text>
            </g>
          );
        })}

        {/* selected nodes */}
        {EMB.map((s, i) => (
          <circle key={`n${i}`} cx={xS(TABLE[s.key][String(p.speed)] || 0)} cy={embY(i)} r={2.6} fill={C.primary} />
        ))}

        {/* result marker */}
        {selIdx >= 0 && (
          <g>
            <line x1={xS(p.clearZone)} y1={embY(selIdx)} x2={xS(p.clearZone)} y2={AXIS_Y} stroke={C.danger} strokeWidth={1.25} strokeDasharray="5 3" />
            <circle cx={xS(p.clearZone)} cy={embY(selIdx)} r={5.5} fill={C.danger} stroke="#fff" strokeWidth={1.5} />
            <text x={xS(p.clearZone)} y={embY(selIdx) - 9} fill={C.danger} fontSize={12} fontWeight={700} textAnchor="middle" style={{ paintOrder: "stroke", stroke: "#fff", strokeWidth: 3 }}>{p.clearZone.toFixed(1)} م</text>
          </g>
        )}

        {/* legend */}
        <line x1={X0} y1={42} x2={X0 + 22} y2={42} stroke={C.primary} strokeWidth={3} />
        <text x={X0 + 28} y={46} fill={C.primary} fontSize={11} fontWeight={700}>السرعة المختارة: {p.speed} كم/س — وحدة الأرقام أعلى المنحنيات كم/س</text>
      </svg>
    </div>
  );
}
