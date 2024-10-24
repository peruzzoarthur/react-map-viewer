import { FeatureCollectionWithFilename } from "shpjs";
import { FileDropdown } from "./file-dropdown";
import { ModeToggle } from "./mode-toggle";
import { Card } from "./ui/card";
import { useState } from "react";
import { AddLayerDialog } from "./add-layer-dialog";

type NavBarProps = {
  geoJson: FeatureCollectionWithFilename | null;
  setGeoJson: React.Dispatch<
    React.SetStateAction<FeatureCollectionWithFilename | null>
  >;

  addFileToWorkspace: (
    file: FeatureCollectionWithFilename,
    color: string
  ) => void;
};

export const NavBar = ({
  addFileToWorkspace,
  geoJson,
  setGeoJson,
}: NavBarProps) => {
  const [isAddLayerDialogOpen, setIsAddLayerDialogOpen] =
    useState<boolean>(false);
  return (
    <>
      <nav className="flex items-center justify-start w-full py-1">
        <Card className="flex w-full justify-between p-1 bg-opacity-10 bg-white ">
          <FileDropdown setIsAddLayerDialogOpen={setIsAddLayerDialogOpen} />
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
        />
      )}
    </>
  );
};
