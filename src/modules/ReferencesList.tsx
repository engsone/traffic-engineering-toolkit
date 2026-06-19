/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { REFERENCES_DATA, fileUrl } from "../data/lookupTables";
import { ReferenceItem } from "../types";
import { Search, BookOpen, ExternalLink, Copy, Check, FileText } from "lucide-react";

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
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                    {ref.code}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary font-bold">
                    {ref.type}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 text-sm group-hover:text-brand-primary transition-colors text-right">
                  {ref.nameAr}
                </h3>
                <p className="text-xs text-slate-400 font-mono text-right font-semibold">
                  {ref.nameEn}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed text-right pt-2 border-t border-slate-50">
                  {ref.notes}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-4 mt-4 border-t border-slate-100 w-full">
                <button
                  onClick={() => handleCopy(ref)}
                  className="flex items-center justify-center gap-1.5 flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 text-gray-700 rounded text-xs transition-colors"
                >
                  {copiedId === ref.id ? (
                    <Check className="w-3.5 h-3.5 text-brand-success" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === ref.id ? "تم النسخ" : "نسخ المواصفة"}</span>
                </button>

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
