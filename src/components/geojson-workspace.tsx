import { FeatureCollectionWithFilenameAndState } from "@/index.types";
import { GeoJsonFeatures } from "./geojson-features";

type GeoJsonWorkspaceProps = {
  workspace: FeatureCollectionWithFilenameAndState[];
};

export const GeoJsonWorkspace = ({ workspace }: GeoJsonWorkspaceProps) => {
  return workspace
    .filter((file) => file.visible) // Only show visible layers
    .map((featureCollection) => (
      <GeoJsonFeatures
        featureCollection={featureCollection}
        key={`${featureCollection.fileName}_${featureCollection.updatedAt}`}
      />
    ));
};
