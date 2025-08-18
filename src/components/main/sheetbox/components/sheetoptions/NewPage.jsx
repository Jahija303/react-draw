import { useSetRecoilState }                                        from 'recoil';
import Button from  "../../../toolbar/components/Button"
import { numberOfPagesSelector }                                    from '../../../../../state/DocumentState';

export const NewPage = () => {
  const addPage = useSetRecoilState(numberOfPagesSelector)

  return (
    <Button image="add" action={addPage} firstInGroup>
      <span>New Page</span>
      <Button image="drop-up" action="Toggle new page drop up" />
    </Button>
  )
}