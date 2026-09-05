import { Component } from '@angular/core';

@Component({
  selector: 'dxe-combobox-option-label',
  template: `<ng-content />`,
  host: {
    class: 'grow min-w-0 truncate',
  },
})
export class DxeComboboxOptionLabel {}
