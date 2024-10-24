import { Feature, Geometry, GeoJsonProperties, BBox } from "geojson";
import { PathOptions } from "leaflet";

// Extend the Feature type to include `style` and `selected`
export type FeatureWithState = Feature<Geometry, GeoJsonProperties> & {
  style: PathOptions;
  selected: boolean;
};

// Extend FeatureCollectionWithFilename to include the new feature type
export type FeatureCollectionWithFilenameAndState = {
  fileName: string | undefined;
  type: "FeatureCollection";
  features: FeatureWithState[]; // Use the extended Feature type
  bbox?: BBox | undefined;
  visible: boolean;
  // style: PathOptions;
  selected: boolean;
};

export type Workspace = {
  featureCollections: FeatureCollectionWithFilenameAndState[] | [];
  updatedAt: number;
};
