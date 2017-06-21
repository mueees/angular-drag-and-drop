import { Directive, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { DraggbaleDirective } from './draggbale.directive';
import { IDraggable } from './dd.interfaces';
import { DD } from './dd.constant';
@Directive({
  selector: '[dd-draggable-list-item]'
})
export class DraggableListItemDirective extends DraggbaleDirective implements IDraggable {
  @Input('dd-type') draggableType: string = '';
  @Input('dd-data') data: any = {};

  @Output('dd-dragstart') dragstartEvent: any = new EventEmitter<any>();

  elementNode: HTMLElement;

  constructor(private renderer2: Renderer2, private elementRef: ElementRef) {
    super();

    this.elementNode = elementRef.nativeElement;

    renderer2.setAttribute(this.elementNode, 'draggable', 'true');
  }

  onDragStart(event: DragEvent) {
    console.log('dd-draggable-list-item')
    event.stopPropagation();

    // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/effectAllowed
    // Define effects which user could set in dragenter, dragover events
    event.dataTransfer.effectAllowed = 'copyMove';

    event.dataTransfer.setData(this.getMimeType(), JSON.stringify(this.data));

    this.addDraggingClasses();

    // set proper drag image if triggered on a draggable handle
    if (event[DD.draggableHandleMarker] && event.dataTransfer['setDragImage']) {
      event.dataTransfer['setDragImage'](this.elementNode, 0, 0);
    }

    this.dragstartEvent.next(event);
  }

  onDragEnd(event: DragEvent) {
    this.removeDraggingClasses();
  }

  private removeDraggingClasses() {
    this.renderer2.removeClass(this.elementNode, DD.draggingClass);
    this.renderer2.removeClass(this.elementNode, DD.draggingSourceClass);
  }

  private addDraggingClasses() {
    this.renderer2.addClass(this.elementNode, DD.draggingClass);
    this.renderer2.addClass(this.elementNode, DD.draggingSourceClass);
  }

  private getMimeType() {
    return DD.mimeType + (this.draggableType ? ('-' + this.draggableType) : '');
  }
}
