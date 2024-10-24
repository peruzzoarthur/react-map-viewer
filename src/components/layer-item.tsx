import { Circle, Eye, EyeClosed, Spline, Square } from "lucide-react";
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

type LayerItemProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<boolean>;
  featureCollection?: FeatureCollectionWithFilenameAndState;
  filename?: string;
  removeFileFromWorkspace: (filename: string | undefined) => void;
  changeStyle: (filename: string | undefined, style: PathOptions) => void;
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

export const LayerItem = ({
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
}: LayerItemProps) => {
  if (!filename) {
    filename = featureCollection?.fileName;
  }
  const features = featureCollection?.features;
  const geometryType = features ? features[0].geometry.type : null;

  return (
    <div className="flex items-center space-x-1 cursor-pointer">
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
            {geometryType === "Polygon" && (
              <Square style={{ stroke: featureCollection?.style.color }} />
            )}
            {geometryType === "LineString" && (
              <Spline style={{ stroke: featureCollection?.style.color }} />
            )}
            {geometryType === "Point" && (
              <Circle style={{ stroke: featureCollection?.style.color }} />
            )}
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
      {isStyleDialogOpen && featureCollection && (
        <StyleDialog
          featureCollection={featureCollection}
          changeStyle={changeStyle}
          isStyleDialogOpen={isStyleDialogOpen}
          setIsStyleDialogOpen={setIsStyleDialogOpen}
        />
      )}
      {isTableOfContentOpen && featureCollection && (
        <TableOfContent
          featureCollection={featureCollection}
          isTableOfContentOpen={isTableOfContentOpen}
          setIsTableOfContentOpen={setIsTableOfContentOpen}
          toggleSelected={toggleSelected}
        />
      )}
    </div>
  );
};
