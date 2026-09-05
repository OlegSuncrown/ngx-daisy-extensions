import { Component } from '@angular/core';

@Component({
  selector: 'dxe-combobox-option-label',
  template: `<ng-content />`,
  host: {
    class: 'grow',
  },
})
export class DxeComboboxOptionLabel {}
