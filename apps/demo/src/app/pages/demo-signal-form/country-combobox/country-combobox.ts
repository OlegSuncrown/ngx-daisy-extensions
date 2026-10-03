import { Component, computed, input, model, output, signal } from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { DxeComboboxImports, DxeSelectionIndicator } from 'ngx-daisy-extensions';

export interface Country {
  code: string;
  name: string;
}

@Component({
  selector: 'app-country-combobox',
  imports: [DxeComboboxImports, DxeSelectionIndicator],
  templateUrl: './country-combobox.html',
  host: {
    class: 'block',
  },
})
export class CountryCombobox implements FormValueControl<Country | null> {
  readonly value = model.required<Country | null>();
  readonly touched = input(false);
  readonly invalid = input(false);
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly touch = output<void>();

  readonly selectedOption = signal<Country[]>([]);
  readonly searchString = signal('');

  readonly options = computed(() =>
    ALL_COUNTRIES.filter((country) => country.name.toLowerCase().startsWith(this.searchString().toLowerCase())),
  );

  onCommit() {
    const selected = this.selectedOption();
    if (selected.length > 0) {
      this.value.set(selected[0]);
    }

    this.touch.emit();
  }

  clear() {
    this.value.set(null);
    this.selectedOption.set([]);
    this.touch.emit();
  }
}

const ALL_COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CA', name: 'Canada' },
  { code: 'EG', name: 'Egypt' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IN', name: 'India' },
  { code: 'JP', name: 'Japan' },
  { code: 'MX', name: 'Mexico' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States of America' },
] satisfies Country[];
