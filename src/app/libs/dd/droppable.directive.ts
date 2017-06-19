import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[dd-droppable]'
})
export class DroppableDirective {
  private isDragElementOverDropzone: boolean;

  @HostListener('dragenter', ['$event']) dragEnter(event: DragEvent) {
    event.preventDefault();

    if (!this.isDragElementOverDropzone) {
      this.isDragElementOverDropzone = true;

      this.callCallback('onDragEnter', event);
    }
  }

  @HostListener('dragleave', ['$event']) dragLeave(event: DragEvent) {
    event.preventDefault();

    this.callCallback('onDragLeave', event);

    if (!this.isOverElement(event)) {
      this.isDragElementOverDropzone = false;

      this.callCallback('onDragLeaveDropZone', event);
    }
  }

  @HostListener('drop', ['$event']) drop(event: DragEvent) {
    event.preventDefault();

    this.callCallback('onDrop', event);
  }

  @HostListener('dragover', ['$event']) dragOver(event: DragEvent) {
    event.preventDefault();

    this.callCallback('onDragOver', event);
  }

  constructor(public elementRef: ElementRef) {
  }

  public isOverElement(event: DragEvent) {
    const newTargetNodes = document.elementFromPoint(event.clientX, event.clientY);

    // looks in depth
    return this.elementRef.nativeElement.contains(newTargetNodes);
  }

  private callCallback(methodName, event: DragEvent) {
    this[methodName](event);
  }
}
