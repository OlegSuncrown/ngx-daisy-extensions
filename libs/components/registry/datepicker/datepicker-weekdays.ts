import { Component } from '@angular/core';

@Component({
  selector: 'dxe-datepicker-weekdays',
  template: `<ng-content />`,
  host: {
    role: 'row',
    class: 'grid grid-cols-7 pb-2',
  },
})
export class DxeDatepickerWeekdays {}
