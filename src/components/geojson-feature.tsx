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
  return (
    <>
      {featureCollection
        .filter((file) => file.visible) // Only show visible layers
        .map((geoJson, index) => (
          <GeoJSON
            key={`${geoJson.fileName}_${index}`}
            style={function (geoJsonFeature) {
              const feature = geoJsonFeature as unknown as FeatureWithState;
              return feature.style;
            }}
            data={geoJson}
            eventHandlers={{
              click: () => {
                console.log(geoJson.features);
              },
            }}
            // attribution="a polygon"
            pointToLayer={function (_geoJsonPoint, latlng) {
              // console.log(geoJsonPoint.properties);
              return L.circleMarker(latlng);
            }}
          ></GeoJSON>
        ))}
    </>
  );
};
