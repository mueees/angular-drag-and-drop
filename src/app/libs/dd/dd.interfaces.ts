export interface IDroppable {
  onDragEnter(event: DragEvent);
  onDragLeave(event: DragEvent);
  onDragOver(event: DragEvent);
  onDrop(event: DragEvent);
}

export interface IDraggable {
  onDragStart(event: DragEvent);
  onDragEnd(event: DragEvent);
}

export interface IOnDropListOptions {
  event: DragEvent;
  transferData: any;
  insertIndex: number;
  draggableType: string;
}
