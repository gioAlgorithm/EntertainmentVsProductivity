import "./card css/p-card.css"
import { db, auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { TbPlayerPause } from "react-icons/tb";
import {BsFillPlayFill} from "react-icons/bs"
import React, { useState, useEffect, useContext } from "react";
import { TimerContext } from "../context/TimerContext";



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

    // reset confirmation state
    const [showConfirm, setShowConfirm] = useState(false);
    // history state
    const [history, setHistory] = useState([]);
    // submit state
    const [isSubmitting, setIsSubmitting] = useState(false); 

    const {
            productivityStarted, setProductivityStarted, stoppedAtProductivity, setStoppedAtProductivity, 
            pseconds, setPSeconds, pminutes, setPMinutes, phours, setPHours, 
            pdays, setPDays, setStartProductivity, productivityTimerRef,entertainmentStarted
          } = useContext(TimerContext)
   

    // stop, start, reset logic
  
    function handleStart() {
      setProductivityStarted(true)
    }

    function handleToggleStop() {
      setStoppedAtProductivity((prevStoppedAtState) => {
        if (prevStoppedAtState === null) {
          return Date.now();
        } else {
          setStartProductivity(
            (prevStartTimeState) =>
              prevStartTimeState + (Date.now() - prevStoppedAtState)
          );
          return null;
        }
      });
    }

   
    // reset button confirmation container logic
    const handleReset = ()=>{
      if(productivityStarted || pseconds >= 1 || pminutes >= 1 || phours >= 1 || pdays>= 1){
        setShowConfirm(true)
      }
    }

    const handleConfirmReset = ()=>{
      setPMinutes(0)
      setPSeconds(0)
      setPHours(0)
      setPDays(0)
      setProductivityStarted(false);
      setStoppedAtProductivity(null);
      clearInterval(productivityTimerRef.current);
      setShowConfirm(false)
    }

    const handleCancelReset = () =>{
      setShowConfirm(false)
    }

    // submit button logic

    const submitProductivityProgress = async (cardName) => {
      if (productivityStarted || pseconds >= 1 || pminutes >= 1 || phours >= 1 || pdays >= 1) {
        const timestamp = new Date().getTime(); // Get the current timestamp
        let currentTime = "";
        
        if (pdays > 0) {
          currentTime += `${pdays < 10 ? "0" + pdays : pdays}d `;
        }
        
        if (phours > 0) {
          currentTime += `${phours < 10 ? "0" + phours : phours}h `;
        }
        
        if (pminutes > 0) {
          currentTime += `${pminutes < 10 ? "0" + pminutes : pminutes}m `;
        }
        
        if (pseconds > 0) {
          currentTime += `${pseconds < 10 ? "0" + pseconds : pseconds}s`;
        }
    
        try {
          const user = auth.currentUser;
          const uid = user.uid;
          const docRef = await addDoc(collection(db, "users", uid, "pHistory"), {
            card: cardName,
            time: currentTime,
            timestamp: timestamp // Include the timestamp field in the document data
          });
    
          // Fetch the updated history data from Firestore
          fetchHistory();
    
          // Reset the timer values
          setPMinutes(0);
          setPSeconds(0);
          setPHours(0);
          setPDays(0);
          setProductivityStarted(false)
    
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
        const historyRef = collection(db, "users", uid, "pHistory");
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
      if ( isSubmitting || productivityStarted || pseconds >= 1 || pminutes >= 1 || phours >= 1 || pdays >= 1) {
        try {
          setIsSubmitting(true); // Disable the submit button
    
          // Disable the submit button immediately
          const submitButton = document.querySelector(".p-submit");
          submitButton.disabled = true;
    
          await submitProductivityProgress("productivity");
    
          // Re-enable the submit button after submission is completed
          submitButton.disabled = false;
          setIsSubmitting(false); // Update submission status
        } catch (error) {
          console.error("Error submitting timer progress:", error);
          setIsSubmitting(false); // Update submission status in case of error
        }
      }
      if(productivityStarted && pseconds < 1 && pminutes < 1 && phours < 1 && pdays < 1){
        setProductivityStarted(false)
      }
      setStartProductivity(null)
      setStoppedAtProductivity(null)
    };
    



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
                    {history.map((item) => (
                      <li key={item.id}> {item.time} </li>
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
                  <button className="p-restart" onClick={handleReset}>
                    Reset
                  </button>
                  {productivityStarted ? (
                    <button className="p-stop" onClick={handleToggleStop} disabled={entertainmentStarted === true}>
                      {!stoppedAtProductivity ? (
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
                    <button className="p-stop" onClick={handleStart} disabled={entertainmentStarted === true}>
                      Start <BsFillPlayFill />
                    </button>
                  )}
                  <button className="p-submit" onClick={handleSubmit}>
                    Submit
                  </button>
                </div>
            </div>
        </div>
    )
}