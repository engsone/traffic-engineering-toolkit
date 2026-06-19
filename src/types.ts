/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CalculationRecord {
  id: string;
  calculatorId: string;
  calculatorName: string;
  timestamp: string;
  inputs: Record<string, number | string>;
  results: Record<string, number | string>;
  units: Record<string, string>;
  notes?: string;
  isSafe?: boolean;
}

export interface ReferenceItem {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
  type: string;
  notes: string;
  link?: string;
  fileName?: string;
}

export interface StandardDrawing {
  id: string;
  titleAr: string;
  titleEn: string;
  category: string;
  categoryAr: string;
  code: string;
  isFavorite?: boolean;
  fileName?: string;
}

export interface AttachmentItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  size: string;
  url?: string;
  fileName?: string;
}
