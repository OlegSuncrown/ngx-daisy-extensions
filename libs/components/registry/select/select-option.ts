import { Option } from '@angular/aria/listbox';
import { Component, computed, inject } from '@angular/core';
import { DxeStyledItem } from '../styles/styled-item';

@Component({
  selector: 'dxe-select-option',
  hostDirectives: [
    {
      directive: Option,
      inputs: ['value', 'label', 'disabled'],
    },
    DxeStyledItem,
  ],
  template: `<ng-content />`,
})
export class DxeSelectOption {
  private readonly option = inject(Option);

  readonly selected = computed(() => this.option.selected());
  readonly active = computed(() => this.option.active());
}
