import { forwardRef } from 'react';
import { usePopoverContext } from './use-popover-context';
import { FloatingFocusManager, FloatingPortal, useMergeRefs } from '@floating-ui/react';

export const PopoverContent = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(function PopoverContent(
  { style, ...props },
  propRef
) {
  const { context: floatingContext, ...context } = usePopoverContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!floatingContext.open) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={floatingContext} modal={context.modal}>
        <div
          ref={ref}
          style={{ ...context.floatingStyles, ...style }}
          aria-labelledby={context.labelId}
          aria-describedby={context.descriptionId}
          {...context.getFloatingProps(props)}
        >
          {props.children}
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
});
