import { useRecoilValue }                                               from "recoil";
import { dimensionsReducer, pageMarginsState }                          from "../../../../../state/DocumentState";
import { baseToPixelSelector }                                          from "../../../../../state/DisplayState";
import { baseToUnit }                                                   from "../../../../../util/units";

export const Margins = () => {
  const dimensions = useRecoilValue(dimensionsReducer);
  const baseToPixel = useRecoilValue(baseToPixelSelector)
  const width = baseToUnit(dimensions.width, "mm") * baseToPixel
  const height = baseToUnit(dimensions.height, "mm") * baseToPixel
  const pageMargins = useRecoilValue(pageMarginsState);
  let margins = {}
  for(const key in pageMargins) {
    margins[key] = baseToUnit(pageMargins[key], "mm") * baseToPixel
  }

  return (
    <svg
      className="margins"
      viewBox={`0 0 ${width} ${height}`}
    >
      {
        width > (margins.left + margins.right) && height > (margins.top + margins.bottom) ?
        <rect
          x={margins.left}
          y={margins.top}
          width={width - margins.left - margins.right}
          height={height - margins.top - margins.bottom}
        /> : ""
      }
      <line
        x1={margins.left}
        y1={0}
        x2={margins.left}
        y2={margins.top}
      />
      <line
        x1={0}
        y1={margins.top}
        x2={margins.left}
        y2={margins.top}
      />
      <line
        x1={width - margins.right}
        y1={0}
        x2={width - margins.right}
        y2={margins.top}
      />
      <line
        x1={width - margins.right}
        y1={margins.top}
        x2={width}
        y2={margins.top}
      />
      <line
        x1={margins.left}
        y1={height - margins.bottom}
        x2={margins.left}
        y2={height}
      />
      <line
        x1={0}
        y1={height - margins.bottom}
        x2={margins.left}
        y2={height - margins.bottom}
      />
      <line
        x1={width - margins.right}
        y1={height}
        x2={width - margins.right}
        y2={height - margins.bottom}
      />
      <line
        x1={width - margins.right}
        y1={height - margins.bottom}
        x2={width}
        y2={height - margins.bottom}
      />
    </svg>
  );
};
