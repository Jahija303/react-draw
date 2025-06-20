import { atom, selector } from 'recoil'
import { elementFamily } from './ElementState'
import { units, UNITS_PER_MM } from '../util/units'
import { pageSizes } from '../util/util.config'
import { area } from '../util/util.config'
import { getAreaBounds } from '../util/util'
import { baseToPixelSelector } from './DisplayState'

/** The default data with which each new page will be created */
const DEFAULT_PAGE_DATA = {
  dimensions: {
    width: pageSizes.a4.width, 
    height: pageSizes.a4.height
  },
  elements: []
}

/** The atom which holds the current unit */
export const unitState = atom({
  key: "UnitState",
  default: Object.keys(units)[0]
})

/** This atom holds the current area value */
export const drawingAreaState = atom({
  key: "DrawingAreaState",
  default: area.WITHIN_MARGIN
})

/** This selector holds the drawing area bounds value */
export const drawingAreaBoundsState = selector({
  key: "Drawing area bounds",
  get: ({get}) => getAreaBounds(get(drawingAreaState), get(pageMarginsState), get(baseToPixelSelector))
})

/** This atom holds the current page number */
export const currentPageState = atom({
  key: "CurrentPageState",
  default: 0
})

/** Getter and setter (reducer) for the current page
 * Reducer:
 * - gets the current page value
 * - checks if the new page value is within bounds
 * - the new value is compared to either 0 for min, or max (number of pages)
 */
export const currentPageStateReducer = selector({
  key: "CurrentPageStateReducer",
  get: ({get}) => get(currentPageState),
  set: ({get, set}, action) => {
    const currentPage = get(currentPageState)
    const max = get(numberOfPagesSelector)
    let newPage;

    switch (action.type) {
      case "update":
        if (action.page < 0) {
          newPage = 0;
        } else if (action.page > max) {
          newPage = max;
        } else {
          newPage = action.page;
        }
        break;
      case "increment":
        if (max - 1 > currentPage) {
          newPage = currentPage + 1;
        } else {
          newPage = currentPage;
        }
        break;
      case "decrement":
        if (currentPage > 0) {
          newPage = currentPage - 1;
        } else {
          newPage = currentPage;
        }
        break;
      default:
        newPage = 0;
    }

    set(currentPageState, newPage)
  }
})

/** This atom holds the current margin values */
export const pageMarginsState = atom({
  key: "pageMargins",
  default: { 
    top: 25 * UNITS_PER_MM, 
    right: 22 * UNITS_PER_MM, 
    bottom: 25 * UNITS_PER_MM, 
    left: 22 * UNITS_PER_MM
  },
});

/** Getter and setter (reducer) for the page margins
 * Reducer: 
 * - gets the current page margins
 * - if the user selects equal margins, set every margin value to the provided value
 * - if not, check which margin needs to be updated
 * - convert the value to a Number, and update the state
 */
export const pageMarginsStateReducer = selector({
  key: "PageMarginsStateReducer",
  get: ({get}) => get(pageMarginsState),
  set: ({get, set}, action) => {
    const pageMargins = get(pageMarginsState)
    let newMargins;

    if (action.equalMargins) {
      newMargins = {
        top: Number(action.value),
        right: Number(action.value),
        bottom: Number(action.value),
        left: Number(action.value),
      };
      console.log("equal margins: ", newMargins)
    } else {
      switch (action.type) {
        case "top":
          newMargins = { ...pageMargins, top: Number(action.value) };
          break;
        case "right":
          newMargins = { ...pageMargins, right: Number(action.value) };
          break;
        case "bottom":
          newMargins = { ...pageMargins, bottom: Number(action.value) };
          break;
        case "left":
          newMargins = { ...pageMargins, left: Number(action.value) };
          break;
        default:
          return pageMargins;
      }
    }

    set(pageMarginsState, newMargins);
  }
})

/** This atom holds the global page data
 * the pages array holds all pages as objects with some default data (name, dimensions, elements [])
 */
 export const pagesState = atom({
  key: "PagesState",
  default: {
    pages: [
      { name: "Page 1", ...DEFAULT_PAGE_DATA },
    ]
  }
})

/** State which holds the next ID of any newly created element */
const nextIDState = atom({
  key: "NextIDState",
  default: 1
})

/** Getter and setter for the individual page elements
 *  Reducer:
 * - gets the current page index
 * - store the current page in a helper variable "currentPage"
 * - create a new elements array by destructuring the current elements array state
 *  which will be modified with the new value
 * - add or remove the element ID from the newElementsArray
 * - create a new array "newPagesState" by destructirng the current pages state,
 * this is the array that will be updated with the newElements array based on the page index
 * - update the "newPagesState" at the current page index with the new elements array
 * - set the pages state to the newly created "newPagesState"
 */
export const pageElementsSelector = selector({
  key: "PageElementsSelector",
  get: ({get}) => {
    const currentPageIndex = get(currentPageState)
    return get(pagesState).pages[currentPageIndex].elements
  },
  set: ({get, set}, action) => {
    const currentPageIndex = get(currentPageState)
    const currentPagesState = get(pagesState)
    const currentPage = currentPagesState.pages[currentPageIndex]
    
    let newPagesState = [...currentPagesState.pages]
    let newElementsArray = [...currentPage.elements]

    switch(action.type) {
      case "add":
        /** Get the nextID and add it to the pages elements array */
        const id = get(nextIDState)
        newElementsArray.push(id)
        /** Creates an atom from the atom family with the provided shape and ID
         * - the setter simply fetches the atom from the provided ID (atom is generated if does not exist)
         * and sets it's shape and ID based on the data provided to it
         */
        if(action.position) {
          set(elementFamily(id), {...get(elementFamily(id)), id: id, type: action.shape, position: action.position})
        } else {
          set(elementFamily(id), {...get(elementFamily(id)), id: id, type: action.shape})
        }
        
        /** Increment the next ID */
        set(nextIDState, id + 1)
        break;
      case "remove":
        const index = newElementsArray.indexOf(action.value)
        if(index > -1) {
          newElementsArray.splice(index, 1)
        }
        // TODO: Delete the atom state https://github.com/facebookexperimental/Recoil/issues/622
        break;
      default:
        return
    }

    newPagesState[currentPageIndex] = {...newPagesState[currentPageIndex], elements: newElementsArray}
    set(pagesState, {...currentPagesState, pages: newPagesState})
  }
})

/** This selector gets the current number of pages in the pages array
 * It is also responsible for adding a new page to the array:
 * - gets the pages array in the pages constant
 * - calculates the new index of the page being added
 * - creates a new array holding the current pages + the new page
 * - the name uses the new index
 * - the dimensions are equal to the dimensions of the last page in the array
 */
export const numberOfPagesSelector = selector({
  key: "NumberOfPagesSelector",
  get: ({get}) => get(pagesState).pages.length,
  set: ({get, set}) => {
    const currentPagesState = get(pagesState)
    const pages = currentPagesState.pages
    const newIndex = pages.length

    const newPagesArray = pages.concat(
      {
        ...DEFAULT_PAGE_DATA,
        name: `Page ${newIndex}`, 
        dimensions: pages[pages.length - 1].dimensions
      }
    )
    
    set(pagesState, {...currentPagesState, pages: newPagesArray})
    set(currentPageState, newIndex)
  }
})

/** This selector retrieves the dimensions of the current page
 * and sets the provided dimensions to the current page
 * while setting the new dimensions:
 * - gets the index of the current page
 * - creates a new array with the current pages
 * - updates the new array at the given index via desctructuring
 * - sets the new value as the new page state
 */
export const dimensionsReducer = selector({
  key: "DimensionsReducer",
  get: ({get}) => get(pagesState).pages[get(currentPageState)].dimensions,
  set: ({get, set}, action) => {
    const index = get(currentPageState)
    let newPagesState = [...get(pagesState).pages]
    const {dimensions} = newPagesState[index]
    
    let newDimensions;
    switch (action.type) {
      case "width":
        newDimensions = { ...dimensions, width: action.value };
        break;
      case "height":
        newDimensions = { ...dimensions, height: action.value };
        break;
      case "update":
        newDimensions = { width: action.width, height: action.height };
        break;
      default:
        return dimensions;
    }

    newPagesState[index] = {...newPagesState[index], dimensions: newDimensions}
    set(pagesState, {...get(pagesState), pages: newPagesState})
  }
})