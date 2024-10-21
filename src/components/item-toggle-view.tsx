import { Dot, Eye, EyeClosed, Spline, Square } from "lucide-react";
import { Button } from "./ui/button";

type GeometryType =
  | "Point"
  | "MultiPoint"
  | "LineString"
  | "MultiLineString"
  | "Polygon"
  | "MultiPolygon"
  | "GeometryCollection";
type ItemToggleViewProps = {
  state: boolean;
  setState: React.Dispatch<boolean>;
  filename: string;
  geometryType?: GeometryType;
};

export const ItemToggleView = ({
  setState,
  state,
  filename,
  geometryType,
}: ItemToggleViewProps) => {
  return (
    <div className="flex items-center space-x-1">
      {state ? (
        <Button variant="ghost" onClick={() => setState(false)}>
          <Eye />
        </Button>
      ) : (
        <Button variant="ghost" onClick={() => setState(true)}>
          <EyeClosed />
        </Button>
      )}
      <p>{filename}</p>
      {geometryType === "Polygon" && <Square />}
      {geometryType === "LineString" && <Spline />}
      {geometryType === "Point" && <Dot />}
    </div>
  );
};
