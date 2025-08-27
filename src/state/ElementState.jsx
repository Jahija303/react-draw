/** Elements state holds atoms responsible for storing and updating individual element data */

import { atomFamily, atom, selector } from "recoil";
import { DEFAULT_ELEMENT_STATE } from "../util/util.config";
import { computeBoundingBox } from "../util/util";
import { baseToPixelSelector } from "./DisplayState";

/** The element family responsible for generating atoms based on the id passed */
export const elementFamily = atomFamily({
  key: "ElementAtomFamily",
  default: { ...DEFAULT_ELEMENT_STATE }
});

/** The selected elements state responsible for holding an array of ID's 
 * of the selected elements
 */
const selectedElementsState = atom({
  key: "SelectedElementsState",
  default: []
})

/** This selector returns true if there is at least 1 element selected, 
 * which means that we can show the bounding box
 */
export const displaySelectionGroupState = selector({
  key: "DisplaySelectionGroup",
  get: ({get}) => get(selectedElementsState).length >= 1 ? true : false
})

/** The selected elements selector, responsible for getting the selected elements array
 * and adding/removing/toggle-ing the selected element by it's ID
 */
export const selectedElementsSelector = selector({
  key: "SelectedElementsSelector",
  get: ({get}) => get(selectedElementsState),
  set: ({get, set}, action) => {
    let selectedElements = [...get(selectedElementsState)]
    switch(action.type) {
      case "toggle":
        if(selectedElements.find(id => id === action.id)) {
          set(selectedElementsState, selectedElements.filter((id) => id !== action.id))
        } else {
          selectedElements.push(action.id)
          set(selectedElementsState, selectedElements)
        }
        break;
      case "set":
        if(selectedElements.length === 1 && selectedElements[0] === action.id) {
          return
        }
        set(selectedElementsState, [action.id])
        break;
      case "delete":
        console.log("deleting items from array" + selectedElements)
        if (action.id) {
          // Delete specific element: remove from selection and reset element atom
          const newList = selectedElements.filter(id => id !== action.id)
          set(selectedElementsState, newList)
          set(elementFamily(action.id), { ...DEFAULT_ELEMENT_STATE })
        } else {
          // Delete all selected elements: reset all element atoms and clear selection
          selectedElements.forEach(id => {
            set(elementFamily(id), { ...DEFAULT_ELEMENT_STATE })
          })
          set(selectedElementsState, [])
        }
        break;
      default:
        return
    }
  }
})

/** Is the selection box moving or not */
export const isSelectionMovingState = atom({
  key: "isSelectionMoving",
  default: false
})

/** Pointer location inside the bounding box, used for moving the selection box */
export const mouseInBoundingBoxState = atom({
  key: "mouseInBoundingBox",
  default: {x: 50, y: 50}
})

/** Selector which computes the bounding box from the selected elements */
export const selectionBoundingBox = selector({
  key: "SelectedElementsData",
  get: ({get}) => {
    const selectedIDs = get(selectedElementsState)
    const selectedElements = selectedIDs.map((id) => get(elementFamily(id)))
    return computeBoundingBox(selectedElements, get(baseToPixelSelector))
  }
})

/** The active element state, holds the ID of the current active element */
export const activeElementState = selector({
  key: "ActiveElementState",
  get: ({get}) => {
    if(get(selectedElementsState).length === 1) {
      return get(selectedElementsState)[0]
    } else {
      return null
    }
  }
})