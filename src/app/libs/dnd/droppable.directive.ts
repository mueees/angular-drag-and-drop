import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[vm-droppable]'
})
export class DroppableDirective implements OnInit, OnChanges {
  @Output('vm-droppable-dragenter') dragenter: any = new EventEmitter<any>();
  @Output('vm-droppable-dragleave') dragleave: any = new EventEmitter<any>();
  @Output('vm-droppable-drop') dropEmitter: any = new EventEmitter<any>();
  @Output('vm-droppable-dragover') dragoverEmmiter: any = new EventEmitter<any>();

  @HostListener('dragenter', ['$event']) dragEnter(event: DragEvent) {
    if (!this.configuration.disabled) {
      // apply default options
      event.preventDefault();

      this.Renderer2.addClass(this.elementRef.nativeElement, this.configuration.hoverClass);

      this.dragenter.next(event);
    }
  }

  @HostListener('dragleave', ['$event']) dragLeave(event: DragEvent) {
    if (!this.configuration.disabled) {
      // apply default options
      event.preventDefault();

      this.Renderer2.removeClass(this.elementRef.nativeElement, this.configuration.hoverClass);

      this.dragleave.next(event);
    }
  }

  @HostListener('drop', ['$event'])
  drop(event: DragEvent) {
    if (!this.configuration.disabled) {
      // apply default options
      event.preventDefault();

      // Get the data
      const data = event.dataTransfer.getData('data');

      this.Renderer2.removeClass(this.elementRef.nativeElement, this.configuration.hoverClass);

      // call user callback
      this.dropEmitter.next(event);
    }
  }

  @HostListener('dragover', ['$event'])
  dragOver(event) {
    if (!this.configuration.disabled) {
      // apply default options
      event.preventDefault();

      // Set the dropEffect to move
      event.dataTransfer.dropEffect = 'move';

      // call user callback
      this.dragoverEmmiter.next(event);
    }
  }

  @Input('vm-droppable-disabled') disabled: boolean;
  @Input('vm-droppable-hoverclass') hoverClass: boolean;

  private publicInputNames: string[] = [
    'disabled',
    'hoverClass'
  ];

  private configuration: any = {
    disabled: false,
    hoverClass: 'vm-droppable-over'
  };

  constructor(private elementRef: ElementRef, private Renderer2: Renderer2) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    this.publicInputNames.forEach((publicInputName) => {
      if (changes[publicInputName]) {
        this.configuration[publicInputName] = changes[publicInputName].currentValue;
      }
    });
  }
}
