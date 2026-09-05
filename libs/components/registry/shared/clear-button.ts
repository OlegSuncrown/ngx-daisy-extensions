import { Component, input, output } from '@angular/core';

@Component({
  selector: 'dxe-clear-button',
  template: `
    <button
      type="button"
      class="btn btn-ghost btn-xs btn-circle [--size:calc(var(--size-field,0.25rem)*6-4px)]"
      [attr.aria-label]="label()"
      (click)="onClick($event)"
    >
      <svg class="size-3.5 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>
  `,
})
export class DxeClearButton {
  readonly label = input('Clear selection');
  readonly clear = output<MouseEvent>();

  protected onClick(event: MouseEvent) {
    event.stopPropagation();
    this.clear.emit(event);
  }
}
