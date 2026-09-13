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
  forwardRef,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import type { DxeColor, DxeSize } from '../shared/model';
import { DXE_SELECT_POSITIONS } from '../shared/select-positions';
import { DXE_STYLE_CONTEXT } from '../styles/style-context';
import { DxeStyledPopup } from '../styles/styled-popup';
import { DXE_DATEPICKER_CONTEXT } from './datepicker-context';
import type { DxeDatepickerContext, DxeDatepickerDayHandle, DxeDatepickerGridHandle } from './datepicker-context';
import { DxeDatepickerInput } from './datepicker-input';
import { DxeDatepickerPortal } from './datepicker-portal';
import { DxeDatepickerTrigger } from './datepicker-trigger';

@Component({
  selector: 'dxe-datepicker-root',
  imports: [OverlayModule, ComboboxPopup, ComboboxWidget, CdkTrapFocus, NgTemplateOutlet, DxeStyledPopup],
  providers: [
    { provide: DXE_STYLE_CONTEXT, useExisting: forwardRef(() => DxeDatepickerRoot) },
    { provide: DXE_DATEPICKER_CONTEXT, useExisting: forwardRef(() => DxeDatepickerRoot) },
  ],
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
          <div class="w-80">
            <div dxeStyledPopup>
              <div
                ngComboboxWidget
                cdkTrapFocus
                [cdkTrapFocusAutoCapture]="false"
                (keydown)="onWidgetKeydown($event)"
              >
                <ng-container [ngTemplateOutlet]="portal()?.templateRef ?? null" [ngTemplateOutletInjector]="'outlet'" />
              </div>
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
export class DxeDatepickerRoot<V = unknown> implements DxeDatepickerContext {
  readonly positions = DXE_SELECT_POSITIONS;
  readonly value = model<V | null>(null);
  readonly size = input<DxeSize>('md');
  readonly color = input<DxeColor>();
  readonly compareWith = input<(a: V, b: V) => boolean>((a, b) => Object.is(a, b));

  readonly commit = output();

  readonly datepickerInput = contentChild(DxeDatepickerInput);
  readonly combobox = contentChild(DxeDatepickerInput, { read: Combobox });
  readonly trigger = contentChild(DxeDatepickerTrigger, { read: ElementRef });
  readonly portal = contentChild(DxeDatepickerPortal);
  readonly overlay = viewChild(CdkConnectedOverlay);
  readonly expanded = computed(() => this.combobox()?.expanded() ?? false);

  readonly focusTarget = signal<V | null>(null);

  private readonly days = new Set<DxeDatepickerDayHandle>();
  private readonly daysVersion = signal(0);
  private gridHandle: DxeDatepickerGridHandle | null = null;

  constructor() {
    effect(() => {
      const combobox = this.combobox();
      if (combobox) {
        untracked(() => combobox.preserveContent.set(true));
      }
    });

    afterRenderEffect(() => {
      this.daysVersion();
      const target = this.focusTarget();
      if (!target) {
        return;
      }

      const compare = this.compareWith();
      const day = [...this.days].find((item) => {
        const value = item.value();
        return value != null && compare(value as V, target);
      });

      if (day) {
        day.focus();
        Promise.resolve().then(() => {
          untracked(() => this.focusTarget.set(null));
        });
      }
    });

    afterRenderEffect(() => {
      this.daysVersion();
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

  focusInput() {
    this.datepickerInput()?.focus();
  }

  focusGrid() {
    setTimeout(() => {
      const gridEl = this.gridHandle?.element;
      if (gridEl) {
        const widget = (gridEl.querySelector('[tabindex="0"] [ngGridCellWidget]') ??
          gridEl.querySelector('[ngGridCellWidget]')) as HTMLElement | null;
        (widget ?? gridEl).focus();
      }
    });
  }

  focusDay(value: V) {
    this.focusTarget.set(value);
  }

  resetFocus() {
    this.gridHandle?.resetFocus();
  }

  select(value: unknown) {
    this.value.set(value as V);
    this.commit.emit();
    this.focusInput();
    this.dismiss();
  }

  isSelected(value: unknown): boolean {
    const current = this.value();
    if (current == null || value == null) {
      return false;
    }

    return this.compareWith()(current, value as V);
  }

  registerDay(day: DxeDatepickerDayHandle) {
    this.days.add(day);
    this.daysVersion.update((version) => version + 1);
  }

  unregisterDay(day: DxeDatepickerDayHandle) {
    this.days.delete(day);
    this.daysVersion.update((version) => version + 1);
  }

  registerGrid(grid: DxeDatepickerGridHandle) {
    this.gridHandle = grid;
  }

  unregisterGrid(grid: DxeDatepickerGridHandle) {
    if (this.gridHandle === grid) {
      this.gridHandle = null;
    }
  }

  protected onWidgetKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.close();
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
