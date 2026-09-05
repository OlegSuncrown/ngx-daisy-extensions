import { Component, computed, signal } from '@angular/core';
import { DxeComboboxImports } from '@dxe/combobox';
import { DxeSelectionIndicator } from '@dxe/shared';
import { ALL_COUNTRIES, Country } from '../simple-dialog-combobox/simple-dialog-combobox';

@Component({
  selector: 'app-multi-dialog-combobox',
  imports: [DxeComboboxImports, DxeSelectionIndicator],
  templateUrl: './multi-dialog-combobox.html',
  host: {
    class: 'block',
  },
})
export class MultiDialogCombobox {
  readonly selectedCountries = signal<Country[]>([]);
  readonly searchString = signal('');

  readonly options = computed(() =>
    ALL_COUNTRIES.filter((country) => country.name.toLowerCase().startsWith(this.searchString().toLowerCase())),
  );

  readonly displayValue = computed(() => {
    const selected = this.selectedCountries();
    if (selected.length === 1) return selected[0]?.name;
    if (selected.length > 1) return `${selected[0]?.name} + ${selected.length - 1} more`;
    return undefined;
  });
}
