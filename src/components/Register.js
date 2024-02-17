import React, {useState} from "react"
import { auth } from "../utils/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import "./css/register.css"
import Password from "./Password";

export default function Register({handleSignUpClose}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    // massege for errors
    const [message, setMessage] = useState("");

    const handleSignUp = async (e) => {
      e.preventDefault();
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName });
        console.log(user);
      } catch (error) {
        console.log(error);
        if (error.code === "auth/email-already-in-use") {
          setMessage("User already exists");
        }
      }
    };
    return(
        <div className="register-container">
            <h1 className="register-title">Register</h1>
            <form onSubmit={handleSignUp}>
                <div className="register-nickname">
                  <input required placeholder="Nickname" type="text" id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div className="register-email">
                  <input required placeholder="Email" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <Password setPassword = {setPassword} password ={password} />
                
                <button className="sign-up-button" type="submit">Sign Up</button>
            </form>
            {message &&
              <p className="alert-message">{message}</p>
            }
            <div className="register-or"><p>or</p></div>
            <button className="register-close" onClick={handleSignUpClose}>Sign In</button>
        </div>
    )
}