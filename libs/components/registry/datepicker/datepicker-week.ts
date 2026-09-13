import { GridRow } from '@angular/aria/grid';
import { Component } from '@angular/core';

@Component({
  selector: 'dxe-datepicker-week',
  hostDirectives: [GridRow],
  template: `<ng-content />`,
  host: {
    class: 'grid grid-cols-7',
  },
})
export class DxeDatepickerWeek {}
