import { useState }                                                 from "react";
import { useRecoilState }                                           from "recoil";
import { ButtonWithDropdownContent }                                from "../toolbar/components/ButtonWithDropdownContent";
import { PopOver }                                                  from "./components/PopOver";
import { orientations, pageSizes, area }                            from "../../../util/util.config";
import { baseToUnit, units, unitToBase }                            from "../../../util/units";
import {
  gridSizeState,
  displayMarginState,
  displayGridState,
  snapToGridState,
} from "../../../state/DisplayState";
import {
  unitState,
  dimensionsReducer,
  pageMarginsStateReducer,
  drawingAreaState,
} from "../../../state/DocumentState";
import { sheetOptionsPopoverState } from "../../../state/SheetOptionsState";
import { useEffect } from "react";

export default function SheetOptionsPopOver() {
  /** Local state values */
  const [pageSize, setPageSize] = useState(pageSizes.a4.name);
  const [pageOrientation, setPageOrientation] = useState(orientations.portrait);

  /** Global state values */
  const [dimensions, dispatchDimensions] = useRecoilState(dimensionsReducer);

  const [dimensionUnit, setDimensionUnit] = useRecoilState(unitState);
  const [sheetOptionsPopoverVisible, setSheetOptionsPopoverVisible] =
    useRecoilState(sheetOptionsPopoverState);

  const [gridSize, setGridSize] = useRecoilState(gridSizeState);
  const [displayGrid, setDisplayGrid] = useRecoilState(displayGridState);
  const [snapToGrid, setSnapToGrid] = useRecoilState(snapToGridState);

  const [displayMargin, setDisplayMargin] = useRecoilState(displayMarginState);
  const [equalMargins, setEqualMargins] = useState(false);
  const [pageMargins, dispatchPageMargins] = useRecoilState(
    pageMarginsStateReducer
  );
  const [drawingArea, setDrawingArea] = useRecoilState(drawingAreaState)

  useEffect(() => {
    /** Update the dropdown of the page orientation if it is changed */
    if (dimensions.width > dimensions.height) {
      setPageOrientation(orientations.landscape);
    } else {
      setPageOrientation(orientations.portrait);
    }
    /** Update the page size dropdown if the size has been changed */
    for (const key in pageSizes) {
      if (
        Number(dimensions.width) === pageSizes[key].width &&
        Number(dimensions.height) === pageSizes[key].height
      ) {
        setPageSize(pageSizes[key].name);
        break;
      } else {
        setPageSize("Custom");
      }
    }
  }, [dimensions.width, dimensions.height]);

  /** Handle the page orientation change
   * Get the current page width and height, if the orientation is landscape:
   * set the larger value to width, and the shorter one to height
   * if the orientation is portrait, shorter value width, larger value height
   */
  const handleOrientationChange = (orientation) => {
    switch (orientation) {
      case "landscape":
        if (dimensions.width < dimensions.height) {
          dispatchDimensions({
            type: "update",
            width: dimensions.height,
            height: dimensions.width,
          });
        }
        break;
      case "portrait":
        if (dimensions.height < dimensions.width) {
          dispatchDimensions({
            type: "update",
            width: dimensions.height,
            height: dimensions.width,
          });
        }
        break;
      default:
        return;
    }
  };

  /** Handle drawing area selection */
  const handleDrawingAreaChange = (input_area) => {
    setDrawingArea(area[input_area])
  }

  /** Handle common page size selection
   * common page sizes have their value in mm
   * when the user selects the page size, if the current unit is not mm
   * convert the page value to the new unit and set it as the current dimension
   */
  const handlePageSizeSelection = (size) => {
    dispatchDimensions({
      type: "update",
      width: size.width,
      height: size.height,
    });
  };

  /** Generate content for dimensions unit dropdown */
  const dimensionsDropdownContent = [];
  for (const key in units) {
    dimensionsDropdownContent.push({
      value: key,
      action: () => setDimensionUnit(key),
    });
  }

  /** Generate content for page size orientation dropdown */
  const pageOrientationDropdownContent = [];
  for (const key in orientations) {
    pageOrientationDropdownContent.push({
      value: orientations[key],
      action: () => handleOrientationChange(key),
    });
  }

  /** Generate content for drawing area dropdown */
  const drawingAreaDropdownContent = [];
  for (const key in area) {
    drawingAreaDropdownContent.push({
      value: area[key],
      action: () => handleDrawingAreaChange(key),
    });
  }

  /** Generate content for page size dropdown */
  const pageSizeDropdownContent = [];
  for (const key in pageSizes) {
    pageSizeDropdownContent.push({
      value: pageSizes[key].name,
      action: () => handlePageSizeSelection(pageSizes[key]),
    });
  }

  const step = 10 ** (-1 * units[dimensionUnit].precision);
  return (
    <>
      {sheetOptionsPopoverVisible ? (
        <PopOver setVisible={setSheetOptionsPopoverVisible}>
          <div className="setting">
            <div className="inner dimension-unit">
              <div className="title">Dimension Unit:</div>
              <div className="field">
                <span>Unit:</span>
                <ButtonWithDropdownContent
                  contentArray={dimensionsDropdownContent}
                  currentContentState={dimensionUnit}
                />
              </div>
            </div>
          </div>
          <div className="setting">
            <div className="inner dimensions">
              <div className="title">Page Dimensions:</div>
              <div className="field">
                <div className="common-dimensions">
                  <ButtonWithDropdownContent
                    currentContentState={pageSize}
                    contentArray={pageSizeDropdownContent}
                  />
                </div>
                <span>Width:</span>
                <input
                  type="number"
                  min="1"
                  max="50000"
                  step={step}
                  value={baseToUnit(dimensions.width, dimensionUnit)}
                  onChange={(e) =>
                    dispatchDimensions({
                      type: "width",
                      value: unitToBase(e.target.value, dimensionUnit),
                    })
                  }
                />
                <span>Height:</span>
                <input
                  type="number"
                  min="1"
                  max="50000"
                  step={step}
                  value={baseToUnit(dimensions.height, dimensionUnit)}
                  onChange={(e) =>
                    dispatchDimensions({
                      type: "height",
                      value: unitToBase(e.target.value, dimensionUnit),
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div className="setting">
            <div className="inner page-orientation">
              <div className="title">Page Orientation:</div>
              <div className="field">
                <div className="orientation">
                  <ButtonWithDropdownContent
                    currentContentState={pageOrientation}
                    contentArray={pageOrientationDropdownContent}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="setting">
            <div className="inner drawing-area">
              <div className="title">Drawing Area:</div>
              <div className="field">
                <div className="area">
                  <ButtonWithDropdownContent
                    currentContentState={drawingArea}
                    contentArray={drawingAreaDropdownContent}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="setting">
            <div className="inner grid">
              <div className="title">Grid:</div>
              <div className="field">
                <div className="checkbox-container">
                  <span>Display:</span>
                  <input
                    type="checkbox"
                    checked={displayGrid}
                    onChange={() =>
                      setDisplayGrid((displayGrid) => !displayGrid)
                    }
                  />
                </div>
                <div className="checkbox-container">
                  <span>Snap to grid:</span>
                  <input
                    type="checkbox"
                    checked={snapToGrid}
                    onChange={() => setSnapToGrid((snapToGrid) => !snapToGrid)}
                  />
                </div>
                <div className="value-container">
                  <span>Size:</span>
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    step={step}
                    value={baseToUnit(gridSize, dimensionUnit)}
                    onChange={(e) => setGridSize(unitToBase(e.target.value, dimensionUnit))}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="setting">
            <div className="inner margin">
              <div className="title">Margins:</div>
              <div className="field">
                <div className="checkboxes">
                  <div className="checkbox-container">
                    <span>Display:</span>
                    <input
                      type="checkbox"
                      checked={displayMargin}
                      onChange={() =>
                        setDisplayMargin((displayMargin) => !displayMargin)
                      }
                    />
                  </div>
                  <div className="checkbox-container">
                    <span>Equal margins:</span>
                    <input
                      type="checkbox"
                      checked={equalMargins}
                      onChange={() =>
                        setEqualMargins((equalMargins) => !equalMargins)
                      }
                    />
                  </div>
                </div>
                <div className="values">
                  <div className="value-container">
                    <span>Top:</span>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      step={step}
                      value={baseToUnit(pageMargins.top, dimensionUnit)}
                      onChange={(e) =>
                        dispatchPageMargins({
                          type: "top",
                          equalMargins: equalMargins,
                          value: unitToBase(e.target.value, dimensionUnit),
                        })
                      }
                    />
                  </div>
                  <div className="value-container">
                    <span>Right:</span>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      step={step}
                      value={baseToUnit(pageMargins.right, dimensionUnit)}
                      onChange={(e) =>
                        dispatchPageMargins({
                          type: "right",
                          equalMargins: equalMargins,
                          value: unitToBase(e.target.value, dimensionUnit),
                        })
                      }
                    />
                  </div>
                  <div className="value-container">
                    <span>Bottom:</span>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      step={step}
                      value={baseToUnit(pageMargins.bottom, dimensionUnit)}
                      onChange={(e) =>
                        dispatchPageMargins({
                          type: "bottom",
                          equalMargins: equalMargins,
                          value: unitToBase(e.target.value, dimensionUnit),
                        })
                      }
                    />
                  </div>
                  <div className="value-container">
                    <span>Left:</span>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      step={step}
                      value={baseToUnit(pageMargins.left, dimensionUnit)}
                      onChange={(e) =>
                        dispatchPageMargins({
                          type: "left",
                          equalMargins: equalMargins,
                          value: unitToBase(e.target.value, dimensionUnit),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PopOver>
      ) : (
        ""
      )}
    </>
  );
};
