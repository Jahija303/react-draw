import "./App.scss";
import {RecoilRoot} from "recoil"
import { Screen } from "./components/main/Screen";
import { fpsCounter } from "./util/util";

fpsCounter()

function App() {
  return (
    <RecoilRoot>
      <Screen/>
    </RecoilRoot>
  )
}

export default App;
