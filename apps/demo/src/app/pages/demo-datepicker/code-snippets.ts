export const SIMPLE_DATEPICKER_HTML = `<dxe-datepicker-root #picker>
  <dxe-datepicker-trigger>
    <svg class="size-4 opacity-60 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" stroke-width="1.5" />
      <path d="M2 6.5h12M5 2v2.5M11 2v2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
    <input
      type="text"
      dxeDatepickerInput
      placeholder="Pick a date..."
      [value]="inputValue()"
      (valueChange)="onValueChange($event)"
      aria-describedby="date-format-hint"
      (keydown)="onInputKeydown($event)"
    />
  </dxe-datepicker-trigger>

  <ng-container *dxeDatepickerPortal>
    <dxe-datepicker-header (previous)="prevMonth()" (next)="nextMonth()">
      <div aria-live="polite" class="sr-only">{{ activeMonthAnnouncement() }}</div>
      <div class="font-semibold text-sm">{{ monthYearLabel() }}</div>
    </dxe-datepicker-header>

    <table
      #gridTable
      tabindex="-1"
      dxeDatepickerGrid
      colWrap="continuous"
      rowWrap="nowrap"
      [enableSelection]="true"
      selectionMode="explicit"
      (gridKeydown)="onGridKeydown($event)"
    >
      <thead>
        <tr>
          @for (day of weekdays(); track day.long) {
            <th dxeDatepickerGridColumnHeader [attr.abbr]="day.long">
              {{ day.narrow }}
            </th>
          }
        </tr>
      </thead>
      <tbody>
        @for (week of weeks(); track $index) {
          <tr ngGridRow>
            @if ($first) {
              @for (day of daysFromPrevMonth(); track $index) {
                <td
                  dxeDatepickerGridCell
                  [disabled]="true"
                  aria-hidden="true"
                  [tabindex]="-1"
                >
                  {{ day }}
                </td>
              }
            }
            @for (day of week; track $index) {
              <td dxeDatepickerGridCell [selected]="isFocusDate(day.date)">
                <button
                  dxeDatepickerGridCellWidget
                  [displayName]="day.dayOfMonth"
                  [active]="isActive(day.date)"
                  [selected]="isSelected(day.date)"
                  [today]="isToday(day.date)"
                  [focusTargetActive]="isFocusTarget(day.date)"
                  [ariaLabel]="day.ariaLabel"
                  (dateSelect)="selectDate(day, $event)"
                >
                  {{ day.displayName }}
                </button>
              </td>
            }
            @if ($last && week.length < 7) {
              @for (day of daysInNextMonth(); track $index) {
                <td
                  dxeDatepickerGridCell
                  [disabled]="true"
                  aria-hidden="true"
                  [tabindex]="-1"
                >
                  {{ day }}
                </td>
              }
            }
          </tr>
        }
      </tbody>
    </table>
  </ng-container>
</dxe-datepicker-root>
<span id="date-format-hint" class="label">Format follows the current locale</span>`;

export const SIMPLE_DATEPICKER_TS = `import { Component, effect, inject, signal, untracked, viewChild, viewChildren } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DxeDatepickerImports, DxeDatepickerInput, DxeDatepickerRoot, DxeDatepickerService } from 'ngx-daisy-extensions';

@Component({
  selector: 'app-simple-datepicker',
  imports: [DxeDatepickerImports],
  providers: [provideNativeDateAdapter(), DxeDatepickerService],
  templateUrl: './simple-datepicker.html',
})
export class SimpleDatepicker {
  readonly datepickerService = inject(DxeDatepickerService);

  readonly picker = viewChild.required<DxeDatepickerRoot>(DxeDatepickerRoot);
  readonly datepickerInput = viewChild.required(DxeDatepickerInput);
  readonly selectedDate = signal<Date | null>(null);
  readonly inputValue = signal('');
  readonly viewMonth = this.datepickerService.viewMonth;
  readonly activeDate = signal(this.datepickerService.today());

  readonly monthYearLabel = this.datepickerService.monthYearLabel;
  readonly activeMonthAnnouncement = this.datepickerService.activeMonthAnnouncement;

  // Keep input, active-date, and committed selection state in the component.
  // Delegate calendar math, today checks, and month navigation to DxeDatepickerService.
  // On open, reset the visible month to the selected date or today.
  // Style today separately from selected dates.
}`;
