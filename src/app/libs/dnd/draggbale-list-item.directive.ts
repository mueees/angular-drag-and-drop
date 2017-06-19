import {Directive, Input, Output, EventEmitter, Renderer2, ElementRef} from "@angular/core";
import {DraggbaleDirective} from "./draggbale.directive";
import {IDraggable} from "./dnd.interfaces";
import {DD} from "./dd.constant";
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
        event.dataTransfer.setData(this.getMimeType(), JSON.stringify(this.data));

        this.addDraggingClasses();

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