import { StyleFeature } from "@/components/style-dialog";
import {
  ColorSchema,
  CustomTooltipOptions,
  PathOptionsWithPointAttributes,
} from "@/index.types";
import { getRandomColor } from "@/lib/utils";
import { useState } from "react";

export const useStyleState = (
  style: PathOptionsWithPointAttributes,
  colorSchema: ColorSchema,
) => {
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
  const [colorSchemaType, setColorSchemaType] = useState<ColorSchema>(
    colorSchema,
  );

  return {
    isFill,
    setIsFill,
    isFillColorPicker,
    setIsFillColorPicker,
    fillColor,
    setFillColor,
    fillOpacity,
    setFillOpacity,
    isStroke,
    setIsStroke,
    isStrokeColorPicker,
    setIsStrokeColorPicker,
    strokeColor,
    setStrokeColor,
    strokeWeight,
    setStrokeWeight,
    strokeOpacity,
    setStrokeOpacity,
    pointSize,
    setPointSize,
    isLabel,
    setIsLabel,
    labelName,
    setLabelName,
    labelStyle,
    setLabelStyle,
    selectedStyleFeature,
    setSelectedStyleFeature,
    colorSchemaType,
    setColorSchemaType
  };
};
