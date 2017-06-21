import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { DraggbaleDirective } from './draggbale.directive';
import { DD } from './dd.constant';
@Directive({
  selector: '[dd-draggable-handle]'
})
export class DraggableHandleDirective extends DraggbaleDirective {
  private elementNode: HTMLElement;

  constructor(private renderer2: Renderer2, private elementRef: ElementRef) {
    super();

    this.elementNode = elementRef.nativeElement;

    renderer2.setAttribute(this.elementNode, 'draggable', 'true');
  }

  onDragStart(event) {
    console.log(`dd-draggable-handle`)
    event[DD.draggableHandleMarker] = true;
  }

  onDragEnd(event) {
    event[DD.draggableHandleMarker] = true;
  }

}
