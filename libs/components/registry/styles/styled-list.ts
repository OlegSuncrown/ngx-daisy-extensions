import { Directive } from '@angular/core';

@Directive({
  selector: '[dxeStyledList]',
  host: {
    class: 'outline-none flex h-full flex-col gap-0.5 overflow-auto',
  },
})
export class DxeStyledList {}
