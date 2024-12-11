import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  ColorSchema,
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
import { useStyleState } from "@/hooks/useStyleState";
import { ColorSchemaMenuBar } from "./colorschema-menubar";
import { SingleColorSchemaStyleOptions } from "./single-color-schema-style-options";
import { CategorizedColorSchemaStyleOptions } from "./categorized-color-schema-style-options";

export type StyleFeature = "fill" | "stroke" | "label";

type StyleDialogProps = {
  featureCollection: FeatureCollectionWithFilenameAndState;
  changeStyle: (
    featureCollection: FeatureCollectionWithFilenameAndState,
    colorSchema: ColorSchema,
    style: PathOptionsWithPointAttributes,
    propertyValue?: string,
    propertyKey?: string,
  ) => void;
  changeColorSchema: (
    featureCollection: FeatureCollectionWithFilenameAndState,
    colorSchema: ColorSchema,
  ) => void;
  isStyleDialogOpen: boolean;
  setIsStyleDialogOpen: React.Dispatch<boolean>;
  tileLayerOptions: TileLayerOptions;
};

export const StyleDialog = ({
  featureCollection,
  changeStyle,
  changeColorSchema,
  isStyleDialogOpen,
  setIsStyleDialogOpen,
  tileLayerOptions,
}: StyleDialogProps) => {
  // later loop over features to have multiple styling (pallete for example)
  const style = featureCollection.features[0].style;
  const filename = featureCollection.fileName;

  const {
    isFill,
    setIsFill,
    isLabel,
    setIsLabel,
    // stroke,
    isStroke,
    fillColor,
    setFillColor,
    labelName,
    setLabelName,
    pointSize,
    setPointSize,
    fillOpacity,
    setFillOpacity,
    labelStyle,
    setLabelStyle,
    setIsStroke,
    strokeColor,
    setStrokeColor,
    strokeWeight,
    setStrokeWeight,
    strokeOpacity,
    colorSchemaType,
    isFillColorPicker,
    setIsFillColorPicker,
    setColorSchemaType,
    selectedStyleFeature,
    setSelectedStyleFeature,
    isStrokeColorPicker,
    setIsStrokeColorPicker,
    setStrokeOpacity,
    propertyKey,
    setPropertyKey,
  } = useStyleState(style, featureCollection.colorSchema);

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
              <ColorSchemaMenuBar
                colorSchemaType={colorSchemaType}
                setColorSchemaType={setColorSchemaType}
                featureCollection={featureCollection}
                changeColorSchema={changeColorSchema}
              />

              {colorSchemaType === ColorSchema.SINGLE && (
                <SingleColorSchemaStyleOptions
                  featureCollection={featureCollection}
                  selectedStyleFeature={selectedStyleFeature}
                  setSelectedStyleFeature={setSelectedStyleFeature}
                  isFill={isFill}
                  setIsFill={setIsFill}
                  isFillColorPicker={isFillColorPicker}
                  setIsFillColorPicker={setIsFillColorPicker}
                  fillColor={fillColor}
                  setFillColor={setFillColor}
                  fillOpacity={fillOpacity}
                  setFillOpacity={setFillOpacity}
                  pointSize={pointSize}
                  setPointSize={setPointSize}
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
                  isLabel={isLabel}
                  setIsLabel={setIsLabel}
                  labelName={labelName}
                  setLabelName={setLabelName}
                  labelStyle={labelStyle}
                  setLabelStyle={setLabelStyle}
                  colorSchemaType={colorSchemaType}
                  setColorSchemaType={setColorSchemaType}
                />
              )}

              {colorSchemaType === ColorSchema.CATEGORIZED && (
                <CategorizedColorSchemaStyleOptions
                  featureCollection={featureCollection}
                  propertyKey={propertyKey}
                  setPropertyKey={setPropertyKey}
                />
              )}
              <DialogFooter>
                <Button
                  onClick={() => {
                    changeStyle(
                      featureCollection,
                      colorSchemaType,
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
                            backgroundColor: labelStyle.backgroundColor,
                            border: labelStyle.border,
                            textSize: labelStyle.textSize,
                            shadow: labelStyle.shadow,
                            textColor: labelStyle.textColor,
                            className: labelStyle.className,
                          },
                        },
                      },
                      labelName,
                      propertyKey,
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
