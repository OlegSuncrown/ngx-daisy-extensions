import { Component, computed, signal } from '@angular/core';
import { DxeComboboxImports, DxeSelectionIndicator } from 'ngx-daisy-extensions';

@Component({
  selector: 'app-simple-dialog-combobox',
  imports: [DxeComboboxImports, DxeSelectionIndicator],
  templateUrl: './simple-dialog-combobox.html',
  host: {
    class: 'block',
  },
})
export class SimpleDialogCombobox {
  readonly selectedCountries = signal<Country[]>([]);
  readonly searchString = signal('');

  readonly options = computed(() =>
    ALL_COUNTRIES.filter((country) => country.name.toLowerCase().startsWith(this.searchString().toLowerCase())),
  );
}

export const ALL_COUNTRIES = [
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

export interface Country {
  code: string;
  name: string;
}
