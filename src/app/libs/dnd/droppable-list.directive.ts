import {Directive, ElementRef, EventEmitter, Input, Output} from "@angular/core";
import {DroppableDirective} from "./droppable.directive";
import {IDroppable} from "./dnd.interfaces";
import {DD} from "./dd.constant";

/**
 * @description
 *
 * */
@Directive({
    selector: '[vm-droppable-list]'
})
export class DroppableListDirective extends DroppableDirective implements IDroppable {
    @Output('dd-dropped') droppedEvent: any = new EventEmitter<any>();

    @Input('dd-allowed-types') allowedTypes: string[] = [];
    @Input('dd-drop') dropCallback: Function;
    @Input('dd-dragover') dragOverCallback: Function;

    private placeholderNode: HTMLElement;

    listNode: HTMLElement;

    constructor(public elementRef: ElementRef) {
        super(elementRef);

        this.listNode = elementRef.nativeElement;

        this.placeholderNode = document.createElement('LI');
        this.placeholderNode.innerText = 'placeholder';
    }

    onDragEnter(event: DragEvent) {
        event.preventDefault();
    }

    onDragOver(event: DragEvent) {
        // Set dropEffect to modify the cursor shown by the browser, unless we're in IE, where this
        // is not supported. This must be done after preventDefault in Firefox.
        event.preventDefault();

        let mimeType = this.getMimeType(event.dataTransfer.types);
        let draggableType = this.getType(mimeType);

        if (!this.isDropAllowed(draggableType)) {
            return false;
        }

        let insertIndex;

        if (this.isListEmpty()) {
            insertIndex = 0;

            // user can cancel drop operation
            if (this.dragOverCallback && !this.dragOverCallback(event, draggableType, insertIndex)) {
                this.stopDragOperation();
            } else {
                this.listNode.appendChild(this.placeholderNode);
            }

            return true;
        }

        if (!this.isOnlyPlaceholderInList()) {
            let listItemNode = this.findListItemNode(event.target);

            if (listItemNode && !this.isPlaceholderNode(listItemNode)) {
                const isFirstHalf = this.isHoverAboveTopHalf(listItemNode, event.clientY);

                const listNodeIndex = this.getListItemIndex(listItemNode);

                let placeholderInsertIndex;

                if (isFirstHalf) {
                    placeholderInsertIndex = listNodeIndex === 0 ? 0 : listNodeIndex - 1;
                } else {
                    placeholderInsertIndex = listNodeIndex + 1;
                }

                if (placeholderInsertIndex !== this.getPlaceholderIndex()) {
                    if (this.dragOverCallback && !this.dragOverCallback(event, draggableType, placeholderInsertIndex)) {
                        this.stopDragOperation();

                        return true;
                    } else {
                        this.listNode.insertBefore(this.placeholderNode, isFirstHalf ? listItemNode : listItemNode.nextSibling);
                    }
                }
            }
        }
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        let mimeType = this.getMimeType(event.dataTransfer.types);
        let draggableType = this.getType(mimeType);

        if (!this.isDropAllowed(draggableType)) {
            this.stopDragOperation();

            return true;
        }

        let transferData = null;

        try {
            transferData = JSON.parse(event.dataTransfer.getData(mimeType));
        } catch (e) {
        }

        let insertIndex = this.findListItemNode(event.target) ? this.getPlaceholderIndex() : 0;

        // user can cancel drop operation
        if (this.dropCallback && !this.dropCallback(event, transferData, draggableType, insertIndex)) {
            this.stopDragOperation();

            return true;
        }

        this.droppedEvent.next({
            event: event,
            transferData: transferData,
            draggableType: draggableType,
            insertIndex: insertIndex
        });

        this.stopDragOperation();
    }

    onDragLeave(event: DragEvent) {
        this.stopDragOperation();
    }

    private stopDragOperation() {
        this.removePlaceHolder();

        return true;
    }

    private getType(mimeType: string) {
        const mimeTypePrefix = DD.mimeType + '-';

        return mimeType ? mimeType.slice(mimeTypePrefix.length) : null;
    }

    private getMimeType(types: string[]) {
        for (let i = 0; i < types.length; i++) {
            if (types[i].substr(0, DD.mimeType.length) === DD.mimeType) {
                return types[i];
            }
        }

        return null;
    }

    private isDropAllowed(draggableType: string) {
        if (this.allowedTypes.length === 0) {
            return true;
        } else {
            return this.allowedTypes.indexOf(draggableType) !== -1;
        }
    }

    private isHoverAboveTopHalf(listItemNode, yCoordinate) {
        const rect = listItemNode.getBoundingClientRect();

        return yCoordinate < rect.top + rect.height / 2;
    }

    private isListEmpty() {
        return this.listNode.children.length === 0;
    }

    private isOnlyPlaceholderInList() {
        return this.listNode.children.length === 1 && this.isPlaceholderShown();
    }

    private isPlaceholderShown() {
        return this.listNode.contains(this.placeholderNode);
    }

    private isPlaceholderNode(element) {
        return this.placeholderNode === element;
    }

    private removePlaceHolder() {
        this.placeholderNode.remove();
    }

    private findListItemNode(targetElement) {
        let listItemNode = null;

        if (targetElement !== this.listNode) {
            listItemNode = targetElement;

            while (listItemNode.parentNode !== this.listNode && listItemNode.parentNode) {
                listItemNode = listItemNode.parentNode;
            }
        }

        return listItemNode;
    }

    private getPlaceholderIndex() {
        return this.getListItemIndex(this.placeholderNode);
    }

    private getListItemIndex(listItemNode) {
        return Array.prototype.indexOf.call(this.listNode.children, listItemNode);
    }
}