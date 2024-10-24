import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FeatureCollectionWithFilenameAndState } from "@/index.types";

type TableOfContentProps = {
  featureCollection: FeatureCollectionWithFilenameAndState;
  isTableOfContentOpen: boolean;
  setIsTableOfContentOpen: React.Dispatch<boolean>;
  toggleSelected: (filename: string | undefined) => void;
};

export const TableOfContent = ({
  featureCollection,
  isTableOfContentOpen,
  setIsTableOfContentOpen,
  toggleSelected,
}: TableOfContentProps) => {
  return (
    <Dialog open={isTableOfContentOpen} onOpenChange={setIsTableOfContentOpen}>
      <DialogTrigger className="w-full text-left">
        Table of content
      </DialogTrigger>
      <DialogContent className="z-[1000] w-11/12">
        <DialogHeader>
          <DialogTitle>Table of content</DialogTitle>
          <DialogDescription>
            This dialog contains the table of content for the feature
            collection. You can browse through each feature's properties in the
            list below.
          </DialogDescription>
        </DialogHeader>
        {featureCollection && (
          <ScrollArea className="h-[80vh] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  {featureCollection.features[0].properties
                    ? Object.keys(featureCollection.features[0].properties).map(
                        (key, index) => <TableHead key={index}>{key}</TableHead>
                      )
                    : "No headers for this collection"}
                </TableRow>
              </TableHeader>
              <TableBody
                className={
                  featureCollection.selected ? "bg-white bg-opacity-30" : ""
                }
                onClick={() => {
                  toggleSelected(featureCollection.fileName);
                }}
              >
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
      </DialogContent>
    </Dialog>
  );
};
