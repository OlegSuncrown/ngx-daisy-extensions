import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[dxeDatepickerPortal]',
})
export class DxeDatepickerPortal {
  readonly templateRef = inject(TemplateRef);
}
