import { ReferenceItem, StandardDrawing, AttachmentItem } from "../types";

export const FILES_BASE = "https://engsone.github.io/traffic-dashboard";
export function fileUrl(folder: string, name: string): string {
  return `${FILES_BASE}/${encodeURIComponent(folder)}/${encodeURIComponent(name)}`;
}

// Taper Length Speed & Width Reference values
export const TAPER_SPEED_RECOMMENDATIONS = [
  { speed: 45, w15: 20, w25: 33, w275: 36, w30: 39, w325: 42, w35: 46, w375: 49 },
  { speed: 50, w15: 24, w25: 40, w275: 44, w30: 48, w325: 52, w35: 56, w375: 60 },
  { speed: 55, w15: 29, w25: 49, w275: 54, w30: 58, w325: 63, w35: 68, w375: 73 },
  { speed: 60, w15: 35, w25: 58, w275: 64, w30: 70, w325: 75, w35: 81, w375: 87 },
  { speed: 65, w15: 41, w25: 68, w275: 75, w30: 82, w325: 88, w35: 95, w375: 102 },
  { speed: 70, w15: 65, w25: 109, w275: 120, w30: 131, w325: 141, w35: 152, w375: 163 },
  { speed: 75, w15: 70, w25: 117, w275: 128, w30: 140, w325: 152, w35: 163, w375: 175 },
  { speed: 80, w15: 75, w25: 124, w275: 137, w30: 149, w325: 162, w35: 174, w375: 186 },
  { speed: 85, w15: 79, w25: 132, w275: 145, w30: 158, w325: 172, w35: 185, w375: 198 },
  { speed: 90, w15: 84, w25: 140, w275: 154, w30: 168, w325: 182, w35: 196, w375: 210 },
  { speed: 95, w15: 89, w25: 148, w275: 162, w30: 177, w325: 192, w35: 207, w375: 221 },
  { speed: 100, w15: 93, w25: 155, w275: 171, w30: 186, w325: 202, w35: 218, w375: 233 }
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
export const MIN_CURVE_RADIUS_TABLE: Record<number, Record<number, number>> = {
  // Speed as keys, then superelevation percentages as sub-keys
  20: { 4: 15, 6: 15, 8: 14, 10: 14, 12: 13 },
  30: { 4: 35, 6: 30, 8: 30, 10: 25, 12: 25 },
  40: { 4: 60, 6: 55, 8: 50, 10: 45, 12: 45 },
  50: { 4: 100, 6: 90, 8: 85, 10: 80, 12: 75 },
  60: { 4: 150, 6: 135, 8: 125, 10: 115, 12: 110 },
  70: { 4: 215, 6: 195, 8: 180, 10: 165, 12: 155 },
  80: { 4: 280, 6: 250, 8: 230, 10: 210, 12: 195 },
  90: { 4: 375, 6: 335, 8: 305, 10: 280, 12: 260 },
  100: { 4: 490, 6: 435, 8: 395, 10: 360, 12: 330 },
  110: { 4: 645, 6: 565, 8: 510, 10: 460, 12: 420 },
  120: { 4: 810, 6: 710, 8: 635, 10: 575, 12: 525 },
  130: { 4: 1030, 6: 885, 8: 790, 10: 710, 12: 645 },
  140: { 4: 1285, 6: 1100, 8: 975, 10: 875, 12: 785 }
};

// Side friction coefficients f by design speeds
export const SIDE_FRICTION_COEFFICIENTS: Record<number, number> = {
  20: 0.35, 30: 0.28, 40: 0.23, 50: 0.19, 60: 0.17, 70: 0.15,
  80: 0.14, 90: 0.13, 100: 0.12, 110: 0.11, 120: 0.09, 130: 0.08, 140: 0.07
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

// Acceleration and Deceleration lengths Basic minimum table (AASHTO / Saudi Road Code)
// Keys represent Main Road Speeds (50-160), values is records of ramp speed
export const ACCELERATION_LENGTHS: Record<number, Record<string, number>> = {
  50:  { "Stop": 60, "20": 45, "30": 30, "40": 15 },
  60:  { "Stop": 110, "20": 95, "30": 80, "40": 60, "50": 30 },
  80:  { "Stop": 230, "20": 215, "30": 200, "40": 180, "50": 150, "60": 100 },
  100: { "Stop": 375, "20": 360, "30": 345, "40": 325, "50": 295, "60": 255, "70": 200, "80": 115 },
  110: { "Stop": 460, "20": 445, "30": 430, "40": 410, "50": 380, "60": 340, "70": 285, "80": 205, "90": 100 },
  120: { "Stop": 550, "20": 535, "30": 520, "40": 500, "50": 470, "60": 430, "70": 375, "80": 295, "90": 190, "100": 70 },
  130: { "Stop": 650, "20": 630, "30": 615, "40": 595, "50": 565, "60": 525, "70": 470, "80": 390, "90": 285, "100": 165 },
  140: { "Stop": 780, "20": 760, "30": 745, "40": 725, "50": 695, "60": 655, "70": 600, "80": 520, "90": 415, "100": 295, "110": 150 },
  150: { "Stop": 910, "20": 890, "30": 875, "40": 855, "50": 825, "60": 785, "70": 730, "80": 650, "90": 545, "100": 425, "110": 280, "120": 110 },
  160: { "Stop": 1050, "20": 1030, "30": 1015, "40": 995, "50": 965, "60": 925, "70": 870, "80": 790, "90": 685, "100": 565, "110": 420, "120": 250 }
};

export const DECELERATION_LENGTHS: Record<number, Record<string, number>> = {
  50:  { "Stop": 70, "20": 60, "30": 50, "40": 35 },
  60:  { "Stop": 95, "20": 85, "30": 75, "40": 60, "50": 40 },
  80:  { "Stop": 145, "20": 135, "30": 125, "40": 115, "50": 95, "60": 70 },
  100: { "Stop": 185, "20": 180, "30": 170, "40": 160, "50": 145, "60": 130, "70": 105, "80": 75 },
  110: { "Stop": 205, "20": 200, "30": 195, "40": 185, "50": 175, "60": 160, "70": 140, "80": 115, "90": 80 },
  120: { "Stop": 235, "20": 230, "30": 220, "40": 210, "50": 200, "60": 185, "70": 170, "80": 145, "90": 115, "100": 80 },
  130: { "Stop": 265, "20": 255, "30": 245, "40": 235, "50": 225, "60": 215, "70": 200, "80": 180, "90": 150, "100": 120 },
  140: { "Stop": 295, "20": 285, "30": 275, "40": 265, "50": 255, "60": 245, "70": 230, "80": 210, "90": 180, "100": 150, "110": 120 },
  150: { "Stop": 325, "20": 315, "30": 305, "40": 295, "50": 285, "60": 275, "70": 260, "80": 240, "90": 210, "100": 180, "110": 150, "120": 110 },
  160: { "Stop": 355, "20": 345, "30": 335, "40": 325, "50": 315, "60": 305, "70": 290, "80": 270, "90": 240, "100": 210, "110": 180, "120": 140 }
};

// Grade Adjustment Factors lookup table
// values mapping [gradeClass][laneType] with factors
export const GRADE_CLASS_FACTORS: Record<string, { acc: number; dec: number }> = {
  "3_4_upgrade": { acc: 1.20, dec: 0.90 },
  "3_4_downgrade": { acc: 0.70, dec: 1.20 },
  "5_6_upgrade": { acc: 1.45, dec: 0.80 },
  "5_6_downgrade": { acc: 0.60, dec: 1.35 }
};

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
    nameAr: "كود الطرق السعودي 305 (عناصر السلامة على جوانب الطرق)",
    nameEn: "Saudi Road Code 305 (Roadside Safety)",
    code: "SRC-305",
    type: "سلامة جوانب الطرق",
    notes: "يحتوي على معايير تحديد حرم الطريق الآمن وخلوص العوائق وحواجز الحماية المعدنية والخرسانية.",
    fileName: "305_compressed.pdf"
  },
  {
    id: "src401",
    nameAr: "كود الطرق السعودي 401 (التحكم المروري للعمليات الميدانية)",
    nameEn: "Saudi Road Code 401 (Traffic Control in Work Zones)",
    code: "SRC-401",
    type: "هندسة المرور",
    notes: "يتحكم بعمليات تخطيط وتنظيم المرور في مناطق العمل المؤقتة وحساب أطوال مناطق الانتقال.",
    fileName: "401 AR.pdf"
  },
  {
    id: "src602",
    nameAr: "كود الطرق السعودي 602 (أعمال دهان وتخطيط ممرات الطرق)",
    nameEn: "Saudi Road Code 602 (Pavement Markings Manual)",
    code: "SRC-602",
    type: "العلامات المرورية",
    notes: "الدليل القياسي لأبعاد وكميات الدهانات وعيون القطط الفردية والمزدوجة والتحذيرية على الطرق.",
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
    titleAr: "تفاصيل عامة",
    titleEn: "General Construction Details",
    category: "Construction",
    categoryAr: "تفاصيل الإنشاء",
    code: "STD-CON-GEN",
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
    titleAr: "مخطط قياسي 03",
    titleEn: "Standard Drawing 03 Details",
    category: "Construction",
    categoryAr: "تفاصيل الإنشاء",
    code: "STD-DRAW-03",
    fileName: "03.pdf"
  },
  {
    id: "std_draw_28",
    titleAr: "مخطط قياسي 04",
    titleEn: "Standard Drawing 04 Details",
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
  },
  {
    id: "std_draw_30",
    titleAr: "المخطط القياسي للمطبات الاهتزازية الصوتية المستعرضة للتحذير",
    titleEn: "Standard Transverse Rumble Strips Details for Intersection Hazard Warning",
    category: "RumbleStrips",
    categoryAr: "المطبات الاهتزازية",
    code: "STD-RMB-TRANS",
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
