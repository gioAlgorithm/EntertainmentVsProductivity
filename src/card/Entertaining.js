import React from "react";
import "./card css/e-card.css"
import { TbPlayerPause } from "react-icons/tb";
import {BsFillPlayFill} from "react-icons/bs"
import { useState, useEffect, useRef } from "react";

function ResetConfirmation({ onConfirm, onCancel }) {
  return (
    <div>
      <div className="e-reset-confirm-opacity"></div>
      <div className="e-reset-confirm-container">
        <p>Are you sure you want to reset the timer?</p>
        <div className="e-reset-confirm-buttons">
          <button className="e-reset-confirm-yes" onClick={onConfirm}>Yes</button>
          <button className="e-reset-confirm-no" onClick={onCancel}>No</button>
        </div>
        
      </div>
    </div>
  );
}

export default function Entertaining(){

    // logic of timer 
    const [eseconds, setESeconds]=useState(0)
    const [eminutes, setEMinutes]=useState(0)
    const [ehours, setEHours]=useState(0)
    const [edays, setEDays]=useState(0)

    // timer usestate
    const [isRunning, setIsRunning] = useState(false);

    // reset confirmation state
    const [showConfirm, setShowConfirm] = useState(false);
    // history state
    const [history, setHistory] = useState([]);

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

    // reset button confirmation container logic
    const handleReset = ()=>{
      if(isRunning || eseconds >= 1 || eminutes >= 1 || ehours >= 1 || edays>= 1){
        setShowConfirm(true)
        setIsRunning(false)
      }
      
    }

    const handleConfirmReset = ()=>{
      setEMinutes(0)
      setESeconds(0)
      setEHours(0)
      setEDays(0)
      setIsRunning(false);
      clearInterval(timerRef.current);
      setShowConfirm(false)
    }

    const handleCancelReset = () =>{
      setShowConfirm(false)
      setIsRunning(true)
    }

    // submit button logic
    const handleSubmit = () => {
      if(isRunning || eseconds >= 1 || eminutes >= 1 || ehours >= 1 || edays>= 1){
        let currentTime = ``
        if(edays > 0){
          currentTime += `${edays < 10 ? "0" + edays : edays}d `
        }if(ehours > 0){
          currentTime += `${ehours < 10 ? "0" + ehours: ehours}h `
        }if(eminutes > 0){
          currentTime += `${eminutes < 10 ? "0" + eminutes : eminutes}m `
        }if(eseconds > 0){
          currentTime += `${eseconds <10 ? "0" + eseconds : eseconds}s`
        }
                             
        setHistory(prevHistory => [...prevHistory, currentTime]);
        setEMinutes(0)
        setESeconds(0)
        setEHours(0)
        setEDays(0)
        setIsRunning(false);
      }
    }

    return(
        <div className="entertaining-card">
          {showConfirm && (
                  <ResetConfirmation 
                      onConfirm={handleConfirmReset}
                      onCancel={handleCancelReset}
                  />)}
            <h1 className="title-entertaining">Entertaining</h1>
            <div className="entertaining-content">
                <div className="e-history">
                    <h1 className="e-history-title">History</h1>
                    <ul className="e-history-list">
                      {history.map((time, index) => (
                        <li key={index}>{time}</li>
                      ))}
                    </ul>
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
                    <button className="e-submit" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    )
}