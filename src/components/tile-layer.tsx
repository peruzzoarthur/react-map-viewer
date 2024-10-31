import { Eye, EyeClosed, Map } from "lucide-react";
import { Button } from "./ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { StyleDialog } from "./style-dialog";
import { PathOptions } from "leaflet";
import { FeatureCollectionWithFilenameAndState } from "@/index.types";

type TileLayerProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<boolean>;
  featureCollection?: FeatureCollectionWithFilenameAndState;
  filename?: string;
  changeStyle: (
    file: FeatureCollectionWithFilenameAndState,
    style: PathOptions,
  ) => void;

  selectedFile: FeatureCollectionWithFilenameAndState | null;
  setSelectedFile: React.Dispatch<
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
  selectedFile,
  setSelectedFile,
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
              className={filename === selectedFile?.fileName ? "font-bold" : ""}
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
              setSelectedFile(featureCollection ?? null);
            }}
          >
            Style
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      {isStyleDialogOpen && selectedFile && (
        <StyleDialog
          featureCollection={selectedFile}
          changeStyle={changeStyle}
          isStyleDialogOpen={isStyleDialogOpen}
          setIsStyleDialogOpen={setIsStyleDialogOpen}
        />
      )}
    </div>
  );
};
