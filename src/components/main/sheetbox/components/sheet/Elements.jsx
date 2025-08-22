import { useRecoilValue } from "recoil"
import { pageElementsSelector } from "../../../../../state/DocumentState"
import Element from "./Element"

export default function Elements() {
  const elements = useRecoilValue(pageElementsSelector)

  /** Map each ID from the current elements on this page to an Element component and return it */
  const currentPageElements = elements.map(el => {
    return <Element key={`Element-${el}`} id={el} />
  })

  return currentPageElements
}