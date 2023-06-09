import React, { createContext, useState, useEffect, useRef } from "react";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  // Entertainment timer states
  const [startEntertainment, setStartEntertainment] = useState(null);
  const [eseconds, setESeconds] = useState(0);
  const [eminutes, setEMinutes] = useState(0);
  const [ehours, setEHours] = useState(0);
  const [edays, setEDays] = useState(0);

  //entertainment timer logic
  const [entertainmentStarted, setEntertainmentStarted] = useState(false);
  const [stoppedAtEntertainment, setStoppedAtEntertainment] = useState(null);

  // Add a new state variable to hold the total time
  const [totalTimeE, setTotalTimeE] = useState(0);


  const entertainmentTimerRef = useRef();

  useEffect(() => {
    if (entertainmentStarted) {
      setStartEntertainment(Date.now());
    } else {
      clearInterval(entertainmentTimerRef.current);
      setStartEntertainment(null);
    }
  }, [entertainmentStarted]);

  useEffect(() => {
    if (startEntertainment && entertainmentStarted) {
      if (stoppedAtEntertainment) {
        clearInterval(entertainmentTimerRef.current);
      } else {
        if (startEntertainment) {
          const handleTimerInterval = () => {
            const elapsedTime = Date.now() - startEntertainment;
            const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
              (elapsedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
              (elapsedTime % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

            setEDays(days);
            setEHours(hours);
            setEMinutes(minutes);
            setESeconds(seconds);
          };

          handleTimerInterval();
          entertainmentTimerRef.current = setInterval(handleTimerInterval, 1000);
        }
      }
    }
    return () => clearInterval(entertainmentTimerRef.current);
  }, [entertainmentStarted, stoppedAtEntertainment, startEntertainment]);


  // productivity timer states
  const [startProductivity, setStartProductivity] = useState(null);
  const [pseconds, setPSeconds] = useState(0);
  const [pminutes, setPMinutes] = useState(0);
  const [phours, setPHours] = useState(0);
  const [pdays, setPDays] = useState(0);

  //productivity timer logic
  const [productivityStarted, setProductivityStarted] = useState(false);
  const [stoppedAtProductivity, setStoppedAtProductivity] = useState(null);

  // Add a new state variable to hold the total time
  const [totalTimeP, setTotalTimeP] = useState(0);

  const productivityTimerRef = useRef();

  useEffect(() => {
    if (productivityStarted) {
      setStartProductivity(Date.now());
    } else {
      clearInterval(productivityTimerRef.current);
      setStartProductivity(null);
    }
  }, [productivityStarted]);

  useEffect(() => {
    if (startProductivity && productivityStarted) {
      if (stoppedAtProductivity) {
        clearInterval(productivityTimerRef.current);
      } else {
        if (startProductivity) {
          const handleTimerInterval = () => {
            const elapsedTime = Date.now() - startProductivity;
            const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
              (elapsedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
              (elapsedTime % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

            setPDays(days);
            setPHours(hours);
            setPMinutes(minutes);
            setPSeconds(seconds);
          };

          handleTimerInterval();
          productivityTimerRef.current = setInterval(handleTimerInterval, 1000);
        }
      }
    }
    return () => clearInterval(productivityTimerRef.current);
  }, [productivityStarted, stoppedAtProductivity, startProductivity]);


  return (
    <TimerContext.Provider 
      value={{entertainmentStarted, setEntertainmentStarted, stoppedAtEntertainment, setStoppedAtEntertainment,startEntertainment, setStartEntertainment,  
              eseconds, setESeconds,eminutes, setEMinutes, ehours, setEHours, edays, setEDays, entertainmentTimerRef,totalTimeE, setTotalTimeE,
              productivityStarted, setProductivityStarted, stoppedAtProductivity, setStoppedAtProductivity, startProductivity, setStartProductivity,
              pseconds, setPSeconds,pminutes, setPMinutes, phours, setPHours, pdays, setPDays,productivityTimerRef, totalTimeP, setTotalTimeP
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};