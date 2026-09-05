import { InjectionToken } from '@angular/core';
import type { Signal } from '@angular/core';
import type { DxeColor, DxeSize } from '../shared/model';

export interface DxeStyleContext {
  readonly size: Signal<DxeSize>;
  readonly color: Signal<DxeColor | undefined>;
}

export const DXE_STYLE_CONTEXT = new InjectionToken<DxeStyleContext>('DXE_STYLE_CONTEXT');
