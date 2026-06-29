/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import { BASE_CLEAR_ZONE_TABLE } from "../data/lookupTables";

const C = {
  primary: "#407189",
  success: "#3E7761",
  warning: "#C6A230",
  danger: "#A8483D",
  secondary: "#7B6756",
  muted: "#636569",
};

interface ChartProps {
  speed: number;
  slopeKey: string;
  clearZone: number; // resulting base clear zone for the selected speed/slope
}

const TABLE = BASE_CLEAR_ZONE_TABLE as unknown as Record<string, Record<string, number>>;

const SLOPES: { key: string; label: string }[] = [
  { key: "slope_3_1", label: "3:1" },
  { key: "slope_4_1", label: "4:1" },
  { key: "slope_5_1", label: "5:1" },
  { key: "slope_6_1", label: "6:1" },
  { key: "slope_8_1", label: "8:1" },
  { key: "slope_10_1", label: "10:1" },
];

const SPEEDS = [50, 60, 80, 100, 110, 120, 130, 140];

// plot geometry
const X0 = 70;     // x for 0 m
const X40 = 590;   // x for 40 m
const xScale = (v: number) => X0 + (Math.max(0, Math.min(40, v)) / 40) * (X40 - X0);
const slopeY = (i: number) => 48 + i * 26; // embankment rows

export default function ClearZoneChart(p: ChartProps) {
  const selIndex = SLOPES.findIndex((s) => s.key === p.slopeKey);
  const flatY = slopeY(SLOPES.length - 1) + 34; // FLAT band
  const cutY = flatY + 34;                       // Cut band

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 overflow-x-auto shadow-sm">
      <div className="text-sm font-bold text-brand-primary mb-1">شارت الخلوص الجانبي حسب السرعة والميل — شكل 1.15 C (AASHTO)</div>
      <div className="text-[11px] text-brand-muted mb-3">المنحنى المميّز يطابق السرعة المختارة؛ النقطة تشير إلى عرض الخلوص الناتج عند الميل المختار. البيانات من جدول الكود دون تغيير.</div>
      <svg viewBox="0 0 620 320" className="w-full" style={{ minWidth: 560 }}>
        {/* band labels */}
        <text x={604} y={slopeY(0) - 18} fill={C.secondary} fontSize={11} fontWeight={700} textAnchor="end">منطقة الجسر (Embankment)</text>
        <text x={604} y={flatY + 4} fill={C.muted} fontSize={11} fontWeight={700} textAnchor="end">مستوٍ (FLAT)</text>
        <text x={604} y={cutY + 4} fill={C.muted} fontSize={11} fontWeight={700} textAnchor="end">منطقة القطع (Cut)</text>

        {/* horizontal slope gridlines + right labels */}
        {SLOPES.map((s, i) => (
          <g key={s.key}>
            <line x1={X0} y1={slopeY(i)} x2={X40} y2={slopeY(i)} stroke={i === selIndex ? C.primary : "#e5e7eb"} strokeWidth={i === selIndex ? 1.25 : 1} strokeDasharray={i === selIndex ? "0" : "3 4"} />
            <text x={X40 + 8} y={slopeY(i) + 4} fill={i === selIndex ? C.primary : C.muted} fontSize={10} fontWeight={i === selIndex ? 700 : 500} textAnchor="start">{s.label}</text>
          </g>
        ))}
        {/* FLAT and Cut band guide lines */}
        <line x1={X0} y1={flatY} x2={X40} y2={flatY} stroke="#eef2f7" strokeWidth={1} />
        <line x1={X0} y1={cutY} x2={X40} y2={cutY} stroke="#eef2f7" strokeWidth={1} />

        {/* X axis */}
        <line x1={X0} y1={cutY + 22} x2={X40} y2={cutY + 22} stroke={C.muted} strokeWidth={1.25} />
        {[0, 10, 20, 30, 40].map((v) => (
          <g key={v}>
            <line x1={xScale(v)} y1={cutY + 22} x2={xScale(v)} y2={cutY + 27} stroke={C.muted} strokeWidth={1} />
            <text x={xScale(v)} y={cutY + 39} fill={C.muted} fontSize={10} textAnchor="middle">{v}</text>
          </g>
        ))}
        <text x={(X0 + X40) / 2} y={cutY + 54} fill={C.muted} fontSize={11} fontWeight={700} textAnchor="middle">عرض الخلوص الجانبي (م)</text>

        {/* speed curves (faint) */}
        {SPEEDS.map((sp) => {
          const isSel = sp === p.speed;
          const pts = SLOPES.map((s, i) => `${xScale(TABLE[s.key][String(sp)] || 0)},${slopeY(i)}`).join(" ");
          return (
            <polyline
              key={sp}
              points={pts}
              fill="none"
              stroke={isSel ? C.primary : "#c7ced6"}
              strokeWidth={isSel ? 3 : 1.25}
              strokeOpacity={isSel ? 1 : 0.7}
              strokeLinejoin="round"
            />
          );
        })}

        {/* selected speed nodes */}
        {SLOPES.map((s, i) => (
          <circle key={`n${i}`} cx={xScale(TABLE[s.key][String(p.speed)] || 0)} cy={slopeY(i)} r={2.6} fill={C.primary} />
        ))}

        {/* selected result marker */}
        {selIndex >= 0 && (
          <g>
            <line x1={xScale(p.clearZone)} y1={slopeY(selIndex)} x2={xScale(p.clearZone)} y2={cutY + 22} stroke={C.danger} strokeWidth={1.25} strokeDasharray="4 3" />
            <circle cx={xScale(p.clearZone)} cy={slopeY(selIndex)} r={5} fill={C.danger} stroke="#fff" strokeWidth={1.5} />
            <text x={xScale(p.clearZone)} y={slopeY(selIndex) - 9} fill={C.danger} fontSize={11} fontWeight={700} textAnchor="middle" style={{ paintOrder: "stroke", stroke: "#fff", strokeWidth: 3 }}>{p.clearZone.toFixed(1)} م</text>
          </g>
        )}

        {/* selected speed legend chip */}
        <g>
          <line x1={X0} y1={24} x2={X0 + 22} y2={24} stroke={C.primary} strokeWidth={3} />
          <text x={X0 + 28} y={28} fill={C.primary} fontSize={11} fontWeight={700}>السرعة المختارة: {p.speed} كم/س</text>
        </g>
      </svg>
    </div>
  );
}
