import React, {useState} from "react"
import { auth } from "../utils/firebase";
import "./css/register.css"

export default function Register({handleSignUpClose}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
        const { user } = await auth.createUserWithEmailAndPassword(email, password);
        await user.updateProfile({ displayName: displayName });
        console.log(user);
        } catch (error) {
        console.log(error);
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
            <div className="register-or"><p>or</p></div>
            <button className="register-close" onClick={handleSignUpClose}>Sign In</button>
        </div>
    )
}