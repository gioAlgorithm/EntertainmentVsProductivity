import React, { useEffect, useState } from "react"
import jwt_decode from "jwt-decode"
import logo from '../image/logo.png'
import "./css/navbar.css"

export default function Navbar(){

    const [user, setUser] = useState({})

    function handleCallbackResponse(response){
        var userObject = jwt_decode(response.credential)
        setUser(userObject)
        document.getElementById("signInDiv").hidden = true
    }

    function handleSignOut(event){
        setUser({})
        document.getElementById("signInDiv").hidden = false
    }

    useEffect(()=>{
        /* global google */
        google.accounts.id.initialize({
            client_id: "299919906576-pfdoek5hbnqcrhdaho8n02s4olt6uovm.apps.googleusercontent.com",
            callback: handleCallbackResponse
        })

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            {theme: "outline", size:"medium"}
        )
    }, [])


    return(
        <div className="navbar">
            <img alt="logo" src={logo}/>
            <div id="signInDiv"></div>
            { Object.keys(user).length !== 0 &&
                <button onClick={(e)=> handleSignOut(e)}>sign out</button>

            }
            { Object.keys(user).length >= 1 &&
                <div>
                    <img alt="user" src={user.picture} />
                    <h3>{user.name}</h3>
                </div>
            }
        </div>
    )
}