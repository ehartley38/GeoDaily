import { useEffect, useRef, useState } from "react";
import axios from "../services/axios";
import { question } from "../customTypings/question";
import { useNavigate } from "react-router-dom";
import { latLng } from "../customTypings/latLng";
import { Loader } from "@googlemaps/js-api-loader";
import IMAGES from "../images/images";
import { ResultsSummary } from "./ResultsSummary";

type submitResponseType = {
  distance: number;
  score: number;
  isComplete: boolean;
} | null;

export const PlayDemo = () => {
  const [currentChallenge, setCurrentChallenge] = useState<question[]>();
  const navigate = useNavigate();
  const streetviewDivRef = useRef<HTMLDivElement | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const [question, setQuestion] = useState<question | null>(null);
  const [markerPlaced, setMarkerPlaced] = useState<boolean>(false);
  const [markerPosition, setMarkerPosition] = useState<latLng | null>(null);
  const [submitResponseData, setSubmitResponseData] =
    useState<submitResponseType>(null);

  //   const [questionNo, setQuestionNo] = useState<number>(1);
  const [initialQuestionCoords, setInitialQuestionCoords] =
    useState<latLng | null>(null);
  const [streetViewInstance, setStreetViewInstance] =
    useState<google.maps.StreetViewPanorama | null>(null);

  useEffect(() => {
    // Get current challenge from unprotected endpoint
    const getCurrentChallenge = async () => {
      const currentChallenge = await axios.get("playDemo");
      setCurrentChallenge(currentChallenge.data);
      setQuestion(currentChallenge.data.currentChallenge.questions[0]);
      console.log(currentChallenge.data.currentChallenge.questions[0]);
    };

    getCurrentChallenge();
  }, []);

  useEffect(() => {
    // console.log("Challenge data:", currentChallenge);
    // console.log("Submission data:", challengeSubmission);
    // console.log("Questions:", questions);

    if (question) {
      const coords = {
        lat: question.correctPos.lat,
        lng: question.correctPos.lng,
      };

      setInitialQuestionCoords(coords);

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

          const streetView = new loadedGoogle.maps.StreetViewPanorama(
            streetviewDivRef.current!,
            streetViewOptions
          );
          setStreetViewInstance(streetView);

          const mapInstance = new loadedGoogle.maps.Map(
            mapDivRef.current!,
            mapOptions
          );

          mapInstance.addListener("click", (e: any) => {
            placeMarker(e.latLng, mapInstance);
          });

          const placeMarker = (position: latLng, map: google.maps.Map) => {
            if (marker === null) {
              var iconBase = "https://maps.google.com/mapfiles/kml/shapes/";
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
    }
  }, [question]);

  // Handle the submit of a question
  const handleSubmit = async (e: any) => {
    setMarkerPlaced(false);

    try {
      // Create temp submission
      const submitResponse = await axios.post("/play-demo/submitQuestion", {
        question,
        markerPosition,
      });

      setSubmitResponseData(submitResponse.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Handle the transition to the next question in the challenge
  const handleNext = () => {
    // Redirect to sign-up page
    setSubmitResponseData(null);
  };

  const handleGoBack = () => {
    navigate("/login");
  };

  const handlePositionReset = () => {
    if (streetViewInstance && initialQuestionCoords) {
      streetViewInstance.setPosition(initialQuestionCoords);
    }
  };

  return (
    <>
      <div className="play-daily-container">
        <div className="street-view-container" ref={streetviewDivRef}></div>
        <div className="top-ui-wrapper">
          <div className="go-back" onClick={handleGoBack}>
            <img src={IMAGES.backArrow}></img>
          </div>
          <div className="top-ui-right">
            <div className="question-counter">{`1 / 3`}</div>

            <div className="location-reset" onClick={handlePositionReset}>
              <img src={IMAGES.undo}></img>
            </div>
          </div>
        </div>

        <div className="map-picker-container">
          <div className="map-picker" ref={mapDivRef}></div>
          {markerPlaced ? (
            <div className="submit-answer marker-placed" onClick={handleSubmit}>
              Submit
            </div>
          ) : (
            <div className="submit-answer">Submit</div>
          )}
        </div>

        {submitResponseData && (
          <ResultsSummary
            distance={submitResponseData!.distance}
            score={submitResponseData!.score}
            correctPos={question!.correctPos}
            markerPos={markerPosition!}
            handleNext={handleNext}
            isComplete={submitResponseData.isComplete}
            questionNo={1}
          />
        )}
      </div>
    </>
  );
};
