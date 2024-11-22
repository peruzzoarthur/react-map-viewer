import { CustomTooltipOptions, FeatureCollectionWithFilenameAndState } from "@/index.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Direction } from "leaflet";
import { Input } from "./ui/input";
import { backgroundColors, borderSizes, getBackgroundColor, getBorderSize, getTextSize, textSizes, updateBackgroundClass, updateBorderClass, updateTextSizeClass } from "@/lib/utils";

type LabelStyleSectionProps = {
  isLabel: boolean;
  setIsLabel: React.Dispatch<boolean>;
  labelName: string | undefined;
  setLabelName: React.Dispatch<string | undefined>;
  labelStyle: CustomTooltipOptions;
  setLabelStyle: React.Dispatch<CustomTooltipOptions>;
  featureCollection: FeatureCollectionWithFilenameAndState;
};

const directions: Direction[] = [
  "right",
  "left",
  "top",
  "bottom",
  "center",
  "auto",
];


export const LabelStyleSection = ({
  isLabel,
  setIsLabel,
  labelName,
  setLabelName,
  labelStyle,
  setLabelStyle,
  featureCollection,
}: LabelStyleSectionProps) => {

  const backgroundColor = getBackgroundColor(labelStyle.backgroundColor)
  const borderSize = getBorderSize(labelStyle.border)
  const textSize = getTextSize(labelStyle.textSize)

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
          <div className="grid grid-cols-2 items-center p-2 space-y-4">
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

            <label className="text-sm" htmlFor="is-label-permanent">
              Permanent
            </label>
            <Switch
              className="justify-self-end"
              checked={labelStyle.permanent}
              onCheckedChange={(bool) =>
                setLabelStyle({ ...labelStyle, permanent: bool })
              }
            />

            <label className="text-sm" htmlFor="label-direction">
              Direction
            </label>
            <Select
              defaultValue={labelStyle.direction}
              onValueChange={(value: Direction) =>
                setLabelStyle({ ...labelStyle, direction: value })
              }
            >
              <SelectTrigger className="w-auto">
                <SelectValue
                  placeholder={labelStyle.direction ?? "Select direction"}
                />
              </SelectTrigger>
              <SelectContent className="z-[1500]">
                {directions.map((key) => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label className="text-sm" htmlFor="fill-opacity">
              Opacity:
            </label>
            <Input
              id="fill-opacity"
              className="w-auto"
              type="number"
              max={1}
              min={0}
              step={0.1}
              defaultValue={labelStyle.opacity}
              onChange={(event) =>
                setLabelStyle({
                  ...labelStyle,
                  opacity: Number(event.target.value),
                })
              }
            />


            <label className="text-sm" htmlFor="label-bg-color">
              Background
            </label>
            <Select
              defaultValue={backgroundColor?.value}
              onValueChange={(value) => {
                if (labelStyle.className) {
                  const newClassName = updateBackgroundClass(labelStyle.className, value)
                  setLabelStyle({ ...labelStyle, backgroundColor: value, className: newClassName })
                }
              }
              }
            >
              <SelectTrigger className="w-auto">
                <SelectValue
                  placeholder={backgroundColor?.key ?? "Select background"}
                />
              </SelectTrigger>
              <SelectContent className="z-[1500]">
                {backgroundColors.map((object) => (
                  <SelectItem key={object.key} value={object.value}>
                    {object.key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label className="text-sm" htmlFor="label-border-size">
              Border
            </label>
            <Select
              defaultValue={borderSize?.value}
              onValueChange={(value) => {
                if (labelStyle.className) {
                  const newClassName = updateBorderClass(labelStyle.className, value)
                  setLabelStyle({ ...labelStyle, border: value, className: newClassName })
                }
              }
              }
            >
              <SelectTrigger className="w-auto">
                <SelectValue
                  placeholder={borderSize?.key ?? "Select border size"}
                />
              </SelectTrigger>
              <SelectContent className="z-[1500]">
                {borderSizes.map((object) => (
                  <SelectItem key={object.key} value={object.value}>
                    {object.key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label className="text-sm" htmlFor="label-text-size">
              Text
            </label>
            <Select
              defaultValue={textSize?.value}
              onValueChange={(value) => {
                if (labelStyle.className) {
                  const newClassName = updateTextSizeClass(labelStyle.className, value)
                  setLabelStyle({ ...labelStyle, textSize: value, className: newClassName })
                }
              }
              }
            >
              <SelectTrigger className="w-auto">
                <SelectValue
                  placeholder={textSize?.key ?? "Select text size"}
                />
              </SelectTrigger>
              <SelectContent className="z-[1500]">
                {textSizes.map((object) => (
                  <SelectItem key={object.key} value={object.value}>
                    {object.key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-col w-full col-span-2">
              <label>CSS</label>
              <Input
                id="label-css"
                className="w-auto min-w-[10ch] h-[120px] max-w-full border rounded px-2 focus:outline-none overflow-x-auto"
                type="string"
                defaultValue={labelStyle.className}
                onChange={(event) =>
                  setLabelStyle({
                    ...labelStyle,
                    className: event.target.value,
                  })
                }
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
};
