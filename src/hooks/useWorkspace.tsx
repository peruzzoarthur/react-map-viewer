import {
  FeatureCollectionWithFilenameAndState,
  FeatureWithState,
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

    const newFeatures: FeatureWithState[] = file.features.map((feature) => {
      const fill =
        feature.geometry.type === "LineString" ||
          feature.geometry.type === "MultiLineString"
          ? false
          : true;
      return {
        ...feature,
        style: {
          fill: fill,
          color: color,
          fillColor: color,
          weight: 2,
          opacity: 1,
          stroke: true,
          fillOpacity: 1,
          pointSize: 5,
          label: {
            isLabel: false,
            labelName: undefined,
            attribute: null,
            style: {
              permanent: true,
              direction: "auto",
              opacity: 0.9,
              // className:
              //   "text-white text-base border-none px-1.5 py-0.5 text-center whitespace-nowrap shadow-none",
            },
          },
        },
        selected: false,
      };
    });

    const newFile: FeatureCollectionWithFilenameAndState = {
      ...file,
      fileName: file.fileName,
      features: newFeatures,
      visible: true,
      selected: false,
      updatedAt: Date.now(),
      position: workspace.featureCollections.length,
    };

    setWorkspace((prevWorkspace) => ({
      ...prevWorkspace,
      featureCollections: [...prevWorkspace.featureCollections, newFile],
      updatedAt: Date.now(),
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
    propertyKey?: string,
  ) => {
    if (!fileCollection) {
      return;
    }

    const newFeatures: FeatureWithState[] = fileCollection.features.map(
      (feature) => {
        return {
          ...feature,
          style: {
            ...style,
            label: {
              isLabel: style.label.isLabel
                ? propertyKey
                  ? true
                  : false
                : false,
              labelName: propertyKey,
              attribute: propertyKey
                ? String(feature.properties?.[propertyKey])
                : null,
              style: style.label.style,
            },
          },
        };
      },
    );

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
      updatedAt: Date.now(),
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
    setWorkspace((prevWorkspace) => ({ ...prevWorkspace, name: name }));
  };
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
    changeWorkspaceName,
  };
};
