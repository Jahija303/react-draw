import { DraggableButton }            from "../../toolbar/components/DragableButton"
import { useSetRecoilState }        from "recoil"
import { pageElementsSelector }     from "../../../../state/DocumentState"

export const Topic = ({topic, activeTopicId, dispatchActiveTopic}) => {
  const {id, title, elements} = {...topic}
  const isActive = (id === activeTopicId)

  /** The function which updates elements array of the current page */
  const dispatchCurrentPageElements = useSetRecoilState(pageElementsSelector)

  /** Handler for element icon click:
   * - adds the next element id to the elements array of the current page
   * - creates the element atom from the element atom family
   */
  function addElementToPage(elementShape, position) {
    dispatchCurrentPageElements({type: "add", shape: elementShape, position: position})
  }

  const topicElements = elements.map((shape, index) => {
    return <DraggableButton 
      key={`${title}-${index}`} 
      image={shape} 
      draggable={true} 
      dragImage={shape} 
      action={(position) => {addElementToPage(shape, position)}} />
  })

  return (
    <div className={`topic ${isActive ? "show" : ""}`}>
      <div className="topic-header" onPointerDown={() => dispatchActiveTopic({id: id, type: "toggle"})}>
        <div className="title">{title}</div>
        <div className="button show-content"></div>
      </div>
      {
        isActive ?
          <div className="topic-content">
            {topicElements}
          </div>
        : ""
      }
    </div>
  )
}