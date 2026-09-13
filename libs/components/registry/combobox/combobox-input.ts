import { Combobox } from '@angular/aria/combobox';
import { Directive, ElementRef, inject } from '@angular/core';
import { DXE_CONTEXT } from '../injection-tokens';

@Directive({
  selector: 'input[dxeComboboxInput]',
  hostDirectives: [
    {
      directive: Combobox,
      inputs: ['alwaysExpanded', 'disabled', 'value'],
      outputs: ['valueChange'],
    },
  ],
  host: {
    class: 'input input-sm mb-2 focus:outline-none',
    '(keydown.escape)': 'onEscape()',
  },
})
export class DxeComboboxInput {
  private readonly context = inject(DXE_CONTEXT, { optional: true });
  private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef);

  readonly combobox = inject(Combobox);

  focus() {
    this.element.nativeElement.focus();
  }

  protected onEscape() {
    this.context?.close();
  }
}
