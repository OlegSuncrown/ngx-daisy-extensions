import { Component, computed, signal } from '@angular/core';
import { DxeSelectImports, DxeSelectionIndicator, dxeSizes } from 'ngx-daisy-extensions';
import { generateStatusOptions } from '../../util/generate-options';

@Component({
  selector: 'app-select-sizes',
  imports: [DxeSelectImports, DxeSelectionIndicator],
  templateUrl: './select-sizes.html',
  host: {
    class: 'block',
  },
})
export class SelectSizes {
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

  readonly daisyUiSizes = computed(() => dxeSizes);
}
