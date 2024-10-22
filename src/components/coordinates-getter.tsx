import { useMapEvent } from "react-leaflet";

export const CoordsFinderDummy = ({
  setOnHoverCoord,
}: {
  setOnHoverCoord: React.Dispatch<
    React.SetStateAction<
      | {
          lat: number;
          lng: number;
        }
      | null
      | undefined
    >
  >;
}) => {
  useMapEvent("mousemove", (e) => {
    setOnHoverCoord(e.latlng);
  });
  return null;
};
