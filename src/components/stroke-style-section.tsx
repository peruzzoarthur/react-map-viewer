import { ColorPicker } from "./color-picker";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";

type StrokeStyleSectionProps = {
  isStroke: boolean;
  setIsStroke: React.Dispatch<boolean>;
  strokeColor: string;
  setStrokeColor: React.Dispatch<string>;
  isStrokeColorPicker: boolean;
  setIsStrokeColorPicker: React.Dispatch<boolean>;
  strokeOpacity: number;
  setStrokeOpacity: React.Dispatch<number>;
  strokeWeight: number;
  setStrokeWeight: React.Dispatch<number>;
};

export const StrokeStyleSection = ({
  isStroke,
  setIsStroke,
  strokeColor,
  setStrokeColor,
  isStrokeColorPicker,
  setIsStrokeColorPicker,
  strokeOpacity,
  setStrokeOpacity,
  strokeWeight,
  setStrokeWeight,
}: StrokeStyleSectionProps) => {
  return (
    <section aria-labelledby="stroke-section" className="mb-2 mt-2">
      <h3 id="stroke-section" className="text-sm font-semibold">
        Stroke Style
      </h3>
      {/* Is Stroke? */}
      <div className="grid grid-cols-2 items-center p-2">
        <label className="text-sm" htmlFor="is-stroke">
          Stroke
        </label>
        <Switch
          className="justify-self-end"
          checked={isStroke}
          onCheckedChange={setIsStroke}
        />
      </div>

      {isStroke && (
        <>
          {/* Color Property */}
          <div className="grid grid-cols-2 p-2 items-center">
            <label htmlFor="fill-color" className="text-sm">
              Color
            </label>
            {isStrokeColorPicker ? (
              <ColorPicker
                color={strokeColor}
                setColor={setStrokeColor}
                setIsColorPicker={setIsStrokeColorPicker}
              />
            ) : (
              <Button
                onClick={() => setIsStrokeColorPicker(true)}
                className="rounded-none w-auto h-6"
                id="stroke-color"
                style={{ backgroundColor: strokeColor }}
              />
            )}
          </div>
          {/* Opacity Property */}
          <div className="grid grid-cols-2 items-center p-2">
            <label className="text-sm" htmlFor="stroke-opacity">
              Opacity:
            </label>
            <Input
              id="stroke-opacity"
              className="w-auto"
              type="number"
              max={1}
              min={0}
              step={0.1}
              defaultValue={strokeOpacity}
              onChange={(event) => setStrokeOpacity(Number(event.target.value))}
            />
          </div>
          <div className="grid grid-cols-2 items-center p-2">
            <label className="text-sm" htmlFor="stroke-weight">
              Weight:
            </label>
            <Input
              id="stroke-weight"
              className="w-auto"
              step={0.5}
              type="number"
              min={0}
              defaultValue={strokeWeight}
              onChange={(event) => setStrokeWeight(Number(event.target.value))}
            />
          </div>
        </>
      )}
    </section>
  );
};
