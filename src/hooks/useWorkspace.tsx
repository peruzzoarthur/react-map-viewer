import {
  BrewerPalette,
  ColorSchema,
  FeatureCollectionWithFilenameAndState,
  FeatureWithState,
  PathOptionsWithPointAttributes,
  Workspace,
} from "@/index.types";
import { getRandomColorsChroma } from "@/lib/utils";
import { brewer } from "chroma-js";
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
      (fc) => fc.fileName === file.fileName,
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
              backgroundColor: "bg-transparent",
              border: "border-none",
              textColor: "text-white",
              textSize: "text-base",
              shadow: "shadow-none",
              className:
                "bg-transparent text-white text-base border-none px-1.5 py-0.5 text-center shadow-none",
            },
          },
        },
        selected: false,
      };
    });

    const newFile: FeatureCollectionWithFilenameAndState = {
      ...file,
      colorSchema: ColorSchema.SINGLE,
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

  const changeFeatureCollectionName = (
    featureCollection: FeatureCollectionWithFilenameAndState,
    name: string,
  ) => {
    setWorkspace((prevWorkspace) => ({
      ...prevWorkspace,
      featureCollections: prevWorkspace.featureCollections.map((fc) =>
        fc.fileName === featureCollection.fileName
          ? { ...fc, fileName: name }
          : fc,
      ),
    }));
  };

  const changeColorSchema = (
    featureCollection: FeatureCollectionWithFilenameAndState,
    colorSchema: ColorSchema,
  ) => {
    if (featureCollection.colorSchema === colorSchema) {
      return;
    }

    setWorkspace((prevWorkspace) => ({
      ...prevWorkspace,
      featureCollections: prevWorkspace.featureCollections.map((fc) =>
        fc.fileName === featureCollection.fileName
          ? { ...fc, colorSchema: colorSchema }
          : fc,
      ),
      updatedAt: Date.now(),
    }));
  };

  const changeStyleSingleSchema = (
    featureCollection: FeatureCollectionWithFilenameAndState,
    colorSchema: ColorSchema,
    style: PathOptionsWithPointAttributes,
    propertyValue?: string,
  ) => {
    if (featureCollection.features.length === 0) {
      return;
    }

    let newFeatures: FeatureWithState[] = [];

    if (colorSchema === ColorSchema.SINGLE) {
      newFeatures = featureCollection.features.map((feature) => {
        return {
          ...feature,
          style: {
            ...style,
            label: {
              isLabel: style.label.isLabel
                ? propertyValue
                  ? true
                  : false
                : false,
              labelName: propertyValue,
              attribute: propertyValue
                ? String(feature.properties?.[propertyValue])
                : null,
              style: style.label.style,
            },
          },
        };
      });
    }

    if (newFeatures) {
      const updatedFile: FeatureCollectionWithFilenameAndState = {
        ...featureCollection,
        colorSchema: colorSchema,
        features: newFeatures,
        updatedAt: Date.now(),
      };

      setWorkspace((prevWorkspace) => ({
        ...prevWorkspace,
        featureCollections: prevWorkspace.featureCollections.map((fc) =>
          fc.fileName === featureCollection.fileName ? updatedFile : fc,
        ),
        updatedAt: Date.now(),
      }));
    }
  };

  const changeStyleCategorizedSchema = (
    featureCollection: FeatureCollectionWithFilenameAndState,
    colorSchema: ColorSchema,
    style: PathOptionsWithPointAttributes,
    propertyKey: string,
    brewerPalette: BrewerPalette,
    propertyValue?: string,
  ) => {
    if (featureCollection.features.length === 0) {
      return;
    }

    let newFeatures: FeatureWithState[] = [];

    if (colorSchema === ColorSchema.CATEGORIZED) {
      console.log(propertyKey); // propertyKey will be used for showing colors for different features bases and use key as index

      const arrayOfColors = getRandomColorsChroma(
        featureCollection.features.length,
        brewer[brewerPalette],
      );

      newFeatures = featureCollection.features.map((feature, index) => {
        const color = arrayOfColors[index];
        return {
          ...feature,
          style: {
            ...style,
            fillColor: color,
            color: color,
            label: {
              isLabel: style.label.isLabel
                ? propertyValue
                  ? true
                  : false
                : false,
              labelName: propertyValue,
              attribute: propertyValue
                ? String(feature.properties?.[propertyValue])
                : null,
              style: style.label.style,
            },
          },
        };
      });
    }

    if (newFeatures) {
      const updatedFile: FeatureCollectionWithFilenameAndState = {
        ...featureCollection,
        colorSchema: colorSchema,
        features: newFeatures,
        updatedAt: Date.now(),
      };

      setWorkspace((prevWorkspace) => ({
        ...prevWorkspace,
        featureCollections: prevWorkspace.featureCollections.map((fc) =>
          fc.fileName === featureCollection.fileName ? updatedFile : fc,
        ),
        updatedAt: Date.now(),
      }));
    }
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
    changeStyleSingleSchema,
    changeStyleCategorizedSchema,
    removeFileFromWorkspace,
    setPosition,
    error,
    setError,
    isError,
    setIsError,
    changeWorkspaceName,
    changeColorSchema,
    changeFeatureCollectionName,
  };
};
