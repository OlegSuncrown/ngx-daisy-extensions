import { httpResource } from '@angular/common/http';
import { Component, computed, debounced, input, linkedSignal, model, output, signal } from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { DxeComboboxImports, DxeSelectionIndicator } from 'ngx-daisy-extensions';

export interface SelectedUser {
  userId: number;
  userName: string;
}

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

function toUserOption(user: DummyUser): UserOption {
  return {
    id: user.id,
    label: `${user.firstName} ${user.lastName}`,
    email: user.email,
    image: user.image,
  };
}

@Component({
  selector: 'app-user-selection',
  imports: [DxeComboboxImports, DxeSelectionIndicator],
  templateUrl: './user-selection.html',
  host: {
    class: 'block',
  },
})
export class UserSelection implements FormValueControl<SelectedUser | null> {
  readonly value = model.required<SelectedUser | null>();
  readonly touched = input(false);
  readonly invalid = input(false);
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly disabled = input(false);
  readonly touch = output<void>();

  readonly selectedOption = linkedSignal(() => {
    const user = this.value();
    return user ? [user.userId] : [];
  });
  readonly searchString = signal('');

  private readonly debouncedSearch = debounced(() => this.searchString(), 300);

  private readonly search = computed(() => {
    const value = this.debouncedSearch.hasValue() ? this.debouncedSearch.value() : '';
    return value.trim();
  });

  private readonly usersResource = httpResource<DummyUsersResponse>(() => {
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
    return this.usersResource.value().users.map(toUserOption);
  });

  readonly isLoading = computed(() => this.debouncedSearch.isLoading() || this.usersResource.isLoading());

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

  onCommit() {
    const id = this.selectedOption()[0];
    const user = this.options().find((item) => item.id === id);
    if (user) {
      this.value.set({ userId: user.id, userName: user.label });
    }

    this.touch.emit();
  }

  clear() {
    if (this.disabled()) {
      return;
    }
    this.value.set(null);
    this.touch.emit();
  }
}
