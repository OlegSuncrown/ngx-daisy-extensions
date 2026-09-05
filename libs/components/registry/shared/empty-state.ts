import { Component } from '@angular/core';

@Component({
  selector: 'dxe-empty-state',
  template: `<ng-content />`,
  host: {
    class: 'block p-3 text-sm text-base-content/60',
    role: 'status',
    'aria-live': 'polite',
  },
})
export class DxeEmptyState {}
