import {Component, OnChanges} from "@angular/core";
import {findIndex, find, remove} from 'lodash';

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

    allowedTypes = [
        'card'
    ];

    left: any[] = [];
    right: any[] = [];

    onDrop(cards, onDropOptions: any) {
        let movedCard = find(cards, card => card.id === onDropOptions.transferData.id);

        if (movedCard) {
            movedCard.$$destroy = true;
        }

        cards.splice(onDropOptions.insertIndex, 0, onDropOptions.transferData);

        if (movedCard) {
            console.log('removed');

            remove(cards, card => card.$$destroy);
        }
    }

    onDropRight(dropOptions) {
        this.onDrop(this.right, dropOptions);
    }

    onDropLeft(dropOptions) {
        this.onDrop(this.left, dropOptions);
    }

    ngOnChanges(changes) {
        console.log(changes);
    }
}