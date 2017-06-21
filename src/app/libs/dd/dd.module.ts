import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggbaleDirective } from './draggbale.directive';
import { DroppableDirective } from './droppable.directive';
import { DroppableListDirective } from './droppable-list.directive';
import { DraggableListItemDirective } from './draggbale-list-item.directive';
import { DraggableHandleDirective } from './draggbale-handle.directive';
import { NoDraggableDirective } from './no-draggable.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  entryComponents: [],
  declarations: [
    NoDraggableDirective,
    DraggableHandleDirective,
    DraggbaleDirective,
    DraggableListItemDirective,
    DroppableDirective,
    DroppableListDirective
  ],
  exports: [
    NoDraggableDirective,
    DraggableHandleDirective,
    DraggbaleDirective,
    DraggableListItemDirective,
    DroppableDirective,
    DroppableListDirective
  ]
})
export class DDModule {
}
