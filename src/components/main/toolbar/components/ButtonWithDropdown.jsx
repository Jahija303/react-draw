import { useState, useReducer } from "react";

export default function ButtonWithDropdown({firstInGroup, disabled, buttons}) {
  /** Set the default button state */
  const [defaultButton, setDefaultButton] = useState(0)

  const dropdownReducer = (isOpen, action) => {
    switch(action.type) {
      case "toggle":
        return !isOpen
      case "close":
        return false
      default:
        return
    }
  }

  /** State of the dropdown toggle */
  const [isOpen, dispatchDropdownStatus] = useReducer(dropdownReducer, false)

  /** Handle button action */
  const handleButtonAction = () => {
    console.log(buttons[defaultButton].action)
  }

  /** Dropdown item clicked, change default button and close the dropdown */
  const handleUpdateDefaultButton = (index) => {
    setDefaultButton(index)
    dispatchDropdownStatus({type: "close"})
  }

  /** Return early if the button is disabled */
  if(disabled) {
    return (
      <div 
        className={`button disabled ${buttons[defaultButton].image} ${firstInGroup ? "first-in-group" : ""}`}>
      </div>
    )
  }

  return (
    <div tabIndex="0" onBlur={()=>dispatchDropdownStatus({type: "close"})} className={`dropdown ${firstInGroup ? "first-in-group" : ""}`}>
      <div className="dropdown-header">
        <div className={`button default ${buttons[defaultButton].image}`} 
          onPointerDown={handleButtonAction}>
        </div>
        <div className="button toggle-dropdown" 
          onPointerDown={()=>dispatchDropdownStatus({type: "toggle"})}>
        </div>
      </div>
      {
        isOpen ?
        <div className="dropdown-list">
          {
            buttons.map((button, index) => {
              return (
                <div 
                  key={index} 
                  className={`button ${button.image}`} 
                  onPointerDown={() => handleUpdateDefaultButton(index)}>
                </div>
              )
            })
          }
        </div>
        : ""
      }
    </div>
  )
};