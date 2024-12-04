import { FeatureCollectionWithFilename } from "shpjs";
import { FileDropdown } from "./file-dropdown";
import { ModeToggle } from "./mode-toggle";
import { Card } from "./ui/card";
import { useState } from "react";
import { AddLayerDialog } from "./add-layer-dialog";
import { VectorDropdown } from "./vector-dropdown";
import { Workspace } from "@/index.types";
import { LoadWorkspaceDialog } from "./load-worskpace-dialog";
import { MapDropdown } from "./map-dropdown";

type NavBarProps = {
  workspace: Workspace;
  setWorkspace: React.Dispatch<Workspace>;
  geoJson: FeatureCollectionWithFilename | null;
  setGeoJson: React.Dispatch<
    React.SetStateAction<FeatureCollectionWithFilename | null>
  >;

  addFileToWorkspace: (
    file: FeatureCollectionWithFilename,
    color: string,
  ) => void;
  workspaceError: string | null;
  setWorkspaceError: React.Dispatch<string | null>;
  isWorkspaceError: boolean;
  setIsWorkspaceError: React.Dispatch<boolean>;

mapContainerRef: React.RefObject<HTMLDivElement> 
};

export const NavBar = ({
  workspace,
  setWorkspace,
  addFileToWorkspace,
  geoJson,
  setGeoJson,
  workspaceError,
  setWorkspaceError,
  isWorkspaceError,
  setIsWorkspaceError,
  mapContainerRef
}: NavBarProps) => {
  const [isAddLayerDialogOpen, setIsAddLayerDialogOpen] =
    useState<boolean>(false);
  const [isLoadWorkspaceDialogOpen, setIsLoadWorkspaceDialogOpen] =
    useState<boolean>(false);
  return (
    <>
      <nav className="flex items-center justify-start w-full py-1">
        <Card className="flex w-full justify-between p-1 bg-opacity-10 bg-white ">
          <div>
            <FileDropdown
              workspace={workspace}
              setIsWorkspaceError={setIsWorkspaceError}
              setWorkspaceError={setWorkspaceError}
              setIsLoadWorkspaceDialogOpen={setIsLoadWorkspaceDialogOpen}
              setWorkspace={setWorkspace}
            />
            <VectorDropdown
              setWorkspaceError={setWorkspaceError}
              setIsWorkspaceError={setIsWorkspaceError}
              setIsAddLayerDialogOpen={setIsAddLayerDialogOpen}
              setGeoJson={setGeoJson}
            />
            <MapDropdown mapContainerRef={mapContainerRef} />
          </div>
          <ModeToggle />
        </Card>
      </nav>
      {isAddLayerDialogOpen && (
        <AddLayerDialog
          geoJson={geoJson}
          setGeoJson={setGeoJson}
          isDialogOpen={isAddLayerDialogOpen}
          setIsDialogOpen={setIsAddLayerDialogOpen}
          addFileToWorkspace={addFileToWorkspace}
          workspaceError={workspaceError}
          setWorkspaceError={setWorkspaceError}
          isWorkspaceError={isWorkspaceError}
          setIsWorkspaceError={setIsWorkspaceError}
        />
      )}
      {isLoadWorkspaceDialogOpen && (
        <LoadWorkspaceDialog
          setWorkspace={setWorkspace}
          setWorkspaceError={setWorkspaceError}
          setIsWorkspaceError={setIsWorkspaceError}
          isWorkspaceError={isWorkspaceError}
          isDialogOpen={isLoadWorkspaceDialogOpen}
          workspaceError={workspaceError}
          setIsDialogOpen={setIsLoadWorkspaceDialogOpen}
        />
      )}
    </>
  );
};
