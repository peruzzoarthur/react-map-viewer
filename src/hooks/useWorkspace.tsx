import { PathOptions } from "leaflet";
import { FeatureCollectionWithFilename } from "shpjs";

export type FeatureCollectionWithFilenameAndState =
  FeatureCollectionWithFilename & {
    visible: boolean;
    style: PathOptions;
  };

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

    const newFile: FeatureCollectionWithFilenameAndState = {
      ...file,
      visible: true,
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
    changeStyle,
    removeFileFromWorkspace,
  };
};
