import { useEffect, useState } from "react";

type TimerProps = {
  timeRemaining: number;
  setTimeRemaining: any; // Clean up
};

export const Timer = ({ timeRemaining, setTimeRemaining }: TimerProps) => {
  const [hours, sethours] = useState<number>();
  const [mins, setmins] = useState<number>();
  const [secs, setsecs] = useState<number>();

  // countdown timer
  useEffect(() => {
    if (timeRemaining < 0) return;
    const intervalId = setInterval(() => {
      setTimeRemaining(timeRemaining - 1000);

      setsecs(Math.floor((timeRemaining / 1000) % 60));
      setmins(Math.floor((timeRemaining / 1000 / 60) % 60));
      sethours(Math.floor(timeRemaining / 1000 / 60 / 60));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeRemaining]);

  return (
    timeRemaining &&
    hours &&
    mins &&
    secs && (
      <div>
        {hours}h {mins}m {secs}s
      </div>
    )
  );
};
