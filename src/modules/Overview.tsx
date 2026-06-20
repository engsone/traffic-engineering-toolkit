/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CalculationRecord } from "../types";
import { 
  Compass, 
  MapPin, 
  Search, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowLeftRight, 
  ChevronLeft, 
  Flame, 
  Activity, 
  FileText 
} from "lucide-react";

interface Props {
  onNavigateToModule: (moduleId: string) => void;
  lastRecord: CalculationRecord | null;
  historyLength: number;
}

export default function Overview({ onNavigateToModule, lastRecord, historyLength }: Props) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const modulesList = [
    { id: "taper", title: "المنطقة الانتقالية / Taper Length", desc: "بناء وفترات الاندماج بالتحويلات المرورية المؤقتة بمواقع العمل.", category: "مواقع العمل" },
    { id: "markings", title: "الدهانات والعلامات الأرضية", desc: "تقدير كميات وسماكة الدهانات الباردة والحرارية بمواصفات SHC 602.", category: "العلامات" },
    { id: "rumble", title: "المطبات الاهتزازية / Rumble Strips", desc: "حساب خطوط التنبيه الطولية لليقظة ومنع الخروج المفاجئ عن المسار.", category: "السلامة المرورية" },
    { id: "divided_barrier", title: "الحواجز المعدنية — طرق مزدوجة", desc: "تحديد أطوال الحماية الـ Length of Need على الطرق السريعة.", category: "حواجز الطريق" },
    { id: "undivided_barrier", title: "الحواجز المعدنية — طريق مفرد", desc: "التظليل المتماثل للوجهين وحسبة البعد عن الخطوط الصفراء والوسطى.", category: "حواجز الطريق" },
    { id: "clear_zone", title: "الخلوص الجانبي / Clear Zone", desc: "تقدير الارتدادات ومنع الارتطام بالأعمدة والصخور الجانبية.", category: "حواجز الطريق" },
    { id: "curves", title: "المنحنيات الأفقية والسرعة", desc: "الأمان ضد الانزلاق الطارد ونصف القطر الأدنى بالكود 301.", category: "الهندسة الجيومترية" },
    { id: "vertical", title: "المنحنيات الرأسية والأطوال K", desc: "حسبة موازنة الميل ومسافات الرؤية عند القمم والوديان.", category: "الهندسة الجيومترية" },
    { id: "ssd", title: "مسافة الرؤية للتوقف / SSD", desc: "حسبة أفق الكبح والفرملة ومسافات رد الفعل الآمنة.", category: "الهندسة الجيومترية" },
    { id: "psd", title: "مسافة الرؤية للتجاوز / PSD", desc: "منع التخطي الخطر بالطرق المفردة وتحديد العلامات الصفراء المتصلة.", category: "الهندسة الجيومترية" },
    { id: "speed_change", title: "حارات التسارع والتباطؤ", desc: "أبعاد حارات الاندماج والفرز وتعديل الميول الجبلية.", category: "مداخل ومخارج" },
    { id: "drawings", title: "المخططات القياسية / AutoCAD", desc: "مكتبة الرسومات القياسية لفتحات الدوران والتقاطعات الرباعية.", category: "المخططات" },
    { id: "attachments", title: "الملحقات والأدلة الفنية", desc: "مجموعة المذكرات والأدلة الميدانية المرفقة المعدة للتشغيل.", category: "المراجع" },
  ];

  const filteredModules = modulesList.filter((m) => {
    return (
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div id="overview-module" className="space-y-6">
      
      {/* Prime Welcome Metadata Banner */}
      <div className="bg-gradient-to-r from-brand-primary to-slate-800 text-white rounded-2xl p-6 shadow-sm border border-slate-700/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        {/* Background visual detail */}
        <div className="absolute left-[-20px] bottom-[-20px] opacity-10 font-mono text-9xl font-black select-none pointer-events-none">
          MOT
        </div>

        <div className="space-y-2 z-10 text-right">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-200">المرجع الهندسي الميداني الشامل</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">منصة مهندس السلامة المرورية</h1>
          <p className="text-xs text-slate-100 leading-relaxed max-w-xl font-medium">
            تطبيق الحسابات الفنية وتدقيق إجراءات الأمان الجيومترية واللوحات التحذيرية وأطوال حواجز الطرق وفقاً للكود السعودي العام ومعدلات التصميم لهيئة الطرق.
          </p>
        </div>

        {/* Engineer Profile Card */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl z-10 shrink-0 text-right min-w-[220px]">
          <div className="text-[10px] text-brand-warning font-bold">مالك الترخيص الفني والتطوير:</div>
          <div className="font-extrabold text-white text-sm mt-0.5">م. حسان عبد الله الحلبي</div>
          <div className="text-[11px] text-slate-200 mt-1 font-sans">كبير مهندسين فحص سلامة الطرق - منطقة تبوك</div>
          
          <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-white/10 text-[10px] text-slate-100">
            <MapPin className="w-3.5 h-3.5 text-brand-warning" />
            <span>يوروقروب للاستشارات الهندسية</span>
          </div>
        </div>
      </div>

      {/* Grid of Key Alert and quick stats summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        
        {/* Statistics and audit count */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between text-right">
          <div>
            <span className="text-[10px] text-gray-400 font-bold block">إجمالي محاولات التدقيق الميدانية</span>
            <span className="text-3xl font-mono font-black text-brand-primary mt-1 block">
              {historyLength} <span className="text-xs font-sans font-semibold text-gray-400">سجل</span>
            </span>
          </div>
          <div className="p-3 bg-brand-primary/10 rounded-full text-brand-primary">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Safety Indicator alert message */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm col-span-2 flex gap-3 text-right">
          <div className="p-3 bg-rose-50 rounded-lg text-brand-danger shrink-0 h-12 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800">تنويه هندسي هام بمستند العمل:</span>
            <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
              تم رصد احتمال حدوث خطأ مطبعي في جداول أطوال منطقة الانتقال الـ <span className="font-sans font-black text-rose-900">Taper Length</span> بالنسخة الورقية للمجموعة للسرعة 55 كم/س عند العرض 3.0م، تم تصويبه واعتماد المعادلات الرياضية الصافية محلياً.
            </p>
          </div>
        </div>
      </div>

      {/* Internal Finder bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm text-right">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="ابحث عن أداة محاسبة، مثل: المنحنيات، دهانات، حواجز، خلوص، SSD..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs border border-gray-350 rounded-lg pl-3 pr-10 py-2.5 focus:ring-1 focus:ring-brand-primary outline-none bg-slate-50"
          />
        </div>
      </div>

      {/* Main Grid tools section */}
      <div>
        <h3 className="font-extrabold text-slate-800 text-sm mb-4 border-r-4 border-brand-primary pr-2">أدوات هندسة المرور الميدانية الشاملة:</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigateToModule(item.id)}
              className="bg-white text-right p-5 rounded-xl border border-gray-200 hover:border-brand-primary hover:shadow-md transition-all group focus:outline-none flex flex-col justify-between h-[155px]"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-slate-100 text-slate-700 text-[9px] font-extrabold px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  
                  <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-brand-primary transition-colors transform group-hover:-translate-x-1" />
                </div>

                <h4 className="font-bold text-gray-900 text-xs mt-1 group-hover:text-brand-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-500 leading-relaxed mt-1.5 line-clamp-2">
                  {item.desc}
                </p>
              </div>

              <div className="text-[10px] text-brand-primary font-bold pt-2 border-t border-dashed border-slate-100 w-full">
                الدخول للحاسبة والجدول ←
              </div>
            </button>
          ))}

          {filteredModules.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-450 text-xs">
              لا توجد أدوات هندسية متوفرة تطابق خيار البحث المدخل.
            </div>
          )}
        </div>
      </div>

      {/* Last Audit record info block */}
      {lastRecord && (
        <div className="bg-brand-success/5 border border-brand-success/20 p-5 rounded-xl text-right">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-brand-success" />
            <h4 className="font-bold text-emerald-950 text-xs">آخر عملية احتساب ميدانية مسجلة:</h4>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-sans">
            <div>
              <span className="text-[10px] text-gray-455">نوع الأداة:</span>
              <strong className="block text-slate-900 font-bold mt-0.5">{lastRecord.calculatorName}</strong>
            </div>

            <div>
              <span className="text-[10px] text-gray-455">النتيجة الحاصلة:</span>
              <strong className="block text-brand-primary mt-0.5 font-mono">
                {Object.entries(lastRecord.results)[0]?.[1] || "تم الحفظ"} {Object.values(lastRecord.units)[0] || ""}
              </strong>
            </div>

            <div>
              <span className="text-[10px] text-gray-455">التاريخ والوقت:</span>
              <span className="block text-gray-600 mt-0.5 font-mono">{new Date(lastRecord.timestamp).toLocaleTimeString("ar-SA")}</span>
            </div>

            <button
              onClick={() => onNavigateToModule("history")}
              className="text-[10px] text-brand-primary font-bold hover:underline"
            >
              عرض التفاصيل الكاملة بالمسند ←
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
