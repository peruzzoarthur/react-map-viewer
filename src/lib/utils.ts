import { Workspace } from "@/index.types";
import { clsx, type ClassValue } from "clsx";
import { BBox } from "geojson";
import { LatLngTuple } from "leaflet";
import { twMerge } from "tailwind-merge";
import { saveAs } from "file-saver";

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

export const saveWorkspace = async (workspace: Workspace) => {
  try {
    const json = JSON.stringify(workspace, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    saveAs(blob, "workspace.json");
  } catch (error) {
    console.error("Failed to save workspace:", error);
  }
};

export const loadWorkspace = async (
  workspaceJson: Blob,
  setWorkspace: React.Dispatch<Workspace>,
) => {
  try {
    const jsonText = await workspaceJson.text();
    const workspaceData = JSON.parse(jsonText) as Workspace;
    setWorkspace(workspaceData);
  } catch (error) {
    console.error("Failed to load workspace:", error);
  }
};
