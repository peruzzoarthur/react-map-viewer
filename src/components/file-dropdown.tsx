import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { FeatureCollectionWithFilename } from "shpjs";

type FileDropdownProps = {
  setIsAddLayerDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsWorkspaceError: React.Dispatch<boolean>;
  setWorkspaceError: React.Dispatch<string | null>;
  setGeoJson: React.Dispatch<
    React.SetStateAction<FeatureCollectionWithFilename | null>
  >;
};

export const FileDropdown = ({
  setWorkspaceError,
  setIsWorkspaceError,
  setIsAddLayerDialogOpen,
  setGeoJson,
}: FileDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">File</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[1000]" align="end">
        <DropdownMenuItem
          onSelect={() => {
            setWorkspaceError(null);
            setIsWorkspaceError(false);
            setGeoJson(null);
            setIsAddLayerDialogOpen(true);
          }}
        >
          Add file to workspace
        </DropdownMenuItem>
        <DropdownMenuItem>Save workspace</DropdownMenuItem>
        <DropdownMenuItem>Load workspace</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
