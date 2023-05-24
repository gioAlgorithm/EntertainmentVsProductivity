import React, { useState, useEffect, useContext } from "react";
import { db, auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import './card css/e-card.css';
import { TbPlayerPause } from 'react-icons/tb';
import { BsFillPlayFill } from 'react-icons/bs';
import { TimerContext } from "../context/TimerContext";



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

export default function Entertaining() {
  
  // reset confirmation state
  const [showConfirm, setShowConfirm] = useState(false);
  // history state
  const [history, setHistory] = useState([]);

  // submit state
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const {isStarted, setIsStarted, stoppedAt, setStoppedAt, 
         seconds, setSeconds, minutes, setMinutes, hours, setHours, 
         days, setDays, setStartTime, timerRef} = useContext(TimerContext)


  
  // stop, start, reset logic

  function handleStart() {
    setIsStarted(true);
  }

  function handleToggleStop() {
    setStoppedAt((prevStoppedAtState) => {
      if (prevStoppedAtState === null) {
        return Date.now();
      } else {
        setStartTime(
          (prevStartTimeState) =>
            prevStartTimeState + (Date.now() - prevStoppedAtState)
        );
        return null;
      }
    });
  }

 
  // reset button confirmation container logic
  const handleReset = ()=>{
    if(isStarted || seconds >= 1 || minutes >= 1 || hours >= 1 || days>= 1){
      setShowConfirm(true)
    }
  }

  const handleConfirmReset = ()=>{
    setMinutes(0)
    setSeconds(0)
    setHours(0)
    setDays(0)
    setIsStarted(false);
    setStoppedAt(null);
    clearInterval(timerRef.current);
    setShowConfirm(false)
  }

  const handleCancelReset = () =>{
    setShowConfirm(false)
  }

  // submit button logic

  const submitEntertainmentProgress = async (cardName) => {
    if (isStarted || seconds >= 1 || minutes >= 1 || hours >= 1 || days >= 1) {
      const timestamp = new Date().getTime(); // Get the current timestamp
      let currentTime = "";
      
      if (days > 0) {
        currentTime += `${days < 10 ? "0" + days : days}d `;
      }
      
      if (hours > 0) {
        currentTime += `${hours < 10 ? "0" + hours : hours}h `;
      }
      
      if (minutes > 0) {
        currentTime += `${minutes < 10 ? "0" + minutes : minutes}m `;
      }
      
      if (seconds > 0) {
        currentTime += `${seconds < 10 ? "0" + seconds : seconds}s`;
      }
  
      try {
        const user = auth.currentUser;
        const uid = user.uid;
        const docRef = await addDoc(collection(db, "users", uid, "eHistory"), {
          card: cardName,
          time: currentTime,
          timestamp: timestamp // Include the timestamp field in the document data
        });
  
        // Fetch the updated history data from Firestore
        fetchHistory();
  
        // Reset the timer values
        setMinutes(0);
        setSeconds(0);
        setHours(0);
        setDays(0);
        setIsStarted(false)
  
        console.log("Timer progress submitted successfully. Document ID:", docRef.id);
      } catch (error) {
        console.error("Error submitting timer progress:", error);
      }
    }
  };
  // for history display
  const fetchHistory = async () => {
    try {
      const user = auth.currentUser;
      const uid = user.uid;
      const historyRef = collection(db, "users", uid, "eHistory");
      const historySnapshot = await getDocs(
        query(historyRef, orderBy("timestamp", "desc"), limit(7))
      );
  
      const historyData = historySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
  
      setHistory(historyData);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchHistory();
      }
    });
  
    return () => unsubscribe();
  }, []);

  
  const handleSubmit = async () => {
    // to prevent multiple submiting by user!
    if ( isSubmitting || isStarted || seconds >= 1 || minutes >= 1 || hours >= 1 || days >= 1) {
      try {
        setIsSubmitting(true); // Disable the submit button
  
        // Disable the submit button immediately
        const submitButton = document.querySelector(".e-submit");
        submitButton.disabled = true;
  
        await submitEntertainmentProgress("entertainment");
  
        // Re-enable the submit button after submission is completed
        submitButton.disabled = false;
        setIsSubmitting(false); // Update submission status
      } catch (error) {
        console.error("Error submitting timer progress:", error);
        setIsSubmitting(false); // Update submission status in case of error
      }
    }
  };
  

  return (
    <div className="entertaining-card">
      {showConfirm && (
        <ResetConfirmation
          onConfirm={handleConfirmReset}
          onCancel={handleCancelReset}
        />
      )}
      <h1 className="title-entertaining">Entertaining</h1>
      <div className="entertaining-content">
        <div className="e-history">
          <h1 className="e-history-title">History</h1>
          <ul className="e-history-list">
              {history.map((item) => (
                <li key={item.id}> {item.time} </li>
              ))}
          </ul>
        </div>
        <div className="e-total-time-container">
          <div className="e-total-time">
            <h1 className="e-total-time-title">Total Time</h1>
          </div>
          <div className="e-total-time-hr">
            <h1 className="e-total-time-title-hr">Total Time in hr</h1>
          </div>
        </div>
      </div>

      <div className="e-timer-content">
        <div className="e-timer-container">
          <span className="e-timer-width"><h1 className="e-timer"> {days < 10 ? '0' + days : days} </h1><span>d</span></span>
          <span className="e-timer-width"><h1 className="e-timer">{hours < 10 ? '0' + hours : hours}</h1><span>h</span></span>
          <span className="e-timer-width"><h1 className="e-timer">{minutes < 10 ? '0' + minutes : minutes}</h1><span>m</span></span>
          <span className="e-timer-width"><h1 className="e-timer">{seconds < 10 ? '0' + seconds : seconds}</h1><span>s</span></span>
        </div>
        <div className="e-buttons">
          <button className="e-restart" onClick={handleReset}>
            Reset
          </button>
          {isStarted ? (
            <button className="e-stop" onClick={handleToggleStop}>
              {!stoppedAt ? (
                <>
                  Stop <TbPlayerPause />
                </>
              ) : (
                <>
                  Start <BsFillPlayFill />
                </>
              )}
            </button>
          ) : (
            <button className="e-stop" onClick={handleStart} >
              Start <BsFillPlayFill />
            </button>
          )}
          <button className="e-submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}