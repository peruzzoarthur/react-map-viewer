import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

type FileDropdownProps = {
};

export const FileDropdown = ({
}: FileDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">File</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[1000]" align="end">
       <DropdownMenuItem>Save workspace</DropdownMenuItem>
        <DropdownMenuItem>Load workspace</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
