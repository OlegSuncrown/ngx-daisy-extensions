import { Grid } from '@angular/aria/grid';
import { Directive, inject, output } from '@angular/core';

export interface GridFocusReset {
  gridBehavior?: {
    focusBehavior?: {
      activeCell: { set(value: undefined): void };
      activeCoords: { set(value: { row: number; col: number }): void };
    };
  };
}

@Directive({
  selector: '[dxeDatepickerGrid]',
  exportAs: 'dxeDatepickerGrid',
  hostDirectives: [
    {
      directive: Grid,
      inputs: ['enableSelection', 'disabled', 'softDisabled', 'focusMode', 'rowWrap', 'colWrap', 'multi', 'selectionMode', 'tabindex'],
    },
  ],
  host: {
    class: 'w-full table-fixed',
    '(keydown)': 'gridKeydown.emit($event)',
  },
})
export class DxeDatepickerGrid {
  readonly grid = inject(Grid);
  readonly gridKeydown = output<KeyboardEvent>();

  resetFocus() {
    const focusBehavior = (this.grid._pattern as unknown as GridFocusReset | undefined)?.gridBehavior?.focusBehavior;
    if (focusBehavior) {
      focusBehavior.activeCell.set(undefined);
      focusBehavior.activeCoords.set({ row: -1, col: -1 });
    }
  }
}
