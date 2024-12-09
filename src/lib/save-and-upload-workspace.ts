import { Workspace } from "@/index.types";
import saveAs from "file-saver";

export const saveWorkspace = async (workspace: Workspace) => {
  try {
    const json = JSON.stringify(workspace, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    saveAs(blob, `${workspace.name}.json`);
  } catch (error) {
    console.error("Failed to save workspace:", error);
  }
};

export const loadWorkspace = async (
  workspaceJson: Blob,
  setWorkspace: React.Dispatch<Workspace>,
) => {
  try {
    const jsonText = await workspaceJson.text();
    const workspaceData = JSON.parse(jsonText) as Workspace;
    setWorkspace(workspaceData);
  } catch (error) {
    console.error("Failed to load workspace:", error);
  }
};
