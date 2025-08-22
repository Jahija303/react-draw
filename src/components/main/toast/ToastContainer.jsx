import { useRecoilValue } from "recoil";
import { toastIdsState } from "../../../state/ToastState";
import Toast from "./components/Toast";

export default function ToastContainer() {
  const toastIds = useRecoilValue(toastIdsState);

  return (
    <div id="toasts">
      {toastIds.map((id) => {
        return <Toast key={`toast-${id}`} id={id} />;
      })}{" "}
    </div>
  );
};
