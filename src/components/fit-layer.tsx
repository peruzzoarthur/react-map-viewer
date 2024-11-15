import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export const FitLayer = ({ layerData }: { layerData: GeoJSON.FeatureCollection | GeoJSON.Feature }) => {
  const map = useMap();

  useEffect(() => {
    if (!layerData) return;

    // Create a GeoJSON layer to calculate bounds
    const geoJsonLayer = L.geoJSON(layerData);

    // Get the bounds of the layer
    const bounds = geoJsonLayer.getBounds();

    // Fit the map to the bounds
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 }); // Add padding and max zoom
    }
  }, [layerData, map]);

  return null; // This component only adjusts the view, no rendering
};

export default FitLayer;

