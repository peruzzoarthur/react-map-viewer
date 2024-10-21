import { useState } from "react";
import { FeatureCollectionWithFilename } from "shpjs";

type FeatureCollectionWithFilenameAndState = FeatureCollectionWithFilename & {
  visible: boolean; // New property to track visibility
};

export const useWorkspace = () => {
  const [workspace, setWorkspace] = useState<
    FeatureCollectionWithFilenameAndState[]
  >([]);

  const addFileToWorkspace = (file: FeatureCollectionWithFilename) => {
    const newFile: FeatureCollectionWithFilenameAndState = {
      ...file,
      visible: true, // Initialize the visibility to true
    };

    setWorkspace((prevWorkspace) => [...prevWorkspace, newFile]);
  };

  const toggleVisibility = (filename: string | undefined) => {
    if (!filename) {
      return;
    }
    setWorkspace((prevWorkspace) =>
      prevWorkspace.map((file) =>
        file.fileName === filename
          ? { ...file, visible: !file.visible } // Toggle the visibility
          : file
      )
    );
  };

  return {
    workspace,
    addFileToWorkspace,
    toggleVisibility,
  };
};
