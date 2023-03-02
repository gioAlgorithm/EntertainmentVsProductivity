import React from "react";
import "./card css/p-card.css"
import { TbPlayerPause } from "react-icons/tb";
import {BsFillPlayFill} from "react-icons/bs"
import { useState, useEffect, useRef } from "react";

export default function Productivity(){

    // logic of timer 
    const [pseconds, setPSeconds]=useState(0)
    const [pminutes, setPMinutes]=useState(0)
    const [phours, setPHours]=useState(0)
    const [pdays, setPDays]=useState(0)

    // if timer is runing
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef();

    useEffect(() => {
      if (isRunning) {
        timerRef.current = setInterval(() => {
          setPSeconds(pseconds + 1);
          if (pseconds === 59) {
            setPMinutes(pminutes + 1);
            setPSeconds(0);
          }
          if (pminutes === 59 && pseconds === 59) {
            setPHours(phours + 1);
            setPMinutes(0);
            setPSeconds(0);
          }
          if (phours === 23 && pminutes === 59 && pseconds === 59) {
            setPDays(pdays + 1);
            setPHours(0);
            setPMinutes(0);
            setPSeconds(0);
          }
        }, 1000);
      }
  
      return () => clearInterval(timerRef.current);
    }, [pseconds, pminutes, phours, pdays, isRunning]);
  
     // stop, start, reset logic


     
     function handleStartStop() {
      setIsRunning(prevState => !prevState);
      clearInterval(timerRef.current);
    }

   
    const handleReset = ()=>{
      setPMinutes(0)
      setPSeconds(0)
      setPHours(0)
      setPDays(0)
      setIsRunning(false);
      clearInterval(timerRef.current);
    }
    return(
        <div className="productive-card">
            <h1 className="title-productive">Productivity</h1>
            <div className="productivity-content">
                <div className="p-history">
                    <h1 className="p-history-title">History</h1>
                </div>
                <div className="p-total-time">
                    <h1 className="p-total-time-title">Total Time</h1>
                </div>
            </div>
            <div className="p-timer-content">
                <div className="p-timer-container">    
                    <span className="p-timer-width"><h1 className="p-timer"> {pdays < 10 ? "0" + pdays : pdays} </h1><span>d</span></span>
                    <span className="p-timer-width"><h1 className="p-timer">{phours < 10 ? "0" + phours: phours}</h1><span>h</span></span>
                    <span className="p-timer-width"><h1 className="p-timer">{pminutes < 10 ? "0" + pminutes : pminutes}</h1><span>m</span></span>
                    <span className="p-timer-width"><h1 className="p-timer">{pseconds <10 ? "0" + pseconds : pseconds}</h1><span>s</span></span>     
                </div>
                <div className="p-buttons">
                    <button className="p-restart" onClick={handleReset}>Reset</button>
                    <button className="p-stop" onClick={handleStartStop}>{isRunning ? (<>Stop <TbPlayerPause /></>) : (<>Start <BsFillPlayFill /> </>)}</button>
                    <button className="p-submit">Submit</button>
                </div>
            </div>
        </div>
    )
}