import { Component, input, model, output, signal } from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { DxeSelectImports, DxeSelectionIndicator } from 'ngx-daisy-extensions';

export type TravelerTitle = 'Mr' | 'Mrs' | 'Ms' | 'Dr';

@Component({
  selector: 'app-title-select',
  imports: [DxeSelectImports, DxeSelectionIndicator],
  templateUrl: './title-select.html',
  host: {
    class: 'block',
  },
})
export class TitleSelect implements FormValueControl<TravelerTitle> {
  readonly titles = ['Mr', 'Mrs', 'Ms', 'Dr'] as const;

  readonly value = model.required<TravelerTitle>();
  readonly touched = input(false);
  readonly invalid = input(false);
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly touch = output<void>();

  readonly selectedOption = signal<TravelerTitle[]>([]);

  onCommit() {
    const selected = this.selectedOption();
    if (selected.length > 0) {
      this.value.set(selected[0]);
    }

    this.touch.emit();
  }
}
