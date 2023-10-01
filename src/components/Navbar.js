import React, {useState, useRef, useEffect} from "react"
import {useAuthState} from "react-firebase-hooks/auth"
import { FaAngleUp } from "react-icons/fa";
import {auth} from "../utils/firebase"
import logo from "../image/logo.png"
import MiniLogo from "../image/logo-mobile.png"
import "./css/navbar.css"
import SignIn from "./SignIn";
import Profile from "./Profile";
import { Link } from "react-router-dom";

export default function Navbar(){

    const [user] = useAuthState(auth)

    //dropdown of select
    const [dropdown, setDropdown] = useState(false)

    const toggleDropdown = () =>{
        setDropdown((state) => !state)
    }

    // detecting outside click
    let menuRef = useRef()

    useEffect(()=>{
        let handler = (event) =>{
            if(!menuRef.current.contains(event.target)){
                setDropdown(false)
            }
        }


        document.addEventListener("mousedown", handler)

        return ()=>{
            document.removeEventListener("mousedown", handler)
        }
    })

    return(
        
        <div className="navbar">
            <div>
                <div className="hover">
                    <span>?</span>
                    <h1>⏰ Time Tracker</h1>
                    <p>You get to decide if you want to do something productive or have fun. Just hit a button and start the timer for "Focus" or "Fun" – easy peasy!</p>

                    <h1>⚖️ Balancing Act</h1>
                    <p>Here's where the magic happens. We add up your productive moments and your playtime. If playtime takes over, we nudge you to do a bit more work. If it's the other way around, we remind you to take a break!</p>

                    <h1>🎉 Change It Up</h1>
                    <p>
                        Say bye-bye to feeling bad about having fun. With "Fun vs Focus," you're in charge of your story. Get ready for awesome accomplishments and really cool memories.
                        Ready to rock a balanced, exciting life? Join the fun and start your adventure now!
                    </p>
                </div>
            </div>
            <div>
                <Link className="mini-logo"  to="/"><img alt="logo" src={MiniLogo} /></Link>
                <Link className="logo-container" to="/"><img alt="logo" src={logo} /></Link>
            </div>
            {user === null &&
                <div ref={menuRef} className={`select ${dropdown ? "select-active" : ""}`}>
                    <button onClick={toggleDropdown} className="select-button">Sign in {<FaAngleUp className="select-icon" />}</button>
                    {dropdown &&
                        (<div className="select-dropdown">
                            <SignIn />
                        </div>)
                    } 
                </div>
            }
            {user &&
                <Profile user={user} />
            }
        </div>
    )
}