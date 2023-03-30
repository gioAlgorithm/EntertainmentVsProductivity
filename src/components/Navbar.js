import React from "react"
import logo from '../image/logo.png'
import "./css/navbar.css"

export default function Navbar(){
    return(
        <div className="navbar">
            <img alt="logo" src={logo}/>
        </div>
    )
}