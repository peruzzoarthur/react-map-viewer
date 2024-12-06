import { FeatureCollectionWithFilenameAndState } from "@/index.types";
import { getRandomColor, prepareGeoJSONForUpload } from "./utils";
import { FeatureCollection } from "geojson";
import { axiosInstance } from "@/api";
import { FeatureCollectionWithFilename } from "shpjs";

type RequestBody = {
  geoJSON: FeatureCollection;
  distance: number;
  srid: number;
};

export const createBuffers = async (
  featureCollection: FeatureCollectionWithFilenameAndState,
  addFileToWorkspace: (file: FeatureCollectionWithFilename, color: string) => void
) => {
  const prepare = prepareGeoJSONForUpload(featureCollection);
  console.log({...prepare, fileName: `${featureCollection.fileName}_buffer`})
  const requestBody: RequestBody = {
    geoJSON: prepare,
    distance: 5,
    srid: 3857
  }

  const {data}: {data: FeatureCollection} = await axiosInstance.post('/shapes/buffer', requestBody)

  const bufferedFileCollectionWithFilename: FeatureCollectionWithFilename = {...data, fileName: `${featureCollection.fileName}_buffer` }
  const color = getRandomColor()
  addFileToWorkspace(bufferedFileCollectionWithFilename, color)

};
