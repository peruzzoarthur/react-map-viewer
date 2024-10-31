import {  Eye, EyeClosed, Map } from "lucide-react";
import { Button } from "./ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { TableOfContent } from "./table-of-content";
import { StyleDialog } from "./style-dialog";
import { PathOptions } from "leaflet";
import { FeatureCollectionWithFilenameAndState } from "@/index.types";

type TileLayerProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<boolean>;
  featureCollection?: FeatureCollectionWithFilenameAndState;
  filename?: string;
  removeFileFromWorkspace: (filename: string | undefined) => void;
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
  isTableOfContentOpen: boolean;
  setIsTableOfContentOpen: React.Dispatch<boolean>;
  toggleSelected: (filename: string | undefined) => void;
};

export const TileLayer = ({
  isVisible,
  setIsVisible,
  featureCollection,
  filename,
  removeFileFromWorkspace,
  changeStyle,
  selectedFile,
  setSelectedFile,
  isStyleDialogOpen,
  setIsStyleDialogOpen,
  isTableOfContentOpen,
  setIsTableOfContentOpen,
  toggleSelected,
}: TileLayerProps) => {
  if (!filename) {
    filename = featureCollection?.fileName;
  }
  const features = featureCollection?.features;
  const geometryType = features ? features[0].geometry.type : null;

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
          {/* <ContextMenuItem
            onClick={() => setSelectedFile(featureCollection ?? null)}
          >
            Zoom to layer
          </ContextMenuItem> */}
          <ContextMenuItem
            onSelect={() => {
              setIsStyleDialogOpen(true);
              setSelectedFile(featureCollection ?? null);
            }}
          >
            Style
          </ContextMenuItem>
          <ContextMenuItem
            onSelect={() => {
              setIsTableOfContentOpen(true);
              setSelectedFile(featureCollection ?? null);
            }}
          >
            Table of Content
          </ContextMenuItem>
          <ContextMenuItem onClick={() => removeFileFromWorkspace(filename)}>
            Remove from workspace
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
      {isTableOfContentOpen && selectedFile && (
        <TableOfContent
          featureCollection={selectedFile}
          isTableOfContentOpen={isTableOfContentOpen}
          setIsTableOfContentOpen={setIsTableOfContentOpen}
          toggleSelected={toggleSelected}
        />
      )}
    </div>
  );
}
