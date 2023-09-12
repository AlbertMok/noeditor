import { forwardRef } from 'react';
import { usePopoverContext } from './use-popover-context';

export const PopoverClose = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  function PopoverClose(props, ref) {
    const { setOpen } = usePopoverContext();
    return (
      <button
        type="button"
        ref={ref}
        {...props}
        onClick={(event) => {
          props.onClick?.(event);
          setOpen(false);
        }}
      />
    );
  }
);
