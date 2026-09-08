import { InjectionToken } from '@angular/core';
import type { Signal } from '@angular/core';

export type DxeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type DxeColor = 'ghost' | 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error';

export interface DxeStyleContext {
  readonly size: Signal<DxeSize>;
  readonly color: Signal<DxeColor | undefined>;
}

export const DXE_STYLE_CONTEXT = new InjectionToken<DxeStyleContext>('DXE_STYLE_CONTEXT');
