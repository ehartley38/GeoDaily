import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export const PlayDaily = () => {
  const { state } = useLocation();
  const streetviewDivRef = useRef<HTMLDivElement | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const { currentChallenge, challengeSubmission } = state;
  const [questions, setQuestions] = useState(
    currentChallenge.questions.slice(
      challengeSubmission.questionsAnswered.length
    )
  );

  useEffect(() => {
    // console.log("Challenge data:", currentChallenge);
    // console.log("Submission data:", challengeSubmission);
    // console.log("Questions:", questions);

    const coords = {
      lat: questions[0].correctPos[0].lat,
      lng: questions[0].correctPos[0].lng,
    };

    const streetViewOptions = {
      position: coords,
      addressControl: false,
      motionTracking: false,
      motionTrackingControl: false,
      fullscreenControl: false,
      showRoadLabels: false,
      zoomControl: false,
    };

    const mapOptions = {
      center: { lat: 0, lng: 0 },
      zoom: 0,
      clickableIcons: false,
      disableDefaultIO: true,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      minZoom: 0,
    };

    const loader = new Loader({
      apiKey: import.meta.env.VITE_MAPS_API_KEY,
      version: "weekly",
    });

    loader
      .load()
      .then(async (loadedGoogle) => {
        const streetViewInstance = new loadedGoogle.maps.StreetViewPanorama(
          streetviewDivRef.current!,
          streetViewOptions
        );

        const mapInstance = new loadedGoogle.maps.Map(
          mapDivRef.current!,
          mapOptions
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <h1>Play Daily</h1>

      <div
        className="relative"
        ref={streetviewDivRef}
        style={{ height: "80vh", width: "100%" }}
      >
        <div
          className="absolute bottom-0 right-0 z-10 h-1/3 w-1/5 m-5"
          // className="absolute bottom-0 right-0 z-10 h-full w-full m-5"
          ref={mapDivRef}
        ></div>
      </div>
    </>
  );
};
