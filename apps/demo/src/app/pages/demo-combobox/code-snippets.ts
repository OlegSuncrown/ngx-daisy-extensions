export const SIMPLE_COMBOBOX_HTML = `<dxe-combobox-root [(value)]="selectedCountries">
  <dxe-combobox-trigger>
    @if (selectedCountries().length > 0) {
      {{ selectedCountries()[0]?.name }}
      <dxe-clear-button label="Clear selected labels" (clear)="selectedCountries.set([])" />
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
</dxe-combobox-root>`;

export const SIMPLE_COMBOBOX_TS = `import { Component, computed, signal } from '@angular/core';
import { DxeComboboxImports, DxeSelectionIndicator } from 'ngx-daisy-extensions';

interface Country {
  code: string;
  name: string;
}

@Component({
  selector: 'app-simple-dialog-combobox',
  imports: [DxeComboboxImports, DxeSelectionIndicator],
  templateUrl: './simple-dialog-combobox.html',
})
export class SimpleDialogCombobox {
  readonly selectedCountries = signal<Country[]>([]);
  readonly searchString = signal('');
  readonly allCountries: Country[] = [
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'US', name: 'United States of America' },
  ];

  readonly options = computed(() =>
    this.allCountries.filter((country) =>
      country.name.toLowerCase().startsWith(this.searchString().toLowerCase()),
    ),
  );
}`;

export const MULTI_COMBOBOX_HTML = `<dxe-combobox-root [(value)]="selectedCountries" [multi]="true" [closeOnSelection]="false">
  <dxe-combobox-trigger>
    @if (selectedCountries().length > 0) {
      {{ displayValue() }}
      <dxe-clear-button label="Clear selected countries" (clear)="selectedCountries.set([])" />
    } @else {
      <dxe-placeholder>Select countries...</dxe-placeholder>
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
</dxe-combobox-root>`;

export const MULTI_COMBOBOX_TS = `import { Component, computed, signal } from '@angular/core';
import { DxeComboboxImports, DxeSelectionIndicator } from 'ngx-daisy-extensions';

interface Country {
  code: string;
  name: string;
}

@Component({
  selector: 'app-multi-dialog-combobox',
  imports: [DxeComboboxImports, DxeSelectionIndicator],
  templateUrl: './multi-dialog-combobox.html',
})
export class MultiDialogCombobox {
  readonly selectedCountries = signal<Country[]>([]);
  readonly searchString = signal('');
  readonly allCountries: Country[] = [
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'US', name: 'United States of America' },
  ];

  readonly options = computed(() =>
    this.allCountries.filter((country) =>
      country.name.toLowerCase().startsWith(this.searchString().toLowerCase()),
    ),
  );

  readonly displayValue = computed(() => {
    const selected = this.selectedCountries();
    if (selected.length === 1) return selected[0]?.name;
    if (selected.length > 1) return \`\${selected[0]?.name} + \${selected.length - 1} more\`;
    return undefined;
  });
}`;

export const ASYNC_COMBOBOX_HTML = `<dxe-combobox-root [value]="listboxValue()" (valueChange)="onValueChange($event)">
  <dxe-combobox-trigger>
    <span class="flex items-center gap-2 min-w-0">
      @if (selectedUser(); as user) {
        <img class="size-6 rounded-full shrink-0" [src]="user.image" [alt]="user.label" />
      }
      @if (selectedUser()) {
        <span class="truncate">{{ displayValue() }}</span>
      } @else {
        <dxe-placeholder>Select a user</dxe-placeholder>
      }
    </span>
    <dxe-dropdown-button />
  </dxe-combobox-trigger>
  <input type="text" dxeComboboxInput alwaysExpanded placeholder="Search users..." [(value)]="filter" />
  @if (showEmpty()) {
    <dxe-empty-state>{{ emptyText() }}</dxe-empty-state>
  }
  <ng-container *dxeComboboxPortal>
    @for (user of options(); track user.id) {
      <dxe-combobox-option #option [value]="user.id" [label]="user.label">
        <dxe-combobox-option-label>
          <span class="flex items-center gap-2 min-w-0">
            <img class="size-6 rounded-full shrink-0" [src]="user.image" [alt]="user.label" />
            <span class="truncate">{{ user.label }}</span>
          </span>
        </dxe-combobox-option-label>
        <dxe-selection-indicator [class.invisible]="!option.selected()" />
      </dxe-combobox-option>
    }
  </ng-container>
</dxe-combobox-root>`;

export const ASYNC_COMBOBOX_TS = `import { httpResource } from '@angular/common/http';
import { Component, computed, debounced, signal } from '@angular/core';
import { DxeComboboxImports, DxeSelectionIndicator } from 'ngx-daisy-extensions';

interface UserOption {
  id: number;
  label: string;
  image: string;
}

@Component({
  selector: 'app-async-combobox',
  imports: [DxeComboboxImports, DxeSelectionIndicator],
  templateUrl: './async-combobox.html',
})
export class AsyncCombobox {
  readonly value = signal<number | null>(null);
  readonly selectedUser = signal<UserOption | null>(null);
  readonly filter = signal('');

  private readonly debouncedFilter = debounced(() => this.filter(), 300);
  private readonly search = computed(() =>
    (this.debouncedFilter.hasValue() ? this.debouncedFilter.value() : '').trim(),
  );

  readonly usersResource = httpResource<{ users: { id: number; firstName: string; lastName: string; image: string }[] }>(
    () => {
      const search = this.search();
      if (search.length === 0) {
        return undefined;
      }
      return \`https://dummyjson.com/users/search?q=\${encodeURIComponent(search)}\`;
    },
  );

  readonly options = computed((): UserOption[] => {
    if (!this.search() || !this.usersResource.hasValue()) {
      return [];
    }
    return this.usersResource.value().users.map((user) => ({
      id: user.id,
      label: \`\${user.firstName} \${user.lastName}\`,
      image: user.image,
    }));
  });

  readonly listboxValue = computed(() => {
    const id = this.value();
    if (id === null) {
      return [];
    }
    return this.options().some((option) => option.id === id) ? [id] : [];
  });

  readonly showEmpty = computed(() => this.options().length === 0);
  readonly emptyText = computed(() => {
    if (this.search().length === 0) return 'Type to search users';
    if (this.debouncedFilter.isLoading() || this.usersResource.isLoading()) return 'Searching...';
    if (this.usersResource.error()) return 'Failed to load users';
    return 'No users found';
  });
  readonly displayValue = computed(() => this.selectedUser()?.label || 'Select a user');

  onValueChange(ids: number[]) {
    if (ids.length > 0) {
      const id = ids[0];
      this.value.set(id);
      this.selectedUser.set(this.options().find((option) => option.id === id) ?? this.selectedUser());
      return;
    }
    this.value.set(null);
    this.selectedUser.set(null);
  }
}`;

export const FORM_COMBOBOX_HTML = `<dxe-combobox-root [value]="listboxValue()" (valueChange)="onValueChange($event)">
  <dxe-combobox-trigger>
    @if (selectedUser(); as user) {
      <span class="flex items-center gap-2 min-w-0">
        <img class="size-6 rounded-full shrink-0" [src]="user.image" [alt]="user.label" />
        <span class="truncate">{{ displayValue() }}</span>
      </span>
      <dxe-clear-button label="Clear selected user" (clear)="clear()" />
    } @else {
      <dxe-placeholder>Select a user</dxe-placeholder>
      <dxe-dropdown-button />
    }
  </dxe-combobox-trigger>
  <input type="text" dxeComboboxInput alwaysExpanded placeholder="Search users..." [(value)]="filter" />
  @if (showEmpty()) {
    <dxe-empty-state>{{ emptyText() }}</dxe-empty-state>
  }
  <ng-container *dxeComboboxPortal>
    @for (user of options(); track user.id) {
      <dxe-combobox-option #option [value]="user.id" [label]="user.label">
        <dxe-combobox-option-label>
          <span class="flex items-center gap-2 min-w-0 py-1">
            <img class="size-6 rounded-full shrink-0" [src]="user.image" [alt]="user.label" />
            <span class="flex flex-col min-w-0">
              <span class="truncate">{{ user.label }}</span>
              <span class="text-xs opacity-50 truncate">{{ user.email }}</span>
            </span>
          </span>
        </dxe-combobox-option-label>
        <dxe-selection-indicator [class.invisible]="!option.selected()" />
      </dxe-combobox-option>
    }
  </ng-container>
</dxe-combobox-root>
@if (userForm.userId().touched() && userForm.userId().invalid()) {
  <ul>
    @for (error of userForm.userId().errors(); track error) {
      <li class="label text-error">{{ error.message }}</li>
    }
  </ul>
}`;

export const FORM_COMBOBOX_TS = `import { httpResource } from '@angular/common/http';
import { Component, computed, debounced, signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';
import { DxeComboboxImports, DxeSelectionIndicator } from 'ngx-daisy-extensions';

interface UserOption {
  id: number;
  label: string;
  email: string;
  image: string;
}

@Component({
  selector: 'app-form-combobox',
  imports: [DxeComboboxImports, DxeSelectionIndicator],
  templateUrl: './form-combobox.html',
})
export class FormCombobox {
  readonly selectedUser = signal<UserOption | null>(null);
  readonly filter = signal('');
  private readonly model = signal<{ userId: number | null }>({ userId: null });
  readonly userForm = form(this.model, (schema) => {
    required(schema.userId, { message: 'Select a user' });
  });

  private readonly debouncedFilter = debounced(() => this.filter(), 300);
  private readonly search = computed(() =>
    (this.debouncedFilter.hasValue() ? this.debouncedFilter.value() : '').trim(),
  );

  readonly usersResource = httpResource<{
    users: { id: number; firstName: string; lastName: string; email: string; image: string }[];
  }>(() => {
    const search = this.search();
    if (search.length === 0) {
      return undefined;
    }
    return \`https://dummyjson.com/users/search?q=\${encodeURIComponent(search)}\`;
  });

  readonly options = computed((): UserOption[] => {
    if (!this.search() || !this.usersResource.hasValue()) {
      return [];
    }
    return this.usersResource.value().users.map((user) => ({
      id: user.id,
      label: \`\${user.firstName} \${user.lastName}\`,
      email: user.email,
      image: user.image,
    }));
  });

  readonly listboxValue = computed(() => {
    const id = this.userForm.userId().value();
    if (id === null) {
      return [];
    }
    return this.options().some((option) => option.id === id) ? [id] : [];
  });

  readonly showEmpty = computed(() => this.options().length === 0);
  readonly emptyText = computed(() => {
    if (this.search().length === 0) return 'Type to search users';
    if (this.debouncedFilter.isLoading() || this.usersResource.isLoading()) return 'Searching...';
    if (this.usersResource.error()) return 'Failed to load users';
    return 'No users found';
  });
  readonly displayValue = computed(() => this.selectedUser()?.label || 'Select a user');

  clear() {
    this.userForm.userId().value.set(null);
    this.userForm.userId().markAsTouched();
    this.selectedUser.set(null);
  }

  onValueChange(ids: number[]) {
    if (ids.length > 0) {
      const id = ids[0];
      this.userForm.userId().value.set(id);
      this.userForm.userId().markAsTouched();
      this.selectedUser.set(this.options().find((option) => option.id === id) ?? this.selectedUser());
      return;
    }
    this.userForm.userId().value.set(null);
    this.userForm.userId().markAsTouched();
    this.selectedUser.set(null);
  }
}`;
