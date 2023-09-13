import { Extension } from '@tiptap/core';
import { dragAND } from './DragAndAdd';

interface DragAndDropOptions {}

const DragAndDrop = Extension.create<DragAndDropOptions>({
  name: 'dragAndDrop',

  addProseMirrorPlugins() {
    return [
      // DragHandle({
      //   dragHandleWidth: 24
      // })
      dragAND
    ];
  }
});

export default DragAndDrop;
