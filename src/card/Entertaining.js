import React from "react";
import "./card css/e-card.css"
import { TbPlayerPause } from "react-icons/tb";
import {BsFillPlayFill} from "react-icons/bs"
import { useState, useEffect, useRef } from "react";

export default function Entertaining(){

    // logic of timer 
    const [eseconds, setESeconds]=useState(0)
    const [eminutes, setEMinutes]=useState(0)
    const [ehours, setEHours]=useState(0)
    const [edays, setEDays]=useState(0)

    // timer usestate
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef();

    useEffect(() => {
      if (isRunning) {
        timerRef.current = setInterval(() => {
          setESeconds(eseconds + 1);
          if (eseconds === 59) {
            setEMinutes(eminutes + 1);
            setESeconds(0);
          }
          if (eminutes === 59 && eseconds === 59) {
            setEHours(ehours + 1);
            setEMinutes(0);
            setESeconds(0);
          }
          if (ehours === 23 && eminutes === 59 && eseconds === 59) {
            setEDays(edays + 1);
            setEHours(0);
            setEMinutes(0);
            setESeconds(0);
          }
        }, 1000);
      }
  
      return () => clearInterval(timerRef.current);
    }, [eseconds, eminutes, ehours, edays, isRunning]);
  
     // stop, start, reset logic


     
     function handleStartStop() {
      setIsRunning(prevState => !prevState);
      clearInterval(timerRef.current);
    }

   
    const handleReset = ()=>{
      setEMinutes(0)
      setESeconds(0)
      setEHours(0)
      setEDays(0)
      setIsRunning(false);
      clearInterval(timerRef.current);
    }

    return(
        <div className="entertaining-card">
            <h1 className="title-entertaining">Entertaining</h1>
            <div className="entertaining-content">
                <div className="e-history">
                    <h1 className="e-history-title">History</h1>
                </div>
                <div className="e-total-time">
                    <h1 className="e-total-time-title">Total Time</h1>
                </div>
            </div>
            <div className="e-timer-content">
                <div className="e-timer-container">    
                    <span className="e-timer-width"><h1 className="e-timer"> {edays < 10 ? "0" + edays : edays} </h1><span>d</span></span>
                    <span className="e-timer-width"><h1 className="e-timer">{ehours < 10 ? "0" + ehours: ehours}</h1><span>h</span></span>
                    <span className="e-timer-width"><h1 className="e-timer">{eminutes < 10 ? "0" + eminutes : eminutes}</h1><span>m</span></span>
                    <span className="e-timer-width"><h1 className="e-timer">{eseconds <10 ? "0" + eseconds : eseconds}</h1><span>s</span></span>     
                </div>
                <div className="e-buttons">
                    <button className="e-restart" onClick={handleReset}>Reset</button>
                    <button className="e-stop" onClick={handleStartStop}>{isRunning ? (<>Stop <TbPlayerPause /></>) : (<>Start <BsFillPlayFill /> </>)}</button>
                    <button className="e-submit">Submit</button>
                </div>
            </div>
        </div>
    )
}