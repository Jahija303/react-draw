// Toasts are feedback notes that appear on the page after a user interaction was probably not as successful as planned
// they can be hidden on click
// and disappear automatically after a set time

import { atom, atomFamily, selector } from "recoil";

const TOAST_DISSAPPEARS_AFTER_MILISECONDS = 6000;
const ANIMATION_DURATION = 1000

export const toastIdsState = atom({
  key: "toastIds",
  default: []
});

export const toastState = atomFamily({
  key: "toast",
  default: { message: "Message", visible: false },
  effects: [
    // Toast dissappear animation goes here
    (effect) => {
      const id = effect.node.key.split("_").slice(-1);

      window.setTimeout(() => {
        const toast = document.getElementById(`toast__${id}`);
        if (toast) {
          toast.classList.add("disappearing");
        }
      }, TOAST_DISSAPPEARS_AFTER_MILISECONDS);
    },
    // Reset the toast data to default ("delete" the toast atom)
    (effect) => {
      window.setTimeout(() => {
        effect.resetSelf()
      }, TOAST_DISSAPPEARS_AFTER_MILISECONDS + ANIMATION_DURATION);
    }
  ],
});

export const newToastSelector = selector({
  key: "NewToastStateSelector",
  get: () => {},
  set: ({ get, set }, { message }) => {
    const toastIds = get(toastIdsState);
    const newToastId = Math.max(0, ...toastIds) + 1; // Math.max([]) is -Infinity

    set(toastIdsState, [...toastIds, newToastId]);
    set(toastState(newToastId), {
      message: message,
      visible: true,
    });
  },
});
