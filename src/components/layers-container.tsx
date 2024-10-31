import {
  FeatureCollectionWithFilenameAndState,
  Workspace,
} from "@/index.types";
import { LayerItem } from "./layer-item";
import { Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PathOptions } from "leaflet";

type LayersContainerProps = {
  isTileLayer: boolean;
  setIsTileLayer: React.Dispatch<boolean>;
  selectedFile: FeatureCollectionWithFilenameAndState | null;
  setSelectedFile: React.Dispatch<
    React.SetStateAction<FeatureCollectionWithFilenameAndState | null>
  >;

  changeStyle: (
    file: FeatureCollectionWithFilenameAndState,
    style: PathOptions
  ) => void;

  toggleVisibility: (filename: string | undefined) => void;
  removeFileFromWorkspace: (filename: string | undefined) => void;
  workspace: Workspace;
  toggleSelected: (filename: string | undefined) => void;
  setPosition: (fromIndex: number, toIndex: number) => void
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

  const [layersList, setLayersList] = useState<FeatureCollectionWithFilenameAndState[] | null>(null)
  const dragFeature = useRef<number>(0)
  const draggedOverFeature = useRef<number>(0)
  
  useEffect(() => {
    setLayersList([...workspace.featureCollections])
  }, [workspace])
  
  const handleSort = () => {
    if (!layersList) {
      return
    }
    const clone = [...layersList]
    const temp = layersList[dragFeature.current]
    clone[dragFeature.current] = clone[draggedOverFeature.current]
    clone[draggedOverFeature.current] = temp 
    setLayersList(clone)
    setPosition(dragFeature.current, draggedOverFeature.current)
   }
 
  return (
    <>
    <div className="flex flex-col w-full h-full items-center">
    <div className=" mx-4 space-x-2 flex items-center">
    <Layers />
    <h2 className="text-2xl font-bold ">Layers</h2>
    </div>

    <LayerItem
    isVisible={isTileLayer}
    setIsVisible={setIsTileLayer}
    filename="OpenStreetMap TileLayer"
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

    {layersList && layersList.length > 0 &&
          layersList.sort((a, b) => b.position - a.position).map((featureCollection, index) => (
            <div
              className="w-full"
              key={index}
              draggable
              onDragStart={() => (dragFeature.current = featureCollection.position)}
              onDragEnter={() => (draggedOverFeature.current = featureCollection.position)}
              onDragEnd={handleSort}
              onDragOver={(e) => e.preventDefault}
            >
              <LayerItem
                isVisible={featureCollection.visible}
                setIsVisible={() => toggleVisibility(featureCollection.fileName)}
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
      </div>
    </>
  );
};
