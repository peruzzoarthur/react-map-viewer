import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import { GeoJSON } from "react-leaflet";
import FitLayer from "./fit-layer";

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
  const filename = featureCollection.fileName;

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

  return (
    <Dialog open={isStyleDialogOpen} onOpenChange={setIsStyleDialogOpen}>
      <DialogTrigger className="w-full text-left">Style</DialogTrigger>
      <DialogContent className="flex flex-col w-[60vw] h-[80vh] stify-center z-[1400]">
        <ScrollArea className="h-full w-full justify-center items-center p-2 rounded-md">
          <DialogHeader>
            <DialogTitle>Style layer</DialogTitle>
            <DialogDescription>
              <p>{`change the style of ${filename}`}</p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center space-x-4">
            <main className="flex flex-col w-3/5">
              {/* Fill Section */}
              <section aria-labelledby="fill-section" className="mt-2 mb-2">
                <h3 id="fill-section" className="text-sm font-semibold">
                  Fill Style
                </h3>

                {/* Is Fill? */}
                <div className="grid grid-cols-2 items-center p-2">
                  <label className="text-sm" htmlFor="is-fill">
                    Fill
                  </label>
                  <Switch className="justify-self-end" checked={isFill} onCheckedChange={setIsFill} />
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
                  <Switch className="justify-self-end" checked={isStroke} onCheckedChange={setIsStroke} />
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

                  <section
                    aria-labelledby="stroke-section"
                    className="mb-2 mt-2"
                  >
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
                    setIsStyleDialogOpen(false)
                  }}
                >
                  Apply
                </Button>
              </DialogFooter>
            </main>

            <Separator orientation="vertical" />

            {/* Preview layer */}
            <MapContainer
              className="h-[60vh] w-full z-80"
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url=" https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              <FitLayer layerData={featureCollection} />
              <GeoJSON
                style={{
                  stroke: isStroke,
                  color: strokeColor,
                  weight: strokeWeight ?? 2,
                  fillColor: fillColor,
                  fill: isFill,
                  fillOpacity: fillOpacity ?? 1,
                }}
                data={featureCollection}
                pointToLayer={(_geoJsonPoint, latlng) => {
                  const marker = L.circleMarker(latlng, {
                    radius: pointSize ?? 5,
                  });
                  return marker;
                }}
              />
            </MapContainer>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
