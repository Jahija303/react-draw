import { area } from "./util.config";
import { baseToUnit } from "./units";

export const difference = (a, b) => {
  return Math.abs(a - b);
};

export const computeBoundingBox = (selectedElements, baseToPixel) => {
  const cords = {
    left: Math.min(...selectedElements.map((el) => el.position.x)),
    top: Math.min(...selectedElements.map((el) => el.position.y)),
    right: Math.max(
      ...selectedElements.map((el) => el.position.x + el.dimensions.width)
    ),
    bottom: Math.max(
      ...selectedElements.map((el) => el.position.y + el.dimensions.height)
    ),
  };
  const boundingBox = {
    left: baseToUnit(cords.left, "mm") * baseToPixel,
    top: baseToUnit(cords.top, "mm") * baseToPixel,
    width: baseToUnit(cords.right - cords.left, "mm") * baseToPixel,
    height: baseToUnit(cords.bottom - cords.top, "mm") * baseToPixel,
  };
  return boundingBox;
};

export const getAreaBounds = (areaState, pageMargins, baseToPixel) => {
  const deskElement = document.getElementById("desk").getBoundingClientRect();
  const sheetElement = document.getElementById("sheet").getBoundingClientRect();
  switch (areaState) {
    case area.ANYWHERE:
      const sheetFromDeskLeft = sheetElement.left - deskElement.left;
      const sheetFromDeskTop = sheetElement.top - deskElement.top;
      return {
        left: -sheetFromDeskLeft,
        top: -sheetFromDeskTop,
        right: deskElement.width - sheetFromDeskLeft,
        bottom: deskElement.height - sheetFromDeskTop,
      };
    case area.WITHIN_PAGE:
      return {
        left: 0,
        right: sheetElement.right - sheetElement.left,
        bottom: sheetElement.bottom - sheetElement.top,
        top: 0,
      };
    case area.WITHIN_MARGIN:
      /** Convert the margins value into px */
      let margins = {};
      for (const key in pageMargins) {
        margins[key] = baseToUnit(pageMargins[key], "mm") * baseToPixel;
      }
      return {
        left: margins.left,
        right: sheetElement.right - sheetElement.left - margins.right,
        bottom: sheetElement.bottom - sheetElement.top - margins.bottom,
        top: margins.top,
      };
    default:
      break;
  }
};

export const fpsCounter = () => {
  const times = [];
  let fps;

  let fps_div = document.createElement("div");
  fps_div.id = "fps-counter";
  document.body.appendChild(fps_div);

  function refreshLoop() {
    window.requestAnimationFrame(() => {
      const now = performance.now();
      while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
      }
      times.push(now);
      fps = times.length;
      fps_div.innerHTML = fps;
      refreshLoop();
    });
  }

  refreshLoop();
};
