import { Circle, Eye, EyeClosed, Spline, Square } from "lucide-react";
import { Button } from "./ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
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

      <ContextMenu>
        <ContextMenuTrigger>
          <div className="flex space-x-1">
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
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="z-[1000]">
          <ContextMenuItem
            onClick={() => setSelectedFile(featureCollection ?? null)}
          >
            Zoom to layer
          </ContextMenuItem>
          {/* <ContextMenuItem
            onClick={() => {
              const newStyle = {
                color: "#800000",
                weight: 2,
                opacity: 2,
                stroke: true,
              };
              changeStyle(featureCollection?.fileName, newStyle);
            }}
          >
            Style
          </ContextMenuItem> */}

          {featureCollection && (
            <>
              <StyleDialog
                featureCollection={featureCollection}
                changeStyle={changeStyle}
              />
              <TableOfContent featureCollection={featureCollection} />
            </>
          )}
          <ContextMenuItem onClick={() => removeFileFromWorkspace(filename)}>
            Remove from workspace
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};
