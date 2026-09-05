import { Directive } from '@angular/core';

@Directive({
  selector: '[dxeStyledPopup]',
  host: {
    class: 'block w-full overflow-hidden z-100 origin-top p-2 rounded-(--radius-field) bg-base-100 shadow-lg border border-base-content/10',
  },
})
export class DxeStyledPopup {}
