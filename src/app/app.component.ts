import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  data: any = {
    type: 'rx-id'
  };

  draggableOptions = {
    disabled: false,

    dragstart: (event: DragEvent) => {
      //console.log(event);

      // add to drag element any data
      event.dataTransfer.setData('data', JSON.stringify(this.data));
    },

    dragend: (event) => {
      // console.log(event);
    },

    // Droppable element

    hoverClass: 'custom-droppable-over',

    dragover: (event) => {
      // console.log(event);

    },

    drop: (event) => {
      // console.log(event);
    }
  };

  constructor() {
  }
}
