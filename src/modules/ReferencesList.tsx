/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { REFERENCES_DATA, fileUrl } from "../data/lookupTables";
import { ReferenceItem } from "../types";
import { Search, BookOpen, ExternalLink, Copy, Check, FileText } from "lucide-react";

// Helper component to draw high-fidelity, visually distinct cover pages
function BookCover({ id, code, nameAr, nameEn }: { id: string; code: string; nameAr: string; nameEn: string }) {
  const isSrc = id.startsWith("src");

  // Custom text for the white specification plate at the bottom of uniform Saudi covers
  let subText1 = "";
  let subText2 = "";
  let subText3 = "";

  if (isSrc) {
    if (id === "src301") {
      subText1 = "تصميم الطرق والجسور والأنفاق";
      subText2 = "كود الطرق السعودي ٣٠١ - التصميم الهندسي للطرق";
      subText3 = "";
    } else if (id === "src305") {
      subText1 = "تصميم الطرق والجسور والأنفاق";
      subText2 = "كود الطرق السعودي ٣٠٥ - تصميم مرافق الطرق ومنافعها";
      subText3 = "تصميم منطقة أعمال الطرق";
    } else if (id === "src401") {
      subText1 = "إنشاء الطرق والجسور والأنفاق";
      subText2 = "كود الطرق السعودي ٤٠١ - إنشاء الطرق";
      subText3 = "";
    } else if (id === "src602") {
      subText1 = "هندسة المرور وسلامة الطرق";
      subText2 = "كود الطرق السعودي ٦٠٢ - الدليل الموحد لأجهزة التحكم المروري";
      subText3 = "";
    } else if (id === "src603") {
      subText1 = "هندسة المرور وسلامة الطرق";
      subText2 = "كود الطرق السعودي ٦٠٣ - سلامة الطرق";
      subText3 = "";
    } else {
      subText1 = "تصميم وأمان شبكات الطرق";
      subText2 = `كود الطرق السعودي ${code}`;
      subText3 = nameAr;
    }
  }

  // Draw AASHTO Green Book Design (Extremely Accurate 2018 7th Edition Cover)
  if (id === "aashto_green") {
    return (
      <div className="w-[115px] h-[162px] bg-white rounded-md shadow-md relative overflow-hidden flex flex-col justify-between text-slate-900 border border-slate-300 select-none shrink-0 transition-transform duration-300 hover:scale-[1.02] border-r-2 border-r-black/10">
        {/* Book Spine Fold Shadows */}
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-black/5 z-25" />
        <div className="absolute top-0 bottom-0 left-[4px] w-[0.5px] bg-black/10 z-25" />

        {/* 1. Header Row: Very dark green bar with AASHTO logo */}
        <div className="h-[14px] bg-[#0c2e1d] flex items-center justify-between px-1.5 border-b border-[#03150d] shrink-0 z-10">
          {/* Logo Representation */}
          <div className="flex flex-col items-start leading-none gap-[0.5px]">
            <span className="text-[2px] text-white font-mono opacity-65 tracking-widest">AMERICAN ASSOCIATION</span>
            <span className="text-[2.2px] text-white font-mono opacity-65 tracking-widest -mt-[1px]">OF STATE HIGHWAY AND</span>
            <span className="text-[2.2px] text-white font-mono opacity-65 tracking-widest -mt-[1px]">TRANSPORTATION OFFICIALS</span>
          </div>
          {/* AASHTO trademark underline logo */}
          <div className="flex flex-col items-center">
            <span className="text-[4.5px] font-mono tracking-tighter text-white font-extrabold">AASHTO</span>
            <div className="w-6 h-[0.5px] bg-white opacity-80" />
          </div>
        </div>

        {/* 2. Content Group: Title, Green horizontal bar */}
        <div className="flex flex-col items-center pt-2 px-1 z-10 bg-white">
          <p className="text-[5.5px] text-[#4d7e48] font-serif italic font-extrabold leading-none tracking-tight">
            A Policy on
          </p>
          <p className="text-[7.8px] font-black text-[#014022] leading-none tracking-tight mt-[2.5px] text-center uppercase">
            Geometric Design of
          </p>
          <p className="text-[7.8px] font-black text-[#014022] leading-none tracking-tight mt-[1px] text-center uppercase">
            Highways and Streets
          </p>
        </div>

        {/* 3. Horizontal Dark Green Accent Banner with Date */}
        <div className="h-[18px] bg-gradient-to-r from-[#031c10] via-[#093520] to-[#031c10] flex items-center justify-between px-1.5 shrink-0 z-10 relative overflow-hidden">
          {/* Faint side grid stripes */}
          <div className="absolute left-0 inset-y-0 w-6 opacity-30 flex flex-col justify-between py-[1px]">
            <div className="h-[0.5px] bg-[#4ade80] w-full" />
            <div className="h-[0.5px] bg-[#4ade80] w-[80%]" />
            <div className="h-[0.5px] bg-[#4ade80] w-[60%]" />
          </div>

          <div className="ml-auto flex flex-col items-end leading-[0.95] text-white z-10 pr-0.5">
            <span className="text-[8.5px] font-mono font-black tracking-tight">2018</span>
            <span className="text-[3.5px] text-emerald-300 font-bold scale-[0.85] origin-right">7th Edition</span>
          </div>
        </div>

        {/* 4. Graphical Photo Matrix representation */}
        <div className="flex-1 grid grid-cols-2 gap-[1.5px] p-[1.5px] bg-slate-100 z-10">
          {/* Top Left: Aerial Highway Interchange Gradient Design */}
          <div className="relative bg-gradient-to-br from-[#1e4620] to-[#60a5fa] rounded-[1px] flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white/50 opacity-75">
              <path d="M0,80 Q50,20 100,20" stroke="currentColor" strokeWidth="6" fill="none" />
              <path d="M0,30 Q50,80 100,50" stroke="currentColor" strokeWidth="4" fill="none" />
              <path d="M20,0 Q60,60 100,100" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" fill="none" />
            </svg>
          </div>

          {/* Top Right: Cycle Lane Visual indicator */}
          <div className="relative bg-[#1d4130] rounded-[1px] flex items-center justify-center p-[2px]">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white opacity-85">
              {/* Perspective Lane lines */}
              <line x1="15" y1="100" x2="45" y2="0" stroke="currentColor" strokeWidth="3" />
              <line x1="85" y1="100" x2="55" y2="0" stroke="currentColor" strokeWidth="3" />
              {/* Bicycle stencil icon */}
              <g stroke="currentColor" strokeWidth="6" fill="none">
                <circle cx="35" cy="65" r="10" />
                <circle cx="65" cy="65" r="10" />
                <path d="M35,65 L50,45 L65,65" />
                <path d="M50,45 L42,30 L60,30" />
              </g>
            </svg>
          </div>

          {/* Bottom Left: Roadway mountain / highway visual placeholder */}
          <div className="bg-gradient-to-tr from-stone-400 to-[#1e5835] rounded-[1px] relative flex items-center justify-center overflow-hidden">
            <div className="absolute w-full h-[6px] bg-stone-700 bottom-0" />
            <div className="absolute w-[2px] h-full bg-yellow-400 rotate-12" />
          </div>

          {/* Bottom Right: Urban roundabout/crossing blueprint representation */}
          <div className="bg-[#4a5a51]/10 rounded-[1px] border border-slate-200 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] text-emerald-800 opacity-60">
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" fill="none" />
              <circle cx="50" cy="50" r="18" fill="currentColor" opacity="0.1" />
              <rect x="0" y="44" width="100" height="12" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <rect x="44" y="0" width="12" height="100" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
        </div>

        {/* 5. Bottom Green Panel with large watermarked logo "THE GREEN BOOK" */}
        <div className="h-[26px] bg-[#022112] flex flex-col justify-center items-center relative overflow-hidden shrink-0 rounded-b-[4px]">
          {/* Large elegant background watermark */}
          <span className="text-[10px] font-black text-[#001209] tracking-widest uppercase font-serif select-none z-0 absolute">
            THE GREEN BOOK
          </span>
          <span className="text-[4px] text-white/50 font-mono tracking-tighter uppercase z-10 absolute bottom-1 scale-95">
            AASHTO PUBLICATIONS © 2018
          </span>
        </div>
      </div>
    );
  }

  // Draw AASHTO Roadside Design Guide Design
  if (id === "aashto_rdg") {
    return (
      <div className="w-[115px] h-[162px] bg-gradient-to-b from-[#1b3d6c] to-[#25528c] rounded-md shadow-md relative overflow-hidden flex flex-col justify-between p-2 text-white border-l-2 border-yellow-500/30 select-none shrink-0 border border-blue-950">
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-black/20" />
        <div className="z-10">
          <div className="text-[6px] font-bold text-yellow-300 tracking-wider">AASHTO</div>
          <div className="text-[7.5px] font-bold text-white leading-tight mt-0.5">ROADSIDE DESIGN</div>
          <div className="text-[8.5px] font-extrabold text-yellow-400 uppercase tracking-wide leading-none">GUIDE</div>
        </div>
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 flex flex-col justify-between opacity-30">
          <div className="h-0.5 bg-slate-200 w-full" />
          <div className="h-1 bg-slate-300 w-full flex justify-around">
            <div className="w-0.5 bg-slate-300 h-full" />
            <div className="w-0.5 bg-slate-300 h-full" />
            <div className="w-0.5 bg-slate-300 h-full" />
            <div className="w-0.5 bg-slate-300 h-full" />
          </div>
          <div className="h-0.5 bg-slate-400 w-full" />
        </div>
        <div className="text-center z-10 leading-none">
          <p className="text-[5px] text-slate-200">Roadside Safety Manual</p>
        </div>
      </div>
    );
  }

  // Draw MUTCD Design (Extremely high-fidelity 11th Edition cover)
  if (id === "mutcd11") {
    return (
      <div className="w-[115px] h-[162px] bg-[#111333] rounded-md shadow-md relative overflow-hidden flex flex-col justify-between text-white select-none shrink-0 transition-transform duration-300 hover:scale-[1.02] border border-[#0d0f2b] border-r-2 border-r-black/10">
        {/* Book spine shadows */}
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-black/15 z-25" />
        <div className="absolute top-0 bottom-0 left-[4px] w-[0.5px] bg-white/10 z-25" />

        {/* The Asphalt road canvas (middle/bottom bg behind titles) */}
        <div className="absolute inset-x-0 top-[40px] bottom-[25px] bg-[#22252a] overflow-hidden z-0">
          {/* Saturated double solid yellow lines curves downwards */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-amber-500 opacity-90 scale-y-110">
            <path d="M-10,35 Q30,40 50,75 T110,105" stroke="#f59e0b" strokeWidth="11" fill="none" />
            <path d="M-10,35 Q30,40 50,75 T110,105" stroke="#22252a" strokeWidth="2.5" fill="none" />
            <path d="M-10,35 Q30,40 50,75 T110,105" stroke="#f59e0b" strokeWidth="3" fill="none" />
          </svg>
          
          {/* Subtle asphalt grit texture details */}
          <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-radial-[circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px] bg-[size:4px_4px]" />
        </div>

        {/* Curved shape to block Navy background on top */}
        <div className="absolute top-0 right-0 left-0 h-[72px] bg-[#13163a] rounded-bl-[45px] z-10 border-b border-[#0f1130] shadow-sm flex flex-col justify-between p-1.5">
          <div className="flex flex-col items-start leading-none gap-[1px] pl-1 pt-0.5">
            <span className="text-[6.2px] text-white/95 font-sans font-medium tracking-tight">Manual on</span>
            <span className="text-[8.5px] font-black text-white leading-none uppercase tracking-tight">Uniform Traffic</span>
            <span className="text-[8.5px] font-black text-white leading-none uppercase tracking-tight">Control Devices</span>
            <div className="flex items-center gap-1 mt-[1px] w-full">
              <span className="text-[4.5px] text-cyan-300 font-bold tracking-tight whitespace-nowrap">for Streets and Highways</span>
              <div className="h-[0.5px] bg-cyan-400 flex-1 opacity-70" />
            </div>
            <span className="text-[8px] font-black text-white/95 uppercase tracking-wide mt-[2px] self-end pr-1">11th Edition</span>
          </div>
        </div>

        {/* Small Elegant Polaroid/Card collage floating over Asphalt */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Left Sign Collage - Green sign & Blue sign */}
          <div className="absolute top-[8px] left-[6px] w-[20px] h-[34px] bg-white rounded-[1.5px] p-[1px] shadow-[0_1px_2.5px_rgba(0,0,0,0.35)] -rotate-[6deg] flex flex-col gap-[1px]">
            {/* Green East 88 Shield */}
            <div className="bg-[#0f623d] rounded-[1px] p-[0.5px] flex-1 flex flex-col justify-between text-center border-[0.5px] border-[#0c4b2f]">
              <span className="text-[2.5px] font-bold text-emerald-200">EAST</span>
              <div className="w-3.5 h-3.5 mx-auto rounded-full border border-white flex items-center justify-center relative scale-90">
                <span className="text-[3px] font-bold text-white leading-none">88</span>
              </div>
              <svg viewBox="0 0 10 10" className="w-[4px] h-[4px] text-white mx-auto">
                <path d="M2,8 L8,2 M5,2 L8,2 L8,5" stroke="currentColor" strokeWidth="1" fill="none" />
              </svg>
            </div>
            {/* Blue Main St Sign */}
            <div className="bg-[#1e40af] h-[8px] rounded-[0.5px] py-[0.5px] px-[1px] flex items-center justify-center border-[0.5px] border-blue-900 overflow-hidden">
              <span className="text-[1.8px] font-black tracking-tight text-white uppercase whitespace-nowrap scale-95 leading-none">Main St</span>
            </div>
          </div>

          {/* Right Top Card - Railroad symbol */}
          <div className="absolute top-[58px] right-[15px] w-[22px] h-[18px] bg-white rounded-[1px] p-[1px] shadow-[0_1px_2px_rgba(0,0,0,0.3)] rotate-[4deg]">
            <div className="w-full h-full bg-[#cbd5e1] rounded-[0.5px] flex items-center justify-center overflow-hidden relative">
              <svg viewBox="0 0 20 20" className="w-full h-full text-[#0f172a] opacity-80">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1" fill="none" />
                <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" />
                <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span className="absolute text-[2.5px] font-extrabold left-[2px] top-1 text-slate-900">R</span>
              <span className="absolute text-[2.5px] font-extrabold right-[2px] top-1 text-slate-900">R</span>
            </div>
          </div>

          {/* Middle Left Card - Pedestrian crossing warning diamond */}
          <div className="absolute top-[68px] left-[7px] w-[24px] h-[26px] bg-white rounded-[1px] p-[1px] shadow-[0_1px_2.5px_rgba(0,0,0,0.3)] -rotate-[4deg] flex flex-col justify-between gap-[0.5px]">
            <div className="bg-[#eab308] flex-1 rounded-[0.5px] flex items-center justify-center relative overflow-hidden">
              <div className="w-[12px] h-[12px] border border-black/30 bg-amber-400 rotate-45 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-[8px] h-[8px] text-black -rotate-45">
                  <circle cx="12" cy="5" r="3" fill="currentColor" />
                  <path d="M14 9h-4l-1 5 2 1 1-3 1 3 2-1z" fill="currentColor" />
                  <path d="M10 15l-1 6h2l1-4 1 4h2l-1-6" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div className="bg-amber-300 h-[4px] rounded-[0.2px] flex items-center justify-center text-[1.5px] font-black text-yellow-950 scale-90">
              CROSSING
            </div>
          </div>

          {/* Center Card - Transit Red Bus */}
          <div className="absolute top-[75px] left-[32px] w-[24px] h-[28px] bg-white rounded-[1px] p-[1px] shadow-[0_1px_3px_rgba(0,0,0,0.4)] rotate-[2deg] flex flex-col justify-between">
            <div className="bg-[#ef4444] flex-1 rounded-[0.5px] flex flex-col justify-between p-[0.5px] text-white">
              <span className="text-[1.8px] text-red-100/80 font-bold uppercase tracking-widest text-center mt-[0.5px]">TRANSIT</span>
              <svg viewBox="0 0 20 20" className="w-full h-11 text-white mx-auto my-auto">
                <rect x="3" y="4" width="14" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <rect x="4" y="11" width="12" height="1.5" fill="currentColor" />
                <circle cx="6" cy="14" r="1.5" fill="currentColor" />
                <circle cx="14" cy="14" r="1.5" fill="currentColor" />
                <rect x="5" y="6" width="3" height="3" fill="currentColor" />
                <rect x="12" y="6" width="3" height="3" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* Construction/Orange Right Card */}
          <div className="absolute top-[80px] right-[4px] w-[22px] h-[26px] bg-white rounded-[1px] p-[1px] shadow-[0_1px_2.5px_rgba(0,0,0,0.3)] rotate-[6deg]">
            <div className="w-full h-full bg-[#f97316] rounded-[0.5px] flex flex-col justify-between py-[1px] px-[1.5px]">
              <span className="text-[1.8px] text-white font-extrabold uppercase leading-none mt-0.5">WORK ZONE</span>
              <div className="flex flex-col gap-[1px]">
                <div className="h-[2px] bg-white/70 rotate-[20deg]" />
                <div className="h-[2px] bg-black/40 rotate-[20deg]" />
                <div className="h-[2px] bg-white/70 rotate-[20deg]" />
              </div>
            </div>
          </div>

          {/* Bottom Center green Card- Bicycle lane route */}
          <div className="absolute bottom-[28px] left-[52px] w-[24px] h-[28px] bg-white rounded-[1px] p-[1px] shadow-[0_1px_2.5px_rgba(0,0,0,0.3)] -rotate-[3deg] flex flex-col justify-between">
            <div className="bg-[#15803d] flex-1 rounded-[0.5px] flex flex-col items-stretch p-[0.5px]">
              <svg viewBox="0 0 20 20" className="h-5 text-white/95 mx-auto opacity-95">
                <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1" fill="none" />
                <circle cx="14" cy="12" r="3" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M6,12 L10,8 L14,12" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M10,8 L9,4 L12,4" stroke="currentColor" strokeWidth="1.2" fill="none" />
              </svg>
              <div className="bg-white/95 text-[#15803d] text-[2.8px] font-black text-center rounded-[0.2px] mt-0.5 leading-none py-[0.5px]">
                BIKE ROUTE
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner with DOT White Seal Logo & Date */}
        <div className="h-[25px] bg-[#13163a] flex items-center justify-between px-1.5 shrink-0 z-10 border-t border-[#0e102d] rounded-b-[4px]">
          <div className="flex items-center gap-[1.5px]">
            <svg viewBox="0 0 100 100" className="w-[11px] h-[11px] text-white shrink-0">
              <path d="M50,10 A40,40 0 0,1 90,50 A40,40 0 0,1 50,90 A40,40 0 0,1 10,50 A40,40 0 0,1 50,10 Z M50,22 C34.5,22 22,34.5 22,50 C22,65.5 34.5,78 50,78 C65.5,78 78,65.5 78,50" stroke="currentColor" strokeWidth="7.5" fill="none" />
            </svg>
            <div className="flex flex-col items-start leading-[1] scale-90 -ml-[1px]">
              <span className="text-[2px] text-white font-mono opacity-80 uppercase leading-[1.2]">U.S. Department of Transportation</span>
              <span className="text-[2.2px] text-white font-bold leading-[1.2] tracking-tighter uppercase">Federal Highway Administration</span>
            </div>
          </div>

          <div className="text-right flex flex-col items-end leading-[1]">
            <span className="text-[5.5px] font-mono font-extrabold text-white">Dec 2023</span>
            <span className="text-[2.5px] text-white/50 tracking-tighter uppercase scale-90 -mr-[1px] whitespace-nowrap">Official Manual</span>
          </div>
        </div>
      </div>
    );
  }

  // Dynamic colors and layout variants depending on standard Saudi code (301 to be green)
  let bgClassColor = "bg-[#c5b128]";
  let borderClassColor = "border-[#b29e20]";
  let textPlateColor = "text-[#c5b128]";
  let pathRouteColor = "#c5b128";
  let bgLinesColor = "#fef08a";
  let editionYear = "٢٠٢٣";

  if (id === "src301") {
    bgClassColor = "bg-[#1E4631]"; // Accurate dark forest green
    borderClassColor = "border-[#153223]";
    textPlateColor = "text-[#1E4631]";
    pathRouteColor = "#1E4631";
    bgLinesColor = "#86efac"; // Mint green faint lines
    editionYear = "٢٠٢٤"; // As shown in 301 cover image
  } else if (id === "src401") {
    bgClassColor = "bg-[#853919]"; // Beautiful warm terracotta brown
    borderClassColor = "border-[#713014]";
    textPlateColor = "text-[#853919]";
    pathRouteColor = "#853919";
    bgLinesColor = "#fdba74"; // Warm sand/orange faint lines
    editionYear = "٢٠٢٤"; // As shown in 401 cover image
  } else if (id === "src602" || id === "src603") {
    bgClassColor = "bg-[#f2a124]"; // Beautiful golden orange
    borderClassColor = "border-[#d98c19]";
    textPlateColor = "text-[#f2a124]";
    pathRouteColor = "#f2a124";
    bgLinesColor = "#fef08a"; // Mint/yellow faint lines
    editionYear = "٢٠٢٤"; // As shown in 602 and 603 cover images
  }

  // Draw Extremely Accurate Uniform Saudi Road Code covers
  return (
    <div className={`w-[115px] h-[162px] ${bgClassColor} rounded-md shadow-md relative overflow-hidden flex flex-col justify-between p-2 text-white select-none shrink-0 border ${borderClassColor} transition-transform duration-300 hover:scale-[1.02] border-r-2 border-r-black/10`}>
      {/* Absolute background: Winding design highway line and faint grid lines pattern */}
      <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 150" fill="none">
          {/* Faint road structure grid */}
          <line x1="10" y1="0" x2="80" y2="150" stroke={bgLinesColor} strokeWidth="0.5" />
          <line x1="30" y1="0" x2="100" y2="130" stroke={bgLinesColor} strokeWidth="0.5" />
          <line x1="0" y1="30" x2="100" y2="100" stroke={bgLinesColor} strokeWidth="0.5" />
          <line x1="0" y1="90" x2="80" y2="150" stroke={bgLinesColor} strokeWidth="0.5" />
          
          {/* Main Highway Route (As depicted on cover) */}
          <path d="M45,0 C45,50 90,100 90,150" stroke={bgLinesColor} strokeWidth="12" strokeLinecap="round" />
          <path d="M45,0 C45,50 90,100 90,150" stroke={pathRouteColor} strokeWidth="10" strokeLinecap="round" />
          <path d="M45,0 C45,50 90,100 90,150" stroke={bgLinesColor} strokeWidth="1" strokeDasharray="3,3" strokeLinecap="round" />
        </svg>
      </div>

      {/* Hardcover spine effect left */}
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-black/10 z-25" />
      <div className="absolute top-0 bottom-0 left-[4px] w-[1px] bg-white/20 z-25" />

      {/* Header section (Map Contour barcode on Left & Roads General Authority on Right) */}
      <div className="flex justify-between items-start z-10 w-full">
        {/* Left Side: Saudi Map with Striped Columns Map Contour */}
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 80 50" className="w-[28px] h-[19px] text-white">
            <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="10" y1="20" x2="10" y2="28" opacity="0.4" />
              <line x1="15" y1="18" x2="15" y2="34" />
              <line x1="20" y1="16" x2="20" y2="38" />
              <line x1="25" y1="14" x2="25" y2="42" />
              <line x1="30" y1="12" x2="30" y2="44" />
              <line x1="35" y1="13" x2="35" y2="46" />
              <line x1="40" y1="15" x2="40" y2="45" />
              <line x1="45" y1="17" x2="45" y2="43" />
              <line x1="50" y1="19" x2="50" y2="40" />
              <line x1="55" y1="21" x2="55" y2="36" />
              <line x1="60" y1="23" x2="60" y2="32" opacity="0.6" />
            </g>
          </svg>
          <span className="text-[3.2px] text-white font-bold leading-none tracking-tighter mt-[1px]">كود الطرق السعودي</span>
          <span className="text-[2.2px] text-white/80 font-mono tracking-tighter scale-90 leading-none">SAUDI HIGHWAY CODE</span>
        </div>

        {/* Right Side: Roads General Authority Official palm emblem */}
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 100 100" className="w-[14px] h-[14px] text-white">
            {/* Elegant Palm tree trunk */}
            <path d="M 50 62 L 50 25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M 50 25 Q 40 20, 31 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 50 25 Q 60 20, 69 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 50 25 Q 38 31, 26 39" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 50 25 Q 62 31, 74 39" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 50 25 Q 42 12, 50 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Crossed swords symbol below trunk */}
            <path d="M 33 72 Q 50 75, 67 72" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 32 82 L 68 64" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 68 82 L 32 64" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span className="text-[2.8px] text-white font-extrabold mt-[1.5px] leading-tight text-center">الهيئة العامة للطرق</span>
          <span className="text-[2.2px] text-white/80 font-mono scale-90 leading-none uppercase">Roads Authority</span>
        </div>
      </div>

      {/* Center section: Large highly distinct Arabic main book title */}
      <div className="z-10 flex flex-col items-center justify-center -mt-1 text-center select-none">
        <h1 className="text-sm font-black text-white tracking-widest leading-none drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.25)]">
          كود الطرق
        </h1>
        <h1 className="text-sm font-black text-white tracking-widest leading-none mt-1.5 drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.25)]">
          السعودي
        </h1>
      </div>

      {/* Bottom section (Includes the white plate information panel and logos) */}
      <div className="z-10 w-full mt-auto flex flex-col gap-1 items-stretch">
        {/* The SPECIFIC White Plate Detail Container - Exact replica of Saudi Road Code layout */}
        <div className="bg-white rounded-[2px] p-1 text-center shadow-sm select-auto pointer-events-auto flex flex-col justify-center min-h-[22px]">
          <p className="text-[3.5px] font-bold text-gray-500 truncate leading-none mb-[1.5px]">
            {subText1}
          </p>
          <p className={`text-[4.5px] font-extrabold ${textPlateColor} truncate leading-none font-sans ${subText3 ? 'mb-[1.5px]' : ''}`}>
            {subText2}
          </p>
          {subText3 && (
            <p className="text-[3.5px] font-bold text-gray-800 truncate leading-none">
              {subText3}
            </p>
          )}
        </div>

        {/* Footer info (Edition info + Vision 2030 white mark) */}
        <div className="flex justify-between items-end px-0.5 mt-0.5 w-full">
          {/* Bottom Left: Edition Date */}
          <div className="text-right flex flex-col items-start leading-[1] opacity-90">
            <span className="text-[4.2px] font-mono font-bold text-white">{editionYear}</span>
            <span className="text-[3.2px] text-white/95 scale-90 -mr-[2px]">الإصدار الأول</span>
          </div>

          {/* Bottom Right: Vision 2030 minimal custom vector emblem */}
          <div className="text-left flex flex-col items-end leading-[1] opacity-90">
            <span className="text-[2.8px] text-white tracking-tighter uppercase font-mono">VISION رؤية</span>
            <div className="flex items-center gap-[1px] mt-[0.5px]">
              <span className="text-[4.5px] font-black text-white leading-none">2</span>
              {/* Gold/Sun circle inside the zero */}
              <div className="w-[4.5px] h-[4.5px] rounded-full border border-white flex items-center justify-center relative">
                <div className="w-[1.8px] h-[1.8px] rounded-full bg-white" />
              </div>
              <span className="text-[4.5px] font-black text-white leading-none">30</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function ReferencesList() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter list
  const filteredReferences = REFERENCES_DATA.filter((ref) => {
    const matchesSearch =
      ref.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.notes.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === "All" || ref.type === selectedType;

    return matchesSearch && matchesType;
  });

  // Unique types list
  const refTypes = ["All", ...Array.from(new Set(REFERENCES_DATA.map((r) => r.type)))];

  const handleCopy = (ref: ReferenceItem) => {
    const text = `مرجع هندسة المرور والنوع المعتمد:
-الاسم: ${ref.nameAr}
-الترميز الكودي: ${ref.code}
-نوع التطبيق: ${ref.type}
-تفاصيل هندسية: ${ref.notes}`;

    navigator.clipboard.writeText(text);
    setCopiedId(ref.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="references-list-module" className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-brand-primary mb-2">الدليل المرجعي والأكواد الهندسية المعتمدة</h2>
        <p className="text-brand-muted text-sm leading-relaxed mb-6">
          يعد الامتثال للأدلة والمواصفات الصادرة عن الهيئة العامة للطرق ووزارة النقل والخدمات اللوجستية شرطاً أساسياً لضمان سلامة وجودة تنفيذ التصاميم الهندسية بالمملكة العربية السعودية. يضم هذا الفهرس مرجعيات كود الطرق السعودي (SRC) والمراجع الهندسية الدولية المساندة.
        </p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
            <input
              type="text"
              placeholder="البحث في الأكواد، الأسماء الفنية، أو الملاحظات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-lg pl-3 pr-10 py-2.5 focus:ring-1 focus:ring-brand-primary outline-none bg-slate-50"
            />
          </div>

          <div className="flex gap-2 items-center overflow-x-auto pb-1">
            <span className="text-xs text-gray-400 font-bold shrink-0">تصنيف المراجع:</span>
            {refTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`py-1.5 px-3 rounded text-xs shrink-0 font-bold transition-all ${
                  selectedType === type
                    ? "bg-brand-primary text-white"
                    : "bg-slate-100 text-gray-600 hover:bg-slate-200"
                }`}
              >
                {type === "All" ? "الكل" : type}
              </button>
            ))}
          </div>
        </div>

        {/* Reference list grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReferences.map((ref) => (
            <div
              key={ref.id}
              className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col justify-between hover:border-brand-primary/50 hover:shadow-md transition-all group duration-300"
            >
              <div className="flex gap-4 items-start flex-row-reverse">
                {/* Visual Cover Page representing the actual code book appearance */}
                <BookCover id={ref.id} code={ref.code} nameAr={ref.nameAr} nameEn={ref.nameEn} />

                {/* Document Information Details */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex justify-between items-start flex-wrap gap-1.5 mb-1">
                    <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                      {ref.code}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary font-bold">
                      {ref.type}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-brand-primary transition-colors text-right leading-snug">
                    {ref.nameAr}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono text-right font-semibold">
                    {ref.nameEn}
                  </p>
                  <p className="text-xs text-gray-650 leading-relaxed text-right pt-2 border-t border-slate-100 mt-2">
                    {ref.notes}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-4 mt-4 border-t border-slate-100 w-full">
                <button
                  onClick={() => {
                    if (ref.fileName) {
                      window.open(fileUrl("المراجع", ref.fileName), "_blank");
                    } else {
                      alert(`الملف المرجعي الموثق: ${ref.code} غير متوفر حالياً.`);
                    }
                  }}
                  className="flex items-center justify-center gap-1.5 flex-1 py-1.5 bg-brand-primary text-white rounded text-xs hover:bg-opacity-90 transition-all font-semibold"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>تصفح المرجع الرسمي</span>
                </button>
              </div>
            </div>
          ))}

          {filteredReferences.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 text-xs">
              لا توجد مراجع هامة مطابقة لهذا البحث المحدد. يرجى تجربة كلمات بحث أخرى.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
