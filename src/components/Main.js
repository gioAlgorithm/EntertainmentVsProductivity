import React from "react"
import Entertaining from "../card/Entertaining"
import "./css/main.css"
import Productivity from "../card/Productivity"
import Balance from "../card/Balance"

export default function Main(){

    return(
      <div className="main">
          <div className="inner-main">
            
            <div className="main-content">
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