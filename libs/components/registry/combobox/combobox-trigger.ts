import { Combobox } from '@angular/aria/combobox';
import { Component, inject } from '@angular/core';
import { DxeStyledTrigger } from '../styles/styled-trigger';

@Component({
  selector: 'dxe-combobox-trigger',
  hostDirectives: [
    {
      directive: Combobox,
      inputs: ['disabled'],
    },
    DxeStyledTrigger,
  ],
  template: `<ng-content />`,
})
export class DxeComboboxTrigger {
  readonly combobox = inject(Combobox);

  constructor() {
    this.combobox.preserveContent.set(true);
  }
}
