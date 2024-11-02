import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Workspace } from "@/index.types";
import { saveWorkspace } from "@/lib/utils";

type FileDropdownProps = {
  workspace: Workspace 
};

export const FileDropdown = ({
  workspace
}: FileDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">File</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[1000]" align="end">
       <DropdownMenuItem onClick={() => saveWorkspace(workspace)}>Save workspace</DropdownMenuItem>
        <DropdownMenuItem>Load workspace</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
