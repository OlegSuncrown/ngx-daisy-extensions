import { Option } from '@angular/aria/listbox';
import { computed, Directive, inject, input } from '@angular/core';
import { DXE_STYLE_CONTEXT } from './style-context';
import type { DxeColor, DxeSize } from './style-context';

const sizeClasses: Record<DxeSize, string> = {
  xs: 'min-h-5 px-1.5 text-[0.6875rem]',
  sm: 'min-h-6 px-2 text-xs',
  md: 'min-h-8 px-2.5 text-sm',
  lg: 'min-h-10 px-3 text-base',
  xl: 'min-h-12 px-3.5 text-lg',
};

const hoverClasses: Record<DxeColor, string> = {
  ghost: 'hover:bg-base-content/7',
  primary: 'hover:bg-primary/7',
  secondary: 'hover:bg-secondary/7',
  accent: 'hover:bg-accent/7',
  neutral: 'hover:bg-neutral/7',
  info: 'hover:bg-info/7',
  success: 'hover:bg-success/7',
  warning: 'hover:bg-warning/7',
  error: 'hover:bg-error/7',
};

const activeClasses: Record<DxeColor, string> = {
  ghost: 'bg-base-content/8 outline-2 -outline-offset-2 outline-base-content/12',
  primary: 'bg-primary/8 outline-2 -outline-offset-2 outline-primary/20',
  secondary: 'bg-secondary/8 outline-2 -outline-offset-2 outline-secondary/20',
  accent: 'bg-accent/8 outline-2 -outline-offset-2 outline-accent/20',
  neutral: 'bg-neutral/8 outline-2 -outline-offset-2 outline-neutral/20',
  info: 'bg-info/8 outline-2 -outline-offset-2 outline-info/20',
  success: 'bg-success/8 outline-2 -outline-offset-2 outline-success/20',
  warning: 'bg-warning/8 outline-2 -outline-offset-2 outline-warning/20',
  error: 'bg-error/8 outline-2 -outline-offset-2 outline-error/20',
};

const selectedClasses: Record<DxeColor, string> = {
  ghost: 'bg-base-content/10',
  primary: 'bg-primary/10',
  secondary: 'bg-secondary/10',
  accent: 'bg-accent/10',
  neutral: 'bg-neutral/10',
  info: 'bg-info/10',
  success: 'bg-success/10',
  warning: 'bg-warning/10',
  error: 'bg-error/10',
};

const defaultHoverClass = 'hover:bg-base-content/7';
const defaultActiveClass = 'bg-base-content/8 outline-2 -outline-offset-2 outline-base-content/12';
const defaultSelectedClass = 'bg-base-content/10 text-base-content';

@Directive({
  selector: '[dxeStyledOption]',
  host: {
    '[class]': 'hostClass()',
  },
})
export class DxeStyledOption {
  private readonly context = inject(DXE_STYLE_CONTEXT, { optional: true });
  private readonly option = inject(Option);

  readonly size = input<DxeSize>();
  readonly color = input<DxeColor>();

  private readonly resolvedSize = computed(() => this.size() ?? this.context?.size() ?? 'md');
  private readonly resolvedColor = computed(() => this.color() ?? this.context?.color());

  protected readonly hostClass = computed(() => {
    const color = this.resolvedColor();
    return [
      'flex shrink-0 items-center gap-2 min-w-0 overflow-hidden cursor-pointer rounded-(--radius-field)',
      'transition-[background-color] duration-0 hover:duration-50',
      sizeClasses[this.resolvedSize()],
      color ? hoverClasses[color] : defaultHoverClass,
      this.option.active() ? (color ? activeClasses[color] : defaultActiveClass) : null,
      this.option.selected() ? (color ? selectedClasses[color] : defaultSelectedClass) : null,
    ]
      .filter(Boolean)
      .join(' ');
  });
}
