import React, { useState, useEffect, useContext } from "react";
import { db, auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, query, orderBy} from "firebase/firestore";
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
  // history state where im storing last seven submited progress
  const [history, setHistory] = useState([]);

  // history state where im storing lifetime submissions
  const [totalHistory, setTotalHistory] = useState([])
  // Add a new state variable to hold the total time
  const [totalTime, setTotalTime] = useState(0);

  // submit state
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const {
          entertainmentStarted, setEntertainmentStarted, stoppedAtEntertainment, setStoppedAtEntertainment, 
          eseconds, setESeconds, eminutes, setEMinutes, ehours, setEHours, 
          edays, setEDays, setStartEntertainment, entertainmentTimerRef,productivityStarted
        } = useContext(TimerContext)


  
  // stop, start, reset logic

  function handleStart() {
    setEntertainmentStarted(true);
  }

  function handleToggleStop() {
    setStoppedAtEntertainment((prevStoppedAtState) => {
      if (prevStoppedAtState === null) {
        return Date.now();
      } else {
        setStartEntertainment(
          (prevStartTimeState) =>
            prevStartTimeState + (Date.now() - prevStoppedAtState)
        );
        return null;
      }
    });
  }

 
  // reset button confirmation container logic
  const handleReset = ()=>{
    if(entertainmentStarted || eseconds >= 1 || eminutes >= 1 || ehours >= 1 || edays>= 1){
      setShowConfirm(true)
    }
  }

  const handleConfirmReset = ()=>{
    setEMinutes(0)
    setESeconds(0)
    setEHours(0)
    setEDays(0)
    setEntertainmentStarted(false);
    setStoppedAtEntertainment(null);
    clearInterval(entertainmentTimerRef.current);
    setShowConfirm(false)
  }

  const handleCancelReset = () =>{
    setShowConfirm(false)
  }

  // submit button logic

  const submitEntertainmentProgress = async (cardName) => {
    if (entertainmentStarted || eseconds >= 1 || eminutes >= 1 || ehours >= 1 || edays >= 1) {
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
        setEntertainmentStarted(false)
  
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
      const historySnapshot = await getDocs(query(historyRef, orderBy("timestamp", "desc")));
  
      const historyData = historySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      
      // Slice the historyData array to keep only the last seven items
      const lastSevenHistory = historyData.slice(0, 7);
      
      setHistory(lastSevenHistory);
      // storing lifetime history to calculate total time
      setTotalHistory(historyData);
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

  // calculate total time 
  useEffect(() => {
    const calculateTotalTime = () => {
      let totalSeconds = 0;
  
      totalHistory.forEach((item) => {
        const timeParts = item.time.split(" ");
        timeParts.forEach((part) => {
          if (part.endsWith("d")) {
            const days = parseInt(part.slice(0, -1));
            totalSeconds += days * 24 * 60 * 60;
          } else if (part.endsWith("h")) {
            const hours = parseInt(part.slice(0, -1));
            totalSeconds += hours * 60 * 60;
          } else if (part.endsWith("m")) {
            const minutes = parseInt(part.slice(0, -1));
            totalSeconds += minutes * 60;
          } else if (part.endsWith("s")) {
            const seconds = parseInt(part.slice(0, -1));
            totalSeconds += seconds;
          }
        });
      });
  
      setTotalTime(totalSeconds);
    };
  
    calculateTotalTime();
  }, [totalHistory]);
  const formatTotalTime = (totalSeconds) => {
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;
  
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };
  function formatTotalTimeInHours(totalTime) {
    const hours = Math.floor(totalTime / 3600);
    return `${hours}h`;
  }
  
  function formatTotalTimeInMinutes(totalTime) {
    const minutes = Math.floor(totalTime / 60);
    return `${minutes}m`;
  }

  
  const handleSubmit = async () => {
    // to prevent multiple submiting by user!
    if ( isSubmitting || entertainmentStarted || eseconds >= 1 || eminutes >= 1 || ehours >= 1 || edays >= 1) {
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
    if(entertainmentStarted && eseconds < 1 && eminutes < 1 && ehours < 1 && edays < 1){
      setEntertainmentStarted(false)
    }
      setStartEntertainment(null)
      setStoppedAtEntertainment(null)
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
            <p>{formatTotalTime(totalTime)}</p>
          </div>
          <div className="e-total-time-hr">
            <h1 className="e-total-time-title-hr">Total Time in hr</h1>
            <p>{formatTotalTimeInHours(totalTime)}</p>
          </div>
          <div className="e-total-time-min">
            <h1 className="e-total-time-title-min">Total Time in min</h1>
            <p>{formatTotalTimeInMinutes(totalTime)}</p>
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
          {entertainmentStarted ? (
            <button className="e-stop" onClick={handleToggleStop} disabled={productivityStarted === true}>
              {!stoppedAtEntertainment ? (
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
            <button className="e-stop" onClick={handleStart} disabled={productivityStarted === true}>
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