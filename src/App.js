import React from "react"
import { Route, Routes } from "react-router-dom"
import Main from "./components/Main"
import SharedLayout from "./SharedLayout"

import "./App.css"



export default function App(){

  return(
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        <Route index element={<Main />}/>
      </Route>
    </Routes>
  )
}
