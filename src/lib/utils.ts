import { Workspace } from "@/index.types";
import { clsx, type ClassValue } from "clsx";
import { BBox } from "geojson";
import { LatLngTuple } from "leaflet";
import { twMerge } from "tailwind-merge";
import { saveAs } from "file-saver";

type KeyValuePair = { key: string; value: string }

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
    saveAs(blob, `${workspace.name}.json`);
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

export const checkESRIShapefiles = (
  files: FileList,
  setWorkspaceError: React.Dispatch<string | null>,
  setIsWorkspaceError: React.Dispatch<boolean>,
) => {
  // Required ESRI file extensions
  const requiredExtensions = [".shp", ".shx", ".dbf", ".prj"];
  const optionalExtensions = [".cpg"];
  const allValidExtensions = [...requiredExtensions, ...optionalExtensions];

  const baseNames = new Set<string>();
  const invalidFiles: string[] = [];

  // Check if all files have the same base name and valid extensions
  for (const file of files) {
    const fileName = file.name;
    const fileExtension = fileName
      .slice(fileName.lastIndexOf("."))
      .toLowerCase();
    const baseName = fileName.slice(0, fileName.lastIndexOf("."));

    // Validate extension
    if (!allValidExtensions.includes(fileExtension)) {
      invalidFiles.push(fileName);
    }

    baseNames.add(baseName); // Track unique base names
  }

  if (invalidFiles.length > 0) {
    setWorkspaceError(
      `Invalid file types found: ${invalidFiles.join(", ")}. Ensure all files are valid ESRI Shapefiles.`,
    );
    setIsWorkspaceError(true);
    return;
  }

  if (baseNames.size > 1) {
    setWorkspaceError(
      "All files must have the same base name. Ensure your shapefile components match.",
    );
    setIsWorkspaceError(true);
    return;
  }

  // Check if required extensions are present
  const extensionsInFiles = Array.from(files).map((file) =>
    file.name.slice(file.name.lastIndexOf(".")).toLowerCase(),
  );

  const missingExtensions = requiredExtensions.filter(
    (ext) => !extensionsInFiles.includes(ext),
  );

  if (missingExtensions.length > 0) {
    setWorkspaceError(
      `Missing required shapefile components: ${missingExtensions.join(", ")}.`,
    );
    setIsWorkspaceError(true);
    return;
  }
};

export const updateClass = (classString: string, newClass: string, classPrefix: string): string => {
  return [newClass, ...classString
    .replace(new RegExp(`\\b${classPrefix}-\\S+`, 'g'), '') // Remove existing `classPrefix-(any)` class
    .trim()                                                 // Remove extra spaces
    .split(/\s+/)                                           // Split classes into an array
  ].join(' ')                                               // Rejoin the classes with the new one at the start
    .trim();
};

export const updateSizedClass = (classString: string, newClass: string, classPrefix: string): string => {
  const sizePattern = new RegExp(`\\b${classPrefix}-(xs|sm|base|lg)\\b`, 'g'); // Match only size-specific classes
  return [newClass, ...classString
    .replace(sizePattern, '') // Remove only size-specific classes
    .trim()                   // Remove extra spaces
    .split(/\s+/)             // Split classes into an array
  ].join(' ')                 // Rejoin the classes with the new one at the start
    .trim();
};


export const backgroundColors: KeyValuePair[] = [
  { key: "black", value: "bg-black" },
  { key: "white", value: "bg-white" },
  { key: "transparent", value: "bg-transparent" },
];

export const getBackgroundColor = (
  backgroundColor: string
): { key: string; value: string } | undefined => {
  return backgroundColors.find((color) => color.value === backgroundColor);
}

export const updateBackgroundClass = (classString: string, newBackground: string): string => {
  return updateClass(classString, newBackground, 'bg');
};

export const borderSizes: KeyValuePair[] = [
  { key: "none", value: "border-none" },
  { key: "thin", value: "border-1" },
  { key: "thick", value: "border-2" }
]

export const getBorderSize = (
borderSize: string
): {key: string; value: string} | undefined => {
  return borderSizes.find((size) => size.value === borderSize)
}

export const updateBorderClass = (classString: string, newBorder: string): string => {
  return updateClass(classString, newBorder, 'border');
};

export const textSizes: KeyValuePair[] = [
  {key: "extra small", value: "text-xs"},
  {key: "small", value: "text-sm"},
  {key: "medium", value: "text-base"},
  {key: "large", value: "text-lg"}
] 

export const getTextSize = (
textSize: string
): {key: string; value: string} | undefined => {
  return textSizes.find((size) => size.value === textSize)
}
export const updateTextSizeClass = (classString: string, newTextSize: string): string => {
  return updateSizedClass(classString, newTextSize, 'text');
};
