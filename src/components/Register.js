import React, {useState} from "react"
import { auth } from "../utils/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import "./css/register.css"

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
                <input className="register-nickname" required placeholder="Nickname" type="text" id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                <input className="register-email" required placeholder="Email" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="register-password" required placeholder="Password" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                
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