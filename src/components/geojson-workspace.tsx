import { Workspace } from "@/index.types";
import { GeoJsonFeatures } from "./geojson-features";

type GeoJsonWorkspaceProps = {
  workspace: Workspace;
};

export const GeoJsonWorkspace = ({ workspace }: GeoJsonWorkspaceProps) => {
  return workspace.featureCollections
    .filter((file) => file.visible) // Only show visible layers
    .map((featureCollection) => (
      <GeoJsonFeatures
        featureCollection={featureCollection}
        key={`${featureCollection.fileName}_${featureCollection.updatedAt}`}
      />
    ));
};
