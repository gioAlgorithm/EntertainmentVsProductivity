import React from "react";
import { FcGoogle } from "react-icons/fc";
import { RiFacebookFill } from "react-icons/ri";
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, updateProfile } from "firebase/auth";
import { auth } from "../utils/firebase";
import "./css/signin.css"

const SignIn = () => {

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
      <h1>Sign in</h1>
      <button onClick={GoogleLogin} className="google-button">
        <FcGoogle />
        <span> Sign in with Google</span>
      </button>
      <button onClick={FacebookLogin} className="facebook-button">
        <RiFacebookFill />
        <span> Sign in with Facebook</span>
      </button>
    </div>
  );
};

export default SignIn;