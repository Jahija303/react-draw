import { useRecoilValue }                                   from "recoil";
import { baseToPixelSelector, gridSizeState }               from "../../../../../state/DisplayState";
import { dimensionsReducer }                                from "../../../../../state/DocumentState";
import { baseToUnit }                                       from "../../../../../util/units";

export const Grid = () => {
  const dimensions = useRecoilValue(dimensionsReducer);
  const baseToPixel = useRecoilValue(baseToPixelSelector)
  const width = baseToUnit(dimensions.width, "mm") * baseToPixel
  const height = baseToUnit(dimensions.height, "mm") * baseToPixel
  const gridState = useRecoilValue(gridSizeState);
  const gridSize = Number(baseToUnit(gridState, "mm") * baseToPixel)

  /** Generate the grid lines for the x and y axis */
  const gridLines = [];
  for (let i = 0; i <= width; i = i + gridSize) {
    gridLines.push(
      <line key={"key" + i} x1={i} y1="0" x2={i} y2={height} />
    );
  }
  for (let i = 0; i <= height; i = i + gridSize) {
    gridLines.push(
      <line key={"key" + i + 1} x1="0" y1={i} x2={width} y2={i} />
    );
  }

  return (
    <svg
      className="grid"
      viewBox={`0 0 ${width} ${height}`}
    >
      {gridLines}
    </svg>
  );
};
