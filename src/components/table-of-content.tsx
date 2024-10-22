import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FeatureCollectionWithFilenameAndState } from "@/hooks/useWorkspace";
import { ScrollArea } from "./ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TableOfContentProps = {
  featureCollection: FeatureCollectionWithFilenameAndState;
};

export const TableOfContent = ({ featureCollection }: TableOfContentProps) => {
  return (
    <Dialog>
      <DialogTrigger className="relative w-full flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
        Table of content
      </DialogTrigger>
      <DialogContent className="z-[1000] w-full">
        <DialogHeader>
          <DialogTitle>Table of content</DialogTitle>
          <DialogDescription className="w-full h-full">
            {featureCollection && (
              <ScrollArea className="h-full w-full">
                <Table>
                  <TableCaption>Table of content</TableCaption>
                  <TableHeader>
                    <TableRow>
                      {featureCollection.features[0].properties
                        ? Object.keys(
                            featureCollection.features[0].properties
                          ).map((key, index) => (
                            <TableHead key={index}>{key}</TableHead>
                          ))
                        : "No headers for this collection"}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {featureCollection.features.map((feature, index) =>
                      feature.properties ? (
                        <TableRow key={index}>
                          {Object.entries(feature.properties).map(
                            ([_key, value], cellIndex) => (
                              <TableCell key={cellIndex}>{value}</TableCell>
                            )
                          )}
                        </TableRow>
                      ) : (
                        "No properties available"
                      )
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
