import React,{useEffect,useRef,useState} from "react"
import Entertaining from "../card/Entertaining"
import { auth } from "../utils/firebase"
import {useAuthState} from "react-firebase-hooks/auth"
import { TiWarning } from "react-icons/ti";
import { AiOutlineClose } from "react-icons/ai";
import "./css/main.css"
import "./css/warning.css"
import Productivity from "../card/Productivity"
import Balance from "../card/Balance"

export default function Main(){
    // warning container if user is not signed in
    const [showSignInWarning, setShowSignInWarning] = useState(false);
    const [user] = useAuthState(auth);
    let warnRef = useRef()

    // pop up warning container whenever time runs out
    useEffect(() => {
      const timer = setTimeout(() => {
        if (!user) {
          setShowSignInWarning(true);
        }
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }, [user]);
    // detecting outside click of warning container
    useEffect(()=>{
      let handler = (event) =>{
          if(!warnRef.current.contains(event.target)){
              setShowSignInWarning(false)
          }
      }


      document.addEventListener("mousedown", handler)

      return ()=>{
          document.removeEventListener("mousedown", handler)
      }
    })
    // rendering warning contaner
    const renderSignInWarning = () => {
      
      
      return (
        <div ref={warnRef} className="warning-container" onClick={()=> {setShowSignInWarning(false)}}>
          <div className="sign-in-warning-container">
            <h3><TiWarning />WARNING! </h3>
            <span className="warning-close"><AiOutlineClose /></span>
            <p>
              Your progress will not be saved unless you sign in. 
              Sign in now to save your progress!
            </p>
          </div>
        </div>
      );
    };


    // main return
    return(
      <div className="main">
        { showSignInWarning && renderSignInWarning()}
          <div className="inner-main">
            
            <div className="main-content">
              <Entertaining setShowSignInWarning={setShowSignInWarning}/>
              <h1 className="vs">VS</h1>
              <Productivity setShowSignInWarning={setShowSignInWarning} />
            </div>
            <div className="balance-container">
              <Balance />
            </div>
          </div>
          <p className="copyright">Copyright © 2023 GioAlgorithm All Rights Reserved.</p>
      </div>
    )
  }