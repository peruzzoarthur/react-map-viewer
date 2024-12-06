import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

type ScaleControlProps = {
  maxWidth: number;
  bg: string;
  textColor: string;
};

export const ScaleControl = ({
  maxWidth,
  bg,
  textColor,
}: ScaleControlProps) => {
  const map = useMap();

  useEffect(() => {
    const scaleControl = L.control.scale({
      position: "bottomleft",
      imperial: false,
      maxWidth: maxWidth,
    });

    scaleControl.addTo(map);

    // Select the scale control and its child elements
   
    const controlContainer = document.querySelector(".leaflet-control-scale");
    if (controlContainer) {
      controlContainer.classList.add("text-white");
    }

    const scaleBar = document.querySelector(".leaflet-control-scale-line");
    if (scaleBar) {
      scaleBar.classList.add(
        bg,
        textColor,
        "outline-none",
        "h-full",
        "w-full",
        "border-[0.1px]",
        "px-0",
        "flex",
        "items-center",
        "justify-center",
        "text-xs",
      );
    }
    const leafletBottomLeft = document.querySelector(
      ".leaflet-bottom.leaflet-left",
    );
    if (leafletBottomLeft) {
      leafletBottomLeft.classList.add(
        "flex",
        "space-x-0",
        "font-bold",
        "shadow-none",
      );
    }

    return () => {
      map.removeControl(scaleControl);
    };
  }, [map]);

  return null;
};
