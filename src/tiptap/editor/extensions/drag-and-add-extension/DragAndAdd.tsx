// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { __serializeForClipboard, EditorView } from '@tiptap/pm/view';
import { NodeSelection, Plugin } from '@tiptap/pm/state';
import { absoluteRect, nodeDOMAtCoords, nodePosAtDOM } from './util';

export interface DragHandleOptions {
  // 拉按钮的宽度
  dragHandleWidth: number;
}

// export function DragHandle(options: DragHandleOptions) {
//   return;
// }

export function setDragHandleWidth(optionss: DragHandleOptions) {
  options.dragHandleWidth = optionss.dragHandleWidth;
}

const options = {
  dragHandleWidth: 24
};

// 此函数在拖动操作开始时调用。它设置在拖动操作期间传输的数据，设置自定义拖动图像，并记录正在拖动的内容片段。
function handleDragStart(event: DragEvent, view: EditorView) {
  view.focus();

  if (!event.dataTransfer) return;

  // 获取选中的文本节点
  const node = nodeDOMAtCoords({
    x: event.clientX + 50 + options.dragHandleWidth,
    y: event.clientY
  });

  if (!(node instanceof Element)) return;

  const nodePos = nodePosAtDOM(node, view);
  if (nodePos == null || nodePos < 0) return;

  // 设置为选中的节点
  view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, nodePos)));

  const slice = view.state.selection.content();
  const { dom, text } = __serializeForClipboard(view, slice);

  event.dataTransfer.clearData();
  event.dataTransfer.setData('text/html', dom.innerHTML);
  event.dataTransfer.setData('text/plain', text);
  event.dataTransfer.effectAllowed = 'copyMove'; //允许 copy 或者 move 操作。

  event.dataTransfer.setDragImage(node, 0, 0);

  view.dragging = { slice, move: event.ctrlKey };
}

// 此函数在单击事件发生时调用。它将焦点设置到编辑器并选择鼠标点击位置下的节点。
function handleClick(event: MouseEvent, view: EditorView) {
  view.focus();

  view.dom.classList.remove('dragging');

  const node = nodeDOMAtCoords({
    x: event.clientX + 50 + options.dragHandleWidth,
    y: event.clientY
  });

  if (!(node instanceof Element)) return;

  const nodePos = nodePosAtDOM(node, view);
  if (!nodePos) return;

  view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, nodePos)));
}

// 显示拖动手柄
function showDragHandle() {
  if (dragHandleElement) {
    dragHandleElement.classList.remove('hidden');
  }

  // 显示添加按钮
  if (addHandleElement) {
    addHandleElement.classList.remove('hidden');
  }
}

//隐藏拖动手柄
function hideDragHandle() {
  if (dragHandleElement) {
    dragHandleElement.classList.add('hidden');
  }
  if (addHandleElement) {
    addHandleElement.classList.add('hidden');
  }
}

let dragHandleElement: HTMLElement | null = null;
let addHandleElement: HTMLElement | null = null;

export const dragAND = new Plugin({
  view: (view) => {
    dragHandleElement = document.createElement('div');

    dragHandleElement.draggable = true;
    // dragHandle会驼峰式转换为 drag-handle
    dragHandleElement.dataset.dragHandle = '';
    dragHandleElement.classList.add('drag-handle');

    // 添加按钮
    addHandleElement = document.createElement('div');
    addHandleElement.draggable = true;
    addHandleElement.id = 'add-handle';
    addHandleElement.dataset.addHandle = '';
    addHandleElement.classList.add('add-handle');

    // 默认隐藏drag按钮
    hideDragHandle();
    dragHandleElement?.addEventListener('dragstart', (event) => {
      handleDragStart(event, view);
    });
    dragHandleElement?.addEventListener('click', (event) => {
      handleClick(event, view);
    });
    addHandleElement?.addEventListener('dragstart', (event) => {
      handleDragStart(event, view);
    });
    addHandleElement?.addEventListener('click', (event) => {
      handleClick(event, view);
    });
    // 添加拉按钮
    view?.dom?.parentElement?.appendChild(dragHandleElement as HTMLElement);

    // 添加plus按钮
    view?.dom?.parentElement?.appendChild(addHandleElement as HTMLElement);

    return {
      destroy: () => {
        dragHandleElement?.remove?.();
        dragHandleElement = null;
        // plus按钮
        addHandleElement?.remove?.();
        addHandleElement = null;
      }
    };
  },
  props: {
    handleDOMEvents: {
      /**
       * 它在用户在网页上移动鼠标时触发。这个事件通常与鼠标的位置相关联，你可以使用它来检测鼠标的位置，并根据鼠标的移动来执行相应的操作。
       * @param view
       * @param event
       * @returns
       */
      mousemove: (view, event) => {
        if (!view.editable) {
          return;
        }

        // 寻找鼠标对应的文本节点
        const node = nodeDOMAtCoords({
          x: event.clientX + 50 + options.dragHandleWidth,
          y: event.clientY
        });

        // 修复：如果是ul 或者 ol ，拉拽的图标会出现在左上角
        if (!(node instanceof Element) || node.matches('ul, ol')) {
          hideDragHandle();
          return;
        }

        // 获取节点样式
        const compStyle = window.getComputedStyle(node);
        const lineHeight = parseInt(compStyle.lineHeight, 10);
        const paddingTop = parseInt(compStyle.paddingTop, 10);

        // absoluteRect(node) 来获取该元素在页面中的绝对位置信息（包括左上角的坐标和宽度、高度等信息），将这些信息存储在 rect 变量中
        const rect = absoluteRect(node);

        // 实现垂直居中
        rect.top += (lineHeight - 24) / 2;
        rect.top += paddingTop;

        // lii markers
        if (node.matches('ul:not([data-type=taskList]) li, ol li')) {
          rect.left -= options.dragHandleWidth;
        }
        rect.width = options.dragHandleWidth;

        if (!dragHandleElement || !addHandleElement) return;

        dragHandleElement.style.left = `${rect.left - rect.width}px`;
        dragHandleElement.style.top = `${rect.top}px`;

        addHandleElement.style.left = `${rect.left - rect.width - 24}px`;
        addHandleElement.style.top = `${rect.top}px`;
        showDragHandle();
      },

      keydown: () => {
        hideDragHandle();
      },

      mousewheel: () => {
        hideDragHandle();
      },

      // dragging class is used for CSS
      dragstart: (view) => {
        view.dom.classList.add('dragging');
      },
      drop: (view) => {
        view.dom.classList.remove('dragging');
      },
      dragend: (view) => {
        view.dom.classList.remove('dragging');
      }
    }
  }
});

export function sad() {
  return;
}
