import { useReducer }                                     from "react";
import { Topic }                                          from "./components/Topic"
import { topicData }                                      from "../../../util/topics";

export const Drawer = () => {
  const [condensed, toggleCondensed] = useReducer(condensed => !condensed, false)
  const [activeTopicId, dispatchActiveTopic] = useReducer(activeTopicReducer, 1)

  /** Toggle extends the provided topic id, if it is already extended then it is shrinked
   * Default sets the extended topic to the first one, if none of the topics are extended
   */
  function activeTopicReducer(activeTopicId, action) {
    switch(action.type) {
      case "toggle":
        if(activeTopicId !== action.id) {
          return action.id
        } else {
          return 0
        }
      case "default":
        if(activeTopicId === 0) {
          return 1
        } else {
          return activeTopicId
        }
      default:
        return
    }
  }

  /** Shrink/expand the drawer:
   * Have at least one topic extended if the drawer is shrinked
   */
  function handleDrawerShrink() {
    dispatchActiveTopic({type: "default"})
    toggleCondensed()
  }

  return (
    <div id="drawer" className={condensed ? "condensed" : ""}>
      <div className="button shrink" onPointerUp={() => handleDrawerShrink()}></div>
      {
        topicData.map((topic, index) => {
          return(
            <Topic 
              key={index} 
              topic={topic}
              activeTopicId={activeTopicId} 
              dispatchActiveTopic={dispatchActiveTopic}
            />
          )
        })
      }
    </div>
  )
};