import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import {  loadWorkspace } from "@/lib/utils";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle } from "lucide-react";
import { Workspace } from "@/index.types";

type LoadWorkspaceProps = {
  setWorkspace: React.Dispatch<Workspace>;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<boolean>;
  workspaceError: string | null;
  setWorkspaceError: React.Dispatch<string | null>;
  isWorkspaceError: boolean;
  setIsWorkspaceError: React.Dispatch<boolean>;
};

export const LoadWorkspaceDialog = ({
  setWorkspace,
  isDialogOpen,
  setIsDialogOpen,
  workspaceError,
  setWorkspaceError,
  isWorkspaceError,
  setIsWorkspaceError,
}: LoadWorkspaceProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        loadWorkspace(file, setWorkspace);
        setIsDialogOpen(false)
      } catch (error) {
        console.error("Error parsing shapefile:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger className="flex w-full">
        Add file to workspace
      </DialogTrigger>
      <DialogContent className="z-[1400] w-[100vh] h-[80vh] p-4">
        <DialogHeader>
          <DialogTitle>Load workspace</DialogTitle>
          <DialogDescription>
            the workspace has a .json format.
          </DialogDescription>
          <div className="flex justify-center">
            <div className="flex p-4 space-y-4 flex-col justify-center items-center mt-4">
              <Input
                className="w-full"
                type="file"
                onChange={handleFileUpload}
                accept=".json"
              />
            </div>
            {isWorkspaceError && workspaceError && (
              <Alert
                onClick={() => {
                  setIsWorkspaceError(false);
                  setWorkspaceError(null);
                }}
                variant="destructive"
              >
                <XCircle className="h-4 w-4" />
                <AlertTitle className="font-bold">
                  Error from workspace
                </AlertTitle>
                <AlertDescription>{workspaceError}</AlertDescription>
              </Alert>
            )}
          </div>
        </DialogHeader>
        <DialogFooter>
          <div className="bg-white flex h-full"></div>
          {loading && <p>Loading...</p>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
