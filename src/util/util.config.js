import { UNITS_PER_MM } from "./units";

export const area = {
  WITHIN_MARGIN: "Margin",
  WITHIN_PAGE: "Page",
  ANYWHERE: "Anywhere",
};

export const orientations = {
  landscape: "Landscape",
  portrait: "Portrait",
};

export const DEFAULT_ELEMENT_STATE = {
  dimensions: {
    width: 200,
    minWidth: 100,
    height: 200,
    minHeight: 100,
  },
  position: {
    x: 50,
    y: 50,
  },
  fill: "#EE4E56",
  stroke: "#F2D742",
  strokeWidth: 4,
};

export const pageSizes = {
  a1: {
    name: "A1",
    width: 594 * UNITS_PER_MM,
    height: 841 * UNITS_PER_MM,
  },
  a2: {
    name: "A2",
    width: 420 * UNITS_PER_MM,
    height: 594 * UNITS_PER_MM,
  },
  a3: {
    name: "A3",
    width: 297 * UNITS_PER_MM,
    height: 420 * UNITS_PER_MM,
  },
  a4: {
    name: "A4",
    width: 210 * UNITS_PER_MM,
    height: 297 * UNITS_PER_MM,
  },
  a5: {
    name: "A5",
    width: 148 * UNITS_PER_MM,
    height: 210 * UNITS_PER_MM,
  },
};

export const zoomLevels = [0.25, 0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 1.75, 2];

export const standardPixeLPerMM = 96 / 25.4;

export const emptyGif = new Image(0, 0);
emptyGif.src =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
