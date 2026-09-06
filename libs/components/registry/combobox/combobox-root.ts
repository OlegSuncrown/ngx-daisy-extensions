import { NgTemplateOutlet } from '@angular/common';
import { ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox } from '@angular/aria/listbox';
import { CdkConnectedOverlay, OverlayModule } from '@angular/cdk/overlay';
import {
  afterRenderEffect,
  Component,
  computed,
  contentChild,
  forwardRef,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { DxeEmptyState } from '../shared/empty-state';
import type { DxeColor, DxeSize } from '../shared/model';
import { DXE_SELECT_POSITIONS } from '../shared/select-positions';
import { DXE_STYLE_CONTEXT } from '../styles/style-context';
import type { DxeStyleContext } from '../styles/style-context';
import { DxeStyledList } from '../styles/styled-list';
import { DxeStyledPopup } from '../styles/styled-popup';
import { DxeComboboxInput } from './combobox-input';
import { DxeComboboxPortal } from './combobox-portal';
import { DxeComboboxTrigger } from './combobox-trigger';

@Component({
  selector: 'dxe-combobox-root',
  imports: [OverlayModule, ComboboxPopup, ComboboxWidget, Listbox, NgTemplateOutlet, DxeStyledPopup, DxeStyledList],
  providers: [{ provide: DXE_STYLE_CONTEXT, useExisting: forwardRef(() => DxeComboboxRoot) }],
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
          <div dxeStyledPopup>
            <div ngComboboxWidget>
              <div class="flex flex-col">
                <ng-content select="[dxeComboboxInput]" />

                @if (search()?.combobox; as innerCombobox) {
                  <ng-template ngComboboxPopup [combobox]="innerCombobox">
                    @if (emptyState()) {
                      <ng-content select="dxe-empty-state" />
                    } @else {
                      <div
                        dxeStyledList
                        #listbox="ngListbox"
                        ngListbox
                        ngComboboxWidget
                        class="p-1"
                        focusMode="activedescendant"
                        selectionMode="explicit"
                        [tabindex]="-1"
                        [activeDescendant]="listbox.activeDescendant()"
                        [(value)]="selection"
                        [multi]="multi()"
                        [style.max-height]="maxHeight()"
                        (click)="onCommit()"
                        (keydown.enter)="onCommit()"
                        (keydown.space)="onCommit()"
                      >
                        <ng-container [ngTemplateOutlet]="portal()?.templateRef ?? null" [ngTemplateOutletInjector]="'outlet'" />
                      </div>
                    }
                  </ng-template>
                }
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
export class DxeComboboxRoot<V = unknown> implements DxeStyleContext {
  readonly positions = DXE_SELECT_POSITIONS;
  readonly value = model<V[]>([]);
  readonly size = input<DxeSize>('md');
  readonly color = input<DxeColor>();
  readonly multi = input(false);
  readonly maxHeight = input('12rem');
  readonly closeOnSelection = input(true);

  readonly commit = output();

  readonly trigger = contentChild(DxeComboboxTrigger);
  readonly portal = contentChild(DxeComboboxPortal);
  readonly search = contentChild(DxeComboboxInput);
  readonly emptyState = contentChild(DxeEmptyState);
  readonly listbox = viewChild(Listbox);
  readonly overlay = viewChild(CdkConnectedOverlay);
  readonly combobox = computed(() => this.trigger()?.combobox);
  readonly expanded = computed(() => this.combobox()?.expanded() ?? false);
  readonly selection = signal<V[]>([]);

  constructor() {
    let justOpened = true;

    afterRenderEffect(() => {
      if (this.expanded()) {
        untracked(() => {
          setTimeout(() => this.search()?.focus());
        });
      }
    });

    afterRenderEffect(() => {
      if (!this.expanded() || !this.listbox()) {
        return;
      }

      const value = this.value();
      untracked(() => this.selection.set(value));
    });

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
    this.dismiss();
    this.combobox()?.element.focus();
  }

  dismiss() {
    this.combobox()?.expanded.set(false);
    this.search()?.combobox.value.set('');
  }

  toggle() {
    this.combobox()?.expanded.update((expanded) => !expanded);
  }

  protected onCommit() {
    const selected = this.selection();
    if (selected.length === 0) return;

    this.value.set(selected);
    this.commit.emit();
    if (this.closeOnSelection()) {
      this.close();
    }
  }
}
