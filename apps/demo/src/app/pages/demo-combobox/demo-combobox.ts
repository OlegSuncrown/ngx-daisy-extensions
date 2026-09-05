import { Component, computed, signal } from '@angular/core';
import { DxeComboboxImports } from '@dxe/combobox';
import { DxeSelectionIndicator } from '@dxe/shared';

interface Country {
  code: string;
  name: string;
}

const COUNTRIES: Country[] = [
  { code: 'ca', name: 'Canada' },
  { code: 'de', name: 'Germany' },
  { code: 'jp', name: 'Japan' },
  { code: 'ua', name: 'Ukraine' },
  { code: 'us', name: 'United States' },
];

@Component({
  selector: 'app-demo-combobox-page',
  imports: [DxeComboboxImports, DxeSelectionIndicator],
  templateUrl: './demo-combobox.html',
})
export class DemoComboboxPage {
  protected readonly selectedCountries = signal<Country[]>([]);
  protected readonly searchString = signal('');
  protected readonly options = computed(() => {
    const search = this.searchString().trim().toLocaleLowerCase();
    return COUNTRIES.filter((country) => country.name.toLocaleLowerCase().includes(search));
  });
  protected readonly displayValue = computed(() =>
    this.selectedCountries()
      .map((country) => country.name)
      .join(', '),
  );
}
