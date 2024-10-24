import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

type FileDropdownProps = {
  setIsAddLayerDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FileDropdown = ({
  setIsAddLayerDialogOpen,
}: FileDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">File</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[1000]" align="end">
        <DropdownMenuItem
          onSelect={() => {
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
