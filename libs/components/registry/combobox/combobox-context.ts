import { InjectionToken } from '@angular/core';
import type { DxeStyleContext } from '../styles/style-context';

export interface DxeComboboxContext extends DxeStyleContext {
  close(): void;
}

export const DXE_COMBOBOX_CONTEXT = new InjectionToken<DxeComboboxContext>('DXE_COMBOBOX_CONTEXT');
