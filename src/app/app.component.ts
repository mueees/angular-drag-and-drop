import { Component, OnChanges, OnInit } from '@angular/core';
import { find, findIndex, remove } from 'lodash';

@Component({
  selector: 'my-app',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnChanges {
  availableCards = [
    {
      id: 1,
      title: '1',
      type: 'card'
    },
    {
      id: 2,
      title: '2',
      type: 'card'
    },
    {
      id: 3,
      title: '3',
      type: 'card'
    },
    {
      id: 4,
      title: '4',
      type: 'card'
    }
  ];

  parentCards: any[] = [
    {
      id: 1,
      title: '1',
      type: 'card'
    }
  ];

  ngOnInit() {
  }

  ngOnChanges(changes) {
    console.log(changes);
  }
}
