import { GridCell } from '@angular/aria/grid';
import { Directive } from '@angular/core';

@Directive({
  selector: '[dxeDatepickerGridCell]',
  hostDirectives: [
    {
      directive: GridCell,
      inputs: ['disabled', 'selected', 'tabindex'],
      outputs: ['selectedChange'],
    },
  ],
  host: {
    class: 'p-0 h-10 text-center align-middle aria-disabled:text-base-content/30',
  },
})
export class DxeDatepickerGridCell {}
