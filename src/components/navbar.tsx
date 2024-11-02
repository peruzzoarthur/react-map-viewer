import { FeatureCollectionWithFilename } from "shpjs";
import { FileDropdown } from "./file-dropdown";
import { ModeToggle } from "./mode-toggle";
import { Card } from "./ui/card";
import { useState } from "react";
import { AddLayerDialog } from "./add-layer-dialog";
import { VectorDropdown } from "./vector-dropdown";
import { Workspace } from "@/index.types";

type NavBarProps = {
  workspace: Workspace
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
};

export const NavBar = ({
  workspace,
  addFileToWorkspace,
  geoJson,
  setGeoJson,
  workspaceError,
  setWorkspaceError,
  isWorkspaceError,
  setIsWorkspaceError,
}: NavBarProps) => {
  const [isAddLayerDialogOpen, setIsAddLayerDialogOpen] =
    useState<boolean>(false);
  return (
    <>
      <nav className="flex items-center justify-start w-full py-1">
        <Card className="flex w-full justify-between p-1 bg-opacity-10 bg-white ">
          <div>
            <FileDropdown workspace={workspace} />
            <VectorDropdown
              setWorkspaceError={setWorkspaceError}
              setIsWorkspaceError={setIsWorkspaceError}
              setIsAddLayerDialogOpen={setIsAddLayerDialogOpen}
              setGeoJson={setGeoJson}
            />
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
    </>
  );
};
