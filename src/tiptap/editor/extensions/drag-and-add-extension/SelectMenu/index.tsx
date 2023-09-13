import { Popover } from './Popover';
import { PopoverClose, PopoverContent, PopoverDescription } from './Popover/PopoverContent';
import { PopoverHeading } from './Popover/PopoverHeading';
import { PopoverTrigger } from './Popover/PopoverTrigger';
import './style.scss';
export function SelectMenu() {
  return (
    <div id="add-handle">
      <Popover>
        <PopoverTrigger>as</PopoverTrigger>
        <PopoverContent className="Popover">
          <PopoverHeading>My popover heading</PopoverHeading>
          <PopoverDescription>My popover description</PopoverDescription>
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>
    </div>
  );
}
