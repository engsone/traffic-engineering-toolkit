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
