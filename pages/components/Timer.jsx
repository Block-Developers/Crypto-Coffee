import React from "react";
import { useTimer } from "react-timer-hook";

function MyTimer({ expiryTimestamp, gotTime }) {
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });

  // Start the timer when gotTime is true and expiryTimestamp is valid
  React.useEffect(() => {
    if (gotTime && expiryTimestamp) {
      start();
    }
  }, [gotTime, expiryTimestamp]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "100px" }}>
        <span>{expiryTimestamp}</span>
      </div>
    </div>
  );
}

export default MyTimer;
