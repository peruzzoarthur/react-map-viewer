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
  ColorSchema,
  FeatureCollectionWithFilenameAndState,
  PathOptionsWithPointAttributes,
  TileLayerOptions,
} from "@/index.types";
import { ZoomToLayerRef } from "./zoom-to-layer";
import { useRef, useState } from "react";
import { FeatureCollection } from "geojson";
import { createBuffers } from "@/lib/gis-tools";
import { FeatureCollectionWithFilename } from "shpjs";
import { prepareGeoJSONForUpload } from "@/lib/upload-files";
import { axiosInstance } from "@/lib/api";
import { RenameFeatureCollectionDialog } from "./rename-feature-collection-dialog";

type LayerItemProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<boolean>;
  featureCollection: FeatureCollectionWithFilenameAndState;
  removeFileFromWorkspace: (filename: string | undefined) => void;
  changeStyle: (
    featureCollection: FeatureCollectionWithFilenameAndState,
    colorSchema: ColorSchema,
    style: PathOptionsWithPointAttributes,
    propertyValue?: string,
  ) => void;
  changeColorSchema: (
    featureCollection: FeatureCollectionWithFilenameAndState,
    colorSchema: ColorSchema,
  ) => void;
  changeFeatureCollectionName: (
    featureCollection: FeatureCollectionWithFilenameAndState,
    name: string,
  ) => void;

  selectedLayer: FeatureCollectionWithFilenameAndState | null;
  setSelectedLayer: React.Dispatch<
    React.SetStateAction<FeatureCollectionWithFilenameAndState | null>
  >;
  isStyleDialogOpen: boolean;
  setIsStyleDialogOpen: React.Dispatch<boolean>;
  isTableOfContentOpen: boolean;
  setIsTableOfContentOpen: React.Dispatch<boolean>;
  isRenameFeatureCollectionDialogOpen: boolean;
  setIsRenameFeatureCollectionDialogOpen: React.Dispatch<boolean>;
  toggleSelected: (filename: string | undefined) => void;
  zoomToLayerRef: React.MutableRefObject<ZoomToLayerRef | null>;
  dragFeature: React.MutableRefObject<number>;
  draggedOverFeature: React.MutableRefObject<number>;
  handleSort: () => void;
  tileLayerOptions: TileLayerOptions;
  addFileToWorkspace: (
    file: FeatureCollectionWithFilename,
    color: string,
  ) => void;
};

export const LayerItem = ({
  isVisible,
  setIsVisible,
  featureCollection,
  removeFileFromWorkspace,
  changeStyle,
  changeColorSchema,
  selectedLayer,
  setSelectedLayer,
  isStyleDialogOpen,
  setIsStyleDialogOpen,
  isTableOfContentOpen,
  setIsTableOfContentOpen,
  isRenameFeatureCollectionDialogOpen,
  setIsRenameFeatureCollectionDialogOpen,
  toggleSelected,
  zoomToLayerRef,
  dragFeature,
  draggedOverFeature,
  handleSort,
  tileLayerOptions,
  addFileToWorkspace,
  changeFeatureCollectionName,
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

  const handleContextMenuTrigger = (event: React.KeyboardEvent) => {
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
  };

  const handleAddToDb = async (
    featureCollection: FeatureCollectionWithFilenameAndState,
  ) => {
    try {
      const plainFeatureCollection: FeatureCollection =
        prepareGeoJSONForUpload(featureCollection);

      const requestBody = {
        geoJSON: plainFeatureCollection,
        srid: 3857,
      };

      const { data } = await axiosInstance.post("/shapes/upload", requestBody);

      return data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

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
              setIsRenameFeatureCollectionDialogOpen(true);
              setSelectedLayer(featureCollection ?? null);
              setMenuPosition({ x: 0, y: 0 });
            }}
          >
            Rename
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
              handleAddToDb(featureCollection);
              setMenuPosition({ x: 0, y: 0 });
            }}
          >
            Add to db
          </ContextMenuItem>

          <ContextMenuItem
            onClick={async () => {
              await createBuffers(featureCollection, addFileToWorkspace);
              setMenuPosition({ x: 0, y: 0 });
            }}
          >
            Testing buffer
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
          changeColorSchema={changeColorSchema}
          isStyleDialogOpen={isStyleDialogOpen}
          setIsStyleDialogOpen={setIsStyleDialogOpen}
          tileLayerOptions={tileLayerOptions}
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

      {isRenameFeatureCollectionDialogOpen && selectedLayer && (
        <RenameFeatureCollectionDialog
          featureCollection={selectedLayer}
          isRenameFeatureCollectionDialogOpen={
            isRenameFeatureCollectionDialogOpen
          }
          setIsRenameFeatureCollectionDialogOpen={
            setIsRenameFeatureCollectionDialogOpen
          }
          changeFeatureCollectionName={changeFeatureCollectionName}
        />
      )}
    </div>
  );
};
