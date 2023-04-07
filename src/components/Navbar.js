import React, { useEffect, useState } from "react"
import jwt_decode from "jwt-decode"
import { LoginSocialFacebook } from "reactjs-social-login"
import { FaFacebookF } from "react-icons/fa";
import logo from '../image/logo.png'
import "./css/navbar.css"

export default function Navbar(){

    const [user, setUser] = useState({})

    function handleCallbackResponse(response){
        var userObject = jwt_decode(response.credential)
        setUser(userObject)
        console.log(userObject) // Add this line to log the Google data
    }

    function handleSignOut(event){
        setUser({})
       
    }

    useEffect(()=>{
        /* global google */
        if(typeof google !== 'undefined' && typeof google.accounts !== 'undefined' && typeof google.accounts.id !== 'undefined'){
            google.accounts.id.initialize({
                client_id: "299919906576-pfdoek5hbnqcrhdaho8n02s4olt6uovm.apps.googleusercontent.com",
                callback: handleCallbackResponse
            })
    
            if (Object.keys(user).length === 0) {
                google.accounts.id.renderButton(
                  document.getElementById("signInDiv"),
                  {
                    theme: "outline",
                    size: "medium",
                  }
                )
            }
        }
    }, [user])

    return(
        
        <div className="navbar">
            <img alt="logo" src={logo} className="logo"/>
            {Object.keys(user).length === 0 &&
                <div className="sign-in">
                    <div id="signInDiv"></div>
                    <LoginSocialFacebook 
                        appId="895324061700196"
                        
                        onResolve={(response) =>{
                            console.log(response)// Add this line to log the facebook data
                            setUser(response.data)
                        }}
                    >
                        <button className="facebook-button">
                            
                            <FaFacebookF /><span>Sign in with Facebook</span> 
                        </button>
                    </LoginSocialFacebook>
                </div>
            }
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