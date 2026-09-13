# ngx-daisy-extensions

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

[Demo](https://ngx-daisy-extensions.netlify.app)

## About

`ngx-daisy-extensions` provides Angular-first components built with Angular ARIA and the Angular CDK, styled with Tailwind CSS and DaisyUI.

## Installation

1.Install Angular CDK and import overlay styles:

```bash
npm install @angular/cdk
```

```css
@import '@angular/cdk/overlay-prebuilt.css';
```

2.Install Angular ARIA:

```bash
npm install @angular/aria
```

3.Install [Tailwind CSS](https://tailwindcss.com/docs/installation/framework-guides/angular).

4.Install [daisyUI for Angular](https://daisyui.com/docs/install/angular/).

5.Install `ngx-daisy-extensions`:

```bash
npm install ngx-daisy-extensions
```

6.Register the package with Tailwind in your global stylesheet:

```css
@import 'tailwindcss';
@plugin 'daisyui';
@import 'ngx-daisy-extensions/styles.css';
```

That file has no component CSS. It only tells your Tailwind build which class names to generate, using your project theme. Tailwind never scans `node_modules` on its own.

## Angular API

Import the component groups into standalone components:

```ts
import { DxeComboboxImports, DxeDatepickerImports, DxeSelectImports, DxeSelectionIndicator } from 'ngx-daisy-extensions';
```

### Select

```ts
import { Component, signal } from '@angular/core';
import { DxeSelectImports, DxeSelectionIndicator } from 'ngx-daisy-extensions';

@Component({
  selector: 'app-simple-select',
  imports: [DxeSelectImports, DxeSelectionIndicator],
  template: `
    <dxe-select-root [(value)]="selectedValues">
      <dxe-select-trigger>
        @if (selectedValues().length > 0) {
          {{ selectedValues()[0] }}
        } @else {
          <dxe-placeholder>Select a label</dxe-placeholder>
        }
        <dxe-dropdown-button />
      </dxe-select-trigger>

      <ng-container *dxeSelectPortal>
        @for (label of options; track label.id) {
          <dxe-select-option #option [value]="label.value" [label]="label.value">
            <dxe-select-option-label>{{ label.value }}</dxe-select-option-label>
            @if (option.selected()) {
              <dxe-selection-indicator />
            }
          </dxe-select-option>
        }
      </ng-container>
    </dxe-select-root>
  `,
})
export class SimpleSelect {
  readonly selectedValues = signal<string[]>([]);
  readonly options = [
    { id: 'important', value: 'Important' },
    { id: 'starred', value: 'Starred' },
    { id: 'work', value: 'Work' },
  ];
}
```

### Combobox

```ts
import { Component, computed, signal } from '@angular/core';
import { DxeComboboxImports, DxeSelectionIndicator } from 'ngx-daisy-extensions';

interface Country {
  code: string;
  name: string;
}

@Component({
  selector: 'app-simple-combobox',
  imports: [DxeComboboxImports, DxeSelectionIndicator],
  template: `
    <dxe-combobox-root [(value)]="selectedCountries">
      <dxe-combobox-trigger>
        @if (selectedCountries().length > 0) {
          {{ selectedCountries()[0]?.name }}
          <dxe-clear-button label="Clear selected countries" (clear)="selectedCountries.set([])" />
        } @else {
          <dxe-placeholder>Select a country...</dxe-placeholder>
          <dxe-dropdown-button />
        }
      </dxe-combobox-trigger>

      <input type="text" dxeComboboxInput alwaysExpanded placeholder="Search..." [(value)]="searchString" />

      @if (options().length === 0) {
        <dxe-empty-state>No results found</dxe-empty-state>
      }

      <ng-container *dxeComboboxPortal>
        @for (country of options(); track country.code) {
          <dxe-combobox-option #option [value]="country" [label]="country.name">
            <dxe-combobox-option-label>{{ country.name }}</dxe-combobox-option-label>
            <dxe-selection-indicator [class.invisible]="!option.selected()" />
          </dxe-combobox-option>
        }
      </ng-container>
    </dxe-combobox-root>
  `,
})
export class SimpleCombobox {
  readonly selectedCountries = signal<Country[]>([]);
  readonly searchString = signal('');
  readonly countries: Country[] = [
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'US', name: 'United States of America' },
  ];

  readonly options = computed(() =>
    this.countries.filter((country) =>
      country.name.toLowerCase().startsWith(this.searchString().toLowerCase()),
    ),
  );
}
```

### Datepicker

The datepicker is date-library agnostic. The library owns overlay, combobox, and grid plumbing. You own date math, formatting, and the calendar cells. The demo uses Angular Material's `DateAdapter` for that consumer-side logic.

```html
<dxe-datepicker-root #picker [(value)]="selectedDate" [compareWith]="isSameDay">
  <dxe-datepicker-trigger>
    <input
      type="text"
      dxeDatepickerInput
      placeholder="Pick a date..."
      [(value)]="inputValue"
      (input)="onInput(inputValue())"
      (keydown)="onInputKeydown($event)"
    />
  </dxe-datepicker-trigger>
  <ng-container *dxeDatepickerPortal>
    <dxe-datepicker-header (previous)="prevMonth()" (next)="nextMonth()">
      <div aria-live="polite" class="sr-only">{{ activeMonthAnnouncement() }}</div>
      <div class="font-semibold text-sm">{{ monthYearLabel() }}</div>
    </dxe-datepicker-header>
    <dxe-datepicker-grid>
      <dxe-datepicker-weekdays>
        @for (day of weekdays(); track day.long) {
          <dxe-datepicker-weekday [label]="day.long">{{ day.narrow }}</dxe-datepicker-weekday>
        }
      </dxe-datepicker-weekdays>
      @for (week of weeks(); track $index) {
        <dxe-datepicker-week>
          @for (day of week; track $index) {
            <dxe-datepicker-day [value]="day.date" [label]="day.ariaLabel" [today]="day.today"
              (keydown)="onDayKeydown($event, day.date)">
              {{ day.displayName }}
            </dxe-datepicker-day>
          }
        </dxe-datepicker-week>
      }
    </dxe-datepicker-grid>
  </ng-container>
</dxe-datepicker-root>
```

## Development

The demo imports registry sources through a TypeScript path alias. Consumer projects resolve the same import from `node_modules/ngx-daisy-extensions`.

```ts
import { DxeComboboxImports, DxeDatepickerImports, DxeSelectImports } from 'ngx-daisy-extensions';
```

Publish the Angular package from the workspace root:

```bash
npm install
npm run publish:components
```

Do not publish `libs/components` directly. The publish script builds Angular Package Format output and publishes `dist/libs/components`.


## License

MIT © [Oleh Biblyi](https://github.com/OlegSuncrown)
