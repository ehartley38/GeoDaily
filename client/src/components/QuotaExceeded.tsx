import IMAGES from "../images/images";
import "./quotaExceeded.css";

type QuotaExceededProps = {
  handleQeRegister?: () => void;
  handleQeHome?: () => void;
  isDemo: boolean;
};

export const QuotaExceeded = ({
  handleQeRegister,
  isDemo,
  handleQeHome,
}: QuotaExceededProps) => {
  return (
    <div className="qe-container">
      <div className="error-msg">Warning - API Quota Exceeded</div>
      {/* <img src={IMAGES.logo} className="logo"></img> */}
      <h3>What does this mean?</h3>
      <p>
        This application uses the Google Maps API service to retrieve maps and
        streetview data. For the sake of my wallet, I put a daily quota on the
        number of requests that could be made to the service each day.
      </p>
      <h3>What can I do now?</h3>
      <p>
        The quota has been reached so you currently cannot play, but fear not -
        It resets at 7AM (GMT). In the meantime, feel free to explore the rest
        of the application.
      </p>
      {isDemo ? (
        <div className="lets-go-button" onClick={handleQeRegister}>
          Register
        </div>
      ) : (
        <div className="lets-go-button" onClick={handleQeHome}>
          Return Home
        </div>
      )}
    </div>
  );
};
