/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { STANDARD_DRAWINGS_DATA, fileUrl } from "../data/lookupTables";
import { StandardDrawing } from "../types";
import { Search, Heart, Image as ImageIcon, Download, Check, FileCode } from "lucide-react";

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
    { id: "SignsDetails", ar: "الشواخص المرورية" },
    { id: "Construction", ar: "تفاصيل الإنشاء" },
    { id: "Closures", ar: "الاغلاقات" },
    { id: "RumbleStrips", ar: "المطبات" }
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
                    className="h-28 bg-slate-900 rounded-lg flex flex-col items-center justify-center p-3 text-center border border-slate-800 relative group overflow-hidden cursor-pointer"
                  >
                    <ImageIcon className="w-8 h-8 text-slate-700 group-hover:text-brand-primary group-hover:scale-110 transition-all duration-300" />
                    <span className="font-mono text-[8px] text-slate-500 block mt-1">BLUEPRINT PREVIEW METER SCALE</span>
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white p-2">
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
