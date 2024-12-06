import {
  FeatureCollectionWithFilenameAndState,
  Workspace,
} from "@/index.types";
import { clsx, type ClassValue } from "clsx";
import { BBox, FeatureCollection } from "geojson";
import { LatLngTuple } from "leaflet";
import { twMerge } from "tailwind-merge";
import { saveAs } from "file-saver";
import { faker } from "@faker-js/faker";
import { FeatureCollectionWithFilename, parseZip } from "shpjs";
import JSZip from "jszip";
import parseWKT, { WktParsed } from "wkt-parser";

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

export const prepareGeoJSONForUpload = (
  featureCollection: FeatureCollectionWithFilenameAndState,
): GeoJSON.FeatureCollection => {
  return {
    type: "FeatureCollection",
    features: featureCollection.features.map((feature) => ({
      type: "Feature",
      geometry: feature.geometry,
      properties: feature.properties, // Keep only standard properties
    })),
  };
};

type AddGeoJSONProps = {
  geojson: File | FeatureCollection;
  setLoading: React.Dispatch<boolean>;
  setGeoJson: React.Dispatch<
    React.SetStateAction<FeatureCollectionWithFilename | null>
  >;
};

export const addGeoJSON = async ({
  geojson,
  setLoading,
  setGeoJson,
}: AddGeoJSONProps) => {
  setLoading(true);

  try {
    let parsedGeoJSON: FeatureCollection;

    if (geojson instanceof File) {
      if (
        geojson.type !== "application/json" &&
        !geojson.name.endsWith(".geojson")
      ) {
        throw new Error("Invalid file type. Please upload a GeoJSON file.");
      }

      const fileContent = await geojson.text();
      parsedGeoJSON = JSON.parse(fileContent);

      if (parsedGeoJSON.type !== "FeatureCollection") {
        throw new Error("Invalid GeoJSON: Must be a FeatureCollection.");
      }
    } else {
      // If it's already a GeoJSON object, validate it
      parsedGeoJSON = geojson;
      if (parsedGeoJSON.type !== "FeatureCollection") {
        throw new Error("Invalid GeoJSON: Must be a FeatureCollection.");
      }
    }

    if (geojson instanceof File) {
      setGeoJson({ ...parsedGeoJSON, fileName: geojson.name.split(".")[0] });
    } else {
      setGeoJson({
        ...parsedGeoJSON,
        fileName: `${faker.color.human()}-${faker.animal.type()}`,
      });
    }
  } catch (err) {
    console.error("Error parsing GeoJSON:", err);
  } finally {
    setLoading(false);
  }
};

// Example usage for handling file upload
export const handleGeoJsonFileUpload = async (
  event: React.ChangeEvent<HTMLInputElement>,
  setLoading: React.Dispatch<boolean>,
  setGeoJson: React.Dispatch<
    React.SetStateAction<FeatureCollectionWithFilename | null>
  >,
) => {
  const file = event.target.files?.[0];
  if (file) {
    await addGeoJSON({
      geojson: file,
      setLoading: setLoading,
      setGeoJson: setGeoJson,
    }); // Upload GeoJSON file
  }
};

type handleShapefileFileUploadProps = {
  event: React.ChangeEvent<HTMLInputElement>;
  setLoading: React.Dispatch<boolean>;
  setGeoJson: React.Dispatch<
    React.SetStateAction<FeatureCollectionWithFilename | null>
  >;
  setWorkspaceError: React.Dispatch<string | null>;
  setIsWorkspaceError: React.Dispatch<boolean>;
  setIsOpenPreview: React.Dispatch<boolean>;
  setWktParsed: React.Dispatch<WktParsed | null>;
};

export const handleShapefileFileUpload = async ({
  event,
  setLoading,
  setGeoJson,
  setWorkspaceError,
  setIsWorkspaceError,
  setIsOpenPreview,
  setWktParsed,
}: handleShapefileFileUploadProps) => {
  const files = event.target.files;

  if (files && files.length > 0) {
    checkESRIShapefiles(files, setWorkspaceError, setIsWorkspaceError);
    setLoading(true);
    try {
      const zip = new JSZip();

      for (const file of files) {
        const filePath = file.webkitRelativePath || file.name;

        if (filePath.endsWith(".prj")) {
          const prjContent = await file.text();
          try {
            const parsedCRS = parseWKT(prjContent);
            setWktParsed(parsedCRS);
          } catch (err) {
            console.error("Error parsing WKT:", err);
          }
        }

        const arrayBuffer = await file.arrayBuffer();
        zip.file(file.name, arrayBuffer);
      }

      const zippedBuffer = await zip.generateAsync({ type: "arraybuffer" });
      const geoJsonData = await parseZip(zippedBuffer);
      setGeoJson(geoJsonData as FeatureCollectionWithFilename);
      setIsOpenPreview(true);
    } catch (error) {
      console.error("Error parsing shapefile:", error);
    } finally {
      setLoading(false);
    }
  }
};

export const handleGeoJSONObjectUpload = async (
  geojson: FeatureCollection,

  setLoading: React.Dispatch<boolean>,
  setGeoJson: React.Dispatch<
    React.SetStateAction<FeatureCollectionWithFilename | null>
  >,
) => {
  await addGeoJSON({
    geojson: geojson,
    setLoading: setLoading,
    setGeoJson: setGeoJson,
  }); 
};
