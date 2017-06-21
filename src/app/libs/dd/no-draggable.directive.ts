import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { DraggbaleDirective } from './draggbale.directive';
import { DD } from './dd.constant';
@Directive({
  selector: '[dd-no-draggable]'
})
export class NoDraggableDirective extends DraggbaleDirective {
  private elementNode: HTMLElement;

  constructor(private renderer2: Renderer2, private elementRef: ElementRef) {
    super();

    this.elementNode = elementRef.nativeElement;

    renderer2.setAttribute(this.elementNode, 'draggable', 'true');
  }

  onDragStart(event) {
    console.log('dd-no-draggable')

    if (!event[DD.draggableHandleMarker]) {
      if (!(event.dataTransfer.types && event.dataTransfer.types.length)) {
        event.preventDefault();
      }

      event.stopPropagation();
    }
  }

  onDragEnd(event) {

  }
}
