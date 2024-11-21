import { Button } from "./ui/button";
import { Circle, Eye, EyeClosed, Spline, Square } from "lucide-react";
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
import { useRef, useState } from "react";

type LayerItemProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<boolean>;
  featureCollection: FeatureCollectionWithFilenameAndState;
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
  dragFeature: React.MutableRefObject<number>;
  draggedOverFeature: React.MutableRefObject<number>;
  handleSort: () => void;
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
  dragFeature,
  draggedOverFeature,
  handleSort,
}: LayerItemProps) => {
  const filename = featureCollection?.fileName;
  const features = featureCollection?.features;
  const geometryType = features ? features[0].geometry.type : null;
  const color = featureCollection?.features[0].style.color;
  const strokeOpacity = featureCollection?.features[0].style.opacity;
  const width = featureCollection?.features[0].style.weight;
  const fillColor = featureCollection?.features[0].style.fillColor;
  const fillOpacity = featureCollection?.features[0].style.fillOpacity;
  const isFill = featureCollection?.features[0].style.fill;
  const isStroke = featureCollection?.features[0].style.stroke;

  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const contextTriggerRef = useRef<HTMLDivElement | null>(null);

  function handleContextMenuTrigger(event: React.KeyboardEvent) {
    if (event.key === "Enter" && contextTriggerRef.current) {
      const rect = contextTriggerRef.current.getBoundingClientRect();
      setMenuPosition({ x: rect.left, y: rect.top });
      const contextMenuEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: rect.left,
        clientY: 0,
      });
      contextTriggerRef.current.dispatchEvent(contextMenuEvent);
    }
  }
  return (
    <div className="flex w-full">
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
        <ContextMenuTrigger
          className="flex w-full space-x-1"
          ref={contextTriggerRef}
          draggable
          onKeyDown={handleContextMenuTrigger}
          onDragStart={() => {
            dragFeature.current = featureCollection.position;
          }}
          onDragEnter={() => {
            draggedOverFeature.current = featureCollection?.position;
          }}
          onDragEnd={() => {
            handleSort();
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          <>
            <Button
              variant="ghost"
              className={
                filename === selectedLayer?.fileName
                  ? "font-bold text-base hover:bg-white hover:bg-opacity-0 justify-start w-full"
                  : "hover:bg-white  text-base hover:bg-opacity-0 w-full justify-start"
              }
            >
              {filename}
              {geometryType === "Polygon" && (
                <Square
                  style={{
                    stroke: isStroke ? color : "transparent",
                    strokeOpacity: strokeOpacity,
                    strokeWidth: width,
                    fill: isFill ? fillColor : "transparent",
                    fillOpacity: fillOpacity,
                  }}
                />
              )}
              {geometryType === "LineString" && (
                <Spline
                  style={{
                    stroke: isStroke ? color : "transparent",
                    strokeOpacity: strokeOpacity,
                    strokeWidth: width,
                    fill: isFill ? fillColor : "transparent",
                    fillOpacity: fillOpacity,
                  }}
                />
              )}
              {geometryType === "Point" && (
                <Circle
                  style={{
                    stroke: isStroke ? color : "transparent",
                    strokeOpacity: strokeOpacity,
                    strokeWidth: width,
                    fill: isFill ? fillColor : "transparent",
                    fillOpacity: fillOpacity,
                  }}
                />
              )}
            </Button>
          </>
        </ContextMenuTrigger>
        <ContextMenuContent
          className="z-[1000] flex flex-col w-[20vh]"
          style={{
            top: menuPosition.y,
            left: menuPosition.x,
            position: "absolute",
          }}
        >
          <ContextMenuItem
            onClick={async () => {
              if (zoomToLayerRef.current && featureCollection) {
                zoomToLayerRef.current.fitLayerBounds(featureCollection);
              }
              setMenuPosition({ x: 0, y: 0 });
            }}
          >
            Zoom to layer
          </ContextMenuItem>

          <ContextMenuItem
            onSelect={() => {
              setIsStyleDialogOpen(true);
              setSelectedLayer(featureCollection ?? null);
              setMenuPosition({ x: 0, y: 0 });
            }}
          >
            Style
          </ContextMenuItem>
          <ContextMenuItem
            onSelect={() => {
              setIsTableOfContentOpen(true);
              setSelectedLayer(featureCollection ?? null);
              setMenuPosition({ x: 0, y: 0 });
            }}
          >
            Table of Content
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              removeFileFromWorkspace(filename);
              setMenuPosition({ x: 0, y: 0 });
            }}
          >
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
    </div>
  );
};
