import React, { useCallback } from "react";
import { MenubarMenu, MenubarTrigger, Menubar } from "@/components/ui/menubar";
import {
  ColorSchema,
  FeatureCollectionWithFilenameAndState,
} from "@/index.types";

type ColorSchemaMenubarProps = {
  colorSchemaType: ColorSchema;
  setColorSchemaType: React.Dispatch<React.SetStateAction<ColorSchema>>;
  featureCollection: FeatureCollectionWithFilenameAndState;
  changeColorSchema: (
    featureCollection: FeatureCollectionWithFilenameAndState,
    colorSchema: ColorSchema,
  ) => void;
};

export const ColorSchemaMenuBar = ({
  colorSchemaType,
  setColorSchemaType,
  featureCollection,
  changeColorSchema,
}: ColorSchemaMenubarProps) => {
  const features = [
    { name: "Single", value: ColorSchema.SINGLE },
    { name: "Categorized", value: ColorSchema.CATEGORIZED },
  ];

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, feature: ColorSchema) => {
      if (event.key === "Enter") {
        setColorSchemaType(feature);
        changeColorSchema(featureCollection, feature);
      }
    },
    [setColorSchemaType],
  );

  return (
    <Menubar className="w-auto">
      {features.map((feature) => (
        <MenubarMenu key={feature.value}>
          <MenubarTrigger
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, feature.value)}
            className={`
              ${
                colorSchemaType === feature.value
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }
            `}
            onClick={() => {
              setColorSchemaType(feature.value);
              changeColorSchema(featureCollection, feature.value);
            }}
          >
            {feature.name}
          </MenubarTrigger>
        </MenubarMenu>
      ))}
    </Menubar>
  );
};
