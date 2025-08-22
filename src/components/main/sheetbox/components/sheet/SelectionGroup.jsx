import { useState } from "react";
import { useRecoilValue, useSetRecoilState, useRecoilCallback, useRecoilState, useRecoilTransaction_UNSTABLE } from "recoil"
import { 
  selectionBoundingBox, 
  selectedElementsSelector, 
  displaySelectionGroupState,
  isSelectionMovingState,
  mouseInBoundingBoxState,
  elementFamily
} from "../../../../../state/ElementState"
import { drawingAreaBoundsState } from "../../../../../state/DocumentState";
import { emptyGif } from "../../../../../util/util.config";
import { DEFAULT_ELEMENT_STATE } from "../../../../../util/util.config";

export default function SelectionGroup() {
  /** Global state */
  const displayGroupSelection = useRecoilValue(displaySelectionGroupState)
  const {top, left, width, height} = useRecoilValue(selectionBoundingBox)
  const selectedElements = useRecoilValue(selectedElementsSelector)
  const dispatchSelectedElement = useSetRecoilState(selectedElementsSelector)
  const [isSelectionMoving, setIsSelectionMoving] = useRecoilState(isSelectionMovingState)
  const [mouseInBoundingBox, setMouseInBoundingBox] = useRecoilState(mouseInBoundingBoxState)

  const [resizing, setResizing] = useState(false);

  /** The sheet element */
  const sheetElement = document.getElementById("sheet")

  /** Get the area bounds value
   * we use the useRecoilCallback hook to fetch the data because the sheet component is not completely rendered
   * before this component. This callback simply gets a snapshot (current state value) of the needed data
   * each time it is accessed.
   */
  const getAreaBounds = useRecoilCallback(({snapshot}) => () => {
    return snapshot.getLoadable(drawingAreaBoundsState).contents
  })

  const updateSelectedElements = useRecoilTransaction_UNSTABLE(({get, set}) => (action) => {
    switch(action.type) {
      case "move_elements":
        selectedElements.forEach(id => {
          const element = get(elementFamily(id))
          set(elementFamily(id), {...element, position: {
            x: element.position.x - action.changex,
            y: element.position.y - action.changey,
          }})
        })
        break;
      case "resize_elements":
        selectedElements.forEach(id => {
          const element = get(elementFamily(id))
          if(
            element.dimensions.width * action.change >= DEFAULT_ELEMENT_STATE.dimensions.minWidth ||
            element.dimensions.height * action.change >= DEFAULT_ELEMENT_STATE.dimensions.minHeight
          ) {
            set(elementFamily(id), {...element, 
              dimensions: {
                width: element.dimensions.width * action.change,
                height: element.dimensions.height * action.change,
              }
            })
          }
        })
        break;
      default:
        break;
    }
  })

  const moveSelection = (e) => {
    e.stopPropagation()
    e.preventDefault()

    // Do nothing if the selection is not moving
    if(!isSelectionMoving) {
      return
    }    

    // Get the sheet element and calculate the mouse position on the sheet
    const mouseInSheet = {
      x: e.clientX - sheetElement.getBoundingClientRect().left,
      y: e.clientY - sheetElement.getBoundingClientRect().top
    }

    // Get the x and y limits for the selection
    const areaBounds = getAreaBounds()

    // Handle edge case where mouse is off the selection
    if(
      mouseInSheet.x < areaBounds.left || 
      mouseInSheet.y < areaBounds.top || 
      mouseInSheet.x >= areaBounds.right - 2 || 
      mouseInSheet.y >= areaBounds.bottom - 2) {
        setIsSelectionMoving(false)
        return
    }

    // handle edge cases, check if mouse is out of sheetbox
    if(mouseInSheet.x <= 1 || mouseInSheet.y <= 1) {
      setIsSelectionMoving(false)
      return
    }

    // Bounding box must be within bounds defined by the current selected area
    if(mouseInSheet.x - mouseInBoundingBox.x < areaBounds.left) {
      mouseInSheet.x = areaBounds.left + mouseInBoundingBox.x
    }
    if(mouseInSheet.y - mouseInBoundingBox.y < areaBounds.top) {
      mouseInSheet.y = areaBounds.top + mouseInBoundingBox.y
    }
    if(mouseInSheet.x + (width - mouseInBoundingBox.x) > areaBounds.right) {
      mouseInSheet.x = areaBounds.right - (width - mouseInBoundingBox.x)
    }
    if(mouseInSheet.y + (height - mouseInBoundingBox.y) > areaBounds.bottom) {
      mouseInSheet.y = areaBounds.bottom - (height - mouseInBoundingBox.y)
    }

    // Always create a new boundingBox with the most appropriate valid coordinates given the current mouse position
    // Calculate the NEW bounding box of the selected elements
    const newBoundingBox = {
      top: mouseInSheet.y - mouseInBoundingBox.y,
      left: mouseInSheet.x - mouseInBoundingBox.x,
      bottom: mouseInSheet.y - mouseInBoundingBox.y + height,
      right: mouseInSheet.x - mouseInBoundingBox.x + width
    }

    // Calculate the amount of pixels the bounding box needs to be moved
    const change = {
      x: left - newBoundingBox.left,
      y: top - newBoundingBox.top
    }
    
    if(change.x !== 0 || change.y !== 0) {
      updateSelectedElements({type: "move_elements", changex: change.x, changey: change.y})
    }
  }

  const pointerUpHandler = (e) => {
    setIsSelectionMoving(false)
    e.stopPropagation()
  }

  const pointerDownHandler = (e) => {
    e.stopPropagation()
    setIsSelectionMoving(true)

    /** Check if the dom element under the pointer is one of the Element components
     * if it as (and CTRL is held while clicking) select the element
     * and do not move the selection
     */
    const elementsUnderPointer = document.elementsFromPoint(e.clientX, e.clientY)
    const element = elementsUnderPointer.filter(el => el.className === "element")[0]
    if(element) {
      if(e.ctrlKey) {
        const elementId = Number(element.id.substring(3))
        dispatchSelectedElement({type: "toggle", id: elementId})
        setIsSelectionMoving(false)
      }
    }

    const mouseInSheet = {
      x: e.clientX - sheetElement.getBoundingClientRect().left,
      y: e.clientY - sheetElement.getBoundingClientRect().top
    }
    setMouseInBoundingBox({x: mouseInSheet.x - left, y: mouseInSheet.y - top})
  }

  const startResizing = (e) => {
    setResizing(true)
    e.dataTransfer.setDragImage(emptyGif, 0, 0)
  }

  const resizeIt = (e) => {
    if(!resizing) {
      return
    }

    // Calculate the mouse position on the sheet
    const mouseInSheet = {
      x: e.clientX - sheetElement.getBoundingClientRect().left,
      y: e.clientY - sheetElement.getBoundingClientRect().top
    }

    // Get the x and y limits for the selection
    const areaBounds = getAreaBounds()

    // Handle edge case where mouse is off the bounds
    if(
      mouseInSheet.x < areaBounds.left || 
      mouseInSheet.y < areaBounds.top || 
      mouseInSheet.x >= areaBounds.right - 2 || 
      mouseInSheet.y >= areaBounds.bottom - 2) {
        setResizing(false)
        return
    }

    // Handle edge cases, check if mouse is out of sheetbox
    if(mouseInSheet.x <= 0 || mouseInSheet.y <= 0) {
      setResizing(false)
      return
    }

    // The newbounding should not be too small
    if (mouseInSheet.x < left + 50){
      mouseInSheet.x = left + 50
    }
    if (mouseInSheet.y < top + 50){
      mouseInSheet.y = top + 50
    }

    /** Always create a new boundingBox with the most appropriate valid coordinates given the current mouse position
     * the mouse pointer should be at least boundbox.width right of the sheet.left and max at sheet.right
     */
    const newBoundingBox = {
      top: top,
      left: left,
      right: mouseInSheet.x,
      bottom: mouseInSheet.y,
    }

    // Only go ahead for a changed boundingBox
    const change = (newBoundingBox.right - newBoundingBox.left) / width

    if (change.width !== 0 || change.height !== 0){
      updateSelectedElements(
      {
          type: "resize_elements",
          change: change, 
          boundingBoxLeft: left, 
          boundingBoxTop: top
      })
    }   
  }

  return displayGroupSelection ? (
    <div className="selectionGroup"
      style={{
        left: left - 2,
        top: top - 2,
        width: width,
        height: height
      }}
      onPointerDown={pointerDownHandler}
      onPointerMove={moveSelection}
      onPointerUp={pointerUpHandler}
    >
      <div 
        className="resize"
        onPointerDown={(e) => e.stopPropagation()}
        draggable={true}
        onDrag={ resizeIt }
        onDragStart={ startResizing }
        onDragEnd={ () => setResizing(false) }
        />
    </div>
  ) : ""
}