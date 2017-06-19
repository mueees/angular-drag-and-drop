import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[dd-draggable]'
})
export class DraggbaleDirective {
  @HostListener('dragstart', ['$event']) dragStart(event: DragEvent) {
    this.callCallback('onDragStart', event);
  }

  @HostListener('dragend', ['$event']) dragEnd(event) {
    this.callCallback('onDragEnd', event);
  }

  private callCallback(methodName, event: DragEvent) {
    this[methodName](event);
  }
}
