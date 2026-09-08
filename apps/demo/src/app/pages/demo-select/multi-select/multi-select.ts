import { Component, computed, signal } from '@angular/core';
import { DxeSelectImports, DxeSelectionIndicator } from 'ngx-daisy-extensions';
import { generateStatusOptions } from '../../util/generate-options';

@Component({
  selector: 'app-multi-select',
  imports: [DxeSelectImports, DxeSelectionIndicator],
  templateUrl: './multi-select.html',
  host: {
    class: 'block',
  },
})
export class MultiSelect {
  readonly selectedMultiValues = signal<string[]>([]);
  readonly options = generateStatusOptions(10);

  readonly displayMultiValue = computed(() => {
    const values = this.selectedMultiValues();
    if (values.length === 0) {
      return;
    }
    if (values.length === 1) {
      return values[0];
    }
    return `${values[0]} + ${values.length - 1} more`;
  });
}
