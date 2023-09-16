import { EditorView } from '@tiptap/pm/view';

// 计算指定 DOM 元素的绝对位置和宽度，在拖拽操作的上下文中，这个函数可能用于确定拖拽操作的起始位置或用于计算拖拽元素的位置。
export function absoluteRect(node: Element) {
  // getBoundingClientRect() 方法获取该 DOM 元素相对于视口的位置和尺寸信息。
  const data = node.getBoundingClientRect();

  // 将该信息包装到一个对象中，该对象包括了 top（元素顶部相对于视口的垂直位置）、left（元素左侧相对于视口的水平位置）、以及 width（元素的宽度）等属性。
  return {
    top: data.top,
    left: data.left,
    width: data.width
  };
}

/**
 * nodeDOMAtCoords 函数的目的是根据坐标位置找到与编辑器内容相关的合适的 DOM 元素。
 * coord翻译：坐标（coordinate的缩写）其主要用途是根据给定的坐标位置 { x: number; y: number } 来查找并返回位于该坐标位置下的 DOM 元素
 * 这在实现拖拽或点击选择操作时非常有用，因为它可以帮助确定鼠标或拖拽操作的目标节点，从而实现相应的编辑器行为。
 * @param coords 目标DOM的坐标
 * @returns
 */
export function nodeDOMAtCoords(coords: { x: number; y: number }) {
  return document
    .elementsFromPoint(coords.x, coords.y) //document.elementsFromPoint(x, y) 是 JavaScript 中的一个方法，允许你获取位于网页上特定点 (x, y) 处的所有 HTML 元素。它返回一个类似数组的对象，其中包含该特定位置上的所有元素，最上层的元素位于集合的第一个位置。
    .find(
      (elem: Element) =>
        elem.parentElement?.matches?.('.ProseMirror') ||
        elem.matches(['li', 'p:not(:first-child)', 'pre', 'blockquote', 'h1, h2, h3, h4, h5, h6'].join(', '))
    );
}

/**
 *
 * 将页面上的 DOM 元素映射到编辑器文档中的位置。
 * 这在处理拖拽或点击事件时非常有用，因为它可以帮助确定事件发生的位置在编辑器文档中的具体位置，
 * 从而执行相应的编辑器操作，例如选中特定的文本或节点。
 * @param node
 * @param view
 * @returns
 */
export function nodePosAtDOM(node: Element, view: EditorView) {
  // 使用 getBoundingClientRect() 方法获取给定 DOM 元素的边界框信息，
  // 包括左上角的坐标 (boundingRect.left 和 boundingRect.top)。
  const boundingRect = node.getBoundingClientRect();
  // console.log(boundingRect);
  // 将 DOM 元素的左上角坐标作为参数传递。这个方法会根据坐标位置返回编辑器文档中的一个位置。
  // posAtCoords会根据坐标位置返回编辑器文档中的DOM元素
  // 最后返回这个DOM元素的
  // Given a pair of viewport coordinates, return the document position that corresponds to them
  return view.posAtCoords({
    left: boundingRect.left + 3,
    top: boundingRect.top + 3
  })?.inside;
}
