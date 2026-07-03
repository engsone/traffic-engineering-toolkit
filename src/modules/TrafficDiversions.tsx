/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  WORK_ZONE_STRUCTURE,
  ADVANCE_WARNING_ITEMS,
  SIGN_COLORS_MATERIALS,
  SIGN_DIMENSIONS_BY_SPEED,
  SIGN_INSTALLATION_RULES,
  WORK_ZONE_SIGNS_CATALOG,
  TAPER_DEVICE_SPACING,
  CURVE_DEVICE_SPACING,
  TAPER_MIN_SPACING,
  BUFFER_ZONE_TABLE,
  TEMP_SPEED_LIMITS,
  DETOUR_DESIGN_ELEMENTS,
  SEPARATION_DEVICES,
  FLAGGER_STATIONS,
  HAND_SIGNAL_DEVICES,
  TMA_SPECS,
  NIGHT_LIGHTING_DEVICES,
  WORKZONE_PAVEMENT_MARKINGS,
  DELINEATOR_SPECS,
  MAINTENANCE_ITEMS,
  SELECTION_MATRIX,
  SITE_CHECKLIST,
} from "../data/lookupTables";
import { CalculationRecord } from "../types";
import {
  Layers,
  AlertTriangle,
  Signpost,
  Users,
  Truck,
  Lightbulb,
  Paintbrush,
  Wrench,
  ListChecks,
  ArrowRightLeft,
  ShieldAlert,
  MapPin,
  Copy,
  Save,
  RotateCcw,
  Check,
  ExternalLink,
  Route,
  Ruler,
} from "lucide-react";

interface Props {
  onSaveCalculation: (calc: Omit<CalculationRecord, "id" | "timestamp">) => void;
  onNavigateToModule?: (moduleId: string) => void;
}

const TABS = [
  { id: "overview", label: "البنية العامة", icon: Layers },
  { id: "signs", label: "اللوحات والألوان", icon: Signpost },
  { id: "taper", label: "الاستدقاق والتباعد", icon: Route },
  { id: "buffer", label: "المنطقة العازلة", icon: ShieldAlert },
  { id: "speed", label: "حدود السرعة المؤقتة", icon: AlertTriangle },
  { id: "detour", label: "تصميم التحويلة", icon: ArrowRightLeft },
  { id: "devices", label: "أجهزة الفصل", icon: MapPin },
  { id: "flaggers", label: "حاملو الأعلام", icon: Users },
  { id: "tma", label: "مخففات الصدمات TMA", icon: Truck },
  { id: "lighting", label: "الإنارة الليلية", icon: Lightbulb },
  { id: "markings", label: "العلامات الأرضية", icon: Paintbrush },
  { id: "maintenance", label: "الصيانة والإزالة", icon: Wrench },
  { id: "matrix", label: "مصفوفة الاختيار", icon: ListChecks },
  { id: "checklist", label: "قائمة التحقق", icon: Check },
];

// Small reusable table renderer
function SimpleTable({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-center border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {headers.map((h, i) => (
              <th key={i} className={`p-2.5 font-semibold text-gray-500 ${i === 0 ? "text-right" : ""}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-slate-50 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className={`p-2.5 text-gray-800 ${ci === 0 ? "text-right font-semibold text-gray-700" : ""}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SourceTag({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] text-slate-400 font-mono block mt-1">{children}</span>;
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
      <div>
        <h3 className="font-bold text-gray-800 text-base">{title}</h3>
        {subtitle && <p className="text-brand-muted text-xs leading-relaxed mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export default function TrafficDiversions({ onSaveCalculation, onNavigateToModule }: Props) {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // --- Buffer zone calculator state ---
  const [bufferSpeed, setBufferSpeed] = useState<number>(80);
  const [bufferSaved, setBufferSaved] = useState<boolean>(false);
  const [bufferCopied, setBufferCopied] = useState<boolean>(false);
  const bufferRow = BUFFER_ZONE_TABLE.find((r) => r.speed === bufferSpeed) || BUFFER_ZONE_TABLE[2];

  const handleBufferCopy = () => {
    const text = `حساب المنطقة العازلة:\n- حد السرعة الدائم = ${bufferSpeed} كم/ساعة\n- المسافة المفضلة = ${bufferRow.preferred} م\n- الحد الأدنى المطلق = ${bufferRow.minimum} م\n- مرجع: كود الطرق السعودي 305، جدول 9-2`;
    navigator.clipboard.writeText(text);
    setBufferCopied(true);
    setTimeout(() => setBufferCopied(false), 2000);
  };

  const handleBufferSave = () => {
    onSaveCalculation({
      calculatorId: "buffer_zone",
      calculatorName: "طول المنطقة العازلة (Buffer Space)",
      inputs: { "حد السرعة الدائم كم/س": bufferSpeed },
      results: { "المسافة المفضلة م": bufferRow.preferred, "الحد الأدنى المطلق م": bufferRow.minimum },
      units: { "المسافة المفضلة م": "m", "الحد الأدنى المطلق م": "m" },
      notes: `حساب طول المنطقة العازلة عند حد سرعة ${bufferSpeed} كم/س. المرجع: كود الطرق السعودي 305، جدول 9-2، بند 9-6.`,
      isSafe: true,
    });
    setBufferSaved(true);
    setTimeout(() => setBufferSaved(false), 2000);
  };

  // --- TMA calculator state ---
  const [tmaSpeed, setTmaSpeed] = useState<number>(100);
  const [tmaSaved, setTmaSaved] = useState<boolean>(false);
  const needsAdditionalTma = tmaSpeed >= TMA_SPECS.additionalTmaSpeedThreshold;
  const zoneMin = TMA_SPECS.safetyZoneNominal - TMA_SPECS.safetyZoneTolerance;
  const zoneMax = TMA_SPECS.safetyZoneNominal + TMA_SPECS.safetyZoneTolerance;

  const handleTmaSave = () => {
    onSaveCalculation({
      calculatorId: "tma_safety_zone",
      calculatorName: "منطقة أمان مخفف الصدمات (TMA)",
      inputs: { "حد السرعة كم/س": tmaSpeed },
      results: {
        "منطقة الأمان الأدنى م": zoneMin,
        "منطقة الأمان الأقصى م": zoneMax,
        "TMA إضافي مطلوب": needsAdditionalTma ? "نعم" : "لا",
      },
      units: { "منطقة الأمان الأدنى م": "m", "منطقة الأمان الأقصى م": "m" },
      notes: `مستوى الاختبار المطلوب: ${TMA_SPECS.testLevel}. المرجع: كود الطرق السعودي 602، بند 7-3-8؛ 305 ص PDF 54.`,
      isSafe: true,
    });
    setTmaSaved(true);
    setTimeout(() => setTmaSaved(false), 2000);
  };

  return (
    <div id="traffic-diversions-module" className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-brand-primary mb-2">التحويلات المرورية ومناطق العمل</h2>
        <p className="text-brand-muted text-sm leading-relaxed">
          مرجع شامل لتصميم إدارة المرور المؤقتة في مناطق أعمال الطرق: بنية منطقة التحكم المؤقت، اللوحات وألوانها، الاستدقاق والمنطقة العازلة، حدود السرعة المؤقتة، تصميم التحويلة، أجهزة الفصل، حاملو الأعلام، مخففات الصدمات، الإنارة الليلية، العلامات الأرضية، والصيانة. المصدر: كود الطرق السعودي 305 (تصميم منطقة أعمال الطرق) وكود الطرق السعودي 602 (الدليل الموحد لأجهزة التحكم المروري).
        </p>
        <div className="mt-3 p-3 bg-brand-warning/10 border-r-4 border-brand-warning rounded text-xs text-gray-800">
          تنبيه: هذا محتوى مرجعي مبني على قراءة الملفات المحلية للكودين 305 و602. يلزم اعتماد النسخة التنفيذية من الجهة المختصة قبل استخدامها في مشروع أو عقد فعلي.
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  isActive ? "bg-brand-primary text-white shadow-sm" : "text-gray-500 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <SectionCard title="البنية العامة لمنطقة التحكم المروري المؤقتة" subtitle="تشمل منطقة التحكم المروري المؤقت كامل مقطع الطريق من أول لافتة تحذير مسبقة حتى آخر جهاز للتحكم المروري، وتقسم غالباً إلى خمس مناطق.">
          <SimpleTable
            headers={["المنطقة", "وظيفتها", "ملاحظات رئيسة"]}
            rows={WORK_ZONE_STRUCTURE.map((z) => [z.zone, z.role, `${z.note} (${z.source})`])}
          />
        </SectionCard>
      )}

      {activeTab === "signs" && (
        <div className="space-y-6">
          <SectionCard title="منطقة التحذير المبكر واللوحات">
            <SimpleTable headers={["البند", "المتطلب"]} rows={ADVANCE_WARNING_ITEMS.map((i) => [i.item, `${i.requirement} — ${i.source}`])} />
          </SectionCard>
          <SectionCard title="ألوان اللوحات والمواد">
            <SimpleTable headers={["نوع اللوحة/الجهاز", "الألوان أو المادة"]} rows={SIGN_COLORS_MATERIALS.map((i) => [i.item, `${i.spec} — ${i.source}`])} />
          </SectionCard>
          <SectionCard title="أبعاد اللوحات حسب حد السرعة الدائم">
            <SimpleTable
              headers={["حد السرعة", "القطر/الارتفاع", "ارتفاع الحروف", "الرؤية الأمامية الدنيا"]}
              rows={SIGN_DIMENSIONS_BY_SPEED.map((r) => [r.speedRange, r.diameter, r.letterHeight, r.minVisibility])}
            />
            <SourceTag>305 ص PDF 60 جدول 4-11؛ 602 ص PDF 386 جدول 7-1</SourceTag>
          </SectionCard>
          <SectionCard title="تركيب اللوحات ومواقعها">
            <SimpleTable headers={["الموضوع", "المتطلب"]} rows={SIGN_INSTALLATION_RULES.map((i) => [i.topic, `${i.requirement} — ${i.source}`])} />
          </SectionCard>
          <SectionCard title="كتالوج اللوحات الأساسية في التحويلات ومناطق العمل">
            <SimpleTable
              headers={["الرمز", "الاسم", "الاستخدام"]}
              rows={WORK_ZONE_SIGNS_CATALOG.map((s) => [s.code, s.name, `${s.usage} — ${s.source}`])}
            />
          </SectionCard>
        </div>
      )}

      {activeTab === "taper" && (
        <div className="space-y-6">
          <div className="bg-brand-primary/5 p-5 rounded-xl border border-brand-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-gray-800 text-sm">حاسبة طول المنطقة الانتقالية (Taper Length)</h3>
              <p className="text-xs text-brand-muted mt-1">معادلة الاستدقاق W×S وجدول 4-1 الكامل متوفرة في صفحة مستقلة بالمنصة — لا تُكرر هنا لتفادي ازدواج المصدر.</p>
            </div>
            <button
              onClick={() => onNavigateToModule && onNavigateToModule("taper")}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-opacity-90 text-xs font-semibold transition-all shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>افتح حاسبة الاستدقاق الكاملة</span>
            </button>
          </div>

          <SectionCard title="تباعد أجهزة التوجيه القنواتي داخل المقطع المستدق">
            <SimpleTable
              headers={["السرعة (كم/س)", "التباعد داخل الاستدقاق (م)"]}
              rows={TAPER_DEVICE_SPACING.map((r) => [`${r.speed}${r.note ? " " + r.note : ""}`, r.spacing])}
            />
            <p className="text-[11px] text-gray-500 mt-1">يطبق التباعد على أقماع 750 ملم والألواح 250×1000 ملم والمتاريس؛ يُنصف التباعد عند استخدام أقماع 500 ملم. الحواجز المتنقلة غير مشمولة لأنها يجب أن تكون مترابطة.</p>
            <SourceTag>305 ص PDF 34 جدول 4-3</SourceTag>
          </SectionCard>

          <SectionCard title="تباعد أجهزة التوجيه على المنحنيات">
            <SimpleTable
              headers={["نصف قطر المنحنى (م)", "التباعد (م)"]}
              rows={CURVE_DEVICE_SPACING.map((r) => [r.note || r.radius, r.spacing])}
            />
            <SourceTag>305 ص PDF 34-35 جدول 4-4</SourceTag>
          </SectionCard>

          <SectionCard title="المسافة بين الاستدقاقات المتتالية">
            <SimpleTable
              headers={["السرعة الدائمة (كم/س)", "الحد الأدنى 3S", "المفضل 4S", "الأقصى 5S"]}
              rows={TAPER_MIN_SPACING.map((r) => [r.speed, `${r.min3S} م`, `${r.preferred4S} م`, `${r.max5S} م`])}
            />
            <SourceTag>305 ص PDF 33 جدول 4-2</SourceTag>
          </SectionCard>
        </div>
      )}

      {activeTab === "buffer" && (
        <SectionCard title="حاسبة المنطقة العازلة (Buffer Space)" subtitle="الغرض من هذه المنطقة ضمان ظروف حركة مرور سلسة بعد تحويل المرور من المنطقة الانتقالية وقبل الدخول لمنطقة أعمال الطرق. أجهزة التوجيه القنواتي على طول الجزء الموازي متباعدة كل 40 م.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-700">حد السرعة الدائم المعلن (كم/ساعة)</label>
              <select
                value={bufferSpeed}
                onChange={(e) => {
                  setBufferSpeed(parseInt(e.target.value));
                  setBufferSaved(false);
                }}
                className="w-full text-sm border border-gray-300 rounded-lg bg-white p-2.5 outline-none focus:ring-2 focus:ring-brand-primary"
              >
                {BUFFER_ZONE_TABLE.map((r) => (
                  <option key={r.speed} value={r.speed}>{r.speed} كم/ساعة</option>
                ))}
              </select>

              <div className="flex flex-wrap gap-2 pt-2">
                <button onClick={handleBufferCopy} className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 text-xs transition-colors">
                  {bufferCopied ? <Check className="w-3.5 h-3.5 text-brand-success" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{bufferCopied ? "تم النسخ" : "نسخ النتائج"}</span>
                </button>
                <button onClick={handleBufferSave} className="flex items-center gap-1.5 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-opacity-90 text-xs transition-all font-semibold">
                  {bufferSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{bufferSaved ? "تم الحفظ بالسجل" : "حفظ الحساب"}</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-3">
              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <div className="text-xs text-brand-muted font-bold">المسافة المفضلة إلى منطقة أعمال الطرق</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-mono font-bold text-brand-primary">{bufferRow.preferred}</span>
                  <span className="text-sm text-gray-500">متر (m)</span>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <div className="text-xs text-brand-muted font-bold">الحد الأدنى المطلق</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-mono font-bold text-slate-700">{bufferRow.minimum}</span>
                  <span className="text-sm text-gray-500">متر (m)</span>
                </div>
              </div>
            </div>
          </div>
          <SourceTag>305 ص PDF 93، جدول 9-2 وبند 9-6</SourceTag>
        </SectionCard>
      )}

      {activeTab === "speed" && (
        <SectionCard title="حدود السرعة المؤقتة داخل منطقة العمل">
          <SimpleTable
            headers={["نوع/مدة الأعمال", "حد السرعة التشغيلي", "حد السرعة المؤقت"]}
            rows={TEMP_SPEED_LIMITS.map((r) => [r.workType, r.operatingSpeed, r.tempLimit])}
          />
          <div className="text-xs text-gray-600 space-y-1 mt-2">
            <p>• عند إدخال حد سرعة مؤقت، يبدأ التخفيض داخل منطقة التحذير المسبق قبل بداية المنطقة الانتقالية.</p>
            <p>• يجب تكرار لوحات حد السرعة المؤقت داخل الأعمال كل 200 م كحد أدنى.</p>
            <p>• عادة لا يخفض السائقون سرعتهم بأكثر من 35 كم/س عن سرعتهم المعتادة.</p>
          </div>
          <SourceTag>305 ص PDF 50-51 جدول 4-10؛ ص PDF 92 بند 9-4-5</SourceTag>
        </SectionCard>
      )}

      {activeTab === "detour" && (
        <SectionCard title="تصميم الطريق المؤقت (التحويلة)" subtitle="التحويلات طرق مؤقتة تستوعب المرور حول مناطق الوصول المحظورة أو المحدودة. القرار لا يعتمد على الإغلاق فقط بل على مدة الإنشاء وتوفر الأرض وحجم المرور والتكلفة ومتطلبات الوصول.">
          <SimpleTable
            headers={["العنصر", "المتطلب/الاعتبار"]}
            rows={DETOUR_DESIGN_ELEMENTS.map((d) => [d.element, `${d.condition} — ${d.source}`])}
          />
        </SectionCard>
      )}

      {activeTab === "devices" && (
        <SectionCard title="أجهزة الفصل والحواجز والتوجيه">
          <div className="space-y-3">
            {SEPARATION_DEVICES.map((d, i) => (
              <div key={i} className={`p-4 rounded-lg border ${d.conflict ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}>
                <div className="flex items-center gap-2 mb-1">
                  {d.conflict && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />}
                  <span className="font-bold text-gray-800 text-sm">{d.device}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{d.spec}</p>
                <SourceTag>{d.source}</SourceTag>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {activeTab === "flaggers" && (
        <div className="space-y-6">
          <SectionCard title="مواقع محطات حاملي الأعلام" subtitle="يرتبط مباشرة بلوحة TW50-3 «أمامك حامل أعلام» وبالتحكم في المرور باتجاه واحد.">
            <SimpleTable headers={["الحالة/الموضع", "المتطلب"]} rows={FLAGGER_STATIONS.map((f) => [f.condition, f.requirement])} />
            <SourceTag>602 ص PDF 411، بند 7-6-3</SourceTag>
          </SectionCard>
          <SectionCard title="مواصفات أجهزة الإشارة اليدوية وحامل العلم">
            <SimpleTable headers={["العنصر", "المواصفة"]} rows={HAND_SIGNAL_DEVICES.map((h) => [h.item, h.spec])} />
            <SourceTag>602 ص PDF 411، بند 7-6-2</SourceTag>
          </SectionCard>
        </div>
      )}

      {activeTab === "tma" && (
        <SectionCard title="حاسبة منطقة أمان مخفف الصدمات (TMA)" subtitle="يقلل مخفف الصدمات المثبت على شاحنة أو مقطورة شدة الاصطدام الخلفي بمركبة أعمال ثابتة أو بطيئة الحركة.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-700">حد السرعة المعلن على الطريق (كم/ساعة)</label>
              <input
                type="number"
                step="10"
                value={tmaSpeed}
                onChange={(e) => {
                  setTmaSpeed(Math.max(0, parseInt(e.target.value) || 0));
                  setTmaSaved(false);
                }}
                className="w-full text-left font-mono border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-primary outline-none"
              />
              <button onClick={handleTmaSave} className="flex items-center gap-1.5 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-opacity-90 text-xs transition-all font-semibold">
                {tmaSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{tmaSaved ? "تم الحفظ بالسجل" : "حفظ الحساب"}</span>
              </button>

              <div className="pt-3 space-y-2 text-xs text-gray-600">
                <p><span className="font-bold">مستوى الاختبار المطلوب:</span> {TMA_SPECS.testLevel}</p>
                <p><span className="font-bold">كتلة مركبة الدعم:</span> {TMA_SPECS.supportVehicleMass}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-3">
              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <div className="text-xs text-brand-muted font-bold">منطقة الأمان المطلوبة أمام مركبة العمل</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-mono font-bold text-brand-primary">{zoneMin} – {zoneMax}</span>
                  <span className="text-sm text-gray-500">متر (m)</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">نطاق 75 ± 25 م أمام المركبة، ولا يسمح بوجود أفراد أو مركبات داخل هذه المنطقة.</p>
              </div>

              <div className={`p-4 rounded-lg border ${needsAdditionalTma ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`}>
                <div className="flex items-center gap-2">
                  {needsAdditionalTma && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />}
                  <span className={`text-xs font-bold ${needsAdditionalTma ? "text-red-700" : "text-emerald-700"}`}>
                    {needsAdditionalTma
                      ? `عند سرعة ${tmaSpeed} كم/س (≥ ${TMA_SPECS.additionalTmaSpeedThreshold}): يلزم استخدام TMA إضافي لحماية القوى العاملة.`
                      : `عند سرعة ${tmaSpeed} كم/س: لا يلزم TMA إضافي (يلزم فقط عند ≥ ${TMA_SPECS.additionalTmaSpeedThreshold} كم/س).`}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <SourceTag>602 ص PDF 402، بند 7-3-8؛ 305 ص PDF 54</SourceTag>
        </SectionCard>
      )}

      {activeTab === "lighting" && (
        <SectionCard title="العمل الليلي والإنارة والأجهزة الضوئية">
          <SimpleTable headers={["الجهاز", "المواصفات/الاستخدام"]} rows={NIGHT_LIGHTING_DEVICES.map((n) => [n.device, n.spec])} />
          <SourceTag>602 ص PDF 407-409، الجداول 7-3 و7-4</SourceTag>
        </SectionCard>
      )}

      {activeTab === "markings" && (
        <div className="space-y-6">
          <SectionCard title="العلامات الأرضية المؤقتة">
            <SimpleTable headers={["نوع الطريق", "المواصفة"]} rows={WORKZONE_PAVEMENT_MARKINGS.map((m) => [m.roadType, m.spec])} />
            <SourceTag>602 ص PDF 403-405، بند 7-4-1</SourceTag>
          </SectionCard>
          <SectionCard title="المحددات البلاستيكية (Delineators)">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200"><span className="font-bold">الرؤية: </span>{DELINEATOR_SPECS.visibility}</div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200"><span className="font-bold">المساحة العاكسة: </span>{DELINEATOR_SPECS.reflectiveArea}</div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200"><span className="font-bold">الارتفاع: </span>{DELINEATOR_SPECS.height}</div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200"><span className="font-bold">اللون: </span>{DELINEATOR_SPECS.color}</div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 sm:col-span-2"><span className="font-bold">الموضع: </span>{DELINEATOR_SPECS.placement}</div>
            </div>
            <SourceTag>602 ص PDF 405، بند 7-4-2</SourceTag>
          </SectionCard>
        </div>
      )}

      {activeTab === "maintenance" && (
        <SectionCard title="التشغيل والصيانة والإزالة">
          <SimpleTable headers={["الموضوع", "المتطلب"]} rows={MAINTENANCE_ITEMS.map((m) => [m.topic, `${m.requirement} — ${m.source}`])} />
        </SectionCard>
      )}

      {activeTab === "matrix" && (
        <SectionCard title="ملحق تطبيقي: مصفوفة اختيار سريعة">
          <SimpleTable
            headers={["الحالة الميدانية", "الأداة/الإجراء الأقرب", "القيود أو الملاحظات"]}
            rows={SELECTION_MATRIX.map((m) => [m.scenario, m.action, m.note])}
          />
        </SectionCard>
      )}

      {activeTab === "checklist" && (
        <SectionCard title="قائمة تحقق مختصرة للموقع">
          <ul className="space-y-2">
            {SITE_CHECKLIST.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-gray-700 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <Ruler className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
