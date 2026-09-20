import { Component, computed, inject, input } from '@angular/core';
import { DXE_CONTEXT } from '../injection-tokens';

@Component({
  selector: 'dxe-dropdown-button',
  template: `
    <span class="btn btn-ghost btn-circle pointer-events-none btn-xs [--size:calc(var(--size-field,0.25rem)*6-4px)]" aria-hidden="true">
      <svg
        [class.rotate-180]="isExpanded()"
        class="size-2 shrink-0 transition-transform duration-200"
        viewBox="0 0 8 8"
        fill="currentColor"
      >
        <path d="M0 2h8L4 6z" />
      </svg>
    </span>
  `,
})
export class DxeDropdownButton {
  private readonly context = inject(DXE_CONTEXT, { optional: true });

  readonly expanded = input<boolean>();

  protected readonly isExpanded = computed(() => this.expanded() ?? this.context?.expanded() ?? false);
}
