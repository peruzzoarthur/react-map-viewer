import { clsx, type ClassValue } from "clsx";
import { BBox } from "geojson";
import { LatLngTuple } from "leaflet";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRandomColor = (): string => {
  const colors = ["#370665", "#35589A", "#F14A16", "#FC9918"];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

export const getBoundingBoxCenter = (
  bbox: BBox | undefined
): LatLngTuple | undefined => {
  if (!bbox) {
    return;
  }
  const [minLng, minLat, maxLng, maxLat] = bbox;

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  return [centerLat, centerLng];
};
