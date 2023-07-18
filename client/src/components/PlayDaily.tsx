import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export const PlayDaily = () => {
  const { state } = useLocation();
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
    console.log(questions[0].correctPos[0].lat);

    const fenway = { lat: 42.345573, lng: -71.098326 };

    // const mapOptions = {
    //   center: {
    //     lat: questions[0].correctPos[0].lat,
    //     lng: questions[0].correctPos[0].lng,
    //   },
    //   zoom: 11,
    //   streetViewControl: true,
    // };

    const loader = new Loader({
      apiKey: import.meta.env.VITE_MAPS_API_KEY,
      version: "weekly",
    });

    loader
      .load()
      .then(async (loadedGoogle) => {
        // const {Map} = await google.maps.importLibrary("maps") as google.maps.MapsLibrary
        // map = new Map(document.getElementById("map") as HTMLElement, {
        //   center: coords
        // })
        const mapInstance = new loadedGoogle.maps.StreetViewPanorama(
          mapDivRef.current!,
          {
            position: fenway,
            pov: {
              heading: 34,
              pitch: 10,
            },
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <h1>Play Daily</h1>
      <div ref={mapDivRef} style={{ height: "90vh", width: "100%" }}></div>
    </>
  );
};
