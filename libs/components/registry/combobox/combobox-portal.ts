import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[dxeComboboxPortal]',
})
export class DxeComboboxPortal {
  readonly templateRef = inject(TemplateRef);
}
