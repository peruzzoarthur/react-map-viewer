import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { getRandomColor } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "./ui/scroll-area";
import { FeatureCollectionWithFilename } from "shpjs";

type AddLayerProps = {
  geoJson: FeatureCollectionWithFilename | null;
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

export const AddLayer = ({
  geoJson,
  handleFileUpload,
  addFileToWorkspace,
  setIsOpenPreview,
  isOpenPreview,
  loading,
}: AddLayerProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        <PlusCircle />
      </DialogTrigger>
      <DialogContent className="z-[1000] w-[100vh] h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add file to layers</DialogTitle>
          <DialogDescription>
            select a .zip of your shapefiles
          </DialogDescription>
          <div className="flex justify-center">
            <div className="flex p-4 space-y-4 flex-col justify-center items-center mt-4">
              <Input
                className="w-full"
                type="file"
                onChange={handleFileUpload}
                accept=".zip"
              />
              {geoJson && (
                <Button
                  onClick={() => {
                    const color = getRandomColor();
                    addFileToWorkspace(geoJson, color);
                    setIsOpenPreview(false);
                  }}
                >
                  Add to workspace
                </Button>
              )}
              {loading && <p>Loading...</p>}
            </div>
            {isOpenPreview && (
              <ScrollArea className="h-[70vh] w-[60vh] rounded-md border p-4">
                <div className="h-full w-full overflow-auto">
                  <pre className="h-full w-full overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(geoJson, null, 2)}
                  </pre>
                </div>
                <ScrollBar className="bg-black" orientation="vertical" />
              </ScrollArea>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
