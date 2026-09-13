import { NgTemplateOutlet } from '@angular/common';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox } from '@angular/aria/listbox';
import { CdkConnectedOverlay, OverlayModule } from '@angular/cdk/overlay';
import {
  afterRenderEffect,
  Component,
  computed,
  contentChild,
  input,
  model,
  output,
  untracked,
  viewChild,
} from '@angular/core';
import { provideDxeContext, type DxeContext } from '../injection-tokens';
import type { DxeColor, DxeSize } from '../shared/model';
import { DXE_SELECT_POSITIONS } from '../shared/select-positions';
import { DxeStyledList } from '../styles/styled-list';
import { DxeStyledPopup } from '../styles/styled-popup';
import { DxeSelectPortal } from './select-portal';

@Component({
  selector: 'dxe-select-root',
  imports: [OverlayModule, ComboboxPopup, ComboboxWidget, Listbox, NgTemplateOutlet, DxeStyledPopup, DxeStyledList],
  providers: [provideDxeContext(() => DxeSelectRoot)],
  template: `
    <ng-content />

    @if (combobox(); as combobox) {
      <ng-template
        #overlay="cdkConnectedOverlay"
        [cdkConnectedOverlay]="{
          origin: combobox.element,
          usePopover: 'inline',
          matchWidth: true,
          positions,
        }"
        [cdkConnectedOverlayOpen]="expanded()"
        (overlayOutsideClick)="dismiss()"
        (detach)="dismiss()"
      >
        <ng-template ngComboboxPopup [combobox]="combobox">
          <div dxeStyledPopup [style.max-height]="maxHeight()">
            <div
              dxeStyledList
              #listbox="ngListbox"
              ngListbox
              ngComboboxWidget
              [tabindex]="-1"
              focusMode="activedescendant"
              selectionMode="explicit"
              [(value)]="value"
              [multi]="multi()"
              [activeDescendant]="listbox.activeDescendant()"
              (click)="onCommit()"
              (keydown.enter)="onCommit()"
              (keydown.space)="onCommit()"
            >
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
export class DxeSelectRoot<V = unknown> implements DxeContext {
  readonly positions = DXE_SELECT_POSITIONS;
  readonly value = model<V[]>([]);
  readonly size = input<DxeSize>('md');
  readonly color = input<DxeColor>();
  readonly multi = input(false);
  readonly maxHeight = input('12rem');
  readonly closeOnSelection = input(true);

  readonly commit = output();

  readonly combobox = contentChild(Combobox);
  readonly portal = contentChild(DxeSelectPortal);
  readonly listbox = viewChild(Listbox);
  readonly overlay = viewChild(CdkConnectedOverlay);
  readonly expanded = computed(() => this.combobox()?.expanded() ?? false);

  constructor() {
    let justOpened = true;

    afterRenderEffect(() => {
      const listbox = this.listbox();
      if (!listbox) {
        justOpened = true;
        return;
      }

      if (!listbox.activeDescendant()) return;

      const block = justOpened && this.multi() ? 'start' : 'nearest';
      justOpened = false;
      untracked(() => {
        listbox.scrollActiveItemIntoView({ block });
        this.overlay()?.overlayRef.updatePosition();
      });
    });
  }

  open() {
    this.combobox()?.expanded.set(true);
  }

  close() {
    this.combobox()?.expanded.set(false);
  }

  dismiss() {
    this.combobox()?.expanded.set(false);
  }

  toggle() {
    this.combobox()?.expanded.update((expanded) => !expanded);
  }

  protected onCommit() {
    this.commit.emit();
    if (this.closeOnSelection()) {
      this.close();
    }
  }
}
