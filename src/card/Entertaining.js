import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import './card css/e-card.css';
import { TbPlayerPause } from 'react-icons/tb';
import { BsFillPlayFill } from 'react-icons/bs';



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
  // timer states
  const [startTime, setStartTime] = useState(null);
  const [eseconds, setESeconds] = useState(0);
  const [eminutes, setEMinutes] = useState(0);
  const [ehours, setEHours] = useState(0);
  const [edays, setEDays] = useState(0);

  // if timer is runing
  const [isStarted, setIsStarted] = useState(false);
  const [stoppedAt, setStoppedAt] = useState(null);

  // reset confirmation state
  const [showConfirm, setShowConfirm] = useState(false);
  // history state
  const [history, setHistory] = useState([]);

  // submit state
  const [isSubmitting, setIsSubmitting] = useState(false); 


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

            setEDays(days);
            setEHours(hours);
            setEMinutes(minutes);
            setESeconds(seconds);
          };

          handleTimerInterval();
          timerRef.current = setInterval(handleTimerInterval, 1000);
        }
      }
    }
    return () => clearInterval(timerRef.current);
  }, [isStarted, stoppedAt, startTime]);

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
    if(isStarted || eseconds >= 1 || eminutes >= 1 || ehours >= 1 || edays>= 1){
      setShowConfirm(true)
    }
  }

  const handleConfirmReset = ()=>{
    setEMinutes(0)
    setESeconds(0)
    setEHours(0)
    setEDays(0)
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
    if (isStarted || eseconds >= 1 || eminutes >= 1 || ehours >= 1 || edays >= 1) {
      const timestamp = new Date().getTime(); // Get the current timestamp
      let currentTime = "";
      
      if (edays > 0) {
        currentTime += `${edays < 10 ? "0" + edays : edays}d `;
      }
      
      if (ehours > 0) {
        currentTime += `${ehours < 10 ? "0" + ehours : ehours}h `;
      }
      
      if (eminutes > 0) {
        currentTime += `${eminutes < 10 ? "0" + eminutes : eminutes}m `;
      }
      
      if (eseconds > 0) {
        currentTime += `${eseconds < 10 ? "0" + eseconds : eseconds}s`;
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
        setEMinutes(0);
        setESeconds(0);
        setEHours(0);
        setEDays(0);
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
    if ( isSubmitting || isStarted || eseconds >= 1 || eminutes >= 1 || ehours >= 1 || edays >= 1) {
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
          <span className="e-timer-width"><h1 className="e-timer"> {edays < 10 ? '0' + edays : edays} </h1><span>d</span></span>
          <span className="e-timer-width"><h1 className="e-timer">{ehours < 10 ? '0' + ehours : ehours}</h1><span>h</span></span>
          <span className="e-timer-width"><h1 className="e-timer">{eminutes < 10 ? '0' + eminutes : eminutes}</h1><span>m</span></span>
          <span className="e-timer-width"><h1 className="e-timer">{eseconds < 10 ? '0' + eseconds : eseconds}</h1><span>s</span></span>
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
            <button className="e-stop" onClick={handleStart}>
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