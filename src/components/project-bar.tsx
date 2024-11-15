import { Workspace } from "@/index.types";
import { Button } from "./ui/button";
import { Pencil, X } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";

type ProjectBarProps = {
  workspace: Workspace;
  changeWorkspaceName: (name: string) => void;
};

export const ProjectBar = ({
  workspace,
  changeWorkspaceName,
}: ProjectBarProps) => {
  const [isEditName, setIsEditName] = useState<boolean>(false);

  const updatedAtDate = new Date(workspace.updatedAt)
  return isEditName ? (
    <div className="flex p-2 items-center justify-start text-sm">
      <p className="text-xs font-semibold w-auto">Change name of project:</p>
      <Input
        defaultValue={workspace.name}
        type="string"
        onChange={(event) => changeWorkspaceName(event.target.value)}
      />
      <Button
        variant="ghost"
        className="
        hover:bg-white hover:bg-opacity-0"
        onClick={() => setIsEditName(false)}
      >
        <X />
      </Button>
    </div>
  ) : (
    <div className="flex flex-col p-1">
        
    <div className="flex items-center justify-start space-x-1 text-sm">
      <label className="font-semibold">Project name:</label>
      <p>{workspace.name}</p>
      <Button
        variant="ghost"
        className="w-[16px] h-[16px] hover:bg-white hover:bg-opacity-0"
        onClick={() => setIsEditName(true)}
      >
        <Pencil />
      </Button>
        </div>  
        <p className="text-xs">Last time updated: {updatedAtDate.toLocaleDateString()} - {updatedAtDate.toLocaleTimeString()}</p>
    </div>
  );
};
