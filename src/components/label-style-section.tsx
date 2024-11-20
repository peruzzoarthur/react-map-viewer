import { FeatureCollectionWithFilenameAndState } from "@/index.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { TooltipOptions } from "leaflet";
import { Input } from "./ui/input";

type LabelStyleSectionProps = {
  isLabel: boolean;
  setIsLabel: React.Dispatch<boolean>;
  labelName: string | undefined;
  setLabelName: React.Dispatch<string | undefined>;
  labelStyle: TooltipOptions;
  setLabelStyle: React.Dispatch<TooltipOptions>;
  featureCollection: FeatureCollectionWithFilenameAndState;
};

export const LabelStyleSection = ({
  isLabel,
  setIsLabel,
  labelName,
  setLabelName,
  labelStyle,
  setLabelStyle,
  featureCollection,
}: LabelStyleSectionProps) => {
  return (
    <section aria-labelledby="label-section" className="mb-2 mt-2">
      <h3 id="label-section" className="text-sm font-semibold">
        Label
      </h3>
      {/* Is Label? */}
      <div className="grid grid-cols-2 items-center p-2">
        <label className="text-sm" htmlFor="is-label">
          Label
        </label>
        <Switch
          className="justify-self-end"
          checked={isLabel}
          onCheckedChange={setIsLabel}
        />
      </div>

      {isLabel && (
        <>
          {/* Label Attribute */}
          <div className="grid grid-cols-2 items-center p-2">
            <label className="text-sm" htmlFor="label-attribute">
              Attribute
            </label>
            <Select
              defaultValue={labelName}
              onValueChange={(value) => setLabelName(value)}
            >
              <SelectTrigger className="w-auto">
                <SelectValue
                  placeholder={labelName ? labelName : "Select attribute"}
                />
              </SelectTrigger>
              <SelectContent className="z-[1500]">
                {Object.keys(
                  featureCollection.features[0].properties || {},
                ).map((key) => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label>CSS</label>

            <Input
              id="label-css"
              className="w-auto h-auto"
              type="string"
              defaultValue={labelStyle.className}
              onChange={(event) =>
                setLabelStyle({ ...labelStyle, className: event.target.value })
              }
            />
          </div>
        </>
      )}
    </section>
  );
};
