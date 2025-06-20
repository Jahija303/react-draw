import { useRecoilState }                       from 'recoil'
import { Button }                               from '../../../toolbar/components/Button'
import { 
  displayMarginState, 
  displayGridState,
  snapToGridState
}                                               from '../../../../../state/DisplayState'

export const OptionsToggle = () => {
  const [displayMargin, setDisplayMargin] = useRecoilState(displayMarginState)
  const [displayGrid, setDisplayGrid] = useRecoilState(displayGridState)
  const [snapToGrid, setSnapToGrid] = useRecoilState(snapToGridState)

  /** Global state toggles */
  const toggleDisplayMargin = () => {
    setDisplayMargin(displayMargin => !displayMargin)
  }

  const toggleDisplayGrid = () => {
    setDisplayGrid(displayGrid => !displayGrid)
  }

  const toggleSnapToGrid = () => {
    setSnapToGrid(snapToGrid => !snapToGrid)
  }

  return (
    <div className="toggle-options first-in-group">
      <Button image="margin" active={displayMargin} action={toggleDisplayMargin} />
      <Button image="grid" active={displayGrid} action={toggleDisplayGrid} />
      <Button image="magnet" active={snapToGrid} action={toggleSnapToGrid} />
    </div>
  )
}