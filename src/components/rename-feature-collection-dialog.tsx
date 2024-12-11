import {
  Dialog,
  DialogContent,
  DialogDescription,
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
       Rename 
      </DialogTrigger>
      <DialogContent className="z-[1400] w-[100vh] h-auto p-4">
        <DialogHeader>
          <DialogTitle>Rename file</DialogTitle>
          <DialogDescription>
            this is a collection of features, rename it here.
          </DialogDescription>
          <div className="flex justify-center">
            <div className="flex p-4 space-y-4 flex-col justify-center items-center mt-4">
              <Input
                className="w-full"
                type="text"
                onChange={(e) => setNewName(e.target.value)}
              />
              {newName && (
                <Button
                  className="w-1/3"
                  onClick={() => {
                    changeFeatureCollectionName(featureCollection, newName);
                    setIsRenameFeatureCollectionDialogOpen(false);
                  }}
                >
                  Apply
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
