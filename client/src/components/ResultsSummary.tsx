import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";
import IMAGES from "../images/images";

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
  handleSeeSummary?: any;
  isComplete: boolean;
  questionNo: number;
};

export const ResultsSummary = ({
  distance,
  score,
  correctPos,
  markerPos,
  handleNext,
  handleSeeSummary,
  isComplete,
  questionNo,
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

    const pathCoords = [correctPos, markerPos];

    loader.load().then(async (loadedGoogle) => {
      let bounds = new google.maps.LatLngBounds();
      bounds.extend(correctPos);
      bounds.extend(markerPos);

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
    <div className="results-summary-container">
      <div className="result-map-container" ref={resultMapDivRef}></div>
      <div className="result-info-container">
        <img className="logo" src={IMAGES.logo}></img>
        <h1>{`Question ${questionNo}`}</h1>

        {distance < 5000 ? (
          <p>{distance} metres</p>
        ) : (
          <p>{Math.round(distance / 1609)} miles</p>
        )}

        <p>{score} points</p>
        {isComplete ? (
          <button className="next-question summary" onClick={handleSeeSummary}>
            See Summary
          </button>
        ) : (
          <button className="next-question" onClick={handleNext}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};
