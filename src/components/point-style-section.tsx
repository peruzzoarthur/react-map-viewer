import { Input } from "./ui/input";

type PointStyleSectionProps = {
  pointSize: number | undefined;
  setPointSize: React.Dispatch<number | undefined>
};

export const PointStyleSection = ({pointSize, setPointSize }: PointStyleSectionProps) => {
  return (
    <section aria-labelledby="point-section" className="mb-2 mt-2">
      <h3 id="stroke-section" className="text-sm font-semibold">
        Point Style
      </h3>

      <div className="grid grid-cols-2 items-center p-2">
        <label className="text-sm" htmlFor="point-radius">
          Radius
        </label>
        <Input
          id="point-radius"
          className="w-auto"
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
