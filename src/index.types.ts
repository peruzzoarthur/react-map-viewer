import { Feature, Geometry, GeoJsonProperties, BBox } from "geojson";
import { PathOptions, TooltipOptions } from "leaflet";

export type CustomTooltipOptions = TooltipOptions & { backgroundColor: string, border: string, textColor: string, textSize: string, shadow: string };

export type Label = {
  isLabel: boolean;
  labelName: string | undefined;
  attribute: string | null;
  style: CustomTooltipOptions;
};

export type PathOptionsWithPointAttributes = PathOptions & {
  pointSize: number | undefined;
  label: Label;
};

export type FeatureWithState = Feature<Geometry, GeoJsonProperties> & {
  style: PathOptionsWithPointAttributes;
  selected: boolean;
};

export type FeatureCollectionWithFilenameAndState = {
  fileName: string | undefined;
  colorSchema: ColorSchema; 
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
  name: string;
};

export type TileLayerOptions = {
  attribution: string;
  url: string;
};

export enum ColorSchema  {
   SINGLE = 'single',
   CATEGORIZED = 'categorized',
}
