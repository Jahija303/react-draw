import { useSetRecoilState } from "recoil";
import Button from "../../toolbar/components/Button";
import PageNavigate                         from "./sheetoptions/PageNavigate";
import ZoomSettings                         from "./sheetoptions/ZoomSettings";
import OptionsToggle                        from "./sheetoptions/OptionsToggle";
import NewPage                              from "./sheetoptions/NewPage";
import { sheetOptionsPopoverState } from "../../../../state/SheetOptionsState";

export default function SheetOptions() {
  /** Global state values */
  const setSheetOptionsPopoverVisible = useSetRecoilState(
    sheetOptionsPopoverState
  );

  return (
    <div id="sheet-options">
      {/* Open Settings */}
      <Button
        image="settings"
        action={() => setSheetOptionsPopoverVisible(true)}
      />
      {/* Page navigation */}
      <PageNavigate />
      {/* Add a new page */}
      <NewPage />
      {/* Toggle multiple options */}
      <OptionsToggle />
      {/* Zoom settings */}
      <ZoomSettings />
    </div>
  );
};
