import { Extension } from '@tiptap/core';
import { DragHandle } from './DragAndAdd';

interface DragAndDropOptions {}

const DragAndDrop = Extension.create<DragAndDropOptions>({
  name: 'dragAndDrop',

  addProseMirrorPlugins() {
    return [
      DragHandle({
        dragHandleWidth: 24
      })
    ];
  }
});

export default DragAndDrop;
