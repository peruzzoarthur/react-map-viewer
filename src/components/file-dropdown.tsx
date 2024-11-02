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
  workspace: Workspace;
  setWorkspace: React.Dispatch<Workspace>;
  setIsLoadWorkspaceDialogOpen: React.Dispatch<boolean>;
  setIsWorkspaceError: React.Dispatch<boolean>;
  setWorkspaceError: React.Dispatch<string | null>;
};

export const FileDropdown = ({
  workspace,
  setIsLoadWorkspaceDialogOpen,
  setWorkspaceError,
  setIsWorkspaceError,
}: FileDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">File</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[1000]" align="end">
        <DropdownMenuItem onClick={() => saveWorkspace(workspace)}>
          Save workspace
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            setWorkspaceError(null);
            setIsWorkspaceError(false);
            setIsLoadWorkspaceDialogOpen(true);
          }}
        >
          Load workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
