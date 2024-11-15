import {
  FeatureCollectionWithFilenameAndState,
  PathOptionsWithPointAttributes,
  Workspace,
} from "@/index.types";
import { useState } from "react";
import { FeatureCollectionWithFilename } from "shpjs";

type UseWorkspaceProps = {
  workspace: Workspace;
  setWorkspace: React.Dispatch<React.SetStateAction<Workspace>>;
};

export const useWorkspace = ({
  workspace,
  setWorkspace,
}: UseWorkspaceProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const addFileToWorkspace = (
    file: FeatureCollectionWithFilename,
    color: string,
  ) => {
    const fileExists = workspace.featureCollections.some(
      (workspaceFile) => workspaceFile.fileName === file.fileName,
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

    const newFeatures = file.features.map((feature) => {
      const fill =
        feature.geometry.type === "LineString" ||
        feature.geometry.type === "MultiLineString" ? false : true
      return {
        ...feature,
        style: {
          fill: fill,
          color: color,
          fillColor: color,
          weight: 2,
          opacity: 100,
          stroke: true,
          fillOpacity: 1,
          pointSize: 5
        },
        selected: false,
      };
    });

    const newFile: FeatureCollectionWithFilenameAndState = {
      ...file,
      fileName: file.fileName, // Ensure fileName is present and not undefined
      features: newFeatures,
      visible: true,
      selected: false,
      updatedAt: Date.now(),
      position: workspace.featureCollections.length,
    };

    setWorkspace((prevWorkspace) => ({
      ...prevWorkspace,
      featureCollections: [...prevWorkspace.featureCollections, newFile],
      updatedAt: Date.now(), // Update the timestamp if needed
    }));
  };

  const toggleVisibility = (filename: string | undefined) => {
    if (!filename) {
      return;
    }

    setWorkspace((prevWorkspace) => ({
      ...prevWorkspace,
      featureCollections: prevWorkspace.featureCollections.map((file) =>
        file.fileName === filename ? { ...file, visible: !file.visible } : file,
      ),
      updatedAt: Date.now(), // Optionally update the timestamp
    }));
  };

  const toggleSelectedFile = (filename: string | undefined) => {
    if (!filename) {
      return;
    }

    setWorkspace((prevWorkspace) => ({
      ...prevWorkspace,
      featureCollections: prevWorkspace.featureCollections.map((file) =>
        file.fileName === filename
          ? { ...file, selected: !file.selected }
          : file,
      ),
      updatedAt: Date.now(), // Optionally update the timestamp
    }));
  };

  const changeStyle = (
    fileCollection: FeatureCollectionWithFilenameAndState,
    style: PathOptionsWithPointAttributes,
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

    setWorkspace((prevWorkspace) => ({
      ...prevWorkspace,
      featureCollections: prevWorkspace.featureCollections.map(
        (workspaceFile) =>
          workspaceFile.fileName === fileCollection.fileName
            ? updatedFile
            : workspaceFile,
      ),
      updatedAt: Date.now(), // Update the timestamp for the entire workspace if necessary
    }));
  };

  const removeFileFromWorkspace = (filename: string | undefined) => {
    if (!filename) {
      return;
    }

    setWorkspace((prevWorkspace) => ({
      ...prevWorkspace,
      featureCollections: prevWorkspace.featureCollections.filter(
        (f) => f.fileName !== filename,
      ),
    }));
  };

  const setPosition = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= workspace.featureCollections.length ||
      toIndex >= workspace.featureCollections.length
    ) {
      return;
    }

    const updatedFeatureCollections = [...workspace.featureCollections];
    const [movedItem] = updatedFeatureCollections.splice(fromIndex, 1);
    updatedFeatureCollections.splice(toIndex, 0, movedItem);

    // Update positions after reordering
    const reorderedFeatureCollections = updatedFeatureCollections.map(
      (item, index) => ({
        ...item,
        position: index,
      }),
    );

    setWorkspace((prevWorkspace) => ({
      ...prevWorkspace,
      featureCollections: reorderedFeatureCollections,
      updatedAt: Date.now(),
    }));
  };
  const changeWorkspaceName = (name: string) => {
    setWorkspace((prevWorkspace) => ({...prevWorkspace, name: name})) 
  }
  return {
    workspace,
    addFileToWorkspace,
    toggleVisibility,
    toggleSelectedFile,
    changeStyle,
    removeFileFromWorkspace,
    setPosition,
    error,
    setError,
    isError,
    setIsError,
    changeWorkspaceName
  };
};
