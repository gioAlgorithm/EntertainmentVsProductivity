import React,{useContext, useState, useEffect} from "react"
import { TimerContext } from "../context/TimerContext";
import "./card css/b-card.css"

export default function Balance(){


    const {totalTimeE,totalTimeP} = useContext(TimerContext)
    const [displayText, setDisplayText] = useState("");

    // formating time to display like: 1hr 10sec instead of 3610 sec
    const formatTime = (seconds) => {
        let days = Math.floor(seconds / (24 * 60 * 60));
        let hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
        let minutes = Math.floor((seconds % (60 * 60)) / 60);
        let remainingSeconds = seconds % 60;
      
        let timeString = "";
      
        if (days > 0) timeString += `${days} day${days > 1 ? "s" : ""} `;
        if (hours > 0 || timeString !== "") timeString += `${hours} hr `;
        if (minutes > 0 || timeString !== "") timeString += `${minutes} min `;
        if (remainingSeconds > 0 || timeString === "") timeString += `${remainingSeconds} sec`;
      
        return timeString.trim();
    };

    useEffect(() => {
      let newDisplayText = "";

      if (totalTimeE > totalTimeP) {
        newDisplayText =
          entertainmentText[Math.floor(Math.random() * entertainmentText.length)];
      } if (totalTimeP > totalTimeE) {
        newDisplayText =
            productivityText[Math.floor(Math.random() * productivityText.length)];
      } if(totalTimeP === totalTimeE){
        newDisplayText =
            equalText[Math.floor(Math.random() * equalText.length)];
      } if(totalTimeP === 0 && totalTimeE === 0){
        newDisplayText =
            noTimeText[Math.floor(Math.random() * noTimeText.length)];
      }

      setDisplayText(newDisplayText);
      
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalTimeP, totalTimeE]);

    const entertainmentText = [
        <p><span>{formatTime(totalTimeE - totalTimeP)}</span> has been dedicated to entertainment. While it's important to relax, let's make sure to keep productivity in mind. Consider spending some time on learning, creating, or completing a task that brings you closer to your goals.</p>,
        <p>Your entertainment time has been <span>{formatTime(totalTimeE - totalTimeP)}</span>. Finding time to unwind is essential, but don't forget about your personal growth. How about investing some time in self-improvement activities like reading, studying, or developing new skills?</p>,
        <p>You've dedicated <span>{formatTime(totalTimeE - totalTimeP)}</span> to entertainment. Remember to take breaks and recharge, but also consider investing some time in activities that enhance your personal growth and learning.</p>,
        <p>You've spent <span>{formatTime(totalTimeE - totalTimeP)}</span> on entertainment. It's great to unwind, but remember to balance it with productivity. Why not pick up a book, learn something new, or work on a personal project?</p>,
        <p>Your entertainment time adds up to <span>{formatTime(totalTimeE - totalTimeP)}</span>. Enjoy your leisure activities, but don't forget to balance it with productive pursuits. Take the opportunity to engage in hobbies, explore new interests, or relax with a good book.</p>,
        <p>You've spent <span>{formatTime(totalTimeE - totalTimeP)}</span> on entertainment. It's important to unwind and have fun, but also remember to prioritize your goals. Consider allocating some time for activities that help you progress towards your aspirations.</p>
    ]

    const productivityText = [
        <p>You've been productive for <span>{formatTime(totalTimeP - totalTimeE)}</span>! Fantastic job! Now you can reward yourself with some leisure activities. Enjoy playing games, pursuing your hobbies, or indulging in activities that bring you joy and relaxation.</p>,
        <p>Your productivity time totals <span>{formatTime(totalTimeP - totalTimeE)}</span>. Well done! Now it's time to take a break and engage in activities you love. Unwind by playing games, exploring your hobbies, or spending time on things that recharge your energy.</p>,
        <p>Great work! You've dedicated <span>{formatTime(totalTimeP - totalTimeE)}</span> to being productive. Now, it's important to strike a balance. Treat yourself to some leisure activities like gaming, pursuing your hobbies, or simply enjoying a well-deserved break.</p>,
        <p>You've been productive for <span>{formatTime(totalTimeP - totalTimeE)}</span>! Well done! Now it's time to reward yourself with some leisure activities. Engage in your favorite hobbies, spend time with loved ones, or simply relax and enjoy the fruits of your labor.</p>,
        <p>Your productivity time totals <span>{formatTime(totalTimeP - totalTimeE)}</span>. Excellent job! It's essential to take breaks and recharge. Use this time to indulge in activities that bring you joy, whether it's playing games, pursuing creative endeavors, or enjoying quality leisure.</p>,
        <p>Great work! You've dedicated <span>{formatTime(totalTimeP - totalTimeE)}</span> to being productive. Remember, it's important to strike a balance. Treat yourself to some leisure activities like gaming, pursuing hobbies, or simply unwinding with activities that bring you happiness and relaxation.</p>
    ]
    // whenever totalTimeP and totalTimeE values are the same
    const equalText = [
        <p>You have spent an <strong>equal</strong> amount of time on productivity and leisure activities. Maintaining a balance between work and relaxation is important for your overall well-being. Keep up the good work and continue dedicating time to both productive tasks and activities that bring you joy and happiness.</p>
    ]
    // whenever titalTimeP and totalTimeE equals zero
    const noTimeText = [
        <p>You haven't dedicated any time to either productivity or entertainment. It's important to find a balance between work and leisure. Consider setting aside time for both productive tasks and activities that bring you joy and relaxation. Start tracking your time and enjoy a well-rounded lifestyle!</p>
    ]
    
        

    return(
        <div className="balance-card">
            <h1 className="balance-title">Balance</h1>
            <div className="inner-balance">
                <div className="encourage-text">
                    {displayText}
                </div>
                <div className="balance-animation-container">

                </div>
            </div>
        </div>
    )
}