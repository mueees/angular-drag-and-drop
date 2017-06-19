import {Directive, ElementRef, HostListener} from "@angular/core";

@Directive({
    selector: '[vm-droppable]'
})
export class DroppableDirective {
    private isLogging: boolean = false;
    private isDragElementOverDropzone: boolean = false;

    @HostListener('dragenter', ['$event']) dragEnter(event: DragEvent) {
        this.log('Droppable Directive: enter');

        event.preventDefault();

        if (!this.isDragElementOverDropzone) {
            this.isDragElementOverDropzone = true;

            this.callCallback('onDragEnter', event);
        }
    }

    @HostListener('dragleave', ['$event']) dragLeave(event: DragEvent) {
        this.log('Droppable Directive: leave');

        event.preventDefault();

        if (!this.isOverElement(event)) {
            this.isDragElementOverDropzone = false;

            this.callCallback('onDragLeave', event);
        }
    }

    @HostListener('drop', ['$event']) drop(event: DragEvent) {
        this.log('Droppable Directive: drop');

        event.preventDefault();

        this.callCallback('onDrop', event);
    }

    @HostListener('dragover', ['$event']) dragOver(event: DragEvent) {
        this.log('Droppable Directive: over');

        event.preventDefault();

        this.callCallback('onDragOver', event);
    }

    constructor(public elementRef: ElementRef) {
    }

    public isOverElement(event: DragEvent) {
        const newTargetNodes = document.elementFromPoint(event.clientX, event.clientY);

        return this.elementRef.nativeElement.contains(newTargetNodes);
    }

    private log(message) {
        if (this.isLogging) {
            console.log(message);
        }
    }

    private callCallback(methodName, event: DragEvent) {
        this[methodName](event);
    }
}