import { forwardRef, useLayoutEffect } from 'react';
import { usePopoverContext } from './use-popover-context';
import { useId } from '@floating-ui/react';

export const PopoverDescription = forwardRef<HTMLParagraphElement, React.HTMLProps<HTMLParagraphElement>>(
  function PopoverDescription(props, ref) {
    const { setDescriptionId } = usePopoverContext();
    const id = useId();

    // Only sets `aria-describedby` on the Popover root element
    // if this component is mounted inside it.
    useLayoutEffect(() => {
      setDescriptionId(id);
      return () => setDescriptionId(undefined);
    }, [id, setDescriptionId]);

    return <p {...props} ref={ref} id={id} />;
  }
);
