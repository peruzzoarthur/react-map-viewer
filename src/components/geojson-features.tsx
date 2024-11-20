import {
  FeatureCollectionWithFilenameAndState,
  FeatureWithState,
} from "@/index.types";
import { GeoJSON, Pane } from "react-leaflet";
import L from "leaflet";
import uuid4 from "uuid4";
import { useEffect, useState } from "react";

type GeoJsonFeatureProps = {
  featureCollection: FeatureCollectionWithFilenameAndState;
};

export const GeoJsonFeatures = ({ featureCollection }: GeoJsonFeatureProps) => {
  const [paneName, setPaneName] = useState(
    featureCollection.fileName ?? uuid4(),
  );
  const [showLayer, setShowLayer] = useState(true);
  const zIndex = featureCollection.position * 100 + 500;

  useEffect(() => {
    setPaneName(featureCollection.fileName ?? uuid4());
    setShowLayer(false);
    const timeout = setTimeout(() => setShowLayer(true), 0);
    return () => clearTimeout(timeout);
  }, [zIndex, featureCollection.fileName]);

  return showLayer ? (
    <Pane name={paneName} style={{ zIndex }}>
      <GeoJSON
        style={(geoJsonFeature) => {
          const feature = geoJsonFeature as unknown as FeatureWithState;
          return feature.style;
        }}
        data={featureCollection}
        pointToLayer={(geoJsonPoint, latlng) => {
          const featureWithState = geoJsonPoint as FeatureWithState;
          const marker = L.circleMarker(latlng, {
            radius: featureWithState.style.pointSize ?? 5,
            pane: paneName,
          });
          return marker;
        }}
        onEachFeature={(feature, layer) => {
          const featureWithState = feature as FeatureWithState;
          if (
            featureWithState.style.label.isLabel &&
            featureWithState.style.label.attribute
          ) {
            layer.bindTooltip(featureWithState.style.label.attribute, featureWithState.style.label.style);
          }
        }}
      />
    </Pane>
  ) : null;
};
