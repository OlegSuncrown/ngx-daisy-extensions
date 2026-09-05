import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[dxeSelectPortal]',
})
export class DxeSelectPortal {
  readonly templateRef = inject(TemplateRef);
}
