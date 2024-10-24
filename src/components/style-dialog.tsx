import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ColorPicker } from "./color-picker";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { PathOptions } from "leaflet";
import { getRandomColor } from "@/lib/utils";
import { FeatureCollectionWithFilenameAndState } from "@/index.types";

type StyleDialogProps = {
  featureCollection: FeatureCollectionWithFilenameAndState;
  changeStyle: (filename: string | undefined, style: PathOptions) => void;
  isStyleDialogOpen: boolean;
  setIsStyleDialogOpen: React.Dispatch<boolean>;
};

export const StyleDialog = ({
  featureCollection,
  changeStyle,
  isStyleDialogOpen,
  setIsStyleDialogOpen,
}: StyleDialogProps) => {
  const style = featureCollection.style;

  const [isColorPicker, setIsColorPicker] = useState<boolean>(false);
  const [color, setColor] = useState<string>(style.color ?? getRandomColor());
  const [fillOpacity, setFillOpacity] = useState<number>(
    style.fillOpacity ?? 100
  );

  return (
    <Dialog open={isStyleDialogOpen} onOpenChange={setIsStyleDialogOpen}>
      <DialogTrigger className="w-full text-left">Style</DialogTrigger>
      <DialogContent className="flex flex-col w-auto justify-center z-[1400]">
        <DialogHeader>
          <DialogTitle>Style</DialogTitle>
          <DialogDescription>
            change the style of your components here
          </DialogDescription>
        </DialogHeader>
        <main className="flex flex-col">
          <div className="grid grid-cols-2 p-2 items-center justify-start">
            <p>Color</p>
            {isColorPicker ? (
              <DialogOverlay className="flex justify-center">
                <ColorPicker
                  color={color}
                  setColor={setColor}
                  setIsColorPicker={setIsColorPicker}
                />
              </DialogOverlay>
            ) : (
              <Badge
                onClick={() => setIsColorPicker(true)}
                className={`rounded-none w-auto h-6`}
                style={{ backgroundColor: color }}
              />
            )}
          </div>
          <Separator />
          <div className="grid grid-cols-2 items-end p-2">
            <p>Opacity:</p>
            <Input
              className="w-auto"
              type="number"
              max={1}
              min={0}
              step={0.1}
              defaultValue={fillOpacity}
              onChange={(event) => setFillOpacity(Number(event.target.value))}
            />
          </div>
          <Separator />
        </main>
        <DialogFooter>
          <Button
            onClick={() => {
              changeStyle(featureCollection.fileName, {
                color: color,
                stroke: style.stroke ?? true,
                fillOpacity: fillOpacity ?? 1,
                weight: style.weight ?? 2,
              });
              // setIsStyleDialogOpen(false);
            }}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
