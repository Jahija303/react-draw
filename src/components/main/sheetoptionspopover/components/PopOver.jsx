export const PopOver = ({children, setVisible}) => {
  return (
    <div id="pop-over">
      <div className="container">
        <div className="button close" onPointerDown={() => setVisible(false)}></div>
          {children}
      </div>
    </div>
  )
};