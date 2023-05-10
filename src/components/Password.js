import React from "react"
// Import useState hook from react
import { AiOutlineEye,AiOutlineEyeInvisible } from "react-icons/ai";
import { useState, useRef } from "react";
import "./css/password.css"

// Input Password Component
export default function Password({setPassword ,password}) {
  // Initialize a boolean state
  const [passwordShown, setPasswordShown] = useState(false);
  // to handle password container focus
  const passwordRef = useRef(null);

  const handleFocus = () => {
    passwordRef.current.parentElement.classList.add('focus');
  };

  // Password toggle handler
  const togglePassword = () => {
    // Only show password toggle when there is input in the password field
    if (passwordRef.current.value.length > 0) {
      setPasswordShown(!passwordShown);
    }
  };

  return (
    <div className="password-container" onFocus={handleFocus}>
      <input className="password-input" type={passwordShown ? "text" : "password"} required placeholder="Password"  id="password" value={password} ref={passwordRef} onChange={(e) => setPassword(e.target.value)}/>
      {passwordRef.current && passwordRef.current.value.length > 0 &&
        <button className="password-hide" type="button" onClick={togglePassword}>{passwordShown ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}</button>
      }
    </div>
  );
}