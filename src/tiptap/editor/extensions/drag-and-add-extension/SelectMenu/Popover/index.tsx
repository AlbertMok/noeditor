import * as React from 'react';
import { PopoverOptions, usePopover } from './use-popover';
import { usePopoverContext } from './use-popover-context';

export function Popover({ children, modal = false, ...restOptions }: { children: React.ReactNode } & PopoverOptions) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const popover = usePopover({ modal, ...restOptions });
  const PopoverContext = usePopoverContext();
  return <PopoverContext.Provider value={popover}>{children}</PopoverContext.Provider>;
}
