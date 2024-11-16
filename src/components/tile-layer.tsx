import { Eye, EyeClosed, Map } from "lucide-react";
import { Button } from "./ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { StyleDialog } from "./style-dialog";
import { FeatureCollectionWithFilenameAndState, PathOptionsWithPointAttributes } from "@/index.types";

type TileLayerProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<boolean>;
  featureCollection?: FeatureCollectionWithFilenameAndState;
  filename?: string;
  changeStyle: (
    file: FeatureCollectionWithFilenameAndState,
    style: PathOptionsWithPointAttributes,
  ) => void;

  selectedLayer: FeatureCollectionWithFilenameAndState | null;
  setSelectedLayer: React.Dispatch<
    React.SetStateAction<FeatureCollectionWithFilenameAndState | null>
  >;
  isStyleDialogOpen: boolean;
  setIsStyleDialogOpen: React.Dispatch<boolean>;
};

export const TileLayer = ({
  isVisible,
  setIsVisible,
  featureCollection,
  filename,
  changeStyle,
  selectedLayer,
  setSelectedLayer,
  isStyleDialogOpen,
  setIsStyleDialogOpen,
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
            <p
              className={filename === selectedLayer?.fileName ? "font-bold" : ""}
            >
              {filename}
            </p>
            <Map />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="z-[1000]">
          <ContextMenuItem
            onSelect={() => {
              setIsStyleDialogOpen(true);
              setSelectedLayer(featureCollection ?? null);
            }}
          >
            Style
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      {isStyleDialogOpen && selectedLayer && (
        <StyleDialog
          featureCollection={selectedLayer}
          changeStyle={changeStyle}
          isStyleDialogOpen={isStyleDialogOpen}
          setIsStyleDialogOpen={setIsStyleDialogOpen}
        />
      )}
    </div>
  );
};
