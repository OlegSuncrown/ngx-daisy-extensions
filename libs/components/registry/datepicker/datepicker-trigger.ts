import { Component, inject } from '@angular/core';
import { DxeStyledTrigger } from '../styles/styled-trigger';
import { DXE_DATEPICKER_CONTEXT } from './datepicker-context';

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
  private readonly context = inject(DXE_DATEPICKER_CONTEXT, { optional: true });

  protected onClick() {
    this.context?.open();
    this.context?.focusInput();
  }
}
