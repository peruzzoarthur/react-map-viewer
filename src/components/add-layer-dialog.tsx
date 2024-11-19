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
import { checkESRIShapefiles, getRandomColor } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "./ui/scroll-area";
import { FeatureCollectionWithFilename, parseZip } from "shpjs";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Map, XCircle } from "lucide-react";
import JSZip from "jszip";
import parseWKT, { WktParsed } from "wkt-parser";

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
  const [wktParsed, setWktParsed] = useState<WktParsed | null>(null);
  const isCRS3857 = wktParsed
    ? wktParsed.name === "WGS_1984_Web_Mercator_Auxiliary_Sphere"
    : null;

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    
    if (files && files.length > 0) {
      checkESRIShapefiles(files, setWorkspaceError, setIsWorkspaceError)
      setLoading(true);
      try {
        const zip = new JSZip();

        for (const file of files) {
          const filePath = file.webkitRelativePath || file.name;

          if (filePath.endsWith(".prj")) {
           const prjContent = await file.text(); 
            try {
              const parsedCRS = parseWKT(prjContent);
              setWktParsed(parsedCRS);
            } catch (err) {
              console.error("Error parsing WKT:", err);
            }
          }

          const arrayBuffer = await file.arrayBuffer();
          zip.file(file.name, arrayBuffer);
        }

        const zippedBuffer = await zip.generateAsync({ type: "arraybuffer" });
        const geoJsonData = await parseZip(zippedBuffer);
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
      <DialogContent className="z-[1400] w-[100vh] h-[90vh] p-4">
        <DialogHeader>
          <DialogTitle>Add file to layers</DialogTitle>
          <DialogDescription>
            Please select a directory with all ESRI Shapefile files for that
            specific shape.
          </DialogDescription>
          <div className="flex flex-col space-y-1 justify-center">
            <div className="flex p-4 space-y-4 flex-col justify-center items-center mt-4">
              <Input
                className="w-2/3"
                type="file"
                onClick={() => {
                  setWorkspaceError(null)
                  setIsWorkspaceError(false)
                  setGeoJson(null)
                  setWktParsed(null)
                  setIsOpenPreview(false)
                }}
                onChange={handleFileUpload}
                ref={(input) => input?.setAttribute("webkitdirectory", "true")}
              />
            </div>

            {isCRS3857 || wktParsed === null ? null : (
              <Alert variant="destructive">
                <AlertTitle className="font-bold flex items-center">
                  <Map className="mr-1" />
                  Bad Coordinate Reference System (CRS)
                </AlertTitle>
                <AlertDescription>
                  The file isn't using the correct CRS (<b className="font-bold">EPSG: 3857</b>). Reproject
                  your shapes if you want to use the same CRS as the map.
                </AlertDescription>
              </Alert>
            )}
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
          <div className="flex items-center justify-center space-x-4">
            {loading && <p>Loading...</p>}

            {isOpenPreview && !isWorkspaceError && (
              <div className="flex flex-col space-y-2">
                <h4 className="font-bold text-sm">
                  Coordinate Reference System (CRS)
                </h4>
                <ScrollArea className=" h-[20vh] w-[70vh] rounded-md border p-4 ">
                  <div className="h-full w-full overflow-auto">
                    <pre className="h-full w-full overflow-auto whitespace-pre-wrap text-sm">
                      {JSON.stringify(wktParsed, null, 2)}
                    </pre>
                  </div>
                </ScrollArea>
                <h4 className="font-bold text-sm">GeoJSON</h4>
                <ScrollArea className="h-[35vh] w-[70vh] rounded-md border p-4">
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
