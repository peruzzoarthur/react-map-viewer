import {
  BrewerPalette,
  FeatureCollectionWithFilenameAndState,
} from "@/index.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { brewer } from "chroma-js";
import { Badge } from "./ui/badge";

type CategorizedColorSchemaStyleOptionsProps = {
  featureCollection: FeatureCollectionWithFilenameAndState;
  propertyKey: string | undefined;
  setPropertyKey: React.Dispatch<React.SetStateAction<string | undefined>>;
  brewerPalette: BrewerPalette | undefined;
  setBrewerPalette: React.Dispatch<
    React.SetStateAction<BrewerPalette | undefined>
  >;
};
export const CategorizedColorSchemaStyleOptions = ({
  featureCollection,
  propertyKey,
  setPropertyKey,
  brewerPalette,
  setBrewerPalette,
}: CategorizedColorSchemaStyleOptionsProps) => {
  const handlePaletteChange = (value: BrewerPalette) => {
    setBrewerPalette(value);
  };
  return (
    <>
      <div className="grid grid-cols-2 items-center p-2 space-y-4">
        <label className="text-sm" htmlFor="property-key-attribute">
          Attribute
        </label>
        <Select
          defaultValue={propertyKey}
          onValueChange={(value) => setPropertyKey(value)}
        >
          <SelectTrigger className="w-auto">
            <SelectValue
              placeholder={propertyKey ? propertyKey : "Select attribute"}
            />
          </SelectTrigger>
          <SelectContent className="z-[1500]">
            {Object.keys(featureCollection.features[0].properties || {}).map(
              (key) => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>

        <label className="text-sm" htmlFor="colors-palette">
          Palette
        </label>
        <Select
          defaultValue={brewerPalette || undefined}
          onValueChange={(value) => handlePaletteChange(value as BrewerPalette)}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder={brewerPalette || "Select palette"} />
          </SelectTrigger>
          <SelectContent className="z-[1500]">
            {Object.keys(brewer).map((palette) => (
              <SelectItem key={palette} value={palette}>
                {palette}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        {brewerPalette && (
          <div className="flex justify-center items-center w-full">
            {brewer[brewerPalette].map((color, index) => (
              <Badge key={index} style={{ backgroundColor: color }} className="h-10 w-10 border-none rounded-none" />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
