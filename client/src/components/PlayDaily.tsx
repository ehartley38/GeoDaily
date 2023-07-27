import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { ResultsSummary } from "./ResultsSummary";

type submitResponseType = {
  distance: number;
} | null;

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
  const [markerPosition, setMarkerPosition] =
    useState<null | google.maps.LatLng>(null);
  const [submitResponseData, setSubmitResponseData] =
    useState<submitResponseType>(null);

  const [showResultModal, setShowResultModal] = useState<boolean>(true);

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
  const handleSubmit = async (e: any) => {
    const correctPos = questions[0].correctPos[0];

    const submitResponse = await axiosPrivate.post(
      "/play/submitQuestion",
      { correctPos, markerPosition },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    setSubmitResponseData(submitResponse.data);

    console.log(submitResponse.data.distance);
  };

  return (
    <>
      {/* <h1>Play Daily</h1> */}

      <div
        className="grid grid-cols-10 grid-rows-8 h-screen"
        ref={streetviewDivRef}
      >
        <div className="col-span-6 row-span-6 col-start-5 row-start-4 z-10 m-5">
          <div className="relative h-full">
            <div
              className="transition-all absolute bottom-0 right-0 h-1/2 w-1/2 hover:h-full hover:w-full"
              ref={mapDivRef}
            ></div>
          </div>
        </div>

        {/* <div className="absolute bottom-0 right-0 m-2 z-10">
            {submitResponseData && (
              <ResultsSummary distance={submitResponseData!.distance} />
            )}
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
          </div> */}
      </div>
    </>
  );
};
