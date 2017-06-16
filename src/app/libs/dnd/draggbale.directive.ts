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
import { IDraggableOptions } from './dnd.interfaces';

@Directive({
  selector: '[vm-draggable]'
})
export class DraggbaleDirective implements OnInit, OnChanges {
  @Output('vm-draggable-dragstart') dragstart: any = new EventEmitter<any>();
  @Output('vm-draggable-dragend') dragend: any = new EventEmitter<any>();

  @HostListener('dragstart', ['$event']) dragStart(event: DragEvent) {
    if (!this.configuration.disabled) {
      // apply default options
      event.dataTransfer.effectAllowed = this.configuration.effect;

      this.dragstart.next(event);
    }
  }

  @HostListener('dragend', ['$event']) dragEnd(event) {
    if (!this.configuration.disabled) {
      // apply default options

      // call user callback
      this.dragend.next(event);
    }
  }

  @Input('vm-draggable-disabled') disabled: any = {};
  @Input('vm-draggable-effect') effect: any = {};

  private publicInputNames: string[] = [
    'disabled',
    'effect',
    'dragstart',
    'dragend'
  ];

  private configuration: IDraggableOptions = {
    disabled: false,

    effect: 'move'
  };

  constructor(private elementRef: ElementRef, private Renderer2: Renderer2) {
  }

  ngOnInit() {
    this.applyConfiguration();
  }

  ngOnChanges(changes) {
    this.publicInputNames.forEach((publicInputName) => {
      if (changes[publicInputName] && changes[publicInputName].currentValue) {
        this.configuration[publicInputName] = changes[publicInputName].currentValue;
      }
    });

    this.applyConfiguration();
  }

  private applyConfiguration() {
    if (this.configuration.disabled) {
      this.Renderer2.setAttribute(this.elementRef.nativeElement, 'draggable', 'false');
    } else {
      this.Renderer2.setAttribute(this.elementRef.nativeElement, 'draggable', 'true');
    }
  }
}
