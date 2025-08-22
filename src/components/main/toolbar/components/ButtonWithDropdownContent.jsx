import { useReducer } from "react";

export default function ButtonWithDropdownContent({firstInGroup, disabled, contentArray, currentContentState}) {
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

  /** Dropdown item clicked, change default value and close the dropdown */
  const handleDropdownItemClick = (action) => {
    typeof action === 'function' ? action() : console.log(action)
    dispatchDropdownStatus({type: "close"})
  }

  /** Return early if the button is disabled or the contentArray is empty
  */
  if(disabled || !contentArray) {
    return (
      <div 
      className={`dropdown content disabled ${firstInGroup ? "first-in-group" : ""}`}>
        <div className="dropdown-header">
          <div className={`button default`}>
              {
                !contentArray ? "Error" : currentContentState
              }
          </div>
          <div className={`dropdown-button drop-down-black`}></div>
        </div>
      </div>
    )
  }

  /** Generate dropdown list */
  const getDropdownList = () => {
    return contentArray.map((content, index) => {
      return (
        <div
          key={`${content.value}-${index}`} 
          className="button" 
          onPointerDown={() => handleDropdownItemClick(content.action)}>
            {content.value}
        </div>
      )
    })
  }

  return (
    <div 
      className={`dropdown content ${firstInGroup ? "first-in-group" : ""}`}
      tabIndex="0" 
      onBlur={() => dispatchDropdownStatus({type: "close"})}>
        <div 
          className="dropdown-header"
          onPointerDown={() => dispatchDropdownStatus({type: "toggle"})}>
          <div className={`button default`}>
              {currentContentState}
          </div>
          <div className={`dropdown-button drop-down-black`}>
          </div>
        </div>
        {
          isOpen ?
          <div className="dropdown-list">
            {
              getDropdownList()
            }
          </div>
          : ""
        }
    </div>
  )
}