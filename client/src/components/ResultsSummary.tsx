import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

type ResultsSummaryProps = {
  distance: number;
  correctPos: google.maps.LatLng;
  markerPos: google.maps.LatLng;
};

export const ResultsSummary = ({
  distance,
  correctPos,
  markerPos,
}: ResultsSummaryProps) => {
  const resultMapDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_MAPS_API_KEY,
      version: "weekly",
    });

    const mapOptions = {
      center: { lat: 0, lng: 0 },
      zoom: 1,
      clickableIcons: false,
      disableDefaultIO: true,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      minZoom: 1,
    };

    let bounds = new google.maps.LatLngBounds();
    bounds.extend(correctPos);
    bounds.extend(markerPos);

    const pathCoords = [correctPos, markerPos];

    loader.load().then(async (loadedGoogle) => {
      const mapInstance = new loadedGoogle.maps.Map(
        resultMapDivRef.current!,
        mapOptions
      );
      mapInstance.fitBounds(bounds);

      const lineSymbol = {
        path: "M 0,-1 0,1",
        strokeOpacity: 1,
        scale: 4,
      };

      const path = new google.maps.Polyline({
        path: pathCoords,
        icons: [
          {
            icon: lineSymbol,
            offset: "0",
            repeat: "20px",
          },
        ],
        strokeColor: "#FF0000",
        strokeOpacity: 0,
      });
      path.setMap(mapInstance);
    });
  }, []);

  return (
    <div className="col-start-3 row-start-2 col-span-6 row-span-3 z-10">
      <div className="grid grid-cols-3 h-full bg-red-500">
        <div className="col-span-2 bg-orange-500" ref={resultMapDivRef}>
          Map
        </div>
        <h1>Distance: {distance} meters</h1>
      </div>
    </div>
  );
};
