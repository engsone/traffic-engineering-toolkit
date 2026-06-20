/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { STANDARD_DRAWINGS_DATA, fileUrl } from "../data/lookupTables";
import { StandardDrawing } from "../types";
import { Search, Heart, Image as ImageIcon, Download, Check, FileCode } from "lucide-react";

// Helper to render customized SVG blueprints for Standard Drawings
function renderBlueprintGraphics(draw: StandardDrawing) {
  const category = draw.category;

  if (draw.id === "std_draw_17") {
    return (
      <>
        {/* Road layout flaring into a circular bulb on the right - as in end of roadway details */}
        {/* Ground/road pavement */}
        <path d="M 0,38 L 90,38 Q 110,20 140,20 A 35,35 0 1,1 140,90 Q 110,90 90,72 L 0,72 Z" fill="rgba(30, 58, 138, 0.15)" stroke="rgba(96, 165, 250, 0.6)" strokeWidth="1" />
        
        {/* Median divider dividing the lanes coming from the left */}
        <path d="M 0,53 L 80,53 Q 90,53 95,50 Q 100,55 95,60 Q 90,57 80,57 L 0,57 Z" fill="#1e293b" stroke="rgba(96, 165, 250, 0.8)" strokeWidth="0.75" />
        
        {/* Dynamic arrows showing turning loop */}
        <path d="M 60,45 Q 110,30 140,30 A 25,25 0 1,1 140,80 Q 110,80 60,65" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" />
        {/* Arrow head */}
        <path d="M 60,65 L 68,63 M 60,65 L 67,69" stroke="#f59e0b" strokeWidth="1" fill="none" />

        {/* Central "GRADED EARTH" circular island inside the bulb */}
        <circle cx="140" cy="55" r="15" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="1" strokeDasharray="2 2" />
        <text x="140" y="53" textAnchor="middle" className="text-[3.5px] fill-emerald-400 font-bold font-sans">GRADED</text>
        <text x="140" y="58" textAnchor="middle" className="text-[3.5px] fill-emerald-400 font-bold font-sans">EARTH</text>

        {/* Chevrons pointing the direction on the outer circular edge */}
        {/* Far right warning chevron at (173, 55) */}
        <g transform="translate(173, 52) scale(0.6)">
          <rect x="0" y="0" width="8" height="6" fill="#ef4444" stroke="white" strokeWidth="0.5" />
          <path d="M 2,1 L 5,3 L 2,5" stroke="white" strokeWidth="1" fill="none" />
        </g>
        {/* Top-Right chevron at angle around the bulb */}
        <g transform="translate(163, 30) rotate(30) scale(0.6)">
          <rect x="0" y="0" width="8" height="6" fill="#ef4444" stroke="white" strokeWidth="0.5" />
          <path d="M 2,1 L 5,3 L 2,5" stroke="white" strokeWidth="1" fill="none" />
        </g>
        {/* Bottom-Right chevron */}
        <g transform="translate(163, 76) rotate(-30) scale(0.6)">
          <rect x="0" y="0" width="8" height="6" fill="#ef4444" stroke="white" strokeWidth="0.5" />
          <path d="M 2,1 L 5,3 L 2,5" stroke="white" strokeWidth="1" fill="none" />
        </g>

        {/* Warning yellow transverse rumble strips on incoming lanes */}
        <line x1="25" y1="38" x2="25" y2="53" stroke="#f59e0b" strokeWidth="1.2" />
        <line x1="30" y1="38" x2="30" y2="53" stroke="#f59e0b" strokeWidth="1.2" />
        <line x1="35" y1="38" x2="35" y2="53" stroke="#f59e0b" strokeWidth="1.2" />
        <line x1="40" y1="38" x2="40" y2="53" stroke="#f59e0b" strokeWidth="1.2" />

        <line x1="25" y1="57" x2="25" y2="72" stroke="#f59e0b" strokeWidth="1.2" />
        <line x1="30" y1="57" x2="30" y2="72" stroke="#f59e0b" strokeWidth="1.2" />
        <line x1="35" y1="57" x2="35" y2="72" stroke="#f59e0b" strokeWidth="1.2" />
        <line x1="40" y1="57" x2="40" y2="72" stroke="#f59e0b" strokeWidth="1.2" />

        {/* Red warning sign on poles at x=10 */}
        <g transform="translate(12, 16) scale(0.7)">
          <rect x="0" y="0" width="16" height="12" fill="#ef4444" stroke="white" strokeWidth="0.5" />
          <text x="8" y="5" textAnchor="middle" className="text-[3px] fill-white font-bold font-sans">ROADWAY</text>
          <text x="8" y="9" textAnchor="middle" className="text-[3px] fill-white font-bold font-sans">END</text>
          <line x1="8" y1="12" x2="8" y2="28" stroke="rgba(96, 165, 250, 0.8)" strokeWidth="1" />
        </g>

        {/* Dimension notes */}
        <text x="140" y="14" textAnchor="middle" className="text-[4px] fill-amber-300 font-sans font-bold">R100m OUTER</text>
        <text x="82" y="32" textAnchor="middle" className="text-[4px] fill-blue-300 font-sans">TAPER 1:15</text>
        <text x="100" y="99" textAnchor="middle" className="text-[5.5px] fill-sky-300 font-sans font-bold">BULB TURNAROUND FOR DIVIDED HIGHWAY</text>
      </>
    );
  }

  if (draw.id === "std_draw_18") {
    return (
      <>
        {/* Blueprint schedule table container */}
        <rect x="10" y="10" width="180" height="95" fill="rgba(30, 58, 138, 0.08)" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="0.75" />
        {/* Double border inside */}
        <rect x="12" y="12" width="176" height="91" fill="none" stroke="rgba(96, 165, 250, 0.25)" strokeWidth="0.5" />

        {/* Outer Title Box of the Sheet */}
        <rect x="12" y="12" width="176" height="15" fill="rgba(30, 58, 138, 0.3)" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="0.5" />
        <text x="100" y="21" textAnchor="middle" className="text-[5.5px] font-bold fill-sky-200 font-sans">SPEED CHANGE LANES RECOMMENDED LENGTHS / حارات تغيير السرعة</text>

        {/* Table Column Header Box */}
        <rect x="18" y="32" width="164" height="14" fill="rgba(30, 58, 138, 0.4)" stroke="#60a5fa" strokeWidth="0.5" />
        
        {/* Divides */}
        <line x1="68" y1="32" x2="68" y2="86" stroke="#60a5fa" strokeWidth="0.5" />
        <line x1="126" y1="32" x2="126" y2="86" stroke="#60a5fa" strokeWidth="0.5" />

        {/* Column Headers Titles */}
        <text x="43" y="38" textAnchor="middle" className="text-[4px] font-bold fill-amber-300 font-sans">DESIGN SPEED / السرعة التصميمية</text>
        <text x="43" y="43" textAnchor="middle" className="text-[3.5px] fill-amber-300 font-sans">(KM/H) كم/س</text>

        <text x="97" y="38" textAnchor="middle" className="text-[4px] font-bold fill-sky-200 font-sans">DECEL. TAPER LENGTH / حارة التباطؤ</text>
        <text x="97" y="43" textAnchor="middle" className="text-[3.5px] fill-sky-200 font-sans">(METERS) متر</text>

        <text x="155" y="38" textAnchor="middle" className="text-[4px] font-bold fill-sky-200 font-sans">ACCEL. TAPER LENGTH / حارة التسارع</text>
        <text x="155" y="43" textAnchor="middle" className="text-[3.5px] fill-sky-200 font-sans">(METERS) متر</text>

        {/* Horizontal rows */}
        <line x1="18" y1="46" x2="182" y2="46" stroke="#60a5fa" strokeWidth="0.5" />
        <line x1="18" y1="56" x2="182" y2="56" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="2 1" />
        <line x1="18" y1="66" x2="182" y2="66" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="2 1" />
        <line x1="18" y1="76" x2="182" y2="76" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="2 1" />
        <line x1="18" y1="86" x2="182" y2="86" stroke="#60a5fa" strokeWidth="0.5" />

        {/* Table Content values */}
        {/* Row 1 (80 km/h) */}
        <text x="43" y="52" textAnchor="middle" className="text-[4.5px] font-bold fill-white font-mono">80</text>
        <text x="97" y="52" textAnchor="middle" className="text-[4.5px] fill-sky-100 font-mono">110 m</text>
        <text x="155" y="52" textAnchor="middle" className="text-[4.5px] fill-sky-100 font-mono">140 m</text>

        {/* Row 2 (100 km/h) */}
        <text x="43" y="62" textAnchor="middle" className="text-[4.5px] font-bold fill-white font-mono">100</text>
        <text x="97" y="62" textAnchor="middle" className="text-[4.5px] fill-sky-100 font-mono">145 m</text>
        <text x="155" y="62" textAnchor="middle" className="text-[4.5px] fill-sky-100 font-mono">205 m</text>

        {/* Row 3 (120 km/h) */}
        <text x="43" y="72" textAnchor="middle" className="text-[4.5px] font-bold fill-white font-mono">120</text>
        <text x="97" y="72" textAnchor="middle" className="text-[4.5px] fill-sky-100 font-mono">180 m</text>
        <text x="155" y="72" textAnchor="middle" className="text-[4.5px] fill-sky-100 font-mono">265 m</text>

        {/* Row 4 (140 km/h) */}
        <text x="43" y="82" textAnchor="middle" className="text-[4.5px] font-bold fill-white font-mono">140</text>
        <text x="97" y="82" textAnchor="middle" className="text-[4.5px] fill-sky-100 font-mono">215 m</text>
        <text x="155" y="82" textAnchor="middle" className="text-[4.5px] fill-sky-100 font-mono">335 m</text>

        {/* Footnote instruction */}
        <text x="100" y="99" textAnchor="middle" className="text-[3.5px] fill-emerald-300 font-sans italic">COMPLEMENTARY SPEEDS INTEGRATION SCHEDULE - AASHTO DESIGN VALUES</text>
      </>
    );
  }

  if (draw.id === "std_draw_22") {
    return (
      <>
        {/* Main straight highway at the bottom */}
        <rect x="0" y="82" width="200" height="24" fill="rgba(30, 58, 138, 0.15)" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="0.75" />
        {/* Highway lines */}
        <line x1="0" y1="94" x2="200" y2="94" stroke="#f59e0b" strokeWidth="1" />
        <line x1="0" y1="95.5" x2="200" y2="95.5" stroke="#f59e0b" strokeWidth="1" />
        {/* Lane white stripes */}
        <line x1="0" y1="88" x2="200" y2="88" stroke="white" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="0" y1="100" x2="200" y2="100" stroke="white" strokeWidth="0.5" strokeDasharray="3 3" strokeOpacity="0.7" />
        <text x="100" y="103" textAnchor="middle" className="text-[3.5px] fill-slate-300 font-sans">EXISTING DIVISION ROAD / الطريق الرئيسي</text>

        {/* Diverging ramp branching upwards */}
        {/* Diverge path starts at x=12, y=82. Upper bypass path goes flat at y=74 */}
        <path d="M 12,82 Q 35,74 50,74 L 160,74 Q 175,74 190,82" fill="none" stroke="rgba(96, 165, 250, 0.8)" strokeWidth="1.5" />
        
        {/* Upper Outer bypass Loop / Island for truck layout */}
        {/* Secondary ramp leading to parking/weigh loop */}
        <path d="M 50,74 Q 55,42 85,42 L 135,42 Q 155,42 160,74" fill="none" stroke="rgba(96, 165, 250, 0.8)" strokeWidth="1.2" />

        {/* Shaded Central Island */}
        <path d="M 55,74 Q 60,46 85,46 L 132,46 Q 148,46 153,74 Z" fill="rgba(30, 58, 138, 0.3)" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="0.5" />

        {/* Slanted Truck Parking slots (مواقف الشاحنات @ 30 degrees) inside the island */}
        <line x1="88" y1="46" x2="82" y2="60" stroke="#60a5fa" strokeWidth="0.6" />
        <line x1="93" y1="46" x2="87" y2="60" stroke="#60a5fa" strokeWidth="0.6" />
        <line x1="98" y1="46" x2="92" y2="60" stroke="#60a5fa" strokeWidth="0.6" />
        <line x1="103" y1="46" x2="97" y2="60" stroke="#60a5fa" strokeWidth="0.6" />
        <line x1="108" y1="46" x2="102" y2="60" stroke="#60a5fa" strokeWidth="0.6" />
        <line x1="113" y1="46" x2="107" y2="60" stroke="#60a5fa" strokeWidth="0.6" />
        <line x1="118" y1="46" x2="112" y2="60" stroke="#60a5fa" strokeWidth="0.6" />
        <line x1="123" y1="46" x2="117" y2="60" stroke="#60a5fa" strokeWidth="0.6" />
        <line x1="128" y1="46" x2="122" y2="60" stroke="#60a5fa" strokeWidth="0.6" />
        <line x1="133" y1="46" x2="127" y2="60" stroke="#60a5fa" strokeWidth="0.6" />

        {/* Diagonal stripes on outer nose/merge points */}
        <line x1="56" y1="74" x2="62" y2="70" stroke="#f59e0b" strokeWidth="0.5" />
        <line x1="58" y1="74" x2="64" y2="70" stroke="#f59e0b" strokeWidth="0.5" />
        <line x1="60" y1="74" x2="66" y2="70" stroke="#f59e0b" strokeWidth="0.5" />
        
        {/* Weighing Scales Platforms at the lower branch (y=74) */}
        {/* Dual Scale Platforms labeled on the layout */}
        <rect x="90" y="71" width="18" height="6" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="0.75" />
        <rect x="112" y="71" width="18" height="6" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="0.75" />
        {/* Scale labels */}
        <line x1="99" y1="74" x2="99" y2="78" stroke="white" strokeWidth="0.4" />
        <line x1="121" y1="74" x2="121" y2="78" stroke="white" strokeWidth="0.4" />
        <text x="109" y="80" textAnchor="middle" className="text-[3.3px] font-bold fill-amber-300 font-sans">WEIGH PLATFORMS (ميزان شاحنات) 25.00m</text>

        {/* Parking dimension arrows and text */}
        <text x="105" y="40" textAnchor="middle" className="text-[3.5px] fill-sky-200 font-sans font-bold">PARKING AREA (91.10m @30°)</text>
        <line x1="88" y1="38" x2="128" y2="38" stroke="rgba(96, 165, 250, 0.7)" strokeWidth="0.4" strokeDasharray="1 1" />

        {/* Chevron warning flags */}
        {/* Large chevron on the island nose */}
        <g transform="translate(142, 49) scale(0.6)">
          <rect x="0" y="0" width="8" height="5" fill="#ef4444" stroke="white" strokeWidth="0.4" />
          <path d="M 2,1 L 5,2.5 L 2,4" stroke="white" strokeWidth="0.75" fill="none" />
        </g>
        <g transform="translate(148, 51) scale(0.6)">
          <rect x="0" y="0" width="8" height="5" fill="#ef4444" stroke="white" strokeWidth="0.4" />
          <path d="M 2,1 L 5,2.5 L 2,4" stroke="white" strokeWidth="0.75" fill="none" />
        </g>

        {/* Safety & sign details */}
        {/* Speed Limit 30 sign */}
        <circle cx="28" cy="62" r="5" fill="white" stroke="#ef4444" strokeWidth="1" />
        <text x="28" y="64" textAnchor="middle" className="text-[5px] font-bold fill-black font-sans">30</text>

        {/* Stop sign octagon */}
        <polygon points="172,61 175,59 178,59 180,61 180,64 178,66 175,66 172,64" fill="#ef4444" stroke="white" strokeWidth="0.4" />
        <text x="176" y="64.5" textAnchor="middle" className="text-[3.5px] font-bold fill-white font-sans">STOP</text>

        {/* Yield Triangle */}
        <polygon points="46,67 52,67 49,62" fill="none" stroke="#ef4444" strokeWidth="0.75" />

        {/* Arrow directions on road */}
        <path d="M 25,79 L 29,77.5 L 25,76" fill="none" stroke="#60a5fa" strokeWidth="0.6" />
        <path d="M 168,76 L 172,77.5 L 168,79" fill="none" stroke="#60a5fa" strokeWidth="0.6" />

        {/* Title details */}
        <text x="100" y="16" textAnchor="middle" className="text-[6.5px] font-extrabold fill-sky-300 font-sans tracking-wide">WEIGH STATION OVERALL SAFETY & MARKING LAYOUT</text>
        <text x="100" y="22" textAnchor="middle" className="text-[5px] fill-amber-300 font-sans font-bold">مخطط السلامة المرورية واللوحات الإرشادية لـ "ميزان شاحنات" نموذجي</text>
      </>
    );
  }

  if (draw.id === "std_draw_23") {
    return (
      <>
        {/* Title of standard drawing card */}
        <text x="100" y="11" textAnchor="middle" className="text-[6.5px] font-extrabold fill-sky-300 font-sans tracking-wide">ROAD HUMPS & PAINTED RUMBLE STRIPS DETAILS</text>
        <text x="100" y="16.5" textAnchor="middle" className="text-[5px] fill-amber-300 font-sans font-bold">المخطط القياسي للمطبات والمطبات المشطية بالدهانات</text>

        {/* Outer divider line between Left and Right Sections */}
        <line x1="100" y1="22" x2="100" y2="105" stroke="rgba(96, 165, 250, 0.3)" strokeWidth="0.75" strokeDasharray="3 3" />

        {/* LEFT SECTION: Painted Rumble Strips (المطبات المشطية بالدهانات) */}
        <g transform="translate(4, 22)">
          {/* Section banner */}
          <rect x="0" y="0" width="88" height="10" fill="rgba(30, 58, 138, 0.4)" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="0.5" />
          <text x="44" y="6" textAnchor="middle" className="text-[4px] font-bold fill-sky-200 font-sans">1. THERMOPLASTIC PAINTED RUMBLE STRIPS</text>
          <text x="44" y="9.5" textAnchor="middle" className="text-[3px] fill-amber-300 font-sans">المطبات المشطية بالدهانات الحرارية</text>

          {/* Yellow Stripes demonstration */}
          <g transform="translate(6, 14)">
            {/* Draw 5 horizontal stripes */}
            <rect x="0" y="0" width="30" height="2" fill="#f59e0b" />
            <rect x="0" y="4.5" width="30" height="2" fill="#f59e0b" />
            <text x="33" y="4.5" className="text-[3px] fill-amber-300 font-mono scale-[0.8] origin-left">Y/4</text>
            <rect x="0" y="9" width="30" height="2" fill="#f59e0b" />
            <text x="33" y="9" className="text-[3px] fill-amber-300 font-mono scale-[0.8] origin-left">Y/4</text>
            <rect x="0" y="13.5" width="30" height="2" fill="#f59e0b" />
            <text x="33" y="13.5" className="text-[3px] fill-amber-300 font-mono scale-[0.8] origin-left">Y/4</text>
            <rect x="0" y="18" width="30" height="2" fill="#f59e0b" />
            <text x="33" y="18" className="text-[3px] fill-amber-300 font-mono scale-[0.8] origin-left">Y/4</text>

            {/* Total distance identifier arrow Y */}
            <line x1="-3" y1="1" x2="-3" y2="19" stroke="#60a5fa" strokeWidth="0.5" />
            <line x1="-5" y1="1" x2="-1" y2="1" stroke="#60a5fa" strokeWidth="0.5" />
            <line x1="-5" y1="19" x2="-1" y2="19" stroke="#60a5fa" strokeWidth="0.5" />
            <text x="-6" y="11" textAnchor="end" className="text-[4px] fill-sky-300 font-sans font-bold">Y</text>

            <text x="15" y="24" textAnchor="middle" className="text-[2.5px] fill-slate-300 font-sans">Width: 300mm | Thk: 5-8mm</text>
          </g>

          {/* Standard spacing chart table */}
          <g transform="translate(48, 14)">
            {/* Table Box */}
            <rect x="0" y="0" width="38" height="34" fill="rgba(15, 23, 42, 0.4)" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="0.5" />
            {/* Horizontal divides */}
            <line x1="0" y1="8" x2="38" y2="8" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="0.5" />
            <line x1="0" y1="13.5" x2="38" y2="13.5" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="0.3" strokeDasharray="1 1" />
            <line x1="0" y1="18.5" x2="38" y2="18.5" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="0.3" strokeDasharray="1 1" />
            <line x1="0" y1="23.5" x2="38" y2="23.5" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="0.3" strokeDasharray="1 1" />
            <line x1="0" y1="28.5" x2="38" y2="28.5" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="0.3" strokeDasharray="1 1" />
            
            {/* Vertical divides */}
            <line x1="12" y1="0" x2="12" y2="34" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="0.5" />
            <line x1="25" y1="0" x2="25" y2="34" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="0.5" />

            {/* Headers */}
            <text x="6" y="5" textAnchor="middle" className="text-[2.5px] font-bold fill-amber-300 font-sans">DS</text>
            <text x="18.5" y="5" textAnchor="middle" className="text-[2.5px] font-bold fill-sky-200 font-sans">Y</text>
            <text x="31.5" y="5" textAnchor="middle" className="text-[2.5px] font-bold fill-sky-200 font-sans">Y/4</text>

            {/* Rows */}
            <text x="6" y="12" textAnchor="middle" className="text-[2.5px] fill-white font-mono">110</text>
            <text x="18.5" y="12" textAnchor="middle" className="text-[2.5px] fill-slate-300 font-mono">30</text>
            <text x="31.5" y="12" textAnchor="middle" className="text-[2.5px] fill-slate-300 font-mono">7.50</text>

            <text x="6" y="17" textAnchor="middle" className="text-[2.5px] fill-white font-mono">90</text>
            <text x="18.5" y="17" textAnchor="middle" className="text-[2.5px] fill-slate-300 font-mono">25</text>
            <text x="31.5" y="17" textAnchor="middle" className="text-[2.5px] fill-slate-300 font-mono">6.25</text>

            <text x="6" y="22" textAnchor="middle" className="text-[2.5px] fill-white font-mono">70</text>
            <text x="18.5" y="22" textAnchor="middle" className="text-[2.5px] fill-slate-300 font-mono">20</text>
            <text x="31.5" y="22" textAnchor="middle" className="text-[2.5px] fill-slate-300 font-mono">5.00</text>

            <text x="6" y="27" textAnchor="middle" className="text-[2.5px] fill-white font-mono">50</text>
            <text x="18.5" y="27" textAnchor="middle" className="text-[2.5px] fill-slate-300 font-mono">14</text>
            <text x="31.5" y="27" textAnchor="middle" className="text-[2.5px] fill-slate-300 font-mono">3.50</text>

            <text x="6" y="32" textAnchor="middle" className="text-[2.5px] fill-white font-mono">30</text>
            <text x="18.5" y="32" textAnchor="middle" className="text-[2.5px] fill-slate-300 font-mono">10</text>
            <text x="31.5" y="32" textAnchor="middle" className="text-[2.5px] fill-slate-300 font-mono">2.50</text>
          </g>

          {/* Splay design speed spacing scale on far left */}
          <g transform="translate(6, 50)">
            <line x1="0" y1="0" x2="80" y2="0" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="0.5" />
            <line x1="0" y1="12" x2="80" y2="12" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="0.5" />
            
            {/* Draw sample road layout with approach strips */}
            {/* Dotted travel lanes */}
            <line x1="0" y1="6" x2="80" y2="6" stroke="white" strokeWidth="0.4" strokeDasharray="3 3" />
            
            {/* Yellow painted transverse bars grouped and spaced */}
            {/* Group 1 */}
            <line x1="15" y1="0" x2="15" y2="12" stroke="#f59e0b" strokeWidth="1" />
            <line x1="18" y1="0" x2="18" y2="12" stroke="#f59e0b" strokeWidth="1" />
            <line x1="21" y1="0" x2="21" y2="12" stroke="#f59e0b" strokeWidth="1" />
            {/* Group 2 */}
            <line x1="38" y1="0" x2="38" y2="12" stroke="#f59e0b" strokeWidth="1" />
            <line x1="42" y1="0" x2="42" y2="12" stroke="#f59e0b" strokeWidth="1" />
            <line x1="46" y1="0" x2="46" y2="12" stroke="#f59e0b" strokeWidth="1" />
            {/* Group 3 */}
            <line x1="65" y1="0" x2="65" y2="12" stroke="#f59e0b" strokeWidth="1" />
            <line x1="71" y1="0" x2="71" y2="12" stroke="#f59e0b" strokeWidth="1" />

            <text x="40" y="19" textAnchor="middle" className="text-[3px] fill-sky-200 font-sans">SPLAY RUMBLE MARKINGS SPACING APPROACH</text>
          </g>
        </g>

        {/* RIGHT SECTION: Asphalt Speed Hump (المطب الأسفلتي) */}
        <g transform="translate(108, 22)">
          {/* Section banner */}
          <rect x="0" y="0" width="88" height="10" fill="rgba(30, 58, 138, 0.4)" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="0.5" />
          <text x="44" y="6" textAnchor="middle" className="text-[4px] font-bold fill-sky-200 font-sans">2. DETAILS OF ASPHALTED SPEED HUMP</text>
          <text x="44" y="9.5" textAnchor="middle" className="text-[3px] fill-amber-300 font-sans">تفاصيل المطب الأسفلتي والعيون القطنية العاكسة</text>

          {/* SECTION SIDE VIEW PROFILE OF HUMP */}
          <g transform="translate(4, 16)">
            {/* Road surface floor */}
            <line x1="0" y1="20" x2="80" y2="20" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="1" />
            
            {/* Splayed Hatching representing ground under the road */}
            <line x1="5" y1="20" x2="1" y2="24" stroke="rgba(96, 165, 250, 0.25)" strokeWidth="0.5" />
            <line x1="12" y1="20" x2="8" y2="24" stroke="rgba(96, 165, 250, 0.25)" strokeWidth="0.5" />
            <line x1="70" y1="20" x2="66" y2="24" stroke="rgba(96, 165, 250, 0.25)" strokeWidth="0.5" />
            <line x1="76" y1="20" x2="72" y2="24" stroke="rgba(96, 165, 250, 0.25)" strokeWidth="0.5" />

            {/* Asphalt speed hump curved profile */}
            {/* Height: 100mm (scale: 6 pixels height = 100mm) */}
            {/* Total width: 3650mm + approach ramps = side views */}
            {/* Ramp up left (500mm): 15 to 25. Main body curve: 25 to 55. Ramp down right: 55 to 65 */}
            <path d="M 0,20 L 15,20 Q 25,14 30,14 L 50,14 Q 55,20 65,20 L 80,20" fill="rgba(30, 58, 138, 0.2)" stroke="#3b82f6" strokeWidth="1.2" />

            {/* RRPMs / Cat Eyes on the approaches */}
            <rect x="11" y="18.5" width="2" height="1.5" fill="#f59e0b" stroke="white" strokeWidth="0.3" />
            <rect x="67" y="18.5" width="2" height="1.5" fill="#f59e0b" stroke="white" strokeWidth="0.3" />
            <text x="12" y="16.5" textAnchor="middle" className="text-[2.2px] fill-amber-300 font-sans scale-[0.9] origin-center">RRPM</text>

            {/* Dimensions for Hump HEIGHT: 100 mm */}
            <line x1="40" y1="20" x2="40" y2="14" stroke="#e11d48" strokeWidth="0.5" strokeDasharray="1 1" />
            <line x1="38" y1="14" x2="42" y2="14" stroke="#e11d48" strokeWidth="0.5" />
            <text x="40" y="11" textAnchor="middle" className="text-[2.8px] font-bold fill-rose-300 font-sans">100 mm (10cm)</text>

            {/* Dimension for horizontal distance: 3650 mm */}
            <line x1="15" y1="28" x2="65" y2="28" stroke="#3b82f6" strokeWidth="0.5" />
            <line x1="15" y1="26" x2="15" y2="30" stroke="#3b82f6" strokeWidth="0.5" />
            <line x1="65" y1="26" x2="65" y2="30" stroke="#3b82f6" strokeWidth="0.5" />
            <text x="40" y="33.5" textAnchor="middle" className="text-[3px] font-bold fill-sky-200 font-mono">3650 mm (3.65m) WIDTH</text>

            <text x="40" y="2" textAnchor="middle" className="text-[3px] font-bold fill-slate-300 font-sans">SECTION SIDE VIEW / مقطع عرضي للمطب</text>
          </g>

          {/* FRONT VIEW HUMP PATTERN (الرؤية الأمامية ودهانات المطب) */}
          <g transform="translate(4, 56)">
            {/* Draw rectangular field of surface */}
            <rect x="5" y="4" width="70" height="16" fill="rgba(30, 58, 138, 0.1)" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="0.5" />

            {/* Zebra chevron / triangles pointing to center of the hump */}
            <polygon points="12,12 8,20 16,20" fill="white" fillOpacity="0.8" />
            <polygon points="22,12 18,20 26,20" fill="white" fillOpacity="0.8" />
            <polygon points="32,12 28,20 36,20" fill="white" fillOpacity="0.8" />
            <polygon points="42,12 38,20 46,20" fill="white" fillOpacity="0.8" />
            <polygon points="52,12 48,20 56,20" fill="white" fillOpacity="0.8" />
            <polygon points="62,12 58,20 66,20" fill="white" fillOpacity="0.8" />
            <polygon points="72,12 68,20 76,20" fill="white" fillOpacity="0.8" />

            {/* Top view text labels */}
            <text x="40" y="2" textAnchor="middle" className="text-[3px] font-bold fill-slate-300 font-sans">FRONT HIGHLIGHT & MARKING VIEW / الرؤية الأمامية</text>
            <text x="40" y="24" textAnchor="middle" className="text-[2.8px] fill-amber-300 font-sans">REFLECTIVE WHITE STRIPES @ 50° / خطوط بيضاء عاكسة مائلة ٥٠ درجة</text>
          </g>
        </g>
      </>
    );
  }

  const isTIntersection = draw.titleAr?.includes("تقاطع T") || 
                          draw.titleAr?.includes("تقاطع ثلاثي") || 
                          draw.titleEn?.toLowerCase().includes("three-way") || 
                          draw.titleEn?.toLowerCase().includes("3-way") || 
                          ["std_draw_8", "std_draw_9", "std_draw_10", "std_draw_11", "std_draw_27", "std_draw_28"].includes(draw.id);

  if (isTIntersection) {
    return (
      <>
        {/* T-Intersection pavement layout */}
        <path d="M 0,35 L 200,35 L 200,70 L 120,70 L 120,110 L 80,110 L 80,70 L 0,70 Z" fill="rgba(30, 58, 138, 0.15)" stroke="rgba(96, 165, 250, 0.6)" strokeWidth="1" />
        
        {/* Main horizontal road center lanes */}
        <line x1="0" y1="51.5" x2="74" y2="51.5" stroke="#f59e0b" strokeWidth="0.8" />
        <line x1="0" y1="53.5" x2="74" y2="53.5" stroke="#f59e0b" strokeWidth="0.8" />
        
        <line x1="126" y1="51.5" x2="200" y2="51.5" stroke="#f59e0b" strokeWidth="0.8" />
        <line x1="126" y1="53.5" x2="200" y2="53.5" stroke="#f59e0b" strokeWidth="0.8" />

        {/* Dash lines inside junction area */}
        <line x1="74" y1="52.5" x2="126" y2="52.5" stroke="white" strokeWidth="0.75" strokeDasharray="3 3" />

        {/* Minor vertical road center line */}
        <line x1="100" y1="70" x2="100" y2="110" stroke="#60a5fa" strokeWidth="0.8" strokeDasharray="4 3" />

        {/* Turn Guide Curves */}
        <path d="M 60,53 Q 100,53 100,85" stroke="rgba(245, 158, 11, 0.7)" strokeWidth="0.75" strokeDasharray="2.5 1.5" fill="none" />
        <path d="M 140,53 Q 100,53 100,85" stroke="rgba(245, 158, 11, 0.7)" strokeWidth="0.75" strokeDasharray="2.5 1.5" fill="none" />

        {/* Stop Bar on minor road split */}
        <line x1="100" y1="70" x2="120" y2="70" stroke="white" strokeWidth="1.5" />

        {/* Virtual triangular traffic island / جزيرة وهمية in the mouth */}
        <polygon points="100,77 94,88 106,88" fill="rgba(30, 58, 138, 0.4)" stroke="rgba(96, 165, 250, 0.9)" strokeWidth="0.75" />
        <line x1="96" y1="83" x2="104" y2="83" stroke="rgba(96, 165, 250, 0.7)" strokeWidth="0.5" />

        {/* Text descriptions */}
        <text x="100" y="22" textAnchor="middle" className="text-[6.5px] font-bold fill-sky-300 font-sans">T-INTERSECTION / تقاطع ثلاثي T</text>
        <text x="50" y="94" textAnchor="middle" className="text-[4.5px] fill-amber-300 font-sans">R = 15m</text>
        <text x="150" y="94" textAnchor="middle" className="text-[4.5px] fill-amber-300 font-sans">DESIGN STANDARD</text>
      </>
    );
  }

  if (category === "Checkpoints") {
    return (
      <>
        {/* Main road lanes */}
        <line x1="0" y1="55" x2="200" y2="55" stroke="rgba(37, 99, 235, 0.3)" strokeWidth="16" />
        <line x1="0" y1="55" x2="200" y2="55" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="0.75" strokeDasharray="4 4" />
        <line x1="0" y1="47" x2="200" y2="47" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1" />
        <line x1="0" y1="63" x2="200" y2="63" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1" />

        {/* Funnel Tap Lines */}
        <path d="M 15 47 L 55 51 M 15 63 L 55 59" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" />
        <path d="M 125 51 L 185 47 M 125 59 L 185 63" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" />

        {/* Security Cabins */}
        <rect x="85" y="46" width="12" height="7" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="0.75" />
        <rect x="85" y="57" width="12" height="7" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="0.75" />

        {/* Barriers */}
        <line x1="97" y1="42" x2="97" y2="49" stroke="#ef4444" strokeWidth="1.5" />
        <line x1="97" y1="68" x2="97" y2="61" stroke="#ef4444" strokeWidth="1.5" />

        {/* Warning Triangle Indicator */}
        <polygon points="42,52 48,52 45,47" fill="none" stroke="#f59e0b" strokeWidth="0.75" />

        {/* Text annotations */}
        <text x="100" y="30" textAnchor="middle" className="text-[6px] font-bold fill-amber-400 font-sans">CHECKPOINT CONTROL</text>
        <text x="45" y="77" textAnchor="middle" className="text-[5px] fill-blue-300 font-sans font-bold">TAPER=35m</text>
        <text x="100" y="77" textAnchor="middle" className="text-[5.5px] fill-emerald-300 font-sans font-bold">ZONE LIMIT</text>
      </>
    );
  }

  if (category === "Intersections") {
    return (
      <>
        {/* Intersection pavement layout */}
        <path d="M 0,38 L 78,38 L 78,0 L 122,0 L 122,38 L 200,38 L 200,72 L 122,72 L 122,110 L 78,110 L 78,72 L 0,72 Z" fill="rgba(30, 58, 138, 0.15)" stroke="rgba(96, 165, 250, 0.6)" strokeWidth="1" />
        
        {/* Double yellow lines guiding paths */}
        <path d="M 0,55 L 78,55 M 122,55 L 200,55" stroke="#f59e0b" strokeWidth="1.2" />
        <path d="M 100,0 L 100,38 M 100,72 L 100,110" stroke="#f59e0b" strokeWidth="1.2" />

        {/* Stop Bars */}
        <line x1="78" y1="38" x2="78" y2="55" stroke="white" strokeWidth="1.5" />
        <line x1="122" y1="55" x2="122" y2="72" stroke="white" strokeWidth="1.5" />
        <line x1="100" y1="38" x2="122" y2="38" stroke="white" strokeWidth="1.5" />
        <line x1="78" y1="72" x2="100" y2="72" stroke="white" strokeWidth="1.5" />

        {/* Dotted curve radiuses */}
        <path d="M 78,38 Q 78,72 100,72" stroke="rgba(245, 158, 11, 0.8)" strokeWidth="0.75" strokeDasharray="3 2" fill="none" />
        <text x="64" y="85" className="text-[5px] fill-amber-300 font-sans font-bold text-center">R = 12.0m</text>

        {/* Text annotations */}
        <text x="100" y="57" textAnchor="middle" className="text-[6.5px] font-bold fill-sky-200 font-sans">MAJOR JUNCTION</text>
      </>
    );
  }

  if (category === "U-Turns") {
    return (
      <>
        {/* Divided Highway Lanes */}
        <rect x="0" y="30" width="200" height="50" fill="rgba(30, 58, 138, 0.1)" />
        <line x1="0" y1="30" x2="200" y2="30" stroke="rgba(96, 165, 250, 0.6)" strokeWidth="1" />
        <line x1="0" y1="80" x2="200" y2="80" stroke="rgba(96, 165, 250, 0.6)" strokeWidth="1" />

        {/* Median Barrier */}
        <rect x="0" y="52" width="60" height="6" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="0.75" />
        <rect x="140" y="52" width="60" height="6" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="0.75" />

        {/* Flow arrow showing U-Turn */}
        <path d="M 85,42 C 125,42 125,68 85,68" fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="2.5 1.5" />
        <path d="M 85,68 L 91,65 M 85,68 L 91,71" stroke="#f59e0b" strokeWidth="1.2" fill="none" />

        {/* Left hand taper line */}
        <line x1="60" y1="55" x2="80" y2="55" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="120" y1="55" x2="140" y2="55" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="0.5" strokeDasharray="3 3" />

        <text x="100" y="21" textAnchor="middle" className="text-[6.5px] font-bold fill-sky-300 font-sans">U-TURN BLUEPRINT</text>
        <text x="100" y="94" textAnchor="middle" className="text-[5.5px] font-sans font-bold fill-amber-300">MEDIAN OPENING = 18m</text>
      </>
    );
  }

  if (category === "ServiceStations") {
    return (
      <>
        {/* Main highway lanes */}
        <line x1="0" y1="82" x2="200" y2="82" stroke="rgba(96, 165, 250, 0.6)" strokeWidth="1" />
        <line x1="0" y1="94" x2="200" y2="94" stroke="rgba(96, 165, 250, 0.6)" strokeWidth="1" />
        
        {/* Taper off-ramp */}
        <path d="M 15,82 L 45,62 L 155,62 L 185,82" fill="rgba(30, 58, 138, 0.2)" stroke="rgba(96, 165, 250, 0.8)" strokeWidth="1" />
        
        {/* Station */}
        <rect x="65" y="25" width="70" height="24" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1" />
        <text x="100" y="35" textAnchor="middle" className="text-[5.5px] font-bold fill-white font-sans">SERVICE STATION</text>

        {/* Access Arrows */}
        <path d="M 30,76 Q 45,65 65,65" fill="none" stroke="#f59e0b" strokeWidth="1" />
        <path d="M 65,65 L 59,62 M 65,65 L 59,68" stroke="#f59e0b" strokeWidth="1" fill="none" />

        <path d="M 135,65 Q 155,65 170,76" fill="none" stroke="#f59e0b" strokeWidth="1" />
        <path d="M 170,76 L 164,73 M 170,76 L 164,79" stroke="#f59e0b" strokeWidth="1" fill="none" />

        <circle cx="80" cy="38" r="1.5" fill="#f59e0b" />
        <circle cx="100" cy="38" r="1.5" fill="#f59e0b" />
        <circle cx="120" cy="38" r="1.5" fill="#f59e0b" />

        <text x="100" y="16" textAnchor="middle" className="text-[6.5px] font-bold fill-sky-300 font-sans">STATION INGRESS-EGRESS</text>
      </>
    );
  }

  if (category === "SignsDetails") {
    return (
      <>
        {/* Left sign */}
        <g transform="translate(42, 10)">
          <rect x="0" y="15" width="22" height="30" fill="#f59e0b" stroke="#000" strokeWidth="0.5" />
          <path d="M 5,20 L 12,30 L 5,40 M 12,20 L 19,30 L 12,40" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="11" y1="45" x2="11" y2="90" stroke="#60a5fa" strokeWidth="1.2" />
          <text x="11" y="10" textAnchor="middle" className="text-[5.2px] fill-amber-300 font-bold font-sans">CHEVRON</text>
        </g>

        {/* Right sign */}
        <g transform="translate(125, 10)">
          <polygon points="15,12 3,36 27,36" fill="#ef4444" stroke="#000" strokeWidth="0.5" />
          <polygon points="15,16 6,33 24,33" fill="white" />
          <circle cx="15" cy="27" r="1.5" fill="black" />
          <line x1="15" y1="21" x2="15" y2="24" stroke="black" strokeWidth="1.2" />
          <line x1="15" y1="36" x2="15" y2="90" stroke="#60a5fa" strokeWidth="1.2" />
          <rect x="9" y="80" width="12" height="10" fill="rgba(96, 165, 250, 0.3)" stroke="#60a5fa" strokeWidth="0.5" />
          <text x="15" y="6" textAnchor="middle" className="text-[5.2px] fill-red-300 font-bold font-sans">WARNING</text>
        </g>

        <line x1="10" y1="85" x2="190" y2="85" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="0.5" strokeDasharray="3 3" />
        <text x="100" y="99" textAnchor="middle" className="text-[5px] fill-sky-300 font-sans">MOUNT INTEGRITY SCHEME</text>
      </>
    );
  }

  if (category === "Construction") {
    return (
      <>
        <text x="100" y="19" textAnchor="middle" className="text-[6.5px] font-bold fill-sky-300 font-sans">PAVEMENT CROSS SECTION</text>

        <rect x="30" y="32" width="140" height="8" fill="#1e293b" stroke="#60a5fa" strokeWidth="0.75" />
        <text x="100" y="38" textAnchor="middle" className="text-[4px] fill-slate-300 font-sans">WEARING LAYER (50mm)</text>
        
        <rect x="25" y="40" width="150" height="10" fill="#334155" stroke="#60a5fa" strokeWidth="0.75" />
        <text x="100" y="47" textAnchor="middle" className="text-[4px] fill-slate-300 font-sans">BITUMINOUS BASE (100mm)</text>
        
        <rect x="20" y="50" width="160" height="14" fill="#475569" stroke="#60a5fa" strokeWidth="0.75" />
        <text x="100" y="59" textAnchor="middle" className="text-[4px] fill-slate-300 font-sans">SUB-BASE AGGREGATE (150mm)</text>

        <rect x="15" y="64" width="170" height="18" fill="rgba(30, 58, 138, 0.2)" stroke="#60a5fa" strokeWidth="0.75" />
        <text x="100" y="75" textAnchor="middle" className="text-[4px] fill-slate-400 font-bold font-sans">SUBGRADE COMPACTED 95%</text>

        <path d="M 15,64 L 5,80 M 185,64 L 195,80" stroke="#f59e0b" strokeWidth="0.75" strokeDasharray="2 1" />
        <text x="10" y="73" className="text-[4.5px] fill-amber-300 font-sans font-bold">2:1</text>
        <text x="190" y="73" className="text-[4.5px] fill-amber-300 font-sans font-bold">2:1</text>
      </>
    );
  }

  if (category === "Closures") {
    return (
      <>
        <rect x="0" y="25" width="200" height="60" fill="rgba(30, 58, 138, 0.15)" />
        <line x1="0" y1="25" x2="200" y2="25" stroke="rgba(96, 165, 250, 0.6)" strokeWidth="1" />
        <line x1="0" y1="45" x2="200" y2="45" stroke="rgba(96, 165, 250, 0.3)" strokeWidth="0.75" strokeDasharray="3 3" />
        <line x1="0" y1="65" x2="200" y2="65" stroke="rgba(96, 165, 250, 0.3)" strokeWidth="0.75" strokeDasharray="3 3" />
        <line x1="0" y1="85" x2="200" y2="85" stroke="rgba(96, 165, 250, 0.6)" strokeWidth="1" />

        <path d="M 30,85 L 110,65" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
        <line x1="110" y1="65" x2="200" y2="65" stroke="#ef4444" strokeWidth="1.5" />

        <g transform="translate(15, 68) scale(0.8)">
          <rect x="0" y="0" width="16" height="12" fill="black" stroke="#f59e0b" strokeWidth="0.5" />
          <path d="M 2,6 L 8,3 L 2,3 M 8,6 L 14,3 L 8,3" stroke="#f59e0b" strokeWidth="1" fill="none" />
        </g>

        <path d="M 50,75 Q 80,75 120,55" fill="none" stroke="#f59e0b" strokeWidth="1" />
        <path d="M 120,55 L 114,52 M 120,55 L 114,58" stroke="#f59e0b" strokeWidth="1" fill="none" />

        <text x="100" y="17" textAnchor="middle" className="text-[6.5px] font-bold fill-sky-300 font-sans">FREEWAY SINGLE LANE CLOSURE</text>
        <text x="100" y="99" textAnchor="middle" className="text-[5.5px] font-bold fill-amber-300 font-sans">TAPER REGULATION (L = 180m)</text>
      </>
    );
  }

  if (category === "RumbleStrips") {
    return (
      <>
        <text x="100" y="20" textAnchor="middle" className="text-[6.5px] font-bold fill-sky-300 font-sans">SHOULDER RUMBLE STRIPS (STD-RMB)</text>

        <rect x="0" y="28" width="200" height="58" fill="rgba(30, 58, 138, 0.15)" />
        <line x1="0" y1="28" x2="200" y2="28" stroke="rgba(96, 165, 250, 0.6)" strokeWidth="1" />
        <line x1="0" y1="46" x2="200" y2="46" stroke="white" strokeWidth="1" />
        <line x1="0" y1="86" x2="200" y2="86" stroke="rgba(96, 165, 250, 0.6)" strokeWidth="1" />

        <g stroke="#60a5fa" strokeWidth="1.2">
          <line x1="15" y1="34" x2="15" y2="41" />
          <line x1="25" y1="34" x2="25" y2="41" />
          <line x1="35" y1="34" x2="35" y2="41" />
          <line x1="45" y1="34" x2="45" y2="41" />
          <line x1="55" y1="34" x2="55" y2="41" />
          <line x1="65" y1="34" x2="65" y2="41" />
          <line x1="75" y1="34" x2="75" y2="41" />
          <line x1="85" y1="34" x2="85" y2="41" />
          <line x1="95" y1="34" x2="95" y2="41" />
          <line x1="105" y1="34" x2="105" y2="41" />
          <line x1="115" y1="34" x2="115" y2="41" />
          <line x1="125" y1="34" x2="125" y2="41" />
          <line x1="135" y1="34" x2="135" y2="41" />
          <line x1="145" y1="34" x2="145" y2="41" />
          <line x1="155" y1="34" x2="155" y2="41" />
          <line x1="165" y1="34" x2="165" y2="41" />
          <line x1="175" y1="34" x2="175" y2="41" />
          <line x1="185" y1="34" x2="185" y2="41" />
        </g>

        <text x="100" y="99" textAnchor="middle" className="text-[5.5px] font-sans font-bold fill-amber-300">SPACING 300mm | GROOVE DEPTH 13mm</text>
      </>
    );
  }

  // Fallback beautiful blueprint graphic
  return (
    <>
      <circle cx="100" cy="55" r="28" fill="none" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="0.75" strokeDasharray="3 3" />
      <circle cx="100" cy="55" r="15" fill="none" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="0.5" />
      <line x1="50" y1="55" x2="150" y2="55" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="0.75" strokeDasharray="4 2" />
      <line x1="100" y1="20" x2="100" y2="90" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="0.75" strokeDasharray="4 2" />
      
      {/* Curved outline pathway */}
      <path d="M 40,25 Q 100,25 100,55 T 160,85" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2.5 1.5" />
      <text x="100" y="100" textAnchor="middle" className="text-[5px] fill-amber-300 font-semibold font-sans uppercase">ALIGNMENT MODEL GRID</text>
    </>
  );
}

// Parent SVG wrapper
function renderBlueprintThumbnail(draw: StandardDrawing) {
  const gridId = `grid-${draw.id}`;
  return (
    <svg viewBox="0 0 200 110" className="w-full h-full absolute inset-0 text-cyan-400 font-mono select-none">
      <defs>
        <pattern id={gridId} width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M 12 0 L 0 0 0 12" fill="none" stroke="rgba(37, 99, 235, 0.15)" strokeWidth="0.5" />
        </pattern>
      </defs>
      {/* Blueprint Navy Base */}
      <rect width="100%" height="100%" fill="#060919" />
      <rect width="100%" height="100%" fill={`url(#${gridId})`} />
      
      {/* Title details / Border watermark */}
      <rect x="3" y="3" width="194" height="104" fill="none" stroke="rgba(37, 99, 235, 0.35)" strokeWidth="0.5" strokeDasharray="2 2" />
      <text x="8" y="12" className="text-[5.5px] font-bold fill-blue-400/70 font-mono tracking-wider">SCALE: {draw.code.includes("CHK") ? "1:500" : "1:250"}</text>
      <text x="192" y="12" textAnchor="end" className="text-[5.5px] font-bold fill-blue-400/70 font-mono tracking-wider">REF: {draw.code}</text>

      {/* Decorative Blueprint Corner Markings */}
      <path d="M 5 5 L 11 5 M 5 5 L 5 11" stroke="rgba(37, 99, 235, 0.45)" strokeWidth="0.75" />
      <path d="M 195 5 L 189 5 M 195 5 L 195 11" stroke="rgba(37, 99, 235, 0.45)" strokeWidth="0.75" />
      <path d="M 5 105 L 11 105 M 5 105 L 5 99" stroke="rgba(37, 99, 235, 0.45)" strokeWidth="0.75" />
      <path d="M 195 105 L 189 105 M 195 105 L 195 99" stroke="rgba(37, 99, 235, 0.45)" strokeWidth="0.75" />

      {/* Dynamic Content depending on category */}
      {renderBlueprintGraphics(draw)}
    </svg>
  );
}

export default function StandardDrawingsList() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from local storage on mount
  useEffect(() => {
    const savedFavs = localStorage.getItem("drawing_favorites");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        // Safe bypass
      }
    }
  }, []);

  const toggleFavorite = (id: string) => {
    let nextFavs = [...favorites];
    if (favorites.includes(id)) {
      nextFavs = nextFavs.filter((f) => f !== id);
    } else {
      nextFavs.push(id);
    }
    setFavorites(nextFavs);
    localStorage.setItem("drawing_favorites", JSON.stringify(nextFavs));
  };

  const handleDownload = (drawing: StandardDrawing) => {
    if (drawing.fileName) {
      window.open(fileUrl("المخططات القياسية", drawing.fileName), "_blank");
    } else {
      alert(`المخطط الفني: ${drawing.titleAr} غير متوفر حالياً.`);
    }
  };

  // Filter List
  const filteredDrawings = STANDARD_DRAWINGS_DATA.filter((dr) => {
    const matchesSearch =
      dr.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dr.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dr.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || dr.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Categories list
  const categoriesList = [
    { id: "All", ar: "الكل" },
    { id: "Intersections", ar: "التقاطعات" },
    { id: "U-Turns", ar: "فتحات الدوران" },
    { id: "ServiceStations", ar: "محطات الخدمة" },
    { id: "Checkpoints", ar: "نقاط التفتيش" },
    { id: "SignsDetails", ar: "لوحات إشارات الطرق" },
    { id: "Construction", ar: "تفاصيل الإنشاء" },
    { id: "Closures", ar: "الاغلاقات" },
    { id: "RumbleStrips", ar: "المطبات الاهتزازية" }
  ];

  return (
    <div id="standard-drawings-module" className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm font-sans">
        <h2 className="text-xl font-bold text-brand-primary mb-2">مكتبة المخططات والمواصفات القياسية (Standard Drawings)</h2>
        <p className="text-brand-muted text-sm leading-relaxed mb-6">
          دليل الرسم الفني للمقاطع والتفاصيل الإنشائية العيارية المعتمدة لاستلام أعمال السلامة على الطرق وهندسة المرور بالميدان. يدعم استخراج ملفات التصاميم الهندسية.
        </p>

        {/* Filters */}
        <div className="space-y-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
            <input
              type="text"
              placeholder="البحث بالرمز الكودي (مثال: STD-RMB) أو العنوان المروري..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-lg pl-3 pr-10 py-2.5 bg-slate-50 focus:ring-1 focus:ring-brand-primary outline-none"
            />
          </div>

          {/* Categorization */}
          <div className="flex gap-1.5 flex-wrap items-center">
            <span className="text-xs text-gray-400 font-bold ml-1 shrink-0">الفئات الفنية للرسم:</span>
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-1.5 px-3 rounded text-[11px] font-bold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-brand-primary text-white"
                    : "bg-slate-100 text-gray-600 hover:bg-slate-200"
                }`}
              >
                {cat.ar}
              </button>
            ))}
          </div>
        </div>

        {/* Drawings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDrawings.map((draw) => {
            const isFav = favorites.includes(draw.id);
            return (
              <div
                key={draw.id}
                className="bg-slate-55/35 p-5 rounded-xl border border-gray-200 hover:border-brand-primary hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="bg-brand-secondary/15 text-brand-secondary font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                      {draw.code}
                    </span>

                    <button
                      onClick={() => toggleFavorite(draw.id)}
                      className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                      title={isFav ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isFav ? "fill-brand-danger text-brand-danger" : "text-gray-400"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Simulated drawing blueprint block */}
                  <div 
                    onClick={() => handleDownload(draw)}
                    className="h-28 bg-slate-950 rounded-lg relative group overflow-hidden cursor-pointer border border-slate-800 transition-colors"
                  >
                    {renderBlueprintThumbnail(draw)}
                    <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white">
                      انقر لعرض وتحميل المخطط القياسي PDF
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-xs">
                    {draw.titleAr}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-mono font-medium">
                    {draw.titleEn}
                  </p>
                </div>

                {/* Footer action */}
                <div className="pt-3 mt-3 border-t border-dashed border-slate-200 flex items-center justify-between">
                  <span className="text-[9px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">
                    {draw.categoryAr}
                  </span>

                  <button
                    onClick={() => handleDownload(draw)}
                    className="flex items-center gap-1 py-1 px-2.5 text-[10px] font-bold rounded bg-brand-primary text-white hover:bg-opacity-90 transition-all"
                  >
                    <Download className="w-3 h-3" />
                    <span>فتح وتحميل PDF</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredDrawings.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 text-xs">
              لا توجد مخططات قياسية تطابق هذا البحث أو الفئة المحددة.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
