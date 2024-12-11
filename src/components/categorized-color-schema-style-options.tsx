import { FeatureCollectionWithFilenameAndState } from "@/index.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type CategorizedColorSchemaStyleOptionsProps = {
  featureCollection: FeatureCollectionWithFilenameAndState;
  propertyKey: string | undefined;
  setPropertyKey: React.Dispatch<React.SetStateAction<string | undefined>>;
};
export const CategorizedColorSchemaStyleOptions = ({
  featureCollection,
  propertyKey,
  setPropertyKey,
}: CategorizedColorSchemaStyleOptionsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 items-center p-2 space-y-4">
        <label className="text-sm" htmlFor="label-attribute">
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
      </div>
    </>
  );
};
