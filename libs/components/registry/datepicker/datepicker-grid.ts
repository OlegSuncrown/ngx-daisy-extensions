import { Grid } from '@angular/aria/grid';
import { Component, ElementRef, inject, input, OnDestroy, OnInit } from '@angular/core';
import { DXE_DATEPICKER_CONTEXT } from './datepicker-context';
import type { DxeDatepickerGridHandle } from './datepicker-context';

interface GridFocusReset {
  gridBehavior?: {
    focusBehavior?: {
      activeCell: { set(value: undefined): void };
      activeCoords: { set(value: { row: number; col: number }): void };
    };
  };
}

@Component({
  selector: 'dxe-datepicker-grid',
  hostDirectives: [
    {
      directive: Grid,
      inputs: ['enableSelection', 'selectionMode', 'colWrap', 'rowWrap'],
    },
  ],
  template: `<ng-content />`,
  host: {
    class: 'flex flex-col',
    tabindex: '-1',
  },
})
export class DxeDatepickerGrid implements OnInit, OnDestroy, DxeDatepickerGridHandle {
  private readonly context = inject(DXE_DATEPICKER_CONTEXT);
  private readonly grid = inject(Grid);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly enableSelection = input(true);
  readonly selectionMode = input<'explicit' | 'follow'>('explicit');
  readonly colWrap = input<'continuous' | 'loop' | 'nowrap'>('continuous');
  readonly rowWrap = input<'continuous' | 'loop' | 'nowrap'>('nowrap');

  get element() {
    return this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.context.registerGrid(this);
  }

  ngOnDestroy() {
    this.context.unregisterGrid(this);
  }

  resetFocus() {
    this.element.focus();
    const focusBehavior = (this.grid._pattern as unknown as GridFocusReset | undefined)?.gridBehavior?.focusBehavior;
    if (focusBehavior) {
      focusBehavior.activeCell.set(undefined);
      focusBehavior.activeCoords.set({ row: -1, col: -1 });
    }
  }
}
