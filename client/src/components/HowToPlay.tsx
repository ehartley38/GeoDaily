import IMAGES from "../images/images";
import "./howToPlay.css";

type HowToPlayProps = {
  handleHtpClose: () => void;
  handleHtpLetsGo?: () => void;
  isFirstTimeDemo: boolean;
};

export const HowToPlay = ({
  handleHtpClose,
  handleHtpLetsGo,
  isFirstTimeDemo,
}: HowToPlayProps) => {
  return (
    <div className="htp-container">
      <img
        src={IMAGES.closeWindow}
        onClick={handleHtpClose}
        className="close-btn"
      ></img>
      <img src={IMAGES.logo} className="logo"></img>
      <h1>How it works</h1>

      <div className="htp-content">
        <div className="step">
          <h2>#1</h2>
          <div>Get placed in a random location</div>
        </div>
        <div className="step">
          <h2>#2</h2>
          <div>Navigate around and use clues to identify where you are</div>
        </div>
        <div className="step">
          <h2>#3</h2>
          <div>Make a guess by placing a marker on the map</div>
        </div>
      </div>
      <div className="end-summary">
        A new challenge is generated at midnight (GMT) each day!
      </div>
      {isFirstTimeDemo && (
        <div className="lets-go-button" onClick={handleHtpLetsGo}>
          Lets go!
        </div>
      )}
    </div>
  );
};
