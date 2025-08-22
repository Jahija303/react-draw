import { useRecoilValue, useRecoilCallback, useSetRecoilState } from "recoil";
import { toastState, toastIdsState } from "../../../../state/ToastState";

export default function Toast({ id }) {
  const setToastIds = useSetRecoilState(toastIdsState);
  const { message, visible } = useRecoilValue(toastState(id));

  const removeToast = useRecoilCallback(({reset}) => () => {
    reset(toastState(id))
    setToastIds((toastIds) => {
      return toastIds.filter(toastId => toastId !== id)
    })
  }, []);

  if(visible) {
    return (
      <div className="toast" id={`toast__${id}`}>
        <div className="close" onPointerUp={removeToast}></div>
        {id} {message}
      </div>
    )
  }
}
