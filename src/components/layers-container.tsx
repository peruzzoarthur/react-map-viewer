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
type LayersContainerProps = {
  isTileLayer: boolean;
  setIsTileLayer: React.Dispatch<boolean>;
  selectedFile: FeatureCollectionWithFilenameAndState | null;
  setSelectedFile: React.Dispatch<
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
};

export const LayersContainer = ({
  isTileLayer,
  setIsTileLayer,
  selectedFile,
  setSelectedFile,
  changeStyle,
  toggleVisibility,
  removeFileFromWorkspace,
  setPosition,
  workspace,
  toggleSelected,
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
        <div className="justify-center space-x-2 flex items-center p-4 bg-opacity-10 bg-white w-full">
          <h2 className="text-lg">Layers</h2>
          <Layers />
        </div>
        <Separator />

        {layersList &&
          layersList.length > 0 &&
          layersList
            .sort((a, b) => b.position - a.position)
            .map((featureCollection, index) => (
              <div
                className="w-full"
                key={index}
                draggable
                onDragStart={() =>
                  (dragFeature.current = featureCollection.position)
                }
                onDragEnter={() =>
                  (draggedOverFeature.current = featureCollection.position)
                }
                onDragEnd={handleSort}
                onDragOver={(e) => e.preventDefault}
              >
                <LayerItem
                  isVisible={featureCollection.visible}
                  setIsVisible={() =>
                    toggleVisibility(featureCollection.fileName)
                  }
                  featureCollection={featureCollection}
                  removeFileFromWorkspace={removeFileFromWorkspace}
                  changeStyle={changeStyle}
                  setSelectedFile={setSelectedFile}
                  isStyleDialogOpen={isStyleDialogOpen}
                  setIsStyleDialogOpen={setIsStyleDialogOpen}
                  isTableOfContentOpen={isTableOfContentOpen}
                  setIsTableOfContentOpen={setIsTableOfContentOpen}
                  toggleSelected={toggleSelected}
                  selectedFile={selectedFile}
                />
              </div>
            ))}
        <TileLayer
          isVisible={isTileLayer}
          setIsVisible={setIsTileLayer}
          filename="OpenStreetMap TileLayer"
          changeStyle={changeStyle}
          setSelectedFile={setSelectedFile}
          isStyleDialogOpen={isStyleDialogOpen}
          setIsStyleDialogOpen={setIsStyleDialogOpen}
          selectedFile={selectedFile}
        />
      </div>
    </>
  );
};
