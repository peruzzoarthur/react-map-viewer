import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  // DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { ColorPicker } from "./color-picker";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { getRandomColor } from "@/lib/utils";
import {
  FeatureCollectionWithFilenameAndState,
  PathOptionsWithPointAttributes,
} from "@/index.types";
import { Switch } from "./ui/switch";

type StyleDialogProps = {
  featureCollection: FeatureCollectionWithFilenameAndState;
  // changeStyle: (filename: string | undefined, style: PathOptions) => void;
  changeStyle: (
    file: FeatureCollectionWithFilenameAndState,
    style: PathOptionsWithPointAttributes,
  ) => void;

  isStyleDialogOpen: boolean;
  setIsStyleDialogOpen: React.Dispatch<boolean>;
};

export const StyleDialog = ({
  featureCollection,
  changeStyle,
  isStyleDialogOpen,
  setIsStyleDialogOpen,
}: StyleDialogProps) => {
  // later loop over features to have multiple styling (pallete for example)
  const style = featureCollection.features[0].style;

  const [isFill, setIsFill] = useState<boolean>(style.fill ?? true);
  const [isFillColorPicker, setIsFillColorPicker] = useState<boolean>(false);
  const [fillColor, setFillColor] = useState<string>(
    style.fillColor ?? getRandomColor(),
  );
  const [fillOpacity, setFillOpacity] = useState<number>(
    style.fillOpacity ?? 100,
  );

  const [isStroke, setIsStroke] = useState<boolean>(true);
  const [isStrokeColorPicker, setIsStrokeColorPicker] =
    useState<boolean>(false);
  const [strokeColor, setStrokeColor] = useState<string>(
    style.color ?? getRandomColor(),
  );
  const [strokeWeight, setStrokeWeight] = useState<number>(style.weight ?? 2);

  const [pointSize, setPointSize] = useState<number | undefined>(
    style.pointSize,
  );

  console.log(style);
  return (
    <Dialog  open={isStyleDialogOpen} onOpenChange={setIsStyleDialogOpen}>
      <DialogTrigger className="w-full text-left">Style</DialogTrigger>
      <DialogContent className="flex flex-col w-2/5 h-2/3 justify-center z-[1400]">
        <DialogHeader>
          <DialogTitle>Style layer</DialogTitle>
          <DialogDescription>
            {`change the style of '${featureCollection.fileName}' here`}
          </DialogDescription>
        </DialogHeader>
        <main className="flex flex-col">
          {/* Fill Section */}
          <section aria-labelledby="fill-section" className="mb-2">
            <h3 id="fill-section" className="text-sm font-semibold">
              Fill Style
            </h3>

            {/* Is Fill? */}
            <div className="grid grid-cols-2 items-center p-2">
              <label className="text-sm" htmlFor="is-fill">
                Fill
              </label>
              <Switch checked={isFill} onCheckedChange={setIsFill} />
            </div>

            {isFill && (
              <>
                {/* Color Property */}
                <div className="grid grid-cols-2 p-2 items-center">
                  <label htmlFor="fill-color" className="text-sm">
                    Color
                  </label>
                  {isFillColorPicker ? (
                    <ColorPicker
                      color={fillColor}
                      setColor={setFillColor}
                      setIsColorPicker={setIsFillColorPicker}
                    />
                  ) : (
                    <Button
                      onClick={() => setIsFillColorPicker(true)}
                      className="rounded-none w-auto h-6"
                      id="fill-color"
                      style={{ backgroundColor: fillColor }}
                    />
                  )}
                </div>

                {/* Opacity Property */}
                <div className="grid grid-cols-2 items-center p-2">
                  <label className="text-sm" htmlFor="fill-opacity">
                    Opacity:
                  </label>
                  <Input
                    id="fill-opacity"
                    className="w-auto"
                    type="number"
                    max={1}
                    min={0}
                    step={0.1}
                    defaultValue={fillOpacity}
                    onChange={(event) =>
                      setFillOpacity(Number(event.target.value))
                    }
                  />
                </div>
              </>
            )}
          </section>

          {/* Separator */}
          <Separator />

          <section aria-labelledby="stroke-section" className="mb-2 mt-2">
            <h3 id="stroke-section" className="text-sm font-semibold">
              Stroke Style
            </h3>
            {/* Is Stroke? */}
            <div className="grid grid-cols-2 items-center p-2">
              <label className="text-sm" htmlFor="is-stroke">
                Stroke
              </label>
              <Switch checked={isStroke} onCheckedChange={setIsStroke} />
            </div>

            {isStroke && (
              <>
                {/* Color Property */}
                <div className="grid grid-cols-2 p-2 items-center">
                  <label htmlFor="fill-color" className="text-sm">
                    Color
                  </label>
                  {isStrokeColorPicker ? (
                    <ColorPicker
                      color={strokeColor}
                      setColor={setStrokeColor}
                      setIsColorPicker={setIsStrokeColorPicker}
                    />
                  ) : (
                    <Button
                      onClick={() => setIsStrokeColorPicker(true)}
                      className="rounded-none w-auto h-6"
                      id="stroke-color"
                      style={{ backgroundColor: strokeColor }}
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 items-center p-2">
                  <label className="text-sm" htmlFor="stroke-weight">
                    Weight:
                  </label>
                  <Input
                    id="stroke-weight"
                    className="w-auto"
                    step={0.5}
                    type="number"
                    min={0}
                    defaultValue={strokeWeight}
                    onChange={(event) =>
                      setStrokeWeight(Number(event.target.value))
                    }
                  />
                </div>
              </>
            )}
          </section>

          {featureCollection.features[0].geometry.type === "Point" && (
            <>
              <Separator />

              <section aria-labelledby="stroke-section" className="mb-2 mt-2">
                <h3 id="stroke-section" className="text-sm font-semibold">
                  Point Style
                </h3>

                <div className="grid grid-cols-2 items-center p-2">
                  <label className="text-sm" htmlFor="stroke-weight">
                    Radius
                  </label>
                  <Input
                    id="stroke-weight"
                    className="w-auto"
                    step={1}
                    type="number"
                    min={0}
                    defaultValue={pointSize}
                    onChange={(event) =>
                      setPointSize(Number(event.target.value))
                    }
                  />
                </div>
              </section>
            </>
          )}
        </main>

        <DialogFooter>
          <Button
            onClick={() => {
              changeStyle(featureCollection, {
                stroke: isStroke,
                color: strokeColor,
                weight: strokeWeight ?? 2,
                fillColor: fillColor,
                fill: isFill,
                fillOpacity: fillOpacity ?? 1,
                pointSize: pointSize,
              });
            }}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
