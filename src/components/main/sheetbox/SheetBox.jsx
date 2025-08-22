import Sheet from "./components/Sheet";
import SheetOptions from "./components/SheetOptions";

export default function SheetBox() {
  return (
    <div id="sheetbox">
      <div id="desk">
        <Sheet />
      </div>
      <SheetOptions />
    </div>
  );
};
