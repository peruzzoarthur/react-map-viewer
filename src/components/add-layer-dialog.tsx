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
import { Button } from "./ui/button";
import { getRandomColor } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "./ui/scroll-area";
import shpjs, { FeatureCollectionWithFilename } from "shpjs";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

type AddLayerProps = {
  geoJson: FeatureCollectionWithFilename | null;

  addFileToWorkspace: (
    file: FeatureCollectionWithFilename,
    color: string
  ) => void;
  setGeoJson: React.Dispatch<
    React.SetStateAction<FeatureCollectionWithFilename | null>
  >;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<boolean>;
  workspaceError: string | null;
  setWorkspaceError: React.Dispatch<string | null>;
  isWorkspaceError: boolean;
  setIsWorkspaceError: React.Dispatch<boolean>;
};

export const AddLayerDialog = ({
  geoJson,
  setGeoJson,
  addFileToWorkspace,
  isDialogOpen,
  setIsDialogOpen,
  workspaceError,
  setWorkspaceError,
  isWorkspaceError,
  setIsWorkspaceError,
}: AddLayerProps) => {
  const [isOpenPreview, setIsOpenPreview] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const geoJsonData = await shpjs(arrayBuffer);
        setGeoJson(geoJsonData as FeatureCollectionWithFilename);
        setIsOpenPreview(true);
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
          <DialogTitle>Add file to layers</DialogTitle>
          <DialogDescription>
            the file must be a .zip of your shapefiles.
          </DialogDescription>
          <div className="flex justify-center">
            <div className="flex p-4 space-y-4 flex-col justify-center items-center mt-4">
              <Input
                className="w-full"
                type="file"
                onChange={handleFileUpload}
                accept=".zip"
              />
            </div>
            {isWorkspaceError && workspaceError && (
              // <Badge className="w-full h-full" variant="destructive">
              //   {workspaceError}
              // </Badge>
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
          {geoJson && (
            <Button
              onClick={() => {
                const color = getRandomColor();
                addFileToWorkspace(geoJson, color);
                setIsOpenPreview(false);
                setGeoJson(null);
              }}
            >
              Add to workspace
            </Button>
          )}
          {loading && <p>Loading...</p>}
          {isOpenPreview && (
            <ScrollArea className="h-[60vh] w-[70vh] rounded-md border p-4">
              <div className="h-full w-full overflow-auto">
                <pre className="h-full w-full overflow-auto whitespace-pre-wrap">
                  {JSON.stringify(geoJson, null, 2)}
                </pre>
              </div>
              <ScrollBar className="bg-black" orientation="vertical" />
            </ScrollArea>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
