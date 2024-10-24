import { FeatureCollectionWithFilenameAndState } from "@/index.types";
import { getBoundingBoxCenter } from "@/lib/utils";
import { LatLngTuple } from "leaflet";
import { FC, useEffect } from "react";
import { useMap } from "react-leaflet";

export const MapController: FC<{
  selectedFile: FeatureCollectionWithFilenameAndState | null;
}> = ({ selectedFile }) => {
  const map = useMap();
  const flyToDuration = 1.5;

  const flyTo = (location: LatLngTuple) => {
    map.flyTo(location, 10, {
      animate: true,
      duration: flyToDuration,
    });
  };

  //   const flyToCenter = () => {
  //     map.flyTo([59.914, 10.734], 13, {
  //       animate: true,
  //       duration: flyToDuration,
  //     });
  //   };

  useEffect(() => {
    if (selectedFile) {
      const center = getBoundingBoxCenter(
        selectedFile.features[0].geometry.bbox
      );
      console.log(center);
      console.log(selectedFile);
      if (center) {
        flyTo(center);
      }
      //   flyToCenter();
    }
  }, [selectedFile]);

  return null;
};
