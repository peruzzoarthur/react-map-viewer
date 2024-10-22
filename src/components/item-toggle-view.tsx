import { Dot, Eye, EyeClosed, Spline, Square } from "lucide-react";
import { Button } from "./ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
          <p className="flex ">
            {filename}
            {geometryType === "Polygon" && <Square />}
            {geometryType === "LineString" && <Spline />}
            {geometryType === "Point" && <Dot />}
          </p>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => {
              console.log("orange is the color");
            }}
          >
            Style
          </ContextMenuItem>

          <Dialog>
            <DialogTrigger className="relative w-full flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              Table of content
            </DialogTrigger>
            <DialogContent className="z-[1000]">
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <ContextMenuItem>Remove from workspace</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};
