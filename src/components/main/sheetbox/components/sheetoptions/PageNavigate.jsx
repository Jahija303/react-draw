import { useRecoilState, useRecoilValue } from "recoil";
import { useState } from "react";
import Button from "../../../toolbar/components/Button";
import { currentPageStateReducer } from "../../../../../state/DocumentState";
import { numberOfPagesSelector } from "../../../../../state/DocumentState";

export default function PageNavigate() {
  /** Global state values */
  const [currentPage, dispatchCurrentPage] = useRecoilState(currentPageStateReducer);
  const numberOfPages = useRecoilValue(numberOfPagesSelector);
  const [pageNavigateDropupVisible, setPageNavigateDropup] = useState(false);

  /** Generate a list of buttons to be used in the dropup list
   * The list has (numberOfPages) number of buttons
   * Each button has a content of it's own index
   */
  const dropupContent = [];
  for (let i = 1; i <= numberOfPages; i++) {
    dropupContent.unshift(
      <Button
        key={`page-button-${i}`}
        content={i}
        action={() => dispatchCurrentPage({ type: "update", page: i - 1 })}
      />
    );
  }

  return (
    <div className="page-navigate first-in-group">
      <Button
        image="backward"
        action={() => dispatchCurrentPage({ type: "decrement" })}
      />
      <div
        className="dropup"
        tabIndex="0"
        onBlur={() => setPageNavigateDropup(false)}
      >
        <div className="input-dropupbutton">
          <input
            type="number"
            min="1"
            max={numberOfPages}
            value={currentPage + 1}
            onChange={(e) =>
              dispatchCurrentPage({
                type: "update",
                page: e.target.value
              })
            }
          />
          <div className="dropupbutton-container">
            <Button
              image="drop-up-black"
              action={() => setPageNavigateDropup((pageNavigateDropupVisible) => !pageNavigateDropupVisible)}
            />
          </div>
        </div>
        <div
          className={`dropup-list ${pageNavigateDropupVisible ? "show" : ""}`}
        >
          {dropupContent}
        </div>
      </div>
      <Button
        image="forward"
        action={() =>
          dispatchCurrentPage({ type: "increment"})
        }
      />
    </div>
  );
}
