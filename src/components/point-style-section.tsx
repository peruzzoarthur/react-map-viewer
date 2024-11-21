import { Input } from "./ui/input";

type PointStyleSectionProps = {
  pointSize: number | undefined;
  setPointSize: React.Dispatch<number | undefined>
};

export const PointStyleSection = ({pointSize, setPointSize }: PointStyleSectionProps) => {
  return (
    <section aria-labelledby="point-section" className="w-full">
      <div className="grid grid-cols-2 items-center p-2">
        <label className="text-sm" htmlFor="point-radius">
          Point Radius
        </label>
        <Input
          id="point-radius"
          step={1}
          type="number"
          min={0}
          defaultValue={pointSize}
          onChange={(event) => setPointSize(Number(event.target.value))}
        />
      </div>
    </section>
  );
};
