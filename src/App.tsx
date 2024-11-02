import { useState } from "react";
import { FeatureCollectionWithFilename } from "shpjs";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useWorkspace } from "./hooks/useWorkspace";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import { NavBar } from "./components/navbar";
// import { CoordsFinderDummy } from "./components/coordinates-getter";
// import { Card } from "./components/ui/card";
// import { MapController } from "./components/map-controller";
import { LayersContainer } from "./components/layers-container";
import {
  FeatureCollectionWithFilenameAndState,
  Workspace,
} from "./index.types";
import { GeoJsonWorkspace } from "./components/geojson-workspace";

function App() {
  const [selectedFile, setSelectedFile] =
    useState<FeatureCollectionWithFilenameAndState | null>(null);
  const [workspace, setWorkspace] = useState<Workspace>({
    featureCollections: [],
    updatedAt: Date.now(),
  });
  const [geoJson, setGeoJson] = useState<FeatureCollectionWithFilename | null>(
    null,
  );
  // const [onHoverCoord, setOnHoverCoord] = useState<{
  //   lat: number;
  //   lng: number;
  // } | null>();

  const {
    addFileToWorkspace,
    toggleVisibility,
    toggleSelectedFile,
    changeStyle,
    removeFileFromWorkspace,
    setPosition,
    error: workspaceError,
    setError: setWorkspaceError,
    isError: isWorkspaceError,
    setIsError: setIsWorkspaceError,
  } = useWorkspace({
    workspace,
    setWorkspace,
  });
  const [isTileLayer, setIsTileLayer] = useState<boolean>(true);
  return (
    <div className="p-2 flex flex-col h-screen w-screen">
      <NavBar
        addFileToWorkspace={addFileToWorkspace}
        geoJson={geoJson}
        setGeoJson={setGeoJson}
        workspaceError={workspaceError}
        setWorkspaceError={setWorkspaceError}
        isWorkspaceError={isWorkspaceError}
        setIsWorkspaceError={setIsWorkspaceError}
        workspace={workspace}
      />

      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[200px] max-w-full rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={25}>
          <LayersContainer
            isTileLayer={isTileLayer}
            setIsTileLayer={setIsTileLayer}
            setSelectedFile={setSelectedFile}
            changeStyle={changeStyle}
            removeFileFromWorkspace={removeFileFromWorkspace}
            toggleVisibility={toggleVisibility}
            workspace={workspace}
            toggleSelected={toggleSelectedFile}
            selectedFile={selectedFile}
            setPosition={setPosition}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <div className="flex h-full w-full items-center justify-center p-6">
            <MapContainer
              className="h-[90vh] w-full z-80"
              center={[-31.75955334256868, -52.34488136477589]}
              zoom={9}
              scrollWheelZoom={true}
            >
              {/* <CoordsFinderDummy setOnHoverCoord={setOnHoverCoord} /> */}
              {/* <MapController selectedFile={selectedFile} /> */}
              {isTileLayer && (
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url=" https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
              )}
              {workspace && workspace.featureCollections.length !== 0 && (
                <GeoJsonWorkspace workspace={workspace} />
              )}

              {/* </LayerGroup> */}
            </MapContainer>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      {/* <Card>
      <p>{`lat: ${onHoverCoord?.lat} lng: ${onHoverCoord?.lng}`}</p>
    </Card> */}
    </div>
  );
}

export default App;
