import { Directive } from '@angular/core';

@Directive({
  selector: '[dxeDatepickerGridColumnHeader]',
  host: {
    role: 'columnheader',
    scope: 'col',
    class: 'text-xs font-medium text-base-content/60 text-center pb-2',
  },
})
export class DxeDatepickerGridColumnHeader {}
