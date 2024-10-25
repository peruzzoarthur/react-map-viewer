import {
  FeatureCollectionWithFilenameAndState,
  Workspace,
} from "@/index.types";
import { LayerItem } from "./layer-item";
import { Layers } from "lucide-react";
import { useState } from "react";
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
};

export const LayersContainer = ({
  isTileLayer,
  setIsTileLayer,
  selectedFile,
  setSelectedFile,
  changeStyle,
  toggleVisibility,
  removeFileFromWorkspace,
  workspace,
  toggleSelected,
}: LayersContainerProps) => {
  const [isTableOfContentOpen, setIsTableOfContentOpen] =
    useState<boolean>(false);
  const [isStyleDialogOpen, setIsStyleDialogOpen] = useState<boolean>(false);
  return (
    <>
      <div className="flex flex-col w-full h-full items-center  p-6">
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

        {workspace.featureCollections.length > 0 &&
          workspace.featureCollections.map((featureCollection, index) => (
            <LayerItem
              key={index}
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
          ))}
      </div>
    </>
  );
};
