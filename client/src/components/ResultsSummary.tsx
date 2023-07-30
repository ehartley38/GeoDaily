import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

type LatLngType = {
  lat: number;
  lng: number;
};

type ResultsSummaryProps = {
  distance: number;
  score: number;
  correctPos: LatLngType;
  markerPos: LatLngType;
  handleNext: any;
  handleSeeSummary: any;
  isComplete: boolean;
};

export const ResultsSummary = ({
  distance,
  score,
  correctPos,
  markerPos,
  handleNext,
  handleSeeSummary,
  isComplete,
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

      // Dashed line
      mapInstance.fitBounds(bounds);

      const lineSymbol = {
        path: "M 0,-1 0,1",
        strokeOpacity: 1,
        strokeWeight: 2,
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
        strokeWeight: 1,
      });
      path.setMap(mapInstance);

      // Markers
      new google.maps.Marker({
        position: correctPos,
        map: mapInstance,
      });

      new google.maps.Marker({
        position: markerPos,
        map: mapInstance,
      });
    });
  }, []);

  return (
    <div className="col-start-3 row-start-2 col-span-6 row-span-3 z-10">
      <div className="grid grid-cols-3 h-full ">
        <div className="col-span-2" ref={resultMapDivRef}>
          Map
        </div>
        <div className="bg-white relative">
          <h1>Distance: {distance} meters</h1>
          <h1>Score: {score}</h1>

          <div className="absolute bottom-0 right-0 m-2">
            {isComplete ? (
              <button
                className="relative rounded px-5 py-2.5 overflow-hidden group bg-green-500 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
                onClick={handleSeeSummary}
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative">See summary</span>
              </button>
            ) : (
              <button
                className="relative rounded px-5 py-2.5 overflow-hidden group bg-green-500 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
                onClick={handleNext}
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative">Next</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
