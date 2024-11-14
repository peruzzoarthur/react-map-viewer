import { Feature, Geometry, GeoJsonProperties, BBox } from "geojson";
import { PathOptions } from "leaflet";

export type PathOptionsWithPointAttributes = PathOptions & {
  pointSize: number | undefined
}
export type FeatureWithState = Feature<Geometry, GeoJsonProperties> & {
  style: PathOptionsWithPointAttributes;
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
  name: string
};
