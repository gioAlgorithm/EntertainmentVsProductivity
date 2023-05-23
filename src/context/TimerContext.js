import React, { createContext, useState } from "react";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [stoppedAt, setStoppedAt] = useState(null);

  return (
    <TimerContext.Provider value={{ isStarted, setIsStarted, stoppedAt, setStoppedAt }}>
      {children}
    </TimerContext.Provider>
  );
};