import { FeatureCollectionWithFilenameAndState } from "@/index.types";
import { PathOptions } from "leaflet";
import { FeatureCollectionWithFilename } from "shpjs";

type UseWorkspaceProps = {
  workspace: FeatureCollectionWithFilenameAndState[];
  setWorkspace: React.Dispatch<
    React.SetStateAction<FeatureCollectionWithFilenameAndState[]>
  >;
};

export const useWorkspace = ({
  workspace,
  setWorkspace,
}: UseWorkspaceProps) => {
  const addFileToWorkspace = (
    file: FeatureCollectionWithFilename,
    color: string
  ) => {
    const fileExists = workspace.some(
      (workspaceFile) => workspaceFile.fileName === file.fileName
    );

    if (fileExists) {
      throw new Error(`File with filename "${file.fileName}" already exists.`);
    }

    // Ensure the fileName is defined (either provide a default or validate its presence)
    if (!file.fileName) {
      throw new Error("The file must have a fileName.");
    }

    // Map over the features to add `style` and `selected` to each feature
    const newFeatures = file.features.map((feature) => ({
      ...feature,
      style: {
        color: color,
        weight: 2,
        opacity: 100,
        stroke: true,
        fillOpacity: 1,
        fill: true,
      },
      selected: false,
    }));

    // Create the new file with updated features and required fields
    const newFile: FeatureCollectionWithFilenameAndState = {
      ...file,
      fileName: file.fileName, // Ensure fileName is present and not undefined
      features: newFeatures,
      visible: true,
      selected: false,
      style: {
        color: color,
        weight: 2,
        opacity: 100,
        stroke: true,
        fillOpacity: 1,
        fill: true,
      },
    };

    setWorkspace((prevWorkspace) => [...prevWorkspace, newFile]);
  };

  const toggleVisibility = (filename: string | undefined) => {
    if (!filename) {
      return;
    }
    setWorkspace((prevWorkspace) =>
      prevWorkspace.map((file) =>
        file.fileName === filename ? { ...file, visible: !file.visible } : file
      )
    );
  };
  const toggleSelectedFile = (filename: string | undefined) => {
    if (!filename) {
      return;
    }
    setWorkspace((prevWorkspace) =>
      prevWorkspace.map((file) =>
        file.fileName === filename ? { ...file, selected: !file.visible } : file
      )
    );
  };
  const changeStyle = (filename: string | undefined, style: PathOptions) => {
    if (!filename) {
      return;
    }
    setWorkspace((prevWorkspace) =>
      prevWorkspace.map((file) =>
        file.fileName === filename ? { ...file, style: style } : file
      )
    );
  };
  const removeFileFromWorkspace = (filename: string | undefined) => {
    if (!filename) {
      return;
    }

    setWorkspace((prevWorkspace) => {
      const filteredWorkspace = prevWorkspace.filter(
        (f) => f.fileName !== filename
      );
      return [...filteredWorkspace];
    });
  };

  return {
    workspace,
    addFileToWorkspace,
    toggleVisibility,
    toggleSelectedFile,
    changeStyle,
    removeFileFromWorkspace,
  };
};
