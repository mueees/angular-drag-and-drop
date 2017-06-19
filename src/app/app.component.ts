import { Component, OnChanges } from '@angular/core';
import { find, findIndex, remove } from 'lodash';
import { IOnDropListOptions } from './libs/dd/dd.interfaces';

@Component({
  selector: 'my-app',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnChanges {
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
  childCards: any[] = [
    {
      id: 2,
      title: '2',
      type: 'card'
    }
  ];

  onParentDrop(dropOptions: IOnDropListOptions) {
    console.log('onParentDrop')
    this.parentCards.push(dropOptions.transferData);
  }

  onChildDrop(dropOptions: IOnDropListOptions) {
    const isAlreadyInChild = find(this.childCards, card => card.id === dropOptions.transferData.id);

    if (isAlreadyInChild) {
      // do nothing
    } else {
      const isAlreadyInParent = find(this.parentCards, card => card.id === dropOptions.transferData.id);

      let card;

      if (isAlreadyInParent) {
        card = remove(this.parentCards, card => card.id === dropOptions.transferData.id)[0];
      } else {
        card = dropOptions.transferData;
      }

      this.childCards.push(card);
    }
  }

  ngOnChanges(changes) {
    console.log(changes);
  }
}
