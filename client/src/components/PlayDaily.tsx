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
import { HowToPlay } from "./HowToPlay";
import useIsBackgroundDisabled from "../hooks/useIsBackgroundDisabled";
import { useTimeout } from "../hooks/useTimeout";
import { QuotaExceeded } from "./QuotaExceeded";

type submitResponseType = {
  distance: number;
  score: number;
  isComplete: boolean;
} | null;

export const PlayDaily = () => {
  const { state } = useLocation();
  const { setIsBackgroundDisabled } = useIsBackgroundDisabled();
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
  const [questionNo, setQuestionNo] = useState<number>();
  const [initialQuestionCoords, setInitialQuestionCoords] =
    useState<latLng | null>(null);
  const [streetViewInstance, setStreetViewInstance] =
    useState<google.maps.StreetViewPanorama | null>(null);
  const [displayHowToPlay, setDisplayHowToPlay] = useState<boolean>(false);
  const [displayLoadingCursor, setDisplayLoadingCursor] =
    useState<boolean>(false);
  const [displayQuotaExceeded, setDisplayQuotaExceeded] = useState<boolean>();

  // First check if the Google maps quota has been reached. Display error if so
  const checkQuota = () => {
    var dismissButton = document.querySelector("button.dismissButton");
    if (dismissButton) {
      setDisplayHowToPlay(false);
      setDisplayQuotaExceeded(true);
      setIsBackgroundDisabled(true);
    }
    if (!dismissButton) return;
  };

  useTimeout(checkQuota, 1000);
  useTimeout(checkQuota, 5000);
  useTimeout(checkQuota, 10000);

  // Main code

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
      setQuestionNo(submission.data.questionsAnswered.length + 1);
    };

    getSubmissionData();
  }, []);

  useEffect(() => {
    if (questions && questions.length > 0) {
      const coords = {
        lat: questions[0].correctPos.lat,
        lng: questions[0].correctPos.lng,
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
    } else if (questions && questions.length === 0) {
      navigate("/");
    }
  }, [questions]);

  // Handle the submit of a question
  const handleSubmit = async (e: any) => {
    const question = questions![0];
    setMarkerPlaced(false);
    setDisplayLoadingCursor(true);
    setIsBackgroundDisabled(true);

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
    } finally {
      setDisplayLoadingCursor(false);
    }
  };

  // Handle the transition to the next question in the challenge
  const handleNext = () => {
    const updatedQuestions = [...questions!];
    updatedQuestions.shift();
    setQuestions(updatedQuestions);
    setSubmitResponseData(null);
    setQuestionNo(questionNo! + 1);
    setIsBackgroundDisabled(false);
  };

  const handleSeeSummary = () => {
    navigate(`/challenge-history/`);
    setIsBackgroundDisabled(false);
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const handlePositionReset = () => {
    if (streetViewInstance && initialQuestionCoords) {
      streetViewInstance.setPosition(initialQuestionCoords);
    }
  };

  const handleHtpOpen = () => {
    setIsBackgroundDisabled(true);
    setDisplayHowToPlay(true);
  };

  const handleHtpClose = () => {
    setIsBackgroundDisabled(false);
    setDisplayHowToPlay(false);
  };

  const handleQeHome = () => {
    setIsBackgroundDisabled(false);
    setDisplayQuotaExceeded(false);
    navigate("/");
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
            <div className="question-counter">
              {questionNo &&
                `${questionNo} / ${currentChallenge.questions.length}`}
            </div>

            <div className="location-reset" onClick={handlePositionReset}>
              <img src={IMAGES.undo}></img>
            </div>
            <div className="htp-button" onClick={handleHtpOpen}>
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
            <div
              className={`submit-answer  ${
                displayLoadingCursor ? "cursor-loading" : ""
              }`}
            >
              Submit
            </div>
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
            questionNo={questionNo!}
          />
        )}

        {displayHowToPlay && (
          <HowToPlay handleHtpClose={handleHtpClose} isFirstTimeDemo={false} />
        )}

        {displayQuotaExceeded && (
          <QuotaExceeded handleQeHome={handleQeHome} isDemo={false} />
        )}
      </div>
    </>
  );
};
