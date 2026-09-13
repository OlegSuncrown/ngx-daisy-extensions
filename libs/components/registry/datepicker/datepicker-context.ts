import { InjectionToken } from '@angular/core';
import type { DxeStyleContext } from '../styles/style-context';

export interface DxeDatepickerDayHandle {
  value(): unknown;
  focus(): void;
}

export interface DxeDatepickerGridHandle {
  readonly element: HTMLElement;
  resetFocus(): void;
}

export interface DxeDatepickerContext extends DxeStyleContext {
  close(): void;
  open(): void;
  focusInput(): void;
  focusGrid(): void;
  select(value: unknown): void;
  isSelected(value: unknown): boolean;
  registerDay(day: DxeDatepickerDayHandle): void;
  unregisterDay(day: DxeDatepickerDayHandle): void;
  registerGrid(grid: DxeDatepickerGridHandle): void;
  unregisterGrid(grid: DxeDatepickerGridHandle): void;
}

export const DXE_DATEPICKER_CONTEXT = new InjectionToken<DxeDatepickerContext>('DXE_DATEPICKER_CONTEXT');
