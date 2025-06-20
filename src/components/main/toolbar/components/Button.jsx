export const Button = ({firstInGroup, active, disabled, action, image, content, children}) => {
  /** Handle button action */
  const handleClicked = e =>{
      console.log("Button Clicked with message:", action)
  }

  /** Return early if the button is disabled */
  if(disabled) {
    return (
      <div 
      className={`button-container ${firstInGroup ? "first-in-group" : ""}`}>
        <div className={`button disabled ${image}`}>
          {content}
        </div>
        {
          children ? 
          <div className="children">{children}</div> :
          ""
        }
    </div>
    )
  }

  return (
    <div tabIndex="0"
      className={`button-container ${active ? "active" : ""} ${firstInGroup ? "first-in-group" : ""}`}
      onPointerUp={(typeof action === 'function') ? action : handleClicked}>
        <div className={`button ${image}`}>
          {content}
        </div>
        {
          children ? 
          <div className="children">{children}</div> :
          ""
        }
    </div>
  )
};