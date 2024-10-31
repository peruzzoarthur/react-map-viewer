import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { FeatureCollectionWithFilename } from "shpjs";

type VectorDropdownProps = {
  setIsAddLayerDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsWorkspaceError: React.Dispatch<boolean>;
  setWorkspaceError: React.Dispatch<string | null>;
  setGeoJson: React.Dispatch<
    React.SetStateAction<FeatureCollectionWithFilename | null>
  >;
};

export const VectorDropdown = ({
  setWorkspaceError,
  setIsWorkspaceError,
  setIsAddLayerDialogOpen,
  setGeoJson,
}: VectorDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">Vector</Button>
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
          Add vector to workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
