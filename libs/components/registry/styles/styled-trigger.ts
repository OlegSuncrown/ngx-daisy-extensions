import { computed, Directive, inject, input } from '@angular/core';
import { DXE_STYLE_CONTEXT } from './style-context';
import type { DxeColor, DxeSize } from './style-context';

const sizeClasses: Record<DxeSize, string> = {
  xs: 'h-6 text-[0.6875rem]',
  sm: 'h-8 text-xs',
  md: 'h-10 text-sm',
  lg: 'h-12 text-lg',
  xl: 'h-14 text-[1.375rem]',
};

const colorClasses: Record<DxeColor, string> = {
  ghost:
    'shadow-none bg-transparent border-transparent focus:bg-base-100 focus:shadow-none focus:border-transparent focus:outline-base-content',
  primary: 'border-primary focus:border-primary focus:outline-primary',
  secondary: 'border-secondary focus:border-secondary focus:outline-secondary',
  accent: 'border-accent focus:border-accent focus:outline-accent',
  neutral: 'border-neutral focus:border-neutral focus:outline-neutral',
  info: 'border-info focus:border-info focus:outline-info',
  success: 'border-success focus:border-success focus:outline-success',
  warning: 'border-warning focus:border-warning focus:outline-warning',
  error: 'border-error focus:border-error focus:outline-error',
};

@Directive({
  selector: '[dxeStyledTrigger]',
  host: {
    '[class]': 'hostClass()',
  },
})
export class DxeStyledTrigger {
  private readonly context = inject(DXE_STYLE_CONTEXT, { optional: true });

  readonly size = input<DxeSize>();
  readonly color = input<DxeColor>();

  private readonly resolvedSize = computed(() => this.size() ?? this.context?.size() ?? 'md');
  private readonly resolvedColor = computed(() => this.color() ?? this.context?.color());

  protected readonly hostClass = computed(() => {
    const color = this.resolvedColor();
    return [
      'inline-flex relative items-center justify-between select-none cursor-pointer appearance-none',
      'bg-base-100 whitespace-nowrap w-[clamp(3rem,20rem,100%)] shrink gap-2 px-3',
      'border rounded-(--radius-field)',
      'shadow-[0_1px_color-mix(in_oklab,var(--color-base-content)_calc(var(--depth)*2%),transparent)_inset,0_-1px_oklch(100%_0_0/calc(var(--depth)*0.1))_inset]',
      'focus:outline-2 focus:outline-offset-2',
      'disabled:cursor-not-allowed disabled:border-base-200 disabled:bg-base-200 disabled:shadow-none disabled:text-base-content/40',
      sizeClasses[this.resolvedSize()],
      color ? colorClasses[color] : 'border-base-content/20 focus:border-base-content focus:outline-base-content',
    ].join(' ');
  });
}
