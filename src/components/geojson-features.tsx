import {
  FeatureCollectionWithFilenameAndState,
  FeatureWithState,
} from "@/index.types";
import { GeoJSON } from "react-leaflet";
import L from "leaflet";
type GeoJsonFeatureProps = {
  featureCollection: FeatureCollectionWithFilenameAndState;
};

export const GeoJsonFeatures = ({ featureCollection }: GeoJsonFeatureProps) => {
  console.log("Rendering GeoJsonFeature with collection: ", featureCollection);

  return (
    <GeoJSON
      style={function (geoJsonFeature) {
        const feature = geoJsonFeature as unknown as FeatureWithState;
        // console.log(feature.style);
        return feature.style;
      }}
      data={featureCollection}
      // eventHandlers={{
      //   click: () => {
      //     console.log(featureCollection.features);
      //   },
      // }}
      pointToLayer={function (_geoJsonPoint, latlng) {
        return L.circleMarker(latlng);
      }}
    ></GeoJSON>
  );
};
