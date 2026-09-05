import { Component } from '@angular/core';

@Component({
  selector: 'dxe-select-option-label',
  template: `<ng-content />`,
  host: {
    class: 'grow',
  },
})
export class DxeSelectOptionLabel {}
