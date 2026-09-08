export const SIMPLE_SELECT_HTML = `<dxe-select-root [(value)]="selectedValues">
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
</dxe-select-root>`;

export const SIMPLE_SELECT_TS = `import { Component, signal } from '@angular/core';
import { DxeSelectImports, DxeSelectionIndicator } from 'ngx-daisy-extensions';

@Component({
  selector: 'app-simple-select',
  imports: [DxeSelectImports, DxeSelectionIndicator],
  templateUrl: './simple-select.html',
})
export class SimpleSelect {
  readonly selectedValues = signal<string[]>([]);
  readonly options = [
    { id: '1', value: 'Important' },
    { id: '2', value: 'Starred' },
    { id: '3', value: 'Work' },
  ];
}`;

export const MULTI_SELECT_HTML = `<dxe-select-root [(value)]="selectedMultiValues" [multi]="true" [closeOnSelection]="false">
  <dxe-select-trigger>
    @if (selectedMultiValues().length > 0) {
      {{ displayMultiValue() }}
      <dxe-clear-button label="Clear selected labels" (clear)="selectedMultiValues.set([])" />
    } @else {
      <dxe-placeholder>Select labels</dxe-placeholder>
      <dxe-dropdown-button />
    }
  </dxe-select-trigger>
  <ng-container *dxeSelectPortal>
    @for (label of options; track label.id) {
      <dxe-select-option #option [value]="label.value" [label]="label.value">
        <dxe-selection-indicator [class.invisible]="!option.selected()" />
        <dxe-select-option-label>{{ label.value }}</dxe-select-option-label>
      </dxe-select-option>
    }
  </ng-container>
</dxe-select-root>`;

export const MULTI_SELECT_TS = `import { Component, computed, signal } from '@angular/core';
import { DxeSelectImports, DxeSelectionIndicator } from 'ngx-daisy-extensions';

@Component({
  selector: 'app-multi-select',
  imports: [DxeSelectImports, DxeSelectionIndicator],
  templateUrl: './multi-select.html',
})
export class MultiSelect {
  readonly selectedMultiValues = signal<string[]>([]);
  readonly options = [
    { id: '1', value: 'Important' },
    { id: '2', value: 'Starred' },
    { id: '3', value: 'Work' },
  ];

  readonly displayMultiValue = computed(() => {
    const values = this.selectedMultiValues();
    if (values.length === 0) {
      return;
    }
    if (values.length === 1) {
      return values[0];
    }
    return \`\${values[0]} + \${values.length - 1} more\`;
  });
}`;

export const SELECT_SIZES_HTML = `<dxe-select-root [size]="size" [(value)]="selectedValues">
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
</dxe-select-root>`;

export const SELECT_SIZES_TS = `import { Component, signal } from '@angular/core';
import { DxeSelectImports, DxeSelectionIndicator, dxeSizes } from 'ngx-daisy-extensions';

@Component({
  selector: 'app-select-sizes',
  imports: [DxeSelectImports, DxeSelectionIndicator],
  templateUrl: './select-sizes.html',
})
export class SelectSizes {
  readonly selectedValues = signal<string[]>([]);
  readonly options = [
    { id: '1', value: 'Important' },
    { id: '2', value: 'Starred' },
    { id: '3', value: 'Work' },
  ];
  readonly sizes = dxeSizes; // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}`;

export const SELECT_COLORS_HTML = `<dxe-select-root [color]="color" [(value)]="selectedValues">
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
</dxe-select-root>`;

export const SELECT_COLORS_TS = `import { Component, signal } from '@angular/core';
import { DxeSelectImports, DxeSelectionIndicator, dxeColors } from 'ngx-daisy-extensions';

@Component({
  selector: 'app-select-colors',
  imports: [DxeSelectImports, DxeSelectionIndicator],
  templateUrl: './select-colors.html',
})
export class SelectColors {
  readonly selectedValues = signal<string[]>([]);
  readonly options = [
    { id: '1', value: 'Important' },
    { id: '2', value: 'Starred' },
    { id: '3', value: 'Work' },
  ];
  readonly colors = dxeColors; // 'ghost' | 'primary' | 'secondary' | ...
}`;
