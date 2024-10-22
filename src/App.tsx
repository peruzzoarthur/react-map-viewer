import { useState } from "react";
import shpjs, { FeatureCollectionWithFilename } from "shpjs";
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  FeatureCollectionWithFilenameAndState,
  useWorkspace,
} from "./hooks/useWorkspace";
import { Layers } from "lucide-react";
import { ItemToggleView } from "./components/item-toggle-view";
import L from "leaflet";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import { NavBar } from "./components/navbar";
// import { CoordsFinderDummy } from "./components/coordinates-getter";
// import { Card } from "./components/ui/card";
import { MapController } from "./components/map-controller";
import { AddLayer } from "./components/add-layer";

function App() {
  const [selectedFile, setSelectedFile] =
    useState<FeatureCollectionWithFilenameAndState | null>(null);
  const [workspace, setWorkspace] = useState<
    FeatureCollectionWithFilenameAndState[]
  >([]);
  const [geoJson, setGeoJson] = useState<FeatureCollectionWithFilename | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  // const [onHoverCoord, setOnHoverCoord] = useState<{
  //   lat: number;
  //   lng: number;
  // } | null>();

  const {
    addFileToWorkspace,
    toggleVisibility,
    changeStyle,
    removeFileFromWorkspace,
  } = useWorkspace({
    workspace,
    setWorkspace,
  });
  const [isTileLayer, setIsTileLayer] = useState<boolean>(true);
  const [isOpenPreview, setIsOpenPreview] = useState<boolean>(false);

  // const mapFunc = useMapEvent("click", () => {
  //   map.setView([50.5, 30.5], map.getZoom());
  // });

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const geoJsonData = await shpjs(arrayBuffer);
        setGeoJson(geoJsonData as FeatureCollectionWithFilename);
        setIsOpenPreview(true);
      } catch (error) {
        console.error("Error parsing shapefile:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <NavBar />

      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[200px] max-w-full rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={25}>
          <div className="flex flex-col h-full items-center  p-6">
            <div className=" mx-4 space-x-2 flex items-center">
              <Layers />
              <h2 className="text-2xl font-bold ">Layers</h2>
              <AddLayer
                addFileToWorkspace={addFileToWorkspace}
                geoJson={geoJson}
                handleFileUpload={handleFileUpload}
                isOpenPreview={isOpenPreview}
                loading={loading}
                setIsOpenPreview={setIsOpenPreview}
              />
            </div>

            <ItemToggleView
              state={isTileLayer}
              setState={setIsTileLayer}
              filename="OpenStreetMap TileLayer"
              removeFileFromWorkspace={removeFileFromWorkspace}
              changeStyle={changeStyle}
              setSelectedFile={setSelectedFile}
            />

            {workspace.length > 0 &&
              workspace.map((file, index) => (
                <ItemToggleView
                  key={index}
                  state={file.visible} // Bind to the file's visibility state
                  setState={() => toggleVisibility(file.fileName)} // Toggle visibility
                  featureCollection={file}
                  removeFileFromWorkspace={removeFileFromWorkspace}
                  changeStyle={changeStyle}
                  setSelectedFile={setSelectedFile}
                />
              ))}
          </div>
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
              <MapController selectedFile={selectedFile} />
              {isTileLayer && (
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url=" https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
              )}

              {workspace &&
                workspace
                  .filter((file) => file.visible) // Only show visible layers
                  .map((geoJson, index) => (
                    <GeoJSON
                      key={`${geoJson.fileName}_${index}`}
                      style={geoJson.style}
                      data={geoJson}
                      eventHandlers={{
                        click: () => {
                          console.log(geoJson.features[0].properties);
                        },
                      }}
                      attribution="a polygon"
                      pointToLayer={function (_geoJsonPoint, latlng) {
                        // console.log(geoJsonPoint.properties);
                        return L.circleMarker(latlng);
                      }}
                    ></GeoJSON>
                  ))}

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
