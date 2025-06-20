import { memo } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { baseToPixelSelector } from "../../../../../state/DisplayState"
import { 
  elementFamily, 
  selectedElementsSelector,
  isSelectionMovingState,
  mouseInBoundingBoxState
} from "../../../../../state/ElementState"
import { AllElements } from "../../../../../util/elementComponents"
import { baseToUnit } from "../../../../../util/units"

const Element = memo(function Element({id}) {
  const dispatchSelectedElement = useSetRecoilState(selectedElementsSelector)
  const elementData = useRecoilValue(elementFamily(id))
  const Type = AllElements[elementData.type]
  const setIsSelectionMoving = useSetRecoilState(isSelectionMovingState)
  const setMouseInBoundingBox = useSetRecoilState(mouseInBoundingBoxState)
  const baseToPixel = useRecoilValue(baseToPixelSelector)

  const style = {
    left: baseToUnit(elementData.position.x, "mm") *  baseToPixel,
    top: baseToUnit(elementData.position.y, "mm") *  baseToPixel
  }

  const dimensions = {
    width: baseToUnit(elementData.dimensions.width, "mm") *  baseToPixel,
    height: baseToUnit(elementData.dimensions.height, "mm") *  baseToPixel
  }

  const handlePointerDown = (e) => {
    e.stopPropagation()
    /** If the user holds the CTRL KEY, the id is added to the array so multiple 
     * elements can be selected, otherwise the clicked element will be the only one selected
     */
    if(e.ctrlKey) {
      dispatchSelectedElement({type: "toggle", id: id})
    } else {
      setIsSelectionMoving(true)

      const sheetElement = document.getElementById("sheet");
      const mouseInSheet = {
        x: e.clientX - sheetElement.getBoundingClientRect().left,
        y: e.clientY - sheetElement.getBoundingClientRect().top
      }
      setMouseInBoundingBox(
        {
          x: mouseInSheet.x - baseToUnit(elementData.position.x, "mm") *  baseToPixel, 
          y: mouseInSheet.y - baseToUnit(elementData.position.y, "mm") *  baseToPixel}
        )
      dispatchSelectedElement({type: "set", id: id})
    }
  }

  return (
    <div className="element" id={`el-${id}`} style={style} onPointerDown={handlePointerDown}>
      <Type data={elementData} dimensions={{...dimensions}} />
    </div>
  )
})

export default Element