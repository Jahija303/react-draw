import Toolbar from "./toolbar/Toolbar"
import Drawer from "./drawer/Drawer"
import SheetOptionsPopOver from "./sheetoptionspopover/SheetOptionsPopOver"
import SheetBox from "./sheetbox/SheetBox"
import ToastContainer from "./toast/ToastContainer"

export default function Screen() {
  return (
    <div id="screen">
      <Toolbar/>
      <div id="main">
        <Drawer/>
        <SheetBox/> 
      </div>
      <SheetOptionsPopOver/>
      <ToastContainer/>
    </div>
  )
}