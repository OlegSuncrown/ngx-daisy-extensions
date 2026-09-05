import { Combobox } from '@angular/aria/combobox';
import { Directive, ElementRef, inject } from '@angular/core';
import { DxeComboboxRoot } from './combobox-root';

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
    class: 'input input-sm mb-2',
    '(keydown.escape)': 'onEscape()',
  },
})
export class DxeComboboxInput {
  private readonly root = inject(DxeComboboxRoot, { optional: true });
  private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef);

  readonly combobox = inject(Combobox);

  focus() {
    this.element.nativeElement.focus();
  }

  protected onEscape() {
    this.root?.close();
  }
}
