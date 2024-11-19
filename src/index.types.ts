import { Feature, Geometry, GeoJsonProperties, BBox } from "geojson";
import { PathOptions } from "leaflet";

export type Label = {
  isLabel: boolean
  labelName: string | undefined
  attribute: string | null
}

export type PathOptionsWithPointAttributes = PathOptions & {
  pointSize: number | undefined
  label: Label
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
  selected: boolean;
  updatedAt: number;
  position: number;
};

export type Workspace = {
  featureCollections: FeatureCollectionWithFilenameAndState[] | [];
  updatedAt: number;
  name: string
};
