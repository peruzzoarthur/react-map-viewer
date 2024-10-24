import { FeatureCollectionWithFilenameAndState } from "@/index.types";
import { LayerItem } from "./layer-item";
import { Layers } from "lucide-react";
import { useState } from "react";

type LayersContainerProps = {
  isTileLayer: boolean;
  setIsTileLayer: React.Dispatch<boolean>;
  selectedFile: FeatureCollectionWithFilenameAndState | null;
  setSelectedFile: React.Dispatch<
    React.SetStateAction<FeatureCollectionWithFilenameAndState | null>
  >;

  changeStyle: (filename: string | undefined, style: L.PathOptions) => void;
  toggleVisibility: (filename: string | undefined) => void;
  removeFileFromWorkspace: (filename: string | undefined) => void;
  workspace: FeatureCollectionWithFilenameAndState[];
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

        {workspace.length > 0 &&
          workspace.map((file, index) => (
            <LayerItem
              key={index}
              isVisible={file.visible}
              setIsVisible={() => toggleVisibility(file.fileName)}
              featureCollection={file}
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
