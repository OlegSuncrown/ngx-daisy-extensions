import { GridCellWidget } from '@angular/aria/grid';
import { booleanAttribute, Directive, input, output } from '@angular/core';

@Directive({
  selector: '[dxeDatepickerGridCellWidget]',
  hostDirectives: [
    {
      directive: GridCellWidget,
      inputs: ['disabled', 'focusTarget', 'id', 'tabindex', 'widgetType'],
      outputs: ['activated', 'deactivated'],
    },
  ],
  host: {
    type: 'button',
    class: 'leading-none btn btn-circle btn-sm',
    '[class.btn-primary]': 'selected()',
    '[class.btn-ghost]': '!selected()',
    '[style.background-color]': 'active() && !selected() ? "color-mix(in srgb, currentColor 12%, transparent)" : null',
    '[style.outline]': 'today() ? "2px solid currentColor" : null',
    '[style.outline-offset]': 'today() ? "-2px" : null',
    '[attr.data-day]': 'displayName()',
    '[attr.data-focus-target]': 'focusTargetActive()',
    '[attr.aria-label]': 'ariaLabel() + (selected() ? ", Selected" : "")',
    '(click)': 'selectDate($event)',
    '(keydown.enter)': 'selectDate($event)',
    '(keydown.space)': 'selectDate($event)',
  },
})
export class DxeDatepickerGridCellWidget {
  readonly displayName = input<string | number>('');
  readonly active = input(false, { transform: booleanAttribute });
  readonly selected = input(false, { transform: booleanAttribute });
  readonly today = input(false, { transform: booleanAttribute });
  readonly focusTargetActive = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input('');
  readonly dateSelect = output<MouseEvent | KeyboardEvent>();

  protected selectDate(event: Event) {
    this.dateSelect.emit(event as MouseEvent | KeyboardEvent);
  }
}
