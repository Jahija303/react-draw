import { useState, useEffect } from "react";
import Button from "./Button";

export default function FullscreenButton() {
  const [fullscreen, updateFullscreen] = useState( false)

  /** Set the fullscreen based on app interaction */
  useEffect(() => {
    if(fullscreen){
        document.documentElement.requestFullscreen()
    }else{
      if(document.fullscreenElement){
        document.exitFullscreen()
      }
    }
  }, [fullscreen])

  /** When we enter/exit fullscreen the window size changes
    Not all user interactions to enter/exit fullscreen get caught with a document.addEventListener("fullscreenchange",...) 
  */
  useEffect(() => {
    const fullscreenChange = (e) => {
      // if the window uses almost all of the screen height, we are in assume fullscreen
      const fullScreenNow = Math.abs(window.screen.height-window.innerHeight)<2

      if (fullScreenNow !== fullscreen){
        if(!fullscreen){
          enterFullscreen()
        } 
      }else{
        if(!fullscreen){
          exitFullscreen()
        } 
      }
    }

    window.addEventListener("resize", fullscreenChange);
    return () => {
      window.removeEventListener("resize", fullscreenChange)
    }
  }, [fullscreen])

  const enterFullscreen = () =>{ updateFullscreen(current => true)}
  const exitFullscreen = () =>{ updateFullscreen(current => false)}
  return (
    <div className="fullscreen">
      {fullscreen ?
        <Button image="fullscreen-exit" action={exitFullscreen} /> :  
        <Button image="fullscreen-enter" action={enterFullscreen} />  
      }      
    </div>
  )
}