import React from "react"
import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import { TimerProvider } from "./context/TimerContext"

export default function SharedLayout(){
    return(
        <div>
            <TimerProvider>
                <Navbar />
                <Outlet />
            </TimerProvider>
        </div>
    )
}