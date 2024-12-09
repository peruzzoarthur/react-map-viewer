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
import { FeatureCollectionWithFilename } from "shpjs";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle } from "lucide-react";
import {
  handleGeoJsonFileUpload,
  handleShapefileFileUpload,
} from "@/lib/upload-files";
import { UploadFileTypeMenuBar } from "./upload-file-type-menubar";

type AddLayerProps = {
  geoJson: FeatureCollectionWithFilename | null;
  addFileToWorkspace: (
    file: FeatureCollectionWithFilename,
    color: string,
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

export type UploadFileType = "shp" | "geojson";

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
  const [fileType, setFileType] = useState<UploadFileType>("shp");

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger className="flex w-full">
        Add file to workspace
      </DialogTrigger>
      <DialogContent className="z-[1400] w-[100vh] h-[90vh] p-4">
        <DialogHeader>
          <DialogTitle>Add file to layers</DialogTitle>
          <DialogDescription>
            Please select a directory with all ESRI Shapefile files for that
            specific shape or simply add a GeoJSON.
          </DialogDescription>
          <div className="flex flex-col space-y-1 justify-center">
            <div className="flex p-4 space-y-4 flex-col justify-center items-center mt-4">
              <UploadFileTypeMenuBar
                setFileType={setFileType}
                fileType={fileType}
              />
              {fileType === "shp" && (
                <Input
                  className="w-2/3"
                  type="file"
                  onClick={() => {
                    setWorkspaceError(null);
                    setIsWorkspaceError(false);
                    setGeoJson(null);
                    setIsOpenPreview(false);
                  }}
                  onChange={(event) =>
                    handleShapefileFileUpload({
                      event: event,
                      setGeoJson: setGeoJson,
                      setLoading: setLoading,
                      setIsOpenPreview: setIsOpenPreview,
                      setIsWorkspaceError: setIsWorkspaceError,
                      setWorkspaceError: setWorkspaceError,
                    })
                  }
                  ref={(input) =>
                    input?.setAttribute("webkitdirectory", "true")
                  }
                />
              )}
              {fileType === "geojson" && (
                <Input
                  className="w-2/3"
                  type="file"
                  onClick={() => {
                    setWorkspaceError(null);
                    setIsWorkspaceError(false);
                    setGeoJson(null);
                    setIsOpenPreview(false);
                  }}
                  onChange={(event) =>
                    handleGeoJsonFileUpload({
                      event,
                      setLoading,
                      setGeoJson,
                      setIsOpenPreview,
                      setIsWorkspaceError,
                      setWorkspaceError,
                    })
                  }
                />
              )}
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
          {loading && <p>Loading...</p>}
          <div className="flex items-center justify-center space-x-4">
            {isOpenPreview && !isWorkspaceError && (
              <div className="flex flex-col space-y-2">
                <h4 className="font-bold text-sm">GeoJSON</h4>
                <ScrollArea className="h-[50vh] w-[70vh] rounded-md border p-4">
                  <div className="h-full w-full overflow-auto">
                    <pre className="h-full w-full overflow-auto whitespace-pre-wrap text-sm">
                      {JSON.stringify(geoJson, null, 2)}
                    </pre>
                  </div>
                  <ScrollBar className="bg-black" orientation="vertical" />
                </ScrollArea>
              </div>
            )}

            {geoJson && !workspaceError && (
              <Button
                className="items-center justify-center"
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
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
