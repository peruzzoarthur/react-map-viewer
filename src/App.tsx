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
import { Layers } from "lucide-react";
import { ItemToggleView } from "./components/item-toggle-view";
import L from "leaflet";

function App() {
  const [geoJson, setGeoJson] = useState<FeatureCollectionWithFilename | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  const { workspace, addFileToWorkspace, toggleVisibility } = useWorkspace();
  const [isTileLayer, setIsTileLayer] = useState<boolean>(true);

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
      } catch (error) {
        console.error("Error parsing shapefile:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex p-4 space-y-4 flex-col justify-center items-center mt-4">
        <Input
          className="w-1/3"
          type="file"
          onChange={handleFileUpload}
          accept=".zip"
        />
        {loading && <p>Loading...</p>}
        {geoJson && (
          <>
            <Button onClick={() => addFileToWorkspace(geoJson)}>
              Add to workspace
            </Button>
            <ScrollArea className="h-[300px] w-11/12 rounded-md border p-4">
              <pre>{JSON.stringify(geoJson, null, 2)}</pre>
              <ScrollBar className="bg-black" orientation="vertical" />
            </ScrollArea>
          </>
        )}
      </div>

      <div className="grid grid-cols-4 mx-4">
        <Card>
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
        </Card>

        <Card className="h[100vh] p-4 col-span-3 mx-4">
          <MapContainer
            className="h-[90vh]"
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

            {/* <LayerGroup> */}
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
                      pointToLayer={function (_geoJsonPoint, latlng) {
                        return L.circleMarker(latlng);
                      }}
                    >
                      <Popup>
                        <div>
                          {geoJson.features.map((feature, index) => (
                            <div key={index}>
                              {feature.properties ? (
                                <div>
                                  {Object.entries(feature.properties).map(
                                    ([key, value]) => (
                                      <p key={key}>
                                        <strong>{key}:</strong>{" "}
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
                        </div>
                      </Popup>
                    </GeoJSON>
                  </>
                ))}
            {/* </LayerGroup> */}
          </MapContainer>
        </Card>
      </div>
      <ModeToggle />
    </div>
  );
}

export default App;
