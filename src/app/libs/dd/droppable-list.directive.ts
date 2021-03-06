import { Directive, ElementRef, Input } from '@angular/core';
import { DroppableDirective } from './droppable.directive';
import { IDroppable } from './dd.interfaces';
import { DD } from './dd.constant';

/**
 * @description
 * */
@Directive({
  selector: '[dd-droppable-list]'
})
export class DroppableListDirective extends DroppableDirective implements IDroppable {
  @Input('dd-droppable-list') itemList: any[];
  @Input('dd-allowed-types') allowedTypes: string[] = [];
  @Input('dd-drop') dropCallback: Function;
  @Input('dd-dragover') dragOverCallback: Function;

  private effectMap: any = {
    'none': 'none',
    'copy': 'copy',
    'copyMove': 'move',
    'copyLink': 'link',
    'link': 'link',
    'linkMove': 'move',
    'move': 'move',
    'all': 'move'
  };

  private placeholderNode: HTMLElement;

  private listNode: HTMLElement;

  static getType(mimeType: string) {
    const mimeTypePrefix = DD.mimeType + '-';

    return mimeType ? mimeType.slice(mimeTypePrefix.length) : null;
  }

  static getMimeType(types: string[]) {
    for (let i = 0; i < types.length; i++) {
      if (types[i].substr(0, DD.mimeType.length) === DD.mimeType) {
        return types[i];
      }
    }

    return null;
  }

  static isHoverAboveTopHalf(listItemNode, yCoordinate) {
    const rect = listItemNode.getBoundingClientRect();

    return yCoordinate < rect.top + rect.height / 2;
  }

  constructor(public elementRef: ElementRef) {
    super(elementRef);

    this.listNode = elementRef.nativeElement;
    this.listNode[DD.droppableListMarker] = true;

    this.placeholderNode = document.createElement('LI');
    this.placeholderNode.innerText = 'placeholder';
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();

    event.dataTransfer.dropEffect = this.getDropEffect(event.dataTransfer.effectAllowed);
  }

  onDragOver(event: DragEvent) {
    // Set dropEffect to modify the cursor shown by the browser, unless we're in IE, where this
    // is not supported. This must be done after preventDefault in Firefox.
    event.preventDefault();

    // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect
    const mimeType = DroppableListDirective.getMimeType(event.dataTransfer.types);
    const draggableType = DroppableListDirective.getType(mimeType);

    if (!mimeType || !this.isDropAllowed(event, draggableType)) {
      event.dataTransfer.dropEffect = DD.dropEffect.none;

      this.stopDragOperation();

      return true;
    }

    event.dataTransfer.dropEffect = this.getDropEffect(event.dataTransfer.effectAllowed);

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
      const listItemNode = this.findListItemNode(event.target);

      if (listItemNode && !this.isPlaceholderNode(listItemNode)) {
        const isFirstHalf = DroppableListDirective.isHoverAboveTopHalf(listItemNode, event.clientY);

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

    const mimeType = DroppableListDirective.getMimeType(event.dataTransfer.types);
    const draggableType = DroppableListDirective.getType(mimeType);

    if (!mimeType || !this.isDropAllowed(event, draggableType)) {
      this.stopDragOperation();

      return true;
    }

    let transferData = null;

    try {
      transferData = JSON.parse(event.dataTransfer.getData(mimeType));
    } catch (e) {
    }

    const insertIndex = this.findListItemNode(event.target) ? this.getPlaceholderIndex() : 0;

    if (this.dropCallback) {
      const dropResult = this.dropCallback(event, transferData, draggableType, insertIndex);

      switch (true) {
        case dropResult === true:
          // do nothing, drop is allowed but user will take care of inserting the element
          break;
        case dropResult === false:
          // do nothing, user cancel drop operation
          break;
        default:
          // consider dropResult as the item that should be inserted in the list
          if (this.isUserPassesItemList()) {
            this.itemList.splice(insertIndex, 0, transferData);
          }

          break;
      }
    } else {
      if (this.isUserPassesItemList()) {
        this.itemList.splice(insertIndex, 0, transferData);
      }
    }

    this.stopDragOperation();
  }

  onDragLeave() {
  }

  onDragLeaveDropZone() {
    this.stopDragOperation();
  }

  isOverNesterDropZone(event) {
    let nestedDropZone = null;

    let newTargetNode = event.target;

    while (newTargetNode && newTargetNode !== this.listNode && !nestedDropZone) {
      if (newTargetNode[DD.droppableListMarker] === true) {
        nestedDropZone = newTargetNode.parentNode;
      } else {
        newTargetNode = newTargetNode.parentNode;
      }
    }

    return Boolean(nestedDropZone);
  }

  private isUserPassesItemList() {
    return Boolean(this.itemList);
  }

  private stopDragOperation() {
    this.removePlaceHolder();

    return true;
  }

  private isDropAllowed(event, draggableType: string) {
    if (this.isOverNesterDropZone(event)) {
      return false;
    } else if (this.allowedTypes.length === 0) {
      return true;
    } else {
      return this.allowedTypes.indexOf(draggableType) !== -1;
    }
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

  private getDropEffect(effectAllowed) {
    return this.effectMap[effectAllowed] || 'none';
  }
}
