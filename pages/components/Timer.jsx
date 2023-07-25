import React, { useState, useEffect } from "react";

function CountdownTimer({ initialTime }) {
  const [remainingTime, setRemainingTime] = useState(initialTime);

  useEffect(() => {
    let interval;

    if (remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [remainingTime]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "100px" }}>
        <span>{formatTime(remainingTime)}</span>
      </div>
    </div>
  );
}

export default CountdownTimer;
