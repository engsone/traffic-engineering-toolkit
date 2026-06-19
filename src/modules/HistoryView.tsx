/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { CalculationRecord } from "../types";
import { Search, Trash2, Download, Copy, Check, Filter, Calendar, ShieldCheck, ShieldAlert, FileText } from "lucide-react";

interface Props {
  history: CalculationRecord[];
  onClearHistory: () => void;
}

export default function HistoryView({ history, onClearHistory }: Props) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "safe" | "unsafe">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter list
  const filteredHistory = history.filter((rec) => {
    const matchesSearch =
      rec.calculatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(rec.inputs).toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(rec.results).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "safe" && rec.isSafe) ||
      (statusFilter === "unsafe" && !rec.isSafe);

    return matchesSearch && matchesStatus;
  });

  const handleCopyHistory = (rec: CalculationRecord) => {
    let inputsStr = Object.entries(rec.inputs)
      .map(([key, val]) => `  - ${key}: ${val}`)
      .join("\n");
    let resultsStr = Object.entries(rec.results)
      .map(([key, val]) => `  - ${key}: ${val}`)
      .join("\n");

    const text = `تقرير حسابي عياري مرسل من داشبورد هندسة المرور:
- الحاسبة: ${rec.calculatorName}
- التاريخ: ${new Date(rec.timestamp).toLocaleString("ar-SA")}
- حالة الأمان: ${rec.isSafe ? "آمن ومطابق للكود" : "غير آمن - يتطلب مراجعة فورية"}
- المدخلات:
${inputsStr}
- المخرج الحسابي:
${resultsStr}
- توثيق مرجعي: ${rec.notes}`;

    navigator.clipboard.writeText(text);
    setCopiedId(rec.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    if (filteredHistory.length === 0) {
      alert("سجل العمليات فارغ، لا توجد سجلات لتصديرها.");
      return;
    }

    // Prepare CSV header (using UTF-8 with BOM for correct Arabic rendering in Excel)
    let csvContent = "\uFEFF";
    csvContent += "الحاسبة,التاريخ,الحالة,المدخلات,النتائج,ملاحظات المرجع\n";

    filteredHistory.forEach((rec) => {
      const inputsStr = Object.entries(rec.inputs)
        .map(([k, v]) => `${k}:${v}`)
        .join(" | ")
        .replace(/"/g, '""');
      const resultsStr = Object.entries(rec.results)
        .map(([k, v]) => `${k}:${v}`)
        .join(" | ")
        .replace(/"/g, '""');
      const name = rec.calculatorName.replace(/"/g, '""');
      const date = new Date(rec.timestamp).toLocaleString("ar-SA").replace(/"/g, '""');
      const status = rec.isSafe ? "آمن ومطابق" : "غير مطابق - مخاطر";
      const note = rec.notes.replace(/"/g, '""');

      csvContent += `"${name}","${date}","${status}","${inputsStr}","${resultsStr}","${note}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `سجل_حسابات_هندسة_المرور_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="history-view-module" className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm font-sans">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-brand-primary">سجل الحسابات التدقيقي الميداني (History System)</h2>
            <p className="text-brand-muted text-sm leading-relaxed mt-1">
              أرشيف يضم تفاصيل وحسابات جميع الحالات التي يتم تشغيلها وإدخالها على الحاسبات الميدانية لتيسير عمليات التسليم والمطابقة من قبل مهندسي وزارة الطرق والأمانة. يتم الحفظ بمخازن المحملة لمتصفحك الفرعي.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 py-2 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs transition-all font-semibold shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>تصدير السجل (CSV Excel)</span>
            </button>

            <button
              onClick={() => {
                if (confirm("هل أنت متأكد من رغبتك في مسح وأرشفة جميع السجلات الحسابية نهائياً من الـ LocalStorage؟")) {
                  onClearHistory();
                }
              }}
              className="flex items-center gap-1.5 py-2 px-4 border border-red-200 text-brand-danger bg-red-50/50 hover:bg-red-50 rounded-lg text-xs transition-colors font-semibold"
            >
              <Trash2 className="w-4 h-4" />
              <span>مسح كامل السجل</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
            <input
              type="text"
              placeholder="البحث بالاسم الفني، القيم المدرجة، أو النتائج الحاصلة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-lg pl-3 pr-10 py-2.5 bg-slate-50 focus:ring-1 focus:ring-brand-primary outline-none"
            />
          </div>

          <div className="flex gap-2 items-center shrink-0">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400 font-bold ml-1">تصفية مؤشر السلامة:</span>
            
            {[
              { id: "all", label: "الكل" },
              { id: "safe", label: "آمن ومطابق" },
              { id: "unsafe", label: "مخاطر تطلب مراجعة" }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setStatusFilter(item.id as any)}
                className={`py-1.5 px-3 rounded text-xs font-bold transition-all ${
                  statusFilter === item.id
                    ? "bg-brand-primary text-white"
                    : "bg-slate-100 text-gray-600 hover:bg-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* List of Calculation records */}
        <div className="space-y-4">
          {filteredHistory.map((rec) => (
            <div
              key={rec.id}
              className={`p-5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-sm transition-shadow ${
                rec.isSafe 
                  ? "bg-brand-success/5 border-brand-success/20" 
                  : "bg-brand-danger/5 border-brand-danger/20"
              }`}
            >
              <div className="space-y-4 flex-1">
                {/* Header info */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shrink-0 ${
                    rec.isSafe 
                      ? "bg-brand-success/15 text-brand-success" 
                      : "bg-brand-danger/15 text-brand-danger"
                  }`}>
                    {rec.isSafe ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>معيار سليم</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>تحذيرات الكود</span>
                      </>
                    )}
                  </span>

                  <h3 className="font-bold text-gray-900 text-sm">{rec.calculatorName}</h3>
                  
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mr-auto md:mr-0 font-mono font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(rec.timestamp).toLocaleString("ar-SA")}</span>
                  </div>
                </div>

                {/* Grid Inputs & Results */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Inputs */}
                  <div className="bg-white/80 p-3 rounded-lg border border-slate-100">
                    <h4 className="text-[10px] font-bold text-gray-500 mb-1.5">المدخلات الفنية المسجلة:</h4>
                    <div className="grid grid-cols-2 gap-2 text-right">
                      {Object.entries(rec.inputs).map(([key, val]) => (
                        <div key={key} className="text-xs">
                          <span className="text-gray-400 block text-[9px]">{key}</span>
                          <span className="font-mono font-bold text-slate-800">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Results */}
                  <div className="bg-white/80 p-3 rounded-lg border border-slate-100">
                    <h4 className="text-[10px] font-bold text-gray-500 mb-1.5">مخرجات الحسبة النهائية:</h4>
                    <div className="grid grid-cols-2 gap-2 text-right">
                      {Object.entries(rec.results).map(([key, val]) => (
                        <div key={key} className="text-xs">
                          <span className="text-gray-400 block text-[9px]">{key}</span>
                          <span className="font-mono font-bold text-brand-primary text-sm">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes footer */}
                <p className="text-[11px] text-gray-500 leading-normal flex items-center gap-1 bg-slate-50 p-2 rounded">
                  <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span><strong>توثيق الكود:</strong> {rec.notes}</span>
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex md:flex-col gap-2 w-full md:w-auto shrink-0 justify-end">
                <button
                  onClick={() => handleCopyHistory(rec)}
                  className="flex items-center justify-center gap-1.5 py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs transition-colors border border-gray-200 flex-1 md:flex-initial"
                >
                  {copiedId === rec.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-brand-success" />
                      <span>تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ السجل</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}

          {filteredHistory.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-xs border border-dashed border-gray-200 rounded-xl bg-slate-50/50">
              سجل حساباتك الميدانية الخاص بفريق تبوك فارغ حالياً. قم بتشغيل وحفظ أي عملية فنية لتظهر هنا.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
