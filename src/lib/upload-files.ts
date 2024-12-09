import { FeatureCollectionWithFilenameAndState } from "@/index.types";
import { FeatureCollection } from "geojson";
import JSZip from "jszip";
import { FeatureCollectionWithFilename, parseZip } from "shpjs";

export const prepareGeoJSONForUpload = (
  featureCollection: FeatureCollectionWithFilenameAndState,
): GeoJSON.FeatureCollection => {
  return {
    type: "FeatureCollection",
    features: featureCollection.features.map((feature) => ({
      type: "Feature",
      geometry: feature.geometry,
      properties: feature.properties,
    })),
  };
};

type HandleGeoJsonFileUploadProps = {
  event: React.ChangeEvent<HTMLInputElement>;
  setLoading: React.Dispatch<boolean>;
  setGeoJson: React.Dispatch<
    React.SetStateAction<FeatureCollectionWithFilename | null>
  >;
  setWorkspaceError: React.Dispatch<string | null>;
  setIsWorkspaceError: React.Dispatch<boolean>;
  setIsOpenPreview: React.Dispatch<boolean>;
};

export const handleGeoJsonFileUpload = async ({
  event,
  setLoading,
  setGeoJson,
  setWorkspaceError,
  setIsWorkspaceError,
  setIsOpenPreview,
}: HandleGeoJsonFileUploadProps) => {
  const geojson = event.target.files?.[0];
  if (geojson) {
    setLoading(true);

    try {
      if (
        geojson.type !== "application/json" &&
        !geojson.name.endsWith(".geojson")
      ) {
        setWorkspaceError("Invalid file type. Please upload a GeoJSON file.");
        setIsWorkspaceError(true);
      }

      const fileContent = await geojson.text();
      const parsedGeoJSON: FeatureCollection = JSON.parse(fileContent);

      if (parsedGeoJSON.type !== "FeatureCollection") {
        setWorkspaceError("Invalid GeoJSON: Must be a FeatureCollection");
        setIsWorkspaceError(true);
      }

      setGeoJson({ ...parsedGeoJSON, fileName: geojson.name.split(".")[0] });
      setIsOpenPreview(true);
    } catch (err) {
      console.error("Error parsing GeoJSON:", err);
      setWorkspaceError(`Error parsing GeoJSON: ${err}`);
      setIsWorkspaceError(true);
    } finally {
      setLoading(false);
    }
  }
};

export const checkESRIShapefiles = (
  files: FileList,
  setWorkspaceError: React.Dispatch<string | null>,
  setIsWorkspaceError: React.Dispatch<boolean>,
) => {
  // Required ESRI file extensions
  const requiredExtensions = [".shp", ".shx", ".dbf", ".prj"];
  const optionalExtensions = [".cpg", ".qmd"];
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

type HandleShapefileFileUploadProps = {
  event: React.ChangeEvent<HTMLInputElement>;
  setLoading: React.Dispatch<boolean>;
  setGeoJson: React.Dispatch<
    React.SetStateAction<FeatureCollectionWithFilename | null>
  >;
  setWorkspaceError: React.Dispatch<string | null>;
  setIsWorkspaceError: React.Dispatch<boolean>;
  setIsOpenPreview: React.Dispatch<boolean>;
};
export const handleShapefileFileUpload = async ({
  event,
  setLoading,
  setGeoJson,
  setWorkspaceError,
  setIsWorkspaceError,
  setIsOpenPreview,
}: HandleShapefileFileUploadProps) => {
  const files = event.target.files;

  if (files && files.length > 0) {
    checkESRIShapefiles(files, setWorkspaceError, setIsWorkspaceError);
    setLoading(true);
    try {
      const zip = new JSZip();

      for (const file of files) {
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
