import {
  FeatureCollectionWithFilenameAndState,
  FeatureWithState,
} from "@/index.types";
import { GeoJSON, Pane } from "react-leaflet";
import L from "leaflet";
import  uuid4   from 'uuid4';


type GeoJsonFeatureProps = {
  featureCollection: FeatureCollectionWithFilenameAndState;
};

export const GeoJsonFeatures = ({ featureCollection }: GeoJsonFeatureProps) => {
  const zIndex = featureCollection.position * 100 + 500

  const paneName = featureCollection.fileName ?? uuid4() 
  return (
    <Pane name={paneName} style={{zIndex: zIndex}}> 
    <GeoJSON
    style={function (geoJsonFeature) {
      const feature = geoJsonFeature as unknown as FeatureWithState;
      return feature.style;
    }}
    data={featureCollection}
    
    pointToLayer={function (_geoJsonPoint, latlng) {
      const marker = L.circleMarker(latlng, {radius: 5, pane: paneName});
      return marker;
    }}
    ></GeoJSON>
    </Pane>
  );
};


// pointToLayer={function (_geoJsonPoint, latlng) {
//      const marker = L.circleMarker(latlng);
//      // marker.setStyle({ fillColor: "green" });
//      return marker;
//    }}
