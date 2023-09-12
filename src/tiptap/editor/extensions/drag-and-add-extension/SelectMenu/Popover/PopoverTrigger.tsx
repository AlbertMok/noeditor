import { cloneElement, forwardRef, isValidElement } from 'react';
import { usePopoverContext } from './use-popover-context';
import { useMergeRefs } from '@floating-ui/react';

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const PopoverTrigger = forwardRef<HTMLElement, React.HTMLProps<HTMLElement> & PopoverTriggerProps>(
  function PopoverTrigger({ children, asChild = false, ...props }, propRef) {
    const context = usePopoverContext();
    const childrenRef = (children as any).ref;
    const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

    // `asChild` allows the user to pass any element as the anchor
    if (asChild && isValidElement(children)) {
      return cloneElement(
        children,
        context.getReferenceProps({
          ref,
          ...props,
          ...children.props,
          'data-state': context.open ? 'open' : 'closed'
        })
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        // The user can style the trigger based on the state
        data-state={context.open ? 'open' : 'closed'}
        {...context.getReferenceProps(props)}
      >
        {children}
      </button>
    );
  }
);
