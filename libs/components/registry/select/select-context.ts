import { InjectionToken } from '@angular/core';

export interface DxeSelectContext {
  close(): void;
}

export const DXE_SELECT_CONTEXT = new InjectionToken<DxeSelectContext>('DXE_SELECT_CONTEXT');
