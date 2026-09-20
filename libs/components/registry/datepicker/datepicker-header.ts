import { Component, output } from '@angular/core';

@Component({
  selector: 'dxe-datepicker-header',
  template: `
    <button type="button" class="btn btn-ghost btn-sm btn-circle" aria-label="Previous Month" (click)="previous.emit()">
      <svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M10 3 5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <ng-content />
    <button type="button" class="btn btn-ghost btn-sm btn-circle" aria-label="Next Month" (click)="next.emit()">
      <svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  `,
  host: {
    class: 'flex items-center justify-between border-b border-base-content/10 pb-3 mb-3',
  },
})
export class DxeDatepickerHeader {
  readonly previous = output();
  readonly next = output();
}
