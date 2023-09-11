import { Ref, useEffect } from 'react';

type ButtonProps = {
  clickEvent: any;
  dragEvent: any;
  isHidden: boolean;
  className_: string;
  type: string;
  reference: Ref<HTMLDivElement>;
};

export function HadleElement(props: ButtonProps) {
  const classNames = `${props.className_} ${props.isHidden ? 'hide' : ''}`;

  const { dragEvent, clickEvent, reference } = props;

  useEffect(() => {
    // 创建按钮
    const addHandleElement = document.createElement('div');
    addHandleElement.draggable = true;
    addHandleElement.dataset.addHandle = '';
    addHandleElement.classList.add('add-handle');

    // 添加dragstart事件监听器
    addHandleElement.addEventListener('dragstart', dragEvent);

    // 添加click事件监听器
    addHandleElement.addEventListener('click', clickEvent);
  }, [dragEvent, clickEvent]);

  return <div ref={reference} className={classNames}></div>;
}
