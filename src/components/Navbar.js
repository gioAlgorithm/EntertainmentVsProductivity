import React, {useState, useRef, useEffect} from "react"
import {useAuthState} from "react-firebase-hooks/auth"
import { FaAngleUp } from "react-icons/fa";
import {auth} from "../utils/firebase"
import logo from "../image/logo.png"
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
            <Link to="/"><img alt="logo" src={logo} className="logo"/></Link>
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