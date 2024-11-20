import React, { useCallback } from 'react';
import {
  MenubarMenu,
  MenubarTrigger,
  Menubar,
} from "@/components/ui/menubar";
import { StyleFeature } from "./style-dialog";

type StyleFeatureMenubarProps = {
  selectedStyleFeature: StyleFeature;
  setSelectedStyleFeature: React.Dispatch<React.SetStateAction<StyleFeature>>;
};

export const StyleFeatureMenuBar = ({
  selectedStyleFeature,
  setSelectedStyleFeature,
}: StyleFeatureMenubarProps) => {
  const features = [
    { name: "Fill", value: "fill" },
    { name: "Stroke", value: "stroke" },
    { name: "Label", value: "label" },
  ];

  const handleKeyDown = useCallback((event: React.KeyboardEvent, feature: string) => {
    if (event.key === 'Enter') {
      setSelectedStyleFeature(feature as StyleFeature);
    }
  }, [setSelectedStyleFeature]);

  return (
    <Menubar className="w-auto">
      {features.map((feature) => (
        <MenubarMenu key={feature.value}>
          <MenubarTrigger
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, feature.value)}
            className={`
              ${selectedStyleFeature === feature.value
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
              }
            `}
            onClick={() =>
              setSelectedStyleFeature(feature.value as StyleFeature)
            }
          >
            {feature.name}
          </MenubarTrigger>
        </MenubarMenu>
      ))}
    </Menubar>
  );
};

