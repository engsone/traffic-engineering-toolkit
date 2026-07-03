import { ReferenceItem, StandardDrawing, AttachmentItem } from "../types";

export const FILES_BASE = "https://engsone.github.io/traffic-dashboard";
export function fileUrl(folder: string, name: string): string {
  return `${FILES_BASE}/${encodeURIComponent(folder)}/${encodeURIComponent(name)}`;
}

// Taper Length Speed & Width Reference values (كود 305 - الجدول 1-4، ص PDF 11-12)
// ملاحظة تصحيح: العمود الأخير يمثل عرض إزاحة W = 3.65م (وليس 3.75م كما كان مُسمّى سابقاً بالخطأ
// في اسم الخاصية w375 وفي عنوان العمود بالجدول أدناه بالواجهة). القيم الرقمية ذاتها صحيحة ومطابقة
// تماماً لنص كود 305 (تم التحقق حرفياً)، بما فيها التصحيح المعتمد لخطأ السرعة 55/العرض 3.0م (القيمة 58).
export const TAPER_SPEED_RECOMMENDATIONS = [
  { speed: 45, w15: 20, w25: 33, w275: 36, w30: 39, w325: 42, w35: 46, w365: 49 },
  { speed: 50, w15: 24, w25: 40, w275: 44, w30: 48, w325: 52, w35: 56, w365: 60 },
  { speed: 55, w15: 29, w25: 49, w275: 54, w30: 58, w325: 63, w35: 68, w365: 73 },
  { speed: 60, w15: 35, w25: 58, w275: 64, w30: 70, w325: 75, w35: 81, w365: 87 },
  { speed: 65, w15: 41, w25: 68, w275: 75, w30: 82, w325: 88, w35: 95, w365: 102 },
  { speed: 70, w15: 65, w25: 109, w275: 120, w30: 131, w325: 141, w35: 152, w365: 163 },
  { speed: 75, w15: 70, w25: 117, w275: 128, w30: 140, w325: 152, w35: 163, w365: 175 },
  { speed: 80, w15: 75, w25: 124, w275: 137, w30: 149, w325: 162, w35: 174, w365: 186 },
  { speed: 85, w15: 79, w25: 132, w275: 145, w30: 158, w325: 172, w35: 185, w365: 198 },
  { speed: 90, w15: 84, w25: 140, w275: 154, w30: 168, w325: 182, w35: 196, w365: 210 },
  { speed: 95, w15: 89, w25: 148, w275: 162, w30: 177, w325: 192, w35: 207, w365: 221 },
  { speed: 100, w15: 93, w25: 155, w275: 171, w30: 186, w325: 202, w35: 218, w365: 233 }
];

// Pavement Markings specifications SHC 602
export const PAVEMENT_MARKINGS_SPECS = [
  { item: "خطي المنتصف (Center Line)", widthAr: "15 سم", spaceAr: "خط متقطع (نسبة دهان:فجوة = 1:2، الجزء المدهون ثلث الطول) أو خط متصل مزدوج للحظر" },
  { item: "خطوط الحارات (Lane Lines)", widthAr: "12 سم", spaceAr: "خط متقطع (نسبة دهان:فجوة = 1:2، الجزء المدهون ثلث الطول)" },
  { item: "خطوط المنع والتحويل (No-Passing)", widthAr: "15 سم", spaceAr: "خط متصل مفرد أو مزدوج باللون الأصفر لحظر التجاوز" },
  { item: "خط الحافة الأيمن (Edge Line Left)", widthAr: "15-20 سم", spaceAr: "أصفر متصل (يفصل الكتف الأيسر أو الجزيرة الوسطى)" },
  { item: "خط الحافة الأيسر (Edge Line Right)", widthAr: "15-20 سم", spaceAr: "أبيض متصل (يفصل الكتف الأيمن الخارجي)" },
  { item: "علامات عيون القطط (RPMs)", widthAr: "تباعد قياسي", spaceAr: "تباعد 12م للمستقيمات، 6م للمنحنيات، 3م لخطوط الحظر والتقاطعات" },
  { item: "الخطوط التحذيرية الشفرون (Chevrons)", widthAr: "عرض 30-50 سم", spaceAr: "زاوية مائلة 45 درجة، تباعد مخصص حسب سرعة الطريق" }
];

// Runout Length (LR), LS and Flare Rate for roadside safety design
export const ROADSIDE_DESIGN_LOOKUP = [
  { speed: 50, lr: 50, ls: 1.2, steel_flare: 9, concrete_flare: 10 },
  { speed: 60, lr: 70, ls: 1.4, steel_flare: 9, concrete_flare: 11 },
  { speed: 70, lr: 85, ls: 1.7, steel_flare: 10, concrete_flare: 12 },
  { speed: 80, lr: 100, ls: 2.0, steel_flare: 11, concrete_flare: 13 },
  { speed: 90, lr: 115, ls: 2.3, steel_flare: 13, concrete_flare: 16 },
  { speed: 100, lr: 130, ls: 2.6, steel_flare: 14, concrete_flare: 18 },
  { speed: 110, lr: 145, ls: 3.0, steel_flare: 15, concrete_flare: 20 },
  { speed: 120, lr: 160, ls: 3.2, steel_flare: 16, concrete_flare: 22 },
  { speed: 130, lr: 175, ls: 3.5, steel_flare: 17, concrete_flare: 24 },
  { speed: 140, lr: 190, ls: 3.8, steel_flare: 18, concrete_flare: 26 }
];

// Base Clear Zone values (meters) for slope types by Speed range, simplified and engineering-safe
export const BASE_CLEAR_ZONE_TABLE = {
  slope_3_1: { "50": 3.0, "60": 4.5, "80": 6.0, "100": 7.5, "110": 8.0, "120": 9.0, "130": 10.0, "140": 11.0 },
  slope_4_1: { "50": 2.5, "60": 4.0, "80": 5.5, "100": 6.5, "110": 7.5, "120": 8.0, "130": 9.0, "140": 10.0 },
  slope_5_1: { "50": 2.0, "60": 3.5, "80": 4.5, "100": 5.5, "110": 6.5, "120": 7.0, "130": 8.0, "140": 9.0 },
  slope_6_1: { "50": 2.0, "60": 3.0, "80": 4.0, "100": 5.0, "110": 6.0, "120": 6.5, "130": 7.5, "140": 8.5 },
  slope_8_1: { "50": 1.5, "60": 2.5, "80": 3.5, "100": 4.5, "110": 5.0, "120": 6.0, "130": 7.0, "140": 7.5 },
  slope_10_1: { "50": 1.5, "60": 2.0, "80": 3.0, "100": 4.0, "110": 4.5, "120": 5.0, "130": 6.0, "140": 6.5 }
};

// Base Clear Zone based on PRT: Speed vs PRT (1.2s vs 2.5s)
export const CLEAR_ZONE_PRT_VALUES = [
  { speed: 50, prt12: 7, prt25: 11 },
  { speed: 60, prt12: 10, prt25: 16 },
  { speed: 80, prt12: 20, prt25: 27 },
  { speed: 100, prt12: 33, prt25: 42 },
  { speed: 110, prt12: 40, prt25: 50 },
  { speed: 120, prt12: 45, prt25: 60 },
  { speed: 130, prt12: 50, prt25: 65 },
  { speed: 140, prt12: 58, prt25: 75 }
];

// Min horizontal Curve Radius (R) table by Speed and Superelevation (%)
// مصدر: كود الطرق السعودي 301، الجدول (4-14) "عامل الاحتكاك الجانبي والحد الأدنى لكل من طول ونصف
// قطر المنحنى الدائري الأفقي" — ص PDF 83-84. تم التحقق من النص الأصلي حرفياً؛ الجدول السابق في
// هذا الملف كان يحوي قيماً غير مطابقة للكود وتم استبدالها بالكامل.
export const MIN_CURVE_RADIUS_TABLE: Record<number, Record<number, number>> = {
  // Speed as keys, then superelevation percentages as sub-keys
  20: { 4: 10, 6: 10, 8: 10, 10: 10, 12: 10 },
  30: { 4: 25, 6: 25, 8: 20, 10: 20, 12: 20 },
  40: { 4: 50, 6: 45, 8: 45, 10: 40, 12: 40 },
  50: { 4: 90, 6: 80, 8: 75, 10: 70, 12: 65 },
  60: { 4: 135, 6: 125, 8: 115, 10: 105, 12: 100 },
  70: { 4: 205, 6: 185, 8: 170, 10: 155, 12: 145 },
  80: { 4: 280, 6: 255, 8: 230, 10: 210, 12: 195 },
  90: { 4: 380, 6: 340, 8: 305, 10: 280, 12: 260 },
  100: { 4: 495, 6: 440, 8: 395, 10: 360, 12: 330 },
  110: { 4: 640, 6: 565, 8: 505, 10: 455, 12: 415 },
  120: { 4: 810, 6: 710, 8: 630, 10: 570, 12: 520 },
  130: { 4: 1025, 6: 890, 8: 785, 10: 705, 12: 635 },
  140: { 4: 1290, 6: 1105, 8: 965, 10: 860, 12: 775 }
};

// Side friction coefficients f by design speeds
// مصدر: كود الطرق السعودي 301، الجدول (4-14) — ص PDF 83-84 (تم التحقق من النص الأصلي).
// تصحيح: القيم عند 120/130/140 كم/س كانت مُزاحة صفاً واحداً (0.09/0.08/0.07) والصحيح 0.10/0.09/0.08.
export const SIDE_FRICTION_COEFFICIENTS: Record<number, number> = {
  20: 0.35, 30: 0.28, 40: 0.23, 50: 0.19, 60: 0.17, 70: 0.15,
  80: 0.14, 90: 0.13, 100: 0.12, 110: 0.11, 120: 0.10, 130: 0.09, 140: 0.08
};

// Passing Sight Distance (PSD) Lookup Table
export const PSD_LOOKUP_TABLE = [
  { speed: 20, method1: 140, method2: 160 },
  { speed: 30, method1: 200, method2: 220 },
  { speed: 40, method1: 270, method2: 300 },
  { speed: 50, method1: 345, method2: 390 },
  { speed: 60, method1: 410, method2: 470 },
  { speed: 70, method1: 485, method2: 550 },
  { speed: 80, method1: 540, method2: 620 },
  { speed: 90, method1: 615, method2: 700 },
  { speed: 100, method1: 670, method2: 760 },
  { speed: 110, method1: 730, method2: 830 },
  { speed: 120, method1: 800, method2: 900 }
];

// Acceleration and Deceleration lengths — Basic minimum table
// مصدر: وثيقة وزارة النقل الرسمية "Speed Change Lanes Lengths with Complementary Speed Values"
// (Document Number RD1-MOT-RSD-PDF-1812-001, Dec 2018) — تم استخراج جميع القيم من النص الأصلي بالكامل
// (12 سرعة رئيسية من 50 إلى 160 كم/س، كانت الجداول السابقة تفتقد سرعتي 70 و90 وتحوي قيماً غير مطابقة).
// المفتاح الخارجي = سرعة الطريق الرئيسي التصميمية (كم/س)، المفتاح الداخلي = سرعة منحنى الرامب أو "Stop".
export const ACCELERATION_LENGTHS: Record<number, Record<string, number>> = {
  50:  { "Stop": 60,  "20": 50,  "30": 30 },
  60:  { "Stop": 90,  "20": 60,  "30": 55,  "40": 30 },
  70:  { "Stop": 155, "20": 135, "30": 130, "40": 110, "50": 80 },
  80:  { "Stop": 225, "20": 205, "30": 200, "40": 180, "50": 150, "60": 90 },
  90:  { "Stop": 305, "20": 290, "30": 285, "40": 265, "50": 230, "60": 170, "70": 100 },
  100: { "Stop": 385, "20": 370, "30": 360, "40": 335, "50": 300, "60": 250, "70": 175, "80": 90 },
  110: { "Stop": 465, "20": 440, "30": 430, "40": 405, "50": 375, "60": 320, "70": 245, "80": 150, "90": 48 },
  120: { "Stop": 545, "20": 530, "30": 515, "40": 490, "50": 460, "60": 410, "70": 325, "80": 245, "90": 156, "100": 46 },
  130: { "Stop": 625, "20": 605, "30": 655, "40": 571, "50": 540, "60": 491, "70": 415, "80": 340, "90": 218, "100": 109, "110": 44 },
  140: { "Stop": 703, "20": 687, "30": 793, "40": 652, "50": 624, "60": 572, "70": 507, "80": 438, "90": 350, "100": 245, "110": 155, "120": 37 },
  150: { "Stop": 819, "20": 806, "30": 945, "40": 776, "50": 750, "60": 700, "70": 646, "80": 581, "90": 492, "100": 392, "110": 305, "120": 190 },
  160: { "Stop": 987, "20": 977, "30": 965, "40": 940, "50": 928, "60": 877, "70": 787, "80": 726, "90": 657, "100": 570, "110": 496, "120": 397 }
};

export const DECELERATION_LENGTHS: Record<number, Record<string, number>> = {
  50:  { "Stop": 76,  "20": 60,  "30": 56,  "40": 46 },
  60:  { "Stop": 96,  "20": 88,  "30": 76,  "40": 66,  "50": 48 },
  70:  { "Stop": 114, "20": 102, "30": 98,  "40": 86,  "50": 70,  "60": 54 },
  80:  { "Stop": 132, "20": 122, "30": 118, "40": 106, "50": 92,  "60": 80,  "70": 60 },
  90:  { "Stop": 152, "20": 142, "30": 138, "40": 128, "50": 118, "60": 106, "70": 84,  "80": 60 },
  100: { "Stop": 168, "20": 160, "30": 156, "40": 148, "50": 138, "60": 126, "70": 104, "80": 82,  "90": 56 },
  110: { "Stop": 182, "20": 176, "30": 172, "40": 164, "50": 154, "60": 140, "70": 120, "80": 100, "90": 78,  "100": 52 },
  120: { "Stop": 200, "20": 195, "30": 185, "40": 175, "50": 170, "60": 155, "70": 140, "80": 120, "90": 102, "100": 78,  "110": 58 },
  130: { "Stop": 225, "20": 220, "30": 210, "40": 201, "50": 195, "60": 180, "70": 160, "80": 141, "90": 116, "100": 92,  "110": 73,  "120": 60 },
  140: { "Stop": 248, "20": 241, "30": 234, "40": 226, "50": 217, "60": 202, "70": 178, "80": 162, "90": 144, "100": 121, "110": 103, "120": 80 },
  150: { "Stop": 271, "20": 264, "30": 258, "40": 250, "50": 241, "60": 227, "70": 204, "80": 189, "90": 172, "100": 150, "110": 132, "120": 110 },
  160: { "Stop": 309, "20": 303, "30": 297, "40": 290, "50": 282, "60": 268, "70": 248, "80": 233, "90": 216, "100": 196, "110": 180, "120": 159 }
};

// Grade Adjustment Factors lookup table
// ملاحظة هندسية: هذا جدول مبسّط بأربع فئات فقط. الوثيقة الرسمية (MOT Speed Change Lanes، ص PDF 3)
// تتضمن جدولاً أكثر تفصيلاً يفرّق بين سرعة الطريق الرئيسي وسرعة منحنى حارة الدوران بشكل منفصل
// لحارات التسارع (تتراوح فعلياً بين 1.2 و5.34 حسب الحالتين)، بينما عامل التباطؤ ثابت فعلاً لكل
// السرعات (0.9 / 1.2 / 0.8 / 1.35 — هذه القيم مطابقة تماماً للمصدر الرسمي ولم تتغير).
// قيم التسارع أدناه (acc) قيم تقريبية تمثيلية ريثما تُطوَّر الواجهة لدعم البعد الإضافي
// (سرعة منحنى حارة الدوران) بشكل كامل — هذه فجوة معروفة ومُوثّقة، وليست معالجة نهائية.
export const GRADE_CLASS_FACTORS: Record<string, { acc: number; dec: number }> = {
  "3_4_upgrade": { acc: 1.35, dec: 0.90 },
  "3_4_downgrade": { acc: 0.60, dec: 1.20 },
  "5_6_upgrade": { acc: 1.90, dec: 0.80 },
  "5_6_downgrade": { acc: 0.55, dec: 1.35 }
};

// ============================================================
// التحويلات المرورية ومناطق العمل — كود الطرق السعودي 305 و602
// كل صف موثّق برقم صفحة PDF وبند/جدول/شكل من الكودين المحليين.
// ============================================================

// 1) البنية العامة لمنطقة التحكم المروري المؤقتة (305 ص PDF 89-94، بند 9-3 إلى 9-8)
export const WORK_ZONE_STRUCTURE = [
  { zone: "منطقة التحذير المتقدمة", role: "إخطار السائقين مبكراً بتغير ظروف المرور وبأي خفض مؤقت للسرعة.", note: "أول لوحة تحذير مسبقة على بعد 2000 م من بداية إغلاق المسار أو موضع حامل العلم.", source: "305 ص PDF 91، بند 9-4 و9-4-2" },
  { zone: "منطقة الانتقال/الاستدقاق", role: "نقل المرور من مسار غير مستخدم إلى مسارات مفتوحة.", note: "تعتمد على خصائص الطريق، مقدار الإزاحة العرضية، وكفاية الرؤية.", source: "305 ص PDF 92، بند 9-5؛ ص PDF 32-34" },
  { zone: "المنطقة العازلة/الفاصلة", role: "توفير حيز سلامة بعد التحويل وقبل منطقة العمل.", note: "أجهزة التوجيه القنواتي متباعدة كل 40 م، ويحدد الطول حسب السرعة الدائمة.", source: "305 ص PDF 93، بند 9-6 وجدول 9-2" },
  { zone: "منطقة أعمال الطرق", role: "تضم سطح تنفيذ الأعمال والعاملين والمعدات والمواد والتخزين.", note: "في الطرق المقسمة يفضل استخدام حاجز إيجابي؛ ربط أقسام الحاجز كوحدة واحدة.", source: "305 ص PDF 93، بند 9-7" },
  { zone: "منطقة إنهاء الأعمال", role: "إخراج المرور من منطقة العمل وإعادة القيود المؤقتة إلى الوضع الأصلي.", note: "مسافة الإغلاق عادة 50 م. غالباً لا يلزم استدقاق نهائي على الطرق المقسمة.", source: "305 ص PDF 94، بند 9-8" },
];

// 2) منطقة التحذير المبكر واللوحات (305 ص PDF 85-91)
export const ADVANCE_WARNING_ITEMS = [
  { item: "أول لوحة تحذير مسبقة", requirement: "توضع على مسافة 2000 م قبل النقطة التي يبدأ فيها إغلاق المسار أو موضع التلويح بالعلم.", source: "305 ص PDF 91، بند 9-4-2" },
  { item: "المسافة بين اللوحات 2000م → 1000م قبل منطقة العمل", requirement: "500 م كحد أقصى.", source: "305 ص PDF 91، بند 9-4-2" },
  { item: "المسافة بين اللوحات 1000م → 0م قبل منطقة العمل", requirement: "200 م كحد أقصى.", source: "305 ص PDF 91، بند 9-4-2" },
  { item: "اللوحات الكبيرة على الطرق عالية السرعة/الحجم", requirement: "قد تكون هناك حاجة للوحات تحذير أكبر من 1100 ملم، مع لوحات أسهم ومنارات وأجهزة إنارة.", source: "305 ص PDF 85، بند 7-6-2" },
  { item: "عند المركبات السريعة أو الكثيفة جداً", requirement: "تحذير قبل منطقة العمل بـ 2 كم، ويكرر التحذير على بعد 1 كم.", source: "305 ص PDF 85، بند 7-6-2" },
  { item: "نهاية منطقة العمل", requirement: "يجب دائماً تركيب لوحة في نهاية منطقة أعمال الطرق لإبلاغ السائقين بمغادرتهم منطقة التحكم الخاصة.", source: "305 ص PDF 85، بند 7-6-2" },
];

// 3) ألوان اللوحات والمواد (602 ص PDF 386، بند 7-2؛ 305 ص PDF 59)
export const SIGN_COLORS_MATERIALS = [
  { item: "لوحات مناطق العمل التحذيرية والتنظيمية", spec: "رمز/كتابة سوداء على خلفية صفراء بإطار أحمر.", source: "602 ص PDF 386، بند 7-2" },
  { item: "لوحات معلومات داخل مناطق العمل", spec: "رموز وحدود سوداء على خلفية صفراء.", source: "602 ص PDF 386، بند 7-2" },
  { item: "سطح اللوحة العاكس", spec: "ألمنيوم أو ألمنيوم مركب أو بلاستيك مقوى بالزجاج GRP، ولا يجوز استخدام الحديد أو الخشب أو الكرتون أو البلاستيك المرن الخفيف.", source: "602 ص PDF 386؛ 305 ص PDF 59" },
  { item: "متطلبات الانعكاسية", spec: "صفائح عاكسة لا تقل عن الفئة الأولى حسب SASO-ASTM D4956-13.", source: "305 ص PDF 59، بند 4-15-3" },
];

// 4) أبعاد اللوحات حسب حد السرعة الدائم (305 ص PDF 60 جدول 4-11؛ 602 ص PDF 386 جدول 7-1)
export const SIGN_DIMENSIONS_BY_SPEED = [
  { speedRange: "≤ 50 كم/س", diameter: "600 ملم", letterHeight: "130 / 75 ملم", minVisibility: "60 م" },
  { speedRange: "51-80 كم/س", diameter: "750 ملم", letterHeight: "170 / 100 ملم", minVisibility: "75 م" },
  { speedRange: "81-100 كم/س", diameter: "900 ملم", letterHeight: "255 / 150 ملم", minVisibility: "100 م" },
  { speedRange: "101-120 كم/س", diameter: "1200 ملم", letterHeight: "255 / 150 ملم", minVisibility: "100 م" },
];

// 5) تركيب اللوحات ومواقعها (305 ص PDF 27-28، 68؛ 602 ص PDF 387-388، 400)
export const SIGN_INSTALLATION_RULES = [
  { topic: "جانب التركيب", requirement: "الأصل الجانب الأيمن؛ يمكن تركيب مزدوج يمين/يسار عند الحاجة لتأكيد خاص (طرق مزدوجة بثلاثة مسارات أو أكثر).", source: "305 ص PDF 27؛ 602 ص PDF 387" },
  { topic: "الارتفاع الأدنى للدعامات المؤقتة/المتاريس", requirement: "أسفل اللوحة لا يقل عن 1.5 م فوق منسوب الرصف.", source: "305 ص PDF 27؛ 602 ص PDF 387" },
  { topic: "اللوحات الأكبر من 1 م²", requirement: "تثبت عادة على عمودين بدلاً من عمود واحد.", source: "305 ص PDF 28؛ 602 ص PDF 388" },
  { topic: "الدعامات", requirement: "يفضل أن تكون قابلة للانفصال أو مخففة الأثر عند الاصطدام.", source: "305 ص PDF 28 و85؛ 602 ص PDF 388" },
  { topic: "اللوحات على المتاريس", requirement: "أسفل اللوحة لا يقل عن 500 ملم فوق الطريق المتحرك المجاور.", source: "305 ص PDF 68؛ 602 ص PDF 400" },
];

// 6) كتالوج اللوحات الأساسية في التحويلات ومناطق العمل (602 ص PDF 393-396)
export const WORK_ZONE_SIGNS_CATALOG = [
  { code: "TW50-1", name: "منطقة عمل على الطريق", usage: "تستخدم قبل أعمال الإنشاء أو الصيانة أو المرافق لحماية العاملين، وتكرر مع لوحات أخرى عند وجود عائق.", source: "602 ص PDF 393، بند 7-2-4-5" },
  { code: "TW50-2", name: "مسار مغلق", usage: "تستخدم قبل نقطة إغلاق مسار في طريق ذي اتجاهين، مع لوحة إضافية لأولوية المرور القادم.", source: "602 ص PDF 393-394، بند 7-2-4-6" },
  { code: "TW50-3", name: "أمامك حامل أعلام", usage: "تستخدم قبل موضع حامل الأعلام في حالات الطوارئ فقط، وتزال/تغطى عند غياب حامل الأعلام.", source: "602 ص PDF 394، بند 7-2-4-7" },
  { code: "TI8-1", name: "تحويلة", usage: "عند نقطة نشوء طريق تحويلة، مع سهم شيفرون يمين/يسار وكتابة عربية/إنجليزية.", source: "602 ص PDF 394-395، بند 7-2-5-1" },
  { code: "TI2-1 / TI2-2", name: "أمامك تحويلة", usage: "تستخدم مسبقاً قبل نقطة تحويل المرور إلى طريق مؤقت أو بديل.", source: "602 ص PDF 395، بند 7-2-5-2" },
  { code: "TI1-2", name: "نهاية أعمال الطريق", usage: "تدل على نهاية منطقة أعمال الطريق/القيود المؤقتة، وتُركّب على بعد 200 م تقريباً من نهاية العملية.", source: "602 ص PDF 395، بند 7-2-5-3" },
  { code: "TDI", name: "لوحات تحذير تخطيطية", usage: "يوصى باستخدامها قبل بداية المنطقة الانتقالية، وتكرارها تقريباً كل 300 م قرب المنطقة الانتقالية.", source: "602 ص PDF 396، بند 7-2-6" },
];

// 7) تباعد أجهزة التوجيه القنواتي داخل المقطع المستدق (305 ص PDF 34 جدول 4-3)
export const TAPER_DEVICE_SPACING = [
  { speed: 30, spacing: 6 }, { speed: 40, spacing: 8 }, { speed: 50, spacing: 9 },
  { speed: 60, spacing: 11 }, { speed: 70, spacing: 13 }, { speed: 80, spacing: 15 },
  { speed: 90, spacing: 17 }, { speed: 100, spacing: 19, note: "استثنائي" },
];

// 8) تباعد أجهزة التوجيه على المنحنيات (305 ص PDF 34-35 جدول 4-4)
export const CURVE_DEVICE_SPACING = [
  { radius: 25, spacing: 7 }, { radius: 50, spacing: 10 }, { radius: 75, spacing: 12 },
  { radius: 100, spacing: 15 }, { radius: 125, spacing: 18 }, { radius: 150, spacing: 20 },
  { radius: 175, spacing: 21 }, { radius: 200, spacing: 22 }, { radius: 250, spacing: 25 },
  { radius: 300, spacing: 27 }, { radius: 400, spacing: 33 }, { radius: 500, spacing: 36 },
  { radius: 501, spacing: 50, note: "أعلى من 500 م" },
];

// 9) المسافة بين الاستدقاقات المتتالية (305 ص PDF 33 جدول 4-2)
export const TAPER_MIN_SPACING = [
  { speed: 40, min3S: 120, preferred4S: 160, max5S: 200 },
  { speed: 60, min3S: 180, preferred4S: 240, max5S: 300 },
  { speed: 80, min3S: 240, preferred4S: 320, max5S: 400 },
  { speed: 100, min3S: 300, preferred4S: 400, max5S: 500 },
  { speed: 120, min3S: 360, preferred4S: 480, max5S: 600 },
  { speed: 140, min3S: 420, preferred4S: 560, max5S: 700 },
];

// 10) جدول المنطقة العازلة (305 ص PDF 93 جدول 9-2) — يُستخدم في حاسبة المنطقة العازلة
export const BUFFER_ZONE_TABLE = [
  { speed: 40, preferred: 10, minimum: 5 },
  { speed: 60, preferred: 25, minimum: 10 },
  { speed: 80, preferred: 40, minimum: 30 },
  { speed: 100, preferred: 60, minimum: 45 },
  { speed: 120, preferred: 80, minimum: 60 },
  { speed: 140, preferred: 100, minimum: 80 },
];

// 11) حدود السرعة المؤقتة (305 ص PDF 50-51 جدول 4-10)
export const TEMP_SPEED_LIMITS = [
  { workType: "أعمال متنقلة (أي مدة)", operatingSpeed: "أي حد", tempLimit: "ليست مناسبة عادة / تخضع لتقييم المخاطر" },
  { workType: "قصيرة الأجل: أقل من 15 دقيقة", operatingSpeed: "أي حد", tempLimit: "ليست مناسبة عادة / تخضع لتقييم المخاطر" },
  { workType: "متوسطة الأجل: 15 دقيقة إلى 8 ساعات", operatingSpeed: "> 80 كم/س", tempLimit: "80 كم/س" },
  { workType: "متوسطة الأجل: 15 دقيقة إلى 8 ساعات", operatingSpeed: "≤ 80 كم/س", tempLimit: "50 كم/س" },
  { workType: "طويلة الأجل: أكثر من 8 ساعات", operatingSpeed: "> 80 كم/س", tempLimit: "80 كم/س" },
  { workType: "طويلة الأجل: أكثر من 8 ساعات", operatingSpeed: "≤ 80 كم/س", tempLimit: "50 كم/س" },
  { workType: "طويلة الأجل: أكثر من 8 ساعات", operatingSpeed: "≥ 120 كم/س", tempLimit: "100 كم/س" },
  { workType: "إشارات متنقلة / حامل لوحة قف أو أعط الأفضلية", operatingSpeed: "أي حد", tempLimit: "50 كم/س" },
];

// 12) عناصر تصميم التحويلة (305 ص PDF 60-64، بند 4-16)
export const DETOUR_DESIGN_ELEMENTS = [
  { element: "عرض المسار الأدنى 3.0 م", condition: "AADT للشاحنات < 50، سرعة تصميمية حتى 70 كم/س، لا منحنيات أكبر من 7 درجات.", source: "305 ص PDF 61، بند 4-16-3" },
  { element: "عرض 3.30 م أو أكثر", condition: "يستخدم إذا فشل أحد شروط عرض 3.0 م.", source: "305 ص PDF 61، بند 4-16-3" },
  { element: "عرض 3.65 م", condition: "سرعة تصميمية ≥ 90 كم/س، أو AADT للشاحنات > 300، أو طريق شرياني.", source: "305 ص PDF 61، بند 4-16-3" },
  { element: "فرق السرعة التصميمية", condition: "أقرب ما يمكن للطريق الرئيس؛ الفارق يجب أن يكون أقل من 20 كم/س.", source: "305 ص PDF 64، بند 4-16-5-1" },
  { element: "نصف قطر بداية/نهاية انتقال التحويلة", condition: "الحد الأدنى المرغوب 600 م.", source: "305 ص PDF 64، بند 4-16-5-3" },
  { element: "سطح التحويلة", condition: "يفضل الأسفلت إذا زادت السرعة عن 60 كم/س، أو داخل المدن، أو لمدة أكثر من 3 أسابيع.", source: "305 ص PDF 64، بند 4-16-5-7" },
];

// 13) أجهزة الفصل والحواجز والتوجيه (305 ص PDF 64-70؛ 602 ص PDF 396-401)
export const SEPARATION_DEVICES = [
  { device: "الأقماع والعلامات الأنبوبية", spec: "ارتفاع لا يقل عن 450 ملم؛ اللون الأحمر سائد؛ شريط عاكس أصفر ≥150 ملم على مسافة ≤75 ملم من الأعلى.", source: "305 ص PDF 64-65؛ 602 ص PDF 396", conflict: false },
  { device: "الألواح الرأسية/العمودية — تعارض 305/602", spec: "305: خطوط بيضاء عاكسة على خلفية حمراء عاكسة، 250×1000 ملم. 602: خطوط حمراء عاكسة على خلفية صفراء عاكسة، 300×900 ملم. تعارض حقيقي بين الكودين — يُرجع للرسمة المعتمدة للمشروع قبل التنفيذ.", source: "305 ص PDF 65، بند 4-18؛ 602 ص PDF 397، بند 7-3-2", conflict: true },
  { device: "فواصل المرور", spec: "تفصل المسارات والمرور، يمكن تركيب لوحات رأسية عليها، ويمكن استخدام حواجز نيوجيرسي البلاستيكية.", source: "305 ص PDF 66؛ 602 ص PDF 397-398", conflict: false },
  { device: "علامات الأجسام", spec: "جسم ≤2.4م من الكتف: أسفل العلامة ≥1.2م فوق أقرب مسار. جسم >2.4م: ≥1.2م فوق سطح الأرض.", source: "305 ص PDF 66، بند 4-20", conflict: false },
  { device: "البراميل", spec: "ارتفاع ≥800 ملم وقطر ≥500 ملم؛ شرائط عاكسة أفقية 100-200 ملم؛ فتحات تصريف بالقاع؛ يمنع وزنها بالصخور/الخرسانة/الإسفلت/الرمل (602: حد أقصى 250 ملم رمل بالقاع).", source: "305 ص PDF 66-67، بند 4-21؛ 602 ص PDF 398، بند 7-3-4", conflict: false },
  { device: "المتاريس", spec: "جهاز ثابت/متنقل من خشب أو معدن خفيف أو بلاستيك بأعضاء أفقية؛ اللونان الأحمر والأبيض عاكسان؛ لا تستخدم أحجار/خرسانة/إسفلت كأثقال.", source: "305 ص PDF 67-69؛ 602 ص PDF 398-400", conflict: false },
  { device: "الحواجز المؤقتة/المحمولة", spec: "تمنع خروج المركبات من الطريق/الكتف وتفصل المرور المتعاكس؛ تُربط الأقسام بقوة، ويمكن تثبيتها بالسطح.", source: "305 ص PDF 69؛ 602 ص PDF 400", conflict: false },
  { device: "أجهزة التحذير عالية المستوى", spec: "ثلاثة أعلام حمراء أو أكثر على دعامة طويلة؛ ضلع العلم ≥400 ملم؛ وميض عالي الكثافة للرؤية الليلية.", source: "305 ص PDF 69-70؛ 602 ص PDF 401", conflict: false },
];

// 14) محطات حاملي الأعلام (602 ص PDF 411، بند 7-6-3)
export const FLAGGER_STATIONS = [
  { condition: "المناطق الريفية", requirement: "تركب المحطة قبل 150 م من موقع العمل، أو أبعد إذا تجاوزت سرعة الطريق 80 كم/س." },
  { condition: "المناطق الحضرية بطيئة السرعة", requirement: "تتراوح المسافة بين 50 و75 م." },
  { condition: "موقع وقوف حامل العلم", requirement: "على الكتف/المسار الجانبي المجاور، أو مسار مروري مزود بحواجز؛ لا يقف في مسار مستخدم من المرور، ولا يسمح بتجمع العمال حوله." },
];

// 15) مواصفات أجهزة الإشارة اليدوية (602 ص PDF 411، بند 7-6-2)
export const HAND_SIGNAL_DEVICES = [
  { item: "العلم", spec: "لا يقل عن 600 ملم مربع، قماش أحمر متين، يثبت بقضيب طوله ~1م، وتوازن حافته الحرة ليعلق عمودياً." },
  { item: "مجذاف التوقف/الإبطاء", spec: "ثماني الشكل، عرض ≥600 ملم، ارتفاع الحروف ≥ ثلث ارتفاع المجذاف، مقبض دائري صلب ~2م." },
  { item: "ألوان وجهي المجذاف", spec: "وجه قف: أحرف بيضاء عاكسة على خلفية حمراء عاكسة بإطار أبيض عاكس. وجه أبطئ: أحرف سوداء وحد أحمر على خلفية بيضاء عاكسة." },
];

// 16) مخففات الصدمات TMA (602 ص PDF 402، بند 7-3-8؛ 305 ص PDF 54) — تُستخدم في حاسبة TMA
export const TMA_SPECS = {
  testLevel: "TL3 (مركبة اختبار 2000 كجم بسرعة اصطدام 100 كم/س)",
  supportVehicleMass: "9000 ± 450 كجم (لا تستخدم أوزان دعم منخفضة)",
  safetyZoneNominal: 75,
  safetyZoneTolerance: 25,
  additionalTmaSpeedThreshold: 120,
};

// 17) العمل الليلي والأجهزة الضوئية (602 ص PDF 407-409)
export const NIGHT_LIGHTING_DEVICES = [
  { device: "أضواء التحذير النوع أ", spec: "وميض منخفض السطوع؛ 55-75 ومضة/دقيقة؛ رؤية فعالة 1000م ليلاً؛ قطر العدسة 15سم؛ من الغسق للفجر." },
  { device: "أضواء التحذير النوع ب", spec: "وميض عالي السطوع؛ 55-75 ومضة/دقيقة؛ رؤية فعالة 350م نهاراً؛ قطر العدسة 15سم؛ تعمل كل الأوقات." },
  { device: "أضواء التحذير النوع ج", spec: "ضوء ثابت؛ رؤية فعالة 1000م ليلاً؛ قطر العدسة 15سم؛ من الغسق للفجر." },
  { device: "منارة تحديد المخاطر", spec: "عدسة صفراء ≥200 ملم (يفضل 300)؛ تركب فوق اللوحة 300-400 ملم؛ تومض 50-80 مرة/دقيقة." },
  { device: "لوحات الأسهم النوع أ", spec: "600×1200 ملم، 12 مصباحاً، وضوح 0.80 كم." },
  { device: "لوحات الأسهم النوع ب", spec: "750×1350 ملم، 13 مصباحاً، وضوح 1.25 كم." },
  { device: "لوحات الأسهم النوع ج", spec: "1200×2400 ملم، 15 مصباحاً، وضوح 1.50 كم." },
  { device: "تركيب لوحات الأسهم", spec: "أسفل اللوحة ≥2.1م فوق الطريق؛ لون المصباح كهرماني؛ معدل الوميض 60-90 ومضة/دقيقة." },
];

// 18) العلامات الأرضية المؤقتة والمحددات (602 ص PDF 403-405)
export const WORKZONE_PAVEMENT_MARKINGS = [
  { roadType: "الطرق المقسمة متعددة المسارات", spec: "خط الوسط أصفر متصل 200 ملم؛ خط الحافة أصفر متصل 200 ملم؛ خطوط المسارات بيضاء متقطعة 150 ملم (خط 6م وفجوة 12م)." },
  { roadType: "الطرق غير المقسمة متعددة المسارات", spec: "خط الوسط خطان أبيضان متصلان 120 ملم بفاصل 100 ملم؛ خطوط المسارات بيضاء متقطعة 120 ملم؛ خط الحافة أصفر 200 ملم." },
  { roadType: "الطرق الريفية والحضرية", spec: "خط الوسط خطان أبيضان متصلان 120 ملم بفاصل 120 ملم؛ خط الحافة أصفر متصل 200 ملم." },
  { roadType: "مشاريع إعادة التسطيح", spec: "خطوط مركزية ومسارات مؤقتة قبل نهاية كل يوم عمل؛ حد أدنى خط 3م بعرض 120 ملم مع فجوات 6م." },
];

export const DELINEATOR_SPECS = {
  visibility: "تُرى في الظلام من 300 م عند إضاءتها بالمصابيح الأمامية",
  reflectiveArea: "لا تقل مساحة العنصر العاكس عن 100 سم²",
  height: "ارتفاع الوحدة العاكسة تقريباً 1.2 م فوق حافة الرصف القريبة",
  color: "لون العنصر العاكس أبيض",
  placement: "توضع على مسافة 1-2 م خارج الحافة الخارجية للكتف الترابي أو في خط حاجز الحماية إن وجد",
};

// 19) التشغيل والصيانة والإزالة (305 ص PDF 26، 54، 58)
export const MAINTENANCE_ITEMS = [
  { topic: "فحص الإدارة المرورية المؤقتة", requirement: "يفحص المخطط كل ساعتين للتأكد من أن أجهزة التحكم في مكانها وحالتها جيدة، وتعالج العيوب دون تأخير.", source: "305 ص PDF 58، بند 4-13" },
  { topic: "نظافة المعدات", requirement: "تبقى اللوحات والأقماع والعواكس والعلامات الأرضية نظيفة للحفاظ على الانعكاسية والوضوح.", source: "305 ص PDF 58، بند 4-13" },
  { topic: "عدم تعديل المخطط ميدانياً", requirement: "إذا لزم التغيير تُرسل خطة معدلة للجهة المعنية.", source: "305 ص PDF 58، بند 4-13" },
  { topic: "الإزالة", requirement: "تُنفذ وفق خطة الإخلاء ضمن خطة تحويل المرور.", source: "305 ص PDF 58، بند 4-14" },
  { topic: "تدقيق وفحص السلامة", requirement: "إلزامي، ويشمل اعتماد خطة تحويل المرور، مراجعة التصميم، التحقق قبل الافتتاح، والزيارات المتكررة.", source: "305 ص PDF 26، بند 2-6" },
];

// 20) مصفوفة اختيار سريعة (305/602 مصادر متعددة — أنظر الأقسام أعلاه)
export const SELECTION_MATRIX = [
  { scenario: "إغلاق مسار على طريق متعدد المسارات أو مقسم", action: "لوحات تحذير مسبقة، منطقة استدقاق، أجهزة توجيه، ولوحة سهم وامضة (إلزامية).", note: "لوحات الأسهم يجب استخدامها في جميع إغلاقات المسارات على الطرق متعددة المسارات والمقسمة." },
  { scenario: "عمل طويل أو خطر بجوار المرور", action: "حاجز إيجابي خرسانة/حديد أو حاجز مؤقت مترابط.", note: "تربط الأقسام كوحدة واحدة." },
  { scenario: "سرعة عالية أو حجم مرور عالٍ", action: "لوحات أكبر، لوحات أسهم، منارات، تقليل تباعد الأجهزة، وربما TMA.", note: "التحذير قد يبدأ من 2 كم ويكرر عند 1 كم." },
  { scenario: "عمل ليلي", action: "إنارة إضافية، لوحات أكثر لمعاناً، أجهزة توجيه بمسافات أقرب، أضواء تحذير.", note: "يجب تجنب الوهج وضمان وضوح المسار." },
  { scenario: "تحويلة طريق مؤقتة", action: "تحقق من عرض المسارات، السرعة التصميمية، نصف القطر، الصرف، الإشارات.", note: "الأسفلت يلزم عند سرعة >60 كم/س أو داخل المدن أو مدة أكثر من 3 أسابيع." },
  { scenario: "تحكم باتجاه واحد بسبب تضييق", action: "لوحات أولوية/قف/إشارات متنقلة أو حاملو أعلام حسب التدفق والسرعة.", note: "التحقق من عرض المسار المتاح ومسافة الرؤية عند نقاط التحكم." },
];

// 21) قائمة تحقق مختصرة للموقع (305)
export const SITE_CHECKLIST = [
  "تحديد صنف الطريق وحد السرعة الدائم وسرعة التشغيل/المئين 85.",
  "تحديد بداية منطقة العمل ثم حساب المنطقة العازلة والاستدقاق قبل وضع اللوحات.",
  "وضع أول لوحة تحذير مسبقة عند 2000 م عند الحاجة، وتطبيق تباعد 500 م ثم 200 م حسب الاقتراب.",
  "اختيار مقاس اللوحات حسب حد السرعة الدائم في التحذير والانتقال، وليس فقط السرعة المؤقتة.",
  "تطبيق جداول الاستدقاق وتباعد أجهزة التوجيه، وخفض المسافة عند استخدام أقماع 500 ملم.",
  "تحديد نوع الفصل: أقماع/ألواح/براميل/متاريس/حاجز مؤقت/حاجز إيجابي حسب الخطر والمدة والسرعة.",
  "التحقق من وضوح العمل الليلي: إنارة، عاكسية، لوحات أسهم، أضواء تحذير، وعدم وجود وهج.",
  "فحص الموقع كل ساعتين ومعالجة أي عيب دون تأخير.",
  "تغطية أو إزالة اللوحات والعلامات غير المناسبة فور انتهاء العملية أو توقفها.",
];

// References List Data
export const REFERENCES_DATA: ReferenceItem[] = [
  {
    id: "src301",
    nameAr: "كود الطرق السعودي 301 (التصميم الهندسي)",
    nameEn: "Saudi Road Code 301 (Geometric Design)",
    code: "SRC-301",
    type: "رئيسي وعام",
    notes: "يغطي المعايير العامة للمنحنيات الأفقية والرأسية، مسافات الرؤية، وعناصر قطاع الطريق وحارات السرعة.",
    fileName: "301 AR.pdf"
  },
  {
    id: "src305",
    nameAr: "كود الطرق السعودي 305 (تصميم منطقة أعمال الطرق)",
    nameEn: "Saudi Road Code 305 (Design of Road Work Zones)",
    code: "SRC-305",
    type: "مناطق العمل والتحويلات المرورية",
    notes: "المصدر الحاكم لتصميم منطقة أعمال الطرق: مبادئ التوجيه القنواتي، معادلات وجداول أطوال الاستدقاق، منطقة التحذير المبكر، المنطقة العازلة ومنطقة أعمال الطرق ونهايتها، حدود السرعة المؤقتة، وتصميم التحويلات المرورية.",
    fileName: "305_compressed.pdf"
  },
  {
    id: "src401",
    nameAr: "كود الطرق السعودي 401 (إنشاء الطرق)",
    nameEn: "Saudi Road Code 401 (Road Construction)",
    code: "SRC-401",
    type: "إنشاء الطرق",
    notes: "يغطي أحكام تنفيذ وإنشاء الطرق. تنبيه توثيق: لا يُستخدم كمصدر لحسابات الاستدقاق أو التحكم المروري المؤقت في هذه المنصة؛ ذلك المصدر هو كود الطرق السعودي 305.",
    fileName: "401 AR.pdf"
  },
  {
    id: "src602",
    nameAr: "كود الطرق السعودي 602 (أعمال دهان وتخطيط ممرات الطرق)",
    nameEn: "Saudi Road Code 602 (Pavement Markings Manual)",
    code: "SRC-602",
    type: "العلامات المرورية",
    notes: "الدليل القياسي لأبعاد وكميات الدهانات وعيون القطط الفردية والمزدوجة والتحذيرية على الطرق، وأجهزة التحكم المروري المؤقت في مناطق العمل (الباب 7).",
    fileName: "602 AR.pdf"
  },
  {
    id: "src603",
    nameAr: "كود الطرق السعودي 603 (لوحات إشارات الطرق الهندسية)",
    nameEn: "Saudi Road Code 603 (Traffic Signs Manual)",
    code: "SRC-603",
    type: "لوحات إشارات الطرق",
    notes: "دليل المواصفات والأشكال للوحات إشارات الطرق الرأسية الإرشادية والتحذيرية والتنظيمية.",
    fileName: "603_AR.pdf"
  },
  {
    id: "aashto_green",
    nameAr: "كتاب آشتو الأخضر (التصميم الهندسي للطرق والشوارع)",
    nameEn: "AASHTO Green Book (A Policy on Geometric Design)",
    code: "AASHTO Green Book",
    type: "مرجع دولي",
    notes: "المرجع الأكثر شمولية المعتمد في معظم حسابات المنحنيات الرأسية والافقية والتسارع بمشاريع النقل.",
    fileName: "THE_GREEN_BOOK_A_Policy_on_Geometric_Des.pdf"
  },
  {
    id: "aashto_rdg",
    nameAr: "دليل آشتو لتصميم جوانب الطرق",
    nameEn: "AASHTO Roadside Design Guide",
    code: "AASHTO RDG",
    type: "مرجع دولي",
    notes: "المرجع العالمي للمعادلات الدقيقة لحسابات طول الحماية المطلوب (Length of Need) والانحراف المائل (Flare Back).",
    fileName: "07 - Section1.15 Traffic Barriers.pdf"
  },
  {
    id: "mutcd11",
    nameAr: "دليل أجهزة التحكم المروري الموحد - الطبعة 11",
    nameEn: "MUTCD 11th Edition 2023",
    code: "MUTCD 2023",
    type: "مرجع دولي",
    notes: "الدليل الفيدرالي الأمريكي لأجهزة تنظيم المرور ولوحات الإشارات المؤقتة وعلامات الرصيف والمطبات.",
    fileName: "mutcd.pdf"
  }
];

// Standard Drawings database
export const STANDARD_DRAWINGS_DATA: StandardDrawing[] = [
  {
    id: "std_draw_1",
    titleAr: "نقطة تفتيش نموذجية نوع A",
    titleEn: "Typical Security Checkpoint Type A Layout",
    category: "Checkpoints",
    categoryAr: "نقاط التفتيش",
    code: "STD-CHK-A",
    fileName: "TYPE A.pdf"
  },
  {
    id: "std_draw_2",
    titleAr: "نقطة تفتيش نموذجية نوع B",
    titleEn: "Typical Security Checkpoint Type B Layout",
    category: "Checkpoints",
    categoryAr: "نقاط التفتيش",
    code: "STD-CHK-B",
    fileName: "TYPE B.pdf"
  },
  {
    id: "std_draw_3",
    titleAr: "نقطة تفتيش نموذجية نوع C",
    titleEn: "Typical Security Checkpoint Type C Layout",
    category: "Checkpoints",
    categoryAr: "نقاط التفتيش",
    code: "STD-CHK-C",
    fileName: "TYPE C.pdf"
  },
  {
    id: "std_draw_4",
    titleAr: "نقطة تفتيش نموذجية نوع D",
    titleEn: "Typical Security Checkpoint Type D Layout",
    category: "Checkpoints",
    categoryAr: "نقاط التفتيش",
    code: "STD-CHK-D",
    fileName: "TYPE D.pdf"
  },
  {
    id: "std_draw_5",
    titleAr: "نقطة تفتيش نموذجية نوع E",
    titleEn: "Typical Security Checkpoint Type E Layout",
    category: "Checkpoints",
    categoryAr: "نقاط التفتيش",
    code: "STD-CHK-E",
    fileName: "TYPE E.pdf"
  },
  {
    id: "std_draw_6",
    titleAr: "نقطة تفتيش نموذجية نوع F",
    titleEn: "Typical Security Checkpoint Type F Layout",
    category: "Checkpoints",
    categoryAr: "نقاط التفتيش",
    code: "STD-CHK-F",
    fileName: "TYPE F.pdf"
  },
  {
    id: "std_draw_7",
    titleAr: "المخطط القياسي لتقاطع رباعي",
    titleEn: "Standard Four-Way Intersection Layout",
    category: "Intersections",
    categoryAr: "التقاطعات",
    code: "STD-INT-4WAY",
    fileName: "المخطط القياسي لتقاطع رباعي.pdf"
  },
  {
    id: "std_draw_8",
    titleAr: "تقاطع T على طريق مفرد مع جزيرة وهمية",
    titleEn: "Typical T-Intersection with Left-Turn Lanes",
    category: "Intersections",
    categoryAr: "التقاطعات",
    code: "STD-INT-T-L",
    fileName: "TYPICAL T-INTERSECTION ON SINGLE HIGHWAY WITH LEFT-TURN LANES.pdf"
  },
  {
    id: "std_draw_9",
    titleAr: "تقاطع T على طريق مفرد مع طريق محلي مزدوج",
    titleEn: "Typical T-Intersection with Local Divided Road",
    category: "Intersections",
    categoryAr: "التقاطعات",
    code: "STD-INT-T-LD",
    fileName: "TYPICAL T-INTERSECTION ON SINGLE HIGHWAY WITH LOCAL DIVIDED ROAD.pdf"
  },
  {
    id: "std_draw_10",
    titleAr: "تقاطع T بين طريق فرعي وطريق مزدوج",
    titleEn: "Typical T-Intersection Details (Branch / Divided)",
    category: "Intersections",
    categoryAr: "التقاطعات",
    code: "STD-INT-T-BD",
    fileName: "TYPICAL T-INTERSECTION DETAILS BETWEEN BRANCH ROAD AND DIVIDED HIGHWAYS .pdf"
  },
  {
    id: "std_draw_11",
    titleAr: "تقاطع T على طريق ريفي محلي مع حارات انعطاف يسار",
    titleEn: "Typical T-Intersection on Rural Local Road",
    category: "Intersections",
    categoryAr: "التقاطعات",
    code: "STD-INT-T-RL",
    fileName: "TYPICAL T INTERSECTION ON RURAL LOCAL ROAD WITH LEFT TURN LANES-1.pdf"
  },
  {
    id: "std_draw_12",
    titleAr: "ربط نموذجي بين طريق فرعي وطريق سريع مزدوج",
    titleEn: "Typical Connection Details (Branch / Divided Freeway)",
    category: "Intersections",
    categoryAr: "التقاطعات",
    code: "STD-INT-CON",
    fileName: "TYPICAL CONNECTION DETAILS BETWEEN BRANCH  ROAD AND DIVIDED FREEWAY.pdf"
  },
  {
    id: "std_draw_13",
    titleAr: "فتحة دوران U — تفاصيل تصميم للسيارات",
    titleEn: "Typical U-Turn Design for Passenger Cars",
    category: "U-Turns",
    categoryAr: "فتحات الدوران",
    code: "STD-UTURN-PC",
    fileName: "U-TURN DESIGN DETAILS FOR PASSENGER CAR.pdf"
  },
  {
    id: "std_draw_14",
    titleAr: "المواصفات الخاصة بمناطق الالتفاف",
    titleEn: "Specific Specifications for Loops/U-Turns",
    category: "U-Turns",
    categoryAr: "فتحات الدوران",
    code: "STD-UTURN-SPEC",
    fileName: "المواصفات+الخاصة+بمناطق+الالتفاف_1.0.0 (1).pdf"
  },
  {
    id: "std_draw_15",
    titleAr: "محطة خدمة على طريق مزدوج (حارتان)",
    titleEn: "Service Station on 2-Lane Divided Highway",
    category: "ServiceStations",
    categoryAr: "محطات الخدمة",
    code: "STD-SERV-DIV",
    fileName: "TYPICAL DETAILS OF SERVICE STATION ON DIVIDED HIGHWAY-2 lanes.pdf"
  },
  {
    id: "std_draw_16",
    titleAr: "دخول/خروج محطة خدمة على طريق مفرد",
    titleEn: "Service Station Access on Single Highways",
    category: "ServiceStations",
    categoryAr: "محطات الخدمة",
    code: "STD-SERV-SNG",
    fileName: "TYPICAL SERVICE STATION INGRESS EGRESS DETAILS ON SINGLE HIGHWAYS.pdf"
  },
  {
    id: "std_draw_17",
    titleAr: "تفاصيل نهاية الطريق",
    titleEn: "Typical Details for End of Roadway",
    category: "Construction",
    categoryAr: "تفاصيل الإنشاء",
    code: "STD-CON-END",
    fileName: "TYPICAL DETAILS  FOR END OF ROADWAY (1).pdf"
  },
  {
    id: "std_draw_18",
    titleAr: "أطوال حارات تغيير السرعة",
    titleEn: "Speed Change Lanes Recommended Lengths",
    category: "Intersections",
    categoryAr: "التقاطعات",
    code: "STD-INT-SPD",
    fileName: "Speed Change Lanes Lengths with Complementary Speed Values.pdf"
  },
  {
    id: "std_draw_19",
    titleAr: "علامات الشيفرون التوجيهية Chevron",
    titleEn: "Chevron Alignment Signs Mounting & Details",
    category: "SignsDetails",
    categoryAr: "لوحات إشارات الطرق",
    code: "STD-SGN-CHV",
    fileName: "CHEVRON ALIGNEMT SIGN-REV.2 (1).pdf"
  },
  {
    id: "std_draw_20",
    titleAr: "المخطط النموذجي للإغلاق الطارئ على الطرق السريعة",
    titleEn: "Standard Emergency Freeway Closure Scheme",
    category: "Closures",
    categoryAr: "الاغلاقات",
    code: "STD-CLS-EMG",
    fileName: "المخطط النموذجي للاغلاق الطاريء على الطرق السريعة.pdf"
  },
  {
    id: "std_draw_21",
    titleAr: "المخطط النموذجي للمناطق المدرسية",
    titleEn: "Typical Speed Control Layout in School Zones",
    category: "SignsDetails",
    categoryAr: "لوحات إشارات الطرق",
    code: "STD-SGN-SCH",
    fileName: "المخطط النموذجي للمدارس (1).pdf"
  },
  {
    id: "std_draw_22",
    titleAr: "مخطط الميزان ومخطط السلامة",
    titleEn: "Weigh Stations Safety & Marking Plan",
    category: "Intersections",
    categoryAr: "التقاطعات",
    code: "STD-INT-WEIGH",
    fileName: "مخططالميزانومخططالسلامة.pdf"
  },
  {
    id: "std_draw_23",
    titleAr: "المخطط القياسي للمطبات",
    titleEn: "Standard Road Humps and Rumble Strips Details",
    category: "Construction",
    categoryAr: "تفاصيل الإنشاء",
    code: "STD-CON-HUMP",
    fileName: "DETAILS- (1).pdf"
  },
  {
    id: "std_draw_24",
    titleAr: "مخطط قياسي 01",
    titleEn: "Standard Drawing 01 (General Details)",
    category: "Construction",
    categoryAr: "تفاصيل الإنشاء",
    code: "STD-DRAW-01",
    fileName: "01.pdf"
  },
  {
    id: "std_draw_25",
    titleAr: "مخطط قياسي 02",
    titleEn: "Standard Drawing 02 Details",
    category: "Construction",
    categoryAr: "تفاصيل الإنشاء",
    code: "STD-DRAW-02",
    fileName: "02.pdf"
  },
  {
    id: "std_draw_26",
    titleAr: "مخطط قياسي 02 (طريق مفرد)",
    titleEn: "Standard Drawing 02 (Single Highway)",
    category: "Construction",
    categoryAr: "تفاصيل الإنشاء",
    code: "STD-DRAW-02S",
    fileName: "02-SING.pdf"
  },
  {
    id: "std_draw_27",
    titleAr: "تقاطع ثلاثي بدون حارات تخزين",
    titleEn: "Three-way Intersection Without Storage Lanes Details",
    category: "Construction",
    categoryAr: "تفاصيل الإنشاء",
    code: "STD-DRAW-03",
    fileName: "03.pdf"
  },
  {
    id: "std_draw_28",
    titleAr: "تقاطع ثلاثي بحارات تخزين",
    titleEn: "Three-way Intersection With Storage Lanes Details",
    category: "Construction",
    categoryAr: "تفاصيل الإنشاء",
    code: "STD-DRAW-04",
    fileName: "04.pdf"
  },
  {
    id: "std_draw_29",
    titleAr: "المخطط القياسي للمطبات الاهتزازية الطولية (على الأكتاف)",
    titleEn: "Standard Longitudinal Shoulder Rumble Strips Details",
    category: "RumbleStrips",
    categoryAr: "المطبات الاهتزازية",
    code: "STD-RMB-SHLD",
    fileName: "الكتب.pdf"
  }
];

// Attachments files List
export const ATTACHMENTS_DATA: AttachmentItem[] = [
  {
    id: "att1",
    titleAr: "كتيب تصميم المنحنيات الرأسية ومحاور توازن الميل",
    titleEn: "Guidelines for Vertical Curves Design & Grade Balance",
    descriptionAr: "ملف PDF يشتمل على جداول حسابات K ومسافات الرؤية وقيم تصريف المنحدرات الطولية.",
    size: "4.2 MB",
    fileName: "المنحنيات.pdf"
  },
  {
    id: "att2",
    titleAr: "أبعاد وعناصر تخطيط دهانات الرصيف - المواصفة القياسية SHC 602",
    titleEn: "Pavement Marking Standard Dimensions - Code SHC 602",
    descriptionAr: "الملخص الشامل لأطوال الفواصل البيضاء المقطعة وتفاصيل دهان عيون القطط والتلوين الأصفر الجانبي الصادر عن وزارة النقل والخدمات اللوجستية.",
    size: "2.8 MB",
    fileName: "الدهانات الارضية.pdf"
  }
];
