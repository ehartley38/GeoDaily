import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { ResultsSummary } from "./ResultsSummary";
import { challengeSubmission } from "../customTypings/challengeSubmission";
import { question } from "../customTypings/question";
import { latLng } from "../customTypings/latLng";
import useUserData from "../hooks/useUserData";
import "./playDaily.css";
import IMAGES from "../images/images";

type submitResponseType = {
  distance: number;
  score: number;
  isComplete: boolean;
} | null;

export const PlayDaily = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const streetviewDivRef = useRef<HTMLDivElement | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const { currentChallenge } = state;
  const [challengeSubmission, setChallengeSubmission] =
    useState<challengeSubmission>();
  const [questions, setQuestions] = useState<question[] | null>(null);
  const [markerPlaced, setMarkerPlaced] = useState<boolean>(false);
  const [markerPosition, setMarkerPosition] = useState<latLng | null>(null);
  const [submitResponseData, setSubmitResponseData] =
    useState<submitResponseType>(null);
  const { userData, setUserData } = useUserData();
  // const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    const getSubmissionData = async () => {
      const submission = await axiosPrivate.get(
        "/challenges/current-submission",
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setChallengeSubmission(submission.data);
      setQuestions(
        currentChallenge.questions.slice(
          submission.data.questionsAnswered.length
        )
      );
    };

    getSubmissionData();
  }, []);

  useEffect(() => {
    // console.log("Challenge data:", currentChallenge);
    // console.log("Submission data:", challengeSubmission);
    // console.log("Questions:", questions);

    if (questions && questions.length > 0) {
      const coords = {
        lat: questions[0].correctPos.lat,
        lng: questions[0].correctPos.lng,
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
    } else if (questions && questions.length === 0) {
      console.log("Finished");
    }
  }, [questions]);

  // Handle the submit of a question
  const handleSubmit = async (e: any) => {
    const question = questions![0];
    setMarkerPlaced(false);

    try {
      const submitResponse = await axiosPrivate.post(
        "/play/submitQuestion",
        { question, challengeSubmission, markerPosition },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // If challenge is complete, update the userData challengeStreak state
      if (submitResponse.data.isComplete) {
        setUserData({
          ...userData!,
          challengeStreak: userData!.challengeStreak + 1,
        });
      }

      setSubmitResponseData(submitResponse.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Handle the transition to the next question in the challenge
  const handleNext = () => {
    const updatedQuestions = [...questions!];
    updatedQuestions.shift();
    setQuestions(updatedQuestions);
    setSubmitResponseData(null);
  };

  const handleSeeSummary = () => {
    navigate(`/challenge-history/`);
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <>
      <div className="play-daily-container">
        <div className="street-view-container" ref={streetviewDivRef}></div>

        <div className="go-back" onClick={handleGoBack}>
          <img src={IMAGES.backArrow}></img>
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
            correctPos={questions![0].correctPos}
            markerPos={markerPosition!}
            handleNext={handleNext}
            isComplete={submitResponseData.isComplete}
            handleSeeSummary={handleSeeSummary}
          />
        )}
      </div>
    </>
  );
};
