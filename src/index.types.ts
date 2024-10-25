import { Feature, Geometry, GeoJsonProperties, BBox } from "geojson";
import { PathOptions } from "leaflet";

export type FeatureWithState = Feature<Geometry, GeoJsonProperties> & {
  style: PathOptions;
  selected: boolean;
};

export type FeatureCollectionWithFilenameAndState = {
  fileName: string | undefined;
  type: "FeatureCollection";
  features: FeatureWithState[];
  bbox?: BBox | undefined;
  visible: boolean;
  // style: PathOptions;
  selected: boolean;
  updatedAt: number;
  position: number;
};

export type Workspace = {
  featureCollections: FeatureCollectionWithFilenameAndState[] | [];
  updatedAt: number;
};
