
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { toJpeg, toPng } from "html-to-image";

type MapDropdownProps = {
  mapContainerRef: React.RefObject<HTMLDivElement>
};

export const MapDropdown = ({
  mapContainerRef
}: MapDropdownProps) => {

  const handleExportAsPng = async () => {
  if (mapContainerRef.current) {
    try {
      // Get the map container and elements to hide
      const mapContainer = mapContainerRef.current;
      const elementsToExclude = mapContainer.querySelectorAll(
        '.leaflet-control-container, .leaflet-top, .leaflet-bottom'
      );

      // Hide the unwanted elements
      elementsToExclude.forEach((el) => {
        if (el instanceof HTMLElement) {
            el.style.display = 'none';
          }
      });

      // Export the map container as a PNG
      const dataUrl = await toPng(mapContainer);

      // Restore the visibility of the excluded elements
      elementsToExclude.forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.display = '';
          }
      });

      // Create a downloadable link
      const link = document.createElement('a');
      link.download = 'map-export.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error exporting map:', error);
    }
  }
};


  const handleExportAsJpeg = async () => {
    try {
      if (mapContainerRef.current) {
        const dataUrl = await toJpeg(mapContainerRef.current);
        const link = document.createElement('a')
        link.download = "map-export.jpeg";
        link.href = dataUrl
        link.click()
      }
    }
    catch (error) {
      console.error('Error exporting map:', error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">Map</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[1000]" align="end">
        <DropdownMenuItem
          onSelect={() => {
            handleExportAsPng()
          }}
        >
          Save map as png
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => {
            handleExportAsJpeg()
          }}
        >
          Save map as jpeg
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
