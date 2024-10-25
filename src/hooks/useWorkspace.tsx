import { FeatureCollectionWithFilenameAndState } from "@/index.types";
import { PathOptions } from "leaflet";
import { useState } from "react";
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
  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const addFileToWorkspace = (
    file: FeatureCollectionWithFilename,
    color: string
  ) => {
    const fileExists = workspace.some(
      (workspaceFile) => workspaceFile.fileName === file.fileName
    );

    if (fileExists) {
      const errorMsg = `File with filename "${file.fileName}" already exists.`;
      setError(errorMsg);
      setIsError(true);
      throw new Error(errorMsg);
    }

    // Ensure the fileName is defined (either provide a default or validate its presence)
    if (!file.fileName) {
      const errorMsg = "The file must have a fileName.";
      setError(errorMsg);
      setIsError(true);
      throw new Error(errorMsg);
    }

    const newFeatures = file.features.map((feature) => ({
      ...feature,
      style: {
        color: color,
        weight: 2,
        opacity: 100,
        stroke: true,
        fillOpacity: 1,
      },
      selected: false,
    }));

    const newFile: FeatureCollectionWithFilenameAndState = {
      ...file,
      fileName: file.fileName, // Ensure fileName is present and not undefined
      features: newFeatures,
      visible: true,
      selected: false,
      updatedAt: Date.now(),
      position: workspace.length,
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

  const changeStyle = (
    fileCollection: FeatureCollectionWithFilenameAndState,
    style: PathOptions
  ) => {
    if (!fileCollection) {
      return;
    }

    // Map over features and apply the new style
    const newFeatures = fileCollection.features.map((feature) => ({
      ...feature,
      style: style,
    }));

    const updatedFile: FeatureCollectionWithFilenameAndState = {
      ...fileCollection,
      features: newFeatures,
      updatedAt: Date.now(),
    };

    setWorkspace((prevWorkspace) =>
      prevWorkspace.map((workspaceFile) =>
        workspaceFile.fileName === fileCollection.fileName
          ? updatedFile
          : workspaceFile
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
    error,
    setError,
    isError,
    setIsError,
  };
};
