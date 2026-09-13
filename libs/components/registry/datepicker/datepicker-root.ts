import { NgTemplateOutlet } from '@angular/common';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, OverlayModule } from '@angular/cdk/overlay';
import {
  afterRenderEffect,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  input,
  untracked,
  viewChild,
} from '@angular/core';
import { provideDxeContext, type DxeContext } from '../injection-tokens';
import type { DxeColor, DxeSize } from '../shared/model';
import { DXE_SELECT_POSITIONS } from '../shared/select-positions';
import { DxeStyledPopup } from '../styles/styled-popup';
import { DxeDatepickerInput } from './datepicker-input';
import { DxeDatepickerPortal } from './datepicker-portal';
import { DxeDatepickerTrigger } from './datepicker-trigger';

@Component({
  selector: 'dxe-datepicker-root',
  imports: [OverlayModule, ComboboxPopup, ComboboxWidget, CdkTrapFocus, NgTemplateOutlet, DxeStyledPopup],
  providers: [provideDxeContext(() => DxeDatepickerRoot)],
  template: `
    <ng-content />

    @if (combobox(); as combobox) {
      <ng-template
        #overlay="cdkConnectedOverlay"
        [cdkConnectedOverlay]="{
          origin: trigger() ?? combobox.element,
          usePopover: 'inline',
          matchWidth: false,
          positions,
        }"
        [cdkConnectedOverlayOpen]="expanded()"
        (overlayOutsideClick)="dismiss()"
        (detach)="dismiss()"
      >
        <ng-template ngComboboxPopup [combobox]="combobox" popupType="dialog">
          <div dxeStyledPopup class="w-80!">
            <div ngComboboxWidget cdkTrapFocus [cdkTrapFocusAutoCapture]="false" (keydown)="handleWidgetKeydown($event)">
              <ng-container [ngTemplateOutlet]="portal()?.templateRef ?? null" [ngTemplateOutletInjector]="'outlet'" />
            </div>
          </div>
        </ng-template>
      </ng-template>
    }
  `,
  host: {
    class: 'contents',
  },
})
export class DxeDatepickerRoot implements DxeContext {
  readonly positions = DXE_SELECT_POSITIONS;
  readonly size = input<DxeSize>('md');
  readonly color = input<DxeColor>();

  readonly datepickerInput = contentChild(DxeDatepickerInput);
  readonly combobox = contentChild(DxeDatepickerInput, { read: Combobox });
  readonly trigger = contentChild(DxeDatepickerTrigger, { read: ElementRef });
  readonly portal = contentChild(DxeDatepickerPortal);
  readonly overlay = viewChild(CdkConnectedOverlay);
  readonly expanded = computed(() => this.combobox()?.expanded() ?? false);

  constructor() {
    effect(() => {
      const combobox = this.combobox();
      if (combobox) {
        untracked(() => combobox.preserveContent.set(true));
      }
    });

    afterRenderEffect(() => {
      if (this.expanded()) {
        untracked(() => this.overlay()?.overlayRef.updatePosition());
      }
    });
  }

  open() {
    this.combobox()?.expanded.set(true);
  }

  close() {
    this.dismiss();
    this.focusInput();
  }

  dismiss() {
    this.combobox()?.expanded.set(false);
  }

  toggle() {
    this.combobox()?.expanded.update((expanded) => !expanded);
  }

  focusInput() {
    this.datepickerInput()?.focus();
  }

  protected handleWidgetKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.close();
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
