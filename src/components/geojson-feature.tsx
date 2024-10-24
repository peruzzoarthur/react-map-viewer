import {
  FeatureCollectionWithFilenameAndState,
  FeatureWithState,
} from "@/index.types";
import { GeoJSON } from "react-leaflet";
import L from "leaflet";
type GeoJsonFeatureProps = {
  featureCollection: FeatureCollectionWithFilenameAndState[];
};

export const GeoJsonFeature = ({ featureCollection }: GeoJsonFeatureProps) => {
  console.log("Rendering GeoJsonFeature with collection: ", featureCollection);

  return (
    <>
      {featureCollection
        .filter((file) => file.visible) // Only show visible layers
        .map((geoJson, index) => (
          <GeoJSON
            key={`${geoJson.fileName}_${index}`} // Use updatedAt to force re-render
            style={function (geoJsonFeature) {
              const feature = geoJsonFeature as unknown as FeatureWithState;
              console.log(feature.style);
              return feature.style;
            }}
            data={geoJson}
            eventHandlers={{
              click: () => {
                console.log(geoJson.features);
              },
            }}
            pointToLayer={function (_geoJsonPoint, latlng) {
              return L.circleMarker(latlng);
            }}
          ></GeoJSON>
        ))}
    </>
  );
};
