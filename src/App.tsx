import { useRef, useState } from "react";
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
  TileLayerOptions,
  Workspace,
} from "./index.types";
import { GeoJsonWorkspace } from "./components/geojson-workspace";
import { faker } from "@faker-js/faker";
import { ProjectBar } from "./components/project-bar";
import { ZoomToLayer, ZoomToLayerRef } from "./components/zoom-to-layer";
import { ScaleControl } from "./components/scale-control";

function App() {
  const randomProjectName = `${faker.color.human()}-${faker.animal.type()}`;
  const [selectedLayer, setSelectedLayer] =
    useState<FeatureCollectionWithFilenameAndState | null>(null);
  const [workspace, setWorkspace] = useState<Workspace>({
    featureCollections: [],
    updatedAt: Date.now(),
    name: randomProjectName ?? "my-project",
  });
  const [geoJson, setGeoJson] = useState<FeatureCollectionWithFilename | null>(
    null,
  );
  const [tileLayerOptions, setTileLayerOptions] = useState<TileLayerOptions>({
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url: " https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  });

  // const [onHoverCoord, setOnHoverCoord] = useState<{
  //   lat: number;
  //   lng: number;
  // } | null>();

  const {
    addFileToWorkspace,
    toggleVisibility,
    toggleSelectedFile,
    changeStyleSingleSchema,
    changeStyleCategorizedSchema,
    changeColorSchema,
    removeFileFromWorkspace,
    setPosition,
    error: workspaceError,
    setError: setWorkspaceError,
    isError: isWorkspaceError,
    setIsError: setIsWorkspaceError,
    changeWorkspaceName,
    changeFeatureCollectionName,
  } = useWorkspace({
    workspace,
    setWorkspace,
  });
  const [isTileLayer, setIsTileLayer] = useState<boolean>(true);
  const zoomToLayerRef = useRef<ZoomToLayerRef | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

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
        setWorkspace={setWorkspace}
        mapContainerRef={mapContainerRef}
      />
      <ProjectBar
        workspace={workspace}
        changeWorkspaceName={changeWorkspaceName}
      />
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[200px] max-w-full rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={30}>
          <LayersContainer
            isTileLayer={isTileLayer}
            setIsTileLayer={setIsTileLayer}
            setSelectedLayer={setSelectedLayer}
            changeStyleSingleSchema={changeStyleSingleSchema}
            changeStyleCategorizedSchema={changeStyleCategorizedSchema}
            changeColorSchema={changeColorSchema}
            changeFeatureCollectionName={changeFeatureCollectionName}
            removeFileFromWorkspace={removeFileFromWorkspace}
            toggleVisibility={toggleVisibility}
            workspace={workspace}
            toggleSelected={toggleSelectedFile}
            selectedLayer={selectedLayer}
            setPosition={setPosition}
            zoomToLayerRef={zoomToLayerRef}
            tileLayerOptions={tileLayerOptions}
            setTileLayerOptions={setTileLayerOptions}
            addFileToWorkspace={addFileToWorkspace}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          <div
            className="flex h-full w-full items-center justify-center"
            ref={mapContainerRef}
          >
            <MapContainer
              className="h-full w-full"
              center={[-31.75955334256868, -52.34488136477589]}
              zoom={9}
              scrollWheelZoom={true}
            >
              {/* <CoordsFinderDummy setOnHoverCoord={setOnHoverCoord} /> */}
              {/* <MapController selectedLayer={selectedLayer} /> */}
              {isTileLayer && (
                <TileLayer
                  attribution={tileLayerOptions.attribution}
                  url={tileLayerOptions.url}
                />
              )}
              <div className="grid grid-cols-2 space-x-4">
                <ScaleControl
                  maxWidth={200}
                  bg="bg-black"
                  textColor="text-white"
                />
                <ScaleControl
                  maxWidth={100}
                  bg="bg-white"
                  textColor="text-black"
                />
                <ScaleControl
                  maxWidth={50}
                  bg="bg-black"
                  textColor="text-white"
                />
              </div>
              <ZoomToLayer ref={zoomToLayerRef} />
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
