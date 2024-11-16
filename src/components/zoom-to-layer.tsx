import { useMap } from "react-leaflet";
import * as L from "leaflet";
import { forwardRef, useImperativeHandle } from "react";
import { FeatureCollectionWithFilenameAndState } from "@/index.types";

export type ZoomToLayerRef = {
  fitLayerBounds: (
    featureCollection: FeatureCollectionWithFilenameAndState,
  ) => void;
};

export const ZoomToLayer = forwardRef(({ }, ref) => {
  const map = useMap();

  useImperativeHandle(ref, () => ({
    fitLayerBounds: (
      featureCollection: FeatureCollectionWithFilenameAndState,
    ) => {
      const layer = L.geoJSON(featureCollection);
      const bounds = layer.getBounds();
      map.fitBounds(bounds);
    },
  }));

  return null;
});
