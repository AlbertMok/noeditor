import { Editor } from '@tiptap/core';
import { useEffect, useRef, useState } from 'react';
import { absoluteRect, nodeDOMAtCoords, nodePosAtDOM } from './util';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { __serializeForClipboard, EditorView } from '@tiptap/pm/view';
import { NodeSelection } from '@tiptap/pm/state';
import { SelectMenu } from './SelectMenu';

type DragButtonOptions = {
  _editor: Editor;
  handleWidth: number;
};

export const DragAndPlusButton = ({ _editor: editor, handleWidth: dragHandleWidth }: DragButtonOptions) => {
  const [isHidden, setIsHidden] = useState(true);

  function showDragHandle() {
    setIsHidden(false);
  }

  function hideDragHandle() {
    setIsHidden(true);
  }

  const dragStyleLeft = useRef<string>('');
  const dragStyleTop = useRef<string>('');
  const addStyleLeft = useRef<string>('');
  const addStyleTop = useRef<string>('');
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const addHandleRef = useRef<HTMLDivElement>(null);
  // 消除副作用
  useEffect(() => {
    // 开始拉的时候
    function handleDragStart(event: DragEvent, view: EditorView) {
      view.focus();

      if (!event.dataTransfer) return;

      // 获取选中的文本节点
      const node = nodeDOMAtCoords({
        x: event.clientX + 50 + dragHandleWidth,
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

    //   点击
    // 此函数在单击事件发生时调用。它将焦点设置到编辑器并选择鼠标点击位置下的节点。
    function handleClick(event: MouseEvent, view: EditorView) {
      view.focus();

      view.dom.classList.remove('dragging');
      const node = nodeDOMAtCoords({
        x: event.clientX + 50 + dragHandleWidth,
        y: event.clientY
      });

      if (!(node instanceof Element)) return;

      const nodePos = nodePosAtDOM(node, view);
      if (!nodePos) return;
      view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, nodePos)));
    }

    addEventListener('mousemove', (event) => {
      // 寻找鼠标对应的文本节点
      const node = nodeDOMAtCoords({
        x: event.clientX + 50 + dragHandleWidth,
        y: event.clientY
      });

      // 修复：如果是ul 或者 ol ，拉拽的图标会出现在左上角
      if (!(node instanceof Element) || node.matches('ul, ol')) {
        hideDragHandle();
        return false;
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
        rect.left -= dragHandleWidth;
      }
      rect.width = dragHandleWidth;

      if (dragHandleRef.current && addHandleRef.current) {
        // drag button
        dragHandleRef.current.style.left = `${rect.left - rect.width}px`;
        dragHandleRef.current.style.top = `${rect.top}px`;

        // add button
        addHandleRef.current.style.left = `${rect.left - rect.width - 24}px`;
        addHandleRef.current.style.top = `${rect.top}px`;
      }
      showDragHandle();
    });

    // 滚轮事件
    addEventListener('wheel', () => {
      hideDragHandle();
    });

    // 键盘事件
    addEventListener('keydown', () => {
      hideDragHandle();
    });

    dragHandleRef.current?.addEventListener('dragstart', (event) => {
      handleDragStart(event, editor.view);
      console.log('拉着ing');
    });

    dragHandleRef.current?.addEventListener('click', (event) => {
      handleClick(event, editor.view);
    });

    addEventListener('dragstart', () => {
      editor.view.dom.classList.add('dragging');
    });

    addEventListener('drop', () => {
      editor.view.dom.classList.remove('dragging');
    });

    addEventListener('dragend', () => {
      editor.view.dom.classList.remove('dragging');
    });
  }, [editor, dragHandleWidth, dragHandleRef]);
  function isEditable() {
    if (!editor.view.editable) {
      return false;
    }
    return true;
  }
  const addClassNames = `add-handle ${isHidden ? 'hide' : ''}`;
  const dragClassNames = `drag-handle ${isHidden ? 'hide' : ''}`;

  return (
    <div className="toc">
      {isEditable() && (
        <>
          <SelectMenu />
          <div
            ref={addHandleRef}
            className={addClassNames}
            style={{ top: addStyleTop.current, left: addStyleLeft.current }}
          ></div>
          <div
            ref={dragHandleRef}
            className={dragClassNames}
            style={{ top: dragStyleTop.current, left: dragStyleLeft.current }}
            draggable={true}
          ></div>
        </>
      )}
    </div>
  );
};
