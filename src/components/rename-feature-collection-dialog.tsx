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
import { useState } from "react";
import { FeatureCollectionWithFilenameAndState } from "@/index.types";
import { Button } from "./ui/button";

type RenameFeatureCollectionDialogProps = {
  isRenameFeatureCollectionDialogOpen: boolean;
  setIsRenameFeatureCollectionDialogOpen: React.Dispatch<boolean>;
  featureCollection: FeatureCollectionWithFilenameAndState;
  changeFeatureCollectionName: (
    featureCollection: FeatureCollectionWithFilenameAndState,
    name: string,
  ) => void;
};

export const RenameFeatureCollectionDialog = ({
  isRenameFeatureCollectionDialogOpen,
  setIsRenameFeatureCollectionDialogOpen,
  featureCollection,
  changeFeatureCollectionName,
}: RenameFeatureCollectionDialogProps) => {
  const [newName, setNewName] = useState<string | undefined>(
    featureCollection.fileName,
  );

  return (
    <Dialog
      open={isRenameFeatureCollectionDialogOpen}
      onOpenChange={setIsRenameFeatureCollectionDialogOpen}
    >
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
                type="text"
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          {newName && (
            <Button
              onClick={() => {
                changeFeatureCollectionName(featureCollection, newName);
                setIsRenameFeatureCollectionDialogOpen(false);
              }}
            >
              Apply
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
