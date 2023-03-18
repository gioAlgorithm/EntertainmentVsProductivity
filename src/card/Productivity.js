import React from "react";
import "./card css/p-card.css"
import { TbPlayerPause } from "react-icons/tb";
import {BsFillPlayFill} from "react-icons/bs"
import { useState, useEffect, useRef } from "react";


function ResetConfirmation({ onConfirm, onCancel }) {
  return (
    <div>
      <div className="p-reset-confirm-opacity"></div>
      <div className="p-reset-confirm-container">
        <p>Are you sure you want to reset the timer?</p>
        <div className="p-reset-confirm-buttons">
          <button className="p-reset-confirm-yes" onClick={onConfirm}>Yes</button>
          <button className="p-reset-confirm-no" onClick={onCancel}>No</button>
        </div>
        
      </div>
    </div>
  );
}

export default function Productivity(){

    // timer states
    const [startTime, setStartTime] = useState(null);
    const [pseconds, setPSeconds]=useState(0)
    const [pminutes, setPMinutes]=useState(0)
    const [phours, setPHours]=useState(0)
    const [pdays, setPDays]=useState(0)

    // if timer is runing
    const [isRunning, setIsRunning] = useState(false);

    // reset confirmation state
    const [showConfirm, setShowConfirm] = useState(false);
    // history state
    const [history, setHistory] = useState([]);

    const timerRef = useRef();

    useEffect(() => {
      if (isRunning) {
        setStartTime(Date.now());
      } else {
        clearInterval(timerRef.current);
        setStartTime(null);
      }
    }, [isRunning]);
  
    useEffect(() => {
      if (startTime) {
        timerRef.current = setInterval(() => {
          const elapsedTime = Date.now() - startTime;
          const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
          const hours = Math.floor((elapsedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
          
          setPDays(days);
          setPHours(hours);
          setPMinutes(minutes);
          setPSeconds(seconds);
        }, 1000);
      }
      return () => clearInterval(timerRef.current);
    }, [startTime]);
  
     // stop, start, reset logic


     
     function handleStartStop() {
      setIsRunning(prevState => !prevState);
      clearInterval(timerRef.current);
    }

   
    // reset button confirmation container logic
    const handleReset = ()=>{
      if(isRunning || pseconds >= 1 || pminutes >= 1 || phours >= 1 || pdays>= 1){
        setShowConfirm(true)
        setIsRunning(false)
      }
    }

    const handleConfirmReset = ()=>{
      setPMinutes(0)
      setPSeconds(0)
      setPHours(0)
      setPDays(0)
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
      if(isRunning || pseconds >= 1 || pminutes >= 1 || phours >= 1 || pdays>= 1){
        let currentTime = ``
        if(pdays > 0){
          currentTime += `${pdays < 10 ? "0" + pdays : pdays}d `
        }if(phours > 0){
          currentTime += `${phours < 10 ? "0" + phours: phours}h `
        }if(pminutes > 0){
          currentTime += `${pminutes < 10 ? "0" + pminutes : pminutes}m `
        }if(pseconds > 0){
          currentTime += `${pseconds <10 ? "0" + pseconds : pseconds}s`
        }
                             
        setHistory(prevHistory => [...prevHistory, currentTime]);
        setPMinutes(0)
        setPSeconds(0)
        setPHours(0)
        setPDays(0)
        setIsRunning(false);
      }
    }



    return(
        <div className="productive-card">
          {showConfirm && (
                  <ResetConfirmation 
                      onConfirm={handleConfirmReset}
                      onCancel={handleCancelReset}
                  />)}
            <h1 className="title-productive">Productivity</h1>
            <div className="productivity-content">
                <div className="p-history">
                    <h1 className="p-history-title">History</h1>
                    <ul className="p-history-list">
                      {history.slice(-7).map((time, index) => (
                        <li key={index}>{time}</li>
                      ))}
                    </ul>
                </div>
                <div className="p-total-time-container">
                  <div className="p-total-time">
                    <h1 className="p-total-time-title">Total Time</h1>
                  </div>
                  <div className="p-total-time-hr">
                    <h1 className="p-total-time-title-hr">Total Time in hr</h1>   
                  </div>
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
                    <button className="p-submit" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    )
}