// display state are all properties that discribe how stuf is displayed on the screen
// they do not describe the data
// they are not expected to be stored with an individual document

import { atom, selector } from "recoil";
import { standardPixeLPerMM, zoomLevels } from "../util/util.config";
import { UNITS_PER_MM } from "../util/units";

/** Pixel per mm */
export const pixelPerMilimiterState = atom({
  key: "pixelPerMilimiter",
  default: window.devicePixelRatio * standardPixeLPerMM,
});

/** Margins */
export const displayMarginState = atom({
  key: "displayMargin",
  default: true,
});

/** Grid */
export const displayGridState = atom({
  key: "displayGrid",
  default: true,
});

export const snapToGridState = atom({
  key: "snapToGrid",
  default: false,
});

export const gridSizeState = atom({
  key: "gridSize",
  default: 10 * UNITS_PER_MM,
});

/** Zoom level */
export const zoomLevelState = atom({
  key: "zoomLevel",
  default: 1,
});

/** Getter and setter (reducer) fro the zoom level state
 * Reducer:
 * - get the current zoom level
 * - get the index of that zoom level in the zoomLevels array
 * - for increment and decrement, check if the new zoom level is within bounds
 * - if it is not within bounds, keep the current zoom level
 */
export const zoomLevelStateReducer = selector({
  key: "ZoomLevelStateReducer",
  get: ({get}) => get(zoomLevelState),
  set: ({get, set}, action) => {
    const zoomLevel = get(zoomLevelState)
    const index = zoomLevels.indexOf(zoomLevel);
    let newZoomLevel;

    switch (action.type) {
      case "update":
        newZoomLevel = action.value;
        break;
      case "increment":
        if (index === zoomLevels.length - 1) {
          newZoomLevel = zoomLevel;
        } else {
          newZoomLevel = zoomLevels[index + 1];
        }
        break;
      case "decrement":
        if (index === 0) {
          newZoomLevel = zoomLevel;
        } else {
          newZoomLevel = zoomLevels[index - 1];
        }
        break;
      default:
        newZoomLevel = 1;
    }
    
    set(zoomLevelState, newZoomLevel)
  }
})

export const baseToPixelSelector = selector({
  key: "BaseToPixelValue",
  get: ({get}) => get(zoomLevelState) * get(pixelPerMilimiterState)
})
