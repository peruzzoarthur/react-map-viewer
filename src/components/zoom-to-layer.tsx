import * as L from "leaflet";
import { FeatureCollectionWithFilenameAndState } from "@/index.types";
import { ContextMenuItem } from "@radix-ui/react-context-menu";

type ZoomToLayerProps = {
  featureCollection: FeatureCollectionWithFilenameAndState | undefined
  mapInstance: L.Map
}
const ZoomToLayer = ({ featureCollection, mapInstance }: ZoomToLayerProps) => {
  const handleZoomToLayer = () => {
    if (featureCollection && mapInstance) {
      const layer = L.geoJSON(featureCollection);
      const bounds = layer.getBounds();
      mapInstance.fitBounds(bounds);
    }
  };

  return (
    <ContextMenuItem onClick={handleZoomToLayer}>
      Zoom to layer
    </ContextMenuItem>
  );
};

export default ZoomToLayer;

