import { useRecoilState }                                             from "recoil";
import { useState }                                                   from "react";
import { Button }                                                     from "../../../toolbar/components/Button";
import { zoomLevels }                                                 from "../../../../../util/util.config";
import { zoomLevelStateReducer }                                      from "../../../../../state/DisplayState";

export const ZoomSettings = () => {
  /** Global state values */
  const [zoomLevel, dispatchZoomLevel] = useRecoilState(zoomLevelStateReducer);
  const [zoomDropupVisible, setZoomNavigateDropup] = useState(false);

  /** Generate an array of items which will be displayed in the dropup list
   * This will be an array of buttons with the zoom % value and an update action
   */
  const dropupContent = zoomLevels.map((zoom, index) => {
    return (
      <Button
        key={`zoom-button-${index}`}
        content={`${(zoom * 100).toFixed(0)}%`}
        action={() => dispatchZoomLevel({ type: "update", value: zoom })}
      />
    );
  });

  return (
    <div className="zoom-settings first-in-group">
      <Button
        image="minus"
        action={() => dispatchZoomLevel({ type: "decrement" })}
      />
      <div
        className="dropup"
        tabIndex="0"
        onBlur={() => setZoomNavigateDropup(false)}
      >
        <div className="dropupbutton">
          <div className="content">{(zoomLevel * 100).toFixed(0)}%</div>
          <div className="dropupbutton-container">
            <Button
              image="drop-up-black"
              action={() => setZoomNavigateDropup((zoomDropupVisible) => !zoomDropupVisible)}
            />
          </div>
        </div>
        <div className={`dropup-list ${zoomDropupVisible ? "show" : ""}`}>
          {dropupContent}
        </div>
      </div>
      <Button
        image="plus"
        action={() => dispatchZoomLevel({ type: "increment" })}
      />
    </div>
  );
};
