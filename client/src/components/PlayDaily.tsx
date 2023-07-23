import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const PlayDaily = () => {
  const { state } = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const streetviewDivRef = useRef<HTMLDivElement | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const { currentChallenge, challengeSubmission } = state;
  const [questions, setQuestions] = useState(
    currentChallenge.questions.slice(
      challengeSubmission.questionsAnswered.length
    )
  );
  const [markerPlaced, setMarkerPlaced] = useState<boolean>(false);
  // const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [markerPosition, setMarkerPosition] =
    useState<null | google.maps.LatLng>(null);

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
      zoom: 1,
      clickableIcons: false,
      disableDefaultIO: true,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      minZoom: 1,
      draggableCursor: "crosshair",
    };

    const loader = new Loader({
      apiKey: import.meta.env.VITE_MAPS_API_KEY,
      version: "weekly",
    });

    loader
      .load()
      .then(async (loadedGoogle) => {
        let marker: null | google.maps.Marker = null;

        const streetViewInstance = new loadedGoogle.maps.StreetViewPanorama(
          streetviewDivRef.current!,
          streetViewOptions
        );

        const mapInstance = new loadedGoogle.maps.Map(
          mapDivRef.current!,
          mapOptions
        );

        mapInstance.addListener("click", (e: any) => {
          placeMarker(e.latLng, mapInstance);
        });

        const placeMarker = (
          position: google.maps.LatLng,
          map: google.maps.Map
        ) => {
          if (marker === null) {
            marker = new loadedGoogle.maps.Marker({
              position: position,
              map: map,
            });
            // setMarker(newMarker);
            setMarkerPlaced(true);
          } else {
            marker.setPosition(position);
          }
          setMarkerPosition(position);
        };
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Handle the submit of a question
  // TODO: consistent submit of coords
  const handleSubmit = async (e: any) => {
    const submitResponse = await axiosPrivate.post(
      "/play/submitQuestion",
      { markerPosition },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
  };

  return (
    <>
      <h1>Play Daily</h1>

      <div
        className="relative"
        ref={streetviewDivRef}
        style={{ height: "80vh", width: "100%" }}
      >
        <div
          className="transition-all absolute bottom-0 right-0 z-10 h-1/3 w-1/5 m-5 hover:h-2/3 hover:w-2/5"
          ref={mapDivRef}
        ></div>
      </div>

      <div className="absolute bottom-0 right-0 m-2">
        {markerPlaced ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
        ) : (
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">
            Submit
          </button>
        )}
      </div>
    </>
  );
};
