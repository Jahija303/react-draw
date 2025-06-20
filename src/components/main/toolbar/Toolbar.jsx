import { FullscreenButton }                           from "./components/FullscreenButton"
import { Button }                                     from "./components/Button";
import { ButtonWithDropdown }                         from "./components/ButtonWithDropdown";

export const Toolbar = () => {
  return (
    <div id="toolbar">
      <div className="inner">
        <Button image="save" action="Save document"/>
        <Button image="import" disabled action="Open document"/>
        <Button image="undo" action="Undo" firstInGroup />
        <Button image="history" action="Pick from Edit History"/>
        <Button image="redo" action="Redo"/>
        <ButtonWithDropdown firstInGroup
          buttons={
            [
              {
                image: "arrow-normal",
                action: "first action"
              },
              {
                image: "arrow-bold",
                action: "second action"
              },
              {
                image: "arrow-full",
                action: "third action"
              }
            ]
          } />

          <ButtonWithDropdown
            buttons={
              [
                {
                  image: "line-normal",
                  action: "first action"
                },
                {
                  image: "line-dashed",
                  action: "second action"
                },
                {
                  image: "line-dotted",
                  action: "third action"
                }
              ]
            } />
      </div>
      <FullscreenButton/>
    </div>
  )
};
