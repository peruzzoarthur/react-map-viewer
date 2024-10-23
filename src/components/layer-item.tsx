import { Circle, Eye, EyeClosed, Spline, Square } from "lucide-react";
import { Button } from "./ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FeatureCollectionWithFilenameAndState } from "@/hooks/useWorkspace";
import { TableOfContent } from "./table-of-content";
import { StyleDialog } from "./style-dialog";
import { PathOptions } from "leaflet";

type LayerItemProps = {
  state: boolean;
  setState: React.Dispatch<boolean>;
  featureCollection?: FeatureCollectionWithFilenameAndState;
  filename?: string;
  removeFileFromWorkspace: (filename: string | undefined) => void;
  changeStyle: (filename: string | undefined, style: PathOptions) => void;
  setSelectedFile: React.Dispatch<
    React.SetStateAction<FeatureCollectionWithFilenameAndState | null>
  >;
};

export const LayerItem = ({
  setState,
  state,
  featureCollection,
  filename,
  removeFileFromWorkspace,
  changeStyle,
  setSelectedFile,
}: LayerItemProps) => {
  if (!filename) {
    filename = featureCollection?.fileName;
  }
  const features = featureCollection?.features;
  const geometryType = features ? features[0].geometry.type : null;

  return (
    <div className="flex items-center space-x-1 cursor-pointer">
      {state ? (
        <Button variant="ghost" onClick={() => setState(false)}>
          <Eye />
        </Button>
      ) : (
        <Button variant="ghost" onClick={() => setState(true)}>
          <EyeClosed />
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            className="flex space-x-1 hover:bg-white hover:bg-opacity-0"
          >
            <p>{filename}</p>
            {geometryType === "Polygon" && (
              <Square style={{ stroke: featureCollection?.style.color }} />
            )}
            {geometryType === "LineString" && (
              <Spline style={{ stroke: featureCollection?.style.color }} />
            )}
            {geometryType === "Point" && (
              <Circle style={{ stroke: featureCollection?.style.color }} />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-[1000]">
          <DropdownMenuItem
            onClick={() => setSelectedFile(featureCollection ?? null)}
          >
            Zoom to layer
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            {featureCollection && (
              <StyleDialog
                featureCollection={featureCollection}
                changeStyle={changeStyle}
              />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            {featureCollection && (
              <TableOfContent featureCollection={featureCollection} />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => removeFileFromWorkspace(filename)}>
            Remove from workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
