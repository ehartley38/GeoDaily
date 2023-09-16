import { useEffect, useRef, useState } from "react";
import axios from "../services/axios";
import { question } from "../customTypings/question";
import { useNavigate } from "react-router-dom";
import { latLng } from "../customTypings/latLng";
import { Loader } from "@googlemaps/js-api-loader";
import IMAGES from "../images/images";
import { ResultsSummary } from "./ResultsSummary";
import { HowToPlay } from "./HowToPlay";

type submitResponseType = {
  distance: number;
  score: number;
  token: string;
  attemptPos: latLng;
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
  const [initialQuestionCoords, setInitialQuestionCoords] =
    useState<latLng | null>(null);
  const [streetViewInstance, setStreetViewInstance] =
    useState<google.maps.StreetViewPanorama | null>(null);
  const [demoToken, setDemoToken] = useState<string | null>();
  const [displayHowToPlay, setDisplayHowToPlay] = useState<boolean>(false);

  useEffect(() => {
    // Get current challenge from unprotected endpoint
    const getCurrentChallenge = async () => {
      const currentChallenge = await axios.get("playDemo");
      setCurrentChallenge(currentChallenge.data);
      setQuestion(currentChallenge.data.currentChallenge.questions[0]);
    };

    // Get submit response data, if user has a token in local storage.
    // If they have an invalid token, remove it, because there will have been a new daily challenge generated which deletes all temp submissions
    const getSubmitResponseData = async (token: string) => {
      const tempSubmission = await axios.post("playDemo/temp-submission", {
        token,
      });
      const data = tempSubmission.data;

      if (!data.tempSubmission) {
        localStorage.removeItem("demoToken");
      } else {
        setSubmitResponseData(tempSubmission.data.tempSubmission);
        setMarkerPosition(tempSubmission.data.tempSubmission.attemptPos);
      }
    };

    getCurrentChallenge();

    const token = localStorage.getItem("demoToken");
    setDemoToken(token);

    // If token exists in local storage (ie user has already completed the demo), then retrieve submitResponseData
    if (token) {
      getSubmitResponseData(token);
    } else {
      setDisplayHowToPlay(true);
    }
  }, []);

  useEffect(() => {
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
      const submitResponse = await axios.post("/playDemo/submitTempQuestion", {
        question,
        markerPosition,
      });

      setSubmitResponseData(submitResponse.data);

      // Store token in local storage
      localStorage.setItem("demoToken", submitResponse.data.token);
    } catch (err) {
      console.log(err);
    }
  };

  // Handle the transition to the next question in the challenge
  const handleNext = () => {
    // Redirect to sign-up page
    setSubmitResponseData(null);
    navigate("/register");
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
            <div
              className="htp-button"
              onClick={() => setDisplayHowToPlay(true)}
            >
              <img src={IMAGES.help}></img>
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

        {submitResponseData && markerPosition && question && (
          <ResultsSummary
            distance={submitResponseData!.distance}
            score={submitResponseData!.score}
            correctPos={question!.correctPos}
            markerPos={markerPosition!}
            handleNext={handleNext}
            isComplete={false}
            questionNo={1}
          />
        )}

        {displayHowToPlay && (
          <HowToPlay setDisplayHowToPlay={setDisplayHowToPlay} />
        )}
      </div>
    </>
  );
};
