import { useState, useEffect } from "react";
import { useRecoilValue, useSetRecoilState, useRecoilCallback } from 'recoil'
import Grid                                                                   from "../components/sheetoptions/Grid";
import Margins                                                                from "../components/sheetoptions/Margins"
import { 
  displayGridState, 
  displayMarginState, 
  pixelPerMilimiterState,
  baseToPixelSelector
} from "../../../../state/DisplayState";
import { dimensionsReducer, drawingAreaBoundsState } from "../../../../state/DocumentState";
import { standardPixeLPerMM } from "../../../../util/util.config"
import { baseToUnit } from "../../../../util/units";
import SelectionGroup                                                          from "./sheet/SelectionGroup";
import Elements from "./sheet/Elements";

export default function Sheet() {
  /** Global state values */
  const dimensions = useRecoilValue(dimensionsReducer)

  const displayGrid = useRecoilValue(displayGridState)
  const displayMargin = useRecoilValue(displayMarginState)
  const baseToPixel = useRecoilValue(baseToPixelSelector)
  const setPixelPerMilimiter = useSetRecoilState(pixelPerMilimiterState)

  /** Local state values */
  const [isSheetMoving, setIsSheetMoving] = useState(false)
  const [sheetBoxDimensions, setSheetBoxDimenions] = useState({top: 0, left: 0, width: 0, height: 0})
  const [pointerStartPosition, setPointerStartPosition] = useState({top: 0, left: 0})
  const [sheetPosition, setSheetPosition] = useState({top: 20, left: 20})

  useEffect(() => {
    const resolutionChangeListener = (e) => {
      setPixelPerMilimiter(window.devicePixelRatio * standardPixeLPerMM)
    }

    window.addEventListener("resize", resolutionChangeListener);
    return () => {
      window.removeEventListener("resize", resolutionChangeListener)
    }
  }, [setPixelPerMilimiter])

  const getDeskClientRect = useRecoilCallback(() => () => {
    return document.getElementById("desk").getBoundingClientRect();
  })

  /** This function re-calculates the area bounds
   * we need to call it each time the sheet component moves, since the drawingAreaBoundsState selector
   * depends on the sheet's getBoundingClientRect(), which is not a state we pass into it
   */
  const refreshSelectionBounds = useRecoilCallback(({refresh}) => () => {
    refresh(drawingAreaBoundsState)
  }, []);

  const moveSheet = (e) => {
    // do nothing if the sheet is not moving
    if(!isSheetMoving) {
      return
    }

    // accurate location of the pointer within the sheet enclosure
    const mouseInSheet = {
      x: e.clientX - sheetBoxDimensions.left,
      y: e.clientY - sheetBoxDimensions.top,
    }

    // handle edge cases, check if mouse is out of sheetbox
    if(mouseInSheet.x <= 1 || mouseInSheet.y <= 1) {
      setIsSheetMoving(false)
      return
    }

    if(mouseInSheet.x >= sheetBoxDimensions.width - 1 || mouseInSheet.y >= sheetBoxDimensions.height - 1) {
      setIsSheetMoving(false)
      return
    }

    // calculate the pointer location within the sheet
    const pointerInSheet = {
      top: mouseInSheet.y - sheetPosition.top,
      left: mouseInSheet.x - sheetPosition.left
    }

    // calculate the new position
    const newPosition = {
      top: sheetPosition.top + pointerInSheet.top - pointerStartPosition.top,
      left: sheetPosition.left + pointerInSheet.left - pointerStartPosition.left
    }

    if(newPosition.top !== sheetPosition.top || newPosition.left !== sheetPosition.left) {
      setSheetPosition({
        top: newPosition.top, 
        left: newPosition.left
      })
    }
  }

  const pointerDownHandler = (e) => {
    if(e.button === 0) {
      const {x, y, width, height} = getDeskClientRect()
      setSheetBoxDimenions({top: y, left: x, width: width, height: height})

      // calculate the initial pointer position from which the user holds the sheet
      const left = e.clientX - x
      const top = e.clientY - y
      setPointerStartPosition({top: top - sheetPosition.top, left: left - sheetPosition.left})

      // sheet is now moving, react to on pointer move event
      setIsSheetMoving(true)
    }
  }

  const pointerUpHandler = () => {
    setIsSheetMoving(false)
    refreshSelectionBounds()
  }

  /** Set the sheet style */
  const sheetStyle = {
    width: `${baseToUnit(dimensions.width, "mm") *  baseToPixel}px`,
    height: `${baseToUnit(dimensions.height, "mm") * baseToPixel}px`,
    top: sheetPosition.top,
    left: sheetPosition.left
  }

  return (
    <div 
    id="sheet" 
    style={sheetStyle}
    className={`${isSheetMoving ? "grabbing" : ""}`}
    onPointerDown={pointerDownHandler}
    onPointerMove={moveSheet}
    onPointerUp={pointerUpHandler}>
      { displayGrid ? <Grid/> : "" }
      { displayMargin ? <Margins/> : "" }

      <Elements />
      <SelectionGroup />
    </div>
  )
};