type ButtonProps = {
  clickEvent: any;
  dragEvent: any;
  isHidden: boolean;
  className_: any;
  type: string;
};

export function HadleElement(props: ButtonProps) {
  const classNames = `${props.className_} ${props.isHidden ? 'hide' : ''}`;
  return (
    <div
      onClick={(event) => {
        props.clickEvent(event);
      }}
      className={classNames}
      onDrag={props.dragEvent}
      {...props}
    ></div>
  );
}
