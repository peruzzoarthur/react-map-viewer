import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { AddLayer } from "./add-layer";
import { FeatureCollectionWithFilename } from "shpjs";

type FileDropdownProps = {
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

export const FileDropdown = ({
  addFileToWorkspace,
  geoJson,
  setGeoJson,
  handleFileUpload,
  isOpenPreview,
  loading,
  setIsOpenPreview,
}: FileDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">File</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[1000]" align="end">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <AddLayer
            addFileToWorkspace={addFileToWorkspace}
            geoJson={geoJson}
            handleFileUpload={handleFileUpload}
            isOpenPreview={isOpenPreview}
            loading={loading}
            setIsOpenPreview={setIsOpenPreview}
            setGeoJson={setGeoJson}
          />
        </DropdownMenuItem>
        <DropdownMenuItem>Save workspace</DropdownMenuItem>
        <DropdownMenuItem>Load workspace</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
