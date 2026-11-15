/**
 * Nepal Map Data - 77 Districts and 7 Provinces
 * Provides SVG vector paths, province mappings, and geographic metadata.
 */

import {
  DISTRICTS as RAW_DISTRICTS,
  PROVINCES as RAW_PROVINCES,
  DISTRICT_PROVINCE,
  PROVINCE_COLORS,
} from 'nepal-district-map/data';

export interface DistrictItem {
  id: string;
  name: string;
  province: string;
  pathD: string;
  d: string;
  cx: number;
  cy: number;
}

export interface ProvinceItem {
  name: string;
  color: string;
  stroke: string;
  districts: string[];
}

export const DISTRICTS: DistrictItem[] = RAW_DISTRICTS.map((d) => ({
  id: d.id,
  name: d.name,
  province: DISTRICT_PROVINCE[d.name] || 'Nepal',
  pathD: d.d,
  d: d.d,
  cx: d.cx,
  cy: d.cy,
}));

export const PROVINCES: ProvinceItem[] = RAW_PROVINCES;
export { DISTRICT_PROVINCE, PROVINCE_COLORS };

// Unified Single Country Silhouette of Nepal (No district divisions)
export const NEPAL_COUNTRY_PATH = RAW_DISTRICTS.map((d) => d.d).join(' ');

