import { Component, signal } from '@angular/core';
import { DxeSelectImports } from '@dxe/select';
import { DxeSelectionIndicator } from '@dxe/shared';
import { generateStatusOptions } from '../../util/generate-options';

@Component({
  selector: 'app-simple-select',
  imports: [DxeSelectImports, DxeSelectionIndicator],
  templateUrl: './simple-select.html',
  host: {
    class: 'block',
  },
})
export class SimpleSelect {
  readonly selectedValues = signal<string[]>([]);
  readonly options = generateStatusOptions(10);
}
