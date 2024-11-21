import { Eye, EyeClosed, Map } from "lucide-react";
import { Button } from "./ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  FeatureCollectionWithFilenameAndState,
  TileLayerOptions,
} from "@/index.types";

type TileLayerProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<boolean>;
  featureCollection?: FeatureCollectionWithFilenameAndState;
  filename?: string;
  setTileLayerOptions: React.Dispatch<TileLayerOptions>;
};

export const TileLayer = ({
  isVisible,
  setIsVisible,
  featureCollection,
  filename,
  setTileLayerOptions,
}: TileLayerProps) => {
  if (!filename) {
    filename = featureCollection?.fileName;
  }

  return (
    <div className="flex w-full items-center space-x-1 cursor-pointer">
      {isVisible ? (
        <Button variant="ghost" onClick={() => setIsVisible(false)}>
          <Eye />
        </Button>
      ) : (
        <Button variant="ghost" onClick={() => setIsVisible(true)}>
          <EyeClosed />
        </Button>
      )}

      <ContextMenu>
        <ContextMenuTrigger>
          <div className="flex space-x-1 hover:bg-white hover:bg-opacity-0">
            <p className="text-sm">{filename}</p>
            <Map />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="z-[1000]">
          <ContextMenuItem
            onSelect={() => {
              setTileLayerOptions({
                attribution:
                  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                url: " https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
              });
            }}
          >
            Dark
          </ContextMenuItem>
          <ContextMenuItem
            onSelect={() => {
              setTileLayerOptions({
                attribution:
                  "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
                url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
              });
            }}
          >
            Satellite
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};
