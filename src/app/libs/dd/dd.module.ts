import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggbaleDirective } from './draggbale.directive';
import { DroppableDirective } from './droppable.directive';
import { DroppableListDirective } from './droppable-list.directive';
import { DraggableListItemDirective } from './draggbale-list-item.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  entryComponents: [],
  declarations: [
    DraggbaleDirective,
    DraggableListItemDirective,
    DroppableDirective,
    DroppableListDirective
  ],
  exports: [
    DraggbaleDirective,
    DraggableListItemDirective,
    DroppableDirective,
    DroppableListDirective
  ]
})
export class DDModule {
}
