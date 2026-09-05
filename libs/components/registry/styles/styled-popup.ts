import { Component } from '@angular/core';

@Component({
  selector: '[dxeStyledPopup]',
  host: {
    class: 'block w-full overflow-hidden z-100 p-2 rounded-(--radius-field) bg-base-100 shadow-lg border border-base-content/10',
    '[style.transform-origin]': `'inherit'`,
    '[style.will-change]': `'transform'`,
  },
  styles: `
    :host {
      animation: dxe-popup-enter 300ms cubic-bezier(0.19, 1, 0.22, 1);
    }

    @keyframes dxe-popup-enter {
      from {
        opacity: 0;
        transform: scale(0.93);
      }
    }
  `,
  template: `<ng-content />`,
})
export class DxeStyledPopup {}
