import { useState } from "react";
import shpjs, { FeatureCollectionWithFilename } from "shpjs";
import {
  MapContainer,
  GeoJSON,
  TileLayer,
  LayerGroup,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ScrollArea, ScrollBar } from "./components/ui/scroll-area";
import { ModeToggle } from "./components/mode-toggle";
import { Input } from "./components/ui/input";
import { Card } from "./components/ui/card";
import { useWorkspace } from "./hooks/useWorkspace";
import { Button } from "./components/ui/button";
import { Layers, X } from "lucide-react";
import { ItemToggleView } from "./components/item-toggle-view";
import L from "leaflet";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import { NavBar } from "./components/navbar";

function App() {
  const [geoJson, setGeoJson] = useState<FeatureCollectionWithFilename | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  const { workspace, addFileToWorkspace, toggleVisibility } = useWorkspace();
  const [isTileLayer, setIsTileLayer] = useState<boolean>(true);
  const [isOpenPreview, setIsOpenPreview] = useState<boolean>(false);

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
    <div className="flex flex-col w-full">
      <NavBar />
      <div className="flex justify-center">
        <div className="flex p-4 space-y-4 flex-col justify-center items-center mt-4">
          <Input
            className="w-full"
            type="file"
            onChange={handleFileUpload}
            accept=".zip"
          />
          {geoJson && (
            <Button
              onClick={() => {
                addFileToWorkspace(geoJson);
                setIsOpenPreview(false);
              }}
            >
              Add to workspace
            </Button>
          )}
          {loading && <p>Loading...</p>}
        </div>
        {isOpenPreview && (
          <ScrollArea className="h-[300px] w-1/2 rounded-md border p-4">
            <pre>{JSON.stringify(geoJson, null, 2)}</pre>
            <ScrollBar className="bg-black" orientation="vertical" />
          </ScrollArea>
        )}
      </div>

      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[200px] max-w-full rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={25}>
          <div className="flex flex-col h-full items-center  p-6">
            <div className=" mx-4 space-x-2 flex items-center">
              <Layers />
              <h2 className="text-2xl font-bold ">Layers</h2>
            </div>

            <ItemToggleView
              state={isTileLayer}
              setState={setIsTileLayer}
              filename="OpenStreetMap TileLayer"
            />

            {workspace &&
              workspace.map((file, index) => (
                <ItemToggleView
                  key={index}
                  state={file.visible} // Bind to the file's visibility state
                  setState={() => toggleVisibility(file.fileName)} // Toggle visibility
                  filename={file.fileName ?? "random-uuid"}
                  geometryType={file.features[0].geometry.type}
                />
              ))}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <div className="flex h-[80vh] w-full items-center justify-center p-6">
            <MapContainer
              className="h-[80vh] w-full z-80"
              center={[-31.75955334256868, -52.34488136477589]}
              zoom={9}
              scrollWheelZoom={true}
            >
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
                    <>
                      <GeoJSON
                        key={`${geoJson.fileName}_${index}`}
                        style={{
                          color: "#ff7800",
                          weight: 2,
                          opacity: 2,
                          stroke: true,
                        }}
                        data={geoJson}
                        eventHandlers={{
                          click: () => {
                            console.log(geoJson.features[0].properties);
                          },
                        }}
                        attribution="a polygon"
                        pathOptions={{ color: "orange" }}
                        pointToLayer={function (geoJsonPoint, latlng) {
                          console.log(geoJsonPoint.properties);
                          return L.circleMarker(latlng);
                        }}
                      >
                        <Popup className="flex">
                          <ScrollArea className="h-[200px] w-[420px]">
                            {/* {geoJson.features.length > 0 &&
                          geoJson.features[0].properties ? (
                            <div className="flex">
                              {Object.keys(geoJson.features[0].properties).map(
                                (key) => (
                                  <p key={key} className="font-bold">
                                    {key}{" "}
                                  </p>
                                )
                              )}
                            </div>
                          ) : (
                            <p>No properties available</p>
                          )} */}

                            {geoJson.features.map((feature, index) => (
                              <div key={index}>
                                {feature.properties ? (
                                  <div className="flex">
                                    {Object.entries(feature.properties).map(
                                      ([key, value]) => (
                                        <p key={key}>
                                          <strong>{key}:</strong>
                                          {"    "}
                                          {value?.toString() || "N/A"}
                                        </p>
                                      )
                                    )}
                                  </div>
                                ) : (
                                  <p>No properties available</p>
                                )}
                              </div>
                            ))}
                          </ScrollArea>
                        </Popup>
                      </GeoJSON>
                    </>
                  ))}
              {/* </LayerGroup> */}
            </MapContainer>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default App;
