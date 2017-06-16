import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggbaleDirective } from './draggbale.directive';
import { DroppableDirective } from './droppable.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DraggbaleDirective, DroppableDirective],
  exports: [DraggbaleDirective, DroppableDirective]
})
export class DndModule { }
