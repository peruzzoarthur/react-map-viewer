import { Dispatch, SetStateAction } from "react";
import { FillStyleSection } from "./fill-style-section";
import { PointStyleSection } from "./point-style-section";
import { StrokeStyleSection } from "./stroke-style-section";
import { StyleFeatureMenuBar } from "./style-features-menubar";
import { ColorSchema, CustomTooltipOptions, FeatureCollectionWithFilenameAndState } from "@/index.types";
import { StyleFeature } from "./style-dialog";
import { LabelStyleSection } from "./label-style-section";

type SingleColorSchemaStyleOptionsProps = {
  featureCollection: FeatureCollectionWithFilenameAndState;
  isFill: boolean;
  setIsFill: Dispatch<SetStateAction<boolean>>;
  isFillColorPicker: boolean;
  setIsFillColorPicker: Dispatch<SetStateAction<boolean>>;
  fillColor: string;
  setFillColor: Dispatch<SetStateAction<string>>;
  fillOpacity: number;
  setFillOpacity: Dispatch<SetStateAction<number>>;
  isStroke: boolean;
  setIsStroke: Dispatch<SetStateAction<boolean>>;
  isStrokeColorPicker: boolean;
  setIsStrokeColorPicker: Dispatch<SetStateAction<boolean>>;
  strokeColor: string;
  setStrokeColor: Dispatch<SetStateAction<string>>;
  strokeWeight: number;
  setStrokeWeight: Dispatch<SetStateAction<number>>;
  strokeOpacity: number;
  setStrokeOpacity: Dispatch<SetStateAction<number>>;
  pointSize?: number;
  setPointSize: Dispatch<SetStateAction<number | undefined>>;
  isLabel: boolean;
  setIsLabel: Dispatch<SetStateAction<boolean>>;
  labelName?: string;
  setLabelName: Dispatch<SetStateAction<string | undefined>>;
  labelStyle: CustomTooltipOptions;
  setLabelStyle: Dispatch<SetStateAction<CustomTooltipOptions>>;
  selectedStyleFeature: StyleFeature;
  setSelectedStyleFeature: Dispatch<SetStateAction<StyleFeature>>;
  colorSchemaType: ColorSchema;
  setColorSchemaType: Dispatch<SetStateAction<ColorSchema>>;
};

export const SingleColorSchemaStyleOptions = ({
  featureCollection,
  selectedStyleFeature,
  setSelectedStyleFeature,
  isFill,
  setIsFill,
  isFillColorPicker,
  setIsFillColorPicker,
  fillColor,
  setFillColor,
  fillOpacity,
  setFillOpacity,
  pointSize,
  setPointSize,
  isStroke,
  setIsStroke,
  strokeColor,
  setStrokeColor,
  isStrokeColorPicker,
  setIsStrokeColorPicker,
  strokeOpacity,
  setStrokeOpacity,
  strokeWeight,
  setStrokeWeight,
  isLabel,
  setIsLabel,
  labelStyle,
  setLabelStyle,
  labelName,
  setLabelName
}: SingleColorSchemaStyleOptionsProps) => {
  return (
    <>
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
    </>
  );
};
