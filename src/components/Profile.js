import React from "react";
import { useRef, useEffect,useState } from "react";
import { auth } from "../utils/firebase";
import { FaAngleUp } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import "./css/profile.css"

export default function Profile({ user }) {
    console.log(user.photoURL)
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

  const signOut = () => {
    auth.signOut();
  }

  return (
    <div className="profile">
        <div onClick={toggleDropdown} ref={menuRef} className={`inner-profile ${dropdown ? "inner-profile-active" : ""}`}>
            <img className="profile-image" alt="profile" src={user.photoURL ? user.photoURL : <span className="profile-img-logo"><CgProfile /></span>} />
            <FaAngleUp className="profile-select-icon" />
            {dropdown &&
                <div className="profile-dropdown">
                    <h5>Signed in as</h5>
                    <h1 className="profile-name">{user.displayName.split(" ")[0]}</h1>
                    <Link to="/profile">Profile</Link>
                    <button onClick={signOut}>Sign Out</button>
                </div>
            }
        </div>
    </div>
  );
}