import { ModeToggle } from "./mode-toggle";

export const NavBar = () => {
  return (
    <div className="flex items-center justify-end w-full p-1">
      <ModeToggle />
    </div>
  );
};
