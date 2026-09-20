import { forwardRef, InjectionToken, type Provider, type Signal, type Type } from '@angular/core';
import type { DxeColor, DxeSize } from '../styles/style-context';

export interface DxeStyleContext {
  readonly size: Signal<DxeSize>;
  readonly color: Signal<DxeColor | undefined>;
}

export interface DxeContext extends DxeStyleContext {
  readonly expanded: Signal<boolean>;
  open(): void;
  close(): void;
  dismiss(): void;
  toggle(): void;
}

export const DXE_CONTEXT = new InjectionToken<DxeContext>('DXE_CONTEXT');

export function provideDxeContext(type: () => Type<unknown>): Provider {
  return { provide: DXE_CONTEXT, useExisting: forwardRef(type) };
}
