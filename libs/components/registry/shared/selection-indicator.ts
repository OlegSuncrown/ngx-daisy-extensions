import { Component, computed, inject } from '@angular/core';
import { DXE_STYLE_CONTEXT } from '../styles/style-context';
import type { DxeColor, DxeSize } from './model';

const checkIconClasses: Record<DxeSize, string> = {
  xs: 'size-3',
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
  xl: 'size-6',
};

const checkIconColorClasses: Record<DxeColor, string> = {
  ghost: 'text-base-content',
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  neutral: 'text-neutral',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
};

@Component({
  selector: 'dxe-selection-indicator',
  template: `
    <svg [class]="checkIconClass()" class="ml-auto shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,
})
export class DxeSelectionIndicator {
  private readonly context = inject(DXE_STYLE_CONTEXT, { optional: true });

  protected readonly checkIconClass = computed(() => {
    const color = this.context?.color();
    return [checkIconClasses[this.context?.size() ?? 'md'], color ? checkIconColorClasses[color] : null].filter(Boolean).join(' ');
  });
}
