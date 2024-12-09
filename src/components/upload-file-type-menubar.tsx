
import React, { useCallback } from 'react';
import {
  MenubarMenu,
  MenubarTrigger,
  Menubar,
} from "@/components/ui/menubar";
import { UploadFileType } from './add-layer-dialog';

type FileTypeMenubarProps = {
  fileType: 'shp' | 'geojson';
  setFileType: React.Dispatch<React.SetStateAction<UploadFileType>>
};

export const UploadFileTypeMenuBar = ({
  fileType,
  setFileType
}: FileTypeMenubarProps) => {
  const features = [
    { name: "Shape", value: "shp" },
    { name: "GeoJSON", value: "geojson" },
  ];

  const handleKeyDown = useCallback((event: React.KeyboardEvent, feature: string) => {
    if (event.key === 'Enter') {
      setFileType(feature as UploadFileType)
    }
  }, [setFileType]);

  return (
    <Menubar className="w-auto">
      {features.map((feature) => (
        <MenubarMenu key={feature.value}>
          <MenubarTrigger
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, feature.value)}
            className={`
              ${fileType === feature.value
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
              }
            `}
            onClick={() =>
              setFileType(feature.value as UploadFileType)
            }
          >
            {feature.name}
          </MenubarTrigger>
        </MenubarMenu>
      ))}
    </Menubar>
  );
};

