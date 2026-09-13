import { Combobox } from '@angular/aria/combobox';
import { Directive, ElementRef, inject } from '@angular/core';
import { DXE_DATEPICKER_CONTEXT } from './datepicker-context';

@Directive({
  selector: 'input[dxeDatepickerInput]',
  hostDirectives: [
    {
      directive: Combobox,
      inputs: ['disabled', 'value'],
      outputs: ['valueChange'],
    },
  ],
  host: {
    class: 'grow min-w-0 bg-transparent outline-none cursor-text select-text',
    '(click)': 'onClick()',
    '(keydown.escape)': 'onEscape()',
  },
})
export class DxeDatepickerInput {
  private readonly context = inject(DXE_DATEPICKER_CONTEXT, { optional: true });
  private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef);

  readonly combobox = inject(Combobox);

  get nativeValue() {
    return this.element.nativeElement.value;
  }

  focus() {
    this.element.nativeElement.focus();
  }

  protected onClick() {
    this.context?.open();
  }

  protected onEscape() {
    this.context?.close();
  }
}
