import { JsonPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, debounced, signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';
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

interface UserForm {
  userId: number | null;
}

@Component({
  selector: 'app-form-combobox',
  imports: [DxeComboboxImports, DxeSelectionIndicator, JsonPipe],
  templateUrl: './form-combobox.html',
  host: {
    class: 'block',
  },
})
export class FormCombobox {
  readonly selectedUser = signal<UserOption | null>(null);
  readonly filter = signal('');

  private readonly model = signal<UserForm>({ userId: null });
  readonly userForm = form(this.model, (schema) => {
    required(schema.userId, { message: 'Select a user' });
  });

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
    const id = this.userForm.userId().value();
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

  readonly formValue = computed(() => this.userForm().value());

  clear() {
    this.userForm.userId().value.set(null);
    this.userForm.userId().markAsTouched();
    this.selectedUser.set(null);
  }

  onValueChange(ids: number[]) {
    if (ids.length > 0) {
      const id = ids[0];
      const user = this.options().find((option) => option.id === id) ?? this.selectedUser();

      this.userForm.userId().value.set(id);
      this.userForm.userId().markAsTouched();
      this.selectedUser.set(user);
      return;
    }

    const id = this.userForm.userId().value();
    if (id !== null && this.options().some((option) => option.id === id)) {
      this.userForm.userId().value.set(null);
      this.userForm.userId().markAsTouched();
      this.selectedUser.set(null);
    }
  }
}
