/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import figUrl from "./clearZone_1151.png";

interface ChartProps {
  speed: number;
  slopeKey: string;
  clearZone: number;
}

// AASHTO Figure 1.15.1 (Clear Zone) — the original standard figure, recoloured to
// the platform brand. The red marker is positioned from a pixel-calibrated
// digitisation of the figure (verified against the figure's own worked example:
// 90 km/h, slope 6:1 -> 8 m). VISUAL ONLY — no calculation logic is touched.
const SPEEDS = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140];
const TABLE: Record<string, number[]> = {
  "3:1": [3.5, 4.5, 6.5, 10.0, 14.5, 18.5, 24.0, 30.0, 34.0, 37.5],
  "4:1": [4.1, 5.1, 6.6, 8.7, 11.1, 13.6, 16.4, 19.5, 22.3, 25.1],
  "5:1": [3.9, 4.8, 6.0, 7.4, 9.2, 11.3, 13.8, 16.1, 18.6, 21.2],
  "6:1": [3.7, 4.5, 5.5, 6.7, 8.0, 9.9, 12.0, 14.0, 16.2, 18.9],
  "8:1": [3.6, 4.4, 5.4, 6.3, 7.7, 9.4, 11.4, 13.2, 15.3, 17.8],
  "10:1": [3.4, 4.2, 5.2, 6.1, 7.6, 9.1, 11.0, 12.9, 14.8, 17.0],
};
const SLOPE_TOP: Record<string, number> = { "3:1": 0.065, "4:1": 0.1467, "5:1": 0.187, "6:1": 0.2186, "8:1": 0.2415, "10:1": 0.2681 };
const KEY2LABEL: Record<string, string> = { slope_3_1: "3:1", slope_4_1: "4:1", slope_5_1: "5:1", slope_6_1: "6:1", slope_8_1: "8:1", slope_10_1: "10:1" };
const X_AT_0 = 0.1616;
const X_PER_M = (0.9388 - 0.1616) / 40;
const AXIS_Y = 0.661;

function readCZ(label: string, speed: number): number {
  const arr = TABLE[label];
  if (!arr) return 0;
  if (speed <= SPEEDS[0]) return arr[0];
  if (speed >= SPEEDS[SPEEDS.length - 1]) return arr[arr.length - 1];
  for (let i = 0; i < SPEEDS.length - 1; i++) {
    if (speed >= SPEEDS[i] && speed <= SPEEDS[i + 1]) {
      const t = (speed - SPEEDS[i]) / (SPEEDS[i + 1] - SPEEDS[i]);
      return arr[i] + (arr[i + 1] - arr[i]) * t;
    }
  }
  return arr[arr.length - 1];
}

export default function ClearZoneChart(p: ChartProps) {
  const label = KEY2LABEL[p.slopeKey];
  const has = !!label;
  const cz = has ? readCZ(label, p.speed) : 0;
  const xf = has ? (X_AT_0 + cz * X_PER_M) * 100 : 0;
  const yf = has ? SLOPE_TOP[label] * 100 : 0;
  const axisf = AXIS_Y * 100;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="text-sm font-bold text-brand-primary mb-1">شارت الخلوص الجانبي — شكل 1.15.1 (AASHTO Clear Zone)</div>
      <div className="text-[11px] text-brand-muted mb-3">الشكل القياسي المعتمد بألوان المنصة. النقطة الحمراء = حالتك (السرعة والميل) مقروءةً على المنحنى القياسي.</div>
      <div style={{ position: "relative", width: "100%", maxWidth: 820, margin: "0 auto" }}>
        <img src={figUrl} alt="AASHTO Clear Zone — Figure 1.15.1" style={{ width: "100%", display: "block" }} />
        {has && (
          <>
            <div style={{ position: "absolute", left: `${xf}%`, top: `${yf}%`, height: `${Math.max(0, axisf - yf)}%`, borderLeft: "2px dashed #A8483D", transform: "translateX(-1px)" }} />
            <div style={{ position: "absolute", left: `${xf}%`, top: `${yf}%`, width: 13, height: 13, background: "#A8483D", border: "2px solid #fff", borderRadius: "50%", transform: "translate(-50%,-50%)", boxShadow: "0 0 0 1px #A8483D" }} />
            <div style={{ position: "absolute", left: `${xf}%`, top: `${yf}%`, transform: "translate(10px,-160%)", background: "#fff", color: "#A8483D", fontSize: 11, fontWeight: 700, padding: "1px 5px", borderRadius: 4, border: "1px solid #A8483D", whiteSpace: "nowrap" }}>{cz.toFixed(1)} م</div>
          </>
        )}
      </div>
      <div className="text-[10px] text-brand-muted mt-2">قراءة استرشادية من المنحنى القياسي (قبل معامل ADT). رقم حاسبة المنصة يظهر في صندوق النتيجة.</div>
    </div>
  );
}
