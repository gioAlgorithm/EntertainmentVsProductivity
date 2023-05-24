import React, { createContext, useState, useEffect, useRef } from "react";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  // timer states
  const [startTime, setStartTime] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [days, setDays] = useState(0);

  //timer logic
  const [isStarted, setIsStarted] = useState(false);
  const [stoppedAt, setStoppedAt] = useState(null);


  const timerRef = useRef();

  useEffect(() => {
    if (isStarted) {
      setStartTime(Date.now());
    } else {
      clearInterval(timerRef.current);
      setStartTime(null);
    }
  }, [isStarted]);

  useEffect(() => {
    if (startTime && isStarted) {
      if (stoppedAt) {
        clearInterval(timerRef.current);
      } else {
        if (startTime) {
          const handleTimerInterval = () => {
            const elapsedTime = Date.now() - startTime;
            const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
              (elapsedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
              (elapsedTime % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

            setDays(days);
            setHours(hours);
            setMinutes(minutes);
            setSeconds(seconds);
          };

          handleTimerInterval();
          timerRef.current = setInterval(handleTimerInterval, 1000);
        }
      }
    }
    return () => clearInterval(timerRef.current);
  }, [isStarted, stoppedAt, startTime]);


  return (
    <TimerContext.Provider 
      value={{ isStarted, setIsStarted, stoppedAt, setStoppedAt, seconds, setSeconds, 
      minutes, setMinutes, hours, setHours, days, setDays, startTime, setStartTime, 
      timerRef}}
    >
      {children}
    </TimerContext.Provider>
  );
};