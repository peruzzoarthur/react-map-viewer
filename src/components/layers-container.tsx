import {
  FeatureCollectionWithFilenameAndState,
  PathOptionsWithPointAttributes,
  Workspace,
} from "@/index.types";
import { LayerItem } from "./layer-item";
import { Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TileLayer } from "./tile-layer";
import { Separator } from "./ui/separator";
import { ZoomToLayerRef } from "./zoom-to-layer";
type LayersContainerProps = {
  isTileLayer: boolean;
  setIsTileLayer: React.Dispatch<boolean>;
  selectedLayer: FeatureCollectionWithFilenameAndState | null;
  setSelectedLayer: React.Dispatch<
    React.SetStateAction<FeatureCollectionWithFilenameAndState | null>
  >;

  changeStyle: (
    file: FeatureCollectionWithFilenameAndState,
    style: PathOptionsWithPointAttributes,
  ) => void;

  toggleVisibility: (filename: string | undefined) => void;
  removeFileFromWorkspace: (filename: string | undefined) => void;
  workspace: Workspace;
  toggleSelected: (filename: string | undefined) => void;
  setPosition: (fromIndex: number, toIndex: number) => void;
  zoomToLayerRef: React.MutableRefObject<ZoomToLayerRef | null>;
};

export const LayersContainer = ({
  isTileLayer,
  setIsTileLayer,
  selectedLayer,
  setSelectedLayer,
  changeStyle,
  toggleVisibility,
  removeFileFromWorkspace,
  setPosition,
  workspace,
  toggleSelected,
  zoomToLayerRef,
}: LayersContainerProps) => {
  const [isTableOfContentOpen, setIsTableOfContentOpen] =
    useState<boolean>(false);
  const [isStyleDialogOpen, setIsStyleDialogOpen] = useState<boolean>(false);

  const [layersList, setLayersList] = useState<
    FeatureCollectionWithFilenameAndState[] | null
  >(null);
  const dragFeature = useRef<number>(0);
  const draggedOverFeature = useRef<number>(0);

  useEffect(() => {
    setLayersList([...workspace.featureCollections]);
  }, [workspace]);

  const handleSort = () => {
    if (!layersList) {
      return;
    }
    const clone = [...layersList];
    const temp = layersList[dragFeature.current];
    clone[dragFeature.current] = clone[draggedOverFeature.current];
    clone[draggedOverFeature.current] = temp;
    setLayersList(clone);
    setPosition(dragFeature.current, draggedOverFeature.current);
  };

  return (
    <>
      <div className="flex flex-col w-full h-full items-start">
        <div className="justify-start space-x-2 flex items-center p-4 bg-opacity-10 bg-white w-full">
          <h2 className="font-black">Layers</h2>
          <Layers />
        </div>
        <Separator />

        {layersList &&
          layersList.length > 0 &&
          layersList
            .sort((a, b) => b.position - a.position)
            .map((featureCollection, index) => (
              <div
                className="flex w-full items-center space-x-1 cursor-pointer"
                key={index}
                // draggable
                // onDragStart={(e) => {
                //   if (e.shiftKey) {
                //     dragFeature.current = featureCollection.position;
                //   } else {
                //     e.preventDefault();
                //   }
                // }}
                // onDragEnter={(e) => {
                //   if (e.shiftKey) {
                //     draggedOverFeature.current = featureCollection.position;
                //   }
                // }}
                // onDragEnd={(e) => {
                //   if (e.shiftKey) {
                //     handleSort();
                //   }
                // }}
                // onDragOver={(e) => {
                //   if (e.shiftKey) {
                //     e.preventDefault(); // Allow drag-over if Shift is pressed
                //   }
                // }}
              >
                <LayerItem
                  isVisible={featureCollection.visible}
                  setIsVisible={() =>
                    toggleVisibility(featureCollection.fileName)
                  }
                  featureCollection={featureCollection}
                  removeFileFromWorkspace={removeFileFromWorkspace}
                  changeStyle={changeStyle}
                  setSelectedLayer={setSelectedLayer}
                  isStyleDialogOpen={isStyleDialogOpen}
                  setIsStyleDialogOpen={setIsStyleDialogOpen}
                  isTableOfContentOpen={isTableOfContentOpen}
                  setIsTableOfContentOpen={setIsTableOfContentOpen}
                  toggleSelected={toggleSelected}
                  selectedLayer={selectedLayer}
                  zoomToLayerRef={zoomToLayerRef}
                  dragFeature={dragFeature}
                  draggedOverFeature={draggedOverFeature}
                  handleSort={handleSort}
                />
              </div>
            ))}
        <TileLayer
          isVisible={isTileLayer}
          setIsVisible={setIsTileLayer}
          filename="OpenStreetMap TileLayer"
          changeStyle={changeStyle}
          setSelectedLayer={setSelectedLayer}
          isStyleDialogOpen={isStyleDialogOpen}
          setIsStyleDialogOpen={setIsStyleDialogOpen}
          selectedLayer={selectedLayer}
        />
      </div>
    </>
  );
};
