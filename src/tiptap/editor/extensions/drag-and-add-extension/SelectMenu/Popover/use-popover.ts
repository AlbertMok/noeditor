import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useHover,
  Placement,
  safePolygon
} from '@floating-ui/react';
import { useMemo, useState } from 'react';

export interface PopoverOptions {
  initialOpen?: boolean;
  placement?: Placement;
  modal?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function usePopover({
  initialOpen = false,
  placement = 'bottom',
  modal,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: PopoverOptions = {}): any {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);
  const [labelId, setLabelId] = useState<string | undefined>();
  const [descriptionId, setDescriptionId] = useState<string | undefined>();

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'end',
        padding: 5
      }),
      shift({ padding: 5 })
    ]
  });

  const context = data.context;

  const click = useClick(context, {
    enabled: controlledOpen == null
  });

  const dismiss = useDismiss(context);

  const role = useRole(context);

  const hover = useHover(context, {
    enabled: true,
    move: true,
    handleClose: safePolygon({
      blockPointerEvents: true
    })
  });

  const interactions = useInteractions([click, dismiss, role, hover]);

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      modal,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId
    }),
    [open, setOpen, interactions, data, modal, labelId, descriptionId]
  );
}