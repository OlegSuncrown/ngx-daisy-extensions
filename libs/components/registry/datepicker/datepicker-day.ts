import { GridCell, GridCellWidget } from '@angular/aria/grid';
import { booleanAttribute, Component, computed, inject, input, OnDestroy, OnInit, viewChild } from '@angular/core';
import { DXE_DATEPICKER_CONTEXT } from './datepicker-context';
import type { DxeDatepickerDayHandle } from './datepicker-context';

@Component({
  selector: 'dxe-datepicker-day',
  imports: [GridCellWidget],
  hostDirectives: [
    {
      directive: GridCell,
      inputs: ['disabled'],
    },
  ],
  template: `
    @if (disabled()) {
      <ng-content />
    } @else {
      <button
        ngGridCellWidget
        type="button"
        class="btn btn-circle btn-sm leading-none"
        [class.btn-primary]="selected()"
        [class.btn-ghost]="!selected()"
        [class.btn-outline]="today() && !selected()"
        [attr.aria-label]="label() + (selected() ? ', Selected' : '')"
        (click)="onSelect($event)"
        (keydown.enter)="onSelect($event)"
        (keydown.space)="onSelect($event)"
      >
        <ng-content />
      </button>
    }
  `,
  host: {
    class: 'flex items-center justify-center h-10',
    '[class.text-sm]': 'disabled()',
    '[class.text-base-content/30]': 'disabled()',
    '[attr.aria-hidden]': 'disabled() ? "true" : null',
    '[attr.tabindex]': 'disabled() ? -1 : null',
    '[attr.aria-selected]': 'disabled() ? null : selected()',
  },
})
export class DxeDatepickerDay<V = unknown> implements OnInit, OnDestroy, DxeDatepickerDayHandle {
  private readonly context = inject(DXE_DATEPICKER_CONTEXT);
  private readonly widget = viewChild(GridCellWidget);

  readonly value = input<V>();
  readonly label = input<string>('');
  readonly today = input(false);
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly selected = computed(() => {
    const value = this.value();
    return value != null && this.context.isSelected(value);
  });

  ngOnInit() {
    this.context.registerDay(this);
  }

  ngOnDestroy() {
    this.context.unregisterDay(this);
  }

  focus() {
    this.widget()?.element.focus();
  }

  protected onSelect(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const value = this.value();
    if (value != null) {
      this.context.select(value);
    }
  }
}
