import React from "react";
import { FcGoogle } from "react-icons/fc";
import { RiFacebookFill } from "react-icons/ri";
import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, updateProfile } from "firebase/auth";
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword} from "firebase/auth";
import "./css/signin.css"
import Register from "./Register";





// sign in with email
const SignInWithEmail = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // massege for errors
  const [error, setError] = useState("");
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
    } catch (error) {
      const errorCode = error.code;
      if (errorCode === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (errorCode === 'auth/user-not-found') {
        setError('User does not exist');
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div className="sign-in-email-container">
      <form onSubmit={handleSignIn}>
        <input className="sign-in-email" placeholder="Email" type="email" id="email" value={email} required onChange={(e) => setEmail(e.target.value)}/>
        <input className="sign-in-password"  placeholder="Password" type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button className="sign-in-email-btn" type="submit">Sign In</button>
      </form>
      {alert &&
        <p className="alert-message">{error}</p>
      }
    </div>
  );
};



const SignIn = () => {
  //state to show up sign up container
  const [showSignUp, setShowSignUp] = useState(false);
  const handleSignUpClick = () => {
    setShowSignUp(true);
  };

  const handleSignUpClose = () => {
    setShowSignUp(false);
  };

  // sign in with google
  const googleProvider = new GoogleAuthProvider();
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result.user);
    } catch (error) {
      console.log(error);
    }
  };

  // sign in with facebook
  const fbProvider = new FacebookAuthProvider();
  const FacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, fbProvider);
      const credantial = await FacebookAuthProvider.credentialFromResult(result);
      const token = credantial.accessToken;
      let photoURL = result.user.photoURL + "?height=500&access_token=" + token;
      await updateProfile(auth.currentUser, { photoURL: photoURL });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="sign-in">
      {showSignUp &&
        <Register handleSignUpClose={handleSignUpClose} />
      }
      <h1>Sign in</h1>
      <SignInWithEmail />
      <button onClick={GoogleLogin} className="google-button">
        <FcGoogle />
        <span> Sign in with Google</span>
      </button>
      <button onClick={FacebookLogin} className="facebook-button">
        <RiFacebookFill />
        <span> Sign in with Facebook</span>
      </button>
      <div className="or"><p>or</p></div>
      <button className="register-btn" onClick={handleSignUpClick}>Register</button>
    </div>
  );
};

export default SignIn;