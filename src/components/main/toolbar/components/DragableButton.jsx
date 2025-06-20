import { useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil";
import {
  pageMarginsState,
  dimensionsReducer,
  drawingAreaBoundsState,
  unitState
} from "../../../../state/DocumentState";
import { DEFAULT_ELEMENT_STATE } from "../../../../util/util.config";
import { baseToUnit, unitToBase } from "../../../../util/units";
import { baseToPixelSelector } from "../../../../state/DisplayState";
import { newToastSelector } from "../../../../state/ToastState";
import { emptyGif } from "../../../../util/util.config";
import { difference } from "../../../../util/util";

export const DraggableButton = ({
  firstInGroup,
  active,
  disabled,
  action,
  image,
  draggable,
  content,
  children,
}) => {
  const pageMargins = useRecoilValue(pageMarginsState);
  const baseToPixel = useRecoilValue(baseToPixelSelector);
  const dimensionUnit = useRecoilValue(unitState);
  const pageDimensions = useRecoilValue(dimensionsReducer);

  const setNewToast = useSetRecoilState(newToastSelector)

  /** Convert the dimensions to px value */
  let dimensions = {};
  for (const key in pageDimensions) {
    dimensions[key] = baseToUnit(pageDimensions[key], "mm") * baseToPixel;
  }

  /** Convert the margins value into px */
  let margins = {};
  for (const key in pageMargins) {
    margins[key] = baseToUnit(pageMargins[key], "mm") * baseToPixel;
  }

  /** Create a custom drag image */
  const dragImage = document.createElement("div");
  dragImage.classList.add("drag-image");
  dragImage.innerHTML = image;

  /** Handle button action */
  const handleClicked = () => {
    setNewToast({message: "Drag the element onto the sheet"});
  };

  /** Get the area bounds value 
   * we use the useRecoilCallback hook to fetch the data because the sheet component is not completely rendered
   * before this component. This callback simply gets a snapshot (current state value) of the needed data
   * each time it is accessed.
  */
  const getAreaBounds = useRecoilCallback(({snapshot}) => () => {
    return snapshot.getLoadable(drawingAreaBoundsState).contents
  })

  /** Handle drag start/end */
  const handleDragStart = (e) => {
    /** Append the custom drag image element to screen */
    document.getElementById("screen").appendChild(dragImage);

    /** Set an empty gif as drag image */
    e.dataTransfer.setDragImage(emptyGif, 0, 0);
  };

  const handleDrag = (e) => {
    /** Check if the pointer is moved by at least 1 px */
    const previousValue = {
      left: Number(dragImage.style.left.slice(0, -2)),
      top: Number(dragImage.style.top.slice(0, -2)),
    };

    const differences = {
      left: difference(previousValue.left, e.clientX),
      top: difference(previousValue.top, e.clientY),
    };

    if (differences.left >= 1 || differences.top >= 1) {
      dragImage.style.left = `${e.clientX}px`;
      dragImage.style.top = `${e.clientY}px`;
    }
  };

  const handleDragEnd = (e) => {
    /** Compare the location where the user dropped the element and the drawing area
     * if the location is invalid, fail the element drop
     */
    const areaBounds = getAreaBounds()
    const sheetElement = document.getElementById("sheet");

    const mouseInSheet = {
      x: e.clientX - sheetElement.getBoundingClientRect().left,
      y: e.clientY - sheetElement.getBoundingClientRect().top,
    };

    if(
      mouseInSheet.x >= areaBounds.left && 
      mouseInSheet.y >= areaBounds.top && 
      mouseInSheet.x < areaBounds.right - DEFAULT_ELEMENT_STATE.dimensions.width &&
      mouseInSheet.y < areaBounds.bottom - DEFAULT_ELEMENT_STATE.dimensions.height) {
        action({
          x: unitToBase(mouseInSheet.x, dimensionUnit) / baseToPixel,
          y: unitToBase(mouseInSheet.y, dimensionUnit) / baseToPixel
        });
    }
    
    // Remove the drag image
    document.getElementById("screen").removeChild(dragImage);
  };

  /** Return early if the button is disabled */
  if (disabled) {
    return (
      <div
        className={`button-container ${firstInGroup ? "first-in-group" : ""}`}
      >
        <div className={`button disabled ${image}`}>{content}</div>
        {children ? <div className="children">{children}</div> : ""}
      </div>
    );
  }

  return (
    <div
      tabIndex="0"
      draggable={draggable}
      className={`button-container ${active ? "active" : ""} ${
        firstInGroup ? "first-in-group" : ""
      }`}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onPointerUp={handleClicked}
    >
      <div className={`button ${image}`}>{content}</div>
      {children ? <div className="children">{children}</div> : ""}
    </div>
  );
};