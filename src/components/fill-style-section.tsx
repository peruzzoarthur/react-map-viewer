import { ColorPicker } from "./color-picker";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";

type FillStyleSectionProps = {
  isFill: boolean;
  setIsFill: React.Dispatch<boolean>;
  isFillColorPicker: boolean;
  setIsFillColorPicker: React.Dispatch<boolean>;
  fillColor: string;
  setFillColor: React.Dispatch<string>
  fillOpacity: number;
  setFillOpacity: React.Dispatch<number>
};

export const FillStyleSection = ({isFill, setIsFill, isFillColorPicker, setIsFillColorPicker, fillColor, setFillColor, fillOpacity, setFillOpacity}: FillStyleSectionProps) => {
  return (
    <section aria-labelledby="fill-section" className="mt-2 mb-2">
      <h3 id="fill-section" className="text-sm font-semibold">
        Fill Style
      </h3>

      {/* Is Fill? */}
      <div className="grid grid-cols-2 items-center p-2">
        <label className="text-sm" htmlFor="is-fill">
          Fill
        </label>
        <Switch
          className="justify-self-end"
          checked={isFill}
          onCheckedChange={setIsFill}
        />
      </div>

      {isFill && (
        <>
          {/* Color Property */}
          <div className="grid grid-cols-2 p-2 items-center">
            <label htmlFor="fill-color" className="text-sm">
              Color
            </label>
            {isFillColorPicker ? (
              <ColorPicker
                color={fillColor}
                setColor={setFillColor}
                setIsColorPicker={setIsFillColorPicker}
              />
            ) : (
              <Button
                onClick={() => setIsFillColorPicker(true)}
                className="rounded-none w-auto h-6"
                id="fill-color"
                style={{ backgroundColor: fillColor }}
              />
            )}
          </div>

          {/* Opacity Property */}
          <div className="grid grid-cols-2 items-center p-2">
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
              defaultValue={fillOpacity}
              onChange={(event) => setFillOpacity(Number(event.target.value))}
            />
          </div>
        </>
      )}
    </section>
  );
};
