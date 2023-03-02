import React from "react"
import Entertaining from "./card/Entertaining"
import "./App.css"
import Productivity from "./card/Productivity"
import Balance from "./card/Balance"
import logo from './image/logo.png'

export default function App(){

  return(
    <div className="app">
        <div className="inner-app">
          <div className="navbar">
            <img alt="logo" src={logo}/>
          </div>
          <div className="app-content">
            <Entertaining />
            <h1 className="vs">VS</h1>
            <Productivity />
          </div>
          <div className="balance-container">
            <Balance />
          </div>
        </div>
    </div>
  )
}
