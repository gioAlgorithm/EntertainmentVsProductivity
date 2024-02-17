import React from "react"
import "./css/profilePage.css"
import Eachievement from "../card/Eachievement"
import Pachievement from "../card/Pachievement"
import Machievement from "../card/Machievement"

export default function ProfilePage(){
    return(
        <div className="profile-page-container">
            <div className="inner-profile-page">
                <div className="profile-page-content">
                    <Eachievement />
                    <Pachievement />
                </div>
                <div className="profile-page-m-achievement">
                    <Machievement />
                </div>
                
            </div>
            <p className="copyright">Copyright © 2024 Giorgi Machitadze All Rights Reserved.</p>
        </div>
    )
}