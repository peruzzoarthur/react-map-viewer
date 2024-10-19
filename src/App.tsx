import { useState } from "react";
import shpjs from "shpjs";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ScrollArea, ScrollBar } from "./components/ui/scroll-area";
import { ModeToggle } from "./components/mode-toggle";
function App() {
  const [geoJson, setGeoJson] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const geoJsonData = await shpjs(arrayBuffer);
        setGeoJson(geoJsonData);
      } catch (error) {
        console.error("Error parsing shapefile:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="flex justify-center mt-4">
        <input type="file" onChange={handleFileUpload} accept=".zip" />
        {loading && <p>Loading...</p>}
        {geoJson && (
          <ScrollArea className="h-[420px] w-[840px] rounded-md border p-4 border-black">
            <pre>{JSON.stringify(geoJson, null, 2)}</pre>
            <ScrollBar className="bg-black" orientation="vertical" />
          </ScrollArea>
        )}
      </div>

      <MapContainer
        className="h-[50vh]"
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
      <ModeToggle />
    </>
  );
}

export default App;
