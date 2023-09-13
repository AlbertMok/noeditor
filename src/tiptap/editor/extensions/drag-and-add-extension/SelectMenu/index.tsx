import { Popover, PopoverClose, PopoverContent, PopoverDescription, PopoverHeading, PopoverTrigger } from './Popover';

export function SelectMenu() {
  return (
    <div id="add-handle">
      <Popover>
        {/* 触发开关 */}
        <PopoverTrigger>as</PopoverTrigger>
        {/*  */}
        <PopoverContent className="Popover">
          <PopoverHeading>My popover heading</PopoverHeading>
          <PopoverDescription>My popover description</PopoverDescription>
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>
    </div>
  );
}
