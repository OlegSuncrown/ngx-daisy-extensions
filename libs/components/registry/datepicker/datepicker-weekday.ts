import { Component, input } from '@angular/core';

@Component({
  selector: 'dxe-datepicker-weekday',
  template: `<ng-content />`,
  host: {
    role: 'columnheader',
    class: 'text-xs font-medium text-base-content/60 text-center',
    '[attr.aria-label]': 'label()',
  },
})
export class DxeDatepickerWeekday {
  readonly label = input<string>();
}
