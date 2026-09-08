import { Component, computed, signal } from '@angular/core';
import { DxeSelectImports, DxeSelectionIndicator, dxeColors } from 'ngx-daisy-extensions';
import { generateStatusOptions } from '../../util/generate-options';

@Component({
  selector: 'app-select-colors',
  imports: [DxeSelectImports, DxeSelectionIndicator],
  templateUrl: './select-colors.html',
  host: {
    class: 'block',
  },
})
export class SelectColors {
  readonly selectedValues = signal<string[]>([]);
  readonly selectedMultiValues = signal<string[]>([]);
  readonly options = generateStatusOptions(10);

  readonly displayValue = computed(() => this.selectedValues()[0] || 'Select a label');

  readonly displayMultiValue = computed(() => {
    const values = this.selectedMultiValues();
    if (values.length === 0) {
      return 'Select labels';
    }
    if (values.length === 1) {
      return values[0];
    }
    return `${values[0]} + ${values.length - 1} more`;
  });

  readonly daisyUiColors = computed(() => dxeColors);
}
