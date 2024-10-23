import { X } from "lucide-react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { Button } from "./ui/button";

type ColorPickerProps = {
  color: string;
  setColor: React.Dispatch<string>;
  setIsColorPicker?: React.Dispatch<boolean>;
};

export const ColorPicker = ({
  color,
  setColor,
  setIsColorPicker,
}: ColorPickerProps) => {
  return (
    <div className="flex flex-col">
      {setIsColorPicker && (
        <Button
          onClick={() => setIsColorPicker(false)}
          variant="ghost"
          className="hover:bg-opacity-0 hover:bg-white justify-end"
        >
          <X />
        </Button>
      )}
      <HexColorPicker color={color} onChange={setColor} />
      <HexColorInput
        className="text-white"
        style={{ backgroundColor: "#020817" }}
        color={color}
        onChange={setColor}
      />
    </div>
  );
};
