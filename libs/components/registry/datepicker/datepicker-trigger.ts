import { Component, contentChild, inject } from '@angular/core';
import { DXE_CONTEXT } from '../injection-tokens';
import { DxeStyledTrigger } from '../styles/styled-trigger';
import { DxeDatepickerInput } from './datepicker-input';

@Component({
  selector: 'dxe-datepicker-trigger',
  hostDirectives: [DxeStyledTrigger],
  template: `<ng-content />`,
  host: {
    class:
      'cursor-text focus-within:outline-2 focus-within:outline-offset-2 focus-within:border-base-content focus-within:outline-base-content',
    '(click)': 'onClick()',
  },
})
export class DxeDatepickerTrigger {
  private readonly context = inject(DXE_CONTEXT, { optional: true });
  private readonly datepickerInput = contentChild(DxeDatepickerInput);

  protected onClick() {
    this.context?.open();
    this.datepickerInput()?.focus();
  }
}
