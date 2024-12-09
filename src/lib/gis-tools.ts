import { FeatureCollectionWithFilenameAndState } from "@/index.types";
import { getRandomColor } from "./utils";
import { FeatureCollection } from "geojson";
import { FeatureCollectionWithFilename } from "shpjs";
import { axiosInstance } from "./api";
import { prepareGeoJSONForUpload } from "./upload-files";

type RequestBody = {
  geoJSON: FeatureCollection;
  distance: number;
  srid: number;
};

export const createBuffers = async (
  featureCollection: FeatureCollectionWithFilenameAndState,
  addFileToWorkspace: (
    file: FeatureCollectionWithFilename,
    color: string,
  ) => void,
) => {
  const prepare = prepareGeoJSONForUpload(featureCollection);
  const requestBody: RequestBody = {
    geoJSON: prepare,
    distance: 0.01,
    srid: 3857,
  };

  const { data }: { data: FeatureCollection } = await axiosInstance.post(
    "/shapes/buffer",
    requestBody,
  );

  const bufferedFileCollectionWithFilename: FeatureCollectionWithFilename = {
    ...data,
    fileName: `${featureCollection.fileName}_buffer`,
  };
  const color = getRandomColor();
  addFileToWorkspace(bufferedFileCollectionWithFilename, color);
};
