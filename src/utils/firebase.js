// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOXqh_RCeGxclvNAzpBKu2kTl3b_qV6MA",
  authDomain: "evsp-381701.firebaseapp.com",
  projectId: "evsp-381701",
  storageBucket: "evsp-381701.appspot.com",
  messagingSenderId: "299919906576",
  appId: "1:299919906576:web:170cbd012476cd4528b795",
  measurementId: "G-MJR0FD4RHZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app)
// Log a custom event to Firebase Analytics
export const Analytics = analytics
export const auth = getAuth()
