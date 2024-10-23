import { FeatureCollectionWithFilename } from "shpjs";
import { FileDropdown } from "./file-dropdown";
import { ModeToggle } from "./mode-toggle";
import { Card } from "./ui/card";

type NavBarProps = {
  geoJson: FeatureCollectionWithFilename | null;
  setGeoJson: React.Dispatch<
    React.SetStateAction<FeatureCollectionWithFilename | null>
  >;
  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  addFileToWorkspace: (
    file: FeatureCollectionWithFilename,
    color: string
  ) => void;
  setIsOpenPreview: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  isOpenPreview: boolean;
};

export const NavBar = ({
  addFileToWorkspace,
  geoJson,
  setGeoJson,
  handleFileUpload,
  isOpenPreview,
  loading,
  setIsOpenPreview,
}: NavBarProps) => {
  return (
    <div className="flex items-center justify-start w-full py-1">
      <Card className="flex w-full justify-between p-1 bg-opacity-10 bg-white ">
        <FileDropdown
          addFileToWorkspace={addFileToWorkspace}
          geoJson={geoJson}
          setGeoJson={setGeoJson}
          handleFileUpload={handleFileUpload}
          isOpenPreview={isOpenPreview}
          loading={loading}
          setIsOpenPreview={setIsOpenPreview}
        />
        <ModeToggle />
      </Card>
    </div>
  );
};
