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
import { Separator } from "./ui/separator";
import { getRandomColor } from "@/lib/utils";
import {
  CustomTooltipOptions,
  FeatureCollectionWithFilenameAndState,
  FeatureWithState,
  PathOptionsWithPointAttributes,
  TileLayerOptions,
} from "@/index.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import { GeoJSON } from "react-leaflet";
import FitLayer from "./fit-layer";
import { FillStyleSection } from "./fill-style-section";
import { StrokeStyleSection } from "./stroke-style-section";
import { PointStyleSection } from "./point-style-section";
import { LabelStyleSection } from "./label-style-section";
import { StyleFeatureMenuBar } from "./style-features-menubar";

export type StyleFeature = "fill" | "stroke" | "label";

type StyleDialogProps = {
  featureCollection: FeatureCollectionWithFilenameAndState;
  changeStyle: (
    file: FeatureCollectionWithFilenameAndState,
    style: PathOptionsWithPointAttributes,
    propertyKey: string | null,
  ) => void;

  isStyleDialogOpen: boolean;
  setIsStyleDialogOpen: React.Dispatch<boolean>;
  tileLayerOptions: TileLayerOptions;
};

export const StyleDialog = ({
  featureCollection,
  changeStyle,
  isStyleDialogOpen,
  setIsStyleDialogOpen,
  tileLayerOptions,
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
  const [strokeOpacity, setStrokeOpacity] = useState<number>(
    style.opacity ?? 1,
  );
  const [pointSize, setPointSize] = useState<number | undefined>(
    style.pointSize,
  );
  const [isLabel, setIsLabel] = useState<boolean>(style.label.isLabel);
  const [labelName, setLabelName] = useState<string | undefined>(
    style.label.labelName,
  );
  const [labelStyle, setLabelStyle] = useState<CustomTooltipOptions>(
    style.label.style,
  );
  const [selectedStyleFeature, setSelectedStyleFeature] =
    useState<StyleFeature>("fill");

  return (
    <Dialog open={isStyleDialogOpen} onOpenChange={setIsStyleDialogOpen}>
      <DialogTrigger className="w-full text-left">Style</DialogTrigger>
      <DialogContent className="flex flex-col w-[60vw] h-[80vh] stify-center z-[1400]">
        <ScrollArea className="h-full w-full justify-center items-center p-2 rounded-md">
          <DialogHeader>
            <DialogTitle>Style layer</DialogTitle>
            <DialogDescription>
              change the style of {filename}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-start space-x-4">
            <main className="flex flex-col w-3/5 space-y-4 py-4">
              <StyleFeatureMenuBar
                selectedStyleFeature={selectedStyleFeature}
                setSelectedStyleFeature={setSelectedStyleFeature}
              />
              {selectedStyleFeature === "fill" && (
                <>
                  <FillStyleSection
                    isFill={isFill}
                    setIsFill={setIsFill}
                    isFillColorPicker={isFillColorPicker}
                    setIsFillColorPicker={setIsFillColorPicker}
                    fillColor={fillColor}
                    setFillColor={setFillColor}
                    fillOpacity={fillOpacity}
                    setFillOpacity={setFillOpacity}
                  />

                  {featureCollection.features[0].geometry.type === "Point" && (
                    <PointStyleSection
                      pointSize={pointSize}
                      setPointSize={setPointSize}
                    />
                  )}
                </>
              )}

              {selectedStyleFeature === "stroke" && (
                <StrokeStyleSection
                  isStroke={isStroke}
                  setIsStroke={setIsStroke}
                  strokeColor={strokeColor}
                  setStrokeColor={setStrokeColor}
                  isStrokeColorPicker={isStrokeColorPicker}
                  setIsStrokeColorPicker={setIsStrokeColorPicker}
                  strokeOpacity={strokeOpacity}
                  setStrokeOpacity={setStrokeOpacity}
                  strokeWeight={strokeWeight}
                  setStrokeWeight={setStrokeWeight}
                />
              )}
              {selectedStyleFeature === "label" && (
                <LabelStyleSection
                  isLabel={isLabel}
                  setIsLabel={setIsLabel}
                  labelName={labelName}
                  setLabelName={setLabelName}
                  labelStyle={labelStyle}
                  setLabelStyle={setLabelStyle}
                  featureCollection={featureCollection}
                />
              )}

              <DialogFooter>
                <Button
                  onClick={() => {
                    changeStyle(
                      featureCollection,
                      {
                        stroke: isStroke,
                        color: strokeColor,
                        opacity: strokeOpacity,
                        weight: strokeWeight,
                        fillColor: fillColor,
                        fill: isFill,
                        fillOpacity: fillOpacity,
                        pointSize: pointSize,
                        label: {
                          isLabel: isLabel,
                          labelName: labelName,
                          attribute: null,
                          style: {
                            permanent: labelStyle.permanent,
                            direction: labelStyle.direction,
                            opacity: labelStyle.opacity,
                            // className: labelStyle.className,
                            backgroundColor: labelStyle.backgroundColor,
                            className: `${labelStyle.backgroundColor}`
                          },
                        },
                      },
                      labelName ?? null,
                    );
                    setIsStyleDialogOpen(false);
                  }}
                >
                  Apply
                </Button>
              </DialogFooter>
            </main>

            <Separator orientation="vertical" className="h-[60vh]" />

            {/* Preview layer */}
            <MapContainer
              className="h-[60vh] w-full z-80"
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution={tileLayerOptions.attribution}
                url={tileLayerOptions.url}
              />
              <FitLayer layerData={featureCollection} />
              <GeoJSON
                key={
                  featureCollection.features[0].geometry.type === "Point"
                    ? `${featureCollection.fileName}_${featureCollection.updatedAt}_${pointSize}_${isLabel}_${labelName}_${labelStyle.className}_${labelStyle.permanent}_${labelStyle.direction}_${labelStyle.opacity}`
                    : `${featureCollection.fileName}_${featureCollection.updatedAt}_${isLabel}_${labelName}_${labelStyle.className}_${labelStyle.permanent}_${labelStyle.direction}_${labelStyle.opacity}`
                }
                style={{
                  stroke: isStroke,
                  color: strokeColor,
                  opacity: strokeOpacity,
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
                onEachFeature={(feature, layer) => {
                  const featureWithState = feature as FeatureWithState;

                  if (isLabel && labelName && featureWithState.properties) {
                    const attribute = featureWithState.properties[labelName];
                    layer.bindTooltip(String(attribute), labelStyle);
                  }
                }}
              />
            </MapContainer>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
