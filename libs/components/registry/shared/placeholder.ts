import { Component } from '@angular/core';

@Component({
  selector: 'dxe-placeholder',
  template: `<ng-content />`,
  host: {
    class: 'min-w-0 truncate text-base-content/50',
  },
})
export class DxePlaceholder {}
