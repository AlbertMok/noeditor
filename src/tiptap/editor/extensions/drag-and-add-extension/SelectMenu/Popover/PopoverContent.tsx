import { forwardRef, useLayoutEffect } from 'react';
import { usePopoverContext } from './use-popover-context';
import { FloatingFocusManager, FloatingPortal, useId, useMergeRefs } from '@floating-ui/react';

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
