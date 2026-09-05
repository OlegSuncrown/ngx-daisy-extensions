import { Combobox } from '@angular/aria/combobox';
import { Component, inject } from '@angular/core';
import { DxeStyledTrigger } from '../styles/styled-trigger';

@Component({
  selector: 'dxe-select-trigger',
  hostDirectives: [
    {
      directive: Combobox,
      inputs: ['disabled'],
    },
    DxeStyledTrigger,
  ],
  template: `<ng-content />`,
})
export class DxeSelectTrigger {
  protected readonly combobox = inject(Combobox);

  constructor() {
    this.combobox.preserveContent.set(true);
  }
}
