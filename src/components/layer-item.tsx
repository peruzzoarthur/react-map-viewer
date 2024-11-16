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
import { ZoomToLayerRef } from "./zoom-to-layer";

type LayerItemProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<boolean>;
  featureCollection?: FeatureCollectionWithFilenameAndState;
  removeFileFromWorkspace: (filename: string | undefined) => void;
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
  isTableOfContentOpen: boolean;
  setIsTableOfContentOpen: React.Dispatch<boolean>;
  toggleSelected: (filename: string | undefined) => void;
  zoomToLayerRef: React.MutableRefObject<ZoomToLayerRef | null>;
};

export const LayerItem = ({
  isVisible,
  setIsVisible,
  featureCollection,
  removeFileFromWorkspace,
  changeStyle,
  selectedLayer,
  setSelectedLayer,
  isStyleDialogOpen,
  setIsStyleDialogOpen,
  isTableOfContentOpen,
  setIsTableOfContentOpen,
  toggleSelected,
  zoomToLayerRef,
}: LayerItemProps) => {
  const filename = featureCollection?.fileName;
  const features = featureCollection?.features;
  const geometryType = features ? features[0].geometry.type : null;
  const color = featureCollection?.features[0].style.color;
  const strokeOpacity = featureCollection?.features[0].style.opacity
  const width = featureCollection?.features[0].style.weight;
  const fillColor = featureCollection?.features[0].style.fillColor;
  const fillOpacity = featureCollection?.features[0].style.fillOpacity;
  const isFill = featureCollection?.features[0].style.fill;

  return (
    <>
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
        <ContextMenuTrigger className="flex w-full justify-start space-x-1">
          <>
          <p
              className={
                filename === selectedLayer?.fileName ? "font-bold" : ""
              }
            >
              {filename}
            </p>
            {geometryType === "Polygon" && (
              <Square
                style={{
                  stroke: color,
                  strokeOpacity: strokeOpacity,
                  strokeWidth: width,
                  fill: isFill ? fillColor : undefined,
                  fillOpacity: fillOpacity,
                }}
              />
            )}
            {geometryType === "LineString" && (
              <Spline
                style={{
                  stroke: color,
                  strokeOpacity: strokeOpacity,
                  strokeWidth: width,
                  fill: isFill ? fillColor : undefined,
                  fillOpacity: fillOpacity,
                }}
              />
            )}
            {geometryType === "Point" && (
              <Circle
                style={{
                  stroke: color,
                  strokeOpacity: strokeOpacity,
                  strokeWidth: width,
                  fill: isFill ? fillColor : undefined,
                  fillOpacity: fillOpacity,
                }}
              />
            )}
          </>
        </ContextMenuTrigger>
        <ContextMenuContent className="z-[1000]">
          <ContextMenuItem
            onClick={async () => {
              if (zoomToLayerRef.current && featureCollection) {
                zoomToLayerRef.current.fitLayerBounds(featureCollection);
              }
            }}
          >
            Zoom to layer
          </ContextMenuItem>

          <ContextMenuItem
            onSelect={() => {
              setIsStyleDialogOpen(true);
              setSelectedLayer(featureCollection ?? null);
            }}
          >
            Style
          </ContextMenuItem>
          <ContextMenuItem
            onSelect={() => {
              setIsTableOfContentOpen(true);
              setSelectedLayer(featureCollection ?? null);
            }}
          >
            Table of Content
          </ContextMenuItem>
          <ContextMenuItem onClick={() => removeFileFromWorkspace(filename)}>
            Remove from workspace
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
      {isTableOfContentOpen && selectedLayer && (
        <TableOfContent
          featureCollection={selectedLayer}
          isTableOfContentOpen={isTableOfContentOpen}
          setIsTableOfContentOpen={setIsTableOfContentOpen}
          toggleSelected={toggleSelected}
        />
      )}
    </>
  );
};
