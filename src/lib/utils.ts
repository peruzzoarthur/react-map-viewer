import { clsx, type ClassValue } from "clsx";
import { BBox } from "geojson";
import { LatLngTuple } from "leaflet";
import { twMerge } from "tailwind-merge";

type KeyValuePair = { key: string; value: string };

enum Color {
  Purple = "#370665",
  Blue = "#35589A",
  Orange = "#F14A16",
  Yellow = "#FC9918",
  Green = "#7ED4AD",
  Pink = "#D76C82",
  Red = "#F95454",
  Cyan = "#77CDFF",
  Emerald = "#41B3A2",
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRandomColor = (): string => {
  const colors = Object.values(Color);
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

export const getBoundingBoxCenter = (
  bbox: BBox | undefined,
): LatLngTuple | undefined => {
  if (!bbox) {
    return;
  }
  const [minLng, minLat, maxLng, maxLat] = bbox;

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  return [centerLat, centerLng];
};

// Label Styling Utils
export const updateClass = (
  classString: string,
  newClass: string,
  classPrefix: string,
): string => {
  return [
    newClass,
    ...classString
      .replace(new RegExp(`\\b${classPrefix}-\\S+`, "g"), "")
      .trim()
      .split(/\s+/),
  ]
    .join(" ")
    .trim();
};

export const updateSizedClass = (
  classString: string,
  newClass: string,
  classPrefix: string,
): string => {
  const sizePattern = new RegExp(`\\b${classPrefix}-(xs|sm|base|lg)\\b`, "g");
  return [newClass, ...classString.replace(sizePattern, "").trim().split(/\s+/)]
    .join(" ")
    .trim();
};
export const updateColoredClass = (
  classString: string,
  newClass: string,
  classPrefix: string,
): string => {
  const sizePattern = new RegExp(`\\b${classPrefix}-(white|black)\\b`, "g");
  return [newClass, ...classString.replace(sizePattern, "").trim().split(/\s+/)]
    .join(" ")
    .trim();
};

export const backgroundColors: KeyValuePair[] = [
  { key: "black", value: "bg-black" },
  { key: "white", value: "bg-white" },
  { key: "transparent", value: "bg-transparent" },
];

export const getBackgroundColor = (
  backgroundColor: string,
): { key: string; value: string } | undefined => {
  return backgroundColors.find((color) => color.value === backgroundColor);
};

export const updateBackgroundClass = (
  classString: string,
  newBackground: string,
): string => {
  return updateClass(classString, newBackground, "bg");
};

export const borderSizes: KeyValuePair[] = [
  { key: "none", value: "border-none" },
  { key: "thin", value: "border-1" },
  { key: "thick", value: "border-2" },
];

export const getBorderSize = (
  borderSize: string,
): { key: string; value: string } | undefined => {
  return borderSizes.find((size) => size.value === borderSize);
};

export const updateBorderClass = (
  classString: string,
  newBorder: string,
): string => {
  return updateClass(classString, newBorder, "border");
};

export const textSizes: KeyValuePair[] = [
  { key: "extra small", value: "text-xs" },
  { key: "small", value: "text-sm" },
  { key: "medium", value: "text-base" },
  { key: "large", value: "text-lg" },
];

export const getTextSize = (
  textSize: string,
): { key: string; value: string } | undefined => {
  return textSizes.find((size) => size.value === textSize);
};

export const updateTextSizeClass = (
  classString: string,
  newTextSize: string,
): string => {
  return updateSizedClass(classString, newTextSize, "text");
};

export const textColors: KeyValuePair[] = [
  { key: "white", value: "text-white" },
  { key: "black", value: "text-black" },
];

export const getTextColor = (
  textColor: string,
): { key: string; value: string } | undefined => {
  return textColors.find((size) => size.value === textColor);
};

export const updateTextColorClass = (
  classString: string,
  newTextSize: string,
): string => {
  return updateColoredClass(classString, newTextSize, "text");
};

export const shadowValues: KeyValuePair[] = [
  { key: "none", value: "shadow-none" },
  { key: "shadow", value: "shadow-1" },
];

export const getShadowValue = (
  shadowValue: string,
): { key: string; value: string } | undefined => {
  return shadowValues.find((size) => size.value === shadowValue);
};

export const updateShadowValue = (
  classString: string,
  newShadow: string,
): string => {
  return updateClass(classString, newShadow, "shadow");
};
