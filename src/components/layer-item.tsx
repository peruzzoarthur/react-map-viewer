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
import {
  FeatureCollectionWithFilenameAndState,
  PathOptionsWithPointAttributes,
} from "@/index.types";

type LayerItemProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<boolean>;
  featureCollection?: FeatureCollectionWithFilenameAndState;
  removeFileFromWorkspace: (filename: string | undefined) => void;
  changeStyle: (
    file: FeatureCollectionWithFilenameAndState,
    style: PathOptionsWithPointAttributes,
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

export const LayerItem = ({
  isVisible,
  setIsVisible,
  featureCollection,
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
  const filename = featureCollection?.fileName;
  const features = featureCollection?.features;
  const geometryType = features ? features[0].geometry.type : null;
  const color = featureCollection?.features[0].style.color;
  const fillColor = featureCollection?.features[0].style.fillColor;
  const fillOpacity = featureCollection?.features[0].style.fillOpacity;
  const isFill = featureCollection?.features[0].style.fill;

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
            {geometryType === "Polygon" && (
              <Square
                style={{
                  stroke: color,
                  strokeOpacity: 1,
                  fill: isFill ? fillColor : undefined,
                  fillOpacity: fillOpacity,
                }}
              />
            )}
            {geometryType === "LineString" && (
              <Spline
                style={{
                  stroke: color,
                  strokeOpacity: 1,
                  fill: isFill ? fillColor : undefined,
                  fillOpacity: fillOpacity,
                }}
              />
            )}
            {geometryType === "Point" && (
              <Circle
                style={{
                  stroke: color,
                  strokeOpacity: 1,
                  fill: isFill ? fillColor : undefined,
                  fillOpacity: fillOpacity,
                }}
              />
            )}
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
};
