import { httpResource } from '@angular/common/http';
import { Component, computed, debounced, signal } from '@angular/core';
import { DxeComboboxImports } from '@dxe/combobox';
import { DxeSelectionIndicator } from '@dxe/shared';

export interface UserOption {
  id: number;
  label: string;
  email: string;
  image: string;
}

interface DummyUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

interface DummyUsersResponse {
  users: DummyUser[];
}

@Component({
  selector: 'app-async-combobox',
  imports: [DxeComboboxImports, DxeSelectionIndicator],
  templateUrl: './async-combobox.html',
  host: {
    class: 'block',
  },
})
export class AsyncCombobox {
  readonly value = signal<number | null>(null);
  readonly selectedUser = signal<UserOption | null>(null);
  readonly filter = signal('');

  private readonly debouncedFilter = debounced(() => this.filter(), 300);

  private readonly search = computed(() => {
    const value = this.debouncedFilter.hasValue() ? this.debouncedFilter.value() : '';
    return value.trim();
  });

  readonly usersResource = httpResource<DummyUsersResponse>(() => {
    const search = this.search();
    if (search.length === 0) {
      return undefined;
    }
    return `https://dummyjson.com/users/search?q=${encodeURIComponent(search)}`;
  });

  readonly options = computed((): UserOption[] => {
    if (!this.search() || !this.usersResource.hasValue()) {
      return [];
    }
    return this.usersResource.value().users.map((user) => ({
      id: user.id,
      label: `${user.firstName} ${user.lastName}`,
      email: user.email,
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

  readonly isLoading = computed(() => this.debouncedFilter.isLoading() || this.usersResource.isLoading());

  readonly showEmpty = computed(() => this.options().length === 0);

  readonly emptyText = computed(() => {
    if (this.search().length === 0) {
      return 'Type to search users';
    }
    if (this.isLoading()) {
      return 'Searching...';
    }
    if (this.usersResource.error()) {
      return 'Failed to load users';
    }
    return 'No users found';
  });

  readonly displayValue = computed(() => this.selectedUser()?.label || 'Select a user');

  onValueChange(ids: number[]) {
    if (ids.length > 0) {
      const id = ids[0];
      const user = this.options().find((option) => option.id === id) ?? this.selectedUser();

      this.value.set(id);
      this.selectedUser.set(user);
      return;
    }

    const id = this.value();
    if (id !== null && this.options().some((option) => option.id === id)) {
      this.value.set(null);
      this.selectedUser.set(null);
    }
  }
}
